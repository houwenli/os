<template>
    <!-- 发起离职审批 -->
    <div class="form-wrap">
        <div class="fee-info">
            <el-form :model="baseInfo" :rules="rules" ref='ruleForm' class="ruleForm">
                <div class="title">
                    <span>离职申请</span>
                    <span class='tips'>注意：离职成功后，当前账号的所有职务将被清除，且无法正常登录。</span>
                </div>
                <div class="detail">
                    <el-form-item label="入职日期：">
                        <el-input v-model="baseInfo.enterDate" placeholder="入职日期" style="width: 100%" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="任职岗位：" class="labelLeft">
                    </el-form-item>
                    <el-table :data="baseInfo.positionList" border :header-cell-style="{ background: '#F5F7FA',fontWeight:600,color:'#606266' }" style="width: 100%;margin-bottom:16px;">
                        <el-table-column label="序号" type="index" width="100"></el-table-column>
                        <el-table-column label="组织架构类型" prop="departmentTypeName"></el-table-column>
                        <el-table-column label="部门" prop="departmentName" show-overflow-tooltip></el-table-column>
                        <el-table-column label="职位" prop="positionName"></el-table-column>
                        <el-table-column label="职位类型">
                            <template slot-scope="scope">
                                <span class='mainPosition' v-if="scope.row.positionTypeName == '主职'">{{ scope.row.positionTypeName }}</span>
                                <span v-else>{{ scope.row.positionTypeName }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-form-item label="预计离职日期：" prop="plannedResignationDate">
                        <el-date-picker v-model="baseInfo.plannedResignationDate" style="width: 100%" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="年/月/日"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="离职原因：" prop="reasonIds">
                        <el-select v-model="baseInfo.reasonIds" multiple collapse-tags ref="reasonSelect" style="width: 100%" placeholder="请选择离职原因(多选)">
                            <el-option v-for="item in reasonIdsOption" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="离职原因备注：">
                        <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 6 }" v-model.trim="baseInfo.remark" placeholder="请输入离职备注" maxlength="500" show-word-limit style="width: 100%"></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="fee-info" style="margin-bottom:64px;padding-bottom:5px;">
            <div class="title">
                <span>流程</span>
            </div>
            <div class="detail">
                <audit-process :load.sync="isLoaded" title="" ref="auditProcess" :actions="actions" :query="{ nameCode: $route.query.id }" :overflowLimit="10" custom-class="custom-class"></audit-process>
            </div>
        </div>

        <!-- 按钮 -->
        <ws-footer>
            <el-button @click="onBack">取消</el-button>
            <el-button v-if="getModulePower('/index/todo').personPermissionApply" type="primary" @click="save()">提交审核</el-button>
        </ws-footer>

        <!-- 操作失败 -->
        <el-dialog class="deleteDialog" append-to-body :lock-scroll="false" :show-close='false' :close-on-click-modal="false" title="提交失败" :visible.sync="showErr" width="30%" center>
            <div style="text-align:center;">{{errMsg}}</div>
            <span slot="footer" class="dialog-footer">
                <el-button style="width: 98px" type="primary" @click="resetList()">确定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
import AuditProcess from '@/components/AuditProcess';

