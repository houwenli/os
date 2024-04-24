<template>
    <div class="settle-payCompang-list">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>包车订单</el-breadcrumb-item>
        </el-breadcrumb>
        <ws-table-el ref="table" v-bind="tableConfig" :total="10" :data="tableList">
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
                    <label for>车主账号：</label>
                    <el-input v-model.trim="searchOptions.driverPhone" placeholder="请输入车主账号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>订单服务类型：</label>
                    <el-select v-model="searchOptions.requestRideType" filterable clearable placeholder="请选择">
                        <el-option v-for="item in businessTypes" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label class="seach-label" for>订单所属机构：</label>
                    <ws-organization style="display: inline-block" v-model="searchOptions.agencyNumber" valueKey="agencyNumber"></ws-organization>
                </search-group>
                <search-group>
                    <label for>订单状态：</label>
                    <el-select v-model="searchOptions.status" filterable clearable placeholder="请选择">
                        <el-option v-for="item in instantOrder21" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <!-- <search-group>
                    <label for>订单风险：</label>
                    <el-select v-model="searchOptions.orderType" filterable clearable placeholder="请选择">
                        <el-option v-for="item in ordinaryTypesFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group> -->
                <search-group>
                    <label for>渠道ID：</label>
                    <el-input v-model.trim="searchOptions.channelId" placeholder="请输入渠道ID" clearable></el-input>
                </search-group>

                <search-group>
                    <label for>所属运力商：</label>
                    <el-select v-model="searchOptions.rideChannelId" clearable filterable placeholder="请选择">
                        <el-option
                            v-for="item in rideChannelListFilters"
                            :key="item.rideChannelId"
                            :label="item.rideChannelName"
                            :value="item.rideChannelId"
                        ></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>订单标签：</label>
                    <el-select v-model="searchOptions.orderChannel" clearable placeholder="--请选择--">
                        <el-option v-for="item in charterorderFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>下单时间：</label>
                    <ws-date-range
                        :startTime.sync="searchOptions.createStartTime"
                        :endTime.sync="searchOptions.createEndTime"
                        :intervalTime="180"
                    ></ws-date-range>
                </search-group>
                <search-group style="display:flex;justify-content: flex-end;">
                    <el-button-group v-if="powerList.selectAndPage">
                        <ws-enter-event>
                            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                        </ws-enter-event>
                        <ws-throttle>
                            <el-button type="primary" class="resetBtn" @click="reset" icon="el-icon-refresh-left"></el-button>
                        </ws-throttle>
                    </el-button-group>
                    <ws-throttle>
                        <el-button style="margin-left: 20px" v-if="powerList.export" @click="fileExport" plain>导出</el-button>
                    </ws-throttle>
                </search-group>
            </template>
            <template>
                <ws-table-column-el align="center" prop="orderId" label="订单号" width="170"></ws-table-column-el>
                <ws-table-column-el align="center" prop="rideChannelName" label="所属运力商">
                    <template slot-scope="scope">
                        {{ scope.row.rideChannelName || '-' }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="requestRideType" label="订单服务类型"></ws-table-column-el>
                <ws-table-column-el align="center" prop="orderType" label="订单风险">
                    <template slot-scope="scope">
                        {{ scope.row.orderType | ordinaryTypesFilters }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="createTime" label="下单时间" width="170"></ws-table-column-el>
                <ws-table-column-el align="center" prop="passengerPhone" label="乘客账号"></ws-table-column-el>
                <ws-table-column-el align="center" prop="driverPhone" label="车主账号"></ws-table-column-el>
                <ws-table-column-el align="center" prop="driverName" label="车主姓名"></ws-table-column-el>
                <ws-table-column-el align="center" prop="carNum" label="车牌号"></ws-table-column-el>
                <ws-table-column-el align="center" prop="driverId" label="车主ID">
                    <template slot-scope="scope">
                        {{ scope.row.driverId || '-' }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="cityName" label="订单起点城市"></ws-table-column-el>
                <ws-table-column-el align="center" prop="startAddr" label="起点" width="200"></ws-table-column-el>
                <ws-table-column-el align="center" prop="endAddr" label="终点" width="200">
                    <template slot-scope="scope">
                        {{ scope.row.endAddr || '-' }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="statusName" label="订单状态"></ws-table-column-el>
                <ws-table-column-el align="center" prop="payTime" label="支付时间"></ws-table-column-el>
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
                <ws-table-column-el align="center" prop="orgName" label="订单所属机构" width="200">
                    <template slot-scope="scope">
                        {{ scope.row.orgName || '-' }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="channelType" label="渠道类型">
                    <template slot-scope="scope">
                        {{ scope.row.channelType | channelTypesFilters }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            v-if="powerList.selectDetail || powerList.selectCharteredOrderCost || powerList.selectMapInfo || powerList.selectLogDetails"
                            @click="enterForm('detail', scope.row)"
                            style="color: #0088ff"
                        >
                            详情
                        </el-button>
                        <el-button
                            type="text"
                            v-if="scope.row.bindDriverId && scope.row.orderStatus == 0"
                            @click="enterForm('update', scope.row)"
                            style="color:#0088ff;"
                        >
                            改派
                        </el-button>

                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
const SQLMAXINT = 2147483648; // SQL Int(11) 最大值 超出报错
export default {
    data() {
        return {
            searchOptions: {
                orderId: '',
                outTradeNo: '',
                tradeNo: '',
                passengerPhone: '',
                driverPhone: '',
                requestRideType: '',
                agencyNumber: '',
                status: '',
                orderType: '',
                channelId: '',
                channelType: '',
                createStartTime: this.$baseMethod.getBeforeDay(-1,'yyyy-MM-dd 00:00:00'),
                createEndTime:this.$baseMethod.getBeforeDay(0,'yyyy-MM-dd 23:59:59'),
                rideChannelId: '',
                orderChannel: '',
                driverId: '' // 车主ID
            },
            rideChannelListFilters: [],
            isDialog: false,
            orderId: '',
            startSource: '',
            endSource: '',
            firstTime: '',
            lastTime: '',
            tableList: [],
            transportList: [],
            tableConfig: {
                pageId: 'orderId',
                lazyQuery: {
                    immediate: true,
                    moduleName: '/order/charter',
                    op: {
                        selectList: 'selectAndPage',
                        selectCount: 'selectCount'
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
                    '渠道ID'
                ]
            },
            moduleName: '/order/charter',
            op: {
                fileExport: 'export',
                cancelOrder: 'cancelOrder'
            },
            // dialogFormVisible: false,
            // cancelReasonRemark: '',
            id: null,
            isfirstFlag:true
        };
    },
    computed: {
        ...mapGetters('order', [
            'ordinaryTypesFilters',
            'ordinaryPayMethodFilters',
            'channelTypesFilters',
            'businessTypes',
            'instantOrder21',
            'orderTagFilters',
            'charterorderFilters'
        ])
    },
    mounted() {
        this.getCapacityInfo().then(res => {
            this.rideChannelListFilters = res;
        });
    },
    methods: {
        ...mapActions(['getOrgOptionList']),
        ...mapActions('order', ['getCapacityInfo']),
        lazyLoad(node, resolve) {
            let item = node.data;
            this.getOrgOptionList(item || {}).then(item => {
                resolve(item);
            });
        },
        // deleteform(row) {
        //     this.dialogFormVisible = true;
        //     this.id = row.orderId;
        //     this.cancelReasonRemark = '';
        // },
        // fail() {
        //     if (!this.cancelReasonRemark) {
        //         this.$message.error('请输入原因');
        //         return false;
        //     }
        //     let param = {
        //         data: {
        //             orderId: this.id,
        //             cancelReason: 6,
        //             cancelReasonRemark: this.cancelReasonRemark,
        //             orderType: 70
        //         },
        //         op: this.op.cancelOrder
        //     };
        //     this.$axios(this.powerList.cancelOrder, param).then(res => {
        //         let data = JSON.parse(res.data);
        //         if (data.anwserCode.code == 1) {
        //             this.dialogFormVisible = false;
        //             this.$message.success('取消成功!');
        //             this.$refs.table.search();
        //         } else {
        //             this.$message.error(data.anwserCode.message);
        //             return;
        //         }
        //     });
        // },
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
            this.tableList = [];
            if (!this.checkData()) return;
            this.$refs.table.search();
        },
        checkData() {
            if (
                !this.searchOptions.orderId &&
                !this.searchOptions.outTradeNo &&
                !this.searchOptions.tradeNo &&
                !this.searchOptions.passengerPhone &&
                !this.searchOptions.driverPhone &&
                !this.searchOptions.createStartTime &&
                (!this.searchOptions.payStartTime || !this.searchOptions.payEndTime)
            ) {
                this.$message.warning('请输入订单号、乘客信息、下单时间或车主信息进行查询');
                return false;
            }
            if (this.searchOptions.channelId) {
                if (!(/^(0|[1-9]\d{0,9})$/.test(this.searchOptions.channelId) && this.searchOptions.channelId < SQLMAXINT)) {
                    this.$message.warning('渠道ID不正确');
                    this.tableList = [];
                    return false;
                }
            }
            return true;
        },
        reset() {
            this.searchOptions = {
                orderId: '',
                outTradeNo: '',
                tradeNo: '',
                passengerPhone: '',
                driverPhone: '',
                requestRideType: '',
                agencyNumber: '',
                status: '',
                orderType: '',
                channelId: '',
                channelType: '',
                driverId: '',
                createStartTime: this.$baseMethod.getBeforeDay(-1,'yyyy-MM-dd 00:00:00'),
                createEndTime: this.$baseMethod.getBeforeDay(0,'yyyy-MM-dd 23:59:59'),
                orderChannel: null
            };
            this.search();
        },
        enterForm(type, row) {
            if (type == 'detail') {
                let query = {
                    orderId: row.orderId
                };
                this.$router.refresh({ name: 'charterForm', query });
            } else if (type == 'update') {
                let query = {
                    orderId: row.orderId,
                    type: 1,
                    bindDriver: row.bindDriverId,
                    rideServiceType: row.dispatchRideType,
                    agencyNumber: row.agencyNumber,
                    orderType: 70,
                    reassignment:1
                };
                this.$router.refresh({ name: 'placeOrderDrivers', query });
            }
        },
        fileExport() {
            let param = {
                data: this.searchOptions,
                op: this.op.fileExport
            };
            this.$axios(this.powerList[param.op], param).then(res => {
                this.$message.success('导出中，请稍后到文件中心下载！');
            });
        },

        beforeQuery() {
            this.searchOptions.startSource = this.startSource;
            this.searchOptions.endSource = this.endSource;
            this.searchOptions.firstTime = this.firstTime;
            this.searchOptions.lastTime = this.lastTime;
            let routerQurey = this.$route.params;
            if (routerQurey.type && routerQurey.type == 1 && this.isfirstFlag) {
                this.isfirstFlag = false
                this.searchOptions.createStartTime = `${this.$baseMethod.formatData(new Date(), 'yyyy-MM-dd')} 00:00:00`;
                this.searchOptions.createEndTime = `${this.$baseMethod.formatData(new Date(), 'yyyy-MM-dd')} 23:59:59`;
            }
            return {
                ...this.searchOptions
            };
        },
        afterQuery(data) {
            let list = data.body;
            this.startSource = list.length ? list[0].startSource : null;
            this.endSource = list.length ? list[list.length - 1].endSource : null;
            this.firstTime = list.length ? list[0].createTime : null;
            this.lastTime = list.length ? list[list.length - 1].createTime : null;
            return data;
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    }
};
</script>
