<template>
  <div>
    <el-card class="mt20">
      <h1 slot="header" class="font24">调度次数明细</h1>
      <div class="mt20">
        <span class="color9">调度次数</span>
        <el-radio-group v-model="searchParams.dateSizeType" class="ml10" @change="getDataList">
          <el-radio-button label="DAY">日期分布</el-radio-button>
          <el-radio-button label="HOUR">时段分布</el-radio-button>
        </el-radio-group>
      </div>
      <pedestalCharts
        :setChartsOptions="dispatchCountDetails"
        ref="dispatchCountDetails"
      />

    </el-card>

    <ws-footer>
      <el-button @click="onBack">返回</el-button>
    </ws-footer>
  </div>
</template>

<script>
import { dispatchCountDetails } from "./charts"
import pedestalCharts from "../../components/pedestal-charts.vue"
export default {
  name: 'dispatchCountDetails',
  components: {
    pedestalCharts
  },
  data() {
    return {
      timeButtonGroup: 'DAY',
      dispatchCountDetails: null,
      scheduleTrendDetailList: {},
      searchParams: {
        dateType: 'ALL',
        localType: 'QG',
        localCode: 2,
        orderType: 'ALL',
        startDate: '',
        endDate: '',
        dateSizeType: 'DAY'
      },
      moduleName: '/dataServer/dispatchDataAnalysis',
      op: {
        getScheduleTrendDetail: 'getScheduleTrendDetail'
      }
    }
  },
  created() {
    this.dispatchCountDetails = dispatchCountDetails
  },
  mounted() {
    const query = this.$route.query
    this.searchParams = Object.assign(this.searchParams, query)
    this.getDataList()
  },
  methods: {
    onBack() {
      this.$router.push({
        name: 'dispatchDataAnalysis'
      })
    },
    getModuleUrl(op) {
      return this.$getModuleUrl(this.moduleName, op)
    },
    getDataList() {
      const op = this.op.getScheduleTrendDetail
      const data = {
        data: this.searchParams,
        op
      }
      const URL = this.getModuleUrl(op)
      this.$axios(URL, data).then((res) => {
        if (res.code === 1) {
          this.scheduleTrendDetailList = JSON.parse(res.data)
          const successList = []
          const failList = []
          const timeList = []
          this.scheduleTrendDetailList.forEach(item => {
            successList.push(item.scheduleSuccessOrderCnt)
            failList.push(item.scheduleFailedOrderCnt)
            timeList.push(item.scheduleCntRange)
          })
          this.dispatchCountDetails.xAxis[0].data = timeList
          this.dispatchCountDetails.series[0].data = successList
          this.dispatchCountDetails.series[1].data = failList
          this.$refs.dispatchCountDetails.updateCharts(this.dispatchCountDetails)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.h2Title {
  font-size: 20px;
  margin-top: 50px;
}
</style>
