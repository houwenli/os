<template>
  <div class="permissionlist">
    <div class="form-content-wrap">
      <div class="panel">
        <div class="title">基础信息</div>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" :hide-required-asterisk="type === 'detail'">
          <el-row>
            <el-col :span="8">
              <el-form-item label="人员姓名:" prop="name">
                <el-input :maxlength="30" v-model.trim="form.name" :disabled="$route.query.type === 'detail'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机号码:" prop="phone">
                <el-input v-model.trim="form.phone" maxlength="11" :disabled="$route.query.type === 'detail'"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="工号:">
                <el-input :maxlength="30" v-model.trim="form.code" disabled></el-input>
              </el-form-item>
            </el-col> -->
            <!-- <el-col :span="8" v-if="$route.query.type === 'detail'">
              <el-form-item label="入职时间:">
                <el-date-picker style="width: 100%" v-model="form.entryDate" type="date" disabled></el-date-picker>
              </el-form-item>
            </el-col> -->
            <el-col :span="8" v-if="$route.query.type != 'add'">
              <el-form-item label="账号状态:">
                <el-select v-model="form.accountStatus" style="width: 100%" disabled>
                  <el-option label="启用" :value="1"></el-option>
                  <el-option label="停用" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="账号标签:">
                <el-select v-model="form.tag" style="width: 100%" disabled>
                  <el-option label="无" :value="1"></el-option>
                  <el-option label="停薪留职" :value="2"></el-option>
                  <el-option label="休长假" :value="3"></el-option>
                  <el-option label="试用" :value="4"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
          </el-row>
          <!-- <el-row v-if="type === 'detail'">
            <el-col :span="8">
              <el-form-item label="最后登录端口:">
                <el-input v-model="form.lastLoginPort" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最后登录时间:">
                <el-input v-model="form.lastLoginTime" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row> -->
        </el-form>
      </div>

      <div class="panel">
        <div class="section-header">
          <div class="title">部门及职务</div>
        </div>
        <el-table
          v-if="$route.query.type === 'add'"
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
                @clear="handleClear(scope.row)"
                @change="changeDepartment($event, scope.row)"
                :style="{ width: '80%' }"
                v-model="scope.row.deptId"
                :options="departmentList"
                placeholder="请选择部门名称"
                separator="-"
                v-loading="detailLoading"
              ></el-cascader>
            </template>
          </el-table-column>

          <el-table-column label="职务">
            <template slot-scope="scope">
              <el-select v-model="scope.row.positionId" placeholder="请选择职务" style="width: 80%" :disabled="!scope.row.deptId || scope.row.deptId.length == 0" :loading="loading">
                <el-option v-for="item in scope.row.jobList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </template>
          </el-table-column>

          <!-- <el-table-column label="是否兼任">
            <template slot-scope="scope">
              <el-select disabled v-model="scope.row.partTime" placeholder="请选择是否兼任" style="width: 80%">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="2"></el-option>
              </el-select>
            </template>
          </el-table-column> -->
        </el-table>

        <el-table
          v-else
          :data="tableData"
          style="width: 100%"
          :border="true"
          :header-cell-style="{ background: '#F5F7FA', 'font-family': 'PingFangSC-Medium, PingFang SC', 'font-weight': '600', color: '#606266' }"
        >
          <el-table-column label="部门名称" prop="deptName"></el-table-column>
          <el-table-column label="职务" prop="positionName"></el-table-column>
        </el-table>
      </div>

      <div class="panel">
        <div class="title">
          <span>角色配置</span>
        </div>
        <!-- <div class="role-list">
                    <el-button class='role-item' size='mini' :type='activeOrgIndex === index ? "danger": ""' v-for='(item, index) in orgTypeList' :key='index' @click='onChangeOrg(index, item)'>{{item.text}}</el-button>
                  </div> -->
        <!-- 编辑状态 -->
        <el-form :rules="rules" label-width="100px" :disabled="disabled" v-if="type !== 'detail'">
          <el-row>
            <el-col :span="8">
              <el-form-item label="选择角色:">
                <!-- :class="[isShowClose, 'role-select']" -->
                <el-select ref="roleSelect" style="width: 100%" collapse-tags v-model="roleIds" multiple placeholder="请选择角色" clearable filterable value-key="id" @change="onSelectOrg">
                  <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <!-- 详情展示为tag -->
        <div v-else class="tag-list-container" v-show="allRoleList[activeOrgIndex] && allRoleList[activeOrgIndex].length">
          <el-tag
            v-for="(tag, index) in allRoleList[activeOrgIndex]"
            :key="index"
            effect="plain"
            :type="activeRoleTag === index ? 'danger' : 'info'"
            class="tag-item"
            @click="onSelectRole(tag, index)"
          >
            {{ tag.name }}
          </el-tag>
        </div>
      </div>

      <div class="panel">
        <div class="title">权限明细</div>
        <permissions-tree deptType="0" v-if="(flag && type != 'add') || type == 'add'" :roleIds="roleIds"></permissions-tree>
      </div>

      <div class="panel" v-if="type !== 'add'">
        <div class="title">修改记录</div>
        <div style="display: flex; justify-content: center">
          <update-list :tableData="updateData" :tableStyle="{ width: '100%', marginRight: '16px' }"></update-list>
          <update-list :tableData="updateData2" :tableStyle="{ width: '100%' }"></update-list>
        </div>
      </div>
    </div>
    <ws-footer>
      <el-button @click="goBack">{{ type === 'detail' ? '返回' : '取消' }}</el-button>
      <el-button v-if="type !== 'detail'" type="primary" @click="onSubmit">保存</el-button>
    </ws-footer>
  </div>