export default {
    name: 'quitApply',
    components: {
        AuditProcess
    },
    data() {
        return {
            moduleName: '/quitApply',
            baseInfo: {
                enterDate: '',
                employeeId: '',
                plannedResignationDate: '',
                reasonIds: [],
                remark: '',
                positionList: []
            },
            // 表单验证
            rules: {
                plannedResignationDate: [
                    {
                        required: true,
                        message: '请选择时间',
                        trigger: 'blur'
                    }
                ],
                reasonIds: [
                    {
                        required: true,
                        message: '请选择离职原因',
                        trigger: 'change'
                    }
                ]
            },
            dialogVisible: false,
            isLoaded: false,
            actions: {
                moduleName: '/index/todo',
                op: 'flowNode'
            },
            value: '',
            treeSelectMaxCount: 1,
            dialogVisible: false,
            reasonStr: '',
            //离职原因下拉
            reasonIdsOption: [],
            batchNo: '',
            showErr: false,
            errMsg: ''
        };
    },
    created() {
        this.getReasonIds();
        this.baseInfo.employeeId = this.$baseMethod.getStore('_ccmUser').employeeId;
        this.searchPositon(this.$baseMethod.getStore('_ccmUser').employeeId);
    },
    methods: {
        //员工岗位查询
        searchPositon(employeeId) {
            let opt = {
                data: {
                    employeeId: employeeId,
                    type: 1
                },
                op: 'selectPosition'
            };
            this.$axios('/personnel/transfer/select', opt).then(res => {
                this.baseInfo.positionList = JSON.parse(res.data);
                if (JSON.parse(res.data).length > 0) {
                    this.baseInfo.enterDate = JSON.parse(res.data)[0].entryDate;
                    this.batchNo = JSON.parse(res.data)[0].batchNo;
                }
            });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        //获取离职原因下拉
        getReasonIds() {
            const param = {
                op: 'selectReasonOpt'
            };
            this.$axios('/intelligentPersonnel/resignationApply/select', param).then(res => {
                let reason = JSON.parse(res.data);
                this.reasonIdsOption = reason.filter(item => {
                    return item.resignationType == 1;
                });
            });
        },
        //提交审批
        save() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    if (this.checkedApprovaForm()) {
                        let param = {
                            data: {
                                employeeId: this.baseInfo.employeeId,
                                plannedResignationDate: this.baseInfo.plannedResignationDate,
                                reasonIds: this.baseInfo.reasonIds,
                                remark: this.baseInfo.remark,
                                dataSource: 1,
                                procDefId: this.$refs.auditProcess.procdefId,
                                flag: true,
                                approvalInfo: this.createdApprovalInfo(),
                                batchNo: this.batchNo
                            },
                            op: 'resignationApply'
                        };
                        if (!param.data.procDefId) {
                            this.$message.error('当前审批未配置工作流，审批发起失败，请联系管理员处理');
                            return;
                        }
                        this.$axios(this.getModuleUrl('resignationApply'), param)
                            .then(res => {
                                if (res.code == 1 && res.msg == '响应成功') {
                                    this.$router.replace({ path: '/applySuccess' });
                                } else if(res.code == 1 && res.msg == '001'){
                                    this.$confirm('当前审批配置的工作流规则有更新。确认后，流程区将按新工作流刷新节点。', '提交失败', {
                                        confirmButtonText: '确定',
                                        showCancelButton:false,
                                        closeOnClickModal:false,
                                        showClose:false,
                                        center: true
                                    }).then(() => {
                                        this.$refs.auditProcess.getFlowable();
                                    });
                                }else{
                                    this.errMsg = res.msg;
                                    this.showErr = true;
                                }
                            })
                    } else {
                        this.$message.error('还有审批人没选择，请补充完整');
                    }
                }
            });
        },
        checkedApprovaForm() {
            let allList = this.$refs.auditProcess.allList;
            const arr = allList.filter(item => {
                return item.memberType == 3 || item.memberType == 4;
            });
            return arr.every(item => {
                return item.userInfos.length > 0;
            });
        },
        //处理数据
        createdApprovalInfo() {
            let allList = this.$refs.auditProcess.allList;
            return allList.map((items, i) => {
                return {
                    nodeId: items.nodeKey,
                    userIds: items.userInfos
                        .filter((item, j) => {
                            return item.id && !item.isDefUser;
                        })
                        .map(item => {
                            return item.id;
                        })
                };
            });
        },
        resetList() {
            this.showErr = false;
            this.searchPositon(this.$baseMethod.getStore('_ccmUser').employeeId);
        },

        onBack() {
          this.$router.push({
            name: "index"
          })
        }
    }
};
</script>

<style lang="scss" scoped>
/deep/.el-form-item__label {
    font-weight: 500;
}
.form-wrap {
    margin-bottom: 64px;
    padding: 0 !important;
    .fee-info {
        background-color: #fff;
        padding: 32px 40px 27px;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 32px;
        h2 {
            text-align: center;
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            margin: 20px 0;
        }
        .title {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            margin-bottom: 16px;
            .tips{
                color: #F05259;
                font-size:14px;
                font-weight: 500;
                margin-left:20px ;
            }
        }
        .detail {
            ::v-deep .ws-table-warp {
                min-height: 100px;
                padding-top: 4px !important;
                padding-bottom: 0 !important;
                .pagination-warp {
                    padding-bottom: 0;
                    height: auto;
                }
            }
            .ws-table__wrapper ::v-deep .option-box {
                margin-bottom: 0px !important;
            }
            .inline-block {
                margin-right: 80px;
                margin-top: 30px;
                .label {
                    display: inline-block;
                    text-align: right;
                    margin-right: 15px;
                    min-width: 124px !important;
                    height: 40px;
                    line-height: 40px;
                }
                .text {
                    display: inline-block;
                    margin-right: 5px;
                    line-height: 40px;
                    word-wrap: break-word;
                }
            }
        }
    }
}

/deep/.currency-apply-audit {
    padding: 0;
}
/deep/.el-form-item {
    margin-bottom: 8px !important;
}
.mainPosition{
    color: orange;
    background: #FDF6EC;
    border-radius:4px ;
    padding:0 4px;
}
.el-message-box--center .el-message-box__message{
    font-size: 14px;
}
</style>
