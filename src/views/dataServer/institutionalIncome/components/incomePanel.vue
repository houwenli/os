<template>
  <div>
    <div class="panel-title">机构收入</div>

    <div class="datasource-panel">
      <div class="item">
        <div class="desc">总收入(元)</div>
        <div class="money">{{ info.incomeSum || 0 | toThousandFilter }}</div>
      </div>
      <div class="item">
        <div class="desc">网约车平台费收入(元)</div>
        <div class="money">{{ info.wycPlatfromAmt || 0 | toThousandFilter }}</div>
      </div>
      <div class="item">
        <div class="desc">代驾平台费收入(元)</div>
        <div class="money">{{ info.djPlatfromAmt || 0 | toThousandFilter }}</div>
      </div>
      <div class="item">
        <div class="desc">网约车包干费收入(元)</div>
        <div class="money">{{ info.driverVipAmt || 0 | toThousandFilter }}</div>
      </div>
      <div class="item">
        <div class="desc">千城万店收入(元)</div>
        <div class="money">{{ info.memberAmt || 0 | toThousandFilter }}</div>
      </div>
    </div>

    <!-- 折线图 -->
    <div class="echart-line" id="echart-line"></div>
  </div>
</template>

<script>
// 机构收入面板
export default {
  name: 'incomePanel',

  props: {
    info: {
      type: Object,
      default: () => {}
    },

    incomeEchartData: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      chartOptions: {
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value',
          nameTextStyle: {
            color: '#606266'
          }
        },
        grid: {
          top: 30,
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true
        },

        tooltip: {
          // tooltip 用于控制鼠标滑过或点击时的提示框（下一章展开讲）
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器配置项。
            type: 'cross', // 'line' 直线指示器  'shadow' 阴影指示器  'none' 无指示器  'cross' 十字准星指示器。
            axis: 'auto', // 指示器的坐标轴。
            snap: true // 坐标轴指示器是否自动吸附到点上
          },
          showContent: true,
          backgroundColor: 'rgba(0,0,0,0.7)',
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '总收入',
            type: 'line',
            symbolSize: 6, //设置折线上圆点大小
            data: []
          },
          {
            name: '网约车平台费收入',
            type: 'line',
            symbolSize: 6, //设置折线上圆点大小
            data: []
          },
          {
            name: '代驾平台费收入',
            type: 'line',
            symbolSize: 6, //设置折线上圆点大小
            data: []
          },
          {
            name: '网约车包干费收入',
            type: 'line',
            symbolSize: 6, //设置折线上圆点大小
            data: []
          },
          {
            name: '千城万店收入',
            type: 'line',
            symbolSize: 6, //设置折线上圆点大小
            data: []
          }
        ],
        color: ['#0BDBA8', '#1D93FF', '#F3D01D', '#FF9B00 ', '#FD571F'], // 三个折线的颜色
        legend: {
          left: 0,
          itemHeight: 4,
          itemWidth: 10,
          icon: 'rect',

          data: ['总收入', '网约车平台费收入', '代驾平台费收入', '网约车包干费收入', '千城万店收入'],
          selectedMode: false
        }
      },

      echartInstance: null
    }
  },

  watch: {
    incomeEchartData: {
      deep: true,
      handler() {
        this.updateEchart()
      }
    }
  },

  mounted() {
    this.initChart()
  },

  beforeDestory() {
    if (!this.charts) {
      return
    }

    this.echartInstance.dispose()
    this.echartInstance = null
  },

  methods: {
    initChart() {
      let chartDom = document.getElementById('echart-line')

      this.echartInstance = this.$echarts.init(chartDom)
      this.echartInstance.setOption(this.chartOptions)
    },

    updateEchart() {
      if (this.echartInstance) {
        this.echartInstance.setOption({
          xAxis: {
            data: this.incomeEchartData.xData
          },
          series: [
            {
              data: this.incomeEchartData.incomeSum
            },
            {
              data: this.incomeEchartData.wycPlatfromAmt
            },
            {
              data: this.incomeEchartData.djPlatfromAmt
            },
            {
              data: this.incomeEchartData.driverVipAmt
            },
            {
              data: this.incomeEchartData.memberAmt
            }
          ]
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.panel-title {
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #303133;
  margin-top: 32px;
  margin-bottom: 20px;
}

.datasource-panel {
  display: flex;
  justify-content: space-around;
  background: #f5f7fa;
  border-radius: 8px;
  padding-top: 24px;
  padding-bottom: 24px;
  font-size: 14px;
  font-family: DINAlternate-Bold, DINAlternate;
  text-align: center;

  .item {
    flex: 1;
    position: relative;
    border-right: 1px solid #dcdfe6;
    // &::after {
    //   position: absolute;
    //   content: ' ';
    //   width: 1px;
    //   height: 100%;
    //   background: #dcdfe6;
    // }
  }

  .item:last-of-type {
    border-right: 0;
  }

  .desc {
    margin-bottom: 12px;
  }

  .money {
    font-size: 24px;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
  }
}

.echart-line {
  width: 100%;
  height: 380px;
  border-radius: 8px;
  border: 1px solid #dcdfe6;
  padding: 24px;
  margin-top: 12px;
}
</style>
