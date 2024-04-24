<template>
  <div>
    <div class="content-style" :style="activeName !== 'prioritySetting'?{height:'100%'}:{}">
      <el-tabs class="tab-wrap" v-model="activeName">
        <el-tab-pane label="权重配置" name="prioritySetting"></el-tab-pane>
        <el-tab-pane label="一级机构排名管理" name="firstOrg"></el-tab-pane>
        <el-tab-pane label="二级机构排名管理" name="secondOrg"></el-tab-pane>
      </el-tabs>
      <component :is="activeName"></component>
    </div>
  </div>
</template>

<script>
import prioritySetting from './prioritySetting';
import firstOrg from './firstOrg';
import secondOrg from './secondOrg';

export default {
    name: 'firstOrgManage',
    components: {
        prioritySetting,
        firstOrg,
        secondOrg,
    },
    data() {
        return {
            moduleName: '/workbench/OMfirstOrgManage',
            activeName: 'prioritySetting',
        };
    },
    created() {},
};
</script>

<style lang="scss" scoped>
section div.content-style {
    padding: 24px;
    background-color: #fff;
    border-radius: 8px;
    min-height: calc(100% - 64px);
    margin-bottom: 64px;
    ::v-deep .el-tabs__header {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 0;
    }
    .tab-wrap {
        margin-bottom: 24px;
        ::v-deep .el-tabs__nav-wrap {
            border-radius: 4px;
            background-color: #f5f7fa;
            margin: auto;
        }
    }
    ::v-deep .el-tabs__item {
        width: 152px;
        // border-radius: 4px;
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
    ::v-deep .el-tabs__active-bar {
        height: 0;
    }
    ::v-deep .el-tabs__nav-wrap::after {
        width: 0;
    }
}
</style>
