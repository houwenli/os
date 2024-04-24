<template>
    <el-form ref="basicInfo" label-position="right" label-width="8rem" :model="couponData" :rules="rules">
        <div class="currency-apply-title">基本信息</div>
        <el-row type="flex" justify="space-between" :gutter="40">
            <el-col :span="8">
                <el-form-item prop="couponsName" label="名称：">
                    <el-input v-model.trim="couponData.couponsName" maxlength="30" placeholder="请输入出行券名称"></el-input>
                </el-form-item>
            </el-col>

            <el-col :span="8">
                <el-form-item prop="showName" label="APP显示别名：">
                    <el-input v-model.trim="couponData.showName" maxlength="30" placeholder="请输入APP显示别名"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="totalNumber" label="总数量：">
                    <el-input v-model.trim="couponData.totalNumber" maxlength="8" placeholder="请输入总数量"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" :gutter="40">
            <el-col :span="8">
                <el-form-item prop="couponsType" label="出行券类型：">
                    <el-select @change="couponsTypeChange(couponData.couponsType)" v-model="couponData.couponsType" placeholder="请选择出行券类型" style="width: 100%">
                        <el-option label="满减" value="1"></el-option>
                        <el-option label="立减" value="3"></el-option>
                        <el-option label="折扣" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="8">
                <el-form-item v-show="couponData.couponsType == 1 || !couponData.couponsType" label="满减金额：" required>
                    <el-row type="flex" justify="space-between" :gutter="8">
                        <el-col :span="12">
                            <el-form-item prop="amountLimitation">
                                <el-input v-model.trim="couponData.amountLimitation" maxlength="9" placeholder="请输入满减金额"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="faceValue">
                                <el-input v-model.trim="couponData.faceValue" maxlength="9" placeholder="请输入减免金额"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item v-show="couponData.couponsType == 3" prop="faceValue" label="减免金额：">
                    <el-input v-model.trim="couponData.faceValue" maxlength="9" placeholder="请输入优惠金额"></el-input>
                </el-form-item>

                <el-form-item v-show="couponData.couponsType == 2" label="折扣金额：" required>
                    <el-row type="flex" justify="space-between" :gutter="8">
                        <el-col :span="12">
                            <el-form-item prop="faceValue">
                                <el-input v-model.trim="couponData.faceValue" maxlength="5" placeholder="请输入折扣0.00-10.00"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="amountLimitation">
                                <el-input v-model.trim="couponData.amountLimitation" maxlength="9" placeholder="请输入最高减免金额"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="advancedConfig" label="高级配置：">
                    <el-select v-model="couponData.advancedConfig" style="width: 100%">
                        <el-option label="不配置" value="0"></el-option>
                        <el-option label="配置" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" v-if="couponData.advancedConfig == '1'" :gutter="40">
            <el-col :span="8">
                <el-form-item prop="couponsPeriodType" label="有效日期：">
                    <el-select @change="handlePeriodType" v-model="couponData.couponsPeriodType" placeholder="请选择有效日期" style="width: 100%">
                        <el-option label="固定周期有效" value="2"></el-option>
                        <el-option label="领券后周期内有效" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="validDay" v-if="couponData.couponsPeriodType == 1" label="生效周期：">
                    <el-input v-model.trim="couponData.validDay" maxlength="3" placeholder="请输入领券后有效周期"></el-input>
                </el-form-item>
                <el-form-item v-else prop="pickerDate" label="有效时间：">
                    <el-date-picker
                        v-model="couponData.pickerDate"
                        :picker-options="pickerOptions"
                        style="width: 100%"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    ></el-date-picker>
                </el-form-item>
            </el-col>

            <el-col :span="8">
                <el-form-item prop="pickerTime" label="可用时段：">
                    <el-time-picker
                        v-model="couponData.pickerTime"
                        style="width: 100%"
                        is-range
                        value-format="HH:mm"
                        format="HH:mm"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        placeholder="选择时间范围"
                    ></el-time-picker>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" v-if="couponData.advancedConfig == '1'" :gutter="40">
            <el-col :span="8">
                <el-form-item prop="ifAllBusiness" label="适用业务：">
                    <el-select v-model="couponData.ifAllBusiness" @change="changeBusiness" placeholder="请选择适用业务" style="width: 100%">
                        <el-option label="全部业务" value="1"></el-option>
                        <el-option label="部分业务" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <!-- // 内容在OA 6.4版本中同步过，6.4 在11.3号上线，此内容11.8号上线，所以注释 -->
            <el-col :span="8">
                <el-form-item prop="availableChannel" label="可用渠道：">
                    <el-select v-model="couponData.availableChannel" placeholder="请选择可用渠道" style="width: 100%">
                        <el-option label="不限" value="0"></el-option>
                        <el-option label="APP" value="1"></el-option>
                        <el-option label="小程序" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="useCity" label="适用城市：">
                    <el-select v-model="couponData.useCity" placeholder="请选择适用城市" style="width: 100%">
                        <el-option label="不限" value="0"></el-option>
                        <el-option label="活动城市可用" value="1"></el-option>
                        <el-option label="领券城市可用" value="2"></el-option>
                    </el-select>
                </el-form-item></el-col>
        </el-row>
        <el-row v-if="couponData.ifAllBusiness === '0' && couponData.advancedConfig == '1'" type="flex" justify="space-between">
            <el-col :span="24">
                <el-form-item label="选择业务：" prop="serviceId">
                    <el-checkbox-group v-model="couponData.serviceId" @change="changeSeviceId">
                        <el-checkbox label="1">网约车</el-checkbox>
                        <el-checkbox label="2">顺风车</el-checkbox>
                        <el-checkbox label="3">货运</el-checkbox>
                        <el-checkbox label="4">代驾</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row v-if="couponData.serviceId.includes('1') && couponData.ifAllBusiness === '0' && couponData.advancedConfig == '1'" type="flex" justify="space-between">
            <el-col :span="24">
                <el-form-item prop="serviceCar" label="适用车型：">
                    <el-checkbox-group v-model="couponData.serviceCar">
                        <el-checkbox label="10">快车</el-checkbox>
                        <el-checkbox label="20">专车</el-checkbox>
                        <el-checkbox label="30">豪华车</el-checkbox>
                        <el-checkbox label="40">商务车</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row v-if="couponData.serviceId.includes('1') && couponData.ifAllBusiness === '0' && couponData.advancedConfig == '1'" type="flex" justify="space-between">
            <el-col :span="24">
                <el-form-item prop="serviceOrder" label="适用订单：">
                    <el-checkbox-group v-model="couponData.serviceOrder">
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
            couponData: {
                couponsName: '',
                showName: '',
                totalNumber: '',
                couponsType: '1',
                faceValue: '',
                amountLimitation: '',
                couponsPeriodType: '2',
                availableChannel: '0',
                validDay: '',
                pickerDate: [new Date(), new Date()],
                pickerTime: ['11:00', '11:30'],
                ifAllBusiness: '1',
                serviceId: [],
                serviceCar: [],
                serviceOrder: [],
                advancedConfig: '0',
                useCity:'0',
                type:40
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                },
            },
            rules: {
                couponsName: [
                    { required: true, message: '请输入出行券名称', trigger: 'blur' },
                    // {
                    //     pattern: /^[\u4E00-\u9FA5]{2,30}$/,
                    //     message: '输入的名字为2-30个汉字',
                    //     trigger: 'blur'
                    // }
                ],
                showName: [
                    { required: true, message: '请输入APP显示别名', trigger: 'blur' },
                    // {
                    //     pattern: /^[\u4E00-\u9FA5]{2,30}$/,
                    //     message: '输入的名字为2-30个汉字',
                    //     trigger: 'blur'
                    // }
                ],
                totalNumber: [
                    { required: true, message: '请输入总数量', trigger: 'blur' },
                    {
                        pattern: this.$regexList.get('int1-10000000'),
                        message: '请输入1-10000000（1000万）',
                        trigger: 'blur',
                    },
                ],
                faceValue: [],
                amountLimitation: [],
                validDay: [
                    { required: true, message: '请输入领券后有效周期', trigger: 'blur' },
                    {
                        pattern: /^([1-9]|[1-9][0-9]|[1-2][0-9][0-9]|[3][0-5][0-9]|(360|361|363|362|364|365))$/,
                        message: '请输1-365整数',
                        trigger: 'blur',
                    },
                ],
                couponsType: [{ required: true, message: '请选择出行券类型', trigger: 'blur' }],
                useCity: [{ required: true, message: '请选择适用城市', trigger: 'blur' }],
                advancedConfig: [{ required: true, message: '请选择高级配置', trigger: 'blur' }],
                couponsPeriodType: [{ required: true, message: '请选择有效日期', trigger: 'blur' }],
                availableChannel: [{ required: true, message: '请选择可用渠道', trigger: 'blur' }],
                pickerDate: [{ required: true, message: '请选择有效时间', trigger: 'blur' }],
                pickerTime: [{ required: true, message: '请选择可用时段', trigger: 'blur' }],
                ifAllBusiness: [{ required: true, message: '请选择适用业务', trigger: 'blur' }],
                serviceId: [{ required: true, message: '请选择业务', trigger: 'blur' }],
                serviceCar: [{ required: true, message: '请选择适用车型', trigger: 'blur' }],
                serviceOrder: [{ required: true, message: '请选择适用订单', trigger: 'blur' }],
            },
        };
    },

    watch: {
        couponData: {
            handler: function (newVal) {
                this.$emit('changeVal', newVal);
            },
            deep: true,
        },
        'couponData.advancedConfig': {
            immediate: true,
            handler: function (newVal) {
                if (newVal == '0') {
                    this.couponData.pickerDate = [];
                    this.couponData.pickerTime = [];
                    this.couponData.ifAllBusiness = null;
                    this.couponData.couponsPeriodType = null;
                    this.couponData.validDay = null;
                    this.couponData.availableStartTime = null;
                    this.couponData.availableEndTime = null;
                    this.couponData.availableChannel = null;
                    this.couponData.effectiveStartTime = null;
                    this.couponData.effectiveEndTime = null;
                    this.couponData.useCity=null;
                }
                if (newVal == '1') {
                    this.couponData.pickerDate = [new Date(), new Date()];
                    this.couponData.pickerTime = ['11:00', '11:30'];
                    this.couponData.ifAllBusiness = '1';
                    this.couponData.couponsPeriodType = '2';
                    this.couponData.availableChannel = '0';
                    this.couponData.useCity='0';
                }
            },
            deep: true,
        },
    },

    created() {
        this.couponsTypeChange();
    },

    methods: {
        couponsTypeChange(val) {
            this.$refs['basicInfo'] && this.$refs['basicInfo'].clearValidate(['faceValue', 'amountLimitation']);
            if (this.couponData.couponsType !== '') {
                this.couponData.faceValue = '';
                this.couponData.amountLimitation = '';
            }
            let faceValue = [];
            let amountLimitation = [];
            let checkAge = (rule, value, callback) => {
                if (value == 0.0 || !/^(?:(?!0\d)\d{1,5}(?:\.\d{1,2})?|100000(?:\.0{1,2})?)$/.test(value)) {
                    return callback(new Error('请输入0.01-100000.00（10万）'));
                } else {
                    return callback();
                }
            };
            switch (this.couponData.couponsType) {
                case '1':
                    // 满减 0.00-100000.00
                    faceValue = [
                        { required: true, message: '请输入减免金额', trigger: 'blur' },
                        {
                            pattern: /^(?:(?!0\d)\d{1,5}(?:\.\d{1,2})?|100000(?:\.0{1,2})?)$/,
                            message: '请输入0.00-100000.00（10万）',
                            trigger: 'blur',
                        },
                    ];
                    amountLimitation = [
                        { required: true, message: '请输入满减金额', trigger: 'blur' },
                        {
                            pattern: /^(?:(?!0\d)\d{1,5}(?:\.\d{1,2})?|100000(?:\.0{1,2})?)$/,
                            message: '请输入0.00-100000.00（10万）',
                            trigger: 'blur',
                        },
                    ];
                    break;
                case '3': // 立减
                    faceValue = [
                        { required: true, message: '请输入优惠金额', trigger: 'blur' },
                        {
                            pattern: /^(?:(?!0\d)\d{1,5}(?:\.\d{1,2})?|100000(?:\.0{1,2})?)$/,
                            message: '请输入0.00-100000.00（10万）',
                            trigger: 'blur',
                        },
                    ];
                    break;
                case '2': // 折扣
                    faceValue = [
                        { required: true, message: '请输入折扣0.00-10.00', trigger: 'blur' },
                        {
                            pattern: /^(?:(?!0\d)\d{1}(?:\.\d{1,2})?|10(?:\.0{1,2})?)$/,
                            message: '请输入0.00-10.00',
                            trigger: 'blur',
                        },
                    ];
                    amountLimitation = [{ required: true, message: '请输入0.00-100000.00(10万)', trigger: 'blur', validator: checkAge }];
                    break;
            }
            this.rules.faceValue = faceValue;
            this.rules.amountLimitation = amountLimitation;
        },
        changeSeviceId(val) {
            if (!val.includes('1')) {
                this.couponData.serviceCar = [];
                this.couponData.serviceOrder = [];
            }
        },
        changeBusiness(val) {
            if (val == '1') {
                this.couponData.serviceId = [];
                this.couponData.serviceCar = [];
                this.couponData.serviceOrder = [];
            }
        },
        handlePeriodType(val) {
            console.log(val);
            if (val == 2) {
                this.couponData.pickerDate = [new Date(), new Date()];
                this.couponData.validDay = null;
            } else if (val == 1) {
                this.couponData.pickerDate = [];
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
</style>
