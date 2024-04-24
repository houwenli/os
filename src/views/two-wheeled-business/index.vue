<template>
  <div class="app-container content-box">
      <menu-card :menuOptions="menuOptions" />
  </div>
</template>

<script>
// 两轮车
import menuCard from '@/components/menuCard';
export default {
  name: 'twoWheeled',
  data() {
      return {
          menuOptions: []
      };
  },
  components: { menuCard },
  watch: {
      defaultMenuOptions: {
          deep: true,
          immediate: true,
          handler: function (newV) {
              this.menuOptions = (newV || {}).menuList;
          }
      }
  }
};
</script>
