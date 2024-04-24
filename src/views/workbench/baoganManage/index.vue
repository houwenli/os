<!--
 * @Author: DaiYu
 * @Date: 2022-04-21 09:03:25
 * @LastEditors: DaiYu
 * @LastEditTime: 2022-05-12 15:28:51
 * @FilePath: \main\src\views\workbench\baoganManage\index.vue
-->
<template>
    <div>
        <!-- 三级路由缓存问题 -->
        <!-- <tabs></tabs>
        <router-view></router-view> -->
    </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
    name: 'BaoganManage',
    data() {
        return {
            moduleName: '/workbench/baoganManage',
        }
    },
    computed: {
        ...mapState({
            menuList: state => state.login.menuList
        }),
        firstTabOptions() {
            // 获取工作台菜单
            // let workbenchModule = this.menuList.find(({ resourcesUrl }) => resourcesUrl === '/workbench')?.children || [];
            // 获取包干管理菜单
            let baoganModule = this.defaultMenuOptions.menuList;

            // console.log(this.getModulePower('/workbench/baoganManage'));
            // workbenchModule.forEach(element => {
            //     console.log(element.resourcesUrl, element.resourcesName, element.children);
            //     element.children.forEach(i => {
            //         console.log(i, i.resourcesName);
            //     });
            // });
            // console.log(workbenchModule);
            let menu = baoganModule[0]
            if (menu.category == 1 && !menu.resourcesUrl) {
                menu = menu.children[0]
            }
            return menu
        }
    },
    mounted() {
        if (this.$route.name === 'baoganManage') {
            if (this.firstTabOptions) {
                setTimeout(() => {
                    this.$router.replace({ path: this.firstTabOptions.resourcesUrl });
                })
            } else {
                this.$message.error('无权限访问');
            }
        }
    },
    activated() {
        if (this.$route.name === 'baoganManage') {
            if (this.firstTabOptions) {
                setTimeout(() => {
                    this.$router.replace({ path: this.firstTabOptions.resourcesUrl });
                })
            } else {
                this.$message.error('无权限访问');
            }
        }
    },
};
</script>
