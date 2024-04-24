<!-- 数据看板组件 -->
<template>
    <div>
        <ws-table-el ref="table" v-bind="tableConfig" :data="dataConfig" style="margin-top:16px;padding:0px !important;" :header-cell-style="{ background: '#F5F7FA' }">
            <ws-table-column-el label="支付方式" prop='title'>
                <template slot-scope="scope">
                    <span class="row-block" :style="{'background-color': payTypeFliter(scope.row.payType).color}"></span>
                    <span>{{ payTypeFliter(scope.row.payType).value }}</span>
                </template>
            </ws-table-column-el>
            <ws-table-column-el label="支付金额" prop='payMoney'>
                <template slot-scope="scope">
                    <count-to :startVal="0" :decimals="2" :duration="1000" :endVal="scope.row.payAmount | moneyFliter"></count-to>
                </template>
            </ws-table-column-el>
            <ws-table-column-el label="占比" prop='payRatio'>
                <template slot-scope="scope">
                    {{scope.row.rate || '0.00' }} %
                </template></ws-table-column-el>
        </ws-table-el>
    </div>
</template>

<script>
import { Big } from 'big.js'
import countTo from 'vue-count-to'
export default {
    components: { countTo },
    name: 'dataBoard',
    props: {
        dataConfig: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            tableConfig: {
                indexColumn: false,
                filterColumns: false,
                pagination: false,
                autoHeight: false,
            }
        }
    },
    methods: {
        payTypeFliter(val) {
            return [
                { color: '#254BE9', value: '微信支付', id: 1 },
                { color: '#0BDBA8', value: '支付宝支付', id: 2 },
                { color: '#F3D01D', value: '余额支付', id: 3 },
                { color: '#FF9B00', value: '线下打款', id: 4 },
                { color: '#FD571F', value: '福气值支付', id: 5 },
            ].filter(todo => todo.id == val)[0] || {};
        }
    },
    filters: {
        moneyFliter(val) {
            if (!val) {
                return 0
            } else {
                return Number( new Big(val || 0).div(100))
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.view_box {
    height: 108px;
    background: #f5f7fa;
    border-radius: 8px;
    display: flex;
    width: 100%;
    margin: 0px 0px 24px 0px;
    .view_cont {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .title {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #606266;
            margin-bottom: 12px;
            line-height: 20px;
        }
        .number {
            font-size: 24px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #303133;
            line-height: 28px;
        }
    }
}
.row-block {
    display: inline-block;
    height: 8px;
    width: 10px;
    margin-right: 6px;
}
</style>
