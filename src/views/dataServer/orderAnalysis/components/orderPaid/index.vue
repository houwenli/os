<template>
    <div class="section-box">
        <el-row :gutter="16">
            <el-col :lg="12">
                <div class="pay-box">
                    <p class="chart-title">已付款订单总量（单）</p>
                    <div id="pay-order-num" ref="payOrderNumRef" v-show="empty[0]"></div>
                    <div class="data-empty" v-show="!empty[0]">
                        <img width=" 122" src="@/assets/index/empty.png" alt="暂无数据">
                        <p>暂无相关数据</p>
                    </div>
                </div>
            </el-col>
            <el-col :lg="12">
                <div class="pay-box">
                    <p class="chart-title">已付款订单总金额（元）</p>
                    <div id="pay-order-amount" ref="payOrderamountRef" v-show="empty[1]"></div>
                    <div class="data-empty" v-show="!empty[1]">
                        <img width=" 122" src="@/assets/index/empty.png" alt="暂无数据">
                        <p>暂无相关数据</p>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
 
<script>
import echarts from '../../utils/echarts'
import { PIE_PAID_OPTS } from '../../utils/charts-options'
import { cloneDeep } from 'lodash-es'
const echartArr = [
    { id: 0, name: 'pay-order-num', title: '总量' },
    { id: 1, name: 'pay-order-amount', title: '总金额' }
]
export default {
    name: 'orderPaid',
    props: {
        chartData: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            myChart: [],
            empty: [true, true]
        }
    },

    watch: {
        chartData: {
            deep: true,
            handler(val) {
                for (let i = 0; i < echartArr.length; i++) {
                    this.setOptions(val, i)
                }
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
            for (let i = 0; i < echartArr.length; i++) {
                const e = echartArr[i];
                this.myChart[e.id] = echarts.init(document.getElementById(e.name));
                this.setOptions(this.chartData, e.id)
            }
        },
        setOptions(data, i) {
            if (data[i]) {
                this.$set(this.empty, i, true)
                let pieOption = cloneDeep(PIE_PAID_OPTS)
                pieOption.title.text = `已付款订单\n{a|${echartArr[i].title}}`
                pieOption.series[0].data = data[i]
                this.myChart[i].setOption(pieOption)
            } else {
                this.$set(this.empty, i, false)
            }
        },
    }
}
</script>
 
<style scoped lang="scss">
.section-box {
    margin-top: 32px;

    .pay-box {
        width: 100%;
        position: relative;

        .chart-title {
            margin-bottom: 16px;
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #303133;
        }
    }

    .data-empty {
        border: 1px solid #DCDFE6;
        border-radius: 8px;
        height: 333px;
        text-align: center;
        padding-top: 80px;
    }
}

#pay-order-num,
#pay-order-amount {
    border: 1px solid #DCDFE6;
    border-radius: 8px;
    height: 333px;
}
</style>