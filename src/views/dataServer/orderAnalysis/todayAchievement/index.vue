<!--
 * @Author: CuteBoy
 * @Date: 2022-09-05 16:22:46
 * @Description: 今日业绩分析
-->
<template>
    <div class="order-review">
        <search-column v-if="orgType !== 40" :showDaySearch="false" @search="search"></search-column>
        <!-- 订单总览 -->
        <Table v-if="oaPower().orderOverView" title="订单总览（单）" :showTip="true"
            :tableData="orderList" :tableColumn="tableColumnOrder">
            <template #showTipContent>
                下单总量：乘客已下订单总量，不管订单最终状态。<br />
                完成行程订单总量：司机结束行程的订单总量。<br />
                完成行程订单总金额：司机结束行程订单，乘客需支付行程费用的订单总金额。<br />
                下单乘客量：有过下单的去重乘客总数，不管订单最终状态下单就算。<br />
                接单司机量：有过接单的去重司机数。<br />
                取消订单总量：最终状态为取消的订单总量。<br />
            </template>
            <template #serviceType="{ row }">
                {{ serviceType[row.serviceType] }}
            </template>
        </Table>
        <!-- 订单总量分时趋势图 -->
        <order-total-trend v-if="oaPower().orderByHourTrend" ref="orderTotalChart" :chartData="barChartData"
            @change="typeChange"></order-total-trend>
        <!-- 已完成订单分析 -->
        <order-complete v-if="oaPower().completedOrderAnalysis" ref="orderCompleteChart" :chartData="pieChartData">
        </order-complete>
        <!-- 已付款订单总量 -->
        <order-paid v-if="oaPower().paidOrderCntAndAmt" ref="orderPaidChart" :chartData="paidPieChartData"></order-paid>
        <!-- 已付款详情 -->
        <Table v-if="oaPower().paidOrderdetail" title="已付款详情"  :tableData="paidList"
            :tableColumn="tableColumnPaid"></Table>
        <!-- 下单渠道的完单统计 总部-->
        <Table v-if="oaPower().orderChannelDetail" title="下单渠道的完单统计（单）" 
            :tableData="channelList" :tableColumn="tableColumnChannel">
        </Table>
        <!-- 特殊订单的完单统计 总部-->
        <Table v-if="oaPower().orderSpecialChannelDetail" title="特殊订单的完单统计（单）" :showTool="true"
         :tableData="specialList" :tableColumn="tableColumnSpecial"
            @serviceTypeChange="toolChange">
        </Table>
    </div>
</template>
 
