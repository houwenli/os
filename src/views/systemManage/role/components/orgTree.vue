<template>
    <!-- 机构授权 -->
    <div class="mechanism">
        <!-- tree -->
        <treeLazy
            class="tree"
            @orgLoading="orgTreeLoading = false"
            ref="tree"
            :defaultProps="orgProps"
            :headerName="orgTree.headerName"
            :nodeKey="orgTree.nodeKey"
            :visibleArea="true"
            :control="false"

            @update-active-tab='onUpdateActiveTab'
        ></treeLazy>
    </div>
</template>

<script>
import treeLazy from './treeLazy';
export default {
    name: 'orgPowerTree',
    components: { treeLazy },
    data() {
        return {
            orgProps: {
                children: 'children',
                label: 'name',
                isLeaf: 'isLeaf',
                disabled: 'disabled'
            },
            // tree 配置
            orgTree: {
                nodeKey: 'id',
                placeholder: '请搜索机构名称',
                headerName: {
                    selected: '已选机构',
                    choice: '机构权限选择',
                    type:3
                }
            }
        };
    },
    methods: {
      onUpdateActiveTab(type) {
        this.$emit('update:value', type)
      }
    }
};
</script>

<style scoped lang="scss">
.mechanism {
    // height: 736px;
    border-radius: 4px;
    margin-bottom: 24px;
    /deep/ .tree {
        .conterBox {
            height: 696px;
        }
    }
    /deep/ .ws-city {
        width: 100%;
        .el-cascader {
            width: 100%;
        }
    }

    /deep/ .form {
        border-bottom: 1px solid #dcdfe6;
        margin-bottom: 15px;
        .formItem {
            margin-bottom: 15px;
        }
    }
    /deep/ .buttons {
        width: 100%;
    }
}
</style>
