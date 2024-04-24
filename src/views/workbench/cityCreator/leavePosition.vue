<template>
    <div>
        <div class="form-wrap">
            <div class="fee-info">
                <!-- 表单 -->
                <div class="title">城市合伙人离职审批</div>
                <el-form :model="ruleForm" label-position="top" :rules="rules" ref="ruleForm">
                    <el-row>
                        <el-col :span="6">
                            <!-- <el-form-item v-if="!this.$route.query.id" label="员工姓名:" prop="name" class="title-info">
                        <el-input
                            @focus="selectMember()"
                            v-model="ruleForm.name"
                            :suffix-icon="ruleForm.name ? '' : 'el-icon-user'"
                            placeholder="请选择"
                            class="chooseMan"
                            @clear="handleClear"
                            clearable
                        ></el-input>
                    </el-form-item> -->
                            <el-form-item label="姓名：" prop="name" class="title-info form-input-item">
                                <el-input
                                    @focus="selectMember()"
                                    v-model="ruleForm.name"
                                    :suffix-icon="ruleForm.name ? '' : 'el-icon-user'"
                                    placeholder="请选择"
                                    class="chooseMan"
                                    @clear="handleClear"
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :offset="3">
                            <el-form-item label="工号：" class="title-info form-input-item">
                                <el-input v-model.trim="ruleForm.jobNumber" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="任职信息" class="title-info form-table-item">
                        <el-table style="margin-bottom: 0px" :data="ruleForm.positionList" border :header-cell-style="{ background: '#F5F7FA', fontWeight: 600, color: '#606266' }">
                            <el-table-column label="任职机构" prop="departmentName"></el-table-column>
                            <!-- <el-table-column label="部门" prop="departmentName" show-overflow-tooltip></el-table-column> -->
                            <el-table-column label="任职职务(身兼多职可添加职务)" prop="positionName"></el-table-column>
                            <el-table-column label="职位类型" width="200">
                                <template slot-scope="scope">
                                    <span class="mainPosition" v-if="scope.row.positionTypeName == '主职'">{{ scope.row.positionTypeName }}</span>
                                    <span v-else>{{ scope.row.positionTypeName }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>

                    <el-form-item label="离职类型:" prop="jobTransferType" class="title-info">
                        <el-popover placement="bottom" :width="inputWidth" trigger="focus" @show="handleShow">
                            <div class="leave-option-item" v-for="item in leaveOptions" :key="item.label">
                                <div class="name">{{ item.label }}</div>
                                <el-checkbox-group v-model="ruleForm.jobTransferType">
                                    <el-checkbox v-for="(i) in item.options" :key="i.id" :label="i">{{ i.name }}</el-checkbox>
                                    <!-- -->
                                </el-checkbox-group>
                            </div>
                            <el-input ref="$input" :value="ruleForm.jobTransferType.map(i => i.name).join(',')" slot="reference" placeholder="请选择离职类型"></el-input>
                        </el-popover>
                    </el-form-item>

                    <el-form-item label="离职原因:" class="title-info">
                        <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 6 }" v-model="ruleForm.reason" placeholder="请输入" maxlength="500" show-word-limit></el-input>
                    </el-form-item>

                    <el-form-item label="附件资料:" class="title-info">
                        <uploadFile
                            ref="uploadFile"
                            uploadDesc="(不超过20M，支持word,excle,pdf,jpg,png格式)"
                            :picSize="20480000"
                            :isShowRename="false"
                            :isShowDownload="false"
                            :limitCount="3"
                            :moduleName="moduleName"
                        ></uploadFile>
                    </el-form-item>
                </el-form>

                <div class="pb-12" v-if="!isMainPostion && idNumber">
                    <div class="pb-title">审核流程</div>
                    <!-- 审核流程 -->
                    <div>
                        <audit-process
                            :load.sync="isLoaded"
                            title=""
                            ref="auditProcess"
                            :actions="actions"
                            :afterQuery="afterQuery"
                            url="/new/flowable/todoTask/select"
                            :query="{ nameCode: 37, idNumber}"
                            :overflowLimit="10"
                            custom-class="custom-class"
                            style="width: 100%"
                        ></audit-process>
                    </div>
                </div>
            </div>
        </div>

        <!-- 底部按钮 -->
        <div class="footer foot_btn">
            <el-button @click="back()" class="backtrack add-buttom">返回</el-button>
            <el-button v-if="powerList.resignationApply" @click="submitForm('ruleForm')" type="primary" :loading="isLoading" class="add-buttom">确认</el-button>
        </div>
        <!-- 选择人员 -->
        <tree-select
            :dialogVisible.sync="dialogVisible"
            title="选择人员"
            :expandOnClickNode="false"
            :moduleName="'/systemManage/taskFlow'"
            :listModuleName="'/systemManage/taskFlow'"
            :funcDefaultNode="funcDefaultNode"
            :maxCount.sync="treeSelectMaxCount"
            :opObj="{ selectTree: 'selectOrgTree', selectList: 'listByFuzzyNameNew' }"
            :funcRoleProps="{
                label: 'name',
                value: 'id',
                children: 'children',
                isLeaf: 'leaf',
                disabled: setTreeDisabled,
            }"
            @visibleChanged="
                val => {
                    treeSelectVisable = val;
                }
            "
            @checkedNodeChange="getCheckedNodeList"
        ></tree-select>

        <!-- 操作失败 -->
        <el-dialog class="deleteDialog" append-to-body :lock-scroll="false" :show-close="false" :close-on-click-modal="false" title="提交失败" :visible.sync="showErr" width="30%" center>
            <span>{{ errMsg }}</span>
            <span slot="footer" class="dialog-footer">
                <el-button style="width: 98px" type="primary" @click="resetList()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import AuditProcess from '@/components/AuditProcess';
