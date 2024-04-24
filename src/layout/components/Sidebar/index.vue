<template>
    <div :class="{ 'has-logo': showLogo }">
        <logo v-if="showLogo" :collapse="isCollapse" />
        <el-scrollbar wrap-class="scrollbar-wrapper" class="main-box" style="height: calc(100% - 282px)">
            <el-menu :default-active="activeMenu" :collapse="isCollapse" background-color="#202F52" text-color="#909399"
                active-text-color="#fff" :collapse-transition="false" mode="vertical">
                <sidebar-item v-if="route.resourcesName !== '我要投诉'"
                    v-for="(route, index) in menuList" :key="`${route.resourcesUrl}${index}`" :item="route"
                    :base-path="route.resourcesUrl" />
            </el-menu>
        </el-scrollbar>
        <div :class="sidebar.opened ? 'complaintBox' : 'complaintBox complaintBoxActive'">
            <complaint v-if="route.resourcesName == '我要投诉'" v-for="route in menuList" :key="route.resourcesUrl"
                :is-active="sidebar.opened" class="complaint-container" />
        </div>
        <div :class="sidebar.opened ? 'hamburgerBox' : 'hamburgerBox hamburgerBoxActive'">
            <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
                @toggleClick="toggleSideBar" />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import Logo from './Logo';
import SidebarItem from './SidebarItem';
import Hamburger from '@/components/Hamburger';
import complaint from '@/components/Complaint';

function formatSystemMenuPath(menuList) {
    let records = {};
    let help = (res, level = 0, rootPath) => {
        if (level == 0) {
            rootPath = res.resourcesUrl;
        }
        if (res.category == 4 && res.systemCode) {
            records[res.systemCode] = rootPath;
        }
        if (res.children) {
            res.children.map(v => help(v, level + 1, rootPath));
        }
    };
    menuList.map(item => help(item));
    return records;
}
export default {
    props: {
        routerData: { type: Array },
    },
    data() {
        return {
            methodList: {},
            routerLinkList: [],
        };
    },
    methods: {
        ...mapActions('loadMicroApp', ['unmountSubApp', 'mountSubApp']),
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar');
        },
        dfsTraversalData(menuData) {
            for (let item of menuData) {
                //type 0：无页面菜单，1：功能菜单（方法）2：有页面菜单

                if (item.category == 1 && item.resourcesUrl) {
                    this.routerLinkList.push({ resourcesName: item.resourcesName, resourcesUrl: this.getPath(item) });
                    this.getMethodList(this.getPath(item), item.children || []);
                }

                if (item.children) {
                    this.dfsTraversalData(item.children);
                }
            }
        },
        getMethodList(path, data) {
            let methodList = {};
            for (let item of data) {
                if (!item.children || item.category == 1) {
                    continue;
                }
                for (let child of item.children) {
                    if (!child.op) continue;
                    methodList[child.op] = {
                        resourcesName: child.resourcesName,
                        resourcesUrl: this.getPath(child),
                    };
                }
            }
            if (Object.keys(methodList).length > 0) {
                this.methodList[path] = methodList;
            }
        },
        getPath(item) {
            let path = item.resourcesUrl || '';
            if (path && !path.startsWith('/')) {
                path = '/' + path;
            }
            return path;
        }
    },
    components: { SidebarItem, Logo, Hamburger, complaint },
    watch: {
        menuList(val) {
            if (val.length) {
                this.dfsTraversalData(val);
                sessionStorage.setItem('os-methodList', JSON.stringify(this.methodList));
                this.$emit('update:routerData', this.routerLinkList);
            }
        },
    },
    computed: {
        ...mapState('loadMicroApp', ['appCache']),
        ...mapGetters('login', ['menuList']),
        ...mapState(['settings']),
        ...mapGetters(['sidebar']),
        ...mapState('subStore', ['systemConfigProject']),
        ...mapState('breadcrumb', ['pathMap']),
        pathToSystemMenu({ menuList }) {
            return formatSystemMenuPath(menuList);
        },
        activeMenu() {
            const { meta, matched, path } = this.$route;
            let { systemCode = meta.systemCode } = this.pathMap[path] || {}
            // 子应用通过systemCode匹配父级路由path
            if (meta.subName) {
                return this.pathToSystemMenu[systemCode];
            } else {
                return meta.activeMenu || matched[0].path || matched[0].redirect;
            }
        },
        showLogo() {
            return this.$store.state.settings.sidebarLogo;
        },
        isCollapse() {
            return !this.sidebar.opened;
        }
    }
};
</script>
<style>
.bs {
    overflow-y: scroll;
}
</style>
