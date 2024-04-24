<template>
  <div :id="id" class="charts"></div>
</template>

<script>
export default {
  props: {
    setChartsOptions: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      id: `charts${Math.random() * 100}`,
      charts: null,
    };
  },
  mounted() {
    // console.log(this.setChartsOptions, '===========================');
    const _this = this
    this.init();
    window.addEventListener('resize', this.$baseMethod.debounce(function(ev){
      if (_this.charts) {
        _this.charts.resize()
      }
    }))
  },
  methods: {
    init() {
      if (!this.setChartsOptions) {
        return false;
      }
      this.charts = this.$echarts.init(document.getElementById(this.id));
      this.charts.setOption(this.setChartsOptions);
      const _this = this;
      this.charts.on("click", function () {
        _this.$emit("chartsClick", ...arguments);
      });
    },
    updateCharts (chartsOptions) {
      this.charts.setOption(chartsOptions, true);
    }
  },
};
</script>

<style>
.charts {
  width: 100%;
  height: 500px;
}
</style>
