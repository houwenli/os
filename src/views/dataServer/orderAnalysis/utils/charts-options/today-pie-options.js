export const PIE_OPTS = {
    title: {
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: function (params) {
            return `<div style="font-size: 12px;color: #fff">
                <span style="display:inline-block;width:8px;height:8px;border-radius: 50%;background-color:${params.color};margin-right: 8px"></span>${params.name}  ${params.percent}%
            </div>`;
        },
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderColor: 'rgba(0,0,0,0.7)',
    },
    legend: {
        top: '10%',
        icon: 'circle',
        left: '5%',
        align: 'auto',
        itemWidth: 9,
        itemHeight: 9,
        itemGap: 20,
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
            radius: '45%',
            center: ['50%', '58%'],
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
                    formatter: `{d}%`,
                    color: "#8C8D8E", //颜色
                    fontSize: 14, //字体大小
                },
                // emphasis: {
                //     show: false
                // }
            },
            data: [
                // { value: 0, name: '实时订单' },
                // { value: 0, name: '预约订单' },
                // { value: 0, name: '扫码订单' },
                // { value: 0, name: '包车订单' },
                // { value: 0, name: '拼车订单' }
            ],
            stillShowZeroSum: false,
            percentPrecision: 2,
            emphasis: {
                itemStyle: {
                    shadowBlur: 4,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(91,143,249,0.4)'
                }
            }
        },
    ]
};