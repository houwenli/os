<template>
    <el-form class="flow_form" :inline="true" label-width="140px" :model="dataObject">
        <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
        <!-- 活动城市 -->
        <activityCity :formData="dataObject" />      
		
		<!-- 活动人群 -->
		<activityCrowd :formData="dataObject" />     

		 <!-- 风控配置 -->
        <dataForm v-for="item in confingList(2, 3)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>

		<activityGift :formKeys="giftKeys" :formData="tableData" giftTitle="活动奖励" :tableList="columnConfig" :isShow="false" />
    </el-form>
</template>

<script>
// 机构活动-推荐代驾司机
import activityCity from '../../../components/marketing/activityCity.vue';
import dataForm from '../../../components/dataForm.vue';
import showTable from '../../../components/showTable/index.vue'
import activityCrowd from '../../../components/marketing/activityCrowd.vue';
import activityGift from '../../../components/marketing/activityGift';
import { marketing } from '../../../mixin';
import { PARTICIPATE_CONDITION } from '@/utils/enum';

export default {
  name: 'nosecreat',
  components: { dataForm, activityCity, showTable, activityCrowd, activityGift },
  props: {
    dataObject: {
      type: Object,
      default: () => { }
    },
  },
  mixins: [marketing],
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
							return '开通免密送'
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
					}           
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
							if (!activityRiskType) return false;
							return activityRiskType === -1 ? false : true;
						},
						nodeHandle: (item, data) => {
							let vals = (data['riskAndSets'] || []).map(type => type.participateCondition);
							return vals.map(val => this.getEnumVal(PARTICIPATE_CONDITION, val)).toString();
						},
					},
				],
			},
		],  
		giftKeys: [
			
		], 
		columnConfig: [
			{
				name: '红包名称',
				key: 'giftName',
			},
			{
				name: '金额',
				key: 'redPacketMoney',
				_node: row => {					
					let val = row.redPacketMoney ? row.redPacketMoney / 100 : '--';
					return `${val} 元`;
				},	
			},
			{
				name: '数量',
				key: 'sendNumber'							
			}
		],     
    };
  },
  computed: {
    confingList () {
      return function (start, end) {
        let config = this.$baseMethod.deepClone(this.activtyConfig);
        return config.splice(start, end);
      };
	},
	tableData() {
      // 表格数据字段后端返回不同，需要进行数据组装处理
	  let { giftPackages } = this.dataObject;		  
      return [{ couponsOrRedPackets: giftPackages }];
    },
  },
  watch: {
    // dataObject: {
    //   handler: function () {
    //     this.setTable()
    //   },
    //   deep: true,
    //   immediate: true,
    // },
  },

  methods: {
    // setTable () {           
    // },      
  }
};
</script>

<style lang="scss" scoped>
.flow_form {
    padding: 0 40px;
}
</style>
