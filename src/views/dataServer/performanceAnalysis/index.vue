<template>
  <div>
    <div class="page_content">
      <!-- <div class="radio_box">
        <el-radio-group v-model="radioQuery" :border="false">
          <el-radio-button v-for="(item, index) in tabList" :label="item.label" :key="index">{{ item.name }}</el-radio-button>
        </el-radio-group>
      </div> -->
      <component :is="radioQuery"></component>
    </div>
  </div>
</template>

<script>
import nationwide from '../retailersOnline/components/nationwide.vue'//全国维度
import userBehavior from '../retailersOnline/components/userBehavior.vue'//用户行为分析
export default {
  name: 'performanceAnalysis',
  components: { nationwide, userBehavior },
  data() {
    return {
      radioQuery: 'nationwide',
      showNationwide: true,
      showUserBehavior: true,
      moduleName: '/dataServer/performanceAnalysis'
    }
  },
  computed: {
    tabList() {
      let arr = this.defaultMenuOptions.menuList.map(item => {
        return {
          label: item.resourcesUrl.substring(1),
          name: item.resourcesName
        }
      })
      this.radioQuery = arr[0].label
      return arr
    }
  },
  created() {
    console.log(this.defaultMenuOptions, '1')
  }
}
</script>

<style lang="scss" scoped>
.page_content {
  border-radius: 8px;
  padding: 20px 40px 24px 40px;
  background: #fff;

  .radio_box {
    text-align: center;
    margin-bottom: 20px;
  }
}
</style>
