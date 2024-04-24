export const setChartsOptionsBeforeRadio = {
    tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0,0,0,0.7)',
        textStyle: {
            color: '#fff',
        },
        valueFormatter: (value) => value + '%'

    },
    // grid: {
    //     top: '20%',
    //     left: '-20%',
    //     right: '1%',
    //     bottom: '10%',
    //     containLabel: true,
    // },
    legend: {
        show: false,
        y: 'top',
        left: 20,
        top: 20,
        itemHeight: 9,
        itemWidth: 9,
        icon: 'circle',
        textStyle: {
            color: '#606266',
            fontSize: '12',
        },
        selectedMode: false
    },

    series: [{
        type: 'pie',
        radius: '70%',
        selectedMode: 'single',
        label: {
            position: 'inside',
            // formatter: '{b}\n{d}%',
            formatter: (params) => {
                if (params.name !== '') {
                    return `${params.name}` + `\n${params.percent === undefined ? 0 : params.percent}%`
                }
                return ''
            },
            fontSize: 14,
            color: '#fff',
            lineHeight: 22,
            rotate: true,
            offset: [0, 8]
        },
        minAngle: 36,
        data: [{
                value: 0,
                name: '接单前总取消订单',
                selected: true,
                label: 'beforeCancelRatio'
            },
            {
                value: 0,
                name: '接单后总取消订单',
                label: 'afterCancelRatio'
            },
        ],
        emphasis: {
            itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
            },
        },
    }],
    color: ['#254BE9', '#0BDBA8'], // 第一个饼状图的颜色
}
export const setChartsOptionsAfterRadio = {
    tooltip: {
        show: true,
        backgroundColor: 'rgba(0,0,0,0.7)',
        textStyle: {
            color: '#fff',
        },
        valueFormatter: (value) => value + '%'
    },
    legend: {
        show: false,
        y: 'top',
        left: 0,
        top: 20,
        itemHeight: 9,
        itemWidth: 9,
        icon: 'circle',
        textStyle: {
            color: '#606266',
            fontSize: '12',
        },
        selectedMode: false
    },
    // grid: {
    //     left: '-20%',
    //     right: '1%',
    //     bottom: '10%',
    //     containLabel: true,
    // },
    series: [{
        type: 'pie',
        radius: '50%',
        label: {
            alignTo: 'none',
            formatter: '{b} {c}%\n',
            minMargin: 3,
            lineHeight: 15,
            fontSize: 10,
        },
        selectedMode: 'single',
        labelLine: {
            length: 32,
            length2: 0,
        },
        labelLayout: function (params) {
            const isLeft = params.labelRect.x < params.rect.x;
            const points = params.labelLinePoints;
            points[2][0] = isLeft ? params.labelRect.x : params.labelRect.x + params.labelRect.width;
            return {
                labelLinePoints: points
            };
        },
        data: [],
    }],
    color: ['#1D93FF', '#FF9B00', '#FD571F', '#2B2B31', '#f00'], // 第二个饼状图的颜色
}
export const setChartsOptionsCreateCount = (val = [], status = false) => {
    let options = {
        title: {
            text: '下单量排名',
            textStyle: {
                color: '#303133',
                fontSize: 16,
            },
            top: 0,
            left: -4
        },
        tooltip: {
            show: false,
        },
        grid: {
            top: 30,
            left: '0%',
            right: '4%',
            bottom: '0%',
            containLabel: true,
        },
        xAxis: {
            show: false,
            type: 'value',
            boundaryGap: [0, 0.01],
        },
        yAxis: {
            type: 'category',
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            offset: 90,
            inverse: true,
            data: [],
            axisLabel: {
                show: true,
                align: 'left',

                // width: 100,
                textStyle: {
                    color: '#606266',
                },
                formatter: function (value, index) {
                    let spacePlace = ' '; //定义空字符串
                    let numIndex = index >= 9 ? `${spacePlace}${index+1}` : `${spacePlace}${spacePlace}${index+1}`
                    if (index <= 2) {
                        return `{n1| }{classa|${numIndex}}{classb|${value}}`;
                    } else if (val.length > 6 && status == false && index == 5) {
                        return `{n1| }{classc|${spacePlace}...}{classb|.....}`;
                    } else {
                        return `{n1| }{classc|${numIndex}}{classb|${value}}`;
                    }
                },
                rich: {
                    n1: {
                        fontSize: 12,
                        color: '#606266',
                    },
                    classa: {
                        backgroundColor: '#FF9B00',
                        width: 20,
                        height: 20,
                        fontSize: 12,
                        lineHeight: 20,
                        display: 'block',
                        // align: 'center',
                        borderRadius: 20,
                        color: '#fff',
                        verticalAlign: 'middle',
                    },
                    classb: {
                        color: '#606266',
                        lineHeight: 20,
                        height: 20,
                        width: 64,
                        align: 'left',
                        fontWeight: 600,
                        fontSize: 12,
                        padding: [2, 0, 0, 4]
                    },
                    classc: {
                        backgroundColor: '#909399',
                        width: 20,
                        height: 20,
                        fontSize: 12,
                        lineHeight: 20,
                        display: 'block',
                        // align: 'center',
                        borderRadius: 20,
                        color: '#fff',
                        verticalAlign: 'middle',
                    },
                },
            },
        },

        series: [{
            type: 'bar',
            barWidth: 22,
            // barMinHeight: 30,
            // barGap: '100%',
            data: [],
            align: 'left',
            label: {
                show: true,
                position: 'outside',
                color: '#303133',
                fontSize: 12,
                  // align: 'left',
                  // verticalAlign: '',
                  // height: 22,
                  // padding: [10, 0, 0, 0],
                  // height: 22,
                  // lineHeight: 12,
                  // textBorderColor: 'inherit',
                  // textBorderWidth: 1,
                  // offset: [8, 6]
                formatter(params) {
                    let numTh = params.value || 0
                    let resValue = numTh.toString().replace(/\d+/, function (n) { // 先提取整数部分
                        return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                            return $1 + ",";
                        });
                    })
                    return resValue + '单'
                },
            }
        }],
        color: '#254BE9',
    }
    return options
}

