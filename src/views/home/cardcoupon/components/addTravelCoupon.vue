<template>
    <el-form ref="basicInfo" label-position="right" label-width="8rem" :model="couponData" :rules="rules">
        <div class="currency-apply-title">申请详情</div>
        <el-row type="flex" justify="space-between" :gutter='40'>
            <el-col :span="8">
                <el-form-item prop="couponId" label="选择出行券：">
                    <el-select v-model="couponData.couponId" clearable filterable remote reserve-keyword placeholder="请选择出行券" @change="changeType" value-key="id" :remote-method="getTravelList">
                        <el-option v-for="item in travelList" :key="item.id" :label="item.couponsName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="addNum" label="补充数量：">
                    <el-input v-model.trim="couponData.addNum" maxlength='8' placeholder="请输入补充数量"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="showName" label="APP显示别名：">
                    <el-input v-model.trim="couponData.showName" :disabled='true'></el-input>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row type="flex" justify="space-between" :gutter='40'>
            <el-col :span="8">
                <el-form-item prop="totalNumber" label="总数量：">
                    <el-input v-model.trim="couponData.totalNumber" :disabled='true'></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="remainder" label="余量：">
                    <el-input v-model.trim="couponData.remainder" :disabled='true'></el-input>
                </el-form-item>
            </el-col>

            <el-col :span="8">
                <el-form-item prop="couponsType" label="出行券类型：">
                    <el-select v-model="couponData.couponsType" :disabled='true' style="width: 100%">
                        <el-option label="满减" value="1"></el-option>
                        <el-option label="立减" value="3"></el-option>
                        <el-option label="折扣" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" :gutter='40'>
            <el-col :span="8">
                <el-form-item v-show="couponData.couponsType == 1 || !couponData.couponsType" label="满减金额：">
                    <el-row type="flex" justify="space-between" :gutter='8'>
                        <el-col :span="12">
                            <el-form-item prop="amountLimitation">
                                <el-input v-model.trim="amountLimitation" maxlength="10" :disabled='true'></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="faceValue">
                                <el-input v-model.trim=" faceValue" maxlength="10" :disabled='true'></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item v-show="couponData.couponsType == 3" prop="faceValue" label="减免金额：">
                    <el-input v-model.trim="faceValue" maxlength="10" :disabled='true'></el-input>
                </el-form-item>

                <el-form-item v-show="couponData.couponsType == 2" label="折扣金额：">
                    <el-row type="flex" justify="space-between" :gutter='8'>
                        <el-col :span="12">
                            <el-form-item prop="faceValue">
                                <el-input v-model.trim="faceValue" maxlength="10" placeholder="请输入折扣0.00-10.00" :disabled='true'></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="amountLimitation">
                                <el-input v-model.trim="amountLimitation" maxlength="10" :disabled='true'></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-col>

            <el-col :span="8" :gutter='40'>
                <el-form-item prop="couponsPeriodType" label="有效日期：">
                    <el-select v-model="couponData.couponsPeriodType" placeholder="请选择有效日期" style="width: 100%" :disabled='true'>
                        <el-option label="固定周期有限" value="2"></el-option>
                        <el-option label="领券后周期内有效" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="8">
                <el-form-item prop="validDay" v-if="couponData.couponsPeriodType == 1" label="生效周期：">
                    <el-input v-model.trim="couponData.validDay" :disabled='true' placeholder="请输入领券后有效周期"></el-input>
                </el-form-item>
                <el-form-item v-else prop="pickerDate" label="有效时间：">
                    <el-date-picker v-model="couponData.pickerDate" :disabled='true' :picker-options="pickerOptions" style="width: 100%" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" :gutter='40'>
            <el-col :span="8">
                <el-form-item prop="pickerTime" label="可用时段：">
                    <el-time-picker v-model="couponData.pickerTime" :disabled='true' style="width: 100%" is-range value-format="HH:mm" format="HH:mm" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="ifAllBusiness" label="适用业务：">
                    <el-select v-model="couponData.ifAllBusiness" placeholder="请选择适用业务" :disabled='true' style="width: 100%">
                        <el-option label="全部业务" value="1"></el-option>
                        <el-option label="部分业务" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <!-- // 内容在OA 6.4版本中同步过，6.4 在11.3号上线，此内容11.8号上线，所以注释 -->
            <el-col :span="8">
                <el-form-item prop="availableChannel" label="可用渠道：">
                    <el-select v-model="couponData.availableChannel" placeholder="请选择可用渠道" :disabled='true' style="width: 100%">
                        <el-option label="不限" value="0"></el-option>
                        <el-option label="APP" value="1"></el-option>
                        <el-option label="小程序" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" :gutter='40'>
            <el-col :span="8">
                <el-form-item prop="availableChannel" label="适用城市：">
                    <el-select v-model="couponData.useCity" placeholder="请选择适用城市" :disabled='true' style="width: 100%">
                        <el-option label="不限" value="0"></el-option>
                        <el-option label="活动城市可用" value="1"></el-option>
                        <el-option label="领券城市可用" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-col></el-row>
        <el-row v-if="couponData.ifAllBusiness === '0'" type="flex" justify="space-between">
            <el-col :span="24">
                <el-form-item label="选择业务：" prop="serviceId">
                    <el-checkbox-group v-model="couponData.serviceId" :disabled='true'>
                        <el-checkbox label="1">网约车</el-checkbox>
                        <el-checkbox label="2">顺风车</el-checkbox>
                        <el-checkbox label="3">货运</el-checkbox>
                        <el-checkbox label="4">代驾</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row v-if="couponData.serviceId.includes('1')&&couponData.ifAllBusiness === '0'" type="flex" justify="space-between">
            <el-col :span="24">
                <el-form-item prop="serviceCar" label="适用车型：">
                    <el-checkbox-group v-model="couponData.serviceCar" :disabled='true'>
                        <el-checkbox label="10">快车</el-checkbox>
                        <el-checkbox label="20">专车</el-checkbox>
                        <el-checkbox label="30">豪华车</el-checkbox>
                        <el-checkbox label="40">商务车</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row v-if="couponData.serviceId.includes('1')&&couponData.ifAllBusiness === '0'" type="flex" justify="space-between">
            <el-col :span="24">
                <el-form-item prop="serviceOrder" label="适用订单：">
                    <el-checkbox-group v-model="couponData.serviceOrder" :disabled='true'>
                        <el-checkbox label="20">实时单</el-checkbox>
                        <el-checkbox label="22">扫码单</el-checkbox>
                        <el-checkbox label="21">预约单</el-checkbox>
                        <el-checkbox label="70">包车单</el-checkbox>
                        <el-checkbox label="40">拼车单</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
