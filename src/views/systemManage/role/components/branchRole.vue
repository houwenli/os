<template>
  <!-- 分支机构 -->
  <!-- web端oa系统 -->
  <div class="tree-box role-tree-list">
      <!-- head -->
      <div class="tree-header-container">
          <div class="title">功能授权</div>
          <!-- 折叠 -->
          <el-button type="text" class="collapse-btn" @click="branchRole = !branchRole">
              {{ branchRole ? '收起' : '展开' }}&nbsp;
              <i :class="branchRole ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </el-button>
      </div>
      <!-- 权限勾选 -->
      <el-collapse-transition>
          <div v-show="branchRole">
            <!--webOAPowerTreeRef 也不要 :webDefaultKeys="webDefaultKeys" :orgType='orgType' -->
              <webOAPowerTree ref="webOAPowerTreeRef" />
              <!--  :appDefaultKeys="appDefaultKeys"  :orgType='orgType' -->
              <wsFuPowerTree ref="wsFuPowerTreeRef"/>
          </div>
      </el-collapse-transition>
  </div>
</template>

<script>
// Web端OA系统功能权限选择
import webOAPowerTree from './webOAPowerTree.vue';
// 万顺福App功能权限选择
import wsFuPowerTree from './wsFuPowerTree.vue';

export default {
    name: 'branchRole',

    // 考虑废弃-vuex实现
    // props: {
    //   webDefaultKeys: {
    //     type: Array,
    //     default: () => []
    //   },
    //   appDefaultKeys: {
    //     type: Array,
    //     default: () => []
    //   }
    // },
    components: {
        webOAPowerTree,
        wsFuPowerTree
    },
    data() {
        return {
            branchRole: true // 折叠
        }
    },
    methods: {
        // 获取勾选tree id
        getTreeKeys(e) {
            return this.$refs[e].$refs.tree.$refs.tree.getCheckedKeys();
        },
        getHalfTreeKeys(e) {
            return this.$refs[e].$refs.tree.$refs.tree.getHalfCheckedKeys();
        }
    }
};
</script>
<style scoped lang='scss'>
.tree-header-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;

    .title {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 700;
        color: #303133;
    }

    .collapse-btn {
        margin-left: 20px;
    }
}
.tree-box {
  border-bottom: 1px solid #dcdfe6;
  margin-bottom: 20px;
}

.role-tree-list /deep/ .el-tree-node__content {
  height: 36px;
  line-height: 36px;
}
</style>