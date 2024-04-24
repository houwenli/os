<template>
  <div>
    <div v-loading="loading" v-if="loading" element-loading-background="rgba(0, 0, 0, 0.1)" class="loading-box"></div>
    <div class="recharge_box">
      <div class="recharge_search_box">
        <el-form :model="dataOptions" ref="ruleForm" inline label-width="90px">
          <template>
            <el-form-item label="机构名称：" prop="agencyNumber" v-if="roleType!=40">
              <organization v-model="agencyNumber" :orgType="orgType" @orgTypeChange="orgTypeChange" :showSelect="true" :selectOptions="selectOptions" ref="orgSelect" placeholder="请输入机构名称搜索"
                valueKey="agencyNumber"></organization>
            </el-form-item>
            <el-form-item label="时间：" prop="time">
              <el-radio-group v-model="timeType" @change="handleTimeGroupChange" style="margin-right:5px;">
                <el-radio-button v-for="item in timeButtonGroupList" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
              </el-radio-group>
              <el-date-picker class="datePicker" v-model="dataOptions.time" @change="dateChange" type="daterange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" value-format="yyyy-MM-dd" clearable>
              </el-date-picker>
            </el-form-item>
          </template>
        </el-form>
        <div class="btn-box">
          <ws-throttle>
            <el-button class="query-btn" type="primary" @click="query(true)" v-if="powerList.distAnalyse|| powerList.distAnalyseTread">查询</el-button>
          </ws-throttle>
          <ws-throttle>
            <el-button class="query-btn query-btn-r" @click="exportExcel" v-if=" roleType!=40 && tableFlag && powerList.export">导出</el-button>
          </ws-throttle>
        </div>
      </div>
      <div class="echart_box">
        <div class="title">订单金额分析
          <el-tooltip class="item" effect="dark" placement="right-start">
            <template #content>
              <p>下单金额：相关维度内，用户下单的订单金额，不管订单是否支付及退款。</p>
              <p>支付金额：相关维度内，用户支付订单的实付金额，未剔除退款金额。</p>
              <p>退款金额：相关维度内，退款订单的金额。</p>
              <p>结算金额：相关维度内，已过订单售后期的订单结算金额，同一笔订单，结算金额=支付金额-退款金额。</p>
            </template>
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
        </div>
        <div class="view_box">
          <div class="view_cont marginR20">
            <div class="view_tit">下单总金额（元）</div>
            <div class="view_sum">
              <count-to :startVal="0" :decimals="2" :duration='2000' :endVal="Number(this.$baseMethod.regFenToYuan(distributionAmt.orderAmt) ||0)"></count-to>
            </div>
          </div>
          <div class="view_cont marginR20">
            <div class="view_tit">支付总金额（元）</div>
            <div class="view_sum">
              <count-to :startVal="0" :decimals="2" :duration='1000' :endVal="Number($baseMethod.regFenToYuan(distributionAmt.paidAmt) ||0)"></count-to>
            </div>
          </div>
          <div class="view_cont marginR20">
            <div class="view_tit">退款总金额（元）</div>
            <div class="view_sum">
              <count-to :startVal="0" :decimals="2" :duration='1000' :endVal="Number($baseMethod.regFenToYuan(distributionAmt.refundAmt) ||0)"></count-to>
            </div>
          </div>
          <div class="view_cont ">
            <div class="view_tit">结算总金额（元）</div>
            <div class="view_sum">
              <count-to :startVal="0" :decimals="2" :duration='1000' :endVal="Number($baseMethod.regFenToYuan(distributionAmt.settlementAmt)||0)"></count-to>
            </div>
          </div>
        </div>
        <div class="chart_cont">
          <charts ref="rechargeSum" :setChartsOptions="orgRecommendMoney"></charts>
        </div>
      </div>
      <div class="echart_box">
        <div class="title">订单笔数分析</div>
        <div class="view_box">
          <div class="view_cont marginR20">
            <div class="view_tit">下单总订单数（笔）</div>
            <div class="view_sum">
              <count-to :startVal="0" :duration='1000' :endVal="Number(distributionAmt.orderCnt||0)"></count-to>
            </div>
          </div>
          <div class="view_cont">
            <div class="view_tit">支付总订单数（笔）</div>
            <div class="view_sum">
              <count-to :startVal="0" :duration='1000' :endVal="Number(distributionAmt.paidCnt||0)"></count-to>
            </div>
          </div>
        </div>
        <div class="chart_cont">
          <charts ref="rechargeCount" :setChartsOptions="orgRecommend"></charts>
        </div>
      </div>
      <!--  orgType40并且有agencyNumber 不展示导出和列表-->
      <div class="echart_box" v-if="roleType!=40 && tableFlag">
        <div class="group-flex">
          <div class="title">机构销售数据排名</div>
        </div>
        <ws-table-el ref="table" @sort-change="changeSort" v-bind="tableConfig" style="margin-top:16px;padding:0px !important;" :header-cell-style="{ background: '#F5F7FA' }">
          <!-- <ws-table-column-el label="日期" prop='dateDay'></ws-table-column-el > -->
          <ws-table-column-el label="机构名称" prop='agencyName'></ws-table-column-el>
          <ws-table-column-el label="机构编码" prop='agencyNumber'></ws-table-column-el>
          <ws-table-column-el label="上级机构" v-if="showOrgName" prop='parentAgencyName'></ws-table-column-el>
          <ws-table-column-el label="下单金额" prop='orderAmt'>
            <template slot-scope="scope">
              {{regFenToYuan(scope.row.orderAmt)}}
            </template>
          </ws-table-column-el>
          <ws-table-column-el label="支付金额" sortable min-width="150" prop='paidAmt'>
            <template slot-scope="scope">
              {{regFenToYuan(scope.row.paidAmt)}}
            </template>
          </ws-table-column-el>
          <ws-table-column-el label="结算金额" prop='settlementAmt'>
            <template slot-scope="scope">
              {{regFenToYuan(scope.row.settlementAmt)}}
            </template>
          </ws-table-column-el>
          <ws-table-column-el label="退款金额" prop='refundAmt'>
            <template slot-scope="scope">
              {{regFenToYuan(scope.row.refundAmt)}}
            </template>
          </ws-table-column-el>
          <ws-table-column-el label="下单订单数" prop='orderCnt'></ws-table-column-el>
          <ws-table-column-el label="支付订单数" prop='paidCnt'></ws-table-column-el>
        </ws-table-el>
      </div>
    </div>
  </div>
