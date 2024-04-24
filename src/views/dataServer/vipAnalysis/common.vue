<template>
    <div>
        <div class="mt-4" v-if="powerList[ops.overview]">
            <Card style="border: 1px solid #fff" :dataSet="overview" />
        </div>
        <div class="content-vip-box mt-4">
            <!-- 查询模块 -->
            <div class="search_box">
                <el-form :model="dataOptions" ref="ruleForm" inline label-width="100px">
                    <el-form-item label="机构名称：" v-if="myOrg != 40">
                        <organization-all v-model="dataOptions.agencyNumber" ref="org" @orgTypeChange="orgTypeChange" :selectOptions="selectOptions" placeholder="请选择" :reqData="reqData" valueKey="agencyNumber" nameKey="orgName" />
                    </el-form-item>
                    <el-form-item label="时间：">
                        <el-date-picker
                            v-model="dataOptions.time"
                            type="daterange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            @change="handleTimeChange"
                            :clearable="false">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="float: right">
                        <el-button type="primary" @click="searchData" icon="el-icon-search">查询</el-button>
                        <el-button @click="exportData" plain v-if="powerList[ops.export] && myOrg != 40 && tableFlag">
                            <img width="17" style="vertical-align: middle" src="@/assets/order/icon_download.png" alt="" />
                            导出
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div>
                <!-- 包干金额分析模块 -->
                <VipAmountAnalysis :searchParms="getParams()" ref="vipAmountAnalysis" v-if="powerList[ops.amountAnalysis]" :op="ops.amountAnalysis"></VipAmountAnalysis>
                <!-- 包干订单分析模块 -->
                <VipOrderAnalysis :searchParms="getParams()" ref="vipOrderAnalysis" v-if="powerList[ops.cntAnalysis]" :op="ops.cntAnalysis"></VipOrderAnalysis>
                <!-- 表格 -->
                <template v-if="myOrg != 40 && tableFlag && powerList[ops.saleRank]">
                    <p class="clearfixTitle">包干销售排名</p>
                    <ws-table-el ref="table" style="margin-top: 16px; padding: 0px !important;" v-bind="tableConfig" @currentChange="currentChange" @sort-change="sortChange" align="left">
                        <ws-table-column-el align="center" prop="agencyName" label="机构名称"></ws-table-column-el>
                        <template v-if="![0,4].includes(myOrg) || columnFlag">
                            <ws-table-column-el align="center" prop="agencyNumber" label="机构编码"></ws-table-column-el>
                            <ws-table-column-el align="center" prop="parentAgencyName" label="上级机构"></ws-table-column-el>
                        </template>
                        <ws-table-column-el align="center" label="包干金额" sortable="custom">
                            <template slot-scope="scope">
                                {{thousandSeparator(scope.row.amt/100)}}
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el align="center" label="退包金额">
                            <template slot-scope="scope">
                                {{thousandSeparator(scope.row.refundAmt/100)}}
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el align="center" label="包干净额">
                            <template slot-scope="scope">
                                {{thousandSeparator(scope.row.balance/100)}}
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el align="center" label="包干人数">
                           <template slot-scope="scope">
                                {{thousandSeparator(scope.row.driverCnt)}}
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el align="center" label="包干笔数">
                            <template slot-scope="scope">
                                {{thousandSeparator(scope.row.cnt)}}
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el align="center" label="退包笔数">
                           <template slot-scope="scope">
                                {{thousandSeparator(scope.row.refundCnt)}}
                            </template>
                        </ws-table-column-el>
                    </ws-table-el>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import VipOrderAnalysis from '../components/vipOrderAnalysis';
import VipAmountAnalysis from '../components/vipAmountAnalysis';
import Card from '../components/card';
import organizationAll from '@/components/Organization/organization-all';

