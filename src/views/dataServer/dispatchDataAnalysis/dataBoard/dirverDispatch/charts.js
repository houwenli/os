// 柱状图
export const barCharts = {
  title: {
    show: true,
    text: '接驾里程分析',
    x: 'center',
    y: '7px',
    textStyle: {
      fontSize: 16
    },
    textAlign: 'left'
  },
  grid: {
    right: '100px',
    // left: '10%'
    // top: '12%'
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      crossStyle: {
        color: "#999",
      },
    },
    formatter: function(data) {
      const {name, value} = data[0]
      // console.log(data);
      return `${name}<br/>调度成功的订单：${value}`
    }
  },
  xAxis: {
    name: '单位: km',
    nameTextStyle: {
      // align: 'right',
      color: '#333',
      fontSize: 14,
      fontWeight: 'bold'
    },
    type: 'category',
    // data: ['0-3', '3-5', '5-7', '7-9', '12-20', '大于20']
    data: []
  },
  yAxis: {
    name: '订单量',
    nameTextStyle: {
      align: 'right',
      color: '#333',
      fontSize: 14,
      fontWeight: 'bold'
    },
    type: 'value'
  },
  series: [
    {
      // data: [120, 200, 150, 80, 70, 110, 130],
      data: [],
      type: 'bar'
    }
  ]
}

export const dirverDataOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  legend: {
    y: 'bottom',
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "10%",
    containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: []
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [
    // {
    //   name: "1",
    //   type: "bar",
    //   stack: "Ad",
    //   emphasis: {
    //     focus: "series",
    //   },
    //   data: [120, 132, 101, 134, 90, 230, 210, 10],
    // },
    // {
    //   name: "2",
    //   type: "bar",
    //   stack: "Ad",
    //   emphasis: {
    //     focus: "series",
    //   },
    //   data: [150, 232, 201, 154, 190, 330, 410, 10],
    // },
  ],
}

// 饼图
export const pieCharts = {
  title: {
    text: '统计原因合计',
    // subtext: 'Fake Data',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: function(data) {
      const {name, driverFilterRatio} = data.data
      return `${name}: ${driverFilterRatio}%`
    }
  },
  legend: {
    bottom: 10,
  },
  series: [
    {
      // name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
        formatter: function(data) {
          const {name, driverFilterRatio} = data.data
          return `${name}: ${driverFilterRatio}%`
        }
      }
    }
  ]
}