<template>
  <div>
    <div class="tab-list" v-if='showTabs'>
      <!-- <el-button class="tag" v-if="powerList.selectList" :type="activeTab === 'oa' ? 'danger' : ''" @click="onChangeTab('oa')">OA外链</el-button> -->
      <!-- <el-button v-if="hasH5Permission" class="tag" :type="activeTab === 'h5' ? 'danger' : ''" @click="onChangeTab('h5')">云办公外链</el-button> -->
    </div>
    <!-- v-show="activeTab === 'oa'"
       v-if="powerList.selectList"
     -->
    <OAChildSystem  />

    <!-- <h5Module v-show="activeTab === 'h5'" v-if="hasH5Permission" /> -->
  </div>
</template>

<script>
import OAChildSystem from './components/oa-child-system/index.vue'
import h5 from './components/h5/index.vue'

export default {
  name: 'systemInfo',

  components: {
    OAChildSystem,
    h5Module: h5
  },

  data() {
    return {
      moduleName: '/technology/systemInfo',
      activeTab: ''
    }
  },

  computed: {
    hasH5Permission() {
      return this.powerList.selectAppSystemList
    },

    showTabs() {
      return this.powerList.selectList && this.hasH5Permission
    }
  },

  created() {
    if (this.powerList.selectList) {
      this.activeTab = 'oa'
      return
    }

    if (this.powerList.selectAppSystemList) {
      this.activeTab = 'h5'
    }
  },

  methods: {
    onChangeTab(type) {
      this.activeTab = type
    }
  }
}
</script>

<style scoped lang="less">
.tab-list {
  display: flex;
  justify-content: center;
  background: #fff;
  padding-top: 18px;

  .tag {
    width: 160px;
    margin-left: 0;
  }
  .tag:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: transparent;
  }
  .tag:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: transparent;
  }
}
</style>
