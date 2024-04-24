export const HISTORY_BAR_PREPAY_OPT = {
    backgroundColor: '#fff',
    grid: {
        top: 40,
        left: 0,
        right: 20,
        bottom: 4,
        containLabel: true
    },
    color: [
        '#0BDBA8',
        '#1D93FF',
        '#F3D01D',
        '#FF9B00',
        '#FD571F',
        '#254BE9',
        '#30E5DF',
        '#9A7AFF',
        '#ED2466',
        '#26B4A2',
        '#2B2B31',
        '#85B7FF',
        '#ABD51E',
        '#EB0707',
        '#31438E',
        '#961C44',
        '#5331BF',
        '#36736B',
        '#C6AD2E',
        '#BE7A10'
    ],
    tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderColor: 'rgba(0,0,0,0.7)',
        formatter: function (params) {
            let result = `<div style="margin-bottom: 3px;">${params[0].name}</div>`;
            params.forEach(function (item) {
                let dotHtml = `<span style="display:inline-block;margin-right:5px;width:10px;height:8px;background:${item.color};vertical-align: 2px"></span>`;
                result += dotHtml + item.seriesName + '：' + item.data + '</br>';
            });
            result = `<div style="font-size: 12px;line-height:17px;padding:2px 5px;color: #fff">${result}</div>`;
            return result;
        },
    },
    legend: {
        icon: 'roundRect',
        left: '0',
        // data: ['预付订单总量趋势图'],
        itemWidth: 10,
        itemHeight: 4,
        textStyle: {
            fontSize: 12,
            color: '#909399'
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: 20,
        data: [],
        axisLabel: {
            // interval: 1,
            color: 'rgba(0, 0, 0, 0.45)',
            // rotate: 45
        },
        axisLine: {
            lineStyle: {
                color: '#DCDFE6'
            }
        }
    },
    yAxis: {
        type: 'value',
        // minInterval: 1,
        axisLine: {
            show: false,
            lineStyle: {
                width: 0,
                color: '#DCDFE6'
            }
        },
        axisLabel: {
            color: 'rgba(0, 0, 0, 0.45)'
        },
        splitLine: {
            lineStyle: {
                color: '#DCDFE6'
            }
        }
    },
    series: [
        {
            name: '预付订单总量',
            type: 'line',
            data: [],
            smooth: false,
            // hoverAnimation: false,
            // showAllSymbol: false,
            showSymbol: true,
            symbol: 'circle'
        }
    ]
};
