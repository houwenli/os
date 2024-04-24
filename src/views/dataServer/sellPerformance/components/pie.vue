<template>
  <div class="echart_contant" v-loading="loading">
    <div class="orderList">
        <div class="container" >
          <span class="pieTitle">订单金额分布图</span>
          <div v-show="orderAmountData.length > 0">
            <div class="pieChart" id="orderAmount" ></div>
              <div class="pie-table">
                <el-col >
                    <el-row class="grid-content" >
                        <el-col >
                            <span class="desc title">业务类型</span>
                            <span class="desc">订单金额</span>
                            <span class="desc">占比</span>
                        </el-col>
                    </el-row>
                    <el-row class="grid-content" v-for="(item,index) in orderAmountData" :key="index" >
                        <el-col>
                            <span class="title">
                              <span :style="{'background-color':item.color}"></span>
                              <span style="min-width: 60px;text-align: left;">{{ item.name }}</span>
                            </span>
                            <span class="desc">{{thousandSeparator(item.value) ||0 }}</span>
                            <span class="desc">{{ item.ratio }} %</span>
                        </el-col>
                    </el-row>
                </el-col>
              </div>
          </div>
          <div class="data-empty" v-show="orderAmountData.length <= 0">
              <img width=" 122" src="@/assets/index/empty.png" alt="暂无数据">
              <p>暂无相关数据</p>
          </div>
        </div>
        <div class="container">
          <span class="pieTitle">支付金额分布图</span>
          <div v-show="payAmountData.length > 0">
            <div class="pieChart" id="payAmount" ></div>
            <div class="pie-table">
              <el-col >
                  <el-row class="grid-content" >
                      <el-col >
                          <span class="desc title">业务类型</span>
                          <span class="desc">支付金额</span>
                          <span class="desc">占比</span>
                      </el-col>
                  </el-row>
                  <el-row class="grid-content" v-for="(item,index) in payAmountData" :key="index" >
                      <el-col>
                          <span class="title">
                            <span :style="{'background-color':item.color}"></span>
                            <span style="min-width: 60px;text-align: left;">{{ item.name }}</span>
                          </span>
                          <span class="desc">{{thousandSeparator(item.value) ||0 }} </span>
                          <span class="desc">{{ item.ratio }} %</span>
                      </el-col>
                  </el-row>
              </el-col>
            </div>
          </div>
          <div class="data-empty" v-show="payAmountData.length <= 0">
              <img width=" 122" src="@/assets/index/empty.png" alt="暂无数据">
              <p>暂无相关数据</p>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import { pieOptions} from './chartsOptions'
