<template>
  <div class="warp-box">
    <div>
      <div class="chart-warp">
        <h3>支付金额对比分析</h3>
        <div class="chart-box">
          <div class="pie" v-loading="payLoading">
            <div class="totalCount">
              <span>支付总金额</span>
              <span>{{overview.paidAmt}}元</span>
            </div>
            <charts ref="payPieChart" ID="payPieChart" height="100%" :setChartsOptions="payPieChartOption" />
          </div>
          <div class="line" v-loading="payLoading">
            <charts ref="payLineChart" ID="payLineChart" height="100%" :setChartsOptions="payLineChartOption" />
          </div>
        </div>
      </div>
      <div class="chart-warp">
        <h3>结算金额对比分析</h3>
        <div class="chart-box">
          <div class="pie" v-loading="settlementLoading">
            <div class="totalCount">
              <span>结算总金额</span>
              <span>{{overview.settlementAmt}}元</span>
            </div>
            <charts ref="settlementPieChart" ID="settlementPieChart" height="100%" :setChartsOptions="settlementPieChartOption" />
          </div>
          <div class="line" v-loading="settlementLoading">
            <charts ref="settlementLineChart" ID="settlementLineChart" height="100%" :setChartsOptions="settlementLineChartOption" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from 'vue-count-to'
import charts from '../../components/charts.vue'

import { pieOption, lineOption } from './options'

export default {
    components: { countTo, charts },
    props: {
        params: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            overview: {
                orderAmt: 0,
                paidAmt: 0,
                settlementAmt: 0,
                refundAmt: 0
            },
            overLoading: false,
            payPieChartOption: this.$baseMethod.deepClone(pieOption),
            payLineChartOption: this.$baseMethod.deepClone(lineOption),
            payLoading: false,
            settlementPieChartOption: this.$baseMethod.deepClone(pieOption),
            settlementLineChartOption: this.$baseMethod.deepClone(lineOption),
            settlementLoading: false,
            op: {
                over: 'orderSourceOverview',
                pay: 'paidAmtCompare',
                settlement: 'settlementAmtCompare'
            },
            moduleName: '/dataServer/retailersOnline'
        }
    },
    methods: {
        search() {
            this.getOverview()
            this.getPay()
            this.getSettlement()
        },
        // 获取总览数据
        getOverview() {
            this.overLoading = true
            const params = {
                data: this.params,
                op: this.op.over
            }
            let URL = this.$getModuleUrl(this.moduleName, params.op)
            this.$axios(URL, params)
                .then(res => {
                    this.overLoading = false
                    let data = JSON.parse(res.data)
                    this.overview = {
                        orderAmt: this.unitConvert(data.orderAmt),
                        paidAmt: this.unitConvert(data.paidAmt),
                        settlementAmt: this.unitConvert(data.settlementAmt),
                        refundAmt: this.unitConvert(data.refundAmt)
                    }
                })
                .catch(err => {
                    this.overview = {
                        orderAmt: 0,
                        paidAmt: 0,
                        settlementAmt: 0,
                        refundAmt: 0
                    }
                    this.overLoading = false
                })
        },
        // 获取支付金额
        getPay() {
            this.payLoading = true
            const params = {
                data: this.params,
                op: this.op.pay
            }
            let URL = this.$getModuleUrl(this.moduleName, params.op)
            this.$axios(URL, params)
                .then(res => {
                    this.payLoading = false
                    let data = JSON.parse(res.data)
                    // console.log(data)
                    this.payPieChartOption.series[0].data = [
                        { name: '直营店', value: this.unitConvert(data.storeSum) || 0 },
                        { name: '实体店', value: this.unitConvert(data.stationSum) || 0 }
                    ]
                    this.$refs.payPieChart.updateCharts(this.payPieChartOption)

                    this.payLineChartOption.xAxis[0].data = data.xData || []
                    let arr = data.dataInfoList || [
                        { lend: '直营店', data: [] },
                        { lend: '实体店', data: [] }
                    ]
                    this.payLineChartOption.series = arr.map(item => {
                        const d = item.data.map(ite => {
                            return this.unitConvert(ite)
                        })
                        return {
                            type: 'line',
                            name: item.lend,
                            data: d
                        }
                    })
                    this.$refs.payLineChart.updateCharts(this.payLineChartOption)
                })
                .catch(err => {
                    this.payPieChartOption.series[0].data = [
                        { name: '直营店', value: 0 },
                        { name: '实体店', value: 0 }
                    ]
                    this.$refs.payPieChart.updateCharts(this.payPieChartOption)

                    this.payLineChartOption.xAxis[0].data = []
                    this.payLineChartOption.series = [
                        { type: 'line', name: '直营店', data: [] },
                        { type: 'line', name: '实体店', data: [] }
                    ]
                    this.$refs.payLineChart.updateCharts(this.payLineChartOption)
                    this.payLoading = false
                })
        },
        // 获取结算金额
        getSettlement() {
            this.settlementLoading = true
            const params = {
                data: this.params,
                op: this.op.settlement
            }
            let URL = this.$getModuleUrl(this.moduleName, params.op)
            this.$axios(URL, params)
                .then(res => {
                    this.settlementLoading = false
                    let data = JSON.parse(res.data)
                    // console.log(data)
                    this.settlementPieChartOption.series[0].data = [
                        { name: '直营店', value: this.unitConvert(data.storeSum) || 0 },
                        { name: '实体店', value: this.unitConvert(data.stationSum) || 0 }
                    ]
                    this.$refs.settlementPieChart.updateCharts(this.settlementPieChartOption)

                    this.settlementLineChartOption.xAxis[0].data = data.xData || []
                    let arr = data.dataInfoList || [
                        { lend: '直营店', data: [] },
                        { lend: '实体店', data: [] }
                    ]
                    this.settlementLineChartOption.series = arr.map(item => {
                        const d = item.data.map(ite => {
                            return this.unitConvert(ite)
                        })
                        return {
                            type: 'line',
                            name: item.lend,
                            data: d
                        }
                    })
                    this.$refs.settlementLineChart.updateCharts(this.settlementLineChartOption)
                })
                .catch(err => {
                    this.settlementPieChartOption.series[0].data = [
                        { name: '直营店', value: 0 },
                        { name: '实体店', value: 0 }
                    ]
                    this.$refs.settlementPieChart.updateCharts(this.settlementPieChartOption)

                    this.settlementLineChartOption.xAxis[0].data = []
                    this.settlementLineChartOption.series = [
                        { type: 'line', name: '直营店', data: [] },
                        { type: 'line', name: '实体店', data: [] }
                    ]
                    this.$refs.settlementLineChart.updateCharts(this.settlementLineChartOption)
                    this.settlementLoading = false
                })
        },
        unitConvert(num) {
            if (!num) {
                return 0
            }
            return this.$baseMethod.regFenToYuan(num) - 0
        }
    }
}
</script>

