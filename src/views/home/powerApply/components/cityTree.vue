<template>
    <div class="tree-panel">
        <div class="tree-header">
            <div class="title">城市权限勾选</div>
            <el-button type="text" class="collapse-btn" @click="isShow = !isShow">
                {{ isShow ? '收起' : '展开' }}&nbsp;
                <i :class="isShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </el-button>
        </div>

        <el-collapse-transition>
            <div v-show="isShow">
                <el-row :gutter="16">
                    <el-col :span="12">
                        <div class="tree-tips-header">
                            <div class="dot"></div>
                            <div class="text">城市权限选择</div>

                            <div class="tab-btn tab-btn-1" :class="tabActive === 1 ? 'tab-btn-active' : ''" @click="onChangeTab(1)">全国</div>
                            <div class="tab-btn tab-btn-2" :class="tabActive === 2 ? 'tab-btn-active' : ''" @click="onChangeTab(2)">部分区域</div>
                        </div>
                        <!-- 树 -->
                        <div class="tree-body" v-show="tabActive === 2" style="overflow: hidden">
                            <el-input prefix-icon="el-icon-search" @input="seacrchChange" placeholder="请输入省份或城市名称" v-model.trim="filterText" style="margin-bottom: 20px"></el-input>

                            <!-- 全国，就显示空的 -->
                            <el-tree
                                v-loading="treeLoading"
                                ref="tree"
                                :data="treeData"
                                show-checkbox
                                :default-checked-keys="defaultExpandedKeys"
                                node-key="code"
                                :props="defaultProps"
                                :filter-node-method="filterNode"
                                @check="checkFunc"
                                element-loading-custom-class="tree-loading-mask"
                                class="city-tree-body"
                            ></el-tree>
                        </div>
                    </el-col>
                    <!-- 右侧展示结果的 -->
                    <el-col :span="12" v-show="tabActive === 2">
                        <div class="tree-tips-header">
                            <div class="dot"></div>
                            <div class="text">已选城市</div>
                        </div>

                        <div class="tree-body select-data-box" v-show="tabActive === 2">
                            <!-- 右侧已选择的树 -->
                            <!-- 树的数据是全量的左侧数据，是否显示是通过 renderContent控制的 -->
                            <el-tree
                                ref="selectedTree"
                                :data="rightTreeData"
                                show-checkbox
                                node-key="code"
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
        </el-collapse-transition>

        <!-- 注:不要删除 -->
        <span v-show="false">{{ allowSetDetail }}</span>
    </div>
</template>

<script>
// 首页-总部权限申请-城市权限勾选 组件
import { cloneDeep } from 'lodash-es'

export default {
    name: 'cityTree',
    props: {
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
            isShow: true,
            tabActive: 1,

            // 已经选择的数据
            selectTreeData: [],
            // 右侧树的原始数据
            rightTreeData: [],

            treeLoading: true,

            treeData: [],
            defaultExpandedKeys: [],

            defaultProps: {
                children: 'childCityList', // tree 子节点信息
                label: 'name'
            },

            filterText: '',

            // 用来判断是否全选了树节点
            rootTreeIds: [],

            // Tree的数据是否请求完毕
            readyTree: false
        }
    },

    computed: {
        /**
         * 只有Tree的基础数据请求完毕 + 详情接口有数据，才会做数据回显
         */
        allowSetDetail() {
            // 重新提交进来的场景，必定有详情的ID
            const procInsId = this.$route.query.procInsId

            // 不是全国，就手动触发一下Tree的基础数据查询-不然下面的 this.readTree是无法为 true的
            if (!this.list.includes(-99) && procInsId) {
                this.tabActive = 2
                this.getTreeData()
            } else {
                this.tabActive = 1
            }

            if (this.list.length && this.readyTree) {
                setTimeout(() => {
                    this.setDetail()
                }, 500)
                return true
            }

            return false
        }
    },

    created() {
        this.getTreeData()
    },

    methods: {
        onChangeTab(tab) {
            this.tabActive = tab

            // 选择部分区域再请求数据
            if (tab === 2) {
                this.getTreeData()
            }
        },

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
            let checked = this.$refs.tree.getNode(currentNode.code).checked

            // 当前节点未被选中，右侧树做反选操作
            if (!checked) {
                this.$refs.selectedTree.setChecked(currentNode.code, false, true)

                noticeState()
                return
            }

            // 如果选中的所有key(全选+半选)， 都包含根节点的key, 则是全选了树
            const isCheckAll = this.rootTreeIds.every(code => checkedKeys.includes(code))

            if (isCheckAll) {
                this.$message.error('请直接选择全国数据！')
                // 将最后一个设置为不可选
                this.$refs.tree.setChecked(currentNode.code, false, true)
                return
            }

            // 将右侧的数据进行展示
            this.$refs.selectedTree.setChecked(currentNode.code, true, true)

            noticeState()
        },

        /**
         * 已选择区取消选中
         * 去掉左侧右侧的树节点的是勾选
         * 同步选中的节点数据给父组件
         */
        selectedTreeCheckFunc(currentNode) {
            this.$refs.tree.setChecked(currentNode.code, false, true)
            this.$refs.selectedTree.setChecked(currentNode.code, false, true)

            const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
            const checkedKeys = this.$refs.tree.getCheckedKeys()

            this.$emit('update-tree', {
                checkedKeys,
                halfCheckedKeys,
                all: checkedKeys
            })
        },

        /**
         * 获取树的数据
         */
        async getTreeData() {
            // 如果已经请求过数据了，就不再请求
            if (this.treeData.length) return

            let param = {
                op: 'getCityTreeByDrop',
                data: ''
            }

            try {
                let res = await this.$axios('/authority/role/select', param)
                this.treeData = JSON.parse(res.data) || []

                this.rootTreeIds = this.treeData.map(p => p.code)

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

            // 全国
            if (this.tabActive === 1) {
                return {
                    checkedKeys: [],
                    halfCheckedKeys: [],
                    all: [-99]
                }
            } else {
                return {
                    checkedKeys,
                    halfCheckedKeys,
                    all: checkedKeys
                }
            }
        },

        // 搜索内容
        seacrchChange: $vuex.$baseMethod.debounce(function () {
            this.$refs.tree.filter(this.filterText)
        }, 500),

        setDetail() {
            // 全国 - 什么都不处理
            if (this.list.includes(-99)) return

            let initCheckedKeys = this.$refs['tree'].getCheckedKeys()

            // 用户已经勾选过，不需要用详情数据回填回去
            if (initCheckedKeys.length) return

            this.$refs['tree'].setCheckedKeys(this.list)

            // 右侧已选择内容回填 - 这里后台不能返回带parentId ，只能返回叶子节点，否则会无法显示
            this.$refs.selectedTree.setCheckedKeys(this.list, true)

            const { checkedKeys, halfCheckedKeys } = this.getTreeNodes()
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

.city-tree-body {
    height: 460px;
    overflow: auto;
}
</style>
