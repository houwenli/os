<template>
    <div class="bg-page" :class="isFolder?'addWidth':''">
        <div class="sidebar"> 
            <tabs @changeWidth="changeWidth"></tabs>
        </div>
        <ws-table-el align="left" ref="table" v-bind="tableConfig" :col="8">
            <template #search>
                <search-group>
                    <label for>业务单号：</label>
                    <el-input v-model.trim="searchOptions.orderId" placeholder="业务单号或关联业务单号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>司机ID：</label>
                    <el-input v-model.trim="searchOptions.driverId" placeholder="请输入司机ID" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>手机号码：</label>
                    <el-input v-model.trim="searchOptions.driverPhone" placeholder="请输入手机号码" clearable maxlength="11"></el-input>
                </search-group>
                <search-group>
                    <label for>包干城市：</label>
                    <ws-city v-model="registerCityCode" level="2"></ws-city>
                </search-group>
                <search-group>
                    <label for>支付方式：</label>
                    <el-select v-model="searchOptions.payType" placeholder="请选择" multiple collapse-tags clearable>
                        <el-option v-for="item in appPayTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>创建时间：</label>
                    <ws-date-range
                        type="daterange"
                        class="create-time"
                        :startTime.sync="searchOptions.createTimeBegin"
                        :endTime.sync="searchOptions.createTimeEnd"
                        :pickerOptions="{disabledDate:null}"
                    ></ws-date-range>
                </search-group>
                <!-- <search-group>
                    <label for>状态：</label>
                    <el-select v-model="searchOptions.payStatus" placeholder="请选择" multiple collapse-tags clearable>
                        <el-option v-for="item in appRunningFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>包干生效时间：</label>
                    <ws-date-range
                        :startTime.sync="searchOptions.vipStartTimeBegin"
                        :endTime.sync="searchOptions.vipStartTimeEnd"
                        :pickerOptions="{disabledDate:null}"
                    ></ws-date-range>
                </search-group>
                <search-group>
                    <label for>支付时间：</label>
                    <ws-date-range
                        :startTime.sync="searchOptions.payStartTime"
                        :endTime.sync="searchOptions.payEndTime"
                        :pickerOptions="{disabledDate:null}"
                    ></ws-date-range>
                </search-group>
                <search-group>
                    <label for>退款时间：</label>
                    <ws-date-range
                        :startTime.sync="searchOptions.refundTimeBegin"
                        :endTime.sync="searchOptions.refundTimeEnd"
                        :pickerOptions="{disabledDate:null}"
                    ></ws-date-range>
                </search-group> -->
            </template>
            <template #searchBtns>
                <el-button-group v-if="powerList.getDjBuyVipOrderList">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn" @click="reset()" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
            </template>
            <template>
                <ws-table-column-el align="center" prop="orderId" label="业务单号"></ws-table-column-el>
                <ws-table-column-el align="center" prop="parentOrderId" label="关联业务单号">
                    <template slot-scope="scope">{{scope.row.parentOrderId || '-'}}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="driverId" label="司机ID"></ws-table-column-el>
                <ws-table-column-el align="center" prop="driverName" label="司机姓名"></ws-table-column-el>
                <ws-table-column-el align="center" prop="driverPhone" label="手机号码"></ws-table-column-el>
                <ws-table-column-el align="center" prop="regionName" label="包干区域"></ws-table-column-el>
                <ws-table-column-el align="center" prop="purchaseVipDay" label="包干天数">
                    <template
                        slot-scope="scope"
                    >{{scope.row.parentOrderId && scope.row.orderStatus === 3 ? '-' : '+'}}{{scope.row.purchaseVipDay}}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="vipStartTime" label="包干开始时间"></ws-table-column-el>
                <ws-table-column-el align="center" prop="vipEndTime" label="包干结束时间"></ws-table-column-el>
                <ws-table-column-el align="center" prop="money" label="购买金额（元）">
                    <template
                        slot-scope="scope"
                    >{{scope.row.money == 0 ? '' : (scope.row.parentOrderId && scope.row.orderStatus === 3 ? '-':'+')}}{{formatAmount(scope.row.money)}}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="purchaseTypeName" label="业务类型"></ws-table-column-el>
                <ws-table-column-el align="center" prop="payType" label="支付方式">
                    <template slot-scope="scope">{{scope.row.payType | appPayTypeFilters}}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="payStatus" label="状态">
                    <template slot-scope="scope">{{scope.row.payStatus | appRunningFilters}}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="createTime" label="创建时间"></ws-table-column-el>
                <ws-table-column-el align="center" label="操作" fixed="right" min-width="110">
                    <template slot-scope="scope">
                        <el-button
                            v-if="powerList.getDetailByOrderId"
                            type="text"
                            style="color:#0088ff;"
                            @click="detail(scope.row.orderId)"
                        >详情</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import tabs from '../components/tabs';