export const setChartsOptionsSuccessCount = (val = [], status = false) => {
    let options = {
        title: {
            text: '完成行程订单量排名',
            textStyle: {
                color: '#303133',
                fontSize: 16,
            },
            top: 0,
            left: -4
        },
        tooltip: {
            show: false,
        },
        grid: {
            top: 30,
            left: '0%',
            right: '4%',
            bottom: '0%',
            containLabel: true,
        },
        xAxis: {
            show: false,
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            offset: 90,
            inverse: true,
            data: [],
            axisLabel: {
                show: true,
                align: 'left',
                // width: 100,
                textStyle: {
                    color: '#606266'
                },
                formatter: function (value, index) {
                    let spacePlace = ' '; //定义空字符串
                    let numIndex = index >= 9 ? `${spacePlace}${index+1}` : `${spacePlace}${spacePlace}${index+1}`
                    if (index <= 2) {
                        return `{n1| }{classa|${numIndex}}{classb|${value}}`;
                    } else if (val.length > 6 && status == false && index == 5) {
                        return `{n1| }{classc|${spacePlace}...}{classb|.....}`;
                    } else {
                        return `{n1| }{classc|${numIndex}}{classb|${value}}`;
                    }
                },
                rich: {
                    n1: {
                        fontSize: 12,
                        color: '#606266',
                        align: 'left',
                    },
                    classa: {
                        backgroundColor: '#FF9B00',
                        width: 20,
                        height: 20,
                        fontSize: 12,
                        lineHeight: 20,
                        display: "block",
                        // align: 'center',
                        borderRadius: 20,
                        color: '#fff',
                        verticalAlign: 'middle',
                    },
                    classb: {
                        color: '#606266',
                        lineHeight: 20,
                        height: 20,
                        width: 64,
                        align: 'left',
                        fontSize: 12,
                        fontWeight: 600,
                        padding: [2, 0, 0, 4]
                    },
                    classc: {
                        backgroundColor: '#909399',
                        width: 20,
                        height: 20,
                        fontSize: 12,
                        lineHeight: 20,
                        display: 'block',
                        // align: 'center',
                        borderRadius: 20,
                        color: '#fff',
                        verticalAlign: 'middle',
                    },
                },
            },
        },
        series: [{
            type: 'bar',
            barWidth: 22,
            data: [],
            // barMinHeight: 30,
            label: {
                show: true,
                position: 'outside',
                color: '#303133',
                fontSize: 12,
                // align: 'left',
                // verticalAlign: '',
                // height: 22,
                // padding: [10, 0, 0, 0],
                // height: 22,
                // lineHeight: 12,
                // textBorderColor: 'inherit',
                // textBorderWidth: 1,
                // offset: [8, 6]
                formatter(params) {
                    let numTh = params.value || 0
                    let resValue = numTh.toString().replace(/\d+/, function (n) { // 先提取整数部分
                        return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                            return $1 + ",";
                        });
                    })
                    return resValue + '单'

                }
            },
        }, ],
        color: '#0BDBA8',
    }
    return options
}
//渠道对比分析的饼图
export const pieOptions = {
    title: {
        text:'',
        left:'center',
        top:'42%',
        textStyle:{
            fontSize: 20,
            fontWeight: 600,
            color: '#606266',
            lineHeight:28
        },
    },
    tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderColor: '#DCDFE6',
        formatter: function(params) {
            let result = `<span style="margin-right: 6px;">${params.name}</span>`;
            let pie = `<span style="display:inline-block;margin-right:5px;width:8px;height:8px;background:${params.color};vertical-align: 0px;border-radius:50%"></span>`;
            const percent = params.data.percent ? params.data.percent + '%；' : '0%；'
            let dotHtml = result + '</br>' + pie + params.data.str + percent +  params.value + params.data.unit;
            return `<div style="font-size: 12px;padding:2px 5px;color: #fff">${dotHtml}</div>`;
        }
    },
    color: ['#0BDBA8','#1D93FF','#F3D01D','#FF9B00','#FD571F','#254BE9','#30E5DF','#9A7AFF','#ED2466','#26B4A2','#2B2B31','#85B7FF','#ABD51E','#EB0707','#31438E','#961C44','#5331BF','#36736B','#C6AD2E','#BE7A10'],
    series: {
        type: 'pie',
        radius: ['80', '120'],
        label: {
            show: true,  //true
            position: 'inside',
            formatter(params) {
                return (params.data.percent || 0) + '%'
            },
            color: '#fff',
        },
        emphasis: {
            label: {
                show: true,
            },
        },
        labelLine: {
            show: false,
        },
        data: [
            
        ],
    },
}

