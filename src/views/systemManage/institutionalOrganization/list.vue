<template>
    <div class="permission-functionMenu-list">
        <div class="form-content-wrap" :style="{height: scrollerHeight}">
            <div class="leftbox">
                <el-row type="flex" justify="space-between" class="row-box" :gutter="10">
                    <el-col :span="8">
                        <el-select v-model="employeeStatus" style="width: 100%" @change='handleEmployeeStatus'>
                            <el-option v-for="item in hierarchyOption" :label="item.label" :value="item.value" :key="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="16">
                        <el-input ref="organizationInput" v-model="selectCount" @input="searchOrg" :disabled="inputFlag" placeholder="请输入两个字以上查询信息" class="search" clearable/>
                    </el-col>
                </el-row>
                <div v-loading="loading" class="treeBox">
                    <ws-tree v-if="isRef" ref="tree" node-key="id" :tree-data="treeData" :default-props="defaultProps" :draggable="false" :gen-node-content="genNodeContent" :set-node-expand="setNodeExpand" :lazy="true" :showCheckAll="true" :default-expanded-keys="expandKey"
                        :filter-node-method="filterNode" @load="loadNode" @node-click="handleNodeClick" />
                </div>
            </div>
            <div class="rightbox">
                <component :is="blockName" :department-label="departmentLabel" :department-name="departmentName" :department-type="departmentType" :data-info="dataInfo" :personnelId="dataInfo.id" @refresh='refresh' />
            </div>
        </div>
    </div>
</template>

