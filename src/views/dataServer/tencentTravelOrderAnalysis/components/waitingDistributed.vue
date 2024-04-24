<!-- 平均接单等待时常分布 -->
<template>
    <div class="echart_contant" v-loading="loading">
        <div class="clearfixTitle">
            <el-tooltip class="item" effect="dark" placement="right-start">
                <div slot="content">接单等待时长：司机接单时间与乘客下单时间之差<br /><br />平均接单等待时长：一天内累计司机接单时间与乘客下单时间之差，比上累计接单数，公式为：∑（司机接单时间-乘客下单时间）/累计接单数</div>
                <span class="name_span">平均接单等待时长分布<img src="../../../../assets/images/icon_doubt@2x.png" /></span>
            </el-tooltip>
        </div>
        <div style="height: 412px;" :id="id"></div>
    </div>
</template>

<script>
let avgDriveDurationTime1 = [];
export default {
    props: ['searchParms'],
    data() {
        let boxString = '';
        let itemString = 'display: flex; align-items: center';
        let iconString = 'width: 10px; height: 8px;';
        let textString = 'height: 24px; font-size: 14px;  color: #FFFFFF; line-height: 24px;';
        return {
            id: `charts${Math.random() * 100}`,
            moduleName: '/dataServer/tencentTravelOrderAnalysis',
            setChartsOptions: {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    textStyle: {
                        color: '#fff',
                    },
                    formatter: function(params) {
                        let aString = '',
                            bString = '',
                            cString = '',
                            dString = '',
                            eString = '',
                            dateString = '';
                        if (params && params.length > 0) {
                            dateString = `<div style="${itemString}">
                                    <p style="${textString}">${params[0].axisValue}</p>
                                </div>`;
                        }
                        params.forEach(element => {
                            let numTh  = element.value || 0
                            let resValue = numTh.toString().replace(/\d+/, function (n) {
                                return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                                    return $1 + ",";
                                });
                            })
                            if (element.componentIndex == 0) {
                                bString = `<div style="${itemString}">
                                            <p style="${iconString}background: ${element.color}; margin-right: 8px"></p>
                                            <p style="${textString}">接单等待时长2s内&nbsp;&nbsp${resValue}单</p>
                                        </div>`;
                            }
                            if (element.componentIndex == 1) {
                                cString = `<div style="${itemString}">
                                            <p style="${iconString}background: ${element.color}; margin-right: 8px"></p>
                                            <p style="${textString}">接单等待时长2s-4s&nbsp;&nbsp&nbsp;${resValue}单</p>
                                        </div>`;
                            }
                            if (element.componentIndex == 2) {
                                dString = `<div style="${itemString}">
                                            <p style="${iconString}background: ${element.color}; margin-right: 8px"></p>
                                            <p style="${textString}">接单等待时长4s-6s&nbsp;&nbsp;&nbsp${resValue}单</p>
                                        </div>`;
                            }
                            if (element.componentIndex == 3) {
                                eString = `<div style="${itemString}">
                                            <p style="${iconString}background: ${element.color}; margin-right: 8px"></p>
                                            <p style="${textString}">接单等待时长6s以上&nbsp;&nbsp;&nbsp${resValue}单</p>
                                        </div>`;
                            }
                            aString = `<div style="${itemString}">
                                    <p style="${textString}">平均接单等待时长&nbsp;&nbsp;&nbsp${avgDriveDurationTime1[element.dataIndex] ? avgDriveDurationTime1[element.dataIndex] : '--'}秒</p>
                                </div>`;
                        });
                        return dateString + aString + bString + cString + dString + eString;
                    },
                },
                grid: {
                    top: 50,
                    left: 24,
                    right: 24,
                    bottom: 24,
                    containLabel: true,
                },
                legend: {
                    bottom: 24,
                    left: 24,
                    itemHeight: 8,
                    itemWidth: 10,
                    icon: 'rect',
                    textStyle: {
                        color: '#606266',
                        fontSize: '14',
                    },
                    y: 'top',
                    data: ['接单等待时长2s内', '接单等待时长2s~4s', '接单等待时长4s~6s', '接单等待时长6s以上'],
                },
                xAxis: [
                    {
                        type: 'category',
                        data: [],
                        align: 'center',
                        axisTick: {
                            alignWithLabel: true
                        }
                    },
                ],
                // barCategoryGap: 40,
                yAxis: [
                    {
                        type: 'value',
                        align: 'center',
                    },
                ],
                series: [
                    {
                        name: '接单等待时长2s内',
                        type: 'bar',
                        barGap: 0,
                        // barWidth: 18,
                        barMaxWidth: 40,
                        data: [],
                        clip: false,
                    },
                    {
                        name: '接单等待时长2s~4s',
                        type: 'bar',
                        // barWidth: 18,
                        barMaxWidth: 40,
                        data: [],
                        clip: false,
                    },
                    {
                        name: '接单等待时长4s~6s',
                        type: 'bar',
                        // barWidth: 18,
                        barMaxWidth: 40,
                        data: [],
                        clip: false,
                    },
                    {
                        name: '接单等待时长6s以上',
                        type: 'bar',
                        barMaxWidth: 40,
                        // barWidth: 18,
                        data: [],
                        clip: false,
                    },
                ],
                align: 'center',
                color: ['#254BE9', '#0BDBA8', '#F3D01D', '#FD571F'], // 柱状图的颜色
            },
            charts: null,
            loading: true,
        };
    },
    mounted() {
    },
    beforeDestroy () {
        if (!this.charts) {
            return;
        }
        this.charts.dispose();
        this.charts = null;
    },
    methods: {
        // 初始化图表获取数据
        initDriveDurationDetail() {
            let chartDom = document.getElementById(this.id);
            this.charts = this.$echarts.init(chartDom);
            this.charts.setOption(this.setChartsOptions);
            this.getDriveDurationDetail();
        },
        // 获取数据
        getDriveDurationDetail() {
            const op = 'getDriveDurationDetail';
            let data = {
                data: { ...this.searchParms },
                op,
            };
            let URL = this.$getModuleUrl(this.moduleName, op);
            this.loading = true;
            this.$axios(URL, data).then(res => {
                if (res.code == 1) {
                    this.loading = false;
                    let resData = JSON.parse(res.data);
                    let orderCreateDate = [],driveDurationGte0sLt2sCount = [];
                    let driveDurationGte2sLt4sCount = [],driveDurationGte4sLt6sCount = [];
                    let driveDurationGte6sCount = [], avgDriveDurationTime = [];
                    resData.forEach(element => {
                        let replaceDate = element.orderCreateDate;
                        if (replaceDate) {
                            replaceDate = replaceDate.replace(/-/g, '/');
                        }
                        orderCreateDate.push(replaceDate);
                        avgDriveDurationTime.push(element.avgDriveDurationTime);
                        driveDurationGte0sLt2sCount.push(element.driveDurationGte0sLt2sCount);
                        driveDurationGte2sLt4sCount.push(element.driveDurationGte2sLt4sCount);
                        driveDurationGte4sLt6sCount.push(element.driveDurationGte4sLt6sCount);
                        driveDurationGte6sCount.push(element.driveDurationGte6sCount);
                    });
                    this.setChartsOptions.xAxis[0].data = orderCreateDate;
                    // 接单等待时长2s内
                    this.setChartsOptions.series[0].data = driveDurationGte0sLt2sCount;
                    // 4s内
                    this.setChartsOptions.series[1].data = driveDurationGte2sLt4sCount;
                    // 6s
                    this.setChartsOptions.series[2].data = driveDurationGte4sLt6sCount;
                    // 》6
                    this.setChartsOptions.series[3].data = driveDurationGte6sCount;
                    avgDriveDurationTime1 = avgDriveDurationTime;
                    // 赋值echart
                    this.charts.setOption(this.setChartsOptions, true);
                }
            });
        }
    },
};
</script>

<style lang="scss" scoped>
.echart_contant {
    background: #fff;
    .clearfixTitle {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #303133;
        margin: 32px 0 16px 0;
    }
    .name_span {
        display: inline-block;
        height: 24px;
        line-height: 24px;
        position: relative;
        img {
            position: absolute;
            width: 24px;
            height: 24px;
        }
    }
}
</style>