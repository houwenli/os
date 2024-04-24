<!--
 * @Author: DaiYu
 * @Date: 2022-09-13 09:11:17
 * @LastEditors: DaiYu
 * @LastEditTime: 2022-09-16 10:54:33
 * @FilePath: \main\src\views\workbench\order-map\components\tabs.vue
-->
<template>
    <div class="content-style">
        <el-tabs class="tab-wrap" v-model="activeMenu" @tab-click="tabChange">
            <el-tab-pane v-for="(tab, index) in menuOptions" :key="index" :label="tab.resourcesName" :name="tab.resourcesUrl"></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
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
                    path: '/workbench/orderMap',
                    menuList: [],
                })?.menuList || [];
            return menuList;
        },
    },
    data() {
        return {
            moduleName: '/workbench/orderMap',
            activeMenu: '',
        };
    },
    mounted() {
        this.activeMenu = this.$route.path;
    },
    activated() {
        this.activeMenu = this.$route.path;
    },
    methods: {
        tabChange() {
            this.$router.push({
                path: this.activeMenu,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.content-style {
    display:flex;
    justify-content: center;
    padding: 24px 0;
    flex: 0 0 88px;
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
    min-width: 132px;
    height: 40px;
    text-align: center;
    color: #606266;
    font-size: 14px;
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

</style>
