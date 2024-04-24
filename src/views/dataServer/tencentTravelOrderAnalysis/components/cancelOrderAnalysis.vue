<!-- 取消订单分析 -->
<template>
    <div class="echart_contant" v-loading="loading">
        <p class="clearfixTitle">取消订单分析</p>
        <div class="concel-contant-box">
            <div class="table_flex">
                <div class="t_title">
                    <p class="t_title_first">取消订单总量</p>
                    <template v-if="(orderCancelCount+'').length>6">
                        <el-tooltip class="item" effect="dark" placement="right-start" :content="thousandSeparator(orderCancelCount||0)+'单'">
                            <p class="t_title_value">{{thousandSeparator(orderCancelCount||0)}}单</p>
                        </el-tooltip>
                    </template>
                    <p v-else class="t_title_value">{{thousandSeparator(orderCancelCount||0)}}单</p>
                </div>
                <div class="tableConcel">
                    <div class="tableConcel-item" v-for="(item, index) in concelListBefore" :key="index">
                        <p class="title_item">{{item.text}}</p>
                        <template v-if="(item.value+'').length>6">
                            <el-tooltip class="item" effect="dark" placement="right-start" :content="thousandSeparator(item.value||0)+'单'">
                                <p class="value_item">{{thousandSeparator(item.value||0)}}单</p>
                            </el-tooltip>
                        </template>
                        <p v-else class="value_item">{{thousandSeparator(item.value||0)}}单</p>
                    </div>
                </div>
                <div class="tableConcel">
                    <div class="tableConcel-item" v-for="(item, index) in concelListAfter" :key="index">
                        <p class="title_item">{{item.text}}</p>
                        <template v-if="(item.value+'').length>6">
                            <el-tooltip class="item" effect="dark" placement="right-start" :content="thousandSeparator(item.value||0)+'单'">
                                <p class="value_item">{{thousandSeparator(item.value||0)}}单</p>
                            </el-tooltip>
                        </template>
                        <p v-else class="value_item">{{thousandSeparator(item.value||0)}}单</p>
                    </div>
                </div>
            </div>
            <div class="bing_box">
                <div class="bing_content">
                    <p><span style="background: #254BE9;" class="icon_class"></span><span>接单前总取消订单</span></p>
                    <p><span style="background: #0BDBA8;" class="icon_class"></span><span>接单后总取消订单</span></p>
                    <p v-for="(item, index) in lendgeArr" :key="index"><span :style="{background: item.color}" class="icon_class"></span><span>{{item.name}}</span></p>
                </div>
                <div class="bing_charts">
                    <div :id="id1" class="theOnebing" style="height: 100%;"></div>
                    <div class="bg_class" :class="[(clickName == '接单前总取消订单')? 'nextClass1' : 'nextClass2']"></div>
                    <div class="theTwobing" :id="id2" style="height: 100%"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { setChartsOptionsBeforeRadio, setChartsOptionsAfterRadio } from './chartsOptions';
