
<template>
  <div>
    <!-- ![20,30,40].includes(+orgType) 为总部权限-->
    <div class="recharge_box" v-if="[30,40].includes(+orgType)">
      <component v-if="showDistribution" is="saleDistribution" :requestOpList="branchList"></component>
    </div>
    <div class="recharge_box" v-else>
      <div class="radio_box">
        <el-radio-group v-model="radioQuery" :border="false">
          <el-radio-button label="salePlatform" v-if="showPlatform">平台维度</el-radio-button>
          <el-radio-button label="saleDistribution" v-if="showDistribution">分销维度</el-radio-button>
          <el-radio-button label="orderSource" v-if="isOrderSource">订单来源维度</el-radio-button>
        </el-radio-group>
      </div>
      <component v-if="showPlatform||showDistribution||isOrderSource" :is="radioQuery" :requestOpList="parentList"></component>
    </div>
  </div>
</template>

<script>
import salePlatform from './components/salePlatform.vue'
import saleDistribution from './components/saleDistribution.vue'
import orderSource from './orderSource/index.vue'
export default {
    components: { salePlatform, saleDistribution, orderSource, },
    name: 'retailersOnline',
    moduleName: '/dataServer/retailersOnline',
    data() {
        return {
            radioQuery: '',
            powerObj: {},
            orgType: 0,
            parentList: {
                selectList: 'distAnalyseRank',
                selectCount: 'distAnalyseRankCount',
                getAnalysis: 'distAnalyseTread',
                getanalyseAmt: 'distAnalyse'
            },
            branchList: {
                selectList: 'orderAnalyseRank',
                selectCount: 'orderAnalyseRankCount',
                getAnalysis: 'orderAnalyseTread',
                getanalyseAmt: 'orderAnalyse'
            },
            moduleName: '/dataServer/retailersOnline'
        }
    },
    computed: {
        // 平台
        showPlatform() {
            // 查询的业务类型-电商业务\话费业务\两轮车业务\定制车业务
            return this.powerObj.recharge || this.powerObj.eCommerce||this.powerObj.electrocar||this.powerObj.customized
        },
        // 分销
        showDistribution() {
            let opList = ['distAnalyse', 'distAnalyseTread', 'distAnalyseRank', 'selectOrgByOrgType', 'distAnalyseRankCount']
            if ([30, 40].includes(this.orgType * 1)) opList = ['orderAnalyse', 'orderAnalyseTread', 'orderAnalyseRank', 'orderAnalyseRankCount', 'selectOrgByOrgType']
            return opList.some(k => this.powerObj[k])
        },
        // 是否展示订单来源维度(总部角色展示)
        isOrderSource() {
            const { orderSourceOverview, paidAmtCompare, settlementAmtCompare, orderSourceAnalyseRank, orderSourceExport } = this.powerList
            return (orderSourceOverview || paidAmtCompare || settlementAmtCompare || orderSourceAnalyseRank || orderSourceExport) && [20, 30, 40].indexOf(this.orgType) === -1
        },
    },
    mounted() {
        this.orgType = (this.$baseMethod.getStore('roleOption') && this.$baseMethod.getStore('roleOption').orgType) || 0
        this.getPermissionList()
        this.radioQuery = this.showPlatform ? 'salePlatform' :  this.isOrderSource ? 'orderSource' : 'saleDistribution'
    },
    methods: {
        getPermissionList() {
            this.powerObj = this.getModulePower('/dataServer/retailersOnline')
        }
    }
}
</script>
<style lang="scss" scoped>
.recharge_box {
    border-radius: 8px;
    padding: 25px 0px;
    background: #fff;
    width: 100%;
    .radio_box {
        text-align: center;
        margin-bottom: 20px;
        /deep/.el-radio-button__inner {
            padding: 12px 34px;
            border: none;
            background: #f0f2f5;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #606266;
        }
        /deep/.el-radio-button__orig-radio:checked + .el-radio-button__inner {
            background-color: #f05259;
            border-color: #f05259;
            box-shadow: -1px 0 0 0 #f05259;
            color: #ffffff;
        }
    }
}
</style>