<!--
 * @Author: DaiYu
 * @Date: 2022-03-24 10:31:42
 * @LastEditors: DaiYu
 * @LastEditTime: 2022-04-08 17:05:26
 * @FilePath: \main\src\views\workbench\baoganManage\components\tabs.vue
-->
<template>
    <div class="content-style">
        <el-tabs class="tab-wrap" v-model="activeMenu" @tab-click="handleClick">
            <el-tab-pane v-for="(tab, index) in menuOptions" :key="index" :label="tab.resourcesName" :name="tab.resourcesUrl"></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'Tabs',
    data() {
        return {
            activeMenu: '',
        };
    },
    props: {
        moduleName: {
            type: String,
            required: true
        }
    },
    computed: {
        ...mapState({
            menuList: state => state.login.menuList,
        }),
        menuOptions() {
            const dfsTraversalDefaultMenu = (
                menuData,
                _data = {
                    name: '',
                    menuList: [],
                }
            ) => {
                for (let item of menuData) {
                    if ((item.category == 1 || item.category == 4) && item.resourcesUrl === _data.path) {
                        if (item.children && item.children.length > 0) {
                            _data.menuList = [..._data.menuList, ...item.children];
                        }
                    }
                    if (item.children) {
                        dfsTraversalDefaultMenu(item.children, _data);
                    }
                }
                return _data;
            };
            let menuList =
                dfsTraversalDefaultMenu(this.menuList, {
                    path: this.moduleName,
                    menuList: [],
                })?.menuList || [];
            return menuList;

            // // 获取工作台菜单
            // let workbenchModule = this.menuList.find(({ resourcesUrl }) => resourcesUrl === '/workbench')?.children || [];
            // // 获取包干管理菜单
            // let workModule =
            //     workbenchModule.find(i => {
            //         return (i.resourcesName = '业务管理');
            //     })?.children || [];
            // let baoganModule = workModule.find(({ resourcesUrl }) => resourcesUrl === this.moduleName)?.children || [];
            // return baoganModule;
        },
    },
    mounted() {
        this.activeMenu = this.$route.path;
    },
    activated() {
        this.activeMenu = this.$route.path;
    },
    methods: {
        handleClick(v) {
            this.$router.push({
                path: this.activeMenu,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.content-style {
    padding: 24px 24px 0;
    background-color: #fff;
    border-radius: 8px 8px 0 0;
}
::v-deep .el-tabs__header {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 0;
}
.tab-wrap {
    ::v-deep .el-tabs__nav-wrap {
        background-color: #f5f7fa;
        border-radius: 4px;
    }
}
::v-deep .el-tabs__item {
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
        // border-radius: 4px 0px 0px 4px;
        border-radius: 0px 4px 4px 0px;
    }
}
::v-deep .el-tabs__active-bar {
    height: 0;
}
::v-deep .el-tabs__nav-wrap::after {
    width: 0;
}
/deep/ .ws-table-warp {
    padding: 24px 0 !important;
}
</style>
