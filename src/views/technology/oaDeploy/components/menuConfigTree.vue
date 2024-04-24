<template>
  <div data-desc="功能菜单配置" class="feature-menu-config-tree" :class="className">
    <div class="config-title">{{ title }}</div>
    <template v-if="treeList.length">
      <el-tree class="op-tree" :props="defaultProps" :data="treeList" :key="refreshKey"></el-tree>
    </template>
  </div>
</template>

<script>
// 功能菜单功能配置Tree - 仅仅只适用于 APP应用和H5应用切换的时候展示Tree - 不会有复杂的逻辑操作
export default {
  name: 'menuConfigTree',
  props: {
    /**
     * 1 - App应用
     * 2 - H5应用
     */
    type: {
      type: [String, Number],
      required: true
    },
    /**
     * 需要展示的Tree 数据
     */
    treeList: {
      type: Array,
      default: () => []
    },

    /**
     * 可能需要个性化的样式-支持透传
     */
    className: {
      type: [String]
    },

    title: {
      type: String,
      default: '功能菜单配置'
    }
  },

  data() {
    return {
      refreshKey: 0
    }
  },

  computed: {
    defaultProps() {
      console.log('this.type', this.type);
      // APP
      if (this.type === 1) {
        return {
          children: 'deepLinkChildVos',
          label: 'name'
        }
      }

      // H5应用 - 接口返回的子节点字段名是 children
      return {
        children: 'children',
        label: 'name'
      }
    }
  },

  watch: {
    type() {
      this.refreshKey = Date.now()
    }
  }
}
</script>

<style lang="less" scoped>
.feature-menu-config-tree {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: #f5f7fa;
  border-radius: 4px;
  padding: 24px 0 8px;

  .config-title {
    font-size: 16px;
    color: #303133;
    line-height: 16px;
    font-weight: bold;
    margin-bottom: 16px;
    padding: 0 24px;
  }
}

.op-tree {
  background: #f5f7fa;
  padding-left: 24px;
}
</style>
