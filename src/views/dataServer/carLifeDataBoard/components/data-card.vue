<template>
    <div class="content-data-box">
        <div class="title">订单对比分析</div>
        <div class="index-name">
            <el-card class="card-box" :class="tabIndex==0?'card-cur':''" @click.native="changeColor(0)">
                <div class="name-circle">
                    <div class="circle-title">
                        <span class="dataCardName">订单金额(元)</span>
                        <el-tooltip placement="top-start" class="info-tooltip">
                            <i class="el-icon-question" style="color: #333"></i>
                            <div slot="content">
                                指支付成功订单的订单金额，跑腿业务按「实付金额」取值
                            </div>
                        </el-tooltip>
                    </div>
                </div>
                <div class="index-count">
                    <b>
                        <count-to :startVal="0" :decimals="2" :duration='1000'
                                  :endVal="Number(datasCard.createOrderAmt||0)"></count-to>
                    </b>
                    <div class="pt8">
                        <span class="font001">{{ dateFormat(dates.startDate) }}至{{
                                dateFormat(dates.endDate)
                            }} 环比</span>
                        <span class="font002"
                              :class="datasCard&&datasCard.m2mCreateOrderAmtPercent>= 0? 'icon-red' : 'icon-green' "
                              v-if="datasCard.m2mCreateOrderAmtPercent!=null">{{
                                datasCard.m2mCreateOrderAmtPercent
                            }}%</span>
                        <span class="font003" v-else>暂无数据</span>
                    </div>
                </div>
            </el-card>
            <el-card class="card-box" :class="tabIndex==1?'card-cur':''" @click.native="changeColor(1)">
                <div class="name-circle">
                    <div class="circle-title">
                        <span class="dataCardName">实付金额(元)</span>
                        <el-tooltip placement="top-start" class="info-tooltip">
                            <i class="el-icon-question" style="color: #333"></i>
                            <div slot="content">
                                指支付成功订单的实付金额
                            </div>
                        </el-tooltip>
                    </div>
                </div>
                <div class="index-count">
                    <b>
                        <count-to :startVal="0" :decimals="2" :duration='1000'
                                  :endVal="Number(datasCard.paidOrderAmt||0)"></count-to>
                    </b>
                    <div class="pt8">
                        <span class="font001">{{ dateFormat(dates.startDate) }}至{{
                                dateFormat(dates.endDate)
                            }} 环比</span>
                        <span class="font002"
                              :class="datasCard&&datasCard.m2mPaidOrderAmtPercent>= 0? 'icon-red' : 'icon-green' "
                              v-if="datasCard.m2mPaidOrderAmtPercent!=null">{{
                                datasCard.m2mPaidOrderAmtPercent
                            }}%</span>
                        <span class="font003" v-else>暂无数据</span>
                    </div>
                </div>
            </el-card>
            <el-card class="card-box" :class="tabIndex==2?'card-cur':''" @click.native="changeColor(2)">
                <div class="name-circle">
                    <div class="circle-title">
                        <span class="dataCardName">支付订单数(单)</span>
                        <el-tooltip placement="top-start" class="info-tooltip">
                            <i class="el-icon-question" style="color: #333"></i>
                            <div slot="content">
                                指支付成功的订单笔数
                            </div>
                        </el-tooltip>
                    </div>
                </div>
                <div class="index-count">
                    <b>
                        <count-to :startVal="0" :duration='1000' :endVal="Number(datasCard.paidOrderCnt||0)"></count-to>
                    </b>
                    <div class="pt8">
                        <span class="font001">{{ dateFormat(dates.startDate) }}至{{
                                dateFormat(dates.endDate)
                            }} 环比</span>
                        <span class="font002"
                              :class="datasCard&&datasCard.m2mPaidOrderCntPercent>= 0? 'icon-red' : 'icon-green' "
                              v-if="datasCard.m2mPaidOrderCntPercent!=null">{{
                                datasCard.m2mPaidOrderCntPercent
                            }}%</span>
                        <span class="font003" v-else>暂无数据</span>
                    </div>
                </div>
            </el-card>
        </div>
        <div class="chart-box" v-show="tabIndex==0">
            <charts ref="changeDataOne" :setChartsOptions="orderPkOne" :key="new Date().getTime()"></charts>
        </div>
        <div class="chart-box" v-show="tabIndex==1">
            <charts ref="changeDataTwo" :setChartsOptions="orderPkTwo" :key="new Date().getTime()"></charts>
        </div>
        <div class="chart-box" v-show="tabIndex==2">
            <charts ref="changeDataThree" :setChartsOptions="orderPkThree" :key="new Date().getTime()"></charts>
        </div>
    </div>
</template>

<script>
import countTo from 'vue-count-to'
import charts from './charts.vue'
import {orderPk} from './charts'

