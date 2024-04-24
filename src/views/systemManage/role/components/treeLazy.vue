<template>
    <el-row>
        <el-col :span="12" class="treeLeft">
            <div class="navTab">
                <p class="header">
                    <span class="headerSpot"></span>
                    {{ headerName.choice }}
                </p>

                <el-tabs class="tab-wrap" v-model="activeTab" @tab-click="handleClick">
                    <el-tab-pane v-for="item in tabList" :label="item.name" :key="item.type" :name="item.type">
                    </el-tab-pane>
                </el-tabs>
            </div>

            <div class="conterBox" v-show='activeTab === "2"'>
                <el-form label-width="100px" class="form">
                    <el-form-item label="机构层级：" class="formItem">
                        <el-row>
                            <el-col :xl="6" :lg="5" :md="6" :sm="6">
                                <el-select class="roleSetUp" v-model="hierarchy.orgType">
                                    <el-option v-for="item in orgOption" :key="item.value" :label="item.label"
                                        :value="item.value"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :xl="14" :lg="13" :md="11" :sm="10">
                                <el-input prefix-icon="el-icon-search" clearable v-model="hierarchy.search"
                                    :placeholder="queryPla"></el-input>
                            </el-col>
                            <el-col :xl="3" :lg="4" :md="5" :sm="6">
                                <el-button class="buttons" type="primary" :loading="treeLoading" @click="queryOrg">查询
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
                <div class="treeCon">
                    <!--
                      注意，这里默认选中不能用 default-checked-keys = defaultExpandedKeys 因为有懒加载的场景，Tree组件内部计算是有bug
                      如果一个父节点A下面有   3个子节点 a-1  a-2 a-3 , 详情接口回显，正常应该回显 a-1  a-2 勾选， 但是default-checked-keys = defaultExpandedKeys  实现，会导致a-3也被勾选
                      @link https://blog.csdn.net/qq_25757181/article/details/123707968
                    -->
                    <el-tree class="filter-tree" v-loading="treeLoading" ref="tree" :data="treeData"
                        :default-expanded-keys="expandedKeys" :default-expand-all="false" node-key="id"
                        :props="defaultProps" :expand-on-click-node="true" @check="getNode" :load="loadNode" lazy
                        show-checkbox :accordion="true" :filter-node-method="filterNode"></el-tree>
                </div>
            </div>

        </el-col>
        <el-col :span="12" class="treeRight" v-show='activeTab === "2"'>
            <div class="navTab">
                <p class="header">
                    <span class="headerSpot"></span>
                    {{ headerName.selected }}
                </p>
            </div>

            <div class="conterBox" style="background: #f5f7fa">
                <div class="treeCon">
                    <el-tree class="filter-tree" ref="selectedTree" style="background: #f5f7fa"
                        :default-expand-all="false" node-key="id" :props="defaultProps" :expand-on-click-node="false"
                        empty-text="暂无已选择"  show-checkbox :render-content="renderContent"
                        @check="selectedTreeCheckFunc" :data="selsectTree" :accordion="true"
                        ></el-tree>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import { mapState } from 'vuex'
// 该组件为机构授权树的特定场景组件，非通用组件

