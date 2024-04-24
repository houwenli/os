<template>
    <div class="__approval_field_wrap_container">
        <div class="block_container">
            <el-form label-position="right" label-width="170px" ref="el-form">
                <div class="block_item_container">
                    <span class="block_item_title">审批发起信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="审批编号：">{{ dataObject.procdefNo }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="审批类型：">{{ dataObject.name }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="发起时间：">{{ dataObject.startTime || '' }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="发起人：">{{ dataObject.startUserName }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="block_item_container">
                    <span class="block_item_title">订单基础信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="订单号：">{{ nodeForm.exceptionOrderBaseInfoVo.orderId }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="订单服务类型：">{{ nodeForm.exceptionOrderBaseInfoVo.requestRideType }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="订单包干类型：">{{ nodeForm.exceptionOrderBaseInfoVo.orderVipType==0?'收取平台费':'包干' }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="订单状态：">{{ nodeForm.exceptionOrderBaseInfoVo.orderStatusName }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="载客里程：">{{ $baseMethod.regRiceToKm(nodeForm.exceptionOrderBaseInfoVo.mileage)}}公里</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="载客时长：">{{ $baseMethod.regSecondToMinute(nodeForm.exceptionOrderBaseInfoVo.rideTime)}}分钟</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="下单时间：">{{ nodeForm.exceptionOrderBaseInfoVo.downOrderTime }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="完成支付时间：">{{ nodeForm.exceptionOrderBaseInfoVo.payTime }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="司机ID：">{{ nodeForm.exceptionOrderBaseInfoVo.driverId }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="司机手机号：">{{ nodeForm.exceptionOrderBaseInfoVo.driverPhone }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="司机姓名：">{{ nodeForm.exceptionOrderBaseInfoVo.driverName }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="车牌号码：">{{ nodeForm.exceptionOrderBaseInfoVo.carNum }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="所属机构：">{{ nodeForm.exceptionOrderBaseInfoVo.orgName }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="乘客手机号：">{{ nodeForm.exceptionOrderBaseInfoVo.passengerPhone }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="block_item_container">
                    <span class="block_item_title">乘客支付记录</span>
                    <el-table :cell-style='{padding:"3px"}' :data="nodeForm.passengerPayRecords" style="width: 100%;margin:16px 0;" :border="true" :header-cell-style="headerStyle">
                        <el-table-column label="支付时间" prop='notifyTime'></el-table-column>
                        <el-table-column label="支付类型" prop='payTypeName'></el-table-column>
                        <el-table-column label="支付方式" prop='payWayName'></el-table-column>
                        <el-table-column label="商户订单号">
                            <template slot-scope="scope">
                                <span>{{scope.row.outTradeNo||'--'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="交易订单号">
                            <template slot-scope="scope">
                                <span>{{scope.row.tradeNo||'--'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="第三方支付金额(元)">
                            <template slot-scope="scope">
                                <span>{{scope.row.orderPrice?$baseMethod.regFenToYuan(scope.row.orderPrice):'--'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="余额支付金额(元)">
                            <template slot-scope="scope">
                                <span>{{scope.row.balanceMoney||'--'}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="block_item_container">
                    <span class="block_item_title">支付异常信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item class='red' label="异常类型：">{{ nodeForm.exceptionOrderMoneyDetail.exceptionStatusName}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="订单金额(元)：">{{$baseMethod.regFenToYuan(nodeForm.exceptionOrderMoneyDetail.orderPrice)}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="减免金额(元)：">{{$baseMethod.regFenToYuan(nodeForm.exceptionOrderMoneyDetail.derateMoney)}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="优惠金额(元)：">{{ $baseMethod.regFenToYuan( nodeForm.exceptionOrderMoneyDetail.discountPrice)}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="乘客应付金额(元)：">{{$baseMethod.regFenToYuan(nodeForm.exceptionOrderMoneyDetail.payablePrice)}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="预付款金额(元)：">{{$baseMethod.regFenToYuan(nodeForm.exceptionOrderMoneyDetail.orderPrePayRecord)}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="乘客实付金额(元)：">{{$baseMethod.regFenToYuan(nodeForm.exceptionOrderMoneyDetail.realPayPrice)}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="第三方支付金额(元)：">{{$baseMethod.regFenToYuan(nodeForm.exceptionOrderMoneyDetail.passengerPay)}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="余额支付金额(元)：">{{$baseMethod.regFenToYuan(nodeForm.exceptionOrderMoneyDetail.balanceMoney)}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="对账差异金额(元)：">{{$baseMethod.regFenToYuan(nodeForm.exceptionOrderMoneyDetail.checkDifferenceMoney)}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="司机应入账金额(元)：">{{$baseMethod.regFenToYuan(nodeForm.exceptionOrderMoneyDetail.driverIncome)}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="司机实际入账金额(元)：">{{$baseMethod.regFenToYuan(nodeForm.exceptionOrderMoneyDetail.driverActualIncome)}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="平台佣金(元)：">{{$baseMethod.regFenToYuan(nodeForm.exceptionOrderMoneyDetail.platformChargeMoney)}}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="block_item_container">
                    <span class="block_item_title">处理结果</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="处理方式：">{{nodeForm.exceptionOrderBaseInfoVo.processTypeNameStr }}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if='nodeForm.exceptionOrderMoneyDetail.exceptionStatus!==12'>
                            <el-form-item label="退款方式：">{{nodeForm.exceptionOrderMoneyDetail.dealMethod==0?'退回支付方式':'退回余额' }}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-else>
                            <el-form-item label="补款方式：">{{nodeForm.exceptionOrderMoneyDetail.compensateMethod==0?'补款到余额':''}}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if='nodeForm.exceptionOrderMoneyDetail.exceptionStatus==12'>
                            <el-form-item label="司机补款金额(元)：">{{$baseMethod.regFenToYuan(nodeForm.exceptionOrderMoneyDetail.compensateMoney)}}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if='nodeForm.exceptionOrderMoneyDetail.exceptionStatus==12||nodeForm.exceptionOrderMoneyDetail.exceptionStatus==13'>
                            <el-form-item label="订单里程(公里)：">{{$baseMethod.regRiceToKm(nodeForm.exceptionOrderBaseInfoVo.mileage)}}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if='nodeForm.exceptionOrderMoneyDetail.exceptionStatus==12||nodeForm.exceptionOrderMoneyDetail.exceptionStatus==13'>
                            <el-form-item label="修正里程(公里)：">{{$baseMethod.regRiceToKm(nodeForm.exceptionOrderMoneyDetail.modifyMileage)}}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if='nodeForm.exceptionOrderMoneyDetail.exceptionStatus!==12'>
                            <el-form-item label="乘客退款金额(元)：">{{$baseMethod.regFenToYuan( nodeForm.exceptionOrderMoneyDetail.passengerRefund)}}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if='nodeForm.exceptionOrderMoneyDetail.exceptionStatus!==12'>
                            <el-form-item label="司机扣除金额(元)：">{{$baseMethod.regFenToYuan(nodeForm.exceptionOrderMoneyDetail.driverDeduct)}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="备注：">{{ nodeForm.exceptionOrderBaseInfoVo.processSuggest }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>

            </el-form>
        </div>
    </div>
</template>

<script>
import BaseInfo from './base/approvalInfo.vue';
export default {
    //离职审批
    name: 'errorOrderApproval',
    components: { BaseInfo },
    props: {
        nodeFormJson: {
            type: Object,
            default: () => {},
        },
        dataObject: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        nodeForm() {
            return JSON.parse(this.dataObject.nodeFormJson).exceptionOrderProcessInfo;
        },
    },
    data() {
        return {
            headerStyle: {
                background: '#F5F7FA',
                'font-family': 'PingFangSC-Medium, PingFang SC',
                'font-weight': '600',
                color: '#606266',
            },
        };
    },
    mounted() {
        console.log(this.dataObject);
    },
};
</script>

<style lang="scss" scoped>
.el-table {
    border-radius: 10px;
}
.red {
    color: rgb(253, 32, 32);
}
</style>