<style lang="scss" scoped>
.warp-box {
    // margin-bottom: 16px;
    .view_box {
        display: flex;
        justify-content: space-between;
        margin-top: 16px;
        .view_cont {
            background: #ffffff;
            box-shadow: 0px 5px 16px 0px rgba(186, 186, 186, 0.2);
            border-radius: 8px;
            border: 1px solid #ebeef5;
            width: 100%;
            text-align: center;
            .view_tit {
                height: 22px;
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #303133;
                line-height: 22px;
                margin-top: 24px;
                // width: 50%;
            }
            .view_sum {
                height: 56px;
                font-size: 48px;
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #303133;
                line-height: 56px;
                margin: 24px 0px 28px 0px;
            }
        }
        .marginR20 {
            margin-right: 20px;
        }
    }
    .chart-warp {
        margin-top: 32px;
        h3 {
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #303133;
            line-height: 22px;
            margin-bottom: 16px;
        }
        .chart-box {
            display: flex;
            justify-content: space-between;
            .pie {
                width: 393px;
                height: 335px;
                background: #ffffff;
                border-radius: 8px;
                border: 1px solid #dcdfe6;
                margin-right: 20px;
                position: relative;
                .totalCount {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    top: 10%;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    margin: auto;
                    font-weight: 600;
                    z-index: 1;
                }
            }
            .line {
                flex: 1;
                height: 335px;
                border-radius: 8px;
                border: 1px solid #dcdfe6;
            }
        }
    }
}
</style>