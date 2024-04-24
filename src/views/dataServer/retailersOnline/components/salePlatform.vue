<template>
  <div>
    <div v-loading="loading" v-if="loading" element-loading-background="rgba(0, 0, 0, 0.1)" class="loading-box"></div>
    <div class="recharge_box">
      <div class="recharge_search_box">
        <el-form :model="dataOptions" ref="ruleForm" inline label-width="90px">
          <template>
            <el-form-item label="业务类型：" prop="agencyNubusinessTypeber" v-if="![30,40].includes(+roleType)">
                <el-select v-model="category" placeholder="请选择">
                    <el-option v-for="item in businessTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="机构名称：" prop="agencyNumber" v-if="![20,40].includes(+roleType)">
              <!-- <el-cascader
                        v-model="dataOptions.agencyNumber"
                        :options="orgList"
                        :props="orgProps"
                        filterable
                        @change="getCheckedNodes"
                        ref="organization"
                        style="width: 304px;"
                        clearable></el-cascader> -->
              <organization v-model="agencyNumber" :orgType="orgType" @orgTypeChange="orgTypeChange" :showSelect="true" :selectOptions="selectOptions" ref="orgSelect" placeholder="请输入机构名称搜索"
                valueKey="agencyNumber">
              </organization>
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
      </div>
      <div class="btn-box">
          <ws-throttle>
            <el-button class="query-btn" type="primary" @click="query(true)" v-if="powerList.orderAnalyse || powerList.orderAnalyseTread">查询</el-button>
          </ws-throttle>
          <ws-throttle>
            <el-button class="query-btn query-btn-r" v-if="![20,40].includes(roleType)&& tableFlag && powerList.platformExport" @click="exportExcel">导出</el-button>
          </ws-throttle>
        </div>
      <div class="echart_box">
        <div class="title">订单金额分析
          <el-tooltip class="item" effect="dark" placement="right-start">
            <template #content>
              <!-- <p>下单金额：相关维度内，用户下单的订单金额，不管订单是否支付及退款。</p> -->
              <p>支付金额：相关维度内，用户支付订单的实付金额，未剔除退款金额。</p>
              <p>退款金额：相关维度内，退款订单的金额。</p>
              <p>绩效金额：相关维度内，机构可获得奖励收入。</p>
            </template>
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
        </div>
        <div class="view_box">
          <!-- <div class="view_cont marginR20">
            <div class="view_tit">下单总金额（元）</div>
            <div class="view_sum">
              <count-to :startVal="0" :decimals="2" :duration='2000' :endVal="Number(this.$baseMethod.regFenToYuan(distributionAmt.orderAmt) ||0)"></count-to>
            </div>
          </div> -->
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
            <div class="view_tit">绩效总金额（元）</div>
            <div class="view_sum">
              <count-to :startVal="0" :decimals="2" :duration='1000' :endVal="Number($baseMethod.regFenToYuan(distributionAmt.settlementAmt)||0)"></count-to>
            </div>
          </div>
        </div>
        <div class="chart_cont">
          <charts ref="rechargeSum" :setChartsOptions="platformOrgRecommendMoney"></charts>
        </div>
      </div>
      <div class="echart_box">
        <div class="title">订单笔数分析</div>
        <div class="view_box">
          <!-- <div class="view_cont marginR20">
            <div class="view_tit">下单总订单数（笔）</div>
            <div class="view_sum">
              <count-to :startVal="0" :duration='1000' :endVal="Number(distributionAmt.orderCnt||0)"></count-to>
            </div>
          </div> -->
          <div class="view_cont marginR20">
            <div class="view_tit">支付总订单数（笔）</div>
            <div class="view_sum">
              <count-to :startVal="0" :duration='1000' :endVal="Number(distributionAmt.paidCnt||0)"></count-to>
            </div>
          </div>
          <div class="view_cont">
            <div class="view_tit">退款总订单数（笔）</div>
            <div class="view_sum">
              <count-to :startVal="0" :duration='1000' :endVal="Number(distributionAmt.refundCnt||0)"></count-to>
            </div>
          </div>
        </div>
        <div class="chart_cont">
          <charts ref="rechargeCount" :setChartsOptions="platformOrgRecommend"></charts>
        </div>
      </div>
      <!-- 平台维度 只在总部权限展示列表 -->
      <div class="echart_box" v-if="![20,40].includes(roleType)&& tableFlag">
        <div class="group-flex">
          <div class="title">机构销售数据排名</div>
        </div>
        <div class="tableType">
          <el-radio-group v-model="tableType" :border="false" @input="tableTypeChange">
            <el-radio-button :label="1" v-if="roleType != 5 && isShowTab">大 区</el-radio-button>
            <el-radio-button :label="2">城市分公司</el-radio-button>
          </el-radio-group>
        </div>
        <ws-table-el :key="tableType" ref="table" @sort-change="changeSort" v-bind="tableConfig" style="margin-top:16px;padding:0px !important;" :header-cell-style="{ background: '#F5F7FA' }">
          <ws-table-column-el label="机构名称" prop='agencyName'></ws-table-column-el>
          <ws-table-column-el v-if="tableType === 2" label="机构编码" prop='agencyNumber'></ws-table-column-el>
          <ws-table-column-el label="支付金额" sortable prop='paidAmt'>
            <template slot-scope="scope">
              {{regFenToYuan(scope.row.paidAmt)}}
            </template>
          </ws-table-column-el>
          <ws-table-column-el label="绩效金额" prop='settlementAmt'>
            <template slot-scope="scope">
              {{regFenToYuan(scope.row.settlementAmt)}}
            </template>
          </ws-table-column-el>
          <ws-table-column-el label="退款金额" prop='refundAmt'>
            <template slot-scope="scope">
              {{regFenToYuan(scope.row.refundAmt)}}
            </template>
          </ws-table-column-el>
          <ws-table-column-el label="支付订单数" prop='paidCnt'></ws-table-column-el>
          <ws-table-column-el label="退款订单数" prop='refundCnt'></ws-table-column-el>
        </ws-table-el>
      </div>
    </div>
  </div>
