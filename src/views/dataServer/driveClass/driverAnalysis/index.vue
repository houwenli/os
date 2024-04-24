<template>
    <div class="driveAna">
        <div class="back_box">
            <div class="searchBox" v-show="roleType!==40">
                <el-form ref="ruleForm" inline label-width="90px">
                    <template>
                        <el-form-item label="机构名称：" prop="agencyNumber">
                            <organization
                                v-model="agencyNumber"
                                :showSelect="true"
                                :selectOptions="selectOptions"
                                ref="orgSelect"
                                placeholder="请输入机构名称搜索"
                                valueKey="agencyNumber"
                                :reqData="reqData"
                                :orgType="orgType"
                                @orgTypeChange="(val) => {orgType = val}"
                            ></organization>
                        </el-form-item>
                    </template>
                </el-form>
                <div class="btn-box">
                    <ws-throttle>
                        <el-button v-if="powerList.overview || powerList.driverRank" class="query-btn" type="primary" icon="el-icon-search" @click="handelDistribute">查询</el-button>
                    </ws-throttle>
                </div>
            </div>
            <div class="distribute-ranking">
                <div class="distr" :class="{ noWrap: noWrap || isStore  }" v-if="powerList.overview">
                    <div class="title">未入网司机分布</div>
                    <div class="no-network" v-loading="distributeLoading">
                        <div class="txt-box">
                            <div class="item" v-for="(item, i) in regInfo" :key="i">
                                <span class="t">{{ item.name }}</span>
                                <span class="n">{{ item.value }} 人</span>
                            </div>
                        </div>
                        <div class="pie-charts-box">
                            <div id="pieCharts" style="height: 100%"></div>
                        </div>
                    </div>
                </div>
                <div class="ranking-box" v-if="powerList.driverRank && rankingShow">
                    <div class="title">未入网司机排名</div>
                    <div class="ranking" v-loading="rankingLoading">
                        <Ranking :datas="rankingList" />
                    </div>
                </div>
            </div>
        </div>
        <div class="back_box">
            <div class="searchBox">
                <el-form :model="dataOptions" ref="ruleForm" inline label-width="90px">
                    <template>
                        <el-form-item v-show="roleType!==40" label="机构名称：" prop="agencyNumber">
                            <organization
                                v-model="dataOptions.agencyNumber"
                                :showSelect="true"
                                :selectOptions="selectOptions"
                                :orgType="dataOptions.orgType"
                                ref="orgSelect"
                                placeholder="请输入机构名称搜索"
                                valueKey="agencyNumber"
                                :reqData="reqData"
                                @orgTypeChange="orgTypeChange"
                            ></organization>
                        </el-form-item>
                        <el-form-item label="时间：" prop="time">
                            <el-date-picker
                                v-model="dataOptions.months"
                                type="monthrange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始月份"
                                end-placeholder="结束月份"
                                :picker-options="pickerOptions"
                            ></el-date-picker>
                        </el-form-item>
                    </template>
                </el-form>
                <div class="btn-box">
                    <ws-throttle>
                        <el-button v-if="powerList.driverTrend" class="query-btn" type="primary" icon="el-icon-search" @click="handelTrend">查询</el-button>
                    </ws-throttle>
                </div>
            </div>
            <div v-if="powerList.driverTrend" class="title">未入网司机趋势图</div>
            <div v-if="powerList.driverTrend" class="charts_box" v-loading="trendLoading">
                <div id="trendCharts" style="height: 500px"></div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';

import organization from '@/components/orgSelect/organization-options.vue';
import { pieOption, lineOption } from './options'
import Ranking from './ranking.vue'

