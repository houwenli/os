<template>
  <!-- 会议通知 -->
  <div>
    <div class="detail-notice">
      <div class="metting-info-wrap">
        <div class="info-detail">
          <div class="info-title">{{info.conference.name}}</div>
          <div class="info-name">
            <div>发布人：{{ info.message.publishUserName }}</div>
            <div class="notice-time">
              会议通知
              <div class="sep-line"></div>
              {{ info.message.publishTime }}
            </div>
          </div>
        </div>

        <meeting v-if="hasData" :info="info">
          <template #tips>
            <div class="bg-red" v-if="showRedText">
              <img
                style="width: 16px; height: 16px; margin-right: 3px"
                src="@/assets/images/icon_error.png"
                alt=""
              />
              本次会议已选择不推荐学员参加
            </div>
          </template>
        </meeting>

        <!-- 根据传入的来判断是否展示推荐人名单 -->
        <reference v-if="showList" @updateShow="updateShow" :confId='info.message.confId' :deptId="info.message.deptId"></reference>

        <div class="info-btn" v-if="isShowRecommendOptions">
          <el-button @click="onOpenDialog">不推荐人员参加会议</el-button>
          <el-button type="danger" @click="onOpenRecommonList"
            >推荐人员参加会议</el-button
          >
        </div>

        <div
          style="text-align: center; margin-top: 16px"
          v-if="isShowContinueRecommend"
        >
          <el-button @click="onContinueJoin">继续推荐学员参加</el-button>
        </div>
      </div>
    </div>

    <el-dialog title="提示" :visible.sync="isShowDialog" width="30%" center>
      <div style="text-align: center">
        是否确定本次会议不推荐人员参加会议，请谨慎选择
      </div>
      <template slot="footer">
        <el-button @click="onCancel()">取 消</el-button>
        <el-button type="danger" @click="toSave()">确 定</el-button>
      </template>
    </el-dialog>

    <ws-footer>
      <el-button @click="onBack">返回</el-button>
    </ws-footer>
  </div>
</template>

<script>
import reference from './components/reference.vue'
import meeting from './components/meeting.vue'

export default {
  name: 'detailNotice',
  components: {
    meeting,
    reference
  },

  data () {
    return {
      info: {
        conference: {
          name: ''
        },

        message: {
          publishUserName: '',
          publishTime: '',
          // 会议id
          confId: null
        }
      },

      hasData: false,

      isShowDialog: false,
      showList: false,

      // 是否显示【推荐和不推荐】按钮
      isShowRecommendOptions: true,
      showRedText: false,

      // 是否继续推荐学员按钮
      isShowContinueRecommend: false,
      id: null
    }
  },

  created () {
    let id = this.$route.query.id

    if (id) {
      this.id = id
      this.getDetail()
    }
  },
  methods: {
    async getDetail () {
      let url = this.$getModuleUrl('/index/conference', 'conferenceMessageDetail')

      if (!url) return

      try {
        let res = await this.$axios(url, {
          data: {
            id: this.id
          },
          op: 'conferenceMessageDetail'
        })

        this.info = JSON.parse(res.data) || {}

        this.hasData = true

        // 查询详情-如果是已处理，直接显示  继续推荐学员 按钮
        if (this.info.message.dealStatus === 2) {
          this.isShowRecommendOptions = false
          this.isShowContinueRecommend = true
        }
      } catch (error) {
        console.log(error);
      }
    },


    updateShow () {
      this.showList = false

      // 如果当前的会议已经被处理过, 就不要现实2个按钮
      if (this.info.message.dealStatus === 2) {
        this.isShowRecommendOptions = false
        this.isShowContinueRecommend = true
      } else {
        this.isShowRecommendOptions = false
      }
    },
    // 不推荐
    onOpenDialog () {
      this.isShowDialog = true
    },
    // 推荐学员参加
    onOpenRecommonList () {
      this.showList = true
      this.isShowRecommendOptions = false
    },
    // 取消
    onCancel () {
      this.isShowDialog = false
    },

    /**
     * 继续推荐学员参加
     */
    onContinueJoin () {
      this.isShowContinueRecommend = false
      this.showList = true
    },

    // 确认不推荐
    async toSave () {
      let url = this.$getModuleUrl('/index/conference', 'recommendStaff')

      if (!url) return

      try {
        await this.$axios(url, {
          data: {
            id: this.id,
            // 1-同意， 2-拒绝
            status: 2,
            recommendStatus: 1
          },
          op: 'recommendStaff'
        })

        this.isShowRecommendOptions = false
        this.showRedText = true

        this.isShowContinueRecommend = true
      } catch (error) {
      } finally {
        this.isShowDialog = false
      }
    },
    onBack () {
      this.$router.push({
        name: 'conference'
      })
    }
  }
};
</script>

<style scoped lang="scss">
.detail-notice {
  width: 100%;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 64px;
  padding-bottom: 24px;

  .metting-info-wrap {
    max-width: 1000px;
    margin: 0 auto;
  }
}

.info-btn {
  margin-top: 40px;
  text-align: center;
}

.bg-red {
  background: #fef0f0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  color: #f56c6c;
  padding: 10px 16px;
  display: flex;
  align-items: center;
}

.info-detail {
  width: 100%;
  min-height: 100%;
  background: #fff;
  .info-title {
    font-size: 32px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
    text-align: center;
    padding-top: 40px;
    margin-bottom: 24px;
  }

  .info-name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #dcdfe6;
    padding-bottom: 24px;

    color: #606266;
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 23px;
  }

  .notice-time {
    display: flex;
    align-items: center;
  }
}

.sep-line {
  display: inline-block;
  width: 1px;
  height: 14px;
  background: #dcdfe6;
  margin-left: 8px;
  margin-right: 8px;
}
</style>
