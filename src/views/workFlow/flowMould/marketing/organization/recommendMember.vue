<template>
    <!-- 机构活动 推荐会员活动 -->
    <el-form class="flow_form" :inline="true" label-width="160px" :model="dataObject">
        <!-- 审批发起信息   基础信息 -->
        <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <!-- 活动城市 -->
        <activityCity :formData="{...dataObject,id: dataObject.nodeFormJson.id}"  />
        <!-- 活动规则 -->
        <activityRule :formData="dataObject" :listName="'ruleDescList'" />
        <!-- 司机奖励配置 -->
        <activityGift :formData="dataObject.driverRewardRechargeList" :formList="dataObject.driverRewardRechargeList[0].rewardType==2?activityGift.driverRewardList2:activityGift.driverRewardList" :activityConfig="{bigDiv:true}" />
        <!-- 推广员奖励配置 -->
        <activityGift :formData="dataObject.promoterRewardRechargeList" :formList="dataObject.promoterRewardRechargeList[0].rewardType==2?activityGift.promoterRewardList2:activityGift.promoterRewardList" :activityConfig="{bigDiv:true}" />
    </el-form>
</template>

<script>
import activityCity from '../../../components/organization/activityCity.vue';
import activityRule from '../../../components/organization/activityRule.vue';
import dataForm from '../../../components/dataForm.vue';
import activityGift from '../../../components/organization/ConfigActivityGift.vue';
import { ACTIVITY_TYPE} from '@/utils/enum';
export default {
    name: 'recommendMember',
    components: { dataForm, activityCity, activityGift, activityRule },
    props: {
        dataObject: {
            type: Object,
            default: () => {},
        },
    },
    created() {
        this.dataObject.id = this.dataObject.activityId;

        if(this.dataObject.driverRewardRechargeList[0].limitType!=0){
            this.activityGift.driverRewardList.keys.splice(1,0,{
                            label: '奖励上限(元):',
                            key: 'rewardLimit',
                        })
        }
        this.activityGift.driverRewardList2={
            ...this.activityGift.driverRewardList,
            formConfig:[
                        {
                            label: '购买会员实付金额',
                            key: 'minNumber',
                        },
                        {
                            label: '奖励比例（司机合伙人）',
                            key: 'promoterRewardAmount'
                        },
                        {
                            label: '奖励比例（实体店）',
                            key: 'orgRewardAmount'
                        },
                        {
                            label: '奖励绩效分（司机合伙人）',
                            key: 'driverScore',
                        },
                    ],
        }
        if(this.dataObject.promoterRewardRechargeList[0].limitType!=0){
            this.activityGift.promoterRewardList.keys.splice(1,0,{
                            label: '奖励上限(元):',
                            key: 'rewardLimit',
                        })
        }
        this.activityGift.promoterRewardList2={
            ...this.activityGift.promoterRewardList,
            formConfig:[
                        {
                            label: '购买会员实付金额',
                            key: 'minNumber',
                        },
                        {
                            label: '奖励比例（推广员）',
                            key: 'promoterRewardAmount',
                        },
                        {
                            label: '奖励比例（实体店）',
                            key: 'orgRewardAmount',
                        },
                        {
                            label: '奖励绩效分（实体店）',
                            key: 'orgScore',
                        },
                        {
                            label: '奖励绩效分（绑定司机）',
                            key: 'driverScore',
                        }
                    ],
        }
    },
    data() {
        return {
            tableData: [],
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
                            label: '优先级',
                            key: 'priority',
                        },
                    ],
                },
            ],
            tableConfig: {
                // pageSizeList: [5, 10, 20, 50],
                filterColumns: false,
                indexColumn: false,
                pagination: false,
            },
            activityGift: {
                driverRewardList: {
                    title: '司机奖励配置',
                    formConfig: [
                        {
                            label: '购买会员实付金额',
                            key: 'minNumber',
                        },
                        {
                            label: '奖励金额（司机合伙人）',
                            key: 'promoterRewardAmount',
                            config:{
                                isPercent:true
                            }
                        },
                        {
                            label: '奖励金额（实体店）',
                            key: 'orgRewardAmount',
                            config:{
                                isPercent:true
                            }
                        },
                        {
                            label: '奖励绩效分（司机合伙人）',
                            key: 'driverScore',
                        },
                    ],
                    keys: [
                        {
                            label: '推荐奖励上限:',
                            key: 'limitType',
                            nodeHandle: data => {
                                let arr = new Map([
                                    [0, '不限'],
                                    [1, '每日获得奖励上限'],
                                    [2, '活动周期内获得奖励上限'],
                                ]);
                                return arr.get(data);
                            },
                        },
                        // {
                        //     label: '奖励上限(元):',
                        //     key: 'rewardLimit',
                        // },
                        {
                            label: '推荐奖励配置:',
                            key: 'rewardType',
                            nodeHandle: data => {
                                let arr = new Map([
                                    [1, '固定金额奖励'],
                                    [2, '比例金额奖励'],
                                ]);
                                return arr.get(data);
                            },
                        },
                    ],
                },
                driverRewardList2:{},
                promoterRewardList: {
                    title: '推广员奖励配置',
                    formConfig: [
                        {
                            label: '购买会员实付金额',
                            key: 'minNumber',
                        },
                        {
                            label: '奖励金额（推广员）',
                            key: 'promoterRewardAmount',
                            config:{
                                isPercent:true
                            }
                        },
                        {
                            label: '奖励金额（实体店）',
                            key: 'orgRewardAmount',
                            config:{
                                isPercent:true
                            }
                        },
                        {
                            label: '奖励绩效分（实体店）',
                            key: 'orgScore',
                        },
                        {
                            label: '奖励绩效分（绑定司机）',
                            key: 'driverScore',
                        }
                    ],
                    keys: [
                        {
                            label: '推荐奖励上限: ',
                            key: 'limitType',
                            nodeHandle: data => {
                                let arr = new Map([
                                    [0, '不限'],
                                    [1, '每日获得奖励上限'],
                                    [2, '活动周期内获得奖励上限'],
                                ]);
                                return arr.get(data);
                            },
                        },
                        // {
                        //     label: '奖励上限(元): ',
                        //     key: 'rewardLimit',
                        // },
                        {
                            label: '推荐奖励配置:',
                            key: 'rewardType',
                            nodeHandle: data => {
                                let arr = new Map([
                                    [1, '固定金额奖励'],
                                    [2, '比例金额奖励'],
                                ]);
                                return arr.get(data);
                            },
                        },
                    ],
                },
                promoterRewardList2:{}
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
