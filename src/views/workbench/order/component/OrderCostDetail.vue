<template>
  <div>
    <div class="content-table">
        <p style="margin-bottom:20px;color:rgb(240, 82, 89)" v-if="dataList.estimateType == 20 && dataList.overKmType">(备注：{{{'1':'按标准计价重算)','2':'超出部分独立计价)','3':'不额外计价)'}[dataList.overKmType]}}}</p>
      <!-- 包车计价 -->
      <table v-if="isCharterCar">
        <thead>
          <tr>
            <td style="width:20%">计费项</td>
            <td style="width:20%">数值</td>
            <td style="width:20%" v-if="dataList.channelType&&dataList.channelType!=1">乘客费用（渠道）</td>
            <td style="width:20%">乘客费用（平台）</td>
            <td style="width:20%">司机费用</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in dataList.initialFeeList" :key="index">
            <td>套餐</td>
            <td>{{item.perKmFee | regRiceToKm}}公里，{{item.perMinFee | regSecondToMinute}}分钟</td>
            <td v-if="dataList.channelType&&dataList.channelType!=1">{{item.channelFee | regFenToYuan}}</td>
            <td>{{item.passengerFee | regFenToYuan}}</td>
            <td>{{item.driverFee | regFenToYuan}}</td>
          </tr>
          <tr v-if="dataList.perKmFee">
            <td>超里程费</td>
            <td v-if="fixCostDisabled">
              <div class="m-input"><input type="text" v-model="perKmFeeInput" placeholder="输入公里数"></div>
            </td>
            <td v-else>{{dataList.perKmFee.perKmFee | regRiceToKm}}公里</td>
            <td v-if="dataList.channelType&&dataList.channelType!=1">{{dataList.perKmFee.channelFee | regFenToYuan}}
            </td>
            <td>{{dataList.perKmFee.passengerFee | regFenToYuan}}</td>
            <td>{{dataList.perKmFee.driverFee | regFenToYuan}}</td>
          </tr>

          <tr v-if="dataList.perMinFee">
            <td>超时长费</td>
            <td v-if="fixCostDisabled">
              <div class="m-input"><input type="text" v-model="perMinFeeInput" placeholder="输入分钟"></div>
            </td>
            <td v-else>{{dataList.perMinFee.perMinFee  | regSecondToMinute}}分钟</td>
            <td v-if="dataList.channelType&&dataList.channelType!=1">{{dataList.perMinFee.channelFee | regFenToYuan}}
            </td>
            <td>{{dataList.perMinFee.passengerFee | regFenToYuan}}</td>
            <td>{{dataList.perMinFee.driverFee | regFenToYuan}}</td>
          </tr>
          <!-- 服务费 -->
          <tr v-if="dataList.serviceFee">
            <td>服务费</td>
            <td>-</td>
            <td v-if="dataList.channelType&&dataList.channelType!=1">-</td>
            <td v-if="dataList.channelType&&dataList.channelType!=1">{{dataList.serviceFee.channelFee | regFenToYuan}}</td>
            <td>{{dataList.serviceFee.passengerFee | regFenToYuan}}</td>
            <td>{{dataList.serviceFee.driverFee | regFenToYuan}}</td>
          </tr>

          <tr v-if="dataList.insuranceFee">
            <td>保险费</td>
            <td>-</td>
            <td v-if="dataList.channelType&&dataList.channelType!=1">{{dataList.insuranceFee.channelFee | regFenToYuan}}
            </td>
            <td>{{dataList.insuranceFee.passengerFee | regFenToYuan}}</td>
            <td>{{dataList.insuranceFee.driverFee | regFenToYuan}}</td>
          </tr>
          <tr v-if="dataList.otherFee">
            <td>其他费</td>
            <td>-</td>
            <td v-if="dataList.channelType&&dataList.channelType!=1">{{dataList.otherFee.channelFee | regFenToYuan}}
            </td>
            <td>{{dataList.otherFee.passengerFee | regFenToYuan}}</td>
            <td>{{dataList.otherFee.driverFee | regFenToYuan}}</td>
          </tr>
          <tr v-if="dataList.derateFee">
            <td>减免费</td>
            <td>-</td>
            <td v-if="dataList.channelType&&dataList.channelType!=1">{{dataList.derateFee.channelFee | regFenToYuan}}
            </td>
            <td>{{dataList.derateFee.passengerFee | regFenToYuan}}</td>
            <td>{{dataList.derateFee.driverFee | regFenToYuan}}</td>
          </tr>
          <tr v-if="dataList.totalFee">
            <td>费用合计</td>
            <td>-</td>
            <td v-if="dataList.channelType&&dataList.channelType!=1">{{dataList.totalFee.channelFee | regFenToYuan}}
            </td>
            <td>{{dataList.totalFee.passengerFee | regFenToYuan}}</td>
            <td>{{dataList.totalFee.driverFee | regFenToYuan}}</td>
          </tr>
        </tbody>
      </table>
      <!-- 约车计价 -->
      <table v-else>
        <thead>
          <tr>
            <td style="width:28%" class="text-left">类型</td>
            <td style="width:15%">时段/梯度</td>
            <td style="width:12%">数值</td>
            <td style="width:12%" v-if="dataList.channelType&&dataList.channelType!=1">乘客费用（渠道）</td>
            <template v-if="dataList.rideType != 50">
              <td style="width:12%">乘客费用（平台）</td>
              <td style="width:10%">司机费用</td>
            </template>
            <template v-else>
              <td style="width:12%">订单计费</td>
            </template>
          </tr>
        </thead>
        <tbody>
        <template v-if="dataList.estimateType == 20">
            <!-- 一口价start -->
            <tr v-if="dataList.fixedPriceFee">
                <td class="text-left">一口价费用</td>
                <td>{{dataList.fixedPriceFee.startTime|regRiceToKm}}公里~{{dataList.fixedPriceFee.endTime|regRiceToKm}}公里</td>
                <td>{{dataList.fixedPriceFee.perKmFee | regRiceToKm}}公里</td>
                <td>{{dataList.fixedPriceFee.passengerFee | regFenToYuan}}</td>
                <td>{{dataList.fixedPriceFee.driverFee | regFenToYuan}}</td>
            </tr>
            <template v-if="dataList.overKmType == 2">
                <tr>
                    <td rowspan="2" class="text-left">超出里程计价规则</td>
                    <td rowspan="2">超出部分独立计价</td>
                    <td>{{dataList.fixedPricePerKmFee.perKmFee | regRiceToKm}}公里</td>
                    <td>{{dataList.fixedPricePerKmFee.passengerFee | regFenToYuan}}</td>
                    <td>{{dataList.fixedPricePerKmFee.driverFee | regFenToYuan}}</td>
                </tr>
                <tr>
                    <td>{{dataList.fixedPricePerMinFee.perMinFee | regSecondToMinute}}分钟</td>
                    <td>{{dataList.fixedPricePerMinFee.passengerFee | regFenToYuan}}</td>
                    <td>{{dataList.fixedPricePerMinFee.driverFee | regFenToYuan}}</td>
                </tr>
            </template>
            <!-- 一口价END -->
        </template>

          <tr v-if="dataList.initialFee">
            <td class="text-left">起步价/里程费</td>
            <td><span
                v-if="dataList.initialFee.startTime">{{dataList.initialFee.startTime}}-{{dataList.initialFee.endTime}}</span><span
                v-else>普通时段</span></td>
            <td>{{dataList.initialFee.perKmFee | regRiceToKm}}公里，{{dataList.initialFee.perMinFee | regSecondToMinute}}分钟
            </td>
            <td v-if="dataList.channelType&&dataList.channelType!=1">{{dataList.initialFee.channelFee | regFenToYuan}}
            </td>
            <td>{{dataList.initialFee.passengerFee | regFenToYuan}}</td>
            <td v-if="dataList.rideType != 50">{{dataList.initialFee.driverFee | regFenToYuan}}</td>
          </tr>
          <tr v-if="dataList.lowestCost">
            <td class="text-left">最低消费</td>
            <td><span
                v-if="dataList.lowestCost.startTime">{{dataList.lowestCost.startTime}}-{{dataList.lowestCost.endTime}}</span><span
                v-else>普通时段</span></td>
            <td>-</td>
            <td v-if="dataList.channelType&&dataList.channelType!=1">{{dataList.lowestCost.channelFee | regFenToYuan}}
            </td>
            <td>{{dataList.lowestCost.passengerFee | regFenToYuan}}</td>
            <td v-if="dataList.rideType != 50">{{dataList.lowestCost.driverFee | regFenToYuan}}</td>
          </tr>
          <template v-if="dataList.perKmFeeList">
            <tr v-for="(data,index) in dataList.perKmFeeList" :key="'km-'+index">
              <td v-if="!index" class="text-left" :rowspan="dataList.perKmFeeList.length">里程费</td>
              <td><span v-if="data.startTime">{{data.startTime}}-{{data.endTime}}</span><span v-else>普通时段</span></td>
              <td v-if="fixCostDisabled">
                <div class="m-input"><input type="text" v-model="kmInputList[index]" placeholder="输入公里数"></div>
              </td>
              <td v-else>{{data.perKmFee | regRiceToKm}}公里</td>
              <td v-if="dataList.channelType&&dataList.channelType!=1">{{data.channelFee|regFenToYuan}}</td>
              <td>{{data.passengerFee | regFenToYuan}}</td>
              <td v-if="dataList.rideType != 50">{{data.driverFee | regFenToYuan}}</td>
            </tr>
          </template>
          <!-- 空驶费 -->
          <template v-if="dataList.emptyFeeList">
            <tr v-for="(data,index) in dataList.emptyFeeList" :key="'km-'+index">
              <td v-if="!index" class="text-left" :rowspan="dataList.emptyFeeList.length">空驶费</td>
              <td><span>{{regRiceToKm(data.startDis, false)}}-{{regRiceToKm(data.endDis, false)}} 公里</span></td>
              <td v-if="fixCostDisabled">
                <div class="m-input"><input type="text" v-model.trim="kmInputList[index]" placeholder="输入公里数"></div>
              </td>
              <td v-else>{{regRiceToKm(data.perKmFee, false)}}公里</td>
              <td v-if="dataList.channelType&&dataList.channelType!=1">{{data.channelFee|regFenToYuan}}</td>
              <td>{{data.passengerFee | regFenToYuan}}</td>
              <td>{{data.driverFee | regFenToYuan}}</td>
            </tr>
          </template>
          <template v-if="dataList.perMinFeeList">
            <tr v-for="(data,index) in dataList.perMinFeeList" :key="'min-'+index">
              <td v-if="!index" class="text-left" :rowspan="dataList.perMinFeeList.length">时长费</td>
              <td><span v-if="data.startTime">{{data.startTime}}-{{data.endTime}}</span><span v-else>普通时段</span></td>
              <td v-if="fixCostDisabled">
                <div class="m-input"><input type="text" v-model="minInputList[index]" placeholder="输入分钟"></div>
              </td>
              <td v-else>{{data.perMinFee | regSecondToMinute}}分钟</td>
              <td v-if="dataList.channelType&&dataList.channelType!=1">{{data.channelFee|regFenToYuan}}</td>
              <td>{{data.passengerFee | regFenToYuan}}</td>
              <td v-if="dataList.rideType != 50">{{data.driverFee | regFenToYuan}}</td>
            </tr>
          </template>
          <template v-if="dataList.extraFeeList">
            <tr v-for="(data,index) in dataList.extraFeeList" :key="'ext-'+index">
              <td v-if="!index" class="text-left" :rowspan="dataList.extraFeeList.length">等待费</td>
              <td><span v-if="data.startTime">{{data.startTime}}-{{data.endTime}}</span><span v-else>普通时段</span></td>
              <td>
                <!-- 实时，预约，扫码，空驶单   等待时长按 0-30s取0.5分钟，大于30s 取1分钟   司乘判责二期项目  2021/07/26 -->
                <span v-if="orderType===20 || orderType===21 || orderType===22 || orderType===50">{{data.perMinFee | regSecondToHalfMinute}} 分钟</span>
                <span v-else>{{data.perMinFee | regSecondToMinute}}分钟</span>
              </td>
              <td v-if="dataList.channelType&&dataList.channelType!=1">{{data.channelFee|regFenToYuan}}</td>
              <td>{{data.passengerFee | regFenToYuan}}</td>
              <td v-if="dataList.rideType != 50">{{data.driverFee | regFenToYuan}}</td>
            </tr>
          </template>
          <template v-if="dataList.farFeeList">
            <tr v-for="(data,index) in dataList.farFeeList" :key="'far-'+index">
              <td v-if="!index" class="text-left" :rowspan="dataList.farFeeList.length">远途返空费</td>
              <td>{{getStage(index)}}</td>
              <td>{{data.farDis | regRiceToKm}}公里</td>
              <td v-if="dataList.channelType&&dataList.channelType!=1">{{data.channelFee|regFenToYuan}}</td>
              <td>{{data.passengerFee | regFenToYuan}}</td>
              <td v-if="dataList.rideType != 50">{{data.driverFee | regFenToYuan}}</td>
            </tr>
          </template>

          <!-- 服务费 -->
          <template v-if="dataList.serviceFee">
            <tr>
              <td class="text-left">服务费</td>
              <td v-if="dataList.fixedPriceFee">-</td>
              <td v-else>
                <span v-if="dataList.serviceFee.startTime">{{dataList.serviceFee.startTime}}-{{dataList.serviceFee.endTime}}</span><span v-else>普通时段</span>
              </td>
              <td>-</td>
              <td v-if="dataList.channelType&&dataList.channelType!=1">{{dataList.serviceFee.channelFee | regFenToYuan}}</td>
              <td>{{dataList.serviceFee.passengerFee | regFenToYuan}}</td>
              <td v-if="dataList.rideType != 50">{{dataList.serviceFee.driverFee | regFenToYuan}}</td>
            </tr>
          </template>
          
          <template v-if="dataList.insuranceFee">
            <tr>
              <td class="text-left" colspan="3">保险费</td>
              <td v-if="dataList.channelType&&dataList.channelType!=1">{{dataList.insuranceFee.channelFee|regFenToYuan}}
              </td>
              <td>{{dataList.insuranceFee.passengerFee | regFenToYuan}}</td>
              <td v-if="dataList.rideType != 50">-{{dataList.insuranceFee.driverFee | regFenToYuan}}</td>
            </tr>
          </template>
          <template v-if="dataList.fuelFee">
            <tr>
              <td class="text-left" colspan="3">燃油费</td>
              <td v-if="dataList.channelType&&dataList.channelType!=1">{{dataList.fuelFee.channelFee|regFenToYuan}}
              </td>
              <td>{{dataList.fuelFee.passengerFee | regFenToYuan}}</td>
              <td v-if="dataList.rideType != 50">-{{dataList.fuelFee.driverFee | regFenToYuan}}</td>
            </tr>
          </template>
          <template v-if="dataList.callFee">
            <tr>
              <td class="text-left" colspan="3">电召费</td>
              <td v-if="dataList.channelType&&dataList.channelType!=1">{{dataList.callFee.channelFee|regFenToYuan}}
              </td>
              <td>{{dataList.callFee.passengerFee | regFenToYuan}}</td>
              <td v-if="dataList.rideType != 50">-{{dataList.callFee.driverFee | regFenToYuan}}</td>
            </tr>
          </template>
          <!--   司机计费明细并无此项         -->
          <template v-if="originData">
            <tr v-for="(data,index) in originData.activitys" :key="'act-'+index">
              <td v-if="!index" class="text-left" :rowspan="originData.activitys.length">优惠明细<span
                  class="small">（记录参与的活动及使用的优惠券）</span></td>
              <td :colspan="(dataList.channelType&&dataList.channelType!=1)?'2':'1'">{{data.activityName || '-'}}</td>
              <td colspan="2">{{data.couponsName || '-'}}</td>
              <td>{{data.deductibleOfMoney ? '-' : ''}}{{data.deductibleOfMoney | regFenToYuan}}</td>
              <td v-if="!index" :rowspan="originData.activitys.length">
                {{originData.activityCountMoney ? '-' : ''}}-{{originData.activityCountMoney | regFenToYuan}}</td>
            </tr>
          </template>
          <tr v-if="dataList.otherFee">
            <td class="text-left" colspan="3">其它费用<span class="small">（高速、路桥、停车等费用总和）</span></td>
            <td v-if="dataList.channelType&&dataList.channelType!=1">{{dataList.otherFee.channelFee|regFenToYuan}}</td>
            <td>{{dataList.otherFee.passengerFee | regFenToYuan}}</td>
            <td v-if="dataList.rideType != 50">{{dataList.otherFee.driverFee | regFenToYuan}}</td>
          </tr>
          <tr v-if="dataList.derateFee">
            <td class="text-left" colspan="3">减免金额<span class="small">（司机输入的减免金额，用于抵消订单部分金额）</span></td>
            <td v-if="dataList.channelType&&dataList.channelType!=1">-{{dataList.derateFee.channelFee|regFenToYuan}}</td>
            <td>-{{dataList.derateFee.passengerFee | regFenToYuan}}</td>
            <td v-if="dataList.rideType != 50">-{{dataList.derateFee.driverFee | regFenToYuan}}</td>
          </tr>
          <!--   司机计费明细并无此项         -->
          <tr v-if="originData.invoiceMoney">
            <td v-if="(dataList.channelType&&dataList.channelType!=1)" class="text-left"
              :colspan="(dataList.channelType&&dataList.channelType!=1)?'5':'4'">可开票金额<span
                class="small">（注意：奖励金额、其他金额、优惠金额不支持开票）</span></td>
            <td>{{originData.invoiceMoney | regFenToYuan}}</td>
          </tr>
          <tr v-if="dataList.totalFee">
            <td class="text-left" colspan="3">费用合计<span
                class="small">（注意：当计费模式是最低消费时，计算费用未超过最低消费，按最低消费金额收取，超过按实际计费金额收取）</span></td>
            <td v-if="dataList.channelType&&dataList.channelType!=1">{{dataList.totalFee.channelFee|regFenToYuan}}</td>
            <td>{{dataList.totalFee.passengerFee | regFenToYuan}}</td>
            <td v-if="dataList.rideType != 50">{{dataList.totalFee.driverFee | regFenToYuan}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <el-dialog :visible.sync="setiatePrichBox" width="80%">
      <setiatePrice :dataList="setiatePrice" :originData="dataList"></setiatePrice>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setiatePrichBox = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: ["dataList", "originData", "orderType", "moduleName"],
  backup: null,
  data() {
    return {
      charters: {},
      fixCostDisabled: false,
      perKmFeeInput: "",
      perMinFeeInput: "",
      kmInputList: {},
      minInputList: {},
      setiatePrichBox: false,
      setiatePrice: {},
    };
  },
  computed: {
    fixEnable() {
      const { originData } = this;
      let os;
      if (originData.orderStatus) {
        os = originData.orderStatus;
      } else if (originData.status) {
        os = originData.status;
      }
      return os == 40 || os == 50;
    },
    isCharterCar() {
      return this.orderType == 70;
    },
  },
  methods: {
    ...mapActions(["getOrderBaseInfo"]),
    regRiceToKm(val, fix = true) {
      if (+val === 0) { return 0 }
      return this.$baseMethod.regRiceToKm(val, fix)
    },
    getSetiaInfo() {
      let params = {
        data: {
          orderId: this.$route.query.orderId,
        },
        op: "selectEstimatedDetail",
        moduleName: this.moduleName,
      };
      this.getOrderBaseInfo(params).then((res) => {
        this.setiatePrice = res;
        this.setiatePrichBox = true;
      });
    },
    showFixCost() {
      this.fixCostDisabled = true;
      this.perKmFeeInput = "";
      this.perMinFeeInput = "";
    },
    cancleFixCost() {
      if (this.backup) {
        this.$emit(
          "fix",
          this.isCharterCar
            ? { rpcCharteredChargingServiceConsoleVo: this.backup }
            : { expChargingParams: this.backup }
        );
        this.backup = null;
      }
      this.fixCostDisabled = false;
    },
    confirmFixCost() {
      if (!this.backup) {
        this.$message.error("请先计算费用");
        return;
      }
      let data = {
        data: {
          orderId: this.$route.query.orderId,
          ...this.dataList,
        },
        op: "updateChargeFeeDetail",
      };
      this.$axios(this.getModuleUrl(data.op), data).then(({ code, data }) => {
        //  this.dataList = JSON.parse(res.data);
        if (code == 1) {
          this.$emit("fix", JSON.parse(data));
          this.fixCostDisabled = false;
          this.$message.success("修复计费成功");
        }
      });
    },
    rules() {
      const { orderId } = this.$route.query;
      switch(+this.orderType){
        case 20:
          name = "realTimeCostRules"
          break;
        case 21:
          name = "subscribeCostRules"
          break;
        case 22:
          name = "scanCodeCostRules"
          break;
        case 70:
          name = "charterCostRules"
          break;
      }
      this.$router.push({
        name,
        query: { orderId },
      });
    },
    getStage(index) {
      return {
        0: "第一梯度",
        1: "第二梯度",
        2: "第三梯度",
        3: "第四梯度",
        4: "第五梯度",
        5: "第六梯度",
        6: "第七梯度",
        7: "第八梯度",
        8: "第九梯度",
        9: "第十梯度",
      }[index];
    },
    checkKmFee(perKmFeeInput) {
      if (!perKmFeeInput) {
        this.$message.warning("请输入里程公里数");
        return false;
      }
      if (!/^(\d+|\d+\.\d{1,2})$/.test(perKmFeeInput)) {
        this.$message.warning("里程公里数只能是数字且最多有两位小数");
        return false;
      }
      return true;
    },
    checkMinFee(perMinFeeInput) {
      if (!perMinFeeInput) {
        this.$message.warning("请输入时长分钟数");
        return false;
      }
      if (!/^\d+$/.test(perMinFeeInput)) {
        this.$message.warning("时长只能是整数");
        return false;
      }
      return true;
    },
    countCost() {
      const {
        perKmFeeInput,
        perMinFeeInput,
        dataList,
        isCharterCar,
        kmInputList,
        minInputList,
        moduleName,
      } = this;
      let dl = JSON.parse(JSON.stringify(dataList));
      if (isCharterCar) {
        if (
          !this.checkKmFee(perKmFeeInput) ||
          !this.checkMinFee(perMinFeeInput)
        ) {
          return;
        }
        dl.perKmFee.perKmFee = +perKmFeeInput * 1000;
        dl.perMinFee.perMinFee = +perMinFeeInput * 60;
      } else {
        for (let i = 0; i < dl.perKmFeeList.length; i++) {
          let input = kmInputList[i];
          if (this.checkKmFee(input)) {
            dl.perKmFeeList[i].perKmFee = +input * 1000;
          } else {
            return;
          }
        }
        for (let i = 0; i < dl.perMinFeeList.length; i++) {
          let input = minInputList[i];
          if (this.checkMinFee(input)) {
            dl.perMinFeeList[i].perMinFee = +input * 60;
          } else {
            return;
          }
        }
      }
      let data = {
        data: {
          ...dl,
          orderId: this.$route.query.orderId,
        },
        op: "countChargerFeeDetail",
      };
      let charters = this.charters;
      let url = this.getModuleUrl(data.op);
      this.$axios(url, data).then(({ code, data }) => {
        if (code == 1) {
          this.backup = this.backup ? this.backup:dataList;
          this.$emit(
            "fix",
            isCharterCar
              ? { rpcCharteredChargingServiceConsoleVo: JSON.parse(data) }
              : { expChargingParams: JSON.parse(data) }
          );
        }
        // this.dataList = this.merge(dataList, JSON.parse(res.data));
      });
    },
    merge(sourseObj, obj) {
      let self = this;
      if (typeof obj !== "object") {
        return;
      } else {
        for (var prop in obj) {
          if (typeof obj[prop] === "object") {
            sourseObj[prop] = self.merge(sourseObj[prop], obj[prop]);
          } else {
            sourseObj[prop] = obj[prop];
          }
        }
      }
      return sourseObj;
    },
    getModuleUrl(op) {
      return this.$getModuleUrl(this.moduleName, op);
    },
  },
};
</script>

<style lang="scss" scoped>
.m-input {
  text-align: center;
  height: 36px;
  input {
    width: 100%;
    height: 100%;
    display: block;
    background-color: #f5f5f5;
    text-align: center;
  }
}
</style>