import { cloneDeep } from 'lodash-es'
export default {
  name: 'channelContrastAnalysis',
  props:{
    pieData:{
      type:Object,
      required: true
    }
  },
  watch: {
    pieData:{
      deep:true,
      handler(val){
          const orderMoneyMax = this.findIndexOfMaxValue(val.datas,'orderMoney')
          const paidMoneyMax = this.findIndexOfMaxValue(val.datas,'paidMoney')
          const {orderMoneyAmt,paidMoneyAmt} = val.overData
          this.orderAmountData = val.datas.map((item,index)=>{
            return {
              value:this.$baseMethod.regFenToYuan(item.orderMoney),
              name:this.businessTypeMap[item.businessType],
              ratio:this.getRatio(orderMoneyAmt,val.datas,index,orderMoneyMax,'orderMoney'),
              color:this.color[index]
            }
          })
          this.payAmountData = val.datas.map((item,index)=>{
            return {
              value:this.$baseMethod.regFenToYuan(item.paidMoney),
              name:this.businessTypeMap[item.businessType],
              ratio:this.getRatio(paidMoneyAmt,val.datas,index,paidMoneyMax,'paidMoney'),
              color:this.color[index]
            }
          })
          this.orderAmountPie.series.label.formatter = ['{a|订单总金额(元)}', `{b|${this.thousandSeparator(this.$baseMethod.regFenToYuan(val.overData.orderMoneyAmt))}}`].join('\n') 
          this.payAmountPie.series.label.formatter = ['{a|支付总金额(元)}', `{b|${this.thousandSeparator(this.$baseMethod.regFenToYuan(val.overData.paidMoneyAmt))}}`].join('\n') 
          this.orderAmountPie.series.data = this.orderAmountData
          this.payAmountPie.series.data = this.payAmountData
          this.orderAmount.setOption(this.orderAmountPie)
          this.payAmount.setOption(this.payAmountPie)
      },
    }
  },
  data() {
    return{
      orderAmount:'',
      payAmount:'',
      orderAmountData:[],
      payAmountData:[],
      moduleName: '/dataServer/sellPerformance',
      orderAmountPie:{},
      payAmountPie:{},
      channelData:{},
      loading:false,
      businessTypeMap:{
        1:'两轮车',
        2:'保险',
        3:'酒水饮料'
      },
      color:['#0BDBA8','#1D93FF','#F3D01D','#FF9B00','#FD571F']
    }
  },
  mounted() {
      this.chartsInit()
      this.searchInit()
  },
  methods:{
    // 添加千位符
    thousandSeparator(num){
        var res = num.toString().replace(/\d+/, function (n) { // 先提取整数部分
            return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                return $1 + ",";
            });
        })
        return res;
    },
    
    // 计算比例  产品要求计算公式 2项最小支付方式占比直接由公式单项支付金额/全部支付金额计算，最大项支付方式占比= 100%-（2项支付方式占比之和）
    getRatio(amount,list,index,max,type){
      if (!amount) return 0
      if (index == max) {
        const [firstIndex, secondIndex] = this.findOtherIndexes(list, max);
        const firstPercentage = parseFloat(((list[firstIndex][type] / amount) * 100).toFixed(2));
        const secondPercentage = parseFloat(((list[secondIndex][type] / amount) * 100).toFixed(2));
        return (100 - (firstPercentage + secondPercentage)).toFixed(2);
      } else {
       return (parseFloat(list[index][type]/amount)*100).toFixed(2)
      }
    },
    // 找到非最大的两位数下标
     findOtherIndexes(arr, knownIndex) {
        if (arr.length < 3) {
          return ;
        }
        if (knownIndex < 0 || knownIndex >= arr.length) {
          return;
        }
        const otherIndexes = [];
        for (let i = 0; i < arr.length; i++) {
          if (i !== knownIndex) {
            otherIndexes.push(i);
          }
        }
        return otherIndexes;
    },
    // 找到最大数下标
    findIndexOfMaxValue(objectsArray, valueProperty) {
      if (objectsArray.length === 0) {
        return -1; // 返回-1表示空数组
      }
      let maxIndex = 0;
      let maxValue = objectsArray[0][valueProperty];

      for (let i = 1; i < objectsArray.length; i++) {
        if (objectsArray[i][valueProperty] > maxValue) {
          maxIndex = i;
          maxValue = objectsArray[i][valueProperty];
        }
      }
      return maxIndex;
    },

    chartsInit(){
      const orderAmount = document.getElementById('orderAmount');
      const payAmount = document.getElementById('payAmount');

      this.orderAmount = this.$echarts.init(orderAmount)
      this.payAmount = this.$echarts.init(payAmount)

      let observer = new ResizeObserver(entries => {
            // 在元素大小变化时执行回调函数
          this.orderAmount && this.orderAmount.resize();
          this.payAmount && this.payAmount.resize();
      });
      observer.observe(orderAmount);
      observer.observe(payAmount);
    },
    searchInit() {
      this.orderAmountPie = cloneDeep(pieOptions)
      this.orderAmountPie.title.text = '订单金额分布图'
      this.payAmountPie = cloneDeep(pieOptions)
      this.payAmountPie.title.text = '支付金额分布图'
    }
  }
}

</script>
<style lang="scss" scoped>
.echart_contant {
    .orderList {
      display: flex;
      justify-content: space-between;
      .container {
        height: auto;
        width: 49%;
        border: 1px solid #EBEEF5;
        border-radius: 8px;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding-bottom: 24px;
        .pieChart {
          margin: 0 auto;
          height: 400px;
          width: 400px;
        }
        .pieTitle{
          width: 100%;
          padding: 24px 24px 12px 24px;
          font-weight: bold;
        }
      }
    }
    .pie-table {
      padding: 24px;
      width: 100%;
    }
    
    .data-empty {
        height: 391px;
        text-align: center;
        margin-top: 100px;
    }
    .grid-content {
        position: relative;
        margin-top: -1px;
        width: 100%;
        // padding: 0 24px;
        height: 65px;
        line-height: 65px;
        border-bottom: 1px solid #EBEEF5;
        .title{
          display: inline-block;
          min-width: 180px !important;
          text-align: center;
          span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 10px;
            display: inline-block;
          }
        }
        .el-col {
            margin: 0;
            display: flex;
            justify-content: space-between;
        }
        &:last-child {
            margin-bottom: 0;
        }

        >p {
            margin-right: 80px;
            display: flex;
            display: -ms-flexbox;
            display: -webkit-flex;
        }

        .desc {
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #303133;
            display: inline-block;
            min-width: 150px;
            text-align: center;
        }
    }
}
</style>