export default {
    data() {
        return {
            travelList: [],
            travelItem: {},
            couponData: {
                couponId: '',
                addNum: '',
                couponsName: '',
                showName: '',
                totalNumber: '',
                couponsType: '',
                faceValue: '',
                availableChannel:'', //可用渠道
                amountLimitation: '',
                couponsPeriodType: '',
                validDay: '',
                pickerDate: [],
                pickerTime: [],
                ifAllBusiness: '',
                serviceId: [],
                serviceCar: [],
                serviceOrder: [],
                remainder: '',
                useCity:'',
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                },
            },
            rules: {
                couponId: [{ required: true, message: '请选择出行券', trigger: 'blur' }],
                addNum: [
                    { required: true, message: '请输入补充数量', trigger: 'blur' },
                    {
                        pattern: this.$regexList.get('int1-10000000'),
                        message: '请输入1-10000000（1000万）',
                        trigger: 'blur',
                    },
                ],
            },
            faceValue: '',
            amountLimitation: '',
        };
    },

    watch: {
        couponData: {
            handler: function (newVal) {
                this.$emit('changeVal', newVal);
            },
            deep: true,
        },
    },

    created() {
        this.getTravelList();
    },

    methods: {
        //查询出行券接口
        getTravelList(data) {
            const opt = {
                data: { couponsName: data },
                op: 'listTravelCoupon',
            };
            this.$axios('/cardcoupon/applyTravelCoupon/listTravelCoupon', opt).then(res => {
                let list = JSON.parse(res.data).data;
                this.travelList = list;
            });
        },
        changeType(val) {
            if (val) {
                this.travelItem = this.travelList.filter(item => {
                    return item.id == val;
                })[0];
                this.faceValue = (this.travelItem.faceValue / 100).toFixed(2);
                this.amountLimitation = (this.travelItem.amountLimitation / 100).toFixed(2);
                this.travelItem.couponsType = this.travelItem.couponsType + '';
                this.travelItem.couponsPeriodType = this.travelItem.couponsPeriodType + '';
                if (this.travelItem.ifAllBusiness != null) {
                    this.travelItem.ifAllBusiness = this.travelItem.ifAllBusiness + '';
                } else {
                    this.travelItem.ifAllBusiness = '';
                }
                if (this.travelItem.effectiveStartTime == null) {
                    this.travelItem.effectiveStartTime = '';
                    this.travelItem.effectiveEndTime = '';
                }
                if (this.travelItem.availableStartTime == null) {
                    this.travelItem.availableStartTime = '';
                    this.travelItem.availableEndTime = '';
                }
                if (this.travelItem.couponsPeriodType == 0) {
                    this.travelItem.couponsPeriodType = '';
                }
                if (this.travelItem.availableChannel == null) {
                    this.travelItem.availableChannel = '';
                }
                if (this.travelItem.useCity == null) {
                    this.travelItem.useCity = '';
                }else{
                    this.travelItem.useCity=this.travelItem.useCity.toString()
                }
                this.travelItem.ifAllBusiness = this.travelItem.ifAllBusiness + '';
                this.travelItem.availableChannel = this.travelItem.availableChannel + '';
                this.couponData = {
                    ...this.travelItem,
                    pickerDate: [this.travelItem.effectiveStartTime, this.travelItem.effectiveEndTime],
                    pickerTime: [this.travelItem.availableStartTime, this.travelItem.availableEndTime],
                };
                this.couponData.couponId = this.travelItem.id;
                if (this.couponData.ifAllBusiness === '0') {
                    this.couponData.serviceId = this.travelItem.serviceId.split(',');
                }
                if (this.couponData.serviceId.includes('1') && this.couponData.ifAllBusiness === '0') {
                    this.couponData.serviceCar = this.travelItem.serviceCar.split(',');
                    this.couponData.serviceOrder = this.travelItem.serviceOrder.split(',');
                }
            } else {
                this.$refs['basicInfo'].resetFields();
                this.faceValue = '';
                this.amountLimitation = '';
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.currency-apply-title {
    width: 80px;
    height: 28px;
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 16px;
    margin-top: 32px;
}
.el-checkbox {
    width: 100px;
}
.el-select {
    width: 100%;
}
/deep/.el-range-editor.is-disabled input {
    color: #303133;
}
</style>
