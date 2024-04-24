<template>
    <div>
        <div class="form-wrap">
            <div class="fee-info">
                <el-form :model="pageData" label-width="130px" label-suffix=":" disabled>
                    <template v-for="(item, i) in dataList">
                        <div class="title" style="margin-top: 1px">
                            <span>{{ item.title }}</span>
                        </div>
                        <div class="detail" :key="i">
                            <el-row :gutter="40">
                                <el-col :span="12" v-for="data in item.content" :key="data.value">
                                    <el-form-item :label="data.label">
                                        <span v-if="pageData[data.value] && data.unit && data.filter">{{data.filter(pageData[data.value])+data.unit}}</span>
                                        <span v-else-if="pageData[data.value] && data.unit">{{pageData[data.value]+data.unit}}</span>
                                        <span v-else>{{pageData[data.value] || '-'}}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </template>
                </el-form>
            </div>
            <section class="btnBox">
                <el-button class="backBtn" @click="$router.push({path: '/dataServer/annualData'})">返回</el-button>
            </section>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dataList: [
                {
                    title: '司机基础信息',
                    content: [
                        {label: '司机姓名', value: 'driverName'},
                        {label: '手机号', value: 'phoneNum'},
                        {label: '司机ID', value: 'driverId'},
                        {label: '所属机构', value: 'orgName'},
                        {label: '合伙人类型', value: 'partnerType'},
                        {label: '认证包干类型', value: 'vipType'},
                        {label: '本地生活包干类型', value: 'localType'},
                        {label: '系统合规类型', value: 'complianceType'},
                    ]
                },
                {
                    title: '司机入网指标',
                    content: [
                        {label: '入网时间', value: 'firstAuditPassTime'},
                        {label: '入网时长', value: 'passingTime', unit: '天'},
                    ]
                },
                {
                    title: '司机订单指标',
                    content: [
                        {label: '累计行驶公里数', value: 'mileageTotal', unit: '公里'},
                        {label: '最远行驶公里数', value: 'mileageMax', unit: '公里'},
                        {label: '超过用户', value: 'driverPercent'},
                        {label: '累计行驶时长', value: 'drivingTimeTotal', unit: '小时'},
                        {label: '最长行程时长', value: 'drivingTimeMax',unit: '小时', filter:val=> (val / 60 / 60).toFixed(1) },
                        {label: '累计服务天数', value: 'orderTimeTotal', unit: '天'},
                        {label: '接单订单数', value: 'orderReceiveCnt', unit: '单'},
                        {label: (this.$route.query.dateType === 'year' ? '年度完单订单数' : '月度完单订单数'), value: 'orderCompleteCnt', unit: '单'},
                        {label: '全周期完单订单', value: 'orderCompleteCntTotal', unit: '单'},
                        {label: (this.$route.query.dateType === 'year' ? '年度取消订单数' : '月度取消订单数'), value: 'cancelCnt', unit: '单'},
                    ]
                },
                {
                    title: '司机包干信息',
                    content: [
                        {label: '累计包干金额', value: 'moneyTotal', unit: '元'},
                        {label: '累计包干次数', value: 'drivervipCnt', unit: '次'},
                    ]
                },
                {
                    title: '司机收入信息',
                    content: [
                        {label: '总收入', value: 'paymoneyTotal', unit: '元'},
                        {label: '订单收入', value: 'paymoneyOrder', unit: '元'},
                        {label: '活动收入', value: 'paymoneyActivity', unit: '元'},
                    ]
                },
                {
                    title: '司机绩效分信息',
                    content: [
                        {label: '累计获得绩效分', value: 'scoreTotal', unit: '分'},
                        {label: '当前绩效分', value: 'currentSocre', unit: '分'},
                        {label: '当前绩效分排名', value: 'rank', unit: '名'},
                    ]
                },
            ],
            pageData: {}
        };
    },
    created() {
        this.pageData = this.$route.query
    },
    methods: {
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    }
};
</script>

<style lang="scss" scoped>
.form-wrap {
    background-color: #fff;
    height: auto;
    padding: 24px 40px 32px;
    margin-bottom: 64px;
    .fee-info {
        .title {
            width: 100%;
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            margin-top: 32px;
            margin-bottom: 16px;
        }

        .detail {
            overflow: hidden;
            background: #F5F7FA;
            border-radius: 8px;
            padding: 10px 50px;
            margin-bottom: 32px;
        }
    }
}
.btnBox {
    position: fixed;
    bottom: 0;
    left: 0;
    width: calc(100% + 166px);
    height: 64px;
    background: #ffffff;
    box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.04);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    .backBtn {
        width: 160px;
        margin-right: 16px;
    }
}
.el-form-item {
    margin-bottom: 0;
}
/deep/ .el-form-item__label {
    font-weight: normal !important;
}
</style>