</template>

<script>
import charts from './charts.vue'
import organization from './organization-options.vue'
import { platformOrgRecommend, platformOrgRecommendMoney } from './charts'
import countTo from 'vue-count-to'
import { timeButtonGroupList } from './search-options.js'
export default {
    components: { charts, organization, countTo },
    name: 'salePlatform',
    data() {
        return {
            timeType: 'YESTERDAY',
            timeButtonGroupList,
            dataOptions: {
                time: ''
            },
            category:0,
            agencyNumber: '',
            tableFlag: true,
            sortType: null,
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
                    op: {
                        selectList: 'orderAnalyseRank',
                        selectCount: 'orderAnalyseRankCount'
                    },
                    beforeQuery: this.tableBeforeQuery
                }
            },
            tableType: 1,
            platformOrgRecommend: {},
            platformOrgRecommendMoney: {},
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
            orgType: 0,
            radioQuery: 20,
            orgList: [],
            orgProps: {
                value: 'agencyNumber',
                label: 'orgName',
                checkStrictly: true
            },
            agencyNumbers: [],
            distributionAmt: {},
            roleType: 0,
            loading: false,
            isShowTab:true,//是否显示大区tab
        }
    },
    computed:{
        businessTypeOptions(){
            let powerData = this.$getModuleOpList('/dataServer/retailersOnline')
            let arr = []
            for(let item in powerData){
                if (item == 'eCommerce') {
                    arr.push({
                        value: 1,
                        label: '电商商城业务'
                    })
                }else if (item=='recharge') {
                    arr.push({
                        value: 2,
                        label: '话费充值业务'
                    })
                }else if (item == 'electrocar') {
                    arr.push({
                        value: 3,
                        label: '两轮车业务'
                    })
                }else if(item == 'customizedCar'){
                    arr.push({
                        value: 4,
                        label: '定制车业务'
                    })
                }
            }
            if (arr.length>1) {
                arr.unshift({
                    value: 0,
                    label:'全部'
                })
            }
            this.category = arr.length&&arr[0].value||0
            return arr
        }
    },
    created() {
        // 默认展示今日的数据
        this.dataOptions.time = [this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd'), this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd')]
        this.platformOrgRecommend = platformOrgRecommend
        this.platformOrgRecommendMoney = platformOrgRecommendMoney
        this.orgType = (this.$baseMethod.getStore('roleOption') && this.$baseMethod.getStore('roleOption').orgType) || 0
        this.roleType = (this.$baseMethod.getStore('roleOption') && this.$baseMethod.getStore('roleOption').orgType) || 0
        // 如果账号是大区则数据排名不显示大区tab，默认选中的是城市分公司
        this.tableType = this.roleType == 5 ? 2 :1
        this.initTab()
        console.log(this.orgType)
    },
    mounted() {
        this.getOrgList()
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
                case 5:
                this.selectOptions = [
                       {
                            value: 20,
                            label: '城市分公司'
                        }
                    ]
                    this.orgType = 20
                    break
                default:
                    this.selectOptions = [
                        {
                            value: 10,
                            label: '大区'
                        },
                       {
                            value: 20,
                            label: '城市分公司'
                        }
                    ]
                    this.orgType = 10
                    break
            }
        },
        orgTypeChange(e) {
            this.orgType = e
        },
        regFenToYuan(m) {
            return this.thousandSeparator(this.$baseMethod.regFenToYuan(m))
        },
        getOrgList() {
            this.orgList = []
            let opt = {
                data: JSON.stringify({}),
                op: 'authAgencyList'
            }
            const URL = this.powerList['authAgencyList']
            if (!URL) {
                this.$message.error('无权限访问')
                return false
            }
            this.$axios(URL, opt).then(res => {
                let resData = JSON.parse(res.data) || []
                this.orgList = resData
            })
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
        tableBeforeQuery() {
            let param = this.getParam()
            param.sortType = this.sortType
            return param
        },
        getCheckedNodes(val) {
            this.agencyNumbers = val
        },
        // 趋势图
        getAnalysis() {
            const op = 'orderAnalyseTread'
            let data = {
                data: this.getParam(),
                op
            }
            let URL = this.$getModuleUrl(this.moduleName, op)
            this.$axios(URL, data)
                .then(res => {
                    if (res.code == 1) {
                        let dataList = JSON.parse(res.data) || {}
                        let xData = dataList.xData || []
                        let dataInfoList = dataList.dataInfoList.map(item => item.data) || []
                        this.platformOrgRecommendMoney.xAxis.data = xData
                        this.platformOrgRecommendMoney.series[0].data = dataInfoList[0].map(item => item / 100) || [] //支付金额
                        this.platformOrgRecommendMoney.series[1].data = dataInfoList[1].map(item => item / 100) || [] //退款金额
                        this.platformOrgRecommendMoney.series[2].data = dataInfoList[2].map(item => item / 100) || [] //绩效金额
                        this.$refs.rechargeSum.updateCharts(this.platformOrgRecommendMoney)
                        this.platformOrgRecommend.xAxis.data = xData //日期
                        this.platformOrgRecommend.series[0].data = dataInfoList[3] || [] //支付订单数
                        this.platformOrgRecommend.series[1].data = dataInfoList[4] || [] //退款订单数
                        this.$refs.rechargeCount.updateCharts(this.platformOrgRecommend)
                    }
                    this.loading = false
                })
                .catch(err => {
                    this.loading = false
                })
        },
        getanalyseAmt() {
            const reqData = {
                data: this.getParam(),
                op: 'orderAnalyse'
            }
            let URL = this.$getModuleUrl(this.moduleName, reqData.op)
            this.$axios(URL, reqData).then(res => {
                if (res.code == 1) {
                    this.distributionAmt = JSON.parse(res.data) || {}
                }
            })
        },
        getParam() {
            let categories = []
            if (this.category) {
                categories = [this.category]
            }else{
                this.businessTypeOptions.forEach(item=>{
                    if (item.value>0) {
                        categories.push(item.value)
                    }
                })
            }
            let param = {
                agencyNumber: this.agencyNumber,
                orgType: this.orgType,
                categories,
            }

            if (this.dataOptions.time.length) {
                let [startDate, endDate] = this.dataOptions.time
                param.dayStart = `${startDate.substring(0, 10)} 00:00:00`
                param.dayEnd = `${endDate.substring(0, 10)} 23:59:59`
            }
            param.tableType = this.tableType
            return param
        },
        query(init) {
            if (!this.dataOptions.time) {
                return this.$message.error('请选择时间')
            }
            this.loading = true
            if ([20, 40].includes(this.orgType) && this.agencyNumber) {
                this.tableFlag = false
            } else {
                this.tableFlag = true
            }
            if(Number(this.roleType) === 5 || (Number(this.orgType) === 10 && this.agencyNumber)){
                this.tableType = 2
                this.isShowTab = false
            }else{
                this.tableType = 1
                this.isShowTab = true
            }
            this.$nextTick(() => {
                init && this.tableFlag && this.$refs.table.search()
            })
            this.getAnalysis()
            this.getanalyseAmt()
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
            const reqData = {
                data: this.getParam(),
                op: 'platformExport'
            }
            let URL = this.$getModuleUrl(this.moduleName, reqData.op)
            this.$axios(URL, reqData).then(res => {
                this.$message.success('文件正在导出，请到文件下载界面进行下载')
            })
        },
        tableTypeChange(e) {
            this.$refs.table.reset()
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
        
        .el-form--inline .el-form-item {
            margin-bottom: 20px;
        }
    }
    .btn-box {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
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
    }
    .query-btn-r {
        border: 1px solid #f05259;
        color: #f05259;
        margin-left: 16px;
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
.tableType {
    text-align: right;
}
</style>
