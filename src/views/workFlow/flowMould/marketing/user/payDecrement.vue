<template>
    <!-- 营销活动 新支付立减 -->
    <el-form class="flow_form" :inline="true" label-width="140px" :model="dataObject">
        <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <activityCity :formData="dataObject" />
        <activityCrowd :formData="dataObject" />
        <dataForm v-for="item in confingList(2, activtyConfig.length - 1)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <activityGift :formKeys="giftKeys" :formData="tableData" giftTitle="活动奖励" :tableList="columnConfig" :isShow="false" />
    </el-form>
</template>

<script>
import activityCrowd from '../../../components/marketing/activityCrowd.vue';
import activityCity from '../../../components/marketing/activityCity.vue';
import dataForm from '../../../components/dataForm.vue';
import activityGift from '../../../components/marketing/activityGift';
import { ACTIVITY_TYPE, PARTICIPATE_CONDITION, SERVE_TYPE } from '@/utils/enum';
import { marketing } from '../../../mixin';
import { mapState } from 'vuex';
export default {
    name: 'waitReward',
    components: { dataForm, activityCrowd, activityCity, activityGift },
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
                                if (!activityRiskType) return false;
                                return activityRiskType === -1 ? false : true;
                            },
                            nodeHandle: (item, data) => {
                                let vals = (data['riskAndSets'] || []).map(type => type.participateCondition);
                                return vals.map(val => this.getEnumVal(PARTICIPATE_CONDITION, val)).toString();
                            },
                        },
                    ],
                },
                {
                    title: '活动规则',
                    formConfig: [
                        {
                            label: '使用条件',
                            key: 'useCouponsRuleType',
                            nodeHandle: (item, data) => {
                                let val = data[item.key];
                                let list = {
                                    0: '不与出行券共用',
                                    1: '先参与活动后使用出行券',
                                    2: '先使用出行券后参与活动',
                                };
                                return list[val];
                            },
                        },
                        {
                            label: '订单类型',
                            key: 'orderServiceType',
                            nodeHandle: (item, data) => {
                                let vals = data[item.key];
                                return vals.map(val => this.getEnumVal(SERVE_TYPE, val)).toString();
                            },
                        },
                    ],
                },
            ],
            giftKeys: [
                {
                    key: 'reductType',
                    nodeHandle: (item, data, index) => {
                        let val = data[item.key];
                        let reductType = {
                            0: '顺序立减',
                            1: '随机立减',
                        };
                        let obj = {
                            label: `活动方式：`,
                            val: reductType[val],
                        };
                        return obj;
                    },
                },
                {
                    nodeHandle: (item, data, index) => {
                        let { reductType, times, period, joinPeriodType } = data;
                        let obj = {
                            label: `活动参与次数：`,
                            val: '',
                        };

                        switch (joinPeriodType) {
                            case -1:
                                obj.val = '不限';
                                break;
                            case 0:
                                obj.val = `周期内参与${times}次`;
                                break;
                            case 1:
                                obj.val = `${period}天内可参加${times}次`;
                                break;
                            default:
                                obj.val = '--';
                                break;

                        }

                        // 顺序立减不展示
                        reductType === 0 && (obj = {});
                        return obj;
                    },
                },
            ],
            discountType: {
                // 立减类型(折扣 or 减免)  [1.订单金额-折扣金额  2.订单金额-减免优惠
                1: '折扣',
                2: '减免',
            },
        };
    },
    computed: {
        ...mapState({
            businessTypes: state => state.workFlow.businessTypesFilters,
        }),
        columnConfig() {
            let { reductType } = this.dataObject;
            // 随机立减
            let random = [
                {
                    name: '礼包名称',
                    key: 'activityPackName',
                },
                {
                    name: '总数',
                    key: 'totalTimes',
                },
                {
                    name: '立减类型',
                    key: 'discountsType',
                    _node: row => {
                        let { discountsType } = row;
                        return this.discountType[discountsType];
                    },
                },
                {
                    name: '立减金额',
                    key: 'discountNumber',
                    _node: row => this.moenyHandle(row),
                },
            ];
            // 顺序立减
            let successively = [
                {
                    name: '优先级',
                    key: 'priority',
                },
                {
                    name: '礼包名称',
                    key: 'activityPackName',
                },
                {
                    name: '总数',
                    key: 'totalTimes',
                },
                {
                    name: '立减类型',
                    key: 'discountsType',
                    _node: row => {
                        let { discountsType } = row;
                        // 立减类型(折扣 or 减免)  [1.订单金额-折扣金额  2.订单金额-减免优惠
                        let obj = {
                            1: '折扣',
                            2: '减免',
                        };
                        return obj[discountsType];
                    },
                },
                {
                    name: '立减金额',
                    key: 'discountNumber',
                    _node: row => this.moenyHandle(row),
                },
                {
                    name: '订单服务类型',
                    key: 'serviceTypes',
                    width: '260px',
                    _node: row => {
                        let { serviceTypes } = row;
                        return serviceTypes ? serviceTypes.map(val => this.getEnumVal(this.businessTypes, val, 'value')).join(' / ') : '--'
                    },
                },
                {
                    name: '单个用户可参与次数',
                    key: 'userPartInNumber',
                    width: '200px',
                    _node: row => {
                        let { userPartInTimes, userPartInNumber } = row;
                        return userPartInTimes === -1 ? '不限' : userPartInNumber;
                    },
                },
            ];
            return reductType === 0 ? successively : random;
        },
        tableData() {
            // 表格数据字段后端返回不同，需要进行数据组装处理
            let { discountsRules, reductType,joinPeriodType,times,period } = this.dataObject;
            return [{ couponsOrRedPackets: discountsRules, reductType,joinPeriodType,times,period }];
        },
        confingList() {
            return function (start, end) {
                let config = this.$baseMethod.deepClone(this.activtyConfig);
                return config.splice(start, end);
            };
        },
    },

    methods: {
        moenyHandle(row) {
            let { discountNumber, discountsType, topDiscountMoney } = row;
            let text;
            // 立减类型(折扣 or 减免)  [1.订单金额-折扣金额  2.订单金额-减免优惠
            switch (discountsType) {
                case 1:
                    text = `${discountNumber / 100 || '--'} 折/${topDiscountMoney / 100 || '--'} 元`;
                    break;
                case 2:
                    text = `${topDiscountMoney / 100 || '--'} 元`;
                    break;
                default:
                    text = '--';
                    break;
            }
            return text;
        },
    },
};
</script>

<style lang="scss" scoped>
.flow_form {
    padding: 0 40px;
}
</style>