const sortMap = {
    'descending': 0,
    'ascending': 1
}
export default {
    name: 'com',
    components: {
        VipOrderAnalysis,
        VipAmountAnalysis,
        organizationAll,
        Card
    },
    props: {
        ops: {
            type: Object,
            default: () => {
                return {
                    overview: 'overview',
                    amountAnalysis: 'amountAnalysis',
                    cntAnalysis: 'cntAnalysis',
                    saleRank: 'saleRank',
                    export: 'export'
                }
            }
        },
        category: {
            type: Number,
            default: 0
        }
    },
    inject: ["payType"],
    data() {
        return {
            moduleName: '/dataServer/vipAnalysis',
            dataOptions: {
                serviceType: 0,
                agencyNumber: '',
                orgType: '',
                time: [],
            },
            reqData: {
                moduleName: '/dataServer/vipAnalysis',
                op: 'selectOrgByOrgType',
                data: {isFilterGonghai: true}
            },
            searchParms: null,
            tableConfig: {
                loading: true,
                autoHeight: false,
                lazyQuery: {
                    moduleName: '/dataServer/vipAnalysis',
                    op: {
                        selectList: this.ops.saleRank // 'saleRank',
                    },
                    beforeQuery: this.beforeQuery,
                    immediate: false,
                },
                pageSizeList: [5, 10, 20],
                filterColumns: false,
            },
            pickerOptions: {
                disabledDate(time) {
                    let current = new Date(new Date().toLocaleDateString()).getTime() + (86400000 - 1000);
                    let fistTime = new Date('2022-01-01 00:00:00').getTime();
                    return time.getTime() > current || time.getTime() < fistTime;
                },
            },
            currentPage: 1,
            pageSize: 20,
            overview: {},
            myOrg: this.$baseMethod.getStore('roleOption').orgType,
            sorted: 0,
            tableFlag: true,
            columnFlag: true
        };
    },
    watch: {
        payMode() {
            this.getInit();
        }
    },
    mounted() {
        this.columnFlag = false;
        this.getInit();
    },
    created() {
        this.dataOptions.time = [this.$baseMethod.formatData(new Date().setDate(1)), this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd')];
    },
    computed: {
        payMode() {
            return this.payType()
        },
        selectOptions() {
            const getIndex = (org) => {
                if ([0, 4].includes(org)) {
                    return 0;
                }
                const map = {
                    5: 1, 20: 2, 30: 3
                }
                return map[org];
            }
            const allOrg = [
                {
                    value: '10',
                    label: '大区',
                },
                {
                    value: '20',
                    label: '城市分公司',
                },
                {
                    value: '30',
                    label: '区县分公司',
                },
                {
                    value: '40',
                    label: '实体店',
                }
            ];
            return allOrg.slice(getIndex(this.myOrg), allOrg.length);
        }
    },
    methods: {
        serviceTypeChange() {
            this.searchData()
        },
        // 查询
        searchData() {
            if (this.dataOptions.orgType == 40 && this.dataOptions.agencyNumber) {
                this.tableFlag = false;
            } else {
                this.tableFlag = true;
            }
            if (this.dataOptions.agencyNumber && this.dataOptions.orgType >= 10) {
                this.columnFlag = true;
            } else {
                this.columnFlag = false;
            }
            this.getInit();
        },
        // 调用所有接口数据
        getInit() {
            this.getParams();
            this.initDetail();
            setTimeout(() => {
                this.$refs.table.search();
            }, 100)
            setTimeout(() => {
                this.$refs.vipAmountAnalysis && this.$refs.vipAmountAnalysis.initOrderAmountDetail();
            }, 200)
            setTimeout(() => {
                this.$refs.vipOrderAnalysis && this.$refs.vipOrderAnalysis.initOrderAmountDetail();
            }, 300)
        },
        orgTypeChange(val) {
            this.dataOptions.orgType = val;
        },
        sortList() {
            this.sorted = this.sorted ? 0 : 1;
            this.$refs.table.search();
        },
        // 组装参数
        getParams() {
            let param = this.$baseMethod.deepClone(this.dataOptions);
            if (this.dataOptions.time && this.dataOptions.time.length) {
                let [startDate, endDate] = this.dataOptions.time;
                param.dayStart = startDate.substring(0, 10);
                param.dayEnd = endDate.substring(0, 10);
            }
            if (param.orgType && !param.agencyNumber) {
                param.orgType = null;
            }
            param.category = this.category
            param.payMode = this.payMode
            delete param.time;
            this.searchParms = param;
            return param;
        },
        initDetail() {
            let category = this.category
            if (category === 0) {
                const { overviewForWycVip, overviewForDjVip } = this.powerList
                category = []
                if (overviewForWycVip) category.push(1)
                // if (overviewForDjVip) category.push(3)
            } else {
                category = [category]
            }
            const reqData = {
                data: { category, payMode: this.payMode },
                op: this.ops.overview,
            };
            let URL = this.$getModuleUrl(this.moduleName, reqData.op);
            this.$axios(URL, reqData).then(res => {
                this.overview = JSON.parse(res.data);
            });
        },
        // 时间选择器改变
        handleTimeChange(data) {
            if (data) {
                if (new Date(data[1]) - new Date(data[0]) > 30 * 86400000) {
                    this.$message.error('日期最多选择31天！');
                    this.dataOptions.time = [];
                    return;
                }
            }
        },
        beforeQuery() {
            let category = this.category
            if (category === 0) {
                const { saleRankForWycVip, saleRankForDjVip } = this.powerList
                category = []
                if (saleRankForWycVip) category.push(1)
                // if (saleRankForDjVip) category.push(3)
            } else {
                category = [category]
            }
            return {
                ...this.getParams(),
                sorted: this.sorted,
                category
            };
        },
        currentChange(data) {
            this.currentPage = data.currentPage;
            this.pageSize = data.pageSize;
        },
        // 导出
        exportData() {
            let category = this.category
            const { orgType, agencyNumber } = this.dataOptions
            if (agencyNumber && orgType + '' === '40') {
                this.$message.error('实体店层次无排名数据！');
                return false
            }
            if (category === 0) {
                const { exportForWycVip, exportForDjVip } = this.powerList
                category = []
                if (exportForWycVip) category.push(1)
                // if (exportForDjVip) category.push(3)
            } else {
                category = [category]
            }
            const reqData = {
                data: {
                    ...this.getParams(),
                    category
                },
                op: this.ops.export,
            };
            let URL = this.$getModuleUrl(this.moduleName, reqData.op);
            this.$axios(URL, reqData).then(res => {
                this.$message.success('文件正在导出，请到文件下载界面进行下载');
            });
        },
        sortChange({ order }) {
            if (order === null) {
                this.sorted = null;
            } else {
                this.sorted = sortMap[order];
            }
            console.log(this.sorted)
            this.$refs.table.search();
        },
        // 添加千位符
        thousandSeparator(num){
            var res;
            if (num) {
                res = num.toString().replace(/\d+/, function (n) { // 先提取整数部分
                    return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                        return $1 + ",";
                    });
                })
            }
            return res || 0;
        },
    },
};
</script>

<style lang="scss" scoped>
.mt-4 {
    margin-top: 16px;
}
.content-vip-box {
    padding: 14px 40px;
    background: #fff;
    border-radius: 8px;
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
</style>
