<template>
    <div>
        <el-collapse v-model="activeNames">
             <el-collapse-item title="计费详情" name="1"> 
                <form-group v-if="dataList.orderFeeVo" :formGroup="formGroup.basicFormGroup" :formData="dataList.orderFeeVo"></form-group>
            </el-collapse-item>
            <el-collapse-item title="费用明细" name="2"> 
                <orderCostDetail v-if="dataList.expChargingParams" :dataList="dataList.expChargingParams" :originData="dataList" :orderType="20"></orderCostDetail>
            </el-collapse-item>
            <el-collapse-item title="修复计费记录" name="6" v-if="rpcRepairVolist&&rpcRepairVolist.length" >
                <basicRecord :rpcRepairVolist="rpcRepairVolist"></basicRecord>
            </el-collapse-item>
            <el-collapse-item title="乘客支付明细" name="3" v-if="passengerPayDetail&&passengerPayDetail.payRecord&&passengerPayDetail.payRecord.length">
                <costDetailInfo  :passengerPayDetail="passengerPayDetail"></costDetailInfo>
            </el-collapse-item>
            <el-collapse-item title="平台结算明细" name="4"  v-if="settleInfos&&settleInfos.length">
                <costDetailInfo :settleInfos="settleInfos"></costDetailInfo>
            </el-collapse-item>
            <el-collapse-item title="乘客退款明细" name="5" v-if="orderRefundDetails&&orderRefundDetails.length">
                <costDetailInfo :orderRefundDetails="orderRefundDetails"></costDetailInfo>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import orderCostDetail from '../../component/OrderCostDetail'
    import costDetailInfo from '../../component/CostDetailInfo'
    import formGroup from "../../component/FormGroup";
    import basicRecord from "../../component/BasicRecord";
    export default {
        name: 'formContent',
        props: ['dataList'],
        components:{
            orderCostDetail,
            costDetailInfo,
            formGroup,
            basicRecord
        },
        data() {
            return {
                activeNames: ["1","2","3","4","5","6"],
                expChargingParams: {}, //费用明细
                passengerFeeDetail: {},  //乘客支付明细
                orderRefundDetails: [], //乘客退款明细
                settleInfos: {}, //平台结算明细
                originData: {},
                rpcRepairVolist: [],// 修复计费记录
                formGroup: Object.freeze({
                    basicFormGroup: {
                        title: '',
                        width: 150,
                        attribute: [
                            {label: '计价模式', name: 'charingType', filters:'charingTypeFilters'},
                            {label: '计价金额', name: 'orderPrice', filters: 'regFenToYuan', unit: '元'},
                            {label: '乘客应付', name: 'passengerPrice', filters: 'regFenToYuan', unit: '元'},
                            {label: '乘客实付', name: 'passengerRealPrice', filters: 'regFenToYuan', unit: '元'},
                            {label: '司机应得', name: 'driverPrice', filters: 'regFenToYuan', unit: '元'},
                            {label: '司机实得', name: 'driverRealPrice', filters: 'regFenToYuan', unit: '元'},
                            {label: '渠道应得', name: 'channelPrice', filters: 'regFenToYuan', unit: '元'},
                            {label: '优惠金额', name: 'discountPrice', filters: 'regFenToYuan', unit: '元'},
                            {label: '平台收益', name: 'platformPrice', filters: 'regFenToYuan', unit: '元'},
                            {label: '平台净收益', name: 'platformTruePrice', filters: 'regFenToYuan', unit: '元'},

                        ]
                    }
            
                }),
            }
        },
        watch: {
            dataList: {
                handler(val) {
                    this.originData = val;
                    this.expChargingParams = val.expChargingParams || {};
                    this.passengerPayDetail = val.passengerPayDetail || {};
                    this.orderRefundDetails = val.orderRefundDetails || [];
                    this.settleInfos = val.settleInfos || [];
                    this.rpcRepairVolist = val.rpcRepairVolist || [];
                },
                immediate: true
            }
        },
    }
</script>