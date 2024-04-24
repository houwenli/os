// 热力图弹窗饼图
export const pieCharts = {
  tooltip: {
    trigger: "item",
    formatter: function (data) {
      const { value, name } = data.data;
      return `${name}：${value}%`;
    },
  },
  legend: {
    bottom: 10,
    left: "center",
    data: ["调度超时总量", "乘客主动取消总量"],
  },
  series: [
    {
      type: "pie",
      radius: "50%",
      center: ["50%", "50%"],
      selectedMode: "single",
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
      label: {
        normal: {
          show: true,
          position: 'inner',
          formatter: function(data) {
            const { value, orderCount } = data.data
            return `订单量：${orderCount} \n占比：${value}%`
          },
        },
      }
    },
  ],
}
// 围栏颜色图例
export const colorChartsList = [
  {
    label: '50k-100k',
    value: '1',
    min: 50000,
    max: 100000,
    level: 4
  },
  {
    label: '20k-50k',
    value: '0.8',
    min: 20000,
    max: 50000,
    level: 3
  },
  {
    label: '5k-20k',
    value: '0.4',
    min: 5000,
    max: 20000,
    level: 2
  },
  {
    label: '0-5k',
    value: '0.2',
    min: 0,
    max: 5000,
    level: 1
  },
]