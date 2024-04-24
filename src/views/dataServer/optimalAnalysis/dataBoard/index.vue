<template>
    <div>
        <div class="content-style">
            <search
                :showRefreshData='true'
                :showBtn="Boolean(getModulePower(moduleName).board)"
                @handleClickRefresh="handleClickRefresh"
                ref="iSearch"/>
            <data-card :datas="datas"/>
        </div>
    </div>
</template>

<script>
import DataCard from "../../optimalAnalysis/components/data-card";
import Search from "../../optimalAnalysis/components/search";

export default {
    components: {Search, DataCard},
    data() {
        return {
            moduleName: "/dataServer/optimalAnalysis",
            op: {
                board: 'board'
            },
            searchParams: {
                channelId: null,
                timeStart: '',
                timeEnd: ''
            },
            orgType: 0,
            datas: {
                efficiency: '0',
                orderAmount: '0',
                receiveTime: '0',
                receiveDistance: '0',
            }
        }
    },
    created() {
        this.orgType = this.$baseMethod.getStore('roleOption') && this.$baseMethod.getStore('roleOption').orgType || 0
        // this.getCardData()
    },
    methods: {
        getCardData() {
            const op = this.op.board
            const data = {
                data: this.searchParams,
                op
            }
            const URL = this.getModuleUrl(op)
            this.$axios(URL, data).then(res => {
                if (res.code === 1) {
                    this.datas = JSON.parse(res.data)
                }
            })
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op)
        },
        handleClickRefresh(params) {
            this.searchParams = params
            this.getCardData()
        },
    }
}
</script>

<style lang="scss" scoped>
section div.content-style {
    height: auto;
    padding: 10px 40px;
    background-color: #fff;
    border-radius: 8px;
}
</style>
