<template>
    <div class="dispatch">
        <div class="btns">
            <el-link type="info" @click.stop.prevent="dialogVisible = true">查看名词解释</el-link>
        </div>
        <div class="tabBtn">
            <el-radio-group v-model="logType">
                <el-radio-button label="">分单日志</el-radio-button>
                <el-radio-button label="51">待派列表</el-radio-button>
                <el-radio-button label="40">分单过滤日志</el-radio-button>
            </el-radio-group>
        </div>

        <ws-table-el ref="table" v-bind="tableConfig" v-show="logType != 40">
            <template #search>
                <search-group>
                    <label for>司机号码：</label>
                    <el-input v-model="driverPhone" placeholder="请输入司机号码" maxlength="11" clearable></el-input>
                </search-group>
            </template>
            <template #options>
                <el-button-group style="float: right">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn" @click="reset" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
            </template>

            <template>
                <ws-table-column-el align="center" prop="driverName" label="司机姓名"></ws-table-column-el>
                <ws-table-column-el align="center" prop="driverPhone" label="手机号"></ws-table-column-el>
                <ws-table-column-el align="center" prop="carNum" label="车牌号"></ws-table-column-el>
                <ws-table-column-el align="center" prop="logType" label="事件类型">
                    <template slot-scope="scope">
                        <p>{{ scope.row.logType | logTypeFilters }}</p>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="logTime" label="事件时间"></ws-table-column-el>
                <ws-table-column-el align="center" prop="logParam" label="司机标签">
                    <template slot-scope="scope">
                        <div style="width: 600px; word-break: break-all; word-wrap: break-word; white-space: break-spaces">{{ scope.row.logParam }}</div>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="dispatchRule" label="调度规则">
                    <template slot-scope="scope">
                        <div style="width: 600px; word-break: break-all; word-wrap: break-word; white-space: break-spaces">{{ scope.row.dispatchRule }}</div>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
        <ws-table-el ref="table2" v-bind="tableConfig" v-show="logType == 40">
            <template #search>
                <search-group>
                    <label for>司机号码：</label>
                    <el-input v-model="driverPhone" placeholder="请输入司机号码" maxlength="11" clearable></el-input>
                </search-group>
            </template>
            <template #options>
                <el-button-group style="float: right">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn" @click="reset" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
            </template>
            <template>
                <ws-table-column-el align="center" prop="driverName" label="司机姓名"></ws-table-column-el>
                <ws-table-column-el align="center" prop="driverPhone" label="手机号"></ws-table-column-el>
                <ws-table-column-el align="center" prop="carNum" label="车牌号"></ws-table-column-el>
                <ws-table-column-el align="center" prop="logType" label="事件类型">
                    <template slot-scope="scope">
                        <p>{{ scope.row.logType | logTypeFilters }}</p>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="logTime" label="事件时间"></ws-table-column-el>
                <ws-table-column-el align="center" prop="logParam" label="司机标签" width="600">
                    <template slot-scope="scope">
                        <div style="width: 600px; word-break: break-all; word-wrap: break-word; white-space: break-spaces">{{ scope.row.logParam }}</div>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="ignoreDesc" label="忽略原因" width="260">
                    <template slot-scope="scope">
                        <div style="width: 260px; word-break: break-all; word-wrap: break-word; white-space: break-spaces">{{ scope.row.ignoreDesc }}</div>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
        <el-dialog center title="名词解释" :visible.sync="dialogVisible" width="80%">
            <operGuide></operGuide>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import operGuide from './OperGuide';
export default {
    props: ['fromPage', 'basicInfo'],
    components: {
        operGuide
    },
    watch: {
        logType: {
            handler() {
                this.search();
            }
        }
    },
    data() {
        return {
            logType: '',
            driverPhone: '',
            dialogVisible: false,
            tableConfig: {
                filterColumns: false,
                lazyQuery: {
                    immediate: true,
                    moduleName: '/workbench/mixedOrder',
                    op: {
                        selectList: 'selectDetailsExpLog',
                        selectCount: 'selectLogDetailCountExpLog'
                    },
                    beforeQuery: this.beforeQuery,
                    afterQuery: this.afterQuery
                },
                topFixedRange: 55
            }
        };
    },
    mounted() {
        this.routerQurey = this.$route.query;
        let fromPage = this.fromPage;
        let moduleName = '';
        switch (true) {
            case fromPage == 'realTime':
                moduleName = '/order/real-time';
                break;
            case fromPage == 'scanCode':
                moduleName = '/order/scan-code';
                break;
            case fromPage == 'subscribe':
                moduleName = '/order/subscribe';
                break;
            case fromPage == 'charter':
                moduleName = '/order/charter';
                this.tableConfig.lazyQuery.op = {
                    selectList: 'selectLogDetails',
                    selectCount: 'selectLogCount'
                };
                break;
            case fromPage == 'freeRide':
                moduleName = '/order/free-ride';
                break;
            case fromPage == 'taxiOrder':
                moduleName = '/order/taxiOrder';
                break;
        }
        // this.tableConfig.lazyQuery.moduleName = moduleName;
        this.tableConfig.lazyQuery.moduleName = '/workbench/mixedOrder';
    },
    methods: {
        reset() {
            this.logType = '';
            this.driverPhone = '';
            this.search();
        },
        search() {
            if (this.logType == 40) {
                this.$refs.table2.search();
            } else {
                this.$refs.table.search();
            }
        },
        beforeQuery() {
            return {
                orderId: this.$route.query.orderId,
                logType: this.logType ? this.logType : null,
                driverPhone: this.driverPhone ? this.driverPhone : null,
                rideType: this.basicInfo ? this.basicInfo.orderBasisInfoVo.dispatchRideType : null
            };
        },
        afterQuery(data) {
            return (data.body && data.body.logDetailList) || [];
        }
    }
};
</script>
<style lang="scss" scoped>
.dispatch {
    .btns {
        position: absolute;
        top: 20px;
        right: 30px;
    }
    .tabBtn {
        text-align: center;
    }
    .ws-table-warp {
        .search_box {
            background-color: #fff;
            border: none;
        }
    }
}
</style>