export const areaOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
        type: 'scroll',
        // orient: 'horizontal',
        icon: 'rect',
        left: 24,
        itemHeight: 4,
        itemWidth: 10,
        textStyle: {
            color: '#606266',
            fontSize: 14,
            lineHeight: 30
        },
        y: 'top',
        data: []
    },
    color: ['#0BDBA8','#1D93FF','#F3D01D','#FF9B00','#FD571F','#254BE9','#30E5DF','#9A7AFF','#ED2466','#26B4A2','#2B2B31','#85B7FF','#ABD51E','#EB0707','#31438E','#961C44','#5331BF','#36736B','#C6AD2E','#BE7A10'],
    grid: {
        top: 60,
        left: 24,
        right: 24,
        bottom: 24,
        containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        nameTextStyle: {
            color: '#606266',
        },
        axisLine: {
            show: false,
        },
        axisTick: {
            show: false,
        },
        data: []
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
    ]
};

export const funnelOptions = {
    tooltip: {
        trigger: 'item',
    },
    color:['#254BE9','#0BDBA8','#F3D01D','#FF9B00','#FD571F','#9A7AFF'],
    legend: {
        top: 20,
        icon: 'rect',
        left: 20,
        itemHeight: 6,
        itemWidth: 10,
        textStyle: {
            color: '#909399',
            fontSize: 14,
        },
        y: 'top',
        data: ['整体完单率', '运力筛选转化率', '司机确认转化率', '二次确认转化率', '到达转化率', '完单转化率'],
        selectedMode: false
    },
    series: [
        {
            name: 'Funnel',
            type: 'funnel',
            bottom: 16,
            minSize: '6.1%',
            maxSize: '44%',
            sort: 'none',
            z:10,
            gap: 0,
            tooltip:{
                formatter: function (params) {
                    
                    let str = `<div style="font-size: 12px;color: #fff">
                        <span style="display:inline-block;width:8px;height:8px;border-radius: 50%;background-color:${params.color};margin-right: 8px"></span>${params.name} ${params.data.percent}%
                    </div>`;
                    return str
                },
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderColor: 'rgba(0,0,0,0.7)',
            },
            label: {
                color: '#fff',
                show: true,
                overflow: 'breakAll',
                position: 'inside',
                formatter: function (params) {
                    return params.data.name + '' + params.data.percent + "%"
                },
            },
            emphasis: {
                focus: 'series'
            },
            data: [
                { name: '整体完单率'},
                { name: '运力筛选转化率'},
                { name: '司机确认转化率'},
                { name: '二次确认转化率'},
                { name: '到达转化率'},
                { name: '完单转化率'}
            ]
        },
        {
            name: 'Funnel',
            type: 'funnel',
            bottom: 16,
            minSize: '6.1%',
            maxSize: '44%',
            sort: 'none',
            gap: 0,
            tooltip:{
                show:true,
                formatter: data => {
                    return `<div style="color:#fff;font-size:12px;">${data.data.tip}</div>`
                },
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderColor: 'rgba(0,0,0,0.7)',
            },
            label: {
                color: '#909399',
                show: true,
                position: 'leftBottom',
                formatter: data => {
                    let str = `{img${data.dataIndex+1}|} ${data.data.leftLabel}`
                    return str
                },
                rich:{
                    img1 : {
                        height:24,
                        backgroundColor: {
                            image: 'https://wsjc-web.wsecar.com/oa/dataServer/doubt1.png'
                        }
                    },
                    img2 : {
                        height:24,
                        backgroundColor: {
                            image: 'https://wsjc-web.wsecar.com/oa/dataServer/doubt2.png'
                        }
                    },
                    img3 : {
                        height:24,
                        backgroundColor: {
                            image: 'https://wsjc-web.wsecar.com/oa/dataServer/doubt3.png'
                        }
                    },
                    img4 : {
                        height:24,
                        backgroundColor: {
                            image: 'https://wsjc-web.wsecar.com/oa/dataServer/doubt4.png'
                        }
                    },
                    img5 : {
                        height:24,
                        backgroundColor: {
                            image: 'https://wsjc-web.wsecar.com/oa/dataServer/doubt5.png'
                        }
                    }
                }
            },
            labelLine: {
                length: 220,
                lineStyle: {
                    width: 1,
                    color: '#DCDFE6',
                    type: 'solid'
                }
            },
            itemStyle: {
                color: 'transparent',
                borderWidth: 0,
                opacity: 1
            },
            data: [
                { name:'整体完单率',leftLabel:'运力筛选环节',tip:"运力筛选转化率=筛选出司机的订单量/创建订单量*100%" },
                { name: '运力筛选转化率',leftLabel:'运力筛选环节',tip:"司机确认转化率=司机确认接单订单量/筛选出司机订单量*100%"},
                { name: '司机确认转化率',leftLabel:'运力筛选环节', tip:"二次确认转化率=二次确认订单量/司机确认接单订单量*100%"},
                { name: '二次确认转化率',leftLabel:'运力筛选环节', tip:'到达转化率=达到起点订单量/二次确认订单量*100%' },
                { name: '到达转化率',leftLabel:'运力筛选环节', tip:'完单转化率=完成行程订单量/达到起点订单量*100%' },
                { name: '完单转化率',labelLine: { show: false },label: { show: false } }
            ]
        },
        {
            name: 'Funnel',
            type: 'funnel',
            bottom: 16,
            minSize: '6.1%',
            maxSize: '44%',
            sort: 'none',
            gap: 0,
            tooltip:{
                show:false
            },
            label: {
                color: '#000000',
                show: true,
                position: 'right',
                formatter: data => {
                    let str2 = `{a|${data.data.rightLabel}  ${data.data.value}}`
                    return str2
                },
                rich: {
                    a: {
                        fontSize: 12,
                        color: '#303133',
                    },
                },
            },
            labelLine: {
                length: 160,
                lineStyle: {
                    width: 1,
                    color: '#DCDFE6',
                    type: 'solid'
                }
            },
            itemStyle: {
                color: 'transparent',
                borderWidth: 0,
                opacity: 1
            },
            data: [
                {name: '整体完单率',rightLabel: '创建订单量'},
                {name: '运力筛选转化率',rightLabel: '筛选出司机订单量' },
                {name: '司机确认转化率',rightLabel: '司机确认订单量' },
                {name: '二次确认转化率',rightLabel: '二次确认订单量' },
                {name: '到达转化率',rightLabel: '达到起点订单量' },
                {name: '完单转化率',rightLabel: '完成行程订单量' }
            ]
        },
    ]
};