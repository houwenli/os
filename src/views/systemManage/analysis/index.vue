<template>
    <div class="analysis">
        <div class="analysisBox">
            <div class="content-style">
                <el-tabs class="tab-wrap" v-model="searchOptions.loginSystem" @tab-click="handleClick">
                    <el-tab-pane v-for="item in tabList" :label="item.resourcesName" :key="item.id" :name="item.id"></el-tab-pane>
                </el-tabs>
            </div>
            <div class="content">
                <div class="content_item">
                    <p class="secondTitle">未登录分布</p>
                    <div class="notLogged_content" v-loading="loadingNot">
                        <div class="notLogged_list">
                            <p v-for="(item,index) in notLoggedOption.series.data" :key="index">
                                <span>{{item.name}}</span>
                                <span>{{item.value}}人</span>
                            </p>
                        </div>
                        <div id="notLoggedChart"></div>
                    </div>
                </div>

                <div class="content_item" style="border-top: 1px solid #dcdfe6"></div>

                <div class="content_item searhContent">
                    <el-form class="formSearch">
                        <el-form-item label="选择时间：" prop="orgType" label-width="100px">
                            <ws-date-range :startTime.sync="searchOptions.startDay" type="daterange" :endTime.sync="searchOptions.endDay" valueFormat="yyyy-MM-dd" :intervalTime="31"></ws-date-range>
                        </el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                    </el-form>
                </div>

                <div class="content_item">
                    <p class="secondTitle">登录趋势图</p>
                    <div class="loginTrend">
                        <el-row :gutter="12" class="flex_content" v-loading="loadingSum">
                            <el-col :span="8">
                                <el-card shadow="always" class="always">
                                    <div class="a_title">登录总人数（人）</div>
                                    <p class="a_value">{{loginSum.userCnt || 0}}</p>
                                </el-card>
                            </el-col>
                            <el-col :span="8">
                                <el-card shadow="always" class="always">
                                    <div class="a_title">登录总次数（次）</div>
                                    <p class="a_value">{{loginSum.loginCnt || 0}}</p>
                                </el-card>
                            </el-col>
                            <el-col :span="8">
                                <el-card shadow="always" class="always">
                                    <div class="a_title">人均登录总次数（次）</div>
                                    <p class="a_value">{{loginSum.average || 0}}</p>
                                </el-card>
                            </el-col>
                        </el-row>
                        <div id="loginTrendChart" style="height: 340px" v-loading="loadingTrend"></div>
                    </div>
                </div>
                <div class="content_item">
                    <p class="secondTitle">登录排名（Top100）</p>
                    <div>
                        <el-form class="searchForm">
                            <el-form-item>
                                <el-radio-group v-model="searchOptions.deptType" @input="handleChange">
                                    <el-radio-button v-for="item in channelList" :key="item.id" :label="item.id">{{ item.label }}</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item :label="labelStr" prop="orgType" label-width="100px">
                                <el-select v-model="searchOptions.deptLevel" placeholder="请选择" style="width: 270px" @change="handleOrg">
                                    <el-option v-for="item in orgList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <ws-table-el ref="table" v-bind="tableConfig" :key="searchOptions.deptType">
                            <template>
                                <ws-table-column-el prop="deptName" :label="searchOptions.deptType == 1 ? '部门名称' : '机构名称'" style="max-width:700px"></ws-table-column-el>
                                <ws-table-column-el prop="deptUserCnt" :label="searchOptions.deptType == 1 ? '当前部门人数（人）' : '当前机构人数（人）'"></ws-table-column-el>
                                <ws-table-column-el prop="loginUserCnt" label="登录人数（人）"></ws-table-column-el>
                            </template>
                        </ws-table-el>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'analysis',
    data() {
        return {
            tabList: [],
            searchOptions: {
                startDay: this.$baseMethod.formatData(new Date().getTime() - 3600 * 24 * 30 * 1000, 'yyyy-MM-dd'),
                endDay: this.$baseMethod.formatData(new Date().getTime(), 'yyyy-MM-dd'),
                loginSystem: '1',
                deptType: '1',
                deptLevel: '2',
            },
            chartsNotLog:'',
            chartsLoginTrend:'',
            channelList: [
                { id: '1', label: '总部' },
                { id: '2', label: '分支机构' },
            ],
            orgList: [
                { id: '2', name: '一级部门' },
                { id: '3', name: '二级部门' },
                { id: '4', name: '三级部门' },
            ],
            loginSum:{
                userCnt:0,
                loginCnt:0,
                average:0,
            },

            //未登录总和
            notLoggedSum:0,
            moduleName:"",

            loadingNot:true,
            loadingSum:true,
            loadingTrend:true,

            clickNum:0,
            labelStr:'部门类型',

            tableConfig:{
                pageSizeList: [20, 50, 100],
                filterColumns: false,
                autoHeight:false,
                lazyQuery: {
                    moduleName: "",
                    op: {
                        selectList: "loginLogTop",
                    },
                },
                immediate: true
            },

            //登录趋势图echarts数据
            loginTrendOption: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        // 坐标轴指示器配置项。
                        type: 'cross', // 'line' 直线指示器  'shadow' 阴影指示器  'none' 无指示器  'cross' 十字准星指示器。
                        axis: 'auto', // 指示器的坐标轴。
                        snap: true, // 坐标轴指示器是否自动吸附到点上
                    },
                    showContent: true,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    textStyle: {
                        color: '#fff',
                    },
                    formatter: function (params) {
                        const unit = ['人','次','次']
                        let tip = params[0].name+'<br />'
                        if (params!=null&&params.length) {
                            for(let i=0;i<params.length;i++){
                                tip += `${params[i].marker}${params[i].seriesName}：${params[i].value}${unit[i]}<br />` 
                            }
                        }
                        return tip
                    },
                },
                legend: {
                    left: 24,
                    bottom: 24,
                    itemHeight: 4,
                    itemWidth: 10,
                    icon: 'rect',
                    textStyle: {
                        color: '#606266',
                        fontSize: 14,
                    },
                    y: 'top',
                    data: ['登录人数', '登录次数', '人均登录次数'],
                },
                grid: {
                    top: 50,
                    left: 24,
                    right: 24,
                    bottom: 24,
                    containLabel: true,
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    axisLine: {
                        lineStyle:{
                            color:"#DCDFE6"
                        }
                    },
                    axisLabel: {
                        color: '#606266',
                        fontSize: 12
                    },
                    data: []
                },
                yAxis: {
                    min: 0,
                    minInterval: 1, // 最小分割刻度
                    type: "value",
                    axisLabel: {
                        color: 'rgba(0, 0, 0, 0.45)',
                        fontSize: 12
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#DCDFE6'
                        }
                    }
                },
                series: [
                    {
                        name: '登录人数',
                        type: 'line',
                        symbolSize: 6, //设置折线上圆点大小
                        data: [],
                    },
                    {
                        name: '登录次数',
                        type: 'line',
                        symbolSize: 6, //设置折线上圆点大小
                        data: [],
                    },
                    {
                        name: '人均登录次数',
                        type: 'line',
                        symbolSize: 6, //设置折线上圆点大小
                        data: [],
                    },
                ],
                color:['#0BDBA8','#F3D01D','#FD571F']
            },

            //未登录echarts数据
            notLoggedOption:{
                title:{
                    text:'累计未登录人数',
                    subtext:'',
                    left:'center',
                    top:'42%',
                    textStyle:{
                        color:'#606266',
                        fontSize:'20',
                    },
                    subtextStyle:{
                        color:'#303133',
                        fontSize:'24',
                        fontWeight:'blod',
                        rich: {
                            a: {
                                fontsize: 16,
                            }
                        }
                    }
                },
                color: ['#254BE9','#0BDBA8','#F3D01D','#FD571F'],
                tooltip: {
                    backgroundColor:'rgba(0,0,0,0.7)',
                    borderWidth: 0 ,
                    textStyle:{
                        color:'#fff'
                    },
                    trigger: 'item',
                },
                legend: {
                    top: '60%',
                    right: '40',
                    orient:'vertical',
                    icon: "circle"
                },
                series: {
                    type: 'pie',
                    radius: ['52%', '82%'],
                    left: 'center',
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '14',
                            fontWeight: 'bold',
                        }
                    },
                    itemStyle: {
                        normal: {
                            "borderWidth": 2, // 间距的宽度
                            "borderColor": '#fff', //背景色
                            label:{
                                show: true,
                                // position: 'inner',
                                overflow:'none',
                                fontSize: 12,
                                fontWeight: 'bold',
                                align: "left",
                                formatter: function (p) { //指示线对应文字,百分比
                                    return p.data.name + ' ' + p.data.value + '人 ' + p.percent + '%'
                                }
                            }
                        }
                    },
                    data: [
                        { value: 0, name: '30-60天内未登录人数'},
                        { value: 0, name: '60-90天内未登录人数'},
                        { value: 0, name: '90-180天内未登录人数'},
                        { value: 0, name: '180天以上未登录人数'},
                    ]
                }
            },
        }
    },
    watch: {
        defaultMenuOptions: {
            deep: true,
            immediate: true,
            handler: function (newV) {
                let tabList = newV?.menuList.filter(item => item.resourcesUrl && item.category === 1);
                this.tabList = tabList.map(item => {
                    return { ...item, id: (item.resourcesUrl || '').split('&')[1] };
                });
                let resourcesUrl = (this.tabList[0] || {}).resourcesUrl
                this.moduleName = resourcesUrl
                this.tableConfig.lazyQuery.moduleName = resourcesUrl
                this.searchOptions.loginSystem = (resourcesUrl || '').split('&')[1]
            },
        },
    },
    methods: {
        //登录趋势总和数据
        async loginLogRangeSum() {
            const params = {
                data:JSON.stringify({
                    startDay:this.searchOptions.startDay,
                    endDay:this.searchOptions.endDay,
                    loginSystem:this.searchOptions.loginSystem
                }),
                op:'loginLogRangeSum'
            }
            try {
                const res = await this.$axios(this.getModuleUrl('loginLogRangeSum'),params)
                const data = JSON.parse(res.data)
                this.loginSum = data || {}
            } catch (error) {
                
            } finally {
                this.loadingSum = false
            }
        },

        //登录趋势图数据
        async loginLogTrend() {
            const params = {
                data:JSON.stringify({
                    startDay:this.searchOptions.startDay,
                    endDay:this.searchOptions.endDay,
                    loginSystem:this.searchOptions.loginSystem
                }),
                op: 'loginLogTrend',
            }
            try {
                const res = await this.$axios(this.getModuleUrl('loginLogTrend'),params)
                const data = JSON.parse(res.data)
                this.loginTrendOption.xAxis.data = data.xData || []
                this.loginTrendOption.series.forEach((item,index) => {
                    item.data = data.dataInfoList.length ? data.dataInfoList[index].data : []
                });
                this.chartsLoginTrend.setOption(this.loginTrendOption);
            } catch (error) {
            } finally {
                this.loadingTrend = false
            }
        },

        //未登录数据
        async unLoginLogDistribute() {
            const params = {
                data:{
                    loginSystem:this.searchOptions.loginSystem
                },
                op: 'unLoginLogDistribute',
            }
            try {
                const res = await this.$axios(this.getModuleUrl('unLoginLogDistribute'),params)
                const data = JSON.parse(res.data)
                this.notLoggedOption.series.data.forEach((item,index) => {
                    item.value = Object.values(data)[index] || 0
                    this.notLoggedSum = this.notLoggedSum + item.value
                });
                this.notLoggedOption.title.subtext = this.clickNum > 0 ? this.notLoggedSum + '{a|     名}' : this.notLoggedSum + '{a| 名}'
                this.chartsNotLog.setOption(this.notLoggedOption);
            } catch (error) {
            } finally {
                this.loadingNot = false
            }
        },

        handleChange (val){
            this.searchOptions.deptType = val
            this.searchOptions.deptLevel = "2"

            this.orgList = val == 2 ? [
                { id: '2', name: '一级机构' },
                { id: '3', name: '二级机构' },
                { id: '4', name: '实体店' },
            ] : [
                { id: '2', name: '一级部门' },
                { id: '3', name: '二级部门' },
                { id: '4', name: '三级部门' },
            ]
            this.labelStr = val == 2? '机构类型' : '部门类型'
            this.tableSearch()
        },
        handleOrg(val) {
            this.searchOptions.deptLevel = val
            this.tableSearch()
        },
        handleClick(val) {
            this.loadingNot = true,
            this.loadingSum = true,
            this.loadingTrend = true,

            this.moduleName = '/analysis&' + val.name
            this.tableConfig.lazyQuery.moduleName = '/analysis&' + val.name

            this.clickNum++
            this.notLoggedSum = 0

            this.search()
            this.unLoginLogDistribute()
        },
        search() {
            this.loadingSum = true,
            this.loadingTrend = true,

            this.loginLogRangeSum()
            this.loginLogTrend()
            this.tableSearch()
        },
        tableSearch() {
            this.$refs.table.search()
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
    created() {},
    mounted() {
        this.chartsNotLog = this.$echarts.init(document.getElementById('notLoggedChart'));
        this.chartsLoginTrend = this.$echarts.init(document.getElementById('loginTrendChart'));
        const that = this
        window.addEventListener("resize", function () {
            that.chartsNotLog.resize();
            that.chartsLoginTrend.resize();
        });
        this.unLoginLogDistribute()
        this.loginLogRangeSum()
        this.loginLogTrend()
    },
};
</script>
<style lang="scss" scoped>
/deep/.el-radio-button__inner {
  width: 92px;
}
/deep/.ws-table-warp {
    padding: 0 !important;
}
.analysisBox {
    background-color: #fff;
    padding: 20px 40px;
    .content-style {
        padding: 0px 40px !important;
        background-color: #fff;
        margin-bottom: 20px;
        .tab-wrap {
            ::v-deep > .el-tabs__header {
                display: flex;
                justify-content: center;
                margin-bottom: 0;

                .el-tabs__nav-wrap {
                    background-color: #f5f7fa;
                    border-radius: 4px 0px 0px 4px;

                    .el-tabs__active-bar {
                        width: 0 !important;
                    }

                    &::after {
                        width: 0;
                    }
                }

                .el-tabs__item {
                    width: 124px;
                    height: 40px;
                    text-align: center;
                    color: #606266;
                    padding: 0;

                    &.is-active {
                        background-color: #f05259;
                        color: #fff;
                        opacity: 1;
                    }

                    &.is-top:last-child {
                        border-radius: 0px 4px 4px 0px !important;
                    }
                }
            }

            ::v-deep .el-tabs__nav-wrap {
                display: inline-block;
                border-radius: 4px 4px 4px 4px !important;
            }
        }
    }
    .content {
        .content_item {
            margin-bottom: 30px;
            .searchForm {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .notLogged_content {
                padding: 20px 16px;
                border-radius: 8px;
                border: 1px solid #DCDFE6;
                display: flex;
                .notLogged_list {
                    width: 50%;
                    display: flex;
                    flex-direction: column;
                    height: 276px;
                    justify-content: space-between;
                    padding-right: 8px;
                    p {
                        padding: 20px 24px;
                        background-color: #F5F7FA;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        span:nth-of-type(1){
                            color: #606266;
                            width: 180px;
                        }
                        span:nth-of-type(2){
                            font-size: 16px;
                            font-weight: 600;
                        }
                    }
                }
                #notLoggedChart {
                    width: 50%;
                    height: 276px;
                }
            }
            .loginTrend {
                .flex_content {
                    text-align: center;
                    margin-bottom: 30px;
                    .a_title {
                        height: 22px;
                        font-size: 16px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        color: #303133;
                        line-height: 22px;
                    }
                    .a_value {
                        font-size: 48px;
                        font-family: DINAlternate-Bold, DINAlternate;
                        font-weight: bold;
                        color: #303133;
                        margin-top: 24px;
                        margin-bottom: 8px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }
        .searhContent {
            display: flex;
            justify-content: space-between;
            .formSearch {
                width: 100%;
                display: flex;
                justify-content: space-between;
                padding-top: 18px;
                padding-right: 16px;
                background: #f5f7fa;
                border-radius: 8px;
            }
        }
        .secondTitle {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 16px;
        }
    }
}
</style>
