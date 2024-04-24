<template>
    <!-- 营销活动 支付活动 -->
    <el-form class="flow_form" :inline="true" label-width="140px" :model="dataObject">
        <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig"
            :formData="dataObject" :title="item.title"></dataForm>
        <activityCity :formData="dataObject" />
        <activityCrowd :formData="dataObject" />
        <dataForm v-for="item in confingList(2, activtyConfig.length - 1)" :key="item.index"
            :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <activityGift v-if="dataObject.ruleType === 2 || dataObject.ruleType === 3" :formKeys="giftKeys"
            :formData="tableData" giftTitle="活动配置" :tableList="columnConfig" :isShow="false" />
    </el-form>
</template>

<script>
import activityCrowd from '../../../components/marketing/activityCrowd.vue';
import activityCity from '../../../components/marketing/activityCity.vue';
import dataForm from '../../../components/dataForm.vue';
import { ACTIVITY_TYPE, PARTICIPATE_CONDITION } from '@/utils/enum';
import { marketing } from '../../../mixin';
import activityGift from '../../../components/marketing/activityGift';
export default {
    name: 'waitReward',
    components: { dataForm, activityCrowd, activityCity, activityGift },
    props: {
        dataObject: {
            type: Object,
            default: () => { },
        },
    },
    mixins: [marketing],
    data() {
        return {
            payTypes: [],
            payScenesList: {
                4: '购买包干',
                1: '充值',
                5: '网约车车费',
                13: '网约车收款码',
                8: '村村通车费',
                29: '优惠商城',
                30: '购买会员'
            },
            ruleTypeList: {
                1: '第三方支付优惠活动',
                2: '万顺支付优惠活动',
                3: '第三方支付优惠活动, 万顺支付优惠活动',
            },
            reductionList: {
                1: '折扣减免',
                2: '固定金额减免'
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
            ],

            giftKeys: [
                {
                    nodeHandle: (item, data, index) => {
                        let vals = this.dataObject['payScenes'];
                        let obj = {
                            label: `支付场景：`,
                            val: vals.map(item => this.payScenesList[item]).toString(),
                        };
                        return obj;
                    },
                },
                {
                    nodeHandle: (item, data, index) => {
                        let val = this.dataObject['payTypes'];
                        let obj = {
                            label: `支付方式：`,
                            val: this.payTypes.length > 0 ? val.map(item => this.getEnumVal(this.payTypes, item)).toString() : '--',
                        };
                        return obj;
                    },
                },
                {
                    key: '',
                    nodeHandle: (item, data, index) => {
                        let val = this.dataObject['ruleType'];
                        let obj = {
                            label: `活动方式：`,
                            val: this.ruleTypeList[val],
                        };
                        return obj;
                    },
                },
                {
                    key: '',
                    nodeHandle: (item, data, index) => {
                        let val = this.dataObject['activityText'];
                        let obj = {
                            label: `活动文案：`,
                            val,
                        };
                        return obj;
                    },
                },
                {
                    key: '',
                    nodeHandle: (item, data, index) => {
                        let { payRuleParams } = this.dataObject;
                        let type = payRuleParams && payRuleParams[0].type;
                        let obj = {
                            label: `减免类型：`,
                            val: this.reductionList[type],
                        };
                        return obj;
                    },
                },
            ],
        };
    },
    watch: {
        dataObject: {
            handler: function (newData, oldData) {
                if (newData.ruleType == 1) {
                    let config = {
                        title: '活动配置',
                        formConfig: [
                            {
                                label: '支付场景',
                                key: 'payScenes',
                                nodeHandle: (item, data) => {
                                    let val = data[item.key];
                                    return val.map(item => this.payScenesList[item]).toString();
                                },
                            },
                            {
                                label: '支付方式',
                                key: 'payTypes',
                                nodeHandle: (item, data) => {
                                    let val = data[item.key];
                                    return this.payTypes.length > 0 ? val.map(item => this.getEnumVal(this.payTypes, item)).toString() : '--';
                                },
                            },
                            {
                                label: '活动方式',
                                key: 'ruleType',
                                nodeHandle: (item, data) => {
                                    let val = data[item.key];
                                    return this.ruleTypeList[val];
                                },
                            },
                            {
                                label: '活动文案',
                                key: 'activityText',
                            },
                        ],
                    };
                    this.activtyConfig = [...this.activtyConfig, config];
                }
            },
            deep: true,
        },
    },
    computed: {
        tableData() {
            // 表格数据字段后端返回不同，需要进行数据组装处理
            let { payRuleParams: couponsOrRedPackets } = this.dataObject;
            return [{ couponsOrRedPackets }];
        },
        columnConfig() {
            let { payRuleParams } = this.dataObject;
            let type = payRuleParams && payRuleParams[0].type;
            // 折扣
            let random = [
                {
                    name: '支付金额（元）',
                    _node: row => `【 ${row.minMoney / 100} ~ ${row.maxMoney / 100} ）`,
                },
                {
                    name: '折扣比例（%）',
                    key: 'ratio',
                    _node: row => row.ratio / 100,
                },
                {
                    name: '最高优惠金额（元）',
                    key: 'maxDiscountMoney',
                    _node: row => row.maxDiscountMoney / 100,
                },
            ];
            // 固定
            let successively = [
                {
                    name: '支付金额（元）',
                    _node: row => `【 ${row.minMoney / 100} ~ ${row.maxMoney / 100} ）`,
                },
                {
                    name: '减免金额（元）',
                    key: 'fixedDiscountMoney',
                    _node: row => row.fixedDiscountMoney / 100,
                },
            ];
            return type === 1 ? random : successively;
        },
        confingList() {
            return function (start, end) {
                let config = this.$baseMethod.deepClone(this.activtyConfig);
                return config.splice(start, end);
            };
        },
    },
    created() {
        this.getPayTypes();
    },
    methods: {
        async getPayTypes() {
            try {
                let res = await this._axios({ op: 'selectPayTypes' }, '', '/passengerAct/payAct/select');
                if (res.code === 1) {
                    this.payTypes = res.data.map(item => {
                        return { id: item.key++, name: item.value };
                    });
                }
            } catch (_err) {
                throw _err;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.flow_form {
    padding: 0 40px;
}
</style>
