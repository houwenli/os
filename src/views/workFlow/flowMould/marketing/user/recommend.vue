<template>
    <!-- 营销活动 推荐乘客 -->
    <el-form class="flow_form" :inline="true" label-width="140px" :model="dataObject">
        <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig"
            :formData="dataObject" :title="item.title"></dataForm>
        <activityCity :formData="dataObject" />
        <activityCrowd :formData="dataObject" />
        <activityRule :formData="dataObject" :isHeader="false" />
        <dataForm v-for="item in confingList(2, activtyConfig.length - 1)" :key="item.index"
            :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>

        <div class="data_form">
            <h2 class="flow_title">推荐人奖励</h2>
            <!-- 注册奖励 -->
            <section v-if="Object.keys(targetReward.register).length > 0">
                <p class="gift_name">注册奖励</p>
                <div :class="['gift_content', index > 0 && 'mar_t_16']" v-for="(item, index) in targetReward.register"
                    :key="item.id">
                    <el-row class="form_line">
                        <el-col v-if="dataObject.rewardDistributionMethod == 2" :span="12">
                            <el-form-item label="礼包名称：">
                                <p>{{ item.activityPackName }}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="发放方式：">
                                <p>{{ dataObject.rewardDistributionMethod | rewardTypeFilters }}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="达标注册人数：">
                                <p>{{ item.receiveCondition || '--' }}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <giftTable :tableData="item.couponsOrRedPackets"></giftTable>
                </div>
            </section>
            <!-- 打车奖励 -->
            <section v-if="Object.keys(targetReward.taxi).length > 0">
                <p class="gift_name" :style="{ 'margin-top': '24px' }">打车奖励</p>
                <div :class="['gift_content', index > 0 && 'mar_t_16']" v-for="(item, index) in targetReward.taxi"
                    :key="item.id">
                    <el-row class="form_line">
                        <el-col :span="12">
                            <el-form-item label="礼包名称：">
                                <p>{{item.activityPackName}}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="达标下单数量：">
                                <p>{{ item.receiveCondition || '--' }}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <giftTable :tableData="item.couponsOrRedPackets"></giftTable>
                </div>
            </section>
            <!-- 打车分成 -->
            <section>
                <p class="gift_name" :style="{ 'margin-top': '24px' }">打车分成</p>
                <div class="gift_content pd_b_0">
                    <el-row class="form_line">
                        <el-col :span="12">
                            <el-form-item label="分成比例：">
                                <p>{{ `${dataObject.profitRatio}%` }}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </section>
        </div>

        <div class="data_form">
            <h2 class="flow_title">被推荐人奖励</h2>
            <!-- 注册奖励 -->
            <section v-if="Object.keys(recommend.register).length > 0">
                <p class="gift_name">注册奖励</p>
                <div :class="['gift_content', index > 0 && 'mar_t_16']" v-for="(item, index) in recommend.register"
                    :key="item.id">
                    <giftTable :tableData="item.couponsOrRedPackets"></giftTable>
                </div>
            </section>
            <!-- 打车奖励 -->
            <section v-if="Object.keys(recommend.taxi).length > 0">
                <p class="gift_name" :style="{ 'margin-top': '24px' }">打车奖励</p>
                <div :class="['gift_content', index > 0 && 'mar_t_16']" v-for="(item, index) in recommend.taxi"
                    :key="item.id">
                    <el-row class="form_line">
                        <el-col :span="12">
                            <el-form-item label="礼包名称：">
                                <p>{{item.activityPackName}}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="达标下单数量：">
                                <p>{{ item.receiveCondition || '--' }}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <giftTable :tableData="item.couponsOrRedPackets"></giftTable>
                </div>
            </section>
        </div>
    </el-form>
</template>

