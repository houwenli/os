<!-- unusualOrder Page -->
<template>
    <div class="unusualOrder-wrap">
      <div class="t-box">
        <!-- <div style="display:flex">
          <el-radio-group class="nav-tabs" v-model="componentTab">
              <el-radio-button label="driver">司机入账异常</el-radio-button>
              <el-radio-button label="passenger">乘客支付异常</el-radio-button>
          </el-radio-group>
        </div> -->
          
        <component :is="componentTab"></component>
      </div>
    </div>
</template>

<script>
import driver from "./driver";
import passenger from "./passenger";

export default {
  name:'unusualOrder',
  data (){
    return {
      componentTab:'driver'
    }
  },
  components:{
    driver,
    passenger
  },
  methods:{

  }
}
</script>

<style lang="scss" scoped>
  .unusualOrder-wrap{
    .t-box{
      padding: 14px 40px;
      background: #fff;
      border-radius: 8px;
      .nav-tabs {
        margin: 0 auto !important;
      }
    }
    
  }
</style>