// 金额分析
export const orgRecommendMoney = {
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
      if (params != null && params.length) {
        tip += params[0].name + '<br />'
        for (let i = 0; i < params.length; i++) {
          tip += `${params[i].marker}${params[i].seriesName}：${params[i].value}元<br />`
        }
      }
      return tip
    }
  },
  legend: {
    icon: 'rect',
    right: 0,
    itemWidth: 10,
    itemHeight: 4,
    data: ["下单金额", "支付金额", "退款金额", "结算金额",],
    textStyle: {
      fontSize: 14,
      color: "#606266"
    },
    itemGap: 24
  },
  grid: {
    top: '65',
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
      lineStyle: {
        color: "#DCDFE6"
      }
    },
    axisLabel: {
      color: '#606266',
      fontSize: 12
    },
  },
  yAxis: {
    name: '单位：元',
    nameTextStyle: {
      align: 'left'
    },
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
  series: [
    {
      name: "下单金额",
      type: "line",
      data: [],
      color: "#F3D01D",
    },
    {
      name: "支付金额",
      type: "line",
      data: [],
      color: '#FF9B00'
    },
    {
      name: "退款金额",
      type: "line",
      data: [],
      color: '#FD571F'
    },
    {
      name: "结算金额",
      type: "line",
      data: [],
      color: '#9A7AFF'
    }

  ],
}
// 笔数分析
export const orgRecommend = {
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
      if (params != null && params.length) {
        tip += params[0].name + '<br />'
        for (let i = 0; i < params.length; i++) {
          tip += `${params[i].marker}${params[i].seriesName}：${params[i].value}笔<br />`
        }
      }
      return tip
    }
  },
  legend: {
    icon: 'rect',
    left: 0,
    itemWidth: 10,
    itemHeight: 4,
    data: ["下单订单数", "支付订单数"],
    textStyle: {
      fontSize: 14,
      color: "#606266"
    },
    itemGap: 24
  },
  grid: {
    top: '65',
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
      lineStyle: {
        color: "#DCDFE6"
      }
    },
    axisLabel: {
      color: '#606266',
      fontSize: 12
    },
  },
  yAxis: {
    name: '单位：笔',
    nameTextStyle: {
      align: 'left'
    },
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
  series: [
    {
      name: "下单订单数",
      type: "line",
      data: [],
      color: "#0BDBA8",
    },
    {
      name: "支付订单数",
      type: "line",
      data: [],
      color: '#F3D01D'
    }
  ],
}

