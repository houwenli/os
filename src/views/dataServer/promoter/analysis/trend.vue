<template>
    <div class="prom-box">
        <div class="searchBox">
            <el-form :model="searchOptions" ref="ruleForm" inline label-width="90px">
                <template>
                    <el-form-item v-show="roleType !== 40" label="机构名称：" prop="agencyNumber">
                        <organization
                            v-model="searchOptions.agencyNumber"
                            :showSelect="true"
                            :selectOptions="selectOptions"
                            :orgType="searchOptions.orgType"
                            ref="orgSelect"
                            placeholder="请输入机构名称搜索"
                            valueKey="agencyNumber"
                            :reqData="reqData"
                            @orgTypeChange="orgTypeChange"
                        ></organization>
                    </el-form-item>
                    <el-form-item label="时间：" prop="time">
                        <el-date-picker
                            v-model="searchOptions.months"
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
                    <el-button class="query-btn" type="primary" icon="el-icon-search" @click="handelTrend">查询</el-button>
                </ws-throttle>
            </div>
        </div>
        <div class="title">
            推广员趋势图
            <el-tooltip class="item" effect="dark" placement="right">
                <div slot="content" style="line-height: 20px;">
                    本月推广员量：有效的平台推广员和车主推广员的汇总数。
                    <br />
                    推荐成功推广员量：有成功推荐用户充值、注册、下单、购买会员等的推广员数量，推广员数去重。
                </div>
                <img :src="iconQ" alt="">
            </el-tooltip>
        </div>
        <div class="charts_box" v-loading="trendLoading">
            <div id="trendCharts" style="height: 500px"></div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import { lineOption } from './options'
import { mixins } from './mixins'
import organization from '@/components/orgSelect/organization-options.vue';
import iconQ from '@/assets/images/icon_doubt@2x.png'

export default {
    name: 'Trend',
    mixins: [mixins],
    components: { organization },
    props: {},
    data() {
        return {
            searchOptions: {
                orgType: '',
                agencyNumber: '',
                months: [new Date().setMonth(new Date().getMonth() - 5), new Date()],
            },
            op: {
                trend: 'promoterTrend'
            },
            trendLoading: false,
            trendChart: null,
            trendInfo: {
                xdata: [],
                barone: [],
                bartwo: []
            },
            iconQ: iconQ
        }
    },
    mounted() {
        this.$nextTick(() => {
            const lineChartDom = document.getElementById('trendCharts');
            this.trendChart = echarts.init(lineChartDom);
            this.setLineOption()
        })
        this.handelTrend()
    },
    methods: {
        handelTrend() {
            const { orgType, agencyNumber, months } = this.searchOptions
            this.searchOptions = {
                orgType: agencyNumber ? orgType : '',
                agencyNumber,
                months
            }
            this.getTrend()
        },
        // 获取趋势图
        getTrend() {
            this.trendLoading = true
            const { orgType, agencyNumber, months } = this.searchOptions
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
                    let xdata = [],
                        barone = [],
                        bartwo = []

                    data.forEach(el => {
                        xdata.push(el.month)
                        barone.push(el.currentPromoterCnt)
                        bartwo.push(el.succeedPromoterCnt)
                    });
                    this.trendInfo = {
                        xdata,
                        barone,
                        bartwo
                    }
                    this.setLineOption()
                })
                .catch(err => {
                    this.trendInfo = {
                        xdata: [],
                        barone: [],
                        bartwo: []
                    }
                    this.trendLoading = false
                });
        },
        // 设置趋势图option
        setLineOption() {
            let option = this.$baseMethod.deepClone(lineOption);
            const {xdata, barone, bartwo } = this.trendInfo
            option.legend.data[0].name = '本月推广员量'
            option.legend.data[1].name = '成功推荐推广员量'
            option.series[0].name = '本月推广员量'
            option.series[1].name = '成功推荐推广员量'
            option.xAxis[0].data = xdata;
            option.series[0].data = barone
            option.series[1].data = bartwo
            this.trendChart && this.trendChart.setOption(option)
        },
        orgTypeChange(val) {
            this.searchOptions = {
                ...this.searchOptions,
                orgType: val
            }
        },
        resize() {
            this.trendChart && this.trendChart.resize()
        },
    },
};
</script>

<style lang="scss" scoped>
.title {
    margin: 25px 0 16px;
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
    line-height: 22px;
    img {
        display: inline-block;
        width: 24px;
        height: 24px;
        vertical-align: -7px;
    }
}
</style>
