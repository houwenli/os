<!--
 * @Author: DaiYu
 * @Date: 2022-04-21 09:03:25
 * @LastEditors: DaiYu
 * @LastEditTime: 2022-09-13 11:02:09
 * @FilePath: \main\src\views\workbench\order-map\index.vue
-->
<template>
</template>
<script>
export default {
    data() {
        return {
            moduleName: '/workbench/orderMap',
        };
    },
    computed: {
        menuOptions() {
            return this.defaultMenuOptions.menuList || [];
        },
        firstTabOptions() {
            return this.menuOptions[0];
        },
    },
    mounted() {
        if (this.$route.name === 'orderMap') {
            if (this.firstTabOptions) {
                setTimeout(() => {
                    this.$router.replace({ path: this.firstTabOptions.resourcesUrl });
                });
            } else {
                this.$message.error('无权限访问');
            }
        }
    },
    activated() {
        if (this.$route.name === 'orderMap') {
            if (this.firstTabOptions) {
                setTimeout(() => {
                    this.$router.replace({ path: this.firstTabOptions.resourcesUrl });
                });
            } else {
                this.$message.error('无权限访问');
            }
        }
    },
};
</script>