export default {
    name: 'authorizationTreeLazy',
    props: {
        headerName: { type: Object, default: () => { } },
        defaultProps: { type: Object, default: () => { } }, // 默认匹配
    },
    data() {
        return {
            moduleName: '/systemManage/role',
            isCheckAll: false,
            treeLoading: false,
            treeData: [],
            selsectTree: [],
            hierarchy: {
                orgType: '20', // 层级
                search: '', // val
            },
            orgOption: [
                // { value: '0', label: '省区' },
                { value: '20', label: '一级机构' },
                { value: '30', label: '二级机构' },
                { value: '40', label: '实体店' },
            ],
            queryPla: '', // placeholder
            update: true,
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


            defaultCheckedKeys: [],
            citylist: [],

            activeTab: '1',
            outTree:[], //树的第一层数据
            // 半选节点 - 当切换全国和部分区域，再切换回来，需要做半选节点数据的回填
            halfCheckedNodes: []
        };
    },
    computed: {
        ...mapState({
            // 默认选中的节点
            defaultExpandedKeys: state => state.role.orgDefaultKeys,
            // 默认展开的节点
            expandedKeys: state => state.role.orgDefaultExpandedKeys,
            getCompleted: state => state.role.completed,
        }),
    },
    watch: {
        'hierarchy.orgType': {
            handler(index) {
                switch (index) {
                    case '20':
                        this.queryPla = '请输入分公司名称精准查询';
                        break;
                    case '30':
                        this.queryPla = '请输入服务中心名称精准查询';
                        break;
                    case '40':
                        this.queryPla = '请输入实体店名称精准查询';
                        break;
                }
            },
            immediate: true,
        },
        defaultExpandedKeys:{
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
        },
    },
    methods: {
        handleClick() {
          this.$emit('update-active-tab', this.activeTab)
        },

        renderContent(h, { node, data, store }) {
            node.visible = node.checked || node.indeterminate;
            return (
                <span class="custom-tree-node">
                    <span>{node.label}</span>
                </span>
            );
        },
        // 查选
        async queryOrg() {
            this.treeLoading = true;
            let { orgType, search } = this.hierarchy;
            if (orgType != 20 && search == '') {
                this.treeLoading = false;
                this.$message.error(`请输入搜索信息！`);
                return
            }

            if (orgType == 20 && search == '') {
                this.$refs.tree.filter('');
                for (let i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
                    this.$refs.tree.store._getAllNodes()[i].expanded = false;
                }
                this.treeLoading = false;
            } else {
                let res = await this.$axios('/authority/role/select', {
                    op: 'selectOrgTreeLazy',
                    data: { orgType, search },
                });
                let data = JSON.parse(res.data);
                if (data.length == 0) {
                    this.$refs.tree.filter('');
                    this.treeLoading = false;
                } else {
                    setTimeout(() => {
                        this.$refs.tree.filter(search);
                        this.treeData = data
                        this.treeLoading = false;
                    }, 1500);
                }
            }
        },
        filterNode(value, data) {
            if (!value) return true;

            return data[this.defaultProps.label].indexOf(value) !== -1;
        },
        // 选中
        getNode(val, treeSelectedNodes) {
          this.halfCheckedNodes = treeSelectedNodes.halfCheckedNodes
            // 更新vuex中的值
            this.$store.state.role.orgDefaultKeys = treeSelectedNodes.checkedKeys
            if (this.$refs.tree.getNode(val.id).checked) {
                this.$refs.tree.setChecked(val.id, true, true);
                this.$refs.selectedTree.setChecked(val.id, true, true);

                let arrCheck = this.outTree.filter(item => this.$refs.selectedTree.getCheckedKeys().includes(item))
                if(arrCheck.length == this.outTree.length) {
                    this.$refs.tree.setChecked(val.id, false, true);
                    this.$refs.selectedTree.setChecked(val.id, false, true);
                    this.$message.error('请直接选择全国数据！')
                }
            } else {
                this.$refs.tree.setChecked(val.id, false, true);
                this.$refs.selectedTree.setChecked(val.id, false, true);
            }
        },
        //  取消选中
        selectedTreeCheckFunc(data) {
            let a = this.$refs.selectedTree.getNode(data.id);

            if(a.checked) {
                this.$refs.tree.setChecked(data.id, true, true);
                let arrCheck = this.outTree.filter(item => this.$refs.selectedTree.getCheckedKeys().includes(item))
                if(arrCheck.length == this.outTree.length) {
                    this.$refs.tree.setChecked(data.id, false, true);
                    this.$refs.selectedTree.setChecked(data.id, false, true);
                    this.$message.error('请直接选择全国数据！')
                }
            } else {
                this.$refs.tree.setChecked(data.id, false, true);
            }

        },
        //  tree TO arr
        treeToList(node, childrenList = []) {
            node.forEach(e => {
                childrenList.push(e.id);
                e.children && this.treeToList(e.children, childrenList);
            });
            return childrenList;
        },
        // 懒加载
        async loadNode(node, resolve) {
          // 重新选中节点
          const nodeSelectedRender = () => {
            // 解决上面不能直接采用 :default-expanded-keys='defaultExpandedKeys' 的bug
            this.$nextTick(() => {
              this.$refs['tree'].setCheckedKeys(this.defaultExpandedKeys)

              this.$refs['selectedTree'].setCheckedKeys(this.defaultExpandedKeys)

              // 设置半选的节点
              if(this.halfCheckedNodes.length) {
                this.halfCheckedNodes.forEach(item => {
                  // 拿到节点的引用对象
                  const node = this.$refs['tree'].getNode(item.id)

                  // 需要判断一下节点是否存在， 因为可能node是  中间的节点，此时并未渲染出来
                  if(node) {
                    node.indeterminate = true
                  }
                })
              }
            })
          }

            if (node.level == 0) {
                this.treeLoading = true;
                let arr = await this.getTree();
                this.outTree = arr.map(item => item.id)

                // 角色更改的场景
                resolve(arr || []);
                for (const item of arr) {
                    this.$refs.selectedTree.append(item, item.parentId);
                }
                this.treeLoading = false;

                nodeSelectedRender()
            }
            if (node.level > 0) {
                let nodeNew = node;
                let arr = await this.getLoadTree(node.data.id);

                resolve(arr || []);
                for (const item of arr) {
                    this.$refs.selectedTree.append(item, item.parentId);
                }

                if (this.$refs.tree.getNode(nodeNew.data.id).checked) {
                    this.$refs.selectedTree.setChecked(nodeNew.data.id, true, true);
                }

              nodeSelectedRender()
            }
            // 去重解决切换tab后数据叠加问题
            this.selsectTree = this.unique(this.selsectTree, 'id')
        },
        unique(arr, attrName) {
            const res = new Map();
            return arr.filter((a) => !res.has(a[attrName]) && res.set(a[attrName], 1));
        },
        // 懒加载 一级
        async getTree() {
            let res = await this.$axios('/authority/role/select', {
                op: 'selectOrgTreeLazy',
                data: {},
            });
            if (res.code == 1) {
                let data = JSON.parse(res.data);
                return data;
            }
        },
        // 懒加载下一级接口
        async getLoadTree(id) {
            let res = await this.$axios('/authority/role/select', {
                op: 'selectOrgTreeLazy',
                data: { id },
            });
            if (res.code == 1) {
                let data = JSON.parse(res.data);
                return data;
            }
        },

        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    },
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

    .formItem {
        .el-row {
            display: flex;

            &>.el-col:nth-of-type(2) {
                margin-left: 8px;
            }

            &>.el-col:nth-of-type(3) {
                width: 96px;
                margin-left: 16px;

                .button {
                    width: 96px;
                }
            }
        }
    }

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
            display: table;
        }
    }

    .nolist {
        line-height: 62px;
        color: #909399;
        text-align: center;
    }

    .btnAll {
        color: #606266;
    }

    // /deep/ .filter-tree {
    //     .el-checkbox {
    //         display: none;
    //     }
    // }
}

/deep/ .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    width: 100%;
}
</style>
