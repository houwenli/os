<template>
    <!-- 营销活动 注册送 -->
    <el-form class="flow_form" :inline="true" label-width="140px" :model="dataObject">
        <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <activityCity :formData="dataObject" />
        <activityRule :formData="dataObject" :isHeader="false" />
        <dataForm v-for="item in confingList(2, activtyConfig.length - 1)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <rewardConfig :formData="dataObject" :isHeader="false" :configData="configData" :configForm="configForm"/>
    </el-form>
</template>

<script>
import activityCity from '../../../components/marketing/activityCity.vue';
import dataForm from '../../../components/dataForm.vue';
import activityRule from '../../../components/marketing/activityRule.vue';
import rewardConfig from '../../../components/organization/rewardConfig.vue';
import { ACTIVITY_TYPE} from '@/utils/enum';
import { marketing } from '../../../mixin';
export default {
    name: 'rechargeSend',
    components: { dataForm, activityCity, activityRule,rewardConfig },
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
                    title: '风控配置',
                    formConfig: [
                        {
                            label: '乘客风险类型',
                            key: 'riskAndSets',
                            span:12,
                            nodeHandle: (item, data) => {
                                let val= data['riskAndSets'][0]['riskTypeName'] || ''
                                return val
                            },
                        },
                        {
                            label: '参与配置',
                            key: 'riskAndSets',
                            span:12,
                            show: (item,data) => {
                                return data.riskAndSets[0].participateCondition >= 0 ? true : false
                            },
                            nodeHandle: (item, data) => {
                                let val= ''
                                let arr = ['黑名单','无风险','有风险','疑似风险']
                                data.riskAndSets.forEach(item => {
                                    val = val + arr[item.participateCondition] + '/'
                                });
                                return val.slice(0,val.length-1)
                            },
                        },
                        {
                            label: '乘客参与限制',
                            key: 'joinConfigurationAo',
                            nodeHandle: (item, data) => {
                                let arr = ['不限','限每日参与次数','活动周期内参与次数','累计充值金额总上限']
                                return arr[data.joinConfigurationAo.joinType]
                            },
                        },
                        {
                            label: '参与次数',
                            key: 'joinConfigurationAo',
                            show: (item,data) => {
                                return data.joinConfigurationAo.joinType == 1 || data.joinConfigurationAo.joinType == 2  ? true :false
                            },
                            nodeHandle: (item, data) => {
                                return data.joinConfigurationAo.joinTimes
                            },
                        },
                        {
                            label: '每日金额',
                            key: 'joinConfigurationAo',
                            show: (item,data) => {
                                return data.joinConfigurationAo.joinType == 3 ? true :false
                            },
                            nodeHandle: (item, data) => {
                                return (data.joinConfigurationAo.totalAmount / 100).toFixed(0)
                            },
                        },
                    ],
                },
            ],
            configForm:'rechargeSend',
            configData:[
                {
                    title:'充值送配置',
                    tableName:'rewardConfigurationList',
                    tableCloumn:[
                        {label:'充值金额（元）',prop:'rechargeMoney',type:'b'},
                        {label:'赠送金额（元）',prop:'rewardMoney',type:'b'},
                        {label:'入账周期（月）',prop:'incomePeriod',type:'b'},
                    ]
                },
                {
                    title:'自定义金额配置',
                    tableName:'passengerCustomList',
                    tableCloumn:[
                        {label:'充值金额（元）',prop:'rechargeStartMoney-rechargeEndMoney',type:'a'},
                        {label:'赠送比例（%）',prop:'rewardDivide',type:'b'},
                        {label:'入账周期（月）',prop:'incomePeriod',type:'b'},
                    ]
                },
            ]
        };
    },
    watch:{
        dataObject :{
            handler : function(newV) {
                if(newV.riskAndSets[0].participateCondition < 0) this.activtyConfig[2].formConfig[0].span = 24
            },
            deep:true,
            immediate: true,
        },
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
