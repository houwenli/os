<template>
    <!-- app端权限 -->
    <div class="mechanism">
        <tree
            ref="tree"
            :defaultExpandedKeys="appDefaultKeys"
            :defaultProps="appRoleProps"
            :nodeKey="appData.nodeKey"
            :headerName="appData.headerName"
            :getData="appData.getData"
            :placeholder="appData.placeholder"
            @treeSelet="e => $emit('appTreeSelet', e)"
        />
    </div>
</template>

<script>
import tree from './tree.vue';
import {mapState} from 'vuex'

export default {
    name: 'appTree',
    components: { tree },
    data() {
        return {
            appRoleProps: {
                children: 'children', // tree 子节点信息
                label: 'name', // tree节点显示信息
                disabled:'disabled'
            },
            appData: {
                getData: {
                    op: 'selectTree',
                    data: {
                        clientType: 2
                    }
                },
                nodeKey: 'id', // tree 唯一节点
                placeholder: '请搜索系统功能', // 搜索提示信息
                headerName: {
                    selected: '已选择',
                    choice: '功能权限勾选',
                    type:2
                }
            }
        };
    },
    computed: {
       ...mapState({
        appDefaultKeys: state => state.role.appDefaultKeys
      }),
    },
    methods: {
        getTreeKeys() {
            return this.$refs.tree.getTreeKeys(); // 获取勾选tree id
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
