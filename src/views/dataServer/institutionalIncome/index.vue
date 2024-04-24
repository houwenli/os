<template>
  <div>
    <div class="page-container">
      <div class="search-box">
        <el-form :model="formModel" inline label-width="100px">
          <el-form-item label="选择时间：" prop="time">
            <el-select v-model="formModel.dayType" style="width: 74px; margin-right: 4px" @change="onChangeDateType">
              <el-option value="day" label="按日"></el-option>
              <el-option value="month" label="按月"></el-option>
            </el-select>
            <el-date-picker
              v-if="formModel.dayType === 'day'"
              v-model="time"
              type="daterange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="(val) => handleTimeChange(val, 'day')"
            ></el-date-picker>

            <el-date-picker
              v-else
              v-model="time"
              type="monthrange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="(val) => handleTimeChange(val, 'month')"
            ></el-date-picker>
          </el-form-item>

          <!-- 实体店不需要显示筛选条件 -->
          <el-form-item label="机构名称：" v-if="currentOrgType !== 40">
            <organization-all
              v-model="formModel.agencyNumber"
              ref="org"
              @orgTypeChange="orgTypeChange"
              :selectOptions="filterOptions"
              placeholder="请选择"
              :reqData="reqData"
              valueKey="agencyNumber"
              nameKey="orgName"
            />
          </el-form-item>

          <el-form-item style="float: right">
            <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
            <el-button icon="el-icon-download" v-if="showExportPermission" @click="onExport">导出</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 机构收入 -->
      <incomePanel :info="incomeModel" :incomeEchartData='incomeEchartData'></incomePanel>

      <!-- 机构绩效排名 -->
      <institutionalPerformanceRanking v-if="showRankingPanel" :info="formModel" :key="refreshKey"></institutionalPerformanceRanking>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import organizationAll from '@/components/Organization/organization-all'
import incomePanel from './components/incomePanel.vue'
// 机构绩效排名
import institutionalPerformanceRanking from './components/institutionalPerformanceRanking.vue'

// 系统上线的起始日期-禁用掉
let initStartTime = '2023-06-01'
/**
 * 当月1号到昨天
 */
const getInitDayRange = () => {
  let startTime = dayjs(initStartTime).format('YYYY-MM-DD')

  // 判断今天是否是1号， 如果是1号，则结束日期为今天
  let endTime = ''

  if (dayjs().date() === 1) {
    endTime = dayjs().format('YYYY-MM-DD')
  } else {
    endTime = dayjs().startOf('day').format('YYYY-MM-DD')
  }

  return [startTime, endTime]
}

