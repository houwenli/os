<template>
  <div class="panel-wrap">
    <div class="panel-title">
      <div class="left">实体店收入排名</div>
      <div class="right">
        <div class="item" @click="onChangeOrgType(item)" v-for="(item, index) in filterOrgList" :key="index" :class="{ active: orgType === item.value }">
          {{ item.label }}
        </div>
      </div>
    </div>
    <div class="table-wrap">
      <el-table ref='table' :default-sort="{prop: 'incomeSum', order: 'descending'}" border :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: 'bold' }" :data="tableList" @sort-change="onSort">
        <template v-for="(item, index) in filterColums">
          <el-table-column :key="index" :label="item.label" v-bind="item" v-if="item.prop === 'incomeSum'">
            <template slot-scope="{ row }">
              {{ $baseMethod.regFenToYuan(row.incomeSum) }}
            </template>
          </el-table-column>

          <el-table-column v-else :key="index" :label="item.label" v-bind="item"></el-table-column>
        </template>
      </el-table>

      <!-- 分页 -->
      <div class="table-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.currentPage"
          :page-sizes="[20, 30, 40, 50]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :disabled="disabled"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
const orgList = () => {
  return [
    {
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
  ]
}

export default {
  name: 'institutionalPerformanceRanking',

  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      orgType: '10',

      page: {
        currentPage: 1,
        pageSize: 20
      },

      total: 0,

      tableList: [],

      orgList: orgList(),

      filterOrgList: [],

      refreshKey: 0,

      columns: [
        {
          prop: 'orgName',
          label: '机构名称'
        },
        {
          prop: 'agencyNumber',
          label: '机构编码',
          hide: ['10']
        },
        {
          prop: 'parentAgency',
          label: '上级机构',
          hide: ['10', '20']
        },
        {
          prop: 'incomeSum',
          label: '总收入',
          hide: ['10'],
          sortable: 'custom'
        },
        {
          prop: 'incomeSum',
          label: '总收入',
          hide: ['20', '30', '40'],
          sortable: 'custom'
        },
        {
          prop: 'wycPlatfromAmt',
          label: '网约车平台费收入'
        },
        {
          prop: 'djPlatfromAmt',
          label: '代驾平台费收入'
        },
        {
          prop: 'driverVipAmt',
          label: '网约车包干费收入'
        },
        {
          prop: 'memberAmt',
          label: '千城万店收入'
        }
      ],
      // 1-降序; 2-升序
      orderBy: 1
    }
  },

  computed: {
    filterColums() {
      return this.columns.filter(item => {
        if (item.hide === undefined) return true

        if (item.hide.includes(this.orgType)) return false

        return true
      })
    },

    disabled() {
      return this.info.dayStart && this.info.dayEnd ? false : true
    }
  },

  created() {
    this.setOrgList()

    this.getList()
  },

  methods: {
    onSort({ column, prop, order }) {
      // 恢复
      if (order === null) return

      if (order === 'ascending') {
        this.orderBy = 2
      } else {
        this.orderBy = 1
      }

      // 查询
      this.getList()
    },

    setOrgList() {
      let roleOption = JSON.parse(sessionStorage.getItem('roleOption'))

      if (this.info.orgType === '') {
        if (roleOption.orgType === 0) {
          // 如果当前角色是总部的， 就显示所有

          this.filterOrgList = orgList()
        } else {
          let t = []
          if (roleOption.orgType === 5) {
            t = this.orgList.slice(1)
          } else {
            // 使用当前角色过滤一下
            t = this.orgList.filter(item => parseInt(item.value) > roleOption.orgType)
          }

          this.orgType = t[0].value

          this.filterOrgList = t
        }

        return
      }

      let t = this.orgList.filter(item => parseInt(item.value) > this.info.orgType)
      this.orgType = t[0].value

      this.filterOrgList = t
    },

    async getList() {
      if (!this.info.dayStart || !this.info.dayEnd) {
        return
      }

      try {
        let url = this.$getModuleUrl('/dataServer/institutionalIncome', 'orgIncomeRankPage')
        let submitdata = this.$baseMethod.deepClone(this.info)
        if (!submitdata.agencyNumber) {
          submitdata.orgType = null
        }
        let body = Object.assign({}, submitdata, {
          orderBy: this.orderBy,
          groupByType: this.orgType
        })

        let res = await this.$axios(url, {
          op: 'orgIncomeRankPage',
          data: {
            body,
            ...this.page
          }
        })

        if (res.code === 1) {
          const d = JSON.parse(res.data)

          let list = d.body || []

          list.forEach(item => {
            item.driverVipAmt = this.$baseMethod.regFenToYuan(item.driverVipAmt)
            item.wycPlatfromAmt = this.$baseMethod.regFenToYuan(item.wycPlatfromAmt)
            item.djPlatfromAmt = this.$baseMethod.regFenToYuan(item.djPlatfromAmt)
            item.memberAmt = this.$baseMethod.regFenToYuan(item.memberAmt)
          })

          this.tableList = list
          this.total = d.count
        } else {
          this.tableList = []
          this.total = 0
        }
      } catch (error) {}
    },

    onChangeOrgType(item) {
      if (!this.info.dayStart || !this.info.dayEnd) {
        this.$message.warning('请选择查询的时间范围')
        return
      }

      this.orderBy = 1

      this.tableList = []
      this.page.currentPage = 1
      this.total = 0

      // 清空排序条件
      this.$refs['table'].clearSort()

      this.orgType = item.value

      this.refreshKey = Date.now()

      this.getList()
    },

    handleSizeChange(size) {
      if (!this.info.dayStart || !this.info.dayEnd) {
        this.$message.warning('请选择查询的时间范围')
        return
      }

      this.page.currentPage = 1
      this.page.pageSize = size

      this.getList()
    },

    handleCurrentChange(current) {
      if (!this.info.dayStart || !this.info.dayEnd) {
        this.$message.warning('请选择查询的时间范围')
        return
      }

      this.page.currentPage = current

      this.getList()
    }
  }
}
</script>

<style lang="less" scoped>
.panel-wrap {
  margin-top: 32px;
}
.panel-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;

  .right {
    display: flex;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;

    .item {
      width: 92px;
      height: 32px;
      line-height: 32px;
      background: #ffffff;
      border-right: 1px solid #dcdfe6;
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #5f6e82;
      cursor: pointer;

      &:last-of-type {
        border-right: none;
      }
    }

    .active {
      background: #f05259;
      color: #fff;
    }
  }
}

.table-wrap {
  width: 100%;
  padding-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
}

.table-pagination {
  margin-top: 24px;
  overflow: hidden;
}
</style>
