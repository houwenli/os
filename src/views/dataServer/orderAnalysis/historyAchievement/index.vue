<!--
 * @Author: CuteBoy
 * @Date: 2022-09-05 16:22:45
 * @Description: 历史业绩分析
-->
<template>
    <div class="history-achievement">
        <search-column :showOrgSearch="orgType !== 40" :showDaySearch="true" @search="search"></search-column>
        <!-- 日常运营 -->
        <daily-operation v-if="oaPower().DailyOperate" ref="dailyOperationLineRef" :chartData="dailyOperationList" :loading="dailyOperateLoading">
        </daily-operation>
        <!-- 订单详细情况 -->
        <order-info v-if="oaPower().orderOverView" :expOrderList="orderInfoList"></order-info>
        <!-- 订单总量分时趋势图 -->
        <order-total-trend v-if="oaPower().orderByHourTrend" ref="orderTotalChart" :chartData="barChartData"
            @change="typeChange"></order-total-trend>
        <!-- 已付款订单总量/总金额 -->
        <order-paid v-if="oaPower().paidOrderCntAndAmt" ref="OrderPaidChart" :chartData="paidPieChartData"></order-paid>
        <!-- 已付款详情 -->
        <Table v-if="oaPower().paidOrderdetail" title="已付款详情" :tableData="paidList"
            :tableColumn="tableColumnPaid"></Table>
        <!-- 预付订单情况/趋势图 -->
        <order-prepay v-if="oaPower().advanceOrderDetailByDay" :prepayOrderData="orderPrepayList"
            ref="orderPrepayLineRef"></order-Prepay>
        <!-- 下单渠道的完单统计 总部-->
        <Table v-if="oaPower().orderChannelDetail" title="下单渠道的完单统计（单）" 
            :tableData="channelList" :tableColumn="tableColumnChannel">
        </Table>
        <!-- 特殊订单的完单统计 总部-->
        <Table v-if="oaPower().orderSpecialChannelDetail" title="特殊订单的完单统计（单）" :showTool="true" :tableData="specialList" :tableColumn="tableColumnSpecial"
            @serviceTypeChange="toolChange">
        </Table>
    </div>
</template>
 
<script>
import SearchColumn from "../components/searchColumn"
import DailyOperation from "./components/dailyOperation"
import OrderInfo from "./components/orderInfo"
import OrderTotalTrend from "../components/orderTotalTrend"
import OrderPaid from "../components/orderPaid"
import OrderPrepay from "./components/orderPrepay"
import Table from "../components/table"
import { tableColumnPaid, tableColumnChannel, tableColumnSpecial } from '../utils'
import { mixins } from "../mixins"
export default {
    name: 'historyAchievement',
    mixins: [mixins],
    components: {
        SearchColumn,
        Table,
        DailyOperation,
        OrderInfo,
        OrderTotalTrend,
        OrderPaid,
        OrderPrepay
    },
    data() {
        return {
         
            moduleName: "/dataServer/orderAnalysis/historyAchievement",
            dailyOperationList: {},
            orderInfoList: [],
            paidPieChartData: [],
            orderPrepayList: {},
            barChartData: {},
            paidList: [],
            tableColumnPaid, tableColumnChannel, tableColumnSpecial,
            channelList: [],
            specialList: [],
            serviceTypeRow: 0,
            serviceTypeTable: 20,
            params: this.getParams(),
            dailyOperateLoading: false
        }
    },

    created() {
        this.init();
    },

    methods: {
        getParams() {
            const dayStart = this.$baseMethod.getBeforeDay(-6, 'yyyy-MM-dd', new Date())
            const dayEnd = this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd', new Date())
            return {
                dayStart,
                dayEnd,
                bigRegionNumber: '',
                regionNumber: '',
                companyNumberList: '',
                centerNumber: '',
                stationNumber: ''
            }
        },
        init() {
            this.getDaily();
            this.getOrder();
            this.getTrend();
            this.getPaid();
            this.getPaidDetails();
            this.getPrepay();
            this.getChannel();
            this.getSpecialChannel();
        },
        async getDaily() {
            this.dailyOperateLoading = true
            try {
                const res = await this.commonAjax('DailyOperate', this.params)
                this.dailyOperationList = res
                this.dailyOperateLoading = false
            } catch (err) {
                this.dailyOperateLoading = false
                throw err
            }
        },
        async getOrder() {
            try {
                const { expOrderList = [] } = await this.commonAjax('orderOverView', this.params)
                this.orderInfoList = expOrderList
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
        async getPrepay() {
            try {
                const res = await this.commonAjax('advanceOrderDetailByDay', this.params)
                this.orderPrepayList = res
            } catch (err) {
                throw err
            }
        },
        async getChannel() {
            try {
                let res = await this.commonAjax('orderChannelDetail', this.params)
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
        search({ dateTime, relationId }) {
            this.params.dayStart = dateTime[0]
            this.params.dayEnd = dateTime[1]
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