<template>
    <div class="prepay-order-info">
        <div class="chart-box">
            <div class="data-info" v-loading="sumLoading">
                <p class="data-item">
                    <span class="item-title">双证订单数(总量)</span>
                    <span>{{addCommas(orderComplianceData.orderCertDoubleCntSum)}}</span>
                </p>
                <p class="data-item">
                    <span class="item-title">完成行程订单数(总量)</span>
                    <span>{{ addCommas(orderComplianceData.finishedOrderCntSum) }}</span>
                </p>
                <p class="data-item">
                    <span class="item-title">订单合规率(总量)</span>
                    <span>{{ addCommas(orderComplianceData.sumRate) }} </span>
                </p>
            </div>
        </div>
        <div class="right">
            <div class="bor-box">
                <div class="bor-box-title">近6个月系统双证订单趋势图（按月统计）</div>
                <div id="compliance-order-trend" ref="complianceOrderTrendRef"></div>
            </div>
        </div>
    </div>
</template>
 
<script>
import echarts from '../../../utils/echarts'
import { COMPLIANCE_BAR_OPTS } from '../../../utils/charts-options'
import { cloneDeep } from 'lodash-es'
import { addCommas } from '../../../utils'
export default {
    name: 'orderCompliance',
    props: {
        orderComplianceData: {
            type: Object,
            required: true
        },
        sumLoading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            myChart: null
        }
    },

    computed: {
        addCommas() {
            return (val) => {
                return val ? addCommas(val) : 0
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initChart()
        })
    },

    watch: {
        orderComplianceData: {
            deep: true,
            handler(val) {
                this.setOptions(val)
            }
        }
    },

    methods: {
        initChart() {
            this.myChart = echarts.init(document.getElementById('compliance-order-trend'));
            this.setOptions(this.orderComplianceData)
        },

        setOptions(data) {
            this.myChart.showLoading()
            let barOption = cloneDeep(COMPLIANCE_BAR_OPTS)
            if ('xAxisData' in data) {
                barOption.xAxis[0].data = data.xAxisData;
                for (let i = 0; i < barOption.series.length; i++) {
                    let e = barOption.series;
                    e[i].data = data.result[i]
                }
                this.myChart.setOption(barOption)
                this.myChart.hideLoading()
            }
        },
    }
}
</script>
 
<style scoped lang="scss">
.search_box {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .chart-head {
        margin: 20px 0 0 0;
    }
}

#compliance-order-trend {
    width: 100%;
    height: 310px;
}

.prepay-order-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;

    .right {
        flex: 1;
        margin-left: 16px;
    }

    .bor-box {
        background: #FFFFFF;
        border-radius: 8px;
        border: 1px solid #DCDFE6;
        padding: 16px 24px;
        height: 390px;
        box-sizing: border-box;

        .bor-box-title {
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #303133;
            margin-bottom: 20px;
        }
    }
}

.chart-box {
    position: relative;
    min-width: 284px;
}

.data-info {
    width: 100%;
    font-size: 32px;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
    color: #303133;
    line-height: 37px;

    .data-item {
        background: #FFFFFF;
        border-radius: 8px;
        border: 1px solid #DCDFE6;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 120px;
        padding: 0 24px;

        &:nth-of-type(2) {
            margin: 16px 0;
        }

        span {
            font-size: 32px;
            font-family: DINAlternate-Bold, DINAlternate;
        }

        .item-title {
            font-size: 14px;
            font-weight: 400;
            color: #606266;
            line-height: 22px;
            margin-bottom: 8px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #606266;
        }
    }
}
</style>