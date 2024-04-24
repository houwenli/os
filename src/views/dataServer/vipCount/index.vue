<template>
    <div>
        <div class="vip-income-wrap">
            <template>
                <div class="content-vip-box">
                    <!-- 查询模块 -->
                    <div class="search_box" v-if="[0,4,5,20,30].includes(myOrg)">
                        <el-form :model="dataOptions" ref="ruleForm" inline label-width="100px" style="display: flex;justify-content: space-between;">
                            <el-form-item label="机构名称：">
                                <organization-all
                                    v-model="dataOptions.agencyNumber"
                                    ref="org" @orgTypeChange="orgTypeChange"
                                    :selectOptions="selectOptions" placeholder="请选择"
                                    :reqData="reqData"
                                    valueKey="agencyNumber"
                                    nameKey="orgName"
                                />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="searchData" icon="el-icon-search">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div>
                        <Analyse ref="treadAnalysis" v-if="powerList[ops.overview]" :searchParms="getParams()" :op="ops.overview"/>
                        <!-- 表格 -->
                        <template v-if="powerList[ops.detail] && [0,4,5,20,30].includes(myOrg)">
                            <!-- 大区分公司或者服务中心才显示表格，实体店隐藏表格 -->
                            <div v-if="[10,20,30].includes(+dataOptions.orgType) || !dataOptions.orgType">
                                <template>
                                    <div>
                                        <div class="clearfixTitle">会员数排名</div>
                                        <ws-table-el
                                            ref="table"
                                            style="margin-top: 16px; padding: 0px !important"
                                            v-bind="tableConfig"
                                            @sort-change="sortChange"
                                            align="left"
                                        >
                                            <ws-table-column-el align="center" prop="agencyName" label="机构名称"></ws-table-column-el>
                                            <ws-table-column-el v-if="[10,20,30].includes(+sureOrg) || [5,20,30].includes(+myOrg)" align="center" prop="agencyNumber" label="机构编码"></ws-table-column-el>
                                            <ws-table-column-el v-if="[20,30].includes(+sureOrg) || [20,30].includes(+myOrg)" align="center" prop="parentName" label="上级机构"></ws-table-column-el>
                                            <ws-table-column-el align="center" prop="sum" label="总会员数" sortable="custom" width = '110'>
                                                <template slot-scope="scope">
                                                    {{ thousandSeparator(scope.row.sum) }}
                                                </template>
                                            </ws-table-column-el>
                                            <ws-table-column-el align="center" v-for="(item,index) in tableCcolumn" :key="index" :label="item.label">
                                                <template slot-scope="scope">
                                                    {{ thousandSeparator(scope.row.cntList.filter(i=> i.vipGrade == item.value)[0].sum) }}
                                                </template>
                                            </ws-table-column-el>
                                        </ws-table-el>
                                    </div>
                                </template>                        
                            </div>
                        </template>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import Analyse from './analyse.vue'
import organizationAll from '@/components/Organization/organization-all'

const sortMap = {
    descending: 1,
    ascending: 2
}
export default {
    name: 'com',
    components: {
        organizationAll,
        Analyse
    },
    data () {
        return {
            moduleName: '/dataServer/vipCount',
            dataOptions: {
                agencyNumber: '',
                orgType: ''
            },
            reqData: {
                moduleName: '/dataServer/vipCount',
                op: 'selectOrgByOrgType',
                data: {isFilterGonghai: false, isStopOperation: true}
            },
            tableCcolumn: [],
            searchParms: null,
            tableConfig: {
                loading: true,
                autoHeight: false,
                lazyQuery: {
                    moduleName: '/dataServer/vipCount',
                    op: {
                        selectList: 'detail'
                    },
                    beforeQuery: this.beforeQuery,
                    afterQuery: this.afterQuery,
                    immediate: false
                },
                pageSizeList: [10, 20, 50],
                filterColumns: false
            },
            myOrg: this.$baseMethod.getStore('roleOption').orgType,
            sureOrg: '',
            sorted: 0,
            ops: {
                overview: 'overview',
                detail: 'detail'
            },
            orgLoading: false,
        }
    },
    mounted () {
        this.getInit()
    },
    computed: {
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
    created () {
    },
    methods: {
        // 查询
        searchData () {
            if(this.dataOptions.orgType && !this.dataOptions.agencyNumber){
                this.$message.error('请输入机构名称查询')
                return
            }
            this.getInit()
            this.sureOrg = this.dataOptions.orgType;
        },
        afterQuery(data) {
            let list = data.body
            this.tableCcolumn = []
            list.gradeList && list.gradeList.map(item=>{
                this.tableCcolumn.push({
                    label: item.gradeName, 
                    value: item.vipGrade
                });
            })
            this.$nextTick(() => {
                this.$refs.table && this.$refs.table.init();
            })
            return {
                ...data,
                body: data.body.dataList
            }
        },
        // 调用所有接口数据
        getInit () {
            this.getParams()
            setTimeout(() => {
                if (([0,4].includes(this.myOrg)||([20,30,5].includes(this.myOrg)))) {
                    this.$refs.table.search()
                }
            }, 100)
            setTimeout(() => {
                this.$refs.treadAnalysis && this.$refs.treadAnalysis.getDatas()
            }, 200)
        },
        orgTypeChange (val) {
            this.dataOptions.orgType = val
            this.$nextTick(() => {
                this.$refs.table && this.$refs.table.init();
            })
        },
        // 组装参数
        getParams () {
            let param = this.$baseMethod.deepClone(this.dataOptions)
            if (param.orgType && !param.agencyNumber) {
                param.orgType = null
            }
            this.searchParms = param
            return param
        },
        beforeQuery () {
            return {
                ...this.getParams(),
                sorted: this.sorted
            }
        },
        showTypeChange(){
            this.$refs.table.search()
        },
        sortChange ({order}) {
            if (order === null) {
                this.sorted = null
            } else {
                this.sorted = sortMap[order]
            }
            this.$refs.table.search()
        },
        // 添加千位符
        thousandSeparator (num) {
            var res
            if (num) {
                res = num.toString().replace(/\d+/, function (n) {
                    // 先提取整数部分
                    return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                        return $1 + ','
                    })
                })
            }
            return res || 0
        },
    }
}
</script>

<style lang="scss" scoped>
.vip-income-wrap {
    border-radius: 8px;
    padding: 20px 0px;
    background: #fff;
    width: 100%;
    height: 100%;
    .content-vip-box {
        padding: 14px 40px;
        background: #fff;
        border-radius: 8px;
        .search_box {
            margin: 0!important;
            padding: 20px 24px!important;
            background: #F5F7FA!important;
            border-radius: 8px!important;
            border: 1px solid #EBEEF5!important;
            .el-form>.el-form-item {
                margin-bottom: 0;
            }
        }
    }
}

.clearfixTitle {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
    margin: 32px 0 16px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
