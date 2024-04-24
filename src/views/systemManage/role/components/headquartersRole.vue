<template>
    <!-- 总部 -->
    <div class="role-tree-list">
        <!-- 功能 -->
        <div class="tree-box">
            <!-- head -->
            <div class="tree-header-container">
                <div class="title">
                    {{ apply ? '功能授权' : '功能授权' }}
                    <span class="warning-text">*为页面中有功能授权选中项</span>
                </div>

                <div class="right">
                    <!-- tab切换 -->
                    <!-- <el-button-group>
                        <el-radio-group  v-model="complaint">
                            <el-radio-button label="web">
                                Web端oa
                                <i v-show="webIsTabIcon" class="tab-icon">*</i>
                            </el-radio-button>
                            <el-radio-button label="app">
                                云办公App
                                <i v-show="appIsTabIcon" class="tab-icon">*</i>
                            </el-radio-button>
                            <el-radio-button label="applet">
                                DataBI小程序
                                <i v-show="appletIsTabIcon" class="tab-icon">*</i>
                            </el-radio-button>
                        </el-radio-group>
                    </el-button-group> -->

                    <!-- 折叠 -->
                    <!-- <el-button type="text" class="collapse-btn" @click="funcIsShow = !funcIsShow">
                        <span>{{ funcIsShow ? '收起' : '展开' }}</span>
                        <i :class="funcIsShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                    </el-button> -->
                </div>
            </div>

            <!-- 权限勾选 -->
            <div>
                <div v-show="complaint == 'web'">
                    <el-collapse-transition>
                      <!-- 方法待改造，直接从vuex中获取长度，判断是否要有星号"  -->
                        <webPowerTree v-if="show" ref="webPowerTreeRef" @webTreeSelet="e => (webIsTabIcon = e)" v-show="funcIsShow"  />
                    </el-collapse-transition>
                </div>
                <div v-show="complaint == 'app'">
                    <el-collapse-transition>
                        <appPowerTree v-if="show" ref="appPowerTreeRef"  @appTreeSelet="e => (appIsTabIcon = e)" v-show="funcIsShow"  />
                    </el-collapse-transition>
                </div>
                <div v-show="complaint == 'applet'">
                    <el-collapse-transition>
                        <appletPowerTree ref="appletPowerTreeRef" @appTreeSelet="e => (appletIsTabIcon = e)" v-show="funcIsShow"  />
                    </el-collapse-transition>
                </div>
            </div>
        </div>
        <!-- 机构 -->
        <!-- 角色层级为 总部 才展示 -->
        <!-- <div class="tree-box" v-if='orgType === 0'>
            <div class="tree-header-container">
                <div class="title">
                    {{ apply ? '机构授权' : '机构授权' }}
                </div>
                <el-button type="text" class="collapse-btn" @click="orgIsShow = !orgIsShow">
                    {{ orgIsShow ? '收起' : '展开' }}&nbsp;
                    <i :class="orgIsShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </el-button>
            </div>
            <el-collapse-transition v-if="show">
                <orgTree ref="orgTreeRef" v-show="orgIsShow" :value.sync='orgActiveTab'/>
            </el-collapse-transition>
        </div> -->
        <!-- 城市 -->
        <!-- 角色层级为 总部 才展示 -->
        <!-- <div class="tree-box" v-if='orgType === 0'>
            <div class="tree-header-container">
                <div class="title ">{{ apply ? '城市权限勾选' : '城市授权' }}</div>
                <el-button type="text" class="collapse-btn" @click="cityIsShow = !cityIsShow">
                    {{ cityIsShow ? '收起' : '展开' }}&nbsp;
                    <i :class="cityIsShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </el-button>
            </div>
            <el-collapse-transition v-if="show">
                <cityTree ref="cityTreeRef" v-show="cityIsShow"  :value.sync='cityActiveTab'/>
            </el-collapse-transition>
        </div> -->
    </div>
</template>

<script>
import cityTree from './cityTree.vue';
import orgTree from './orgTree.vue';
// app总部
import appPowerTree from './appPowerTree.vue';

// web端oa总部
import webPowerTree from './webPowerTree.vue';
// DataBI小程序
import appletPowerTree from './appletPowerTree.vue';
import {mapState} from 'vuex'

export default {
  name: 'headquartersRole',
  components: {
    cityTree,
    orgTree,
    appPowerTree,
    webPowerTree,
    appletPowerTree
  },
  props: {
    apply: {},
  },
  data () {
    return {
      funcIsShow: true, // 折叠
      cityIsShow: true, // 折叠
      orgIsShow: true, // 折叠
      complaint: 'web', // tab
      webIsTabIcon: false,
      appIsTabIcon: false,
      appletIsTabIcon: false,
        show:true,

      // 机构
      orgActiveTab: "1",
      // 城市
      cityActiveTab: '1'
    };
  },
  computed: {
    ...mapState({
      orgType: state => state.role.orgType,
    })
  },
  methods: {
    // 获取勾选tree id
    getTreeKeys (e) {
        if(e === 'cityTreeRef') {
            if(this.$refs[e]) {
                if(this.$refs[e].$refs.tree.activeTab == 1) {
                    return this.$refs[e].$refs.tree.citylist
                } else {
                    return this.$refs[e].$refs.tree.$refs.tree.getCheckedKeys()
                }
            } else {
                return []
            }
        } else {
            return this.$refs[e] ? this.$refs[e].$refs.tree.$refs.tree.getCheckedKeys() : [];
        }
    },
    getHalfTreeKeys (e) {
      return this.$refs[e] ? this.$refs[e].$refs.tree.$refs.tree.getHalfCheckedKeys() : [];
    },
    orgGetTreeKeys (e) {
        if(this.$refs[e]) {
            if(this.$refs[e].$refs.tree.activeTab == 1) {
                return this.$refs[e].$refs.tree.citylist
            } else {
                return this.$refs[e].$refs.tree.$refs.tree.getCheckedKeys()
            }
        } else {
            return []
        }
    },
    getTreeRef (e) {
      return this.$refs[e].$refs.tree;
    }
  }
};
</script>

<style scoped lang="scss">

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

    .warning-text {
        color: #f05259;
        font-weight: normal;
        font-size: 14px;
    }

    .collapse-btn {
        margin-left: 20px;
    }
}

.tab-icon {
    font-style: normal;
    color: #f05259;
}
// is-active是element-ui全局样式
.is-active .tab-icon {
  color: #fff;
}

.role-tree-list /deep/ .el-tree-node__content {
  height: 36px;
  line-height: 36px;
}

.tree-box {
  border-bottom: 1px solid #dcdfe6;
  margin-bottom: 20px;
}
</style>
