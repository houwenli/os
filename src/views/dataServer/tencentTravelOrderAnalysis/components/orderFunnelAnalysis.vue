<template>
  <div class="echart_contant" v-loading="loading">
    <div class="selectArea">
      <div class="clearfixTitle" style="display: flex;">订单漏斗分析
      </div>
    <el-select v-model="type" @change="handleChange">
      <el-option label="全部" value="ALL"></el-option>
      <el-option label="抢单" value="QD"></el-option>
      <el-option label="派单" value="PD"></el-option>
    </el-select>
    </div>
    <div class="chartBox">
      <div id="funnelAnalysis"></div>
    </div>
  </div>
</template>
<script>
import { funnelOptions } from './chartsOptions'
import { cloneDeep } from 'lodash-es'
export default {
  name: 'orderFunnelAnalysis',
  props: {
    searchParms:{
      defalut:{},
      type:Object
    }
  },
  data () {
    return {
      type:'ALL',
      funnelAnalysis:'',
      moduleName: '/dataServer/tencentTravelOrderAnalysis',
      loading:false
    }
  },
  methods: {
    async getInitData(){
        this.loading = true
        let param = cloneDeep(funnelOptions)
        try {
          let data = {
            op:"getOrderFunnel",
            data: {
              ...this.searchParms,
              dispatchType:this.type
            }
          }
          let URL = this.$getModuleUrl(this.moduleName, data.op);
          const res = await this.$axios(URL,data)
          const resData = JSON.parse(res.data)
          param.series.forEach(item => {
            item.data[0].percent = resData.allOrderSuccessRatio || 0
            item.data[0].value = resData.orderCreateCount || 0
            item.data[1].percent = resData.screenOutDriverOrderRatio || 0
            item.data[1].value = resData.screenOutDriverOrderCount || 0
            item.data[2].percent = resData.driverConfirmOrderRatio || 0
            item.data[2].value = resData.driverConfirmOrderCount || 0
            item.data[3].percent = resData.secondConfirmOrderRatio || 0
            item.data[3].value = resData.secondConfirmOrderCount || 0
            item.data[4].percent = resData.arriveStartPointOrderRatio || 0
            item.data[4].value = resData.arriveStartPointOrderCount || 0
            item.data[5].percent = resData.orderSuccessRatio || 0
            item.data[5].value = resData.orderSuccessCount || 0
          });
        } catch (error) {
            param.series.forEach(item => {
              item.data[0].value = 0
              item.data[0].percent = 0
              item.data[1].value = 0
              item.data[1].percent = 0
              item.data[2].value = 0
              item.data[2].percent = 0
              item.data[3].value = 0
              item.data[3].percent = 0
              item.data[4].value = 0
              item.data[4].percent = 0
              item.data[5].value = 0
              item.data[5].percent = 0
            });
        } finally {
          this.loading = false
            this.funnelAnalysis.setOption(param)
        }
    },
    handleChange() {
      this.getInitData()
    }
  },
  created () {
  },
  mounted () {
    const funnelAnalysis = document.getElementById('funnelAnalysis');
    this.funnelAnalysis = this.$echarts.init(funnelAnalysis)

    let observer = new ResizeObserver(entries => {
          // 在元素大小变化时执行回调函数
        this.funnelAnalysis && this.funnelAnalysis.resize();
    });
    observer.observe(funnelAnalysis);
  },
}
</script>
<style lang="scss" scoped>
.selectArea {
  margin-bottom: 20px;
}
.chartBox {
  border: 1px solid #DCDFE6;
  border-radius: 8px;
  #funnelAnalysis {
    height: 548px;
    width: 100%;
    
  }
}

</style>
