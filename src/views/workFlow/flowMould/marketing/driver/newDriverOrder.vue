<template>
    <!-- 营销活动 车主完单奖励 -->
    <el-form class="flow_form" :inline="true" label-width="160px" :model="dataObject">
        <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <activityCity :formData="dataObject" :requestConfing="requestConfing" />
        <activityCrowd :formData="dataObject" />
        <activityRule :formData="dataObject" />
        <dataForm v-for="item in confingList(2, activtyConfig.length - 1)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <activityRewards :formData="dataObject" />
        <pushMsgConfig :formData="dataObject" />
        <smsMsgConfig :formData="dataObject" />
    </el-form>
</template>

<script>
import activityCrowd from '../../../components/marketing/activityCrowd.vue';
import activityRule from '../../../components/marketing/activityRule.vue';
import activityRewards from '../../../components/marketing/activityRewards.vue';
import dataForm from '../../../components/dataForm.vue';
import activityCity from '../../../components/marketing/activityCity';
import smsMsgConfig from '../../../components/marketing/smsMsgConfig';
import pushMsgConfig from '../../../components/marketing/pushMsgConfig';
import { ACTIVITY_TYPE } from '@/utils/enum';
export default {
    name: 'newDriverOrder',
    components: { dataForm, activityCrowd, activityCity, activityRule, activityRewards, smsMsgConfig, pushMsgConfig },
    props: {
        dataObject: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            tableData: [],
            requestConfing:{
                url: '/driverActivity/common/select',
                op: 'getShowDriverActivityCityCode'
            },
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
                                return (
                                    data[val[0]] &&
                                    data[val[1]] &&
                                    `${this.$vuex.$baseMethod.formatData(data[val[0]])} ${data.nameId == 61 ? '至 ' : '~ '} ${this.$vuex.$baseMethod.formatData(data[val[1]])}`
                                );
                            },
                        },
                        {
                            label: '活动优先级',
                            key: 'priority',
                        },
                        {
                            label: '活动模板',
                            key: 'partitionName',
                        },
                    ],
                },
                {
                    title: '风控配置',
                    formConfig: [
                        {
                            label: '活动风险类型：',
                            nodeHandle: (item, data) => {
                                return data.riskName;
                            },
                        },
                        {
                            label: '参与配置：',
                            key: 'riskTypeName',
                            show: (item, data) => {
                                const risk = data.riskAndSetList.some(e => e.activityRiskType == -1);
                                return !risk;
                            },
                            nodeHandle: (item, data) => {
                                let riskName = data.riskAndSetList.map(item => item.riskTypeName);
                                return riskName.toString().replace(/,/g, ' / ');
                            },
                        },
                    ],
                },
                {
                    title: '活动配置',
                    formConfig: [
                        {
                            label: '机构类型',
                            key: 'orgTypeList',
                            nodeHandle: (item, data) => {
                                let orgType = {
                                    30: '服务中心',
                                    307: '服务中心（县市区）',
                                };
                                let orgName = data.orgTypeList.map(item => {
                                    if (orgType[item]) return orgType[item];
                                });
                                return orgName.toString().replace(/,/g, ' / ');
                            },
                        },
                        {
                            label: '异常订单参与设置',
                            key: 'orderType',
                            nodeHandle: (item, data) => {
                                return data.orderType == 0 ? '能参与活动' : '不能参与活动';
                            },
                        },
                        {
                            label: '订单类型',
                            key: 'serviceTypeList',
                            nodeHandle: (item, data) => {
                                let serviceName = {
                                    20: '实时单',
                                    21: '预约单',
                                    22: '扫码单',
                                };
                                let orgName = data.serviceTypeList.map(item => {
                                    if (serviceName[item]) return serviceName[item];
                                });
                                return orgName.toString().replace(/,/g, ' / ');
                            },
                        },
                    ],
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
