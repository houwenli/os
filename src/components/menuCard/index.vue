<template>
    <div class="app-container content-box module_page">
        <div class="content">
            <card-list v-if="lists.cardList.length > 0" :list="lists.cardList" @goToPage="goToPage" />
            <div v-for="(menu, index) in lists.moduleList" :key="menu.id">
                <div v-if="lists.moduleList && lists.moduleList.length > 0 && menu.children && menu.children.length > 0">
                    <header :style="{ padding: index === 0 ? '8px 0 16px' : '16px 0' }" class="module_title">{{ menu.resourcesName }}</header>
                    <card-list v-if="$judgeType(menu.children, []).length > 0" :list="menu.children" @goToPage="goToPage" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import cardList from './card';
import { mapState } from 'vuex';
export default {
    name: 'menuCard',
    props: {
        menuOptions: {
            type: Array,
            default: () => [],
        },
    },
    components: { cardList },
    computed: {
        ...mapState('breadcrumb', ['records']),
        lists() {
            let list = this.$judgeType(this.menuOptions, []);
            const moduleList = list.filter(item => !item.resourcesUrl);
            const cardList = list.filter(item => item.resourcesUrl);
            return { moduleList, cardList };
        },
    },
    methods: {
        async goToPage(item) {
            // 如果打开的是运力图谱，清除存储的省市数据（存储数据解决返回问题）
            if (resourcesUrl == '/workbench/transportMap') {
                sessionStorage.removeItem('map-cityCode');
                sessionStorage.removeItem('map-updateCode');
            }
            let { resourcesUrl, systemCode, id } = item;

            if (systemCode === 'TWOWHEELERSCREEN') {
                // 两轮车数据大屏直接用浏览器新窗口打开
                const {token}=this.$baseMethod.getStore('_ccmUser')
                window.open('https:/'+resourcesUrl+'?token='+token+'&menuId='+id,'_blank')
                // window.open('http://' + resourcesUrl.slice(1) + '?token='+token+'&menuId='+id,'_blank')
                return
            }

            let subApp = this.records.find(v => systemCode && v.systemCode === systemCode);
            resourcesUrl = subApp ? subApp.path : resourcesUrl;
            this.$router.push({ path: resourcesUrl, query: subApp?.query });
        },
    },
};
</script>

<style lang="scss" scoped>
.module_page {
    .module_title {
        font-size: 16px;
        font-weight: bold;
        color: #303133;
        line-height: 16px;
    }
}
</style>
