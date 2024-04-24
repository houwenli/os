<template>
    <ws-descriptions name="1" class="prove">
        <template slot="title">
            <el-checkbox v-model="form.open" :disabled="disabled" @change="proveCheckChange"></el-checkbox>
            <span class="checkTxt">健康证明</span>
        </template>
        <el-form :model="form" :rules="rules" ref="proveFrom" label-width="100px" class="proveFrom">
            <!-- <div class="tops">
                <el-form-item prop="healthNodes" label="控制节点" class="item" label-width="80px">
                    <el-select v-model="form.healthNodes" multiple  placeholder="请选择控制节点" clearable :disabled="disabled">
                        <el-option v-for="item in nodeNames" :key="item.nodeName" :label="item.nodeName" :value="item.nodeName"></el-option>
                    </el-select>
                </el-form-item>
            </div> -->
            <h4>证明类型</h4>
            <div class="item-box" v-for="(item, i) in form.healthApproves" :key="i">
                <div class="left-box">
                    <div style="overflow: hidden">
                        <el-col :span="11">
                            <el-form-item prop="approveType" label="类型">
                                <div>{{ info[item.approveType].name }}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="13">
                            <el-form-item prop="alias" label="别名">
                                <el-input v-model="item.alias" :placeholder="disabled ? '' : '请输入别名'" maxlength="12" show-word-limit :disabled="disabled"></el-input>
                            </el-form-item>
                        </el-col>
                    </div>
                    <el-form-item label="描述" :prop="`healthApproves.${i}.description`" :rules="rules.description">
                        <el-input
                            type="textarea"
                            :rows="5"
                            :placeholder="disabled ? '' : info[item.approveType].pl"
                            v-model="item.description"
                            :disabled="disabled"
                            clearable
                            maxlength="100"
                            show-word-limit
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="示意图" :prop="`healthApproves.${i}.picUrl`" :rules="rules.picUrl">
                        <img-up v-model="item.picUrl" :disabled="disabled" @clearValidate="picClear" :index="i" />
                    </el-form-item>
                </div>
                <div class="right-box">
                    <el-form-item label="是否限期" :prop="`healthApproves.${i}.deadline`" :rules="rules.deadline">
                        <el-radio-group v-model="item.deadline" :disabled="disabled">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div v-if="item.deadline === 1">
                        <el-form-item label="过期规则" :prop="`healthApproves.${i}.expireRule`" :rules="rules.expireRule">
                            <div class="form-line">
                                <el-select v-model="item.expireRule" :placeholder="disabled ? '' : '请选择过期规则'" class="ite" :disabled="disabled">
                                    <el-option v-for="item in regulations" :key="item.id" :label="item.value" :value="item.id"></el-option>
                                </el-select>
                                <div style="width: 20px"></div>
                                <el-form-item v-if="item.expireRule === 2" :prop="`healthApproves.${i}.validDays`" label="" label-width="0" class="ite" :rules="rules.validDays">
                                    <el-input v-model.trim="item.validDays" :placeholder="disabled ? '' : '请输入天数'" :disabled="disabled">
                                        <span slot="suffix">天</span>
                                    </el-input>
                                </el-form-item>
                                <div v-else class="ite"></div>
                            </div>
                        </el-form-item>

                        <el-form-item :prop="`healthApproves.${i}.delayDay`" label="延期上传" v-if="item.approveType + '' === '3'" :rules="rules.delayDay">
                            <div class="form-line">
                                <el-input v-model.trim="item.delayDay" class="ite" :placeholder="disabled ? '' : '请输入小时'" :disabled="disabled">
                                    <span slot="suffix">小时</span>
                                </el-input>
                                <div style="width: 20px"></div>
                                <div class="ite"></div>
                            </div>
                        </el-form-item>
                    </div>
                </div>
                <div class="check">
                    <el-checkbox v-model="item.open" :disabled="disabled" @change="itemChange($event, i)"></el-checkbox>
                </div>
            </div>
        </el-form>
    </ws-descriptions>
</template>

<script>
import ImgUp from './imgUp.vue';

