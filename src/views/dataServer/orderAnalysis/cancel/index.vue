<!--
 * @Author: CuteBoy
 * @Date: 2022-09-05 16:22:28
 * @Description: 取消分析
-->

<template>
    <div class="compliance">
        <div class="table-title-tips">取消订单详情
            <el-tooltip class="item" effect="dark" placement="right">
                <div slot="content">
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
        <search-column id="0" :showOrgSearch="isShowOrg" customClass="search-column" @search="search"></search-column>
        <order-cancel-info v-if="oaPower().cancelOrderDetailByOrg" ref="orderComplianceBarRef"
            :orderDetailData="orderCancelList"></order-cancel-info>

        <!-- 订单取消地域分布（仅统计实时单） 总部机构 -->
        <template v-if="oaPower().orderCancelDetailByStation">
            <div class="table-title-tips">订单取消地域分布（仅统计实时单）</div>
            <search-column id="1" :showOrgSearch="false" custom-class="search-column" @search="search"></search-column>
            <Table :tableData="orderAreaList" :tableColumn="tableColumnAreaLow"
                style="margin-bottom: 32px;" max-height="300">
                <template #cancelCnt="{ row }">
                    {{ row.cancelCnt }} |
                    <span class="color">{{ computedNum(row.cancelCnt, row.afterOrderCancelCnt) }}</span>
                </template>
                 <template #afterDriverCancelCnt="{ row }">
                    {{ row.afterDriverCancelCnt }} |
                    <span class="color">{{ computedNum(row.afterDriverCancelCnt, row.afterOrderCancelCnt) }}</span>
                </template>
                <template #afterPassengerCancelCnt="{ row }">
                    {{ row.afterPassengerCancelCnt }} |
                    <span class="color">{{ computedNum(row.afterPassengerCancelCnt, row.afterOrderCancelCnt) }}</span>
                </template>
                <template #afterSystemCancelCnt="{ row }">
                    {{ row.afterSystemCancelCnt }} |
                    <span class="color">{{ computedNum(row.afterSystemCancelCnt, row.afterOrderCancelCnt) }}</span>
                </template>
                <template #afterBackCancelCnt="{ row }">
                    {{ row.afterBackCancelCnt }} |
                    <span class="color">{{ computedNum(row.afterBackCancelCnt, row.afterOrderCancelCnt) }}</span>
                </template>
                <!-- <template #loadMore>
                    <div class="more" v-if="empty" @click="loadMore">展开更多 <i class="el-icon-arrow-down"></i></div>
                </template> -->
            </Table>
        </template>
        <!-- 司机取消次数排名 一级机构-->
        <template v-if="oaPower().orderByDriverCancelCnt">
            <div class="table-title-tips">司机取消次数排名</div>
            <search-column :showOrgSearch="isShowOrg" id="2" custom-class="search-column" @search="search">
            </search-column>
            <el-row :gutter="20" v-if="orgType != 40">
                <el-col :span="12">
                    <driver-cancel title="实体店维度TOP50" :tableColumn="tableColumnDriverCancelOne"
                        :driverCancelList="stationList" @loadMore="loadMore"></driver-cancel>
                </el-col>
                <el-col :span="12">
                    <driver-cancel title="司机维度TOP50(支持数据下钻)" :tableColumn="tableColumnDriverCancelTop"
                        :driverCancelList="driverList" @loadMore="loadMore" @row-click="rowClick"></driver-cancel>
                </el-col>
            </el-row>
            <el-row :gutter="20" v-else>
                <el-col :span="24">
                    <driver-cancel title="司机维度TOP50(支持数据下钻)" :tableColumn="tableColumnDriverCancel"
                        :driverCancelList="driverList" @loadMore="loadMore" @row-click="rowClick"></driver-cancel>
                </el-col>
            </el-row>
        </template>
    </div>
</template>
 
<script>
import SearchColumn from "../components/searchColumn"
import OrderCancelInfo from "./components/orderCancelInfo"
import DriverCancel from "../components/driverCancel"
import { mixins } from "../mixins"
import { tableColumnDriverCancelOne, tableColumnAreaLow, tableColumnDriverCancelTop, tableColumnDriverCancel } from '../utils'
import Table from "../components/table"
export default {
    name: 'cancel',
    mixins: [mixins],
    components: {
        SearchColumn,
        OrderCancelInfo,
        DriverCancel,
        Table
    },
    data() {
        return {
            moduleName: "/dataServer/orderAnalysis/cancel",
            orderCancelList: {},
            orderAreaList: [],
            orderAreaListTemp: [],
            tableColumnAreaLow,
            tableColumnDriverCancelOne,
            tableColumnDriverCancelTop,
            tableColumnDriverCancel,
            stationList: [],
            stationNumberList:[],
            driverList: [],
            currentUserInfo:{},
            currentuserId:0,
            date: [
                this.$baseMethod.getBeforeDay(-6, 'yyyy-MM-dd', new Date()),
                this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd', new Date())
            ]
        }
    },

    created() {
        this.getCancelOrder();
        this.getCancelOrderByCompany();
        this.getCancelOrderTimes();
        this.currentUserInfo=JSON.parse(sessionStorage.getItem('roleOption'))
    },

    computed: {
        // empty() {
        //     let len = this.orderAreaList.length;
        //     return len > 6 && len != this.orderAreaListTemp.length;
        // },
        computedNum() {
            return (num, total) => {
                num = parseFloat(num);
                total = parseFloat(total);
                if (isNaN(num) || isNaN(total)) {
                    return 0;
                }
                return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00) + '%';
            }
        },
        isShowOrg() {
            return this.orgType == 30
        },
    },

    methods: {
        getParams({ relationId = [] } = {}) {
            const dayStart = this.$baseMethod.getBeforeDay(-6, 'yyyy-MM-dd', new Date())
            const dayEnd = this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd', new Date())
            return {
                dayStart,
                dayEnd,
                // centerNumber: relationId[0],
                stationNumber: relationId[0]
            }
        },
        async getCancelOrder(val) {
            try {
                let params = this.getParams(val)
                if (val) {
                    params.dayStart = val.dateTime[0]
                    params.dayEnd = val.dateTime[1]
                }
                const res = await this.commonAjax('cancelOrderDetailByOrg', params)
                this.orderCancelList = res
            } catch (err) {
                throw err
            }
        },
        async getCancelOrderByCompany(val) {
            try {
                let params = this.getParams(val)
                if (val) {
                    params.dayStart = val.dateTime[0]
                    params.dayEnd = val.dateTime[1]
                }
                const res = await this.commonAjax('orderCancelDetailByStation', params)
                this.orderAreaListTemp = res;
                // this.orderAreaList = res.slice(0, 6)
                this.orderAreaList = res
            } catch (error) {
                Error(error)
            }
        },
        async getCancelOrderTimes(val) {
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
                '0': this.getCancelOrder,
                '1': this.getCancelOrderByCompany,
                '2': this.getCancelOrderTimes,
            }
            return fun[val.id](val)
        },
        loadMore() { },
        rowClick(val) {
            this.$router.push({ path: 'orderAnalysisCancelDetail', query: { driverId: val.driverId, dayStart: this.date[0], dayEnd: this.date[1] ,stationNumberList:val.stationAgencyNumberList[0],currentUserInfoId:this.currentUserInfo.currentDepId} })
        }
    }
}
</script>
 
<style scoped lang="scss">
.compliance {
    .table-title-tips {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #303133;
        line-height: 22px;
        display: flex;
        margin-bottom: 16px;
    }

    .search-column {
        margin-bottom: 16px;
    }
}

.color {
    color: #F05259;
}
</style>