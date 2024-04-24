<template>
    <!-- web端权限 / OA总部 -->
    <div class="mechanism">
        <tree
            ref="tree"
            :defaultExpandedKeys="webDefaultKeys"
            :defaultProps="webRolePropsdisable"
            :nodeKey="webData.nodeKey"
            :headerName="webData.headerName"
            :getData="webData.getData"
            :placeholder="webData.placeholder"
            @treeSelet="e => $emit('webTreeSelet', e)"
        />
    </div>
</template>

<script>
import tree from './tree'
import { mapState } from 'vuex'

export default {
    name: 'webTree',
    components: { tree },
    data() {
        return {
            webRoleProps: {
                children: 'children',
                label: 'name'
            },
            webRolePropsdisable : {
                children: 'children', // tree 子节点信息
                label: 'name',
                disabled: 'disabled' // 新增disable属性
            },
            webData: {
                getData: {
                    op: 'selectTree',
                    data: {
                        clientType: 1
                    }
                },
                nodeKey: 'id', // tree 唯一节点
                placeholder: '请搜索系统功能', // 搜索提示信息
                headerName: {
                    selected: '已选择',
                    choice: '功能权限勾选',
                    type:1
                }
            }
        };
    },

    computed: {
      ...mapState({
        webDefaultKeys: state => state.role.webDefaultKeys,
      })
    },
    methods: {
    },
};
</script>
<style scoped lang="scss">
.mechanism {
    height: 620px;
    border-radius: 4px;
    margin-bottom: 24px;
    /deep/.conterBox{
        padding: 24px !important;
    }
}
</style>
