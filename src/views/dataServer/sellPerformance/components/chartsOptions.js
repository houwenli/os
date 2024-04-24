
//金额分布图的饼图
export const pieOptions = {
    title: {
        text:'',
        left:'-50%',
        top:'0%',
        textStyle:{
            fontSize: 20,
            fontWeight: 600,
            color: '#606266',
            lineHeight:28
        },
    },
    tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderColor: '#DCDFE6',
        formatter: function(params) {
            let result = `<span style="margin-right: 6px;">${params.name}</span>`;
            let pie = `<span style="display:inline-block;margin-right:5px;width:8px;height:8px;background:${params.color};vertical-align: 0px;border-radius:50%"></span>`;
            const percent = params.data.ratio ?params.data.ratio +'%；' : '0%；'
            let dotHtml = result + '</br>' + pie + percent + params.value + '元';
            return `<div style="font-size: 12px;padding:2px 5px;color: #fff">${dotHtml}</div>`;
        }
    },
    color: ['#0BDBA8','#1D93FF','#F3D01D','#FF9B00','#FD571F','#254BE9','#30E5DF','#9A7AFF','#ED2466','#26B4A2','#2B2B31','#85B7FF','#ABD51E','#EB0707','#31438E','#961C44','#5331BF','#36736B','#C6AD2E','#BE7A10'],
    series: {
        type: 'pie',
        radius: ['100', '150'],
        label: {
            show: true,  //true
            position: 'inside',
            formatter(params) {
                return (params.percent || 0) + '%'
            },
            color: '#fff',
        },
        label: {
          show: true,
          position: 'center',
          formatter: '{a|支付总金额}\n{b|0}',
          rich: {
            a: {
              lineHeight: 20,
              fontSize: 14,
              fontFamily: 'PingFangSC-Semibold, PingFang SC',
              fontWeight: '400',
              color: '#303133'
            },
            b: {
              fontSize: 20,
              fontFamily: 'PingFangSC-Semibold, PingFang SC',
              fontWeight: '600',
              color: '#606266',
              lineHeight: 28
            }
          }
        },
        emphasis: {
            label: {
                show: true,
            },
        },
        labelLine: {
            show: false,
        },
        data: [
            
        ],
    },
}

export const areaOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
        type: 'scroll',
        // orient: 'horizontal',
        icon: 'rect',
        left: 24,
        itemHeight: 4,
        itemWidth: 10,
        textStyle: {
            color: '#606266',
            fontSize: 14,
            lineHeight: 30
        },
        y: 'top',
        data: []
    },
    color: ['#0BDBA8','#1D93FF','#F3D01D','#FF9B00','#FD571F','#254BE9','#30E5DF','#9A7AFF','#ED2466','#26B4A2','#2B2B31','#85B7FF','#ABD51E','#EB0707','#31438E','#961C44','#5331BF','#36736B','#C6AD2E','#BE7A10'],
    grid: {
        top: 60,
        left: 24,
        right: 24,
        bottom: 24,
        containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        nameTextStyle: {
            color: '#606266',
        },
        axisLine: {
            show: false,
        },
        axisTick: {
            show: false,
        },
        data: []
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
    ]
};
// 折线
export const HISTORY_DAILY_OPT = {
  tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderColor: 'rgba(0,0,0,0.7)',
      formatter: function (params) {
          let result = `<div style="margin-bottom: 3px;">${params[0].name}</div>`;
          params.forEach(function (item) {
              let dotHtml = `<span style="display:inline-block;margin-right:5px;width:10px;height:8px;background:${item.color};vertical-align: 2px"></span>`;
              result += dotHtml + item.seriesName + '：' + item.data + '</br>';
          });
          result = `<div style="font-size: 12px;line-height:17px;padding:2px 5px;color: #fff">${result}</div>`;
          return result;
      },
  },
  title : {
    show:true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
    text: '', //主标题文本，'\n'指定换行
  },
  legend: {
      // data: ['下单总量', '下单乘客量', '接单司机量', '完成行程订单总量', '已付款订单总量', '待付款订单总量', '取消订单总量', '预付订单总量', '完成行程订单总金额', '已完成订单总金额', '已付款订单总金额', '待付款订单总金额'],
      data: [],
      bottom: 0,
      left: 0,
      right: 0,
      itemWidth: 10,
      itemHeight: 4,
      itemGap: 0,
      selected: {},
      icon: 'roundRect',
      formatter: '{a|{name}}',
      textStyle: {
          color: '#909399',
          rich: {
              a: {
                  lineHeight: 20,
                  hegiht: 20,
                  padding: [4, 24, 0, 0],
                  verticalAlign: 'middle'
              }
          }
      }
  },
  xAxis: {
      type: 'category',
      data: [],
      axisLine: {
          lineStyle: {
              width: 0,
              color: '#DCDFE6'
          }
      },
      axisLabel: {
          interval: 0,
          color: 'rgba(0, 0, 0, 0.45)',
          rotate: 0
      },
  },
  color: [
      '#0BDBA8',
      '#1D93FF',
      '#F3D01D',
      '#FF9B00',
      '#FD571F',
      '#254BE9',
      '#30E5DF',
      '#9A7AFF',
      '#ED2466',
      '#26B4A2',
      '#2B2B31',
      '#85B7FF',
      '#ABD51E',
      '#EB0707',
      '#31438E',
      '#961C44',
      '#5331BF',
      '#36736B',
      '#C6AD2E',
      '#BE7A10'
  ],
  yAxis: [
      {
          type: 'value',
          name: '',
          nameTextStyle: {
              fontSize: 14,
              fontFamily: 'PingFangSC-Regular, PingFang SC',
              fontWeight: 400,
              color: '#606266',
              lineHeight: 20,
              padding: [0, 0, 10, 0]
          },
          min: 0,
          axisTick: {
              show: false
          },
          // minInterval: 1,
          axisLine: {
              show: false,
              lineStyle: {
                  width: 0,
                  color: '#DCDFE6'
              }
          },
          axisLabel: {
              color: 'rgba(0, 0, 0, 0.45)'
          },
          splitLine: {
              lineStyle: {
                  color: '#DCDFE6'
              }
          }
      },
      {
          type: 'value',
          name: '',
          nameTextStyle: {
              fontSize: 14,
              fontFamily: 'PingFangSC-Regular, PingFang SC',
              fontWeight: 400,
              color: '#606266',
              lineHeight: 20,
              padding: [0, 92, 0, 0]
          },
          min: 0,
          axisLine: {
              show: false,
              lineStyle: {
                  width: 0,
                  color: '#909399'
              }
          },
          minInterval: 1,
          axisTick: {
              show: false
          }
      }
  ],
  grid: {
      top: '35',
      bottom: 50,
      containLabel: true,
      left: 12,
      right: 0
  },
  series: []
};