<script>
import DepartmentDetail from './departmentDetail.vue';
import headCompany from './headCompany.vue';
import PersonnelDetail from './personnelDetail.vue';
import wsTree from '@/components/Tree';
// import { numTransform } from '@/utils/commMethods';
export default {
    components: {
        headCompany,
        DepartmentDetail,
        PersonnelDetail,
        wsTree,
    },
    data() {
        return {
            // centerDialogVisible: false,
            blockName: 'headCompany', // ['headCompany']数据统计 ['DepartmentDetail']部门详情 ['PersonnelDetail']人员详情 ['DepartmentAdd']添加部门
            departmentLabel: '', // 部门等级
            departmentName: '', // 部门名称
            departmentType: '',
            selectCount: '', // tree搜索框
            // tree
            treeData: [],
            defaultProps: {
                children: 'children',
                label: 'name',
                isLeaf: 'leaf',
            },
            draggable: false, // 拖拽
            moduleName: '/systemManage/institutionalOrganization',
            dataInfo: {},
            children: [],
            resolve: null,
            currentNode: {}, // 当前节点数据
            loading: false,
            currentNodeKey: '',
            isRef: true,
            nodeAOS: [],
            inputFlag: false,
            hierarchyOption: [
                { value: 20, label: '一级机构' },
                { value: 30, label: '二级机构' },
                { value: 40, label: '实体店' },
                { value: 2, label: '员工姓名' },
            ],
            employeeStatus: 20,
            expandKey: [0],
        };
    },
    computed: {
        scrollerHeight: function () {
            return this.blockName === 'PersonnelDetail' || this.blockName === 'headCompany' || this.dataInfo.depType === 2 ? '100%' : 'calc(100% - 60px)';
        },
    },
    methods: {
        // =============================================================   数据请求   =================================================================================
        // tree 懒加载
        async loadNode(node, resolve) {
            const vm = this;
            // loadType 有值 走搜索
            // if (node.loadType) {
            //     const arr = await vm.matchingTree();
            //     resolve(arr);
            // }

            if (node.level === 0) {
                // 保存loadNode的数据处理promise函数
                vm.resolve = resolve;
                vm.treeNode = node;
                // 初始化tree时禁止用户输入，防止用户利用防抖时间差输入内容造成初始化服务响应过慢而覆盖搜索出内容
                vm.inputFlag = true;
                const arr = await vm.getTreeData('0', '0');
                vm.inputFlag = false;
                this.$nextTick(() => {
                    this.$refs['organizationInput'].focus();
                });
                resolve(arr);
            }

            // level === 1 加载二级菜单
            if (node.level === 1) {
                let childrenData;

                if (vm.selectCount != '') {
                    // vm.selectCount != "" 走加载三级菜单方法
                    childrenData = await this.getTreeData(node.data.id);
                } else {
                    // 走二级菜单加载方法【原因：后端返回数据连同1/2级数据都返回，需要处理分段加载】
                    childrenData = vm.children;
                    // childrenData.forEach(item => (item.leaf = !(item.depLevel && item.depLevel !== null)));
                }
                resolve(childrenData || []);
            }

            if (node.level >= 2 && node.data.type === 'department') {
                const childreAarr = await this.getTreeData(node.data.id, node.level);
                return resolve(childreAarr || []); // 加上这个，防止在该节点没有子节点时一直转圈的问题发生。
            }
        },

        // 获取组织架构数据
        async getTreeData(id, type) {
            try {
                const param = {
                    data: { id },
                    op: 'selectOrgDeptList',
                };
                const url = this.getModuleUrl(param.op);
                url && type < 2;
                const res = await this.$axios(url, param);
                let list;
                if (res.code == 1) {
                    type === '0' && (this.treeNode.childNodes = []);
                    const result = JSON.parse(res.data);
                    list = type === '0' ? this.firstTree([result]) : this.childrenHandle(result);
                } else {
                    list = [];
                }
                return list;
            } catch (err) {
                return [];
            }
        },

        refresh() {
            this.isRef = false;
            setTimeout(() => {
                this.isRef = true;
            }, 1);
        },
        // =============================================================   数据处理   =================================================================================
        // filterNode: $vuex.$baseMethod.debounce(function (val) {
        //     const vm = this;
        //     if (val && val != null) {
        //         vm.loadNode({ loadType: 'search' }, vm.resolve);
        //     } else {
        //         vm.loadNode(vm.treeNode, vm.resolve);
        //     }
        // }, 400),

        //模糊搜索
        searchOrg(val) {
            let vm = this;
            if (val.length == 1) {
                return;
            }
            vm.loading = true;
            if (val) {
                const param = {
                    data: { orgType: vm.employeeStatus == 2 ? null : vm.employeeStatus, name: val, queryType: vm.employeeStatus == 2 ? vm.employeeStatus : 1, depType: 2 },
                    op: 'selectTreeIdList',
                };
                vm.$axios(vm.getModuleUrl(param.op), param).then(res => {
                    let data = JSON.parse(res.data);
                    if (data.length <= 0) {
                        setTimeout(() => {
                            vm.$refs.tree.filter('  @');
                            vm.loading = false;
                        }, 1500);
                    } else {
                        vm.expandKey = data;
                        setTimeout(() => {
                            vm.$refs.tree.filter(val);
                            vm.loading = false;
                        }, 2500);
                    }
                });
            } else {
                vm.expandKey = [0];
                vm.isRef = false;
                vm.loading = false;
                setTimeout(() => {
                    vm.isRef = true;
                }, 1);
            }
        },
        filterNode(value, data) {
            if (!value) return true;
            if (this.employeeStatus != 2) return data.name.indexOf(value) !== -1 && data.type == 'department';
            if (this.employeeStatus == 2) return data.name.indexOf(value) !== -1 && data.type == 'staff';
        },
        firstTree(list) {
            const vm = this;
            const data = list.map(item => {
                const { userList, deptChild } = item;
                vm.children = [...(userList || []), ...(deptChild || [])];

                // 处理子数据，区分部门和员工
                vm.children.forEach(item => (item.type = item.depLevel && item.depLevel !== null ? 'department' : 'staff'));
                return {
                    ...item,
                    banDelete: true,
                    type: 'department',
                };
            });
            return data;
        },

        childrenHandle(data) {
            const { deptChild, userList } = data;
            const childrenData = [...(userList || []), ...(deptChild || [])];
            childrenData.forEach(item => {
                ``;
                item.type = item.depLevel && item.depLevel !== null ? 'department' : 'staff';
                // item.leaf = !(item.depLevel && item.depLevel !== null);
            });
            return childrenData;
        },
        handleEmployeeStatus() {
            if (this.selectCount) {
                this.selectCount = '';
                this.expandKey = [0];
                this.isRef = false;
                setTimeout(() => {
                    this.isRef = true;
                }, 1);
            }
        },
        // =============================================================   节点点击事件   =================================================================================
        setNodeExpand(node, data) {
            const vm = this;
            vm.$set(data, 'banAdd', true);
            vm.$set(data, 'banDelete', true);
            this.$nextTick(() => {
                vm.dataInfo = data;
            });
            return data.type !== 'staff' && data.depType < 2;
        },

        genNodeContent(node, data) {
            const { positionName, name, depCount } = data;
            // 生成节点内容函数，返回值为vnode
            if (data.type === 'staff') {
                // 人员
                return (
                    <span class="bigSpan">
                        {name}
                        <el-tooltip disabled={positionName == null || positionName.length == 0} class="item" effect="dark" placement="top-end">
                            <span class="rightSpan" slot="content">
                                {positionName}
                            </span>
                            <span style="padding: 0 10px 0 5px" class="leftSpan">
                                {positionName ? `(${positionName.length > 20 ? `${positionName.substring(0, 20)}...` : positionName})` : ''}
                            </span>
                        </el-tooltip>
                    </span>
                );
            } else {
                return (
                    <span class="elseSpan">
                        {name} ({depCount || 0})人
                    </span>
                );
            }
        },
        // 点击tree组件切换
        async handleNodeClick(data, node) {
            const vm = this;
            vm.departmentName = data.label;
            vm.dataInfo = { ...data, level: node.level };
            // 存储当前节点
            vm.currentNode = node;
            // 部门
            if (data.type === 'department') {
                // 一级部门展示数据统计
                vm.blockName = data.depLevel == '1' ? 'headCompany' : 'DepartmentDetail';
            }
            // 个人
            if (data.type === 'staff') {
                vm.blockName = 'PersonnelDetail';
            }
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
};
</script>

<style lang="scss" scoped>
.main-section {
    overflow: visible;
}
.select {
    height: calc(100% - 100px);
    background-color: red !important;
}
.permission-functionMenu-list {
    width: 100%;
    overflow: hidden;
    padding: 24px;
    .form-content-wrap {
        width: 100%;
        height: 100%;
        background: #ffffff;
        display: flex;
        padding: 32px 40px;
        box-sizing: border-box;
        border-radius: 8px;
        .leftbox {
            box-sizing: border-box;
            height: 100%;
            width: 600px;
            padding-bottom: 0;
            margin-right: 12px;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            box-sizing: border-box;
            display: flex;
            flex-flow: column;
            .search {
                /deep/ .el-input__inner {
                    height: 36px;
                    border-radius: 4px;
                    border: 1px solid #d8dce6;
                    margin: 0 auto;
                    // margin-top: 16px;
                    color: #909399;
                }
            }
            .treeBox {
                padding: 16px 24px 0px 24px;
                padding-right: 0;
                flex: 1;
                overflow: auto;
                .el-tree-node {
                    background: red;
                }
            }
            .buttonAll {
                box-sizing: border-box;
                margin: 24px 24px 0px 24px;
                padding-bottom: 16px;
                border-bottom: 1px solid #dcdfe6;
                .buttons {
                    display: flex;
                    align-items: center;
                    .el-button {
                        width: 96px;
                    }
                    .upload_wrap {
                        margin-right: 16px;
                    }
                }
                .downFile {
                    display: inline-block;
                    line-height: 1;
                    white-space: nowrap;
                    cursor: pointer;
                    background: #fff;
                    border: 1px solid #dcdfe6;
                    color: #606266;
                    -webkit-appearance: none;
                    text-align: center;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    outline: 0;
                    margin: 0;
                    -webkit-transition: 0.1s;
                    -o-transition: 0.1s;
                    transition: 0.1s;
                    font-weight: 500;
                    padding: 12px 20px;
                    font-size: 14px;
                    border-radius: 4px;
                    color: #fff;
                    background-color: #f05259;
                    border-color: #f05259;
                    margin-left: 10px;
                }
            }
        }
        .rightbox {
            height: 100%;
            width: calc(100% - 411px);
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            box-sizing: border-box;
        }
    }
    /deep/ .el-tree {
        font-size: 16px !important;
        min-width: auto !important;
        width: calc(100% - 16px) !important;
    }
    /deep/.tree-expand {
        overflow: hidden !important;
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
    .addbutton {
        margin-right: 11px;
    }
    .removebutton {
        margin-right: 15px;
    }
    .buttonTwo {
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #f05259;
        border-radius: 4px;
        border: 1px solid #f05259;
    }
    .buttonOne {
        margin-right: 16px;
    }
}
/deep/ .dialogCon {
    text-align: center;
}
/deep/ .el-dialog {
    padding: 24px 0 20px 0;
}
/deep/ .el-dialog__header {
    text-align: center;
    padding: 0;
}
/deep/ .el-dialog__title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
}
/deep/ .el-dialog__body {
    text-align: center;
    padding: 0;
    margin: 10px 0 26px 0;
    color: #606266;
}

.bigSpan {
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    .leftSpan {
        color: #909399 !important;
    }
    .rightSpan {
        width: 500px;
    }
}
.elseSpan {
    font-size: 14px;
    :first-child {
        font-weight: 600;
    }
}
.row-box {
    padding: 0 20px;
    margin-top: 16px;
}
</style>
