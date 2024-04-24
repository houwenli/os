<template>
    <!-- 营销活动 注册送 -->
    <el-form class="flow_form" :inline="true" label-width="140px" :model="dataObject">
        <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <activityCity :formData="dataObject" />
        <activityRule :formData="dataObject" :isHeader="false" />
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
    name: 'recommendRecharge',
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
                            nodeHandle: (item, data) => {
                                return data.priority
                            },
                        },
                    ],
                },
            ],
            configForm:'recommendRecharge',
            configData:[
                {
                    title:'充值送配置',
                    tableName:'configList',
                    tableCloumn:[
                        {label:'推荐实付充值金额（元）',prop:'minNumber-maxNumber',type:'a'},
                        {label:'奖励金额（元）',prop:'rechargeMoney',type:'b'},
                    ]
                },
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
    }
};
</script>

<style lang="scss" scoped>
.flow_form {
    padding: 0 40px;
}
</style>
