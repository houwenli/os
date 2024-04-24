import util from '@/utils/util';
// 订单对比分析
export const orderPk = {
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: 'cross'
        },
        backgroundColor: 'rgba(00,00,00,0.7)',
        // borderRadius: 2, //边框圆角
        borderColor: 'transparent',
        textStyle: {
            color: '#fff',
            fontSize: 14
        },
        confine: true,
        formatter: function (params) {
            let tip = ''
            if (params != null && params.length) {
                let nowDate = params[0].name.substring(5, 10);
                let sevenDay = util.getFinalDay(-7, params[0].name)
                let oldDate = sevenDay.substring(5, 10);
                tip += params[0].name + '<br />'
                for (let i = 0; i < params.length; i++) {
                    let dotHtml = `<span style="display:inline-block;margin-right:5px;width:10px;height:4px;background:${params[i].color};vertical-align: 2px"></span>`;
                    tip += `${dotHtml}${params[i].seriesName == '本期日期' ? nowDate : oldDate}：${params[i].value}<br />`
                    // tip += `${params[i].marker}${params[i].seriesName}：${params[i].value}元<br />`
                }
            }
            return tip
        }
    },
    legend: {
        icon: 'rect',
        left: 0,
        itemWidth: 10,
        itemHeight: 4,
        data: ["本期日期", "上期日期"],
        textStyle: {
            fontSize: 14,
            color: "#606266"
        },
        itemGap: 24
    },
    grid: {
        x: 0,
        y: 48,
        x2: 24,
        y2: 24,
        containLabel: true,
    },
    xAxis: {
        type: "category",
        boundaryGap: true,
        data: [],
        axisLine: {
            lineStyle: {
                color: "#DCDFE6"
            }
        },
        axisLabel: {
            color: '#606266',
            fontSize: 12
        },
    },
    yAxis: {
        min: 0,
        minInterval: 1, // 最小分割刻度
        type: "value",
        axisLabel: {
            color: 'rgba(0, 0, 0, 0.45)',
            fontSize: 12
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: '#DCDFE6'
            }
        },
    },
    series: [
        {
            name: "本期日期",
            type: "line",
            data: [],
            color: "#0BDBA8",
        },
        {
            name: "上期日期",
            type: "line",
            data: [],
            color: '#F3D01D'
        }
    ],
}
// 城市订单排行榜TOP20
export const cityTop = {
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: 'cross'
        },
        backgroundColor: 'rgba(00,00,00,0.7)',
        borderRadius: 2, //边框圆角
        borderColor: 'transparent',
        textStyle: {
            color: '#fff',
            fontSize: 14
        },
        confine: true,
        formatter: function (params) {
            let tip = ''
            if (params != null && params.length) {
                tip += params[0].name + '<br />'
                for (let i = 0; i < params.length; i++) {
                    let dotHtml = `<span style="display:inline-block;margin-right:5px;width:10px;height:4px;background:${params[i].color};vertical-align: 2px"></span>`;
                    tip += `${dotHtml}${params[i].seriesName}：${params[i].value}<br />`
                    // tip += `${params[i].marker}${params[i].seriesName}：${params[i].value}元<br />`
                }
            }
            return tip
        }
    },
    legend: {
        icon: 'rect',
        left: 0,
        itemWidth: 10,
        itemHeight: 4,
        data: ["支付订单数", "订单占比"],
        textStyle: {
            fontSize: 14,
            color: "#606266"
        },
        itemGap: 24
    },
    grid: {
        x: 0,
        y: 48,
        x2: 24,
        y2: 24,
        containLabel: true,
    },
    xAxis: {
        type: "category",
        boundaryGap: true,
        data: [],
        axisLine: {
            lineStyle: {
                color: "#DCDFE6"
            }
        },
        axisLabel: {
            color: '#606266',
            fontSize: 12
        },
    },
    yAxis: [
        {
            type: 'value',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
                formatter: '{value}'
            }
        },
        {
            type: 'value',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
                formatter: '{value} %'
            }
        }
    ],
    series: [
        {
            name: "支付订单数",
            type: "line",
            data: [],
            color: "#254BE9",
        },
        {
            name: "订单占比",
            type: "bar",
            data: [],
            color: '#0BDBA8',
            barWidth: '16px',
        }
    ],
}
// 各时段订单数
export const timeOrder = {
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: 'cross'
        },
        backgroundColor: 'rgba(00,00,00,0.7)',
        borderRadius: 2, //边框圆角
        borderColor: 'transparent',
        textStyle: {
            color: '#fff',
            fontSize: 14
        },
        confine: true,
        formatter: function (params) {
            let tip = ''
            if (params != null && params.length) {
                tip += params[0].name + '<br />'
                for (let i = 0; i < params.length; i++) {
                    let dotHtml = `<span style="display:inline-block;margin-right:5px;width:10px;height:4px;background:${params[i].color};vertical-align: 2px"></span>`;
                    tip += `${dotHtml}${params[i].seriesName}：${params[i].value}<br />`
                    // tip += `${params[i].marker}${params[i].seriesName}：${params[i].value}元<br />`
                }
            }
            return tip
        }
    },
    legend: {
        icon: 'rect',
        left: 0,
        itemWidth: 10,
        itemHeight: 4,
        data: ["支付订单数", "订单占比"],
        textStyle: {
            fontSize: 14,
            color: "#606266"
        },
        itemGap: 24
    },
    grid: {
        x: 0,
        y: 48,
        x2: 24,
        y2: 24,
        containLabel: true,
    },
    xAxis: {
        type: "category",
        boundaryGap: true,
        data: [],
        axisLine: {
            lineStyle: {
                color: "#DCDFE6"
            }
        },
        axisLabel: {
            color: '#606266',
            fontSize: 12
        },
    },
    yAxis: [
        {
            type: 'value',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
                formatter: '{value}'
            }
        },
        {
            type: 'value',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
                formatter: '{value} %'
            }
        }
    ],
    series: [
        {
            name: "支付订单数",
            type: "line",
            data: [],
            color: "#254BE9",
        },
        {
            name: "订单占比",
            type: "bar",
            data: [],
            color: '#0BDBA8',
            barWidth: '16px',
        }
    ],
}
