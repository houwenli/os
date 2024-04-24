<template>
    <div>
        <div v-loading="loading" v-if="loading" element-loading-background="rgba(0, 0, 0, 0.1)" class="loading-box"></div>
        <div class="recharge_box">
            <div class="time-query-box">
                <el-form ref="ruleForm" inline label-width="60px">
                    <el-form-item label="时间：" prop="time">
                        <el-radio-group v-model="timeType">
                            <el-radio-button v-for="item in timeButtonGroupList" :key="item.value" :label="item.value">{{ item.label }}</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <el-button-group>
                    <el-button class="query-btn" type="primary" @click="query()">查询</el-button>
                    <ws-throttle>
                        <el-button class="resetBtn" type="primary" icon="el-icon-refresh-left" @click="reset()"></el-button>
                    </ws-throttle>
                </el-button-group>
            </div>
            <!-- 登录统计分析 -->
            <data-board :dataConfig="loginStatisticsDataConfig" :dataInfo="dataObj"></data-board>
            <div class="chart_cont">
                <charts ref="loginChart" :setChartsOptions="loginChartOption"></charts>
            </div>

            <div class="divider"></div>

            <!-- 商品浏览分析 -->
            <data-board :dataConfig="goodsBrowseDataConfig" :dataInfo="dataObj"></data-board>
            <div class="chart_cont">
                <charts ref="goodsBrowseChart" :setChartsOptions="goodsBrowseChartOption"></charts>
            </div>
        </div>
    </div>
</template>

<script>
import charts from './charts.vue'
import dayjs from 'dayjs'
import refreshTitle from '../../components/refreshTitle.vue' //带刷新功能的标题
import dataBoard from '../../components/dataBoard.vue' //数据看板组件
import { loginChartOption, goodsBrowseChartOption } from './charts'
export default {
    name: 'userBehavior',
    components: { charts, refreshTitle, dataBoard },
    data() {
        return {
            timeType: 'today',
            loginChartOption,
            goodsBrowseChartOption,
            latestUpdateTime: '',
            loading: false,
            moduleName: '/userBehavior',
            timeButtonGroupList: [
                {
                    value: 'today',
                    label: '今日'
                },
                {
                    value: 'thisWeek',
                    label: '本周'
                },
                {
                    value: 'thisMonth',
                    label: '本月'
                }
            ],
            goodsBrowseDataConfig:[
                {
                    title: '今日被浏览宝贝',
                    field: 'browseGoodsCnt'
                },
                {
                    title: '今日被加入购物车宝贝',
                    field: 'addToCartGoodsCnt'
                },
                {
                    title: '今日被收藏宝贝',
                    field: 'collectGoodsCnt'
                }
            ],
            loginStatisticsDataConfig:[
            {
                    title: '今日总访客',
                    field: 'visitPeopleCnt'
                },
                {
                    title: '今日登录人数',
                    field: 'loginPeopleCnt'
                },
                {
                    title: '今日登录次数',
                    field: 'loginCnt'
                },
                {
                    title: '今日总点击',
                    field: 'clickCnt'
                }
            ],
            dataObj: {
                visitPeopleCnt: 0,
                loginPeopleCnt: 0,
                loginCnt: 0,
                clickCnt: 0,
                browseGoodsCnt: 0,
                addToCartGoodsCnt: 0,
                collectGoodsCnt: 0
            }
        }
    },

    mounted() {
        this.query()
    },
    methods: {
        // 查询总览数据
        selectData() {
            let params = {
                op: 'customerAnalysisOverview',
                data: {
                    queryTime: this.timeType
                }
            }
            let URL = this.$getModuleUrl(this.moduleName, params.op)
            this.$axios(URL, params).then(res => {
                if (res.code === 1) {
                    this.dataObj = JSON.parse(res.data)
                }
            }).catch(err => {
                console.error( err)
            })
        },
        // 查询趋势图数据
        selectChart() {
            let params = {
                op: 'customerAnalysisTrend',
                data: {
                    queryTime: this.timeType
                }
            }
            let URL = this.$getModuleUrl(this.moduleName, params.op)
            this.$axios(URL, params).then(res => {
                if (res.code === 1) {
                    let data = JSON.parse(res.data)
                    // 访问分析
                    this.loginChartOption.xAxis.data = JSON.parse(res.data).timeTrend
                    this.loginChartOption.series.forEach(item => {
                        item.data = data[item.field]
                    })
                    // 商品浏览分析
                    this.goodsBrowseChartOption.xAxis.data = JSON.parse(res.data).timeTrend
                    this.goodsBrowseChartOption.series.forEach(item => {
                        item.data = data[item.field]
                    })
                    this.$refs.loginChart.updateCharts(this.loginChartOption)
                    this.$refs.goodsBrowseChart.updateCharts(this.goodsBrowseChartOption)
                }
            })
            .catch(err => {
                console.error( err)
            })
            .finally(res => {
                this.loading = false
                // 查询完成-更新最近查询时间
                this.latestUpdateTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
            })
        },
        reset() {
            this.timeType = 'today'
            this.query()
        },
        query() {
            this.loading = true
            let timeLable = this.timeButtonGroupList.find(item => item.value === this.timeType).label
            this.goodsBrowseDataConfig = [
                {
                    title: `${timeLable}被浏览宝贝`,
                    field: 'browseGoodsCnt'
                },
                {
                    title: `${timeLable}被加入购物车宝贝`,
                    field: 'addToCartGoodsCnt'
                },
                {
                    title: `${timeLable}被收藏宝贝`,
                    field: 'collectGoodsCnt'
                }
            ]
            this.loginStatisticsDataConfig = [
            {
                    title: `${timeLable}总访客`,
                    field: 'visitPeopleCnt'
                },
                {
                    title: `${timeLable}登录人数`,
                    field: 'loginPeopleCnt'
                },
                {
                    title: `${timeLable}登录次数`,
                    field: 'loginCnt'
                },
                {
                    title: `${timeLable}总点击`,
                    field: 'clickCnt'
                }
            ]
            this.selectData()
            this.selectChart()
        }
    }
}
</script>

<style lang="scss" scoped>
.recharge_box {
    .time-query-box {
        display: flex;
        justify-content: space-between;
        background: #f5f7fa;
        border-radius: 8px;
        border: 1px solid #ebeef5;
        padding: 24px;
        margin: 25px 0px 16px 0px;
    }
    .el-form-item {
        margin: 0px;
    }
}
.loading-box {
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
}
.divider{
    width: 100%;
    height: 1px;
    border: 1px solid #DCDFE6;
    margin-bottom: 31px;
}
</style>
