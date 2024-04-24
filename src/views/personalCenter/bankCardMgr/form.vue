<template>
    <div class="bigBox">
        <div class="contentBox">
            <div class="title">银行卡信息</div>
            <div class="formAll">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" :disabled="routeQuery.type=='detail'">
                    <el-row type="flex" justify="space-between">
                        <el-col :span="7">
                            <el-form-item label="姓名" prop="accountName">
                                <el-input v-model.trim="ruleForm.accountName" :disabled="routeQuery.type=='edit'" placeholder="请输入持卡人姓名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="身份证号" prop="idCardNum">
                                <el-input v-model.trim="ruleForm.idCardNum" :disabled="routeQuery.type=='edit'" placeholder="请输入持卡人身份证号"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="银行卡号" prop="bankCard">
                                <el-input v-model.trim="ruleForm.bankCard" placeholder="请输入银行卡号" @blur="hanleBlur()"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row type="flex" justify="space-between">
                        <el-col :span="7">
                            <el-form-item label="开户银行" prop="bankName">
                                <el-input v-model.trim="ruleForm.bankName" disabled placeholder="银行"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="手机号" prop="reservePhone">
                                <el-row type="flex" justify="space-between">
                                    <el-input v-model.trim="ruleForm.reservePhone" placeholder="请输入银行预留手机号" style="width:100%"></el-input>
                                    <ws-throttle>
                                        <ws-verification v-if="routeQuery.type !== 'detail'" :customClass="'verification'" :isSend.sync="isSend" @verifyCodeHandle="getVerifyCode"></ws-verification>
                                    </ws-throttle>
                                </el-row>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" v-if="routeQuery.type !== 'detail'">
                            <el-form-item label="验证码" prop="verifyCode">
                                <el-input v-model.trim="ruleForm.verifyCode" placeholder="请输入验证码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" v-if="routeQuery.type == 'detail'">
                            <!-- <el-form-item label="绑定机构" prop="relationIdList">
                                <el-select v-model="ruleForm.relationIdList" multiple placeholder="请选择机构" style="width:100%">
                                    <el-option v-for="item in allInstitution" :key="item.relationId" :label="item.name" :value="item.relationId"></el-option>
                                </el-select>
                            </el-form-item> -->
                            <el-form-item label="绑定机构" prop="relationIdList">
                                <el-select v-model="ruleForm.relationIdList" style="width:100%" clearable collapse-tags multiple filterable remote reserve-keyword placeholder="请选择机构" :remote-method="remoteMethod">
                                    <el-option v-for="item in allInstitution" :key="item.relationId" :label="item.orgName" :value="item.relationId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row type="flex" justify="start">
                        <el-col :span="7" v-if="routeQuery.type == 'add'">
                            <!-- <el-form-item label="绑定机构" prop="relationIdList">
                                <el-select v-model="ruleForm.relationIdList" multiple placeholder="请选择机构" style="width:100%">
                                    <el-option v-for="item in allInstitution" :key="item.relationId" :label="item.name" :value="item.relationId"></el-option>
                                </el-select>
                            </el-form-item> -->
                            <el-form-item label="绑定机构" prop="relationIdList">
                                <el-select v-model="ruleForm.relationIdList" clearable multiple filterable remote reserve-keyword placeholder="请选择机构" :remote-method="remoteMethod" style="width:100%">
                                    <el-option v-for="item in allInstitution" :key="item.relationId" :label="item.orgName" :value="item.relationId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="footer">
                <el-button class="buttons" @click="goback()">返回</el-button>
                <ws-throttle>
                    <el-button class="buttons" v-if="this.routeQuery.type !== 'detail'" type="primary" @click="onBindInfo('ruleForm')">绑定</el-button>
                </ws-throttle>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'bankCardMgr',
    props: {
        title: '新增'
    },
    data() {
        return {
            allInstitution: [], //绑定机构select框数据
            ruleForm: {
                accountName: '',
                idCardNum: '',
                bankCard: '',
                bankName: '',
                reservePhone: null,
                verifyCode: '',
                relationIdList: []
            },
            relationId: '',
            isSend: false,
            rules: {
                accountName: [
                    {
                        required: true,
                        message: '请输入持卡人姓名',
                        trigger: 'blur'
                    },
                    { max: 20, message: '限制输入20个字符', trigger: 'blur' }
                ],
                idCardNum: [
                    {
                        required: true,
                        message: '请输入持卡人身份证号',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                        message: '请输入正确的身份证号',
                        trigger: 'blur'
                    }
                ],
                bankCard: [
                    {
                        required: true,
                        message: '请输入银行卡号',
                        trigger: 'blur'
                    }
                ],
                bankName: [
                    {
                        required: true,
                        message: '请输入开户银行',
                        trigger: 'blur'
                    }
                ],
                reservePhone: [
                    {
                        required: true,
                        message: '请输入银行预留手机号',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                        message: '请输入正确的手机号码',
                        trigger: 'blur'
                    }
                ],
                verifyCode: [
                    {
                        required: true,
                        message: '请输入验证码',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^\d{4}$/,
                        message: '请输入由4位数字组成的验证码',
                        trigger: 'blur'
                    }
                ],
                relationIdList: [
                    {
                        required: true,
                        message: '请选择机构',
                        trigger: 'change'
                    }
                ]
            },
            routeQuery: this.$route.query, //路由信息
            moduleName: '/personalCenter/bankCardManage',
            // 旧银行卡
            oldBankCard: null
        };
    },

    created() {
        if (this.routeQuery.type !== 'add') {
            this.getDetail();
        }
        if (this.routeQuery.type == 'detail') {
            this.getInstitutionList();
        }
        // else {
        //     this.getInsList();
        // }
    },
    methods: {
        //点击保存调用编辑和新增接口
        onBindInfo(formName) {
            let op = {
                add: 'addOfBc',
                edit: 'updateOfBc'
            }[this.routeQuery.type];
            //获取人员登录id
            let employId = this.$baseMethod.getStore('_ccmUser').id;
            this.ruleForm.employId = employId;
            let data = this.ruleForm;
            if (this.routeQuery.id) {
                data.id = this.routeQuery.id;
            }

            if (op === "updateOfBc") {
              data.oldBankCard = this.oldBankCard
            }

            this.$refs[formName].validate(valid => {
                if (valid) {
                    // 调用新增接口
                    this.$axios(this.getModuleUrl(op), {
                        data,
                        op
                    })
                        .then(res => {
                            //页面跳转
                            this.$message.success({ add: '新增成功', edit: '修改成功' }[this.routeQuery.type]);
                            this.$router.push({ name: 'personalCenter', params: { activeName: 'bankCardManage' } });
                            // this.saveLoading = false;
                        })
                        .catch(() => {
                            // this.saveLoading = false;
                        });
                } else {
                    return false;
                }
            });
        },
        //获取详情接口
        getDetail() {
            let data = this.routeQuery;
            this.ruleForm = data;
            this.oldBankCard = this.$route.query.bankCard

            this.$set(this.ruleForm, 'relationIdList', [this.routeQuery.relationId * 1]);
        },
        goback() {
            this.$router.push({ name: 'personalCenter', params: { activeName: 'bankCardManage' } });
        },
        //获取验证码
        getVerifyCode() {
            this.$refs['ruleForm'].validateField(['reservePhone'], valid => {
                if (!valid) {
                    this.isSend = true;
                    let data = {
                        data: { reservePhone: this.ruleForm.reservePhone },
                        op: 'sendSms'
                    };
                    this.$axios(this.getModuleUrl('sendSms'), data).then(res => {
                        this.$message.success('发送成功');
                    });
                } else {
                    return false;
                }
            });
        },
        //银行卡号获取银行信息失去焦点blur事件
        hanleBlur() {
            this.$refs['ruleForm'].validateField(['bankCard'], valid => {
                if (!valid) {
                    let data = {
                        data: { bankCard: this.ruleForm.bankCard },
                        op: 'getBankName'
                    };
                    this.$axios(this.getModuleUrl('getBankName'), data)
                        .then(res => {
                            let data = JSON.parse(res.data);
                            this.ruleForm.bankName = data.bankName;
                        })
                        .catch(() => {
                            this.ruleForm.bankName = '';
                        });
                } else {
                    return false;
                }
            });
            if (!this.ruleForm.bankCard) {
                this.ruleForm.bankName = '';
            }
        },
        //查询机构接口
        async remoteMethod(queryString) {
            this.allInstitution = await this.loadAll(queryString);
        },

        //所有机构数据
        async loadAll(queryString) {
            try {
                let data = {
                    data: { orgName: queryString,orgType:40 },
                    op: 'select'
                };
                let res = await this.$axios(this.getModuleUrl('select'), data);
                if (res.code == 1) {
                    let data = JSON.parse(res.data);
                    return data;
                } else {
                    return [];
                }
            } catch (error) {
                Error(error);
            }
        },
        // 查询提现机构接口
        getInstitutionList() {
            let data = {
                data: {
                    relationId:this.routeQuery.relationId,
                    orgType : this.$baseMethod.getStore('roleOption').orgType
                },
                op: 'select'
            };
            this.$axios(this.getModuleUrl('select'), data).then(res => {
                let data = JSON.parse(res.data);
                this.allInstitution = data;
            });
        },
        // getInsList() {
        //     let data = {
        //         data: { orgName: '',orgType:40},
        //         op: 'select'
        //     };
        //     this.$axios(this.getModuleUrl('select'), data).then(res => {
        //         let data = JSON.parse(res.data);
        //         this.allInstitution = data;
        //     });
        // },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    }
};
</script>

<style lang="scss" scoped>
.bigBox {
    width: 100%;
    min-height: calc(100vh - 104px);
    // overflow: auto;
    .contentBox {
        width: 100%;
        min-height: calc(100vh - 104px);
        background: #ffffff;
        padding: 32px 48px;
        border-radius: 8px;
        .title {
            margin-bottom: 24px;
            height: 28px;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 700;
            color: #303133;
            line-height: 28px;
        }
        .formAll {
            height: 100%;
        }
        .footer {
            width: 100%;
            height: 50px;
            text-align: center;
            margin-top: 40px;
            .buttons {
                width: 160px;
                height: 40px;
            }
        }
    }
    .btn {
        margin-left: 8px;
        height: 36px;
        background: #f5f7fa;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
    }
    .verification {
        height: 36px !important;
        font-size: 12px;
    }
}
</style>