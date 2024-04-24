<template>
    <div class="app-container content-box">
        <menu-card :menuOptions="menuOptions" />
    </div>
</template>

<script>
import menuCard from '@/components/menuCard';
export default {
    name: 'businessSystem',
    data() {
        return {
            moduleName: '/businessSystem/index',
            menuOptions: [],
        };
    },
    components: { menuCard },
    watch: {
        defaultMenuOptions: {
            deep: true,
            immediate: true,
            handler: function (newV) {
                this.menuOptions = (newV || {}).menuList;
            },
        },
    },
};
</script>
<style lang="scss" scoped>
.content-box-title {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 24px;
    margin-top: 8px;
}
</style>