export default {
    components: {charts, countTo},
    props: {
        datas: {
            type: Object,
            default: () => {
            }
        },
        searchParams: {
            type: Object,
            default: () => {
            }
        }
    },
    data() {
        return {
            tabIndex: 0,
            datasCard: [],
            dates: [],
            orderPkOne: {},
            orderPkTwo: {},
            orderPkThree: {},
        };
    },
    watch: {
        datas: {
            handler(newVal, oldval) {
                if (newVal) {
                    this.datasCard = newVal
                    this.changeColor(0)
                }
            },
            deep: true,
            immediate: true
        },
        searchParams: {
            handler(newVal, oldval) {
                if (newVal) {
                    this.dates = newVal
                }
            },
            deep: true,
            immediate: true
        },
    },
    mounted() {
        // this.orderPkOne = orderPk
        // this.orderPkOne.xAxis.data = ["2023-02-01", "2023-02-02", "2023-02-03"] || []
        // this.orderPkOne.series[0].data = [20, 14, 189] || []
        // this.orderPkOne.series[1].data = [20, 14, 10] || []
        // this.$refs.changeDataOne.updateCharts(this.orderPkOne)
    },
    methods: {
        //tab切换
        changeColor(val) {
            console.log(this.datasCard.detailList, "this.datasCard")
            this.tabIndex = val;
            let detailList = this.datasCard.detailList;
            let m2mDetailList = this.datasCard.m2mDetailList;


            const timeList = []
            const createOrderAmtListA = [] // 订单金额
            const paidOrderAmtListA = [] // 实付金额
            const paidOrderCntListA = [] // 实付订单数
            const createOrderAmtListB = [] // 订单金额
            const paidOrderAmtListB = [] // 实付金额
            const paidOrderCntListB = [] // 实付订单数
            if (detailList && m2mDetailList) {
                detailList.forEach(item => {
                    timeList.push(item.orderCreateDate)
                    createOrderAmtListA.push(item.createOrderAmt)
                    paidOrderAmtListA.push(item.paidOrderAmt)
                    paidOrderCntListA.push(item.paidOrderCnt)
                })
                m2mDetailList.forEach(item => {
                    createOrderAmtListB.push(item.createOrderAmt)
                    paidOrderAmtListB.push(item.paidOrderAmt)
                    paidOrderCntListB.push(item.paidOrderCnt)
                })
                if (this.tabIndex == 0) {
                    this.orderPkOne = orderPk
                    this.orderPkOne.xAxis.data = timeList || []
                    this.orderPkOne.series[0].data = createOrderAmtListA || []
                    this.orderPkOne.series[1].data = createOrderAmtListB || []
                    this.$refs.changeDataOne.updateCharts(this.orderPkOne)
                }

                if (this.tabIndex == 1) {
                    this.orderPkTwo = orderPk
                    this.orderPkTwo.xAxis.data = timeList || []
                    this.orderPkTwo.series[0].data = paidOrderAmtListA || []
                    this.orderPkTwo.series[1].data = paidOrderAmtListB || []
                    this.$refs.changeDataTwo.updateCharts(this.orderPkTwo)
                }
                if (this.tabIndex == 2) {
                    this.orderPkThree = orderPk
                    this.orderPkThree.xAxis.data = timeList || []
                    this.orderPkThree.series[0].data = paidOrderCntListA || []
                    this.orderPkThree.series[1].data = paidOrderCntListB || []
                    this.$refs.changeDataThree.updateCharts(this.orderPkThree)
                }
            }


        },
        //列表时间格式化
        dateFormat(date) {
            if (date) {
                return date.substring(5, 10);
            } else {
                return '--';
            }
        },
        NumberMul(arg1, arg2) {
            var m = 0;
            var s1 = arg1 ? arg1.toString() : '';
            var s2 = arg2 ? arg2.toString() : '';
            try {
                m += s1.split(".")[1].length;
            } catch (e) {
            }
            try {
                m += s2.split(".")[1].length;
            } catch (e) {
            }
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
        }
    }
};
</script>

<style lang="scss" scoped>
.index-name {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;

    .card-cur {
        box-shadow: 0px 5px 16px 0px rgba(246, 83, 72, 0.2);
        border: 1px solid #F65348;
    }

    .card-box {
        width: 33%;
        height: 154px;
        text-align: center;

        .name-circle {
            display: flex;
            flex-direction: row;
            justify-content: space-around;

            .circle-title {

                flex: 1;

                .info-tooltip {
                    margin-left: 8px;
                }
            }
        }

        .index-count {
            b {
                display: block;
                font-size: 48px;
                font-weight: bold;
                color: #303133;
                line-height: 56px;
            }

            .pt8 {
                padding-top: 8px;
            }

            .font001 {
                font-size: 14px;
                font-weight: 400;
                color: #909399;
                line-height: 20px;
            }

            .font002 {
                font-size: 14px;
                font-weight: 400;
                line-height: 20px;
                padding-left: 17px;
                margin-left: 7px;
            }

            .font003 {
                font-size: 14px;
                font-weight: 400;
                line-height: 20px;
                margin-left: 7px;
                color: #F05259;
            }

            .icon-green {
                background: url("../../../../assets/images/icon_down.png") no-repeat left 2px;
                background-size: 17px 16px;
                color: #0BDBA8;
            }

            .icon-red {
                background: url("../../../../assets/images/icon_up.png") no-repeat left 1px;
                background-size: 17px 16px;
                color: #FD571F;
            }


            .margin20 {
                margin: 0 20px;
            }
        }
    }
}

.chart-box {
    padding-top: 24px;
    width: 100%;
}


/deep/ .el-card__body {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

section div.content-data-box {
    height: auto;
    padding: 32px 40px;
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 16px;

    .title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        line-height: 22px;
        padding: 0 0 12px 0;
    }
}
</style>
