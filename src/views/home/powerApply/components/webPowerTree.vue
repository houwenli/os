<template>
    <div class="tree-panel">
        <el-row :gutter="16">
            <el-col :span="12">
                <div class="tree-tips-header">
                    <div class="dot"></div>
                    <div class="text">功能权限勾选</div>
                </div>
                <!-- 树 -->
                <div class="tree-body">
                    <el-input prefix-icon="el-icon-search" @input="seacrchChange" placeholder="请搜索系统功能" v-model.trim="filterText" style="margin-bottom: 20px" />

                    <el-checkbox class="checkboxAll" v-model="isCheckAll" @change="onCheckAll" :disabled="!disabledCheckAll">全选</el-checkbox>

                    <el-tree
                        v-loading="treeLoading"
                        ref="tree"
                        :data="treeData"
                        show-checkbox
                        :default-checked-keys="defaultExpandedKeys"
                        node-key="id"
                        :props="defaultProps"
                        :filter-node-method="filterNode"
                        @check="checkFunc"
                        element-loading-custom-class="tree-loading-mask"
                    />
                </div>
            </el-col>
            <!-- 右侧展示结果的 -->
            <el-col :span="12">
                <div class="tree-tips-header">
                    <div class="dot"></div>
                    <div class="text">已选择</div>
                </div>

                <div class="tree-body select-data-box">
                    <!-- 右侧已选择的树 -->
                    <!-- 树的数据是全量的左侧数据，是否显示是通过 renderContent控制的 -->
                    <el-tree
                        ref="selectedTree"
                        :data="rightTreeData"
                        show-checkbox
                        node-key="id"
                        :props="defaultProps"
                        @check="selectedTreeCheckFunc"
                        :renderContent="renderContent"
                        empty-text="暂无已选择"
                        style="background: #f5f7fa"
                    ></el-tree>
                </div>
            </el-col>
        </el-row>

        <!-- 注:不要删除 -->
        <span v-show='false'>{{allowSetDetail}}</span>
    </div>
</template>

<script>
// 首页-总部权限申请-web端oa总部 组件
import { cloneDeep } from 'lodash-es'

