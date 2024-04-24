// 调度订单数据分析
export const orderDataAsalysis = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      crossStyle: {
        color: "#999",
      },
    },
  },
  legend: {
    y: "bottom",
    data: ["订单量", "成功调度订单量", "成功率"],
  },
  xAxis: [
    {
      type: "category",
      data: [],
      axisPointer: {
        type: "shadow",
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      name: "订单量",
      min: 0,
      axisLabel: {
        formatter: "{value} ",
      },
    },
    {
      type: "value",
      name: "成功率",
      min: 0,
      interval: 10,
      axisLabel: {
        formatter: "{value} %",
      },
    },
  ],
  series: [
    {
      name: "订单量",
      type: "bar",
      data: [],
      // barWidth : 30,//柱图宽度
      barMaxWidth: 30,
    },
    {
      name: "成功调度订单量",
      type: "bar",
      data: [],
      // barWidth : 30,//柱图宽度
      barMaxWidth: 30,
    },
    {
      name: "成功率",
      type: "line",
      yAxisIndex: 1,
      data: [],
    },
  ],
}
// 调度次数趋势图
export const dispatchCount = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
    },
  },
  legend: {
    y: "bottom",
    data: ["调度成功", "调度失败"],
  },
  grid: {
    left: "3%",
    right: "100px",
    bottom: "8%",
    containLabel: true
  },
  xAxis: {
    type: "value",
    name: '订单量'
  },
  yAxis: {
    type: "category",
    name: "调度次数",
    data: ['1', '2', '3', '4', '5', '6', '7', '8', '大于8']
  },
  series: [
    {
      name: "调度成功",
      type: "bar",
      stack: "总量",
      label: {
        show: true,
        position: 'inside'
      },
      emphasis: {
        focus: 'series'
      },
      data: []
    },
    {
      name: "调度失败",
      type: "bar",
      stack: "总量",
      label: {
        show: true,
        position: "inside",
      },
      emphasis: {
        focus: 'series'
      },
      data: []
    }
  ],
}

// 调度平均时长
export const averageSchedulingTime = {
  title: {
    // text: "Stacked Line",
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    y: 'bottom',
    // name: item,
    // icon: 'circle'
    data: ["调度成功平均时长", "调度失败平均时长"]
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "10%",

    containLabel: true,
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: [],
  },
  yAxis: {
    type: "value",
    name: '时长 (s)'
  },
  series: [
    {
      name: "调度成功平均时长",
      type: "line",
      stack: "Total",
      data: [],
    },
    {
      name: "调度失败平均时长",
      type: "line",
      stack: "Total",
      data: [],
    }
  ],
}

// 调度失败订单数据分析
export const distpathErrorOrderData = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  legend: {
    y: 'bottom',
    data: ["调度超时自动取消数", "乘客主动取消订单数"]
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "8%",
    containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      data: [],
    },
  ],
  yAxis: [
    {
      type: "value",
      name: '订单量'
    },
  ],
  series: [
    {
      name: "调度超时自动取消数",
      type: "bar",
      stack: "Ad",
      barMaxWidth : 30,//柱图宽度
      label: {
        show: true
      },
      emphasis: {
        focus: "series",
      },
      data: [],
    },
    {
      name: "乘客主动取消订单数",
      type: "bar",
      stack: "Ad",
      barMaxWidth : 30,//柱图宽度
      label: {
        show: true
      },
      emphasis: {
        focus: "series",
      },
      data: [],
    },
  ],
}

// 调度次数明细
export const dispatchCountDetails = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },
  legend: {
    data: ['调度成功订单量', '调度失败订单量'],
    y: 'bottom'
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisPointer: {
        type: 'shadow'
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      min: 0,
      interval: 50,
      axisLabel: {
        formatter: '{value}'
      }
    }
  ],
  series: [
    {
      name: '调度成功订单量',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value
        }
      },
      data: []
    },
    {
      name: '调度失败订单量',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value
        }
      },
      data: []
    }
  ]
}
