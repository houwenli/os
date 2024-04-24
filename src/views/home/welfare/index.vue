<template>
    <div>
        <div class="cardcoupon-apply">
            <el-form ref="basicInfo" label-position="right" label-width="8rem" :model="formData" :rules="rules">
                <div class="currency-apply-title">申请详情</div>
                <el-row type="flex" justify="space-between">
                    <el-col :span="7">
                        <el-form-item prop="agencyName" label="领取部门：">
                            <el-input v-model.trim="formData.agencyName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item prop="applyNum" label="申领数量：">
                            <el-input v-model.trim="formData.applyNum" maxlength='8' placeholder="整数，[1-10000000]"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item prop="applyMoney" label="申领福卡金额：">
                            <el-input v-model.trim="formData.applyMoney" maxlength='6' placeholder="整数，[1-100000]"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <!-- 审核流程 -->
        <div v-if="actions" style="margin-bottom: 64px; margin-top: 16px">
            <audit-process v-if='flowPart' title="审核流程" ref="auditProcess" :actions="actions" :query="{ nameCode: this.couponType }" :overflowLimit="10" custom-class="custom-class"></audit-process>
        </div>

        <!-- 底部按钮 -->
        <footer-fixed backTo="index">
            <ws-throttle>
                <el-button type="primary" style="width: 160px; height: 40px" @click="submitForm()">提交审核</el-button>
            </ws-throttle>
        </footer-fixed>

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
import FooterFixed from '../components/FooterFixed';
import AuditProcess from '@/components/AuditProcess';
// import travelCoupon from './components/travelCoupon'; // 出行券配置申请
// import envelopesCoupon from './components/envelopesCoupon'; // 红包配置申请
// import addentityCard from './components/addentityCard'; // 新增实体卡申请
// import receiveentityCard from './components/receiveentityCard'; // 领取实体卡申请

export default {
    name: 'currencyApply',
    components: { FooterFixed, AuditProcess },

    data() {
        return {
            couponType: 43,
            formData: {
                agencyName: '',
                applyNum: '',
                applyMoney: '',
                agencyNumber: '',
                deptFullName: '',
            },
            actions: {
                moduleName: '/index/todo',
                op: 'flowNode',
            },
            flowPart: true,
            op: 'insertActivityFuKaGrant',
            moduleName: '/welfareApply',
            rules: {
                agencyName: [{ required: true, message: '请输入领取部门', trigger: 'blur' }],
                applyNum: [
                    { required: true, message: '请输入申领数量', trigger: 'blur' },
                    {
                        pattern: /^(?:[1-9][0-9]{0,6}|10000000)$/,
                        message: '请输入1-10000000（1000万）',
                        trigger: 'blur',
                    },
                ],
                applyMoney: [
                    { required: true, message: '请输入申领福卡金额', trigger: 'blur' },
                    {
                        pattern: /^(?:[1-9][0-9]{0,4}|100000)$/,
                        message: '请输入1-100000（10万）',
                        trigger: 'blur',
                    },
                ],
            },
            errMsg: '',
            showErr: false,
        };
    },
    created() {
        this.getDutyList();
        console.log(this.actions);
    },
    methods: {
        getDutyList() {
            let data = {
                op: 'employPositionDetail',
            };
            this.$axios('/authority/personalCenter/select', data).then(res => {
                let duty = JSON.parse(res.data).filter(i => {
                    return i.type == 1;
                });
                this.formData.agencyName = duty[0].deptName;
                this.formData.agencyNumber = duty[0].agencyNumber;
                this.formData.deptFullName = duty[0].deptFullName;
            });
        },
        //提交
        submitForm() {
            let vm = this;
            let from = vm.$refs['basicInfo'];
            from.validate(valid => {
                if (valid) {
                    if (this.checkedApprovaForm()) {
                        this.formData.applyNum = this.formData.applyNum * 1;
                        let opt = {
                            data: {
                                nameCode: this.couponType,
                                procDefId: this.$refs.auditProcess.procdefId,
                                approvalInfo: this.createdApprovalInfo(),
                                nodeFormJson: JSON.stringify({ ...this.formData, applyMoney: this.formData.applyMoney * 100 }),
                                flag: true,
                            },
                            op: this.op,
                        };
                        if (!opt.data.procDefId) {
                            this.$message.error('当前审批未配置工作流，审批发起失败，请联系管理员处理');
                            return;
                        }
                        this.$axios(this.getModuleUrl(opt.op), opt)
                            .then(res => {
                                //提交成功
                                if (res.code == 1 && res.msg == '响应成功') {
                                    this.$router.replace({ path: '/applySuccess' });
                                } else if (res.code == 1 && res.msg == '001') {
                                    this.$confirm('当前审批配置的工作流规则有更新。确认后，流程区将按新工作流刷新节点。', '提交失败', {
                                        confirmButtonText: '确定',
                                        showCancelButton: false,
                                        closeOnClickModal: false,
                                        showClose: false,
                                        center: true,
                                    }).then(() => {
                                        this.$refs.auditProcess.getFlowable();
                                    });
                                } else {
                                    this.errMsg = res.msg;
                                    this.showErr = true;
                                }
                            })
                            .catch(res => {});
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
        createdApprovalInfo() {
            let allList = this.$refs.auditProcess.allList;
            return allList.map((items, i) => {
                return {
                    nodeKey: items.nodeKey,
                    userIds: items.userInfos
                        .filter((item, j) => {
                            return item.id && !item.isDefUser;
                        })
                        .map(item => {
                            return item.id;
                        }),
                };
            });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        resetList() {
            this.showErr = false;
            this.$refs.auditProcess.getFlowable();
        },
    },
};
</script>

<style lang="scss" scoped>
.cardcoupon-apply {
    background: #ffffff;
    border-radius: 8px;
    padding: 32px 40px 8px 40px;
}
.currency-apply-title {
    width: 80px;
    height: 28px;
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 16px;
    margin-top: 32px;
}
</style>
