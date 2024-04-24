<template>
    <div class="bg-page" :class="isFolder?'addWidth':''">
        <div class="sidebar">
            <tabs @changeWidth="changeWidth"></tabs>
        </div>
        <ws-table-el align="left" ref="table" v-bind="tableConfig" @selection-change="selectionChange" :col="8">
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
                    <label for>支付类型：</label>
                    <el-select v-model="searchOptions.payMode" placeholder="请选择"  collapse-tags clearable>
                        <el-option v-for="item in payModeTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>支付方式：</label>
                    <el-select v-model="searchOptions.payType" placeholder="请选择" multiple collapse-tags clearable>
                        <el-option v-for="item in baoganPayTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
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
                <search-group>
                    <label for>状态：</label>
                    <el-select v-model="searchOptions.payStatus" placeholder="请选择" multiple collapse-tags clearable>
                        <el-option v-for="item in bgRunningFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>关联代驾：</label>
                    <el-select v-model="searchOptions.drivingVipStatus" placeholder="请选择" clearable>
                        <el-option v-for="item in relevanceFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
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
                </search-group>
            </template>
            <template #searchBtns>
                <el-button-group v-if="powerList.list || powerList.listDecrypt">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn" @click="reset()" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
                <el-button v-if="powerList.fileExport" style="margin-left:20px" @click="derive" plain>导出</el-button>
            </template>
            <template #options>
                <el-dropdown
                    v-if="powerList.batchRefund || (powerList.batchAudit && powerList.batchAuditDetail)"
                    @command="handleCommand"
                    style="margin-right:20px"
                >
                    <el-button type="primary">
                        批量操作
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown" class="dropdownItem">
                        <el-dropdown-item command="batch" v-if="powerList.batchRefund">批量退款</el-dropdown-item>
                        <el-dropdown-item command="refundAudit" v-if="powerList.batchAudit && powerList.batchAuditDetail">批量审核</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
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
                    <template slot-scope="scope">{{scope.row.payType | baoganPayTypeFilters}}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="payStatus" label="状态">
                    <template slot-scope="scope">{{scope.row.payStatus | bgRunningFilters}}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="createTime" label="创建时间"></ws-table-column-el>
                <ws-table-column-el align="center" label="操作" fixed="right" min-width="110">
                    <template slot-scope="scope">
                        <el-button
                            v-if="powerList.detail || powerList.detailDecrypt"
                            type="text"
                            style="color:#0088ff;"
                            @click="detail(scope.row.orderId)"
                        >详情</el-button>
                        <el-button
                            v-if="scope.row.refundFlag == 1 && powerList.refund"
                            type="text"
                            style="color:#0088ff;"
                            @click="refundAudit(1, scope.row)"
                        >退款</el-button>
                        <el-button
                            v-if="scope.row.auditFlag == 1 && powerList.audit"
                            type="text"
                            style="color:#0088ff;"
                            @click="refundAudit(2, scope.row)"
                        >审核</el-button>
                        <!-- <el-button
                            v-if="scope.row.transferFlag == 1 && powerList.addTransferOrder"
                            type="text"
                            style="color:#0088ff;"
                            @click="refundAudit(4, scope.row)"
                        >转移</el-button> -->
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
        <template v-if="centerDialogVisible">
            <operating-dialog v-model="centerDialogVisible" :title="title" :type="type" :info="dialogInfo" @updateList="search" :payMode="payMode"  :moduleName="moduleName"></operating-dialog>
        </template>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import tabs from '../components/tabs';
