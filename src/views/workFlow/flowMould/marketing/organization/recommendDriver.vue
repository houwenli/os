<template>
    <!-- 机构活动 推荐司机 -->
    <el-form class="flow_form" :inline="true" label-width="160px" :model="dataObject">
        <!-- 审批发起信息   基础信息 -->
        <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <!-- 活动城市 -->
        <activityCity :formData="{...dataObject,id:dataObject.nodeFormJson.id}" />
        <!-- 活动规则 -->
        <activityRule :formData="dataObject" :listName="'ruleDescList'" />

        <dataForm v-for="item in confingList(2, 3)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>

        <!-- 车主活动配置 -->
        <activityGift :formData="dataObject.driverList" :formList="activityGift.driverRewardList"  :activityConfig="{bigDiv:true}"/>
        <activityGift :formData="dataObject.driverOrderList" :formList="activityGift.promoterRewardList"  :activityConfig="{bigDiv:true}"/>
        <!-- 推广员活动配置 -->
        <activityGift :formData="dataObject.promoterList" :formList="activityGift2.driverRewardList"  :activityConfig="{bigDiv:true}"/>
        <activityGift :formData="dataObject.promoterOrderList" :formList="activityGift2.promoterRewardList" :activityConfig="{bigDiv:true}" />
    </el-form>
</template>

<script>
import activityCity from '../../../components/organization/activityCity.vue';
import activityRule from '../../../components/organization/activityRule.vue';
import dataForm from '../../../components/dataForm.vue';
import activityGift from '../../../components/organization/ConfigActivityGift.vue';
import { ACTIVITY_TYPE, PARTICIPATE_CONDITION } from '@/utils/enum';
export default {
    name: 'recommendDriver',
    components: { dataForm, activityCity, activityGift, activityRule },
    props: {
        dataObject: {
            type: Object,
            default: () => {},
        },
    },
    created() {
        this.dataObject.id = this.dataObject.activityId;
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
                            label: '活动优先级',
                            key: 'priority',
                        },
                        {
                            label: '被推荐司机类型',
                            key: 'systemOperationTypeList',
                            nodeHandle: (item, data) => {
                                let arr = new Map([
                                    [-1, '不限'],
                                    [0, 'A类'],
                                    [1, 'B类'],
                                    [2, 'C类'],
                                    [3, 'D类'],
                                    [4, 'E类'],
                                    [5, 'F类'],
                                    [6, 'G类'],
                                    [7, 'H类'],
                                    [8, 'K类'],
                                ]);
                                return data.systemOperationTypeList.map(item=>{
                                    return arr.get(item)
                                }).join()
                            },
                        },
                        {
                            label: '机构类型',
                            key: 'orgTypeList',
                            nodeHandle: (item, data) => {
                                let arr = new Map([
                                    [30, '服务中心'],
                                    [307, '服务中心（县市区）'],
                                ]);
                                return data.orgTypeList.map(item=>{
                                    return arr.get(item)
                                }).join()
                            },
                        },
                        {
                            label: '活动模板',
                            key: 'patternName',
                        },
                        {
                            label: '服务类型',
                            key: 'serviceTypeList',
                            nodeHandle: (item, data) => {
                                let arr = new Map([
                                    [20, '实时单'],
                                    [21, '预约单'],
                                    [22, '扫码单'],
                                ]);
                                return data.serviceTypeList.map(item=>{
                                    return arr.get(item)
                                }).join()
                            },
                        },
                    ],
                },
                {
                    title: '风控配置',
                    formConfig: [
                        {
                            label: '订单类型',
                            key: 'orderLevel',
                            nodeHandle: (item, data) => {
                                let arr = new Map([
                                    [0, '不限'],
                                    [1, '正常']
                                ]);
                                return arr.get(Number(data.orderLevel));
                            },
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
                    title: '车主奖励',
                    formConfig: [
                        {
                            label: '注册数量',
                            key: 'minNumber',
                            config:{
                                isAlone:true
                            }
                        },
                        {
                            label: '奖励金额（车主）',
                            key: 'rewardAmountCopy',
                        },
                        {
                            label: '奖励绩效分（车主）',
                            key: 'driverScore',
                        },
                        {
                            label: '奖励金额（服务站）',
                            key: 'orgRewardAmountCopy',
                        },
                        {
                            label: '奖励绩效分（服务站）',
                            key: 'orgScore',
                        },
                    ],
                    keys: [
                        {
                            label: '注册奖励',
                        },
                    ],
                },
                promoterRewardList: {
                    config: {
                        title: false,
                    },
                    formConfig: [
                        {
                            label: '订单数量',
                            key: 'minNumber',
                        },
                        {
                            label: '奖励金额（车主）',
                            key: 'rewardAmountCopy',
                        },
                        {
                            label: '奖励绩效分（车主）',
                            key: 'driverScore',
                        },
                        {
                            label: '奖励金额（服务站）',
                            key: 'orgRewardAmountCopy',
                        },
                        {
                            label: '奖励绩效分（服务站）',
                            key: 'orgScore',
                        },
                    ],
                    keys: [
                        {
                            label: '推荐车主完成订单',
                        },
                    ],
                },
            },
            activityGift2: {
                driverRewardList: {
                    title: '推广员奖励',
                    formConfig: [
                        {
                            label: '注册数量',
                            key: 'minNumber',
                            config:{
                                isAlone:true
                            }
                        },
                        {
                            label: '奖励金额（推广员）',
                            key: 'rewardAmountCopy',
                        },
                        {
                            label: '奖励金额（服务站）',
                            key: 'orgRewardAmountCopy',
                        },
                        {
                            label: '奖励绩效分（服务站）',
                            key: 'orgScore',
                        },
                        {
                            label: '奖励绩效分（绑定车主）',
                            key: 'driverScore',
                        },
                    ],
                    keys: [
                        {
                            label: '注册奖励',
                        },
                    ],
                },
                promoterRewardList: {
                    config: {
                        title: false,
                    },
                    formConfig: [
                        {
                            label: '订单数量',
                            key: 'minNumber',
                        },
                        {
                            label: '奖励金额（推广员）',
                            key: 'rewardAmountCopy',
                        },
                        {
                            label: '奖励金额（服务站）',
                            key: 'orgRewardAmountCopy',
                        },
                        {
                            label: '奖励绩效分（服务站）',
                            key: 'orgScore',
                        },
                        {
                            label: '奖励绩效分（绑定车主）',
                            key: 'driverScore',
                        },
                    ],
                    keys: [
                        {
                            label: '推荐车主完成订单',
                        },
                    ],
                },
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
