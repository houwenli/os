<template>
    <div class="analyse">
        <div class="moneyAn">
            <h3>会员人数分析</h3>
            <div v-loading="loading">
                <el-row :gutter="12">
                    <el-col :span="24">
                        <div class="always">
                            <div class="a_title">会员总数量(人)</div>
                            <p class="a_value">
                                <count-to :startVal="0" :decimals="0" :duration="1000" :endVal="Number(totalAmt || 0)"></count-to>
                            </p>
                        </div>
                    </el-col>
                </el-row>
                <div class="chart-box">
                    <div id="moneyAnChart" style="height: 100%" class="line-box"></div>
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
    },
    grid: {
        top: 16,
        left: 0,
        right: 0,
        bottom: 0,
        containLabel: true
    },
    series: [
        {
            type: 'bar',
            data: [],
            label:{
                show: true, 
                position: 'top',
                distance: 10,
                verticalAlign: 'middle'
            },
            barWidth: 40,
            itemStyle: {
                normal: {
                    // 这里就可以实现，配置柱状图的颜色
                    color: function (params) {
                        var colorList = [ '#254BE9', '#0BDBA8', '#2B2B31', '#F3D01D', '#FF9B00', '#BE7A10', '#1D93FF', '#30E5DF', '#FD571F', '#606266'];
                        return colorList[params.dataIndex]
                    },
                }
            },
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
            moduleName: '/dataServer/vipCount',
            ro: null
        }
    },
    mounted() {
        this.$nextTick(() => {
            const mchartDom = document.getElementById('moneyAnChart')
            this.moneyAnChart = this.$echarts.init(mchartDom)
        })

        // 监听页面变化
        this.ro = new ResizeObserver((entries, observer) => {
            for (const entry of entries) {
                const width = entry.contentRect.width
                this.$nextTick(() => {
                    this.moneyAnChart && this.moneyAnChart.resize()
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
                    const xdata = result.dataList.map(item => {
                        return item.gradeName
                    })
                    const ydata = result.dataList.map(item => {
                        return item.sum
                    })
                    // 人数图表赋值
                    this.totalAmt = result.sum

                    const mOptions = this.$baseMethod.deepClone(options)
                    mOptions.xAxis.data = xdata
                    mOptions.series[0].data = ydata
                    this.moneyAnChart && this.moneyAnChart.setOption(mOptions)
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
        background: #F5F7FA;
        border-radius: 7px;
        padding: 24px;
        .a_title {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #606266;
            line-height: 20px;
            margin-bottom: 12px;
        }
        .a_value {
            font-size: 24px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #303133;
            line-height: 28px;
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
