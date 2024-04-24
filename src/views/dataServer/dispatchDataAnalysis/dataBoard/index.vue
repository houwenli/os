<template>
  <div>
    <el-tabs v-model="tabs.active" type="card">
      <el-tab-pane v-for="(item,index) in tabs.list" :label="item.name" :name="item.value" :key="index"></el-tab-pane>
    </el-tabs>
    <div>
      <component :is="tabs.active" :cityList="cityList" :firstCity="firstCity" @handleCityChange="handleCityChange"></component>
    </div>
  </div>
</template>

<script>
import generalDispatchDataKanban from './generalDispatchDataKanban/index.vue' // 总调度数据看板
import dispathHead from './dispatch-head/index.vue' // 运力缺口热力图
import dirverDispatch from './dirverDispatch/index.vue' // 司机调度分析
import passengerDispatch from './passengerDispatch/index.vue' // 乘客调度分析
export default {
  components: {
    generalDispatchDataKanban,
    dispathHead,
    dirverDispatch,
    passengerDispatch,
  },
  data() {
    return {
      tabs: {
        active: 'generalDispatchDataKanban',
        list: [
          {
            name: '总调度数据看板',
            value: 'generalDispatchDataKanban',
          },
          {
            name: '运力缺口热力图',
            value: 'dispathHead',
          },
          {
            name: '司机调度分析',
            value: 'dirverDispatch'
          },
          {
            name: '乘客调度分析',
            value: 'passengerDispatch'
          },
        ]
      },
      moduleName: "/dataServer/dispatchDataAnalysis",
      cityList: [], // 保存, 只请求一次城市权限的数据
      firstCity: []
    }
  },
  created() {
    this.getUserCityList()
  },
  methods: {
    // 选择城市改变后, 进入其他标签页也用这个城市进行加载查询
    handleCityChange(cityList) {
      // console.log(cityList);
      this.firstCity = cityList
    },

    getUserCityList() {
      const op = 'selectPossessCityTree'
      let data = {
        data: {
          systemCode: "OASYSTEM"
        },
        op,
      };
      let URL = this.$getModuleUrl(this.moduleName, op);
      this.$axios(URL, data).then((res) => {
        if (res.code == 1) {
          const ret = JSON.parse(res.data);
          this.cityList = [...ret];
          if (ret.length) {
            const city = ret[0]
            this.firstCity = [city.code, city.children[0].code]
            
          }
        }
      });
    },
  }
}
</script>

<style>

</style>