<template>
    <div class="tx-box">
        <div class="content-tx-box">
            <!-- 查询模块 -->
            <div class="search_box">
                <el-form :model="dataOptions" ref="ruleForm" inline label-width="100px">
                    <el-form-item label="选择平台：" prop="channel">
                        <el-select v-model="dataOptions.channel">
                            <el-option v-for="item in plateformList" :key="item.channelId" :label="item.name" :value="item.channelId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择城市：" prop="city">
                        <ws-city class="city" v-if="powerList.personAreaList" v-model="dataOptions.city" :data="cityData" level="2" :showCountry="true" :default-props="{ checkStrictly: true }" @change="handleChangeCity" :clearable="true"></ws-city>
                        <span v-else>全部</span>
                    </el-form-item>
                    <el-form-item label="选择日期：" prop="time">
                        <el-select v-model="dataOptions.queryDateType" style="width:80px;margin-right:4px;" @change="handleChange">
                            <el-option value="DAY" label="按天"></el-option>
                            <el-option value="MONTH" label="按月"></el-option>
                        </el-select>
                        <el-date-picker v-if="dataOptions.queryDateType === 'DAY'" v-model="dataOptions.time" type="daterange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="handleTimeChange">
                        </el-date-picker>

                        <el-date-picker v-else v-model="dataOptions.time" type="monthrange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="float: right">
                        <el-button type="primary" @click="searchData('ruleForm')">查询</el-button>
                        <el-button @click="exportData('ruleForm')">导出</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div>
                <!-- 渠道对比分析 -->
                <channelContrastAnalysis :searchParms="getParams()" :channelList="channelList" ref="channelContrastAnalysis" v-show="powerList.getChannelCompare && dataOptions.channel === '-1'"/>
                <!-- 订单金额分析模块 -->
                <orderAmountAnalysis :searchParms="getParams()" ref="orderAmountAnalysis" v-if="powerList.getOrderAmountDetail"></orderAmountAnalysis>
                <!-- 订单量分析模块 -->
                <orderQuantityAnalysis :searchParms="getParams()" ref="orderQuantityAnalysis" v-if="powerList.getOrderCountDetail"></orderQuantityAnalysis>
                <!-- 取消订单分析 -->
                <cancelOrderAnalysis :searchParms="getParams()" ref="cancelOrderAnalysis" v-if="powerList.getOrderCancelDetail"></cancelOrderAnalysis>
                <!-- 平均接单等待时常分布 -->
                <waitingDistributed :searchParms="getParams()" ref="waitingDistributed" v-if="powerList.getDriveDurationDetail"></waitingDistributed>
                <!-- 订单漏斗分析 -->
                <orderFunnelAnalysis :searchParms="getParams()" ref="orderFunnelAnalysis" v-if="powerList.getOrderFunnel"/>
                <!-- 订单排行 -->
                <orderRanking :searchParms="getParams()" ref="orderRanking" v-if="selectType=='SHENG' && powerList.getOrderRankingDetail"></orderRanking>
                <!-- 表格 -->
                <p class="clearfixTitle">订单明细数据</p>
                <ws-table-el ref="table" style="margin-top: 16px; padding: 0px !important;" v-bind="tableConfig" @currentChange="currentChange" align="left">
                    <ws-table-column-el align="center" prop="orderCreateDate" label="日期">
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="provinceName" label="省区"></ws-table-column-el>
                    <ws-table-column-el align="center" prop="cityName" label="城市">
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="orderCreateCount" label="下单总量">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.orderCreateCount)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="orderCreatePassengerAvg" label="乘客人均发单数">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.orderCreatePassengerAvg)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="orderAcceptCount" label="接单总量">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.orderAcceptCount)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="orderAcceptCount" label="接单率">
                        <template slot-scope="scope">
                            {{scope.row.orderAcceptRatio + '%'}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="orderAcceptDriverCount" label="接单司机数">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.orderAcceptDriverCount)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="orderAcceptDriverAvg" label="司机人均接单数">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.orderAcceptDriverAvg)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="orderSuccessCount" label="完成行程订单总量">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.orderSuccessCount)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="orderSuccessRatio" label="完单率">
                        <template slot-scope="scope">
                            {{scope.row.orderSuccessRatio + '%'}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="orderSuccessDriverCount" label="完单司机数">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.orderSuccessDriverCount)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="orderSuccessAmount" label="完成行程订单金额">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.orderSuccessAmount)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="orderSuccessDriverRatio" label="司机人均完单数">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.orderSuccessDriverRatio)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="orderPaidCount" label="支付订单数">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.orderPaidCount)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="orderPaidAmountAvg" label="客单价">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.orderPaidAmountAvg)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="orderPaidAmount" label="已付款订单金额">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.orderPaidAmount)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="orderUnpaidAmount" label="待付款订单金额">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.orderUnpaidAmount)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="orderCancelCount" label="取消订单总量">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.orderCancelCount)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="beforePassengerCancelCount" label="接单前乘客取消订单">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.beforePassengerCancelCount)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="beforeSystemCancelCount" label="接单前系统取消订单">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.beforeSystemCancelCount)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="beforeOpenPlatformCancelCount" label="接单前三方取消订单">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.beforeOpenPlatformCancelCount)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="beforeBackgroundCancelCount" label="接单前后台取消订单">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.beforeBackgroundCancelCount)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="afterPassengerCancelCount" label="接单后乘客取消订单">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.afterPassengerCancelCount)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="afterSystemCancelCount" label="接单后系统取消订单">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.afterSystemCancelCount)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="afterOpenPlatformCancelCount"  label="接单后三方取消订单"> 
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.afterOpenPlatformCancelCount)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="afterDriverCancelCount" label="接单后司机取消订单">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.afterDriverCancelCount)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="afterBackgroundCancelCount" label="接单后后台取消订单">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.afterBackgroundCancelCount)}}
                        </template>
                    </ws-table-column-el>
                    <!-- <ws-table-column-el align="center" prop="orderSuccessAmount" label="完成行程订单金额">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.orderSuccessAmount)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="orderPaidAmount" label="已付款订单金额">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.orderPaidAmount)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="orderUnpaidAmount" label="待付款订单金额">
                        <template slot-scope="scope">
                            {{thousandSeparator(scope.row.orderUnpaidAmount)}}
                        </template>
                    </ws-table-column-el> -->
                </ws-table-el>
            </div>
        </div>
    </div>
