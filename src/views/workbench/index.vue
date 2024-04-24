<template>
    <menu-card :menuOptions="menuOptions" />
</template>

<script>
import menuCard from '@/components/menuCard';
export default {
    name: 'workbench',
    data() {
        return {
            moduleName: '/workbench',
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
    }
};
</script>
