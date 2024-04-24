<template>
    <div class="section-box">
        <div class="radio-search">
            <h3 class="table-title">已完成订单分析（单）
                <el-tooltip effect="dark" placement="right">
                    <div slot="content" style="width: 465px;">
                        双证订单：系统A类(有系统车证、有系统人证)、系统E类（系统车证不可查，有系统人证）、系统F类（有系统车证，系统人证不可查）、系统K类司机（系统人证和车证均不可查）完成行程订单。<br />
                        单车证订单：系统C类（无系统车证，有系统人证）、系统G类司机（无系统车证、系统人证不可查）完成行程订单。<br />
                        单人证订单：系统B类(有系统车证，无系统人证)、系统H类司机（系统车证不可查，无系统人证）完成行程订单。<br />
                        无证订单：系统D类司机（均无系统人证、车证）完成行程订单。<br />
                        无效包干：包干服务已过期的司机完成行程订单。<br />
                        有效包干：仍在包干有效期内的司机完成行程订单。<br />
                        非包干：从未在平台购买过包干服务的司机完成行程订单。<br />
                        普通车主：没有参与绩效分排名的司机完成行程订单。<br />
                        共享合伙人：参与绩效分排名，且司机绩效分排名名次在共享合伙人排名范围内的司机完成行程订单。<br />
                        高级合伙人：参与绩效分排名，且司机绩效分排名名次在高级合伙人排名范围内司机完成行程订单。<br />
                    </div>
                    <img width="24" src="@/assets/order/icon_tips.png" alt="">
                </el-tooltip>
            </h3>
        </div>
        <el-row :gutter="16" class="echart-order">
            <el-col :lg="6">
                <div class="item">
                    <p class="sub-title">按业务场景分类</p>
                    <div id="business-pie" ref="businessPieRef" v-show="empty[0]"></div>
                    <div class="data-empty" v-show="!empty[0]">
                        <img width=" 122" src="@/assets/index/empty.png" alt="暂无数据">
                        <p>暂无相关数据</p>
                    </div>
                </div>
            </el-col>
            <el-col :lg="6">
                <div class="item">
                    <p class="sub-title">按系统合规类型分类</p>
                    <div id="operation-pie" ref="operationPieRef" v-show="empty[1]"></div>
                    <div class="data-empty" v-show="!empty[1]">
                        <img width=" 122" src="@/assets/index/empty.png" alt="暂无数据">
                        <p>暂无相关数据</p>
                    </div>
                </div>
            </el-col>
            <el-col :lg="6">
                <div class="item">
                    <p class="sub-title">按包干司机分类</p>
                    <div id="vipType-pie" ref="vipTypePieRef" v-show="empty[2]"></div>
                    <div class="data-empty" v-show="!empty[2]">
                        <img width=" 122" src="@/assets/index/empty.png" alt="暂无数据">
                        <p>暂无相关数据</p>
                    </div>
                </div>
            </el-col>
            <el-col :lg="6">
                <div class="item">
                    <p class="sub-title">按车主类型分类</p>
                    <div id="partnerType-pie" ref="partnerTypePieRef" v-show="empty[3]"></div>
                    <div class="data-empty" v-show="!empty[3]">
                        <img width=" 122" src="@/assets/index/empty.png" alt="暂无数据">
                        <p>暂无相关数据</p>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
 
<script>
import echarts from '../../../utils/echarts'
import { PIE_OPTS } from '../../../utils/charts-options'
import { cloneDeep } from 'lodash-es'
const echartArr = [
    { id: 0, name: 'business-pie' }, { id: 1, name: 'operation-pie' },
    { id: 2, name: 'vipType-pie' }, { id: 3, name: 'partnerType-pie' },
]
export default {
    name: 'orderComplete',
    props: {
        chartData: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            myChart: [],
            empty: [true, true, true, true]
        }
    },

    watch: {
        chartData: {
            deep: true,
            handler(val) {
                for (let i = 0; i < echartArr.length; i++) {
                    this.setOptions(val[i], i)
                }
            }
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.initChart()
        })
    },

    methods: {
        initChart() {
            for (let i = 0; i < echartArr.length; i++) {
                const e = echartArr[i];
                this.myChart[e.id] = echarts.init(document.getElementById(e.name));
                this.setOptions(this.chartData[i], e.id)
            }
        },
        setOptions(data, i) {
            if (data?.length > 0) {
                this.$set(this.empty, i, true)
                let pieOption = cloneDeep(PIE_OPTS)
                pieOption.series[0].data = data
                this.myChart[i].setOption(pieOption)
            } else {
                this.$set(this.empty, i, false)
            }
        },
    }
}
</script>
 
<style scoped lang="scss">
.section-box {
    margin-top: 32px;

    .table-title {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #303133;
        line-height: 22px;
        margin-bottom: 16px;
        display: flex;
    }

    .echart-order {
        margin-bottom: 32px;
    }

    .item {
        width: 100%;
        height: 391px;
        border: 1px solid #DCDFE6;
        border-radius: 8px;
        position: relative;

        .sub-title {
            position: absolute;
            top: 16px;
            left: 24px;
            z-index: 9;
        }
    }

    .pay-box {
        width: 100%;
        position: relative;

        .chart-title {
            margin-bottom: 16px;
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #303133;
        }
    }

    .data-empty {
        height: 391px;
        text-align: center;
        padding-top: 100px;
    }
}

#business-pie,
#operation-pie,
#vipType-pie,
#partnerType-pie {
    width: 100%;
    height: 100%;
}
</style>