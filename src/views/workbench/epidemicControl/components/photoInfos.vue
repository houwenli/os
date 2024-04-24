<template>
    <ws-descriptions name="1" class="prove">
        <template slot="title">
            <el-checkbox v-model="form.open" :disabled="disabled" @change="pheckChange"></el-checkbox>
            <span class="checkTxt">防疫拍照</span>
        </template>
        <el-form :model="form" :rules="rules" ref="pFrom" label-width="100px" class="pFrom">
            <div class="tops">
                <!-- <el-form-item prop="photoNodes" label="控制节点" class="item" label-width="80px">
                    <el-select v-model="form.photoNodes" multiple  placeholder="请选择控制节点" clearable :disabled="disabled">
                        <el-option v-for="item in nodeNames" :key="item.nodeName" :label="item.nodeName" :value="item.nodeName"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item prop="controlFrequency" label="控制频率" class="item controlFrequency" label-width="80px">
                    <el-input v-model.trim="form.controlFrequency" :placeholder="disabled ? '' : '请输入小时'" :disabled="disabled">
                        <span slot="suffix">小时</span>
                    </el-input>
                </el-form-item>
            </div>
            <h4>拍照内容</h4>
            <div class="item-box" v-for="(item, i) in form.photoInfos" :key="i">
                <div class="left-box">
                    <div style="overflow: hidden">
                        <el-col :span="11">
                            <el-form-item prop="photoType" label="类型">
                                <div>{{ info[item.photoType].name }}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="13">
                            <el-form-item prop="alias" label="别名">
                                <el-input v-model.trim="item.alias" :placeholder="disabled ? '' : '请输入别名'" maxlength="12" show-word-limit :disabled="disabled"></el-input>
                            </el-form-item>
                        </el-col>
                    </div>
                    <el-form-item label="描述" :prop="`photoInfos.${i}.description`" :rules="rules.description">
                        <el-input
                            type="textarea"
                            :rows="5"
                            :placeholder="disabled ? '' : info[item.photoType].pl"
                            v-model="item.description"
                            :disabled="disabled"
                            clearable
                            maxlength="100"
                            show-word-limit
                        ></el-input>
                    </el-form-item>
                </div>
                <div class="right-box">
                    <el-form-item label="示意图" :prop="`photoInfos.${i}.picUrl`" :rules="rules.picUrl" v-if="item.photoType + '' !== '3'">
                        <img-up v-model="item.picUrl" :disabled="disabled" @clearValidate="picClear" :index="i" />
                    </el-form-item>
                    <!-- <el-form-item prop="threshold" label="警报阈值" v-if="item.photoType + '' === '3'">
                        <div class="form-line">
                            <el-input v-model="item.threshold" class="ite" placeholder="请输入记录中警示的最高体温">
                                <span slot="suffix">℃ </span>
                            </el-input>
                        </div>
                    </el-form-item> -->
                </div>
                <div class="check">
                    <el-checkbox v-model="item.open" :disabled="disabled" @change="itempChange($event, i)"></el-checkbox>
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
        const validateFre = (rule, value, callback) => {
            const { photoInfos } = this.form;
            const reg = /^[1-9]\d*$/;
            if (
                photoInfos.filter(item => {
                    return item.open;
                }).length !== 0
            ) {
                if (value) {
                    if (reg.test(value)) {
                        callback();
                    } else {
                        callback(new Error('请输入正整数'));
                    }
                } else {
                    callback(new Error('请输入控制频率'));
                }
            } else {
                callback();
            }
        };
        const validateNode = (rule, value, callback) => {
            const { photoInfos } = this.form;
            if (
                photoInfos.filter(item => {
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
            if (this.form.photoInfos[index].open) {
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
            if (this.form.photoInfos[index].open) {
                if (!value) {
                    callback(new Error('请选择图片'));
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
                photoNodes: [{ validator: validateNode, trigger: 'change' }],
                controlFrequency: [{ validator: validateFre, trigger: 'blur' }],
                picUrl: [{ validator: validatePicUrl, trigger: 'change' }],
                description: [{ validator: validateDescription, trigger: 'blur' }]
            },
            regulations: [
                { id: 1, value: '客服审核时输入' },
                { id: 2, value: '自审核通过起' },
                { id: 3, value: '审核通过当天过期' },
            ],
            info: {
                5: { name: '个人防护', pl: '佩戴好口罩，正面拍照，人像占图片四分之三口罩需要遮。盖全部口、鼻、下巴部位，无缝隙请确保上传照片是您本人，且照片清晰可识别' },
                6: {
                    name: '车辆消毒',
                    pl: '将所有消毒工具摆放在车尾，从车尾处拍照，并包含车牌信息重点消毒区域：方向盘、座套、安全带、座椅、脚垫、后备箱等，每日消毒一次，若乘客发情情况，事后立即对上述终点区域消毒请确保上传照片清晰可识别'
                },
                7: { name: '体温测量', pl: '请您测量体温，并如实填写' }
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
            this.$refs.pFrom.validate(boolean => {
                if (boolean) {
                    flag = true;
                }
            });
            return flag;
        },
        pheckChange(e) {
            if (!e) {
                this.$refs.pFrom.clearValidate();
            }
        },
        itempChange(e, i) {
            if (!e) {
                const { photoInfos } = this.form;
                if (
                    photoInfos.filter(item => {
                        return item.open;
                    }).length === 0
                ) {
                    this.form = { ...this.form, open: false };
                }
                this.$refs.pFrom.clearValidate(['photoInfos.' + i + '.description', 'photoInfos.' + i + '.picUrl']);
            } else {
                this.form = { ...this.form, open: true };
            }
        },
        picClear(i) {
            this.$refs.pFrom.clearValidate(['photoInfos.' + i + '.picUrl']);
        }
    }
};
</script>

<style lang="scss" scoped>
.prove {
    .tops {
        display: flex;
        border-bottom: 1px solid #dcdfe6;
        margin-bottom: 16px;
        .item {
            flex: 1;
            max-width: 446px;
            /deep/ .el-select {
                width: 100%;
            }
            &.validHour {
                margin-left: 30px;
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
        //     content: '' !important;
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
