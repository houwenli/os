<template>
    <div class="content-data-box">
        <div class="radioSearch">
            <div class="table-title">各时段订单数</div>
            <div style="min-width: 154px;">
                <el-radio-group v-model="tabType" size="medium" @change="tabChange">
                    <el-radio-button label="1">柱状图</el-radio-button>
                    <el-radio-button label="2">表单</el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <!--柱状图-->
        <div class="chart-box" v-if="tabType==1">
            <charts ref="changeDataOne" :setChartsOptions="timeOrder" :key="new Date().getTime()"></charts>
        </div>
        <!--表单-->
        <div class="chart-box" v-if="tabType==2">
            <ws-table-el ref="table" v-bind="tableConfigTwo" :data="lists"
                         style="margin-top:16px;padding:0px !important;" :header-cell-style="{ background: '#F5F7FA' }">
                <ws-table-column-el label="时段" prop='name'></ws-table-column-el>
                <ws-table-column-el label="支付订单数" prop='paidOrderCnt'></ws-table-column-el>
                <ws-table-column-el label="订单占比" prop='paidOrderCntRatio'></ws-table-column-el>
            </ws-table-el>
        </div>
    </div>
</template>

<script>
import charts from './charts.vue'
import {timeOrder} from './charts'
import countTo from "vue-count-to";

export default {
    components: {charts},
    props: {
        datas: {
            type: Array,
            default: () => {
            }
        }
    },
    data() {
        return {
            tableConfigTwo: {
                indexColumn: false,
                filterColumns: false,
                pagination: false,
                autoHeight: false,
            },
            tabType: 1,
            timeOrder: {},
            lists: {},
        };
    },
    watch: {
        datas: {
            handler(newVal, oldval) {
                if (newVal) {
                    this.lists = newVal;
                    if (newVal) {
                        this.init()
                    }
                }
            },
            deep: true,
            immediate: true
        }
    },
    created() {
    },
    mounted() {

    },
    methods: {
        init() {
            const timeList = []
            const paidOrderCntList = [] // 实付订单数
            const paidOrderCntRatioList = [] // 实付订单数 占比
            if (this.lists.length) {
                this.lists.forEach(item => {
                    timeList.push(item.name)
                    paidOrderCntList.push(item.paidOrderCnt)
                    paidOrderCntRatioList.push(item.paidOrderCntRatio)
                })
                this.timeOrder = timeOrder
                this.timeOrder.xAxis.data = timeList || []
                this.timeOrder.series[0].data = paidOrderCntList || []
                this.timeOrder.series[1].data = paidOrderCntRatioList || []
                this.$refs.changeDataOne.updateCharts(this.timeOrder)
            }
        },
        tabChange() {
        }
    }
};
</script>

<style lang="scss" scoped>
section div.content-data-box {
    height: auto;
    padding: 32px 40px;
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 16px;

    .title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        line-height: 22px;
        padding: 0 0 12px 0;
    }

    .radioSearch {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .table-title {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            display: flex;
        }
    }
}
</style>
