<template>
    <div>
        <template v-for="(data, index) in dataList">
            <el-collapse v-model="activeNames">
                <el-collapse-item :title="formGroup.passengerInfoFormGroup.title" :name="1 + index * 2">
                    <form-group :formGroup="formGroup.passengerInfoFormGroup" :formData="data"></form-group>
                </el-collapse-item>
                <template v-if="data.activitys && data.activitys.length">
                    <el-collapse-item title="优惠明细" :name="2 + index * 2">
                        <div class="content-table">
                            <table>
                                <thead>
                                    <tr>
                                        <td>活动名称</td>
                                        <td>优惠方式</td>
                                        <td>
                                            优惠金额
                                            <span class="small">（元）</span>
                                        </td>
                                        <td>
                                            优惠总金额
                                            <span class="small">（元）</span>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, i) in data.activitys" :key="i">
                                        <td>{{ item.activityName || '-' }}</td>
                                        <td>{{ item.couponsName || '-' }}</td>
                                        <td>{{ item.deductibleOfMoney | regFenToYuan }}</td>
                                        <td v-if="!i" :rowspan="data.activitys.length">{{ data.activityCountMoney | regFenToYuan }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </el-collapse-item>
                </template>
            </el-collapse>
        </template>
    </div>
</template>

<script>
import FormGroup from '../../component/FormGroup';

export default {
    components: { FormGroup },
    props: ['dataList'],
    data() {
        return {
            activeNames: Array.from(Array(this.dataList.length * 2), (v, k) => k + 1),
            formGroup: Object.freeze({
                passengerInfoFormGroup: {
                    title: '乘客订单信息',
                    width: 150,
                    attribute: [
                        { label: '乘客账号', name: 'passengerPhone' },
                        { label: '订单状态', name: 'statusStr' },
                        { label: '确认到达地点', name: 'realArriveDestinationAddr' },
                        { label: '确认到达时间', name: 'realArriveDestinationTime' },
                        { label: '乘客订单号', name: 'orderId' },
                        { label: '付款方式', name: 'payTypeStr' },
                        { label: '订单来源', name: 'senceType', filters: 'senceTypeFilters' },
                        { label: '预付款时间', name: 'payNotifyTime' },
                        { label: '预约出发时间', name: 'etdStartTime' },
                        { label: '乘客下单时间', name: 'createTime' },
                        { label: '预约成功时间', name: 'reserveSucessTime' },
                        { label: '完成时间', name: 'arriveDestinationTime' },
                        { label: '下单来源', name: 'passengerSysVersionAndPlatform' },
                        { label: '接单来源', name: 'driverSysVersionAndPlatform' },
                        { label: '订单类型', name: 'serviceTypeStr' },
                        { label: '商户订单号', name: 'outTradeNo' },
                        { label: '乘客发布起点', name: 'startAddr' },
                        { label: '乘车人数', name: 'purchaseSeatNum' },
                        { label: '乘客发布终点', name: 'endAddr' },
                        { label: '乘客订单总额', name: 'orderMoney', filters: 'regFenToYuan', unit: '元' },
                        { label: '乘客实际上车起点', name: 'passengerInCarAddr' },
                        { label: '乘客优惠总额', name: 'discountMoney', filters: 'regFenToYuan', unit: '元' },
                        { label: '乘客实际下车终点', name: 'arriveDestinationAddr' },
                        { label: '实付总额', name: 'realPayMoney', filters: 'regFenToYuan', unit: '元' }
                    ]
                }
            })
        };
    }
};
</script>

<style scoped>
.el-collapse {
    margin-bottom: 18px;
}
</style>
