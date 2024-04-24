<template>
    <div>
    <div class="recharge_box">
    <div v-loading="loading" v-if="loading" element-loading-background="rgba(0, 0, 0, 0.1)" class="loading-box"></div>
      <div class="recharge_search_box">
        <el-form :model="dataOptions" ref="ruleForm" inline label-width="70px">
          <template>
            <el-form-item label="业务类型：">
                <el-select v-model="businessType" placeholder="请选择">
                     <el-option v-for="item in businessTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="时间：" prop="time">
              <el-radio-group v-model="timeType" @change="handleTimeGroupChange" style="margin-right:5px;">
                <el-radio-button v-for="item in timeButtonGroupList" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
              </el-radio-group>
              <el-date-picker class="datePicker" @change="dateChange" v-model="dataOptions.time" type="daterange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" value-format="yyyy-MM-dd" clearable>
              </el-date-picker>
            </el-form-item>
          </template>
        </el-form>
            <el-button-group>
            <el-button class="query-btn" type="primary" @click="query()">查询</el-button>
                <ws-throttle>
                    <el-button class="resetBtn" type="primary" icon="el-icon-refresh-left" @click="reset()"></el-button>
                </ws-throttle>
            </el-button-group>
      </div>
      <refresh-title title="订单数据分析" :latestUpdateTime="latestUpdateTime"></refresh-title>
      <orderFunnel :businessType="businessType" :dataObj="distributionAmt"></orderFunnel>
   
      <div class="echart_box">
        <div class="title">订单金额趋势分析
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
        <div class="chart_cont">
          <charts ref="rechargeSum" :setChartsOptions="orgRecommendMoney"></charts>
        </div>
      </div>
      <div class="echart_box">
        <div class="title">订单支付方式分析</div>
        <div class="chart_cont">
            <el-row :gutter="20">
                <el-col :span="7">
                    <charts ref="payWayChart" height='280px' :setChartsOptions="payWayPieChartOption"></charts>
                </el-col>
                <el-col :span="17">
                    <dataTable :dataConfig="PayWayDataConfig"></dataTable>
                </el-col>
            </el-row>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import { Big } from 'big.js'
