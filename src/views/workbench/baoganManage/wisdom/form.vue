<template>
    <div class="flex-column">
        <div class="form-wrap flex-1">
            <el-collapse v-model="activeNames">
                <ws-descriptions title="基础信息">
                    <ws-descriptions-item label="业务单号" :showTip="false">{{ getObj.orderId || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="交易订单号" :showTip="false">{{ getObj.tradeNo || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="商户订单号" :showTip="false">{{ getObj.outTradeNo || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="状态" :showTip="false">{{ getObj.payStatus | bgRunningFilters }}</ws-descriptions-item>
                    <ws-descriptions-item label="包干天数" :showTip="false">{{ getObj.parentOrderId && getObj.orderStatus === 3 ? '-' : ''}}{{getObj.purchaseVipDay ? getObj.purchaseVipDay + '天' : '' }}</ws-descriptions-item>
                    <ws-descriptions-item label="应付金额" :showTip="false">{{getObj.money == 0 ? '' : (getObj.parentOrderId && getObj.orderStatus === 3 ? '-':'')}}{{formatAmount(getObj.money)}}元</ws-descriptions-item>
                    <ws-descriptions-item label="实付金额" :showTip="false">{{getObj.payMoney == 0 ? '' : (getObj.parentOrderId && getObj.orderStatus === 3 ? '-':'')}}{{formatAmount(getObj.payMoney)}}元</ws-descriptions-item>
                    <ws-descriptions-item label="支付类型" :showTip="false">
                        <span v-if="getObj.payWay==null">-</span>
                        <span v-else>{{ getObj.payWay | payWayFilters }}</span>
                    </ws-descriptions-item>
                    <ws-descriptions-item label="支付方式" :showTip="false">{{ getObj.payTypeName || '-' }}</ws-descriptions-item>
                    <!-- <ws-descriptions-item label="创建人" :showTip="false">{{ getObj.createUser || '-' }}</ws-descriptions-item> -->
                    <ws-descriptions-item label="创建时间" :showTip="false">{{ getObj.createTime || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="支付时间" :showTip="false">{{ getObj.payTime || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="备注" :showTip="true">{{ getObj.remark || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="关联业务单号" :showTip="false">{{ getObj.parentOrderId || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="推荐机构" :showTip="true">{{ getObj.orderOrgName || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="推荐人手机号" :showTip="true">{{ getObj.recommendDriverPhone || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="城市" :showTip="false">{{ getObj.cityName || '-' }}</ws-descriptions-item>
                </ws-descriptions>
                <ws-descriptions title="购买车主信息">
                    <ws-descriptions-item label="司机ID" :showTip="false">{{ getObj.driverId || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="司机姓名" :showTip="false">{{ getObj.driverName || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="手机号码" :showTip="false">{{ getObj.driverPhone || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="车牌号" :showTip="false">{{ getObj.carNum || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="归属机构" :showTip="true">{{ getObj.orgName || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="机构编码" :showTip="false">{{ getObj.agencyNumber || '-' }}</ws-descriptions-item>
                </ws-descriptions>
                <ws-descriptions title="购买乘客信息">
                    <ws-descriptions-item label="乘客ID" :showTip="false">{{ getObj.passengerId || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="姓名" :showTip="false">{{ getObj.passengerName || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="身份证" :showTip="false">{{ getObj.passengerIdNumber || '-' }}</ws-descriptions-item>
                </ws-descriptions>
            </el-collapse>
        </div>
        <div class="footer_btn">
            <el-button plain @click="back()">返 回</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeNames: ['1', '2', '3', '4', '5', '6'],
            getObj: {},
            moduleName: '/workbench/baoganManage/wisdom/list',
            op: {
                detail: 'detail',
                detailDecrypt: 'detailDecrypt',
            },
            payModeTypeMap:{
                '1':'自付',
                '2':'亲友代付'
            }
        };
    },
    mounted() {
        this.getData();
    },
    methods: {
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        getData() {
            let data = {
                data: {
                    orderId: this.$route.query.id,
                },
                op: { false: this.op.detail, true: this.op.detailDecrypt }[this.$route.query.isEncrypt + ''],
            };
            let URL = this.getModuleUrl(data.op);
            if (!URL) {
                this.$message.error('无权限访问');
                return false;
            }
            this.$axios(URL, data).then(res => {
                this.getObj = JSON.parse(res.data);
            });
        },
        formatAmount(m) {
            return this.$baseMethod.regFenToYuan(m);
        },
        back() {
            this.$router.push({ path: this.moduleName });
        },
    },
};
</script>
<style lang="scss" scoped>
.form-wrap {
    background: #fff;
    padding: 32px 40px;
    border-radius: 8px;
    /deep/ .el-collapse {
        border: 0 !important;
    }
    /deep/ .ws-descriptions__title {
        font-size: 16px;
    }
}
</style>
