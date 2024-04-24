<template>
  <div class="ws-table-warp">
    <iSearch :showBtn="Boolean(oaPowerList.getDriverSchedule)" @handleClickRefresh="handleClickRefresh" @handleCityChange = "$emit('handleCityChange', $event)"></iSearch>
    <!-- 司机调度分析 -->
    <div class="flex-row charts-container" :key="key">
      <pedestalCharts
        class="charts-item"
        :setChartsOptions="charts.driveMileageDetailList"
      ></pedestalCharts>
      <pedestalCharts
        class="charts-item"
        :setChartsOptions="charts.driveDurationDetailList"
      ></pedestalCharts>
      <pedestalCharts
        class="charts-item"
        :setChartsOptions="charts.driveIncomeDetailList"
      ></pedestalCharts>
    </div>

    <div class="dispatchDirverSearch flex-row">
      <h2 class="font24">调度过滤司机数据分析</h2>
      <div>
        <span>当前城市: </span>
        <ws-city
          class="ml10"
          :data="cityData"
          v-model="dataOptions.city"
          :defaultProps="{ checkStrictly: true }"
        ></ws-city>
        <el-date-picker
          v-model="dataOptions.time"
          class="ml10"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
        <el-button
          v-if="oaPowerList.getDriverFilter"
          class="ml10"
          type="primary"
          @click="handleGetDriverFilterData"
          >查询</el-button
        >
      </div>
    </div>

    <div class="flex-row dispatchDirverSearch" :key="keys">
      <pedestalCharts
        style="width: 50%"
        :setChartsOptions="charts.dirverDataOption"
      ></pedestalCharts>
      <pedestalCharts
        style="width: 46%"
        :setChartsOptions="charts.pieCharts"
      ></pedestalCharts>
    </div>
  </div>
</template>

