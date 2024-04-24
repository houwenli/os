<template>
    <div class="content-table">
        <table  v-if="passengerPayDetail">   <!-- 乘客支付明细 -->
           <thead>
            <tr>
                <td>支付类型</td>
                <td>支付方式</td>
                <td>完成支付时间</td>
                <td>商户订单号</td>
                <td>交易订单号</td>
                <td>支付金额（元）</td>
            </tr>
            </thead>
            <tbody>
                <template v-if="passengerPayDetail.payRecord">
                    <tr v-for="(item,index) in passengerPayDetail.payRecord" :key="'psf'+index">
                    <td>{{item.scene | passengerPayScenFilters}}</td>
                     <td v-if="orderType && item.scene != 26">{{item.payType | payStaticFilters}}</td>
                    <td v-else>{{item.payType | payTypeFilters}}</td>
                    <td>{{item.notifyTime}}</td>
                    <td>{{item.outTradeNo || '-'}}</td>
                    <td>{{item.tradeNo || '-'}}</td>
                    <td>{{item.orderPrice | regFenToYuan}}</td>
                </tr>
                </template>
                <template v-if="passengerPayDetail.activitys">
                    <tr v-for="(item,index) in passengerPayDetail.activitys" :key="'psp'+index">
                        <td >{{item.activityType | activityTypeFilters }}</td>
                        <td colspan="2">{{item.activityName||'-'}}</td>
                        <td colspan="2">{{item.couponsName||'-'}}</td>
                        <td>-{{item.deductibleOfMoney | regFenToYuan}}</td>
                    </tr>
                </template>
            </tbody>
        </table>
        <table v-if="settleInfos">  <!-- 平台结算明细 -->
           <thead>
            <tr>
                <td>结算类型</td>
                <td>结算金额（元）</td>
                <td>结算时间</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in settleInfos" :key="'settl'+index">
                <td v-if="item.PaySerialType!=2">{{item.settleType | settleTypesFilters}}</td>
                <td v-else>包车车费-退款</td>
                <td>{{item.PaySerialType!=2?'':'-'}}{{item.settlePrice | regFenToYuan}}</td>
                <td>{{item.settleTime}}</td>
            </tr>
            </tbody>
        </table>
        <table v-if="orderRefundDetails">  <!-- 乘客退款明细 -->
           <thead>
            <tr>
                <td>退款申请时间</td>
                <!-- <td>退款类型</td> -->
                <td>退款金额（元）</td>
                <td>退款状态</td>
                <td>退款成功时间</td>
                <td>退款商户订单号</td>
                <!-- <td>退款订单号</td> -->
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in orderRefundDetails" :key="'ord'+index">
                <td>{{item.createTime}}</td>
                <!-- <td>{{item.refundType | passengerRefundTypeFilters}}</td> -->
                <td>{{item.orderPrice | regFenToYuan}}</td>
                <td>{{item.status | passengerRefundStateFilters}}</td>
                <td>{{item.refundTime || '-'}}</td>
                <td>{{item.outTradeNo || '-'}}</td>
                <!-- <td>{{item.refundTradeNo || '-'}}</td> -->
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
export default {
    props:['passengerPayDetail','settleInfos','orderRefundDetails','orderType'],
}
</script>