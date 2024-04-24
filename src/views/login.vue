<template>
    <ws-login class="oa-login-container" :options="loginOptions">
      <template #img>
        <div class="top-logo">
          <img src="../assets/images/logo.png" alt="">
        </div>
      </template>

      <template #header>
        <div class="login-title">万顺福智慧生活管理系统</div>
      </template>
    </ws-login>
</template>

<script>
export default {
    data() {
        return {
            loginOptions: {
                systemName: '',
                background: null
            }
        };
    },
    created() {
        this.$baseMethod.removeStore('os-menuList');
    },
    methods: {},
    destroyed: function () {
        this.$store.commit('breadcrumb/delAll');
    }
};
</script>

<style lang="scss" scoped>
.oa-login-container {
  background-image: url(../assets/images/bg_login.png) !important;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;

  /deep/ .ws-login__main {
    width: 480px;
    padding-top: 65px;
    padding-bottom: 132px;
    border-radius: 20px;
    box-shadow: 0px 6px 30px 0px rgba(221, 221, 221, 0.6);
    border: 1px solid #E4E7ED;
    box-sizing: border-box;
     flex-basis: auto;

    .verification_input {
      width: 193px;
    }
  }

  /deep/ .ws-login__from .el-form-item:nth-child(-n+2) {
    margin-bottom: 24px;
  }

  /deep/ .ws-login__from .el-form-item:nth-child(3) {
    margin-bottom: 12px;
  }

  /deep/ .ws-login__from div:nth-child(4) {
    margin-bottom: 24px !important;
  }
}
.top-logo {
  position: fixed;
  left: 80px;
  top: 40px;
  width: 168px;
  height: 44px;
}

.login-title {
  height: 40px;
  font-size: 28px;
  font-family: PingFang-SC-Heavy, PingFang-SC;
  font-weight: 800;
  color: #303133;
  margin-bottom: 48px;
}

</style>
