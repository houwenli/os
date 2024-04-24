<template>
    <div class="branchContainer">
        <ws-table-el :col="8" ref="table" v-bind="tableConfig" :header-cell-style="{ background: '#F5F7FA' }">
            <template #search>
                <search-group>
                    <label for>申请订单号：</label>
                    <el-input v-model.trim="searchOptions.settleSerialNum" placeholder="请输入申请订单号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>提现机构：</label>
                    <el-select v-model="searchOptions.relationId" clearable filterable remote reserve-keyword placeholder="请输入机构名称" :remote-method="remotePromoteOrgList">
                        <el-option v-for="item in institutionList" :key="item.relationId" :label="item.name" :value="item.relationId"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>提现时间：</label>
                    <ws-date-range :startTime.sync="searchOptions.settleTimeStart" :endTime.sync="searchOptions.settleTimeEnd"></ws-date-range>
                </search-group>
                <search-group>
                    <label for>状态：</label>
                    <el-select v-model="searchOptions.status" clearable placeholder="请选择">
                        <el-option v-for="item in statusList" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
            </template>
            <template #options>
                <div style="display: flex; justify-content: flex-end">
                    <el-button-group v-if="getModulePower('/personalCenter/withdrawalRecord').selectWithdrawList">
                        <el-button type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
                        <ws-throttle>
                            <el-button class="resetBtn" type="primary" @click="resetForm" icon="el-icon-refresh-left"></el-button>
                        </ws-throttle>
                    </el-button-group>
                </div>
            </template>
            <!-- 表格 -->
            <template>
                <ws-table-column-el prop="settleSerialNum" label="申请订单号"></ws-table-column-el>
                <ws-table-column-el prop="orgName" label="提现机构"></ws-table-column-el>
                <ws-table-column-el prop="bankName" label="银行"></ws-table-column-el>
                <ws-table-column-el prop="settlerPhone" label="账号"></ws-table-column-el>
                <ws-table-column-el prop="settlerName" label="开户名"></ws-table-column-el>
                <ws-table-column-el prop="settleAmount" label="提现金额(元)">
                    <template slot-scope="scope">
                        <span>{{ changeYuan(scope.row.settleAmount) }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="settleHandleFee" label="提现手续费(元)">
                    <template slot-scope="scope">
                        <span>{{ changeYuan(scope.row.settleHandleFee) }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="actualSettleAmount" label="应付金额(元)">
                    <template slot-scope="scope">
                        <span>{{ changeYuan(scope.row.actualSettleAmount) }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="settleApplyTime" label="提现申请时间"></ws-table-column-el>
                <ws-table-column-el width="150" prop="status" label="状态" :formatter="sysTypeFormat"></ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    name: 'withdrawalRecord',
    data() {
        return {
            statusList: [
                {
                    id: '0',
                    value: '待审核'
                },
                {
                    id: '1',
                    value: '审核通过'
                },
                {
                    id: '2',
                    value: '待打款'
                },
                {
                    id: '3',
                    value: '打款成功'
                },
                {
                    id: '4',
                    value: '打款失败'
                },
                {
                    id: '-1',
                    value: '审核不通过'
                },
                {
                    id: '-2',
                    value: '冻结'
                }
            ],
            institutionList: [],
            searchOptions: {
                settleSerialNum: '', //申请单号
                relationId: '', //提现机构名称
                status: '', //提现状态
                settleTimeStart: '', //提现开始时间
                settleTimeEnd: '' //提现结束时间
            },
            tableConfig: {
                // labelWidth: "84px",
                filterColumns: false,
                // layout: "flow",
                pageId: 'id',
                pageCreateTime: 'updateTime',
                pageSizeList: [20, 50, 100, 200],
                lazyQuery: {
                    moduleName: '/personalCenter/withdrawalRecord',
                    op: {
                        selectList: 'selectWithdrawList',
                        selectCount: 'selectWithdrawCount'
                    },
                    beforeQuery: this.beforeQuery,
                    immediate: false
                }
            },
            moduleName: '/personalCenter/withdrawalRecord'
        };
    },
    computed: {},
    watch: {
        beforeQuery() {
            return this.searchOptions;
        }
    },
    created() {
        this.getOrgOptionList({ name: '' }).then(res => {
            this.institutionList = res;
            let newArr = res.filter(item => {
                return item.partTime == 2;
            });
            if (newArr.length !== 0) {
                this.searchOptions.relationId = newArr[0].relationId;
            }
            this.search();
        });
    },
    methods: {
        ...mapActions('personalCenter', ['getOrgOptionList']),
        //查询机构接口
        async remotePromoteOrgList(queryString) {
            this.getOrgOptionList({ name: queryString }).then(res => {
                this.institutionList = res;
            });
        },
        // 查询
        search(type = 1) {
            this.$nextTick(() => {
                this.$refs.table.search();
            });
        },
        // 重置
        resetForm() {
            this.searchOptions = {
                settleSerialNum: '', //申请单号
                relationId: '', //提现机构名称
                status: '', //提现状态
                settleTimeStart: '', //提现开始时间
                settleTimeEnd: '' //提现结束时间
            };
            this.search();
        },
        sysTypeFormat(row) {
            const sysTypeObj = this.statusList.find(item => item.id == row.status);
            return sysTypeObj ? sysTypeObj.value : '';
        },
        //单位转换
        changeYuan(num) {
            let str = (num / 100).toFixed(2) + '';
            let intSum = str.substring(0, str.indexOf('.')).replace(/\B(?=(?:\d{3})+$)/g, ',');
            let dot = str.substring(str.length, str.indexOf('.'));
            let ret = intSum + dot;
            return ret;
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    }
};
</script>

<style scoped lang="scss">
.branchContainer {
    font-size: 14px;
    color: #303133;
}
.btn-right {
    float: right;
    margin-left: 16px;
}
.c0088ff {
    color: #0088ff;
}

/deep/ .el-dialog {
    padding: 24px 0 20px 0;
}
/deep/ .el-dialog__header {
    text-align: center;
    padding: 0;
    .el-dialog__title {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
    }
}
/deep/ .el-dialog__body {
    text-align: center;
    padding: 0;
    margin: 10px 0 22px 0;
    color: #606266;
}
.btnStyle {
    color: #f05259;
    border: 1px solid #f05259;
    width: 95px;
}
/deep/ .ws-table-warp {
    padding: 0 !important;
}
</style>
