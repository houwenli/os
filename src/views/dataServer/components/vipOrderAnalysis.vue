<!-- 订单金额分析页面 -->
<template>
    <div class="echart_contant" v-loading="loading">
        <p class="clearfixTitle">包干订单分析</p>
        <div>
            <el-row :gutter="12">
                <el-col :span="8">
                    <el-card shadow="always" class="always">
                        <div class="a_title">包干总人数(人)</div>
                        <template v-if="thousandSeparator(peopleSum||0).length>12">
                            <el-tooltip class="item" effect="dark" placement="top" :content="thousandSeparator(peopleSum||0)">
                                <p class="a_value">{{thousandSeparator(peopleSum||0)}}</p>
                            </el-tooltip>
                        </template>
                        <p v-else class="a_value">{{thousandSeparator(peopleSum||0)}}</p>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card shadow="always" class="always">
                        <div class="a_title">包干总笔数(笔)</div>
                        <template v-if="thousandSeparator(cntSum||0).length>12">
                            <el-tooltip class="item" effect="dark" placement="top" :content="thousandSeparator(cntSum||0)">
                                <p class="a_value">{{thousandSeparator(cntSum||0)}}</p>
                            </el-tooltip>
                        </template>
                        <p v-else class="a_value">{{thousandSeparator(cntSum||0)}}</p>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card shadow="always" class="always">
                        <div class="a_title">退包总笔数(笔)</div>
                        <template v-if="thousandSeparator(refundSum||0).length>12">
                            <el-tooltip class="item" effect="dark" placement="top" :content="thousandSeparator(refundSum||0)">
                                <p class="a_value">{{thousandSeparator(refundSum||0)}}</p>
                            </el-tooltip>
                        </template>
                        <p v-else class="a_value">{{thousandSeparator(refundSum||0)}}</p>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div :id="id" style="height: 323px;" class="line-box"></div>
    </div>
</template>

