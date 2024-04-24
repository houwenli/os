export const HISTORY_DAILY_OPT = {
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
        // data: ['下单总量', '下单乘客量', '接单司机量', '完成行程订单总量', '已付款订单总量', '待付款订单总量', '取消订单总量', '预付订单总量', '完成行程订单总金额', '已完成订单总金额', '已付款订单总金额', '待付款订单总金额'],
        data: [],
        bottom: 0,
        left: 0,
        right: 0,
        itemWidth: 10,
        itemHeight: 4,
        itemGap: 0,
        selected: {},
        icon: 'roundRect',
        formatter: '{a|{name}}',
        textStyle: {
            color: '#909399',
            rich: {
                a: {
                    lineHeight: 20,
                    hegiht: 20,
                    padding: [4, 24, 0, 0],
                    verticalAlign: 'middle'
                }
            }
        }
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
    yAxis: [
        {
            type: 'value',
            name: '总量',
            nameTextStyle: {
                fontSize: 14,
                fontFamily: 'PingFangSC-Regular, PingFang SC',
                fontWeight: 400,
                color: '#606266',
                lineHeight: 20,
                padding: [0, 0, 0, 0]
            },
            min: 0,
            axisTick: {
                show: false
            },
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
        {
            type: 'value',
            name: '订单总金额(元)',
            nameTextStyle: {
                fontSize: 14,
                fontFamily: 'PingFangSC-Regular, PingFang SC',
                fontWeight: 400,
                color: '#606266',
                lineHeight: 20,
                padding: [0, 92, 0, 0]
            },
            min: 0,
            axisLine: {
                show: false,
                lineStyle: {
                    width: 0,
                    color: '#909399'
                }
            },
            minInterval: 1,
            axisTick: {
                show: false
            }
        }
    ],
    grid: {
        top: '35',
        bottom: 50,
        containLabel: true,
        left: 0,
        right: 0
    },
    series: [
        // {
        //     name: '下单总量',
        //     type: 'line',
        //     data: []
        // },
        // {
        //     name: '下单乘客量',
        //     type: 'line',
        //     data: []
        // },
        // {
        //     name: '接单司机量',
        //     type: 'line',
        //     data: []
        // },
        // {
        //     name: '完成行程订单总量',
        //     type: 'line',
        //     data: []
        // },
    ]
};
