<template>
    <el-dialog title="" :visible.sync="dialogVisible"  :close-on-click-modal='false' :close-on-press-escape='false'>
        <div class="on-letter-main">
            <img class="on-letter-img" src="@/assets/images/img_title_entrance.png" alt="" />
            <div class="on-letter">
                <div class="panel-title">人员基本信息</div>
                <div class="person-wrap">
                    <el-col :span="12">
                        <span class="label-desc">姓名：</span>
                        {{ info.name }}
                    </el-col>

                    <el-col :span="12">
                        <span class="label-desc">职务：</span>
                        {{ info.positionName }}
                    </el-col>

                    <el-col :span="12">
                        <span class="label-desc">手机号码：</span>
                        {{ info.phone }}
                    </el-col>

                    <el-col :span="12">
                        <span class="label-desc">性别：</span>
                        {{ info.sex === 1 ?'男' : '女' }}
                    </el-col>

                    <el-col :span="12">
                        <span class="label-desc">分支机构：</span>
                        {{ info.deptName }}
                    </el-col>

                    <el-col :span="12">
                        <span class="label-desc">年龄：</span>
                        {{ info.age }}
                    </el-col>
                </div>

                <el-form ref="form" :disabled="info.recommendId !== undefined" :model="formModel" :rules="rules">
                    <div class="letter-text-desc">推荐理由</div>
                    <el-form-item prop="reason">
                        <el-input class="letter-text-value" :rows="4" type="textarea" v-model.trim="formModel.reason" placeholder="请输入推荐本学院的理由" maxlength="1000" show-word-limit></el-input>
                    </el-form-item>

                    <div class="letter-text-desc">学员优势</div>
                    <el-form-item prop="advantage">
                        <el-input class="letter-text-value" :rows="4" type="textarea" v-model.trim="formModel.advantage" placeholder="请输入该学员的优势" maxlength="1000" show-word-limit></el-input>
                    </el-form-item>

                    <div class="letter-text-desc">学员劣势</div>
                    <el-form-item prop="disadvantage">
                        <el-input
                            class="letter-text-value"
                            :rows="4"
                            type="textarea"
                            v-model.trim="formModel.disadvantage"
                            placeholder="请输入该学员的劣势"
                            maxlength="1000"
                            show-word-limit
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div class="tips">
                    <img style="width: 16px; height: 16px; margin-right: 3px" src="@/assets/images/icon_warning.png" alt="" />
                    {{ userInfo.promise || info.templateContent}}
                </div>
            </div>
        </div>

        <div slot="footer" style="text-align: center">
            <el-button style="width: 160px" @click="onCancel">取 消</el-button>
            <el-button v-if='!info.recommendId' style="width: 160px" type="primary" @click="onSubmit">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
// 入学推荐信
export default {
  name: 'entranceSchoolLetterDialog',
  props: {
    value: {
      type: Boolean
    },
    info: {
      type: Object,
      default: () => { }
    }
  },

  data () {
    return {

      formModel: {
        reason: '',
        advantage: '',
        disadvantage: ''
      },

      userInfo: {
        name: '',
        deptName: '',
        positionName: '',
        gender: '',
        phone: '',
        age: '',
        reason: '',
        advantage: '',
        disadvantage: '',
        // 底部提示文字
        promise: ''
      },

      rules: {
        reason: [
          {
            required: true,
            message: '请填写推荐理由',
            trigger: ['change', 'blur']
          }
        ],

        advantage: [
          {
            required: true,
            message: '请填写学员优势',
            trigger: ['change', 'blur']
          }
        ],
        disadvantage: [
          {
            required: true,
            message: '请填写学员劣势',
            trigger: ['change', 'blur']
          }
        ]
      },

      // 消息id
      id: ''
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.value
      },
      set () {
        this.$emit('update:value', false)
      }
    }
  },

  created() {
    this.id = this.$route.query.id

    // 有recommendId 说明是已经将用户和会议进行了绑定，就可以查询详情
    if (this.info.recommendId !==undefined) {
      this.getUserInfo()
    } else {
      Object.keys(this.formModel).forEach(key =>{
        this.formModel[key] = this.info[key]
      })
    }
  },

  methods: {
    /**
     * 查询人员基本信息
     */
    async getUserInfo() {
       let url = this.$getModuleUrl('/index/conference', 'getConferenceRecommend')

      if (!url) return
      try {
         let res = await this.$axios(url, {
            data: {
              // 会议id
              confId: this.info.confId,
              userId: this.info.userId
            },
            op: 'getConferenceRecommend'
          })

          let data = JSON.parse(res.data)
          console.log(data);

          this.userInfo.promise = data.promise
          this.userInfo.age = data.age

          this.formModel.reason = data.reason
          this.formModel.disadvantage = data.disadvantage
          this.formModel.advantage = data.advantage
      } catch (error) {
      }
    },

    checkForm() {
      let isOk = true

      this.$refs['form'].validate(valid => {
        isOk = valid
      })

      return isOk
    },

    onSubmit() {
      if (!this.checkForm()) return

      this.$emit('update', this.formModel)
      this.dialogVisible = false

    },

    onCancel() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.letter-text-desc {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
    margin-bottom: 16px;
    margin-top: 24px;
}

.letter-text-value {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #c0c4cc;
}

.panel-title {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
    padding-bottom: 16px;
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

.on-letter-main {
    width: 100%;
    border-radius: 8px;
    border: 1px solid #dcdfe6;
    .on-letter-img {
        width: 100%;
        display: inline-block;
    }
    .on-letter {
        border-radius: 0px 0px 8px 8px;
        padding: 16px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0) 70%, #f4f6ff 100%);

        .personal-form {
            // border: 1px solid #EBEEF5;
            width: 100%;
            display: inline-block;
            background: #f5f7fa;
            padding: 16px 24px;
            border-radius: 8px;

            /deep/.el-form-item__label {
                color: #606266;
            }
        }
        .tips {
            padding: 16px 0;
            background: #fef0f0;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 400;
            color: #f56c6c;
            padding: 10px 16px;
            display: flex;
            align-items: center;
            margin-top: 12px;
            word-break: break-all;
            span {
                color: #f56c6c;
            }
        }
    }
}
.on-letter-btn {
    text-align: center;
    margin: 40px 20px;
    font-size: 14px;
    .cancel-btn {
        min-width: 160px;
        height: 36px;
        font-weight: 400;
        color: #606266;
    }
    .confirm-btn {
        min-width: 160px;
        height: 36px;
        background: #f05259;
        border-radius: 4px;
        color: #fff;
    }
}
</style>
