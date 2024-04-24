<template>
    <div class="permission-functionMenu-list">
        <div class="form-content-wrap" :style="{ height: scrollerHeight }">
            <div class="leftbox">
                <el-row type="flex" justify="space-between" class="row-box" :gutter="10">
                    <el-col :span="8">
                        <el-select v-model="employeeStatus" style="width: 100%" @change="handleEmployeeStatus">
                            <el-option v-for="item in hierarchyOption" :label="item.label" :value="item.value" :key="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="16">
                        <el-input ref="organizationInput" v-model="selectCount" @input="searchOrg" :disabled="inputFlag" placeholder="请输入两个字以上查询信息" class="search" />
                    </el-col>
                </el-row>
                <div v-loading="loading" class="treeBox">
                    <ws-tree
                        v-if="isRef"
                        ref="tree"
                        node-key="id"
                        :tree-data="treeData"
                        :default-props="defaultProps"
                        :draggable="openSort && sortType == 1"
                        :gen-node-content="genNodeContent"
                        :set-node-expand="setNodeExpand"
                        :lazy="true"
                        :showCheckAll="true"
                        :default-expanded-keys="expandKey"
                        :filter-node-method="filterNode"
                        @load="loadNode"
                        @node-add="handleNodeAdd"
                        @node-delete="showDelete"
                        @node-click="handleNodeClick"
                    />
                </div>
            </div>
            <div class="rightbox">
                <component
                    :key="referch"
                    :ref="blockName"
                    :is="blockName"
                    :department-label="departmentLabel"
                    :department-name="departmentName"
                    :department-type="departmentType"
                    :data-info="dataInfo"
                    @treeNodeHandle="treeNodeHandle"
                    :personnelId="dataInfo.id"
                    :companyTitle="companyTitle"
                    @savePerson="savePerson"
                />
            </div>
            <el-dialog title="删除部门" :visible.sync="dialogVisibleDelect" width="30%" center>
                <p>{{ deleteData.orgType | deleteOrg }}</p>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisibleDelect = false">取 消</el-button>
                    <el-button type="primary" @click="handleNodeDelete(deleteNode, deleteData)">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import DepartmentDetail from './departmentDetail.vue';