import TreeSelect from './components/treeSelect/treeSelect.vue';
import uploadFile from '@/components/uploadFile/index.vue';
export default {
    name: 'leavePosition',
    components: { TreeSelect, AuditProcess,uploadFile },
    data() {
        return {
            inputWidth: 0,
            moduleName: '/workbench/BRcityCreator',
            treeSelectMaxCount: 1,
            dialogVisible: false,
            ruleForm: {
                name: '',
                employeeId: '',
                jobTransferDate: '',
                jobTransferType: [],
                reason: '',
                positionList: [],
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '请选择需要离职的员工',
                        trigger: 'change',
                    },
                ],
                jobTransferType: [
                    {
                        required: true,
                        message: '请选择离职类型',
                        trigger: 'change',
                    },
                ],
                jobTransferDate: [
                    {
                        required: true,
                        message: '请选择实际调整日期',
                        trigger: 'blur',
                    },
                ],
            },
            rulesDept: {
                departmentId: [
                    {
                        required: true,
                        message: '请选择部门',
                        trigger: 'blur',
                    },
                ],
                positionId: [
                    {
                        required: true,
                        message: '请选择职位',
                        trigger: 'blur',
                    },
                ],
            },
            op: {
                regularizeInfo: 'regularizeInfo',
                submitCheck: 'submitCheck',
                update: 'regularizationApproval',
                deptPositions: 'deptPositions',
                getIdNumber: 'getIdNumber',
            },

            actions: {
                moduleName: '/workbench/BRcityCreator',
                op: 'flowNode',
            },
            changeIndex: '',
            showDelete: false,
            showPosition: false,
            showAddPosition: false,
            isLoaded: false,
            isLoading: false,
            //部门下拉框
            departmentOption: [],
            positionOptions: [],
            optionProps: {
                value: 'id',
                label: 'departmentName',
                children: 'childList',
                checkStrictly: true,
            },
            ruleFormDept: {
                departmentId: '',
                departmentName: '',
                positionId: '',
                positionName: '',
            },
            entryDate: '',
            showErr: false,
            errMsg: '',
            batchNo: '',
            funcDefaultNode: [],
            checkList: [],
            roleOption: {},
            leaveOptions: [
                {
                    label: '主动原因',
                    options: [],
                },
                {
                    label: '被动原因',
                    options: [],
                },
            ],
            userOrgType:"",
            isSuperAdmin:false,//是否超管
            idNumber:"",
            auditProcessList:[]
        };
    },
    computed: {
        isMainPostion(){
           return [0, 4, 5, 10].includes(this.userOrgType)
        }
    },
    created() {
         //判断是否超管账号
        let { username } = this.$baseMethod.getStore('_ccmUser')
        this.isSuperAdmin = (username == 'wsecar')
        this.roleOption = this.$baseMethod.getStore('roleOption') || {};
        this.userOrgType=this.roleOption.orgType
        this.getIdNumber()
        this.getLeaveOptions();
    },
    methods: {
        // 获取idNumber
        getIdNumber(){
           let { orgType } =  this.roleOption;
           //总部账号不请求此接口（后端暂时不删）
           //后端要求超管使用wsecar判断
          if ([0, 4, 5, 10].includes(orgType) || this.isSuperAdmin){
              return false
           }
           console.log(this.roleOption)
          let data = {
            data: JSON.stringify({ 
              departmentId: this.roleOption.currentDepId,
            }),
            op: this.op.getIdNumber
          }
          this.$axios(this.getModuleUrl(this.op.getIdNumber), data).then((res) => {
            this.idNumber = JSON.parse(res.data)
          })
        },
        //员工岗位查询
        searchPositon(id) {
            let data = {
                data: JSON.stringify({
                    employeeId: id,
                    type: 1,
                }),
                op: 'selectPosition',
            };
            console.log(data);
            this.$axios('/personnel/transfer/select', data).then(res => {
                // positionInfo
                let result = JSON.parse(res.data) || [];
                this.ruleForm.positionList = result;
                this.batchNo = result[0].batchNo;
            });
           
        },
        setTreeDisabled(node, data) {
            return !data.isLeaf;
        },
        //获取离职类型
        getLeaveOptions() {
            let data = {
                op: 'selectReasonOpt',
            };
            this.$axios('/intelligentPersonnel/resignationApply/select', data).then(res => {
                let result = JSON.parse(res.data);
                this.leaveOptions[0].options = result.filter(i => i.resignationType == 1);
                this.leaveOptions[1].options = result.filter(i => i.resignationType == 2);
                console.log(this.leaveOptions);
            });
        },
        //选择人员
        getCheckedNodeList(val) {
            if (val.length) {
                this.funcDefaultNode = val;
                let checkedPerson = val[0];
                this.ruleForm.jobNumber = checkedPerson.code;
                this.ruleForm.employeeId = checkedPerson.employeeId;
                this.ruleForm.name = checkedPerson.name;
                this.searchPositon(checkedPerson.employeeId);
            } else {
                this.handleClear();
            }
        },
        //清除人员
        handleClear() {
            this.funcDefaultNode = [];
            this.ruleForm.jobNumber = '';
            this.ruleForm.name = '';
            this.ruleForm.employeeId = '';
            this.entryDate = '';
            this.ruleForm.positionList = [];
        },
        //选择人员弹框
        selectMember() {
            this.dialogVisible = true;
        },
        handleShow() {
            this.inputWidth = this.$refs['$input'].$el.offsetWidth;
        },

        //重置
        reset() {
            this.searchPositon(this.ruleForm.employeeId);
        },
        afterQuery(list,id){
          this.auditProcessList = _.cloneDeep(list)
        },
        //处理数据
        createdApprovalInfo() {
           let result = [],
            allList = this.$refs.auditProcess.allList;
            this.procdefId = this.$refs.auditProcess.procdefId
            for (let i = 0; i < allList.length; i++) {
                const e = allList[i];
                let userIds = [];
                //memberType = 9 传所有ID，memberType != 9 有新增传新增，无新增传[]
                if(e.memberType !=9){
                  let origin = this.auditProcessList.filter(item=>item.nodeKey == e.nodeKey)[0]
                  if(origin.userInfos.length != e.userInfos.length){
                      e.userInfos.filter(item=>{return origin.userInfos.indexOf(item) == -1}).map(o=>{
                        userIds.push(o.id)
                      })
                  }else{
                    userIds= []
                  }
                }else{
                  for (let j = 0; j < e.userInfos.length; j++) {
                      userIds.push(e.userInfos[j].id);
                  }
                }
                let obj = {
                    nodeKey: e.nodeKey,
                    userIds
                };
                result.push(obj);
            }
            return result;
        },
        //提交申请
        submitForm(formName) {
            // let op = this.$route.query.id ? 'jaoTransferAgain' : 'jaoTransfer';
            console.log(this.$refs.uploadFile.pageFileList,'aa')
            let files = this.$refs.uploadFile.pageFileList.map(item=>{
                return{
                    // id:item.fileId,
                    name:item.fileName,
                    fileUrl:item.fileUrl,
                    fileType:item.fileType
                }
            })
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.checkedApprovaForm()) {
                        let data = {
                            employeeId: this.ruleForm.employeeId,
                            reason: this.ruleForm.reason,
                            resignationTypeIds: this.ruleForm.jobTransferType.map(i => i.id),
                            positionList: this.ruleForm.positionList,
                            procDefId: this.isMainPostion ? null : this.$refs.auditProcess.procdefId,
                            flag: true,
                            approvalInfo: this.isMainPostion ? null : this.createdApprovalInfo(),
                            batchNo: this.batchNo,
                            files
                        };

                        if (!this.isSuperAdmin && !this.isMainPostion && !data.procDefId) {
                            this.$message.error('当前审批未配置工作流，审批发起失败，请联系管理员处理');
                            return;
                        }
                        let opt = {
                            op: 'resignationApply',
                            data: data,
                        };
                        this.isLoading = true;
                        this.$axios(this.getModuleUrl(opt.op), opt)
                            .then(res => {
                                //有新的工作流
                                this.isLoading = false;
                                if (res.code == 1) {
                                    if (res.msg == '001') {
                                        this.$confirm('当前审批配置的工作流规则有更新。确认后，流程区将按新工作流刷新节点。', '提交失败', {
                                            confirmButtonText: '确定',
                                            showCancelButton: false,
                                            closeOnClickModal: false,
                                            showClose: false,
                                            center: true,
                                        }).then(() => {
                                            this.$refs.auditProcess.getFlowable();
                                        });
                                    } else if (res.msg == '任职岗位有变动，确认将刷新') {
                                        this.$confirm('任职岗位有变动，确认将刷新', '提交失败', {
                                            confirmButtonText: '确定',
                                            showCancelButton: false,
                                            closeOnClickModal: false,
                                            showClose: false,
                                            center: true,
                                        }).then(() => {
                                            this.reset();
                                        });
                                    } else {
                                        this.$message.success('提交成功！');
                                        this.$router.push({ path: '/workbench/BRcityCreator' });
                                    }
                                }
                            })
                            .catch(err => {
                                this.isLoading = false;
                            });
                    } else if (!this.isMainPostion && !this.isSuperAdmin) {
                        this.$message.error('还有审批人没选择，请补充完整');
                    }
                } else {
                    return false;
                }
            });
        },
        checkedApprovaForm() {
            if (this.isMainPostion|| this.isSuperAdmin) {
                return true;
            }
            let allList = this.$refs.auditProcess.allList;
            const arr = allList.filter(item => {
                return item.memberType == 3 || item.memberType == 4;
            });
            return arr.every(item => {
                return item.userInfos.length > 0;
            });
        },
        resetList() {
            this.searchPositon(this.ruleForm.employeeId);
            this.showErr = false;
        },
        handleSelectVisible() {
            this.dialogVisible = true;
        },
        back() {
            this.$router.push({
                path: '/workbench/BRcityCreator',
                query: {},
            });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
};
</script>

