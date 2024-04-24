<template>
    <div>
        <div class="recharge_box">
            <div class="recharge_search_box">
                <el-form :model="dataOptions" ref="ruleForm" inline label-width="90px">
                    <template>
                        <el-form-item label="机构名称：" prop="agencyNumber" v-if="orgType != 40">
                            <organization
                                v-model="agencyNumber"
                                :showSelect="true"
                                :selectOptions="selectOptions"
                                ref="orgSelect"
                                placeholder="请输入机构名称搜索"
                                valueKey="agencyNumber"
                                :orgType="choiceOrgType"
                                @orgTypeChange="
                                    val => {
                                        choiceOrgType = val
                                    }
                                "
                            ></organization>
                        </el-form-item>
                        <el-form-item label="时间：" prop="time">
                            <el-date-picker
                                class="datePicker"
                                v-model="dataOptions.time"
                                type="daterange"
                                :picker-options="pickerOptions"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd"
                                :clearable="false"
                            ></el-date-picker>
                        </el-form-item>
                    </template>
                </el-form>
                <div class="btn-box">
                    <ws-throttle><el-button class="query-btn" type="primary" @click="query(true)">查询</el-button></ws-throttle>
                    <ws-throttle v-if="orgType-0!==40 && selectOrgType != 40">
                        <el-button class="query-btn query-btn-r" @click="exportExcel">导出</el-button>
                    </ws-throttle>
                </div>
            </div>
            <div class="echart_box">
                <div class="title">充值用户分析</div>
                <div class="view_box">
                    <div class="view_cont marginR20">
                        <div class="view_tit">充值总用户数（人）</div>
                        <div class="view_sum">{{ orgRecommendData.peopleNum || 0 }}</div>
                    </div>
                    <div class="view_cont marginR20">
                        <div class="view_tit">用户充值笔数（笔）</div>
                        <div class="view_sum">{{ orgRecommendData.rechargeCount || 0 }}</div>
                    </div>
                    <div class="view_cont">
                        <div class="view_tit">退款总笔数(笔)</div>
                        <div class="view_sum">{{orgRecommendData.refundCnt || 0}}</div>
                    </div>
                </div>
                <div class="chart_cont">
                    <charts ref="rechargeSum" :setChartsOptions="orgRecommend"></charts>
                </div>
            </div>
            <div class="echart_box">
                <div class="title">充值金额分析</div>
                <div class="view_box">
                    <div class="view_cont marginR20">
                        <div class="view_tit">总入账金额（元）</div>
                        <div class="view_sum">{{ regFenToYuan(orgRecommendData.totalAmount || 0) }}</div>
                    </div>
                    <div class="view_cont marginR20">
                        <div class="view_tit">用户充值金额（元）</div>
                        <div class="view_sum">{{ regFenToYuan(orgRecommendData.rechargeMoney || 0) }}</div>
                    </div>
                    <div class="view_cont marginR20">
                        <div class="view_tit">赠送金额（元）</div>
                        <div class="view_sum">{{ regFenToYuan(orgRecommendData.rewardMoney || 0) }}</div>
                    </div>
                    <div class="view_cont">
                        <div class="view_tit">退款金额（元）</div>
                        <div class="view_sum">{{regFenToYuan(orgRecommendData.refundAmt||0)}}</div>
                    </div>
                </div>
                <div class="chart_cont">
                    <charts ref="rechargeCount" :setChartsOptions="orgRecommendMoney"></charts>
                </div>
            </div>
            <div class="echart_box" v-if="orgType != 40 && selectOrgType != 40">
                <div class="title">活动明细数据</div>
                <ws-table-el ref="table" v-bind="tableConfig" style="margin-top: 16px; padding: 0px !important" :header-cell-style="{ background: '#F5F7FA' }">
                    <!-- <ws-table-column-el label="日期" prop='dateDay'>
                    <template slot-scope="scope">
                        {{$baseMethod.formatData(scope.row.dateDay,"yyyy-MM-dd")}}
                    </template>
                </ws-table-column-el >
                    <ws-table-column-el label="上级机构" v-if="![20,30,40].includes(+selectOrgType)&&![20,30,40].includes(+orgType)" prop='supOrgName'></ws-table-column-el > -->
                    <ws-table-column-el label="机构名称" prop="orgName"></ws-table-column-el>
                    <ws-table-column-el label="总入账金额" prop="totalAmount">
                        <template slot-scope="scope">
                            {{ regFenToYuan(scope.row.totalAmount) }}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el label="充值总金额" prop="rechargeMoney">
                        <template slot-scope="scope">
                            {{ regFenToYuan(scope.row.rechargeMoney) }}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el label="赠送总金额" prop="rewardMoney">
                        <template slot-scope="scope">
                            {{ regFenToYuan(scope.row.rewardMoney) }}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el label="充值总用户数" prop="peopleNum"></ws-table-column-el>
                    <ws-table-column-el label="用户充值总笔数" prop="rechargeCount"></ws-table-column-el>
                    <ws-table-column-el label="退款总笔数" prop='refundCnt'></ws-table-column-el >
                    <ws-table-column-el label="退款总金额(元)" prop='refundAmt'>
                        <template slot-scope="scope">
                            {{regFenToYuan(scope.row.refundAmt)}}
                        </template>
                    </ws-table-column-el >
                </ws-table-el>
            </div>
        </div>
    </div>
