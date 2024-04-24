<template>
  <el-form class="flow_form" :inline="true" label-width="140px" :model="dataObject">
      <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
      <!-- 活动城市 -->
      <activityCity :formData="dataObject" />
      <!-- 活动规则 -->
      <activityRule :formData="dataObject" :isHeader="false" listName="ruleDescList" />
      <!-- 风控配置 -->
      <dataForm v-for="item in confingList(2, activtyConfig.length - 1)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
      <!-- 纯tableUI展示组件 -->
      <showTable v-if="driverActiveConfigList.length" :columns="driverActiveConfigColumns" :list="driverActiveConfigList" title="车主活动配置">
        <template #content>
          <span>
            推荐用户订单
          </span>
        </template>
      </showTable>

      <showTable v-if="promoterConfigList.length" :columns="promoterConfigColumns" :list="promoterConfigList" title="推广员活动配置">
        <template #content>
          <span>
            推荐用户订单
          </span>
        </template>
      </showTable>
  </el-form>
</template>

<script>
// 机构活动-推荐代驾司机
import activityCity from '../../../components/organization/activityCity.vue';
import dataForm from '../../../components/dataForm.vue';
import activityRule from '../../../components/organization/activityRule.vue';
import rewardConfig from '../../../components/organization/rewardConfig.vue';
import activityGift from '../../../components/organization/ConfigActivityGift.vue';
import { organizationType } from '../../data.js'
import Big from 'big.js'
import { cloneDeep } from 'lodash-es'
import showTable from '../../../components/showTable/index.vue'

const driverActiveConfigColumns = [
// 这个babel值是动态的
  {
    label: '订单数量',
    prop: 'rigisterNumber'
  },
  {
    label: '奖励金额（车主）',
    prop: 'rewardAmount'
  },
  {
    label: '奖励绩效分（车主）',
    prop: 'driverScore'
  },
  {
    label: '奖励金额（实体店）',
    prop: 'orgRewardAmount'
  },
  {
    label: '奖励绩效分（实体店）',
    prop: 'orgScore'
  }
]

const promoterConfigColumnsMap = [
  {
    label: '订单数量',
    prop: 'rigisterNumber'
  },
  {
    label: '奖励金额（推广员）',
    prop: 'rewardAmount'
  },
  {
    label: '奖励金额（实体店）',
    prop: 'orgRewardAmount'
  },
  {
    label: '奖励绩效分（实体店）',
    prop: 'orgScore'
  },
  {
    label: '奖励绩效分（绑定车主）',
    prop: 'driverScore'
  },
]

export default {
name: 'recommendRideHailing',
components: { dataForm, activityCity, activityRule, rewardConfig, activityGift, showTable },
props: {
  dataObject: {
    type: Object,
    default: () => { }
  },
},
data () {
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
              return '推荐代驾订单'
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
            label: '机构类型',
            key: 'orgTypeList',
            nodeHandle: (item, data) => {
              let val = data[item.key]

              return val.map(key => organizationType[key]).join()
            }
          }
        ],
      },
      {
        title: '风控配置',
        formConfig: [
          {
              label: '推广员参与配置',
              key: 'recommendRiskTypeList',
              nodeHandle: (item, data) => {
                  let arr = new Map([
                      [0, '黑名单'],
                      [1, '无风险'],
                      [2, '有风险'],
                      [3, '疑似风险'],
                  ]);
                  return data.recommendRiskTypeList.map(item=>{
                      return arr.get(item)
                  }).join()
              },
          },
          {
              label: '被推荐人参与配置',
              key: 'refereeRiskTypeList',
              nodeHandle: (item, data) => {
                  let arr = new Map([
                      [0, '黑名单'],
                      [1, '无风险'],
                      [2, '有风险'],
                      [3, '疑似风险'],
                  ]);
                  return data.recommendRiskTypeList.map(item=>{
                      return arr.get(item)
                  }).join()
              },
          }
        ]
      },
    ],

    driverActiveConfigColumns: [],
    driverActiveConfigList: [],

    // 推广员活动配置
    promoterConfigColumns: [],
    promoterConfigList: []
  };
},
computed: {
  confingList () {
    return function (start, end) {
      let config = this.$baseMethod.deepClone(this.activtyConfig);
      return config.splice(start, end);
    };
  }
},
watch: {
  dataObject: {
    handler: function () {

      this.setTable()
    },
    deep: true,
    immediate: true,
  },
},

methods: {
  setTable () {
    this.setCarActiveConfig()

    this.setPromoterConfig()
  },

  /**
   * 司机配置
   */
  setCarActiveConfig () {
    const list = cloneDeep(this.dataObject.driverRewardList) || []
    if (list.length === 0) return

    let columns = driverActiveConfigColumns


    this.driverActiveConfigColumns = columns

    list.forEach(item => {
      item.rewardAmount = Big(item.rewardAmount).toFixed(2)
      item.orgRewardAmount = Big(item.orgRewardAmount).toFixed(2)
      item.rigisterNumber = `${item.minOrder}-${item.maxOrder}`
      return item
    })

    this.driverActiveConfigList = list
  },

  /**
   * 推广员配置
   */
  setPromoterConfig () {
    const list = cloneDeep(this.dataObject.promoterRewardList) || []
    if (list.length === 0) return

    this.promoterConfigColumns = promoterConfigColumnsMap

    list.forEach(item => {
      item.rewardAmount = Big(item.rewardAmount).toFixed(2)
      item.orgRewardAmount = Big(item.orgRewardAmount).toFixed(2)
      item.rigisterNumber = `${item.minOrder}-${item.maxOrder}`
      return item
    })

    this.promoterConfigList = list
  },

  /**
  * 显示奖励方式
  */
  showRewardTypeText (item) {
    return item.rewardType === 1 ? '普通奖励' : '梯度奖励'
  }
}
};
</script>

<style lang="scss" scoped>
.flow_form {
  padding: 0 40px;
}
</style>
