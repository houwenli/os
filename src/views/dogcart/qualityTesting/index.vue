<template>
  <div>
    <!-- 列表 -->
    <ws-table-el ref="table" v-bind="tableConfig">
      <template #search>
        <search-group>
          <label for>车架号：</label>
          <el-input v-model.trim="searchOptions.vehicleNumber" placeholder="请输入车架号" clearable></el-input>
        </search-group>
        <search-group>
          <label for>中控IMEI：</label>
          <el-input v-model.trim="searchOptions.imei" placeholder="请输入中控IMEI" clearable></el-input>
        </search-group>
        <search-group>
          <label for>检测人ID：</label>
          <el-input v-model.trim="searchOptions.uId" placeholder="请输入检测人ID" clearable @input="numberInput"></el-input>
        </search-group>
        <search-group>
          <label for>检测人手机号：</label>
          <el-input v-model.trim="searchOptions.phone" placeholder="请输入检测人手机号" clearable></el-input>
        </search-group>
        <search-group>
          <label for>检测通过时间：</label>
          <ws-date-range :startTime.sync="searchOptions.checkTimeStart" :endTime.sync="searchOptions.checkTimeEnd" :intervalTime="30"></ws-date-range>
        </search-group>
        <search-group>
          <label for>入库状态 ：</label>
          <el-select v-model="searchOptions.stroeStatus">
            <el-option v-for="item in checkStatusTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
        </search-group>
        <search-group>
          <label for>入库时间：</label>
          <ws-date-range :startTime.sync="searchOptions.createTimeStart" :endTime.sync="searchOptions.createTimeEnd" :intervalTime="30"></ws-date-range>
        </search-group>
      </template>
      <template #searchBtns>
        <el-button-group v-if="powerList.selectPage">
          <ws-enter-event>
            <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
          </ws-enter-event>
          <ws-throttle>
            <el-button type="primary" class="table-column-header-button" @click="reset" icon="el-icon-refresh-left"></el-button>
          </ws-throttle>
        </el-button-group>
      </template>
      <template #options>
        <el-button-group v-if="powerList[opList.batch]">
          <el-button type="primary" @click="batchOperate()">批量入库</el-button>
        </el-button-group>
        <el-button-group v-if="powerList[opList.batchidList]">
          <el-button type="primary" @click="batchOperate('all')" style="margin-left: 8px">一键入库</el-button>
        </el-button-group>
      </template>
      <!-- 表格 -->
      <template>
        <ws-table-column-el prop="vehicleNumber" label="车架号"></ws-table-column-el>
        <ws-table-column-el prop="imei" label="中控IMEI"></ws-table-column-el>
        <ws-table-column-el prop="checkTime" label="检测通过时间"></ws-table-column-el>
        <ws-table-column-el prop="uId" label="检测人ID"></ws-table-column-el>
        <ws-table-column-el prop="phone" label="检测人手机号"></ws-table-column-el>
        <ws-table-column-el prop="orgType" label="机构类型">
          <template slot-scope="scope">
            {{  scope.row.orgType  | dogcartOrgTypeFilters }}
          </template>
        </ws-table-column-el>
        <ws-table-column-el prop="orgName" label="绑定机构">
          <template slot-scope="scope">
            {{ scope.row.orgName || '-' }}
          </template>
        </ws-table-column-el>
        <ws-table-column-el prop="stroeStatus" label="入库状态">
          <template slot-scope="scope">
            {{ scope.row.stroeStatus == 0 ? '未入库' : '已入库' }}
          </template>
        </ws-table-column-el>
        <ws-table-column-el prop="stroeTime" label="入库时间"></ws-table-column-el>
        <ws-table-column-el label="操作" v-if="powerList[opList.delete] || powerList[opList.update]">
          <template slot-scope="scope">
            <el-button v-if="powerList[opList.delete]" size="small" type="text" @click="onDelete(scope.row)" style="color: #f05259">删除</el-button>
            <el-button v-if="powerList[opList.update]" size="small" type="text" @click="onUpdate(scope.row)" style="color: #f05259">修改</el-button>
          </template>
        </ws-table-column-el>
      </template>
    </ws-table-el>
    <!-- 弹窗 -->
    <el-dialog title="修改" :visible.sync="dialogShow">
      <el-form :model="form" :label-width="'120px'">
        <el-form-item label="车架号：">
          <el-input v-model="form.vehicleNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="中控IMEI：">
          <el-input v-model="form.imei" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'qualityTesting',
  components: {},
  computed: {
    ...mapState('workbench', ['checkStatusTypeFilters', 'dogcartOrgTypeFilters'])
  },
  data() {
    return {
      moduleName: '/dogcart/qualityTesting',
      dialogShow: false,
      searchOptions: {
        imei: '',
        vehicleNumber: '',
        uId: '',
        phone: '',
        createTimeEnd: '',
        createTimeStart: '',
        checkTimeStart: '',
        checkTimeEnd: '',
        stroeStatus: ''
      },
      tableConfig: {
        pageSizeList: [20, 50, 100],
        filterColumns: false,
        multi: true,
        lazyQuery: {
          moduleName: '/dogcart/qualityTesting',
          op: {
            selectList: 'selectPage',
            selectCount: 'selectCount'
          }
        }
      },
      form: {},
      opList: {
        batch: 'batchInsert',
        batchidList: 'batchidListInsert',
        delete: 'delete',
        update: 'update'
      },
      data: ''
    }
  },
  created() {},
  methods: {
    numberInput(value) {
      this.searchOptions.uId = value.replace(/[^\d]/g, '')
    },
    search() {
      this.$refs.table.search()
    },
    //重置
    reset() {
      this.searchOptions = this.$options.data().searchOptions
      this.search()
    },
    //入库操作
    async batchOperate(tag) {
      let params = {
        data: '',
        op: ''
      }
      if (tag) {
        // 一键入库
        await this.getData()
        params = {
          op: this.opList.batch
        }
      } else {
        // 批量入库
        let selectList=this.$refs.table.$refs.elTable.selection
        this.data = selectList.length
        if (
          selectList.some(item => {
            return item.stroeStatus === 1
          }) ||
          this.data === 0
        ) {
          this.$message.error('请选择未入库数据')
          return
        }

        params = {
          data: {
            idList: selectList.map(item => {
              return item.id
            })
          },
          op: this.opList.batchidList
        }
      }
      // 确认弹窗
      this.$confirm(`是否${tag ? '一键' : '批量'}入库，共${this.data || 0}条`, '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      })
        .then(() => {
          this.$axios(this.getUrl(params.op), params).then(res => {
            if (res.code === 1) {
              this.$message.success(`${tag ? '一键' : '批量'}入库成功`)
              this.$refs.table.$refs.elTable.clearSelection();
              this.search()
              
            } else {
              this.$message.error(res.msg)
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 查询未入库数量
    async getData() {
      let op = 'selectCount'
      let params = {
        data: {
          body: {
            stroeStatus: 0
          }
        },
        op
      }
      try {
        const res = await this.$axios(this.getUrl(params.op), params)
        if (res.code === 1) {
          this.data = res.data
        } else {
          this.$message.error(res.msg)
        }
      } catch (error) {
        console.log(error)
      }
    },
    //删除
    onDelete(row) {
      if (row.stroeStatus == 1) {
        this.$message.error('数据已入库，不支持删除')
        return
      }
      let params = {
        data: {
          id: row.id
        },
        op: this.opList.delete
      }
      this.$confirm(`确定删除该数据`, '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      })
        .then(() => {
          this.$axios(this.getUrl(params.op), params).then(res => {
            if (res.code === 1) {
              this.$message.success('删除成功')
              this.search()
            } else {
              this.$message.error(res.msg)
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    //更新
    onUpdate(row) {
      if (row.stroeStatus == 1) {
        this.$message.error('数据已入库，不支持修改')
        return
      }
      this.form = {
        id: row.id,
        imei: row.imei,
        vehicleNumber: row.vehicleNumber
      }
      this.dialogShow = true
    },
    //更新操作
    update() {
      let params = {
        data: {
          ...this.form
        },
        op: this.opList.update
      }
      this.$axios(this.getUrl(params.op), params)
        .then(res => {
          if (res.code === 1) {
            this.$message.success('更新成功')
          } else {
            this.$message.error(res.msg)
          }
          this.dialogShow = false
          this.search()
        })
        .catch(err => {
          console.log(err)
        })
    },
    getUrl(op) {
      return this.$getModuleUrl(this.moduleName, op)
    }
  }
}
</script>
<style lang="scss" scoped></style>
