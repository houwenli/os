<template>
    <div class="order-conversion">
        <el-row :gutter="20">
            <el-col :span="6">
                <div class="grid-content">
                    <p>已下单订单（单）</p>
                    <p class="num">{{ thousandSeparator(chartData.orderCnt) }}</p>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content">
                    <p>应答订单（单）</p>
                    <p class="num">{{ thousandSeparator(chartData.receivedOrderCnt) }}</p>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content">
                    <p>完成行程订单（单）</p>
                    <p class="num">{{ thousandSeparator(chartData.finishedOrderCnt) }}</p>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content">
                    <p>取消订单（单）</p>
                    <p class="num">{{ thousandSeparator(chartData.cancelCnt) }}</p>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="charts">
            <el-col :span="12" class="charts-box">
                <div class="charts-title">转化分析漏斗图</div>
                <div id="conversion-funnel" v-show="empty[0]"></div>
                <div class="data-empty" v-show="!empty[0]">
                    <img width=" 122" src="@/assets/index/empty.png" alt="暂无数据">
                    <p>暂无相关数据</p>
                </div>
            </el-col>
            <el-col :span="12" class="charts-box">
                <div class="charts-title">取消订单分布图</div>
                <div id="conversion-pie" v-show="empty[1]"></div>
                <div class="data-empty" v-show="!empty[1]">
                    <img width=" 122" src="@/assets/index/empty.png" alt="暂无数据">
                    <p>暂无相关数据</p>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
 
<script>
import echarts from '../../../utils/echarts'
import { CONVERSION_FUNNEL_OPT, CANVERSION_PIE_OPT } from '../../../utils/charts-options'
import { cloneDeep } from 'lodash-es'
const echartArr = [
    { id: 0, name: 'conversion-funnel', title: '转化分析漏斗图' },
    { id: 1, name: 'conversion-pie', title: '取消订单分布图' }
]
export default {
    name: 'orderConversion',
    props: {
        chartData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            myChart: [],
            empty: [true, true]
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initChart()
        })
    },
    // computed: {
    //     empty() {
    //         return 'orderCnt' in this.chartData
    //     }
    // },
    watch: {
        chartData: {
            deep: true,
            handler(val) {
                for (let i = 0; i < echartArr.length; i++) {
                    echartArr[i].id == 0 ? this.setOptionsFunnel(val, i) : this.setOptionsPie(val, i)
                }
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
            for (let i = 0; i < echartArr.length; i++) {
                const e = echartArr[i];
                this.myChart[e.id] = echarts.init(document.getElementById(e.name));
                e.id == 0 ? this.setOptionsFunnel(this.chartData, e.id) : this.setOptionsPie(this.chartData, e.id)
            }
        },
        setOptionsFunnel(data, i) {
            if ('orderCnt' in data) {
                this.$set(this.empty, i, true)
                this.myChart[i].showLoading()
                let option = cloneDeep(CONVERSION_FUNNEL_OPT)
                option.series[0].data = [
                    { value: data.orderCnt, name: '已下单订单' },
                    { value: data.receivedOrderCnt, name: '应答订单' },
                    { value: data.finishedOrderCnt, name: '完成行程订单' }
                ]
                option.series[1].data = [
                    { value: data.orderCnt, rate: data.onceRate },
                    { value: data.receivedOrderCnt, rate: data.twiceRate },
                    {
                        value: data.finishedOrderCnt, labelLine: { show: false },
                        label: { show: false }
                    }
                ]
                this.myChart[i].setOption(option)
                this.myChart[i].hideLoading()
            } else {
                this.$set(this.empty, i, false)
            }
        },
        setOptionsPie(data, i) {
            if ('beforeOrderCancelCnt' in data) {
                this.$set(this.empty, i, true)
                let option = cloneDeep(CANVERSION_PIE_OPT)
                option.series[0].data = [
                    { value: data.beforeOrderCancelCnt || '', name: '接单前总取消订单' },
                    { value: data.afterOrderCancelCnt || '', name: '接单后总取消订单' },
                ]
                option.series[1].data = [
                    { value: data.beforePassengerCancelCnt || null, name: '接单前乘客取消订单' },
                    { value: data.beforeSystemCancelCnt || '', name: '接单前系统取消订单' },
                    { value: data.beforeBackCancelCnt || '', name: '接单前平台取消订单' },
                    { value: data.afterDriverCancelCnt || '', name: '接单后司机取消订单' },
                    { value: data.afterPassengerCancelCnt || '', name: '接单后乘客取消订单' },
                    { value: data.afterSystemCancelCnt || '', name: '接单后系统取消订单' },
                    { value: data.afterBackCancelCnt || '', name: '接单后平台取消订单' },
                ]
                this.myChart[i].setOption(option)
                this.myChart[i].hideLoading()
            } else {
                this.$set(this.empty, i, false)
            }
        }
    }
}
</script>
 
<style scoped lang="scss">
.order-conversion {
    .grid-content {
        background: #FFFFFF;
        box-shadow: 0px 5px 16px 0px rgba(186, 186, 186, 0.2);
        border-radius: 8px;
        border: 1px solid #EBEEF5;
        height: 154px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .num {
            font-size: 48px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #303133;
            line-height: 1;
            margin-top: 24px;
        }
    }

    .charts {
        margin-top: 16px;

        .charts-box {
            position: relative;
        }

        .charts-title {
            position: absolute;
            top: 16px;
            left: 24px;
            z-index: 1;
            color: #303133;
            font-weight: 600;
            font-size: 16px;
        }

        .data-empty {
            height: 480px;
            background: #FFFFFF;
            border-radius: 8px;
            border: 1px solid #DCDFE6;
            text-align: center;
            padding-top: 160px;
        }
    }
}

#conversion-funnel,
#conversion-pie {
    width: 100%;
    height: 480px;
    background: #FFFFFF;
    border-radius: 8px;
    border: 1px solid #DCDFE6;
}
</style>