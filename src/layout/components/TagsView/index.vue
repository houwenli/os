<template>
    <div id="tags-view-container" class="tags-view-container">
        <scroll-pane v-if="menuList.length" ref="scrollPane" class="tags-view-wrapper">
            <div v-for="(tag, index) in visitedViews" ref="tag" :key="index"
                :class="tag.path === $route.path ? 'active' : ''"
                :style="{ paddingRight: visitedViews.length > 1 ? '8px' : '21px', ...(tag.path === $route.path ? { 'background-color': '#F0F2F5', color: '#F05259' } : '') }"
                class="tags-view-item" @click="selectedTagFun(tag)">
                <span>
                    <span class="tag-name">{{ tag.moduleName }}</span>
                </span>
                <img v-if="visitedViews.length > 1" class="icon-close"
                    @click.prevent.stop="closeSelectedTag(tag, index)" src="@/assets/images/icon_close.png" alt="" />
            </div>
        </scroll-pane>
    </div>
</template>

<script>
import ScrollPane from './ScrollPane';
import { mapGetters, mapState } from 'vuex';

export default {
    components: { ScrollPane },
    data() {
        return {};
    },
    computed: {
        ...mapGetters('login', ['menuList']),
        ...mapState('subStore', ['systemConfigProject']),
        ...mapState('breadcrumb', ['pathMap', 'records']),
        ...mapState('loadMicroApp', ['appCache']),
        visitedViews() {
            return this.records;
        }
    },
    watch: {
        records: {
            immediate: true,
            handler() {
                this.$parent.arrowInit()
            }
        }
    },
    methods: {
        selectedTagFun(view) {
            if (view.path === this.$route.path) return
            this.$router.push({ path: view.path, query: view.query })
        },
        closeSelectedTag(view, index) {
            this.$store.commit('breadcrumb/clear', index)
            let lastView = this.records[this.records.length - 1]
            if (lastView.path === this.$route.path) return
            if (lastView) {
                this.$router.push({ path: lastView.path, query: lastView.query })
            } else {
                if (view.name === 'Dashboard') {
                    this.$router.replace({ path: '/redirect' + view.fullPath });
                } else {
                    this.$router.push('index');
                }
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.tags-view-wrapper {
    .tags-view-item {

        // .el-icon-close {
        //     width: 16px;
        //     height: 16px;
        //     vertical-align: 2px;
        //     border-radius: 50%;
        //     text-align: center;
        //     transition: all .3s cubic-bezier(.645, .045, .355, 1);
        //     transform-origin: 100% 50%;
        //     margin-left: 5px;
        //     &:before {
        //         transform: scale(.6);
        //         display: inline-block;
        //         vertical-align: -6px;
        //         font-size: 24px;
        //     }
        // }
        .icon-close {
            z-index: 10;
            width: 16px;
            height: 16px;
            line-height: 40px;
            margin-left: 24px;
            position: relative;
            top: 3px;
        }
    }
}

.tags-view-container {
    height: 56px;
    width: 100%;
    // background: #fff;
    // border-bottom: 1px solid #d8dce5;
    // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);

    .tags-view-wrapper {
        .tags-view-item {
            display: inline-block;
            position: relative;
            cursor: pointer;
            height: 44px;
            line-height: 40px;
            color: #606266;
            background: #fff;
            padding: 0 8px;
            font-size: 14px;
            // margin-left: 5px;
            margin-top: 12px;

            // a {
            //     position: relative;
            //     z-index: 10;
            // }

            &:first-of-type {
                margin-left: 15px;
            }

            &:last-of-type {
                margin-right: 15px;
            }

            &::before {
                content: '';
                background: #dcdfe6;
                display: inline-block;
                width: 1px;
                height: 16px;
                line-height: 26px;
                position: relative;
                left: -9px;
                top: 4px;
            }

            &.active {
                background-color: #a52a2a;
                color: #fff;
                border-radius: 8px;
                position: relative;

                span {
                    &::before {
                        content: '';
                        display: block;
                        width: 16px;
                        height: 16px;
                        background: #f0f2f5;
                        position: absolute;
                        left: -10px;
                        bottom: 0;
                        z-index: 1;
                    }

                    &::after {
                        content: '';
                        display: block;
                        width: 16px;
                        height: 16px;
                        background: #f0f2f5;
                        position: absolute;
                        right: -10px;
                        bottom: 0;
                        z-index: 1;
                    }
                    // a
                    .tag-name {
                        position: initial !important;

                        &::after {
                            content: '';
                            display: block;
                            position: absolute;
                            bottom: 0;
                            right: -16px;
                            width: 16px;
                            height: 16px;
                            border-radius: 0 0 0 100%;
                            background: #fff;
                            // border-radius: 10px;
                            z-index: 2;
                        }

                        &::before {
                            content: '';
                            display: block;
                            position: absolute;
                            bottom: 0;
                            left: -16px;
                            width: 16px;
                            height: 16px;
                            background: #fff;
                            z-index: 2;
                            border-radius: 0 0 100% 0;
                        }
                    }
                }
            }
        }

        /deep/ .el-scrollbar__view {
            height: 56px;
            line-height: 56px;
        }
    }

    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

        li {
            margin: 0;
            padding: 7px 16px;
            cursor: pointer;

            &:hover {
                background: #eee;
            }
        }
    }
}
</style>
