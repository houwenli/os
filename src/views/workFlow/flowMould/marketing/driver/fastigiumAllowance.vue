<template>
    <!-- 营销活动 包干推荐奖励 -->
    <el-form class="flow_form" :inline="true" label-width="160px" :model="dataObject">
        <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <div class="data_form">
            <h2 class="flow_title">活动围栏</h2>
            <div class="crowd_box">
                <el-row class="form_line">
              <el-col :span="24">
                  <el-form-item label="活动围栏">
                  </el-form-item>
              </el-col>
          </el-row>
                <ul v-if="dataObject.enclosureAoList" class="people_tag clearfix">
                    <li v-for="item in dataObject.enclosureAoList" :key="item.index">{{ item.name }}11</li>
                </ul>
            </div>
        </div>
        <activityCrowd :formData="dataObject" />
        <dataForm v-for="item in confingList(2, activtyConfig.length - 1)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
       
        <div class="data_form">
            <h2 class="flow_title">活动奖励</h2>
            <section v-for="(item, index) in dataObject.allowanceLadderAos" :key="index">
                <div class="gift_content">
                    <el-row class="form_line">
                        <el-col :span="12">
                            <el-form-item label="津贴时段：">
                                <p>{{ item.availableStartTime[0] }} - {{ item.availableStartTime[1] }}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="适用星期：">
                                <p>
                                    {{ item.weeks | weekFilter }}
                                </p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <ws-table-el v-bind="tableConfig" :data="item.duiyingArray" :header-cell-style="{ background: '#F5F7FA' }">
                        <template>
                            <ws-table-column-el label="实付价区间（元）">
                                <template slot-scope="scope">{{ scope.row['priceStart'] }} 至 {{ scope.row['priceEnd'] }}</template>
                            </ws-table-column-el>
                            <ws-table-column-el :label="dataObject.configAo.rewardType==2?'奖励金额（%）':'奖励金额（元）'">
                                <template slot-scope="scope">{{ scope.row['rewardPriceOrPercent'] }}</template>
                            </ws-table-column-el>
                        </template>
                    </ws-table-el>
                </div>
            </section>
        </div>
    </el-form>
</template>

<script>
import activityCrowd from '../../../components/marketing/driverCrowd.vue';
import dataForm from '../../../components/dataForm.vue';
import { ACTIVITY_TYPE } from '@/utils/enum';
export default {
    name: 'fastigiumAllowance',
    components: {
        dataForm,
        activityCrowd
    },
    props: {
        dataObject: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            requestConfing: {
                url: '/driverActivity/common/select',
                op: 'getShowDriverActivityCityCode',
            },
            tableConfig: {
                filterColumns: false,
                indexColumn: true,
                pagination: false,
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
                                return (
                                    data[val[0]] &&
                                    data[val[1]] &&
                                    `${this.$vuex.$baseMethod.formatData(data[val[0]])} ${data.nameId == 61 ? '至 ' : '~ '} ${this.$vuex.$baseMethod.formatData(data[val[1]])}`
                                );
                            },
                        },
                        {
                            label: '活动优先级',
                            key: 'priority',
                        },
                        {
                            label: '活动类型',
                            key: 'trialFlag',
                            nodeHandle: (item, data) => {
                                if (data.trialFlag) {
                                    return '试用';
                                } else {
                                    return '正式';
                                }
                            },
                        },
                    ],
                },
                {
                    title: '风控配置',
                    formConfig: [
                        {
                            label: '活动风险类型',
                            key: 'riskTypeName',
                            nodeHandle: (item, data) => {
                                if(data.riskTypeFilterList.length>0){
                                    let list=data.riskTypeFilterList.filter(val=>{
                                        return val.riskTypeId==data.riskAoList[0].activityRiskType
                                    })
                                    return list?list[0].riskTypeName:'--';
                                }else{
                                    return '--'
                                }
                              
                            },
                        },
                        {
                            label: '参与配置',
                            key: 'riskTypeName',
                            show: (item, data) => {
                                const risk = data.riskAoList.some(e => e.activityRiskType == -1);
                                return !risk;
                            },
                            nodeHandle: (item, data) => {
                                let riskName = data.riskAoList.map(item => item.riskTypeName);
                                return riskName.toString().replace(/,/g, ' / ');
                            },
                        },
                    ],
                },
                {
                    title: '活动配置',
                    formConfig: [
                        {
                            label: '订单风险',
                            nodeHandle: (item, data) => {
                                let arr = new Map([
                                    [0, '不限'],
                                    [1, '正常']
                                ]);
                                return arr.get(Number(data.configAo.orderRisk));
                            },
                        },
                        {
                            label: '订单类型',
                            key: 'orderType',
                            nodeHandle: (item, data) => {
                                let arr = new Map([
                                    [20, '实时单'],
                                    [21, '预约单'],
                                    [22, '扫码单'],
                                ]);
                                return data.configAo.orderType
                                    .map(item => {
                                        return arr.get(item);
                                    })
                                    .join();
                            },
                        },
                        {
                            label: '奖励方式',
                            nodeHandle: (item, data) => {
                                let arr = new Map([
                                    [1, '按固定金额奖励'],
                                    [2, '按订单金额比例奖励'],
                                ]);
                                return arr.get(Number(data.configAo.rewardType));
                            },
                        },
                        {
                            label: '最高奖励金额',
                            key: 'rewardLimit',
                            show: (item, data) => {
                                return data.configAo.rewardType == 2;
                            },
                            nodeHandle: (item, data) => {
                                return data.configAo.rewardLimit;
                            },
                        },
                    ],
                },
            ],
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
    filters: {
        weekFilter(val) {
            let arr = new Map([
                [1, '星期一'],
                [2, '星期二'],
                [3, '星期三'],
                [4, '星期四'],
                [5, '星期五'],
                [6, '星期六'],
                [7, '星期日'],
            ]);
            return val
                .map(item => {
                    return arr.get(item);
                })
                .join();
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

.crowd_box {
    padding: 16px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
}

.people_tag {
    width: 100%;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    li {
        font-size: 14px;
        background: #ecf5ff;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #409eff;
        padding: 8px 24px;
        border-radius: 4px;
        margin-bottom: 16px;
        margin-right: 16px;
    }
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
        margin-bottom: 16px;
    }

    /deep/ .ws-table-warp {
        padding: 0 !important;
    }
}
</style>
