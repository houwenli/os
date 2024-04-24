<template>
    <div class="order-detailed">
        <div class="table-title-tips">合规明细数据</div>
        <div class="searchBox">
            <div class="left">
                选择机构：
                <el-cascader style="width: 270px" placeholder="请选择机构" v-model="relationId" filterable :props="props" clearable></el-cascader>
                <div class="day">
                    选择日期：
                    <el-date-picker
                        style="width: 270px"
                        v-model="dateTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                        @blur="blur"
                    ></el-date-picker>
                </div>
            </div>
            <div class="right">
                <ws-enter-event>
                    <el-button icon="el-icon-search" type="primary" @click="handleSearch" style="width: 96px">查询</el-button>
                </ws-enter-event>
                <ws-enter-event>
                    <el-button v-if="oaPower().upload" @click="exportExcel" style="width: 96px; color: #f05259; border: 1px solid #f05259">
                        <img width="17" style="vertical-align: middle" src="@/assets/order/icon_download.png" alt="" />
                        导出
                    </el-button>
                </ws-enter-event>
            </div>
        </div>
        <Table customClass="orderCntTable" :tableData="compliancelList" :tableColumn="tableColumnCompliance"></Table>
        <el-pagination
            class="page"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>
    </div>
</template> 
 
<script>
import { mapActions } from 'vuex';
import { tableColumnCompliance } from '../../../utils';
import Table from '../../../components/table';
import { mixins } from '../../../mixins';
export default {
    name: 'orderDetailed',
    mixins: [mixins],
    components: {
        Table,
    },
    data() {
        return {
            moduleName: '/dataServer/orderAnalysis/compliance',
            compliancelList: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            tableColumnCompliance,
            relationId: [],
            dateTime: [new Date(new Date().setDate(1)).format('yyyy-MM-dd'), new Date().format('yyyy-MM-dd')],
            minDate: '',
            props: {
                expandTrigger: 'click',
                value: 'number',
                label: 'name',
                checkStrictly: true,
                lazy: true,
                lazyLoad: this.lazyLoad,
            },
            pickerOptions: {
                onPick: ({ maxDate, minDate }) => {
                    this.minDate = minDate?.getTime();
                    //如果两个日期都选择 该变量就有值
                    if (maxDate) {
                        this.minDate = '';
                    }
                },
                disabledDate: time => {
                    if (this.minDate) {
                        const date = new Date(this.minDate);
                        const year = date.getFullYear();
                        let m = date.getMonth() + 1;
                        let d = new Date(year, m, 0).getDate();
                        m = m < 10 ? '0' + m : m;
                        d = d < 10 ? '0' + d : d;
                        const lastDay = new Date([year, m, d].join('-')); //月第一天
                        const firstDay = new Date(new Date(this.minDate).setDate(1)); //月最后一天
                        return time.getTime() > lastDay || time.getTime() < firstDay || time.getTime() > Date.now();
                    } else {
                        return time.getTime() > Date.now() || time < new Date('2022.1.1');
                    }
                },
            },
        };
    },

    created() {
        this.getOrder();
    },

    methods: {
        ...mapActions('orderAnalysis', ['getOrgs', 'getArea']),
        lazyLoad(node, resolve) {
            let item = node.data;
            if (!item) {
                if (this.userArea && this.userArea.region) {
                    resolve(this.userArea.region);
                } else {
                    this.getArea().then(res => {
                        res.region.forEach(item => {
                            if (this.orgType === 5) {
                                item.leaf = true;
                            }
                            if (this.orgType === 30) {
                                item.leaf = true;
                            }
                        });
                        resolve(res.region);
                    });
                }
            } else {
                if (item.leaf) {
                    resolve(item);
                    return;
                }
                // const params = item ? (item.type === 0 ? { bigRegionNumber: item.number } : { regionNumber: item.number }) : {};
                let params = {};
                if (item) {
                    if (item.type === 0) {
                        params = { bigRegionNumber: item.number };
                    }
                    if (item.type === 10) {
                        params = { regionNumber: item.number };
                    }
                    if (item.type === 20) {
                        params = { companyNumberList: [item.number] };
                    }
                    if (item.type === 30) {
                        params = { centerNumber: item.number };
                    }
                }
                this.getOrgs(params).then(result => {
                    result.forEach(item => {
                        if (this.orgType<10) {
                            item.leaf = item.type === 20;
                        }
                        if (this.orgType === 20) {
                            item.leaf = item.type === 40;
                        }
                        if (this.orgType === 30) {
                            item.leaf = false;
                        }
                    });
                    resolve(result);
                });
            }
        },
        getParams() {
            let param = {
                dayStart: this.dateTime[0],
                dayEnd: this.dateTime[1],
            };
            //总部
            if (this.orgType == 0) {
                param.bigRegionNumber = this.relationId[0];
                param.regionNumber = this.relationId[1];
                param.companyNumberList = this.relationId[2] ? [this.relationId[2]] : null;
            }
            if (this.orgType == 4) {
                param.bigRegionNumber = null;
                param.regionNumber = this.relationId[0];
                param.companyNumberList = this.relationId[1] ? [this.relationId[1]] : null;
            }
            if (this.orgType == 5) {
                param.bigRegionNumber = null;
                param.regionNumber = null;
                param.companyNumberList = this.relationId[0] ? [this.relationId[0]] : null;
            }
            //分公司
            if (this.orgType == 20) {
                param.centerNumber = this.relationId[0];
                param.stationNumber = this.relationId[1];
            }
            //服务中心
            if (this.orgType == 30) {
                param.stationNumber = this.relationId[0];
            }
            return param;
        },
        async getOrder() {
            try {
                // this.tableLoading = true;
                const params = Object.assign(this.getParams(), {
                    pageSize: this.pageSize,
                    pageNo: this.currentPage,
                });
                const { body, count } = await this.commonAjax('complianceOrderDetail', params);
                this.compliancelList = body;
                this.total = count;
                // this.tableLoading = false;
            } catch (err) {
                throw err;
            }
        },
        handleSearch() {
            this.getOrder();
        },
        exportExcel() {
            const reqData = {
                data: {
                    ...this.getParams(),
                },
                op: 'upload',
            };
            let URL = this.$getModuleUrl(this.moduleName, reqData.op);
            this.$axios(URL, reqData).then(res => {
                this.$message.success('文件正在导出，请到文件下载界面进行下载');
            });
        },
        handleSizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
            this.getOrder();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getOrder();
        },
        blur() {
            this.minDate = '';
        },
    },
};
</script>
 
<style scoped lang="scss">
.ws-table-warp {
    padding: 0 !important;
}

.searchBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f5f7fa;
    border-radius: 8px;
    border: 1px solid #ebeef5;
    height: 76px;
    padding: 0 24px;
    margin-bottom: 16px;

    .left {
        display: flex;
        align-items: center;

        .day {
            margin-left: 32px;
        }
    }
}

.page {
    width: 100%;
    background: #f5f7fa;
    border-radius: 0px 0px 8px 8px;
    text-align: right;
    float: none;
    padding: 10px;
}

.table-title-tips {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
    line-height: 22px;
    display: flex;
    margin-bottom: 16px;
}

.orderCntTable /deep/ .el-table {
    border-radius: 8px 8px 0 0;
}
</style>