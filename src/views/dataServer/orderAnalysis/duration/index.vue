<!--
 * @Author: CuteBoy
 * @Date: 2022-09-05 16:22:46
 * @Description: 时长分析
-->
<template>
    <div class="duration">
        <div class="table-title-tips">完单订单时长分布情况（指实时单）
            <el-tooltip class="item" effect="dark" placement="right">
                <div slot="content">
                    平均接单等待时长:（接单时间-下单时间）的和/完成行程订单总量，仅统计实时单，接单时间指最后一个司机接单时间；<br />
                    平均接驾等待时长:（到达乘客上车点时间-接单时间）的和/完成行程订单总量，仅统计实时单；<br />
                    平均等待乘客时长:（开始行程时间-到达乘客上车点时间）的和/完成行程订单总量，仅统计实时单；<br />
                </div>
                <img width="24" style="margin-left: 4px;" src="@/assets/order/icon_tips.png" alt="">
            </el-tooltip>
        </div>
        <search-column :showOrgSearch="false" :showDaySearch="true" @search="search">
            <template #custom>
                选择城市：
                <ws-city class="city" :data="cityData" v-model="city" level="2" :showCountry="true"
                    :defaultProps="{ checkStrictly: true }">
                </ws-city>
            </template>
        </search-column>
        <div id="duration-chart" ref="durationLineRef"></div>
    </div>
</template>
 
<script>
import SearchColumn from "../components/searchColumn"
import { mixins } from "../mixins"
import echarts from '../utils/echarts'
import { DURATION_LINE_OPTS } from '../utils/charts-options'
import { cloneDeep } from 'lodash-es'
export default {
    name: 'duration',
    mixins: [mixins],
    components: {
        SearchColumn,
    },

    data() {
        return {
            moduleName: "/dataServer/orderAnalysis/duration",
            myChart: null,
            city: [],
            cityData: []
        }
    },

    mounted() {
        this.initChart()
        this.getCityData()
    },

    methods: {
        initChart(startTime, endTime) {
            const dayStart = startTime ? startTime : this.$baseMethod.getBeforeDay(-6, 'yyyy-MM-dd', new Date())
            const dayEnd = endTime ? endTime : this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd', new Date())
            this.myChart = echarts.init(document.getElementById('duration-chart'));
            this.myChart.showLoading()
            let lineOption = cloneDeep(DURATION_LINE_OPTS)
            this.commonAjax('orderAnalysisByTime', {
                dayStart,
                dayEnd,
                cityCodeList: this.city.length > 0 ? this.getLocalType(this.city) : []
            }).then((data) => {
                if ('xData' in data) {
                    lineOption.xAxis.data = data.xData
                    //日期间隔超过15 rotate
                    const xData = data.xData
                    if (xData.length > 15) {
                        lineOption.xAxis.axisLabel.rotate = 40
                    }
                    lineOption.xAxis.data = xData;
                    lineOption.legend.data = data.lendList;
                    lineOption.legend.orient = 'horizontal';
                    lineOption.series = data.dataInfoList.map(item => {
                        return {
                            name: item.Lend,
                            type: 'line',
                            yAxisIndex: 0,
                            data: item.data,
                            smooth: false
                        };
                    });
                    this.myChart.setOption(lineOption)
                    this.myChart.hideLoading()
                }
            }).finally(() => {
                this.myChart.hideLoading()
            });
        },
        search(val) {
            let [startTime, endTime] = val.dateTime
            this.initChart(startTime, endTime)
        },
        getLocalType(code) {
            const len = code.length;
            if (len === 1) {
                return cloneDeep(this.cityData).filter((item) => {
                    return item.code == code[0]
                })[0].children.map(it => { return it.code })
            } else if (len === 2) {
                return [code[1]]
            } else {
                return []
            }
        },
        getCityData() {
            const url = '/web/common/select';
            const reqData = {
                data: {},
                op: 'authCityList'
            };
            this.$axios(url, reqData).then(
                ({ code, data }) => {
                    if (code == 1) {
                        this.cityData = JSON.parse(data)
                    }
                }
            );
        }
    },
}
</script>
 
<style scoped lang="scss">
.duration {
    .table-title-tips {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #303133;
        line-height: 22px;
        display: flex;
        margin-bottom: 16px;
    }

    .search-column {
        margin-bottom: 16px;
    }

    .city {
        margin-right: 32px;
    }
}

#duration-chart {
    width: 100%;
    height: 360px;
    margin-top: 24px;
}
</style>