</template>

<script>
//修改人信息组件
import updateList from '../../../components/TableList'
//角色权限树组件
import PermissionsTree from './components/permissionsTree.vue'
import { getOrgTypeList, getPersonnelRules } from './data.js'

export default {
  name: 'addPersonnel',
  components: { updateList, PermissionsTree },
  data() {
    return {
      //表单验证规则
      rules: getPersonnelRules(),
      // 部门及职务
      tableData: [
        {
          positionId: '', //职务select的value
          partTime: 2, //是否兼任select框的value
          deptId: '' //部门名称select框的value
        }
      ],

      //form表单数据
      form: {
        name: '', //人员姓名
        phone: '', //手机号码
        code: '', //工号
        entryDate: '', //入职日期
        accountStatus: '', //账号状态
        employPositionAoList: [], //部门职务兼任
        roleIds: [], //查询所有角色
        tag: '',
        lastLoginPort: '',
        lastLoginTime: ''
      },
      loading: false,
      //修改信息数据
      updateData: [
        { label: '创建人', value: '' },
        { label: '创建时间', value: '' }
      ],
      updateData2: [
        { label: '修改人', value: '' },
        { label: '修改时间', value: '' }
      ],
      //角色select框
      roleOptions: [],
      // 组织为key, 结果为List
      roleMap: {},
      moduleName: '/systemManage/personnel',

      // 当前组织对应的ids
      roleIds: [],
      // 禁用得角色
      disableRoleList: [],
      flag: false, //根据角色查询角色树

      disabled: false,
      // 帐号id
      id: null,
      // 组织列表
      orgTypeList: [],

      activeOrgIndex: 0,
      // 用户选择的角色，二维数组
      roleListVo: [],
      // 编辑， 详情，新增
      type: '',

      // 详情可以直接使用
      allRoleList: [],
      // 角色tag高亮
      activeRoleTag: 0,
      // 组织tag上一次的index
      prevOrgIndex: 0,
      prevRoleIndex: 0,
      routeQuery: this.$route.query,
      optionProps: {
        value: 'id',
        label: 'name',
        children: 'child',
        checkStrictly: true,
        emitPath: false
      },
      departmentList: [], //部门列表
      jobList: [], //职务列表
      detailLoading: false
    }
  },
  created() {
    let { type, id } = this.$route.query

    this.disabled = type === 'detail'
    this.id = id
    this.type = type

    if (id) {
      this.getDetail()
      type === 'edit' && this.getDepartmentList()
    } else {
      this.getRoleList()
      this.getDepartmentList()
      this.getRoleValue(0)
    }
  },
  methods: {
    getModuleUrl(op) {
      return this.$getModuleUrl(this.moduleName, op)
    },

    checkForm() {
      let isOk = true

      this.$refs['form'].validate(valid => {
        isOk = valid
      })

      return isOk
    },

    //保存
    async onSubmit() {
      if (!this.checkForm()) return

      const { deptId, positionId } = this.tableData[0]
      if (!deptId || !positionId) {
        this.$message.error('部门及职务不能为空！')
        return
      }
      // if (!this.roleIds.length) {
      //   this.$message.error('请选择角色！')
      //   return
      // }
      // 删除手动添加的jobList属性
      let userPositionAoList = this.tableData.map(({ positionId, partTime, deptId }) => ({
        positionId,
        partTime,
        deptId
      }))
      let data = {
        phone: this.form.phone,
        name: this.form.name,
        roleIds: this.roleListVo.flat(),
        userPositionAoList,
        id: this.id
      }

      let op = {
        add: 'saveUser',
        edit: 'updateUserRole'
      }[this.type]

      try {
        // const URL=this.getModuleUrl(op)
        const URL = this.type === 'add' ? '/authority/employ/save' : '/authority/employ/update'
        await this.$axios(URL, {
          data: JSON.stringify(data),
          op
        })

        //页面跳转
        this.$message.success({ add: '新增成功', edit: '修改成功' }[this.type])
        this.$router.push({ name: 'personnel' })
      } catch (e) {}
    },
    //点击返回
    goBack() {
      this.$router.push({ name: 'personnel' })
    },
    //点击新增
    addPersonnel() {
      let tabledataStatus = this.tableData.every(item => {
        return item.deptId && item.partTime && item.positionId
      })
      if (this.tableData.length > 0 && !tabledataStatus) {
        this.$message.error('请将上一栏信息填充完整再添加')
      } else {
        let list = {
          positionId: '', //职务select的value
          partTime: '2', //是否兼任select框的value
          deptId: '' //部门名称select框的value
        }
        this.tableData.push(list)
      }
    },
    //删除table
    deleteRow(index) {
      this.tableData.splice(index, 1)
    },
    // 获取所有部门
    getDepartmentList() {
      if (this.routeQuery.type !== 'add') {
        this.detailLoading = true
      }
      this.$axios('/authority/Organizational/select', {
        op: 'selectOrganizationalTreeAllDepartByType',
        data: JSON.stringify({ id: 0, type: 1 })
      }).then(res => {
        let data = JSON.parse(res.data)
        this.departmentList = data
        this.detailLoading = false
      })
    },

    //获取所有角色列表
    getRoleList() {
      this.$axios('/authority/role/select', {
        op: 'getRoleAll',
        data: {}
      }).then(res => {
        let data = JSON.parse(res.data)
        this.roleOptions = (data || []).map(item => {
          return { id: item.roleId, name: item.roleName }
        })
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
        this.$axios('/authority/Organizational/select', {
          op: 'selectDepartmentpositionList',
          data: JSON.stringify({ id })
        }).then(res => {
          let data = JSON.parse(res.data)
          this.$set(row, 'jobList', data)
        })
      }
    },

    /**
     * 根据组织id，查询角色列表
     */
    async getRoleValue(orgType) {
      if (this.roleMap[orgType]) {
        this.roleOptions = this.roleMap[orgType]
        return
      }

      try {
        let res = await this.$axios('/authority/role/select', {
          op: 'getRoleByType',
          data: {
            orgType,
            personnelFlag: 2
          }
        })

        let data = JSON.parse(res.data) || []
        this.roleOptions = data.map(item => {
          return { ...item, disabled: item.canModify == 2 }
        })
        this.roleMap[orgType] = data
      } catch (error) {}
    },

    //获取详情
    async getDetail() {
      // 编辑状态的详情，返回的角色Ids 是不包含个人角色的
      // 详情op 是包含的，可展示， 其他没区别
      let op = this.type === 'detail' ? 'selectEmployDetail' : 'selectEmployEditDetail'
      let data = {
        data: JSON.stringify({ id: this.id }),
        op
      }

      try {
        let res = await this.$axios('/authority/employ/select', data)

        let detailData = JSON.parse(res.data)
        this.form = detailData
        let { disableRoleList, createUser, createTime, updateUser, updateTime, employPositionList } = detailData
        let orgTypeList = detailData.orgTypeList || []

        // 所有用户角色
        let roleListVo = detailData.roleListVo || []

        this.allRoleList = roleListVo

        let roleListIds = roleListVo.map(p => {
          return p.map(k => k.id)
        })

        // roleListVo(二维数组) 和 orgTypeList 是一一对应的, orgTypeList的第几个元素，就是 roleListVo 第几个数组
        // 用户已选择的角色
        if (this.type === 'detail') {
          // 详情状态，查看权限明细，默认只看第一个组织对应的第一个角色
          this.roleIds = [roleListIds[0][0]]
        } else {
          this.roleIds = roleListIds[0]
        }

        this.activeOrgIndex = 0

        this.roleListVo = roleListIds
        this.disableRoleList = disableRoleList

        this.getRoleValue(orgTypeList[0])

        this.updateData[0].value = createUser
        this.updateData[1].value = createTime
        this.updateData2[0].value = updateUser
        this.updateData2[1].value = updateTime

        let list = (employPositionList || []).map(item => {
          if (item.positionId) {
            item.isEdit = false
            item.positionId = item.positionId.toString()
          }
          return item
        })

        this.orgTypeList = getOrgTypeList(orgTypeList)

        this.tableData = JSON.parse(JSON.stringify(list))

        // 兼容多个职务
        this.tableData.forEach(d => {
          d.positionId = Number(d.positionId)
          this.changeDepartment(d.deptId, d, true)
        })
        this.flag = true
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 切换组织，获取角色列表
     */
    onChangeOrg(index, item) {
      if (this.prevOrgIndex === index) return

      this.activeOrgIndex = index
      this.activeRoleTag = 0
      this.prevOrgIndex = index
      this.prevRoleIndex = 0

      if (this.type === 'detail') {
        // 可能组织下面并没有角色
        let roleId = this.roleListVo[index][0]
        this.roleIds = roleId !== undefined ? [roleId] : []
      } else {
        this.roleIds = this.roleListVo[index]
      }

      this.getRoleValue(item.code)
    },

    /**
     * 选择组织
     */
    onSelectOrg(ids) {
      this.roleListVo[this.activeOrgIndex] = ids
    },
    /**
     * 选择角色
     */
    onSelectRole(item, index) {
      if (this.prevRoleIndex === index) return

      this.prevRoleIndex = index

      this.activeRoleTag = index

      this.roleIds = [item.id]
    }
  }
}
</script>

<style lang="scss" scoped>
.permissionlist {
  height: 100%;
  width: 100%;
  .form-content-wrap {
    width: 100%;
    background: #ffffff;
    padding: 24px 40px;
    border-radius: 8px;
    margin-bottom: 64px;
  }
  .isPost {
    display: inline-block;
    padding: 2px 4px;
    background: #fdf6ec;
    border-radius: 4px;
    color: #e6a23c;
  }

  .role-select {
    /deep/.el-tag__close {
      display: none;
    }
  }
}

.panel {
  margin-bottom: 32px;
  .title {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
    margin-bottom: 16px;
  }
}
.role-list {
  display: flex;
  margin: 16px 0;
}

.role-item {
  min-width: 80px;
}

.tag-list-container {
  max-height: 96px;
  border: 1px solid #ccc;
  padding: 10px 8px;
  border-radius: 8px;
  overflow-y: auto;
}
.tag-item {
  margin-right: 8px;
  margin-bottom: 8px;
  cursor: pointer;
}

/deep/ .el-loading-mask {
  .el-loading-spinner {
    top: 30%;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .addButton {
    margin-bottom: 16px;
  }
}
</style>
