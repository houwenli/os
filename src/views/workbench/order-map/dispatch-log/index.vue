<!--
 * @Author: DaiYu
 * @Date: 2022-09-13 10:24:48
 * @LastEditors: DaiYu
 * @LastEditTime: 2022-09-27 19:01:38
 * @FilePath: \main\src\views\workbench\order-map\dispatch-log\index.vue
-->
<template>
    <div class="dispatch-log">
        <tabs></tabs>
        <ws-table-el class="dispatch-table" align="left" :total="total" ref="table" v-bind="tableConfig" :col="8">
            <template #search>
                <search-group>
                    <label for>创建时间：</label>
                    <ws-date-range type="daterange" :startTime.sync="searchOptions.startDate" :endTime.sync="searchOptions.endDate" :pickerOptions="pickerOptions"></ws-date-range>
                </search-group>
            </template>
            <template #searchBtns>
                <el-button-group v-if="powerList.recordPageList">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn" @click="reset()" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
            </template>
            <template>
                <ws-table-column-el align="center" prop="mode" label="推送方式">
                    <template slot-scope="scope">
                        <span>{{ valueToLabel(scope.row.mode) }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="regionName" label="订单热区地址"></ws-table-column-el>
                <ws-table-column-el align="center" prop="statusList" label="司机状态">
                    <template slot-scope="scope">
                        <span>{{ getStatus(scope.row.statusList) }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="scope" label="推送范围（KM）"></ws-table-column-el>
                <ws-table-column-el align="center" prop="num" label="司机数量">
                    <template slot-scope="scope">
                        <el-button v-if="powerList.driverRecordPageList" type="text" style="color: #0088ff" @click="detail(scope.row.id)">
                            {{ scope.row.num }}
                        </el-button>
                        <span v-else>{{ scope.row.num }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="createTime" label="创建时间"></ws-table-column-el>
                <ws-table-column-el align="center" prop="createUserName" label="操作人"></ws-table-column-el>
            </template>
        </ws-table-el>
        <driver-list v-if="showDialog" v-model="showDialog" :recordId="recordId"></driver-list>
    </div>
</template>

<script>
import tabs from '../components/tabs.vue';
import DriverList from '../components/driver-list.vue';
export default {
    components: { tabs, DriverList },
    data() {
        return {
            showDialog: false,
            searchOptions: {
                startDate: this.$baseMethod.getBeforeDay(-6, 'yyyy-MM-dd 00:00:00'),
                endDate: this.$baseMethod.formatData(new Date(), 'yyyy-MM-dd 23:59:59'),
            },
            pickerOptions: {
                disabledDate: (time) => {
                    return time.getTime() > new Date(this.$baseMethod.formatData(new Date(), 'yyyy-MM-dd 23:59:59'));
                },
            },
            orgTypeList: [
                {
                    value: '20',
                    label: '一级机构',
                },
                {
                    value: '30',
                    label: '二级机构',
                },
                {
                    value: '40',
                    label: '实体店',
                },
            ],
            statusOptions: [
                {
                    value: -1,
                    label: '全部',
                },
                {
                    value: 0,
                    label: '未出车',
                },
                {
                    value: 1,
                    label: '出车离线',
                },
                {
                    value: 2,
                    label: '出车空闲',
                },
                {
                    value: 3,
                    label: '服务中在线',
                },
                {
                    value: 4,
                    label: '服务中离线',
                },
            ],
            modeType: [
                {
                    value: 1,
                    label: 'PUSH',
                },
            ],
            tableConfig: {
                filterColumns: false,
                emptyModel: true,
                indexColumn: true,
                // layout: 'flow',
                loading: true,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/workbench/orderMap/dispatchLog',
                    op: {
                        selectList: 'recordPageList',
                        // selectCount: 'count',
                    },
                    beforeQuery: this.beforeQuery,
                    afterQuery: this.afterQuery,
                    immediate: false,
                },
            },
            total: 0,
            moduleName: '/workbench/orderMap/dispatchLog',
        };
    },
    activated() {
        this.search();
    },
    mounted() {
        this.search();
    },
    methods: {
        beforeQuery() {
            let { startDate, endDate } = this.searchOptions;
            if (startDate && endDate) {
                startDate = this.$baseMethod.formatData(startDate, 'yyyy-MM-dd 00:00:00');
                endDate = this.$baseMethod.formatData(endDate, 'yyyy-MM-dd 23:59:59');
            }
            return {
                startDate,
                endDate,
            };
        },
        afterQuery(data) {
            this.total = data.count;
            return data;
        },
        search() {
            this.$refs.table.search();
        },
        detail(id) {
            this.recordId = id;
            this.showDialog = true;
            // this.$router.push({name:'dispatchLogDriverList',query:{id}})
        },
        reset() {
            this.searchOptions = {
                startDate: this.$baseMethod.getBeforeDay(-6, 'yyyy-MM-dd 00:00:00'),
                endDate: this.$baseMethod.formatData(new Date(), 'yyyy-MM-dd 23:59:59'),
            };
            this.search();
        },
        valueToLabel(v) {
            return this.modeType.find(item => item.value === v).label;
        },
        getStatus(statusList) {
            return this.statusOptions.reduce((pre, next) => {
                if (statusList.includes(next.value)) {
                    pre = pre ? pre.concat('、' + next.label) : next.label;
                }
                return pre;
            }, '');
        },
    },
};
</script>

<style lang="scss" scoped>
::v-deep {
    .ws-table-warp {
        flex: 1;
        min-height: auto;
        border-radius: 0 0 8px 8px;
        padding: 0 24px !important;
    }
}
.dispatch-log {
    display: flex;
    flex-direction: column;
}
</style>
