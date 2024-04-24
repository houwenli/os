<template>
    <el-breadcrumb :class="['app-breadcrumb', bannerStyle && 'whiteBg']" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
                <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1" class="no-redirect">{{ item.meta.title }}</span>
                <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
            </el-breadcrumb-item>
        </transition-group>
        <!-- <i class="el-icon-full-screen" style="position: absolute;right: 10px; font-size: 25px;line-height: 48px" @click="toggleSideBar"></i> -->
    </el-breadcrumb>
</template>

<script>
export default {
    data() {
        return {
            levelList: null
        };
    },
    watch: {
        $route(route) {
            // if you go to the redirect page, do not update the breadcrumbs
            if (route.path.startsWith('/redirect/')) {
                return;
            }
            this.getBreadcrumb();
        }
    },
    computed: {
        bannerStyle() {
            let isWhite = ['systemManage', 'businessSystem'];
            return isWhite.includes(this.$route.name);
        }
    },
    created() {
        this.getBreadcrumb();
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('settings/toggleTabs');
        },
        getBreadcrumb() {
            // only show routes with meta.title
            let matched = this.$route.matched.filter(item => item.meta && item.meta.title);
            const first = matched[0];
            // console.error(matched,this.$route)

            if (!this.isDashboard(first)) {
                matched = [{ path: '/index', meta: { title: '首页' } }].concat(matched);
            }

            this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);
        },
        isDashboard(route) {
            const path = route && route.path;
            if (!path) {
                return false;
            }
            return path;
        },
        handleLink(item) {
            const { redirect, path } = item;
            if (redirect) {
                this.$router.push(redirect);
                return;
            }
            this.$router.push(path);
        }
    }
};
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
    width: 100%;
    display: inline-block;
    font-size: 18px;
    line-height: 48px;
    padding-left: 24px;
    font-weight: 600;
    a {
        color: #606266;
    }
    .no-redirect {
        color: #909399;
        cursor: text;
        font-weight: 500;
    }
    /deep/ .el-breadcrumb__separator {
        font-weight: 500;
        color: #909399;
    }
}
.whiteBg {
    background: white !important;
}
</style>
