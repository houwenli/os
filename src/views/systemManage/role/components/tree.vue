<template>
    <el-row>
        <el-col :span="12" class="treeLeft">
            <div class="navTab">
                <p class="header">
                    <span class="headerSpot"></span>
                    {{ headerName.choice }}
                </p>

                <!-- 数据权限和机构权限才有这个tab -->
                <el-tabs v-if="visibleArea"  class="tab-wrap" v-model="activeTab" @tab-click="handleClick">
                    <el-tab-pane v-for="item in tabList" :label="item.name" :key="item.type" :name="item.type">
                    </el-tab-pane>
                </el-tabs>
            </div>

            <div class="conterBox" v-if='!visibleArea || activeTab === "2"'>
                <slot name="Hierarchy"></slot>
                <el-input prefix-icon="el-icon-search" class="powerInfo" @input="seacrchChange"
                    :placeholder="placeholder" v-model.trim="filterText" style="margin-bottom: 20px"></el-input>
                <div class="treeCon">
                    <!-- 有全国数据就不需要全选  有禁用选项也不让全选-->
                    <div align="left" v-if="control">
                        <el-checkbox class="checkboxAll" v-model="isCheckAll" :disabled="treeLoading || allSelectDisabled"
                            @change="checkAllFunc">全选</el-checkbox>
                    </div>
                    <el-tree class="filter-tree" v-loading="treeLoading" ref="tree"
                        @check-change="checkChange" :data="treeData" show-checkbox
                        :default-checked-keys="defaultExpandedKeys" :default-expand-all="expandAll" :node-key="nodeKey"
                        :props="defaultProps" :filter-node-method="filterNode" @check="checkFunc"></el-tree>
                </div>
            </div>

        </el-col>
        <el-col :span="12" class="treeRight" v-if='activeTab === "2" || !visibleArea'>
            <div class="navTab">
                <p class="header">
                    <span class="headerSpot"></span>
                    {{ headerName.selected }}
                </p>
            </div>

            <div class="conterBox" style="background: #f5f7fa" >
                <div class="treeCon">
                    <el-tree  class="filter-tree" ref="selectedTree" style="background: #f5f7fa"
                        :data="selectTreeData" show-checkbox :default-checked-keys="defaultExpandedKeys"
                        :default-expand-all="expandAll" :node-key="nodeKey" :props="defaultProps"
                        @check="selectedTreeCheckFunc" empty-text="暂无已选择" :renderContent="renderContent"></el-tree>
                </div>
            </div>
        </el-col>

        <!-- 不能移除， 否则computed不能生效 -->
        <div v-show='false'>{{treeStatus}}</div>
    </el-row>
</template>

<script>
import { cloneDeep } from 'lodash-es'
import { mapState } from 'vuex';