export default {
    props: ['searchParms'],
    data() {
        return {
            moduleName: '/dataServer/tencentTravelOrderAnalysis',
            id1: `charts${Math.random() * 100}`,
            id2: `charts${Math.random() * 100}`,
            concelListBefore: [],
            concelListAfter: [],
            dataRadioBefore: [],
            dataRadioAfter: [],
            lendgeArr: [],
            chartsBefore: null,
            chartsAfter: null,
            datas: null,
            orderCancelCount: 0, // 取消订单总量
            clickName: '接单前总取消订单',
            loading: false,
        };
    },
    mounted() {},
    created() {
        this.datas = this.$baseMethod.deepClone({
            setChartsOptionsBeforeRadio,
            setChartsOptionsAfterRadio,
        });
    },
    beforeDestroy() {
        if (this.chartsBefore) {
            this.chartsBefore.dispose();
            this.chartsBefore = null;
        }
        if (this.chartsAfter) {
            this.chartsAfter.dispose();
            this.chartsAfter = null;
        }
    },
    computed: {},
    methods: {
        // 初始化图表获取数据
        initOrderCancelDetail() {
            this.getTypeMothedList();
            this.chartsBefore = this.$echarts.init(document.getElementById(this.id1));
            this.chartsBefore.setOption(this.datas.setChartsOptionsBeforeRadio);
            this.datas.setChartsOptionsAfterRadio.series[0].data = this.dataRadioBefore;
            this.chartsAfter = this.$echarts.init(document.getElementById(this.id2));
            this.chartsAfter.setOption(this.datas.setChartsOptionsAfterRadio);
            const _this = this;
            // 左侧图表绑定事件
            this.chartsBefore.on('click', function() {
                _this.chartsClick(...arguments);
            });
            this.getOrderCancelDetail();
        },
        // 获取数据
        getOrderCancelDetail() {
            const op = 'getOrderCancelDetail';
            let data = {
                data: {
                    ...this.searchParms,
                },
                op,
            };
            this.loading = true;
            let URL = this.$getModuleUrl(this.moduleName, op);
            this.$axios(URL, data).then(res => {
                if (res.code == 1) {
                    this.loading = false;
                    let ret = JSON.parse(res.data);
                    this.orderCancelCount = ret.orderCancelCount;
                    this.datas.setChartsOptionsBeforeRadio.series[0].data[0].value = ret.beforeCancelRatio || 0;
                    this.datas.setChartsOptionsBeforeRadio.series[0].data[1].value = ret.afterCancelRatio || 0;
                    this.chartsBefore.setOption(this.datas.setChartsOptionsBeforeRadio, true);
                    if (ret.beforeCancelCount && ret.beforeCancelCount > 0 && ret.afterCancelCount == 0) {
                        this.datas.setChartsOptionsBeforeRadio.series[0].data[0].selected = true;
                        this.clickName = '接单前总取消订单';
                    } else if (ret.afterCancelCount && ret.afterCancelCount > 0 && ret.beforeCancelCount == 0) {
                        this.datas.setChartsOptionsBeforeRadio.series[0].data[1].selected = true;
                        this.clickName = '接单后总取消订单';
                    }
                    Object.keys(ret).forEach(key => {
                        this.concelListBefore.forEach((item, index) => {
                            if (item.label == key) {
                                item['value'] = ret[key];
                            }
                        });
                        this.concelListAfter.forEach((item, index) => {
                            if (item.label == key) {
                                item['value'] = ret[key];
                            }
                        });
                        this.dataRadioBefore.forEach((item, index) => {
                            if (item.label == key) {
                                item['value'] = ret[key] || 0;
                            }
                        });
                        this.dataRadioAfter.forEach((item, index) => {
                            if (item.label == key) {
                                item['value'] = ret[key] || 0;
                            }
                        });
                    });
                    this.lendgeArr = this.dataRadioBefore;
                    this.datas.setChartsOptionsAfterRadio.series[0].data = this.dataRadioBefore;
                    // 赋值echart
                    this.chartsBefore.setOption(this.datas.setChartsOptionsBeforeRadio, true);
                    this.chartsAfter.setOption(this.datas.setChartsOptionsAfterRadio, true);
                }
            });
        },
        chartsClick(e) {
            if (e.name == '接单前总取消订单') {
                this.datas.setChartsOptionsAfterRadio.series[0].data = this.dataRadioBefore;
                this.lendgeArr = this.dataRadioBefore;
            } else {
                this.datas.setChartsOptionsAfterRadio.series[0].data = this.dataRadioAfter;
                this.lendgeArr = this.dataRadioAfter;
            }
            this.chartsAfter.setOption(this.datas.setChartsOptionsAfterRadio, true);
            if (this.clickName != e.name) {
                this.datas.setChartsOptionsBeforeRadio.series[0].data.reverse();
                this.datas.setChartsOptionsBeforeRadio.color.reverse();
                this.chartsBefore.setOption(this.datas.setChartsOptionsBeforeRadio, true);
            }
            this.clickName = e.name;
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
        getTypeMothedList() {
            this.concelListBefore = [
                {
                    text: '接单前总取消订单',
                    label: 'beforeCancelCount',
                    value: '0',
                },
                {
                    text: `接单前三方平台取消订单`,
                    label: 'beforeOpenPlatformCancelCount',
                    value: '0',
                },
                {
                    text: '接单前乘客取消订单',
                    label: 'beforePassengerCancelCount',
                    value: '0',
                },
                {
                    text: '接单前系统取消订单',
                    label: 'beforeSystemCancelCount',
                    value: '0',
                },
                {
                    text: '接单前后台取消订单',
                    label: 'beforeBackgroundCancelCount',
                    value: '0',
                },
            ];
            this.concelListAfter = [
                {
                    text: '接单后取消订单',
                    label: 'afterCancelCount',
                    value: '0',
                },
                {
                    text: `接单后三方平台取消订单`,
                    label: 'afterOpenPlatformCancelCount',
                    value: '0',
                },
                {
                    text: '接单后乘客取消订单',
                    label: 'afterPassengerCancelCount',
                    value: '0',
                },
                {
                    text: '接单后系统取消订单',
                    label: 'afterSystemCancelCount',
                    value: '0',
                },
                {
                    text: '接单后司机取消订单',
                    label: 'afterDriverCancelCount',
                    value: '0',
                },
                {
                    text: '接单后后台取消订单',
                    label: 'afterBackgroundCancelCount',
                    value: '0',
                },
            ];
            this.dataRadioBefore = [
                {
                    value: 0,
                    name: `接单前三方平台取消订单`,
                    selected: true,
                    label: 'beforeOpenPlatformCancelRatio',
                    color: '#1D93FF',
                },
                {
                    value: 0,
                    name: '接单前系统取消订单',
                    label: 'beforeSystemCancelRatio',
                    color: '#FF9B00',
                },
                {
                    value: 0,
                    name: '接单前乘客取消订单',
                    label: 'beforePassengerCancelRatio',
                    color: '#FD571F',
                },
                {
                    value: 0,
                    name: '接单前后台取消订单',
                    label: 'beforeBackgroundCancelRatio',
                    color: '#2B2B31',
                },
            ];
            this.dataRadioAfter = [
                {
                    value: 0,
                    name: `接单后三方平台取消订单`,
                    selected: true,
                    label: 'afterOpenPlatformCancelRatio',
                    color: '#1D93FF',
                },
                {
                    value: 0,
                    name: '接单后乘客取消订单',
                    label: 'afterPassengerCancelRatio',
                    color: '#FF9B00',
                },
                {
                    value: 0,
                    name: '接单后系统取消订单',
                    label: 'afterSystemCancelRatio',
                    color: '#FD571F',
                },
                {
                    value: 0,
                    name: '接单后司机取消订单',
                    label: 'afterDriverCancelRatio',
                    color: '#2B2B31',
                },
                {
                    value: 0,
                    name: '接单后后台取消订单',
                    label: 'afterBackgroundCancelRatio',
                    color: '#ff0000',
                },
            ];
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
}

.concel-contant-box {
    display: flex;
    background: #ffffff;
    border-radius: 8px;
    border: 1px solid #dcdfe6;
    padding: 24px;

    .table_flex {
        width: 25%;
        font-size: 16px;
        min-width: 300px;

        .t_title {
            display: flex;
            font-weight: 600;
            color: #303133;
            font-size: 16px;
            padding: 0 24px;
            height: 22px;
            align-items: center;

            .t_title_first {
                width: 65%;
            }

            .t_title_value {
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .tableConcel {
            border: 1px solid #ebeef5;
            margin-top: 16px;
            border-radius: 8px;

            .tableConcel-item {
                display: flex;
                justify-content: space-around;
                height: 44px;
                line-height: 44px;
                border-bottom: 1px solid #ebeef5;
                position: relative;
                padding: 0 24px;

                .title_item {
                    width: 65%;
                    text-align: left;
                }

                .value_item {
                    text-align: left;
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                &:first-child {
                    background: #f5f7fa;
                }
            }
        }
    }

    .bing_box {
        flex: 1;
        position: relative;
        margin-left: 20px;

        .bing_content {
            margin-bottom: 21px;
            display: flex;
            align-items: center;
            justify-content: space-around;
            height: 17px;

            p {
                color: '#606266';
                font-size: 12px;

                .icon_class {
                    width: 9px;
                    height: 9px;
                    display: inline-block;
                    background: #000;
                    border-radius: 9px;
                    margin-right: 4px;
                }

                span {
                    color: '#606266';
                }
            }
        }

        .bing_charts {
            width: 100%;
            display: flex;
            height: 504px;
            background: #f5f7fa;
            border-radius: 8px;
            align-items: center;
        }

        .theOnebing {
            flex: 1;
            z-index: 1;
        }

        .bg_class {
            position: absolute;
            z-index: 0;
            top: 26.5%;
            left: 26%;
            width: 540px;
            height: 55.5%;

            &.nextClass1 {
                background: linear-gradient(-270deg, rgba(177, 192, 252, 1) 0%, #f5f7fa 100%);
            }

            &.nextClass2 {
                background: linear-gradient(-270deg, rgba(184, 242, 227, 1) 0%, #f5f7fa 100%);
            }
        }

        .theTwobing {
            flex: 1;
        }
    }
}
</style>
