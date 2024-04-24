<template>
  <!-- 结业推荐信 -->
  <div class="letter-detail">
    <!-- 结业标题 -->
    <div class="end-title">
      <div class="detail-title">
        <img
          class="title-left"
          src="https://wsjc-web.wsecar.com/oa/title_ending.png"
          alt=""
        />
        <span class="title-name"> | {{ info.user.name }}(学员)</span>
      </div>
      <img
        class="title-right"
        src="https://wsjc-web.wsecar.com/oa/img_mess.png"
        alt=""
      />
    </div>
    <!-- 引入会议基本信息，人员基本信息 -->
    <div class="letter-main">
      <graduationPersonInfo :info="info"></graduationPersonInfo>
      <meeting :info="info"></meeting>
    </div>
    <div class="letter-other">
      <div class="panel-title">结业推荐信</div>
      <div class="end-letter-form">
        <el-form ref="form" label-width="110px">
          <el-form-item label="人员学习情况：">
            <el-checkbox-group :disabled='true' v-model="checkList">
              <el-checkbox
                :label="item.text"
                :value="item.value"
                v-for="(item, i) in checkboxList"
                :key="i"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="其他情况：">
            <span>{{ info.completeResult.otherSituation }}</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="tips" v-if="info.completeResult.fixedStr">
        <img
          class="tips-img"
          src="https://wsjc-web.wsecar.com/oa/icon_warning.png"
          alt=""
        />
        <div> {{info.completeResult.fixedStr }}</div>
      </div>
    </div>

    <ws-footer>
      <el-button @click="onBack">返回</el-button>

      <el-button @click="onConfirm" v-if="info.message.dealStatus === 1"
        >确认接收</el-button
      >
    </ws-footer>
  </div>
</template>

<script>
import Meeting from './meeting.vue'
import graduationPersonInfo from './graduationPersonInfo.vue'

export default {
  name: 'endLetterRecomm',
  props: {
    info: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    Meeting,
    graduationPersonInfo
  },

  data () {
    return {
      checkboxList: [
        // {
        //   text: '准时参会',
        //   value: 1
        // },
        // {
        //   text: '认真听讲',
        //   value: 2
        // },
        // {
        //   text: '学习进步巨大',
        //   value: 3
        // }
      ],

      checkList: [],

      id: ''
    };
  },

  created () {
    let id = this.$route.query.id

    if (id !== undefined) {
      this.id = id

      let learnMap = this.info?.completeResult?.learnMap || {}

      Object.keys(learnMap).forEach(key => {
        this.checkboxList.push({
          text: key,
          value: this.info.completeResult.learnMap[key]
        })
      })
    }
  },
  methods: {
    onConfirm () {
      this.$confirm('确认是否接收？', '提示', {
        center: true,
        type: 'warning'
      }).then(async () => {
        let url = this.$getModuleUrl('/index/conference', 'completeResult')

        try {
          await this.$axios(url, {
            data: {
              id: this.id,
              status: 2
            },
            op: 'completeResult'
          })

          this.$emit('update')

          this.$message.success('接收成功')
        } catch (error) {
        }
      }).catch(() => { })
    },
    onBack () {
      this.$router.push({
        name: 'conference'
      })
    }
  },
};
</script>

<style scoped lang="scss">
.letter-detail {
  border: 1px solid #ebeef5;
  border-radius: 8px;

  .end-title {
    padding: 0px 24px;
    background-image: linear-gradient(to right, #dadfff, #eef0ff, #dedeff);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 8px 8px 0 0;

    .detail-title {
      display: flex;
      align-items: center;

      .title-name {
        // height: 28px;
        font-size: 20px;
        font-weight: 400;
        color: #606266;
        margin-left: 10px; // line-height: 28px;
      }

      .title-left {
        width: 150px;
        height: 30px;
      }
    }

    .title-right {
      width: 56px;
    }
  }

  .letter-main {
    padding-left: 24px;
    padding-right: 24px;

    /deep/ .meeting-main {
      padding: 24px;
    }
  }

  .letter-other {
    padding: 24px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 60%,
      #f4f6ff 100%
    );
    border-radius: 0px 0px 8px 8px;
  }

  .tips {
    background: #fef0f0;
    border-radius: 4px;
    word-break: break-all;
    display: flex;
    align-items: center;
    margin-top: 16px;
    padding: 10px 16px;

    .tips-img {
      width: 16px;
      height: 16px;
    }
  }

  .end-letter-form {
    border-radius: 8px;
    border: 1px solid #ebeef5;
    padding: 24px 16px 24px 24px;
  }
}

.panel-title {
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #303133;
  padding-bottom: 16px;
}
</style>