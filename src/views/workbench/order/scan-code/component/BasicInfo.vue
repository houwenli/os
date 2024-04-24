<template>
    <div >
        <el-collapse v-model="activeNames">
            <el-collapse-item :title="formGroup.basicFormGroup.title" name="1">
                <form-group  :formGroup="formGroup.basicFormGroup" :formData="originData"></form-group>
            </el-collapse-item>
            <el-collapse-item :title="formGroup.driverInfoFormGroup.title" name="3">
                <form-group  :formGroup="formGroup.driverInfoFormGroup" :formData="originData"></form-group>
            </el-collapse-item>
            <el-collapse-item :title="formGroup.realRideInfoFormGroup.title" name="2">
                <form-group v-if="dataList&&dataList.realRideInfoVo"  :formGroup="formGroup.realRideInfoFormGroup" :formData="dataList.realRideInfoVo"></form-group>
            </el-collapse-item>
            <el-collapse-item v-if="endAddrList&&endAddrList.length" title="修改终点记录" name="4">
                <basicRecord :endAddrList="endAddrList"></basicRecord>
            </el-collapse-item>
            <el-collapse-item title="行程录音" name="6">
                <itineraryRecording :type="3"></itineraryRecording>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
    import {mapGetters,mapActions} from 'vuex'
    import basicRecord from "../../component/BasicRecord";
    import formGroup from "../../component/FormGroup";
    import evaluateInfo from "../../component/EvaluateInfo";
    import itineraryRecording from "../../component/ItineraryRecording";
    export default {
        name: 'formContent',
        components: {
            basicRecord,
            formGroup,
            evaluateInfo,
            itineraryRecording
        },
        props: ['dataList'],
        data() {
            return {
                originData:{},
                endAddrList: [],
                rpcRepairVolist: [],
                activeNames: ["1","2","3","4","5","6"],
                formGroup: Object.freeze({
                    basicFormGroup: {
                        title: '乘客信息',
                        width: 150,
                        attribute: [
                            {label: '订单号', name: 'orderId'},
                            {label: '订单状态', name: 'statusName'},
                            {label: '实际乘车人手机号', name: 'contactPhone'},
                            {label: '实际乘车人姓名', name: 'passengerName'},
                            {label: '订单风险', name: 'orderServiceSt'},
                            {label: '订单包干类型', name: 'orderVipType', filters: 'orderVipTypeFilters'},
                            {label: '订单服务类型', name: 'requestRideType'},  //   下单车型
                            {label: '下单时间', name: 'downOrderTime'},
                            {label: '下单地点', name: 'downOrderPlace'},
                            {label: '订单起点城市', name: 'startCityName'},
                            {label: '订单终点城市', name: 'endCityName'},
                            {label: '订单起点', name: 'startOrder'},
                            {label: '订单终点', name: 'endOrder'},
                            {label: '预估里程', name: 'estimateDistance', filters: 'regRiceToKm', unit: '公里'},
                            {label: '预估时长', name: 'estimateTime', filters: 'regSecondToMinute', unit: '分钟'},
                            { label: '下单来源', name: 'passengerSysVersionAndPlatform' },
                            { label: '接单来源', name: 'driverSysVersionAndPlatform' },
                            {label: '下单渠道商(ID)', name: 'loginChannelStr'},
                            {label: '渠道名称', name: 'channelName'},
                            {label: '渠道ID', name: 'channel'},
                            {label: '渠道类型', name: 'channelType', filters: 'channelTypesFilters'},
                            {label: '乘客注册渠道商(ID)', name: 'registerChannelStr'},
                            {label: '推荐渠道商(ID)', name: 'recommendChannelStr'},
                            {label: '乘客设备序列号', name: 'passengerDeviceId'},
                            // {label: '乘客账号', name: 'passengerPhone'},
                            // {label: '下单人电话', name: 'appUserPhone'},
                            // {label: '合作商订单号', name: 'apOrderId'},
                            {label: '是否戴口罩', name: 'isWearMask', filters: 'wearMaskFilters'},
                        ]
                    },
                    driverInfoFormGroup:{
                        title:'车主信息',
                        width:150,
                        attribute: [
                            { label: '车主ID', name: 'driverId' },
                            {label: '车主账号', name: 'driverPhone'},
                            {label: '车主姓名', name: 'driverName'},
                            {label: '车牌号码', name: 'carNum'},
                            {label: '运力服务类型', name: 'dispatchRideType', filters: 'businessTypeFilters'}, // 实际司机车型
                            {
                                label: '系统合规类型',
                                name: 'driverLevel',
                                filters: 'operationManagementFilters'
                            },
                            {label: '合伙人类型', name: 'partnerType', filters: 'partnerTapeFilters'},
                            {label: '包干类型', name: 'vip', filters: 'vipFilters'},
                            {label: '所属机构', name: 'orgName'},
                            {label: '所属运力商', name: 'rideChannelName'},
                            {label: '车主设备序列号', name: 'driverDeviceId'}
                        ]
                    },
                    realRideInfoFormGroup: {
                        title: '行程信息',
                        width: 150,
                        attribute: [
                            {label: '接单地点', name: 'robAddress'},
                            {label: '接单时间', name: 'receivedOrderTime'},
                            {label: '到达上车地点', name: 'arriveAddress'},
                            {label: '到达上车地点时间', name: 'arriveAddressTime'},
                            {label: '空驶接客里程', name: 'emptyMileage', filters: 'regRiceToKm', unit: '公里',},
                            {label: '空驶接客时长', name: 'emptyTime', filters: 'regSecondToMinute', unit: '分钟',},

                            {label: '开始行程地点', name: 'startTravelAddress'},
                            {label: '开始行程时间', name: 'startTravelTime'},
                            {label: '结束行程地点', name: 'endTravelAddress'},
                            {label: '结束行程时间', name: 'endTravelTime'},

                            {label: '确认费用时间', name: 'confirmPayTime'},
                            {label: '完成支付时间', name: 'payTime'},
                            {label: '载客里程', name: 'mileage', filters: 'regRiceToKm', unit: '公里'},
                            {label: '载客时长', name: 'rideTime', filters: 'regSecondToMinute', unit: '分钟',},
                            // {label: '是否偏航', name: 'isYaw', filters:'isRepairFilters'},
                            // {label: '偏航数值', name: 'yawValue',filters: 'regRiceToKm', unit: '公里'},
                            // {label: '里程修复', name: 'isRepair', filters: 'isRepairFilters'},
                            // {label: '修复后里程数', name: 'repairMileage', filters: 'regRiceToKm', unit: '公里'},
                            {label: '取消订单时间', name: 'cancelTime'},
                            {label: '取消类型', name: 'cancelStatus'},
                            {label: '取消操作人', name: 'updateUserName'},
                            {label: '取消原因', name: 'cancelReasonMark'},
                        ]
                    },
                })
            }
        },
        watch: {
            dataList: {
                handler(val) {
                    this.originData = Object.assign(val.orderBasisInfoVo,val.orderEstimateVo);
                    this.endAddrList = val.endAddrList || [];
                    this.rpcRepairVolist = {...val.orderEstimateVo} || {};
                },
                immediate: true
            }
        },
    }
</script>
