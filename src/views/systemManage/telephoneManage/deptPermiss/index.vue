<template>
    <div class="deptPermiss-container">
        <!-- v-show="!permissVisible" -->
        <div>
            <div class="buttonArea">
                <el-button type="primary" class="tab-btn" :disabled="multiBtnDisabled" @click="updateRows" v-if="oaPowerList.updateDeptPerm">批量编辑</el-button>
            </div>
            <div class="search-container" v-if="deptType === '2'">
                <div style="line-height: 30px">筛选条件：</div>
                <ul class="search-list">
                    <li
                        v-for="(item, index) in searchList"
                        :class="[filterType === item.value ? 'is-active search-item' : 'search-item']"
                        :key="index"
                        class="search-item"
                        @click="changeFilterType(item)"
                    >
                        {{ item.name }}
                    </li>
                </ul>
            </div>
            <div class="tree-table">
                <div class="tree-nav">
                    <div class="item name-item">部门名称</div>
                    <div class="item empCount-item">成员数</div>
                    <div class="item competenceType-item">部门成员对通讯录查看范围</div>
                    <div class="item operate-item">操作</div>
                </div>
                <ws-tree
                    ref="wstree"
                    v-if="refreshTable"
                    v-loading="treeLoading"
                    class="ps-tree"
                    node-key="id"
                    :tree-data="oaPowerList.selectOrgTree ? treeData : []"
                    :defaultProps="defaultProps"
                    :gen-node-content="genNodeContent"
                    :lazy="true"
                    show-checkbox
                    :default-expanded-keys="defaultExpandKeys"
                    :filter-node-method="filterNode"
                    @load="loadNode"
                    @node-click="handleNodeClick"
                    @check-change="handleCheckChange"
                    :check-strictly="checkStrictly"
                ></ws-tree>
            </div>
        </div>
        <permissSet v-if="permissVisible" :options="{ data: permissRowData, filterType }" @close-update="close" :moduleName="moduleName" />
    </div>
</template>

