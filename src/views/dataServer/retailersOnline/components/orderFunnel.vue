<template>
  <div class="funnel-box">
    <div class="row-box yellow">
      
      <div class="col-box">
        <div class="title-text">下单金额(元)</div>
        <count-to class="number-text" :startVal="0" :decimals="2" :duration="1000" :endVal="dataObj.orderAmount | moneyFliter"></count-to>
      </div>
      <div class="col-box">
        <div class="title-text">下单笔数(笔)</div>
        <count-to class="number-text" :startVal="0" :decimals="0" :duration="1000" :endVal="Number(dataObj.orderCnt || 0)"></count-to>
      </div>
      <div class="col-box">
        <div class="title-text">下单人数(人)</div>
        <count-to class="number-text" :startVal="0" :decimals="0" :duration="1000" :endVal="Number(dataObj.orderPeopleCnt || 0)"></count-to>
      </div>
      <div class="col-box">
        <div class="title-text">下单客单价(元/人)</div>
        <count-to class="number-text" :startVal="0" :decimals="2" :duration="1000" :endVal="dataObj.orderAverageAmount | moneyFliter"></count-to>
      </div>
      <div class="col-box">
        <div class="title-box">
            <span class="title-text">预期毛利金额(元)</span>
            <!-- <el-tooltip class="item" effect="dark" placement="right-start" v-if="businessType === '1'">
                <template #content>
                  <p>1、差额模式的商品：实际下单金额-成本</p>
                  <p>2、抽成模式的商品：实际下单金额*抽佣比例</p>
                </template>
                <i class="el-icon-warning-outline"></i>
            </el-tooltip> -->
        </div>
        <count-to class="number-text" :startVal="0" :decimals="2" :duration="1000" :endVal="dataObj.expectProfitAmount | moneyFliter"></count-to>
      </div>
    </div>
    <div class="row-box orange">
      <div class="col-box">
        <div class="title-box">
            <span class="title-text">支付金额(元)</span>
            <!-- <el-tooltip class="item" effect="dark" placement="right-start" v-if="businessType === '2'">
                <template #content>
                  <p>用户实际支付成功的金额，含退款金额和结算金额</p>
                </template>
                <i class="el-icon-warning-outline"></i>
            </el-tooltip> -->
        </div>
        <count-to class="number-text" :startVal="0" :decimals="2" :duration="1000" :endVal="dataObj.payAmount | moneyFliter"></count-to>
      </div>
      <div class="col-box">
        <div class="title-text">支付订单数(笔)</div>
        <count-to class="number-text" :startVal="0" :decimals="0" :duration="1000" :endVal="Number(dataObj.payCnt || 0)"></count-to>
      </div>
      <div class="col-box">
        <div class="title-text">支付人数(人)</div>
        <count-to class="number-text" :startVal="0" :decimals="0" :duration="1000" :endVal="Number(dataObj.payPeopleCnt || 0)"></count-to>
      </div>
      <div class="col-box">
        <div class="title-text">支付客单价(元/人)</div>
        <count-to class="number-text" :startVal="0" :decimals="2" :duration="1000" :endVal="dataObj.payAverageAmount | moneyFliter"></count-to>
      </div>
      <div class="col-box">
        <div class="title-box">
            <span class="title-text">支付毛利金额(元)</span>
            <!-- <el-tooltip class="item" effect="dark" placement="right-start" v-if="businessType === '1'">
                <template #content>
                  <p>1、差额模式的商品：实际支付金额-成本</p>
                  <p>2、抽成模式的商品：实际支付金额*抽佣比例</p>
                </template>
                <i class="el-icon-warning-outline"></i>
            </el-tooltip> -->
        </div>
        <count-to class="number-text" :startVal="0" :decimals="2" :duration="1000" :endVal="dataObj.payProfitAmount | moneyFliter"></count-to>
      </div>
    </div>
    <div class="row-box red">
      <div class="col-box">
        <div class="title-box">
            <span class="title-text">退款金额(元)</span>
            <!-- <el-tooltip class="item" effect="dark" placement="right-start" v-if="businessType === '2'">
                <template #content>
                  <p>用户支付后，但由于充值失败导致退款产生的退款总金额</p>
                </template>
                <i class="el-icon-warning-outline"></i>
            </el-tooltip> -->
        </div>
        <count-to class="number-text" :startVal="0" :decimals="2" :duration="1000" :endVal="dataObj.refundAmount | moneyFliter"></count-to>
      </div>
      <div class="col-box">
        <div class="title-text">退款订单数(笔)</div>
        <count-to class="number-text" :startVal="0" :decimals="0" :duration="1000" :endVal="Number(dataObj.refundCnt || 0)"></count-to>
      </div>
      <div class="col-box">
        <div class="title-text">退款人数(人)</div>
        <count-to class="number-text" :startVal="0" :decimals="0" :duration="1000" :endVal="Number(dataObj.refundPeopleCnt || 0)"></count-to>
      </div>
      <div class="col-box"></div>
      <div class="col-box"></div>
    </div>
    <div class="row-box purple">
      <div class="col-box">
        <div class="title-box">
            <span class="title-text">结算金额(元)</span>
            <!-- <el-tooltip class="item" effect="dark" placement="right-start" v-if="businessType === '2'">
                <template #content>
                  <p>用户支付后，话费充值已到账，万顺与供货商结算的成本总金额</p>
                </template>
                <i class="el-icon-warning-outline"></i>
            </el-tooltip> -->
        </div>
        <count-to class="number-text" :startVal="0" :decimals="2" :duration="1000" :endVal="dataObj.settlementAmount | moneyFliter"></count-to>
      </div>
      <div class="col-box">
        <div class="title-text">结算订单数(笔)</div>
        <count-to class="number-text" :startVal="0" :decimals="0" :duration="1000" :endVal="Number(dataObj.settlementCnt || 0)"></count-to>
      </div>
      <div class="col-box"></div>
      <div class="col-box"></div>
      <div class="col-box"></div>
    </div>
    <div class="row-box blue">
      <div class="col-box">
        <div class="title-text">平台收益(元)</div>
        <count-to class="number-text" :startVal="0" :decimals="2" :duration="1000" :endVal="Number(dataObj.platformAmount) | moneyFliter"></count-to>
      </div>
      <div class="col-box"></div>
      <div class="col-box"></div>
      <div class="col-box"></div>
      <div class="col-box"></div>
    </div>
  </div>