export default {
    components: { ImgUp },
    props: {
        datas: {
            type: Object,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        nodeNames: {
            type: Array,
            required: true
        }
    },
    data() {
        const validateNode = (rule, value, callback) => {
            const { healthApproves } = this.form;
            if (
                healthApproves.filter(item => {
                    return item.open;
                }).length !== 0
            ) {
                if (value && value.length > 0) {
                    callback();
                } else {
                    callback(new Error('请选择控制节点'));
                }
            } else {
                callback();
            }
        };
        const validateDescription = (rule, value, callback) => {
            const index = rule.field.split('.')[1] - 0;
            if (this.form.healthApproves[index].open) {
                if (!value) {
                    callback(new Error('请输入描述'));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        const validatePicUrl = (rule, value, callback) => {
            const index = rule.field.split('.')[1] - 0;
            if (this.form.healthApproves[index].open) {
                if (!value) {
                    callback(new Error('请选择图片'));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        const validateDeadline = (rule, value, callback) => {
            const index = rule.field.split('.')[1] - 0;
            if (this.form.healthApproves[index].open) {
                let val = value + '';
                if (!val) {
                    callback(new Error('请选择是否限期'));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        const validateExpireRule = (rule, value, callback) => {
            const index = rule.field.split('.')[1] - 0;
            if (this.form.healthApproves[index].open) {
                if (!value) {
                    callback(new Error('请选择过期规则'));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        const reg = /^[1-9]\d*$/;
        const validateDays = (rule, value, callback) => {
            const index = rule.field.split('.')[1] - 0;
            if (this.form.healthApproves[index].open) {
                if (!value) {
                    callback(new Error('请输入天数'));
                } else {
                    if (reg.test(value)) {
                        callback();
                    } else {
                        callback(new Error('请输入正整数'));
                    }
                }
            } else {
                callback();
            }
        };
        const validateDelay = (rule, value, callback) => {
            const index = rule.field.split('.')[1] - 0;
            if (this.form.healthApproves[index].open) {
                if (reg.test(value)) {
                    callback();
                } else {
                    callback(new Error('请输入延期时间(正整数)'));
                }
            } else {
                callback();
            }
        };
        return {
            form: {},
            rules: {
                healthNodes: [{ validator: validateNode, trigger: 'change' }],
                picUrl: [{ validator: validatePicUrl, trigger: 'change' }],
                description: [{ validator: validateDescription, trigger: 'blur' }],
                deadline: [{ validator: validateDeadline, trigger: 'change' }],
                expireRule: [{ validator: validateExpireRule, trigger: 'change' }],
                validDays: [{ validator: validateDays, trigger: 'blur' }],
                delayDay: [{ validator: validateDelay, trigger: 'blur' }]
            },
            regulations: [
                { id: 1, value: '客服审核时输入' },
                { id: 2, value: '自审核通过起' },
                { id: 3, value: '审核通过当天过期' },
            ],
            info: {
                1: { name: '健康码', pl: '可提供各地方小程序健康码绿码，如“深i你”小程序健康码、“粤省事”小程序粤康码等' },
                2: { name: '疫苗接种记录', pl: '有效新冠疫苗接种记录，建议上传信息较全的文件' },
                3: { name: '核酸检测报告', pl: '建议上传7天内的核酸检测报告' },
                4: { name: '行程码', pl: '可提供各地方小程序行程码，如“深i你”小程序行程自查、“粤省事”小程序行程卡等' }
            }
        };
    },
    watch: {
        datas: {
            handler(val) {
                this.form = { ...val };
            },
            immediate: true
        }
    },
    methods: {
        toValidate() {
            let flag = false;
            this.$refs.proveFrom.validate(boolean => {
                if (boolean) {
                    flag = true;
                }
            });
            return flag;
        },
        proveCheckChange(e) {
            // if (!e) {
            //     this.$refs.proveFrom.clearValidate()
            // }
        },
        itemChange(e, i) {
            if (!e) {
                const { healthApproves } = this.form;
                if (
                    healthApproves.filter(item => {
                        return item.open;
                    }).length === 0
                ) {
                    this.form = { ...this.form, open: false };
                }
                this.$refs.proveFrom.clearValidate([
                    'healthApproves.' + i + '.description',
                    'healthApproves.' + i + '.picUrl',
                    'healthApproves.' + i + '.expireRule',
                    'healthApproves.' + i + '.deadline'
                ]);
            } else {
                this.form = { ...this.form, open: true };
            }
        },
        picClear(i) {
            this.$refs.proveFrom.clearValidate(['healthApproves.' + i + '.picUrl']);
        }
    }
};
</script>

<style lang="scss" scoped>
.prove {
    .tops {
        border-bottom: 1px solid #dcdfe6;
        margin-bottom: 16px;
        .item {
            width: 50%;
            max-width: 446px;
            /deep/ .el-select {
                width: 100%;
            }
        }
    }
    h4 {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #303133;
        line-height: 14px;
        margin-bottom: 16px;
    }
    .item-box {
        margin-bottom: 16px;
        background: #ffffff;
        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.06);
        border-radius: 8px;
        border: 1px solid #ebeef5;
        // height: 100px;
        display: flex;
        // align-items: center;
        padding: 16px 24px 16px 0;
        // /deep/ .el-form-item__label:before {
        //     content: '';
        // }
        .left-box {
            flex: 1;
            max-width: 632px;
            padding-right: 72px;
            box-sizing: border-box;
            border-right: 1px solid #ebeef5;
        }
        .right-box {
            flex: 1;
            max-width: 632px;
            padding-left: 50px;
            .form-line {
                display: flex;
                .ite {
                    flex: 1;
                }
            }
        }
        .check {
            width: 40px;
            // margin-left: auto;
            text-align: right;
            margin: auto 0 auto auto;
        }
    }
}
</style>
