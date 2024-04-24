<template>
    <el-form ref="basicInfo" label-position="right" label-width="8rem" :model="couponData" :rules="rules">
        <div class="currency-apply-title">申请详情</div>
        <el-row type="flex" justify="space-between" :gutter='40'>
            <el-col :span="8">
                <el-form-item prop="redPacketId" label="选择红包：">
                    <el-select ref="select" v-model="couponData.redPacketId" clearable filterable remote reserve-keyword placeholder="请选择红包" @change="changeType" value-key="id" :remote-method="getEnvelopesList" required>
                        <el-option v-for="item in envelopesList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="addNum" label="补充数量：">
                    <el-input v-model.trim="couponData.addNum" maxlength="8" placeholder="请输入申请补充数量"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="name" label="红包名称：">
                    <el-input v-model.trim="couponData.name" :disabled='true'></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" :gutter='40'>
            <el-col :span="8">
                <el-form-item prop="money" label="红包金额：">
                    <el-input v-model.trim="money" :disabled='true'></el-input>
                </el-form-item>
            </el-col>
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
        </el-row>
    </el-form>
</template>

<script>
export default {
    data() {
        return {
            couponData: {
                redPacketId: '',
                name: '',
                addNum: '',
                money: '',
                totalNumber: '',
                remainder: '',
            },
            money: '',
            envelopesItem: {},
            envelopesList: [],
            rules: {
                redPacketId: [{ required: true, message: '请选择红包', trigger: 'blur' }],
                addNum: [
                    { required: true, message: '请输入申请补充数量', trigger: 'blur' },
                    {
                        pattern: /^(?:[1-9][0-9]{0,6}|10000000)$/,
                        message: '请输入1-10000000（1000万）',
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
        this.getEnvelopesList();
    },

    methods: {
        //查询红包接口
        getEnvelopesList(data) {
            const opt = {
                data: { name: data },
                op: 'listRedPacket',
            };
            this.$axios('/cardcoupon/applyRedPacket/listRedPacket', opt).then(res => {
                let list = JSON.parse(res.data).data;
                this.envelopesList = list;
            });
        },
        changeType(val) {
            if (val) {
                this.envelopesItem = this.envelopesList.filter(item => {
                    return item.id == val;
                })[0];
                let { name, money, totalNumber, remainder, id } = this.envelopesItem;
                this.couponData.redPacketId = id;
                this.couponData.name = name;
                this.couponData.money = money;
                this.couponData.totalNumber = totalNumber;
                this.couponData.remainder = remainder;
                this.money = this.couponData.money / 100;
            } else {
                this.$refs['basicInfo'].resetFields();
                this.money = '';
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
.el-select {
    width: 100%;
}
</style>