<script>
import permissSet from './components/permissSet.vue';
import mixinTree from '../common/mixinTree';
import { searchList, areaDeptChildList, permissOptions } from '../common/config';
import wsTree from '@/components/Tree';
import { powerMixin } from '@/utils/permission'
export default {
    name: 'deptPermissTab',
    mixins:[powerMixin],
    components: {
        permissSet,
        wsTree
    },
    mixins: [mixinTree],
    props: {
        levelDeptData: {
            type: Object,
            default: () => {}
        }
    },
    provide() {
        return {
            treeDeptType: {
                deptType: null
            }
        };
    },
    data() {
        return {
            deptType: '0', //部门类型
            refreshTable: true, //重新刷新table数据
            permissVisible: false, //显示编辑页
            treeData: [],
            treeLoading: false,
            defaultExpandKeys: [0],
            // tableData: [],
            expandKeys: [],
            tableHeaderStyle: {
                height: '40px',
                background: '#F5F7FA',
                'font-size': '14px',
                'font-family': 'PingFangSC-Medium, PingFang SC',
                'font-weight': '500',
                color: '#606266',
                textAlign: 'left'
            },
            defaultProps: {
                children: 'childList',
                label: 'name',
                isLeaf: 'leaf'
            },
            checkNodes: null,
            searchList: searchList,
            filterType: 1,
            orgType: null,
            multiBtnDisabled: true,
            permissRowData: null,
            areaDeptChildList: areaDeptChildList,
            currentNode: null,
            queryParams: {},
            checkedNodes: [],
            menuOptions: [],
            clickFlag:false
        };
    },
    computed: {
        checkStrictly() {
            return this.filterType !== 2;
        },
        tabOptions() {
            //全部0、总部1、分支机构2选项
            let tabOptions = [];
            if (this.menuOptions[1].children.length > 0) {
                tabOptions = this.menuOptions[1].children.map(item => {
                    return { label: item.resourcesName, name: item.resourcesUrl.split('&')[1], resourcesUrl: item.resourcesUrl };
                });
            }
            return tabOptions;
        },
        moduleName() {
            return this.tabOptions[this.deptType].resourcesUrl;
        },
       
    },
    watch: {
        defaultMenuOptions: {
            deep: true,
            immediate: true,
            handler: function (newV) {
                // 筛选出通讯录和部门权限选项
                this.menuOptions = ((newV || {}).menuList || []).map(item => {
                    let name = item.resourcesUrl.indexOf('/') > -1 ? item.resourcesUrl.split('/')[1] : item.resourcesUrl;
                    return { ...item, resourcesUrl: name };
                });
            }
        }
    },
    methods: {
        getQueryParams(treeId) {
            this.queryParams = {
                id: treeId || 0,
                deptType: this.deptType === '0' ? null : parseInt(this.deptType),
                filterType: this.filterType,
                orgType: this.orgType
            };
            return this.queryParams;
        },
        fetchData(queryParams) {
            return new Promise((resolve, reject) => {
                const param = {
                    data: queryParams,
                    op: 'selectOrgTree'
                };
                this.treeLoading = true;
                // this.$axios('/authority/contacts/select', param).then(res => {
                this.$axios(this.getModuleUrl(param.op), param).then(res => {
                    this.treeLoading = false;
                    const resultData = JSON.parse(res.data);
                    resolve(resultData);
                });
            });
        },
        genNodeContent(node, data) {
            const { name, empCount, competenceType, id, type } = data;
            const updateDeptPerm = this.oaPowerList.updateDeptPerm === undefined ? '':this.oaPowerList.updateDeptPerm;
            // 生成节点内容函数，返回值为vnode
            return (
                <div class={`node-div node-div${node.level}`}>
                    <div class="field-box name-box">
                    
                        <span class="cell-world el-tooltip">{name}</span>
                    </div>
                    <div class="field-box empCount-box">
                        <span class="cell-world">{empCount}</span>
                    </div>
                    <div class="field-box competenceType-box">
                        <span class="cell-world">{permissOptions.find(i => i.value == competenceType)?.label}</span>
                    </div>
                    <div class="field-box operate-box">
                        {id !== 0 && updateDeptPerm? (
                            <el-button
                                type="text"
                                class="rb-btn"
                                on-click={event => {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    this.updateRow(data);
                                }}
                            >
                                编辑
                            </el-button>
                        ) : null}
                    </div>
                </div>
            );
        },
        handleNodeClick(node) {},
        filterNode() {},
        addIsLeafFiled(childList) {
            childList.forEach(i => {
                i.leaf = i.childFlag == 0;
            });
        },
        loadNode(node, resolve) {
            this.currentNode = node;
            let initTree = false;
            this.treeLoading = true;
            //0-返回deptType为全部最上层树结构，直接获取展开
            if (!initTree && this.deptType === '0' && node.level === 1 && this.levelDeptData) {
                //深克隆断绝子节点关系
                const childDept = this.$baseMethod.deepClone(this.levelDeptData.childList)
                if(!this.clickFlag) {
                    resolve([...childDept])
                } else {
                    resolve([])
                }
                initTree = true;
                this.treeLoading = false;
            } else {
                //下级结构懒加载
                if (node.level > 1) {
                    this.getChildDept(resolve);
                }
                node.level == 1 && resolve([]);
                this.treeLoading = false;
            }
            this.clickFlag = false
        },
        getChildDept(resolve) {
            const { data, parent } = this.currentNode;
            const { data: parentData } = parent;
            if (this.filterType === 2 && parentData.type === 'areaDept') {
                // return resolve([])
            }
            if (this.filterType === 2 && data.orgType == 5) {
                // 按部门结构-大区类型下面固定4个子节点
                resolve(
                    this.areaDeptChildList
                        .filter(item => data.orgType != item.orgType)
                        .map(i => {
                            return {
                                parentId: data.id,
                                ...i,
                                id: Math.random()
                            };
                        })
                );
            } else {
                // 正常下级节点懒加载
                //固定节点下级加载使用父节点id
                let treeId = data.type == 'areaDept' ? data.parentId : data.id;
                //orgType只在按部门类型时入参
                this.orgType = this.filterType == 2 ? data.orgType : null;

                this.fetchData(this.getQueryParams(treeId)).then(res => {
                    const { childList } = res;
                    this.addIsLeafFiled(childList);
                    resolve(childList);
                });
            }
        },
        changeFilterType(item) {
            //清空勾选节点点
            this.$refs.wstree.$refs.tree.setCheckedKeys([]);
            this.filterType = item.value;
            if (this.filterType == 2) {
                this.orgType = 5;
            } else {
                this.orgType = null;
            }
            this.fetchData(this.getQueryParams(0)).then(res => {
                this.treeLoading = false;
                this.treeData = [{ ...res }];
            });
        },
        updateRow(row) {
            this.permissVisible = true;
            this.permissRowData = row;
            // this.$router.push({
            //     name: 'editPermiss',
            //     query: { data: this.permissRowData }
            // });
        },
        updateRows() {
            this.checkedNodes = this.$refs.wstree.$refs.tree.getCheckedNodes();
            this.permissVisible = true;
            this.permissRowData = this.checkedNodes;
            // this.$router.push({
            //     name: 'editPermiss',
            //     query: { data: this.permissRowData }
            // });
        },
        close(val) {
            this.permissVisible = false;
            this.clickFlag = true
            if(val == 2) {
                this.$nextTick(() => {
                    this.fetchData(this.getQueryParams()).then(res => {
                        const { childList } = res;
                        this.addIsLeafFiled(childList);
                        this.treeLoading = false;
                        this.treeData = [{ ...res }];
                    });
                });
            } 
        },
        handleCheckChange(data, checked, indeterminate) {
            this.checkedNodes = this.$refs.wstree.$refs.tree.getCheckedNodes();
            this.multiBtnDisabled = this.checkedNodes.length <= 0;
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    }
};
</script>

<style lang="scss" scoped>
.deptPermiss-container {
    padding-top: 24px;
    box-sizing: border-box;
    .buttonArea {
        display: flex;
        justify-content: right;
        margin-bottom: 16px;
    }
    .rb-btn {
        color: #0088ff;
    }
    position: relative;
    .el-table {
        /deep/ .el-table__expand-icon {
            float: right;
        }
        /deep/ .el-table__placeholder {
            width: 0px;
        }
        /deep/ .childRow {
            td {
                border-bottom: none;
            }
            // td:last-of-type {
            //     border-bottom: 1px solid #EBEEF5
            // }
        }
    }
    .tab-btn {
        width: 160px;
    }
    .tab-list-container {
        .tab-item {
            width: 60px;
            display: inline-block;
            margin: 0 27px;
            &:first-child {
                margin-left: 0px;
            }
            &:last-child {
                margin-right: 0px;
            }
        }
    }
    .search-container {
        display: flex;
        margin-bottom: 10px;
        .search-list {
            .search-item {
                width: 80px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                display: inline-block;
                background-color: #f5f7fa;
                cursor: pointer;
                &.is-active {
                    background-color: #f05259;
                    color: #fff;
                }
            }
        }
    }
    .tree-table {
        border: 1px solid #ebeef5;
        // border-left: 1px solid #ebeef5;
        .tree-nav {
            width: 100%;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #ebeef5;
            padding: 12px 0;
            background: #f5f7fa;
            color: #606266;
            height: 40px;
            .item {
                font-size: 14px;
                color: #666;
                text-align: left;
                padding-left: 16px;
                line-height: 40px;
                // border-right: 1px solid #ebeef5;
            }

            .name-item,
            .empCount-item,
            .competenceType-item {
                flex: 1;
            }
            .operate-item {
                width: 248px;
                border-right: 1px solid #ebeef5;
                border-left: 1px solid #ebeef5;
            }
            .name-item {
                &::before {
                    content: '';
                    display: inline-block;
                    position: absolute;
                    background-color: #e6e6e6;
                    width: 1px;
                    height: 40px;
                    left: calc((100% - 248px) / 3);
                }
            }
            .empCount-item {
                &::before {
                    content: '';
                    display: inline-block;
                    position: absolute;
                    background-color: #e6e6e6;
                    width: 1px;
                    height: 40px;
                    left: calc(2 * (100% - 248px) / 3);
                    // z-index: 1;
                }
            }
        }
        .ps-tree {
            /deep/ .el-tree > .el-tree-node > .el-tree-node__content {
                .el-checkbox {
                    display: none;
                }
            }
            /deep/ .el-tree-node__content {
                height: 40px;
                line-height: 40px;
                position: relative;
                border-bottom: 1px solid #e6e6e6;

                &:last-of-type {
                    border-bottom: 1px solid #e6e6e6;
                }
            }
            /deep/ .el-tree-node__children {
                .is-expanded {
                    .el-tree-node__content {
                        border-bottom: none;
                    }
                    .el-tree-node__content {
                        border-bottom: none;
                    }
                }
                // .el-tree-node__children {
                //     .is-expanded {
                //         .el-tree-node__content {
                //             border-bottom: none;
                //         }
                //         .el-tree-node__content {
                //             border-bottom: none;
                //         }
                //     }
                // }
            }
            /deep/ .el-tree-node__expand-icon {
                position: absolute;
                left: calc(((100% - 248px) / 3) - 33px);
            }
        }
    }

    .node-div {
        display: flex;
        width: 100%;
        height: 40px;
        width: 100%;
        .field-box {
            height: 40px;
            line-height: 40px;
            // position: relative;
        }
        // .empCount-box,
        .competenceType-box {
            flex: 1;
            border-right: 1px solid #e6e6e6;
            padding-left: 16px;
            .cell-world {
                position: absolute;
                left: calc(2 * ((100% - 248px) / 3) + 16px);
            }
        }
        .operate-box {
            width: 248px;
            border-right: 1px solid #e6e6e6;
            padding-left: 16px;
        }
        .name-box {
            // flex: 1;
            width: calc((100% - 248px) / 3);
            padding-left: 16px;
            align-items: center;
            display: flex;
            &::before {
                content: '';
                display: inline-block;
                position: absolute;
                background-color: #e6e6e6;
                width: 1px;
                height: 40px;
                left: calc((100% - 248px) / 3);
            }
            .cell-world {
                width: 80%;
                display: inline-block;
                height: 20px;
                line-height: 20px;
                box-sizing: border-box;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                word-break: break-all;
            }
        }
        .empCount-box {
            flex: 1;
            padding-left: 16px;
            .cell-world {
                position: absolute;
                left: calc(((100% - 248px) / 3) + 16px);
            }
            &::before {
                content: '';
                display: inline-block;
                position: absolute;
                background-color: #e6e6e6;
                width: 1px;
                height: 40px;
                left: calc(2 * (100% - 248px) / 3);
                // z-index: 1;
            }
        }
    }
    /deep/ .el-tree-node__content {
        .el-checkbox {
            position: absolute;
        }
    }
    @for $i from 1 through 10 {
        .node-div#{$i} {
            .name-box {
                // width:calc((100% - 248px + (#{$i} - 1) * 22px) / 3);
                width: calc((((100% + ((#{$i} - 1) * 18px)) - 248px) / 3) - (#{$i} - 1) * 18px);
            }
            // .operate-box {
            // width: 248px;}
        }
    }
}
</style>