<script>
export default {
    props: ['searchParms', 'op'],
    data() {
        let boxString = '';
        let itemString = 'display: flex; align-items: center';
        let iconString = 'width: 10px; height: 4px;';
        let textString = 'height: 28px; font-size: 14px;  color: #FFFFFF; line-height: 28px;';
        return {
            loading: false,
            charts: null,
            moduleName: '/dataServer/vipAnalysis',
            id: `charts${Math.random() * 100}`,
            peopleSum: 0,
            cntSum: 0,
            refundSum: 0,
            detailList: [],
            setChartsOptions: {
                xAxis: {
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
                    data: [],
                },
                yAxis: {
                    type: 'value',
                    nameTextStyle: {
                        color: '#606266',
                    },
                },
                grid: {
                    top: 50,
                    left: 24,
                    right: 24,
                    bottom: 24,
                    containLabel: true,
                },
                tooltip: {
                    // tooltip 用于控制鼠标滑过或点击时的提示框（下一章展开讲）
                    trigger: 'axis',
                    axisPointer: {
                        // 坐标轴指示器配置项。
                        type: 'cross', // 'line' 直线指示器  'shadow' 阴影指示器  'none' 无指示器  'cross' 十字准星指示器。
                        axis: 'auto', // 指示器的坐标轴。
                        snap: true, // 坐标轴指示器是否自动吸附到点上
                    },
                    showContent: true,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    textStyle: {
                        color: '#fff',
                    },
                    formatter: function(params) {
                        let firstDate;
                        if (params && params.length > 0) {
                            firstDate = params[0].axisValue;
                        }
                        let dateString = `
                            <div style="${itemString}">
                                <p style="${textString}">${firstDate}</p>
                            </div>`,
                            aString = ``,
                            bString = '',
                            cString = '';
                        params.forEach(element => {
                            let numTh = element.value||0
                            let resValue = numTh.toString().replace(/\d+/, function (n) { // 先提取整数部分
                                return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                                    return $1 + ",";
                                });
                            })
                            if (element.componentIndex == 0) {
                                aString = `<div style="${itemString}">
                                            <p style="${iconString}background: ${element.color}; margin-right: 8px"></p>
                                            <p style="${textString}">包干人数&nbsp;&nbsp;&nbsp${resValue}人</p>
                                        </div>`;
                            }
                            if (element.componentIndex == 1) {
                                bString = `<div style="${itemString}">
                                            <p style="${iconString}background: ${element.color}; margin-right: 8px"></p>
                                            <p style="${textString}">包干笔数&nbsp;&nbsp;&nbsp${resValue}笔</p>
                                        </div>`;
                            }
                            if (element.componentIndex == 2) {
                                cString = `<div style="${itemString}">
                                            <p style="${iconString}background: ${element.color}; margin-right: 8px"></p>
                                            <p style="${textString}">退包笔数&nbsp;&nbsp;&nbsp${resValue}笔</p>
                                        </div>`;
                            }
                        });
                        return dateString + aString + bString + cString;
                    },
                },
                series: [
                    {
                        name: '包干人数',
                        type: 'line',
                        // stack: 'Total',
                        symbolSize: 6, //设置折线上圆点大小
                        data: [],
                    },
                    {
                        name: '包干笔数',
                        type: 'line',
                        // stack: 'Total',
                        symbolSize: 6, //设置折线上圆点大小
                        data: [],
                    },
                    {
                        name: '退包笔数',
                        type: 'line',
                        // stack: 'Total',
                        symbolSize: 6, //设置折线上圆点大小
                        data: [],
                    },
                ],
                color: ['#0BDBA8', '#F3D01D', '#FD571F'], // 三个折线的颜色
                legend: {
                    left: 24,
                    bottom: 24,
                    itemHeight: 4,
                    itemWidth: 10,
                    icon: 'rect',
                    textStyle: {
                        color: '#606266',
                        fontSize: 14,
                    },
                    y: 'top',
                    data: ['包干人数', '包干笔数', '退包笔数'],
                },
            },
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
    watch: {},
    methods: {
        // 初始化图表获取数据
        initOrderAmountDetail() {
            let chartDom = document.getElementById(this.id);
            this.charts = this.$echarts.init(chartDom);
            this.charts && this.charts.setOption(this.setChartsOptions);
            this.getOrderAmountDetail();
        },
        // 获取数据
        getOrderAmountDetail() {
            const op = this.op;
            let category = this.searchParms.category
            if (category === 0) {
                const { cntAnalysisForWycVip, cntAnalysisForDjVip } = this.powerList
                category = []
                if (cntAnalysisForWycVip) category.push(1)
                // if (cntAnalysisForDjVip) category.push(3)
            } else {
                category = [category]
            }
            let data = {
                data: { ...this.searchParms, category },
                op,
            };
            this.loading = true;
            let URL = this.$getModuleUrl(this.moduleName, op);
            this.$axios(URL, data).then(res => {
                if (res.code == 1) {
                    let resData = JSON.parse(res.data);
                    this.peopleSum = resData.peopleSum;
                    this.cntSum = resData.cntSum;
                    this.refundSum = resData.refundSum;
                    // 时间
                    this.setChartsOptions.xAxis.data = resData.xdata;
                    const [{data: data1}, {data: data2}, {data: data3}] = resData.dataInfoList;
                    const dataList = [data1, data2, data3];
                    dataList.forEach((item, i) => {
                        this.setChartsOptions.series[i].data = item;
                    })
                    // 赋值echart
                    this.charts && this.charts.setOption(this.setChartsOptions, true);
                }
            }).catch(err => {
                this.$message.error(err.message);
            }).finally(() => {
                this.loading = false;
            });;
        },
        // 添加千位符
        thousandSeparator(num){
            var res = num.toString().replace(/\d+/, function (n) { // 先提取整数部分
                return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                    return $1 + ",";
                });
            })
            return res;
        },
    },
};
</script>

<style lang="scss">
.echart_contant {
    .clearfixTitle {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #303133;
        margin: 32px 0 16px 0;
    }
    .always {
        text-align: center;
        .a_title {
            height: 22px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #303133;
            line-height: 22px;
        }
        .a_value {
            font-size: 48px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #303133;
            margin-top: 24px;
            margin-bottom: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .line-box {
        margin-top: 32px;
    }
}
</style>
