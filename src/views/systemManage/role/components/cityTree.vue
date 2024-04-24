<template>
    <!-- 城市权限 -->
    <div class="mechanism">
        <el-row>
            <tree
                ref="tree"
                :defaultExpandedKeys="cityDefaultKeys"
                :placeholder="cityDate.placeholder"
                :defaultProps="cityTreePropsdisable"
                :nodeKey="cityDate.nodeKey"
                :headerName="cityDate.headerName"
                :getData="cityDate.getData"
                :visibleArea="true"
                :control="false"

                @update-active-tab='onUpdateActiveTab'
            />
        </el-row>
    </div>
</template>

<script>
import tree from './tree.vue';
import {mapState} from 'vuex'

export default {
    name: 'cityTree',
    components: { tree },
    data() {
        return {
            cityTreeProps: {
                children: 'childCityList', // tree 子节点信息
                label: 'name',
            },
            cityTreePropsdisable : {
                children: 'childCityList', // tree 子节点信息
                label: 'name',
                disabled: 'disabled' // tree节点显示信息
            },
            cityDate: {
                placeholder: '请输入省份或城市名称',
                nodeKey: 'code',
                headerName: {
                    selected: '已选城市',
                    choice: '城市权限选择',
                    type:4
                },
                getData: {
                    op: 'getCityTreeByDrop',
                    data: ''
                }
            }
        };
    },
    computed: {
      ...mapState({
        cityDefaultKeys: state => state.role.cityDefaultKeys,
        deptDisabled: state => state.role.cityDefaultKeys
      })
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
    // height: 620px;
    border-radius: 4px;
    margin-bottom: 24px;
}
</style>
