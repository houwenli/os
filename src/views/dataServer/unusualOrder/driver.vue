<!-- unusualDriver Page -->
<template>
    <div class="unusualDriver-wrap">
      <ws-table-el ref="table" v-bind="tableConfig" @sort-change="sortChange">
        <template #search>
          <search-group>
                <label for>订单号：</label>
                <el-input v-model.trim="searchOptions.orderId" placeholder="请输入订单号" :maxlength="30"
                          clearable></el-input>
            </search-group>
            <search-group>
              <label for>订单类型：</label>
              <el-select v-model="searchOptions.orderType" clearable placeholder="请选择">
                <el-option v-for="item in businessScenarioExpFilters.filter(v => v.id !== 80)" :key="item.id" :label="item.value" :value="item.id"></el-option>
              </el-select>
            </search-group>
            <search-group>
              <label for>车主ID：</label>
              <el-input v-model.trim="searchOptions.driverId" placeholder="请输入车主ID" :maxlength="30" clearable></el-input>
            </search-group>
            <search-group>
              <label for>完单时间：</label>
              <ws-date-range :startTime.sync="searchOptions.startTime" :endTime.sync="searchOptions.endTime"></ws-date-range>
            </search-group>
          </template>
          <template #searchBtns>
                <el-button-group v-if="powerList.driverIncomeExceptionPage">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="table-column-header-button" @click="reset" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
                <ws-throttle><el-button v-if="powerList.export" style="margin-left: 16px" plain @click="exportExcel">导出</el-button></ws-throttle>
          </template>
          <template>
            <ws-table-column-el align="center" prop="orderId" label="订单号"></ws-table-column-el>
            <ws-table-column-el align="center" prop="orderType" label="订单类型">
              <template slot-scope="scope">
                {{ scope.row.orderType | businessScenarioExpFilters }}
              </template>
            </ws-table-column-el>
            <ws-table-column-el align="center" prop="orderVipType" label="订单包干类型">
              <template slot-scope="scope">
                {{ scope.row.orderVipType | orderVipTypeFilters }}
              </template>
            </ws-table-column-el>
            <ws-table-column-el align="center" prop="driverId" label="车主id"></ws-table-column-el>
            <ws-table-column-el align="center" prop="finishedTime" label="完单时间" sortable="custom"></ws-table-column-el>
            <ws-table-column-el align="center" label="订单金额">
              <template slot-scope="scope">
                {{ $baseMethod.regFenToYuan(scope.row.orderPrice) }}
              </template>
            </ws-table-column-el>
            <ws-table-column-el align="center" label="司机所得金额">
              <template slot-scope="scope">
                {{ $baseMethod.regFenToYuan(scope.row.driverIncome) }}
              </template>
            </ws-table-column-el>
            <ws-table-column-el align="center"  label="司机入账金额">
              <template slot-scope="scope">
                {{ $baseMethod.regFenToYuan(scope.row.driverRealIncome) }}
              </template>
            </ws-table-column-el>
            <ws-table-column-el  align="center" prop="differenceAmt " label="差异金额">
              <template slot="header">
                  差异金额
                  <el-tooltip content="差异金额=司机入账金额-司机所得金额" placement="top-start" class="info-tooltip">
                          <i class="el-icon-question" :style="{color:'#333'}"></i>
                  </el-tooltip>
              </template>
              <template slot-scope="scope">
                {{ $baseMethod.regFenToYuan(scope.row.differenceAmt) }}
              </template>
            </ws-table-column-el>
          </template>
      </ws-table-el>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
const sortMap = {
  descending: 'desc',
  ascending: 'asc'
}
export default {
  name:'unusualDriver',
  data(){
    return {
      moduleName:'/dataServer/unusualOrder',
      searchOptions:{
        driverId:'',
        orderId:'',
        startTime:this.$baseMethod.getBeforeDay(-180, 'yyyy-MM-dd') + ' 00:00:00',
        endTime:this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd') + ' 23:59:59',
      },
      tableConfig: {
          lazyQuery: {
              moduleName: '/dataServer/unusualOrder',
              op: {
                  selectList: 'driverIncomeExceptionPage',
                  selectCount: 'driverIncomeExceptionCount',
              },
              beforeQuery: this.beforeQuery,
          },
      },
      op: {
        export: 'export'
      },
      orderBy: 'desc'
    }
  },
  computed: {
    ...mapGetters('order', ['businessScenarioExpFilters'])
  },
  created(){},
  methods:{
    beforeQuery () {
      return {
        ...this.searchOptions,
        orderBy: this.orderBy
      }
    },
    search(){
      this.$refs.table.search()
    },
    getFirst() {
      let date = new Date().getTime()
      // 将半年的时间单位换算成毫秒
      let halfYear = (365 / 2) * 24 * 3600 * 1000
      let pastResult = date - halfYear
      let pastDate = new Date(pastResult),
        pastYear = pastDate.getFullYear(),
        pastMonth = pastDate.getMonth() + 1,
        pastDay = pastDate.getDate()
      return pastYear + '-' + pastMonth + '-' + pastDay
    },
    reset() {
      this.searchOptions = {
        driverId:'',
        orderId: '',
        startTime:'',
        endTime:'',
        orderType: ''
      }
      this.search()
    },
    // 导出
    exportExcel() {
      const reqData = {
        data: this.searchOptions,
        op: this.op.export
      }
      let URL = this.$getModuleUrl(this.moduleName, reqData.op)
      this.$axios(URL, reqData).then(res => {
        this.$message.success('文件正在导出，请到文件下载界面进行下载')
      })
    },
    sortChange ({order}) {
      this.orderBy = order === null ? 'desc' : sortMap[order]
      this.search()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>