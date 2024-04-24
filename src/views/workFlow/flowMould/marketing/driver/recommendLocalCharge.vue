<template>
  <!-- 营销活动 包干推荐奖励 -->
  <el-form class="flow_form" :inline="true" label-width="160px" :model="dataObject">
    <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
    <activityCity :formData="dataObject" :requestConfing="requestConfing"/>
    <activityCrowd :formData="dataObject" />
    <activityRule :formData="dataObject" />
    <dataForm v-for="item in confingList(2, activtyConfig.length - 1)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
    <activityGift :isShow="false" giftTitle="活动奖励" :formData="tableData" :formKeys="giftKeys" :tableList="columnConfig" />
  </el-form>
</template>

<script>
import activityCrowd from '../../../components/marketing/driverCrowd.vue';
import activityCity from '../../../components/marketing/activityCity.vue';
import activityRule from '../../../components/marketing/activityRule.vue';
import activityGift from '../../../components/marketing/activityGift.vue';
import dataForm from '../../../components/dataForm.vue';
import { ACTIVITY_TYPE } from '@/utils/enum';
export default {
  name: 'signIn',
  components: { dataForm, activityCrowd, activityCity, activityGift, activityRule },
  props: {
    dataObject: {
      type: Object,
      default: () => { },
    },
  },
  data() {
    return {
      requestConfing:{
        url: '/driverActivity/common/select',
        op: 'getShowDriverActivityCityCode'
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
            //   {
            //       label: '活动模板',
            //       key: 'partitionName',
            //   },
          ],
        },
        {
          title: '风控配置',
          formConfig: [
            {
              label: '活动风险类型',
              nodeHandle: (item, data) => {
                return data.riskName;
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
                return riskName.toString().replace(/,/g, ' / ')
              },
            },
          ],
        },
      ],
      columnConfig: [
        {
          name: '包干购买金额',
          _node: row => `${row.minScope} ~ ${row.maxScope} `,
        },
        {
          name: '奖励金额',
          key: 'vipMoney',
        },
        {
          name: '奖励比例',
          key: 'vipRatio'
        }
      ],
      giftKeys: [
        {
          nodeHandle: (item, data, index) => {
            const recommendRewardList = {
              1: "不限",
              2: "每日奖励上限",
              3: "活动周期内获得奖励上限"
            }
            let vals = this.dataObject['rewardMaxType'];
            let obj = {
              label: `推荐奖励上限：`,
              val: recommendRewardList[vals],
            };
            return obj;
          },
        },
        {
          nodeHandle: (item, data, index) => {
            let val = this.dataObject['rewardMaxMoney'];
            let obj = {
              label: `奖励上限（元）：`,
              val ,
            };
            return obj;
          },
        },
        {
          nodeHandle: (item, data, index) => {
            let val = this.dataObject['vipRuleType'];
            const list = {
              1: '固定金额奖励',
              2: '比例金额奖励',
              3: '固定福气值奖励',
              4: '比例福气值奖励'
            }
            let obj = {
              label: `推荐奖励配置：`,
              val: list[val],
            };
            return obj;
          },
        },
        {
          key: '',
          nodeHandle: (item, data, index) => {
            let val = this.dataObject['vipRuleAos'];
            let obj = {
              label: `福气值倍数：`,
              val: val[0].luckyPower || this.dataObject.luckyPower,
            };
            return obj;
          },
        }
      ],
    };
  },
  computed: {
    tableData() {
      // 表格数据字段后端返回不同，需要进行数据组装处理
      let { vipRuleAos: couponsOrRedPackets } = this.dataObject;
      return [{ couponsOrRedPackets }];
    },
    confingList() {
      return function (start, end) {
        let config = this.$baseMethod.deepClone(this.activtyConfig);
        return config.splice(start, end);
      };
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
