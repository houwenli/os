<template>
    <div class="form-content-wrap">
        <div class="leftbox">
            <el-input ref="organizationInput" v-model.trim="searchInput" placeholder="请输入查询信息" class="search" />
            <div v-loading="treeLoading" class="treeBox" v-show="!searchVisible">
                <ws-tree
                    v-if="oaPowerList.selectOrgTree"
                    ref="tree"
                    node-key="id"
                    :tree-data="treeData"
                    :default-props="defaultProps"
                    :gen-node-content="genNodeContent"
                    :lazy="true"
                    :default-expanded-keys="defaultExpandKeys"
                    :filter-node-method="filterNode"
                    @load="loadNode"
                    @node-click="handleNodeClick"
                />
            </div>
            <div class="searchBox" v-if="searchVisible">
                <div class="deptListBox" v-if="searchDeptList.length > 0">
                    <div class="title">部门列表</div>
                    <ul class="listWrap">
                        <li v-for="item in searchDeptList" class="listItem" @click="clickSearchDept(item)" :key="item.deptId">{{ item.deptName }}</li>
                    </ul>
                </div>
                <div class="empListBox" v-if="searchEmpList.length > 0">
                    <div class="title">人员列表</div>
                    <ul class="listWrap">
                        <li v-for="item in searchEmpList" class="listItem" @click="clickSearchEmp(item)" :key="item.empId">{{ item.empName }}</li>
                    </ul>
                </div>
                <p v-if="searchDeptList.length == 0 && searchEmpList.length == 0" class="text_none">没有匹配到任何结果</p>
            </div>
        </div>
        <div class="rightBox">
            <div class="rb-title-box">
                <span class="rb-left-title">{{ title }}</span>
                <div class="rb-right-breadcrumb">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item v-for="(item , index) in orgPath" :key="item.deptId" :index="index">
                            <span class="rb-breadcrumb-title" @click="orgPath.length - 1 != index && clickToDept(item.deptId)">{{ item.deptName }}</span>
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </div>
            <rightTable ref="rightTable" v-show="!showPersonForm" :currentNode="currentNode" @clickToEmpDetail="showEmpDetail" @refresh-tree="refreshTreeNode" />
            <rightForm v-if="showPersonForm" :options="empRowData" @backToTable="showPersonForm = false" />
        </div>
    </div>
</template>