<style lang="scss" scoped>
.form-wrap {
    // margin-bottom: 64px;
    padding: 0 !important;
    border-radius: 8px;
    background: #fff;
    height: 100%;
    .fee-info {
        background-color: #fff;
        padding: 32px 40px 32px;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 32px;
        margin-top: -3px;
    }
    .pb-12 {
        // padding: 32px 40px 12px;
        .pb-title {
            font-size: 16px;
            font-weight: bold;
            margin: 32px 0 20px 0;
        }
    }

    .title {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 16px;
        color: #303133;
        text-align: center;
    }
    .title-info {
        margin-top: -5px;
        margin-bottom: -14px;
    }
    .el-form {
        margin-top: 32px;
        margin-bottom:50px;
    }
    /deep/.el-form-item__error {
        padding-top: 0px;
    }
    /deep/.el-table {
        margin-bottom: 8px;
        .cell {
            // height: 20px;
        }
        .el-button--medium {
            height: 20px;
            padding: 0;
        }
    }
    /deep/ .el-form-item {
        margin-bottom: 14px !important;
    }
    /deep/.el-form-item__label {
        padding: 0 0 3px 0;
    }
    /deep/ .el-form-item__content {
        margin-bottom: 6px;
    }
    .form-input-item {
        /deep/ .el-form-item__label {
            width: 60px !important;
            text-align: left;
            vertical-align: middle;
            float: left;
        }
        /deep/ .el-form-item__content {
            margin-left: 60px !important;
        }
    }
    .form-table-item {
        position: relative;
        /deep/ .el-form-item__label {
            font-size: 16px;
            font-weight: bold;
            padding: 0 0 7px 0;
            position: absolute;
        }
        /deep/ .el-form-item__content {
            // margin-top:50px;
        }
        &::before {
            clear: both;
        }
    }
}
/deep/.el-date-editor,
/deep/.el-select,
/deep/.el-cascader,
/deep/.el-autocomplete {
    width: 100%;
}
/deep/.el-dialog--center .el-dialog__body {
    text-align: center;
}
.btnBox {
    text-align: right;
    .addBtn {
        background: #ffffff;
        color: #f05259;
        margin-left: 16px;
        margin-bottom: 8px;
    }
}
/deep/ .currency-apply-audit {
    padding: 0;
}
/deep/ .has-gutter .el-table__cell {
    padding: 2px 0;
}
/deep/ .el-table th {
    padding: 2px 0;
}
</style>
<style lang="scss">
.leave-option-item {
    margin-bottom: 16px;
    .name {
        margin-top: 10px;
        margin-bottom: 14px;
    }
}
</style>