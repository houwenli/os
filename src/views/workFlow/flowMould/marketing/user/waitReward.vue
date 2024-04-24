<template>
    <!-- 营销活动 等待奖励 -->
    <el-form class="flow_form" :inline="true" label-width="140px" :model="dataObject">
        <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <activityCity :formData="dataObject" />
        <activityCrowd :formData="dataObject" />
        <dataForm v-for="item in confingList(2, activtyConfig.length - 1)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <activityGift :formKeys="giftKeys" :formData="dataObject.activityPacks" />
    </el-form>
</template>

<script>
import activityCrowd from '../../../components/marketing/activityCrowd.vue';
import activityCity from '../../../components/marketing/activityCity.vue';
import dataForm from '../../../components/dataForm.vue';
import activityGift from '../../../components/marketing/activityGift';
import { ACTIVITY_TYPE, SERVE_TYPE, PARTICIPATE_CONDITION } from '@/utils/enum';
import { marketing } from '../../../mixin';
export default {
    name: 'waitReward',
    components: { dataForm, activityCrowd, activityCity, activityGift },
    props: {
        dataObject: {
            type: Object,
            default: () => {},
        },
    },
    mixins: [marketing],
    data() {
        return {
            activtyConfig: [
                {
                    title: '审批发起信息',
                    formConfig: [
                        {
                            label: '审批编号',
                            key: 'procdefNo',
                        },
                        {
                            label: '审批类型',
                            key: 'name',
                        },
                        {
                            label: '发起时间',
                            key: 'startTime',
                        },
                        {
                            label: '发起人',
                            key: 'startUserName',
                        },
                        {
                            label: '所属部门',
                            key: 'startDeptName',
                        },
                    ],
                },
                {
                    title: '基础信息',
                    formConfig: [
                        {
                            label: '活动类型',
                            key: 'activityType',
                            nodeHandle: (item, data) => {
                                let val = data[item.key];
                                return this.getEnumVal(ACTIVITY_TYPE, val);
                            },
                        },
                        {
                            label: '活动名称',
                            key: 'activityName',
                        },
                        {
                            label: '活动时间',
                            key: ['activityStartDate', 'activityEndDate'],
                            nodeHandle: (item, data) => {
                                let val = item.key;
                                return data[val[0]] && data[val[1]] && `${data[val[0]]} ~ ${data[val[1]]}`;
                            },
                        },
                        {
                            label: '活动优先级',
                            key: 'priority',
                        },
                    ],
                },
                {
                    title: '活动规则',
                    formConfig: [
                        {
                            label: '服务类型',
                            key: 'serveType',
                            nodeHandle: (item, data) => {
                                let val = data[item.key];
                                return (this.getEnumVal(SERVE_TYPE, val) || '').toString();
                            },
                        },
                        {
                            label: '奖励条件限制',
                            key: 'rewardCondRestrictionType',
                            nodeHandle: (item, data) => {
                                let val = data[item.key];
                                return val === 0 ? '不限' : `限制订单预估金额 ${data.limitAmount / 100}元`;
                            },
                        },
                        {
                            label: '活动参与次数',
                            key: 'limitCount',
                            nodeHandle: (item, data) => {
                                let val = data[item.key];
                                let type = data['limitCountType'];
                                let copywriting;
                                switch (type) {
                                    case 0:
                                        copywriting = '不限';
                                        break;
                                    case 1:
                                        copywriting = `活动周期内可参与${val}次`;
                                        break;
                                    case 2:
                                        copywriting = `每月可参与${val}次`;
                                        break;
                                    case 3:
                                        copywriting = `每周可参与${val}次`;
                                        break;
                                    case 4:
                                        copywriting = `每日可参与${val}次`;
                                        break;
                                }
                                return copywriting;
                            },
                        },
                    ],
                },
                {
                    title: '风控配置',
                    formConfig: [
                        {
                            label: '活动风险类型',
                            nodeHandle: (item, data) => {
                                let val = data['riskAndSets'];
                                let { activityRiskType } = val[0] || {};
                                let res = this.riskAndSets.filter(item => item.riskTypeId === activityRiskType)
                                return res.length > 0 ? res[0].riskTypeName : '不限';
                            },
                        },
                        {
                            label: '参与配置',
                            key: 'riskTypeName',
                            show: (item, data) => {
                                let val = data['riskAndSets'];
                                let { activityRiskType } = val[0] || {};
                                return activityRiskType === -1 ? false : true;
                            },
                            nodeHandle: (item, data) => {
                                let vals = (data['riskAndSets'] || []).map(type => type.participateCondition);
                                return vals.map(val => this.getEnumVal(PARTICIPATE_CONDITION, val)).toString();
                            },
                        },
                    ],
                },
            ],
            giftKeys: [
                {
                    key: 'activityPackName',
                    nodeHandle: (item, data, index) => {
                        let val = data[item.key];
                        let obj = {
                            label: `礼包${index + 1}名称：`,
                            val,
                        };
                        return obj;
                    },
                },
                {
                    label: '等待时长：',
                    key: 'waitingTime',
                    nodeHandle: (item, data) => {
                        let val = data[item.key];
                        return { val: `${val} 分钟` };
                    },
                },
            ],
        };
    },
    computed: {
        confingList() {
            return function (start, end) {
                let config = this.$baseMethod.deepClone(this.activtyConfig);
                return config.splice(start, end);
            };
        },
    }
};
</script>

<style lang="scss" scoped>
.flow_form {
    padding: 0 40px;
}
</style>
