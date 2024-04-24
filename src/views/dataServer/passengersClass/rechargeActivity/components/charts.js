// 充值人数分析
export const rechargeActivity = {
  tooltip: {
    trigger: "axis",
    backgroundColor: 'rgba(00,00,00,0.7)',
    borderRadius: 2, //边框圆角
    borderColor: 'transparent',
    textStyle: {
        color: '#fff',
        fontSize: 14
    },
    confine: true,
    formatter: function (params) {
      let tip = ''
      if(params!=null&&params.length){
        tip +=params[0].name+'<br />'
        for(let i=0;i<params.length;i++){
          tip += `${params[i].marker}${params[i].seriesName}：${params[i].value}${params[i].seriesIndex?' 笔':' 人'}<br />`
        }
      }
      return tip
    }
  },
  legend: {
    icon:'rect',
    left:0,
    itemWidth: 10,
    itemHeight: 4,
    // data: ["充值人次", "用户充值笔数"],
    textStyle: {
        fontSize: 14,
        color:"#606266"
    },
    itemGap:24
  },
  grid: {
    x: 0,
    y: 48,
    x2: 24,
    y2: 24,
    containLabel: true,
  },
  xAxis: {
    type: "category",
    boundaryGap: true,
    data: [],
    axisLine: {
        lineStyle:{
          color:"#DCDFE6"
        }
    },
    axisLabel: {
      color: '#606266',
      fontSize: 12
    },
  },
  yAxis: {
    min: 0,
    minInterval: 1, // 最小分割刻度
    type: "value",
    axisLabel: {
      color: 'rgba(0, 0, 0, 0.45)',
      fontSize: 12
    },
    splitLine: {
      show: true,
      lineStyle: {
          color: '#DCDFE6'
      }
  },
  },
  color: ['#0BDBA8', '#1D93FF', '#F3D01D', '#FD571F'],
  series: [
    {
      name: "充值人次",
      type: "line",
      data: [],
      // color:"#0BDBA8",
    },
    {
      name: "用户充值笔数",
      type: "line",
      data: [],
      // color:'#F3D01D'
    }
  ],
}
// 充值资产分析
export const rechargeActivityMoney = {
  tooltip: {
    trigger: "axis",
    backgroundColor: 'rgba(00,00,00,0.7)',
    borderRadius: 2, //边框圆角
    borderColor: 'transparent',
    textStyle: {
        color: '#fff',
        fontSize: 14
    },
    confine: true,
    formatter: function (params) {
      let tip = ''
      if(params!=null&&params.length){
        tip +=params[0].name+'<br />'
        for(let i=0;i<params.length;i++){
          tip += params[i].marker+params[i].seriesName+"："+params[i].value+' 元<br />'
        }
      }
      return tip
    }
  },
  legend: {
    icon:'rect',
    left:0,
    itemWidth: 10,
    itemHeight: 4,
    // data: ["总入账金额", "充值金额",'赠送金额'],
    textStyle: {
        fontSize: 14,
        color:"#606266"
    },
    itemGap:24
  },
  grid: {
    x: 0,
    y: 48,
    x2: 24,
    y2: 24,
    containLabel: true,
  },
  xAxis: {
    type: "category",
    boundaryGap: true,
    data: [],
    axisLine: {
        lineStyle:{
          color:"#DCDFE6"
        }
    },
    axisLabel: {
      color: '#606266',
      fontSize: 12
    },
  },
  yAxis: {
    min: 0,
    minInterval: 1, // 最小分割刻度
    type: "value",
    axisLabel: {
      color: 'rgba(0, 0, 0, 0.45)',
      fontSize: 12
    },
    splitLine: {
      show: true,
      lineStyle: {
          color: '#DCDFE6'
      }
  },
  },
  color: ['#0BDBA8', '#1D93FF', '#F3D01D', '#FD571F'],
  series: [
    {
      name: "总入账金额",
      type: "line",
      data: [],
      // color:"#0BDBA8",
    },
    {
      name: "充值金额",
      type: "line",
      data: [],
      // color:'#F3D01D'
    },
    {
      name: "赠送金额",
      type: "line",
      data: [],
      // color:'#1D93FF'
    },
  ],
}