import headCompany from './headCompany.vue';
import PersonnelDetail from './personnelDetail.vue';
import wsTree from '@/components/Tree';
import DepartmentAdd from './departmentAdd.vue';
import personDrag from './personDrag.vue';
import { numTransform } from '@/utils/commMethods';
export default {
    components: {
        headCompany,
        DepartmentDetail,
        PersonnelDetail,
        wsTree,
        DepartmentAdd,
        personDrag,
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
            draggable: true, // 拖拽
            moduleName: '/systemManage/organization',
            dataInfo: {},
            children: [],
            resolve: null,
            currentNode: {}, // 当前节点数据
            loading: false,
            currentNodeKey: '',
            isRef: true,
            nodeAOS: [],
            inputFlag: false,
            employeeStatus: 1,
            hierarchyOption: [
                { value: 1, label: '部门' },
                { value: 2, label: '姓名' },
            ],
            expandKey: [0],
            dialogVisibleDelect: false,
            deleteParent: '',
            deleteNode: {},
            deleteData: {},

            sortType: '',
            openSort: false,
            referch: 1,
            companyTitle: '',
            initialPerson:'', //调整人员时默认加载第一个一级id
            depLevel:'', //取消的时候根据这个还原右边的组件
        };
    },
    filters: {
        deleteOrg(val) {
            if (val == 0) {
                return '是否确认删除';
            } else if (val == 4) {
                return '删除该部门后分支机构将自动挂靠在各大区内';
            } else if (val == 5) {
                return '删除该部门后分支机构将自动挂靠在公海大区内';
            }
        },
    },
    computed: {
        scrollerHeight: function () {
            return this.blockName === 'PersonnelDetail' || this.blockName === 'headCompany' || this.dataInfo.depType === 2 || this.blockName === 'personDrag' ? '100%' : 'calc(100% - 60px)';
        },
    },
    methods: {
        // =============================================================   数据请求   =================================================================================
        // tree 懒加载
        async loadNode(node, resolve) {
            if (node.level === 0) {
                // 保存loadNode的数据处理promise函数
                this.resolve = resolve;
                this.treeNode = node;
                // 初始化tree时禁止用户输入，防止用户利用防抖时间差输入内容造成初始化服务响应过慢而覆盖搜索出内容
                this.inputFlag = true;
                const arr = await this.getTreeData('0', '0');
                this.inputFlag = false;
                this.$nextTick(() => {
                    this.$refs['organizationInput'].focus();
                });
                resolve(arr);
            }

            // level === 1 加载二级菜单
            if (node.level === 1) {
                let childrenData;

                if (this.selectCount != '') {
                    // this.selectCount != "" 走加载三级菜单方法
                    childrenData = await this.getTreeData(node.data.id);
                } else {
                    // 走二级菜单加载方法【原因：后端返回数据连同1/2级数据都返回，需要处理分段加载】
                    childrenData = this.children;
                    childrenData.forEach(item => {
                        if (item.orgType == 5) {
                            item.leaf = false;
                        }
                    });
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
                    op: 'selectHeadDeptList',
                };
                const url = this.getModuleUrl(param.op);
                url && type < 2;
                const res = await this.$axios(url, param);
                let list;
                // this.loading = false;
                if (res.code == 1) {
                    type === '0' && (this.treeNode.childNodes = []);
                    const result = JSON.parse(res.data);
                    list = type === '0' ? this.firstTree([result]) : this.childrenHandle(result);
                    if (id == 0) {
                        this.companyTitle = result.depDesc;
                        this.initialPerson = result.deptChild[0]
                    }
                } else {
                    list = [];
                }
                return list;
            } catch (err) {
                // this.loading = false;
                return [];
            }
        },

        //模糊搜索
        searchOrg: $vuex.$baseMethod.debounce(function (val) {
            if (val.length == 1) {
                return;
            }
            this.loading = true;
            if (val) {
                const param = {
                    data: { orgType: null, name: val, queryType: this.employeeStatus, depType: 1 },
                    op: 'selectTreeIdList',
                };
                this.$axios(this.getModuleUrl(param.op), param).then(res => {
                    let data = JSON.parse(res.data);
                    if (data.length <= 0) {
                        setTimeout(() => {
                            this.$refs.tree.filter('  @');
                            this.loading = false;
                        }, 1500);
                    } else {
                        this.expandKey = data;
                        setTimeout(() => {
                            this.$refs.tree.filter(val);
                            this.loading = false;
                        }, 2500);
                    }
                });
            } else {
                this.expandKey = [0];
                this.isRef = false;
                this.loading = false;
                setTimeout(() => {
                    this.isRef = true;
                }, 1);
            }
        }, 400),

        // =============================================================   数据处理   =================================================================================
        filterNode(value, data) {
            if (!value) return true;
            if (this.employeeStatus == 1) return data.name.indexOf(value) !== -1 && data.type == 'department';
            if (this.employeeStatus == 2) return data.name.indexOf(value) !== -1 && data.type == 'staff';
        },
        firstTree(list) {
            const data = list.map(item => {
                const { userList, deptChild } = item;

                //处理打开拖拽状态 不展示人员
                if (this.openSort) {
                    this.children = deptChild || [];
                } else {
                    this.children = [...(userList || []), ...(deptChild || [])];
                }

                // 处理子数据，区分部门和员工
                this.children.forEach(item => {
                    item.type = item.depLevel && item.depLevel !== null ? 'department' : 'staff';
                });
                item.banDelete = true;
                item.type = 'department';

                //处理打开拖拽状态 不展示按钮
                if (this.openSort) {
                    return {
                        ...item,
                        banDelete: true,
                        banAdd: true,
                        type: 'department',
                    };
                } else {
                    return {
                        ...item,
                        banDelete: true,
                        type: 'department',
                    };
                }
            });
            data[0].deptChild.forEach(item => {
                //处理打开拖拽状态
                if (this.openSort) {
                    item.banDelete = true;
                    item.banAdd = true;
                } else {
                    if (item.pubFlag == 1) {
                        item.banDelete = true;
                    }
                }
            });
            return data;
        },

        childrenHandle(data) {
            const { deptChild, userList } = data;
            //处理打开拖拽状态
            let childrenData = [];
            if (this.openSort) {
                childrenData = deptChild || [];
            } else {
                childrenData = [...(userList || []), ...(deptChild || [])];
            }
            childrenData.forEach(item => {
                item.type = item.depLevel && item.depLevel !== null ? 'department' : 'staff';
                if (item.pubFlag == 1) {
                    item.banAdd = true;
                    item.banDelete = true;
                }

                if (item.orgType == 5) {
                    item.banAdd = true;
                }
                //处理打开拖拽状态
                if (this.openSort) {
                    item.banAdd = true;
                    item.banDelete = true;
                }
            });
            return childrenData;
        },

        // =============================================================   节点点击事件   =================================================================================
        setNodeExpand(node, data) {
            this.$nextTick(() => {
                this.dataInfo = data;
            });
            return data.type !== 'staff' && data.depType < 2;
        },

        handleNodeAdd(node, data) {
            this.dataInfo = data;
            this.departmentLabel = numTransform(data.depLevel);
            this.departmentName = data.name;
            this.depLevel = data.depLevel
            this.departmentType = data.orgType.toString();
            this.blockName = 'DepartmentAdd';
        },

        // 添加/修改 部门
        treeNodeHandle(data, type) {
            switch (type) {
                case 'add':
                    // 拿到组件节点
                    const node = this.$refs.tree.$refs.tree;

                    if (this.currentNode.level < 2) {
                        // 添加 < 2级部门整体刷新tree树
                        this.isRef = false;
                        setTimeout(() => {
                            this.isRef = true;
                        }, 1);
                    } else {
                        // 添加 2> 级部门，刷新点击节点
                        this.currentNode.loaded = false;
                        this.currentNode.isLeaf = false;
                        this.$set(this.currentNode, 'expanded', false);
                        this.currentNode.expand();
                    }

                    this.blockName = 'DepartmentDetail';
                    this.$nextTick(() => {
                        this.dataInfo = data;
                        node.setCurrentKey(data.id);
                    });
                    break;

                case 'edit':
                    if (this.currentNode.level <= 2) {
                        // 添加 < 2级部门整体刷新tree树
                        this.isRef = false;
                        setTimeout(() => {
                            this.isRef = true;
                        }, 1);
                    } else {
                        // 同步tree中当前点击节点数据
                        this.currentNode.data = {
                            ...this.currentNode.data,
                            ...data,
                        };
                    }
                    this.$nextTick(() => {
                        this.dataInfo = data;
                    });
                    break;
                case 'refresh':
                    this.isRef = false;
                    setTimeout(() => {
                        this.isRef = true;
                    }, 300);
                    this.$nextTick(() => {
                        this.dataInfo = data;
                    });
                    break;
            }
        },

        showDelete(node, data) {
            this.deleteParent = node.parent.data.name;
            this.deleteNode = node;
            this.deleteData = data;
            this.dialogVisibleDelect = true;
        },
        // 节点删除事件
        handleNodeDelete(node, data) {
            this.loading = true;
            const { id, orgType } = data;
            const param = {
                data: { id, orgType },
                op: 'deleteOrganizational',
            };
            this.$axios(this.getModuleUrl(param.op), param)
                .then(res => {
                    this.loading = false;
                    const parent = node.parent;
                    const childNodes = parent.childNodes || [];
                    const index = childNodes.findIndex(d => (d.data || {}).id === id);
                    childNodes.splice(index, 1);
                    this.$message.success('删除成功');
                    this.dialogVisibleDelect = false;
                    this.blockName = 'headCompany';
                    if (orgType == 5) {
                        this.isRef = false;
                        setTimeout(() => {
                            this.isRef = true;
                        }, 1);
                    }
                })
                .catch(() => {
                    this.loading = false;
                });
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
            this.departmentName = data.label;
            this.dataInfo = { ...data, level: node.level };
            // 存储当前节点
            this.currentNode = node;
            // 部门
            if (data.type === 'department') {
                // 一级部门展示数据统计
                this.blockName = data.depLevel == '1' ? 'headCompany' : this.openSort && this.sortType == 2 ? 'personDrag' : 'DepartmentDetail';
            }
            // 个人
            if (data.type === 'staff') {
                this.blockName = 'PersonnelDetail';
            }

            if(this.blockName === 'personDrag') this.sortPerson(data.id)
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
        // =============================================================   导入/导出   =================================================================================
        // 导出数据
        async fileImport() {
            // 导出
            const param = {
                op: 'exportOrganizationalData',
            };
            this.$axios(this.getModuleUrl('exportOrganizationalData'), param).then(res => {
                this.$message.success('文件正在生成，请稍后到文件下载界面进行下载');
            });
        },
        // 导出模板
        templeteImport() {
            this.download('../form.xlsx', '组织架构部门表.xlsx');
        },

        // 批量导入,文件上传请求
        httpRequest(options) {
            const formData = new FormData();
            const token = this.$baseMethod.getStore('_ccmUser').token;
            formData.append('file', options.file);
            formData.append('op', 'batchOrganizationalImport');
            formData.append('token', token);
            this.$upLoad(this.getModuleUrl('batchOrganizationalImport'), formData).then(res => {
                this.$message.success('批量导入成功,请至文件下载处查看导入结果');
            });
        },
        // 限制文件上传的个数
        onChange(file, list) {
            if (list.length > 1 && file.status !== 'fail') {
                list.splice(0, 1);
            } else if (file.status === 'fail') {
                this.$message.error('上传失败，请重新上传！');
                list.splice(0, 1);
            }
        },
        // 上传之前限制文件格式
        beforeUp(file) {
            const isLt = file.size / 1024 / 1024 < 3;
            if (!isLt) {
                this.$message.error('上传文件大小不能超过 3M!');
            }
            return isLt;
        },

        // 文件下载
        download(url, filename) {
            return fetch(url).then(res =>
                res.blob().then(blob => {
                    const a = document.createElement('a');
                    const url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = filename;
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
            );
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },

        sortBack() {
            this.expandKey = [0]
            this.isRef = false;
            this.loading = true;
            this.blockName = 'headCompany';
            setTimeout(() => {
                this.isRef = true;
                this.$refs[this.blockName].drawRoundChart();
                this.loading = false;
            }, 300);
            this.openSort = !this.openSort;
        },
        //调整人员排序 点击每个部门的查询直属人员
        async sortPerson(id) {
            const param = {
                data: JSON.stringify({id}),
                op: 'selectUserList',
            };
            try {
                const res = await this.$axios(this.getModuleUrl(param.op), param)
                const data = JSON.parse(res.data)
                this.dataInfo.userList = data.userByDeptVoList || []
                this.dataInfo.deptFullName = data.deptFullName
                this.dataInfo.deptFullIds = data.deptFullIds
                this.referch = Date.now()
            } catch (error) {
            }
        },
        //调整人员完成后的保存
        async savePerson(e,val) {
            if (e == 2) {
                const param = {
                    data: JSON.stringify({udpList:val}),
                    op: 'reorderUser',
                };
                try {
                    const res = await this.$axios(this.getModuleUrl(param.op), param)
                    if(res.code == 1) {
                        this.$message.success('调整成功')
                        this.sortBack()
                        // this.expandKey = this.dataInfo.deptFullIds
                    }
                } catch (error) {
                    
                }
            } else {
                this.sortBack()
            }   
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
            min-width: 480px;
            width: 40%;
            padding-bottom: 0;
            margin-right: 12px;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            box-sizing: border-box;
            display: flex;
            flex-flow: column;
            .search {
                // padding: 0 24px;
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
                margin: 24px;
                .buttons {
                    display: flex;
                    align-items: center;
                    justify-content: right;
                    .el-button {
                        width: 96px;
                    }
                    .upload_wrap {
                        margin-right: 16px;
                    }
                }
                .btnSave {
                    display: flex;
                    justify-content: center;
                    .el-button {
                        width: 160px;
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

            width: 60%;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            box-sizing: border-box;
        }
    }
    /deep/ .el-tree {
        font-size: 16px !important;
        min-width: 100%;
        // width: calc(100% - 16px) !important;
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
    padding: 24px 20px 20px 20px;
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