export default {
    name: 'webPowerTree',
    props: {
        // 当前tab切换到哪一个
        type: String,

        /**
         * 详情数据回显
         */
        list: {
          type: Array,
          default: () => []
        }
    },
    data() {
        return {
            // 已经选择的数据
            selectTreeData: [],
            // 右侧树的原始数据
            rightTreeData: [],

            treeLoading: false,

            treeData: [],
            defaultExpandedKeys: [],

            defaultProps: {
                children: 'children', // tree 子节点信息
                label: 'name' // tree节点显示信息
            },

            // 用来判断是否全选了树节点
            rootTreeIds: [],

            filterText: '',

            isCheckAll: false,

            // Tree的数据是否请求完毕
            readyTree: false
        }
    },
    watch: {
        type(val) {
            if (val === 'web') {
                // 请求失败过，且没有树的数据，重新请求
                if (!this.treeLoading && this.treeData.length === 0) {
                    this.getTreeData()
                }
            }
        }
    },
    computed: {
        disabledCheckAll() {
            return !this.treeLoading && this.treeData.length !== 0
        },

        /**
         * 只有Tree的基础数据请求完毕 + 详情接口有数据，才会做数据回显
         */
        allowSetDetail() {
          if (this.list.length && this.readyTree) {
            setTimeout(() => {
              this.setDetail()
            }, 500);
            return true
          }

          return false
        }
    },

    mounted() {
        this.getTreeData()
    },
    methods: {
        // 搜索
        filterNode(value, data) {
            if (!value) return true
            return data[this.defaultProps.label].indexOf(value) !== -1
        },

        /**
         * 节点选中
         */
        checkFunc(currentNode, allCheck) {
            // checkedKeys 全选的key， 不包含半选的
            let { checkedKeys, halfCheckedKeys } = allCheck

            /**
             * 更新节点数据给父组件
             */
            const noticeState = () => {
                this.$emit('update-tree', {
                    // 全选的key
                    checkedKeys,
                    // 半选的key
                    halfCheckedKeys,
                    all: [...checkedKeys, ...halfCheckedKeys]
                })
            }

            // 判断当前节点的状态
            let checked = this.$refs.tree.getNode(currentNode.id).checked

            // 处理全选checkBox逻辑
            this.isCheckAll = this.rootTreeIds.every(key => checkedKeys.includes(key))

            // 当前节点未被选中，右侧树做反选操作
            if (!checked) {
                this.$refs.selectedTree.setChecked(currentNode.id, false, true)
                noticeState()
                return
            }

            // 将右侧的数据进行展示
            this.$refs.selectedTree.setChecked(currentNode.id, true, true)

            noticeState()
        },

        /**
         * 已选择区取消选中
         * 去掉左侧右侧的树节点的是勾选
         * 同步选中的节点数据给父组件
         */
        selectedTreeCheckFunc(currentNode) {
            this.$refs.tree.setChecked(currentNode.id, false, true)
            this.$refs.selectedTree.setChecked(currentNode.id, false, true)

            const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
            const checkedKeys = this.$refs.tree.getCheckedKeys()

            // 处理全选checkBox逻辑
            this.isCheckAll = this.rootTreeIds.every(key => checkedKeys.includes(key))

            this.$emit('update-tree', {
                checkedKeys,
                halfCheckedKeys,
                all: [...checkedKeys, ...halfCheckedKeys]
            })
        },

        /**
         * 获取树的数据
         */
        async getTreeData() {
            // 如果已经请求过数据了，就不再请求
            if (this.treeData.length) return

            let param = {
                op: 'selectTree',
                data: {
                    clientType: 1
                }
            }

            this.treeLoading = true
            try {
                let res = await this.$axios('/authority/role/select', param)
                this.treeData = JSON.parse(res.data) || []

                this.rootTreeIds = this.treeData.map(p => p.id)

                this.rightTreeData = cloneDeep(this.treeData) || []

                this.readyTree = true
            } catch (error) {
                this.readyTree = false
                console.log(error)
            } finally {
                this.treeLoading = false
            }
        },

        /**
         * 自定义渲染节点
         * 控制节点是否展示
         */
        renderContent(h, { node }) {
            node.visible = node.checked || node.indeterminate
            return (
                <span class="custom-tree-node">
                    <span>{node.label}</span>
                </span>
            )
        },

        /**
         * 获取节点选中的数据
         * ref 提供给父组件使用
         */
        getTreeNodes() {
            const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
            const checkedKeys = this.$refs.tree.getCheckedKeys()

            return {
                checkedKeys,
                halfCheckedKeys,
                all: [...checkedKeys, ...halfCheckedKeys]
            }
        },

        // 搜索内容
        seacrchChange: $vuex.$baseMethod.debounce(function () {
            this.$refs.tree.filter(this.filterText)
        }, 500),

        /**
         * 全选
         */
        onCheckAll(val) {
            let checkedKeys = []
            let halfCheckedKeys = []

            if (val) {
                this.$refs.tree.setCheckedNodes(this.treeData)
                this.$refs.selectedTree.setCheckedNodes(this.treeData)

                let c = this.getTreeNodes()

                checkedKeys = c.checkedKeys
                halfCheckedKeys = c.halfCheckedKeys
            } else {
                this.$refs.tree.setCheckedNodes([])
                this.$refs.selectedTree.setCheckedNodes([])
            }

            this.$emit('update-tree', {
                // 全选的key
                checkedKeys,
                // 半选的key
                halfCheckedKeys,
                all: [...checkedKeys, ...halfCheckedKeys]
            })
        },

        setDetail() {
          let initCheckedKeys = this.$refs['tree'].getCheckedKeys()

          // 用户已经勾选过，不需要用详情数据回填回去
          if (initCheckedKeys.length) return

          this.$refs['tree'].setCheckedKeys(this.list)

          // 右侧已选择内容回填
          this.$refs.selectedTree.setCheckedKeys(this.list, true, true)

          const {checkedKeys, halfCheckedKeys} = this.getTreeNodes()
          let all = [...checkedKeys, ...halfCheckedKeys]

            // 检查是否全选
          this.isCheckAll = this.rootTreeIds.every(key => all.includes(key))

          this.$emit('update-tree', {
            // 全选的key
            checkedKeys,
            // 半选的key
            halfCheckedKeys,
            all
          })
        }
    }
}
</script>

<style lang="scss" scoped>
@import './tree.scss';
</style>
