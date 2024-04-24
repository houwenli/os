<template>
  <!-- 会议基本信息 -->
  <div>
    <div class="panel-title">会议基本信息</div>

    <div class="meeting-main">
      <div class="item">
        <div><span class="star">*</span>会议名称：</div>
        <div style="font-weight: 600">{{ info.conference.name }}</div>
      </div>
      <div class="item">
        <div><span class="star">*</span>会议地点：</div>
        <div>{{ info.conference.address }}</div>
      </div>
      <div class="item">
        <div><span class="star">*</span>报到时间：</div>
        <div>{{ info.conference.signTime }}</div>
      </div>
      <div class="item">
        <div><span class="star">*</span>返程时间：</div>
        <div>{{ info.conference.returnTime }}</div>
      </div>
      <div class="item">
        <div class="left"><span class="star">*</span>会议描述：</div>
        <div>{{ info.conference.description }}</div>
      </div>
      <div class="item join-rules">
        <div class="left"><span class="star">*</span>参会要求：</div>
        <div class="info-textarea" >
          <!-- 输入端的回车是\n字符串，v-html无法识别 -->
          <div v-html="getRequirementText"></div>
        </div>
      </div>

      <slot name="tips"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'meetingInfo',
  props: {
    info: {
      type: Object,
      default: () => { }
    }
  },

  computed: {
    getRequirementText() {
      if (this.info.conference.requirement) {
        return this.info.conference.requirement.split('\n').join('<br>')
      }
      return ''
    }
  }
};
</script>

<style scoped lang="scss">
.panel-title {
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #303133;
  padding-bottom: 16px;
}

.meeting-main {
  border-radius: 8px;
  border: 1px solid #ebeef5;
  padding: 24px 16px 16px 16px;

  .item {
    display: flex;
    margin-bottom: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #606266;

    .left {
      min-width: 78px;
    }
  }

  .join-rules {
    .left {
      margin-top: 8px;
    }
  }
  .star {
    color: #f05259;
  }

  .info-textarea {
    flex: 1;
    min-height: 124px;
    padding: 12px 16px;
    background: #f5f7fa;
    border-radius: 4px;
    word-break: break-all;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #303133;
  }
}
</style>