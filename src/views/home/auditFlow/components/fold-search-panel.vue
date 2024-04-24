<template>
    <div class="fold-btn" :style="style" v-if="visible" @click="onToggle">
        <span>{{ open ? '收起' : '展开' }}</span>
        <i :class="open ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
    </div>
</template>

<script>
export default {
  name: 'fold-search-panel',
  props: {
    // 是否展示这个功能
    visible: {
      type: Boolean,
      default: true
    },

    /**
     * 折叠展开
     */
    isFold: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    open: {
      get () {
        return this.isFold
      },
      set (val) {
        this.$emit('update:isFold', val)
      },
    },
    style () {
      return {
        color: this.open ? '#303133' : '#0088FF'
      }
    }
  },

  methods: {
    onToggle () {
      this.open = !this.open
    }
  }
}
</script>

<style lang="scss" scoped>
.fold-btn {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    background: #f5f7fa;
    width: 80px;
    height: 20px;
    cursor: pointer;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
    color: #0088ff;
    background: url('../../../../assets/images/icon-search-toggle.png') no-repeat;
    background-size: 80px 20px;

    span {
        font-size: 12px;
        display: inline-block;
        transform: scale(0.83);
    }
}
</style>
