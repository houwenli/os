<template>
    <!-- 小程序端权限 -->
    <div class="mechanism">
        <tree
            ref="tree"
            :defaultExpandedKeys="appletDefaultKeys"
            :defaultProps="appRoleProps"
            :nodeKey="appData.nodeKey"
            :headerName="appData.headerName"
            :getData="appData.getData"
            :placeholder="appData.placeholder"
            @tree-change='getTreeNodes'
            @treeSelet="e => $emit('appTreeSelet', e)"
        />
    </div>
</template>

<script>
import {mapState} from 'vuex'
import tree from './tree.vue';

export default {
    name: 'appletTree',
    components: { tree },
    data() {
        return {
            appRoleProps: {
                children: 'children', // tree 子节点信息
                label: 'name' // tree节点显示信息
            },
            appData: {
                getData: {
                    op: 'selectTree',
                    data: {
                        clientType: 3
                    }
                },
                nodeKey: 'id', // tree 唯一节点
                placeholder: '请搜索系统功能', // 搜索提示信息
                headerName: {
                    selected: '已选择',
                    choice: '功能权限勾选'
                }
            }
        };
    },
    computed: {
      ...mapState({
        appletDefaultKeys: state => state.role.appletDefaultKeys
      })
    },
    methods: {
        // 可能没有被调用
        getTreeKeys() {
            return this.$refs.tree.getTreeKeys(); // 获取勾选tree id
        },

        /**
         * 方便后续拓展
         */
        getTreeNodes(data) {
          // console.log(data)
        }
    }
};
</script>
<style scoped lang="scss">
.mechanism {
    height: 620px;
    border-radius: 4px;
    margin-bottom: 24px;
}
</style>
