<template>
    <!-- 营销活动 注册送 -->
    <el-form class="flow_form" :inline="true" label-width="140px" :model="dataObject">
        <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <activityCity :formData="dataObject" />
        <activityRule :formData="dataObject" :isHeader="false" />
        <dataForm v-for="item in confingList(2, activtyConfig.length - 1)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <activityGift :formData="couponsOrRedPackets" :isShow="false" />
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
            h5Template: [],
            appletsTemplate: [],
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
                            label: 'H5模板',
                            key: 'partitionId',
                            nodeHandle: (item, data) => {
                                let val = data['partitionId'];
                                if (val === -1) return '默认模板'
                                let obj = this.h5Template.filter(item => item.id === val)[0];
                                return obj?.patternName || '--';
                            },
                        },
                        {
                            label: '小程序模板',
                            key: 'minigramPartitionId',
                            nodeHandle: (item, data) => {
                                let val = data['minigramPartitionId'];
                                if (val === -1) return '默认模板'
                                let obj = this.appletsTemplate.filter(item => item.id === val)[0];
                                return obj?.patternName || '--';
                            },
                        },
                    ],
                },
                {
                    title: '风控配置',
                    formConfig: [
                        {
                            label: '参与配置',
                            key: 'riskConfig',
                            nodeHandle: (item, data) => {
                                let vals = data['riskConfig'] || []
                                return vals.map(val => this.getEnumVal(PARTICIPATE_CONDITION, val)).toString();
                            },
                        },
                    ],
                },
            ]
        };
    },
    computed: {
        couponsOrRedPackets() {
            let couponsOrRedPackets = this.dataObject.giftPackages
            return [{ couponsOrRedPackets }]
        },
        confingList() {
            return function (start, end) {
                let config = this.$baseMethod.deepClone(this.activtyConfig);
                return config.splice(start, end);
            };
        },
    },
    created() {
        this.getTemplateList(1, 'appletsTemplate')
        this.getTemplateList(101, 'h5Template')
    }
};
</script>

<style lang="scss" scoped>
.flow_form {
    padding: 0 40px;
}
</style>
