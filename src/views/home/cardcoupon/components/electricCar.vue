<template>
    <el-form ref="basicInfo" label-position="right" label-width="8rem" :model="couponData" :rules="rules">
        <div class="currency-apply-title">申请详情</div>
        <el-row type="flex" justify="space-between" :gutter="40">
            <el-col :span="8">
                <el-form-item prop="couponsName" label="名称：">
                    <el-input v-model.trim="couponData.couponsName" maxlength="30" placeholder="请输入换电券名称"></el-input>
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
                <el-form-item prop="couponsType" label="换电券类型：">
                    <el-select @change="couponsTypeChange(couponData.couponsType)" v-model="couponData.couponsType" placeholder="请选择换电券类型" style="width: 100%" disabled>
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
                <el-form-item prop="validDay" label="有效日期：">
                    <el-row type="flex" justify="space-between" :gutter="8">
                        <el-col :span="12">
                            <el-select @change="handlePeriodType" v-model="couponData.couponsPeriodType" placeholder="请选择有效日期" disabled>
                                <el-option label="固定周期有效" value="2"></el-option>
                                <el-option label="领券后周期内有效" value="1"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="12">
                            <el-input v-model.trim="couponData.validDay" maxlength="3" placeholder="请输入领券后有效周期"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
export default {
    name:'electricCar',
    data() {
        return {
            couponData: {
                couponsName: '',
                showName: '',
                totalNumber: '',
                couponsType: '1',
                faceValue: '',
                amountLimitation: '',
                couponsPeriodType: '1',
                availableChannel: '0',
                validDay: '',
                pickerDate: '',
                pickerTime: '',
                ifAllBusiness: '0',
                serviceId: [1],
                serviceOrder: [10],
                advancedConfig: '1',
                useCity:'0',
                type:49
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                },
            },
            rules: {
                couponsName: [
                    { required: true, message: '请输入换电券名称', trigger: 'blur' },
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
                couponsType: [{ required: true, message: '请选择换电券类型', trigger: 'blur' }],
                useCity: [{ required: true, message: '请选择适用城市', trigger: 'blur' }],
                advancedConfig: [{ required: true, message: '请选择高级配置', trigger: 'blur' }],
                couponsPeriodType: [{ required: true, message: '请选择有效日期', trigger: 'blur' }],
                availableChannel: [{ required: true, message: '请选择可用渠道', trigger: 'blur' }],
                pickerDate: [{ required: true, message: '请选择有效时间', trigger: 'blur' }],
                pickerTime: [{ required: true, message: '请选择可用时段', trigger: 'blur' }],
                ifAllBusiness: [{ required: true, message: '请选择适用业务', trigger: 'blur' }],
                serviceId: [{ required: true, message: '请选择业务', trigger: 'blur' }],
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
                    this.couponData.ifAllBusiness = '0';
                    this.couponData.couponsPeriodType = '1';
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
                            validator: (rule, value, callback)=> {
                                let reg = /^(?:(?!0\d)\d{1,5}(?:\.\d{1,2})?|100000(?:\.0{1,2})?)$/
                                if(!reg.test(value)) {
                                    callback(new Error('请输入0.00-100000.00（10万）'));
                                }
                                if(Number(value) > Number(this.couponData.amountLimitation)) {
                                    callback(new Error('减免金额不应大于满减金额'));
                                }
                                callback()
                            },
                            trigger: 'blur', 
                        }
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
                this.couponData.serviceOrder = [];
            }
        },
        changeBusiness(val) {
            if (val == '1') {
                this.couponData.serviceId = [];
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
