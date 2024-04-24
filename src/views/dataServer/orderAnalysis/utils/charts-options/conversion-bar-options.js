export const CONVERSION_BAR_OPTS = {
    tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderColor: 'rgba(0,0,0,0.7)',
        formatter: function (params) {
            // let result = `<div style="margin-bottom: 3px;">${params[0].name}-${((params[0].dataIndex+1)<10?'0'+(params[0].dataIndex+1):params[0].dataIndex+1)+':00'}</div>`;
            // let result = `<div style="margin-bottom: 3px;">${params[0].name}</div>`;
            params.forEach(function (item) {
                const arr = ['应答率', '完成率', '取消率']
                let unit = arr.includes(item.seriesName) ? '%' : '';
                let dotHtml = `<span style="display:inline-block;margin-right:5px;width:10px;height:8px;background:${item.color};vertical-align: 2px"></span>`;
                result += dotHtml + item.seriesName + '：' + item.data + '' + unit + '</br>';
            });
            result = `<div style="font-size: 12px;line-height:17px;padding:2px 5px;color: #fff">${result}</div>`;
            return result;
        },
    },
    grid: {
        left: '0',
        right: '0',
        bottom: '0',
        containLabel: true
    },
    legend: {
        top: 0,
        left: 0,
        align: 'auto',
        itemWidth: 9,
        itemHeight: 9,
        itemGap: 20,
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
        // data: ['已下单订单', '应答订单', '应答率']
    },
    xAxis: [
        {
            type: 'category',
            axisLabel: {
                interval: 1, // 坐标轴刻度标签的显示间隔，在类目轴中有效
                showMaxLabel: true,
                color: 'rgba(0, 0, 0, 0.45)'
            },
            axisLine: {
                lineStyle: {
                    color: '#DCDFE6'
                }
            },
            data: [],
        }
    ],
    color: [
        '#254BE9',
        '#0BDBA8',
        '#F3D01D'
    ],
    yAxis: [
        {
            type: 'value',
            min: 0,
            // max: 1506,
            // interval: 20,
            axisLabel: {
                formatter: '{value}'
            },
        },
        {
            type: 'value',
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
                formatter: '{value}%'
            },
        }
    ],
    series: [
        // {
        //     name: '已下单订单',
        //     type: 'bar',
        //     data: [
        //         2.0, 4.9, 7.0, 2.0, 4.9, 8.0,
        //     ],
        //     barMaxWidth: 10
        // },
        // {
        //     name: '应答订单',
        //     type: 'bar',
        //     data: [
        //         2.0, 4.9, 7.0, 2.0, 4.9, 7.0,
        //     ],
        //     barMaxWidth: 10
        // },
        // {
        //     name: '应答率',
        //     type: 'line',
        //     yAxisIndex: 1,
        //     data: [2.0, 4.9, 7.0, 2.0, 4.9, 7.0,]
        // }
    ]
};