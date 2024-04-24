<template>
    <div class="page-component__scroll">
        <div v-if="menuOptions.length > 0" class="content-style"
            :style="activeName == 'personMat' ? 'margin-bottom: 65px;' : ''">
            <el-tabs class="tab-wrap" v-model="activeName">
                <el-tab-pane v-for="item in menuOptions" :label="item.resourcesName" :name="item.resourcesUrl"
                    :key="item.name"></el-tab-pane>
            </el-tabs>
            <keep-alive include="[]">
                <component :is="activeName" @getActiveName="getActiveName" />
            </keep-alive>
        </div>
        <el-backtop target=".page-component__scroll">
            <img width="48" src="@/assets/order/img_top.png" alt="">
        </el-backtop>
    </div>
</template>

<script>
import todayAchievement from './todayAchievement'; //今日业绩分析
import historyAchievement from './historyAchievement'; //历史业绩分析
import compliance from './compliance'; //合规分析
import conversion from './conversion'; //转化分析
import duration from './duration'; //时长分析
import cancel from './cancel'; //取消分析
export default {
    name: 'orderAnalysis',
    components: {
        todayAchievement,
        historyAchievement,
        compliance,
        conversion,
        duration,
        cancel
    },
    data() {
        return {
            moduleName: '/orderAnalysis',
            activeName: 'todayAchievement',
            menuOptions: [],
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
                    .filter(j => j.resourcesUrl != '/dataServer/orderAnalysis')
                    .map(item => {
                        return { ...item, resourcesUrl: item.resourcesUrl.substring('/dataServer/orderAnalysis/'.length) };
                    });
                this.activeName = (this.$judgeType(this.menuOptions, [])[0] || {}).resourcesUrl || '';
            }
        },
    },
    methods: {
        getActiveName() {
            let activeName = this.$route.params.activeName || '';
            if (activeName) {
                this.activeName = activeName;
            }
        },
    },
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
    }

    /deep/ .el-tabs__active-bar {
        height: 0;
    }

    /deep/ .el-tabs__nav-wrap::after {
        width: 0;
    }
}
</style>
