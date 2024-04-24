<template>
    <!-- 营销活动 注册送 -->
    <el-form class="flow_form" :inline="true" label-width="140px" :model="dataObject">
        <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <activityCity :formData="dataObject"/>
        <activityRule :formData="dataObject" :isHeader="false" listName="ruleDescList"/>
        <rewardConfig :formData="dataObject" :isHeader="false" :configData="configData" :configForm="configForm"/>
    </el-form>
</template>

<script>
import activityCity from '../../../components/organization/activityCity.vue';
import dataForm from '../../../components/dataForm.vue';
import activityRule from '../../../components/organization/activityRule.vue';
import rewardConfig from '../../../components/organization/rewardConfig.vue';
import { ACTIVITY_TYPE} from '@/utils/enum';
import { marketing } from '../../../mixin';
export default {
    name: 'recommendRechargeOrg',
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
                            label: '推荐类型',
                            key: 'activityType',
                            nodeHandle:(item,data)=> {
                                if(data.activityType == 3) {
                                    return '推荐乘客充值'
                                } else if (data.activityType == 5) {
                                    return '推荐企业充值'
                                }
                            }
                        }
                    ],
                },
            ],
            configForm:'recommendRechargeOrg',
            configData:[
                {
                    title:'司机奖励配置',
                    tableName:'driverRewardRechargeList',
                    tableCloumn:[
                        {label:'推荐实付充值金额',prop:'minNumber-maxNumber',type:'a'},
                        {label:'奖励金额（司机合伙人）',prop:'promoterRewardAmount',type:'b'},
                        {label:'奖励金额（实体店）',prop:'orgRewardAmount',type:'b'},
                        {label:'奖励绩效分（司机合伙人）',prop:'driverScore',type:'b'},
                    ]
                },
                {
                    title:'推广员奖励配置',
                    tableName:'promoterRewardRechargeList',
                    tableCloumn:[
                        {label:'推荐实付充值金额',prop:'minNumber-maxNumber',type:'a',},
                        {label:'奖励金额（推广员）',prop:'promoterRewardAmount',type:'b'},
                        {label:'奖励金额（实体店）',prop:'orgRewardAmount',type:'b'},
                        {label:'奖励绩效分（实体店）',prop:'orgScore',type:'b'},
                        {label:'奖励绩效分（绑定司机)',prop:'driverScore',type:'b'},
                    ]
                }
            ]
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
    watch:{
        dataObject:{
            handler : function(newV) {
                let arrDriver = ['推荐实付充值金额','奖励比例(司机合伙人)','奖励比例(实体店)','奖励绩效分比例(司机合伙人)']
                let arrPromoter = ['推荐实付充值金额','奖励比例(推广员)','奖励比例（实体店）','奖励绩效分比例（实体店）','奖励绩效分比例（绑定司机）']
                if(newV.driverRewardRechargeList[0].rewardType == 2) {
                    this.configData[0].tableCloumn.forEach((item,index) => {
                        item.label= arrDriver[index]
                        if(index) item.type = 'p'
                    });
                }
                if(newV.promoterRewardRechargeList[0].rewardType == 2) {
                    this.configData[1].tableCloumn.forEach((item,index) => {
                        item.label= arrPromoter[index]
                        if(index) item.type = 'p'
                    });
                }
            },
            deep:true,
            immediate: true,
        },
    },
};
</script>

<style lang="scss" scoped>
.flow_form {
    padding: 0 40px;
}
</style>
