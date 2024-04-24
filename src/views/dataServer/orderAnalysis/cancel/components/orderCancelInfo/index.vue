<template>
    <div class="order-info">
        <el-row :gutter="16" class="order-table-infor" v-loading="ordLoading">
            <el-col :lg="8">
                <el-row class="grid-content" style="border-radius: 8px 8px 0 0;">
                    <el-col :lg="24">
                        <span class="title" style="padding-right: 18px;">接单后取消订单总数</span>
                        <span class="desc">{{ thousandSeparator(orderDetailData.afterOrderCancelCnt)||0 }} 单</span>
                    </el-col>
                </el-row>
                <el-row class="grid-content">
                    <el-col :lg="24">
                        <span class="title" style="padding-right: 18px;">接单后乘客取消订单</span>
                        <span class="desc">{{thousandSeparator(orderDetailData.afterPassengerCancelCnt) ||0 }} 单</span>
                    </el-col>
                </el-row>
                <el-row class="grid-content">
                    <el-col :lg="24">
                        <span class="title" style="padding-right: 18px;">接单后系统取消订单</span>
                        <span class="desc">{{ thousandSeparator(orderDetailData.afterSystemCancelCnt)||0 }} 单</span>
                    </el-col>
                </el-row>
                <el-row class="grid-content" style="border-radius: 0 0 8px 8px;">
                    <el-col :lg="24">
                        <span class="title" style="padding-right: 18px;">接单后平台取消订单</span>
                        <span class="desc">{{ thousandSeparator(orderDetailData.afterBackCancelCnt)||0 }} 单</span>
                    </el-col>
                </el-row>
                <el-row class="grid-content" style="border-radius: 0 0 8px 8px;">
                    <el-col :lg="24">
                        <span class="title" style="padding-right: 18px;">接单后司机取消订单</span>
                        <span class="desc">{{ thousandSeparator(orderDetailData.afterDriverCancelCnt)||0 }} 单</span>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :lg="16">
                <div id="cancel-order-info" v-show="empty"></div>
                <div class="data-empty" v-show="!empty">
                    <img width=" 122" src="@/assets/index/empty.png" alt="暂无数据">
                    <p>暂无相关数据</p>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
 
<script>
import echarts from '../../../utils/echarts'
import { parseMoney } from '../../../utils'
import { CANCEL_PIE_OPT } from '../../../utils/charts-options'
import { cloneDeep } from 'lodash-es'
export default {
    name: 'orderInfo',
    props: {
        orderDetailData: {
            type: Object,
            required: true
        },
        ordLoading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            myChart: null,
            empty: true
        }
    },
    computed: {
        formatMoney() {
            return (val) => {
                return parseMoney(val)
            }
        }
    },
    watch: {
        orderDetailData: {
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
            this.myChart = echarts.init(document.getElementById('cancel-order-info'));
            this.setOptions(this.orderDetailData)
        },
        setOptions(data) {
            if ('afterPassengerCancelCnt' in data) {
                this.empty = true
                let barOption = cloneDeep(CANCEL_PIE_OPT)
                barOption.series[0].data = [
                    { value: data.afterPassengerCancelCnt, name: '接单后乘客取消订单' },
                    { value: data.afterSystemCancelCnt, name: '接单后系统取消订单' },
                    { value: data.afterBackCancelCnt, name: '接单后平台取消订单' },
                    { value: data.afterDriverCancelCnt, name: '接单后司机取消订单' },
                ]
                this.myChart.setOption(barOption)
                console.log(barOption.series[0].data)
            } else {
                this.empty = false
            }
        },
        cellStyle() {
            return 'border-color:#DCDFE6;background-color: #F5F7FA;color: #606266;';
        },
    }
}
</script>
 
<style scoped lang="scss">
.order-info {
    margin-bottom: 32px;
}

.order-table-infor {
    position: relative;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #606266;
    margin-bottom: 32px;

    .grid-content {
        position: relative;
        margin-top: -1px;
        padding: 0 24px;
        background: #f5f7fa;
        border-radius: 8px;
        height: 60px;
        line-height: 60px;
        margin-bottom: 16px;

        .el-col {
            margin: 0;
        }

        &:last-child {
            margin-bottom: 0;
        }

        >p {
            margin-right: 80px;
            display: flex;
            display: -ms-flexbox;
            display: -webkit-flex;
        }

        .desc {
            padding-left: 40px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #303133;
        }
    }

    .data-empty {
        height: 358px;
        text-align: center;
        padding-top: 100px;
    }
}

#cancel-order-info {
    width: 100%;
    height: 360px;
    border: 1px solid #DCDFE6;
    border-radius: 8px;
}
</style>