<template>
    <div>
        <!--搜索-->
        <search
            :showBtn="Boolean(getModulePower(moduleName).selectOrderCompare)||Boolean(getModulePower(moduleName).selectOrderStatistics)||Boolean(getModulePower(moduleName).selectOrderCityRank)||Boolean(getModulePower(moduleName).selectOrderDistribution)||Boolean(getModulePower(moduleName).export)"
            @handleClickRefresh="handleClickRefresh"
            ref="iSearch"/>
        <!--订单对比分析-->
        <data-card :datas="datas" :searchParams="searchParams" v-if="oaPowerList.selectOrderCompare"/>
        <!--订单汇总统计-->
        <data-card-two :datas="orderDatas" :searchParams="searchParams" v-if="oaPowerList.selectOrderStatistics"/>
        <!--城市订单排行榜TOP20-->
        <city-ranking :datas="rankingDatas" v-if="oaPowerList.selectOrderCityRank && showList"/>
        <!--各时段订单数-->
        <period-order :datas="periodDatas" v-if="oaPowerList.selectOrderDistribution"/>
    </div>
</template>

<script>
import DataCard from "../../carLifeDataBoard/components/data-card";
import DataCardTwo from "../../carLifeDataBoard/components/data-card-two";
import CityRanking from "../../carLifeDataBoard/components/city-ranking";
import PeriodOrder from "../../carLifeDataBoard/components/period-order";
import Search from "../../carLifeDataBoard/components/search";

export default {
    components: {Search, DataCard, DataCardTwo, CityRanking, PeriodOrder},
    data() {
        return {
            moduleName: "/dataServer/carLifeDataBoard",
            op: {
                selectOrderCompare: 'selectOrderCompare',
                selectOrderStatistics: 'selectOrderStatistics',
                selectOrderCityRank: 'selectOrderCityRank',
                selectOrderDistribution: 'selectOrderDistribution',
                export: 'export',
            },
            searchParams: {
                channelId: null,
                timeStart: '',
                timeEnd: ''
            },
            orgType: 0,
            datas: {},
            orderDatas: {},
            rankingDatas: [],
            periodDatas: [],
            showList: false
        }
    },
    created() {
    },
    methods: {
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op)
        },
        handleClickRefresh(params) {
            let orderTypeList = params.orderTypeList;
            if (orderTypeList.includes('CHARGE') || orderTypeList.includes('OIL')) {
                this.showList = true
            } else {
                this.showList = false
            }
            this.searchParams = params
            if (this.oaPowerList.selectOrderCompare) {
                this.getSelectOrderCompare()
            }
            if (this.oaPowerList.selectOrderStatistics) {
                this.getSelectOrderStatistics()
            }
            if (this.oaPowerList.selectOrderCityRank) {
                this.getSelectOrderCityRank()
            }
            if (this.oaPowerList.selectOrderDistribution) {
                this.getSelectOrderDistribution()
            }
        },
        //订单对比分析
        getSelectOrderCompare() {
            const op = this.op.selectOrderCompare
            const data = {
                data: this.searchParams,
                op
            }
            const URL = this.getModuleUrl(op)
            this.$axios(URL, data).then(res => {
                if (res.code === 1) {
                    this.datas = JSON.parse(res.data)
                    // console.log(this.datas,"订单对比分析")
                }
            })
        },
        //订单汇总统计
        getSelectOrderStatistics() {
            const op = this.op.selectOrderStatistics
            const data = {
                data: this.searchParams,
                op
            }
            const URL = this.getModuleUrl(op)
            this.$axios(URL, data).then(res => {
                if (res.code === 1) {
                    this.orderDatas = JSON.parse(res.data)
                    // console.log(this.orderDatas,"订单汇总统计")
                }
            })
        },
        //城市订单排行榜TOP20
        getSelectOrderCityRank() {
            const op = this.op.selectOrderCityRank
            const data = {
                data: this.searchParams,
                op
            }
            const URL = this.getModuleUrl(op)
            this.$axios(URL, data).then(res => {
                if (res.code === 1) {
                    this.rankingDatas = JSON.parse(res.data)
                    console.log(this.rankingDatas, "城市订单排行榜TOP20")
                }
            })
        },
        //各时段订单数
        getSelectOrderDistribution() {
            const op = this.op.selectOrderDistribution
            const data = {
                data: this.searchParams,
                op
            }
            const URL = this.getModuleUrl(op)
            this.$axios(URL, data).then(res => {
                if (res.code === 1) {
                    this.periodDatas = JSON.parse(res.data)
                    // console.log(this.periodDatas,"各时段订单数")
                }
            })
        },
    }
}
</script>
<style lang="scss" scoped>
</style>
