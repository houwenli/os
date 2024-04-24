<template>
    <div>
        <div class="vip-income-wrap" :style="!queryTypeList.length ? 'height: 100%' : ''">
            <el-empty v-if="!queryTypeList.length" description="暂无数据"></el-empty>
            <template v-else>
                <div class="header">
                    <div class="radio_box" v-if="[0,4,5].includes(myOrg)">
                        <el-radio-group v-model="dataOptions.queryType" :border="false" @input="orgOptions = [];dataOptions.agencyNumber = '';dataOptions.orgType='';dataOptions.recommendType=0;getInit()" size="mini">
                            <el-radio-button v-if="powerList['0']" :label="'[' + JSON.parse( queryTypeList ) + ']'">全部</el-radio-button>
                            <el-radio-button v-if="powerList['1']" label="[1]">城市分公司收入</el-radio-button>
                            <el-radio-button v-if="powerList['2']" label="[2]">省级分公司收入</el-radio-button>
                            <el-radio-button v-if="powerList['3']" label="[3]">总部机构收入</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                <div class="content-vip-box">
                    <!-- 查询模块 -->
                    <div class="search_box">
                        <el-form :model="dataOptions" ref="ruleForm" inline label-width="100px">
                            <el-form-item label="机构名称：" v-if="myOrg != 40 && dataOptions.queryType == '[1]'">
                                <organization-all
                                    v-model="dataOptions.agencyNumber"
                                    ref="org" @orgTypeChange="orgTypeChange"
                                    :selectOptions="selectOptions" placeholder="请选择"
                                    :reqData="reqData"
                                    valueKey="agencyNumber"
                                    nameKey="orgName"
                                />
                            </el-form-item>

                            <el-form-item
                                label="推荐机构："
                                v-if="[0,4].includes(myOrg) && dataOptions.queryType!='[' + JSON.parse( queryTypeList ) + ']' && dataOptions.queryType!='[1]'"
                            >
                                <el-select
                                    v-model="dataOptions.agencyNumber"
                                    filterable
                                    clearable
                                    remote
                                    reserve-keyword
                                    placeholder="请输入名称查询"
                                    :remote-method="remoteMethod"
                                    :loading="orgLoading"
                                >
                                    <el-option v-for="item in orgOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="支付方式:" prop="payMode">
                                <el-select required v-model="dataOptions.payMode" style="width: 100%">
                                    <el-option v-for="item in payModeList" :key="item.id" :label="item.value" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <template v-if="![40].includes(+dataOptions.orgType)">
                                <el-form-item v-if="[20,30].includes(myOrg)||([20,30].includes(+dataOptions.orgType)&&dataOptions.agencyNumber)" label="推荐类型:" prop="recommendType">
                                    <el-select required v-model="dataOptions.recommendType" style="width: 100%">
                                        <el-option v-for="item in recommendTypeList" :key="item.id" :label="item.value" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
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
                                    :clearable="false"
                                ></el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="searchData" icon="el-icon-search">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div>
                        <Analyse ref="treadAnalysis" v-if="powerList[ops.treadAnalysis]" :searchParms="getParams()" :op="ops.treadAnalysis"/>
                        <!-- 表格 -->
                        <template v-if="[0,4].includes(myOrg) && powerList[ops.saleRank] || [20,30,5].includes(myOrg) && dataOptions.queryType == '[1]'">
                            <!-- 分公司或者服务中心只有下级推荐才显示表格，实体店隐藏表格 -->
                            <div v-if="!(([20,30].includes(+dataOptions.orgType)||([20,30].includes(+myOrg)))&&[0,1].includes(+dataOptions.recommendType))">
                                <template v-if="!([40].includes(+dataOptions.orgType)||([40].includes(+myOrg)))">
                                    <div v-show="isSearch">
                                        <div class="clearfixTitle">排名分析
                                            <div class="tableType" v-if="dataOptions.orgType=='20'||myOrg=='20'">
                                                <template v-if="dataOptions.orgType!=30">
                                                    <el-radio-group v-model="showType" :border="false" @input="showTypeChange">
                                                        <el-radio-button :label="1">区县分公司</el-radio-button>
                                                        <el-radio-button :label="2">实体店</el-radio-button>
                                                    </el-radio-group>
                                                </template>

                                            </div>
                                        </div>
                                        <ws-table-el
                                            ref="table"
                                            style="margin-top: 16px; padding: 0px !important"
                                            v-bind="tableConfig"
                                            @sort-change="sortChange"
                                            align="left"
                                        >
                                            <ws-table-column-el align="center" prop="agencyName" label="机构名称"></ws-table-column-el>
                                            <ws-table-column-el align="center" label="特许经营费" sortable="custom">
                                                <template slot-scope="scope">
                                                    {{ thousandSeparator(scope.row.amt / 100) }}
                                                </template>
                                            </ws-table-column-el>
                                            <ws-table-column-el align="center" label="总人数">
                                                <template slot-scope="scope">
                                                    {{ thousandSeparator(scope.row.driverCnt) }}
                                                </template>
                                            </ws-table-column-el>
                                            <ws-table-column-el align="center" label="总笔数">
                                                <template slot-scope="scope">
                                                    {{ thousandSeparator(scope.row.cnt) }}
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
import Card from '../components/card'
import Analyse from './analyse.vue'
import organizationAll from '@/components/Organization/organization-all'

