<template>
    <el-form ref="basicInfo" label-position="right" label-width="8rem" :model="couponData" :rules="rules">
        <div class="currency-apply-title">基本信息</div>
        <el-row type="flex" justify="space-between" :gutter='40'>
            <el-col :span="8">
                <el-form-item prop="name" label="名称：">
                    <el-input v-model.trim="couponData.name" maxlength="30" placeholder="请输入红包名称"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="totalNumber" label="总数量：">
                    <el-input v-model.trim="couponData.totalNumber" maxlength="8" placeholder="请输入红包总数量"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="money" label="红包金额：">
                    <el-input v-model.trim="couponData.money" maxlength="10" placeholder="请输入红包金额，1-100000"></el-input>
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
                name: '',
                totalNumber: '',
                money: '',
            },
            rules: {
                name: [
                    { required: true, message: '请输入红包名称', trigger: 'blur' },
                    // {
                    //     pattern: /^[\u4E00-\u9FA5]{2,20}$/,
                    //     message: '输入的名字为2-20个汉字',
                    //     trigger: 'blur'
                    // }
                ],
                totalNumber: [
                    { required: true, message: '请输入红包总数量', trigger: 'blur' },
                    {
                        pattern: /^(?:[1-9][0-9]{0,6}|10000000)$/,
                        message: '请输入1-10000000（1000万）',
                        trigger: 'blur',
                    },
                ],
                money: [
                    { required: true, message: '请输入红包金额，1-100000', trigger: 'blur' },
                    {
                        pattern: this.$regexList.get('int1-100000'),
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

    methods: {},
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
