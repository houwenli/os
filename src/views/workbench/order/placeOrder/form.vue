<template>
    <div class="panel">
        <div class="quota-global-formcontent fence-formcontent">
            <div class="is-flex form-box">
                <div class="form-label" v-if="componentTab">
                    <span style="color: #f05259">*</span>
                    服务类型:
                </div>
                <el-radio-group v-model="componentTab">
                    <el-radio label="subscribe" v-if="getModulePower('/workbench/placeOrder').addPlaceOrder">预约</el-radio>
                    <el-radio label="realTime" v-if="getModulePower('/workbench/placeOrder').placeInstantOrder">实时</el-radio>
                    <el-radio label="charter" v-if="getModulePower('/workbench/placeOrder').addCharteredBusOrder">包车</el-radio>
                    <el-radio label="cityCar" v-if="getModulePower('/workbench/placeOrder').addOrder">城际专线</el-radio>
                </el-radio-group>
            </div>
            <!-- <keep-alive> -->
            <component :is="componentTab" class="bg-comp"></component>
            <!-- </keep-alive> -->
        </div>
    </div>
</template>

<script>
import cityCar from './components/cityCar';
import charter from './components/charter';
import realTime from './components/realTime';
import subscribe from './components/subscribe';
export default {
    name: 'placeOrderForm',
    components: {
        cityCar,
        charter,
        realTime,
        subscribe
    },
    data() {
        return {
            moduleName: '/workbench/placeOrder',
            componentTab: ''
        };
    },
    created() {
        if (this.getModulePower('/workbench/placeOrder').addPlaceOrder) return this.componentTab = 'subscribe';
        if (this.getModulePower('/workbench/placeOrder').placeInstantOrder) return this.componentTab =  'realTime';
        if (this.getModulePower('/workbench/placeOrder').addCharteredBusOrder) return this.componentTab =  'charter';
        if (this.getModulePower('/workbench/placeOrder').addOrder) return this.componentTab =  'cityCar';
    },
};
</script>

<style lang="scss" scoped>
.is-flex {
    display: flex;
    align-items: center;
    height: 60px;
}
.form-box {
    flex: 1;
    position: relative;
    // margin-bottom: 10px;
    background: #fff;
    border-radius: 10px 10px 0 0;
}
.form-label {
    width: 200px;
    display: flex;
    justify-content: flex-end;
    margin-right: 20px;
}
.bg-comp {
    background: #fff;
    padding-bottom: 30px;
    border-radius: 0 0 10px 10px;
}
/deep/ .ws-table__wrapper .ws-table__body-warp table tr td {
    height: 40px;
}
</style>