export default {
  name: 'institutionalIncome',

  components: {
    organizationAll,
    incomePanel,
    institutionalPerformanceRanking
  },

  data() {
    return {
      moduleName: '/dataServer/institutionalIncome',

      pickerOptions: {
        disabledDate: time => {
          let current = dayjs().valueOf()
          let t = dayjs(time).valueOf()

          if (this.formModel.dayType === 'day') {
            let diff =  dayjs().diff(t, 'day')
            // 时间跨度最大31天
            return t > current || diff > 30 || t < dayjs(initStartTime).valueOf()
          }

          // 月份选择，不能选择未来的日期，不能选择系统上线之前的日期, 只能选择进12个月

          // 只能选择12个月以内的
          let diff = dayjs().diff(t, 'month')

          return  t > current || diff > 11 || t < dayjs(initStartTime).startOf('month').valueOf()
        }
      },

      reqData: {
        moduleName: '/dataServer/institutionalIncome',
        op: 'selectOrgByOrgType',
        data: { isFilterGonghai: false }
      },

      selectOptions: [
        {
          // 大区正常值是 5， 但是这里由于历史原因，这个场景下，传值得传10 - 大数据那边定义的
          value: '10',
          label: '大区'
        },
        {
          value: '20',
          label: '城市分公司'
        },
        {
          value: '30',
          label: '区县分公司'
        },
        {
          value: '40',
          label: '实体店'
        }
      ],

      filterOptions: [],

      formModel: {
        // 日期类型
        dayType: 'day',
        dayStart: getInitDayRange()[0],
        dayEnd: getInitDayRange()[1],
        // 机构类型
        orgType: '',
        agencyNumber: ''
      },
      time: getInitDayRange(),

      // 机构收入
      incomeModel: {
        incomeSum: '',
        wycPlatfromAmt: '',
        djPlatfromAmt: '',
        driverVipAmt: '',
        memberAmt: ''
      },
      // 实体店收入趋势图
      incomeEchartData: {
        xData: [],
        incomeSum: [],
        wycPlatfromAmt: [],
        djPlatfromAmt: [],
        driverVipAmt: [],
        memberAmt: []
      },

      refreshKey: 0,

      currentOrgType: '',
      filterOptions: []
    }
  },

  computed: {
    showExportPermission() {
      let roleOption = JSON.parse(sessionStorage.getItem('roleOption'))
      if (roleOption.orgType === 40) return false

      if (!this.powerList.export) return false

      // 查询条件为实体店-不展示导出按钮
      if (this.formModel.orgType === '40') return false

      return true
    },

    showRankingPanel() {
      // 当前角色为实体店-不展示
      let roleOption = JSON.parse(sessionStorage.getItem('roleOption'))
      if (roleOption.orgType === 40) return false

      // 机构名称-筛选条件为实体店 - 也不展示
      if (this.formModel.orgType === '40') return false

      return true
    }
  },

  created() {
    this.setOrgOptions()

    this.onSearch()
  },

  methods: {
    setOrgOptions() {
      let roleOption = JSON.parse(sessionStorage.getItem('roleOption'))

      this.currentOrgType = roleOption.orgType

      if (roleOption.orgType === 40) return

      // 大区
      if (roleOption.orgType === 5) {
        this.filterOptions = this.selectOptions.slice(1)
        return
      }

      this.filterOptions = this.selectOptions.filter(item => parseInt(item.value) > roleOption.orgType)
    },

    onSearch() {
      this.refreshKey = Date.now()

      // 检查时间是否为空

      if (!this.formModel.dayStart || !this.formModel.dayEnd) {
        this.$message.warning('请选择查询的时间范围')
        return
      }

      this.getOverview()

      this.getIncomeData()
    },
    async onExport() {
      try {
        let url = this.$getModuleUrl(this.moduleName, 'export')
        let submitdata=this.$baseMethod.deepClone( this.formModel)
        let reqdata ={
          op: 'export',
          data: submitdata
        }
        if (!reqdata.data.agencyNumber) {
            reqdata.data.orgType=null
        }
        let res = await this.$axios(url,reqdata )

        this.$message.success('导出成功')

      } catch (error) {}
    },

    /**
     * 实体店收入汇总
     */
    async getOverview() {
      try {
        let url = this.$getModuleUrl(this.moduleName, 'overview')
        let submitdata=this.$baseMethod.deepClone( this.formModel)
        let reqdata ={
          op: 'overview',
          data: submitdata
        }
          //卜伟要求不能只筛选了前面的类型，后面没选具体的机构
        if (!reqdata.data.agencyNumber) {
            reqdata.data.orgType=null
        }
        let res = await this.$axios(url, reqdata)

        let data = JSON.parse(res.data)

        if (res.code === 1) {
          this.incomeModel.incomeSum = this.$baseMethod.regFenToYuan(data.incomeSum)
          this.incomeModel.wycPlatfromAmt = this.$baseMethod.regFenToYuan(data.wycPlatfromAmt)
          this.incomeModel.djPlatfromAmt = this.$baseMethod.regFenToYuan(data.djPlatfromAmt)
          this.incomeModel.driverVipAmt = this.$baseMethod.regFenToYuan(data.driverVipAmt)
          this.incomeModel.memberAmt = this.$baseMethod.regFenToYuan(data.memberAmt)
        }
      } catch (error) {}
    },

    /**
     * 查询收入-趋势图数据
     */
    async getIncomeData() {
      try {
        let url = this.$getModuleUrl(this.moduleName, 'orgIncomeGroupByDay')
        let submitdata=this.$baseMethod.deepClone( this.formModel)
        let reqdata={
          op: 'orgIncomeGroupByDay',
          data: submitdata
        }
          //卜伟要求不能只筛选了前面的类型，后面没选具体的机构
        if (!reqdata.data.agencyNumber) {
            reqdata.data.orgType=null
        }
        let res = await this.$axios(url, reqdata)
        let data = JSON.parse(res.data)

        this.incomeEchartData.xData = data.xData

        // 将数据都转换为元为单位
        let yData = data.dataInfoList || []

        yData.forEach(p => {
          p.data = p.data.map(k => this.$baseMethod.regFenToYuan(k))
        })

        this.incomeEchartData.incomeSum = yData[0].data
        this.incomeEchartData.wycPlatfromAmt = yData[1].data
        this.incomeEchartData.djPlatfromAmt = yData[2].data
        this.incomeEchartData.driverVipAmt = yData[3].data
        this.incomeEchartData.memberAmt = yData[4].data
      } catch (error) {}
    },

    orgTypeChange(val) {
      this.refreshKey = Date.now()
      this.formModel.orgType = val
    },

    handleTimeChange(val, type) {
      if (val === null) {
        this.time = []
        this.formModel.dayStart = ''
        this.formModel.dayEnd = ''
        return
      }

      if (type === 'day') {
        this.formModel.dayStart = val[0]
        this.formModel.dayEnd = val[1]

        return
      }

      this.formModel.dayStart = val[0]

      // 月份选择器-这里返回的是月的起始日期
      if (val[0] === val[1]) {
        let today = dayjs().format('YYYY-MM-DD')
        if (val[0] === today) {
          // 最多只查询到今天
          this.formModel.dayEnd = today
        } else {
          this.formModel.dayEnd = dayjs(val[0]).endOf('month').format('YYYY-MM-DD')
        }
      } else {
        // 2个日期是不一样的
        this.formModel.dayEnd = dayjs(val[1]).endOf('month').format('YYYY-MM-DD')
      }
    },
    onChangeDateType(val) {
      if (val === 'day') {
        let time = getInitDayRange()
        this.time = time

        this.formModel.dayStart = time[0]
        this.formModel.dayEnd = time[1]
      } else {
        let today = dayjs().format('YYYY-MM-DD')
        let start = dayjs().startOf('month').format('YYYY-MM-DD')
        let time = [start, today]

        this.formModel.dayStart = time[0]
        this.formModel.dayEnd = time[1]
        this.time = time
      }
    }
  }
}
</script>

<style lang="less" scoped>
.page-container {
  padding: 24px 40px;
  background: #fff;
  border-radius: 8px;
  min-height: 100%;
}
.search-box {
  background: #f5f7fa;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
