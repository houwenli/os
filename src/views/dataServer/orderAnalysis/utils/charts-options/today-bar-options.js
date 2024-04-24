export const BAR_OPTS = {
    title: {},
    tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderColor: 'rgba(0,0,0,0.7)',
        formatter: function (params) {
            let result = `<div style="margin-bottom: 3px;">${params[0].name}-${(params[0].dataIndex + 1 < 10 ? '0' + (params[0].dataIndex + 1) : params[0].dataIndex + 1) + ':00'}</div>`;
            params.forEach(function (item) {
                let dotHtml = `<span style="display:inline-block;margin-right:5px;width:10px;height:8px;background:${item.color};vertical-align: 2px"></span>`;
                result += dotHtml + item.seriesName + '：' + item.data + '</br>';
            });
            result = `<div style="font-size: 12px;line-height:17px;padding:2px 5px;color: #fff">${result}</div>`;
            return result;
        },
    },
    legend: {
        // left: 'top',
        // data: ['下单总量', '完成行程订单总量', '已付款订单总量', '待付款订单总量'],
        data: ['下单总量', '完成行程订单总量', '已付款订单总量'],
        left: '0',
        itemGap: 24,
        itemWidth: 10,
        itemHeight: 8,
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
        }
    },
    grid: {
        left: '0',
        right: '0',
        top: 45,
        bottom: '0%',
        containLabel: true
    },
    toolbox: {
        // feature: {
        //     saveAsImage: {}
        // }
    },
    color: [
        '#254BE9',
        '#0BDBA8',
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
    xAxis: {
        type: 'category',
        // boundaryGap: false,
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
        // axisLabel: 50,
        data: [
            '00:00',
            '01:00',
            '02:00',
            '03:00',
            '04:00',
            '05:00',
            '06:00',
            '07:00',
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
            '20:00',
            '21:00',
            '22:00',
            '23:00',
        ]
    },
    yAxis: {
        type: 'value',
        minInterval: 1,
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
    },
    series: [
        {
            name: '下单总量',
            type: 'bar',
            data: [],
            barMaxWidth: 10
        },
        {
            name: '完成行程订单总量',
            type: 'bar',
            data: [],
            barMaxWidth: 10,
        },
        {
            name: '已付款订单总量',
            type: 'bar',
            data: [],
            barMaxWidth: 10
        },
        // {
        //     name: '待付款订单总量',
        //     type: 'bar',
        //     data: [],
        //     barMaxWidth: 10
        // },
    ]
};
