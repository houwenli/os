<template>
  <div>
      <div class="page-container">
          <el-form :disabled="true" inline label-width="110px">
              <div class="panel">
                  <div class="first-level-title">基本信息</div>

                  <el-row>
                      <el-col :span="8">
                          <el-form-item label="机构类型：">
                              <el-input v-model="formModel.orgTypeText"></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="8">
                          <el-form-item label="机构名称：">
                              <el-input v-model="formModel.orgName"></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="8">
                          <el-form-item label="用户手机号：">
                              <el-input v-model="formModel.userPhone"></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row>
                      <el-col :span="8">
                          <el-form-item label="用户姓名：">
                              <el-input v-model="formModel.userName"></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
              </div>
              <div class="panel">
                  <div class="first-level-title">留言信息</div>
                  <el-row>
                      <el-col :span="8">
                          <el-form-item label="留言时间：">
                              <el-input v-model="formModel.createTime"></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row>
                      <el-col :span="24">
                          <el-form-item label="留言内容：">
                              <el-input type="textarea" :rows="6" v-model="formModel.messageContent"></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
              </div>
          </el-form>
          <div class="panel">
              <div class="first-level-title">
                  <div class="left">回复记录</div>
                  <div class="right">
                      <el-button icon="el-icon-plus" plain  @click="openReplyModal" v-if="powerList.addReply">添加回复</el-button>
                  </div>
              </div>

              <el-table :data="formModel.replyList" border :header-row-style="{ background: '#F5F7FA;' }">
                  <el-table-column label="回复人" prop="userName"></el-table-column>
                  <el-table-column label="回复内容" prop="messageContent"></el-table-column>
                  <el-table-column label="回复时间" prop="createTime"></el-table-column>
                  <el-table-column label="操作">
                      <template slot-scope="{ row }">
                          <el-button type="text" style="color: #f05259" v-if="powerList.deleteReply" @click="onRemove(row)">删除</el-button>
                      </template>
                  </el-table-column>
              </el-table>
          </div>
      </div>

      <ws-footer>
          <el-button @click="onBack">返回</el-button>
      </ws-footer>

      <!-- 留言回复弹窗 -->
      <replyModal :value.sync="replyModal" v-if="replyModal" :info="formModel" @updateData="onReply" />
  </div>
</template>

<script>
import replyModal from '../components/replyModal.vue'

let orgTypeList = [
  {
      value: '0',
      label: '总部'
  },
  {
      value: '20',
      label: '一级机构'
  },
  {
      value: '30',
      label: '二级机构'
  },
  {
      value: '40',
      label: '实体店'
  }
]

// 留言详情
export default {
  name: 'detail',
  components: {
      replyModal
  },
  data() {
      return {
          // 一个公告对应多条留言 1->n 的关系
          formModel: {
              orgTypeText: '',
              orgType: '',
              orgName: '',
              createUserName: '',
              createUserPhone: '',
              messageContent: '',
              createTime: '',
              replyList: [],
              parentId: '',
              // 留言的id
              id: '',
              // 公告的id
              orgNoticeId: '',
              hide: 0,
              noticeStatus: null
          },
          id: null,

          replyModal: false,

          // 1-消息通知, 2-政策文件, 3-知识园地
          type: ''
      }
  },
  computed: {
  },
  created() {
      let id = this.$route.query.id
      let type = this.$route.query.type
      this.moduleName=this.$route.query.moduleName

      if (id !== 'undefined') {
          this.id = id

          this.type = Number(type)
          this.getDetail()
      }
  },
  methods: {
      async getDetail() {
        console.log(this.moduleName,'4545');
          try {
              let url = this.$getModuleUrl(this.moduleName, 'replyDetail')

              let res = await this.$axios(url, {
                  data: {
                      id: this.id
                  },
                  op: 'replyDetail'
              })

              if (res.code === 1) {
                  let data = JSON.parse(res.data)

                  data.orgTypeText = orgTypeList.find(p => Number(p.value) === data.orgType).label

                  this.formModel = data
              }
          } catch (error) {}
      },
      onRemove(row) {
          let url = this.$getModuleUrl(this.moduleName, 'deleteReply')
          let params = {
              data: {
                  id: row.id
              },
              op: 'deleteReply'
          }

          this.$confirm('确认删除留言?', '提示')
              .then(async () => {
                  try {
                      await this.$axios(url, params)
                      this.$message.success('删除成功')

                      this.getDetail()
                  } catch (error) {}
              })
              .catch(e => {})
      },

      onBack() {
        this.$router.go(-1)
      },

      openReplyModal() {
          this.replyModal = true
      },

      /**
       * 回复
       */
      async onReply(data) {
          let url = this.$getModuleUrl(this.moduleName, 'addReply')

          let params = {
              op: 'addReply',
              data: {
                  // 公告的id
                  orgNoticeId: this.formModel.orgNoticeId,
                  noticeType: this.formModel.noticeType,
                  // 留言的id
                  parentId: this.id,
                  messageContent: data.message,
                  replyType: 2
              }
          }
          try {
              await this.$axios(url, params)
              this.$message.success('回复成功')

              this.replyModal = false

              this.getDetail()
          } catch (error) {}
      },

      /**
       * 回复按钮通过按钮权限控制
       */
      showReplyButton() {
          if (!this.$getModuleUrl(this.moduleName, 'commentReplyButton')) return false

          //  3-已失效  状态的不能进行回复操作
          if (this.formModel.noticeStatus === 3) return false

          return this.formModel.hide === 0
      }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 32px 40px;
  background: #fff;
  margin-bottom: 64px;
  border-radius: 8px;

  /deep/ .el-form-item {
      width: 100%;
  }
  /deep/ .el-form-item__content {
      width: calc(100% - 160px);
  }
}

.first-level-title {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.panel {
  margin-bottom: 32px;
}
</style>
