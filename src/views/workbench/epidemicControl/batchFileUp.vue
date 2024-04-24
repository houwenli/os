<template>
    <div>
        <div class="import_wrap">
            <div class="content">
                <h4>批量录入</h4>
                <div class="step_1">
                    <span class="serial">1</span>
                    <p class="fl">
                        <span>下载模版</span>
                        （如模版已经下载，请直接点击第二步的上传文档按钮）
                    </p>
                </div>
                <div class="btn_1">
                    <ws-throttle>
                        <el-button type="primary" @click="downLoad">下载模板</el-button>
                    </ws-throttle>
                </div>
                <div class="step_1">
                    <span class="serial">2</span>
                    <p class="fl">
                        <span>上传模版</span>
                        （如文件已经上传，然后点击第三步的执行按钮）
                    </p>
                </div>
                <div :class="['btn_1', fileList.length ? 'upLine' : '']">
                    <div class="upText" v-if="fileList.length">
                        <img class="file-pic" src="@/assets/images/icon_55.png" />
                        <span>{{ fileList[0].name }}</span>
                        <span class="remove-file" @click="onRemove">删除</span>
                    </div>
                    <ws-throttle>
                        <el-upload ref="upload" accept="text/csv,application/vnd.ms-excel" action="" :on-change="handleChange" :file-list="fileList" :auto-upload="false">
                            <el-button type="primary">上传文档</el-button>
                        </el-upload>
                    </ws-throttle>
                </div>
                <div class="step_2">
                    <span class="serial">3</span>
                    <p class="fl">如文件已上传完毕,请填写完数据点击第三步执行按钮</p>
                </div>

                <div class="btn_2">
                    <el-button type="primary" @click="fileUpload" :loading="loading">立即执行</el-button>
                </div>
                <div class="remake">
                    <p>温馨提示：</p>
                    <p>1、请先下载模板，使用模板文件导入</p>
                    <p>2、提交执行后，请耐心等待执行结果，勿关闭当前页面</p>
                </div>
            </div>
        </div>
        <div class="footer_btn">
            <el-button @click="toWhiteList">返回</el-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import {mapState} from 'vuex'

export default {
    name: 'batchFileUp',
    data() {
        return {
            moduleName: '/workbench/whiteList',
            fileList: [],
            op: 'importWhiteList',
            loading: false,
            options: [],
            ruleId: '',
            cityName: ''
        };
    },
    computed: {
      ...mapState(['login'])
    },
    created() {
      let ruleId = this.$route.query.ruleId

      if(ruleId) {
        this.ruleId = ruleId
      }
      this.cityName = this.$route.query.cityName || ''
    },
    methods: {
        //下载模板
        downLoad() {
          let a = document.createElement('a');

          let url = `${process.env.VUE_APP_YQFK_API}/trafficTripManager/whiteList/select`


          let data = {
            op: 'downloadTemplate',
            token: this.login.userInfo.token
          }
          axios.post(url, data,{
            headers: {
              'Content-Type': 'application/json',
            },
            responseType: 'blob'
          }).then(res => {
            if( res.status === 200) {
              let downloadURL = URL.createObjectURL(res.data)
              a.download = '司机白名单导入模板.xls'; //指定下载的文件名
              a.href=downloadURL
              a.click(); // 模拟点击
              URL.revokeObjectURL(a.href); // 释放URL 对象
            }

          }).catch(err => {
            console.log('下载失败')
            console.log(err)
          })

        },
        //立即执行
        async fileUpload() {
           if (this.fileList.length === 0) {
                this.$message.error('请上传文档');
                return false;
            }

            this.loading = true;
            let file =  this.fileList[0].raw

            let formData = new FormData();
            formData.append('file', file);
            formData.append('op', this.op);
            formData.append('data', JSON.stringify({ ruleId: this.ruleId}));
            formData.append('token', this.login.userInfo.token);

            try {
                let res = await this.$upLoad(this.$getModuleUrl(this.moduleName,this.op), formData);
                if (res.code === 1) {
                    this.fileList = [];
                    this.$message.success('导入成功')

                    this.toWhiteList()
                }
            } catch (err) {
                console.log(err)
            } finally{
              this.loading = false;
            }
        },
        handleChange(file) {
            this.fileList = [file]
        },
        /**
         * 返回白名单列表
         */
        toWhiteList() {
            this.$router.push({
              name: 'whiteList',
              query: {
                id: this.ruleId,
                cityName: this.cityName
              }
            });
        },

        onRemove() {
          this.fileList = []
        }
    },
};
</script>

<style lang="scss" scoped>
.import_wrap {
    padding: 24px 32px 24px 32px;
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #dcdfe6;
    height: 100%;
    margin-bottom: 64px;
    .content {
        h4 {
            margin-bottom: 16px;
            font-size: 20px;
            font-weight: 500;
        }

        .el-button {
            margin-left: 24px;
        }

        .serial {
            display: block;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 1px solid #f05259;
            background-color: #f05259;
            color: #fff;
            text-align: center;
            line-height: 24px;
            font-size: 14px;
            float: left;
        }

        p {
            font-size: 16px;
            color: #4a4a4a;
            line-height: 24px;
            margin-left: 13px;
            span {
                font-size: 14px;
            }
        }
        .remake {
            padding: 16px 24px 24px;
            border-radius: 4px;
            border: 1px solid #ebeef5;
            background-color: #f5f7fa;
            p:first-child {
                margin-bottom: 8px;
            }
            p {
                font-size: 14px;
                line-height: 24px;
                margin-left: 0;
            }
        }

        .step_1 {
            height: 24px;
            margin-bottom: 12px;
        }

        .btn_1 {
            height: 120px;
            border-left: 1px dashed #f05259;
            margin: 0px 0px 0px 12px;
            .el-button {
                width: 127px;
            }
        }
        .upLine {
            padding-top: 12px;
            height: 142px;
            .el-button {
                margin-top: 12px;
            }
        }
        .step_2 {
            height: 24px;
            margin-bottom: 12px;
        }

        .btn_2 {
            height: 94px;
            margin-left: 12px;
            .el-button {
                width: 127px;
            }
            .file_btn {
                position: absolute;
                top: -100px;
                opacity: 0;
                z-index: 11;
            }
        }
        .fl {
            span {
                font-weight: 600;
            }
            /deep/ .el-form-item {
                margin-top: -6px;
            }
            /deep/ .el-input__inner {
                width: 290px;
            }
            /deep/ .el-form-item__label {
                font-size: 14px;
                font-weight: 400;
            }
        }
        .upText {
            display: inline-block;
            padding: 0px 10px 0px;
            margin: 0px 24px 0px;
            height: 40px;
            line-height: 40px;
            background: #ebeef5;
            border-radius: 8px;
            font-size: 14px;
            img {
                vertical-align: middle;
                padding-right: 6px;
            }
        }
        /deep/ .el-upload-list--text {
            display: none;
        }
    }
    .set_btn {
        margin-top: 40px;
        text-align: center;

        .el-button {
            padding: 12px 65px;
            margin-left: 0px !important;
        }
    }
}

.remove-file {
  margin-left: 16px;
  color: #F05259;
  cursor: pointer;
}

.file-pic {
  width: 32px;
  height: 24px;
}
</style>
