<template>
    <div class="daily-operation">
        <div class="radioSearch">
            <h3 class="table-title">订单分析
                <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">
                        下单总量：乘客已下订单总量，不管订单最终状态。<br />
                        完成行程订单总量：司机结束行程的订单总量。<br />
                        取消订单总量：最终状态为取消的订单总量。<br />
                        待付款订单总量：乘客待支付行程费用的订单总量。<br />
                        已付款订单总量：乘客已支付行程费用的订单总量。<br />
                        预付款订单总量：乘客有预支付行程费用的订单总量。<br />
                        下单乘客量：有过下单的去重乘客总数，不管订单最终状态下单就算。<br />
                        接单司机量：有过接单的去重司机数。<br />
                    </div>
                    <img style="margin-left: 4px;" width="24" src="@/assets/order/icon_tips.png" alt="">
                </el-tooltip>
            </h3>
            <div v-loading="loading">
                <div id="daily-operation"></div>
            </div>
        </div>
        <div class="radioSearch" style="margin-top: 20px">
            <h3 class="table-title">订单金额分析
                <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">
                        完成行程订单总金额：司机结束行程订单，乘客需支付行程费用的订单总金额。<br />
                        待付款订单总金额：乘客待支付行程费用的订单总金额。<br />
                        已付款订单总金额：乘客已付完行程费用的订单总金额。<br />
                    </div>
                    <img style="margin-left: 4px;" width="24" src="@/assets/order/icon_tips.png" alt="">
                </el-tooltip>
            </h3>
            <div v-loading="loading">
                <div id="dailyOperationSum"></div>
            </div>
        </div>
    </div>
</template>
 
<script>
import echarts from '../../../utils/echarts'
import { HISTORY_DAILY_OPT } from '../../../utils/charts-options'
import { cloneDeep } from 'lodash-es'
// import { toTimeDuration } from '../../../utils'
export default {
    name: 'dailyOperation',
    props: {
        chartData: {
            type: Object,
            required: true
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            myChart: null,
            myChartSum: null
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.initChart()
        })
    },

    watch: {
        chartData: {
            deep: true,
            handler(val) {
                this.dealData(val)
            }
        }
    },

    methods: {
        initChart() {
            this.myChart = echarts.init(document.getElementById('daily-operation'));

            this.myChartSum = echarts.init(document.getElementById('dailyOperationSum'));

            this.dealData(this.chartData)
        },

        dealData(data) {
            let a = [], b = [], c = []
            if (data && data.xData) {
                data.dataInfoList.forEach(item => {
                    if (item.Lend.indexOf('金额') != -1) {
                        c.push({
                            name: item.Lend,
                            type: 'line',
                            data: item.data.map(it => {
                                return this.$baseMethod.regFenToYuan(it)
                            }),
                            label: {
                                show: true,
                                position: 'top'
                            }
                        })
                    } else {
                        if (item.Lend === '下单乘客量' || item.Lend === '接单司机量') {
                            b.push({
                                name: item.Lend,
                                type: 'line',
                                data: item.data,
                                yAxisIndex: 1,
                                label: {
                                    show: true,
                                    position: 'top'
                                },
                                symbol: 'roundRect',
                                symbolSize: 6
                            })
                        } else {
                            a.push({
                               name: item.Lend,
                                type: 'line',
                                data: item.data,
                                label: {
                                    show: true,
                                    position: 'top'
                                } 
                            })
                        }
                    }
                })
            }
            this.setOptions([...a, ...b], c)
        },

        setOptions(dataA, dataB) {
            let options = cloneDeep(HISTORY_DAILY_OPT)
            //日期间隔超过15 rotate
            const xData = this.chartData.xData || []
            if (xData.length > 15) {
                options.xAxis.axisLabel.rotate = 40
            }
            options.xAxis.data = xData;
            options.legend.data = null
            options.legend.orient = 'horizontal';

            let lineOptionA = cloneDeep(options)
            
            lineOptionA.yAxis = options.yAxis
            lineOptionA.yAxis[0].name = '单'
            lineOptionA.yAxis[1].name = '人'
            lineOptionA.yAxis[1].nameTextStyle.padding = [0, 12, 0, 0]

            let leg = dataA.map(item => {
                return item.name
            });
            lineOptionA.legend.data = leg
            lineOptionA.legend.selected = {
                '下单总量': true,
                '完成行程订单总量': true,
                '取消订单总量': true,
                '待付款订单总量': false,
                '已付款订单总量': false,
                '预付订单总量': false,
                '下单乘客量': false,
                '接单司机量': false,
            }
        
            lineOptionA.series = dataA
            // data.expOrderList
            this.myChart.setOption(lineOptionA)

            let lineOptionB = cloneDeep(options)
            lineOptionB.yAxis = [options.yAxis[0]]
            lineOptionB.yAxis[0].name = '元'
            lineOptionB.series = dataB
            this.myChartSum.setOption(lineOptionB)
        },
    }
}
</script>
 
<style scoped lang="scss">
.daily-operation {
    margin-top: 32px;

    .table-title {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #303133;
        line-height: 22px;
        margin-bottom: 16px;
        display: flex;
    }
    .sub-title {
        font-size: 14px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 400;
        color: #666;
        line-height: 22px;
        margin-bottom: 16px;
    }
}

#daily-operation {
    width: 100%;
    height: 380px;
}
#dailyOperationSum {
    width: 100%;
    height: 380px;
}
</style>