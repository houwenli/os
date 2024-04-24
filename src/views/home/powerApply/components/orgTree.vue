<template>
    <div class="tree-panel">
        <div class="tree-header">
            <div class="title">机构授权</div>
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
                            <div class="text">机构权限选择</div>

                            <div class="tab-btn tab-btn-1" :class="tabActive === 1 ? 'tab-btn-active' : ''" @click="onChangeTab(1)">全国</div>
                            <div class="tab-btn tab-btn-2" :class="tabActive === 2 ? 'tab-btn-active' : ''" @click="onChangeTab(2)">部分区域</div>
                        </div>
                        <!-- 树 -->
                        <div class="tree-body" v-show="tabActive === 2" style="overflow: hidden">
                            <el-form label-width="80px">
                                <el-form-item label="机构层级：">
                                    <el-row>
                                        <el-col :xl="6" :lg="5" :md="6" :sm="6">
                                            <el-select class="roleSetUp" v-model="hierarchy.orgType">
                                                <el-option v-for="item in orgOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :xl="14" :lg="13" :md="11" :sm="10" style="margin-left: 8px">
                                            <el-input prefix-icon="el-icon-search" clearable v-model="hierarchy.search" :placeholder="queryPla"></el-input>
                                        </el-col>
                                        <el-col :xl="3" :lg="4" :md="5" :sm="6">
                                            <el-button style="margin-left: 16px; width: 96px" type="primary" :loading="treeLoading" @click="queryOrg">查询</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </el-form>
                            <!--
                      注意，这里默认选中不能用 default-checked-keys = defaultExpandedKeys 因为有懒加载的场景，Tree组件内部计算是有bug
                      如果一个父节点A下面有   3个子节点 a-1  a-2 a-3 , 详情接口回显，正常应该回显 a-1  a-2 勾选， 但是default-checked-keys = defaultExpandedKeys  实现，会导致a-3也被勾选
                      @link https://blog.csdn.net/qq_25757181/article/details/123707968
                    -->
                            <el-tree
                                v-loading="treeLoading"
                                ref="tree"
                                :data="treeData"
                                :node-key="nodeKey"
                                :props="defaultProps"
                                :expand-on-click-node="true"
                                :load="loadNode"
                                lazy
                                show-checkbox
                                :accordion="true"
                                :filter-node-method="filterNode"
                                @check="checkFunc"
                                class="org-tree-body"
                                :default-expanded-keys="defaultExpandedKeys"
                            ></el-tree>
                        </div>
                    </el-col>
                    <!-- 右侧展示结果的 -->
                    <el-col :span="12" v-show="tabActive === 2">
                        <div class="tree-tips-header">
                            <div class="dot"></div>
                            <div class="text">已选机构</div>
                        </div>

                        <div class="tree-body select-data-box" v-show="tabActive === 2">
                            <!-- 右侧已选择的树 -->
                            <!-- 树的数据是全量的左侧数据，是否显示是通过 renderContent控制的 -->
                            <el-tree
                                ref="selectedTree"
                                :data="rightTreeData"
                                show-checkbox
                                :node-key="nodeKey"
                                :props="defaultProps"
                                @check="selectedTreeCheckFunc"
                                :renderContent="renderContent"
                                empty-text="暂无已选择"
                                style="background: #f5f7fa"
                                :accordion="true"
                                :expand-on-click-node="false"
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
// 首页-总部权限申请-机构授权勾选 组件
export default {
    name: 'orgTree',

    props: {
        /**
         * 详情数据回显
         */
        detailData: {
            type: Object,
            default: () => {}
        }
    },

    data() {
        return {
            isShow: true,
            tabActive: 1,

            // 右侧树的原始数据
            rightTreeData: [],

            treeLoading: false,

            treeData: [],
            defaultExpandedKeys: [],

            defaultProps: {
                children: 'children',
                label: 'name',
                isLeaf: 'isLeaf',
                disabled: 'disabled'
            },

            // 用来判断是否全选了树节点
            rootTreeIds: [],

            hierarchy: {
                orgType: '20', // 层级
                search: '' // val
            },

            orgOption: [
                // { value: '0', label: '省区' },
                { value: '20', label: '一级机构' },
                { value: '30', label: '二级机构' },
                { value: '40', label: '实体店' }
            ],

            nodeKey: 'id',

            // Tree的数据是否请求完毕
            readyTree: false
        }
    },

    computed: {
        queryPla() {
            switch (this.hierarchy.orgType) {
                case '20':
                    return '请输入分公司名称精准查询'
                case '30':
                    return '请输入服务中心名称精准查询'
                case '40':
                    return '请输入实体店名称精准查询'
            }
        },

        /**
         * 只有Tree的基础数据请求完毕 + 详情接口有数据，才会做数据回显
         */
        allowSetDetail() {
            let all = [...this.detailData.orgIds, ...this.detailData.orgHalfIds]

            // 重新提交进来的场景，必定有详情的ID
            const procInsId = this.$route.query.procInsId

            // 不是全国 - 手动设置tab  由于Tree是 lazyLoad 所有自动触发 readyTree = true
            if (!all.includes(-99) && procInsId) {
                this.tabActive = 2
            } else {
                this.tabActive = 1
            }

            if (all.length && this.readyTree) {
                setTimeout(() => {
                    this.setDetail()
                }, 500)
                return true
            }

            return false
        }
    },

    created() {
        this.loadNode({ level: 0 })
    },

    methods: {
        onChangeTab(tab) {
            this.tabActive = tab

            // 选择部分区域再请求数据
            if (tab === 2) {
                // 第一次请求数据； 后续数据请求都是走懒加载的，不走这里
                if (this.treeData.length === 0) {
                    // 手动请求接口
                    this.loadNode({ level: 0 })
                }
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
            let checked = this.$refs.tree.getNode(currentNode[this.nodeKey]).checked

            // 当前节点未被选中，右侧树做反选操作
            if (!checked) {
                this.$refs.selectedTree.setChecked(currentNode[this.nodeKey], false, true)

                noticeState()
                return
            }

            // 如果选中的所有key(全选+半选)， 都包含根节点的key, 则是全选了树
            const isCheckAll = this.rootTreeIds.every(id => checkedKeys.includes(id))

            if (isCheckAll) {
                this.$message.error('请直接选择全国数据！')
                // 将最后一个设置为不可选
                this.$refs.tree.setChecked(currentNode[this.nodeKey], false, true)
                return
            }

            // 将右侧的数据进行展示
            this.$refs.selectedTree.setChecked(currentNode[this.nodeKey], true, true)

            noticeState()
        },

        /**
         * 已选择区取消选中
         * 去掉左侧右侧的树节点的是勾选
         * 同步选中的节点数据给父组件
         */
        selectedTreeCheckFunc(currentNode) {
            this.$refs.tree.setChecked(currentNode[this.nodeKey], false, true)
            this.$refs.selectedTree.setChecked(currentNode[this.nodeKey], false, true)

            const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
            const checkedKeys = this.$refs.tree.getCheckedKeys()

            this.$emit('update-tree', {
                checkedKeys,
                halfCheckedKeys,
                all: checkedKeys
            })
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

        // 懒加载
        async loadNode(node, resolve) {
            // 因为组件一开始就渲染了，所以，这里默认会触发懒加载逻辑， 如果tab是全国，则不做任何处理
            if (this.tabActive === 1) return

            let data = {}

            if (node.level !== 0) {
                data.id = node.data.id
            }

            const setRightTree = list => {
                for (const item of list) {
                    let has = this.$refs.selectedTree.getNode(item.id)
                    // 避免节点被重复添加到右侧，因为该场景存在切换 层级，会重新获取Tree数据
                    if (!has) {
                        this.$refs.selectedTree.append(item, item.parentId)
                    }
                }

                // 重新设置右侧选中
                const checkedKeys = this.$refs.tree.getCheckedKeys()
                this.$refs['selectedTree'].setCheckedKeys(checkedKeys)
            }

            try {
                let res = await this.$axios('/authority/role/select', {
                    op: 'selectOrgTreeLazy',
                    data
                })

                let list = JSON.parse(res.data) || []

                // 子节点懒加载
                if (node.level !== 0) {
                    resolve(list)

                    setRightTree(list)
                } else {
                    // 第一层-上面切换tab手动调用接口查询接口和赋值的
                    this.treeData = list
                    this.rootTreeIds = this.treeData.map(p => p[this.nodeKey])

                    setRightTree(list)

                    this.readyTree = true
                }
            } catch (error) {
                console.log('orgTree报错---loadNode', error)
                resolve && resolve([])
            }
        },

        // 查选
        async queryOrg() {
            let { orgType, search } = this.hierarchy
            if (orgType != 20 && search == '') {
                this.$message.error(`请输入搜索信息！`)
                return
            }
            this.treeLoading = true

            try {
                let res = await this.$axios('/authority/role/select', {
                    op: 'selectOrgTreeLazy',
                    data: { orgType, search }
                })

                let data = JSON.parse(res.data)
                if (data.length === 0) {
                    this.$refs.tree.filter('')
                } else {
                    this.$refs.tree.filter(search)
                    this.treeData = data

                    // 将右侧的已选的数据回显到左侧
                    const checkedKeys = this.$refs.selectedTree.getCheckedKeys()
                    this.$refs['tree'].setCheckedKeys(checkedKeys)
                }
            } catch (error) {
            } finally {
                this.treeLoading = false
            }
        },

        setDetail() {
            let allSelectedKeys = [...this.detailData.orgIds, ...this.detailData.orgHalfIds]

            // 全国 - 什么都不处理
            if (allSelectedKeys.includes(-99)) return

            // 半选的设置进去，触发懒加载
            this.defaultExpandedKeys = this.detailData.orgHalfIds

            let initCheckedKeys = this.$refs['tree'].getCheckedKeys()

            // 用户已经勾选过，不需要用详情数据回填回去
            if (initCheckedKeys.length) return

            // 先回填左侧Tree的全选
            this.$refs['tree'].setCheckedKeys(this.detailData.orgIds)

            // 右侧已选择内容回填
            this.$refs.selectedTree.setCheckedKeys(this.detailData.orgIds, true, true)

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

.org-tree-body {
    height: 460px;
    overflow: auto;
}
</style>
