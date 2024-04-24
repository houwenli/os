<template>
    <el-form class="flow_form" :inline="true" label-width="140px" :model="dataObject">
        <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <activityCity :formData="dataObject" />
        <div class="data_form">
            <h2 class="flow_title">活动奖励</h2>
            <ws-table-el ref="table" :data="dataObject.giftPackages" :header-cell-style="{ background: '#F5F7FA' }" :pagination="false">
                <ws-table-column-el prop="giftName" label="换电券名称"></ws-table-column-el>
                <ws-table-column-el prop="showName" label="App显示别名"></ws-table-column-el>
                <ws-table-column-el prop="couponsType" label="券包类型">
                    <template slot-scope="scope">
                        {{ ['-', '满减', '立减', '折扣'][scope.row.couponsType] }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="amountLimitation" label="优惠金额">
                    <template slot-scope="scope">
                        {{ changeMoney(scope.row) }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="sendNumber" label="数量"></ws-table-column-el>
            </ws-table-el>
        </div>
    </el-form>
</template>

<script>
import activityCity from '../../../components/marketing/activityCity.vue'
import dataForm from '../../../components/dataForm.vue'
import activityRule from '../../../components/marketing/activityRule.vue'
import rewardConfig from '../../../components/organization/rewardConfig.vue'
import { ACTIVITY_TYPE } from '@/utils/enum'
import { marketing } from '../../../mixin'
export default {
    name: 'electric',
    components: { dataForm, activityCity, activityRule, rewardConfig },
    props: {
        dataObject: {
            type: Object,
            default: () => {}
        }
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
                            key: 'procdefNo'
                        },
                        {
                            label: '审批类型',
                            key: 'name'
                        },
                        {
                            label: '发起时间',
                            key: 'startTime'
                        },
                        {
                            label: '发起人',
                            key: 'startUserName'
                        },
                        {
                            label: '所属部门',
                            key: 'startDeptName'
                        }
                    ]
                },
                {
                    title: '基础信息',
                    formConfig: [
                        {
                            label: '活动类型',
                            key: 'activityType',
                            nodeHandle: (item, data) => {
                                let val = data[item.key]
                                return this.getEnumVal(ACTIVITY_TYPE, val)
                            }
                        },
                        {
                            label: '活动名称',
                            key: 'activityName'
                        },
                        {
                            label: '活动时间',
                            key: ['activityStartDate', 'activityEndDate'],
                            nodeHandle: (item, data) => {
                                let val = item.key
                                return data[val[0]] && data[val[1]] && `${data[val[0]]} ~ ${data[val[1]]}`
                            }
                        },
                        {
                            label: '活动优先级',
                            key: 'priority',
                            nodeHandle: (item, data) => {
                                return data.priority
                            }
                        }
                    ]
                }
            ],
            configForm: 'recommendRecharge',
            configData: [
                {
                    title: '充值送配置',
                    tableName: 'configList',
                    tableCloumn: [
                        { label: '推荐实付充值金额（元）', prop: 'minNumber-maxNumber', type: 'a' },
                        { label: '奖励金额（元）', prop: 'rechargeMoney', type: 'b' }
                    ]
                }
            ]
        }
    },
    computed: {
        confingList() {
            return function (start, end) {
                let config = this.$baseMethod.deepClone(this.activtyConfig)
                return config.splice(start, end)
            }
        },
        changeMoney() {
            return function (val) {
                let str = '满' + this.$baseMethod.regFenToYuan(val.amountLimitation) + '元减' + this.$baseMethod.regFenToYuan(val.faceValue) + '元'
                return str
            }
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../../../components/comm.scss';
.flow_form {
    padding: 0 40px;
}
</style>
