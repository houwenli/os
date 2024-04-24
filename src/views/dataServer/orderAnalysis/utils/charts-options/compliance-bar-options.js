export const COMPLIANCE_BAR_OPTS = {
    tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderColor: 'rgba(0,0,0,0.7)',
        formatter: function (params) {
            let result = `<div style="margin-bottom: 3px;">${params[0].name}</div>`;
            params.forEach(function (item) {
                let unit = item.seriesName == '订单合规率' ? '%' : '单';
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
        data: ['双证订单数', '完成行程订单数', '订单合规率']
    },
    xAxis: [
        {
            type: 'category',
            data: [],
            axisLabel: {
                color: 'rgba(0, 0, 0, 0.45)'
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
        },
        {
            type: 'value',
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
                formatter: '{value}%'
            }
        }
    ],
    series: [
        {
            name: '双证订单数',
            type: 'bar',
            data: [],
            barMaxWidth: 10
        },
        {
            name: '完成行程订单数',
            type: 'bar',
            data: [],
            barMaxWidth: 10
        },
        {
            name: '订单合规率',
            type: 'line',
            yAxisIndex: 1,
            data: []
        }
    ]
};