<template>
    <div class="data_form">
        <h2 class="flow_title">活动奖励</h2>
        <div :class="formData.activityType == 300 ? '' : 'gift_content'">
            <el-row class="form_line" v-if="formData.activityType !== 300">
                <el-col :span="item.span || 12" v-for="item in formConfig" :key="item.index">
                    <el-form-item v-if="item.show ? item.show(item, formData) : true">
                        <template #label v-if="formData.activityType == 200">
                            {{ item.label }}
                            <el-popover placement="top" width="200" trigger="hover" content="统计时间周期内，参与活动的司机最高日订单数">
                                <template #reference>
                                    <el-icon class="el-icon-question"></el-icon>
                                </template>
                            </el-popover>
                            {{ ': ' }}
                        </template>
                        <template #label v-else>
                            {{ `${item.label}：` }}
                        </template>
                        <p v-if="item.nodeHandle">{{ item.nodeHandle(item, formData) }}</p>
                        <span v-else>{{ formData[item.key] || '--' }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <ws-table-el v-bind="tableConfig" :data="formData[type]" :header-cell-style="{ background: '#F5F7FA' }">
                <template v-if="formData.activityType == 800">
                    <ws-table-column-el v-if="formData.rewardType == 0" prop="orderNum" label="累计完成订单"></ws-table-column-el>
                    <ws-table-column-el prop="rewardScore" label="奖励绩效分"></ws-table-column-el>
                    <ws-table-column-el prop="rewardMoney" label="奖励金额（元）">
                        <template slot-scope="scope">
                            {{ $baseMethod.regFenToYuan(scope.row.rewardMoney) }}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el v-if="formData.rewardType == 1" prop="rewardAmount" label="奖励总量"></ws-table-column-el>
                </template>
                <template v-if="formData.activityType == 200">
                    <ws-table-column-el prop="excessAmount" label="超额订单数"></ws-table-column-el>
                    <ws-table-column-el label="奖励内容">
                        <template slot-scope="scope">
                            <span>{{ scope.row.rewardContent | gradeContentFilters }}</span>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="rewardAmount" label="奖励金额（元）">
                        <template slot-scope="scope">
                            {{ $baseMethod.regFenToYuan(scope.row.rewardAmount) }}
                        </template>
                    </ws-table-column-el>
                </template>
                <template v-if="formData.activityType == 300">
                    <ws-table-column-el label="接单量(单)">
                        <template slot-scope="scope">
                            <span>{{ scope.row.receivingMinCount + ' ≤ 接单量 ≤ ' + scope.row.receivingMaxCount }}</span>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="rewardAmount" label="奖励金额（元）">
                        <template slot-scope="scope">
                            {{ $baseMethod.regFenToYuan(scope.row.rewardAmount) }}
                        </template>
                    </ws-table-column-el>
                </template>
                <template v-if="formData.activityType == 500">
                    <ws-table-column-el prop="finishDays" v-if="formData.finishOrderType == 2" label="完单阶段（天）"></ws-table-column-el>
                    <ws-table-column-el prop="excessAmount" label="完成订单数"></ws-table-column-el>
                    <ws-table-column-el prop="rewardAmount" label="奖励金额（元）">
                        <template slot-scope="scope">
                            {{ $baseMethod.regFenToYuan(scope.row.rewardAmount) }}
                        </template>
                    </ws-table-column-el>
                </template>
                <template v-if="formData.activityType == 700">
                    <ws-table-column-el prop="signInDays" label="累计签到天数"></ws-table-column-el>
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
    name: 'activityRewards',
    props: {
        formData: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        formConfig() {
            return {
                800: [
                    {
                        label: '奖励类型',
                        nodeHandle: (item, data) => {
                            let rewardType = {
                                0: '阶梯奖励',
                                1: '随机奖励',
                            }[data.rewardType];
                            return rewardType;
                        },
                    },
                    {
                        label: '完单数量',
                        key: 'riskTypeName',
                        show: (item, data) => {
                            return data.rewardType ? true : false;
                        },
                        nodeHandle: (item, data) => {
                            return data.orderNum;
                        },
                    },
                    {
                        label: '奖励次数上限',
                        key: 'rewardType',
                        show: (item, data) => {
                            return data.rewardType ? true : false;
                        },
                        nodeHandle: (item, data) => {
                            let timesLimitType = {
                                '-1': '不限',
                                0: '活动周期内奖励上限',
                                1: '每日奖励上限',
                            }[data.timesLimitType];
                            data.timesLimitType !== -1 ? (timesLimitType = `活动周期内最多奖励${data.rewardTimes}次`) : '';
                            return timesLimitType;
                        },
                    },
                ],
                200: [
                    {
                        label: '奖励周期',
                        nodeHandle: (item, data) => {
                            let statPeriod = {
                                5: '前3天',
                                1: '前7天',
                                2: '前30天',
                                3: '上周',
                                4: '上月',
                            }[data.statPeriod];
                            return statPeriod;
                        },
                    },
                ],
                500: [
                    {
                        label: '奖励周期',
                        nodeHandle: (item, data) => {
                            let finishOrderType = {
                                1: '周期完单奖励',
                                2: '阶段完单奖励',
                            }[data.finishOrderType];
                            return finishOrderType;
                        },
                    },
                    {
                        label: '完单周期（天）',
                        key: 'statPeriod',
                        show: (item, data) => {
                            return data.finishOrderType == 1 ? true : false;
                        },
                        nodeHandle: (item, data) => {
                            return data.statPeriod;
                        },
                    },
                ],
                700: [
                    {
                        label: '签到方式',
                        nodeHandle: (item, data) => {
                            let signInType = {
                                0: '完成订单',
                                1: '手动签到',
                            }[data.signInType];
                            return signInType;
                        },
                    },
                    {
                        label: '完单数量',
                        key: 'signInCondition',
                        show: (item, data) => {
                            return data.signInType ? false : true;
                        },
                        nodeHandle: (item, data) => {
                            return data.signInCondition;
                        },
                    },
                ],
            }[this.formData.activityType];
        },
    },
    filters: {
        gradeContentFilters: function (e) {
            let text;
            switch (e) {
                case 1:
                    text = '奖励金额';
                    break;
            }
            return text;
        },
    },
    data() {
        return {
            type: {
                200: 'growthRuleList',
                800: 'rewardRuleList',
                300: 'cdRuleList',
                500: 'finishRuleList',
                700: 'ruleList',
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