import OperatingDialog from '../components/operatingDialog';
export default {
    components: { tabs, OperatingDialog },
    data() {
        return {
            isFolder:false,
            searchOptions: {
                orderId: '',
                driverId: '',
                driverPhone: '',
                cityCode: '',
                payType: [],
                payMode:'',
                payStatus: [],
                drivingVipStatus: '',
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
            centerDialogVisible: false,
            orderIds: [],
            type: null,
            title: '',
            tableConfig: {
                emptyModel: true,
                indexColumn: true,
                // layout: 'flow',
                multi: true,
                loading: true,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/workbench/baoganManage/runningwaterLocal/list',
                    op: {
                        selectList: 'list',
                        selectCount: 'count',
                        encryptList: 'listDecrypt',
                    },
                    beforeQuery: this.beforeQuery,
                    afterQuery:this.afterQuery,
                    immediate: false,
                },
            },
            moduleName: '/workbench/baoganManage/runningwaterLocal/list',
            dialogInfo: null,
            payMode:''
        };
    },
    computed: {
        ...mapState({
            baoganPayTypeFilters: state => state.baogan.baoganPayTypeFilters,
            bgRunningFilters: state => state.baogan.bgRunningFilters,
            relevanceFilters: state => state.baogan.relevanceFilters,
            payModeTypeFilters: state => state.baogan.payModeTypeFilters,
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
            data.body.forEach(item=> item['id']=item.orderId)
            return data;
        },
        detail(id) {
            this.$router.push({ name: 'runningwaterLocalForm', query: { id, isEncrypt: this.$refs.table.isEncrypt } });
        },
        formatAmount(m) {
            return this.$baseMethod.regFenToYuan(m);
        },
        selectionChange(selection) {
            this.orderIds = selection.reduce((pre, next) => {
                if (next.payStatus === 4) {
                    pre.push(next.orderId);
                }
                return pre;
            }, []);
        },
        async refundAudit(val, row) {
            this.type = val;
            if (val == 1) {
                this.payMode=row.payMode
                this.title = '退款申请';
                let data = {
                    data: {
                        orderId: row.orderId,
                    },
                    op: 'refundDetail',
                };
                let URL = this.powerList.refundDetail;
                try {
                    let res = await this.$axios(URL, data);
                    this.dialogInfo = JSON.parse(res.data);
                } catch (err) {
                    return;
                }
            } else if (val == 2) {
                this.title = '退款审核';
                this.dialogInfo = row;
            } else if (val == 3) {
                if (this.orderIds.length) {
                    this.title = '批量审核';
                    let data = {
                        data: {
                            orderIds: this.orderIds,
                        },
                        op: 'batchAuditDetail',
                    };
                    let URL = this.powerList.batchAuditDetail;
                    try {
                        let res = await this.$axios(URL, data);
                        this.dialogInfo = { ...JSON.parse(res.data), orderIds: this.orderIds };
                        this.$refs.table.clearSelection();
                    } catch (err) {
                        return;
                    }
                } else {
                    this.$message.error('请选择审核状态的数据！');
                    return;
                }
            } else if (val == 4) {
                // 包干转移
                this.title = '包干转移';
                let data = {
                    data: {
                        orderId: row.orderId,
                    },
                    op: 'transferDetail',
                };
                let URL = this.powerList.transferDetail;
                try {
                    let res = await this.$axios(URL, data);
                    this.dialogInfo = JSON.parse(res.data);
                } catch (err) {
                    return;
                }
                // this.dialogInfo = {
                //     orderId: '600440300100538969',
                //     driverName: '代宇',
                //     remainingMoney: 9000,
                //     vipPrice: 9000,
                //     remainingDay: 365,
                //     transferDetailCityLists: [{
                //         cityCode: 1232,
                //         cityName: '深圳市',
                //         vipPrice: '365天/4000元',
                //         afterRemainDays: 362
                //     }],
                // };
            }
            this.centerDialogVisible = true;
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
                drivingVipStatus: '',
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
        derive() {
            // 导出
            let CityCode = this.registerCityCode;
            this.searchOptions.cityCode = CityCode && CityCode.length ? CityCode[CityCode.length - 1] : null;
            let param = {
                data: this.searchOptions,
                op: 'fileExport',
            };
            let URL = this.powerList.fileExport;
            this.$axios(URL, param).then(res => {
                this.$message.success('导出中，请稍后到文件中心下载！');
            });
        },
        handleCommand(name) {
            switch (name) {
                case 'refundAudit': // 批量审核
                    this.refundAudit(3);
                    break;
                case 'batch': // 批量退款
                    this.$router.push({ name: 'runningwaterLocalRefundBatch' });
                    break;
            }
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
/deep/ .table-column-header-button {
    padding: 10px 12px;
}
/deep/ .el-dialog__header {
    text-align: center;
}
/deep/ .el-textarea {
    width: 350px;
}

.create-time {
    /deep/.el-date-editor {
        width: 100% !important;
    }
}

</style>
