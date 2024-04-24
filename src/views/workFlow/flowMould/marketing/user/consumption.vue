<template>
    <!-- 营销活动 消费送 -->
    <el-form class="flow_form" :inline="true" label-width="140px" :model="dataObject">
        <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <activityCity :formData="dataObject" />
        <activityCrowd :formData="dataObject"/>
        <activityRule :formData="dataObject" :isHeader="false" />
        <dataForm v-for="item in confingList(2, activtyConfig.length - 1)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <activityGift :formKeys="giftKeys" :formData="dataObject.activityPacks" giftTitle="活动奖励"/>
    </el-form>
</template>

<script>
import activityCrowd from '../../../components/marketing/activityCrowd.vue';
import activityCity from '../../../components/marketing/activityCity.vue';
import dataForm from '../../../components/dataForm.vue';
import activityRule from '../../../components/marketing/activityRule.vue';
import activityGift from '../../../components/marketing/activityGift';
import { ACTIVITY_TYPE, PARTICIPATE_CONDITION } from '@/utils/enum';
import { marketing } from '../../../mixin';
export default {
    name: 'waitReward',
    components: { dataForm, activityCrowd, activityCity, activityGift, activityRule },
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
                        }
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
                                let res = this.riskAndSets.filter(item => item.riskTypeId === activityRiskType);
                                return res.length > 0 ? res[0].riskTypeName : '不限';
                            },
                        },
                        {
                            label: '参与配置',
                            key: 'riskTypeName',
                            show: (item, data) => {
                                let val = data['riskAndSets'];
                                let { activityRiskType } = val[0] || {};
                                if (!activityRiskType) return false
                                return activityRiskType === -1 ? false : true;
                            },
                            nodeHandle: (item, data) => {
                                let vals = (data['riskAndSets'] || []).map(type => type.participateCondition);
                                return vals.map(val => this.getEnumVal(PARTICIPATE_CONDITION, val)).toString();
                            },
                        },
                    ],
                },
                // {
                //     title: '活动配置',
                //     formConfig: [
                //         {
                //             label: '异常订单参与设置',
                //             key: 'orderType',
                //             nodeHandle: (item, data) => {
                //                 let val = data[item.key];
                //                 let orderTypeEnum = {
                //                     0: '能参与活动',
                //                     1: '不能参与活动'
                //                 }
                //                 return orderTypeEnum[val];
                //             },
                //         },
                //     ],
                // }
            ],
            giftKeys: [
                {
                    nodeHandle: (item, data, index) => {
                        let val = data['activityPackName'];
                        let obj = {
                            label: `礼包${index + 1}名称：`,
                            val,
                        };
                        return obj;
                    },
                },
                
                {
                    nodeHandle: (item, data, index) => {
                        let val = data['receiveCondition'];
                        let obj = {
                            label: `消费次数：`,
                            val,
                        };
                        return obj;
                    },
                },
                
                {
                    nodeHandle: (item, data, index) => {
                        let val = data['totalTimes'];
                        let obj = {
                            label: `礼包总数：`,
                            val,
                        };
                        return obj;
                    },
                }
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
    },
};
</script>

<style lang="scss" scoped>
.flow_form {
    padding: 0 40px;
}
</style>
