<!-- 订单量分析页面 -->
<template>
    <div class="echart_contant" v-loading="loading">
        <p class="clearfixTitle">订单量分析</p>
        <!-- <el-card> -->
        <div class="qu_box">
            <el-row :gutter="12">
                <el-col :span="5">
                    <el-card shadow="always" class="always">
                        <div class="a_title">创建订单量(单)</div>
                        <template v-if="thousandSeparator(orderCreateCount||0).length>9">
                            <el-tooltip class="item" effect="dark" placement="top" :content="thousandSeparator(orderCreateCount||0)">
                                <p class="a_value">{{thousandSeparator(orderCreateCount||0)}}</p>
                            </el-tooltip>
                        </template>
                        <p v-else class="a_value">{{thousandSeparator(orderCreateCount||0)}}</p>
                    </el-card>
                </el-col>
                <el-col :span="5">
                    <el-card shadow="always" class="always">
                        <div class="a_title">接单总量(单)</div>
                        <template v-if="thousandSeparator(orderAcceptCount||0).length>9">
                            <el-tooltip class="item" effect="dark" placement="top" :content="thousandSeparator(orderAcceptCount||0)">
                                <p class="a_value">{{thousandSeparator(orderAcceptCount||0)}}</p>
                            </el-tooltip>
                        </template>
                        <p v-else class="a_value">{{thousandSeparator(orderAcceptCount||0)}}</p>
                    </el-card>
                </el-col>
                <el-col :span="5">
                    <el-card shadow="always" class="always">
                        <div class="a_title">接单率（%）</div>
                        <p  class="a_value">{{orderAcceptRatio || 0}}</p>
                    </el-card>
                </el-col>
                <el-col :span="5">
                    <el-card shadow="always" class="always">
                        <div class="a_title">取消订单总量(单)</div>
                        <template v-if="thousandSeparator(orderCancelCount||0).length>9">
                            <el-tooltip class="item" effect="dark" placement="top" :content="thousandSeparator(orderCancelCount||0)">
                                <p class="a_value">{{thousandSeparator(orderCancelCount||0)}}</p>
                            </el-tooltip>
                        </template>
                        <p v-else class="a_value">{{thousandSeparator(orderCancelCount||0)}}</p>
                    </el-card>
                </el-col>
                <el-col :span="5">
                    <el-card shadow="always" class="always">
                        <div class="a_title">取消率（%）</div>
                        <p  class="a_value">{{orderCancelRatio || 0}}</p>
                    </el-card>
                </el-col>

                <el-col :span="5">
                    <el-card shadow="always" class="always">
                        <div class="a_title">完成行程订单总量(单)</div>
                        <template v-if="thousandSeparator(orderSuccessCount||0).length>9">
                            <el-tooltip class="item" effect="dark" placement="top" :content="thousandSeparator(orderSuccessCount||0)">
                                <p class="a_value">{{thousandSeparator(orderSuccessCount||0)}}</p>
                            </el-tooltip>
                        </template>
                        <p v-else class="a_value">{{thousandSeparator(orderSuccessCount||0)}}</p>
                    </el-card>
                </el-col>

                <el-col :span="5">
                    <el-card shadow="always" class="always">
                        <div class="a_title">完单率（%）</div>
                        <p  class="a_value">{{orderSuccessRatio ||0 }}</p>
                    </el-card>
                </el-col>

                <el-col :span="5">
                    <el-card shadow="always" class="always">
                        <div class="a_title">已付款订单量（单）</div>
                        <template v-if="thousandSeparator(orderPaidCount||0).length>9">
                            <el-tooltip class="item" effect="dark" placement="top" :content="thousandSeparator(orderPaidCount||0)">
                                <p class="a_value">{{thousandSeparator(orderPaidCount||0)}}</p>
                            </el-tooltip>
                        </template>
                        <p v-else class="a_value">{{thousandSeparator(orderPaidCount||0)}}</p>
                    </el-card>
                </el-col>

                <el-col :span="5">
                    <el-card shadow="always" class="always">
                        <div class="a_title">已付款率（%）</div>
                        <p  class="a_value">{{orderPaidRatio ||0 }}</p>
                    </el-card>
                </el-col>

                <el-col :span="5">
                    <el-card shadow="always" class="always">
                        <div class="a_title">当日待付款订单量（单）
                            <el-tooltip content="指完单当日未完成付款的订单" placement="top">
                                <i class="el-icon-warning"></i>
                            </el-tooltip>
                        </div>
                        <template v-if="thousandSeparator(orderUnpaidCount||0).length>9">
                            <el-tooltip class="item" effect="dark" placement="top" :content="thousandSeparator(orderUnpaidCount||0)">
                                <p class="a_value">{{thousandSeparator(orderUnpaidCount||0)}}</p>
                            </el-tooltip>
                        </template>
                        <p v-else class="a_value">{{thousandSeparator(orderUnpaidCount||0)}}</p>
                    </el-card>
                </el-col>
                
            </el-row>
        </div>
        <div :id="id" style="height: 323px;"></div>
        <!-- </el-card> -->
    </div>
