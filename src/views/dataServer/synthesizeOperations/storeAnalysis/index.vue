<template>
    <div class="storeAnalysis">
        <ws-table-el align="left" ref="table" v-bind="tableConfig" labelWidth="95px">
            <template #search>
                <search-group>
                    <label for>选择时间：</label>
                    <div class="timebox">
                        <el-select v-model="timeType" placeholder="请选择">
                            <el-option label="按天" :value="0" />
                            <el-option label="按月" :value="1" />
                        </el-select>
                        <span class="time" v-show="timeType==0">
                            <el-date-picker
                                v-model="date"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions"
                                popper-class="timeClass">
                            </el-date-picker>
                        </span>
                        <span class="time" v-show="timeType==1">
                            <el-date-picker
                                v-model="month"
                                type="month"
                                placeholder="请选择月份"
                                value-format="yyyy-MM"
                                :picker-options="monthPickerOptions">
                            </el-date-picker>
                        </span>
                    </div>
                </search-group>
                <search-group>
                    <label for>名称：</label>
                    <el-input v-model="searchOptions.agencyName" placeholder="请输入实体店名称" clearable />
                </search-group>
                <search-group>
                    <label for>机构编码：</label>
                    <el-input v-model="searchOptions.agencyNumber" placeholder="请输入机构编码" clearable />
                </search-group>
                <search-group v-if="roleType!=30 && roleType!=40">
                    <label for>上级机构：</label>
                    <organization
                        v-model="searchOptions.parentAgencyNumber"
                        :showSelect="true"
                        :selectOptions="selectOptions"
                        ref="orgSelect"
                        placeholder="请输入机构名称搜索"
                        valueKey="agencyNumber"
                        :reqData="reqData"
                        :orgType="searchOptions.orgType"
                        @orgTypeChange="orgTypeChange"
                    />
                </search-group>
            </template>
            <template #searchBtns>
                <el-button-group v-if="powerList[op.list]">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn" @click="reset()" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
                <el-button v-if="powerList[op.export]" style="margin-left: 20px" @click="handleExport" plain>导出</el-button>
            </template>
            <template>
                <ws-table-column-el align="center" prop="orgName" label="实体店名称"></ws-table-column-el>
                <ws-table-column-el align="center" prop="stationNumber" label="机构编码"></ws-table-column-el>
                <ws-table-column-el align="center" prop="parentName" label="上级机构"></ws-table-column-el>
                <ws-table-column-el align="center" prop="newDriverCnt" label="新增司机量"></ws-table-column-el>
                <ws-table-column-el align="center" prop="vip3pPaymentOrderAmt" label="第三方支付完单金额(包干司机) (元)">
                    <template slot-scope="scope">
                        <span v-if="scope.row.vip3pPaymentOrderAmt == null"></span>
                        <span v-else>{{ scope.row.vip3pPaymentOrderAmt | regFenToYuan }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="vipBalancePaymentOrderAmt" label="余额支付完单金额(包干司机) (元)">
                    <template slot-scope="scope">
                        <span v-if="scope.row.vipBalancePaymentOrderAmt == null"></span>
                        <span v-else>{{ scope.row.vipBalancePaymentOrderAmt | regFenToYuan }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="notVip3pPaymentOrderAmt" label="第三方支付完单金额(非包干司机) (元)">
                    <template slot-scope="scope">
                        <span v-if="scope.row.notVip3pPaymentOrderAmt == null"></span>
                        <span v-else>{{ scope.row.notVip3pPaymentOrderAmt | regFenToYuan }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="notVipBalancePaymentOrderAmt" label="余额支付完单金额(非包干司机) (元)">
                    <template slot-scope="scope">
                        <span v-if="scope.row.notVipBalancePaymentOrderAmt == null"></span>
                        <span v-else>{{ scope.row.notVipBalancePaymentOrderAmt | regFenToYuan }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="djOrderAmt" label="代驾订单金额(元)">
                    <template slot-scope="scope">
                        <span v-if="scope.row.djOrderAmt == null"></span>
                        <span v-else>{{ scope.row.djOrderAmt | regFenToYuan }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="carSaleAmt" label="汽车销售金额(元)">
                    <template slot-scope="scope">
                        <span v-if="scope.row.carSaleAmt == null"></span>
                        <span v-else>{{ scope.row.carSaleAmt | regFenToYuan }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="mallOrderAmt" label="电商销售金额(元)">
                    <template slot-scope="scope">
                        <span v-if="scope.row.mallOrderAmt == null"></span>
                        <span v-else>{{ scope.row.mallOrderAmt | regFenToYuan }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="vipBalancePaymentAmt" label="余额支付认证包干金额(元)">
                    <template slot-scope="scope">
                        <span v-if="scope.row.vipBalancePaymentAmt == null"></span>
                        <span v-else>{{ scope.row.vipBalancePaymentAmt | regFenToYuan }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="vip3pPaymentAmt" label="第三方支付认证包干金额(元)">
                    <template slot-scope="scope">
                        <span v-if="scope.row.vip3pPaymentAmt == null"></span>
                        <span v-else>{{ scope.row.vip3pPaymentAmt | regFenToYuan }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="smartVipBalancePaymentAmt" label="余额支付会员费金额(元)">
                    <template slot-scope="scope">
                        <span v-if="scope.row.smartVipBalancePaymentAmt == null"></span>
                        <span v-else>{{ scope.row.smartVipBalancePaymentAmt | regFenToYuan }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="smartVip3pPaymentAmt" label="第三方支付会员费金额(元)">
                    <template slot-scope="scope">
                        <span v-if="scope.row.smartVip3pPaymentAmt == null"></span>
                        <span v-else>{{ scope.row.smartVip3pPaymentAmt | regFenToYuan }}</span>
                    </template>
                </ws-table-column-el>
                <!-- <ws-table-column-el align="center" prop="" label="车险销售金额"></ws-table-column-el> -->
            </template>
        </ws-table-el>
    </div>
</template>

<script>
import organization from '@/components/orgSelect/organization-options.vue';

export default {
    name: 'storeInfo',
    components: { organization },
    data() {
        return {
            searchOptions: {
                agencyName: '',
                agencyNumber: '',
                orgType: '',
                parentAgencyNumber: ''
            },
            timeType: 0,
            date: [this.$baseMethod.getNowMonthDate().startDate, this.$baseMethod.getBeforeDay(-1, 'yyyy-MM-dd')],
            month: '',
            tableConfig: {
                // filterColumns: false,
                loading: true,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/dataServer/storeAnalysis',
                    op: {
                        selectList: 'queryList',
                        // selectCount: 'count',
                    },
                    beforeQuery: this.beforeQuery
                },
            },
            moduleName: '/dataServer/storeAnalysis',
            op: {
                list: 'queryList',
                export: 'export'
            },
            reqData: {
                op: 'selectOrgByOrgType',
                moduleName: '/dataServer/storeAnalysis'
            },
            pickerMinDate: '',
            pickerOptions: {
                onPick: ({ maxDate, minDate }) => {
                    if (minDate && this.pickerMinDate) {
                        this.pickerMinDate = null;
                    } else if (minDate) {
                        this.pickerMinDate = minDate.getTime();
                    }
                },
                disabledDate: (time) => {
                    if (this.pickerMinDate) {
                        const one = 30 * 24 * 3600 * 1000
                        const minTime = this.pickerMinDate - one
                        const maxTime = this.pickerMinDate + one
                        return (new Date('2023/01/01') > time.getTime() || time.getTime() > Date.now() - 8.64e7) || time.getTime() < minTime || time.getTime() > maxTime
                    }
                    return new Date('2023/01/01') > time.getTime() || time.getTime() > Date.now() - 8.64e7;
                }
            },
            monthPickerOptions: {
                disabledDate(time) {
                    return new Date('2023/01/01') > time.getTime() || time.getTime() > new Date()
                }
            },
            roleType: 0
        }
    },
    computed: {
        selectOptions() {
            const allOrg = [
                { value: '10', label: '大区' },
                { value: '20', label: '城市分公司' },
                { value: '30', label: '区县分公司' },
                // { value: '40', label: '实体店' }
            ];
            const map = { 0: 0, 4: 0, 5: 1, 20: 2, 30: 3 }
            // 账户类型： 0 总部，4 总区 5 大区 20 分公司 30 服务中心 40 实体店
            return allOrg.slice(map[this.roleType], allOrg.length);
        }
        
    },
    mounted() {
        const role = this.$baseMethod.getStore('roleOption')
        this.roleType = (role && role.orgType) || 0
    },
    methods: {
        // 查询
        search() {
            this.$refs.table.search();
        },
        reset() {
            this.timeType = 0
            this.date = [this.$baseMethod.getNowMonthDate().startDate, this.$baseMethod.getBeforeDay(-1, 'yyyy-MM-dd')],
            this.month = '',
            this.searchOptions = {
                agencyName: '',
                agencyNumber: '',
                orgType: '',
                parentAgencyNumber: ''
            };
            this.search();
        },
        beforeQuery() {
            return this.setParams()
        },
        handleExport() {
            // 导出
            const param = {
                data: this.setParams(),
                op: this.op.export,
            };
            const URL = this.$getModuleUrl(this.moduleName, param.op);
            this.$axios(URL, param).then(res => {
                this.$message.success('导出中，请稍后到文件中心下载！');
            });
        },
        setParams() {
            let { orgType, parentAgencyNumber } = this.searchOptions
            let dayStart = '', dayEnd = ''
            if (this.timeType === 0) {
                dayStart = this.date ? this.date[0] : '',
                dayEnd = this.date ? this.date[1] : ''
            } else {
                // 当月月最后一天日期
                const arr = this.month ? this.month.split('-') : []
                let lastDateOfCurrentMonth = new Date(arr[0], arr[1], 0);
                dayStart = this.month ? this.month + '-01' : '',
                dayEnd = this.month ? this.month + '-' + lastDateOfCurrentMonth.getDate() : '';
            }
            return {
                ...this.searchOptions,
                dayStart: dayStart ? dayStart + ' 00:00:00' : '',
                dayEnd: dayEnd ? dayEnd + ' 23:59:59' : '',
                parentOrgType: parentAgencyNumber ? orgType : null
            }
        },
        orgTypeChange(val) {
            this.searchOptions = {
                ...this.searchOptions,
                orgType: val
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.storeAnalysis {
    /deep/.timebox {
        // width: 100%;
        flex: 1;
        display: flex;
        justify-content: space-between;
        .el-select {
            width: 80px;
        }
        .time {
            flex: 1;
            .el-date-editor {
                width: 100%;
                .el-range-input {
                    width: inherit;
                }
            }
        }
    }
}
</style>
<style lang="scss">
    .timeClass {
        .el-date-table {
            .today {
                &.disabled {
                    span {
                        color: #C0C4CC;
                    }
                }
            }
        }
    }
</style>