<script>
import activityCrowd from '../../../components/marketing/activityCrowd.vue';
import activityCity from '../../../components/marketing/activityCity.vue';
import dataForm from '../../../components/dataForm.vue';
import activityGift from '../../../components/marketing/activityGift';
import activityRule from '../../../components/marketing/activityRule.vue';
import { ACTIVITY_TYPE, PARTICIPATE_CONDITION, REWARD_TYPE } from '@/utils/enum';
import { marketing } from '../../../mixin';
import giftTable from '../../../components/marketing/giftTable.vue';
export default {
    name: 'waitReward',
    components: { dataForm, activityCrowd, activityCity, activityGift, activityRule, giftTable },
    props: {
        dataObject: {
            type: Object,
            default: () => { },
        },
    },
    mixins: [marketing],
    data() {
        return {
            REWARD_TYPE,
            templateList: [],
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
                            label: '活动模板',
                            nodeHandle: (item, data) => {
                                let val = data['minigramPartitionId'];
                                let obj = this.templateList.filter(item => item.id === val)[0];
                                return obj?.patternName || '--';
                            },
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
                    title: '活动配置',
                    formConfig: [
                        {
                            label: '收益截止日期',
                            key: 'endDate',
                        },
                        {
                            label: '邀请人数限制',
                            nodeHandle: (item, data) => {
                                let { inviteLimit, number } = data;
                                let copywriting = '--';
                                switch (inviteLimit) {
                                    case -1:
                                        copywriting = '不限';
                                        break;
                                    case 1:
                                        copywriting = `每日最多邀请 ${number} 人`;
                                        break;
                                    case 2:
                                        copywriting = `活动周期内最多邀请 ${number} 人`;
                                        break;
                                }
                                return copywriting;
                            },
                        },
                    ],
                },
            ],
        };
    },
    computed: {
        rewardText() {
            return function (data) {
                let register = data.register || {};
                return register?.couponsOrRedPackets.length > 1 ? '阶梯奖励' : '固定配比';
            };
        },

        // 推荐人奖励
        targetReward() {
            let result = {};
            // receiveUserType 领取用户类型(0.不限 1.注册用户 2.推荐人 3.被推荐人)
            let list = this.dataObject.activityPacks.filter(item => item.receiveUserType === 2);
            // receiveType 领取类型 (0.不限 1.积分兑换 2.抽奖 3.每日签到送 4.参与活动 5.助力奖励 6.邀请注册 7.邀请打车)
            result.register = list.filter(item => item.receiveType === 6);
            result.taxi = list.filter(item => item.receiveType === 7);
            return result;
        },

        // 被推荐人奖励
        recommend() {
            let result = {};
            // receiveUserType 领取用户类型(0.不限 1.注册用户 2.推荐人 3.被推荐人)
            let list = this.dataObject.activityPacks.filter(item => item.receiveUserType === 3);
            // receiveType 领取类型 (0.不限 1.积分兑换 2.抽奖 3.每日签到送 4.参与活动 5.助力奖励 6.邀请注册 7.邀请打车)
            result.register = list.filter(item => item.receiveType === 6);
            result.taxi = list.filter(item => item.receiveType === 7);
            return result;
        },

        confingList() {
            return function (start, end) {
                let config = this.$baseMethod.deepClone(this.activtyConfig);
                return config.splice(start, end);
            };
        },
    },
    created() {
        this.getTemplateList(8);
    },
    methods: {},
};
</script>

<style lang="scss" scoped>
@import '../../../components/comm.scss';

.flow_form {
    padding: 0 40px;
}

.pd_b_0 {
    padding-bottom: 0 !important;
}

.mar_t_16 {
    margin-top: 16px !important;
}

.data_form {
    .form_line {
        margin-bottom: 16px;
    }

    .gift_name {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #303133;
        padding: 0 0 16px 20px;
        position: relative;
    }

    .gift_name::after {
        content: '';
        position: absolute;
        top: 4px;
        left: 0;
        width: 12px;
        height: 12px;
        background: #c0c4cc;
        border-radius: 50%;
    }

    .gift_content {
        width: 100%;
        padding: 16px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
    }

    /deep/ .ws-table-warp {
        padding: 0 !important;
    }
}
</style>
