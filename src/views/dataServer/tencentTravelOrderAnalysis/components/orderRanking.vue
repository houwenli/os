<!-- 订单排行 -->
<template>
    <div class="echart_contant" v-loading="loading">
        <p class="clearfixTitle">订单排名top20</p>
        <div class="category-box" style="display:flex;">
            <div class="div" :style="{height: !isDownCreate? '324px': (cityNameCreate.length*44+60)+'px'}">
                <div class="myCharts" :id="id1" style="flex: 1; height :100%; width: 100%"></div>
                <div @click="moreCreatClick" class="icon_fold_box" :class="{'secondClass': isDownCreate}" v-if="cityNameCreate && cityNameCreate.length> 6">
                    <img v-if="!isDownCreate" src="../../../../assets/images/icon_more@2x.png">
                    <img v-if="isDownCreate" src="../../../../assets/images/icon_fold@2x.png">
                    <span>{{isDownCreate ? '收起' : '展开'}}</span>
                </div>
            </div>
            <div class="div"  :style="{height: !isDownSuccess? '324px': (cityNameSuccess.length*44+60)+'px'}">
                <div class="myCharts" :id="id2" style="flex: 1; height :100%; width: 100%"></div>
                <div @click="moreSuccessClick" class="icon_fold_box" :class="{'secondClass': isDownSuccess}" v-if="cityNameSuccess && cityNameSuccess.length> 6">
                    <img v-if="!isDownSuccess" src="../../../../assets/images/icon_more@2x.png">
                    <img v-if="isDownSuccess" src="../../../../assets/images/icon_fold@2x.png">
                    <span>{{isDownSuccess ? '收起' : '展开'}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { setChartsOptionsCreateCount, setChartsOptionsSuccessCount } from './chartsOptions';
export default {
    props: ['searchParms'],
    data() {
        return {
            loading: false,
            moduleName: '/dataServer/tencentTravelOrderAnalysis',
            id1: `charts${Math.random() * 100}`,
            id2: `charts${Math.random() * 100}`,
            isDownCreate: false,
            isDownSuccess: false,
            chartsCreate: null,
            chartsSuccess: null,
            setChartsOptionsCreate: {},
            setChartsOptionsSuccess: {},
            cityNameCreate: [],
            cityNameSuccess: [],
            orderCountCreate: [],
            orderCountSuccess: [],
            lengthCreate: 5,
            lengthSuccess: 5
        };
    },
    created() {
        // let setChartsOptionsCreate = setChartsOptionsCreateCount([], false);
        // let setChartsOptionsSuccess = setChartsOptionsSuccessCount([], false);
        // this.datas = this.$baseMethod.deepClone({
        //     setChartsOptionsCreate,
        //     setChartsOptionsSuccess,
        // });
    },
    beforeDestroy () {
        if (this.chartsCreate) {
            this.chartsCreate.dispose();
            this.chartsCreate = null;
        }
        if (this.chartsSuccess) {
            this.chartsSuccess.dispose();
            this.charchartsSuccesst2 = null;
        }
    },
    mounted() {
    },
    methods: {
        // 初始化图表获取数据
        initOrderRankingDetail() {
            this.chartsCreate = this.$echarts.init(document.getElementById(this.id1));
            this.chartsCreate.setOption(setChartsOptionsCreateCount([], false));
            this.chartsSuccess = this.$echarts.init(document.getElementById(this.id2));
            this.chartsSuccess.setOption(setChartsOptionsSuccessCount([], false));
            let _this = this;
            window.addEventListener('resize', function() {});
            this.getOrderRankingDetail();
        },
        // 获取数据
        getOrderRankingDetail() {
            const op = 'getOrderRankingDetail';
            let data = {
                data: { ...this.searchParms },
                op,
            };
            this.loading = true;
            let URL = this.$getModuleUrl(this.moduleName, op);
            this.loading = true
            this.$axios(URL, data).then(res => {
                if (res.code == 1) {
                    this.loading = false;
                    let orderCreateList = [], orderSuccessList = [];
                    const ret = JSON.parse(res.data);
                    orderCreateList = ret.orderCreateList;
                    orderSuccessList = ret.orderSuccessList;
                    this.cityNameCreate = [];this.cityNameSuccess = [];
                    this.orderCountCreate = []; this.orderCountSuccess = [];
                    orderCreateList.forEach(element => {
                        let cityName = element.cityName.length > 5 ? `${element.cityName.slice(0, 4)}...` : element.cityName;
                        this.cityNameCreate.push(cityName);
                        this.orderCountCreate.push(element.orderCount);
                    });
                    orderSuccessList.forEach(element => {
                        let cityName = element.cityName.length > 5 ? `${element.cityName.slice(0, 4)}...` : element.cityName;
                        this.cityNameSuccess.push(cityName);
                        this.orderCountSuccess.push(element.orderCount); 
                    });
                    if (orderCreateList.length > 6) {
                        this.lengthCreate = 5;
                    } else {
                        this.lengthCreate = orderCreateList.length - 1;
                    }
                    if (orderSuccessList.length > 6) {
                        this.lengthSuccess = 5;
                    } else {
                        this.lengthSuccess = orderSuccessList.length - 1;
                    }
                    this.isDownCreate = false;
                    this.isDownSuccess = false;
                    this.getCreateCharts();
                    this.getSuccessCharts()
                }
            });
        },
         // 下单排名charts赋值
        getCreateCharts() {
            let _this = this;
            this.setChartsOptionsCreate = setChartsOptionsCreateCount(this.cityNameCreate, this.isDownCreate);
            this.setChartsOptionsCreate.yAxis.data = this.cityNameCreate;
            this.setChartsOptionsCreate.series[0].data = this.orderCountCreate;
            this.setChartsOptionsCreate.yAxis.max = this.lengthCreate;
            this.chartsCreate.setOption(this.setChartsOptionsCreate, true);
            this.$nextTick(function() {
                _this.chartsCreate.resize();
            });
        },
        //完单排名charts赋值
        getSuccessCharts() {
            let _this = this
            this.setChartsOptionsSuccess = setChartsOptionsSuccessCount(this.cityNameSuccess, this.isDownSuccess);
            this.setChartsOptionsSuccess.yAxis.data = this.cityNameSuccess;
            this.setChartsOptionsSuccess.series[0].data = this.orderCountSuccess;
            this.setChartsOptionsSuccess.yAxis.max = this.lengthSuccess;
            this.chartsSuccess.setOption(this.setChartsOptionsSuccess, true);
            this.$nextTick(function() {
                _this.chartsSuccess.resize();
            });
        },
        moreCreatClick(numType) {
            let _this = this;
            this.isDownCreate = !this.isDownCreate;
            if (this.isDownCreate) {
                this.lengthCreate = this.cityNameCreate.length - 1;
            } else {
                this.lengthCreate = 5;
            }
            this.getCreateCharts()
            this.$nextTick(function() {
                _this.chartsCreate.resize();
            });
        },
        moreSuccessClick() {
            let _this = this
            this.isDownSuccess = !this.isDownSuccess;
            if (this.isDownSuccess) {
                this.lengthSuccess = this.cityNameSuccess.length - 1;
            } else {
                this.lengthSuccess = 5;
            }
            this.getSuccessCharts()
            this.$nextTick(function() {
                _this.chartsSuccess.resize();
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
    .myCharts {
        display: flex;
        height: 100%;
    }
    .category-box {
        position: relative;
        .div {
            position: relative;
            background: #ffffff;
            border-radius: 8px;
            border: 1px solid #dcdfe6;
            padding: 24px 24px;
            flex: 1;
            &:nth-child(2) {
                margin-left: 20px;
            }
            .icon_fold_box {
                display: flex;
                font-size: 12px;
                color: #0088ff;
                align-items: center;
                position: absolute;
                bottom: 20px;
                left: 28px;
                img {
                    width: 18px;
                    height: 18px;
                    margin-right: 6px;
                }
            }
        }
    }
}
</style>
