<template>
    <div class="order-info">
        <div class="table-title">订单详细情况</div>
        <el-row :gutter="16" class="order-table-infor" v-loading="ordLoading">
            <el-col :lg="12">
                <el-row class="grid-content" style="border-radius: 8px 8px 0 0;">
                    <el-col :md="24" :lg="12" :xl="12">
                        <span class="title">下单总量</span>
                        <span class="desc" style="padding-left:100px">{{ thousandSeparator(expOrder.orderCnt) }} 笔</span>
                    </el-col>
                </el-row>
                <el-row class="grid-content">
                    <el-col :md="24" :lg="12" :xl="12">
                        <span class="title">完成行程订单总量</span>
                        <span class="desc">{{ thousandSeparator(expOrder.finishAndPaidOrderCnt) }} 笔</span>
                    </el-col>
                    <el-col :md="24" :lg="12" :xl="12">
                        <span class="title">总金额</span>
                        <span class="desc">{{ formatMoney(expOrder.finishAndPaidOrderAmt) }}</span>
                    </el-col>
                </el-row>
                <!-- <el-row class="grid-content">
                    <el-col :md="24" :lg="12" :xl="12">
                        <span class="title" style="padding-right: 18px;">待付款订单总量</span>
                        <span class="desc">{{ expOrder.unpaidOrderCnt }} 笔</span>
                    </el-col>
                    <el-col :md="24" :lg="12" :xl="12">
                        <span class="title">总金额</span>
                        <span class="desc">{{ formatMoney(expOrder.unpaidOrderAmt) }}</span>
                    </el-col>
                </el-row> -->
                <el-row class="grid-content" style="border-radius: 0 0 8px 8px;">
                    <el-col :md="24" :lg="12" :xl="12">
                        <span class="title" style="padding-right: 18px;">已付款订单总量</span>
                        <span class="desc">{{ thousandSeparator(expOrder.paidOrderCnt) }} 笔</span>
                    </el-col>
                    <el-col :md="24" :lg="12" :xl="12">
                        <span class="title">总金额</span>
                        <span class="desc">{{ formatMoney(expOrder.paidOrderAmt) }}</span>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :lg="12">
                <div class="chart-box">
                    <el-table class="orderCntTable" :data="expOrderList" border :header-cell-style="cellStyle">
                        <el-table-column label="订单类型">
                            <template slot-scope="scope">
                                {{ serviceType[scope.row.serviceType] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderCnt" label="下单总量"></el-table-column>
                        <el-table-column prop="finishAndPaidOrderCnt" label="完成行程订单总量">
                        </el-table-column>
                        <!-- <el-table-column prop="unpaidOrderCnt" label="待付款订单总量"></el-table-column> -->
                        <el-table-column prop="paidOrderCnt" label="已付款订单总量"></el-table-column>
                        <template slot="empty">
                            <div class="data-empty">
                                <img width="122" src="@/assets/index/empty.png" alt="暂无数据">
                                <p>暂无相关数据</p>
                            </div>
                        </template>
                    </el-table>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
 
<script>
import { parseMoney, serviceType } from '../../../utils'
export default {
    name: 'orderInfo',
    props: {
        expOrderList: {
            type: Array,
            required: true
        },
        ordLoading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            serviceType
        }
    },
    computed: {
        formatMoney() {
            return (val) => {
                return parseMoney(val)
            }
        },
        expOrder() {
            return this.expOrderList[0] ?? {}
        }
    },
    methods: {
        cellStyle() {
            return 'border-color:#DCDFE6;background-color: #F5F7FA;color: #606266;';
        },
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
    }
}
</script>
 
<style scoped lang="scss">
.order-info {
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
        // border: 1px solid #dcdfe6;
        background: #f5f7fa;
        border-radius: 8px;
        height: 97px;
        line-height: 97px;
        margin-bottom: 10px;

        // padding: 15px 10px;
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

    .grid-content:first-child {
        background-color: #f5f7fa;

        .desc {
            font-weight: bold;
            font-size: 22px;
            color: #363a40;
        }
    }

    .orderCntTable {
        min-height: 300px;
        border-radius: 8px;
    }

    .data-empty {
        margin-top: 6%;

        p {
            line-height: 1;
        }
    }
}

#daily-operation {
    width: 100%;
    height: 380px;
}
</style>