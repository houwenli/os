<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default  {
  name:  'App',
  mounted() {
    document.body.style.setProperty("--sideBarWidth",this.$store.state.app?.sidebar?.opened ? "160px" : "80px")
  }
}
</script>

<style lang="scss">
@import "~@/assets/styles/base.scss";
// :root {
//     --sideBarWidth: 160px; // 导航栏宽度
// }
* {
      box-sizing: border-box;
  }

  #app {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: #303133;
      font-size: 14px;
      position: relative;
      height: 100%;
  }

  html, body {
      background: #F0F2F5;
  }
</style>
