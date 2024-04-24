<template>
  <div class="app-container content-box">
      <menu-card :menuOptions="menuOptions" />
  </div>
</template>

<script>
// 万顺福
import menuCard from '@/components/menuCard';
export default {
  name: 'shop-business',
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
