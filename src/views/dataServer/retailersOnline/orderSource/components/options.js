export const pieOption = {
    title: {
        text: '',
        left: 'center',
        top: '170',
        padding: [24, 0],
        textStyle: {
            align: 'center',
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
        formatter: function (params) {
            let result = `<span style="margin-right: 6px;">${params.name}</span>`;
            let dotHtml = `<span style="display:inline-block;margin-right:5px;width:8px;height:8px;background:${params.color};vertical-align: 0px;border-radius:50%"></span>`;
            dotHtml += result + params.value + '元' + '</br>';
            return `<div style="font-size: 12px;line-height:17px;padding:2px 5px;color: #fff">${dotHtml}</div>`;
        }
    },
    legend: {
        // orient: 'vertical',
        left: '10',
        top: '8',
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
        top: 40,
        left: 10,
        right: 10,
        bottom: 10
    },
    color: ['#0BDBA8', '#1D93FF', '#F3D01D', '#FD571F'],
    series: [
        {
            name: '',
            type: 'pie',
            radius: ['60', '110'],
            center: ['50%', '56%'],
            avoidLabelOverlap: true,
            minAngle: 2,
            overflow: 'breakAll',
            rotate: true,
            label: {
                show: true,
                position: 'outside',
                formatter(params) {
                    return (params.value || 0) + '元'
                },
                alignTo: 'labelLine',
                fontSize: '14px',
                fontFamily: 'PingFangSC-Regular, PingFang SC',
                fontWeight: 400,
                color: '#303133'
            },
            labelLine: {
                show: true,
                showAbove: true
            },
            labelLayout: {
                width: 200
            },
            emphasis: {
                label: {
                    show: true
                },
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
        formatter: function (params) {
            let result = `<div style="margin-bottom: 3px;">${params[0].name}</div>`;
            params.forEach(function (item) {
                let dotHtml = `<span style="display:inline-block;margin-right:5px;width:10px;height:4px;background:${item.color};vertical-align: 2px"></span>`;
                result += dotHtml + item.seriesName + '：' + item.data + '</br>';
            });
            result = `<div style="font-size: 12px;line-height:17px;padding:2px 5px;color:#fff">${result}</div>`;
            return result;
        }
    },
    grid: {
        top: '70',
        right: '20',
        left: '20',
        bottom: '20', //图表尺寸大小
        containLabel: true,
    },
    legend: {
        // 修改legend的高度宽度
        // data: [],
        itemWidth: 10,
        itemHeight: 4,
        itemGap: 20,
        icon: 'rect', // ledend的icon
        textStyle: {
            fontSize: 14,
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontWeight: 400,
            color: '#606266',
            lineHeight: 20
        },
        top: 8,
        left: 15
    },
    color: ['#0BDBA8', '#1D93FF', '#F3D01D', '#FD571F'],
    xAxis: [{
        type: 'category',
        data: [],
        axisLabel: {
            margin: 10,
            color: '#999',
            fontSize: 12,
            boundaryGap: ['20%', '20%']
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
        name: '单位：元',
        nameTextStyle: {
            fontSize: '12px',
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontWeight: 400,
            color: 'rgba(0,0,0,0.45)',
            lineheight: '17px',
            align: 'left'
        },
        nameGap: 10,
        minInterval: 1,
        type: 'value',
        axisLabel: {
            formatter: '{value}',
            color: '#999',
            fontSize: 12
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
            fontSize: 12
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
        type: 'line',
        data: []
    }]
};
