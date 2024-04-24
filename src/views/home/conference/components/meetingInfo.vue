<template>
  <!-- 会议基本信息 -->
  <div>
    <div class="info-detail">
      <div class="info-title">开会通知</div>
      <div class="info-name">
        <div>发布人：{{ info.message.publishUserName }}</div>
        <div class="notice-time">
          会议通知:
          <div class="sep-line"></div>
          {{ info.message.publishTime }}
        </div>
      </div>
      <div class="info-main">
        <meeting v-if="info" :info="info"></meeting>
      </div>
    </div>
  </div>
</template>

<script>
import meeting from './meeting.vue'

export default {
  name: 'meetingInfo',
  props: {
    info: {
      type: Object,
      default: () => { }
    }
  },

  components: {
    meeting
  },
  data () {
    return {
      title: '会议基本信息'
    };
  }
};
</script>

<style scoped lang="scss">
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