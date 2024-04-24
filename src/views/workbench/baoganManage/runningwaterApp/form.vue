<template>
    <div class="flex-column">
        <div class="form-wrap flex-1">
            <el-collapse v-model="activeNames">
                <ws-descriptions title="基础信息">
                    <ws-descriptions-item label="业务单号" :showTip="false">{{ getObj.orderId || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="交易订单号" :showTip="false">{{ getObj.tradeNo || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="商户订单号" :showTip="false">{{ getObj.outTradeNo || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="状态" :showTip="false">{{ getObj.payStatus | appRunningFilters }}</ws-descriptions-item>
                    <ws-descriptions-item label="包干区域" :showTip="false">{{ getObj.regionName || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item
                        label="包干天数"
                        :showTip="false"
                    >{{ getObj.originOrderId && getObj.orderStatus === 3 ? '-' : ''}}{{getObj.purchaseVipDay ? getObj.purchaseVipDay + '天' : '' }}</ws-descriptions-item>
                    <ws-descriptions-item label="包干开始时间" :showTip="false">{{ getObj.vipStartTime || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="包干结束时间" :showTip="false">{{ getObj.vipEndTime || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item
                        label="应付金额"
                        :showTip="false"
                    >{{getObj.actualMoney == 0 ? '' : (getObj.originOrderId && getObj.orderStatus === 3 ? '-':'')}}{{formatAmount(getObj.actualMoney)}}元</ws-descriptions-item>
                    <ws-descriptions-item
                        label="实付金额"
                        :showTip="false"
                    >{{getObj.money == 0 ? '' : (getObj.originOrderId && getObj.orderStatus === 3 ? '-':'')}}{{formatAmount(getObj.money)}}元</ws-descriptions-item>
                    <ws-descriptions-item
                        label="折扣价"
                        :showTip="false"
                    >{{getObj.money == null ? '-' : '' + formatAmount(getObj.money)+'元'}}</ws-descriptions-item>
                    <ws-descriptions-item
                        label="加价"
                        :showTip="false"
                    >{{getObj.addPrice == null ? '-' : '' + formatAmount(getObj.addPrice)+'元'}}</ws-descriptions-item>
                    <ws-descriptions-item label="支付方式" :showTip="false">{{ getObj.payTypeName || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="业务类型" :showTip="false">{{ getObj.purchaseTypeName || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="创建人" :showTip="false">{{ getObj.createUser || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="创建时间" :showTip="false">{{ getObj.createTime || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="支付时间" :showTip="false">{{ getObj.payTime || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="备注" :showTip="true">{{ getObj.remark || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="关联业务单号" :showTip="false">{{ getObj.originOrderId || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="业务单归属机构" :showTip="true">{{ getObj.orgName }}</ws-descriptions-item>
                    <ws-descriptions-item label="包干价格获取方式" :showTip="false">{{ getObj.recognizeTypeName || '-' }}</ws-descriptions-item>
                </ws-descriptions>
                <ws-descriptions title="购买车主信息">
                    <ws-descriptions-item label="司机ID" :showTip="false">{{ getObj.driverId || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="司机姓名" :showTip="false">{{ getObj.driverName || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="手机号码" :showTip="false">{{ getObj.driverPhone || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="归属机构" :showTip="true">{{ getObj.orgName || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="机构编码" :showTip="false">{{ getObj.agencyNumber || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="车牌号" :showTip="false">{{ getObj.carNum || '-' }}</ws-descriptions-item>
                </ws-descriptions>
                <ws-descriptions title="推荐车主信息">
                    <ws-descriptions-item label="司机ID" :showTip="false">{{ getObj.referrerDriverId || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="司机姓名" :showTip="false">{{ getObj.referrerDriverName || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="手机号码" :showTip="false">{{ getObj.referrerDriverPhone || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item label="归属机构" :showTip="true">{{ getObj.referrerDriverOrgName || '-' }}</ws-descriptions-item>
                    <ws-descriptions-item
                        label="奖励比例"
                        :showTip="false"
                    >{{ getObj.referrerDriverRadio || '-'}}{{getObj.referrerDriverRadio?'%':'' }}</ws-descriptions-item>
                    <ws-descriptions-item
                        label="奖励金额"
                        :showTip="false"
                    >{{ getObj.referrerDriverMoney?formatAmount(getObj.referrerDriverMoney):'-'}}{{getObj.referrerDriverMoney?'元':'' }}</ws-descriptions-item>
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
            moduleName: '/workbench/baoganManage/runningwaterApp/list',
            op: {
                detail: 'getDetailByOrderId'
            },
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
                op: this.op.detail,
            };
            let URL = this.getModuleUrl(data.op);
            if (!URL) {
                this.$message.error('无权限访问');
                return false;
            }
            this.$axios(URL, data).then(res => {
                this.getObj = JSON.parse(res.data).data;
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
