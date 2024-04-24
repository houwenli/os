<template>
    <el-form ref="basicInfo" label-position="right" label-width="8rem" :model="couponData" :rules="rules">
        <div class="currency-apply-title">基本信息</div>
        <el-row type="flex" justify="space-between" :gutter='40'>
            <el-col :span="8">
                <el-form-item prop="agencyName" label="领取部门：">
                    <el-input v-model.trim="couponData.agencyName" disabled placeholder="请输入领取部门"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="applyNum" label="申领数量：">
                    <el-input v-model.trim="couponData.applyNum" placeholder="整数，[1-100000]"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="applyMoney" label="申领福卡金额：">
                    <el-input v-model.trim="couponData.applyMoney" placeholder="整数，[1-100000]"></el-input>
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
                agencyName: '',
                applyNum: '',
                applyMoney: '',
                agencyNumber: '',
            },
            rules: {
                agencyName: [{ required: true, message: '请输入领取部门', trigger: 'blur' }],
                applyNum: [
                    { required: true, message: '请输入申领数量', trigger: 'blur' },
                    {
                        pattern: /^(?:[1-9][0-9]{0,4}|100000)$/,
                        message: '请输入1-100000（10万）',
                        trigger: 'blur',
                    },
                ],
                applyMoney: [
                    { required: true, message: '请输入申领福卡金额', trigger: 'blur' },
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

    created() {
        this.getDutyList();
    },

    methods: {
        getDutyList() {
            let data = {
                op: 'employPositionDetail',
            };
            this.$axios('/authority/personalCenter/select', data).then(res => {
                let duty = JSON.parse(res.data).filter(i => {
                    return i.partTime == '非兼任';
                });
                this.couponData.agencyName = duty[0].deptName;
                this.couponData.agencyNumber = duty[0].agencyNumber;
            });
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
