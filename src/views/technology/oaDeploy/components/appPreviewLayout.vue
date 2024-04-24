<template>
    <div>
        <div v-for="(item, index) in activeMenu" :key="item.id" class="panel-wrapper" :class="activeMenuIndex === index? 'active-panel': ''">
            <div class="panel-header">{{ item.name }}</div>
            <div class="app-menu-layout" :class="layoutContainer(item)">
                <div :class="getLayoutClass(item)" v-for="(menu, menuIndex) in item.children" :key="menuIndex" @click="onChange(menu, menuIndex,index)">
                    <img v-if="menu.pic" :src="menu.pic" class="app-menu-icon" />
                    <img class="empty-img-placeholder" v-else :src="getDefaultImage(item)" alt="">
                    <!-- app名称可为空 -->
                    <div class="app-menu-title"  v-if="item.styleType === 1 && menu.name">{{ menu.name }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import style1 from '../../../../assets/icons/app/style1.webp'
import style3 from '../../../../assets/icons/app/style3.webp'
import style4 from '../../../../assets/icons/app/style4.webp'

console.log(style1)
console.log(style3)
console.log(style4)
// 布局
export default {
  name: 'appPreviewLayout',
  props: {
    // 当前的菜单
    activeMenu: {
      type: Array,
      default: () => []
    },
    activeMenuIndex: {
      type: [Number, String],
      default: ''
    }
  },
  methods: {
    getLayoutClass (item) {
      let t = item.styleType || 1

      return `layout-${t}`
    },
    layoutContainer (item) {
      let t = item.styleType || 1

      return `layout-container-${t}`
    },
    onChange (item, menuIndex,index) {
      this.$emit('change', item,menuIndex, index)
    },

    /**
     * 获取默认的占位符图标
     */
    getDefaultImage(item) {
      let t = item.styleType || 1
      let m = {
        1: style1,
        2: style4,
        3: style3,
        4: style4
      }
      return m[t]
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-wrapper {
  box-sizing: border-box;
  border: 1px solid transparent;
}

.active-panel {
  border-color: rgb(240, 82, 89);
}

.panel-wrapper:hover {
  .panel-header,.app-menu-layout {
    background: #f5f7fa;
    opacity: 0.7;
  }
}
.panel-header {
  font-size: 18px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  margin-bottom: 12px;
  margin-top: 12px;
  padding-left: 12px;
  box-sizing: border-box;
}
.app-menu-layout {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    background: #fff;
    text-align: center;
    box-sizing: border-box;
    padding-top: 20px;

    .app-menu-title {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        margin-top: 12px;
    }

    .app-menu-icon {
      border-radius: 8px;
    }
}
// 以前的布局， 任意个数布局
.layout-1 {
    width: 20%;
    cursor: pointer;

    margin-bottom: 20px;
    .app-menu-icon {
        width: 44px;
        height: 44px;

    }

    .empty-img-placeholder {
        width: 44px;
        height: 44px;
    }
}

.layout-container-2 {
    padding: 20px 16px;
}

// 新增场景图片没上传的展位图
.empty-img-placeholder {
    height: 80px;
    margin: 0 auto;
}

// 一个面板最多2个
.layout-2 {
    width: 50%;
    cursor: pointer;
    margin-bottom: 20px;

    .app-menu-icon {
        height: 80px;
        max-width: 156px;
    }

    .empty-img-placeholder {
        width: 156px;
    }
}

// 一个面板一个
.layout-3 {
    width: 100%;
    margin-bottom: 24px;

    .app-menu-icon {
        height: 100px;
        max-width: 343px;
    }

    .empty-img-placeholder {
        width: 343px;
        height: 100px;
    }
}

// 一个面板4个
.layout-4 {
    width: 50%;
    cursor: pointer;
    margin-bottom: 24px;

    .app-menu-icon {
        height: 80px;
        max-width: 168px;
    }

    .empty-img-placeholder {
        width: 168px;
    }
}
</style>
