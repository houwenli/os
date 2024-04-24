<template>
    <el-form ref="basicInfo" label-position="right" label-width="8rem" :model="couponData" :rules="rules">
        <div class="currency-apply-title">基本信息</div>
        <el-row type="flex" justify="space-between" :gutter="40">
            <el-col :span="12">
                <el-form-item prop="commodityName" label="选择换电券：">
                    <el-select
                     style="width:20vw"
                        v-model="couponData.commodityName"
                        clearable
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请选择换电券"
                        @change="changeType"
                        value-key="id"
                        :remote-method="getTravelList"
                    >
                        <el-option v-for="item in selectList" :key="item.id" :label="item.couponsName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item prop="addNum" label="补充数量：">
                    <el-input v-model.trim="couponData.addNum" maxlength="8" placeholder="请输入补充数量"></el-input>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item prop="showName" :disabled="true" label="APP显示别名：">
                    <el-input v-model.trim="couponData.showName" maxlength="30" :disabled="true" placeholder="请输入APP显示别名"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" :gutter="40">
            <el-col :span="8">
                <el-form-item prop="totalNumber" label="总数量：">
                    <el-input v-model.trim="couponData.totalNumber" maxlength="8" :disabled="true" placeholder="请输入总数量"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="remainder" label="余量：">
                    <el-input v-model.trim="couponData.remainder" maxlength="8" :disabled="true" placeholder="请输入总数量"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="couponsType" label="换电券类型：">
                    <el-select v-model="couponData.couponsType" :disabled="true" placeholder="请选择优惠券类型" style="width: 100%">
                        <el-option label="立减" value="3"></el-option>
                        <el-option label="折扣" value="2"></el-option>
                        <el-option label="满减" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" :gutter="40">
            <el-col :span="8">
                <el-form-item prop="faceValue" v-if="couponData.couponsType == 3" label="减免金额：" required>
                    <el-input v-model.trim="couponData.faceValue" maxlength="5" :disabled="true" placeholder="请输入减免金额"></el-input>
                </el-form-item>
                <el-form-item prop="faceValue" v-if="couponData.couponsType == 2" label="折扣金额：" required>
                    <el-input v-model.trim="couponData.faceValue" maxlength="5" :disabled="true" placeholder="请输入折扣0.00-10.00"></el-input>
                </el-form-item>
                <el-form-item v-show="couponData.couponsType == 1 || !couponData.couponsType" label="满减金额：">
                    <el-row type="flex" justify="space-between" :gutter="8">
                        <el-col :span="12">
                            <el-form-item prop="amountLimitation">
                                <el-input v-model.trim="couponData.amountLimitation" maxlength="9" :disabled="true" placeholder="请输入满减金额"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="faceValue">
                                <el-input v-model.trim="couponData.faceValue" maxlength="9" :disabled="true" placeholder="请输入减免金额"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="couponsPeriodType" label="有效日期：">
                    <el-row type="flex" justify="space-between" :gutter="8">
                        <el-col :span="12">
                            <el-select @change="handlePeriodType" v-model="couponData.couponsPeriodType" :disabled="true" placeholder="请选择有效日期" style="width: 100%">
                                <el-option label="固定周期有效" value="2"></el-option>
                                <el-option label="领券后周期内有效" value="1"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="12">
                            <el-input v-model.trim="couponData.validDay" maxlength="3" :disabled="true" placeholder="请输入领券后有效周期"></el-input>
                        </el-col>
                    </el-row>
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
                commodityName: '',
                showName: '',
                totalNumber: '',
                remainder:'',
                couponsType: '1',
                addNum: 0,
                couponId: '',
                faceValue: '',
                amountLimitation: '',
                couponsPeriodType: '1',
                ecommerceradio: '',
                validDay: '',
                onlineRetailerCouponId: null,
                pickerDate: [],
                datalist: [],
                idName: null,
                type:140
            },
            travelList: [],
            selectList: [],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7
                }
            },
            rules: {
                commodityName: [{ required: true, message: '请选择换电券', trigger: 'blur' }],
                addNum: [
                    { required: true, message: '请输入补充卡券数量', trigger: 'blur' },
                    {
                        pattern: /^(?!0)(?:[0-9]{1,6}|1000000)$/,
                        message: '请输入1-1000000（100万）',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },

    watch: {
        couponData: {
            handler: function (newVal) {
                this.$emit('changeVal', newVal)
            },
            deep: true
        }
    },

    created() {
        //请求卡券的方法
        // this.getTravelList()
    },

    methods: {
        getTravelList(data) {
            this.selectList = []
            const opt = {
                data: { couponsName: data },
                op: 'listByName'
            }
            this.$axios(this.$getModuleUrl('/cardcouponApply', opt.op), opt).then(res => {
                this.selectList = JSON.parse(res.data).data
            })
        },
        changeType(val) {
            if (val) {
                let currentList = this.selectList
                currentList = currentList.filter(item => {
                    return item.id == val
                })[0]
                    this.couponData.showName = currentList.showName
                    this.couponData.faceValue = this.$baseMethod.regFenToYuan(currentList.faceValue)
                    this.couponData.amountLimitation = this.$baseMethod.regFenToYuan(currentList.amountLimitation)
                    this.couponData.totalNumber = currentList.totalNumber
                    this.couponData.remainder = currentList.remainder
                    this.couponData.validDay = currentList.validDay
                    this.couponData.couponsType = currentList.couponsType + ''
                    this.couponData.couponsPeriodType = currentList.couponsPeriodType + ''
                    this.couponData.onlineRetailerCouponId = currentList.id
                    this.couponData.couponsName = currentList.couponsName
            } else {
                this.$refs['basicInfo'].resetFields()
                this.money = ''
            }
        },
        regFenToYuan(m) {
            return this.thousandSeparator(this.$baseMethod.regFenToYuan(m))
        },
        // 添加千位符
        thousandSeparator(num) {
            var res = num.toString().replace(/\d+/, function (n) {
                // 先提取整数部分
                return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                    return $1 + ','
                })
            })
            return res
        },
        handlePeriodType(val) {
            console.log(val)
            if (val == 2) {
                this.couponData.pickerDate = [new Date(), new Date()]
                this.couponData.validDay = null
            } else if (val == 1) {
                this.couponData.pickerDate = []
            }
        }
    }
}
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
