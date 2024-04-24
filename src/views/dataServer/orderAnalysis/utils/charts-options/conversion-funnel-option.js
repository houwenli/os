export const CONVERSION_FUNNEL_OPT = {
    tooltip: {
        trigger: 'item',
        // formatter: '{b} : {c}%'
        formatter: function (params) {
            return `<div style="font-size: 12px;color: #fff">
                <span style="display:inline-block;width:8px;height:8px;border-radius: 50%;background-color:${params.color};margin-right: 8px"></span>${params.name}  ${params.value}单
            </div>`;
        },
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderColor: 'rgba(0,0,0,0.7)',
    },
    color: [
        '#254BE9',
        '#0BDBA8',
        '#F3D01D'
    ],
    series: [
        {
            name: 'Funnel',
            type: 'funnel',
            width: '50%',
            min: 0,
            minSize: '40%',
            sort: 'descending',
            left: 'center',
            gap: 0,
            label: {
                overflow: 'breakAll',
                show: true,
                formatter: '{b}  {c}单',
                position: 'inside',
                color: '#fff',
            },
            data: [
                // { value: 1200, name: '已下单订单' },
                // { value: 820, name: '应答订单' },
                // { value: 589, name: '完成行程订单' },
            ]
        },
        {
            type: 'funnel',
            right: 0,
            width: '50%',
            z: 1,
            min: 0,
            maxSize: '40%',
            sort: 'descending',
            left: 'center',
            gap: 0,
            label: {
                color: '#000000',
                position: 'rightBottom',
                formatter: data => {
                    return `{a|转化率${data.data.rate}%}`;
                },
                rich: {
                    a: {
                        fontSize: 12,
                        color: '#303133',
                        lineHeight: 24
                    },
                },
            },
            //右侧的百分比显示的地方
            labelLine: {
                show: true,
                length: 150,
                position: 'center',
                lineStyle: {
                    width: 1,
                    color: '#e8e9f1',
                    type: 'solid'
                }
            },
            tooltip: {
                show: false,
            },
            //主体是透明的
            itemStyle: {
                color: 'transparent',
                borderWidth: 0,
                opacity: 1
            },
            data: []
        }
    ]
};