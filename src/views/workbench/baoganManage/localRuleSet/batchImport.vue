<template>
    <div class="import_wrap">
        <div class="content">
            <h4>批量导入</h4>
            <div class="step_1">
                <span>1</span>
                <p class="fl">下载模版（如模版已经下载，请填写完直接点击第二步的立即执行按钮）</p>
            </div>
            <div class="btn_1">
                <ws-throttle>
                    <el-button class="el-button--primary" type="primary" @click="downLoad">下载模板</el-button>
                </ws-throttle>
            </div>
            <div class="step_2">
                <span>2</span>
                <p class="fl">填写信息（如模版已经下载，请填写完直接点击第二步的立即执行按钮）</p>
            </div>

            <div class="btn_2">
                <el-button class="el-button--primary" type="primary" @click="importFile">立即执行</el-button>
                <input ref="fileBtn" @change="fileUpload" class="file_btn" type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
            </div>
            <div class="remake">
                <p>温馨提示：</p>
                <p>1、请先下载模板，使用模板文件导入</p>
                <p>2、执行后，如出现系统异常，请到文件下载界面查看执行结果</p>
            </div>
        </div>
        <div class="footer_btn">
            <el-button plain @click="back()">返回</el-button>
        </div>
        <progress-list :dataResult="dataResult" :progressType="progressType" title="批量导入包干规则"></progress-list>
    </div>
</template>

<script>
import ProgressList from '../components/progressList'
import util from '@/utils/util';
export default {
    data() {
        return {
            dataResult: {}, // 返回结果
            progressType: -1, //-1,关闭 0初始 1 成功 2：失败
            moduleName: '/workbench/baoganManage/localRuleSet/list',
        }
    },
    components: {
        ProgressList
    },
    methods: {
        back(type) {
            if (type !== true) {
                this.$router.go(-1)
            } else {
                this.$router.push({ path: this.moduleName })
            }
        },
        downLoad() {
            util.downloadFile("/static/xlsx/ruleSettemplate.xls", "包干规则表模板样式")
        },
        importFile() {
            this.$refs.fileBtn.click();
        },
        fileUpload() {
            let file = this.$refs.fileBtn.files[0];
            let formData = new FormData();
            formData.append('file', file);
            formData.append('op', 'uploadingVipRule');
            formData.append('token', this.$baseMethod.getStore('_ccmUser').token);
            formData.append('data', JSON.stringify({}));
            let URL = this.powerList.uploadingVipRule
            this.$upLoad(URL, formData).then((res) => {
                this.progressType = 0
                this.dataResult = {
                    message: res.msg
                }
                setTimeout(() => {
                    this.progressType = 1
                }, 500);
                this.$refs.fileBtn.value = ''
            }).catch(err => {
                this.progressType = 2
                this.$refs.fileBtn.value = ''
            })
        }
    }

}
</script>

<style lang="scss" scoped>
.import_wrap {
    .content {
        padding: 60px;
        background: #f0f2f5;
        border-radius: 8px;
        border: 1px solid #dcdfe6;

        h4 {
            margin-bottom: 33px;
            font-size: 22px;
        }

        .el-button {
            margin-left: 45px;
        }

        span {
            display: block;
            width: 36px;
            height: 36px;
            border-radius: 2px;
            border: 1px solid #f05259;
            color: #f05259;
            text-align: center;
            line-height: 36px;
            font-size: 16px;
            float: left;
        }

        p {
            font-size: 16px;
            color: #4a4a4a;
            line-height: 36px;
            margin-left: 28px;
        }
        .remake {
            p {
                font-size: 14px;
                line-height: 24px;
                margin-left: 0;
            }
        }

        .step_1 {
            height: 36px;
        }

        .btn_1 {
            height: 94px;
            border-left: 1px solid #f05259;
            margin: 12px 0 12px 18px;
        }

        .step_2 {
            height: 36px;
            margin-bottom: 12px;
        }

        .btn_2 {
            height: 94px;
            margin-left: 18px;

            .file_btn {
                position: absolute;
                top: -100px;
                opacity: 0;
                z-index: 11;
            }
        }
    }
}
</style>
