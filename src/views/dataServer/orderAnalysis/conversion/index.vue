<!--
 * @Author: CuteBoy
 * @Date: 2022-09-05 16:22:28
 * @Description: 转化分析
-->

<template>
    <div class="conversion">
        <template v-if="oaPower().converOrderDetail">
            <div class="table-title-tips">转化订单数据
                <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">
                        已下单订单：乘客已下订单总量，不管订单最终状态。<br />
                        应答订单：被司机接单的订单，不管订单最终状态，一个订单被多位司机接过，算1个应答订单数。<br />
                        完成行程订单：司机结束行程的订单总量，不管后续是否付款。<br />
                        取消订单：订单最终状态为取消的订单量。<br />
                        转化率：当前环节订单数与上个环节订单数的比值，即当前环节订单数/上一个环节订单数。<br />
                        接单前取消订单：司机接单前所有取消订单，包含接单前乘客、系统、平台、司机取消订单。<br />
                        接单前乘客取消订单：司机接单前订单最终状态为乘客取消的订单量。<br />
                        接单前系统取消订单：司机接单前订单最终状态为系统取消的订单量。<br />
                        接单前平台取消订单：司机接单前订单最终状态为平台取消的订单量。<br />
                        接单后乘客取消订单：统计节点为司机接单后，且订单最终状态为乘客取消的订单量。<br />
                        接单后取消订单总量：统计节点为司机接单后所有取消订单，包含接单后乘客、系统、平台取消订单。<br />
                        接单后乘客取消订单：统计节点为司机接单后，且订单最终状态为乘客取消的订单量。<br />
                        接单后系统取消订单：统计节点为司机接单后，订单最终状态为系统取消的订单量。<br />
                        接单后平台取消订单：统计节点为司机接单后，且订单最终状态为平台取消的订单量。<br />
                        取消率：取消订单数/接单后乘客下单量。<br />
                        接单后司机取消订单：订单最终状态为司机取消的订单量。<br />
                    </div>
                    <img width="24" style="margin-left: 4px;" src="@/assets/order/icon_tips.png" alt="">
                </el-tooltip>
            </div>
            <search-column id="4" custom-class="search-column" @search="search"></search-column>
            <order-conversion ref="orderConversionRef" :chartData="orderCancelList"></order-conversion>
        </template>

        <!-- 司机应答率分布 -->
        <template v-if="oaPower().receivedOrderTrend">
            <div class="table-title-tips">司机应答率分布
                <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">
                        应答率：司机应答订单与已下单订单的比值，即司机应答订单/已下单订单。
                    </div>
                    <img width="24" style="margin-left: 4px;" src="@/assets/order/icon_tips.png" alt="">
                </el-tooltip>
            </div>
            <search-column id="0" :showDaySearch="searchArr[0]" :showTodaySearch="!searchArr[0]"
                custom-class="search-column" @search="search">
                <template slot="custom">
                    分布类型：
                    <el-select v-model="valueReceive" placeholder="请选择" @change="selectChange(0)"
                        style="margin-right: 32px;">
                        <el-option label="时段分布" :value="0"></el-option>
                        <el-option label="日期分布" :value="1"></el-option>
                    </el-select>
                </template>
            </search-column>
            <chart id="chart-response" :chartData="chartListResponse" :changeType="searchArr[0]" ref="driverResponseRef"></chart>
        </template>

        <!-- 接单完成率分布 -->
        <template v-if="oaPower().finishedOrderTrend">
            <div class="table-title-tips">接单完成率分布
                <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">
                        完成率：完成行程订单与司机应答订单的比值，即完成行程订单数/司机应答订单。
                    </div>
                    <img width="24" style="margin-left: 4px;" src="@/assets/order/icon_tips.png" alt="">
                </el-tooltip>
            </div>
            <search-column id="1" :showDaySearch="searchArr[1]" :showTodaySearch="!searchArr[1]"
                custom-class="search-column" @search="search">
                <template slot="custom">
                    分布类型：
                    <el-select v-model="valueFinished" placeholder="请选择" @change="selectChange(1)"
                        style="margin-right: 32px;">
                        <el-option label="时段分布" :value="0"></el-option>
                        <el-option label="日期分布" :value="1"></el-option>
                    </el-select>
                </template>
            </search-column>
            <chart id="chart-complete" :chartData="chartListComplete" :changeType="searchArr[1]" ref="driverCompleteRef"></chart>
        </template>

        <!-- 订单取消率分布 -->
        <template v-if="oaPower().cancelOrderTrend">
            <div class="table-title-tips">订单取消率分布
                <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">
                        取消率：取消订单与已下单订单的比值，即取消订单/已下单订单。
                    </div>
                    <img width="24" style="margin-left: 4px;" src="@/assets/order/icon_tips.png" alt="">
                </el-tooltip>
            </div>
            <search-column id="2" :showDaySearch="searchArr[2]" :showTodaySearch="!searchArr[2]"
                custom-class="search-column" @search="search">
                <template slot="custom">
                    分布类型：
                    <el-select v-model="valueCancel" placeholder="请选择" @change="selectChange(2)"
                        style="margin-right: 32px;">
                        <el-option label="时段分布" :value="0"></el-option>
                        <el-option label="日期分布" :value="1"></el-option>
                    </el-select>
                </template>
            </search-column>
            <chart id="chart-cancel" :chartData="chartListCancel" :changeType="searchArr[2]" ref="driverCancelRef"></chart>
        </template>

        <!-- 订单取消地域分布（仅统计实时单） 总部机构 -->
        <template v-if="oaPower().cancelOrderByCompany">
            <div class="table-title-tips">订单取消地域分布（仅统计实时单）</div>
            <search-column id="3" :showOrgSearch="false" custom-class="search-column" @search="search"></search-column>
            <Table :tableData="orderAreaList" :tableColumn="tableColumnArea"
                max-height="300">
                <template #beforePassengerCancelCnt="{ row }">
                    {{ row.beforePassengerCancelCnt }} |
                    <span class="color">{{ computedNum(row.beforePassengerCancelCnt, row.cancelCnt) }}</span>
                </template>
                <template #beforeSystemCancelCnt="{ row }">
                    {{ row.beforeSystemCancelCnt }} |
                    <span class="color">{{ computedNum(row.beforeSystemCancelCnt, row.cancelCnt) }}</span>
                </template>
                <template #beforeBackCancelCnt="{ row }">
                    {{ row.beforeBackCancelCnt }} |
                    <span class="color">{{ computedNum(row.beforeBackCancelCnt, row.cancelCnt) }}</span>
                </template>
                <template #afterDriverCancelCnt="{ row }">
                    {{ row.afterDriverCancelCnt }} |
                    <span class="color">{{ computedNum(row.afterDriverCancelCnt, row.cancelCnt) }}</span>
                </template>
                <template #afterPassengerCancelCnt="{ row }">
                    {{ row.afterPassengerCancelCnt }} |
                    <span class="color">{{ computedNum(row.afterPassengerCancelCnt, row.cancelCnt) }}</span>
                </template>
                <template #afterSystemCancelCnt="{ row }">
                    {{ row.afterSystemCancelCnt }} |
                    <span class="color">{{ computedNum(row.afterSystemCancelCnt, row.cancelCnt) }}</span>
                </template>
                <template #afterBackCancelCnt="{ row }">
                    {{ row.afterBackCancelCnt }} |
                    <span class="color">{{ computedNum(row.afterBackCancelCnt, row.cancelCnt) }}</span>
                </template>
            </Table>
        </template>


        <!-- 司机取消次数排名 一级机构-->
        <template v-if="oaPower().orderByDriverCancelCnt">
            <div class="table-title-tips">司机取消次数排名</div>
            <search-column id="5" custom-class="search-column" @search="search"></search-column>
            <el-row :gutter="20">
                <el-col :span="12">
                    <driver-cancel title="实体店维度TOP50" :tableColumn="tableColumnDriverCancel1"
                        :driverCancelList="stationList" @loadMore="loadMore"></driver-cancel>
                </el-col>
                <el-col :span="12">
                    <driver-cancel title="司机维度TOP50(支持数据下钻)" :tableColumn="tableColumnDriverCancelTop"
                        :driverCancelList="driverList" @loadMore="loadMore" @row-click="rowClick"></driver-cancel>
                </el-col>
            </el-row>
        </template>
    </div>
