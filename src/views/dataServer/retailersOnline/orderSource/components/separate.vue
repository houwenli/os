<template>
  <div>
    <div class="box">
      <h3>
        订单金额分析
        <el-tooltip class="tip" effect="dark" placement="right">
          <img :src="questIcon" alt="">
          <div slot="content" style="line-height: 22px;">
            下单金额：相关维度内，用户下单的订单金额，不管订单是否支付及退款。<br />
            支付金额：相关维度内，用户支付订单的实付金额，未剔除退款金额。<br />
            结算金额：相关维度内，已过订单售后期的订单结算金额，同一笔订单，结算金额=支付金额-退款金额。<br />
          </div>
        </el-tooltip>
      </h3>
      <div class="view_box" v-loading="orderSumLoading">
        <div class="view_cont marginR20">
          <div class="view_tit">下单总金额（元）</div>
          <div class="view_sum">
            <count-to :startVal="0" :decimals="2" :duration='1000' :endVal="overview.orderAmt"></count-to>
          </div>
        </div>
        <div class="view_cont marginR20">
          <div class="view_tit">支付总金额（元）</div>
          <div class="view_sum">
            <count-to :startVal="0" :decimals="2" :duration='1000' :endVal="overview.paidAmt"></count-to>
          </div>
        </div>
        <div class="view_cont marginR20">
          <div class="view_tit">退款总金额（元）</div>
          <div class="view_sum">
            <count-to :startVal="0" :decimals="2" :duration='1000' :endVal="overview.refundAmt"></count-to>
          </div>
        </div>
        <div class="view_cont ">
          <div class="view_tit">结算总金额（元）</div>
          <div class="view_sum">
            <count-to :startVal="0" :decimals="2" :duration='1000' :endVal="overview.settlementAmt"></count-to>
          </div>
        </div>
      </div>
      <div class="line" v-loading="orderSumLoading">
        <charts ref="overLineChart" ID="overLineChart" height="100%" :setChartsOptions="overLineChartOption" />
      </div>
    </div>
    <div class="box">
      <h3>订单笔数分析</h3>
      <div class="view_box" v-loading="orderNumLoading">
        <div class="view_cont marginR20">
          <div class="view_tit">下单总订单数（笔）</div>
          <div class="view_sum">
            <count-to :startVal="0" :decimals="0" :duration='1000' :endVal="orderNum.orderAmt"></count-to>
          </div>
        </div>
        <div class="view_cont">
          <div class="view_tit">支付总订单数（笔）</div>
          <div class="view_sum">
            <count-to :startVal="0" :decimals="0" :duration='1000' :endVal="orderNum.paidAmt"></count-to>
          </div>
        </div>
      </div>
      <div class="line" v-loading="orderNumLoading">
        <charts ref="orderLineChart" ID="orderLineChart" height="100%" :setChartsOptions="orderLineChartOption" />
      </div>
    </div>
    <div class="box" v-if="params.sourceType === 2">
      <h3>机构销售数据排名</h3>
      <ws-table-el ref="table" @sort-change="changeSort" v-bind="tableConfig" style="margin-top:16px;padding:0px !important;" :header-cell-style="{ background: '#F5F7FA' }">
        <ws-table-column-el label="机构名称" prop='agencyName'></ws-table-column-el>
        <ws-table-column-el label="机构编码" prop='agencyNumber'></ws-table-column-el>
        <ws-table-column-el label="上级机构" prop='parentAgencyName'></ws-table-column-el>
        <ws-table-column-el label="下单金额(元)" prop='orderAmt'>
          <template slot-scope="scope">
            {{unitConvert(scope.row.orderAmt)}}
          </template>
        </ws-table-column-el>
        <ws-table-column-el label="支付金额(元)" prop='paidAmt' sortable min-width="130px">
          <template slot-scope="scope">
            {{unitConvert(scope.row.paidAmt)}}
          </template>
        </ws-table-column-el>
        <ws-table-column-el label="结算金额(元)" prop='settlementAmt'>
          <template slot-scope="scope">
            {{unitConvert(scope.row.settlementAmt)}}
          </template>
        </ws-table-column-el>
        <ws-table-column-el label="退款金额(元)" prop='refundAmt'>
          <template slot-scope="scope">
            {{unitConvert(scope.row.refundAmt)}}
          </template>
        </ws-table-column-el>
        <ws-table-column-el label="下单订单数" prop='orderCnt'></ws-table-column-el>
        <ws-table-column-el label="支付订单数" prop='paidCnt'></ws-table-column-el>
      </ws-table-el>
    </div>
  </div>
</template>

