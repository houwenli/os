<template>
    <!-- 机构活动 推荐乘客 -->
    <el-form class="flow_form" :inline="true" label-width="160px" :model="dataObject">
        <!-- 审批发起信息   基础信息 -->
        <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <!-- 活动城市 -->
        <activityCity :formData="{...dataObject,id:dataObject.nodeFormJson.id}" />
        <!-- 活动规则 -->
        <activityRule :formData="dataObject" :listName="'ruleDescList'" />
        <!-- 风控配置 -->
        <dataForm v-for="item in confingList(2, 3)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <!-- 车主活动配置 -->
        <activityGift v-if="dataObject.registerOne.length>0" :formData="dataObject.registerOne" :formList="activityGift.driverRewardList"  :activityConfig="{bigDiv:true}"/>
        <activityGift v-if="dataObject.ruleListOne.length>0" :formData="dataObject.ruleListOne" :formList="activityGift.driverRewardList2"  :activityConfig="{bigDiv:true}"/>
        <activityGift v-if="dataObject.ruleListThird.length>0" :formData="dataObject.ruleListThird" :formList="activityGift.driverRewardList3"  :activityConfig="{bigDiv:true}"/>
        <!-- 推广员活动配置 -->
        <activityGift v-if="dataObject.registerTwo.length>0" :formData="dataObject.registerTwo" :formList="activityGift.promoterRewardList"  :activityConfig="{bigDiv:true}"/>
        <activityGift v-if="dataObject.ruleListTwo.length>0" :formData="dataObject.ruleListTwo" :formList="activityGift.promoterRewardList2"  :activityConfig="{bigDiv:true}"/>
        <activityGift v-if="dataObject.ruleListFourth.length>0" :formData="dataObject.ruleListFourth" :formList="activityGift.promoterRewardList3"  :activityConfig="{bigDiv:true}"/>
    </el-form>
</template>

<script>
import activityCity from '../../../components/organization/activityCity.vue';
import activityRule from '../../../components/organization/activityRule.vue';
import dataForm from '../../../components/dataForm.vue';
import activityGift from '../../../components/organization/ConfigActivityGift.vue';
import { ACTIVITY_TYPE} from '@/utils/enum';
export default {
    name: 'orderPromotion',
    components: { dataForm, activityCity, activityGift, activityRule },
    props: {
        dataObject: {
            type: Object,
            default: () => {},
        },
    },
    created() {
        this.dataObject.id = this.dataObject.activityId;

        this.activityGift.driverRewardList3=
        JSON.parse(JSON.stringify({
            ...this.activityGift.driverRewardList,
            config:{
                title:false
            },
            keys:[{
                    label: '非推荐用户订单',
                    key: 'rewardLimit',
                }],
        }))
        this.activityGift.driverRewardList2=
        JSON.parse(JSON.stringify({
            ...this.activityGift.driverRewardList,
            config:{
                title:false
            },
            keys:[{
                    label: '推荐用户订单',
                    key: 'rewardLimit',
                }],
        }))
        
        this.activityGift.driverRewardList.formConfig[0]={
            ...this.activityGift.driverRewardList.formConfig[0],
            label:this.dataObject.registerOne.length>1?'累计推荐注册用户数量':'注册数量',
            config:{isAlone:true}
        }
        this.activityGift.driverRewardList.keys.push({
            label: '奖励方式:',
            key: 'promoterRewordType',
            nodeHandle: data => {
                return this.dataObject.registerOne.length>1?'梯度奖励':'普通奖励'
            },
        })

        this.activityGift.promoterRewardList3=
        JSON.parse(JSON.stringify({
            ...this.activityGift.promoterRewardList,
            config:{
                title:false
            },
            keys:[{
                    label: '非推荐用户订单',
                    key: 'rewardLimit',
                }],
        }))
        this.activityGift.promoterRewardList2=
        JSON.parse(JSON.stringify({
            ...this.activityGift.promoterRewardList,
            config:{
                title:false
            },
            keys:[{
                    label: '推荐用户订单',
                    key: 'rewardLimit',
                }],
        }))
        this.activityGift.promoterRewardList.formConfig[0]={
            ...this.activityGift.promoterRewardList.formConfig[0],
            label:this.dataObject.registerTwo.length>1?'累计推荐注册用户数量':'注册数量',
            config:{isAlone:true}
        }
        this.activityGift.promoterRewardList.keys.push({
            label: '奖励方式:',
            key: 'promoterRewordType',
            nodeHandle: data => {
                return this.dataObject.registerTwo.length>1?'梯度奖励':'普通奖励'
            },
        })
            
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
                    ],
                },
                {
                    title: '风控配置',
                    formConfig: [
                        {
                            label: '推广员参与配置',
                            key: 'refereeRiskList',
                            nodeHandle: (item, data) => {
                                let arr = new Map([
                                    [0, '黑名单'],
                                    [1, '无风险'],
                                    [2, '有风险'],
                                ]);
                                return data.refereeRiskList.map(item=>{
                                    return arr.get(item)
                                }).join()
                            },
                        },
                        {
                            label: '被推荐人参与配置',
                            key: 'referralRiskList',
                            nodeHandle: (item, data) => {
                                let arr = new Map([
                                    [0, '黑名单'],
                                    [1, '无风险'],
                                    [2, '有风险'],
                                    [3, '疑似风险'],
                                ]);
                                return data.referralRiskList.map(item=>{
                                    return arr.get(item)
                                }).join()
                            },
                        },
                        {
                            label: '订单风险',
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
                    title: '车主活动配置',
                    formConfig: [
                        {
                            label: '累计推荐注册用户数量',
                            key: 'minNumber',
                        },
                        {
                            label: '奖励金额（车主）',
                            key: 'rewardAmount',
                        },
                        {
                            label: '奖励绩效分（车主）',
                            key: 'driverScore',
                        },
                        {
                            label: '奖励金额（服务站）',
                            key: 'orgRewardAmount',
                            config:{
                                isPercent:true
                            }
                        },
                        {
                            label: '奖励绩效分（服务站）',
                            key: 'orgScore',
                        },
                    ],
                    keys: [
                        {
                            label: '注册奖励',
                            key: 'rewardLimit',
                        }
                    ],
                },
                driverRewardList2:[],
                driverRewardList3:[],
                promoterRewardList: {
                    title: '推广员活动配置',
                    formConfig: [
                        {
                            label: '累计推荐注册用户数量',
                            key: 'minNumber',
                        },
                        {
                            label: '奖励金额（推广员）',
                            key: 'rewardAmount',
                        },
                        {
                            label: '奖励金额（服务站）',
                            key: 'orgRewardAmount',
                            config:{
                                isPercent:true
                            }
                        },
                        {
                            label: '奖励绩效分（服务站）',
                            key: 'orgScore',
                        },
                        {
                            label: '奖励绩效分（绑定车主）',
                            key: 'driverScore',
                        }
                    ],
                    keys: [
                        {
                            label: '注册奖励',
                            key: 'rewardLimit',
                        }
                    ],
                },
                promoterRewardList2:[],
                promoterRewardList3:[]
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