</template>
 
<script>
import SearchColumn from "../components/searchColumn"
import OrderConversion from "./components/orderConversion"
import Chart from "./components/chart"
import DriverCancel from "../components/driverCancel"
import { mixins } from "../mixins"
import Table from "../components/table"
import { tableColumnDriverCancel1, tableColumnArea, tableColumnDriverCancelTop } from '../utils'
export default {
    name: 'conversion',
    mixins: [mixins],
    components: {
        SearchColumn,
        OrderConversion,
        DriverCancel,
        Chart,
        Table
    },
    data() {
        return {
            searchArr: [false, false, false],
            // changeType:false,
            valueReceive: 0,
            valueFinished: 0,
            valueCancel: 0,
            moduleName: '/dataServer/orderAnalysis/conversion',
            tableColumnDriverCancel1,
            driverCancelList: [],
            orderCancelList: {},
            chartListResponse: {},
            chartListComplete: {},
            chartListCancel: {},
            orderAreaList: [],
            orderAreaListTemp: [],
            tableColumnArea,
            tableColumnDriverCancelTop,
            stationList: [],
            driverList: [],
            date: [
                this.$baseMethod.getBeforeDay(-6, 'yyyy-MM-dd', new Date()),
                this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd', new Date())
            ]
        }
    },

    created() {
        this.getOrder();
        this.getReceive();
        this.getFinishedOrder();
        this.getCancelOrder();
        this.getCancelOrderByCompany();
        this.getOrderByDriverCancelCnt()
    },

    computed: {
        computedNum() {
            return (num, total) => {
                num = parseFloat(num);
                total = parseFloat(total);
                if (isNaN(num) || isNaN(total)) {
                    return 0;
                }
                return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00) + '%';
            }
        }
    },

    methods: {
        getParams({ relationId = [] } = {}) {
            const dayStart = this.$baseMethod.getBeforeDay(-6, 'yyyy-MM-dd', new Date()) ?? val.dayStart
            const dayEnd = this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd', new Date()) ?? val.dayEnd
            let params = {}
            //总部
            if (this.orgType == 0) {
                params.bigRegionNumber = relationId[0]
                params.regionNumber = relationId[1]
                params.companyNumberList = relationId[2] ? [relationId[2]] : null
            }
            if (this.orgType == 4) {
                params.bigRegionNumber = null
                params.regionNumber = relationId[0]
                params.companyNumberList = relationId[1] ? [relationId[1]] : null
            }
            if (this.orgType == 5) {
                params.bigRegionNumber = null
                params.regionNumber = null
                params.companyNumberList = relationId[0] ? [relationId[0]] : null
            }
            //分公司
            if (this.orgType == 20) {
                params.centerNumber = relationId[0]
                params.stationNumber = relationId[1]
            }
            //服务中心
            if (this.orgType == 30) {
                this.params.stationNumber = relationId[0]
            }
            return {
                dayStart,
                dayEnd,
                ...params
            }
        },
        async getOrder(val) {
            const initParams = this.getParams(val)
            const params = val ? this.createdParams(1, initParams, val) : initParams
            const conver = await this.commonAjax('converOrderDetail', params)
            const cancel = await this.commonAjax('cancelOrderDetail', params)
            this.orderCancelList = { ...conver, ...cancel }
        },
        async getReceive(val) {
            try {
                const initParams = this.getParams(val)
                let params = this.createdParams(this.valueReceive, initParams, val)
                params = { ...params, ...{ type: this.valueReceive } }
                const res = await this.commonAjax('receivedOrderTrend', params)
                this.chartListResponse = res
            } catch (error) {
                Error(error)
            }
        },
        async getFinishedOrder(val) {
            try {
                const initParams = this.getParams(val)
                let params = this.createdParams(this.valueFinished, initParams, val)
                params = { ...params, ...{ type: this.valueFinished } }
                const res = await this.commonAjax('finishedOrderTrend', params)
                this.chartListComplete = res
            } catch (error) {
                Error(error)
            }
        },
        async getCancelOrder(val) {
            try {
                const initParams = this.getParams(val)
                let params = this.createdParams(this.valueCancel, initParams, val)
                params = { ...params, ...{ type: this.valueCancel } }
                const res = await this.commonAjax('cancelOrderTrend', params)
                this.chartListCancel = res
            } catch (error) {
                Error(error)
            }
        },
        async getCancelOrderByCompany(val) {
            try {
                let params = this.getParams(val)
                if (val) {
                    params.dayStart = val.dateTime[0]
                    params.dayEnd = val.dateTime[1]
                }
                const res = await this.commonAjax('cancelOrderByCompany', params)
                this.orderAreaList = res
            } catch (error) {
                Error(error)
            }
        },
        async getOrderByDriverCancelCnt(val) {
            try {
                let params = this.getParams(val)
                if (val) {
                    params.dayStart = val.dateTime[0]
                    params.dayEnd = val.dateTime[1]
                }
                const { stationList, driverList } = await this.commonAjax('orderByDriverCancelCnt', params)
                this.stationList = stationList;
                this.driverList = driverList;
            } catch (error) {
                Error(error)
            }
        },
        search(val) {
            this.date = [
                val.dateTime[0],
                val.dateTime[1]
            ]
            const fun = {
                '0': this.getReceive,
                '1': this.getFinishedOrder,
                '2': this.getCancelOrder,
                '3': this.getCancelOrderByCompany,
                '4': this.getOrder,
                '5': this.getOrderByDriverCancelCnt
            }
            return fun[val.id](val)
        },
        loadMore() {
            this.orderAreaList = this.orderAreaListTemp
        },
        rowClick(val) {
            this.$router.push({ path: 'conversionDetail', query: { driverId: val.driverId, dayStart: this.date[0], dayEnd: this.date[1],stationNumberList:val.stationAgencyNumberList } })
        },
        selectChange(val) {
            this.searchArr[val] = !this.searchArr[val]
        },
        createdParams(type, params, val) {
            const toDay = new Date().format("yyyy-MM-dd");
            //时段
            if (type == 0) {
                params.dayStart = val ? val.date : toDay;
                params.dayEnd = val ? val.date : toDay;
            }
            //日期 
            else if (type == 1) {
                params.dayStart = val.dateTime[0]
                params.dayEnd = val.dateTime[1]
            }
            return params
        },
    }
}
</script>
 
<style scoped lang="scss">
.conversion {
    .table-title-tips {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #303133;
        line-height: 22px;
        display: flex;
        margin-top: 48px;
        margin-bottom: 16px;
    }

    .search-column {
        margin-bottom: 16px;
    }
}

.more {
    text-align: center;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #F05259;
    height: 40px;
    line-height: 40px;
    background: #F5F7FA;
    cursor: pointer;
}

#chart-response,
#chart-complete,
#chart-cancel {
    width: 100%;
    height: 500px;
}

.color {
    color: #F05259;
}
</style>