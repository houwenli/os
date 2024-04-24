export const bar_options = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        extraCssText: "background: rgba(0,0,0,0.7);border-color: transparent",
        textStyle: {
            color: '#fff',
        }
    },
    legend: {
        left: 0,
        icon:'rect',
        itemWidth: 10,
        itemHeight: 8,
        textStyle: {
            fontSize: 14,
            color:"#606266"
        },
        itemGap:24
    },
    grid: {
        left: '0',
        right: '0',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: []
    },
    yAxis: [
        {
            type: 'value',
            minInterval: 1,
        }
    ],
    color: ["#254BE9", "#FD571F"],
    series: [
        {
            name: '已解决数量',
            type: 'bar',
            stack: 'Search Engine',
            barWidth: 18,
            barMaxWidth: 18,
            emphasis: {
              focus: 'series'
            },
            // itemStyle: {
            //     normal: {
            //         color: "#254BE9"
            //     },
            // },
            // data: [{value:120,id:1}, 132, 101, 134, 290, 230, 220]
        },
        {
            name: '未解决数量',
            type: 'bar',
            stack: 'Search Engine',
            barWidth: 18,
            barMaxWidth: 18,
            emphasis: {
              focus: 'series'
            },
            // itemStyle: {
            //     normal: {
            //         color: "#FD571F"
            //     },
            // },
            // data: [60, 72, 71, 74, 190, 130, 110]
        },
    ]
};

export const bar_double_y_options = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        extraCssText: "background: rgba(0,0,0,0.7);border-color: transparent",
        textStyle: {
            color: '#fff',
        }
    },
    legend: [
        {
            x: 'left',
            y: 0,
            icon:'rect',
            itemWidth: 10,
            itemHeight: 8,
            textStyle: {
                fontSize: 14,
                color:"#606266"
            },
            itemGap:24,
            data: ['已解决数量', '未解决数量'],
        },
    ],
    grid: {
        left: '0',
        right: '0',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: []
    },
    yAxis: [
        {
            type: 'value',
            minInterval: 1,
        },
        {
            type: 'value',
            name: '',
            axisLabel: {},
            nameTextStyle: {
                color: 'transparent'
            },
            minInterval: 1,
            min: 0,
            axisLine: {show: false} ,
            // axisTick: {show: false},
            // axisLabel: {show: false},
            splitLine: {show: false}
        }
    ],
    series: [
        {
            name: '投诉总数',
            type: 'bar',
            stack: 'Search Engine',
            barWidth: 18,
            emphasis: {
              focus: 'series'
            },
            // itemStyle: {
            //     normal: {
            //         color: "#FD571F"
            //     },
            // },
            data: [120, 132, 101, 134, 290, 230, 220]
        },
        {
            name: '投诉订单数',
            type: 'bar',
            stack: 'Search Engine',
            barWidth: 18,
            emphasis: {
              focus: 'series'
            },
            // itemStyle: {
            //     normal: {
            //         color: "#254BE9"
            //     },
            // },
            data: [60, 72, 71, 74, 190, 130, 110]
        },
        // {
        //     name: '单位:h',
        //     type: 'line',
        //     yAxisIndex: 1,
        //     data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 22]
        // }
    ]
}

export const line_options = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        extraCssText: "background: rgba(0,0,0,0.7);border-color: transparent",
        textStyle: {
            color: '#fff',
        }
    },
    legend: {
        left: 0,
        icon:'rect',
        itemWidth: 10,
        itemHeight: 4,
        textStyle: {
            fontSize: 14,
            color:"#606266"
        },
        itemGap:24,
    },
    color: ['#0BDBA8', '#1D93FF', '#F3D01D'],
    grid: {
        left: '0',
        right: '0',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
          name: '客诉数量',
          type: 'line',
        //   stack: 'Total',
          data: []
        },
        {
          name: '客诉订单数',
          type: 'line',
        //   stack: 'Total',
          data: []
        },
        {
            name: '客诉用户数',
            type: 'line',
            // stack: 'Total',
            data: []
        },
    ]
}

export const pie_options = {
    title: {
        textAlign: 'center',
        textStyle: {
            fontSize: '14px',
            color: '#303133',
            fontWeight: 400,
        },
        subtextStyle: {
            fontSize: '20px',
            color: '#606266',
            fontWeight: 600,
        },
        left: '48%',
        top: '42%'
    },
    tooltip: {
        trigger: 'item',
        extraCssText: "background: rgba(0,0,0,0.7);border-color: transparent",
        textStyle: {
            color: '#fff',
        },
    },
    selectedMode: true,
    color: ['#254BE9', '#0BDBA8', '#F3D01D', '#FF9B00'],
    // legend: {
    //     top: '5%',
    //     left: 'center'
    // },
    
    series: [
        {
            name: '',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: false,
                    fontSize: 40,
                    fontWeight: 'bold'
                },
                itemStyle: {
                    borderWidth:5, //设置border的宽度有多大
                    borderColor:'#fff',
                }
            },
            labelLine: {
                show: false
            },
            data: [
                // { value: 1048, name: 'Search Engine' },
                // { value: 735, name: 'Direct' },
                // { value: 580, name: 'Email' },
                // { value: 484, name: 'Union Ads' },
                // { value: 300, name: 'Video Ads' }
            ]
        }
    ]
}

export const right_bar_options = {
    title: {
      text: ''
    },
    color: ['#254BE9', '#FD571F'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        extraCssText: "background: rgba(0,0,0,0.7);border-color: transparent",
        textStyle: {
            color: '#fff',
        }
    },
    legend: {
        left: 0
    },
    grid: {
        left: '0',
        right: '20',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        axisLabel: {},
        nameTextStyle: {
            color: 'transparent'
        },
        minInterval: 1,
        min: 0,
        axisLabel: { show: true },
        axisLine: { show: true },
        // axisTick: {show: false},
        // axisLabel: {show: false},
    },
    yAxis: {
        type: 'category',
        data: []
    },
    series: [
      {
        name: '已解决数量',
        type: 'bar',
        barWidth: 18,
        data: []
      },
      {
        name: '未解决数量',
        type: 'bar',
        barWidth: 18,
        data: []
      }
    ]
  };