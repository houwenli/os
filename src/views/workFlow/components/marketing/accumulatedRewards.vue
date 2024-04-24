<template>
    <div class="data_form">
        <h2 class="flow_title">累计奖励</h2>
        <div>
            <ws-table-el v-bind="tableConfig" :data="formData[type]" :header-cell-style="{ background: '#F5F7FA' }">
                <template v-if="formData.activityType == 700">
                    <ws-table-column-el prop="signInTotalDays" label="累计签到天数"></ws-table-column-el>
                    <ws-table-column-el prop="orderTotalNum" label="累计完成订单"></ws-table-column-el>
                    <ws-table-column-el prop="orderTotalMoney" label="累计订单总金额（元）">
                        <template slot-scope="scope">
                            {{ $baseMethod.regFenToYuan(scope.row.orderTotalMoney) }}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="rewardScore" label="奖励绩效分"></ws-table-column-el>
                    <ws-table-column-el prop="rewardMoney" label="奖励金额（元）">
                        <template slot-scope="scope">
                            {{ $baseMethod.regFenToYuan(scope.row.rewardMoney) }}
                        </template>
                    </ws-table-column-el>
                </template>
            </ws-table-el>
        </div>
    </div>
</template>

<script>
export default {
    name: 'accumulatedRewards',
    props: {
        formData: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            type: {
                700: 'ruleTotalList',
            }[this.formData.activityType],
            tableConfig: {
                filterColumns: false,
                indexColumn: false,
                pagination: false,
            },
        };
    },
};
</script>

<style lang="scss" scoped>
@import '../comm.scss';

.gift_content {
    padding: 16px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
}

.form_line {
    margin-bottom: 16px;
}
</style>