const sortMap = {
    descending: 0,
    ascending: 1
}
export default {
    name: 'com',
    components: {
        organizationAll,
        Card,
        Analyse
    },
    data () {
        return {
            payMode: '1',
            moduleName: '/dataServer/vipIncome',
            queryTypeList: [],
            dataOptions: {
                agencyNumber: '',
                orgType: '',
                time: [],
                queryType: '', // 0/null-全部 1-城市 2-省区 3-总部机构
                payMode:1,
                recommendType:0
            },
            reqData: {
                moduleName: '/dataServer/vipIncome',
                op: 'selectOrgByOrgType',
                data: { isFilterGonghai: false }
            },
            searchParms: null,
            tableConfig: {
                loading: true,
                autoHeight: false,
                lazyQuery: {
                    moduleName: '/dataServer/vipIncome',
                    op: {
                        selectList: 'smartLifeVipSaleRank'
                    },
                    beforeQuery: this.beforeQuery,
                    immediate: false
                },
                pageSizeList: [5, 10, 20],
                filterColumns: false
            },
            pickerOptions: {
                disabledDate (time) {
                    let current = new Date(new Date().toLocaleDateString()).getTime() + (86400000 - 1000)
                    let fistTime = new Date('2022-01-01 00:00:00').getTime()
                    return time.getTime() > current || time.getTime() < fistTime
                }
            },
            myOrg: this.$baseMethod.getStore('roleOption').orgType,
            sorted: 0,
            ops: {
                overview: 'smartLifeVipOverView',
                treadAnalysis: 'smartLifeVipTreadAnalysis',
                saleRank: 'smartLifeVipSaleRank'
                // export: 'export'
            },
            orgLoading: false,
            isSearch: true,
            orgOptions: [],
            recommendTypeList:[
                {id:0,value:'全部推荐'},
                {id:1,value:'自身推荐'},
                {id:2,value:'下级推荐'}
            ],
            payModeList:[
                {id:0,value:'全部支付'},
                {id:1,value:'现金支付'},
                {id:2,value:'余额支付'}
            ],
            showType:1
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
        this.dataOptions.time = [this.$baseMethod.formatData(new Date().setDate(1)), this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd')]
        this.queryTypeList = JSON.stringify(Object.keys(this.powerList).filter(i=>[1,2,3].includes(+i)))
        this.dataOptions.queryType = '[' + JSON.parse( this.queryTypeList ) + ']';
    },
    methods: {
        // 查询
        searchData () {
            if(this.dataOptions.queryType == '[3]' && this.dataOptions.agencyNumber){
                this.isSearch = false
            }else {
                this.isSearch = true
            }
            this.getInit()
        },
        // 调用所有接口数据
        getInit () {
            this.getParams()
            setTimeout(() => {
                if (([0,4].includes(this.myOrg)||([20,30,5].includes(this.myOrg) && this.dataOptions.queryType == '[1]'))) {
                    if (!([20,30].includes(+this.dataOptions.orgType)&&[0,1].includes(+this.dataOptions.recommendType))) {
                        this.$refs.table.search()
                    }
                }
            }, 100)
            setTimeout(() => {
                this.$refs.treadAnalysis && this.$refs.treadAnalysis.getDatas()
            }, 200)
        },
        orgTypeChange (val) {
            this.dataOptions.recommendType = 0
            this.dataOptions.orgType = val
        },
        // 组装参数
        getParams () {
            let param = this.$baseMethod.deepClone(this.dataOptions)
            param.queryType = JSON.parse(param.queryType)
            if (this.dataOptions.time && this.dataOptions.time.length) {
                let [startDate, endDate] = this.dataOptions.time
                param.dayStart = startDate.substring(0, 10)
                param.dayEnd = endDate.substring(0, 10)
            }
            if (param.orgType && !param.agencyNumber) {
                param.orgType = null
            }
            if (([20,30].includes(this.myOrg)||[20,30].includes(+this.dataOptions.orgType))) {
                param.showType = this.showType
            }
            delete param.time
            this.searchParms = param
            return param
        },
        // 时间选择器改变
        handleTimeChange (data) {
            if (data) {
                if (new Date(data[1]) - new Date(data[0]) > 30 * 86400000) {
                    this.$message.error('日期最多选择31天！')
                    this.dataOptions.time = []
                    return
                }
            }
        },
        beforeQuery () {
            console.log(this.getParams())
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
        remoteMethod (key) {
            const reqData = {
                data: {orgName: key, orgType: this.dataOptions.queryType == '[3]' ? '0' :'10', isFilterGonghai: false},
                op: this.dataOptions.queryType == '[3]' ? 'selectAllOrgData' :'selectOrgByOrgType',
            };
            let URL = this.$getModuleUrl(this.moduleName, reqData.op);
            this.$axios(URL, reqData).then(res => {
                const result = JSON.parse(res.data)
                this.orgOptions = result.map(item => {
                    return {
                        value: item.agencyNumber,
                        label: item.orgName
                    }
                })
            });
        }
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
    .header {
        display: flex;
        padding: 0 40px;
        justify-content: space-between;
        align-content: center;
        margin-bottom: 20px;
    }
    .radio_box {
        text-align: center;
        // margin-bottom: 20px;

        /deep/ .el-radio-button__inner {
            padding: 12px 34px;
            border: none;
            background: #f0f2f5;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #606266;
        }

        /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
            background-color: #f05259;
            border-color: #f05259;
            box-shadow: -1px 0 0 0 #f05259;
            color: #ffffff;
        }
    }
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
