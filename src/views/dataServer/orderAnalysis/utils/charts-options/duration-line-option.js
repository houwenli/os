export const DURATION_LINE_OPTS = {
    tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderColor: 'rgba(0,0,0,0.7)',
        formatter: function (params) {
            let result = `<div style="margin-bottom: 3px;">${params[0].name}</div>`;
            params.forEach(function (item) {
                let dotHtml = `<span style="display:inline-block;margin-right:5px;width:10px;height:8px;background:${item.color};vertical-align: 2px"></span>`;
                result += dotHtml + item.seriesName + '：' + item.data + 's</br>';
            });
            result = `<div style="font-size: 12px;line-height:17px;padding:2px 5px;color: #fff">${result}</div>`;
            return result;
        },
    },
    legend: {
        top: 0,
        left: 0,
        align: 'auto',
        itemWidth: 10,
        itemHeight: 4,
        itemGap: 24,
        icon: 'rect',
        formatter: '{a|{name}}',
        textStyle: {
            rich: {
                a: {
                    color: '#606266',
                    fontSize: 14,
                    height: 20,
                    padding: [2, 24, 0, 0],
                    verticalAlign: 'middle'
                }
            }
        },
        data: ['平均接单等待时长', '平均接驾等待时长', '平均等待乘客时长']
    },
    color: [
        '#0BDBA8',
        '#FD571F',
        '#1D93FF'
    ],
    grid: {
        left: '0',
        right: '0',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: [],
        axisLine: {
            lineStyle: {
                width: 0,
                color: '#DCDFE6'
            }
        },
        axisLabel: {
            interval: 0,
            color: 'rgba(0, 0, 0, 0.45)',
            rotate: 0
        },
        // axisTick: {
        //     inside: true
        // }
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            color: 'rgba(0, 0, 0, 0.45)',
            formatter: '{value}s'
        },
        splitLine: {
            lineStyle: {
                color: '#DCDFE6'
            }
        },
        axisLine: {
            lineStyle: {
                width: 0,
                color: '#DCDFE6'
            }
        }
    },
    series: [
        {
            name: '平均接单等待时长',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: '平均接驾等待时长',
            type: 'line',
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            name: '平均等待乘客时长',
            type: 'line',
            data: [150, 232, 201, 154, 190, 330, 410]
        },
    ]
};