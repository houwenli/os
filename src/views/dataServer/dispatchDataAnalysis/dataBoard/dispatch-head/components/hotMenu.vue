<template>
  <div class="search_box" style="padding-top: 20px">
    <el-form :model="dataOptions" ref="ruleForm" inline label-width="100px">
      <el-form-item label="当前城市" prop="city">
        <ws-city
          class="city"
          v-model="dataOptions.city"
          :data="cityData"
          level="2"
          @change="handleChangeCity"
        ></ws-city>
      </el-form-item>

      <el-form-item label="日期" prop="time">
        <div class="dateTime_flex">
          <el-radio-group
            v-model="timeGroup.timeButtonGroup"
            style="margin-right: 10px"
            @change="handleTimeGroupChange"
          >
            <el-radio-button
              v-for="(item, index) in timeGroup.timeButtonGroupList"
              :key="index"
              :label="item.value"
              >{{ item.label }}
              <el-tooltip
                :content="item.tips"
                placement="top-start"
                class="info-tooltip"
              >
                <i
                  class="el-icon-question"
                  :style="{
                    color:
                      item.value == timeGroup.timeButtonGroup ? '#fff' : '#333',
                  }"
                ></i> </el-tooltip
            ></el-radio-button>
          </el-radio-group>

          <iDateTimePicker
            :startDate="dataOptions.startDate"
            :startTime="dataOptions.startTime"
            :endDate="dataOptions.endDate"
            :endTime="dataOptions.endTime"
            :key="value"
            @dateTimeChange="handleDateTimeChange"
          ></iDateTimePicker>
        </div>
      </el-form-item>

      <el-form-item label="订单类型" prop="orderType">
        <el-radio-group v-model="dataOptions.orderType" @change="submitForm">
          <el-radio-button
            v-for="item in orderType"
            :label="item.value"
            :key="item.value"
            >{{ item.label }}</el-radio-button
          >
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="getModulePower(moduleName).getAreaHexagon">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >刷新</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { timeButtonGroupList, orderType } from "../../../baseData";
import iDateTimePicker from "./idateTimePicker.vue";
export default {
  components: {
    iDateTimePicker,
  },
  data() {
    return {
      value: "1",
      moduleName: "/dataServer/dispatchDataAnalysis",
      dataOptions: {
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        city: [],
        orderType: "ALL",
        time: [],
      },
      startPickerOptions: {
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
      endPickerOptions: {
        disabledDate: (time) => {
          // 根据开始时间去限制结束时间的可选范围
          return this.pickerEndTimeOptions(time, this.dataOptions.startDate);
        },
      },
      timeGroup: {
        timeButtonGroup: "TODAY",
        timeButtonGroupList: [],
      },
      orderType,
      cityData: [],
    };
  },
  created() {
    this.timeGroup.timeButtonGroupList = [
      timeButtonGroupList[0],
      timeButtonGroupList[1],
      timeButtonGroupList[5],
    ];
    this.handleTimeGroupChange();
  },
  mounted() {
    this.$nextTick(() => {
      this.getUserCityList();
    });
  },
  methods: {
    // 获取日期时间
    handleDateTimeChange(oDateTime) {
      let {
        startDate = "",
        endDate = "",
        startTime = "",
        endTime = "",
      } = oDateTime;
      this.timeGroup.timeButtonGroup = "CUSTOM";
      this.dataOptions.startDate = startDate;
      this.dataOptions.endDate = endDate;
      this.dataOptions.startTime = startTime;
      this.dataOptions.endTime = endTime;
    },
    getUserCityList() {
      this.cityData = new Array(1)
      if (this.$parent.$attrs.cityList.length) {
        const ret = this.$baseMethod.deepClone(this.$parent.$attrs.cityList);
        ret.forEach((item) => {
          item.children.forEach((childItem) => {
            delete childItem.children;
          });
        });
        this.cityData = [...ret];

        if (this.cityData.length) {
          const firstCity = this.$parent.$attrs.firstCity
          if (firstCity.length == 1) {
            const province = firstCity[0]
            const city = ret.filter(item => item.code == province)[0].children[0].code
            this.dataOptions.city = [province, city]
          } else {
            this.dataOptions.city = firstCity
          }
        }
        this.submitForm();
      }
    },
    handleChangeCity(cityList) {
      this.$emit("handleCityChange", cityList)
      this.submitForm()
    },
    handleTimeGroupChange() {
      let startDate = "",
        endDate = "",
        startTime = "",
        endTime = "";
      if (this.timeGroup.timeButtonGroup !== "CUSTOM") {
        let date = this.timeGroup.timeButtonGroupList
          .filter((item) => item.value == this.timeGroup.timeButtonGroup)[0]
          .getTime();
        const startDateTime = this.$baseMethod.formatData(date[0]);
        const endDateTime = this.$baseMethod.formatData(date[1]);

        startDate = startDateTime.split(" ")[0];
        startTime = startDateTime.split(" ")[1].substring(0, 5);
        endDate = endDateTime.split(" ")[0];
        endTime = endDateTime.split(" ")[1].substring(0, 5);

        /**
         * 选择今天/昨天的快捷选项
         * 获取当前时间, 并根据分钟是否大于30向上取整
         * 如果当前时间为23:31分向上取整到明天的00:00
         */
        let currentDate = new Date();
        let hours = currentDate.getHours();
        let minutes = currentDate.getMinutes();
        if (this.timeGroup.timeButtonGroup == "YESTERDAY") {
          const _yestdayEndTime = endTime.split(":");
          hours = _yestdayEndTime[0];
          minutes = _yestdayEndTime[1];
        }
        if (minutes > 30) {
          minutes = "00";
          if (hours == 23) {
            endDate = this.$baseMethod.getTodayToAny(1, "yyyy-MM-dd").endTime;
            if (this.timeGroup.timeButtonGroup == "YESTERDAY") {
              const _yestDayDate = this.$baseMethod.formatData(
                new Date(endDateTime).getTime() + 86400000,
                "yyyy-MM-dd"
              );
              // console.log(_yestDayDate);
              endDate = _yestDayDate;
            }
            hours = "00";
          } else {
            hours++;
          }
        } else if (minutes < 30) {
          minutes = "30";
        }
        endTime = `${hours.toString().padStart(2, "0")}:${minutes}`;
      }
      this.dataOptions.startDate = startDate;
      this.dataOptions.endDate = endDate;
      this.dataOptions.startTime = startTime;
      this.dataOptions.endTime = endTime;
      if (this.timeGroup.timeButtonGroup !== "CUSTOM" && this.value != 1) {
       this.submitForm()
      }
    },

    submitForm(formName) {
      this.value++
      if (
        !this.dataOptions.startDate ||
        !this.dataOptions.startTime ||
        !this.dataOptions.endDate ||
        !this.dataOptions.endTime
      ) {
        this.$message.error("请完善时间选择");
        return false;
      }
      if (!this.dataOptions.city.length) {
        this.$message.error("请选择城市");
        return false;
      }
      this.emitFormDate({
        ...this.getParams(),
      });
    },

    resetForm(formName) {
      this.dataOptions = {
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        city: [],
        orderType: "ALL",
        time: [],
      };
      this.timeGroup.timeButtonGroup = "TODAY";

      this.$refs[formName].resetFields();

      this.handleTimeGroupChange();
      this.value++;
      this.$nextTick(() => {
        if (this.cityData.length) {
          let city = this.cityData[0];
          this.dataOptions.city = [city.code, city.children[0].code];
        }
        this.emitFormDate({
          ...this.getParams(),
        });
      });
    },

    getParams() {
      let startDate = `${this.dataOptions.startDate} ${this.dataOptions.startTime}:00`,
        endDate = `${this.dataOptions.endDate} ${this.dataOptions.endTime}:00`;
      let param = {
        ...this.getLocalType(this.dataOptions.city),
        dateType: this.timeGroup.timeButtonGroup,
        orderType: this.dataOptions.orderType,
        startDate,
        endDate,
      };
      return param;
    },

    // 根据城市编码识别出城市type, 获取最后一个选择的城市
    getLocalType(code) {
      let localGroup = {
        localType: "",
        localCode: "",
      };
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

    // 向上传递数据
    emitFormDate(params = {}) {
      this.$emit("handleClickRefresh", params);
    },

    pickerEndTimeOptions(time, startTime) {
      // 根据开始时间去限制结束时间的可选范围
      if (startTime) {
        return (
          time.getTime() < new Date(startTime).getTime() - 86400000 ||
          time.getTime() > new Date().getTime()
        );
      }
      let curDate = Date.now();
      let three = 90 * 86400000;
      let threeMonths = curDate - three;
      let current =
        new Date(new Date().toLocaleDateString()).getTime() + (86400000 - 1000);
      return time.getTime() > current || time.getTime() < threeMonths;
    },
  },
};
</script>

<style>
.dateTime_flex {
  display: flex;
}
</style>