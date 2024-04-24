<template>
  <!-- 营销活动 电商推广 -->
  <el-form class="flow_form" :inline="true" label-width="155px"
    :model="dataObject">
    <dataForm v-for="item in activtyConfig" :key="item.index"
      :formConfig="item.formConfig" :formData="dataObject" :title="item.title">
    </dataForm>
    <!-- 活动城市 -->
    <activityCity :formData="dataObject" />

    <!-- 活动规则 -->
    <activityRule :formData="dataObject" :isHeader="false" />

    <!-- 活动奖励 -->
    <!-- 纯tableUI展示组件 -->
    <showTable  v-if="activeRewardList.length" :columns="activeRewardColumns" :list="activeRewardList"
      title="活动奖励">
      <template #money="{ row }">
        <div>{{ faceValueHandle(row) }}</div>
      </template>
    </showTable>
  </el-form>
</template>

<script>
import activityCity from '../../../components/marketing/activityCity.vue'
import dataForm from '../../../components/dataForm.vue'
import activityRule from '../../../components/marketing/activityRule.vue'
import showTable from '../../../components/showTable/index.vue'

const activeRewardColumns = [
  {
    label: '优惠券名称',
    prop: 'giftName'
  },
  {
    label: 'APP别名',
    prop: 'showName'
  },
  {
    label: '券包类型',
    prop: 'couponsTypeText',
    width: 100
  },
  {
    label: '金额/折扣',
    slotName: 'money'
  },
  {
    label: '数量',
    prop: 'sendNumber',
    width: 100
  },
  {
    label: '有效日期',
    prop: 'effectiveTime',
    width: 340
  },
  {
    label: '商品SPU名称',
    prop: 'commodityName'
  }
]

let couponsTypeMap = {
  1: '满减',
  2: '折扣',
  3: '立减'
}

export default {
  name: 'ECommercePromotion',
  components: { dataForm, activityCity, activityRule, showTable },
  props: {
    dataObject: {
      type: Object,
      default: () => { }
    }
  },
  data () {
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
              nodeHandle: () => {
                return '电商推广'
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
            }
          ]
        }
      ],

      activeRewardColumns: activeRewardColumns
    }
  },
  computed: {
    // 活动奖励
    activeRewardList () {
      let packs = this.dataObject.giftPackages || []

      packs.forEach(p => {
        p.couponsTypeText = couponsTypeMap[p.couponsType]
        if (p.couponsPeriodType === 1) {
          // 红包
          p.effectiveTime = `领取后${p.validDay || '--'}天内有效`
        } else {
          p.effectiveTime = `${p.effectiveStartTime || '--'} 至 ${p.effectiveEndTime || '--'}`
        }

        return p
      })

      return packs
    }
  },

  methods: {
    faceValueHandle(row) {
            let { couponsType, faceValue, amountLimitation, redPacketMoney, activityPackType } = row;
            let text;
            switch (couponsType) {
                case 1: // 满减
                    text = `满${amountLimitation / 100 || '--'}元减${faceValue / 100 || '--'} 元`;
                    break;
                case 2: // 折扣
                    text = `${faceValue / 100 || '--'} 折`;
                    break;
                case 3: // 立减
                    text = `${faceValue / 100 || '--'} 元`;
                    break;
                default:
                    text = '--';
                    break;
            }
            activityPackType == 2 && (text = `${redPacketMoney / 100} 元`)
            return text;
        },
  }
}
</script>

<style lang="scss" scoped>
.flow_form {
  padding: 0 40px;
}
</style>
