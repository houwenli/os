<template>
    <div class="app-main-box">
        <!--- 没有菜单列表时隐藏页面展示区域，防止用户给自己把所有权限取消刷新页面之后还可以操作 --->
        <section v-if="menuList.length > 0" class="main-section">
            <!-- 添加keepAlive -->
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive && isMain" class="height-abs app-main" :key="key" />
            </keep-alive>
            <router-view class="height-abs app-main" v-if="!$route.meta.keepAlive && isMain" :key="key" />
            <template>
                <div class="subapp-wrap" v-show="!isMain" id="subapp-viewport"></div>
            </template>
        </section>

        <section v-else class="default-page">
            <div class="default-box">
                <img class="default-img" :src="defaultImg" alt="" />
                <p class="default-txt">当前系统没有访问的权限，请联系管理员处理</p>
            </div>
        </section>
    </div>
</template>

<script>
import { mapState, mapMutations,mapActions } from 'vuex';

export default {
    name: 'AppMain',
    data() {
        return {
            isStyle: true,
            include: [],
            defaultImg: require('../../assets/images/img_no_permission.png')
        };
    },
    computed: {
        ...mapState('breadcrumb', ['records', 'pathMap']),
        ...mapState('login', ['menuList']),
        ...mapState('loadMicroApp', ['appCache']),
        subViews() {
            return this.records.filter(v => v.systemCode)
        },
        key() {
            return this.$route.fullPath;
        },
        isMain() {
            return !this.$route.meta.subName
        }
    },
    methods: {
        ...mapMutations('loadMicroApp', ['addSubApp'])
    },
    mounted() {
        let { $route: { path, meta: { subName, title, activeTags }, query, name }, pathMap } = this
        if (subName) {
            // 子应用页面刷新时
            let { moduleName, systemCode } = pathMap[path]
            console.log('AppMain-mounted', `${subName}-${systemCode}`, document.getElementById(`${subName}-${systemCode}`))
            if (systemCode) {
                // 在mounted里确保容器存在再加载子应用
                if (!this.appCache.some(v => v.systemCode === systemCode)) {
                    this.addSubApp({ path, systemCode, moduleName })
                }
                // 临时兼容乘客中心 获取菜单
                this.$store.commit('subStore/UPDATE_SYSTEM_CONFIG_PROJECT', { moduleName, systemCode })
            }
        } else {
            // 主应用页面首次挂载或页面刷新
            this.$store.commit('breadcrumb/update', { path, moduleName: title, query, activeTags: activeTags || name })
        }

    }
};
</script>

<style lang="scss" scoped>
.app-main-box {
    width: 100%;
    height: calc(100vh - 56px);
    overflow-y: auto;
}

.default-page {
    width: 100%;
    height: 100%;
    padding: 16px;

    .default-box {
        width: 100%;
        height: 100%;
        padding-top: 170px;
        background: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;

        .default-img {
            width: 320px;
            height: 200px;
        }

        .default-txt {
            font-size: 18px;
            color: #606266;
            line-height: 25px;
        }
    }
}

.main-section {
    // min-height: calc(100% - 132px);
    // padding: 24px 24px 24px 24px;
    height: 100%;

    .subapp-wrap {
        height: 100%;
    }

    .fixed_header_warp {
        top: 0 !important;
    }

    .app-main {
        height: 100%;
        // padding: 24px;
        background: #fff;
        border-radius: 8px;
        overflow: auto;
        // transform: scale(1, 1);
        margin: 24px;
    }

    .height-abs {
        padding: 16px 24px 24px 24px !important;
        margin: 0 !important;
        background: none;
    }

    .fixed-header+.app-main {
        padding-top: 50px;
    }

    .hasTagsView {
        .app-main {
            height: calc(100vh - 84px);
            background: #f0f2f5;
        }

        .fixed-header+.app-main {
            padding-top: 84px;
        }
    }
}

.tab-bar {
    ul {
        white-space: nowrap;
        overflow-x: auto;
    }

    .tab-item {
        display: inline-block;
        width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border: 1px solid #ccc;
        margin: 5px;
        cursor: pointer;

        &.active {
            color: #F05259;
            border-color: #F05259;
        }
    }
}
</style>

<style lang="scss">
#subapp-viewport {
    height: 100%;

    // overflow: hidden;
    .web-order {
        .set_btn.fixed-footer {
            z-index: 162;
        }
    }

    .container .logo {
        display: none;
    }
}

#subapp-viewport>div {
    height: 100%;
}

.el-popup-parent--hidden {
    .fixed-header {
        padding-right: 15px;
    }
}

#subapp-viewport {
    .fixed_header_warp {
        top: 0 !important;
    }
}

.subapp-wrap>div {
    height: 100%;
}
</style>