</template>

<script>
export default {
    props: ['searchParms'],
    data() {
        let itemString = 'display: flex; align-items: center';
        let iconString = 'width: 10px; height: 4px;';
        let textString = 'height: 24px; font-size: 14px;  color: #FFFFFF; line-height: 24px;';
        return {
            loading: true,
            moduleName: '/dataServer/tencentTravelOrderAnalysis',
            id: `charts${Math.random() * 100}`,
            orderCreateCount: 0,
            orderAcceptCount: 0,
            orderCancelCount: 0,
            orderSuccessCount: 0,
            orderSuccessRatio: 0,
            orderCancelRatio: 0,
            orderPaidCount: 0,
            orderUnpaidCount: 0,
            orderPaidRatio:0,
            orderAcceptRatio:0,
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
                    trigger: 'axis',
                    axisPointer: {
                        // 坐标轴指示器配置项。
                        type: 'line', //
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
                            cString = '',
                            dString = '',
                            eString = '',
                            fString = '';
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
                                            <p style="${textString}">下单量&nbsp;&nbsp;&nbsp${resValue}单</p>
                                        </div>`;
                            }
                            if (element.componentIndex == 1) {
                                bString = `<div style="${itemString}">
                                            <p style="${iconString}background: ${element.color}; margin-right: 8px"></p>
                                            <p style="${textString}">接单量&nbsp;&nbsp;&nbsp${resValue}单</p>
                                        </div>`;
                            }
                            if (element.componentIndex == 2) {
                                cString = `<div style="${itemString}">
                                            <p style="${iconString}background: ${element.color}; margin-right: 8px"></p>
                                            <p style="${textString}">完成行程订单量&nbsp;&nbsp;&nbsp${resValue}单</p>
                                        </div>`;
                            }
                            if (element.componentIndex == 3) {
                                dString = `<div style="${itemString}">
                                            <p style="${iconString}background: ${element.color}; margin-right: 8px"></p>
                                            <p style="${textString}">取消订单量&nbsp;&nbsp;&nbsp${resValue}单</p>
                                        </div>`;
                            }
                            if (element.componentIndex == 4) {
                                eString = `<div style="${itemString}">
                                            <p style="${iconString}background: ${element.color}; margin-right: 8px"></p>
                                            <p style="${textString}">已付款订单量&nbsp;&nbsp;&nbsp${resValue}单</p>
                                        </div>`;
                            }
                            if (element.componentIndex == 5) {
                                fString = `<div style="${itemString}">
                                            <p style="${iconString}background: ${element.color}; margin-right: 8px"></p>
                                            <p style="${textString}">待付款订单量&nbsp;&nbsp;&nbsp${resValue}单</p>
                                        </div>`;
                            }
                        });
                        return dateString + aString + bString + cString + dString + eString + fString;
                    },
                },
                series: [
                    {
                        name: '下单量',
                        data: [],
                        type: 'line',
                        symbolSize: 6, //设置折线上圆点大小
                    },
                    {
                        name: '接单量',
                        data: [],
                        type: 'line',
                        symbolSize: 6, //设置折线上圆点大小
                    },
                    {
                        name: '完成行程订单量',
                        data: [],
                        type: 'line',
                        symbolSize: 6, //设置折线上圆点大小
                    },
                    {
                        name: '取消订单量',
                        data: [],
                        type: 'line',
                        symbolSize: 6, //设置折线上圆点大小
                    },
                    {
                        name: '已付款订单量',
                        data: [],
                        type: 'line',
                        symbolSize: 6, //设置折线上圆点大小
                    },
                    {
                        name: '待付款订单量',
                        data: [],
                        type: 'line',
                        symbolSize: 6, //设置折线上圆点大小
                    },
                ],
                color: ['#0BDBA8', '#F3D01D', '#1D93FF', '#FD571F', '#FF9B00', '#000'], // 折线的颜色
                legend: {
                    left: 24,
                    bottom: 24,
                    itemHeight: 4,
                    itemWidth: 10,
                    icon: 'rect',
                    textStyle: {
                        color: '#606266',
                        fontSize: '14',
                    },
                    y: 'top',
                    data: ['下单量', '接单量', '完成行程订单量', '取消订单量', '已付款订单量', '待付款订单量'],
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
    methods: {
        // 初始化图表获取数据
        initOrderCountDetail() {
            let chartDom = document.getElementById(this.id);
            this.charts = this.$echarts.init(chartDom);
            this.charts.setOption(this.setChartsOptions);
            this.getOrderCountDetail();
        },
        // 获取数据
        getOrderCountDetail() {
            const op = 'getOrderCountDetail';
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
                    this.orderCreateCount = resData.orderCreateCount;
                    this.orderAcceptCount = resData.orderAcceptCount;
                    this.orderCancelCount = resData.orderCancelCount;
                    this.orderSuccessCount = resData.orderSuccessCount;
                    this.orderSuccessRatio = resData.orderSuccessRatio;
                    this.orderCancelRatio = resData.orderCancelRatio;
                    this.orderPaidCount = resData.orderPaidCount;
                    this.orderUnpaidCount = resData.orderUnpaidCount;
                    this.orderSuccessRatio = resData.orderSuccessRatio
                    this.orderPaidRatio = resData.orderPaidRatio
                    this.orderAcceptRatio = resData.orderAcceptRatio
                    // if(!detailList || detailList.length<=0) {
                    //     return false
                    // }
                    let orderCreateDate = [], // 日期
                        orderAcceptCount = [], // 接单
                        orderCancelCount = [], // 取消
                        orderCreateCount = [], // 下单总量
                        orderSuccessCount = [], // 完单
                        orderPaidCount = [],
                        orderUnpaidCount = [];
                    detailList.forEach(element => {
                        let replaceDate = element.orderCreateDate;
                        if (replaceDate) {
                            replaceDate = replaceDate.replace(/-/g, '/').slice(5);
                        }
                        orderCreateDate.push(replaceDate);
                        orderAcceptCount.push(element.orderAcceptCount);
                        orderCancelCount.push(element.orderCancelCount);
                        orderCreateCount.push(element.orderCreateCount);
                        orderSuccessCount.push(element.orderSuccessCount);
                        orderPaidCount.push(element.orderPaidCount);
                        orderUnpaidCount.push(element.orderUnpaidCount)
                    });
                    // 日期
                    this.setChartsOptions.xAxis.data = orderCreateDate;
                    // 下单总量(单)
                    this.setChartsOptions.series[0].data = orderCreateCount;
                    // 接单总量
                    this.setChartsOptions.series[1].data = orderAcceptCount;
                    // 完成行程订单总金额(元)
                    this.setChartsOptions.series[2].data = orderSuccessCount;
                    // 取消订单总量(单)
                    this.setChartsOptions.series[3].data = orderCancelCount;
                    // 已付款订单量(单)
                    this.setChartsOptions.series[4].data = orderPaidCount;
                    // 待付款订单量(单)
                    this.setChartsOptions.series[5].data = orderUnpaidCount;
                    // 赋值echart
                    this.charts.setOption(this.setChartsOptions, true);
                }
            }).finally(()=>{ 
                this.loading=false
             })
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
    .qu_box {
        margin-bottom: 32px;
        .always {
            text-align: center;
            margin-bottom: 16px;
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
    }
}
/deep/.el-col-5 {
    width: 20% !important;
}
</style>
