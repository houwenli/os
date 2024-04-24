<template>
  <div>
      <el-dialog title="回复" :visible.sync="dialogVisible" width="50%" :close-on-press-escape="false" :close-on-click-modal="false">
          <el-form :model="formModel" :rules="rules" ref="form">
              <!-- 附属信息 -->
              <div class="comment-sub-info">
                  <div class="avator avator-me">{{ firstUserNameWord }}</div>
                  <div class="right">
                      <div class="comment-username">{{ getUserName }}</div>

                      <div class="comment-item-content">{{ this.info.messageContent }}</div>
                      <!-- 主留言的时间 -->
                      <div class="comment-time">{{ showTimeText }}</div>

                      <el-form-item prop="content">
                          <el-input
                              type="textarea"
                              maxlength="300"
                              show-word-limit
                              v-model="formModel.content"
                              rows="7"
                              :placeholder="placeholder"
                              class="reply-text-box"
                          ></el-input>
                      </el-form-item>
                  </div>
              </div>
          </el-form>

          <div slot="footer" style="text-align: right">
              <el-button @click="closeModal">取 消</el-button>
              <el-button type="primary" @click="submit">确 定</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
import { debounce } from 'lodash-es'
import { getTimeStatus } from './../policy/data.js'

export default {
  name: 'replyModal',
  props: {
      value: {
          type: Boolean,
          require: true
      },
      info: {
          type: Object,
          default: () => {
              return {
                  userName: '',
                  messageContent: '',
                  createTime: ''
              }
          }
      }
  },
  data() {
      return {
          formModel: {
              content: ''
          },

          rules: {
              content: [
                  {
                      required: true,
                      message: '请输入回复内容',
                      trigger: ['blur', 'change']
                  }
              ]
          }
      }
  },
  computed: {
      dialogVisible: {
          get() {
              return this.value
          },
          set(val) {
              this.$emit('update:value', val)
          }
      },

      placeholder() {
          return `回复${this.info.orgName || ''}-${this.info.positionName || ''}-${this.info.userName || ''}：`
      },

      firstUserNameWord() {
          if (this.info.userName) {
              return this.info.userName.substring(0, 1)
          }
          return ''
      },

      getUserName() {
          return [this.info.orgName, this.info.positionName, this.info.userName].join('-')
      },

      /**
       * 当前时间 - t 小于24H时 就显示 xx小时前
       */
      showTimeText() {
          if (this.info.createTime) {
              let diff = getTimeStatus(this.info.createTime)

              if (diff <= 24 && diff >= 0) return `${diff}小时前`
          }

          return this.info.createTime || ''
      }
  },
  methods: {
      checkForm() {
          let isOk = true

          this.$refs['form'].validate(valid => {
              isOk = valid
          })

          return isOk
      },

      closeModal() {
          this.dialogVisible = false
      },
      submit: debounce(
          async function () {
              if (!this.checkForm()) return
              this.$emit('updateData', {
                  message: this.formModel.content
              })
          },
          2000,
          {
              leading: true,
              trailing: false
          }
      )
  }
}
</script>

<style lang="scss" scoped>
.comment-sub-info {
  width: 100%;
  display: flex;

  .right {
      flex: 1;
  }
}
.comment-username {
  font-weight: 600;
  margin-bottom: 8px;
}

.comment-item-content {
  margin-bottom: 8px;
  color: #303133;
  font-size: 16px;
  line-height: 22px;
}
.comment-item {
  margin-bottom: 16px;
}
.comment-time {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #909399;
  margin-bottom: 16px;
}
.avator {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 24px;
  text-align: center;
  line-height: 48px;
  overflow: hidden;
  font-weight: 600;
}

.avator-me {
  background: #0088ff;
  color: #fff;
}

.reply-text-box {
  /deep/ textarea {
      background: #f5f7fa;
  }
  /deep/ .el-input__count {
      background: #f5f7fa;
  }
}
</style>
