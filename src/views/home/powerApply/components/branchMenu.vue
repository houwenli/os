<template>
    <div class="tree-panel">
        <div class="tree-header">
            <div class="title">功能授权</div>
            <div>
                <el-button type="text" @click="isShow = !isShow">
                    {{ isShow ? '收起' : '展开' }}&nbsp;
                    <i :class="isShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </el-button>
            </div>
        </div>

        <el-collapse-transition>
            <div v-show="isShow">
                <branchWebOATree @update-tree="obj => onUpdateTree('web', obj)" :orgType="orgType"></branchWebOATree>
                <branchWSFAppTree @update-tree="obj => onUpdateTree('app', obj)" :orgType="orgType"></branchWSFAppTree>
            </div>
        </el-collapse-transition>
    </div>
</template>

<script>
// 首页-分支机构
import branchWebOATree from './branchWebOATree.vue'
import branchWSFAppTree from './branchWSFAppTree.vue'

export default {
    name: 'branchMenu',
    props: {
        // 功能授权/角色层级
        orgType: [String, Number]
    },

    components: {
        branchWebOATree,
        branchWSFAppTree
    },
    data() {
        return {
            isShow: true,
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
                app: this.app
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import './tree.scss';
</style>
