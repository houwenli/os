<template>
  <div class="echart_contant" v-loading="loading">
    <div class="clearfixTitle">渠道对比分析</div>
    <div class="orderList">
        <div class="container"><div class="pieChart" id="newOrder" @click="handleClick('orderCreateList')"></div></div>
        <div class="container"><div class="pieChart" id="finishOrder" @click="handleClick('orderSuccessList')"></div></div>
        <div class="container"><div class="pieChart" id="finishOrderAmount" @click="handleClick('orderAmountList')"></div></div>
    </div>
    <div class="orderContrast" id="orderContrast">

    </div>
  </div>
</template>
<script>
import { pieOptions, areaOptions} from './chartsOptions'
import { cloneDeep } from 'lodash-es'
export default {
  name: 'channelContrastAnalysis',
  props:{
    searchParms:{
      defalut:{},
      type:Object
    },
    channelList: {
      defalut:[],
      type:Array
    }
  },
  data() {
    return{
      // echartsdom
      newOrder:'',
      finishOrder:'',
      finishOrderAmount:'',
      orderContrast:'',

      //echartsoption
      orderCreatePie:{},
      orderSuccessPie:{},
      orderAmountPie:{},
      orderLineData:{},

      moduleName: '/dataServer/tencentTravelOrderAnalysis',
      detailData:{},
      channelData:{},
      loading:false,

      tagHeight:''
    }
  },
  watch:{
    channelList:{
      handler(newV) {
        if(newV && newV.length > 0) {
          newV.forEach(item => {
            this.channelData[item.channelId] = item.name
          })
          this.getInitData()
        }
      },
    }
  },
  mounted() {
      this.chartsInit()
  },
  methods:{
    async getInitData(h){
      this.loading = true
        try {
          this.searchInit()
          let data = {
            op:"getChannelCompare",
            data: this.searchParms
          }
          data.data.channelList = Object.keys(this.channelData)
          delete data.data.channel
          let URL = this.$getModuleUrl(this.moduleName, data.op);
          const res = await this.$axios(URL,data)
          const resData = JSON.parse(res.data)
          this.detailData = resData
          //处理饼图，折线图数据
          this.pieData(resData)
          this.lineData(resData, 'orderCreateList',h)
        } catch (error) {
          this.errorInit()
        } finally {
          this.loading = false
          // 最终往echarts添加数据
          this.newOrder.setOption(this.orderCreatePie)
          this.finishOrder.setOption(this.orderSuccessPie)
          this.finishOrderAmount.setOption(this.orderAmountPie)
          this.orderContrast.setOption(this.orderLineData)
        }
    },
    // 金额 amount  数量count
    pieData(val) {
      let pieArr = ['orderCreatePie','orderAmountPie','orderSuccessPie']
      for(let k in val) {
        if(pieArr.includes(k)) {
          let channelVal = val[k]
          channelVal.forEach(item => {
              let obj = {
                name: this.channelData[item.channel],
                value: item.count || item.count === 0 ? item.count : item.amount,
                percent: item.ratio,
              }
              if(k === 'orderAmountPie') {
                obj.str = '订单金额：'
                obj.unit = '元'
              } else {
                obj.str = '订单量：'
                obj.unit = '单'
              }

              this[k].series.data.push(obj)
          })
        }
      }
    },
    lineData(val, name) {
      let value = val[name]
      this.orderLineData = cloneDeep(areaOptions)
      let dateList = value.map(item => {
        return item.orderCreateDate
      })
      this.orderLineData.xAxis[0].data = dateList
      let keys = Object.entries(this.channelData)
      let legend = Object.values(this.channelData)
      this.orderLineData.legend.data = legend
      keys.forEach((item,index) => {
        this.orderLineData.series[index] = {
          name: item[1],
          channelId: item[0],
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: []
        }
      })
      this.orderLineData.series.forEach(itemLine => {
        value.forEach(item => {
          let itemlist = item.countList || item.countList == [] ? item.countList : item.amountList
          itemlist .forEach(sitem => {
            if(itemLine.channelId == sitem.channel) {
              itemLine.data.push(sitem.count || sitem.count === 0 ? sitem.count : sitem.amount)
            }
          })
        })
      })
    },
    chartsInit(){
      const newOrder = document.getElementById('newOrder');
      const finishOrder = document.getElementById('finishOrder');
      const finishOrderAmount = document.getElementById('finishOrderAmount');
      const orderContrast = document.getElementById('orderContrast')

      this.newOrder = this.$echarts.init(newOrder)
      this.finishOrder = this.$echarts.init(finishOrder)
      this.finishOrderAmount = this.$echarts.init(finishOrderAmount)
      this.orderContrast = this.$echarts.init(orderContrast)

      let observer = new ResizeObserver(entries => {
            // 在元素大小变化时执行回调函数
          this.newOrder && this.newOrder.resize();
          this.finishOrder && this.finishOrder.resize();
          this.finishOrderAmount && this.finishOrderAmount.resize();
          this.orderContrast && this.orderContrast.resize();
      });
      observer.observe(newOrder);
      observer.observe(finishOrder);
      observer.observe(finishOrderAmount);
      observer.observe(orderContrast);
    },
    errorInit() {
      let keys = Object.values(this.channelData)
      let errlist = keys.map(item => {
        return {
          value: 0,
          name:item,
          percent:0
        }
      })
      console.log(errlist,'eeerrr');
      this.orderCreatePie.series.data = this.orderAmountPie.series.data = this.orderSuccessPie.series.data = errlist
    },
    searchInit() {
      this.orderCreatePie = cloneDeep(pieOptions)
      this.orderCreatePie.title.text = '创建订单量\n（单）'
      this.orderAmountPie = cloneDeep(pieOptions)
      this.orderAmountPie.title.text = '完成行程订单\n总金额（元）'
      this.orderSuccessPie = cloneDeep(pieOptions)
      this.orderSuccessPie.title.text = '完成行程订单\n量（单）'
      this.orderLineData = cloneDeep(areaOptions)
    },
    handleClick(str){
      this.$nextTick(()=> {
        this.lineData(this.detailData, str)
        this.orderContrast.setOption(this.orderLineData)
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.echart_contant {
    .clearfixTitle {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #303133;
        margin: 32px 0 16px 0;
    }
    .orderList {
      display: flex;
      justify-content: space-between;
      .container {
        height: 390px;
        width: 32%;
        border: 1px solid #DCDFE6;
        border-radius: 8px;
        display: flex;
        align-items: center;
        .pieChart {
          margin: 0 auto;
        }
      }
      div {
        height: 300px;
        width: 300px;
      }
    }
    .orderContrast {
      height: 400px;
      margin-top: 20px;
    } 
}
</style>