// 支付方式分析line
export const payWayChartOption = {
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
      if (params != null && params.length) {
        tip += params[0].name + '<br />'
        for (let i = 0; i < params.length; i++) {
          tip += `${params[i].marker}${params[i].seriesName}：${params[i].value}元<br />`
        }
      }
      return tip
    }
  },
  legend: {
    icon: 'rect',
    left: 0,
    itemWidth: 10,
    itemHeight: 4,
    data: ["余额支付", "微信支付", "支付宝支付", "福气值支付"],
    textStyle: {
      fontSize: 14,
      color: "#606266"
    },
    itemGap: 24
  },
  grid: {
    top: '65',
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
      lineStyle: {
        color: "#DCDFE6"
      }
    },
    axisLabel: {
      color: '#606266',
      fontSize: 12
    },
  },
  yAxis: {
    name: '单位：元',
    nameTextStyle: {
      align: 'left'
    },
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
  series: [
    {
      name: "余额支付",
      type: "line",
      data: [],
      color: "#0BDBA8",
    },
    {
      name: "微信支付",
      type: "line",
      data: [],
      color: '#F3D01D'
    },
    {
      name: "支付宝支付",
      type: "line",
      data: [],
      color: '#1D93FF'
    },
    {
      name: "福气值支付",
      type: "line",
      data: [],
      color: '#FF4369'
    },
    {
      name: "线下打款",
      type: "line",
      data: [],
      color: '#0088FF'
    }

  ],
}
//支付方式分析 pie
export const payWayPieChartOption = {
  tooltip: {
    trigger: 'item',
    formatter: "{b}: {d}%"
  },
  legend: {
    show: false,//设置legend不展示
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: '',
      type: 'pie',
      radius: ['30%', '70%'],
      avoidLabelOverlap: true,
      label: {
        show: true,
        position: 'inner',//展示在环内
        formatter: "{name| {d}%}",
        rich: {
          name: {
            fontSize: 14,
            color: '#fff'
          }
        }
      },
      labelLine: {
        show: false
      },
      data: []
    }
  ]
}
//访客登录分析
export const loginChartOption = {
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
      if (params != null && params.length) {
        tip += params[0].name + '<br />'
        for (let i = 0; i < params.length; i++) {
          tip += `${params[i].marker}${params[i].seriesName}：${params[i].value}<br />`
        }
      }
      return tip
    }
  },
  legend: {
    icon: 'rect',
    left: 0,
    itemWidth: 10,
    itemHeight: 4,
    data: ["总访客", "登录人数", "登录次数", "总点击",],
    textStyle: {
      fontSize: 14,
      color: "#606266"
    },
    itemGap: 24
  },
  grid: {
    top: '65',
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
      lineStyle: {
        color: "#DCDFE6"
      }
    },
    axisLabel: {
      color: '#606266',
      fontSize: 12
    },
  },
  yAxis: {
    nameTextStyle: {
      align: 'left'
    },
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
  series: [
    {
      name: "总访客",
      type: "line",
      data: [],
      color: "#0BDBA8",
      field:'visitPeopleCntTrend',
    },
    {
      name: "登录人数",
      type: "line",
      data: [],
      color: '#F3D01D',
      field:'loginPeopleCntTrend'
    },
    {
      name: "登录次数",
      type: "line",
      data: [],
      color: '#1D93FF',
      field:'loginCntTrend'
    },
    {
      name: "总点击",
      type: "line",
      data: [],
      color: '#FF4369',
      field:'clickCntTrend'
    }

  ],
}

//商品浏览分析
export const goodsBrowseChartOption = {
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
        if (params != null && params.length) {
          tip += params[0].name + '<br />'
          for (let i = 0; i < params.length; i++) {
            tip += `${params[i].marker}${params[i].seriesName}：${params[i].value}<br />`
          }
        }
        return tip
      }
    },
    legend: {
      icon: 'rect',
      left: 0,
      itemWidth: 10,
      itemHeight: 4,
      data: ["购物车宝贝数", "被收藏宝贝数", "被浏览宝贝数"],
      textStyle: {
        fontSize: 14,
        color: "#606266"
      },
      itemGap: 24
    },
    grid: {
      top: '65',
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
        lineStyle: {
          color: "#DCDFE6"
        }
      },
      axisLabel: {
        color: '#606266',
        fontSize: 12
      },
    },
    yAxis: {
      nameTextStyle: {
        align: 'left'
      },
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
    series: [
      {
        name: "购物车宝贝数",
        type: "line",
        data: [],
        color: "#0BDBA8",
        field:'addToCartGoodsCntTrend'
      },
      {
        name: "被收藏宝贝数",
        type: "line",
        data: [],
        color: '#F3D01D',
        field:'collectGoodsCntTrend'
      },
      {
        name: "被浏览宝贝数",
        type: "line",
        data: [],
        color: '#1D93FF',
        field:'browseGoodsCntTrend'
      },

    ],
}

//订单量分析
export const orderQuantityChartOption = {
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
        if (params != null && params.length) {
          tip += params[0].name + '<br />'
          for (let i = 0; i < params.length; i++) {
            tip += `${params[i].marker}${params[i].seriesName}：${params[i].value}<br />`
          }
        }
        return tip
      }
    },
    legend: {
      icon: 'rect',
      left: 0,
      itemWidth: 10,
      itemHeight: 4,
      data: ["下单量", "支付订单量", "售后订单量"],
      textStyle: {
        fontSize: 14,
        color: "#606266"
      },
      itemGap: 24
    },
    grid: {
      top: '65',
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
        lineStyle: {
          color: "#DCDFE6"
        }
      },
      axisLabel: {
        color: '#606266',
        fontSize: 12
      },
    },
    yAxis: {
      nameTextStyle: {
        align: 'left'
      },
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
    series: [
      {
        name: "下单量",
        type: "line",
        data: [],
        color: "#0BDBA8",
      },
      {
        name: "支付订单量",
        type: "line",
        data: [],
        color: '#F3D01D'
      },
      {
        name: "售后订单量",
        type: "line",
        data: [],
        color: '#1D93FF'
      },

    ],
}

