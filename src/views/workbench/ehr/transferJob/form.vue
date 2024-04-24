<template>
  <div>
    <div class="form-content">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="100px">
        <el-form-item v-if="!this.$route.query.id" label="员工姓名:" prop="userName" class="title-info">
          <el-input
            @focus="selectMember()"
            v-model="ruleForm.userName"
            :suffix-icon="ruleForm.userName ? '' : 'el-icon-user'"
            placeholder="请选择"
            class="chooseMan"
            @clear="handleClear"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-else label="员工姓名:" class="title-info">
          <el-input v-model.trim="ruleForm.userName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input :value="ruleForm.phone" disabled></el-input>
        </el-form-item>
        <el-form-item label="调整岗位：">
          <el-table
            :data="tableData"
            style="width: 100%"
            :border="true"
            :header-cell-style="{ background: '#F5F7FA', 'font-family': 'PingFangSC-Medium, PingFang SC', 'font-weight': '600', color: '#606266' }"
          >
            <el-table-column label="部门名称" prop="deptName">
              <template slot-scope="scope">
                <el-cascader
                  :props="optionProps"
                  filterable
                  collapse-tags
                  :disabled="!ruleForm.userName"
                  @clear="handleClear(scope.row)"
                  @change="changeDepartment($event, scope.row)"
                  :style="{ width: '80%' }"
                  v-model="scope.row.deptId"
                  :options="departmentList"
                  placeholder="请选择部门名称"
                  separator="-"
                  v-loading="loading"
                ></el-cascader>
              </template>
            </el-table-column>

            <el-table-column label="职务">
              <template slot-scope="scope">
                <el-select v-model="scope.row.positionId" placeholder="请选择职务" style="width: 80%" :disabled="!scope.row.deptId || scope.row.deptId.length == 0">
                  <el-option v-for="item in scope.row.jobList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item label="调岗原因：" prop="transferReason">
          <el-input type="textarea" show-word-limit v-model.trim="ruleForm.transferReason" :maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <div class="footer_btn">
        <el-button plain @click="back()">返 回</el-button>
        <ws-throttle>
          <el-button type="primary" @click="submit">确 定</el-button>
        </ws-throttle>
      </div>
      <tree-select
        :dialogVisible.sync="dialogVisible"
        title="添加人员"
        :expandOnClickNode="false"
        :moduleName="moduleName"
        :listModuleName="moduleName"
        :funcDefaultNode="[]"
        :maxCount.sync="treeSelectMaxCount"
        :opObj="{ selectTree: 'selectOrgTree', selectList: 'listByFuzzyNameNew' }"
        :funcRoleProps="{
          label: 'name',
          value: 'id',
          children: 'children',
          isLeaf: 'leaf',
          disabled: setTreeDisabled
        }"
        @visibleChanged="
          val => {
            treeSelectVisable = val
          }
        "
        @checkedNodeChange="getCheckedNodeList"
      ></tree-select>
    </div>
  </div>
</template>

<script>
import TreeSelect from '@/components/treeSelect/treeSelect'
export default {
  name: 'transferJobForm',
  components: {
    TreeSelect
  },
  data() {
    return {
      moduleName: '/workbench/ehr/transferJob',
      detailData: '',
      ruleForm: {
        userName: '',
        userId: '',
        phone: '',
        transferReason: '',
        userPositionAoList: []
      },
      rules: {
        userName: [{ required: true, message: '请输入员工姓名', trigger: ['blur', 'change'] }],
        transferReason: [{ required: false, message: '请输入调岗原因', trigger: 'blur' }]
      },
      // 部门及职务
      tableData: [
        {
          deptId: '', //部门
          positionId: '' //职务
        }
      ],
      optionProps: {
        value: 'id',
        label: 'name',
        children: 'child',
        checkStrictly: true,
        emitPath: false
      },
      loading: false,
      departmentList: [], //部门列表
      jobList: [], //职务列表
      dialogVisible: false,
      treeSelectMaxCount: 1
    }
  },
  created() {
    this.getDepartmentList()
  },
  methods: {
    //根据userId查询职务
    searchPositon(userId) {
      let params = {
        data: {
          userId
        },
        op: 'selectPosition'
      }
      let URL = this.powerList[params.op]
      this.$axios(URL, params).then(res => {
        let data = JSON.parse(res.data)
        let list = (data || []).map(item => {
          if (item.positionId) {
            item.positionId = item.positionId.toString()
          }
          return item
        })

        this.tableData = JSON.parse(JSON.stringify(list))

        // 兼容多个职务
        this.tableData.forEach(d => {
          d.positionId = Number(d.positionId)
          this.changeDepartment(d.deptId, d, true)
        })
      })
    },
    setTreeDisabled(node, data) {
      return !data.isLeaf
    },
    //选择人员
    getCheckedNodeList(val) {
      if (val.length) {
        this.funcDefaultNode = val
        let { name, id, phone } = val[0]
        this.ruleForm.userName = name
        this.ruleForm.userId = id
        this.ruleForm.phone = phone
        this.searchPositon(id)
      } else {
        this.handleClear()
      }
    },
    //清除人员
    handleClear() {
      this.funcDefaultNode = []
      this.ruleForm.userName = ''
      this.ruleForm.userId = ''
      this.ruleForm.phone = ''
      this.tableData = [
        {
          deptId: '',
          positionId: ''
        }
      ]
    },
    //选择人员弹框
    selectMember() {
      this.dialogVisible = true
    },
    // 获取所有部门
    getDepartmentList() {
      if (this.$route.query.type !== 'add') {
        this.loading = true
      }
      this.$axios(this.powerList.selectOrganizationalTreeAllDepartByType, {
        op: 'selectOrganizationalTreeAllDepartByType',
        data: JSON.stringify({ id: 0, type: 1 })
      })
        .then(res => {
          let data = JSON.parse(res.data)
          this.departmentList = data
        })
        .finally(() => {
          this.loading = false
        })
    },
    //根据部门查询职务
    changeDepartment(id, row, isInit = false) {
      // 修改部门时，清空对应的职务信息
      if (!isInit) {
        this.$set(row, 'jobList', [])
        this.$set(row, 'positionId', '')
      }
      if (id) {
        this.$axios(this.powerList.selectDepartmentpositionList, {
          op: 'selectDepartmentpositionList',
          data: JSON.stringify({ id })
        }).then(res => {
          let data = JSON.parse(res.data)
          this.$set(row, 'jobList', data)
        })
      }
    },
    handleSubmit() {
      const { deptId, positionId } = this.tableData[0]
      if (!deptId || !positionId) {
        this.$message.error('部门及职务不能为空！')
        return
      }
      // 删除手动添加的jobList属性
      let userPositionAoList = this.tableData.map(({ positionId, deptId }) => ({
        positionId,
        deptId
      }))
      let params = {
        data: {
          ...this.ruleForm,
          userPositionAoList
        },
        op: 'beginPositionTransfer'
      }
      let URL = this.powerList[params.op]
      this.$axios(URL, params).then(res => {
        if (res.code === 1) {
          this.$message.success('操作成功')
          this.$router.push({ name: 'transferJob' })
        }
      })
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.handleSubmit()
        }
      })
    },
    back() {
      this.$router.push({ name: 'transferJob' })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-content {
  width: 100%;
  min-height: calc(100% - 64px);
  background: #ffffff;
  margin-bottom: 64px;
  padding: 32px 40px;
  border-radius: 8px;
  /deep/.el-textarea .el-input__count {
    line-height: 20px;
  }
}
</style>
