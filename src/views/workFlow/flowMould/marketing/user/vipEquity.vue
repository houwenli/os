<template>
    <!-- 营销活动 等待奖励 -->
    <el-form class="flow_form" :inline="true" label-width="140px" :model="pageData">
        <dataForm v-for="item in activtyConfig" :key="item.index" :formConfig="item.formConfig" :formData="pageData"
            :title="item.title"></dataForm>
        <div class="data_form">
            <h2 class="flow_title">活动礼包</h2>
            <section v-for="(activityPack, index) in pageData.cycleRewardAoList" :key="index">
                <p class="gift_name" :style="{ 'margin-top': index === 0 ? '0px' : '24px' }">{{
                `${activityPack.activityPackName}详情${index === 0 ? '（购买后即可领取）' : ''}` }}</p>
                <div class="gift_content">
                    <el-row class="form_line" v-if="index === 0">
                        <el-col :span="12">
                            <el-form-item label="领取隔时长：">
                                <p>{{ activityPack['intervalDays'] }}天</p>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <giftTable :tableData="activityPack.couponsOrRedPackets"></giftTable>
                </div>
            </section>
        </div>
    </el-form>
</template>

<script>
import dataForm from '../../../components/dataForm.vue';
import { ACTIVITY_TYPE } from '@/utils/enum';
import giftTable from '../../../components/marketing/giftTable.vue';
export default {
    name: 'waitReward',
    components: { dataForm, giftTable },
    props: {
        dataObject: {
            type: Object,
            default: () => { },
        },
    },
    computed: {
        pageData() {
            let { cycleRewardAoList, intervalDays } = this.dataObject;
            let gift = {};
            for (let item of cycleRewardAoList) {
                let cycle = item.cycleNumber; // 第几周
                if (gift[cycle]) gift[cycle].push(item);
                if (!gift[cycle]) {
                    gift[cycle] = [];
                    gift[cycle].push(item);
                }
            }
            this.dataObject.cycleRewardAoList = Object.values(gift).map((item, index) => {
                if (index === 0) return { intervalDays, couponsOrRedPackets: item, activityPackName: `第${index + 1}周期礼包` };
                return { couponsOrRedPackets: item, activityPackName: `第${index + 1}周期礼包` };
            });
            console.log(this.dataObject);
            return this.dataObject;
        },
    },
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
                        }
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
                            label: '活动优先级',
                            key: 'priority',
                        },
                    ],
                },
            ],
        };
    },
};
</script>

<style lang="scss" scoped>
@import '../../../components/comm.scss';

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

.flow_form {
    padding: 0 40px;
}
</style>
