<template>
    <div class="tree-panel">
        <el-row :gutter="16">
            <el-col :span="12">
                <div class="tree-tips-header">
                    <div class="dot"></div>
                    <div class="text">Web端OA系统功能权限选择</div>
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
                    <div class="text">Web端OA系统已选择</div>
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
    </div>
</template>

<script>
// 首页-分支机构权限申请-Web端OA系统功能权限 组件
import { cloneDeep } from 'lodash-es'

export default {
    name: 'branchWebOATree',
    props: {
        // 功能授权/角色层级
        orgType: [String, Number]
    },
    data() {
        return {
            // 右侧树的原始数据
            rightTreeData: [],

            treeLoading: true,
            // 用来判断是否全选了树节点
            rootTreeIds: [],
            treeData: [],
            defaultExpandedKeys: [],

            defaultProps: {
                children: 'children', // tree 子节点信息
                label: 'name' // tree节点显示信息
            },

            filterText: '',

            // 前端数据缓存
            orgTypeDataMap: {
                20: [],
                30: [],
                40: []
            },

            isCheckAll: false
        }
    },

    watch: {
        orgType() {
            this.getTreeData()
        }
    },

    computed: {
        disabledCheckAll() {
            return !this.treeLoading && this.treeData.length !== 0
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
            const setTreeData = list => {
                this.treeData = list

                this.rootTreeIds = this.treeData.map(p => p.id)
                this.rightTreeData = cloneDeep(list) || []
            }
            // 如果已经请求过数据了，就不再请求
            if (this.orgTypeDataMap[this.orgType].length) {
                this.treeLoading = true

                // 直接用已经存在的数据
                setTreeData(this.orgTypeDataMap[this.orgType])

                this.treeLoading = false
                return
            }

            let param = {
                op: 'selectTree',
                data: {
                    orgType: this.orgType
                }
            }

            this.treeLoading = true
            try {
                let res = await this.$axios('/authority/role/select', param)

                let list = JSON.parse(res.data) || []
                this.orgTypeDataMap[this.orgType] = list

                setTreeData(list)
            } catch (error) {
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
        }
    }
}
</script>

<style lang="scss" scoped>
@import './tree.scss';
</style>
