<template>
    <div class="analyse">
        <div class="moneyAn">
            <h3>金额分析</h3>
            <div v-loading="loading">
                <el-row :gutter="12">
                    <el-col :span="24">
                        <el-card shadow="always" class="always">
                            <div class="a_title">总特许经营费(元)</div>
                            <p class="a_value">
                                <count-to :startVal="0" :decimals="2" :duration="1000" :endVal="Number(totalAmt || 0)"></count-to>
                            </p>
                        </el-card>
                    </el-col>
                </el-row>
                <div class="chart-box">
                    <div id="moneyAnChart" style="height: 100%" class="line-box"></div>
                </div>
            </div>
        </div>
        <div class="orderAn">
            <h3>订单分析</h3>
            <div v-loading="loading">
                <el-row :gutter="12">
                    <el-col :span="12">
                        <el-card shadow="always" class="always">
                            <div class="a_title">总人数(人)</div>
                            <p class="a_value">
                                <count-to :startVal="0" :duration="1000" :endVal="Number(peopleSum || 0)"></count-to>
                            </p>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card shadow="always" class="always">
                            <div class="a_title">总笔数(笔)</div>
                            <p class="a_value">
                                <count-to :startVal="0" :duration="1000" :endVal="Number(totalCnt || 0)"></count-to>
                            </p>
                        </el-card>
                    </el-col>
                </el-row>
                <div class="chart-box">
                    <div id="orderAnChart" style="height: 100%" class="line-box"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import countTo from 'vue-count-to'

const options = {
    xAxis: {
        type: 'category',
        nameTextStyle: {
            color: '#606266'
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        data: []
    },
    yAxis: {
        type: 'value',
        nameTextStyle: {
            color: '#606266'
        }
    },
    grid: {
        top: 50,
        left: 24,
        right: 24,
        bottom: 24,
        containLabel: true
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            // 坐标轴指示器配置项。
            type: 'cross', // 'line' 直线指示器  'shadow' 阴影指示器  'none' 无指示器  'cross' 十字准星指示器。
            axis: 'auto', // 指示器的坐标轴。
            snap: true, // 坐标轴指示器是否自动吸附到点上
            label: {
                backgroundColor: '#283b56'
            }
        },
        showContent: true,
        backgroundColor: 'rgba(0,0,0,0.7)',
        textStyle: {
            color: '#fff'
        },
        formatter: function (params) {
            let result = `<div style="margin-bottom: 4px;">${params[0].name}</div>`
            params.forEach(function (item) {
                const unit = item.seriesName === '特许经营费' ? '元' : item.seriesName === '总人数' ? '人' : '笔'
                let dotHtml = `<span style="display:inline-block;margin-right:5px;width:10px;height:4px;background:${item.color};vertical-align: 2px"></span>`
                result += dotHtml + item.seriesName + '：' + item.data + unit + '</br>'
            })
            result = `<div style="font-size: 12px;line-height:24px;padding:2px 5px;color:#fff">${result}</div>`
            return result
        }
    },
    series: [
        {
            name: '',
            type: 'line',
            // stack: 'Total',
            symbolSize: 6, //设置折线上圆点大小
            data: []
        }
    ],
    color: ['#0BDBA8', '#F3D01D', '#FD571F'],
    legend: {
        left: 24,
        bottom: 24,
        itemHeight: 4,
        itemWidth: 10,
        icon: 'rect',
        textStyle: {
            color: '#606266',
            fontSize: 14
        },
        y: 'top'
    }
}

export default {
    components: { countTo },
    props: {
        searchParms: {
            type: Object,
            default: () => {}
        },
        op: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            totalAmt: 0,
            peopleSum: 0,
            totalCnt: 0,

            loading: false,
            moneyAnChart: null,
            orderAnChart: null,
            moduleName: '/dataServer/vipIncome',
            ro: null
        }
    },
    mounted() {
        this.$nextTick(() => {
            const mchartDom = document.getElementById('moneyAnChart')
            this.moneyAnChart = this.$echarts.init(mchartDom)

            const ochartDom = document.getElementById('orderAnChart')
            this.orderAnChart = this.$echarts.init(ochartDom)
        })

        // 监听页面变化
        this.ro = new ResizeObserver((entries, observer) => {
            for (const entry of entries) {
                const width = entry.contentRect.width
                this.$nextTick(() => {
                    this.moneyAnChart && this.moneyAnChart.resize()
                    this.orderAnChart && this.orderAnChart.resize()
                })
            }
        })
        this.ro.observe(document.querySelector('.analyse'))
    },
    beforeDestroy() {
        let dom = document.querySelector('.analyse')
        if (dom) {
            this.ro.unobserve(dom)
        }
        this.moneyAnChart = null
        this.orderAnChart = null
    },
    methods: {
        // 获取数据
        getDatas() {
            const op = this.op
            let data = {
                data: this.searchParms,
                op
            }
            let URL = this.$getModuleUrl(this.moduleName, op)
            this.loading = true
            this.$axios(URL, data)
                .then(res => {
                    this.loading = false
                    const result = JSON.parse(res.data)
                    const xdata = result.xdata
                    let mData = []
                    let ordData = []
                    result.dataInfoList.forEach(item => {
                        if (item.Lend === '包干金额') {
                            mData.push({
                                name: '特许经营费',
                                type: 'line',
                                // stack: 'Total',
                                symbolSize: 6, //设置折线上圆点大小
                                data: item.data.map(item => {
                                    return this.$baseMethod.regFenToYuan(item)
                                })
                            })
                        }
                        if (item.Lend === '包干人数' || item.Lend === '包干笔数') {
                           ordData.push({
                                name: item.Lend === '包干人数' ? '总人数' : '总笔数',
                                type: 'line',
                                // stack: 'Total',
                                symbolSize: 6, //设置折线上圆点大小
                                data: item.data
                            })
                        }
                    })

                    // 金额图表赋值
                    this.totalAmt = this.$baseMethod.regFenToYuan(result.totalAmt)

                    const mOptions = this.$baseMethod.deepClone(options)
                    mOptions.xAxis.data = xdata
                    mOptions.series = mData
                    this.moneyAnChart && this.moneyAnChart.setOption(mOptions)

                    // 笔数图表赋值
                    this.peopleSum = result.peopleSum
                    this.totalCnt  = result.totalCnt

                    const ordOptions = this.$baseMethod.deepClone(options)
                    ordOptions.xAxis.data = xdata
                    ordOptions.series = ordData
                    this.orderAnChart && this.orderAnChart.setOption(ordOptions)
                })
                .catch(err => {
                    this.loading = false
                })
        }
    }
}
</script>

<style lang="scss" scoped>
.analyse {
    h3 {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #303133;
        margin: 32px 0 16px 0;
    }
    .always {
        text-align: center;
        .a_title {
            height: 22px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #303133;
            line-height: 22px;
        }
        .a_value {
            font-size: 48px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #303133;
            margin-top: 24px;
            margin-bottom: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .chart-box {
        height: 350px;
        // border: 1px solid #dcdfe6;
        border-radius: 8px;
        // padding: 10px;
        overflow: hidden;
        margin-top: 20px;
    }
}
</style>
