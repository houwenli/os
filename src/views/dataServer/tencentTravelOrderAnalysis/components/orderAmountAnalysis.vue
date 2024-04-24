<!-- 订单金额分析页面 -->
<template>
    <div class="echart_contant" v-loading="loading">
        <p class="clearfixTitle">订单金额分析</p>
        <div>
            <el-row :gutter="12">
                <el-col :span="6">
                    <el-card shadow="always" class="always">
                        <div class="a_title">完成行程订单总金额(元)</div>
                        <template v-if="thousandSeparator(orderSuccessAmount||0).length>12">
                            <el-tooltip class="item" effect="dark" placement="top" :content="thousandSeparator(orderSuccessAmount||0)">
                                <p class="a_value">{{thousandSeparator(orderSuccessAmount||0)}}</p>
                            </el-tooltip>
                        </template>
                        <p v-else class="a_value">{{thousandSeparator(orderSuccessAmount||0)}}</p>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card shadow="always" class="always">
                        <div class="a_title">已付款订单总金额(元)</div>
                        <template v-if="thousandSeparator(orderPaidAmount||0).length>12">
                            <el-tooltip class="item" effect="dark" placement="top" :content="thousandSeparator(orderPaidAmount||0)">
                                <p class="a_value">{{thousandSeparator(orderPaidAmount||0)}}</p>
                            </el-tooltip>
                        </template>
                        <p v-else class="a_value">{{thousandSeparator(orderPaidAmount||0)}}</p>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card shadow="always" class="always">
                        <div class="a_title">当日待付款订单总金额(元)</div>
                        <template v-if="thousandSeparator(orderUnpaidAmount||0).length>12">
                            <el-tooltip class="item" effect="dark" placement="top" :content="thousandSeparator(orderUnpaidAmount||0)">
                                <p class="a_value">{{thousandSeparator(orderUnpaidAmount||0)}}</p>
                            </el-tooltip>
                        </template>
                        <p v-else class="a_value">{{thousandSeparator(orderUnpaidAmount||0)}}</p>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card shadow="always" class="always">
                        <div class="a_title">待付款占比率（%）</div>
                        <p class="a_value">{{ orderUnpaidRatio || 0}}</p>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div :id="id" style="height: 323px;" class="line-box"></div>
    </div>
</template>

<script>
export default {
    props: ['searchParms'],
    data() {
        let boxString = '';
        let itemString = 'display: flex; align-items: center';
        let iconString = 'width: 10px; height: 4px;';
        let textString = 'height: 28px; font-size: 14px;  color: #FFFFFF; line-height: 28px;';
        return {
            loading: false,
            charts: null,
            moduleName: '/dataServer/tencentTravelOrderAnalysis',
            id: `charts${Math.random() * 100}`,
            orderUnpaidAmount: 0,
            orderSuccessAmount: 0,
            orderPaidAmount: 0,
            orderUnpaidRatio: 0,
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
                        let dateString = `<div style="${itemString}">
                                    <p style="${textString}">${firstDate}</p>
                                </div>`,
                            aString = ``,
                            bString = '',
                            cString = '';
                        params.forEach(element => {
                            let numTh = element.value || 0;
                            let resValue = numTh.toString().replace(/\d+/, function(n) {
                                // 先提取整数部分
                                return n.replace(/(\d)(?=(\d{3})+$)/g, function($1) {
                                    return $1 + ',';
                                });
                            });
                            if (element.componentIndex == 0) {
                                aString = `<div style="${itemString}">
                                            <p style="${iconString}background: ${element.color}; margin-right: 8px"></p>
                                            <p style="${textString}">完成行程订单金额&nbsp;&nbsp;&nbsp${resValue}元</p>
                                        </div>`;
                            }
                            if (element.componentIndex == 1) {
                                bString = `<div style="${itemString}">
                                            <p style="${iconString}background: ${element.color}; margin-right: 8px"></p>
                                            <p style="${textString}">已付款订单金额&nbsp;&nbsp;&nbsp${resValue}元</p>
                                        </div>`;
                            }
                            if (element.componentIndex == 2) {
                                cString = `<div style="${itemString}">
                                            <p style="${iconString}background: ${element.color}; margin-right: 8px"></p>
                                            <p style="${textString}">待付款订单金额&nbsp;&nbsp;&nbsp${resValue}元</p>
                                        </div>`;
                            }
                        });
                        return dateString + aString + bString + cString;
                    },
                    // formatter: `{a0}: {c0}元</br> {a1}: {c1}元</br> {a2}: {c2}元`
                },
                series: [
                    {
                        name: '完成行程订单金额',
                        type: 'line',
                        // stack: 'Total',
                        symbolSize: 6, //设置折线上圆点大小
                        data: [],
                    },
                    {
                        name: '已付款订单金额',
                        type: 'line',
                        // stack: 'Total',
                        symbolSize: 6, //设置折线上圆点大小
                        data: [],
                    },
                    {
                        name: '待付款订单金额',
                        type: 'line',
                        // stack: 'Total',
                        symbolSize: 6, //设置折线上圆点大小
                        data: [],
                    },
                ],
                color: ['#0BDBA8', '#F3D01D', '#FD571F'], // 三个折线的颜色
                legend: {
                    top: 0,
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
                    data: ['完成行程订单金额', '已付款订单金额', '待付款订单金额'],
                },
            },
        };
    },
    mounted() {},
    beforeDestroy() {
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
            this.charts.setOption(this.setChartsOptions);
            this.getOrderAmountDetail();
        },
        // 获取数据
        getOrderAmountDetail() {
            const op = 'getOrderAmountDetail';
            let data = {
                data: { ...this.searchParms },
                op,
            };
            this.loading = true;
            let URL = this.$getModuleUrl(this.moduleName, op);
            this.$axios(URL, data).then(res => {
                if (res.code == 1) {
                    this.loading = false;
                    let resData = JSON.parse(res.data);
                    let detailList = resData.detailList;
                    this.orderPaidAmount = resData.orderPaidAmount;
                    this.orderSuccessAmount = resData.orderSuccessAmount;
                    this.orderUnpaidAmount = resData.orderUnpaidAmount;
                    this.orderUnpaidRatio = resData.orderUnpaidRatio;
                    let orderCreateDate = [],
                        orderPaidAmount = [],
                        orderSuccessAmount = [],
                        orderUnpaidAmount = [];
                    detailList.forEach(element => {
                        let replaceDate = element.orderCreateDate;
                        if (replaceDate) {
                            replaceDate = replaceDate.replace(/-/g, '/').slice(5);
                        }
                        orderCreateDate.push(replaceDate);
                        orderPaidAmount.push(element.orderPaidAmount);
                        orderSuccessAmount.push(element.orderSuccessAmount);
                        orderUnpaidAmount.push(element.orderUnpaidAmount);
                    });
                    // 时间
                    this.setChartsOptions.xAxis.data = orderCreateDate;
                    // 完成行程订单总金额(元)
                    this.setChartsOptions.series[0].data = orderSuccessAmount;
                    // 已付款订单总金额
                    this.setChartsOptions.series[1].data = orderPaidAmount;
                    // 待付款订单总金额(元)
                    this.setChartsOptions.series[2].data = orderUnpaidAmount;
                    // 赋值echart
                    this.charts.setOption(this.setChartsOptions, true);
                }
            });
        },
        // 添加千位符
        thousandSeparator(num) {
            var res = num.toString().replace(/\d+/, function(n) {
                // 先提取整数部分
                return n.replace(/(\d)(?=(\d{3})+$)/g, function($1) {
                    return $1 + ',';
                });
            });
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
