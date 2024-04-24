<template>
    
</template>
<script>
import { mapState } from 'vuex';
export default {
    name: 'AssetInventory',
    data() {
        return {
            moduleName: '/workbench/assetInventory',
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
            let Module = this.defaultMenuOptions.menuList;
            console.log(Module)
            return Module[0];
        }
    },
    mounted() {
        if (this.$route.name === 'assetInventory') {
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
        if (this.$route.name === 'assetInventory') {
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