import charts from './charts.vue'
import dataBoard from '../../components/dataBoard.vue'
import dataTable from '../../components/dataTable.vue'
import organization from './organization-options.vue'
import orderFunnel from './orderFunnel.vue'//订单漏斗分析组件
import refreshTitle from '../../components/refreshTitle.vue'//带刷新功能的标题
import { orgRecommend, orgRecommendMoney, payWayPieChartOption} from './charts'
import countTo from 'vue-count-to'
import { timeButtonGroupList } from './search-options.js'
import dayjs from 'dayjs'
export default {
    components: { charts, organization, countTo ,dataBoard,orderFunnel,refreshTitle, dataTable},
    name: 'salePlatform',
    data() {
        return {
            timeType: 'YESTERDAY',
            queryType:'',//查询时间类型，话费充值需要
            dataOptions: {
                time: ''
            },
            timeButtonGroupList,
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
            payList: {
                1: '微信支付',
                2: '支付宝支付',
                3: '余额支付',
                4: '线下打款',
                5: '福气值支付'
            },
            moduleName: '/dataServer/performanceAnalysis',
            orgRecommend: {},
            orgRecommendMoney: {},
            payWayPieChartOption: {},
            distributionAmt: {},
            latestUpdateTime:'',
            loading: false,
            PayWayDataConfig: [],
            businessType:''
        }
    },
    created() {
        // 默认展示今日的数据
        this.dataOptions.time = [this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd'), this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd')]
        this.orgRecommend = orgRecommend
        this.orgRecommendMoney = orgRecommendMoney
        this.payWayPieChartOption = payWayPieChartOption
      
    },
    computed:{
        businessTypeOptions(){
            let arr = []
            let businessList = [
                { value: '1', label: '电商业务', name: 'commerceBusiness'},
                { value: '2', label: '话费充值', name: 'phoneCharge'},
                { value: '3', label: '两轮车销售业务', name: 'twoWheeledSales'},
                { value: '4', label: '定制车业务', name: 'fourWheeledSales'},
            ]
            businessList.map(item=> {
                if([item.name].some(sub=>this.powerList[sub])) {
                    arr.push(item)
                }
            })
            if(arr.length > 1) {
                arr.unshift({
                    value: '0',
                    label: '全部'
                })
            }
            // 默认第一项
            if(arr.length) {
                this.businessType = arr[0].value
            }
            return arr
        }
    },
    mounted() {
        this.query()
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
                } 
                if(this.timeType === 'YESTERDAY') {
                    let days = this.timeButtonGroupList.filter(item => item.value == this.timeType)[0].days
                    this.dataOptions.time = [this.$baseMethod.getBeforeDay(days, 'yyyy-MM-dd'), this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd')]
                }
                if(this.timeType === 'SEVEN') {
                    let days =  new Date(new Date().toLocaleDateString()).getDay();
                    if(days){
                        this.dataOptions.time = [this.$baseMethod.getBeforeDay(Number(-(days-1)), 'yyyy-MM-dd'), this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd')]
                    }else{
                        this.dataOptions.time = [this.$baseMethod.getBeforeDay(-6, 'yyyy-MM-dd'), this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd')]
                    }
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
        // 订单金额分析
        getAnalysis() {
           let businessType = this.getBusinessType()
            const reqData = {
                data: {...this.getParam(), businessType},
                op: 'amountTrend'
            }
            let URL = this.$getModuleUrl(this.moduleName, reqData.op)
            this.$axios(URL, reqData)
                .then(res => {
                    if (res.code == 1 || res.code === 200) {
                        let { dataX, order, pay, refund,settlement } = JSON.parse(res.data) || {}
            
                        this.orgRecommendMoney.series[0].data = (order || []).map(item=>Number(new Big(item || 0).div(100))) //下单金额
                        this.orgRecommendMoney.series[1].data = (pay || []).map(item=>Number(new Big(item || 0).div(100))) //支付金额
                        this.orgRecommendMoney.series[2].data = (refund || []).map(item=>Number(new Big(item || 0).div(100))) //退款金额
                        this.orgRecommendMoney.series[3].data = (settlement || []).map(item=>Number(new Big(item || 0).div(100))) //结算金额
                        this.orgRecommendMoney.xAxis.data = dataX || [] //日期

                        this.$refs.rechargeSum.updateCharts(this.orgRecommendMoney)
                    }
                })
                .catch(err => {
                    console.error( err)
                })
                .finally(res => {
                    this.loading = false
                     // 查询完成-更新最近查询时间
                    this.latestUpdateTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
                })
        },
        //获取入参businessType业务线
        getBusinessType() {
            let all = []
            this.businessTypeOptions.map(item=> {
                item.value != 0 && all.push(item.value)
            })
           return this.businessType == '0'? all: [this.businessType]
        },
        //订单数据分析
        getanalyseAmt() {
            let businessType = this.getBusinessType()
            const reqData = {
                data: {...this.getParam(), businessType},
                op: 'overview'
            }
            let URL = this.$getModuleUrl(this.moduleName, reqData.op)
            this.$axios(URL, reqData).then(res => {
                if (res.code == 1 || res.code === 200) {
                    this.distributionAmt = JSON.parse(res.data) || {}
                }
            }).catch(err => {
                console.error( err)
            })
        },
        // 订单支付方式构成
        getAllOrderPayAnalyse() {
            let businessType = this.getBusinessType()
            const reqData = {
                data: {...this.getParam(), businessType},
                op: 'payTypeAnalysis'
            }
            let URL = this.$getModuleUrl(this.moduleName, reqData.op)
            this.$axios(URL, reqData).then(res => {
                if (res.code == 1 || res.code === 200) {
                    this.PayWayDataConfig = JSON.parse(res.data) || []
                    let chartData = [
                        { value: 0, name: '微信支付', itemStyle: {color: '#254BE9'} },
                        { value: 0, name: '支付宝支付', itemStyle: {color: '#0BDBA8'} },
                        { value: 0, name: '余额支付', itemStyle: {color: '#F3D01D'} },
                        { value: 0, name: '线下打款', itemStyle: {color: '#FF9B00'} },
                        { value: 0, name: '福气值支付', itemStyle: {color: '#FD571F'} }
                    ]
                    chartData.map(item => {
                        let mateData = this.PayWayDataConfig.filter(sub=> this.payList[sub.payType] == item.name)[0] || {}
                        if(mateData) {
                            item.value = mateData.payAmount || 0
                        }
                    })
                    this.payWayPieChartOption.series[0].data = chartData
                    this.$refs.payWayChart.updateCharts(this.payWayPieChartOption)
                }
            }).
            catch(err => {
                console.error( err)
            })
            .finally(res => {
                this.loading = false
                 // 查询完成-更新最近查询时间
                this.latestUpdateTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
            })
        },
        getParam() {
            let param = {}
            if (this.dataOptions.time.length) {
                let [startDate, endDate] = this.dataOptions.time
                param.startTime = `${startDate.substring(0, 10)} 00:00:00`
                param.endTime = `${endDate.substring(0, 10)} 23:59:59`
            }
            return param
        },
        query() {
            if (!this.businessTypeOptions.length) {
                return this.$message.error('暂无权限！')
            }
            if (!this.dataOptions.time) {
                return this.$message.error('请选择时间')
            }
            this.loading = true
            this.getAnalysis()
            this.getanalyseAmt()
            this.getAllOrderPayAnalyse()
        },
        // 重置-回到初始选择的时间并查询
        reset(){
            this.timeType = 'YESTERDAY'
            if (this.businessTypeOptions.length) {
                this.businessType = this.businessTypeOptions[0].value
            } else {
                this.$message.error('暂无权限！')
                return
            }
            this.handleTimeGroupChange()
            this.query()
        }
    }
}
</script>
<style lang="scss" scoped>
.recharge_box {
    // border-radius: 8px;
    // padding: 20px 40px 24px 40px;
    // background: #fff;
    width: 100%;
   
 
    .recharge_search_box {
        border: 1px solid #ebeef5;
        border-radius: 8px;
        background: #f5f7fa !important;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px;
        margin-bottom: 33px;
        .btn-box {
            width: 226px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: -20px;
        }
        .el-form-item{
            margin-bottom: 0px;
        }
        .el-button-group{
            display: flex !important;
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
            margin-bottom: 16px;
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
            margin-top: 15px;
        }
    }
    .marginR20 {
        margin-right: 20px;
    }
    .query-btn {
        width: 96px;
        margin-left: 0px;
    }
    .query-btn-r {
        border: 1px solid #f05259;
        color: #f05259;
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