</template>

<script>
import charts from './charts.vue'
import organization from './organization-options.vue'
import { orgRecommend, orgRecommendMoney } from './charts'
import countTo from 'vue-count-to'
import { timeButtonGroupList } from './search-options.js'

export default {
    components: { charts, organization, countTo },
    name: 'saleDistribution',
    props: {
        requestOpList: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            timeType: 'YESTERDAY',
            timeButtonGroupList,
            dataOptions: {
                time: ''
            },
            agencyNumber: '',
            sortType: null,
            tableFlag: true,
            pickerMinDate: '', //获取开始选择时间
            pickerMaxDate: '', //获取结束选择时间
            pickerOptions: {
                //时间范围选择控制
                onPick: ({ maxDate, minDate }) => {
                    if (minDate) {
                        this.pickerMinDate = minDate.getTime()
                    }
                    if (maxDate) {
                        this.pickerMinDate = ''
                        this.pickerMaxDate = maxDate.getTime()
                    }
                },
                disabledDate: time => {
                    const day30 = 30 * 24 * 3600 * 1000
                    const minDay = new Date('2020-07-01 00:00:00').getTime()
                    if (this.pickerMinDate !== '') {
                        let maxTime = this.pickerMinDate + day30
                        if (maxTime > new Date()) {
                            maxTime = new Date()
                        }
                        return time.getTime() < minDay || time.getTime() > maxTime || time.getTime() > Date.now()
                    }
                    if (this.pickerMaxDate !== '' && !this.pickerMinDate) {
                        let minTime = this.pickerMaxDate - day30
                        return time.getTime() < minDay || time.getTime() < minTime || time.getTime() > Date.now()
                    }
                    return time.getTime() < minDay || time.getTime() > Date.now()
                }
            },
            moduleName: '/dataServer/retailersOnline',
            tableConfig: {
                filterColumns: false,
                autoHeight: false,
                lazyQuery: {
                    moduleName: '/dataServer/retailersOnline',
                    beforeQuery: this.tableBeforeQuery,
                    afterQuery: this.afterQuery
                }
            },
            showOrgName: true,
            orgRecommend: {},
            orgRecommendMoney: {},
            tabOptions: [],
            selectOptions: [
                {
                    value: '20',
                    label: '城市分公司'
                },
                {
                    value: '30',
                    label: '区县分公司'
                },
                {
                    value: '40',
                    label: '实体店'
                }
            ],
            roleType: 0,
            selectOrgType: 0,
            radioQuery: 20,
            loading: false,
            distributionAmt: {}
        }
    },
    created() {
        // 默认展示今日的数据
        this.dataOptions.time = [this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd'), this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd')]
        this.orgRecommend = orgRecommend
        this.orgRecommendMoney = orgRecommendMoney
        this.roleType = (this.$baseMethod.getStore('roleOption') && this.$baseMethod.getStore('roleOption').orgType) || 0
        this.tableConfig.lazyQuery.op = {
            selectList: this.requestOpList.selectList,
            selectCount: this.requestOpList.selectCount
        }
        this.initTab()
    },
    mounted() {
        this.query(false)
    },
    methods: {
        dateChange() {
            this.timeType = 'CUSTOM'
        },
        handleTimeGroupChange() {
            this.dataOptions.time = ''
            if (this.timeType !== 'CUSTOM') {
                if (this.timeType === 'THIRTY') {
                    let nowTime = new Date().getTime()
                    let y = new Date().getFullYear()
                    let m = new Date().getMonth()
                    let d = new Date(y, m, 1).getTime()
                    this.dataOptions.time = [this.$baseMethod.formatData(d, 'yyyy-MM-dd'), this.$baseMethod.formatData(nowTime, 'yyyy-MM-dd')]
                } else {
                    let days = this.timeButtonGroupList.filter(item => item.value == this.timeType)[0].days
                    this.dataOptions.time = [this.$baseMethod.getBeforeDay(days, 'yyyy-MM-dd'), this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd')]
                }
                this.$forceUpdate()
            }
        },
        regFenToYuan(m) {
            return this.thousandSeparator(this.$baseMethod.regFenToYuan(m))
        },
        // 添加千位符
        thousandSeparator(num) {
            var res = num.toString().replace(/\d+/, function (n) {
                // 先提取整数部分
                return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                    return $1 + ','
                })
            })
            return res
        },
        afterQuery(data) {
            let list = data.body
            this.showOrgName = (list && list[0].orgType == 30) || list[0].orgType == 40
            return data
        },
        tableBeforeQuery() {
            let param = this.getParam()
            param.sortType = this.sortType
            param.queryType = this.radioQuery
            return param
        },
        initTab(e) {
            switch (this.roleType) {
                case 20:
                    this.selectOptions = [
                        {
                            value: 30,
                            label: '区县分公司'
                        },
                        {
                            value: 40,
                            label: '实体店'
                        }
                    ]
                    this.orgType = 30
                    break
                case 30:
                    this.selectOptions = [
                        {
                            value: 40,
                            label: '实体店'
                        }
                    ]
                    this.orgType = 40
                    break
                case 40:
                    this.selectOptions = []
                    this.orgType = null
                    break
                default:
                    this.selectOptions = [
                        {
                            value: 20,
                            label: '城市分公司'
                        },
                        {
                            value: 30,
                            label: '区县分公司'
                        },
                        {
                            value: 40,
                            label: '实体店'
                        }
                    ]
                    this.orgType = 20
                    break
            }
        },
        orgTypeChange(e) {
            this.orgType = e
        },
        // 折线图分析
        getAnalysis() {
            const op = this.requestOpList.getAnalysis
            let data = {
                data: this.getParam(),
                op
            }
            let URL = this.powerList[this.requestOpList.getAnalysis]
            this.$axios(URL, data)
                .then(res => {
                    if (res.code == 1) {
                        let dataList = JSON.parse(res.data) || {}
                        let xData = dataList.xData || []
                        let dataInfoList = dataList.dataInfoList.map(item => item.data) || []
                        this.orgRecommendMoney.xAxis.data = xData
                        this.orgRecommendMoney.series[0].data = dataInfoList[0].map(item => item / 100) || [] //下单金额
                        this.orgRecommendMoney.series[1].data = dataInfoList[1].map(item => item / 100) || [] //支付金额
                        this.orgRecommendMoney.series[2].data = dataInfoList[2].map(item => item / 100) || [] //退款金额
                        this.orgRecommendMoney.series[3].data = dataInfoList[3].map(item => item / 100) || [] //结算金额
                        this.$refs.rechargeSum.updateCharts(this.orgRecommendMoney)
                        this.orgRecommend.xAxis.data = xData //日期
                        this.orgRecommend.series[0].data = dataInfoList[4] || [] //下单数
                        this.orgRecommend.series[1].data = dataInfoList[5] || [] //支付订单数
                        this.$refs.rechargeCount.updateCharts(this.orgRecommend)
                    }
                    this.loading = false
                })
                .catch(err => {
                    this.loading = false
                })
        },
        getParam() {
            let param = {
                agencyNumber: this.agencyNumber,
                orgType: this.orgType
            }
            if (this.dataOptions.time.length) {
                let [startDate, endDate] = this.dataOptions.time
                param.dayStart = `${startDate.substring(0, 10)} 00:00:00`
                param.dayEnd = `${endDate.substring(0, 10)} 23:59:59`
            }
            return param
        },
        query(init) {
            if (!this.dataOptions.time) {
                return this.$message.error('请选择时间')
            }
            this.loading = true
            if (this.orgType == 40 && this.agencyNumber) {
                this.tableFlag = false
            } else {
                this.tableFlag = true
            }
            this.$nextTick(() => {
                init && this.tableFlag && this.$refs.table.search()
            })
            this.getAnalysis()
            this.getanalyseAmt()
        },
        // 统计分析
        getanalyseAmt() {
            const reqData = {
                data: this.getParam(),
                op: this.requestOpList.getanalyseAmt
            }
            let URL = this.$getModuleUrl(this.moduleName, reqData.op)
            this.$axios(URL, reqData).then(res => {
                if (res.code == 1) {
                    this.distributionAmt = JSON.parse(res.data) || {}
                }
            })
        },
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
        // 导出
        exportExcel() {
            if (this.agencyNumber && this.orgType + '' === '40') {
                this.$message.error('实体店层次无排名数据！')
                return false
            }
            const reqData = {
                data: this.getParam(),
                op: 'export'
            }
            let URL = this.$getModuleUrl(this.moduleName, reqData.op)
            this.$axios(URL, reqData).then(res => {
                this.$message.success('文件正在导出，请到文件下载界面进行下载')
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.recharge_box {
    border-radius: 8px;
    padding: 0 40px 24px 40px;
    background: #fff;
    width: 100%;
    .recharge_search_box {
        border: 1px solid #ebeef5;
        border-radius: 8px;
        background: #f5f7fa !important;
        padding: 20px 0px 2px 0px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .btn-box {
            width: 226px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: -20px;
        }
        .el-form--inline .el-form-item {
            margin-bottom: 20px;
        }
    }
    .echart_box {
        margin-top: 32px;
        .title {
            height: 22px;
            font-size: 16px;
            font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: bold;
            color: #303133;
            line-height: 22px;
        }
        .view_box {
            display: flex;
            justify-content: space-between;
            .view_cont {
                background: #ffffff;
                box-shadow: 0px 5px 16px 0px rgba(186, 186, 186, 0.2);
                border-radius: 8px;
                border: 1px solid #ebeef5;
                width: 100%;
                text-align: center;
                margin-top: 16px;
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
        }
        .chart_cont {
            margin-top: 32px;
        }
    }
    .marginR20 {
        margin-right: 20px;
    }
    .query-btn {
        width: 96px;
        margin-right: 16px;
        margin-left: 0px;
    }
    .query-btn-r {
        border: 1px solid #f05259;
        color: #f05259;
    }
    /deep/.el-table .sort-caret.ascending {
        border-bottom-color: #dcdfe6;
    }
    /deep/.el-table .sort-caret.descending {
        border-top-color: #dcdfe6;
    }
    /deep/.el-table .descending .sort-caret.descending {
        border-top-color: #909399;
    }
    /deep/.el-table .ascending .sort-caret.ascending {
        border-bottom-color: #909399;
    }
    /deep/.el-form-item__label {
        font-size: 14px;
        font-weight: 400;
        color: #606266;
        padding: 0px;
    }
    .datePicker {
        width: 304px;
        /deep/.el-cascader--medium {
            width: 304px !important;
        }
    }
    .group-flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
.loading-box {
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
}
</style>
