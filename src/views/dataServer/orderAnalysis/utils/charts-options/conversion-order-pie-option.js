export const CANVERSION_PIE_OPT = {
    tooltip: {
        trigger: 'item',
        formatter: function (params) {
            return `<div style="font-size: 12px;color: #fff">
                <span style="display:inline-block;width:8px;height:8px;border-radius: 50%;background-color:${params.color};margin-right: 8px"></span>${params.name}  ${params.value}单
            </div>`;
        },
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderColor: 'rgba(0,0,0,0.7)',
    },
    legend: {
        orient: 'vertical',
        left: 'auto',
        right: '1%',
        top: 'middle',
        icon: 'circle',
        selectedMode: false,
        align: 'auto',
        itemWidth: 9,
        itemHeight: 9,
        itemGap: 10,
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
        data: [
            '接单前总取消订单',
            '接单前乘客取消订单',
            '接单前系统取消订单',
            '接单前平台取消订单',
            '接单后总取消订单',
            '接单后司机取消订单',
            '接单后乘客取消订单',
            '接单后系统取消订单',
            '接单后平台取消订单',
        ]
    },
    series: [
        {
            type: 'pie',
            radius: [0, '40%'],
            center: ['40%', '50%'],
            label: {
                position: 'inner',
                fontSize: 14,
                formatter: '{b}\n{d}%',
                color: '#fff',
            },
            labelLine: {
                show: false
            },
            data: [
                // { value: 0, name: '接单前总取消订单' },
                // { value: 0, name: '接单后总取消订单' },
            ],
            color: ['rgba(37, 75, 233)', 'rgba(11, 219, 168)'],
            hoverAnimation: false
        },
        {
            type: 'pie',
            radius: ['40.5%', '51%'],
            center: ['40%', '50%'],
            labelLine: {
                normal: {
                    length: 10,
                    length2: 120,
                }
            },
            label: {
                formatter: '{a|{b} {d}%}',
                padding: [0, -125, 15, -125],
                rich: {
                    a: {
                        fontSize: 12,
                        lineHeight: 30,
                    },
                },
            },
            data: [
                // { value: 200, name: '接单前乘客取消订单' },
                // { value: 10, name: '接单前系统取消订单' },
                // { value: 10, name: '接单前平台取消订单' },
                // { value: 60, name: '接单后司机取消订单' },
                // { value: 50, name: '接单后乘客取消订单' },
                // { value: 50, name: '接单后系统取消订单' },
                // { value: 50, name: '接单后平台取消订单' },
            ],
            stillShowZeroSum: false,
            percentPrecision: 2,
            color: ['rgba(37, 75, 233, 0.8)', 'rgba(37, 75, 233, 0.6)', 'rgba(37, 75, 233, 0.4)', 'rgba(11, 219, 168, 0.8)', 'rgba(11, 219, 168, 0.6)', 'rgba(11, 219, 168, 0.4)', 'rgba(11, 219, 168, 0.2)'],
        }
    ]
};