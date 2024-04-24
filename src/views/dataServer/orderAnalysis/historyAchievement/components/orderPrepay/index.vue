<template>
    <div class="prepay-order-info">
        <div class="chart-box">
            <div class="chart-title">预付订单情况</div>
            <div class="data-info" v-loading="sumLoading">
                <p class="data-item">
                    <span class="item-title">预付率：</span>
                    <span>{{prepayOrderData.rate}}</span>
                </p>
                <p class="data-item">
                    <span class="item-title">下单总量：</span>
                    <span>{{ thousandSeparator(prepayOrderData.orderCntSum) }}</span>
                </p>
                <p class="data-item">
                    <span class="item-title">预付订单总量：</span>
                    <span>{{ thousandSeparator(prepayOrderData.prepayOrderSum) }}</span>
                </p>
            </div>
        </div>
        <div class="right">
            <p class="chart-title">预付订单总量趋势图</p>
            <div class="bor-box">
                <div id="prepay-order-trend" ref="prepayOrderTrendRef"></div>
            </div>
        </div>
    </div>
</template>
 
<script>
import echarts from '../../../utils/echarts'
import { HISTORY_BAR_PREPAY_OPT } from '../../../utils/charts-options'
import { cloneDeep } from 'lodash-es'
export default {
    name: 'prepayOrder',
    props: {
        prepayOrderData: {
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

    mounted() {
        this.$nextTick(() => {
            this.initChart()
        })
    },

    watch: {
        prepayOrderData: {
            deep: true,
            handler(val) {
                this.setOptions(val)
            }
        }
    },

    methods: {
                 // 添加千位符
    thousandSeparator(num) {
        var num = (num || 0).toString(),
            re = /\d{3}$/,
            result = '';
        while (re.test(num)) {
            result = RegExp.lastMatch + result;
            if (num !== RegExp.lastMatch) {
                result = ',' + result;
                num = RegExp.leftContext;
            } else {
                num = '';
                break;
            }
        }
        if (num) {
            result = num + result;
        }
        return result;
    },
        initChart() {
            this.myChart = echarts.init(document.getElementById('prepay-order-trend'));
            this.setOptions(this.prepayOrderData)
        },

        setOptions(data) {
            this.myChart.showLoading()
            let barOption = cloneDeep(HISTORY_BAR_PREPAY_OPT)
            if ('xDate' in data) {
                barOption.xAxis.data = data.xDate
                barOption.series[0].data = data.dataInfoList
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

#prepay-order-trend {
    width: 100%;
    height: 354px;
    border-radius: 8px;
    border: 1px solid #DCDFE6;
    padding: 24px;
    box-sizing: border-box;
}

.prepay-order-info {
    display: flex;
    justify-content: space-between;
    margin-top: 32px;

    .right {
        flex: 1;
        margin-left: 16px;
    }

    .bor-box {
        margin-top: 16px;
    }
}

.chart-box {
    position: relative;
    min-width: 290px;
}

.chart-title {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
}

.data-info {
    width: 100%;
    margin-top: 16px;
    font-size: 32px;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
    color: #303133;
    line-height: 37px;

    .data-item {
        // background: #f5f7fa;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 107px;
        padding: 0 24px;
        border-radius: 8px;
        border: 1px solid #DCDFE6;

        &:nth-of-type(2) {
            margin: 16px 0;
        }

        .item-title {
            font-size: 16px;
            font-weight: 400;
            color: #606266;
            line-height: 22px;
            // min-width: 135px;
        }
    }
}
</style>