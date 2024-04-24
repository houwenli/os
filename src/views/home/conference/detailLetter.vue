<template>
  <!-- 推荐信（入学，结业），type 1为入学，2为结业 -->
  <div>
    <div class="detail-letter">
      <!-- v-if="$route.query.type == 1" -->
      <div class="metting-info-wrap">
        <!-- 入学 -->
        <!-- <on-letter-recomm v-if='info' :info='info'></on-letter-recomm> -->
        <!-- v-if="$route.query.type == 2" -->

        <!-- 结业 -->
        <end-letter-recomm v-if='hasData' :info='info' @update='onUpdate'></end-letter-recomm>
      </div>
    </div>


  </div>
</template>

<script>
// 入学
// import onLetterRecomm from './components/onLetterRecomm.vue'
// 结业
import endLetterRecomm from './components/endLetterRecomm.vue'

export default {
  name: 'detailLetter',
  components: {
    // onLetterRecomm,
    endLetterRecomm
  },
  data() {
    return {
      info: null,
      id: null,
      hasData: false
    }
  },

  created () {
    let id = this.$route.query.id

    if (id !== undefined) {
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
      } catch (error) {

      }
    },

    onBack () {
      this.$router.push({
        name: 'conference'
      })
    },

    onUpdate() {
      this.getDetail()
    }
  },
};
</script>

<style scoped lang="scss">
.detail-letter {
  width: 100%;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 64px;
  padding-bottom: 24px;

  .metting-info-wrap {
    max-width: 1000px;
    margin: 0 auto;
    padding-top: 32px;
  }
}
</style>
