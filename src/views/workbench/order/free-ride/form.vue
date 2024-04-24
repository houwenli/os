<template>
    <div class="common-form-style">
        <div class="container">
            <div class="tabs-group">
                <el-radio-group v-model="componentTab">
                    <el-radio-button v-if="getModulePower('/workbench/mixedOrder').selectDriverOrderDetailsShare" label="driverOrder">司机订单信息</el-radio-button>
                    <el-radio-button v-if="getModulePower('/workbench/mixedOrder').selectPassengerOrderDetailsShare" label="passengerOrder">乘客订单信息</el-radio-button>
                    <el-radio-button v-if="getModulePower('/workbench/mixedOrder').selectMapInfoShare" label="mapPath">地图线路</el-radio-button>
                    <el-radio-button v-if="getModulePower('/workbench/mixedOrder').selectDetailExp" label="orderDispatchLog">分单日志</el-radio-button>
                </el-radio-group>
            </div>
            <div class="content">
                <component :is="componentTab" :dataList="dataList"></component>
            </div>
            <div class="set_btn">
                <el-button @click="back()" plain class="buttons">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import DriverOrder from './component/DriverOrder';
import PassengerOrder from './component/PassengerOrder';
import OrderDispatchLog from './component/OrderDispatchLog';
import MapPath from './component/MapPath';

export default {
    name: 'orderFreeRideForm',
    components: {
        DriverOrder,
        PassengerOrder,
        OrderDispatchLog,
        MapPath
    },
    data() {
        return {
            componentTab: 'driverOrder',
            driverOrderDetails: {},
            passengerOrderDetails: {},
            orderDispatchLog: {},
            routerQurey: {},
            mapPath: {},
            moduleName: '/workbench/mixedOrder'
        };
    },
    computed: {
        dataList() {
            return new Map([
                ['driverOrder', this.driverOrderDetails],
                ['passengerOrder', this.passengerOrderDetails],
                ['orderDispatchLog', this.orderDispatchLog]
            ]).get(this.componentTab);
        }
    },
    mounted() {
        this.routerQurey = this.$route.query;
        if (this.routerQurey.orderId) {
            this.getDetails();
        }
        switch (false) {
            case !this.getModulePower('/workbench/mixedOrder').selectDriverOrderDetailsShare:
                this.componentTab = 'driverOrder';
                break;
            case !this.getModulePower('/workbench/mixedOrder').selectPassengerOrderDetailsShare:
                this.componentTab = 'PassengerOrder';
                break;
            case !this.getModulePower('/workbench/mixedOrder').selectMapInfoShare:
                this.componentTab = 'mapPath';
                break;
            case !this.getModulePower('/workbench/mixedOrder').selectDetailExp:
                this.componentTab = 'OrderDispatchLog';
                break;
            default:
                break;
        }
    },
    methods: {
        ...mapActions('order', ['getFreeRideDriverOrderDetails', 'getFreeRidePassengerOrderDetails']),
        getDetails() {
            let data = {
                orderId: this.routerQurey.orderId
            };
            this.getFreeRideDriverOrderDetails(data).then(res => {
                res.busCarDriverOrder.releaseSeatNum = res.busCarDriverOrder.seatNum;
                this.driverOrderDetails = { ...res.busCarDriverOrder, ...res.driverDetails };
            });
            // this.getFreeRidePassengerOrderDetails(data).then(res => this.passengerOrderDetails = res || []);
            this.getFreeRidePassengerOrderDetails(data).then(res => {
                this.passengerOrderDetails = res || [];
            });
        },
        //type  返回是否缓存
        back(type) {
            this.$router.push({ path: '/workbench/BRorder' });
        }
    }
};
</script>

<style lang="scss" scoped>
.common-form-style {
    .container{
    margin-bottom: 64px;
    background: #fff;
    padding: 20px; 
    border-radius: 8px;
    min-height: calc(100% - 64px);
}
    .tabs-group {
        text-align: center;
        margin-bottom: 10px;
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
