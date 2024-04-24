<!--
 * @Author: CuteBoy
 * @Date: 2022-09-05 16:22:28
 * @Description: 合规分析
-->

<template>
    <div class="compliance">
        <div class="table-title-tips">合规订单分析
            <el-tooltip class="item" effect="dark" placement="right">
                <div slot="content">
                    下单总量：乘客已下订单总量，不管订单最终状态。<br />
                    完成行程订单总量：司机结束行程的订单总量。<br />
                    完成行程订单总金额：司机结束行程订单，乘客需支付行程费用的订单总金额。<br />
                    下单乘客量：有过下单的去重乘客总数，不管订单最终状态下单就算。<br />
                    接单司机量：有过接单的去重司机数。<br />
                    取消订单总量：最终状态为取消的订单总量。<br />
                </div>
                <img width="24" style="margin-left: 4px;" src="@/assets/order/icon_tips.png" alt="">
            </el-tooltip>
        </div>
        <search-column v-if="orgType !== 40" :showDaySearch="false" customClass="search-column" @search="search">
        </search-column>
        <order-compliance v-if="oaPower().complianceOrderAnalysis" :orderComplianceData="orderComplianceList"
            ref="orderComplianceBarRef"></order-compliance>
        <order-detailed v-if="oaPower().complianceOrderDetail" :compliancelList="compliancelList"></order-detailed>
    </div>
</template>
 
<script>
import OrderDetailed from "./components/orderDetailed"
import SearchColumn from "../components/searchColumn"
import OrderCompliance from "./components/orderCompliance"
import { mixins } from "../mixins"
export default {
    name: 'compliance',
    mixins: [mixins],
    components: {
        OrderDetailed,
        SearchColumn,
        OrderCompliance
    },
    data() {
        return {
            moduleName: '/dataServer/orderAnalysis/compliance',
            orderComplianceList: {},
            params: this.getParams(),
            compliancelList: []
        }
    },
    created() {
        this.getComplianceOrder();
    },
    methods: {
        getParams() {
            return {
                bigRegionNumber: '',
                regionNumber: '',
                companyNumberList: '',
                centerNumber: '',
                stationNumber: ''
            }
        },
        async getComplianceOrder() {
            try {
                const { dataList = [], orderCertDoubleCntSum, finishedOrderCntSum, sumRate } = await this.commonAjax('complianceOrderAnalysis', this.params)
                let row = ['orderCertDoubleCnt', 'finishedOrderCnt', 'rate'], result = [];
                for (let i = 0; i < row.length; i++) {
                    result[i] = dataList.map((col) => {
                        return col[row[i]]
                    })
                }
                let createdObj = {
                    orderCertDoubleCntSum,
                    finishedOrderCntSum,
                    sumRate,
                    xAxisData: dataList.map((col) => {
                        return col.month
                    }),
                    result
                }
                this.orderComplianceList = createdObj
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
            this.getComplianceOrder()
        }
    }
}
</script>
 
<style scoped lang="scss">
.compliance {
    .search-column {
        margin-bottom: 16px;
    }
}

.table-title-tips {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
    line-height: 22px;
    display: flex;
    margin-bottom: 16px;
}
</style>