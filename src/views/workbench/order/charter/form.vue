<template>
    <div class="common-form-style">
        <div class="container">
            <div class="tabs-group">
                <el-radio-group v-model="componentTab">
                    <el-radio-button v-if="getModulePower('/workbench/mixedOrder').selectDetailCharter" label="basicInfo">基础信息</el-radio-button>
                    <el-radio-button v-if="getModulePower('/workbench/mixedOrder').selectCharteredOrderCostCharter" label="costDetail">费用明细</el-radio-button>
                    <el-radio-button v-if="getModulePower('/workbench/mixedOrder').selectMapInfoCharter" label="mapPath">地图路线</el-radio-button>
                    <el-radio-button v-if="getModulePower('/workbench/mixedOrder').selectLogDetailsCharter" label="dispatchLog">分单日志</el-radio-button>
                </el-radio-group>
            </div>
            <div class="content">
                <component :is="componentTab" :dataList="dataList"></component>
            </div>
            <div class="set_btn">
                <el-button @click="back(true)" plain class="buttons">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import basicInfo from './component/BasicInfo';
import costDetail from './component/CostDetail';
import mapPath from './component/MapPath';
import dispatchLog from './component/DispatchLog';
export default {
    name: 'formContent',
    components: {
        basicInfo,
        costDetail,
        mapPath,
        dispatchLog
    },
    data() {
        return {
            componentTab: '',
            basicInfo: {},
            costDetail: {},
            orderRefundDetails: [],
            moduleName: '/workbench/mixedOrder'
        };
    },
    computed: {
        dataList() {
            return new Map([
                ['basicInfo', this.basicInfo],
                ['costDetail', this.costDetail]
            ]).get(this.componentTab);
        }
    },
    mounted() {
        switch (false) {
            case !this.getModulePower('/workbench/mixedOrder').selectDetailCharter:
                this.componentTab = 'basicInfo';
                break;
            case !this.getModulePower('/workbench/mixedOrder').selectCharteredOrderCostCharter:
                this.componentTab = 'costDetail';
                break;
            case !this.getModulePower('/workbench/mixedOrder').selectMapInfoCharter:
                this.componentTab = 'mapPath';
                break;
            case !this.getModulePower('/workbench/mixedOrder').selectLogDetailsCharter:
                this.componentTab = 'dispatchLog';
                break;
            default:
                break;
        }
        this.componentTab = this.$route.query.orderType || 'basicInfo';
        this.getModulePower('/workbench/mixedOrder').selectDetailExp && this.getBaseInfo();
        this.getModulePower('/workbench/mixedOrder').selectCharteredOrderCostCharter && this.getCostInfo();
    },
    methods: {
        ...mapActions('order', ['getOrderBaseInfo']),
        getBaseInfo() {
            //获取订单详情基础信息
            let params = {
                data: JSON.stringify({
                    orderId: this.$route.query.orderId
                }),
                op: 'selectDetailCharter',
                moduleName: this.moduleName
            };
            this.getOrderBaseInfo(params).then(res => {
                this.basicInfo = res;
            });
        },
        getCostInfo() {
            //获取费用明细信息
            let params = {
                data: JSON.stringify({
                    orderId: this.$route.query.orderId
                }),
                op: 'selectCharteredOrderCostCharter',
                moduleName: this.moduleName
            };
            //获取费用明细
            this.getOrderBaseInfo(params).then(res => {
                this.costDetail = res;
            });
        },
        //type  返回是否缓存
        back(type) {
            this.$router.push({ path: '/workbench/BRorder' });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    }
};
</script>
<style lang="scss" scoped>
.common-form-style {
    .tabs-group {
        text-align: center;
        margin-bottom: 10px;
    }
    .container{
    margin-bottom: 64px;
    background: #fff;
    padding: 20px; 
    border-radius: 8px;
    min-height: calc(100% - 64px);
}
.set_btn {
        position: fixed;
        bottom: 0px;
        left: 0px;
        width: 100%;
        height: 64px;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        .buttons {
            width: 160px;
            height: 40px;
            display: block;
        }
    }
}
</style>
