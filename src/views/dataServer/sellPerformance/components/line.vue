
<template>
    <div class="section-box">
        <div class="radioSearch">
            <h3 class="table-title">
                <el-tooltip class="item" effect="dark" placement="right" v-if="showTips">
                    <div slot="content">
                        <slot name="tooltip"></slot>
                    </div>
                    <img style="margin-left: 4px;" width="24" src="@/assets/order/icon_tips.png" alt="">
                </el-tooltip>
            </h3>
        </div>
        <slot name="grid"></slot>
        <div >
          <div id="eacharts" ref="eacharts" class="eacharts-a"></div>
        </div>
    </div>
</template>

<script>
import { HISTORY_DAILY_OPT } from './chartsOptions'
import { cloneDeep } from 'lodash-es'

export default {
  name:'orderMoneyChart',
  props: {
      chartData: {
          type: Object,
          required: true
      },
      showTips:{
        type: Boolean,
        default:false,
      },
      title:{
        type: String,
        required: true
      },
      // amt 金额  cnt单量
      type:{
        type: String,
        required: true
      },
  },
  data (){
    return {
      myChart: null,
    }
  },
  watch: {
      chartData: {
          deep: true,
          handler(val) {
            this.dealData(val)
          }
      }
  },
  mounted() {
      this.$nextTick(() => {
        this.initChart()
      })
  },
  beforeDestroy() {
    if (!this.myChart) {
      return;
    }
    this.myChart.dispose();
    this.myChart = null;
  },
  methods:{
    initChart() {
      let myChart = this.$refs['eacharts']
      this.myChart = this.$echarts.init(myChart);
      this.dealData(this.chartData)
    },
    disposeChart(){
      this.$echarts.init(this.$refs['eacharts']).dispose()
    },
    clearChart(){
      let options = cloneDeep(HISTORY_DAILY_OPT)
      this.myChart.setOption(options, true)
    },
    // 添加千位符
    thousandSeparator(num) {
        var num = (num || 0).toString(),
            re = /\d{3}$/,
            result = '';
        while (re.test(num)) {
            result = RegExp.lastMatch + result;
            if (num !== RegExp.lastMatch) {
                result = ',' + result;
                num = RegExp.leftContext;
            } else {
                num = '';
                break;
            }
        }
        if (num) {
            result = num + result;
        }
        return result;
    },
    dealData(data) {
      let a = []
      if (data && data.xData) {
          data.dataInfoList.forEach(item => {
              if (this.type == 'amt') {
                  a.push({
                      name: item.name,
                      type: 'line',
                      data: item.value.map(it => {
                          return this.$baseMethod.regFenToYuan(it)
                      }),
                      label: {
                          show: true,
                          position: 'top'
                      }
                  })
              } else {
                a.push({
                      name: item.name,
                      type: 'line',
                      data: item.value,
                      label: {
                          show: true,
                          position: 'top'
                      }
                  })
              }
          })
      }
      this.setOptions(a)
    },
    updateCharts (chartsOptions) {
      this.dealData(chartsOptions);
    },
    setOptions(data) {
        let options = cloneDeep(HISTORY_DAILY_OPT)
        //日期间隔超过15 rotate
        const xData = this.chartData.xData || []
        if (xData.length > 15) {
            options.xAxis.axisLabel.rotate = 40
        }
        options.title.text = this.type == 'amt' ? '销售业绩分析' :'销售数量分析' 
        options.xAxis.data = xData;
        options.legend.orient = 'horizontal';
        let lineOptionA = cloneDeep(options)
        let leg = data.map(item => {
            return item.name
        });
        lineOptionA.legend.data = leg
        lineOptionA.yAxis = [options.yAxis[0]]
        this.$set(lineOptionA,'series',data)
        this.myChart && this.myChart.setOption(lineOptionA)
    }
  }
}
</script>

<style lang="scss" scoped>
.section-box {
  margin-top: 30px;
  .eacharts-a {
    width: 100%;
    height: 380px;
    // margin-top: 12px;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 24px 18px;
    border: 1px solid #EBEEF5;
    box-sizing: border-box;
  }
  .radioSearch{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .flex-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;
    background: #F5F7FA;
    height: 108px;
    width: 100%;
    margin-top: 16px;
    .grid-content {
        // background: #F5F7FA;
        border-radius: 8px;
        border-right: 1px solid #EBEEF5;
        // height: 154px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 58px;
        padding: 24px;
        width: 50%;
        .num {
            font-size: 48px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #303133;
            line-height: 1;
            margin-top: 12px;
        }
    }
  }
  

}

</style>