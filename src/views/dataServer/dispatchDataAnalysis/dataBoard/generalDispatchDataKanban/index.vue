<template>
  <div class="ws-table-warp">
    <iSearch :showRefreshData="true" :showBtn="showBtn" ref="iSearch" @handleClickRefresh="handleClickRefresh"
    @handleCityChange = "$emit('handleCityChange', $event)" />

    <dataCard v-if="bindList" :bindList="bindList" />
    <el-card>
      <div slot="header">
        <h1 class="font24">调度订单数据分析</h1>
      </div>

      <div class="dispatchorderdata-search">
        <div>
          <span class="mr">调度订单量</span>
          <el-radio-group v-model="orderDataAsalysis.dateSizeType" @change="getScheduleOrderData()">
            <el-radio-button label="DAY">日期分布</el-radio-button>
            <el-radio-button label="HOUR">时段分布</el-radio-button>
          </el-radio-group>
        </div>
        <div>
          <el-select
            v-model="orderDataAsalysis.dispatchType"
            class="mr"
            placeholder="请选择派单方式"
          >
            <el-option label="全部" value="ALL" />
            <el-option label="派单" value="PD" />
            <el-option label="抢单" value="QD" />
          </el-select>
          <el-button type="primary" @click="getScheduleOrderData('search')">查询</el-button>
        </div>
      </div>
      <pedestalCharts
        :setChartsOptions="charts.orderDataAsalysis"
        :key="key"
        ref="orderDataAsalysis"
      />

      <h1 class="font24">
        调度次数趋势图
        <span
          class="font16 color9 ml10"
          >(点击柱状图查看明细)</span>
      </h1>
      <div class="subTitle">
        <div class="subTitleItem">
          成功订单单均调度次数：{{dispatchCountList.scheduleSuccessOrderAvg || 0}}次
        </div>
        <div class="subTitleItem">
          失败订单单均调度次数：{{dispatchCountList.scheduleFailedOrderAvg || 0}}次
        </div>
      </div>
      <pedestalCharts
        :setChartsOptions="charts.dispatchCount"
        ref="dispatchCount"
        @chartsClick="handlEchartsClick"
      />

      <h1 class="h2Title">调度平均时长</h1>
      <div class="subTitle">
        <div class="subTitleItem">
          调度成功订单平均时长:  {{getScheduleTimeList.successOrderScheduleTimeAvg || 0}}s
        </div>
        <div class="subTitleItem">
          调度失败订单平均时长:  {{getScheduleTimeList.failOrderScheduleTimeAvg || 0}}s
        </div>
      </div>
      <pedestalCharts
        :setChartsOptions="charts.averageSchedulingTime"
        ref="averageSchedulingTime"
      />

      <div>
        <h2 class="h2Title">调度失败订单数据分析</h2>
        <div class="mt20">
          <span class="color9">调度失败订单数据分析</span>
          <el-radio-group
            v-model="distpathErrorOrderData.dateSizeType"
            class="ml10"
            @change="getFailedOrderScheduleDetailData()"
          >
            <el-radio-button label="DAY">日期分布</el-radio-button>
            <el-radio-button label="HOUR">时段分布</el-radio-button>
          </el-radio-group>
        </div>
        <pedestalCharts
          :setChartsOptions="charts.distpathErrorOrderData"
          ref="distpathErrorOrderData"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import dataCard from './components/data-card' // 数据卡片
