<template>
    <div>
        <div class="bigBox">
            <div class="container" style="margin: 0 auto">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" @submit.native.prevent>
                    <el-form-item label="业务关键词:" prop="keyWords" class="businessBox">
                        <span>支持换行输入，表格中显示也为换行显示</span>
                        <el-input type="textarea" placeholder="请输入关键词" v-model="ruleForm.keyWords" maxlength="200" show-word-limit style="white-space: pre-line"></el-input>
                    </el-form-item>

                    <el-form-item label="业务内容:" prop="content" class="businessBox">
                        <span>支持换行输入，表格中显示也为换行显示</span>
                        <el-input type="textarea" placeholder="请输入内容" v-model="ruleForm.content" maxlength="500" show-word-limit style="white-space: pre-line"></el-input>
                    </el-form-item>

                    <el-form-item label="业务部门:" prop="department" label-width="82px">
                        <el-input v-model.trim="ruleForm.department" clearable maxlength="20" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form>

                <div class="addcontacts">
                    <span>联系人</span>
                    <el-button type="primary" @click="addContactsList">添加联系人</el-button>
                </div>

                <div v-for="(contract, index) in businessContractList" :key="index">
                    <el-form :model="contract" @submit.native.prevent :ref="`contractRul${index}`">
                        <el-form-item :label="`联系人${toChanese(index + 1)}:`" prop="contactUserName" :rules="rules['contactUserName']" class="contacts-input">
                            <el-input v-model.trim="contract.contactUserName" clearable maxlength="20" placeholder="请输入"></el-input>
                            <el-button plain @click="delContact(index)" :disabled="isDisabled">删除</el-button>
                        </el-form-item>
                    </el-form>

                    <div class="phoneBox">
                        <div v-for="(item, phoneIndex) in contract.businessPhoneList" :key="phoneIndex" class="contract">
                            <el-form :model="item" style="display: flex" class="phone-Minbox" :ref="`${index}phoneRul${phoneIndex}`" @submit.native.prevent>
                                <el-form-item label="业务电话：" prop="businessPhone" :rules="rules['businessPhone']" class="businessPhone">
                                    <el-input v-model.trim="item.businessPhone" clearable maxlength="20" placeholder="请输入"></el-input>
                                </el-form-item>

                                <el-form-item label="电话备注：">
                                    <el-input v-model.trim="item.remark" clearable maxlength="20" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-form>
                            <img src="@/assets/images/icon_add.png" alt="" @click="addPhone(index, phoneIndex)" />
                            <img src="@/assets/images/icon_reduce2.png" alt="" @click="delPhone(index, phoneIndex)" v-if="contract.businessPhoneList.length != 1" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="saveButon">
                <el-button class="buttons" @click="cancelContent">取消</el-button>
                <el-button class="buttons" type="primary" @click="saveContent">保存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { numTransform } from '@/utils/commMethods';
