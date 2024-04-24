export const pieOption = {
    title: {
        text:'',
        left:'center',
        top:'170',
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
            color: '#303133',
            lineHeight: 28,
            rich: {
                a: {
                    fontsize: 16,
                    fontFamily: 'PingFangSC-Regular, PingFang SC',
                    fontWeight: 400,
                    lineHeight: 22,
                    color: '#606266'
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
            let unit = '元'
            if (params.name === '平台推广员量' || params.name === '车主推广员量') {
                unit = '名'
            }
            dotHtml += result + params.value + unit + str + '</br>';
            return `<div style="font-size: 12px;line-height:17px;padding:2px 5px;color: #fff">${dotHtml}</div>`;
        }
    },
    legend: {
        // orient: 'vertical',
        left: '10',
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
        top: 40
    },
    color: ['#254BE9', '#0BDBA8', '#F3D01D', '#FF9B00', '#FD571F', '#1D93FF', '#2B2B31'],
    series: [
        {
            name: '',
            type: 'pie',
            radius: ['80', '140'],
            center: ['50%', '220'],
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
                let dotHtml = `<span style="display:inline-block;margin-right:5px;width:10px;height:8px;background:${item.color};vertical-align: 2px"></span>`;
                result += dotHtml + item.seriesName + '：' + item.data + '人' + '</br>';
            });
            result = `<div style="font-size: 12px;line-height:17px;padding:2px 5px;color:#fff">${result}</div>`;
            return result;
        }
    },
    grid: {
        top: '50',
        right: '10',
        left: '40',
        bottom: '30' //图表尺寸大小
    },
    legend: {
        // 修改legend的高度宽度
        data: [{
                itemStyle: {
                    color: '#254BE9'
                }
            },
            {
                itemStyle: {
                    color: '#0BDBA8'
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
    color: ['#254BE9', '#0BDBA8'],
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
        // name:'',
        type: 'value',
        minInterval: 1,
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
        // name: '',
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
        data: [],
        barWidth: '18px',
        itemStyle: {
            normal: {
                color: "#254BE9"
            },
        },
        // yAxisIndex: 1
    }, {
        type: 'bar',
        data: [],
        barWidth: '18px',
        itemStyle: {
            normal: {
                color: "#0BDBA8"
            },
        }
    }]
};
