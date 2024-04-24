export const waitingTimeDispatch = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      crossStyle: {
        color: "#999"
      },
    },
  },
  legend: {
    y: "bottom",
    data: ["调度成功订单量", "调度超时订单量", "乘客主动取消订单量", "乘客主动取消率"],
  },
  xAxis: [
    {
      type: "category",
      name: '单位: s',
      nameTextStyle: {
        padding: [0,0,0,10],
        color: '#333',
        fontSize: 14,
        fontWeight: 'bold',
      },
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
      // interval: 50, // Y轴分割刻度
      minInterval: 1, // 最小分割刻度
      axisLabel: {
        formatter: "{value}"
      }
    },
    {
      type: "value",
      name: "",
      min: 0,
      interval: 20
    },
  ],
  series: [
    {
      name: "调度成功订单量",
      type: "bar",
      data: [],
    },
    {
      name: "调度超时订单量",
      type: "bar",
      data: [],
    },
    {
      name: "乘客主动取消订单量",
      type: "bar",
      data: [],
    },
    {
      name: "乘客主动取消率",
      type: "line",
      yAxisIndex: 1,
      data: [],
    },
  ],
}