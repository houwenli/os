<template>
    <!--  分支机构/web oa 权限   -->
    <div class="mechanism" >
        <tree
            ref="tree"
            :defaultExpandedKeys="webDefaultKeys"
            :defaultProps="webOARoleProps"
            :nodeKey="webOAData.nodeKey"
            :headerName="webOAData.headerName"
            :getData="getData"
            :placeholder="webOAData.placeholder"
            v-if="showTree"
            :key='refreshKey'
        />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import tree from './tree.vue'

export default {
  name: 'webOAPowerTree',
  components: { tree },
  data () {
    return {
      webOARoleProps: {
        label: 'name',
        children: 'children',
      },
      webOAData: {
        nodeKey: 'id', // tree 节点id
        headerName: {
          selected: 'Web端OA系统已选择',
          choice: 'Web端OA系统功能权限选择',
        },
        placeholder: '请搜索系统功能',
      },

      refreshKey: 0
    };
  },

  computed: {
    ...mapState({
      orgType: state => state.role.orgType,
      webDefaultKeys: state => state.role.webDefaultKeys
    }),
    getData () {
      return {
        op: 'selectTree',
        data: {
          orgType: this.orgType
        },
      };
    },
    /**
     * 当存在orgType的时候才显示树
     */
    showTree () {
      return ![undefined, null, ''].includes(this.orgType)
    }
  },
  watch: {
    orgType() {
      // orgType改变，直接让组件重建
      this.refreshKey = Date.now()
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