<script>
import wsTree from '@/components/Tree';
import rightTable from './components/rightTable.vue';
import rightForm from './components/rightForm.vue';
import mixinTree from '../common/mixinTree';
export default {
    name: 'telephoneTab',
    components: {
        wsTree,
        rightTable,
        rightForm
    },
    mixins: [mixinTree],
    data() {
        return {
            moduleName: '/telephoneManage',
            currentNode: null,
            treeData: [],
            defaultProps: {
                children: 'childList',
                label: 'name',
                isLeaf: 'leaf'
            },
            treeLoading: false,
            searchInput: '',
            defaultExpandKeys: [0],
            orgPath: [],
            title: '',
            showPersonForm: false,
            empRowData: null,
            searchEmpList: [],
            searchDeptList: []
        };
    },
    computed: {
        searchVisible() {
            return this.searchInput != '';
        }
    },
    watch: {
        searchInput: {
            //树条件查询
            handler: window.$vuex.$baseMethod.debounce(function (val) {
                this.fetchSearchData(val);
            })
        }
    },
    methods: {
        async loadNode(node, resolve) {
            let initTree = false;
            this.treeLoading = true;
            //0-返回的最上层树结构已有子部门，直接获取展开
            if (!initTree && node.level === 1 && this.levelDeptData) {
                //深克隆断绝子节点关系
                const childDept = this.$baseMethod.deepClone(this.levelDeptData.childList);
                resolve([...childDept]);
                initTree = true;
                this.treeLoading = false;
                this.$nextTick(() => {
                    this.$refs.tree.$refs.tree.setCurrentKey('0');
                    this.orgPath = this.levelDeptData.orgPath;
                    this.title = this.levelDeptData.name;
                });
            }
            //一级下面子部门懒加载
            node.level > 1 && this.getChildDeptData(node.data.id, resolve);
            // 需要刷新时重新获取数据
            node.refresh && this.getChildDeptData(node.data.id, resolve);

            this.treeLoading = false;
        },

        async getChildDeptData(id, resolve) {
            const param = {
                data: { id: id },
                op: 'selectOrgTree'
            };
            const res = await this.$axios(this.getModuleUrl(param.op), param);
            const resultData = JSON.parse(res.data);
            console.log(resultData,'cvcvcvcv');
            const { childList } = resultData;
            this.addIsLeafFiled(childList);
            resolve && resolve(childList);
        },
        addIsLeafFiled(childList) {
            childList.forEach(i => {
                i.leaf = i.childFlag == 0;
            });
        },
        genNodeContent(node, data) {
            const { name, empCount } = data;
            // 生成节点内容函数，返回值为vnode
            return (
                <span class="elseSpan">
                    {name} ({empCount || 0})人
                </span>
            );
        },
        async fetchSearchData(val) {
            if (val === '') return;
            const param = {
                data: { name: val },
                op: 'selectFuzzyDeptList'
            };
            const res = await this.$axios(this.getModuleUrl(param.op), param);
            const { departmentChildren, employChildren } = JSON.parse(res.data);
            this.searchEmpList = employChildren;
            this.searchDeptList = departmentChildren;
        },
        filterNode() {},
        handleNodeClick(node, data) {
            this.$nextTick(() => {
                this.orgPath = []
                this.currentNode = node;
                //子节点数据从data中获取
                // this.currentNode.childList = data.childNodes;
                //手动切换部门表格
                this.showPersonForm = false;
                this.title = node.name
                this.recurrence(data)
            });
        },
        clickToDept(id) {
            this.currentNode = {
                id: id
            };
            let spliceIndex = ''
            this.orgPath.forEach((item,index) => {
                if(item.deptId == id) {
                    spliceIndex = index + 1
                }
            })
            this.orgPath.splice(spliceIndex)
            this.title = this.orgPath[this.orgPath.length-1].deptName
        },
        clickSearchDept(item) {
            this.currentNode = {
                id: item.deptId
            };
            this.orgPath = [
                {
                    deptName:"",
                    deptId:""
                }
            ]
            let arr1 = item.deptName.split('-')
            let arr2 = item.parentIds.split(',')
            let arr3 = arr2.map(item => {
                return item.slice(1,item.length -1)
            })
            arr1.unshift('深圳万顺叫车云信息技术有限公司')
            arr3.push(null)
            for(let i = 0 ;i < arr1.length ;i++) {
                this.orgPath.push({
                    deptId: arr3[i ],
                    deptName:arr1[i]
                })
            }
            this.title = this.orgPath[this.orgPath.length - 1].deptName
        },
        clickSearchEmp(item) {
            this.showPersonForm = true;
            this.empRowData = { ...item, id: item.empId };
        },
        refreshTreeNode() {
            //下级部门调整排序后左边tree节点也需要刷新
            let currentId = this.currentNode?.id || 0;
            let current = this.$refs['tree'].$refs['tree'].getNode(currentId);
            this.$set(current, 'loaded', false);
            current.refresh = true;
            current.expand();
        },
        showEmpDetail(rowData) {
            this.showPersonForm = true;
            this.empRowData = rowData;
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        recurrence(val) {
            if(val.data.id || val.data.id == 0) {
                this.orgPath.unshift({deptName:val.data.name,deptId:val.data.id})
                if(val.parent) {
                    this.recurrence(val.parent)
                }
            } else {
                return
            }
        },
    }
};
</script>

<style lang="scss" scoped>

.form-content-wrap {
    width: 100%;
    height: calc(100vh - 184px);
    background: #ffffff;
    display: flex;
    padding-top: 24px;
    box-sizing: border-box;
    
    .leftbox {
        box-sizing: border-box;
        height: 100%;
        width: 32vw;
        min-width: 460px;
        // width: 616px;
        padding-bottom: 0;
        margin-right: 12px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        display: flex;
        flex-flow: column;
        .search {
            padding: 0 24px;
            /deep/ .el-input__inner {
                height: 40px;
                // background: #f5f7fa !important;
                border-radius: 4px;
                border: 1px solid #d8dce6;
                margin: 0 auto;
                margin-top: 24px;
                color: #909399;
            }
        }
        .treeBox {
            padding: 16px 0px 0px 24px;
            padding-right: 0;
            flex: 1;
            overflow: auto;
            /deep/ .ws-tree-warp {
                .el-tree {
                    width: calc(100% - 16px);
                    min-width: auto;
                }
            }
        }
        .searchBox {
            padding: 16px;
            overflow: auto;
            .deptListBox,
            .empListBox {
                .title {
                    font-size: 16px;
                    font-weight: 500;
                    color: #303133;
                    line-height: 22px;
                }
                .listWrap {
                    padding: 16px;
                    .listItem {
                        font-size: 14px;
                        font-weight: 400;
                        color: #303133;
                        line-height: 36px;
                        cursor: pointer;
                    }
                }
            }
            .text_none {
                font-size: 14px;
                color: #909399;
                text-align: center;
            }
        }
    }
    .rightBox {
        height: 100%;
        flex: 1;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        overflow: auto;
        padding: 24px;
        .rb-title-box {
            padding-bottom: 16px;
            border-bottom: 1px solid #dcdfe6;
            margin-bottom: 24px;
            display: flex;
            .rb-left-title {
                font-size: 24px;
                font-weight: 500;
                color: #303133;
                line-height: 36px;
                width: 40%;
                margin-right: 16px;
            }
            .rb-right-breadcrumb {
                flex: 1;
                .rb-breadcrumb-title {
                    cursor: pointer;
                }
                /deep/ .el-breadcrumb {
                    float: right;
                    line-height: 36px;
                    .el-breadcrumb__item:last-child .el-breadcrumb__inner {
                        color: #909399 !important;
                    }
                    // color:#606266
                }
            }
        }
    }
}
</style>
