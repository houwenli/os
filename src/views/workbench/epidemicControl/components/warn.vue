<template>
    <ws-descriptions name="3" class="warn">
        <template slot="title">
            <el-checkbox v-model="form.open" @change="checkChange" :disabled="disabled"></el-checkbox>
            <span class="checkTxt">防疫提醒</span>
        </template>
        <div class="content">
            <h4>佩戴口罩提醒</h4>
            <h5>司机开始计费时弹出的是否佩戴口罩提示框</h5>
            <div class="box">
                <div class="left">
                    <div class="img"><img :src="form.picUrl" alt="" /></div>
                    <div class="ti">{{ form.title }}</div>
                    <div class="subTi">{{ form.subTitle }}</div>
                    <div class="codeTxt txt">
                        {{ form.content2 }}：
                        <span class="code">绿码</span>
                    </div>
                    <div class="isWearTxt txt">{{ form.content3 }}</div>
                    <div class="phoneTxt txt">
                        {{ form.content1 }}：
                        <span class="phone">0757</span>
                    </div>
                    <div class="bott">
                        <span class="cancel">取消</span>
                        <span>已确认，开始计费</span>
                    </div>
                </div>
                <div class="right">
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                        <el-form-item label="示意图" prop="picUrl">
                            <img-up v-model="form.picUrl" :disabled="disabled" />
                        </el-form-item>
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="form.title" placeholder="请输入标题" :disabled="disabled" maxlength="16"></el-input>
                        </el-form-item>
                        <el-form-item label="副标题" prop="subTitle">
                            <el-input v-model="form.subTitle" placeholder="请输入副标题" :disabled="disabled" maxlength="16"></el-input>
                        </el-form-item>
                        <el-form-item label="内容1" prop="content2">
                            <el-input v-model="form.content2" placeholder="请输入内容1" :disabled="disabled" maxlength="16"></el-input>
                        </el-form-item>
                        <el-form-item label="内容2" prop="content3">
                            <el-input v-model="form.content3" placeholder="请输入内容2" :disabled="disabled" maxlength="16"></el-input>
                        </el-form-item>
                        <el-form-item label="内容3" prop="content1">
                            <el-input v-model="form.content1" placeholder="请输入内容3" :disabled="disabled" maxlength="16"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </ws-descriptions>
</template>

<script>
import ImgUp from './imgUp.vue';

export default {
    components: { ImgUp },
    props: {
        datas: {
            type: Object,
            default: () => {
                return {
                    open: true,
                    picUrl: '',
                    title: '请在开始计费前确认以下信息',
                    subTitle: '如不符合请与乘客沟通',
                    content1: '确认乘客手机尾号为',
                    content2: '确认乘客健康码为',
                    content3: '确认乘客是否佩戴口罩',
                };
            },
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        const validatePicUrl = (rule, value, callback) => {
            if (this.form.open) {
                if (value === '') {
                    callback(new Error('请选择图片'));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        const validateTitle = (rule, value, callback) => {
            if (this.form.open) {
                if (value === '') {
                    callback(new Error('请输入标题'));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        const validateSubTitle = (rule, value, callback) => {
            if (this.form.open) {
                if (value === '') {
                    callback(new Error('请输入副标题'));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        const validateContent1 = (rule, value, callback) => {
            if (this.form.open) {
                if (value === '') {
                    callback(new Error('请输入内容1'));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        const validateContent2 = (rule, value, callback) => {
            if (this.form.open) {
                if (value === '') {
                    callback(new Error('请输入内容2'));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        const validateContent3 = (rule, value, callback) => {
            if (this.form.open) {
                if (value === '') {
                    callback(new Error('请输入内容3'));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        return {
            form: {},
            rules: {
                picUrl: [{ validator: validatePicUrl, trigger: 'blur' }],
                title: [{ validator: validateTitle, trigger: 'blur' }],
                subTitle: [{ validator: validateSubTitle, trigger: 'blur' }],
                content1: [{ validator: validateContent1, trigger: 'blur' }],
                content2: [{ validator: validateContent2, trigger: 'blur' }],
                content3: [{ validator: validateContent3, trigger: 'blur' }],
            },
        };
    },
    watch: {
        'form.picUrl'(val) {
            if (val) {
                this.$refs.form.clearValidate('picUrl');
            }
        },
        datas: {
            handler(val) {
                this.form = { ...val };
            },
            immediate: true,
        },
    },
    created() {
        // this.form = { ...this.datas }
    },
    methods: {
        toValidate() {
            let flag = false;
            this.$refs.form.validate(boolean => {
                if (boolean) {
                    flag = true;
                }
            });
            return flag;
        },
        checkChange(e) {
            if (!e) {
                this.$refs.form.clearValidate();
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.warn {
    .content {
        h4 {
            font-size: 14px;
            font-weight: 500;
            color: #303133;
            line-height: 14px;
            margin: 8px 0 16px;
        }
        h5 {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #909399;
            line-height: 14px;
        }
    }
    .box {
        padding: 36px 80px 35px;
        display: flex;
        &::after {
            content: '';
            display: block;
            clear: both;
        }
        .left {
            // float: left;
            width: 335px;
            height: 400px;
            background: #f9f9f9;
            box-shadow: 0px 20px 30px 0px rgba(48, 49, 51, 0.1);
            border-radius: 8px;
            border: 6px solid #dcdfe6;
            padding: 6px;
            box-sizing: border-box;
            position: relative;
            .img {
                width: 311px;
                height: 150px;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                }
            }
            .ti {
                font-size: 17px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #303133;
                line-height: 24px;
                text-align: center;
                margin: 12px 0 8px 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .subTi {
                font-size: 13px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #303133;
                line-height: 18px;
                margin-bottom: 15px;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .txt {
                font-size: 15px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #303133;
                line-height: 21px;
                margin-bottom: 10px;
                padding-left: 42px;
                position: relative;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                &::before {
                    content: '';
                    display: block;
                    width: 6px;
                    height: 6px;
                    background: #a9b0bf;
                    border-radius: 50%;
                    position: absolute;
                    left: 24px;
                    top: 8px;
                }
                .phone {
                    font-size: 17px;
                    font-weight: 500;
                    color: #f05259;
                    line-height: 24px;
                }
                .code {
                    font-size: 17px;
                    font-weight: 500;
                    color: #2ac39b;
                    line-height: 24px;
                }
            }
            .bott {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                height: 44px;
                background: #ffffff;
                border-radius: 0px 0px 8px 8px;
                border-top: 1px solid #ebeef5;
                span {
                    font-size: 15px;
                    font-weight: 400;
                    color: #0088ff;
                    line-height: 44px;
                    text-align: center;
                    display: inline-block;
                    width: 50%;
                    &.cancel {
                        color: #909399;
                        border-right: 1px solid #ebeef5;
                        box-sizing: border-box;
                    }
                }
            }
        }
        .right {
            margin-left: 100px;
            flex: 1;
            max-width: 500px;
            /deep/ .el-form-item {
                margin-bottom: 18px;
            }
            // /deep/ .el-form-item__label:before {
            //     content: '';
            // }
        }
    }
}
</style>