<script>
import iSearch from "../../components/search.vue";
import pedestalCharts from "../../components/pedestal-charts.vue";
import { barCharts, dirverDataOption, pieCharts } from "./charts";
export default {
  components: {
    iSearch,
    pedestalCharts,
  },
  data() {
    return {
      key: 100,
      keys: 22,
      cityData: [],
      charts: {
        driveDurationDetailList: {}, // 接驾时长详情
        driveIncomeDetailList: {}, // 接驾收入详情
        driveMileageDetailList: {}, // 接驾里程详情
      },
      dataOptions: {
        city: [],
        time: [],
      },
      pickerOptions: {
        disabledDate(time) {
          let curDate = Date.now();
          let three = 90 * 86400000;
          let threeMonths = curDate - three;
          let current =
            new Date(new Date().toLocaleDateString()).getTime() +
            (86400000 - 1000);
          return time.getTime() > current || time.getTime() < threeMonths;
        },
      },
      moduleName: "/dataServer/dispatchDataAnalysis",
      op: {
        getDriverSchedule: "getDriverSchedule",
        getDriverFilter: "getDriverFilter",
      },
      getDriverSchedule: {
        driveDurationDetailList: [], // 接驾时长详情
        driveIncomeDetailList: [], // 接驾收入详情
        driveMileageDetailList: [], // 接驾里程详情

        histogramList: [], // 柱状图VO
        pieList: [], // 饼图VO
      },
    };
  },
  created() {
    this.charts.pieCharts = this.$baseMethod.deepClone(pieCharts);
    this.charts.dirverDataOption = this.$baseMethod.deepClone(dirverDataOption);
    const time = this.$baseMethod.getBeforeDay(0, "yyyy-MM-dd")
    this.dataOptions.time = [time, time]
    this.getUserCityList()
  },
  methods: {
    getUserCityList() {
      const ret = this.$attrs.cityList
      this.cityData = new Array(1)
      if (ret.length) {
        this.cityData = [...ret];
        this.dataOptions.city = this.$attrs.firstCity
        this.initBarChartsOptions();
        this.handleGetDriverFilterData()
      }
    },
    getModuleUrl(op) {
      return this.$getModuleUrl(this.moduleName, op);
    },
    handleClickRefresh(params) {
      // OA权限控制
      if (!this.oaPowerList.getDriverSchedule) {
        return false
      }
      const op = this.op.getDriverSchedule;
      let data = {
        data: {
          ...params,
        },
        op,
      };
      let URL = this.getModuleUrl(op);
      this.$axios(URL, data).then((res) => {
        if (res.code == 1) {
          const ret = JSON.parse(res.data);
          this.getDriverSchedule = ret;
          this.initBarChartsOptions();
          this.key++;
        }
      });
    },

    // 获取底部堆叠图和饼图数据
    handleGetDriverFilterData() {
      // OA权限控制
      if (!this.oaPowerList.getDriverFilter) {
        return false
      }
      if (!this.dataOptions.city || (!this.dataOptions.time && !this.dataOptions.time.length)) {
        this.$message.error("请完善筛选项查询")
        return false
      }
      const op = this.op.getDriverFilter;
      let param = {
        ...this.getLocalType(this.dataOptions.city),
      };

      if (this.dataOptions.time.length) {
        let [startDate, endDate] = this.dataOptions.time;
        param.startDate = startDate.substring(0, 10);
        param.endDate = endDate.substring(0, 10);
      }

      let data = {
        data: {
          ...param,
        },
        op,
      };
      let URL = this.getModuleUrl(op);
      this.$axios(URL, data).then((res) => {
        if (res.code == 1) {
          const ret = JSON.parse(res.data);
          // console.log(ret);
          this.getDriverSchedule.histogramList = ret.histogramList;
          this.getDriverSchedule.pieList = ret.pieList;
          this.setHistCharts();
          this.keys++;
        }
      });
    },
    // 设置堆叠图和饼图数据
    setHistCharts() {
      // 堆叠图
      let newDirverDataOption = this.$baseMethod.deepClone(dirverDataOption);

      let getDriverSchedule = this.getDriverSchedule;

      newDirverDataOption.xAxis[0].data = getDriverSchedule.histogramList.map(
        (item) => item.orderCreateTime
      );
      newDirverDataOption.xAxis.data =
        getDriverSchedule.histogramList[0].driverFilterReasonList.map(
          (item) => item.reason
        );

      const len =
        getDriverSchedule.histogramList[0].driverFilterReasonList.length;
      let seriesData = [];

      for (let i = 0; i < len; i++) {
        let list = [];
        getDriverSchedule.histogramList.forEach((item) => {
          list.push(item.driverFilterReasonList[i].driverFilterCnt);
        });
        seriesData.push(list);
      }

      this.charts.dirverDataOption = newDirverDataOption;

      let series = newDirverDataOption.xAxis.data.map((item, index) => {
        return {
          name: item,
          type: "bar",
          stack: "Ad",
          emphasis: {
            focus: "series",
          },
          barWidth : 30,//柱图宽度
          data: seriesData[index],
        };
      });
      newDirverDataOption.series = series;

      // 饼图
      let newPieCharts = this.$baseMethod.deepClone(pieCharts);
      newPieCharts.series[0].data = this.getDriverSchedule.pieList.map(
        (item) => {
          return {
            name: item.reason,
            value: item.driverFilterRatio,
            ...item,
          };
        }
      );

      this.charts.pieCharts = newPieCharts;

      this.charts.dirverDataOption = newDirverDataOption;
    },

    // 重组柱状图数据
    initBarChartsOptions() {
      this.charts = {};
      let chartsList = [
        {
          title: "接驾里程分析",
          xAxisName: "单位: km",
          yAxisName: "订单量",
          labelDataKey: "driveMileageDetailList",
          xAxisData: this.getDriverSchedule.driveMileageDetailList.map(
            (item) => item.driveMileageRange
          ),
          series: this.getDriverSchedule.driveMileageDetailList.map(
            (item) => item.scheduleSuccessOrderCnt
          ),
        },
        {
          title: "接驾时长分析",
          xAxisName: "单位: min",
          yAxisName: "订单量",
          labelDataKey: "driveDurationDetailList",
          xAxisData: this.getDriverSchedule.driveDurationDetailList.map(
            (item) => item.driveDurationRange
          ),
          series: this.getDriverSchedule.driveDurationDetailList.map(
            (item) => item.scheduleSuccessOrderCnt
          ),
        },
        {
          title: "预估费用分析",
          xAxisName: "单位: ¥",
          yAxisName: "订单量",
          labelDataKey: "driveIncomeDetailList",
          xAxisData: this.getDriverSchedule.driveIncomeDetailList.map(
            (item) => item.driveIncomeRange
          ),
          series: this.getDriverSchedule.driveIncomeDetailList.map(
            (item) => item.scheduleSuccessOrderCnt
          ),
        },
      ];
      chartsList.forEach((item) => {
        this.charts[item.labelDataKey] = this.setChartsOptions(item);
      });
    },
    /**
     * title --> 图例主标题,
     * xAxisName --> x轴标题,
     * yAxisName  --> y轴标题,
     * xAxisData --> x轴显示数据
     * series --> 柱状图数据
     */
    setChartsOptions(params) {
      let chartsOptions = this.$baseMethod.deepClone(barCharts);
      chartsOptions.title.text = params.title;
      chartsOptions.xAxis.name = params.xAxisName;
      chartsOptions.yAxis.name = params.yAxisName || "订单量";
      chartsOptions.xAxis.data = params.xAxisData || [];
      chartsOptions.series[0].data = params.series || [];
      // console.log(chartsOptions);
      return chartsOptions;
    },

    // 根据城市编码识别出城市type, 获取最后一个选择的城市
    /**
     * code长度为1说明是省或者全国
     * 2 --> 市
     * 3 --> 区县
     */
    getLocalType(code) {
      let localGroup = {
        localType: "",
        localCode: "",
      };
      console.log(code)
      if (!code.length) {
        return localGroup;
      }
      const len = code.length;
      localGroup.localCode = code[len - 1];
      switch (len) {
        case 1:
          localGroup.localType = code[0] === 0 ? "QG" : "SHENG";
          localGroup.localCode = code[0] === 0 ? 2 : localGroup.localCode;
          break;
        case 2:
          localGroup.localType = "SHI";
          break;
        case 3:
          localGroup.localType = "XIAN";
          break;
        default:
          break;
      }
      return localGroup;
    },
  },
};
</script>

<style lang="scss" scoped>
.ml10 {
  margin-left: 10px;
}
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  .font24{
    font-size: 24px;
  }
}
.charts-container {
  flex-wrap: wrap;
  .charts-item {
    width: 50%;
    height: 350px;
  }
}
.dispatchDirverSearch {
  justify-content: space-between;
}
</style>