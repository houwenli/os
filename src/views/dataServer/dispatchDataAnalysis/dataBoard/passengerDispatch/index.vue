<template>
  <div class='ws-table-warp'>
    <iSearch
      :showRefreshData='true'
      :showBtn="Boolean(getModulePower(moduleName).getPassengerSchedule)"
      ref="iSearch"
      @handleClickRefresh='handleClickRefresh'
      @handleCityChange = "$emit('handleCityChange', $event)"
    />
    <div class='waiting-time-dispatch'>
      <h1>派单等待时长</h1>
      <div>
        <span class='mr'>派单方式:</span>
        <el-radio-group
          v-model='dispatchType'
          @change="handleDispatch"
        >
          <el-radio-button
            v-for='item in dispatchTypeList'
            :key='item.label'
            :label='item.value'
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <pedestalCharts
        :setChartsOptions='charts.waitingTimeDispatch'
        ref="waitingTimeDispatch"
      />
    </div>
  </div>
</template>

<script>
import iSearch from '../../components/search.vue'
import pedestalCharts from '../../components/pedestal-charts.vue'
import { waitingTimeDispatch } from './charts'
export default {
  components: {
    iSearch,
    pedestalCharts
  },
  data() {
    return {
      searchParams: {
        dateType: 'TODAY',
        localType: 'QG',
        localCode: 2,
        orderType: 'ALL',
        startDate: '',
        endDate: '',
        dateSizeType: 'DAY' // 这个参数应该不用的
      },
      charts: {},
      moduleName: '/dataServer/dispatchDataAnalysis',
      op: {
        getPassengerSchedule: 'getPassengerSchedule'
      },
      dispatchType: 'ALL',
      dispatchTypeList: [
        {
          label: '全部',
          value: 'ALL'
        },
        {
          label: '派单',
          value: 'PD'
        },
        {
          label: '抢单',
          value: 'QD'
        }
      ]
    }
  },
  created() {
    this.charts.waitingTimeDispatch = waitingTimeDispatch
  },
  methods: {
    handleClickRefresh(params) {
      this.searchParams = params
      this.getDataList()
    },
    handleDispatch(value) {
      this.searchParams.dispatchType = value
      this.getDataList('search')
    },
    getDataList(type) {
      if (type === 'search') {
        this.$refs.iSearch.submitForm()
        return
      }
      const {
        localCode,
        localType,
        dateType,
        orderType,
        startDate,
        endDate
      } = this.searchParams
      if (!localCode || !localType) {
        this.$message.error('请选择当前城市！')
        return
      }
      if (!dateType) {
        this.$message.error('请选择日期类型！')
        return
      }
      if (dateType === 'CUSTOM' && !startDate && !endDate) {
        this.$message.error('请选择开始和结束日期！')
        return
      }
      if (!this.dispatchType) {
        this.$message.error('请选择派单类型！')
        return
      }
      if (!orderType) {
        this.$message.error('请选择订单类型！')
        return
      }
      const op = this.op.getPassengerSchedule
      this.searchParams.dispatchType = this.dispatchType
      const data = {
        data: this.searchParams,
        op
      }
      const URL = this.getModuleUrl(op)
      this.$axios(URL, data).then((res) => {
        if (res.code === 1) {
          this.scheduleOrderList = JSON.parse(res.data)
          const successList = []
          const failList = []
          const failRatioList = []
          const timeoutList = []
          const timeList = []
          this.scheduleOrderList.forEach(item => {
            successList.push(item.scheduleSuccessOrderCnt)
            timeList.push(item.scheduleTimeRange)
            timeoutList.push(item.scheduleTimeoutOrderCnt)
            failList.push(item.passengerCancelOrderCnt)
            failRatioList.push(item.passengerCancelOrderRatio)
          })
          // 时间段
          this.charts.waitingTimeDispatch.xAxis[0].data = timeList
          // 调度成功订单量
          this.charts.waitingTimeDispatch.series[0].data = successList
          // 调度超时订单量
          this.charts.waitingTimeDispatch.series[1].data = timeoutList
          // 乘客主动取消订单量
          this.charts.waitingTimeDispatch.series[2].data = failList
          // 乘客主动取消率
          this.charts.waitingTimeDispatch.series[3].data = failRatioList

          this.$refs.waitingTimeDispatch.updateCharts(this.charts.waitingTimeDispatch)
        }
      })
    },
    getModuleUrl(op) {
      return this.$getModuleUrl(this.moduleName, op)
    }
  }
}
</script>

<style lang='scss' scoped>
.waiting-time-dispatch {
  h1 {
    font-size: 20px;
    margin-bottom: 10px;
  }
  .mr {
    margin-right: 10px;
  }
}
</style>
