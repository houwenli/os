<template>
    <div class="section-box">
        <div class="radioSearch">
            <h3 class="table-title">订单总量分时趋势图
                <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">
                        下单总量：乘客已下订单总量，不管订单最终状态。<br />
                        完成行程订单总量：司机结束行程的订单总量。<br />
                        已付款订单总量：乘客已支付行程费用的订单总量。
                    </div>
                    <img style="margin-left: 4px;" width="24" src="@/assets/order/icon_tips.png" alt="">
                </el-tooltip>
            </h3>
            <div style="min-width: 380px">
                <el-radio-group v-model="serviceType" size="medium" @change="serviceChange">
                    <el-radio-button label="0">全部</el-radio-button>
                    <el-radio-button label="20">实时</el-radio-button>
                    <el-radio-button label="21">预约</el-radio-button>
                    <el-radio-button label="22">扫码</el-radio-button>
                    <el-radio-button label="70">包车</el-radio-button>
                    <el-radio-button label="40">拼车</el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <div id="order-trend" ref="orderTrendLineRef"></div>
    </div>
</template>
 
<script>
import echarts from '../../utils/echarts'
import { BAR_OPTS } from '../../utils/charts-options'
import { cloneDeep } from 'lodash-es'
export default {
    name: 'orderTotalTrend',
    props: {
        chartData: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            serviceType: '0',
            myChart: null
        }
    },

    watch: {
        chartData: {
            deep: true,
            handler(val) {
                this.setOptions(val)
            }
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.initChart()
        })
    },

    methods: {
        initChart() {
            this.myChart = echarts.init(document.getElementById('order-trend'));
            this.setOptions(this.chartData)
        },

        setOptions({ dataInfoList = [], xData = [] }) {
            let barOption = cloneDeep(BAR_OPTS)
            let key = Object.keys(dataInfoList[0] ?? []);
            for (let i = 0; i < barOption.series.length; i++) {
                const e = barOption.series[i]
                e.data = dataInfoList.map((item) => {
                    return item[key[i]]
                });
            }
            barOption.xAxis.data = xData;
            this.myChart.setOption(barOption)
        },

        serviceChange() {
            this.$emit('change', this.serviceType)
        }
    }
}
</script>
 
<style scoped lang="scss">
.section-box {
    margin-top: 33px;

    .radioSearch {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 29px;

        .table-title {
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #303133;
            display: flex;
        }
    }
}

#order-trend {
    height: 446px;
    width: 100%;
}
</style>