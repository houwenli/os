<!--
 * @Author: DaiYu
 * @Date: 2022-03-28 18:06:21
 * @LastEditors: DaiYu
 * @LastEditTime: 2022-04-11 09:38:43
 * @FilePath: \main\src\views\workbench\baoganManage\components\operatingTable.vue
-->
<template>
    <ws-table-el ref="table" class="table" v-bind="tableConfig">
        <template>
            <ws-table-column-el align="center" prop="vipDays" label="包干套餐(天)"></ws-table-column-el>
            <ws-table-column-el align="center" prop="giveVipDays" label="赠送天数"></ws-table-column-el>
            <ws-table-column-el align="center" prop="actualPrice" label="标准价格(元)">
                <template slot-scope="scope">{{scope.row.actualPrice | regFenToYuan}}</template>
            </ws-table-column-el>
            <ws-table-column-el align="center" prop="discountRatio" label="优惠折扣"></ws-table-column-el>
            <ws-table-column-el align="center" prop="vipPricePer" label="折扣价(元)">
                <template slot-scope="scope">{{scope.row.vipPricePer | regFenToYuan}}</template>
            </ws-table-column-el>
            <ws-table-column-el align="center" prop="addPrice" :label="addType == 1? '加价(元)': '代驾价格(元)'">
                <template slot-scope="scope">{{scope.row.addPrice | regFenToYuan}}</template>
            </ws-table-column-el>
            <ws-table-column-el align="center" prop="actualVipPrice" label="实际售价(元)">
                <template slot-scope="scope">{{scope.row.actualVipPrice | regFenToYuan}}</template>
            </ws-table-column-el>
            <ws-table-column-el align="center" prop="updateUserName" label="修改/创建人"></ws-table-column-el>
            <ws-table-column-el align="center" prop="createTime" label="修改/创建时间"></ws-table-column-el>
        </template>
    </ws-table-el>
</template>

<script>
export default {
    name: 'OperatingTable',
    props: {
        moduleName: { type: String, required: true },
        addType: { type: Number, default: 1 }
    },
    data() {
        return {
            tableConfig: {
                emptyModel: true,
                filterColumns: false,
                autoHeight: false,
                layout: 'flow',
                lazyQuery: {
                    moduleName: this.moduleName,
                    op: {
                        selectList: 'log',
                        selectCount: 'logCount',
                    },
                    beforeQuery: this.beforeQuery,
                },
            },
        };
    },
    methods: {
        beforeQuery() {
            return {
                id: this.$route.query.id,
            };
        },
    },
};
</script>

<style lang='scss' scoped>
.table {
    padding: 0 !important;
    min-height: auto !important;
    /deep/ .option-box {
        margin: 0 !important;
    }
}
</style>
