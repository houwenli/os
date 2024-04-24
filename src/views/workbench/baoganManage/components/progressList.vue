<template>
    <div class="callBack-show" v-if="dialogProgressVisible">
        <div class="mask"></div>
        <div class="layer-progress">
            <div class="batch">{{title}}</div>
            <el-progress v-if="progressStatus != 'error'" :stroke-width="15" :percentage="percentage" color="#5cb87a"></el-progress>
            <el-progress v-else :stroke-width="15" :percentage="percentage" status="exception"></el-progress>
            <div class="tips">
                <p v-if="percentage < 100">系统正在处理，请稍后</p>
                <p v-if="percentage == 100 && progressStatus == 'success'">{{dataResult.message}}</p>
                <p v-if="percentage == 100 && progressStatus == 'error'">{{dataResult.message}}</p>
            </div>
            <div class="btns">
                <el-button type="primary" v-if="percentage == 100 && (progressStatus == 'success' || progressStatus == 'error')" @click="back()">确认</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'dataResult', //返回结果
        'progressType', //-1,关闭 0初始 1 成功 2：失败
        'title',
        'afterEmit'
    ],
    data() {
        return {
            dialogProgressVisible: false,
            percentage: 0,  //进度条进度
            progressSpeed: {
                minNum: 15,
                maxNum: 25,
                timerNumber: 200
            },
            timer: null
        }
    },
    watch: {
        progressType: {
            handler(val) {
                switch (val) {
                    case -1:
                        this.dialogProgressVisible = false;
                        break;
                    case 0:
                        this.dialogProgressVisible = true;
                        this.progressStatus = 'success';
                        this.loading();
                        break;
                    case 1:
                        this.progressStatus = 'success';
                        this.percentage = 100;
                        break;
                    case 2:
                        this.progressStatus = 'error';
                        this.percentage = 100;
                        break;
                }
            },
            immediate: true
        }
    },
    methods: {
        back() {
            this.dialogProgressVisible = false
            this.percentage = 0
            this.progressStatus = 'success'
            if (typeof this.afterEmit === 'function') {
                this.afterEmit()
            } else {
                this.$router.go(-1)
            }
        },
        loading() {
            this.timer = setInterval(() => {
                let ms = this.$baseMethod.randomNum(this.progressSpeed.minNum, this.progressSpeed.maxNum)
                if (ms + this.percentage >= 99) {
                    clearInterval(this.timer)
                } else {
                    this.percentage += ms
                }
            }, this.progressSpeed.timerNumber);
        },
    },
}
</script>

<style lang="scss" scoped>
.callBack-show {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    color: #606266;
    .mask {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #000;
        opacity: 0.75;
    }
    .layer-progress {
        position: absolute;
        top: -15%;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 600px;
        height: 290px;
        padding: 50px 80px;
        border-radius: 8px;
        background: #fff;
        box-shadow: 0px 6px 17px 0px rgba(0, 0, 0, 0.2);
        .batch {
            width: 100%;
            text-align: center;
            padding-bottom: 20px;
        }
        .el-progress {
            left: 20px;

            /deep/ .el-progress__text {
                font-size: 14px !important;
            }
        }
        .tips {
            margin-top: 22px;
            text-align: center;
            line-height: 30px;
        }
        .btns {
            text-align: center;
            margin-top: 20px;
        }
    }
}
</style>