export default {
    components: { tabs },
    data() {
        return {
            isFolder:false,
            searchOptions: {
                orderId: '',
                driverId: '',
                driverPhone: '',
                cityCode: '',
                payType: [],
                payStatus: [],
                vipStartTimeBegin: '',
                vipStartTimeEnd: '',
                payStartTime: '',
                payEndTime: '',
                createTimeBegin: this.$baseMethod.formatData(new Date().getTime() - 3600 * 24 * 7 * 1000, 'yyyy-MM-dd 00:00:00'),
                createTimeEnd: this.$baseMethod.formatData(new Date().getTime(), 'yyyy-MM-dd 23:59:59'),
                refundTimeBegin: '',
                refundTimeEnd: '',
            },
            registerCityCode: [],
            orderIds: [],
            type: null,
            title: '',
            tableConfig: {
                emptyModel: true,
                indexColumn: true,
                // layout: 'flow',
                loading: true,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/workbench/baoganManage/runningwaterApp/list',
                    op: {
                        selectList: 'getDjBuyVipOrderList',
                    },
                    beforeQuery: this.beforeQuery,
                    immediate: false,
                },
            },
            moduleName: '/workbench/baoganManage/runningwaterApp/list',
            dialogInfo: null,
        };
    },
    computed: {
        ...mapState({
            appPayTypeFilters: state => state.baogan.appPayTypeFilters,
            appRunningFilters: state => state.baogan.appRunningFilters,
        }),
    },
    mounted() {
        this.search();
    },
    activated() {
        this.search();
    },
    methods: {
        afterQuery(data) {
            return data;
        },
        detail(id) {
            this.$router.push({ name: 'runningwaterAppForm', query: { id, isEncrypt: this.$refs.table.isEncrypt } });
        },
        formatAmount(m) {
            return this.$baseMethod.regFenToYuan(m);
        },
        beforeQuery() {
            let CityCode = this.registerCityCode;
            this.searchOptions.cityCode = CityCode && CityCode.length ? CityCode[CityCode.length - 1] : null;
            if (this.searchOptions.createTimeBegin) {
                this.searchOptions.createTimeBegin =
                this.$baseMethod.formatData(new Date(this.searchOptions.createTimeBegin), 'yyyy-MM-dd 00:00:00')
            }
            if (this.searchOptions.createTimeEnd) {
                this.searchOptions.createTimeEnd = this.$baseMethod.formatData(new Date(this.searchOptions.createTimeEnd), 'yyyy-MM-dd 23:59:59')
            }
            return this.searchOptions;
        },
        search() {
            this.$refs.table.search();
        },
        reset() {
            this.searchOptions = {
                orderId: '',
                driverId: '',
                driverPhone: '',
                cityCode: '',
                payType: [],
                payStatus: [],
                vipStartTimeBegin: '',
                vipStartTimeEnd: '',
                payStartTime: '',
                payEndTime: '',
                createTimeBegin: this.$baseMethod.formatData(new Date().getTime() - 3600 * 24 * 7 * 1000, 'yyyy-MM-dd'),
                createTimeEnd: this.$baseMethod.formatData(new Date().getTime(), 'yyyy-MM-dd'),
                refundTimeBegin: '',
                refundTimeEnd: '',
            };
            this.registerCityCode = [];
            this.search();
        },
        changeWidth(isFolder){
            this.isFolder = isFolder
        }
    },
};
</script>

<style lang="scss" scoped>
.bg-page{
    display:flex;
    transition: 0.5s;
    .sidebar{
        flex:1;
        margin-right:14px;
    }
}
.bg-page /deep/ .ws-table-warp {
    border-radius: 0 0 8px 8px;
    padding: 24px !important;
    width:89%;
}
.addWidth /deep/ .ws-table-warp {
    width:92%;
}

.create-time {
    /deep/.el-date-editor {
        width: 100% !important;
    }
}

</style>