export default {
    name: 'authorizationTree',
    props: {
        headerName: { type: Object },
        defaultProps: { type: Object, default: () => { } }, // 默认匹配
        nodeKey: { type: String, default: () => 'id' }, // 树节点唯一标识
        expandAll: { type: Boolean, default: false }, // 是否默认展开全部节点
        defaultExpandedKeys: { type: Array, default: () => [] }, // 默认显示数据
        placeholder: { type: String, default: () => '' },
        // 查询数据的入参
        getData: { type: Object, default: () => { } },
        visibleArea: { type: Boolean, default: false },
        control:{ type: Boolean, default: true },
    },
    data() {
        return {
            moduleName: '/systemManage/role',
            filterText: '',
            isCheckAll: '',
            treeLoading: false,
            checkAllKeys: '',
            selectTreeData: [],
            treeData: [],
            tabList: [
                {
                    name: "全国",
                    type: "1"
                },
                {
                    name: '部分区域',
                    type: "2"
                }
            ],
            citylist: [],

            activeTab: '1',
            outTree:[],

            allSelectDisabled:false
        };
    },
    computed: {
        ...mapState({
            cityDefaultKeys: state => state.role.cityDefaultKeys
        }),

        /**
         * 同时监控2个异步字段-采用computed
         */
        treeStatus() {
          // 只有当详情数据 defaultExpandedKeys 和树的原始数据treeData 都存在才去判断长度，决定是否勾选
          if (this.defaultExpandedKeys.length && this.treeData.length && this.headerName.type != 4) {
            // 拿到树的第一层节点的id
            const firstLevelIds = this.treeData.map(p => p.id)
            const checkIds = this.$refs.tree.getCheckedKeys()
            // 第一层节点id都在 默认的 回显数据中，说明应该是全选
            this.isCheckAll = firstLevelIds.every(item => checkIds.includes(item))
          }

          // return 不能删除，computed 默认必须要有返回值
          return ''
        }
    },
    watch: {
        // 全选
        checkAllKeys: {
            handler(newVal, oldVal) {
                this.getNodeAllKeys(this.treeData).length === newVal ? (this.isCheckAll = true) : (this.isCheckAll = false);
                this.$emit('treeSelet', newVal ? true : false);
            },
            immediate: true
        },

        /**
         * 城市组件
         */
        cityDefaultKeys: {
            handler(val) {


                if(!val.length) {
                  // 角色权限-编辑场景
                  if (this.$route.query.id) {
                    this.activeTab = '2'
                    this.$emit('update-active-tab', '2')
                  }

                  // 角色权限-批量授权
                  if (this.$route.query.type === 'batchCopy') {
                    this.activeTab = '2'
                    this.$emit('update-active-tab', '2')
                  }
                  return
                }

                this.citylist = val.includes(-99) ? val : []
                this.activeTab = val.includes(-99) ? '1' : '2'
                this.$emit('update-active-tab', this.activeTab)
            },
            immediate: true,
        }
    },
    methods: {
        // 自定义渲染节点
        renderContent(h, { node, data, store }) {
            node.visible = node.checked || node.indeterminate;
            return (
                <span class="custom-tree-node">
                    <span>{node.label}</span>
                </span>
            );
        },
        // 全选/ 获取全部nodeKey
        getNodeAllKeys(data = [], keys = []) {
            data.forEach(item => {
                keys.push(item[this.nodeKey]);
                item[this.defaultProps.children] && this.getNodeAllKeys(item[this.defaultProps.children], keys);
            });
            return keys;
        },
        // 全选
        checkAllFunc(e) {
            if (e) {
                this.$refs.tree.setCheckedNodes(this.treeData);
                this.$refs.selectedTree.setCheckedNodes(this.treeData);
            } else {
                this.$refs.tree.setCheckedNodes([]);
                this.$refs.selectedTree.setCheckedNodes([]);
            }
        },
        // 全选联动
        checkChange() {
            this.checkAllKeys = this.$refs.tree.getCheckedKeys().length;

            this.getTreeNodes()
        },
        // 搜索内容
        seacrchChange: $vuex.$baseMethod.debounce(function (val) {
            this.$refs.tree.filter(this.filterText);
        }, 500),
        // 搜索
        filterNode(value, data) {
            if (!value) return true;
            return data[this.defaultProps.label].indexOf(value) !== -1;
        },
        // 选中
        checkFunc(node) {
            if (this.$refs.tree.getNode(node[this.nodeKey]).checked) {
                this.$refs.tree.setChecked(node[this.nodeKey], true, true);
                this.$refs.selectedTree.setChecked(node[this.nodeKey], true, true);

                if(this.headerName.type == 4) {
                    let arrCheck = this.outTree.filter(item => this.$refs.selectedTree.getCheckedKeys().includes(item))
                    //全选了 就把最后一个打开不让全选
                    if(arrCheck.length == this.outTree.length) {
                        this.$refs.tree.setChecked(node[this.nodeKey], false, true);
                        this.$refs.selectedTree.setChecked(node[this.nodeKey], false, true);
                        this.$message.error('请直接选择全国数据！')
                    }
                }

            } else {
                this.$refs.tree.setChecked(node[this.nodeKey], false, true);
                this.$refs.selectedTree.setChecked(node[this.nodeKey], false, true);
            }
        },
        // 已选择区取消选中
        selectedTreeCheckFunc(node) {
            let a = this.$refs.selectedTree.getNode(node[this.nodeKey]);
            if (a.checked) {
                this.$refs.tree.setChecked(node[this.nodeKey], true, true);
                if(this.headerName.type == 4) {
                    let arrCheck = this.outTree.filter(item => this.$refs.selectedTree.getCheckedKeys().includes(item))
                    if(arrCheck.length == this.outTree.length) {
                        this.$refs.tree.setChecked(node[this.nodeKey], false, true);
                        this.$refs.selectedTree.setChecked(node[this.nodeKey], false, true);
                        this.$message.error('请直接选择全国数据！')
                    }
                }
            } else {
                this.$refs.tree.setChecked(node[this.nodeKey], false, true);
            }

            this.getTreeNodes()
        },
        // request
        async getTreeData() {
            try {
                let { op, data } = this.getData;
                let param = {
                    op,
                    data
                };
                this.treeLoading = true;
                let res = await this.$axios('/authority/role/select', param);
                this.treeData = JSON.parse(res.data);
                this.selectTreeData = cloneDeep(this.treeData);
                if(this.headerName.type == 4) this.outTree = this.selectTreeData.map(item => item.code)
                this.treeLoading = false;
            } catch (error) {
                this.treeLoading = false;
            }
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },

        /**
         * 获取节点树
         */
        getTreeNodes() {
            // 选中节点Node的List-包含Node完整信息
            let checkedNodes = this.$refs.tree.getCheckedNodes()
            // 获取选中节点的keys
            const checkedKeys = this.$refs.tree.getCheckedKeys()
            this.$emit('tree-change', {
                checkedKeys,
                checkedNodes
            })
        },

        handleClick() {
          this.$emit('update-active-tab', this.activeTab)
        }
    },
    created() {
        this.getTreeData();
    }
};
</script>

