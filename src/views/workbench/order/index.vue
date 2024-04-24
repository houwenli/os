<template>
    <div>
        <div class="content-style">
            <el-tabs class="tab-wrap" v-model="activeName">
                <!-- <el-tab-pane v-for="item in list" :key="item.id" :label="item.resourcesName" :name="item.resourcesUrl.substring(11)" @click="activeName = item.resourcesUrl"></el-tab-pane> -->
                <!-- <el-tab-pane v-if='JSON.stringify(this.getModulePower("/workbench/placeOrder"))=="{}"' label="自主下单" name="placeOrder"></el-tab-pane>
                <el-tab-pane v-if='JSON.stringify(this.getModulePower("/workbench/mixedOrder"))=="{}"' label="历史下单" name="mixedOrder"></el-tab-pane> -->
                <el-tab-pane v-if="!(JSON.stringify(this.getModulePower('/workbench/placeOrder')) == '{}')" label="自主下单" name="placeOrder"></el-tab-pane>
                <el-tab-pane v-if="!(JSON.stringify(this.getModulePower('/workbench/mixedOrder')) == '{}')" label="历史下单" name="mixedOrder" :disabled="tabDisabled"></el-tab-pane>
            </el-tabs>
            <keep-alive>
                <component :is="activeName" :ref="activeName"></component>
            </keep-alive>
        </div>
    </div>
</template>

<script>
import mixedOrder from './mixedOrder/index';
import placeOrder from './placeOrder/form';

export default {
    name: 'order',
    components: {
        mixedOrder,
        placeOrder
    },
    beforeRouteLeave(to, from, next) {
        if(to.name === 'placeOrderDrivers'){
            from.meta.keepAlive = true;
        }else{
            from.meta.keepAlive = false;
        }
        next();
    },
    created(){
        let { orgType } = this.$baseMethod.getStore('roleOption');
        if (orgType === 0) {
            this.tabDisabled = true;
        } else {
            this.tabDisabled = false;
        }
    },
    activated() {
        let { orgType } = this.$baseMethod.getStore('roleOption');
        if (orgType === 0) {
            this.tabDisabled = true;
        }else{
            this.tabDisabled = false
        }
    },
    data() {
        return {
            moduleName: '/workbench/BRorder',
            activeName: !(JSON.stringify(this.getModulePower('/workbench/placeOrder')) == '{}') ? 'placeOrder' : 'mixedOrder',
            list: [],
            tabDisabled:false
        };
    }
};
</script>

<style lang="scss" scoped>
section div.content-style {
    min-height: 100%;
    padding: 24px 24px 16px;
    background-color: #fff;
    border-radius: 8px;
    /deep/ .el-tabs__header {
        display: flex;
        justify-content: center;
        margin-bottom: 0;
    }
    .tab-wrap {
        padding: 0 24px;
        margin-bottom: 32px;
        /deep/ .el-tabs__nav-wrap {
            background-color: #f5f7fa;
        }
    }
    /deep/ .el-tabs__item {
        width: 124px;
        height: 40px;
        text-align: center;
        color: #606266;
        &.is-active {
            background-color: #f05259;
            color: #fff;
            opacity: 1;
        }
        &.is-top:nth-child(2) {
            padding-left: 20px;
        }
        &.is-top:last-child {
            padding-right: 20px;
        }
    }
    /deep/ .el-tabs__active-bar {
        height: 0;
    }
    /deep/ .el-tabs__nav-wrap::after {
        width: 0;
    }
    ::v-deep .el-tabs__nav-wrap {
            display: inline-block;
            border-radius: 4px 4px 4px 4px !important;
        }
       /deep/ .el-tabs__item.is-disabled{
            cursor: not-allowed;
        }
}
</style>
