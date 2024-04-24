export const pieOption = {
    title: {
        text:'累计未入网司机量',
        left:'center',
        top:'182',
        padding:[24,0],
        textStyle:{
            align:'center',
            fontSize: 20,
            fontFamily: 'PingFangSC-Semibold, PingFang SC',
            fontWeight: 600,
            color: '#606266',
            lineHeight: 28
        },
        subtext: '',
        subtextStyle: {
            fontSize: 24,
            fontFamily: 'DINAlternate-Bold, DINAlternate',
            fontWeight: 'bold',
            color: '#606266',
            lineHeight: 28,
            rich: {
                a: {
                    fontsize: 16,
                    fontFamily: 'PingFangSC-Regular, PingFang SC',
                    fontWeight: 400,
                    lineHeight: 22
                }
            }
        }
    },
    tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderColor: '#DCDFE6',
        formatter: function(params) {
            let result = `<span style="margin-right: 6px;">${params.name}</span>`;
            let dotHtml = `<span style="display:inline-block;margin-right:5px;width:8px;height:8px;background:${params.color};vertical-align: 0px;border-radius:50%"></span>`;
            const str = params.percent ? '(' + params.percent + '%)' : '(0%)'
            dotHtml += result + params.value + '名' + str + '</br>';
            return `<div style="font-size: 12px;line-height:17px;padding:2px 5px;color: #fff">${dotHtml}</div>`;
        }
    },
    legend: {
        // orient: 'vertical',
        left: 'center',
        top: '15',
        icon: 'circle',
        itemWidth: 9,
        itemHeight: 9,
        textStyle: {
            color: '#606266',
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontSize: 14,
            lineHeight: 20,
        },
    },
    grid: {
        top: 30
    },
    color: ['#254BE9', '#0BDBA8', '#F3D01D', '#FF9B00', '#FD571F'],
    series: [
        {
            name: '累计未入网司机量',
            type: 'pie',
            radius: ['86', '149'],
            center: ['50%', '233'],
            avoidLabelOverlap: false,
            label: {
                show: true,
                position: 'inside',
                formatter(params) {
                    return (params.percent || 0) + '%'
                },
                color: '#fff',
            },
            emphasis: {
                label: {
                    show: true,
                    // fontSize: '40',
                    // fontWeight: 'bold'
                },
            },
            labelLine: {
                show: false,
            },
            data: [],
        },
    ],
};

export const lineOption = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
            backgroundColor: '#283b56'
            }
        },
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderColor: '#DCDFE6',
        formatter: function(params) {
            let result = `<div style="margin-bottom: 3px;">${params[0].name}</div>`;
            params.forEach(function(item) {
                const h = item.seriesType === 'bar' ? 6 : 4
                let dotHtml = `<span style="display:inline-block;margin-right:5px;width:10px;height:${h}px;background:${item.color};vertical-align: 2px"></span>`;
                result += dotHtml + item.seriesName + '：' + item.data + '</br>';
            });
            result = `<div style="font-size: 12px;line-height:17px;padding:2px 5px;color:#fff">${result}</div>`;
            return result;
        }
    },
    grid: {
        top: '50',
        right: '40',
        left: '60',
        bottom: '30' //图表尺寸大小
    },
    legend: {
        // 修改legend的高度宽度
        data: [{
                name: '新增未入网司机量',
                itemStyle: {}
            },
            {
                name: '累计未入网司机量',
                itemStyle: {
                    color: '#FD571F'
                }
            }
        ],
        itemWidth: 10,
        itemHeight: 8,
        itemGap: 20,
        icon: 'rect', // ledend的icon
        textStyle: {
            fontSize: 14,
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontWeight: 400,
            color: '#606266',
            lineHeight: 20
        },
        top: 0,
        left: 0
    },
    color: ['#254BE9', '#FD571F'],
    xAxis: [{
        type: 'category',
        data: [],
        axisLabel: {
            margin: 10,
            color: '#999',
            textStyle: {
                fontSize: 12
            },
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(107,107,107,0.37)',
            }
        },
        axisTick: {
            show: false
        },
    }],
    yAxis: [{
        // name:'新增未入网司机量',
        type: 'value',
        axisLabel: {
            formatter: '{value}',
            color: '#999',
            textStyle: {
                fontSize: 12
            },
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(107,107,107,0.37)',
            }
        },
        axisTick: {
            show: false
        },
        splitLine: {
            lineStyle: {
                color: 'rgba(131,101,101,0.2)',
                type: 'dashed',
            }
        }
    }, {
        // name: '累计未入网司机量',
        type: 'value',
        axisLabel: {
            formatter: '{value}',
            color: '#999',
            textStyle: {
                fontSize: 12
            },
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(107,107,107,0.37)',
            }
        },
        axisTick: {
            show: false
        },
        splitLine: {
            lineStyle: {
                color: 'rgba(131,101,101,0.2)',
                type: 'dashed',
            }
        }
    }],
    series: [{
        type: 'bar',
        name:"新增未入网司机量",
        data: [],
        barWidth: '16px',
        itemStyle: {
            normal: {
                color: "#254BE9"
            },
        },
        yAxisIndex: 1
    }, {
        data: [],
        type: 'line',
        smooth: false,
        name: '累计未入网司机量',
        // symbol: 'none',
        symbolSize: 6,
        symbolOffset: [0, 1],
        color: '#FD571F',
        lineStyle: {
            // width: 2,
            // shadowColor: 'rgba(255, 255,255, 0.3)', //设置折线阴影
            shadowBlur: 0,
        }
    }]
};
