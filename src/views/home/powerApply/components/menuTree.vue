<template>
    <div class="tree-panel">
        <div class="tree-header">
            <div class="title">
                功能授权
                <span class="warning-text">*为页面中有功能授权选中项</span>
            </div>
            <div>
                <el-button-group>
                    <el-radio-group v-model="complaint">
                        <el-radio-button label="web">
                            Web端oa
                            <i :style="{ opacity: web.checkedKeys.length ? 1 : 0 }" class="tab-icon">*</i>
                        </el-radio-button>
                        <el-radio-button label="app">
                            云办公App
                            <i :style="{ opacity: app.checkedKeys.length ? 1 : 0 }" class="tab-icon">*</i>
                        </el-radio-button>
                        <el-radio-button label="applet">
                            DataBI小程序
                            <i :style="{ opacity: applet.checkedKeys.length ? 1 : 0 }" class="tab-icon">*</i>
                        </el-radio-button>
                    </el-radio-group>
                </el-button-group>

                <el-button type="text" @click="isShow = !isShow" style="margin-left: 20px">
                    {{ isShow ? '收起' : '展开' }}&nbsp;
                    <i :class="isShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </el-button>
            </div>
        </div>

        <el-collapse-transition>
            <div v-show="isShow">
                <webPowerTree :list="defaultData.web" v-show="complaint === 'web'" @update-tree="obj => onUpdateTree('web', obj)" :type="complaint" />
                <appPowerTree :list="defaultData.app" v-show="complaint === 'app'" @update-tree="obj => onUpdateTree('app', obj)" :type="complaint" />
                <appletPowerTree :list="defaultData.applet" v-show="complaint === 'applet'" @update-tree="obj => onUpdateTree('applet', obj)" :type="complaint" />
            </div>
        </el-collapse-transition>
    </div>
</template>

<script>
// 总部权限申请-web端总部
import webPowerTree from './webPowerTree.vue'
import appPowerTree from './appPowerTree.vue'
import appletPowerTree from './appletPowerTree.vue'

export default {
    name: 'menuTree',
    props: {
        /**
         * 重新提交数据回填的逻辑
         */
        defaultData: {
            type: Object,
            default: () => {
                return {
                    web: [],
                    app: [],
                    applet: []
                }
            }
        }
    },
    components: {
        webPowerTree,
        appPowerTree,
        appletPowerTree
    },
    data() {
        return {
            isShow: true,

            complaint: 'web',

            // 分别存储Tree选中的key
            web: {
                // 全选
                checkedKeys: [],
                // 半选
                halfCheckedKeys: [],
                // 全选 + 半选
                all: []
            },
            app: {
                checkedKeys: [],
                halfCheckedKeys: [],
                all: []
            },
            applet: {
                checkedKeys: [],
                halfCheckedKeys: [],
                all: []
            }
        }
    },
    methods: {
        /**
         * 提供事件的方式实时更新数据
         */
        onUpdateTree(type, obj) {
            this[type] = obj

            this.$emit('update-tree', {
                web: this.web,
                app: this.app,
                applet: this.applet
            })
        },

        /**
         * 获取节点选中的数据
         * ref 提供给父组件使用
         */
        getTreeNodes() {
            return {
                web: this.web,
                app: this.app,
                applet: this.applet
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import './tree.scss';

.warning-text {
    color: #f05259;
    font-weight: normal;
    font-size: 14px;
}
</style>