export default {
    name: 'driverAnalysis',
    components: { organization, Ranking },
    data() {
        return {
            orgType: '',
            agencyNumber: '',
            dataOptions: {
                orgType: '',
                agencyNumber: '',
                months: [new Date().setMonth(new Date().getMonth() - 5), new Date()],
            },
            regInfo: [
                { name: '注册30天内', value: 0 },
                { name: '注册31-60天内', value: 0 },
                { name: '注册61-90天内', value: 0 },
                { name: '注册91-180天内', value: 0 },
                { name: '注册180天以上', value: 0 }
            ],
            minDate: null,
            maxDate: null,
            pickerOptions: {
                shortcuts: [{
                    text: '今年至今',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date(new Date().getFullYear(), 0);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近六个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setMonth(start.getMonth() - 6);
                        picker.$emit('pick', [start, end]);
                    }
                },
                {
                    text: '最近一年',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setMonth(start.getMonth() - 12);
                        picker.$emit('pick', [start, end]);
                    }
                }],
                onPick: ({ maxDate, minDate }) => {
                    this.minDate = minDate;
                    this.maxDate = maxDate;
                },
                disabledDate: time => {
                    if (this.minDate !== null && this.maxDate === null) {
                        let minMonth = this.minDate.getMonth(),
                        lastYear = new Date(this.minDate).setMonth(minMonth - 12),
                        nextYear = new Date(this.minDate).setMonth(minMonth + 12);
                        let minTime = this.minDate.getTime()
                        let nextTime = new Date().setMonth(new Date().getMonth() + 12)
                        let lastTime = new Date().setMonth(new Date().getMonth() - 12)
                        if (minTime <= nextTime || minTime >= lastTime){
                            //开始日期少于当前月+12个月 并且大于当前月-12个月&#xff0c;则表示只限制前面的范围
                            return time.valueOf() > new Date().getTime() || time.valueOf() > nextYear.valueOf() || time.valueOf() < lastYear.valueOf()
                        } else {
                            // 只能选 minDate 前后一年的范围
                            return time.valueOf() < lastYear.valueOf() || time.valueOf() > nextYear.valueOf();
                        }
                    } else {
                        let date = new Date();
                        let year = date.getFullYear();
                        let month = date.getMonth() + 1;
                        if (month >= 1 && month <= 9) {
                            month = "0" + month;
                        }
                        let currentdate = year.toString()  + month.toString();

                        let timeyear = time.getFullYear();
                        let timemonth = time.getMonth() + 1;
                        if (timemonth >= 1 && timemonth <= 9) {
                            timemonth = "0" + timemonth;
                        }
                        let timedate = timeyear.toString() + timemonth.toString();
                        return currentdate < timedate;
                    }
                }
            },
            reqData: {
                op: 'selectOrgByOrgType',
                moduleName: '/dataServer/driverAnalysis'
            },
            moduleName: '/dataServer/driverAnalysis',
            op: {
                distribute: 'overview', // 分布op
                ranking: 'driverRank', // 排名op
                trend: 'driverTrend', // 趋势op
            },
            pieChart: null,
            distributeLoading: false,
            rankingLoading: false,
            rankingList: [],

            trendInfo: {
                xdata: [],
                linedata: [],
                bardata: []
            },
            trendChart: null,
            trendLoading: false,

            ro: null, // 监听页面变化对象
            roleType: 0, // 账户角色
            isStore: false, // 是否查询实体店数据

            noWrap: true, // 分布排名是否换行
        };
    },
    computed: {
        selectOptions() {
            let arr = [
                { value: '20', label: '城市分公司' },
                { value: '30', label: '区县分公司' },
                { value: '40', label: '实体店' }
            ]
            if (this.roleType === 20) {
                arr = [
                    { value: '30', label: '区县分公司' },
                    { value: '40', label: '实体店' }
                ]
            }
            if (this.roleType === 30) {
                arr = [
                    { value: '40', label: '实体店' }
                ]
            }
            return arr
        },
        rankingShow() {
            return this.roleType !== 40 && !this.isStore
        }
        
    },
    
    mounted() {
        this.roleType = (this.$baseMethod.getStore('roleOption') && this.$baseMethod.getStore('roleOption').orgType) || 0;
        this.$nextTick(() => {
            const pieChartDom = document.getElementById('pieCharts');
            this.pieChart = echarts.init(pieChartDom);
            this.setPieOption()

            const lineChartDom = document.getElementById('trendCharts');
            this.trendChart = echarts.init(lineChartDom);
            this.setLineOption()

        })
        this.handelDistribute()
        this.handelTrend()

        // 监听页面变化
        this.ro = new ResizeObserver((entries, observer) => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                this.noWrap = (this.roleType === 40) || (width < 1400);
                this.$nextTick(() => {
                    this.pieChart && this.pieChart.resize()
                    this.trendChart && this.trendChart.resize()
                })
            }
        });
        this.ro.observe(document.querySelector('.driveAna'));
    },
    beforeDestroy() {
        let dom = document.querySelector('.driveAna');
        if (dom) {
            this.ro.unobserve(dom);
        }
    },
    methods: {
        // 分布查询按钮
        handelDistribute() {
            this.orgType = this.agencyNumber ? this.orgType : ''
            this.powerList.overview && this.getDistribute()
            this.powerList.driverRank && this.getRanking()
        },
        // 获取未入网司机分布
        getDistribute() {
            this.distributeLoading = true
            const params = {
                data: {
                    orgType: this.agencyNumber ? this.orgType : '',
                    agencyNumber: this.agencyNumber
                },
                op: this.op.distribute
            }
            let URL = this.$getModuleUrl(this.moduleName, params.op)
            this.$axios(URL, params)
                .then(res => {
                    this.distributeLoading = false
                    let data = JSON.parse(res.data)
                    // console.log(data)
                    this.regInfo = [
                        { name: '注册30天内', value: data.register30DaysDriverCnt },
                        { name: '注册31-60天内', value: data.register30To60DaysDriverCnt },
                        { name: '注册61-90天内', value: data.register60To90DaysDriverCnt },
                        { name: '注册91-180天内', value: data.register90To180DaysDriverCnt },
                        { name: '注册180天以上', value: data.registerMoreThan180DaysDriverCnt }
                    ]
                    this.setPieOption()
                })
                .catch(err => {
                    this.regInfo = [
                        { name: '注册30天内', value: 0 },
                        { name: '注册31-60天内', value: 0 },
                        { name: '注册61-90天内', value: 0 },
                        { name: '注册91-180天内', value: 0 },
                        { name: '注册180天以上', value: 0 }
                    ]
                    this.distributeLoading = false
                });
        },
        // 设置饼图
        setPieOption() {
            let option = pieOption
            let sum = 0
            option.series[0].data = this.regInfo.map(item => {
                sum += item.value
                return item;
            })
            option.title.subtext = sum + '{a| 名}'
            this.pieChart && this.pieChart.setOption(option)
        },
        // 获取排名数据
        getRanking() {
            this.rankingLoading = true
            const params = {
                data: {
                    orgType: this.agencyNumber ? this.orgType : '',
                    agencyNumber: this.agencyNumber
                },
                op: this.op.ranking
            }
            let URL = this.$getModuleUrl(this.moduleName, params.op)
            this.$axios(URL, params)
                .then(res => {
                    this.isStore = this.orgType - 0 === 40
                    this.rankingLoading = false
                    let data = JSON.parse(res.data)
                    // console.log(data)
                    this.rankingList = data.map(item => {
                        return {
                            name: item.orgName,
                            value: item.driverCnt
                        }
                    })
                    this.$nextTick(() => {
                        this.pieChart && this.pieChart.resize()
                    })
                })
                .catch(err => {
                    this.rankingList = []
                    this.rankingLoading = false
                });
        },
        // 趋势查询按钮
        handelTrend() {
            const { orgType, agencyNumber, months } = this.dataOptions
            this.dataOptions = {
                orgType: agencyNumber ? orgType : '',
                agencyNumber,
                months
            }
            this.getTrend()
        },
        // 获取趋势图
        getTrend() {
            this.trendLoading = true
            const { orgType, agencyNumber, months } = this.dataOptions
            const params = {
                data: {
                    orgType: agencyNumber ? orgType : '',
                    agencyNumber,
                    dayStart: this.$baseMethod.formatData(months[0], 'yyyy-MM-dd'),
                    dayEnd: this.$baseMethod.formatData(months[1], 'yyyy-MM-dd')
                },
                op: this.op.trend
            }
            let URL = this.$getModuleUrl(this.moduleName, params.op)
            this.$axios(URL, params)
                .then(res => {
                    this.trendLoading = false
                    let data = JSON.parse(res.data)
                    // console.log(data)
                    let linedata = [],
                        bardata = []

                    data.dataInfoList.forEach(el => {
                        if (el.lend === '新增未入网司机量') {
                            bardata = el.data
                        }
                        if (el.lend === '累计未入网司机量') {
                            linedata = el.data
                        }
                    });
                    this.trendInfo = {
                        xData: data.xData,
                        linedata,
                        bardata
                    }
                    this.setLineOption()
                })
                .catch(err => {
                    this.trendInfo = {
                        xdata: [],
                        linedata: [],
                        bardata: []
                    }
                    this.trendLoading = false
                });
        },
        // 设置趋势图option
        setLineOption() {
            let option = lineOption
            const xdata = this.trendInfo.xData
            const linedata = this.trendInfo.linedata
            const bardata = this.trendInfo.bardata
            option.xAxis[0].data = xdata;
            option.series[0].data = bardata
            option.series[1].data = linedata
            this.trendChart && this.trendChart.setOption(option)
        },
        orgTypeChange(val) {
            this.dataOptions = {
                ...this.dataOptions,
                orgType: val
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.driveAna {
    .query-btn {
        margin-bottom: 18px;
    }
    .back_box {
        padding: 24px 30px;
        border-radius: 8px;
        background: #fff;
        margin-bottom: 16px;
    }
    .searchBox {
        display: flex;
        justify-content: space-between;
        background: #f5f7fa;
        border-radius: 8px;
        border: 1px solid #ebeef5;
        padding: 20px 16px 0;
    }
    .title {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #303133;
        line-height: 22px;
        margin: 24px 0 16px;
    }
    .no-network {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 8px;
        border: 1px solid #dcdfe6;
        padding: 20px;
        box-sizing: border-box;
        .txt-box {
            max-width: 440px;
            min-width: 310px;
            margin-right: 16px;
            flex: 1;
            .item {
                height: 70px;
                background: #f5f7fa;
                border-radius: 8px;
                margin-top: 12px;
                padding: 0 24px;
                display: flex;
                align-items: center;
                font-family: PingFangSC-Semibold, PingFang SC;
                &:first-of-type {
                    margin-top: 0;
                }
                .t {
                    width: 112px;
                    height: 20px;
                    font-size: 14px;
                    font-weight: 400;
                    color: #606266;
                    line-height: 20px;
                    margin-right: 16px;
                }
                .n {
                    height: 22px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #303133;
                    line-height: 22px;
                }
            }
        }
        .pie-charts-box {
            flex: 3;
            height: 399px;
            background: #ffffff;
            // border-radius: 8px;
            // border: 1px solid #dcdfe6;
            overflow: hidden;
        }
    }
    .ranking {
        background: #ffffff;
        border-radius: 8px;
        border: 1px solid #dcdfe6;
        height: 441px;
        box-sizing: border-box;
        overflow: hidden;
    }

    .distribute-ranking {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .distr {
            width: 800px;
            margin-right: 20px;
            &.noWrap {
                width: 100%;
                margin-right: 0;
            }
        }
        .ranking-box {
            flex: 1;
        }
    }
}
</style>
