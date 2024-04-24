<template>
    <div class="rb-box">
        <div class="rb-table">
                <p class="moduleTitle">部门权限配置</p>
                <el-form ref="form" :model="deptInfo" label-width="185px" class="rb-person-form" style="margin-bottom:30px;">
                    <el-form-item label="允许部门成员建群：">
                        <el-input v-model="deptInfo.allowStr" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="隐藏本部门：">
                        <el-input :value="deptInfo.hideStr" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="限制本部门成员查看通讯录：">
                        <el-input :value="deptInfo.astrictStr" disabled></el-input>
                    </el-form-item>
                </el-form>
                <p class="moduleTitle">部门成员</p>
                <el-table
                    v-loading="empLoading"
                    :data="empList"
                    style="width: 100%"
                    :border="true"
                    row-key="id"
                    :header-cell-style="{'font-size':'14px','color':'#606266','background-color':'#F5F7FA' }"
                    v-if="oaPowerList.selectEmpList && empList.length > 0"
                >
                    <el-table-column width="80px" label="序号" type="index"/>
                    <el-table-column prop="name" label="姓名"/>
                    <el-table-column prop="positionName" label="职位"/>
                    <el-table-column prop="code" label="工号"/>
                    <el-table-column label="个人权限">
                        <template slot-scope="scope">
                            <div class="updateBox">
                                <el-button type="text" style="color: #0088ff" @click="handleUpdate(scope.row)" v-if="oaPowerList.updateEmp">设置</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table 
                    v-loading="empLoading"
                    :data="empList"
                    style="width: 100%"
                    :border="true"
                    row-key="id"
                    :header-cell-style="{'font-size':'14px','color':'#606266','background-color':'#F5F7FA' }"
                    class="empTable"
                    v-else
                >
                    <el-table-column width="80px" label="序号" type="index"/>
                    <el-table-column prop="name" label="姓名"/>
                    <el-table-column prop="positionName" label="职位"/>
                    <el-table-column prop="code" label="工号"/>
                    <el-table-column label="个人权限">  
                    </el-table-column>
                </el-table>
        </div>
        <!-- 员工详情 -->
        <!-- <rightForm v-show="showPersonForm" :options="empRowData" /> -->
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import DragRow from './DragRow.vue';
const staticType = [
    ['关','开'],
    ["关",'开(向所有人和部门隐藏)','开(允许指定部门可见)'],
    ["关",'开(只可见本部门)','开(只可见所在部门及下级部门)','开(所在一级部门全部下属部门)','开(只能看到指定部门)']
]
export default {
    name: 'rightTable',
    components: { draggable, DragRow },
    props: {
        currentNode: {
            type: Object,
            default: () => {}
        }
    },

    data() {
        return {
            moduleName: '/telephoneManage',
            title: '万顺叫车技术有限公司',
            deptData: [], //返回的部门数据
            deptList: [], //渲染部门数据
            // 列表请求参数
            empList: [],
            empData: [],
            showPersonForm: false,
            empRowData: null,
            Sortable: null,
            deptId: '',
            empLoading: false,
            deptLoading: false,
            deptInfo:{
                allowStr:"",
                hideStr:"",
                astrictStr:""
            }
        };
    },
    watch: {
        currentNode: {
            handler(val) {
                this.empLoading = false;
                this.deptLoading = false;
                this.fetchAllData(val.id);
                this.deptId = val.id;
            }
        },
        deep: true,
        immediate: true
    },
    created() {
        this.fetchAllData(0);
    },
    methods: {
        fetchAllData(id) {
            // this.fetchDeptData(id);
            this.fetchEmpData(id);
            this.fetchDeptInfo(id)
        },
        // async fetchDeptData(nodeId) {
        //     //点击获取下级部门
        //     this.deptLoading = true;
        //     const param = {
        //         data: { id: nodeId },
        //         op: 'selectChildDept'
        //     };
        //     const res = await this.$axios(this.getModuleUrl(param.op), param);
        //     this.deptLoading = false;
        //     let deptsData = JSON.parse(res.data);
        //     this.$emit('update-title', deptsData);
        //     this.handlerDeptData(deptsData);
        // },
        async fetchDeptInfo (id) {
            const param = {
                data: {
                    id: id,
                },
                op: 'deptDetail',
            }
            try {
                const res = await this.$axios('/authority/contacts/select', param)
                let result = JSON.parse(res.data)
                const {allowCreateGroup,hideDept,astrictMemberSet} = result
                this.deptInfo.allowStr = staticType[0][allowCreateGroup] || '开'
                this.deptInfo.hideStr = staticType[1][hideDept]
                this.deptInfo.astrictStr = staticType[2][astrictMemberSet]
            } catch (error) {

            }
        },
        handlerDeptData(data) {
            //部门数据处理
            const { childList = [] } = data;
            //保存全部部门
            this.deptData = this.$baseMethod.deepClone(childList);
            //截取前10位
            this.deptList = (this.deptData || [])
        },
        async fetchEmpData(nodeId) {
            //获取部门人员
            this.empLoading = true;
            const param = {
                data: { id: nodeId },
                op: 'selectEmpList'
            };
            const res = await this.$axios(this.getModuleUrl(param.op), param);
            this.empLoading = false;
            let empsData = JSON.parse(res.data);
            this.handlerEmpData(empsData);
        },
        handlerEmpData(data) {
            //人员数据处理,如部门
            const { empList = [] } = data;
            this.empData = this.$baseMethod.deepClone(empList);
            this.empList = (this.empData || [])
        },
        clickToChildDept(row) {
            //切换到下级部门
            this.fetchAllData(row.id);
        },
        handleUpdate(row) {
            this.$emit('clickToEmpDetail', row);
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    }
};
</script>

<style lang="scss" scoped>
/deep/.empTable .el-table__body {
    height: 122px;
    margin-top: 90px;
    background: url('../../../../../assets/images/default-table-content.png') no-repeat;
    background-position:center;
}
/deep/ .empTable .el-table__empty-block {
    margin-bottom: 42px;
}
.rb-box {
    .moduleTitle {
        font-size: 16px;
        color:#303133;
        font-weight: 600;
        margin-bottom: 16px;
    }
    /deep/ .el-form-item__label {
        padding: 0 !important;
        font-weight: 500;
    }
    .rb-table-box {
        
        .rb-table-title {
            width: 100%;
            height: 46px;
            line-height: 46px;
            font-size: 16px;
            font-weight: 500;
            background: #f8f8f8;
            border-radius: 4px;
            padding: 0 16px;
            .rb-table-btn {
                float: right;
                // color: #0088FF;
                font-size: 14px;
            }
        }
        .rb-table-tip {
            text-align: center;
        }
        .rb-table-list {
            .rb-table-item {
                height: 36px;
                line-height: 36px;
                padding: 0 16px;
                cursor: pointer;
                display: flex;
                .list-name {
                    flex: 1;
                }

                &:hover {
                    background: #f5f7fa;
                }
            }
        }
        .showBtn {
            color: #0088ff;
            padding-left: 16px;
        }
        .rb-icon {
            height: 36px;
            line-height: 36px;
        }
        .updateBox{
            height:40px;
            line-height: 40px;
            padding-left: 10px;
            border: 1px solid rgb(220, 223, 230);
            border-radius: 4px;
        }
    }
    .el-switch__label {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #909399;
    }
}
</style>
