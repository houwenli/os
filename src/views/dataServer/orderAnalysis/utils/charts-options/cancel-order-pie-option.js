export const CANCEL_PIE_OPT = {
    title: {
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        // formatter: '{b} : {c} ({d}%)'
        formatter: function (params) {
            return `<div style="font-size: 12px;color: #fff">
                <span style="display:inline-block;width:8px;height:8px;border-radius: 50%;background-color:${params.color};margin-right: 8px"></span>${params.name}  ${params.percent ?? 0}%
            </div>`;
        },
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderColor: 'rgba(0,0,0,0.7)',
    },
    legend: {
        orient: 'vertical',
        left: 'auto',
        right: '10%',
        top: 'middle',
        icon: 'circle',
        align: 'auto',
        itemWidth: 9,
        itemHeight: 9,
        itemGap: 30,
        formatter: '{a|{name}}',
        selectedMode: false,
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
    color: ['#254BE9', '#0BDBA8', '#F3D01D', '#FF9B00', '#FD571F', '#30E5DF', '#9A7AFF', '#71C8FF', '#E6D236', '#008CE6', '#F254A9', '#E17A3A', '#5F6E82'],
    series: [
        {
            type: 'pie',
            radius: '60%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            labelLine: {
                length: 15,
                length2:15,
            },
            avoidLabelOverlap: true,
            label: {
                normal: {
                    //echarts饼图内部显示百分比设置
                    show: true,
                    position: "outside", //outside 外部显示  inside 内部显示
                    // formatter: `{d}%`,
                    formatter: (value) => {
                        return `${value.percent ?? 0}%`
                    },
                    color: "#8C8D8E", //颜色
                    fontSize: 14, //字体大小
                },
            },
            data: [
                // { value: 0, name: '接单后乘客取消订单' },
                // { value: 0, name: '接单后系统取消订单' },
                // { value: 0, name: '接单后平台取消订单' },
                // { value: 0, name: '接单后司机取消订单' },
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        },
    ]
}