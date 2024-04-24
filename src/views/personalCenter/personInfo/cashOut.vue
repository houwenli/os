<template>
    <div>
        <div class="apply-box cash-out">
            <div class="table-box">
                <table class="mailTable" v-if="organData.length > 0">
                    <tr v-for="item in organData" :key="item.index">
                        <td class="column head">{{ item.label }}</td>
                        <td class="column">{{ item.value }}</td>
                    </tr>
                </table>
                <table class="mailTable" v-if="accountData.length > 0">
                    <tr v-for="item in accountData" :key="item.index">
                        <td class="column head">{{ item.label }}</td>
                        <td class="column">{{ item.value }}</td>
                    </tr>
                </table>
            </div>

            <div>
                <el-form :model="ruleForm" label-width="100px">
                    <el-form-item required label="输入提现金额：">
                        <el-input style="display: none"></el-input>
                        <!-- <el-input type="tel" v-model="ruleForm.money" @change="confirmInfo" placeholder="请输入提现金额"></el-input> -->
                        <el-input-number v-model="ruleForm.money" :controls="false" @change="confirmInfo" placeholder="请输入提现金额" :precision="2"></el-input-number>
                    </el-form-item>
                    <p v-html="chargesMoney">
                        手续费
                        <span>{{ chargesMoney }}</span>
                        元，提现成功后在提现金额中扣
                    </p>

                    <el-form-item label="上传发票：">
                        <ws-image-upload
                            :multi="false"
                            :afterUpload="afterUpload"
                            :isViewer="true"
                            ref="imageUpload"
                            class="image-upload"
                            :actions="actions"
                            :quantity="1"
                            :isDelete="true"
                            :handleRemove="handleRemove"
                        ></ws-image-upload>
                    </el-form-item>
                </el-form>
            </div>

            <div class="footer-btn">
                <el-button @click="onBack">返回</el-button>
                <el-button v-if="getModulePower('/personalCenter/personInfo').confirmationWithdraw" type="primary" @click="confirmInfo('confirm')">立即提现</el-button>
            </div>
            <el-dialog width="604px" :title="dialogTitle" :center="true" :visible.sync="dialogVisible">
                <div class="dialog_content" v-show="dialogType === 'cashOut'">
                    <div>
                        <img :src="successImg" alt="" />
                        <p class="success_text">您的提现申请已提交，请等待后台审核！</p>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="onBack">关闭</el-button>
                    </div>
                </div>
                <div class="dialog_content" v-show="dialogType !== 'cashOut'">
                    <div>
                        <h3>
                            {{ cashInfo.receiveMoney / 100 }}
                            <span>元</span>
                        </h3>
                        <p>
                            服务费：{{ cashInfo.chargesMoney }}元
                            <span>收费标准：{{ cashInfo.describe }}</span>
                        </p>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">返回</el-button>
                        <el-button v-if="getModulePower('/personalCenter/personInfo').withdrawMoney" type="primary" @click="confirmInfo('cashOut')">确定提现</el-button>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import tableList from '@/components/TableList';
import { _axios } from '@/utils/commMethods';