</template>

<script>
import { Big } from 'big.js'
import countTo from 'vue-count-to'
export default {
  name: 'orderFunnel',
  components: { countTo },
  props: {
    dataObj: {
      type: Object,
      defutle: () => {}
    },
    businessType:{
        type:String,
        default:'1'
    }
  },
  filters: {
    moneyFliter(val) {
      if (!val) {
        return 0
      } else {
        return Number( new Big(val || 0).div(100))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.funnel-box {
  position: relative;
  margin-top: 25px;
  .row-box {
    height: 80px;
    width: 100%;
    border-radius: 8px;
    margin-bottom: 3px;
    display: flex;
    justify-content: space-evenly;
  }
  .yellow {
    background: rgba(243, 208, 29, 0.2);
  }
  .orange {
    background: rgba(255, 155, 0, 0.2);
  }
  .red {
    background: rgba(253, 87, 31, 0.2);
  }
  .purple {
    background: rgba(154, 122, 255, 0.2);
  }
  .blue {
    background: rgba(91, 143, 249, 0.2);
  }
  .col-box {
    padding: 12px 0px;
    width: 326px;
    text-align: center;
  }
  .title-text {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #606266;
    line-height: 20px;
    margin-bottom: 8px;
  }
  .number-text {
    font-size: 24px;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
    color: #303133;
    line-height: 28px;
  }
  .el-icon-warning-outline{
    margin-left: 4px;
  }
  .title-box{
    margin-bottom: 8px;
  }
}
</style>