</template>

<script>
import OrderAmountAnalysis from './components/orderAmountAnalysis';
import orderFunnelAnalysis from './components/orderFunnelAnalysis'
import OrderQuantityAnalysis from './components/orderQuantityAnalysis';
import CancelOrderAnalysis from './components/cancelOrderAnalysis';
import WaitingDistributed from './components/waitingDistributed';
import OrderRanking from './components/orderRanking';
import channelContrastAnalysis from './components/channelContrastAnalysis'
export default {
    components: {
        OrderAmountAnalysis,
        OrderQuantityAnalysis,
        CancelOrderAnalysis,
        WaitingDistributed,
        OrderRanking,
        channelContrastAnalysis,
        orderFunnelAnalysis,
    },
    data() {
        return {
            moduleName: '/dataServer/tencentTravelOrderAnalysis',
            cityList: [], // 保存, 只请求一次城市权限的数据
            firstCity: [],
            dataOptions: {
                city: [0],
                time: [],
                channel: "-1",
                queryDateType: 'DAY'
            },
            selectType: 'SHENG',
            searchParms: null,
            cityData: [],
            dataCardList: [],
            tableConfig: {
                loading: true,
                autoHeight: false,
                lazyQuery: {
                    moduleName: '/dataServer/tencentTravelOrderAnalysis',
                    op: {
                        selectList: 'getOrderDetailDetail',
                    },
                    beforeQuery: this.beforeQuery,
                    immediate: true,
                },
                pageSizeList: [5, 10, 20],
                filterColumns: false,
            },
            pickerOptions: {
                disabledDate(time) {
                    let curDate = Date.now();
                    let one = 30 * 86400000;
                    let oneMonth = curDate - one;
                    let current = new Date(new Date().toLocaleDateString()).getTime() + (86400000 - 1000);
                    // 按月查从1号开始查起
                    let fistTime = new Date('2022-06-24 00:00:00').getTime();
                    console.log(time.getTime() > current || time.getTime() < fistTime,'llkkk');
                    return time.getTime() > current || time.getTime() < fistTime;
                },
            },
            currentPage: 1,
            pageSize: 20,
            plateformList: [
            ],
            channelList:[], //渠道不加全部
            dataType:1
        };
    },
    mounted() {
        this.getChannel()
        this.getInit();
    },
    created() {
        this.getCityList();
        this.dataOptions.time = [this.$baseMethod.getBeforeDay(-30, 'yyyy-MM-dd'), this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd')];
    },
    methods: {
        async getChannel() {
            try {
                let data = {
                    op:'channelList',
                    data: JSON.stringify({
                        pageSize: 500,
                        body:{
                            isDraw: 1
                        }
                    })
                }
                let URL = '/openPlatform/channel/select'
                const res = await this.$axios(URL,data)
                this.plateformList = JSON.parse(res.data).body
                this.channelList = this.plateformList
                this.plateformList = [{name:'全部',channelId: '-1'},...this.plateformList]
            } catch (error) {
                
            }
        },
        // 查询
        searchData() {
            if (!this.dataOptions.time || this.dataOptions.time.length <= 0) {
                this.$message.error('请选择日期！');
                return false;
            }
            if (this.dataOptions.city && this.dataOptions.city.length === 0) {
                this.$message.error('请选择城市！');
                return false;
            }
            this.getInit();
            // 单独查询 依赖getChannel接口mounted里不执行了
            this.$refs.channelContrastAnalysis && this.$refs.channelContrastAnalysis.getInitData();
        },
        // 调用所有接口数据
        getInit() {
            this.getParams();
            this.$refs.table.search();
            this.$refs.orderFunnelAnalysis && this.$refs.orderFunnelAnalysis.getInitData();
            this.$refs.orderAmountAnalysis && this.$refs.orderAmountAnalysis.initOrderAmountDetail();
            this.$refs.orderQuantityAnalysis && this.$refs.orderQuantityAnalysis.initOrderCountDetail();
            this.$refs.cancelOrderAnalysis && this.$refs.cancelOrderAnalysis.initOrderCancelDetail();
            this.$refs.waitingDistributed && this.$refs.waitingDistributed.initDriveDurationDetail();
            if (this.selectType == 'SHENG') {
                this.$refs.orderRanking && this.$refs.orderRanking.initOrderRankingDetail();
            }
        },
        // 组装参数
        getParams() {
            let param = {
                channel: this.dataOptions.channel,
                areaType: 'ALL',
                areaCodeList: [],
                queryDateBean:{}
            };
            if(this.dataOptions.city[0] === 0) {
                param.areaType = 'ALL'
                param.areaCodeList = [2]
            } else {
                if(this.dataOptions.city.length > 1) {
                    param.areaType = 'SHI'
                    //选了市 不用再传省的code
                    param.areaCodeList = [this.dataOptions.city[1]]
                } else {
                    param.areaType = "SHENG"
                    param.areaCodeList = this.dataOptions.city
                }
                
            }
            // 选取省后再处理一次
            if(param.areaType === "SHENG") {
                let cityObj = this.cityData.find(item => item.code === this.dataOptions.city[0]);
                let cityChildren = cityObj.children.map(item => item.code)
                param.areaCodeList = cityChildren
                param.areaType = 'SHI'
            }
            
            if (this.dataOptions.time && this.dataOptions.time.length) {
                let [startDate, endDate] = this.dataOptions.time;
                param.queryDateBean.startDate = startDate.substring(0, 10);
                param.queryDateBean.endDate = endDate.substring(0, 10);
                param.queryDateBean.queryDateType = this.dataOptions.queryDateType
            }
            this.searchParms = param;
            return param;
        },
        // 根据城市编码识别出城市type, 获取最后一个值
        // getLocalType(code) {
        //     let areaList = [];
        //     let areaListData = {
        //         areaCode: '',
        //         areaType: '',
        //     };
        //     const len = code.length;
        //     areaListData.areaCode = code[len - 1];
        //     switch (len) {
        //         case 1:
        //             areaListData.areaType = code[0] === 0 ? 'QG' : 'SHENG';
        //             areaListData.areaCode = code[0] === 0 ? 2 : areaListData.areaCode;
        //             this.selectType = 'SHENG';
        //             break;
        //         case 2:
        //             areaListData.areaType = 'SHI';
        //             this.selectType = 'SHI';
        //             break;
        //         case 3:
        //             areaListData.areaType = 'XIAN';
        //             break;
        //         default:
        //             areaListData.areaType = 'QG';
        //             areaListData.areaCode = 2;
        //             this.selectType = 'SHENG';
        //     }
        //     areaList.push(areaListData);
        //     return areaList;
        //     // 以下是多选时候的情况（勿删）
        //     // let codeList = code
        //     // let areaList = []
        //     // codeList.forEach(element => {
        //     //     let areaListData = {
        //     //         areaCode: '',
        //     //         areaType: ""
        //     //     };
        //     //     const len = element.length;
        //     //     areaListData.areaCode = element[len - 1];
        //     //     switch (len) {
        //     //         case 1:
        //     //             areaListData.areaType = element[0] === 0 ? "QG" : "SHENG";
        //     //             areaListData.areaCode = element[0] === 0 ? 2 : areaListData.areaCode;
        //     //             break;
        //     //         case 2:
        //     //             areaListData.areaType = "SHI";
        //     //             break;
        //     //         case 3:
        //     //             areaListData.areaType = "XIAN";
        //     //             break;
        //     //         default:
        //     //             areaListData.areaType = "QG";
        //     //             areaListData.areaCode = 2
        //     //     }
        //     //     areaList.push(areaListData)
        //     // });
        // },
        handleChange(val) {
            this.dataOptions.time = []
        },
        handleChangeCity(cityList) {},
        handleTimeGroupChange() {},
        // 时间选择器改变
        handleTimeChange(data) {
            if (data) {
                if (new Date(data[1]) - new Date(data[0]) > 30 * 86400000) {
                    this.$message.error('日期最多选择30天！');
                    this.dataOptions.time = [];
                    return;
                }
            }
        },
        beforeQuery() {
            return this.getParams();
        },
        currentChange(data) {
            this.currentPage = data.currentPage;
            this.pageSize = data.pageSize;
        },
        // 导出
        exportData() {
            let body = this.getParams();
            const reqData = {
                data: {
                    pageSize: this.pageSize,
                    currentPage: this.currentPage,
                    body,
                },
                op: 'detailExport',
            };
            let URL = this.$getModuleUrl(this.moduleName, reqData.op);
            this.$axios(URL, reqData).then(res => {
                this.$message.success('文件正在导出，请到文件下载界面进行下载');
            });
        },
        // 查询有权限的城市
        getCityList() {
            if (!this.powerList.personAreaList) {
                return false;
            }
            const op = 'personAreaList';
            let data = {
                op,
            };
            let URL = this.$getModuleUrl(this.moduleName, op);
            this.$axios(URL, data).then(res => {
                if (res.code == 1) {
                    const ret = JSON.parse(res.data);
                    let parentInfo = [
                        {
                            name: '全部',
                            code: 0,
                        },
                    ];
                    this.cityData = [...parentInfo, ...ret.areaTree];
                }
            });
        },
        // 添加千位符
        thousandSeparator(num) {
            num = num || 0
            var res = num.toString().replace(/\d+/, function(n) {
                // 先提取整数部分
                return n.replace(/(\d)(?=(\d{3})+$)/g, function($1) {
                    return $1 + ',';
                });
            });
            return res;
        }
    },
};
</script>
<style lang="scss" scoped>
.tx-box {
    .content-tx-box {
        padding: 14px 40px;
        background: #fff;
        border-radius: 8px;
    }
}
.clearfixTitle {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
    margin: 32px 0 16px 0;
}
.activity-title {
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
    line-height: 22px;
}
/deep/.el-date-editor {
    width: 350px !important;
}
</style>