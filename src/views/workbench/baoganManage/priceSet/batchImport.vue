<template>
    <div class="import_wrap">
        <div class="box">
            <div class="content">
                <div class="title">批量导入</div>
                <div class="step-style">
                    <span class="circle">1</span>
                    <div class="step">
                        <span>下载模版</span>
                        <span class="info">（如模版已经下载，请直接点击第二步的选择文件按钮）</span>
                    </div>
                </div>
                <div class="btn-down">
                    <ws-throttle>
                        <el-button class="handle-btn" type="primary" @click="downLoad">下载模板</el-button>
                    </ws-throttle>
                </div>
                <div class="step-style">
                    <span class="circle">2</span>
                    <div class="step">
                        <span>上传文件</span>
                        <span class="info">（请点击选择文件和选择生效起止时间）</span>
                    </div>
                </div>
                <div class="btn-down btn-upload">
                    <div v-if="fileName" class="file">
                        <div class="name">
                            <img src="@/assets/images/file.png" class="icon" alt="" />
                            {{ fileName }}
                        </div>
                    </div>
                    <input type="file" ref="selectBtn" @change="upload" class="file_btn" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                    <ws-throttle>
                        <el-button class="handle-btn" type="primary" @click="selectFile">选择文件</el-button>
                    </ws-throttle>
                    <div class="time">
                        <label class="label">生效起止时间：</label>
                        <ws-date-range
                            :startTime.sync="effectiveTime"
                            :defaultTime="['06:00:00', '23:00:00']"
                            :endTime.sync="effectiveEndTime"
                            :picker-options="pickerOptionsStartDate"
                        ></ws-date-range>
                    </div>
                    <!-- 功能暂时屏蔽，默认传0 2022年11月4日15:06:56 -->
                    <!-- <div class="time">
                        <label class="label">是否上架：</label>
                        <el-radio-group v-model="isDirectUp">
                            <el-radio style="width: 50px" :label="1">是</el-radio>
                            <el-radio style="width: 50px" :label="0">否</el-radio>
                        </el-radio-group>
                    </div> -->
                </div>
                <div class="step-style">
                    <span class="circle">3</span>
                    <div class="step">
                        <span class="info">如文件已上传完毕，请点击立即执行按钮进行</span>
                    </div>
                </div>
                <div class="btn-upload">
                    <el-button class="handle-btn" type="primary" @click="start">立即执行</el-button>
                </div>
                <div class="remark">
                    <p>温馨提示：</p>
                    <p>1、请先下载模板，使用模板文件导入</p>
                    <p>2、执行后，如出现系统异常，请到文件下载界面查看执行结果</p>
                </div>
            </div>
        </div>
        <div class="footer_btn">
            <el-button plain @click="back()">返回</el-button>
        </div>
        <progress-list :dataResult="dataResult" :progressType="progressType" title="批量导入包干价格"></progress-list>
    </div>
</template>

<script>
import ProgressList from '../components/progressList';
import util from '@/utils/util';
export default {
    components: {
        ProgressList,
    },
    data() {
        return {
            dataResult: {}, // 返回结果
            progressType: -1, //-1,关闭 0初始 1 成功 2：失败
            moduleName: '/workbench/baoganManage/priceSet/list',
            fileName: '',
            effectiveTime: '',
            effectiveEndTime: '',
            isDirectUp: 0,
            pickerOptionsStartDate: {
                shortcuts: null,
                disabledDate(time) {
                    return time.getTime() < new Date(new Date().toLocaleDateString()).getTime() || time.getTime() > new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000 * 31 - 1000;
                },
            },
        };
    },
    methods: {
        back(type) {
            if (type !== true) {
                this.$router.go(-1);
            } else {
                this.$router.push({ path: this.moduleName });
            }
        },
        downLoad() {
            util.downloadFile('/static/xlsx/priceSetTemplate.xls', '包干价格模板样式');
        },
        start() {
            let file = this.$refs.selectBtn.files[0];
            if (!file) {
                this.$message.error('请选择文件');
                return false;
            }
            if (!this.effectiveTime || !this.effectiveEndTime) {
                this.$message.error('请选择生效起止时间');
                return false;
            }
            let formData = new FormData();
            formData.append('file', file);
            formData.append('op', 'uploadingVipPriceRule');
            formData.append('token', this.$baseMethod.getStore('_ccmUser').token);
            formData.append(
                'data',
                JSON.stringify({
                    effectiveTime: this.effectiveTime,
                    effectiveEndTime: this.effectiveEndTime,
                    isDirectUp: this.isDirectUp
                })
            );
            let URL = this.powerList.uploadingVipPriceRule;
            this.$upLoad(URL, formData)
                .then(res => {
                    this.progressType = 0;
                    this.dataResult = {
                        message: res.msg,
                    };
                    setTimeout(() => {
                        this.progressType = 1;
                    }, 500);
                    this.$refs.selectBtn.value = '';
                })
                .catch(err => {
                    this.progressType = 2;
                    this.$refs.selectBtn.value = '';
                });
        },
        upload() {
            let file = this.$refs.selectBtn.files[0];
            this.fileName = file.name;
        },
        selectFile() {
            this.$refs.selectBtn.click();
        },
    },
};
</script>

<style lang="scss" scoped>
// 批量上传页面公共样式
.import_wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    .box {
        flex: 1;
        display: flex;
        justify-content: center;
        margin-bottom: 64px;
        background-color: #fff;
        border-radius: 8px;
    }
    .content {
        flex: 0 1 1000px;
        padding: 32px 0;
        background: #fff;
        border-radius: 8px;
        .title {
            margin-bottom: 24px;
            font-size: 16px;
            font-weight: 600;
            color: #303133;
        }
        .step-style {
            display: flex;
            align-items: center;
            height: 24px;
        }
        .circle {
            display: block;
            width: 24px;
            height: 24px;
            background: #f05259;
            border-radius: 12px;
            color: #fff;
            text-align: center;
            line-height: 24px;
        }

        .step {
            margin-left: 12px;
            font-size: 14px;
            font-weight: 600;
            color: #606266;
            .info {
                font-weight: 400;
            }
        }

        .btn-down {
            // height: 100px;
            padding-bottom: 40px;
            border-left: 1px dashed #f05259;
            margin: 6px 12px;
            .time {
                margin-top: 16px;
            }
            .label {
                padding-left: 20px;
                color: #606266;
                font-weight: 600;
            }
        }
        .file {
            margin: 12px 22px 6px;
            .name {
                display: inline-flex;
                align-items: center;
                height: 40px;
                border-radius: 8px;
                background: #f5f7fa;
                padding: 10px 8px;
                color: #606266;
                font-size: 14px;
                .icon {
                    width: 24px;
                    height: 24px;
                    margin-right: 6px;
                }
            }
        }
        .handle-btn {
            margin: 6px 22px;
        }

        .remark {
            padding: 16px 24px;
            background: #f5f7fa;
            border-radius: 4px;
            border: 1px solid #ebeef5;
            p {
                font-size: 14px;
                color: #606266;
                line-height: 20px;
            }
        }

        .btn-upload {
            padding-bottom: 40px;
            margin: 6px 12px;

            .file_btn {
                position: absolute;
                top: -100px;
                opacity: 0;
                z-index: 11;
            }
        }
        .set-btn {
            margin-top: 40px;
            .el-button {
                padding: 12px 64px;
            }
        }
    }
}
</style>
