<template>
    <div class="container">
        <div class="form-content-wrap">
            <div class="letter">
                <div class="recommendTitle">
                    <img style="width:100%" class="on-letter-img" src="@/assets/images/img_title_entrance.png" alt="">
                </div>
                <div class="paddingLetter">
                    <div class="panel">
                        <div class="title">人员基本信息</div>
                        <el-form  label-width="100px">
                            <div class='person-wrap'>
                                <el-row>
                                    <el-col :span="12">
                                        <span class="label-desc">姓名：</span>
                                        {{detailData.name}}
                                    </el-col>
                                    <el-col :span="12">
                                        <span class="label-desc">职位：</span>
                                        {{detailData.positionName}}
                                    </el-col>

                                    <el-col :span="12">
                                        <span class="label-desc">手机号码：</span>
                                        {{detailData.phone}}
                                    </el-col>
                                    <el-col :span="12">
                                      <span class="label-desc">性别：</span>
                                      {{ getSex }}
                                    </el-col>

                                    <el-col :span="12">
                                      <span class="label-desc">分支机构：</span>
                                      {{detailData.deptName}}
                                    </el-col>
                                    <el-col :span="12">
                                      <span class="label-desc">年龄：</span>
                                      {{detailData.age}}
                                    </el-col>
                                </el-row>
                            </div>
                        </el-form>
                    </div>
                </div>
                <div class="other">
                    <div class='info-row'>
                      <div class="title">推荐理由</div>
                      <div class='other-content' v-html='detailData.reason'>
                      </div>
                    </div>
                   <div class='info-row'>
                    <div class="title">学员优势</div>
                    <div class='other-content' v-html='detailData.advantage'></div>
                   </div>
                  <div class='info-row'>
                    <div class="title">学员劣势</div>
                    <div class='other-content' v-html='detailData.disadvantage'></div>
                  </div>
                    <div class="tip">
                        <img src="https://wsjc-web.wsecar.com/oa/icon_warning.png" alt="">
                        <div>{{tip}}</div>
                    </div>
                </div>
            </div>
        </div>

        <ws-footer>
            <el-button @click="goBack">取消</el-button>
            <el-button @click="onSubmit">通过</el-button>
        </ws-footer>
    </div>
</template>
<script>
export default {
    name: 'conferenceManagementForm',
    props:{
        visible : {
            type: Number,
            default: () => null,
        },
        dialogData : {
            type: Object,
            default: () => {},
        }
    },
    data() {
        return {
            tip:'',
            detailData:{},
            tableData: [],
            moduleName:'/workbench/conference/management',
        }
    },

    computed: {
      getSex() {
        if (this.detailData.gender) {
          return this.detailData.gender === 1 ? '男' : '女'
        }
        return ''
      }
    },

    methods: {
        async getDetail() {
            try {
                let data = {
                    data:JSON.stringify({
                        confId: this.dialogData.confId,
                        userId: this.dialogData.userId,
                    }),
                    op: 'getConferenceRecommend'
                }
                let res = await this.$axios(this.getModuleUrl(data.op),data)

                let resData= JSON.parse(res.data)
                this.detailData = resData
            } catch (error) {

            }
        },
        getTemplate() {
            let data = {
                data:JSON.stringify({type: 2}),
                op:'selectTemplate'
            }
            this.$axios(this.getModuleUrl(data.op),data).then(res => {
                const resData = JSON.parse(res.data)
                this.tip = resData[0].templateContent
            }).catch(err => {})
        },
        async onSubmit() {
            try {
                let data = {
                    data: JSON.stringify({
                        confId: this.dialogData.confId,
                        userId: this.dialogData.userId,
                        status: 1
                    }),
                    op: 'checkMeeting'
                }
                const res = await this.$axios(this.getModuleUrl(data.op),data)
                if(res.code === 1) {
                    this.$message.success("审核成功！")
                    this.goBack()
                }
            } catch (error) {

            }
        },
        goBack() {
            this.$emit('update:visible', 1)
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },

    mounted() {
        this.getTemplate()
        this.getDetail()
    }
}
</script>
<style lang="scss" scoped>
.container {
    width: 100%;
    .form-content-wrap {
        width: 100%;
        min-height: 100%;
        background: #ffffff;
        padding: 32px 356px;
        border-radius: 8px;
        margin-bottom: 64px;
        .letter {
            border: 1px solid #ebeef5;
            border-radius: 8px;
            box-sizing: border-box;
            .paddingLetter {
                padding: 0 24px;
            }
            .recommendTitle {
                padding:0px 24px;
                background-image: linear-gradient(to right,#DADFFF,#EEF0FF,#DEDEFF );
                margin-bottom: 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-radius: 8px 8px 0 0;
                .ending {
                    width: 150px;
                }
                .mess {
                    width: 56px;
                }
            }
            .panel {
                margin-bottom: 32px;
                .title {
                    font-size: 16px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #303133;
                    margin-bottom: 16px;
                }

                .study {
                    padding: 24px;
                    border: 1px solid #EBEEF5;
                    border-radius: 8px;
                }
            }
            .other {
                padding: 0 24px;
                padding-bottom: 16px;
                border-radius: 0 0 8px 8px;
                background-image: linear-gradient(#FFFFFF, #F4F6FF);
                .title {
                    font-size: 16px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #303133;
                    margin-bottom: 16px;
                }
                .tip {
                    padding: 10px 16px;
                    margin-top: 16px;
                    background-color: #FEF0F0;
                    color: #F56C6C;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    img {
                        width:16px;
                        height: 16px;
                        margin-right: 4px;
                    }
                }
            }
        }
    }
}

.info-row {
  margin-bottom: 24px;
}

.other-content {
  padding: 8px 16px;
  background: #F5F7FA;
  border-radius: 4px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #606266;
  line-height: 20px;
  word-break: break-all;
}

.person-wrap {
  position: relative;
  background: #f5f7fa;
  border-radius: 8px;

  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #303133;
  padding-top: 14px;
  padding-bottom: 14px;
  margin-bottom: 24px;

  .label-desc {
    color: #606266;
    display: inline-block;
    width: 100px;
    text-align: right;
    line-height: 20px;
    margin: 10px 0;
  }

  &::after {
    display: block;
    visibility: hidden;
    height: 0;
    clear: both;
    content: ' ';
  }
}
</style>
