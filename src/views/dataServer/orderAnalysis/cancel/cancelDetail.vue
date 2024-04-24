<template>
    <div class="cancel-detail">
        <div class="content-style">
            <el-row class="cancel-detail-title">
                <el-col :span="4">
                    <div class="grid-content bg-purple-dark">司机姓名：{{ row.driverName }}</div>
                </el-col>
                <el-col :span="4">
                    <div class="grid-content bg-purple-dark">司机ID：{{ row.driverId }}</div>
                </el-col>
                <el-col :span="4">
                    <div class="grid-content bg-purple-dark">手机号码：{{ row.driverPhone }}</div>
                </el-col>
                <el-col :span="4">
                    <div class="grid-content bg-purple-dark">车牌号：{{ row.carNum }}</div>
                </el-col>
                <el-col :span="4">
                    <div class="grid-content bg-purple-dark">所属机构：{{ row.orgName }}</div>
                </el-col>
            </el-row>
            <div class="table-style">
                <Table  :tableData="compliancelList"
                    :tableColumn="tableColumnOrderDetailed">
                </Table>
                <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="[10, 20, 50]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
            <div class="back">
                <el-button @click="back">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import Table from "../components/table"
import { tableColumnOrderDetailed } from '../utils'
import { mixins } from "../mixins"
export default {
    name: 'cancelDetail',
    mixins: [mixins],
    components: {
        Table,
    },
    data() {
        return {
            moduleName: '/dataServer/orderAnalysis/cancel',
            compliancelList: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            tableColumnOrderDetailed,
             stationNumber:null,
            searchOptions: {
                driverName: '',
                driverId: '',
                driverPhone: '',
                carNum: '',
                orgName: ''
            },
            currentUserInfo:JSON.parse(sessionStorage.getItem('roleOption')),
        };
    },

    created() {
        this.getOrder();
        this.currentUserInfo=JSON.parse(sessionStorage.getItem('roleOption'))
        if (this.currentUserInfo.orgType<20) {
            this.$router.push({ name: 'orderAnalysis', params: { activeName: 'todayAchievement' } })
        }
    },

    computed: {
        row() {
            return this.compliancelList[0] ?? {}
        }
    },

    methods: {
        getParams() {
                   console.log(this.$route.query,'拿到的query');
            const { dayStart, dayEnd, driverId , stationNumberList ,currentUserInfoId } = this.$route.query
            return {
                dayStart,
                dayEnd,
                driverId,
                stationNumberList:[stationNumberList],
                currentUserInfoId
            }
        },
        beforeQuery() {
            return this.searchOptions;
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        async getOrder() {
            try {
                const params = {
                    ...this.getParams(),
                    pageSize: this.pageSize,
                    pageNo: this.currentPage,
                    mongoId: this.compliancelList.at(-1)?.mongoId ?? '',
                }
                if (params.pageNo==1) {
                    params.mongoId=null
                }
                if (params.currentUserInfoId!=this.currentUserInfo.currentDepId&&this.currentUserInfo.currentDepId) {
                      this.$router.push({ name: 'orderAnalysis', params: { activeName: 'todayAchievement' } })
                }
                const { body = [], count = 0 } = await this.commonAjax('driverCancelDetail', params)
                this.compliancelList = body ?? []
                this.total = count
            } catch (err) {
                // throw err
                console.log(err);
            }
        },
        handleSizeChange(val) {
            this.currentPage = 1;
            this.compliancelList = []
            this.pageSize = val
            this.getOrder()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.getOrder()
        },
        back() {
            this.$router.push({ name: 'orderAnalysis', params: { activeName: 'cancel' } })
        }
    }
};
</script>

<style scoped lang="scss">
.cancel-detail-title {
    height: 76px;
    background: #fff;
    border-radius: 8px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    padding: 24px;
}

.content-style {
    height: auto;
    padding: 24px 40px 32px px;
    background-color: #fff;
    border-radius: 8px;
}

.table-style {
    padding: 24px;
}

.back {
    text-align: center;
    padding: 100px 0;
}

.page {
    margin-top: 20px;
    text-align: right;
    float: none;
}
</style>
