<template>
    <div>
        <el-collapse v-model="activeNames">
            <el-collapse-item :title="formGroup.driverInfoFormGroup.title" name="1">
                <form-group :formGroup="formGroup.driverInfoFormGroup" :formData="dataList"></form-group>
            </el-collapse-item>
            <el-collapse-item :title="formGroup.driverOrderFormGroup.title" name="2">
                <form-group :formGroup="formGroup.driverOrderFormGroup" :formData="dataList"></form-group>
            </el-collapse-item>
            <!-- <el-collapse-item title="行程录音" name="3">
                 <audio class="trip-record" controls v-for="item of audioSrc" :key="item">
                    <source :src="item" type="audio/ogg">
                    <source :src="item" type="audio/mpeg">
                </audio>
            </el-collapse-item> -->
            <el-collapse-item title="行程录音" name="3">
                <itineraryRecording :orderId="dataList.orderId" :type="4"></itineraryRecording> 
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    import FormGroup from "../../component/FormGroup";
    import itineraryRecording from "../../component/ItineraryRecording";
    export default {
        components: {
            FormGroup,
            itineraryRecording
        },
        props: ['dataList'],
        data(){
            return {
                activeNames: ["1","2","3"],
                formGroup: Object.freeze({
                    driverInfoFormGroup: {
                        title: '司机信息',
                        width: 150,
                        attribute: [
                            {label: '车主账号', name: 'phone'},
                            {label: '所属机构', name: 'organizationName'},
                            {label: '车主ID', name: 'driverId'},
                            {label: '车主姓名', name: 'name'},
                            {label: '车辆类型', name: 'seatNum', unit: '座'},
                            {label: '车牌号码', name: 'carNum'},
                            {label: '注册城市', name: 'registerCity'},
                            {label: '车主类型', name: 'partnerType', filters: 'motorcycleOwnerFilters'},
                            {label: '包干类型', name: 'vip', filters: 'contractFilters'},
                            {
                                label: '系统合规类型',
                                name: 'driverLevel',
                                filters: 'operationManagementFilters' 
                            },
                        ]
                    },
                    driverOrderFormGroup: {
                        title: '订单信息',
                        width: 150,
                        attribute: [
                            {label: '订单号', name: 'orderId'},
                            {label: '里程数', name: 'mileage', filters: 'regRiceToKm'},
                            {label: '订单发布时间', name: 'createTime'},
                            {label: '发布座位数', name: 'releaseSeatNum'},
                            {label: '订单类型', name: 'serviceTypeStr'},
                            {label: '实际卖座位数', name: 'sellSeatNum'},
                            {label: '发布起点', name: 'startAddr'},
                            {label: '行程单价/人', name: 'seatMoney', filters: 'regFenToYuan'},
                            {label: '发布终点', name: 'endAddr'},
                            {label: '预计订单总额', name: 'estimateOrderMoney', filters: 'regFenToYuan'},
                            {label: '实际起点', name: 'startTravelAddr'},
                            {label: '实际订单总额', name: 'orderMoney', filters: 'regFenToYuan'},
                            {label: '实际终点', name: 'endTravelAddr'},
                            {label: '乘客优惠总额', name: 'discountMoney', filters: 'regFenToYuan'},
                            {label: '订单状态', name: 'statusStr'},
                            {label: '保险单价', name: 'insuranceUnitPrice', filters: 'regFenToYuan'},
                            {label: '计划出发时间', name: 'etdStartTime'},
                            {label: '实际出发时间', name: 'startTravelTime'},
                            {label: '保险费总额', name: 'insuranceMoney', filters: 'regFenToYuan'},
                            {label: '结束行程时间', name: 'endTravelTime'},
                            {label: '实付总额', name: 'actualMoney', filters: 'regFenToYuan'},
                            {label: '司机所得金额', name: 'driverIncome', filters: 'regFenToYuan'},
                        ]
                    },
                }),
                audioSrc: [],
            }
        },
        methods: {
			getModuleUrl(op) {
                return this.$getModuleUrl(this.moduleName, op);
            },
			getVoiceUrl(fileIdList) {
                const url = this.getModuleUrl('playSoundRecord');
                const reqData = {
                    data: { soundRecordingFileIdList: fileIdList },
                    op: 'playSoundRecord',
                };
                this.$axios(url, reqData).then(res => {
                    this.audioSrc = res.data;
                }).catch(err => {
                    this.audioSrc = [];
                });
            },
		},
		mounted() {
            // this.getVoiceUrl(this.dataList.soundRecordingFileIdList || []);
        },
    }
</script>

<style scoped>

</style>
