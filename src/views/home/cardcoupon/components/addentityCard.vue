<template>
    <el-form ref="basicInfo" label-position="right" label-width="8rem" :model="couponData" :rules="rules">
        <div class="currency-apply-title">基本信息</div>
        <el-row type="flex" justify="space-between" :gutter='40'>
            <el-col :span="8">
                <el-form-item prop="activityName" label="名称：">
                    <el-input v-model.trim="couponData.activityName" maxlength="30" placeholder="请输入福卡名称"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="activityEndDate" label="有效期至：">
                    <el-date-picker v-model="couponData.activityEndDate" @change='changeTime' :picker-options="pickerOptions" style="width: 100%" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="activityNum" label="福卡总数：">
                    <el-input v-model.trim="couponData.activityNum" maxlength="6" placeholder="整数，[1-100000]"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" :gutter='40'>
            <el-col :span="8">
                <el-form-item prop="activityMoney" label="福卡金额：">
                    <el-input v-model.trim="couponData.activityMoney" maxlength="10" placeholder="整数，[1-100000]"></el-input>
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
                activityName: '',
                activityEndDate: '',
                activityNum: '',
                activityMoney: '',
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                },
            },
            rules: {
                activityName: [
                    { required: true, message: '请输入福卡名称', trigger: 'blur' },
                    // {
                    //     pattern: /^[\u4E00-\u9FA5]{2,20}$/,
                    //     message: '输入的名字为2-20个汉字',
                    //     trigger: 'blur'
                    // }
                ],
                activityEndDate: [{ required: true, message: '请选择有效日期', trigger: 'blur' }],
                activityNum: [
                    { required: true, message: '请输入福卡总数', trigger: 'blur' },
                    {
                        pattern: /^(?:[1-9][0-9]{0,4}|100000)$/,
                        message: '请输入1-100000（10万）',
                        trigger: 'blur',
                    },
                ],
                activityMoney: [
                    { required: true, message: '请输入福卡金额', trigger: 'blur' },
                    {
                        pattern: /^(?:[1-9][0-9]{0,4}|100000)$/,
                        message: '请输入1-100000（10万）',
                        trigger: 'blur',
                    },
                ],
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
    },

    created() {},

    methods: {
        changeTime(val) {
            this.couponData.activityEndDate = this.changeTimeHour(val);
        },
        changeTimeHour(data) {
            const resDate = data.getFullYear() + '-' + this.p(data.getMonth() + 1) + '-' + this.p(data.getDate()) + ' 23:59:59';
            return resDate;
        },
        p(s) {
            return s < 10 ? '0' + s : s;
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
</style>