export default {
    data() {
        const phoneRule = (rule, value, callback) => {
            const regExp = this.$regexList.get('phoneAndChMobile');
            if (regExp.test(value) === false) {
                callback(new Error('请输入正确手机号'));
            } else {
                callback();
            }
        };
        return {
            moduleName: '/workbench/businessConsultation',
            ruleForm: {
                keyWords: '',
                content: '',
                department: ''
            },
            businessContractList: [
                {
                    contactUserName: '',
                    businessPhoneList: [
                        {
                            businessPhone: '',
                            remark: ''
                        }
                    ]
                }
            ],
            rules: {
                keyWords: [{ required: true, message: '请输入业务关键词', trigger: 'blur' }],
                content: [{ required: true, message: '请输入业务内容', trigger: 'blur' }],
                department: [{ required: true, message: '请输入业务部门', trigger: 'blur' }],
                contactUserName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
                businessPhone: [
                    { required: true, message: '请输入电话', trigger: 'blur' },
                    { validator: phoneRule, trigger: 'blur' }
                ]
            },
            centerDialogVisible: false,
            type: ''
        };
    },
    mounted() {
        this.type = this.$route.query.type;
        if (this.type === 'update') {
            this.getData(this.$route.query.id);
        }
    },
    computed: {
        isDisabled() {
            if (this.businessContractList.length === 1) {
                return true;
            }
        },
        toChanese() {
            return function (number) {
                return numTransform(number);
            };
        }
    },
    methods: {
        getData(id) {
            const param = {
                op: 'selectById',
                data: {
                    id: Number(id)
                }
            };
            // this.$axios('/businessConsulting/select', param).then(res => {
            this.$axios(this.getModuleUrl(param.op), param).then(res => {
                let { keyWords, content, department } = { ...JSON.parse(res.data) };
                this.ruleForm = { keyWords, content, department };
                if (JSON.parse(res.data).businessContractList != null) this.businessContractList = [...JSON.parse(res.data).businessContractList];
            });
        },
        //添加联系人电话
        addPhone(index, phoneIndex) {
            this.businessContractList[index].businessPhoneList.splice(phoneIndex + 1, 0, {
                businessPhone: '',
                remark: ''
            });
        },
        //删除联系人电话
        delPhone(index, phoneIndex) {
            this.businessContractList[index].businessPhoneList.splice(phoneIndex, 1);
        },
        //删除联系人
        delContact(index) {
            this.businessContractList.splice(index, 1);
        },

        //校验
        submitForm(refArr) {
            let PromiseArr = refArr.map((item, index) => {
                let compoment = item === 'ruleForm' ? this.$refs[item] : this.$refs[item][0];
                return new Promise((resolve, reject) => {
                    compoment.validate(valid => {
                        if (valid) {
                            resolve('true');
                        } else {
                            reject('false');
                        }
                    });
                });
            });
            return Promise.all(PromiseArr);
        },
        //保存
        async saveContent() {
            String.prototype.removeBlankLines = function () {
                return this.replace(/(\n[\s\t]*\r*\n)/g, '\n')
                    .replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '')
                    .trim();
            };
            this.ruleForm.keyWords = this.ruleForm.keyWords.removeBlankLines();
            this.ruleForm.content = this.ruleForm.content.removeBlankLines();
            try {
                let refArr = ['ruleForm'];
                this.businessContractList.map((item, index) => {
                    refArr.push(`contractRul${index}`);
                    item.businessPhoneList.map((item, index1) => {
                        refArr.push(`${index}phoneRul${index1}`);
                    });
                });
                await this.submitForm(refArr);

                let param = {
                    op: this.type === 'update' ? 'updateById' : 'addOne',
                    data: {
                        keyWords: this.ruleForm.keyWords,
                        content: this.ruleForm.content,
                        department: this.ruleForm.department,
                        businessContractList: this.businessContractList
                    }
                };
                if (this.type === 'update') {
                    param.data.id = this.$route.query.id;
                }
                // let url = this.type === 'update' ? '/businessConsulting/update' : '/businessConsulting/save';
                let url = this.getModuleUrl(param.op);
                let message = this.type === 'update' ? '修改成功' : '新增成功';
                this.$axios(url, param).then(res => {
                    if (res.code === 1) {
                        this.$message.success(message);
                        this.$router.push({
                          name: 'businessConsultationList'
                        })
                    }
                });
            } catch (_err) {
                console.error(_err);
            }
        },

        cancelContent() {
            this.$router.push({
              name: 'businessConsultationList'
            })
        },
        addContactsList() {
            this.businessContractList.push({
                contactUserName: '',
                businessPhoneList: [
                    {
                        businessPhone: '',
                        remark: ''
                    }
                ]
            });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    }
};
</script>

<style lang="scss" scoped>
.bigBox {
    background: #fff;
    padding: 24px 0px 24px 0px !important;
    margin-bottom: 64px;
    min-height: calc(100vh - 160px);
    border-radius: 8px;
    .container {
        width: calc(100% - 712px);
        .demo-ruleForm {
            span {
                float: right;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #909399;
            }
            /deep/.el-form-item:last-child{
            margin-bottom:39px;
        }
        }
        .addcontacts {
            display: flex;
            justify-content: space-between;
            align-items: center;
            span {
                font-family: 黑体;
                font-size: 20px;
                font-weight: 600;
            }
        }
        .phoneBox {
            border: 1px solid #ebeef5;
            border-radius: 8px;
            background: #f5f7fa;
            padding: 18px 18px 0px 18px;
            .contract {
                margin-bottom: 20px;
                .phone-Minbox {
                    width: 86%;
                    justify-content: space-between;
                    .el-form-item {
                        width: 45%;
                        /deep/.el-form-item__content {
                            flex: 1;
                            .el-input {
                                width: 100%;
                                /deep/ .el-input__inner {
                                    width: 100%;
                                    height: 36px;
                                    background: #ffffff;
                                    border-radius: 4px;
                                    border: 1px solid #dcdfe6;
                                }
                            }
                        }
                    }
                }
            }

            div {
                display: flex;
                align-items: center;
            }
            /deep/.el-form-item__label {
                width: 82px;
                padding-right: 8px;
            }
            /deep/ .businessPhone {
                .el-form-item__label {
                    width: 90px;
                    padding-right: 8px;
                }
            }
            .el-form-item {
                margin: 0px;
            }
            img {
                width: 28px;
                margin-left: 40px;
            }
        }
    }
    .saveButon {
        z-index: 999;
        position: fixed;
        bottom: 0;
        left: 80px;
        width: 100%;
        height: 64px;
        background: #ffffff;
        box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.04);
        display: flex;
        justify-content: center;
        align-items: center;
        .buttons {
            width: 160px;
            height: 36px;
            display: block;
        }
    }
    /deep/ .businessBox {
        .el-form-item__content {
            margin: 0px !important;
            .el-textarea__inner {
                height: 100px;
            }
            .el-form-item__content > span {
                color: red;
            }
        }
    }
    /deep/ .contacts-input {
        margin: 32px 0px 16px 0px;
        .el-form-item__content {
            display: flex;
        }
        .el-button {
            width: 123px;
            margin-left: 20px;
        }
    }
    /deep/ .el-form-item__label {
        text-align: left !important;
        font-size: 14px;
        color: #606266;
    }
    /deep/ label {
        font-weight: normal;
    }
}
</style>