</template>

<script>
import charts from './components/charts.vue'
import organization from './components/organization-options.vue'
import { orgRecommend, orgRecommendMoney } from './components/charts'
export default {
    components: { charts, organization },
    name: 'orgRecommend',
    data() {
        return {
            dataOptions: {
                time: ''
            },
            agencyNumber: '',
            choiceOrgType: '',
            sortBy: null,
            sortField: null,
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
                    const minDay = new Date('2022-07-01 00:00:00').getTime()
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
            moduleName: '/dataServer/orgRecommend',
            tableConfig: {
                filterColumns: false,
                autoHeight: false,
                lazyQuery: {
                    moduleName: '/dataServer/orgRecommend',
                    op: {
                        selectList: 'rechargeDetail'
                        // selectCount: 'count'
                    },
                    beforeQuery: this.tableBeforeQuery
                }
            },
            orgRecommend: {},
            orgRecommendMoney: {},
            orgRecommendData: {},
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
            selectOrgType: 0
        }
    },
    created() {
        let nowTime = new Date().getTime()
        let minDay = new Date('2022-07-01 00:00:00').getTime()
        let day30 = 30 * 24 * 3600 * 1000
        if (nowTime - day30 > minDay) {
            this.dataOptions.time = [this.$baseMethod.formatData(nowTime - day30, 'yyyy-MM-dd'), this.$baseMethod.formatData(nowTime, 'yyyy-MM-dd')]
        } else {
            this.dataOptions.time = ['2022-07-01', this.$baseMethod.formatData(nowTime, 'yyyy-MM-dd')]
        }
        this.orgRecommend = orgRecommend
        this.orgRecommendMoney = orgRecommendMoney
        this.orgType = (this.$baseMethod.getStore('roleOption') && this.$baseMethod.getStore('roleOption').orgType) || 0
        switch (this.orgType + '') {
            case '20':
                this.selectOptions = [
                    {
                        value: '30',
                        label: '区县分公司'
                    },
                    {
                        value: '40',
                        label: '实体店'
                    }
                ]
                break
            case '30':
                this.selectOptions = [
                    {
                        value: '40',
                        label: '实体店'
                    }
                ]
                break
            case '40':
                this.selectOptions = []
                break
            default:
                this.selectOptions = [
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
                ]
                break
        }
    },
    mounted() {
        this.query(false)
    },
    methods: {
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
        tableBeforeQuery() {
            let param = this.getParam()
            ;(param.sortBy = this.sortBy), (param.sortField = this.sortField)
            return param
        },
        // 充值人数/金额分析 总览
        getSum() {
            const op = 'overView'
            let data = {
                data: this.getParam(),
                op
            }
            let URL = this.$getModuleUrl(this.moduleName, op)
            this.$axios(URL, data).then(res => {
                if (res.code === 1) {
                    let dataList = JSON.parse(res.data) || {}
                    this.orgRecommendData = dataList
                }
            })
        },
        // 充值人数/金额分析 图表
        getAnalysis() {
            const op = 'rechargeTrend'
            let data = {
                data: this.getParam(),
                op
            }
            let URL = this.$getModuleUrl(this.moduleName, op)
            this.$axios(URL, data).then(res => {
                if (res.code == 1) {
                    let dataList = JSON.parse(res.data) || {}
                    let resData = dataList.vos || []
                    let rechargeMoney = [],
                        totalAmount = [],
                        rewardMoney = [],
                        payNotifyTime = [],
                        refundCnt = []
                    let rechargeCount = [],
                        peopleNum = [],
                        refundAmt = []
                    for (let i = 0; i < resData.length; i++) {
                        rechargeMoney.push(this.$baseMethod.regFenToYuan(resData[i].rechargeMoney))
                        totalAmount.push(this.$baseMethod.regFenToYuan(resData[i].totalAmount)) //总金额
                        rewardMoney.push(this.$baseMethod.regFenToYuan(resData[i].rewardMoney)) //赠送金额
                        payNotifyTime.push(this.$baseMethod.formatData(resData[i].dateDay, 'MM/dd'))
                        rechargeCount.push(resData[i].rechargeCount)
                        peopleNum.push(resData[i].peopleNum)
                        refundCnt.push(resData[i].refundCnt)
                        refundAmt.push(this.$baseMethod.regFenToYuan(resData[i].refundAmt))
                    }
                    this.orgRecommend.xAxis.data = payNotifyTime //日期
                    this.orgRecommend.series[0].data = peopleNum //乘客充值总人数
                    this.orgRecommend.series[1].data = rechargeCount //乘客充值笔数
                    this.orgRecommend.series[2].data = refundCnt // 退款笔数
                    this.$refs.rechargeSum.updateCharts(this.orgRecommend)

                    this.orgRecommendMoney.xAxis.data = payNotifyTime
                    this.orgRecommendMoney.series[0].data = totalAmount //总金额
                    this.orgRecommendMoney.series[1].data = rechargeMoney //充值金额
                    this.orgRecommendMoney.series[2].data = rewardMoney
                    this.orgRecommendMoney.series[3].data = refundAmt // 退款总金额
                    this.$refs.rechargeCount.updateCharts(this.orgRecommendMoney)
                }
            })
        },
        getParam() {
            let param = {
                agencyNumber: this.agencyNumber,
                orgType: this.agencyNumber ? this.choiceOrgType : ''
            }
            if (this.dataOptions.time.length) {
                let [startDate, endDate] = this.dataOptions.time
                param.startTime = `${startDate.substring(0, 10)} 00:00:00`
                param.endTime = `${endDate.substring(0, 10)} 23:59:59`
            }
            return param
        },
        query(init) {
            this.selectOrgType = this.agencyNumber ? this.$refs.orgSelect.orgValue : 0
            this.$nextTick(() => {
                init && this.orgType != 40 && this.selectOrgType != 40 && this.$refs.table.search()
            })
            this.getSum()
            this.getAnalysis()
        },
        changeSort(val) {
            let { order, prop } = val
            switch (order) {
                case 'ascending':
                    this.sortBy = 2
                    break
                case 'descending':
                    this.sortBy = 1
                    break
                default:
                    this.sortBy = null
                    break
            }
            switch (prop) {
                case 'passengerNum':
                    this.sortField = 2
                    break
                case 'rechargeMoney':
                    this.sortField = 1
                    break
                default:
                    this.sortField = null
                    break
            }
            this.$refs.table.search()
        },
        // 导出
        exportExcel() {
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
    padding: 24px 40px;
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
            max-width: 226px;
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
        width: 240px;
        /deep/.el-cascader--medium {
            width: 240px !important;
        }
    }
}
</style>
