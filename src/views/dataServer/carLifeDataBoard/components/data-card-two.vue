<template>
    <div class="content-data-box">
        <div class="title">订单汇总统计</div>
        <div class="index-name">
            <el-card class="card-box">
                <div class="name-circle">
                    <div class="circle-title">
                        <span class="dataCardName">日均订单金额(元)</span>
                        <el-tooltip placement="top-start" class="info-tooltip">
                            <i class="el-icon-question" style="color: #333"></i>
                            <div slot="content">
                                日均订单金额=订单金额/天数（指选择日期天数）
                            </div>
                        </el-tooltip>
                    </div>
                </div>
                <div class="index-count">
                    <b>
                        <count-to :startVal="0" :decimals="2" :duration='1000'
                                  :endVal="Number(datasCard.createOrderAmtDayAvg||0)"></count-to>
                    </b>
                    <div class="pt8">
                        <span class="font001">{{ dateFormat(dates.startDate) }}至{{
                                dateFormat(dates.endDate)
                            }} 环比</span>
                        <span class="font002"
                              :class="datasCard && datasCard.m2mCreateOrderAmtDayAvgPercent >=0? 'icon-red' : 'icon-green' "
                              v-if="datasCard.m2mCreateOrderAmtDayAvgPercent!=null">{{
                                datasCard.m2mCreateOrderAmtDayAvgPercent
                            }}%</span>
                        <span class="font003" v-else>暂无数据</span>
                    </div>
                </div>
            </el-card>
            <el-card class="card-box">
                <div class="name-circle">
                    <div class="circle-title">
                        <span class="dataCardName">日均支付订单数(单)</span>
                        <el-tooltip placement="top-start" class="info-tooltip">
                            <i class="el-icon-question" style="color: #333"></i>
                            <div slot="content">
                                日均支付订单数=支付订单数/天数（指选择日期天数）
                            </div>
                        </el-tooltip>
                    </div>
                </div>
                <div class="index-count">
                    <b>
                        <count-to :startVal="0" :duration='1000'
                                  :endVal="Number(datasCard.paidOrderCntDayAvg||0)"></count-to>
                    </b>
                    <div class="pt8">
                        <span class="font001">{{ dateFormat(dates.startDate) }}至{{
                                dateFormat(dates.endDate)
                            }} 环比</span>
                        <span class="font002"
                              :class="datasCard && datasCard.m2mPaidOrderCntDayAvgPercent>=0? 'icon-red' : 'icon-green' "
                              v-if="datasCard.m2mPaidOrderCntDayAvgPercent!=null">{{
                                datasCard.m2mPaidOrderCntDayAvgPercent
                            }}%</span>
                        <span class="font003" v-else>暂无数据</span>
                    </div>
                </div>
            </el-card>
            <el-card class="card-box">
                <div class="name-circle">
                    <div class="circle-title">
                        <span class="dataCardName">退款金额(元)</span>
                        <el-tooltip placement="top-start" class="info-tooltip">
                            <i class="el-icon-question" style="color: #333"></i>
                            <div slot="content">
                                按退款时间统计，目前只包含：违章和团油业务。
                            </div>
                        </el-tooltip>
                    </div>
                </div>
                <div class="index-count">
                    <b>
                        <count-to :startVal="0" :decimals="2" :duration='1000'
                                  :endVal="Number(datasCard.refundOrderAmt||0)"></count-to>
                    </b>
                    <div class="pt8">
                        <span class="font001">{{ dateFormat(dates.startDate) }}至{{
                                dateFormat(dates.endDate)
                            }} 环比</span>
                        <span class="font002"
                              :class="datasCard && datasCard.m2mRefundOrderAmtPercent>=0? 'icon-red' : 'icon-green' "
                              v-if="datasCard.m2mRefundOrderAmtPercent!=null">{{
                                datasCard.m2mRefundOrderAmtPercent
                            }}%</span>
                        <span class="font003" v-else>暂无数据</span>
                    </div>
                </div>
            </el-card>
            <el-card class="card-box mt16">
                <div class="name-circle">
                    <div class="circle-title">
                        <span class="dataCardName">优惠金额(元)</span>
                        <el-tooltip placement="top-start" class="info-tooltip">
                            <i class="el-icon-question" style="color: #333"></i>
                            <div slot="content">
                                指支付订单中优惠的金额
                            </div>
                        </el-tooltip>
                    </div>
                </div>
                <div class="index-count">
                    <b>
                        <count-to :startVal="0" :decimals="2" :duration='1000'
                                  :endVal="Number(datasCard.discountOrderAmt||0)"></count-to>
                    </b>
                    <div class="pt8">
                        <span class="font001">{{ dateFormat(dates.startDate) }}至{{
                                dateFormat(dates.endDate)
                            }} 环比</span>
                        <span class="font002"
                              :class="datasCard&&datasCard.m2mDiscountOrderAmtPercent>=0? 'icon-red' : 'icon-green' "
                              v-if="datasCard.m2mDiscountOrderAmtPercent!=null">{{
                                datasCard.m2mDiscountOrderAmtPercent
                            }}%</span>
                        <span class="font003" v-else>暂无数据</span>
                    </div>
                </div>
            </el-card>
            <el-card class="card-box mt16">
                <div class="name-circle">
                    <div class="circle-title">
                        <span class="dataCardName">优惠订单数(单)</span>
                        <el-tooltip placement="top-start" class="info-tooltip">
                            <i class="el-icon-question" style="color: #333"></i>
                            <div slot="content">
                                指支付订单中有优惠的订单，优惠金额＞0
                            </div>
                        </el-tooltip>
                    </div>
                </div>
                <div class="index-count">
                    <b>
                        <count-to :startVal="0" :duration='1000'
                                  :endVal="Number(datasCard.discountOrderCnt||0)"></count-to>
                    </b>
                    <div class="pt8">
                        <span class="font001">{{ dateFormat(dates.startDate) }}至{{
                                dateFormat(dates.endDate)
                            }} 环比</span>
                        <span class="font002"
                              :class="datasCard&& datasCard.m2mDiscountOrderCntPercent>=0? 'icon-red' : 'icon-green' "
                              v-if="datasCard.m2mDiscountOrderCntPercent!=null">{{
                                datasCard.m2mDiscountOrderCntPercent
                            }}%</span>
                        <span class="font003" v-else>暂无数据</span>
                    </div>
                </div>
            </el-card>
            <el-card class="card-box mt16">
                <div class="name-circle">
                    <div class="circle-title">
                        <span class="dataCardName">返佣金额(元)</span>
                        <el-tooltip placement="top-start" class="info-tooltip">
                            <i class="el-icon-question" style="color: #333"></i>
                            <div slot="content">
                                抽佣金额-抽佣退款金额
                            </div>
                        </el-tooltip>
                    </div>
                </div>
                <div class="index-count">
                    <b>
                        <count-to :startVal="0" :decimals="2" :duration='1000'
                                  :endVal="Number(datasCard.commissionOrderAmt||0)"></count-to>
                    </b>
                    <div class="pt8">
                        <span class="font001">{{ dateFormat(dates.startDate) }}至{{
                                dateFormat(dates.endDate)
                            }} 环比</span>
                        <span class="font002"
                              :class="datasCard&&datasCard.m2mCommissionOrderAmtPercent>=0? 'icon-red' : 'icon-green' "
                              v-if="datasCard.m2mCommissionOrderAmtPercent!=null">{{
                                datasCard.m2mCommissionOrderAmtPercent
                            }}%</span>
                        <span class="font003" v-else>暂无数据</span>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
import countTo from 'vue-count-to'

export default {
    components: {countTo},
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
            datasCard: [],
            dates: []
        };
    },
    watch: {
        datas: {
            handler(newVal, oldval) {
                if (newVal) {
                    this.datasCard = newVal
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
    created() {
    },
    methods: {
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

    .mt16 {
        margin-top: 16px;
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
