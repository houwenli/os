<template>
    <div class="bg-page" :class="isFolder ? 'addWidth' : ''">
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
                    <label for>手机号码：</label>
                    <el-input v-model.trim="searchOptions.driverPhone" placeholder="请输入手机号码" clearable maxlength="11"></el-input>
                </search-group>
                <search-group>
                    <label for>类型：</label>
                    <el-select v-model="searchOptions.buyType" placeholder="请选择" collapse-tags clearable>
                        <el-option v-for="item in buyTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>支付类型：</label>
                    <el-select v-model="searchOptions.payWay" placeholder="请选择" collapse-tags clearable @change="payWayChange">
                        <el-option v-for="item in payWayFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>支付方式：</label>
                    <el-select v-model="searchOptions.payType" placeholder="请选择" multiple collapse-tags clearable no-data-text="请先选择支付类型">
                        <el-option v-for="item in payTypeOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>创建时间：</label>
                    <ws-date-range
                        type="daterange"
                        class="create-time"
                        :startTime.sync="searchOptions.createTimeBegin"
                        :endTime.sync="searchOptions.createTimeEnd"
                        :pickerOptions="{ disabledDate: null }"
                    ></ws-date-range>
                </search-group>
                <search-group>
                    <label for>包干城市：</label>
                    <ws-city v-model="registerCityCode" level="2"></ws-city>
                </search-group>
                <search-group>
                    <label for>支付时间：</label>
                    <ws-date-range
                        class="create-time"
                        :startTime.sync="searchOptions.payStartTime"
                        :endTime.sync="searchOptions.payEndTime"
                        :pickerOptions="{ disabledDate: null }"
                    ></ws-date-range>
                </search-group>
                <search-group>
                    <label for>状态：</label>
                    <el-select v-model="searchOptions.payStatus" placeholder="请选择" multiple collapse-tags clearable>
                        <el-option v-for="item in bgRunningFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>推荐机构：</label>
                    <div class="orgClass">
                        <el-select v-model="searchOptions.orgType" placeholder="请选择" class="orgType" @change="orgTypeChange">
                            <el-option label="省区" :value="0"></el-option>
                            <el-option label="总部机构" :value="1"></el-option>
                        </el-select>
                        <span>
                            <el-select v-model="searchOptions.referrerAgencyNumber" clearable placeholder="请选择推荐机构" class="orgSele">
                                <el-option v-for="item in orgOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
                            </el-select>
                        </span>
                    </div>
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
                <ws-throttle>
                    <el-button v-if="powerList[op.fileExport]" style="margin-left: 20px" class="ordermanage_el-button" @click="fileExport" plain>
                        导出
                    </el-button>
                </ws-throttle>
            </template>
            <template>
                <ws-table-column-el align="center" prop="orderId" label="业务单号"></ws-table-column-el>
                <ws-table-column-el align="center" prop="parentOrderId" label="关联业务单号">
                    <template slot-scope="scope">{{ scope.row.parentOrderId || '-' }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="driverId" label="用户ID"></ws-table-column-el>
                <ws-table-column-el align="center" prop="buyType" label="类型">
                    <template slot-scope="scope">{{ scope.row.buyType | buyTypeFilters }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="driverName" label="姓名"></ws-table-column-el>
                <ws-table-column-el align="center" prop="driverPhone" label="手机号码"></ws-table-column-el>
                <ws-table-column-el align="center" prop="cityName" label="城市"></ws-table-column-el>

                <ws-table-column-el align="center" prop="organizationName" label="推荐机构"></ws-table-column-el>
                <ws-table-column-el align="center" prop="recommendDriverPhone" label="推荐人手机号"></ws-table-column-el>

                <ws-table-column-el align="center" prop="purchaseVipDay" label="包干天数">
                    <template slot-scope="scope">{{ scope.row.parentOrderId && scope.row.orderStatus === 3 ? '-' : '+' }}{{ scope.row.purchaseVipDay }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="money" label="购买金额（元）">
                    <template slot-scope="scope">{{ scope.row.money == 0 ? '' : scope.row.parentOrderId && scope.row.orderStatus === 3 ? '-' : '+' }}{{ formatAmount(scope.row.money) }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="payWay" label="支付类型">
                    <template slot-scope="scope">{{ scope.row.payWay | payWayFilters }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="payType" label="支付方式">
                    <template slot-scope="scope">{{ scope.row.payType | smarterLifePayFilters }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="payStatus" label="状态">
                    <template slot-scope="scope">{{ scope.row.payStatus | bgRunningFilters }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="payTime" label="支付时间"></ws-table-column-el>
                <ws-table-column-el align="center" prop="createTime" label="创建时间"></ws-table-column-el>
                <ws-table-column-el align="center" label="操作" fixed="right" min-width="100">
                    <template slot-scope="scope">
                        <el-button v-if="powerList.detail || powerList.detailDecrypt" type="text" style="color: #0088ff" @click="detail(scope.row.orderId)">详情</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import tabs from '../components/tabs'
export default {
    components: { tabs },
    data() {
        return {
            isFolder: false,
            searchOptions: {
                buyType:'',
                orderId: '',
                driverPhone: '',
                cityCode: '',
                payType: [],
                payWay: '',
                payStatus: [],
                referrerAgencyNumber: '',
                createTimeBegin: this.$baseMethod.formatData(new Date().getTime() - 3600 * 24 * 7 * 1000, 'yyyy-MM-dd 00:00:00'),
                createTimeEnd: this.$baseMethod.formatData(new Date().getTime(), 'yyyy-MM-dd 23:59:59'),
                payStartTime: '',
                payEndTime: '',
                orgType: 0
            },
            registerCityCode: [],
            orderIds: [],
            type: null,
            title: '',
            tableConfig: {
                emptyModel: true,
                indexColumn: true,
                loading: true,
                filterColumns: false,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/workbench/baoganManage/wisdom/list',
                    op: {
                        selectList: 'list',
                        selectCount: 'count',
                        encryptList: 'listDecrypt'
                    },
                    beforeQuery: this.beforeQuery,
                    // afterQuery:this.afterQuery,
                    immediate: false
                }
            },
            moduleName: '/workbench/baoganManage/wisdom/list',
            dialogInfo: null,
            payMode: '',
            orgOptions: [],
            op: {
                fileExport: 'fileExport'
            },
            orgs: []
        }
    },
    computed: {
        ...mapState({
            baoganPayTypeFilters: state => state.baogan.baoganPayTypeFilters,
            bgRunningFilters: state => state.baogan.bgRunningFilters,
            relevanceFilters: state => state.baogan.relevanceFilters,
            payModeTypeFilters: state => state.baogan.payModeTypeFilters,
            buyTypeFilters: state => state.baogan.buyTypeFilters,
            payWayFilters: state => state.baogan.payWayFilters,
            smarterLifePayFilters: state => state.baogan.smarterLifePayFilters
        }),
        payTypeOptions() {
            const { payWay } = this.searchOptions
            if (payWay === 0) {
                return this.smarterLifePayFilters.slice(0, 6);
            }
            if (payWay === 1) {
                return this.smarterLifePayFilters.slice(6);
            }
            return []
        }
    },
    created() {
        this.getOrgs()
    },
    mounted() {
        this.search()
    },
    activated() {
        this.search()
    },

    methods: {
        // afterQuery(data) {
        //     data.body.forEach(item=> item['id']=item.orderId)
        //     return data;
        // },
        detail(id) {
            this.$router.push({ name: 'wisdomForm', query: { id, isEncrypt: this.$refs.table.isEncrypt } })
        },
        formatAmount(m) {
            return this.$baseMethod.regFenToYuan(m)
        },
        beforeQuery() {
            const { orderId, driverPhone, createTimeBegin, payStartTime } = this.searchOptions
            if (!(orderId || driverPhone || createTimeBegin || payStartTime)) {
                this.$message.error('请输入"业务单号" 或 "手机号码" 或 "创建时间" 或 "支付时间" 作为基本查询条件')
                return false
            }
            return this.getParams()
        },
        getParams() {
            const params = { ...this.searchOptions }
            const CityCode = this.registerCityCode
            params.cityCode = CityCode && CityCode.length ? CityCode[CityCode.length - 1] : null
            if (params.createTimeBegin) {
                params.createTimeBegin = this.$baseMethod.formatData(new Date(params.createTimeBegin), 'yyyy-MM-dd 00:00:00')
            }
            if (params.createTimeEnd) {
                params.createTimeEnd = this.$baseMethod.formatData(new Date(params.createTimeEnd), 'yyyy-MM-dd 23:59:59')
            }
            return params
        },
        search() {
            this.$refs.table.search()
        },
        reset() {
            this.searchOptions = {
                buyType:'',
                orderId: '',
                driverPhone: '',
                cityCode: '',
                payType: [],
                payWay: '',
                payStatus: [],
                referrerAgencyNumber: '',
                createTimeBegin: this.$baseMethod.formatData(new Date().getTime() - 3600 * 24 * 7 * 1000, 'yyyy-MM-dd 00:00:00'),
                createTimeEnd: this.$baseMethod.formatData(new Date().getTime(), 'yyyy-MM-dd 23:59:59'),
                payStartTime: '',
                payEndTime: '',
                orgType: 0
            }
            this.registerCityCode = []
            this.search()
        },

        changeWidth(isFolder) {
            this.isFolder = isFolder
        },
        // 查询省区下拉
        getOrgs() {
            const reqData = {
                data: {},
                op: 'getAllBigRegionList',
            };
            let URL = this.$getModuleUrl(this.moduleName, reqData.op);
            this.$axios(URL, reqData).then(res => {
                const result = JSON.parse(res.data)
                let arr1 = result.rpcBigRegionVoList || [],
                    arr2 = result.deptVoList || []
                this.orgs = [
                    arr1.map(item => {
                        return {
                            id: item.id,
                            value: item.name
                        }
                    }),
                    arr2.map(item => {
                        return {
                            id: item.id,
                            value: item.name
                        }
                    })
                ]
                this.orgTypeChange(this.searchOptions.orgType)
            });
        },
        orgTypeChange(e) {
            this.searchOptions = {
                ...this.searchOptions,
                referrerAgencyNumber: ''
            }
            this.orgOptions = this.orgs[e]
        },
        payWayChange() {
            this.searchOptions = {
                ...this.searchOptions,
                payType: []
            }
        },
        // 导出
        fileExport() {
            let param = {
                data: this.getParams(),
                op: this.op.fileExport
            };
            const url = this.$getModuleUrl(this.moduleName, param.op);
            this.$axios(url, param).then(res => {
                this.$message.success('导出中，请稍后到文件中心下载！');
            });
        }
    }
}
</script>

<style lang="scss" scoped>

.bg-page {
    display: flex;
    transition: 0.5s;
    .sidebar {
        flex: 1;
        margin-right: 14px;
    }
}
.bg-page /deep/ .ws-table-warp {
    border-radius: 0 0 8px 8px;
    padding: 24px !important;
    width: 89%;
}
.addWidth /deep/ .ws-table-warp {
    width: 92%;
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
.orgClass {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .orgType {
        width: 105px;
    }
    span {
        flex: 1;
        /deep/.orgSele {
            width: 100%;
        }
    }
}
</style>
