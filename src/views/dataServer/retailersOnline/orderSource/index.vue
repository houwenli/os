<template>
  <div class="orderSource">
    <div class="searchBox">
      <el-form :model="searchOptions" ref="ruleForm" inline label-width="90px">
        <template>
          <el-form-item label="订单来源：" prop="sourceType">
            <el-select v-model="searchOptions.sourceType" placeholder="请选择订单来源" @change="typeChange">
              <el-option v-for="item in sourceTypes" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间：">
            <el-radio-group v-model="timeType" @change="handleTimeGroupChange" style="margin-right:5px;">
              <el-radio-button v-for="item in timeButtonGroupList" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
            </el-radio-group>
            <!-- <ws-date-range :startTime.sync="searchOptions.dayStart" @change="dateChange" :endTime.sync="searchOptions.dayEnd" type="daterange" clearable></ws-date-range> -->
            <el-date-picker class="datePicker" v-model="searchOptions.time" @change="dateChange" type="daterange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" value-format="yyyy-MM-dd" clearable>
            </el-date-picker>
          </el-form-item>
        </template>
      </el-form>
      <div class="btn-box">
        <ws-throttle>
          <el-button class="query-btn" type="primary" icon="el-icon-search" @click="handelSearch">查询</el-button>
        </ws-throttle>
        <ws-throttle v-if="searchOptions.sourceType===2">
          <el-button plain icon="el-icon-download" @click="handelExport" :loading="exportLoading">导出</el-button>
        </ws-throttle>
      </div>
    </div>
    <all ref="all" v-if="searchOptions.sourceType===0" :params="searchOptions" />
    <separate ref="separate" v-else :params="searchOptions" />
  </div>
</template>

<script>
import all from './components/all.vue'
import separate from './components/separate.vue'
import { timeButtonGroupList } from '../components/search-options'

export default {
    components: { all, separate },
    data() {
        return {
            timeType: 'YESTERDAY',
            timeButtonGroupList,
            searchOptions: {
                sourceType: 0,
                time: [this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd'), this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd')],
                dayStart: this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd'),
                dayEnd: this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd')
            },
            sourceTypes: [
                { id: 0, value: '全部' },
                { id: 1, value: '直营店' },
                { id: 2, value: '实体店' }
            ],
            moduleName: '/dataServer/retailersOnline',
            exportLoading: false,
            pickerOptions: {
                //时间范围选择控制
                onPick: ({ maxDate, minDate }) => {
                    if (minDate) {
                        this.pickerMinDate = minDate.getTime()
                    }
                    if (maxDate) {
                        this.pickerMinDate = ''
                        this.pickerMaxDate = maxDate.getTime()
                    }
                },
                disabledDate: time => {
                    const day30 = 30 * 24 * 3600 * 1000
                    const minDay = new Date('2020-07-01 00:00:00').getTime()
                    if (this.pickerMinDate !== '') {
                        let maxTime = this.pickerMinDate + day30
                        if (maxTime > new Date()) {
                            maxTime = new Date()
                        }
                        return time.getTime() < minDay || time.getTime() > maxTime || time.getTime() > Date.now()
                    }
                    if (this.pickerMaxDate !== '' && !this.pickerMinDate) {
                        let minTime = this.pickerMaxDate - day30
                        return time.getTime() < minDay || time.getTime() < minTime || time.getTime() > Date.now()
                    }
                    return time.getTime() < minDay || time.getTime() > Date.now()
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.handelSearch()
        })
    },
    methods: {
        dateChange(val) {
            this.timeType = 'CUSTOM'
            this.searchOptions.dayStart = val ? val[0] : ''
            this.searchOptions.dayEnd = val ? val[1] : ''
        },
        handleTimeGroupChange() {
            this.searchOptions.time = ''
            this.searchOptions.dayStart = ''
            this.searchOptions.dayEnd = ''
            if (this.timeType !== 'CUSTOM') {
                if (this.timeType === 'THIRTY') {
                    let nowTime = new Date().getTime()
                    let y = new Date().getFullYear()
                    let m = new Date().getMonth()
                    let d = new Date(y, m, 1).getTime()
                    this.searchOptions.time = [this.$baseMethod.formatData(d, 'yyyy-MM-dd'), this.$baseMethod.formatData(nowTime, 'yyyy-MM-dd')]
                    this.searchOptions.dayStart = this.$baseMethod.formatData(d, 'yyyy-MM-dd')
                    this.searchOptions.dayEnd = this.$baseMethod.formatData(nowTime, 'yyyy-MM-dd')
                } else {
                    let days = this.timeButtonGroupList.filter(item => item.value == this.timeType)[0].days
                    this.searchOptions.time = [this.$baseMethod.getBeforeDay(days, 'yyyy-MM-dd'), this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd')]
                    this.searchOptions.dayStart = this.$baseMethod.getBeforeDay(days, 'yyyy-MM-dd')
                    this.searchOptions.dayEnd = this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd')
                }
                this.$forceUpdate()
            }
        },
        handelSearch() {
            if (!this.searchOptions.time) {
                return this.$message.error('请选择时间')
            }
            const str = this.searchOptions.sourceType === 0 ? 'all' : 'separate'
            this.$refs[str].search()
        },
        // 实体店导出
        handelExport() {
            this.exportLoading = true
            const reqData = {
                data: this.searchOptions,
                op: 'orderSourceExport'
            }
            let URL = this.$getModuleUrl(this.moduleName, reqData.op)
            this.$axios(URL, reqData)
                .then(res => {
                    this.exportLoading = false
                    this.$message.success('文件正在导出，请到文件下载界面进行下载')
                })
                .catch(() => {
                    this.exportLoading = false
                })
        },
        typeChange(e) {
            this.$nextTick(() => {
                this.handelSearch()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.orderSource {
    padding: 0 40px 24px 40px;
    border-radius: 8px;
    background: #fff;
    .query-btn {
        margin-bottom: 18px;
    }
    /deep/.searchBox {
        display: flex;
        justify-content: space-between;
        background: #f5f7fa;
        border-radius: 8px;
        border: 1px solid #ebeef5;
        padding: 20px 16px 0;
        .el-date-editor {
            width: 270px;
        }
    }
}
</style>