import pedestalCharts from '../../components/pedestal-charts.vue'
import iSearch from '../../components/search.vue'
import {
  orderDataAsalysis,
  dispatchCount,
  averageSchedulingTime,
  distpathErrorOrderData
} from './charts'
export default {
  components: {
    dataCard,
    pedestalCharts,
    iSearch
  },
  data() {
    return {
      bindList: {},
      scheduleOrderList: {},
      dispatchCountList: {},
      getScheduleTimeList: {},
      getFailedOrderScheduleDetailList: {},
      searchParams: {
        dateType: 'TODAY',
        localType: 'QG',
        localCode: 2,
        orderType: 'ALL',
        startDate: '',
        endDate: ''
      },
      // 调度订单数据分析
      orderDataAsalysis: {
        dateSizeType: 'DAY',
        dispatchType: 'ALL'
      },
      // 调度失败订单数据分析
      distpathErrorOrderData: {
        dateSizeType: 'DAY'
      },
      key: 1,
      charts: {}, // 图例配置数据
      moduleName: '/dataServer/dispatchDataAnalysis',
      op: {
        getScheduleDetail: 'getScheduleDetail',
        getScheduleOrderDetail: 'getScheduleOrderDetail',
        getScheduleTrend: 'getScheduleTrend',
        getScheduleTime: 'getScheduleTime',
        getFailedOrderScheduleDetail: 'getFailedOrderScheduleDetail'
      },
      showBtn: false
    }
  },
  created() {
    const opSystemList = Object.keys(this.op)
    this.showBtn = opSystemList.some(op => this.getModulePower(this.moduleName)[op])
    this.charts = this.$baseMethod.deepClone({
      orderDataAsalysis,
      dispatchCount,
      averageSchedulingTime,
      distpathErrorOrderData
    })
  },
  methods: {
    refreshPage() {
      this.getCardData()
      this.getScheduleOrderData()
      this.getScheduleTrendData()
      this.getScheduleTimeData()
      this.getFailedOrderScheduleDetailData()
    },
    getCardData() {
      const op = this.op.getScheduleDetail
      const data = {
        data: this.searchParams,
        op
      }
      const URL = this.getModuleUrl(op)
      this.$axios(URL, data).then(res => {
        if (res.code === 1) {
          this.bindList = JSON.parse(res.data)
        }
      })
    },
    // 调度订单数据分析
    getScheduleOrderData(type) {
      if (type === 'search') {
        this.$refs.iSearch.submitForm()
        return
      }
      this.orderDataAsalysis = Object.assign(this.orderDataAsalysis, this.searchParams)
      const op = this.op.getScheduleOrderDetail
      const data = {
        data: this.orderDataAsalysis,
        op
      }
      const URL = this.getModuleUrl(op)
      this.$axios(URL, data).then(res => {
        if (res.code === 1) {
          this.scheduleOrderList = JSON.parse(res.data)
          const orderList = []
          const orderSuccessList = []
          const orderSuccessRatio = []
          const orderTime = []
          this.scheduleOrderList.forEach(item => {
            orderList.push(item.orderCnt)
            orderSuccessList.push(item.scheduleSuccessOrderCnt)
            orderTime.push(item.orderCreateTime)
            orderSuccessRatio.push(item.scheduleSuccessOrderRatio)
          })
          // 时间
          this.charts.orderDataAsalysis.xAxis[0].data = orderTime
          // 订单量
          this.charts.orderDataAsalysis.series[0].data = orderList
          // 成功调度订单量
          this.charts.orderDataAsalysis.series[1].data = orderSuccessList
          // 成功率
          this.charts.orderDataAsalysis.series[2].data = orderSuccessRatio
          this.$refs.orderDataAsalysis.updateCharts(this.charts.orderDataAsalysis)
        }
      })
    },
    // 调度次数趋势图
    getScheduleTrendData() {
      const op = this.op.getScheduleTrend
      const data = {
        data: this.searchParams,
        op
      }
      const URL = this.getModuleUrl(op)
      this.$axios(URL, data).then(res => {
        if (res.code === 1) {
          this.dispatchCountList = JSON.parse(res.data)
          const yAxisList = []
          const scheduleFailedOrderCnt = []
          const scheduleSuccessOrderCnt = []
          this.dispatchCountList.scheduleTrendDetailList.forEach(item => {
            yAxisList.push(item.scheduleCntRange)
            scheduleFailedOrderCnt.push(item.scheduleFailedOrderCnt)
            scheduleSuccessOrderCnt.push(item.scheduleSuccessOrderCnt)
          })
          this.charts.dispatchCount.yAxis.data = yAxisList
          this.charts.dispatchCount.series[0].data = scheduleSuccessOrderCnt
          this.charts.dispatchCount.series[1].data = scheduleFailedOrderCnt
          this.$refs.dispatchCount.updateCharts(this.charts.dispatchCount)
        }
      })
    },
    // 调度平均时长
    getScheduleTimeData() {
      const op = this.op.getScheduleTime
      const data = {
        data: this.searchParams,
        op
      }
      const URL = this.getModuleUrl(op)
      this.$axios(URL, data).then(res => {
        if (res.code === 1) {
          this.getScheduleTimeList = JSON.parse(res.data)
          const failList = []
          const successList = []
          const timeList = []
          this.getScheduleTimeList.scheduleTimeDetailList.forEach(item => {
            timeList.push(item.orderCreateTime)
            failList.push(item.failOrderScheduleTimeAvg)
            successList.push(item.successOrderScheduleTimeAvg)
          })
          this.charts.averageSchedulingTime.xAxis.data = timeList
          this.charts.averageSchedulingTime.series[0].data = successList
          this.charts.averageSchedulingTime.series[1].data = failList
          this.$refs.averageSchedulingTime.updateCharts(this.charts.averageSchedulingTime)
        }
      })
    },
    // 调度失败订单数据分析
    getFailedOrderScheduleDetailData() {
      // if (type === 'search') {
      //   this.$refs.iSearch.submitForm()
      //   return
      // }
      this.distpathErrorOrderData = Object.assign(this.distpathErrorOrderData, this.searchParams)
      const op = this.op.getFailedOrderScheduleDetail
      const data = {
        data: this.distpathErrorOrderData,
        op
      }
      const URL = this.getModuleUrl(op)
      this.$axios(URL, data).then(res => {
        if (res.code === 1) {
          this.getFailedOrderScheduleDetailList = JSON.parse(res.data)
          const scheduleFailList = [] // 调度失败
          const passengerFailList = [] // 乘客失败
          const timeList = []
          this.getFailedOrderScheduleDetailList.forEach(item => {
            timeList.push(item.orderCreateTime)
            passengerFailList.push(item.passengerCancelOrderCnt)
            scheduleFailList.push(item.scheduleTimeoutCancelOrderCnt)
          })
          this.charts.distpathErrorOrderData.xAxis[0].data = timeList
          this.charts.distpathErrorOrderData.series[0].data = scheduleFailList
          this.charts.distpathErrorOrderData.series[1].data = passengerFailList
          this.$refs.distpathErrorOrderData.updateCharts(this.charts.distpathErrorOrderData)
        }
      })
    },
    getModuleUrl(op) {
      return this.$getModuleUrl(this.moduleName, op)
    },
    handleClickRefresh(params) {
      this.searchParams = params
      this.refreshPage()
    },
    handlEchartsClick(params) {
      const code = this.dispatchCountList.scheduleTrendDetailList[params.dataIndex].scheduleCntRangeCode || 0
      this.searchParams = Object.assign(this.searchParams, { code })
      this.$router.push({
        name: 'dispatchCountDetails',
        query: this.searchParams
      })
    }
  }
}
</script>
<style lang="scss">
.font24 {
  font-size: 20px;
}
.mt50 {
  margin-top: 50px;
}
.color9 {
  color: #999;
}
.font16 {
  font-size: 16px;
}
.h2Title {
  font-size: 20px;
  margin-top: 50px;
}
.mt20 {
  margin-top: 20px;
}
.ml10 {
  margin-left: 10px;
}
.dispatchorderdata-search {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .mr {
    margin-right: 10px;
  }
}
.subTitle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
  .subTitleItem {
    padding:0 20px;
  }
}
</style>
