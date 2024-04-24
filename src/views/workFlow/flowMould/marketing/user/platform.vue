<template>
    <!-- 营销活动 平台推广 -->
    <el-form class="flow_form" :inline="true" label-width="155px" :model="dataObject">
        <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <activityCity :formData="dataObject" />
        <activityCrowd :formData="dataObject" />

        <activityRule :formData="dataObject" :isHeader="false" />
        <dataForm v-for="item in confingList(2, activtyConfig.length - 1)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <activityGift :isShow="false" giftTitle="参与活动奖励" :formData="giftPackages" />
        <activityGift :isShow="false" giftTitle="用户分享奖励" :formKeys="giftKeys" :formData="shareGiftPackages"  />
    </el-form>
</template>

<script>
import activityCrowd from '../../../components/marketing/activityCrowd.vue';
import activityCity from '../../../components/marketing/activityCity.vue';
import dataForm from '../../../components/dataForm.vue';
import activityGift from '../../../components/marketing/activityGift';
import { ACTIVITY_TYPE, PARTICIPATE_CONDITION } from '@/utils/enum';
import { marketing } from '../../../mixin';
import activityRule from '../../../components/marketing/activityRule.vue';
export default {
    name: 'platform',
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
            platformTemplate: [],
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
                        {
                            label: '活动模板',
                            nodeHandle: (item, data) => {
                                let val = data['partitionId'];
                                let obj = this.platformTemplate.filter(item => item.id === val)[0];
                                return obj?.patternName || '--';
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
                        let obj = {
                            label: `邀请人数：`,
                            val: data.inviteNumber,
                        };
                        return obj;
                    },
                },
                {
                    key: 'activityPackName',
                    nodeHandle: (item, data, index) => {
                        let obj = {
                            label: `单个用户参与次数上限：`,
                            val: data.sameUserNumber,
                        };
                        return obj;
                    },
                },
            ],
        };
    },
    computed: {
        giftPackages() {
            let { giftPackages: couponsOrRedPackets } = this.dataObject;
            return [{ couponsOrRedPackets }];
        },
        shareGiftPackages() {
            let { shareGiftPackages: couponsOrRedPackets, inviteNumber, sameUserNumber } = this.dataObject;
            return [{ couponsOrRedPackets, inviteNumber, sameUserNumber }];
        },
        confingList() {
            return function (start, end) {
                let config = this.$baseMethod.deepClone(this.activtyConfig);
                return config.splice(start, end);
            };
        },
    },
    created() {
        this.getTemplateList(10, 'platformTemplate');
    },
};
</script>

<style lang="scss" scoped>
.flow_form {
    padding: 0 40px;
}
</style>
