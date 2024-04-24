<!--
 * @Author: DaiYu
 * @Date: 2022-03-24 10:31:42
 * @LastEditors: DaiYu
 * @LastEditTime: 2022-04-08 17:05:26
 * @FilePath: \main\src\views\workbench\baoganManage\components\tabs.vue
-->
<template>
    <div class="content-style" :class="isFolder?'defaultWidth':'addWidth'">
        <!-- <el-tabs class="tab-wrap" v-model="activeMenu" @tab-click="handleClick">
            <el-tab-pane v-for="(tab, index) in menuOptions" :key="index" :label="tab.resourcesName" :name="tab.resourcesUrl"></el-tab-pane>
        </el-tabs> -->
        <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" :collapse="isCollapse">
            <template v-for="(tab, index) in menuOptions">
                <el-submenu v-if="tab.category == 1 && !tab.resourcesUrl" :index="tab.id+''" :key="index" :title="tab.resourcesName">
                    <template slot="title">
                        <span>{{tab.resourcesName}}</span>
                    </template>
                    <el-menu-item v-for="(sub, subIndex) in tab.children" :index="sub.resourcesUrl" :key="subIndex" @click="handleClick(sub)">
                        <span slot="title" :title="sub.resourcesName">{{sub.resourcesName}}</span>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item v-else :index="tab.resourcesUrl" :key="index" @click="handleClick(tab)">
                    <span slot="title" :title="tab.resourcesName">{{tab.resourcesName}}</span>
                </el-menu-item>
            </template>
        </el-menu>
        <div class="arrow-box" @click="changeState">
            <span :class="isFolder?'el-icon-arrow-right':'el-icon-arrow-left'"></span>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'Tabs',
    data() {
        return {
            isCollapse:false,
            moduleName: '/workbench/baoganManage',
            activeMenu: '',
            isFolder:false
        };
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
                    path: '/workbench/baoganManage',
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
            this.activeMenu = v.resourcesUrl
            this.$router.push({
                path: this.activeMenu,
            });
        },
        changeState(){
            this.isFolder=!this.isFolder
            this.$emit('changeWidth',this.isFolder)
        }
    },
};
</script>

<style lang="scss" scoped>
.content-style {
    height:100%;
    overflow-y: auto;
    background-color: #fff;
    border-radius:8px;
    margin-left:-30px;
    padding-top:10px;
    position: relative;
    transition: 0.5s;
    /deep/.el-menu{
        z-index: 100;
        width:100%;
        border: none;
        .el-menu-item{
            border-radius:0 !important;
            span{
                display: inline-block;
                width:100%;
                overflow: hidden;
                white-space:nowrap;
                text-overflow:ellipsis;
            }
            &:hover{
                color:#F05259;
            }
        }
        .el-menu-item.is-active{
            background:rgb(254, 238, 238) !important;
        }
    }
    .arrow-box{
        position:absolute;
        top:50%;
        right:0;
        width: 20px;
        height: 40px;
        background-color: #f5f7fa;
        border-radius: 5px;
        z-index: 2000;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
.defaultWidth{
    width:144px;
}
.addWidth{
    width:200px;
}
</style>
