<template>
  <div>
    <ws-table-el ref="table" v-bind="tableConfig">
      <template #search>
        <search-group>
          <label for>模块名称：</label>
          <el-input v-model.trim="searchOptions.name" :maxlength="20" placeholder="请输入模块名称" clearable></el-input>
        </search-group>
      </template>

      <template #options>
        <div style="float: right">
          <el-button-group v-if="powerList.selectAppSystemList">
            <el-button type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
            <ws-throttle>
              <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
            </ws-throttle>
          </el-button-group>
          <el-button style="margin-left: 10px; width: 96px" v-if="powerList.saveAppSystem" plain @click="onAdd" icon="el-icon-circle-plus">新增</el-button>
        </div>
      </template>

      <template>
        <ws-table-column-el prop="name" label="模块名称"></ws-table-column-el>
        <ws-table-column-el prop="path" label="模块路径"></ws-table-column-el>
        <ws-table-column-el label="权限控制">
          <template slot-scope="{ row }">
            <div v-if="row.status === 1" class="start">启用</div>
            <div v-if="row.status === 2" class="stop">停用</div>
          </template>
        </ws-table-column-el>

        <ws-table-column-el label="操作" fixed="right" width="200">
          <template slot-scope="{ row }">
            <el-button v-if="powerList.selectAppSystemDetail" @click="onEdit(row, 'detail')" type="text" style="color: #0088ff">详情</el-button>
            <el-button v-if="powerList.selectAppSystemDetail" type="text" @click="onEdit(row, 'edit')" style="color: #0088ff">修改</el-button>
            <el-button type="text" v-if="powerList.updateAppSystemStatus" @click="onUpdateStatus(row)">
              {{ row.status === 1 ? '停用' : '启用' }}
            </el-button>
            <el-button type="text" v-if="row.status === 2 && powerList.logicDelAppSystem" @click="onDelete(row)">删除</el-button>
          </template>
        </ws-table-column-el>
      </template>
    </ws-table-el>
  </div>
</template>

<script>
export default {
  name: 'H5Module',
  data() {
    return {
      searchOptions: {
        name: ''
      },

      tableConfig: {
        filterColumns: false,
        lazyQuery: {
          moduleName: '/technology/systemInfo',
          op: {
            selectList: 'selectAppSystemList'
          }
        }
      },

      moduleName: '/technology/systemInfo'
    }
  },

  methods: {
    onAdd() {
      this.$router.push({
        name: 'systemInfoH5Edit'
      })
    },

    reset() {
      this.$refs['table'].reset()
    },

    search(type = 2) {
      this.$refs.table.search(type)
    },

    onEdit(row, type) {
      this.$router.push({
        name: 'systemInfoH5Edit',
        query: {
          type,
          id: row.id
        }
      })
    },

    onUpdateStatus(row) {
      this.$confirm(`确认${row.status === 1 ? '停用' : '启用'}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      })
        .then(() => {
          let data = {
            data: JSON.stringify({
              id: row.id,
              status: row.status === 1 ? 2 : 1
            }),
            op: 'updateAppSystemStatus'
          }

          this.$axios(this.$getModuleUrl(this.moduleName, 'updateAppSystemStatus'), data)
            .then(res => {
              if (res.code === 1) {
                this.$message.success(`${row.status === 1 ? '停用' : '启用'}成功`)
                this.search()
              }
            })
            .catch(() => {})
        })
        .catch(error => {
          console.log(error)
        })
    },

    onDelete(row) {
      this.$confirm('确定删除吗?', '提示')
        .then(async () => {
          let params = {
            data: {
              id: row.id
            },
            op: 'logicDelAppSystem'
          }
          let url = this.$getModuleUrl(this.moduleName, 'logicDelAppSystem')

          try {
            await this.$axios(url, params)

            this.$message.success('删除成功')

            this.search()
          } catch (error) {}
        })
        .catch(() => {})
    }
  }
}
</script>
