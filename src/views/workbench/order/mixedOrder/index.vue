<template>
    <div class="mixedOrderList">
        <ws-table-el ref="table" v-bind="tableConfig" :col="8">
            <template #search>
                <search-group>
                    <label for>订单号：</label>
                    <el-input v-model.trim="searchOptions.orderId" placeholder="请输入订单号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>车主ID：</label>
                    <el-input v-model.trim="searchOptions.driverId" placeholder="请输入车主ID" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>商户订单号：</label>
                    <el-input v-model.trim="searchOptions.outTradeNo" placeholder="请输入商户订单号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>交易订单号：</label>
                    <el-input v-model.trim="searchOptions.tradeNo" placeholder="请输入交易订单号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>乘客账号：</label>
                    <el-input v-model.trim="searchOptions.passengerPhone" placeholder="请输入乘客账号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>下单时间：</label>
                    <ws-date-range :startTime.sync="searchOptions.createStartTime" :endTime.sync="searchOptions.createEndTime" :intervalTime="6"></ws-date-range>
                </search-group>
                <search-group>
                    <label for>车主账号：</label>
                    <el-input v-model.trim="searchOptions.driverPhone" placeholder="请输入车主账号" clearable></el-input>
                </search-group>
                <!-- 后台无法查询 先屏蔽 -->
                <!-- <search-group>
                    <label for>支付时间：</label>
                    <ws-date :modelStartTime.sync="searchOptions.payStartTime" :modelEndTime.sync="searchOptions.payEndTime"></ws-date>
                </search-group> -->
                <!-- <search-group>
                    <label>所属运力商：</label>
                    <el-select v-model.trim="searchOptions.rideChannelId" placeholder="请选择运力商" clearable>
                        <el-option v-for="item in transportList" :key="item.rideChannelId" :label="item.rideChannelName" :value="item.rideChannelId"></el-option>
                    </el-select>
                </search-group> -->
                <!-- <search-group style="margin-left: 50px">
                    <el-button-group v-if="oaPowerList.selectAndPage">
                        <ws-enter-event>
                            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                        </ws-enter-event>
						<ws-throttle>
                            <el-button type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
                        </ws-throttle>
                    </el-button-group>
					<ws-throttle>
                        <el-button style="margin-left: 20px;" v-if="oaPowerList.export"   @click="fileExport" plain>导出</el-button>
                    </ws-throttle>
                </search-group> -->
            </template>

            <template #options>
                <el-button-group v-if="getModulePower('/workbench/mixedOrder').selectAndPage" style="float: right">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()" :disabled='btnDisabled'>搜索</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left" :disabled='btnDisabled'></el-button>
                    </ws-throttle>
                    <!-- <ws-throttle>
                        <el-button style="margin-left: 20px" v-if="getModulePower('/workbench/mixedOrder').export" @click="fileExport" plain>导出</el-button>
                    </ws-throttle> -->
                </el-button-group>
            </template>

            <template>
                <ws-table-column-el align="center" prop="orderId" label="订单号" width="170">
                    <template slot-scope="scope">
                        {{ scope.row.orderId }}
                        <span style="color: red" v-if="scope.row.checkStatus != 1 && scope.row.checkStatus != 0">【异常单】</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="rideChannelName" label="所属运力商">
                    <template slot-scope="scope">
                        {{ scope.row.rideChannelName || '-' }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="requestRideType" label="订单服务类型">
                    <template slot-scope="scope">
                        {{ scope.row.requestRideType || '快车' }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="orderType" label="订单风险">
                    <template slot-scope="scope">
                        {{ scope.row.orderType | ordinaryTypesFilters }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="statusName" label="订单状态"></ws-table-column-el>
                <ws-table-column-el align="center" prop="businessType" label="业务类型"></ws-table-column-el>
                <ws-table-column-el align="center" prop="createTime" label="下单时间" width="170"></ws-table-column-el>
                <ws-table-column-el align="center" prop="passengerPhone" label="乘客账号"></ws-table-column-el>
                <ws-table-column-el align="center" prop="purchaseSeatNum" label="购买座位数">
                    <template slot-scope="scope">
                        {{ scope.row.purchaseSeatNum | regFenToYuan }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="seatMoney" label="行程单价/人(元)">
                    <template slot-scope="scope">
                        {{ scope.row.seatMoney | regFenToYuan }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="orderMoney" label="实际订单总额">
                    <template slot-scope="scope">
                        {{ scope.row.orderMoney | regFenToYuan }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="discountMoney" label="乘客优惠金额">
                    <template slot-scope="scope">
                        {{ scope.row.discountMoney | regFenToYuan }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="realPayMoney" label="实付总额">
                    <template slot-scope="scope">
                        {{ scope.row.realPayMoney | regFenToYuan }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="driverPhone" label="车主账号">
                    <template slot-scope="scope">
                        {{ scope.row.driverPhone || '-' }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="driverName" label="车主姓名">
                    <template slot-scope="scope">
                        {{ scope.row.driverName || '-' }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="carNum" label="车牌号">
                    <template slot-scope="scope">
                        {{ scope.row.carNum || '-' }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="driverId" label="车主ID">
                    <template slot-scope="scope">
                        {{ scope.row.driverId || '-' }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="startCity" label="订单起点城市"></ws-table-column-el>
                <ws-table-column-el align="center" prop="startAddr" label="起点" width="200"></ws-table-column-el>
                <ws-table-column-el align="center" prop="endAddr" label="终点" width="200"></ws-table-column-el>
                <ws-table-column-el align="center" prop="payTime" label="支付时间">
                    <template slot-scope="scope">
                        {{ scope.row.payTime || '-' }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="orderPrice" label="订单金额(元)">
                    <template slot-scope="scope">
                        {{ scope.row.orderPrice | regFenToYuan }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="discountPrice" label="优惠金额(元)">
                    <template slot-scope="scope">
                        {{ scope.row.discountPrice | regFenToYuan }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="realPayPrice" label="实付金额(元)">
                    <template slot-scope="scope">
                        {{ scope.row.realPayPrice | regFenToYuan }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="agencyName" label="订单所属机构" width="200">
                    <template slot-scope="scope">
                        {{ scope.row.agencyName || '-' }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="channelType" label="渠道类型">
                    <template slot-scope="scope">
                        {{ scope.row.channelType | channelTypesFilters }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="orderLabel" label="订单标签">
                    <template slot-scope="scope">
                        {{ scope.row.orderLabel | orderLaberFilters }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" label="操作" fixed="right" width="150px">
                    <template slot-scope="scope">
                        <el-button type="text" @click="goDetailByType(scope.row)" style="color: #0088ff">详情</el-button>
                        <!-- 等待应答转派取消 -->
                        <span v-if="scope.row.statusName === '等待应答'" style="margin-left:10px">
                            <el-button v-if="powerList.cancelOrder" type="text" @click="handelCancel(scope.row)" style="color: #F05259">取消</el-button>
                            <el-button
                                v-if="powerList.changeOrder && scope.row.bindDriver !== null"
                                type="text"
                                @click="handelRedesign(scope.row)"
                                style="color: #F05259">
                                改派
                            </el-button>
                        </span>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'mixedOrder',
    data() {
        return {
            moduleName: '/workbench/mixedOrder',
            searchOptions: {
                orderId: '',
                outTradeNo: '',
                tradeNo: '',
                passengerPhone: '',
                driverPhone: '',
                createStartTime: this.$baseMethod.formatData(this.$baseMethod.getBeforeDay(-6), 'yyyy-MM-dd') + ' 00:00:00',
                createEndTime: this.$baseMethod.formatData(this.$baseMethod.getBeforeDay(0), 'yyyy-MM-dd') + ' 23:59:59',
                rideChannelId: '',
                driverId: '' // 车主ID
                // payStartTime: '',
                // payEndTime: '',
            },
            tableConfig: {
                loading: true,
                filterColumns: false,
                pageId: 'orderId',
                lazyQuery: {
                    immediate: false,
                    moduleName: '/workbench/mixedOrder',
                    op: {
                        selectList: 'selectAndPage'
                        // selectCount: 'selectCount'
                    },
                    beforeQuery: this.beforeQuery,
                    afterQuery: this.afterQuery
                },
                topFixedRange: 55,
                hideColumnList: [
                    '车主姓名',
                    '车牌号',
                    '订单起点城市',
                    '支付时间',
                    '订单金额',
                    '优惠金额(元)',
                    '订单金额(元)',
                    '实付金额(元)',
                    '订单所属机构',
                    '渠道类型',
                    '渠道名称',
                    '渠道ID',
                    '购买座位数',
                    '行程单价/人(元)',
                    '实际订单总额',
                    '乘客优惠金额',
                    '实付总额'
                ]
            },
            startSource: '',
            endSource: '',
            firstTime: '',
            lastTime: '',
            transportList: [],
            firstTimeOrderIds: null,
            lastTimeOrderIds: null,
            yunliProps: {
                expandTrigger: 'click',
                value: 'yunliNumber',
                label: 'yunliName',
                emitPath: false,
                lazy: true,
                checkStrictly: true,
                lazyLoad: this.lazyLoad2
            },
            btnDisabled:false
        };
    },

    computed: {
        ...mapGetters('order', ['channelTypesFilters', 'ordinaryTypesFilters', 'orderLaberFilters'])
    },

    created() {
        let {orgType} = this.$baseMethod.getStore('roleOption')
        if(orgType === 0){
            this.btnDisabled = true
        }
        this.getTransportList();
    },
    activated() {
        this.search()
    },

    methods: {
        ...mapActions('order', ['getAllTransportList']),

        /**
         * @description: 获取所属运力商
         * @param {*} node
         * @param {*} resolve
         * @return {*}
         */
        getTransportList() {
            this.getAllTransportList().then(res => {
                this.transportList = JSON.parse(res);
            });
        },

        beforeQuery() {
            // let flag = false;

            this.searchOptions.startSource = this.startSource;
            this.searchOptions.endSource = this.endSource;
            this.searchOptions.firstTime = this.firstTime;
            this.searchOptions.lastTime = this.lastTime;
            this.searchOptions.firstTimeOrderIds = this.firstTimeOrderIds;
            this.searchOptions.lastTimeOrderIds = this.lastTimeOrderIds;

            let param = { ...this.searchOptions };
            for (const key in this.searchOptions) {
                if (this.searchOptions[key]) {
                    // flag = true;
                    break;
                }
            }
            // if (!flag) {
            // 	this.$message.error('请输入查询条件');
            // }
            // return flag && param;
            return param;
        },

        afterQuery(data) {
            let list = data.body;
            this.startSource = list && list.length ? list[0].startSource : null;
            this.endSource = list && list.length ? list[list.length - 1].endSource : null;
            this.firstTime = list && list.length ? list[0].createTime : null;
            this.lastTime = list && list.length ? list[list.length - 1].createTime : null;

            let firstIds = list && list.length && list.filter(item => item.createTime == this.firstTime);
            this.firstTimeOrderIds = firstIds && firstIds.map(item => item.orderId);
            let lastIds = list && list.length && list.filter(item => item.createTime == this.lastTime);
            this.lastTimeOrderIds = lastIds && lastIds.map(item => item.orderId);
            return data;
        },
        search() {
            let reg = /^[0-9]*$/;
            if (!reg.test(this.searchOptions.driverId)) {
                this.$message.error('请输入正确的车主ID');
                return;
            }
            this.startSource = '';
            this.endSource = '';
            this.firstTime = '';
            this.lastTime = '';
            this.firstTimeOrderIds = null;
            this.lastTimeOrderIds = null;
            // this.$refs.table.store.currentPage = 1
            let flag = this.beforeQuery();
            if (flag) {
                this.$nextTick(this.$refs.table.search);
            }
        },

        reset() {
            (this.searchOptions = {
                orderId: '',
                outTradeNo: '',
                tradeNo: '',
                passengerPhone: '',
                driverPhone: '',
                createStartTime: this.$baseMethod.formatData(this.$baseMethod.getBeforeDay(-6), 'yyyy-MM-dd') + ' 00:00:00',
                createEndTime: this.$baseMethod.formatData(this.$baseMethod.getBeforeDay(0), 'yyyy-MM-dd') + ' 23:59:59',
                driverId: ''
            }),
                (this.startSource = null);
            this.endSource = null;
            this.firstTime = null;
            this.lastTime = null;
            this.firstTimeOrderIds = null;
            this.lastTimeOrderIds = null;
            this.$refs.table.tableData = [];
            let flag = this.beforeQuery();
            if (flag) {
                this.$refs.table.reset();
            }
        },

        goDetailByType(dataRow) {
            const pageNameObj = {
                // 实时
                20: 'realTimeForm',
                // 预约
                21: 'subscribeForm',
                // 扫码
                22: 'scanCodeForm',
                // 拼车
                40: 'orderFreeRideForm',
                // 包车
                70: 'charterForm'
            };
            this.$router.refresh({ name: pageNameObj[dataRow.businessCode], query: { orderId: dataRow.orderId } });
        },
        // 取消订单
        handelCancel(row) {
            // console.log(row)
            const { orderId, businessType } = row
            this.$msgbox({
                title: '提示',
                message: `${businessType}订单：${orderId}<br/>确定取消？取消后需重新下单！`,
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let param = {
                    data: { orderId },
                    op: 'cancelOrder'
                };
                const url = this.$getModuleUrl(this.moduleName, param.op);
                this.$axios(url, param).then(res => {
                    let data = JSON.parse(res.data);
                    if (data.anwserCode.code == 1) {
                        this.search();
                    this.$message.success('行程订单取消成功');
                    } else {
                        this.$message.error(data.anwserCode.message);
                        return;
                    }
                });
            }).catch(() => {});
        },
        // 改派
        handelRedesign(row) {
            const { orderId, dispatchRideType, businessCode, bindDriver, agencyNumber } = row
            this.$router.refresh({
                name: 'placeOrderDrivers',
                query: { type: 1, orderId, bindDriver, rideServiceType: dispatchRideType, orderType: businessCode, agencyNumber, moduleName: this.moduleName }
            });
        }
    },
    mounted() {
        let driverAccount = this.$route.query.driverAccount || this.$route.query.driverPhone || '';
        let { currentOrderId } = this.$route.query; //车辆分布图默认订单号查询
        if (driverAccount || currentOrderId) {
            this.searchOptions.driverPhone = driverAccount;
            this.searchOptions.orderId = currentOrderId;
            this.search();
        }
    }
};
</script>

<style lang="scss" scoped>
/deep/ .el-pagination span.el-pagination__jump {
    display: none;
}
.ws-table-warp{
    padding: 0px !important;
}
</style>
