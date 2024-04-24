<template>
    <div>
        <div class="bg-box">
            <div v-loading="loading" v-if="loading" element-loading-background="rgba(0, 0, 0, 0.1)" class="loading-box"></div>
            <!-- <refresh-title title="累计订单量" :latestUpdateTime="latestUpdateTime"></refresh-title>
            <div class="recharge_search_box">
                <el-form ref="ruleForm" inline label-width="54px">
                    <template>
                        <el-form-item label="时间：" prop="time">
                            <el-radio-group v-model="queryType" style="margin-right: 5px">
                                <el-radio-button v-for="item in timeButtonGroupList" :key="item.value" :label="item.value">{{ item.label }}</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </template>
                </el-form>
                <el-button-group>
                    <el-button class="query-btn" type="primary" @click="query()">查询</el-button>
                    <ws-throttle>
                        <el-button class="resetBtn" type="primary" icon="el-icon-refresh-left" @click="timeReset()"></el-button>
                    </ws-throttle>
                </el-button-group>
            </div>
            <data-board :dataConfig="orderDataBoardConfig" :dataInfo="dataObj"></data-board>
            <charts ref="orderQuantityChart" :setChartsOptions="orderQuantityChartOption"></charts> -->

            <!-- 平台供应商数量 -->
            <refresh-title title="平台供应商数量"></refresh-title>

            <div class="suppliers-number-content">
                <div class="board-list">
                    <el-row :gutter="16">
                        <el-col :span="12">
                            <div class="board-item">
                                <div class="board-title">累计入驻供应商数量</div>
                                <countTo class="board-number" :startVal="0" :decimals="0" :duration="1000" :endVal="Number(dataObj.becomeStorerNumber || 0)"></countTo>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="board-item">
                                <div class="board-title">审核中供应商数</div>
                                <countTo class="board-number" :startVal="0" :decimals="0" :duration="1000" :endVal="Number(dataObj.examineStorerNumber || 0)"></countTo>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="16">
                        <el-col :span="12">
                            <div class="board-item">
                                <div class="board-title">营业中供应商数</div>
                                <countTo class="board-number" :startVal="0" :decimals="0" :duration="1000" :endVal="Number(dataObj.businessStorerNumber || 0)"></countTo>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="board-item">
                                <div class="board-title">停业供应商数</div>
                                <countTo class="board-number" :startVal="0" :decimals="0" :duration="1000" :endVal="Number(dataObj.stopStorerNumber || 0)"></countTo>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="chart-content">
                    <charts ref="suppliersChart" :setChartsOptions="suppliersChartOption" height="100%"></charts>
                </div>
            </div>

            <!-- 商品数量分析 -->
            <refresh-title title="商品数量分析"></refresh-title>

            <div class="goods-number-list">
                <div v-for="(item, index) in goodsNumberList" :key="index" class="goods-number-item">
                    <div class="goods-title">{{ item.title }}</div>
                    <countTo class="goods-number" :startVal="0" :decimals="0" :duration="1000" :endVal="Number(dataObj[item.field] || 0)"></countTo>
                </div>
            </div>

            <div class="title">商家数据排名</div>
            <ws-table-el class="table-box" v-bind="tableConfig" ref="tableList" @sort-change="sortChange" :pagination="true" :autoHeight="false" :filterColumns="false" :multi="false">
            <!-- <ws-table-el :data="datalist" ref="tableList" @sort-change="changeSort" :filterColumns="false" :multi="true"> -->

                <template #search>
                    <el-form :inline="true">
                        <el-form-item label="运营模式：">
                            <el-select v-model="searchOptions.operationMode">
                                <el-option v-for="(item, index) in operationModeOption" :key="index" :label="item.label" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="商家名称：">
                            <el-input v-model.trim="searchOptions.storeName" maxlength="30" placeholder="请输入商家名称"></el-input>
                        </el-form-item>
                        <el-form-item label="商家账号：">
                            <el-input v-model.trim="searchOptions.storeAccount" maxlength="60" placeholder="请输入商家账号"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-button-group class="searchBtns">
                        <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                        <ws-throttle>
                            <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
                        </ws-throttle>
                        <ws-throttle><el-button class="query-btn query-btn-r" @click="exportExcel" v-if="powerList.exportStoreRanking">导出</el-button></ws-throttle>
                    </el-button-group>
                </template>
                <template>
                    <ws-table-column-el prop="storeName" label="商家名称"></ws-table-column-el>
                    <ws-table-column-el prop="storeAccount" label="商家账号" min-width="150"></ws-table-column-el>
                    <ws-table-column-el prop="operationMode" label="运营模式" min-width="150">
                        <template slot-scope="scope">
                            {{ scope.row.operationMode | operationModeFilter(operationModeOption)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="saleSpuNumber" label="在售SPU总量"></ws-table-column-el>
                    <ws-table-column-el prop="movingSpuNumber" label="动销SPU总量"></ws-table-column-el>
                    <ws-table-column-el prop="orderNumber" sortable="custom" label="下单数量" min-width="120"></ws-table-column-el>
                    <ws-table-column-el prop="payNumber" sortable="custom" label="支付数量" min-width="120"></ws-table-column-el>
                    <ws-table-column-el prop="salePriceNumber" sortable="custom" label="销售总额" min-width="120"></ws-table-column-el>
                    <ws-table-column-el prop="realBackPriceNumber" sortable="custom" label="退款总额" min-width="120"></ws-table-column-el>
                    <ws-table-column-el prop="afterOrderNumber" label="售后订单数" sortable="custom" min-width="120"></ws-table-column-el>
                    <ws-table-column-el prop="afterOrderRatio" label="订单售后率(%)" sortable="custom" min-width="140">
                        <template slot-scope="scope">{{ scope.row.afterOrderRatio }}%</template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="laterOrderNumber" label="延迟发货订单数" sortable="custom" min-width="150"></ws-table-column-el>
                    <ws-table-column-el prop="laterOrderRatio" label="延迟发货率(%)" sortable="custom" min-width="140">
                        <template slot-scope="scope">{{ scope.row.laterOrderRatio }}%</template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="feedbackRatio" sortable="custom" label="好评率" min-width="120">
                        <template slot-scope="scope">{{ scope.row.feedbackRatio }}%</template>
                    </ws-table-column-el>
                </template>
            </ws-table-el>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import refreshTitle from '../components/refreshTitle.vue' //带刷新功能的标题
import dataBoard from '../components/dataBoard.vue' //数据看板
import charts from '../retailersOnline/components/charts.vue'
import countTo from 'vue-count-to'
import { orderQuantityChartOption, suppliersChartOption } from '../retailersOnline/components/charts.js'
export default {
    components: { refreshTitle, dataBoard, charts, countTo },
    data() {
        return {
            tableConfig: {
                loading: true,
                lazyQuery: {
                    moduleName: '/dataServer/SupplierAnalysis',
                    op: {
                        selectList: 'pageStoreRanking'
                    }
                }
            },
            searchOptions: {
                storeName: '',
                storeAccount: '',
                sortType: 2,
                operationMode:''
            },
            dataObj: {},
            goodsNumberList: [
                {
                    title: '累计上架SPU总量',
                    field: 'shelfSpuNumber'
                },
                {
                    title: '在售SPU数',
                    field: 'saleSpuNumber'
                },
                {
                    title: '动销SPU数',
                    field: 'movingSpuNumber'
                },
                {
                    title: '在售SKU数',
                    field: 'saleSkuNumber'
                },
                {
                    title: '动销SKU数',
                    field: 'movingSkuNumber'
                }
            ],
            timeButtonGroupList:[
                {
                    value: 1,
                    label: "全部",
                },
                {
                    value: 2,
                    label: "今日",
                },
                {
                    value: 3,
                    label: "本周",
                },
                {
                    value: 4,
                    label: "本月",
                }
            ],
            orderQuantityChartOption, //订单量chart配置数据
            suppliersChartOption, //平台供应商chart配置数据
            moduleName: '/dataServer/SupplierAnalysis',
            loading: false,
            latestUpdateTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            queryType: 1,
            operationModeOption: [
                {
                    label: '全部',
                    id: ''
                },
                {
                    label: '平台抽成',
                    id: 2
                },
                {
                    label: '平台差额',
                    id: 1
                }
            ],
            orderDataBoardConfig:[
                {
                    title: '累计下单量',
                    field: 'orderNumber',
                },
                {
                    title: '累计支付订单量',
                    field: 'payNumber',
                },
                {
                    title: '累计售后订单量',
                    field: 'afterOrderNumber',
                }
            ]
        }
    },
    filters:{
        operationModeFilter(val,list){
            let obj = list.find(item=>{
                return item.id === val
            })
            return obj?obj.label:''
        }
    },
    mounted() {
        this.query()
    },
    methods: {
        sortChange({ column, prop, order }) {
            let sortType = {
                orderNumber_ascending: '1',
                orderNumber_descending: '0',
                payNumber_ascending: '3',
                payNumber_descending: '2',
                afterOrderNumber_ascending: '5',
                afterOrderNumber_descending: '4',
                afterOrderRatio_ascending: '7',
                afterOrderRatio_descending: '6',
                laterOrderNumber_ascending: '9',
                laterOrderNumber_descending: '8',
                laterOrderRatio_ascending: '11',
                laterOrderRatio_descending: '10',
                salePriceNumber_descending:'12',
                salePriceNumber_ascending:'13',
                realBackPriceNumber_descending:'14',
                realBackPriceNumber_ascending:'15',
                feedbackRatio_descending:'16',
                feedbackRatio_ascending:'17',
            }
            this.searchOptions.sortType = (sortType[`${prop}_${order}`] || 2) * 1
            this.$refs.tableList.search()
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op)
        },
    getChartData() {
      let params = {
        op: 'statisticsBySection',
        data: {
          queryType: this.queryType
        }
      }
      this.$axios('/wsf/statistics/select', params).then(res => {
        if (res.code === 1) {
          let data = JSON.parse(res.data)
          this.orderQuantityChartOption.xAxis.data = data.map(item => {
            return item.curryTime
          })
          this.orderQuantityChartOption.series[0].data = data.map(item => {
            return item.orderNumber || 0
          }) //累计下单量
          this.orderQuantityChartOption.series[1].data = data.map(item => {
            return item.payNumber || 0
          }) //累计支付订单量
          this.orderQuantityChartOption.series[2].data = data.map(item => {
            return item.afterOrderNumber || 0
          }) //累计售后订单量
          this.$refs.orderQuantityChart.updateCharts(this.orderQuantityChartOption)
        }
      }).catch(err => {
            console.error( err)
        })
        .finally(res => {
            this.loading = false
             // 查询完成-更新最近查询时间
            this.latestUpdateTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
        })
    },
    getBrandList() {
      let data = {
        op: 'statistics',
        data: {
          queryType: this.queryType
        }
      }
        this.$axios('/wsf/statistics/select', data).then(res => {
          //列表
          if (res.code === 1) {
            this.dataObj = JSON.parse(res.data)
            this.suppliersChartOption.series.data[0].value = this.dataObj.businessStorerNumber //营业中供应商数
            this.suppliersChartOption.series.data[1].value = this.dataObj.examineStorerNumber //审核中供应商数
            this.suppliersChartOption.series.data[2].value = this.dataObj.stopStorerNumber //停业供应商数
            this.suppliersChartOption.series.label.formatter = ['{a|累计入住供应商数量}', `{b|${this.dataObj.becomeStorerNumber}}`].join('\n') //累计入驻供应商数量
            this.$refs.suppliersChart.updateCharts(this.suppliersChartOption)
          }
        }).catch(err=>{
            console.error( err)
        })
    },
        // 导出
        async exportExcel() {
            const reqData = {
                data: { ...this.searchOptions },
                op: 'exportStoreRanking'
            }
            try {
                await this.$axios('/wsf/statistics/select', reqData)
                this.$message.success('文件正在导出，请到文件下载界面进行下载')
            } catch (error) {
                console.log(error)
            }
        },
        // 时间重置-查询总览和图表
        timeReset(){
            this.queryType = 1
            this.query()
        },
        reset() {
            this.searchOptions = {
                storeName: '',
                storeAccount: ''
            }
            this.$refs.tableList.reset()
        },
        query(){
            this.loading = true
            let timeText = this.timeButtonGroupList.find(item=>{
                return item.value === this.queryType
            }).label
            if(timeText === '全部') {
                timeText='累计'
            } 
            this.orderDataBoardConfig =  [
                {
                    title: `${timeText}下单量`,
                    field: 'orderNumber',
                },
                {
                    title: `${timeText}支付订单量`,
                    field: 'payNumber',
                },
                {
                    title: `${timeText}售后订单量`,
                    field: 'afterOrderNumber',
                }
            ]
            this.getBrandList()
            this.getChartData()
        },
        search() {
            if (isNaN(this.searchOptions.storeAccount)) {
                return this.$message.error('商家账号仅支持输入数字')
            }
            console.log(this.$refs.tableList)
            this.$refs.tableList.search()
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/.search-wrap {
    margin-bottom: 15px;
    padding: 20px 24px 0px 24px;
    justify-content: space-between;
}
.title {
    margin: 32px 0px 16px 0px;
    height: 22px;
    font-size: 16px;
    line-height: 22px;
    font-weight: 600; //待确认的样式
    color: #303133;
}
.table-box{
    .el-form-item {
        margin: 0px 32px 20px 0px !important;
    }
}
.bg-box {
    padding: 40px;
    background-color: #ffffff;
    border-radius: 8px;
    .recharge_search_box {
        display: flex;
        background: #f5f7fa;
        border-radius: 8px;
        border: 1px solid #ebeef5;
        justify-content: space-between;
        align-items: center;
        padding: 24px;
        margin: 25px 0px 16px 0px;
        .el-form-item {
            margin-bottom: 0px !important;
        }
    }
  
    .ws-table-warp {
        padding: 0px !important;

        .el-select, .el-input {
            width: 270px !important;
        }
    }
    .suppliers-number-content {
        width: 100%;
        border-radius: 8px;
        border: 1px solid #dcdfe6;
        padding: 16px 16px 4px 16px;
        margin: 21px 0px 40px 0px;
        display: flex;
    }
    .board-list {
        width: 60%;
    }
    .board-item {
        background: #f5f7fa;
        border-radius: 8px;
        border: 1px solid #f5f7fa;
        padding: 24px 0px;
        margin-bottom: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .chart-content {
        flex: 1;
    }
    .board-title {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #606266;
        margin-bottom: 12px;
        line-height: 20px;
    }
    .board-number {
        font-size: 24px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #303133;
        line-height: 28px;
    }
    .goods-number-list {
        display: flex;
        justify-content: space-between;
        margin: 16px 0px 0px 0px;
    }
    .goods-number-item {
        background: #f5f7fa;
        border-radius: 2px;
        padding: 8px 0px;
        width: 19%;
        text-align: center;
    }
    .goods-title {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #909399;
        line-height: 17px;
        margin-bottom: 4px;
    }
    .goods-number {
        font-size: 20px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #303133;
        line-height: 24px;
    }
}
.searchBtns {
    margin: 0px 0px 20px 0px;
}
.resetBtn {
    border-top-right-radius: 5px !important;
    border-bottom-right-radius: 5px !important;
}
.query-btn {
    width: 96px;
    margin-right: 0px;
    margin-left: 16px !important;
}
.query-btn-r {
    border: 1px solid #f05259;
    border-radius: 5px !important;
    color: #f05259;
}
.loading-box {
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
}
</style>