<style scoped lang="scss">
.treeLeft {
    padding-right: 16px;

}

.navTab {
    display: flex;
    align-items: center;
    height: 30px;
    margin-bottom: 10px;

    .tab-wrap {
        ::v-deep>.el-tabs__header {
            display: flex;
            justify-content: center;
            margin-bottom: 0;

            .el-tabs__nav-wrap {
                background-color: #f5f7fa;
                border-radius: 4px 0px 0px 4px;

                .el-tabs__active-bar {
                    width: 0 !important;
                }

                &::after {
                    width: 0;
                }
            }

            .el-tabs__item {
                width: 124px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                color: #606266;
                padding: 0;

                &.is-active {
                    background-color: #f05259;
                    color: #fff;
                    opacity: 1;
                }

                &.is-top:last-child {
                    border-radius: 0px 4px 4px 0px !important;
                }
            }
        }

        ::v-deep .el-tabs__nav-wrap {
            display: inline-block;
            border-radius: 4px 4px 4px 4px !important;
        }
    }

}

.header {
    font-size: 14px;
    font-weight: 500;
    margin-right: 8px;

    .headerSpot {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: #c0c4cc;
        border-radius: 50%;
        margin-right: 8px;
    }
}

.conterBox {
    border: 1px solid #dcdfe6;
    padding: 24px;
    border-radius: 4px;
    height: 580px;
    display: flex;
    flex-direction: column;
    overflow: auto;

    .powerInfo {
        width: 100%;
        height: 40px;
        margin-bottom: 20px;
    }

    .treeCon {
        display: flex;
        flex-direction: column;
        overflow: auto;

        .filter-tree {
            flex: 1;
            height: 100%;
            width: 100%;
            overflow: auto;
        }
    }

    .nolist {
        line-height: 62px;
        color: #909399;
        text-align: center;
    }
}
.noallow {
    cursor:not-allowed
}
</style>