<script>
import questIcon from '@/assets/images/icon_doubt@2x.png'
import countTo from 'vue-count-to'
import charts from '../../components/charts.vue'

import { lineOption } from './options'

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
            questIcon: questIcon,
            overview: {
                orderAmt: 0,
                paidAmt: 0,
                settlementAmt: 0,
                refundAmt: 0
            },
            orderSumLoading: false,
            orderNum: {
                orderAmt: 0,
                paidAmt: 0
            },
            orderNumLoading: false,

            overLineChartOption: this.$baseMethod.deepClone(lineOption),
            orderLineChartOption: this.$baseMethod.deepClone(lineOption),

            tableConfig: {
                filterColumns: false,
                autoHeight: false,
                lazyQuery: {
                    moduleName: '/dataServer/retailersOnline',
                    op: {
                        selectList: 'orderSourceAnalyseRank'
                        // selectCount: ''
                    },
                    immediate: false,
                    beforeQuery: this.tableBeforeQuery
                }
            },
            sortType: 1,
            moduleName: '/dataServer/retailersOnline',
            op: {
                orderSum: 'paidAmtCompare',
                orderNum: 'settlementAmtCompare'
            }
        }
    },
    methods: {
        search() {
            this.getOrderSum()
            this.getOrderNum()
            if (this.params.sourceType === 2) {
                this.$refs.table.reset()
            }
        },
        tableBeforeQuery() {
            let param = this.$baseMethod.deepClone(this.params)
            param.sortType = this.sortType
            return param
        },
        // 获取订单金额
        getOrderSum() {
            this.orderSumLoading = true
            const params = {
                data: this.params,
                op: this.op.orderSum
            }
            let URL = this.$getModuleUrl(this.moduleName, params.op)
            this.$axios(URL, params)
                .then(res => {
                    this.orderSumLoading = false
                    let data = JSON.parse(res.data)
                    // console.log(data)
                    this.overview = {
                        orderAmt: this.unitConvert(data.orderAmtSum) || 0,
                        paidAmt: this.unitConvert(data.paidAmtSum) || 0,
                        settlementAmt: this.unitConvert(data.settlementAmtSum) || 0,
                        refundAmt: this.unitConvert(data.refundAmtSum) || 0
                    }
                    this.overLineChartOption.xAxis[0].data = data.xData || []
                    let arr = data.dataInfoList || []
                    this.overLineChartOption.series = arr.map(item => {
                        const d = item.data.map(ite => {
                            return this.unitConvert(ite)
                        })
                        return {
                            type: 'line',
                            name: item.lend,
                            data: d
                        }
                    })
                    this.$refs.overLineChart.updateCharts(this.overLineChartOption)
                })
                .catch(err => {
                    this.overLineChartOption = this.$baseMethod.deepClone(lineOption)
                    this.$refs.overLineChart.updateCharts(this.overLineChartOption)
                    this.orderSumLoading = false
                })
        },
        // 获取订单比数
        getOrderNum() {
            this.orderNumLoading = true
            const params = {
                data: this.params,
                op: this.op.orderNum
            }
            let URL = this.$getModuleUrl(this.moduleName, params.op)
            this.$axios(URL, params)
                .then(res => {
                    this.orderNumLoading = false
                    let data = JSON.parse(res.data)
                    this.orderNum = {
                        orderAmt: data.orderCntSum || 0,
                        paidAmt: data.paidCntSum || 0
                    }
                    this.orderLineChartOption.yAxis[0].name = '单位：笔'
                    this.orderLineChartOption.xAxis[0].data = data.xData || []
                    let arr = data.dataInfoList || []
                    this.orderLineChartOption.series = arr.map(item => {
                        return {
                            type: 'line',
                            name: item.lend,
                            data: item.data
                        }
                    })
                    this.$refs.orderLineChart.updateCharts(this.orderLineChartOption)
                })
                .catch(err => {
                    this.orderLineChartOption = this.$baseMethod.deepClone(lineOption)
                    this.orderLineChartOption.yAxis[0].name = '单位：笔'
                    this.$refs.orderLineChart.updateCharts(this.orderLineChartOption)
                    this.orderNumLoading = false
                })
        },
        // 列表排序
        changeSort(val) {
            let { order } = val
            switch (order) {
                case 'ascending':
                    this.sortType = 2
                    break
                case 'descending':
                    this.sortType = 1
                    break
                default:
                    this.sortType = null
                    break
            }
            this.$refs.table.search()
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
.box {
    margin-top: 20px;
    h3 {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #303133;
        line-height: 22px;
        img {
            width: 24px;
            height: 24px;
            vertical-align: -6px;
        }
    }
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
    .line {
        height: 400px;
        margin-top: 22px;
    }
}
</style>