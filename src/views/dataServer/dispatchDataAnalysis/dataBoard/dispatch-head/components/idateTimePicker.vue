<template>
  <div class="date_time_container">
    <iDateTime
      :date="dataOptions.startDate"
      :time="dataOptions.startTime"
      :picker-options="startPickerOptions"
      v-bind="$attrs"
      @dateChange="handleStartDateChange"
      @timeChange="handleStartTimeChange"
    ></iDateTime>

    <iDateTime
      :date="dataOptions.endDate"
      :time="dataOptions.endTime"
      :picker-options="endPickerOptions"
      :timePickerOptions="{
        start: dataOptions.startTime && dataOptions.startDate == dataOptions.endDate ? dataOptions.startTime : '00:00',
        step: '00:30',
        end: '23:59',
      }"
      v-bind="$attrs"
      placeholder="结束"
      @dateChange="handleEndDateChange"
      @timeChange="handleEndTimeChange"
    ></iDateTime>
  </div>
</template>

<script>
import iDateTime from "./idateTime.vue";
export default {
  components: {
    iDateTime,
  },
  props: {
    startDate: {
      type: String,
      default: "",
    },
    endDate: {
      type: String,
      default: "",
    },
    startTime: {
      type: String,
      default: "",
    },
    endTime: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dataOptions: {
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
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
    };
  },
  created() {
    this.dataOptions.startDate = this.startDate;
    this.dataOptions.endDate = this.endDate;
    this.dataOptions.startTime = this.startTime;
    this.dataOptions.endTime = this.endTime;
  },
  watch: {
    startDate() {
      this.dataOptions.startDate = this.startDate;
    },
    endDate() {
      this.dataOptions.endDate = this.endDate;
    },
    startTime() {
      this.dataOptions.startTime = this.startTime;
    },
    endTime() {
      this.dataOptions.endTime = this.endTime;
    },
  },
  methods: {
    // 开始时间改变
    handleStartDateChange(value) {
      // console.log(value);
      this.dataOptions.startDate = value;
      this.dataOptions.startTime = "";
      this.dataOptions.endDate = "";
      this.dataOptions.endTime = "";
      this.emitDateTimeChange();
    },
    handleStartTimeChange(value) {
      this.dataOptions.startTime = value;
      this.dataOptions.endTime = "";
      this.emitDateTimeChange();
    },
    // 结束时间改变
    handleEndDateChange(value) {
      this.dataOptions.endDate = value;
      this.dataOptions.endTime = "";
      this.emitDateTimeChange();
    },

    handleEndTimeChange(value) {
      this.dataOptions.endTime = value;
      this.emitDateTimeChange();
    },

    emitDateTimeChange() {
      // this.timeGroup.timeButtonGroup = "CUSTOM";
      this.$emit("dateTimeChange", {
        ...this.dataOptions,
      });
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

<style lang="scss" scoped>
.date_time_container {
  display: inline-block;
  
}
</style>