//平台供应商数据
export const suppliersChartOption = {
  tooltip: {
    trigger: 'item',
    formatter:'{b}：{d}%； {c}个',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 0,
    textStyle: {
      fontSize: 12,
      fontFamily: 'PingFangSC-Medium, PingFang SC',
      fontWeight: '500',
      color: '#FFFFFF'
    }
  },
  legend: {
    orient: 'vertical',
    right: '15%',
    y: 'center',
    itemWidth: 10,
    itemHeight: 4,
    textStyle: {
      color: '#909399',
      fontSize: 12,
      fontFamily:' PingFangSC-Regular, PingFang SC',
      fontWeight: 400,
      lineHeight: 17,
    }
  },
  series: {
    type: 'pie',
    radius: ['55%', '90%'],
    center: ['30%', '50%'],
    avoidLabelOverlap: false,
    itemStyle: {
      borderWidth: 3, //设置border的宽度有多大
      borderColor: '#fff'
    },
    label: {
      show: true,
      position: 'center',
      formatter: '{a|累计入住供应商数量}\n{b|0}',
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
    emphasis:{
      label:{
        show:true,
      }
    },
    data: [
      {
        value: 0,
        name: '营业中供应商数量',
        itemStyle: {
          color: '#0BDBA8'
        }
      },
      {
        value: 0,
        name: '审核中供应商数量',
        itemStyle: {
          color: '#254BE9'
        }
      },
      {
        value: 0,
        name: '停业供应商数',
        itemStyle: {
          color: '#F3D01D'
        }
      }
    ]
  }
};

// 平台维度-金额分析
export const platformOrgRecommendMoney = {
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
        if (params != null && params.length) {
          tip += params[0].name + '<br />'
          for (let i = 0; i < params.length; i++) {
            tip += `${params[i].marker}${params[i].seriesName}：${params[i].value}元<br />`
          }
        }
        return tip
      }
    },
    legend: {
      icon: 'rect',
      left: 0,
      itemWidth: 10,
      itemHeight: 4,
      data: [ "支付金额", "退款金额", "绩效金额"],
      textStyle: {
        fontSize: 14,
        color: "#606266"
      },
      itemGap: 24
    },
    grid: {
      top: '65',
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
        lineStyle: {
          color: "#DCDFE6"
        }
      },
      axisLabel: {
        color: '#606266',
        fontSize: 12
      },
    },
    yAxis: {
      name: '单位：元',
      nameTextStyle: {
        align: 'left'
      },
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
    series: [
      {
        name: "支付金额",
        type: "line",
        data: [],
        color: '#F3D01D'
      },
      {
        name: "退款金额",
        type: "line",
        data: [],
        color: '#1D93FF'
      },
      {
        name: "绩效金额",
        type: "line",
        data: [],
        color: '#FF4369'
      }
  
    ],
  }
  // 平台维度-笔数分析
export const platformOrgRecommend = {
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
        if (params != null && params.length) {
          tip += params[0].name + '<br />'
          for (let i = 0; i < params.length; i++) {
            tip += `${params[i].marker}${params[i].seriesName}：${params[i].value}笔<br />`
          }
        }
        return tip
      }
    },
    legend: {
      icon: 'rect',
      left: 0,
      itemWidth: 10,
      itemHeight: 4,
      data: ["支付订单数","退款订单数"],
      textStyle: {
        fontSize: 14,
        color: "#606266"
      },
      itemGap: 24
    },
    grid: {
      top: '65',
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
        lineStyle: {
          color: "#DCDFE6"
        }
      },
      axisLabel: {
        color: '#606266',
        fontSize: 12
      },
    },
    yAxis: {
      name: '单位：笔',
      nameTextStyle: {
        align: 'left'
      },
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
    series: [
      {
        name: "支付订单数",
        type: "line",
        data: [],
        color: '#F3D01D'
      },
      {
        name: "退款订单数",
        type: "line",
        data: [],
        color: "#0BDBA8",
      },
    ],
  }