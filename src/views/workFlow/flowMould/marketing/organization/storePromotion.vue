<template>
    <!-- 机构活动 实体店推广 -->
    <el-form class="flow_form" :inline="true" label-width="160px" :model="dataObject">
        <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <activityCity :formData="dataObject" />
        <activityRule :formData="dataObject" />
        <dataForm v-for="item in confingList(2, activtyConfig.length - 1)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <activityGift :formKeys="giftKeys" :formData="dataObject" />
    </el-form>
</template>

<script>
import activityCity from '../../../components/organization/activityCity.vue';
import activityRule from '../../../components/organization/activityRule.vue';
import dataForm from '../../../components/dataForm.vue';
import activityGift from '../../../components/organization/activityGift';
import { ACTIVITY_TYPE, PARTICIPATE_CONDITION } from '@/utils/enum';
import { marketing } from '../../../mixin';
export default {
    name: 'storePromotion',
    components: { dataForm, activityCity, activityGift, activityRule },
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
                            label: '活动模板',
                            nodeHandle: (item, data) => {
                                let val = data['partitionId'];
                                let res = this.modelList.filter(i => i.id === val);
                                if(res.length>0){
                                    return res[0].patternName;
                                }
                            }
                        },
                    ],
                },
                {
                    title: '风控配置',
                    formConfig: [
                        {
                            label: '活动风险类型',
                            nodeHandle: (item, data) => {
                                let val = data['riskControlAos'];
                                let { activityRiskType } = val[0] || {};
                                let res = this.riskAndSets.filter(item => item.riskTypeId === activityRiskType);
                                return res.length > 0 ? res[0].riskTypeName : '不限';
                            },
                        },
                        {
                            label: '参与配置',
                            key: 'riskTypeName',
                            show: (item, data) => {
                                let val = data['riskControlAos'];
                                let { activityRiskType } = val[0] || {};
                                return activityRiskType === -1 ? false : true;
                            },
                            nodeHandle: (item, data) => {
                                let vals = (data['riskControlAos'] || []).map(type => type.participateCondition);
                                return vals.map(val => this.getEnumVal(PARTICIPATE_CONDITION, val)).toString();
                            },
                        },
                    ],
                },
                {
                    title: '活动配置',
                    formConfig: [
                        {
                            label: '实体店最低购买数量',
                            key: 'minPurchaseNum',
                        },
                        {
                            label: '单个用户领取次数',
                            nodeHandle: (item, data) => {
                                let val = data['assistanceType'];
                                let num = data['pickUpTimes'];
                                return val==0?'不限':val==1?'活动周期内可领取'+num+'次':'每日可领取'+num+'次';
                            }
                        },
                        {
                            label: '用户领取礼包条件',
                            nodeHandle: (item, data) => {
                                let val = data['userReceivingCondition'];
                                return val==0?'不限':'关注实体店';
                            }
                        }
                    ],
                },
            ],
            giftKeys: [
                {
                    nodeHandle: (item, data, index) => {
                        let list = data['packRelationAoList'];
                        let val = 0
                        list.map(item => {
                            return val += (item.faceValue / 100) * (item.sendNumber || 0)
                        });
                        val=val.toFixed(2)
                        return {
                            label: `单个礼包价值：`,
                            val: val+'元',
                        };
                    },
                },
                {
                    nodeHandle: (item, data) => {
                        let list = data['packRelationAoList'];
                        let val = 0
                        list.map(item => {
                            return val += (item.unitPrice ) * (item.sendNumber || 0)
                        })[0];
                        val=val.toFixed(2)
                        return {
                            label: `单个礼包售价：`,
                            val: val+'元',
                        };
                    },
                },
                {
                    nodeHandle: (item, data) => {
                        let { giftPackCount } = data;
                        return {
                            label: `礼包总数量：`,
                            val: `${giftPackCount} 个`,
                        };
                    },
                },
            ],
            tableConfig: {
                // pageSizeList: [5, 10, 20, 50],
                filterColumns: false,
                indexColumn: false,
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
