<!--
 * @Author: DaiYu
 * @Date: 2022-03-22 11:04:06
 * @LastEditors: DaiYu
 * @LastEditTime: 2022-03-22 11:10:36
 * @FilePath: \main\src\views\systemManage\index.vue
-->
<template>
    <div class="app-container content-box">
        <menu-card :menuOptions="menuOptions" />
    </div>
</template>

<script>
import menuCard from '@/components/menuCard';
export default {
    name: 'systemManage',
    data() {
        return {
            moduleName: '/systemManage/index',
            menuOptions: []
        };
    },
    components: { menuCard },
    watch: {
        defaultMenuOptions: {
            deep: true,
            immediate: true,
            handler: function (newV) {
                this.menuOptions = (newV || {}).menuList;
            }
        }
    }
};
</script>
