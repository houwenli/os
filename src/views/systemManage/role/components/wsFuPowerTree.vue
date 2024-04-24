<template>
    <!--  分支机构/万顺福app权限   -->
    <div class="mechanism">
        <tree
            ref="tree"
            :defaultExpandedKeys="appDefaultKeys"
            :defaultProps="wsFuRoleProps"
            :nodeKey="wsFuData.nodeKey"
            :headerName="wsFuData.headerName"
            :getData="getData"
            :placeholder="wsFuData.placeholder"
            v-if="showTree"
            :key="refreshKey"
        />
    </div>
</template>

<script>
import tree from './tree';
import { mapState } from 'vuex'

export default {
  name: 'wsFuPowerTree',
  components: { tree },
  data () {
    return {
      wsFuRoleProps: {
        label: 'name',
        value: 'id',
        children: 'children',
      },
      wsFuData: {
        nodeKey: 'id', // tree 节点id
        headerName: {
          selected: '云办公App已选择',
          choice: '云办公App功能权限选择',
        },
        placeholder: '请搜索系统功能',
      },
      refreshKey: 0
    };
  },

  computed: {
    ...mapState({
      orgType: state => state.role.orgType,
      appDefaultKeys: state => state.role.appDefaultKeys
    }),
    getData () {
      return {
        op: 'selectTree',
        data: {
          clientType: 2,
          orgType: this.orgType,
        }
      }
    },
    /**
    * 当存在orgType的时候才显示树
    */
    showTree () {
      return ![undefined, null, ''].includes(this.orgType)
    }
  },
  watch: {
    orgType () {
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