<script>
import SearchColumn from "../components/searchColumn"
import Table from "../components/table"
import OrderTotalTrend from "../components/orderTotalTrend"
import OrderComplete from "./components/orderComplete"
import OrderPaid from "../components/orderPaid"
import { serviceType, tableColumnOrder, tableColumnPaid, tableColumnChannel, tableColumnSpecial } from '../utils'
import { mixins } from "../mixins"
export default {
    name: 'todayAchievement',
    mixins: [mixins],
    components: {
        SearchColumn,
        Table,
        OrderTotalTrend,
        OrderComplete,
        OrderPaid
    },

    data() {
        return {
            moduleName: "/dataServer/orderAnalysis/todayAchievement",
            serviceTypeRow: 0,
            serviceTypeTable: 20,
            orderList: [],
            paidList: [],
            channelList: [],
            specialList: [],
            serviceType,
            barChartData: {},
            pieChartData: [],
            paidPieChartData: [],
            params: this.getParams(),
            tableColumnOrder, tableColumnPaid, tableColumnChannel, tableColumnSpecial
        }
    },

    created() {
        this.init();
    },

    methods: {
        getParams() {
            const toDay = new Date().format("yyyy-MM-dd");
            return {
                dayStart: toDay,
                dayEnd: toDay,
                bigRegionNumber: '',
                regionNumber: '',
                companyNumberList: '',
                centerNumber: '',
                stationNumber: ''
            }
        },
        init() {
            this.getOrder();
            this.getTrend();
            this.getComplete();
            this.getPaid();
            this.getPaidDetails();
            this.getChannel();
            this.getSpecialChannel();
        },
        /**
         * @description: commonAjax mixins
         */
        async getOrder() {
            try {
                const { expOrderList = [] } = await this.commonAjax('orderOverView', this.params)
                this.orderList = expOrderList
            } catch (err) {
                throw err
            }
        },
        async getTrend() {
            try {
                const res = await this.commonAjax('orderByHourTrend',
                    Object.assign(this.params, { serviceType: this.serviceTypeRow })
                )
                this.barChartData = res
            } catch (err) {
                throw err
            }
        },
        async getComplete() {
            try {
                const res = await this.commonAjax('completedOrderAnalysis', this.params)
                const keys = Object.keys(res)
                let arr = []
                for (let i = 0; i < keys.length; i++) {
                    const e = keys[i]
                    arr[i] = this.returnPieSeriesData(res[e], 'cnt') ?? [];
                }
                this.pieChartData = arr
            } catch (err) {
                throw err
            }
        },
        async getPaid() {
            try {
                const { amtList = [], cntList = [] } = await this.commonAjax('paidOrderCntAndAmt', this.params)
                this.paidPieChartData = [
                    this.returnPieSeriesData(cntList, 'cnt'),
                    this.returnPieSeriesData(amtList, 'amt')
                ]
            } catch (err) {
                throw err
            }
        },
        async getPaidDetails() {
            try {
                const res = await this.commonAjax('paidOrderdetail', this.params)
                this.paidList = res
            } catch (err) {
                throw err
            }
        },
        async getChannel() {
            try {
                const res = await this.commonAjax('orderChannelDetail', this.params)
                function filter(arr, type) {
                    return arr.filter((it) => {
                        return it.orderType === type
                    })[0].orderCnt ?? 0
                }
                if (res) {
                    for (let i = 0; i < res.length; i++) {
                        let e = res[i];
                        Object.assign(e, {
                            allOrder: filter(e.orderTypeVos, 0),
                            realOrder: filter(e.orderTypeVos, 20),
                            appointmentOrder: filter(e.orderTypeVos, 21),
                            charteredOrder: filter(e.orderTypeVos, 70),
                        })
                    }
                }
                this.channelList = res
            } catch (err) {
                throw err
            }
        },
        // 20实时 21预约
        async getSpecialChannel() {
            try {
                const res = await this.commonAjax('orderSpecialChannelDetail', Object.assign(this.params, { serviceType: this.serviceTypeTable }))
                this.specialList = res
            } catch (err) {
                throw err
            }
        },
        search({ relationId }) {
            //总部
            if (this.orgType == 0) {
                this.params.bigRegionNumber = relationId[0]
                this.params.regionNumber = relationId[1]
                this.params.companyNumberList = relationId[2] ? [relationId[2]] : null
            }
            if (this.orgType == 4) {
                this.params.bigRegionNumber = null
                this.params.regionNumber = relationId[0]
                this.params.companyNumberList = relationId[1] ? [relationId[1]] : null
            }
            if (this.orgType == 5) {
                this.params.bigRegionNumber = null
                this.params.regionNumber = null
                this.params.companyNumberList = relationId[0] ? [relationId[0]] : null
            }
            //分公司
            if (this.orgType == 20) {
                this.params.centerNumber = relationId[0]
                this.params.stationNumber = relationId[1]
            }
            //服务中心
            if (this.orgType == 30) {
                this.params.stationNumber = relationId[0]
            }
            this.init()
        },
        typeChange(serviceType) {
            this.serviceTypeRow = serviceType
            this.getTrend(serviceType)
        },
        /**
         * @description: 
         * @param {string | number} id table标识
         * @param {string} serviceType 订单类型
         * @return {*}
         */
        toolChange({ id, serviceType }) {
            this.serviceTypeTable = serviceType
            this.getSpecialChannel(serviceType)
        },
    },
}
</script>
 
<style scoped lang="scss">

</style>