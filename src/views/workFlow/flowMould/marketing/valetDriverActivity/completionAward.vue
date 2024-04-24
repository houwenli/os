<template>
  <div>
    <el-form class="flow_form" :model="dataObject">
      <dataForm v-for="(item, index) in activtyConfig.slice(0, 2)" :key="index + 'one'" :formConfig="item.formConfig" :formData="formData" :title="item.title"></dataForm>

      <!-- 活动城市 -->
      <activityCity :formData="formData" :requestConfing="requestConfing"/>

      <showTable :columns="activeRuleColumn" :list="formData.ruleDescList" title="活动规则"></showTable>

      <!-- 活动配置 -->
      <dataForm v-for="(item, index) in activtyConfig.slice(2, 4)" :key="index + 'two'" :formConfig="item.formConfig" :formData="formData" :title="item.title"></dataForm>

      <showTable :columns="activeRewardColumn" :list="activeRewardList" title="活动奖励">
        <template #content>
          <el-row>
            <el-col :span="12">
              <div class="header-content">
                <div class="content-left">完单类型：</div>
                <div>普通完单</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="header-content">
                <div class="content-left content-left-2">奖励类型：</div>
                <div>{{ formData.rewardConfig.rewardType === 1 ? '固定金额' : '比例金额' }}</div>
              </div>
            </el-col>
          </el-row>
        </template>
      </showTable>

      <div class="data_form">
        <h2 class="flow_title">push消息配置</h2>
        <el-row class="form_line" v-if="formData.pushTemplateId === '-1'">
          <el-col :span="24">
            <el-form-item label="push推送：">不推送</el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- push消息 显示表格 -->
      <showTable v-if="formData.pushTemplateId !== '-1'" :columns="pushTemplateColumn" :list="pushTemplate"></showTable>

      <div class="data_form">
        <h2 class="flow_title">短信配置</h2>
        <el-row class="form_line" v-if="formData.smsTemplateId === '-1'">
          <el-col :span="24">
            <el-form-item label="短信推送：">不推送</el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 短信消息 显示表格 -->
      <showTable v-if="formData.smsTemplateId !== '-1'" :columns="smsTemplateColumn" :list="smsTemplate"></showTable>
    </el-form>
  </div>
</template>

<script>
import dataForm from '../../../components/dataForm.vue'
import basicsTable from '../../../components/agentDriving/basicsTable.vue'

import activityCity from '../../../components/marketing/activityCity.vue'
import showTable from '../../../components/showTable/index.vue'
import { _axios } from '@/utils/commMethods.js'
import Big from 'big.js'

const activeTypeList = [
  {
    id: 1000,
    text: '代驾司机完单奖'
  }
  // 后续可新增类型
]

const activeRewardColumn2 = [
  {
    label: '每完成订单数',
    prop: 'targetOrder'
  },
  {
    label: '奖励比例',
    prop: 'rewardAmount'
  },
  {
    label: '最高奖励金额（元）',
    prop: 'rewardLimit'
  }
]

const activeRewardColumn1 = [
  {
    label: '每完成订单数',
    prop: 'targetOrder'
  },

  {
    label: '奖励金额（元）',
    prop: 'rewardAmount'
  }
]

const getTemplateName = async partitionId => {
  try {
    const url = '/agentDrivingActivity/pattern/select'

    const res = await _axios(
      {
        op: 'selectEnablePattern',
        patternType: 1000
      },
      null,
      url
    )

    if (res.code === 1) {
      let c = (res.data.body || []).find(item => item.id === partitionId)

      return c.patternName
    }
    return ''
  } catch (error) {
    console.log(error)
  }
}

// 代驾司机完单奖
export default {
  name: 'completionAward',
  components: { dataForm, basicsTable, activityCity, showTable },
  props: {
    dataObject: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      formData: { ...this.dataObject },
      requestConfing: {
        url: '/driverActivity/common/select',
        op: 'getShowDriverActivityCityCode'
      },
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
          title: '基本信息',
          formConfig: [
            {
              label: '活动类型',
              key: 'activityType',
              nodeHandle: (item, data) => {
                const c = activeTypeList.find(item => item.id === data.activityType)

                if (c) {
                  return c.text
                }
                return ''
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
              key: 'priority'
            },
            {
              label: '活动模板',
              key: 'patternName'
            }
          ]
        },

        {
          title: '风控配置',
          formConfig: [
            {
              label: '目标人群',
              key: 'targertcrowdType',
              nodeHandle: (item, data) => {
                let m = {
                  0: '不限',
                  1: '包干',
                  2: '非包干'
                }

                return m[data.targertcrowdType] || ''
              }
            }
          ]
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
                ])
                return arr.get(Number(data.orderRisk))
              }
            },
            {
              label: '订单类型',
              key: 'serviceTypeList',
              nodeHandle: (item, data) => {
                let arr = new Map([
                  [1, '实时单'],
                  [2, '预约单'],
                  [3, '扫码单']
                ])
                return data.serviceTypeList
                  .map(item => {
                    return arr.get(item)
                  })
                  .join('/')
              }
            }
          ]
        }
      ],

      activeRuleColumn: [
        {
          label: '活动规则内容',
          prop: 'ruleContent'
        }
      ],

      pushTemplateColumn: [
        {
          label: '消息ID',
          prop: 'id'
        },
        {
          label: '消息标题',
          prop: 'title'
        },
        {
          label: '消息内容',
          prop: 'context'
        }
      ],

      smsTemplateColumn: [
        {
          label: '消息ID',
          prop: 'id'
        },
        {
          label: '短信名称',
          prop: 'smsName'
        },
        {
          label: '消息内容',
          prop: 'smsTemplate'
        }
      ]
    }
  },

  computed: {
    activeRewardColumn() {
      // 固定金额
      if (this.dataObject.rewardConfig.rewardType === 1) {
        return activeRewardColumn1
      }

      // 比例金额
      return activeRewardColumn2
    },

    activeRewardList() {
      // 将分转成元
      let rewardAmount = this.dataObject.rewardConfig.rewardAmount

      // 奖励类型为 比例金额 - 需要做分转元
      let rewardLimit = this.dataObject.rewardConfig.rewardLimit
      let rewardType = this.dataObject.rewardConfig.rewardType

      let item = {
        ...this.dataObject.rewardConfig
      }

      // 固定金额
      if (rewardType === 1) {
        item.rewardAmount = Big(rewardAmount).div(100).toFixed(2)
      } else {
        // 比例金额
        item.rewardLimit = Big(rewardLimit).div(100).toFixed(2)
        item.rewardAmount = Big(rewardAmount).div(100) + '%'
      }

      return [item]
    },

    /**
     * push的模版 列表数据
     */
    pushTemplate() {
      if (this.dataObject.pushTemplate) {
        return [
          {
            ...this.dataObject.pushTemplate.data,
            // 这个模版id需要取外层的字段值
            id: this.dataObject.pushTemplateId
          }
        ]
      }
      return []
    },

    /**
     * 短信的模版 列表数据
     */
    smsTemplate() {
      if (this.dataObject.smsTemplate) {
        return [this.dataObject.smsTemplate.data]
      }
      return []
    }
  },

  async created() {
    const patternName = await getTemplateName(this.dataObject.partitionId)

    this.$set(this.formData, 'patternName', patternName)
  },

  methods: {}
}
</script>
<style lang="scss" scoped>
@import '../../../components/comm.scss';

.flow_form {
  padding: 0 40px;
}

.header-content {
  display: flex;
  .content-left {
    width: 160px;
    text-align: right;
  }

  .content-left-2 {
    width: 202px;
  }
}
</style>
