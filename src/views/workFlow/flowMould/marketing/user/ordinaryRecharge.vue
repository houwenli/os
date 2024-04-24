<template>
  <!-- 营销活动 普通充值 -->
  
  <el-form class="flow_form" :inline="true" label-width="140px" :model="dataObject">
    <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
    <activityCity :formData="dataObject" />
    <dataForm v-for="item in confingList(2, activtyConfig.length - 1)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
    <showTable :columns="activeRewardColumns" :list="dataObject.rewardConfigurationList" title="参与活动奖励配置">
      <template #chargemoney="{ row }">
        <div>{{ row.rechargeMoney | regFenToYuan}}</div>
      </template>
      <template #wardmoney="{ row }">
        <div>{{ row.rewardMoney | regFenToYuan}}</div>
      </template>
    </showTable>
    <!-- {{dataObject}} -->
  </el-form>
</template>

<script>
import activityCity from '../../../components/marketing/activityCity.vue'
import dataForm from '../../../components/dataForm.vue'
import activityRule from '../../../components/marketing/activityRule.vue'
import rewardConfig from '../../../components/organization/rewardConfig.vue'
import { ACTIVITY_TYPE } from '@/utils/enum'
import { marketing } from '../../../mixin'
import showTable from '../../../components/showTable/index.vue'
export default {
  name: 'recommendRecharge',
  components: { dataForm, activityCity, activityRule, rewardConfig ,showTable},
  props: {
    dataObject: {
      type: Object,
      default: () => {}
    }
  },
  mixins: [marketing],
  data() {
    return {
      activeRewardColumns: [
        {
          label: '充值金额（元）',
          prop: 'rechargeMoney',
          slotName: 'chargemoney'
        },
        {
          label: '赠送金额（元）',
          prop: 'rewardMoney',
          slotName: 'wardmoney'
        }
      ],
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
                return '普通充值送'
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
        },
        {
          title: '活动配置',
          formConfig: [
            {
              label: '乘客风险类型',
              key: 'riskAndSets',
              span: 12,
              nodeHandle: (item, data) => {
                let val = data['riskAndSets'][0]['riskTypeName'] || ''
                return val
              }
            },
            {
              label: '参与配置',
              key: 'riskAndSets',
              span: 12,
              show: (item, data) => {
                return data.riskAndSets[0].participateCondition >= 0 ? true : false
              },
              nodeHandle: (item, data) => {
                let val = ''
                let arr = ['黑名单', '无风险', '有风险', '疑似风险']
                data.riskAndSets.forEach(item => {
                  val = val + arr[item.participateCondition] + '/'
                })
                return val.slice(0, val.length - 1)
              }
            },
            {
              label: '乘客参与限制',
              key: 'joinConfigurationAo',
              nodeHandle: (item, data) => {
                let arr = ['不限', '限每日参与次数', '活动周期内参与次数', '累计充值金额总上限']
                return arr[data.joinConfigurationAo.joinType]
              }
            },
            {
              label: '参与次数',
              key: 'joinConfigurationAo',
              show: (item, data) => {
                return data.joinConfigurationAo.joinType == 1 || data.joinConfigurationAo.joinType == 2 ? true : false
              },
              nodeHandle: (item, data) => {
                return data.joinConfigurationAo.joinTimes
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
    methods: {
      confingList(start, end) {
        let config = this.$baseMethod.deepClone(this.activtyConfig)
        return config.splice(start, end)
      }
    }
}
</script>

<style lang="scss" scoped>
.flow_form {
  padding: 0 40px;
}
</style>