export default {
    name: 'personInfo',
    components: {
        tableList
    },
    data() {
        return {
            moduleName: '/personalCenter/personInfo',
            organData: [],
            accountData: [],
            ruleForm: {
                money: undefined //无默认转化
            },
            actions: {
                // 上传配置
                url: '/authority/orgFile/uploadInvoice',
                op: 'uploadInvoice'
            },
            accountInfo: {},
            chargesMoney: '',
            dialogVisible: false,
            cashInfo: {},
            dialogTitle: '',
            dialogType: '',
            successImg: require('@/assets/images/img_result_succes.png')
        };
    },
    created() {
        let vm = this;
        vm.accountInfo = vm.$route.query;
        let { orgName, totalMoney, bankName, bankcard, userName, agencyNumber } = vm.accountInfo;
        vm.organData = [
            { label: '机构名称', value: orgName },
            { label: '机构ID', value: agencyNumber },
            { label: '可提现金额', value: totalMoney / 100 }
        ];
        vm.accountData = [
            { label: '收款人', value: userName },
            { label: '开户银行', value: bankName },
            { label: '银行卡号', value: bankcard }
        ];
    },
    methods: {
        async confirmInfo(type) {
            let vm = this;
            try {
                if (isNaN(vm.ruleForm.money) || vm.ruleForm.money === '') {
                    return this.$message({
                        showClose: true,
                        message: '请输入提现金额！',
                        type: 'error'
                    });
                }

                if (vm.organData[2].value < vm.ruleForm.money)
                    return this.$message({
                        showClose: true,
                        message: '提现金额不能超过可提现金额！',
                        type: 'error'
                    });

                let { relationId, bankcard } = vm.accountInfo;
                let { money } = vm.ruleForm;
                let param = {
                    relationId,
                    money: parseFloat((money * 100).toFixed(10)),
                    bankCardNumber: bankcard,
                    op: type === 'cashOut' ? 'withdrawMoney' : 'confirmationWithdraw'
                };
                let res = await _axios(param, vm.moduleName);
                if (res.code === 1) {
                    // 确认提现
                    if (type === 'cashOut') {
                        vm.dialogTitle = '';
                        vm.dialogType = type;
                        return;
                    }
                    vm.cashInfo = res.data;
                    vm.chargesMoney = `手续费 <span style="color: #f05259;">${vm.cashInfo.chargesMoney}</span> 元，提现成功后在提现金额中扣`;
                    vm.dialogType = '';
                    type === 'confirm' && (vm.dialogVisible = true);
                    vm.dialogTitle = '到账金额';
                }
            } catch (err) {
                throw err;
            }
        },
        afterUpload(data) {
            // 上传成功回调函数
            let vm = this;
            let { publicDownUrl: fileUrl, privateFileId: fileId, publicFileId: fileName } = data.data;
            vm.ruleForm = {
                ...vm.ruleForm,
                fileId,
                fileUrl,
                fileName
            };
            return fileUrl;
        },

        handleRemove() {
            let vm = this;
            delete vm.ruleForm['fileId'];
            delete vm.ruleForm['fileUrl'];
            delete vm.ruleForm['fileName'];
        },

        onBack() {
          this.$router.push({
            name: 'personalCenter'
          })
        }
    }
};
</script>

<style lang="scss" scoped>
.cash-out {
    padding: 32px 48px;

    .table-box {
        display: flex;
        justify-content: space-between;
        padding-bottom: 24px;
    }

    .mailTable {
        width: calc(50% - 8px);
        border-radius: 4px;
        border-collapse: collapse;
        border-style: hidden;
        box-shadow: 0 0 0 1px #d8d8d8;
    }
    .head {
        border-radius: 4px;
        background-color: #f5f7fa;
        text-align: left;
        width: 30%;
        color: #606266;
    }
    .column {
        height: 40px;
        border: 1px solid #dcdfe6;
        padding: 0 16px;
    }

    p {
        color: #909399;
        line-height: 18px;
        height: 55px;
        font-size: 13px;
        padding: 12px 0 25px 122px;
    }

    .footer-btn {
        padding-top: 40px;
        display: flex;
        justify-content: center;
    }

    /deep/ .el-form-item {
        margin-bottom: 0 !important;
    }

    /deep/ .el-form-item__label {
        width: 122px !important;
        font-weight: 400;
        font-size: 14px;
        padding: 0;
    }

    /deep/ .el-form-item__content {
        margin-left: 122px !important;
        width: 20%;
    }

    /deep/ .el-upload--picture-card {
        width: 120px !important;
        height: 120px !important;
        position: relative;
    }

    /deep/ .el-icon-plus {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    /deep/ .el-dialog__body {
        padding-bottom: 0;
    }

    /deep/ .image-viewer {
        width: 120px;
        height: 120px;
    }

    .dialog_content {
        text-align: center;

        h3 {
            font-size: 36px;
            font-weight: 500;
            color: #f05259;
            line-height: 30px;

            span {
                font-size: 14px;
                font-weight: 500;
                color: #303133;
                line-height: 20px;
            }
        }

        p {
            padding: 40px 0 47px;

            span {
                margin-left: 40px;
            }
        }

        img {
            width: 50px;
            height: 50px;
        }

        .dialog-footer {
            padding-bottom: 40px;
        }

        .success_text {
            font-size: 14px;
            font-weight: 400;
            color: #606266;
            line-height: 20px;
            padding: 16px 0 32px;
            height: auto;
        }
    }
}
</style>
