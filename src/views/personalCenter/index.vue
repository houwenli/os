<template>
    <div>
        <div v-if="menuOptions.length > 0" class="content-style" :style="activeName=='personMat'?'margin-bottom: 65px;':''">
            <el-tabs class="tab-wrap" v-model="activeName">
                <el-tab-pane v-for="item in menuOptions" :label="item.resourcesName" :name="item.resourcesUrl" :key="item.name"></el-tab-pane>
            </el-tabs>
            <component :is="activeName" @getActiveName="getActiveName" />
        </div>
    </div>
</template>

<script>
import personInfo from './personInfo/index';
import personMgr from './personMgr/index';
import withdrawalRecord from './withdrawalRecord/index';
import bankCardManage from './bankCardMgr/index';
import personMat from './personMat/index';
export default {
    name: 'personalCenter',
    components: {
        personInfo,
        personMgr,
        withdrawalRecord,
        bankCardManage,
        personMat
    },
    data() {
        return {
            moduleName: '/personalCenter',
            activeName: '',
            menuOptions: []
        };
    },
    created() {
        this.getActiveName();
    },

    watch: {
        defaultMenuOptions: {
            deep: true,
            immediate: true,
            handler: function (newV) {
                this.menuOptions = (newV || {}).menuList
                    .filter(j => j.resourcesUrl != '/personalCenter')
                    .map(item => {
                        return { ...item, resourcesUrl: item.resourcesUrl.substring('/personalCenter/'.length) };
                    });
                console.log(this.menuOptions);
                this.activeName = (this.$judgeType(this.menuOptions, [])[0] || {}).resourcesUrl || '';
            }
        }
    },
    methods: {
        getActiveName() {
            let activeName = this.$route.params.activeName || '';
            if (activeName) {
                this.activeName = activeName;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
section div.content-style {
    height: auto;
    padding: 24px 40px 32px;
    background-color: #fff;
    border-radius: 8px;
    /deep/ .el-tabs__header {
        display: flex;
        justify-content: center;
        margin-bottom: 0;
    }
    .tab-wrap {
        padding: 0 24px;
        margin-bottom: 24px;
        /deep/ .el-tabs__nav-wrap {
            background-color: #f5f7fa;
            border-radius: 4px 4px 4px 4px !important;
        }
    }
    /deep/ .el-tabs__item {
        width: 124px;
        height: 40px;
        text-align: center;
        color: #606266;
        padding: 0;
        &.is-active {
            background-color: #f05259;
            color: #fff;
            opacity: 1;
        }
        // &.is-top:nth-child(2) {
        //     padding-left: 20px;
        // }
        // &.is-top:last-child {
        //     padding-right: 20px;
        // }
    }
    /deep/ .el-tabs__active-bar {
        height: 0;
    }
    /deep/ .el-tabs__nav-wrap::after {
        width: 0;
    }
}
</style>
