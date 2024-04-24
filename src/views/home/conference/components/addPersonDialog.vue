<template>
    <el-dialog title="选择员工" :visible.sync="dialogVisible" width="65%" :close-on-click-modal="false" :close-on-press-escape="false">
        <div class="search-header">
            <el-form class="search-form" ref="form" :model="searchOptions" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="姓名：">
                            <el-input placeholder="请输入姓名" v-model="searchOptions.name" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="机构名称">
                            <el-input placeholder="请输入机构名称" v-model="searchOptions.deptName" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <div class="operate-group">
            <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        </div>
        <div class="search-box">
            <el-table
                ref="table"
                :data="tableData"
                style="border-radius: 8px; overflow: hidden"
                border
                :header-cell-style="{ background: '#F5F7FA', 'font-weight': 600, color: '#666' }"
                @selection-change="handleSelectionChange"
                max-height="500"
                :row-key="getRowKey"
            >
                <el-table-column type="selection" width="55" reserve-selection></el-table-column>
                <el-table-column label="序号" width="60">
                    <template slot-scope="{ $index }">
                        {{ (page.currentPage - 1) * page.pageSize + $index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="deptName" label="机构名称"></el-table-column>
            </el-table>
        </div>
        <div class="search-footer">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="page.currentPage"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="20"
                layout="total,sizes, prev, pager, next, jumper"
                :total="total"
            />
        </div>

        <div slot="footer" style="text-align: right">
            <el-button style="width: 160px" @click="dialogVisible = false">取 消</el-button>
            <el-button style="width: 160px" type="primary" @click="onSubmit">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
  name: 'addPersonDialog',

  props: {
    value: {
      type: Boolean
    },

    /**
     * 职位id
     */
     deptId: {
      type: Number,
      require: true
    }
  },

  data () {
    return {
      list: [],

      tableData: [],

      searchOptions: {
        name: '',
        deptName: '', // 员工姓名
        // 参会人员
        type: 2,
        deptId: this.deptId
      },

      page: {
        currentPage: 1,
        pageSize: 20
      },
      total: 0,
      tableData: [],

    }
  },

  computed: {
    dialogVisible: {
      get () {
        return this.value
      },
      set () {
        this.$emit('update:value', false)
      }
    }
  },

  created () {
    this.getTableList()
  },

  methods: {
    getRowKey (row) {
      return row.id
    },

    async getTableList () {
      let params = {
        body: this.searchOptions,
        ...this.page
      }

      try {
        const listResponse = await this._axios(Object.assign(params, { op: 'selectMeetingUser' }), "", "/conference/select")

        const totalResponse = await this._axios(Object.assign(params, { op: 'selectMeetingUserCount' }), "", "/conference/select")

        this.tableData = listResponse.data || []
        this.total = totalResponse.data

        this.setChecked()
      } catch (error) {
      }
    },

    handleSizeChange (size) {
      this.page.pageSize = size
      this.page.currentPage = 1

      this.getTableList()
    },
    handleCurrentChange (current) {
      this.page.currentPage = current

      this.getTableList()
    },


    onSearch () {
      this.page = this.$options.data().page
      this.total = 0

      this.getTableList()
    },

    handleSelectionChange (list) {
      this.list = list
    },

    onSubmit () {
      this.$emit('update', this.list)
      this.dialogVisible = false
    },

    setChecked () {
      this.list.forEach(row => {
        this.$refs['table'].toggleRowSelection(row, true)
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.search-header {
    // padding: 24px 24px 0 24px;
    background: #fff;

    box-sizing: border-box;

    .search-form {
        position: relative;
        padding: 24px 24px 2px 24px;
        border-radius: 8px;
        background: #f5f7fa;
        border: 1px solid #ebeef5;

        /deep/ .el-form-item label {
            font-weight: 400;
        }
    }
}

.search-box {
    flex: 1;
}

.search-footer {
    display: flex;
    justify-content: flex-end;
    height: 60px;
    background: #fff;
    padding: 15px 0;
}
.operate-group {
    display: flex;
    justify-content: flex-end;
    margin: 20px 0;
}
</style>
