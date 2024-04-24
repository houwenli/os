<template>
  <div>
    <el-date-picker
      v-model="dataOptions.startDate"
      type="date"
      :placeholder="`选择${placeholder}日期`"
      value-format="yyyy-MM-dd"
      :editable="false"
      v-bind="$attrs"
      :disabled="disabled"
      @change="handleDateChange"
    >
    </el-date-picker>

    <el-time-select
      v-model="dataOptions.startTime"
      :picker-options="timePickerOptions"
      :placeholder="`选择${placeholder}时间`"
      :disabled="disabled"
      @change="handleTimeChange"
    >
    </el-time-select>
  </div>
</template>

<script>
export default {
  props: {
    date: {
      type: String,
      default: ""
    },
    time: {
      type: String,
      default: ""
    },
    timePickerOptions: {
      type: Object,
      default: () => {
        return {
          start: '00:00',
          step: '00:30',
          end: '23:59'
        }
      }
    },
    placeholder: {
      type: String,
      default: "开始"
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataOptions: {
        startDate: "",
        startTime: "",
      },
      startPickerOptions: {}
    }
  },
  created() {
    this.dataOptions.startDate = this.date
    this.dataOptions.startTime = this.time
  },
  watch: {
    date() {
      this.dataOptions.startDate = this.date
    },
    time() {
      this.dataOptions.startTime = this.time
    }
  },
  methods: {
    handleDateChange() {
      this.$emit("dateChange", this.dataOptions.startDate)
    },
    handleTimeChange() {
      this.$emit("timeChange", this.dataOptions.startTime)
    }
  }
};
</script>

<style>
</style>