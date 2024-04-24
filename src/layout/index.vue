<template>
    <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">
        <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
        <sidebar class="sidebar-container" :style="{}" v-show="hideTabs" :routerData.sync="routerData" />
        <div :class="{ hasTagsView: needTagsView, isActive: addClass }" :style="!hideTabs ? 'margin-left: 0px' : ''" class="main-container">
            <div :class="{ 'fixed-header': fixedHeader }">
                <navbar />
            </div>
            <app-main v-if="isMain" />
            <right-panel v-if="showSettings">
                <settings />
            </right-panel>
        </div>
    </div>
</template>

<script>
import RightPanel from '@/components/RightPanel';
import {AppMain, Navbar, Sidebar } from './components';
import ResizeMixin from './mixin/ResizeHandler';
import { mapState } from 'vuex';
import variables from '@/assets/styles/variables.scss';
import { mapActions } from 'vuex';
import Cookies from "js-cookie";
function filterSystemUrls(arr, temp = []) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].category === 4) {
            temp.push({ path: arr[i].resourcesUrl, systemCode: arr[i].systemCode, moduleName: arr[i].resourcesName });
        }
        if (arr[i].children) {
            filterSystemUrls(arr[i].children, temp);
        }
    }
    return temp;
}
export default {
    name: 'Layout',
    data() {
        return {
            routerData: [],
            isShow: false,
            isMain: false,
        };
    },
    components: {
        AppMain,
        Navbar,
        RightPanel,
        Sidebar
    },
    mixins: [ResizeMixin],
    computed: {
        ...mapState({
            theme: state => state.settings.theme,
            sidebar: state => state.app.sidebar,
            device: state => state.app.device,
            showSettings: state => state.settings.showSettings,
            needTagsView: state => state.settings.tagsView,
            fixedHeader: state => state.settings.fixedHeader,
            hideTabs: state => state.settings.hideTabs,
        }),
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation,
                mobile: this.device === 'mobile',
            };
        },
        variables() {
            return variables;
        },
        addClass() {
            return this.$route.meta.subName === 'ordersystem';
        },
    },
    async created() {
        let userInfo = this.$baseMethod.getStore('_ccmUser') || this.$baseMethod.getCookies('WS_KEY');
        if (userInfo) {
            Cookies.set('X-Uid', userInfo.id)
            this.$watermark.set(userInfo.loginName + '　' + this.$baseMethod.formatData(userInfo.loginTime, 'yyyy-MM-dd hh:mm'));
            this.$baseMethod.setStore('_ccmUser', JSON.stringify(userInfo));
            await this.getMenuList().then(() => {
                let menuList = this.$store.state.login.menuList;
                this.$store.dispatch('breadcrumb/setSystemUrls', filterSystemUrls(menuList))
                this.$baseMethod.setStore('os-menuList', JSON.stringify(menuList));
                this.isMain = true;
            });
            this.getSystemList()
        } else {
            this.$baseMethod.removeStore('_ccmUser');
            this.$router.replace({ name: 'login' });
        }
    },
    methods: {
        ...mapActions({
            getMenuList: 'login/getMenuList',
            getSystemList:'systemList/getSystemList'
        }),
        handleClickOutside() {
            this.$store.dispatch('app/closeSideBar', { withoutAnimation: false });
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/mixin.scss';
@import '~@/assets/styles/variables.scss';

.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}

.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px);
}

.mobile .fixed-header {
    width: 100%;
}
</style>
