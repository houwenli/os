<template>
  <!-- 个人信息填报 -->
  <div>
    <div class="detail-personal">
      <div class="metting-info-wrap">
        <div class="title">参会个人信息填报</div>

        <meeting v-if="hasData" :info="info"></meeting>
        <div style="margin-top: 24px">
          <personalInfo v-if="hasData" :type="0" :info='info'></personalInfo>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import personalInfo from './components/personalInfo.vue'
import meeting from './components/meeting.vue'

export default {
  name: 'detailNotice',
  components: {
    meeting,
    personalInfo
  },

  data () {
    return {
      hasData: false,
      info: {
        conference: {
          name: ''
        },

        message: {
          publishUserName: '',
          publishTime: ''
        },
        user: {
          // 用户id
          id: '',
          name: '',
          phone: '',
          positionName: '',
          gender: null,
          age: null,
          deptName: ''
        },

        staffInfo: {

        }
      },
    }
  },

  created () {
    let id = this.$route.query.id

    if (id) {
      this.getDetail(id)
    }
  },

  methods: {
    async getDetail (id) {
      let url = this.$getModuleUrl('/index/conference', 'conferenceMessageDetail')

      if (!url) return

      try {
        let res = await this.$axios(url, {
          data: {
            id
          },
          op: 'conferenceMessageDetail'
        })

        this.info = JSON.parse(res.data) || {}

        this.hasData = true
      } catch (error) {
        console.log(error);
      }
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
.detail-personal {
  width: 100%;
  background: #fff;
  border-radius: 8px;
  padding-bottom: 24px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  line-height: 28px;
  text-align: center;
  padding-bottom: 24px;
  padding-top: 32px;
  border-bottom: 1px solid #dcdfe6;
  margin-bottom: 23px;
}

.metting-info-wrap {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
