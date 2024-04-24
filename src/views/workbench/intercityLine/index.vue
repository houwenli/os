<template>
    <div>
        <div class="content-style">
            <el-tabs class="tab-wrap" v-model="activeName">
                <!-- :label="item.resourcesName"   -->
                <!-- <el-tab-pane  v-for="item in list" :key="item.id" :label="item.resourcesName"  :name="item.resourcesUrl.substring(11)" @click="activeName=item.resourcesUrl"></el-tab-pane> -->
                <el-tab-pane v-if="!(JSON.stringify(this.getModulePower('/workbench/valuation')) == '{}')" label="计价管理" name="valuation"></el-tab-pane>
                <el-tab-pane v-if="!(JSON.stringify(this.getModulePower('/workbench/fence')) == '{}')" label="围栏管理" name="fence"></el-tab-pane>
            </el-tabs>
            <component :is="activeName"></component>
        </div>
    </div>
</template>

<script>
import fence from './fence/index';
import valuation from './valuation/index';

export default {
    name: 'intercityLine',
    components: {
        fence,
        valuation
    },
    data() {
        return {
            moduleName: '/workbench/BRintercityLine',
            activeName: !(JSON.stringify(this.getModulePower('/workbench/valuation')) == '{}') ? 'valuation' : 'fence'
        };
    },
    created() {}
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
    /deep/.ws-table-warp{
        padding: 0px !important;
    }
    ::v-deep .el-tabs__nav-wrap {
        display: inline-block;
        border-radius: 4px 4px 4px 4px !important;
    }
}
</style>
