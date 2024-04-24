<template>
    <!-- 营销活动 定时活动 -->
    <el-form class="flow_form" :inline="true" label-width="160px" :model="dataObject">
        <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <div class="data_form">
            <h2 class="flow_title">活动时间</h2>
            <ws-table-el v-bind="tableConfig" :data="timingContendActivityTimes" :header-cell-style="{ background: '#F5F7FA' }">
                <template>
                    <ws-table-column-el prop="giftName" label="活动时间">
                        <template slot-scope="scope">
                            <span>{{ `${scope.row.activityStartDate} 至 ${scope.row.activityEndDate}` }}</span>
                        </template>
                    </ws-table-column-el>
                </template>
            </ws-table-el>
        </div>
        <activityCity :formData="dataObject" />
        <activityCrowd :formData="dataObject" />
        <activityRule :formData="dataObject" />
        <dataForm v-for="item in confingList(2, activtyConfig.length - 1)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <activityGift :formKeys="giftKeys" :formData="dataObject.activityPacks" />
    </el-form>
</template>

<script>
import activityCrowd from '../../../components/marketing/activityCrowd.vue';
import activityCity from '../../../components/marketing/activityCity.vue';
import activityRule from '../../../components/marketing/activityRule.vue';
import dataForm from '../../../components/dataForm.vue';
import activityGift from '../../../components/marketing/activityGift';
import { ACTIVITY_TYPE, PARTICIPATE_CONDITION } from '@/utils/enum';
import { marketing } from '../../../mixin';
export default {
    name: 'timing',
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
            tableData: [],
            h5Template: [],
            minigramTemplate: [],
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
                            label: 'H5模板',
                            key: 'partitionId',
                            nodeHandle: (item, data) => {
                                let val = data[item.key];
                                let obj = this.h5Template.filter(item => item.id === val)[0];
                                return obj?.patternName || '--';
                            },
                        },
                        {
                            label: '小程序模板',
                            key: 'minigramPartitionId',
                            nodeHandle: (item, data) => {
                                let val = data[item.key];
                                let obj = this.minigramTemplate.filter(item => item.id === val)[0];
                                return obj?.patternName || '--';
                            },
                        },
                        {
                            label: '活动优先级',
                            key: 'priority',
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
                        let val = data[item.key];
                        let obj = {
                            label: `礼包${index + 1}名称：`,
                            val,
                        };
                        return obj;
                    },
                },
                {
                    nodeHandle: (item, data) => {
                        let { startRushTime, endRushTime } = data;
                        return {
                            label: `抢券时间：`,
                            val: `${startRushTime} ~ ${endRushTime}`,
                        };
                    },
                },
                {
                    nodeHandle: (item, data) => {
                        let { totalTimes } = data;
                        return {
                            label: `礼包数量：`,
                            val: `${totalTimes} 个`,
                        };
                    },
                },
                {
                    nodeHandle: (item, data) => {
                        let { maximumDeduction } = data;
                        return {
                            label: `单个用户领取次数上限：`,
                            val: `${maximumDeduction}`,
                        };
                    },
                },
            ],
            tableConfig: {
                // pageSizeList: [5, 10, 20, 50],
                filterColumns: false,
                // indexColumn: false,
                pagination: false,
            },
        };
    },
    computed: {
        confingList() {
            return function (start, end) {
                let config = this.$baseMethod.deepClone(this.activtyConfig);
                return config.splice(start, end);
            };
        },

        timingContendActivityTimes() {
            if (this.dataObject.params && Object.keys(this.dataObject.params).length > 0) {
                return JSON.parse(this.dataObject.params);
            }
        },
    },
    created() {
        this.getTemplateList(171, 'h5Template');
        this.getTemplateList(172, 'minigramTemplate');
    },
};
</script>

<style lang="scss" scoped>
@import '../../../components/comm.scss';

/deep/ .empty-table {
    min-height: 255px;
}

/deep/ .ws-table-warp {
    padding: 0 !important;
}
.flow_form {
    padding: 0 40px;
}
</style>
