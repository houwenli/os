<template>
    <div>
        <!-- 权限申请 -->
        <el-card class="cardBox">
            <div class="content-style" v-if="flowId === '27'">
                <el-tabs class="tab-wrap" v-model="activeTab" @tab-click="setPowerType">
                    <el-tab-pane v-for="item in tabList" :label="item.resourcesName" :key="item.id" :name="item.id"></el-tab-pane>
                </el-tabs>
            </div>
            <el-row>
                <!-- 账号信息 -->
                <h3 class="roleFunHeader">权限信息</h3>
                <el-form ref="modifyForm" :model="powerApply" :rules="rules" label-width="82px">
                    <div v-if="activeTab === '1'">
                        <el-form-item label-width="0">
                            <el-radio-group v-model="powerApply.type" @change="onChangeDept">
                                <!-- oa6.9新增的 -->
                                <el-radio :label="3">按部门授权</el-radio>
                                <!-- 这是之前OA6.4的 -->
                                <el-radio :label="2">按职务授权</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>

                    <el-row :gutter="24">
                        <el-col :span="6" v-if="activeTab == 1 && flowId === '27'">
                            <el-form-item label="使用部门：" prop="deptId" v-if="powerApply.type === 2" key="dept2">
                                <el-cascader
                                    clearable
                                    filterable
                                    collapse-tags
                                    @change="getPositionData"
                                    :options="roleIdList"
                                    v-model="powerApply.deptId"
                                    placeholder="请选择部门名称"
                                    separator="-"
                                    :props="optionProps"
                                    style="width: 100%"
                                />
                            </el-form-item>

                            <el-form-item label="使用部门：" prop="deptIds" v-if="powerApply.type === 3" key="dept3">
                                <el-cascader
                                    clearable
                                    filterable
                                    collapse-tags
                                    :options="roleIdList"
                                    v-model="powerApply.deptIds"
                                    placeholder="请选择部门名称"
                                    separator="-"
                                    :props="optionProps"
                                    style="width: 100%"
                                ></el-cascader>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6" v-if="powerApply.type === 2 && flowId === '27'">
                            <el-form-item label="使用职务：" prop="positionIds" key="positionIds">
                                <el-select v-model="powerApply.positionIds" placeholder="请选择" style="width: 100%" multiple collapse-tags @change="onChangePosition">
                                    <el-option v-for="item in positionList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!-- 权限类型 -->
                        <el-col :span="6">
                            <el-form-item label="权限时效：" key="powerType">
                                <el-select v-model="powerApply.powerType" placeholder="请选择" style="width: 100%">
                                    <el-option label="永久权限" value="1"></el-option>
                                    <el-option label="临时权限" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!-- 有效时间 -->
                        <el-col :span="6" v-if="this.powerApply.powerType === '2'">
                            <el-form-item label="有效日期至：" prop="time" label-width="110px">
                                <el-date-picker
                                    v-model="powerApply.time"
                                    type="datetime"
                                    :picker-options="pickerOptions"
                                    placeholder="选择有效日期"
                                    value-format="timestamp"
                                    clearable
                                    style="width: 100%"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>

                        <!-- 分支机构才显示 -->
                        <el-col :span="6" v-if="flowId == '23'">
                            <el-form-item label="功能授权：">
                                <el-select v-model="powerApply.orgType" :disabled="disableFeatureAuth" placeholder="请选择" style="width: 100%">
                                    <el-option v-for="item in funcOption" :label="item.label" :value="item.id" :key="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row v-if="powerApply.type === 2 && positionSelectList.length > 0">
                        <h3 class="roleFunHeader">
                            <div>角色配置</div>
                        </h3>
                        <el-tag class="positionTag" v-for="tag in positionSelectList" :key="tag.id" :closable="false" type="info">
                            {{ tag.roleName }}
                        </el-tag>
                    </el-row>

                    <!-- 总部授权 -->
                    <el-row style="margin-bottom: 32px" v-if="flowId === '27'">
                        <!-- 功能授权 -->
                        <menuTree ref="menuRef" :defaultData="headquartersTree"></menuTree>

                        <!-- 只有总部才会有机构授权，城市授权， 其他的角色层级是没有的 -->
                        <template v-if="currenRoleOrgType === 0">
                            <!-- 机构授权 -->
                            <orgTree ref="orgRef" :detailData="orgTreeData"></orgTree>

                            <!-- 城市权限 -->
                            <cityTree ref="cityRef" :list="cityIds"></cityTree>
                        </template>
                    </el-row>

                    <!-- 分支机构授权 -->
                    <el-row style="margin-bottom: 32px" v-if="flowId === '23'">
                        <branchMenu ref="branchMenuRef" v-if="powerApply.orgType !== ''" :orgType="powerApply.orgType" />
                    </el-row>

                    <el-row>
                        <h3 class="applyReason">申请原因</h3>
                        <div>
                            <el-form-item label="申请原因：" prop="textarea">
                                <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 4, maxRows: 6 }"
                                    show-word-limit
                                    placeholder="请输入申请原因，不超过1000字"
                                    :maxlength="1000"
                                    v-model="powerApply.textarea"
                                    style="width: 100%"
                                ></el-input>
                            </el-form-item>
                        </div>
                    </el-row>
                </el-form>
            </el-row>

            <!-- 审核流程 -->
            <audit-process ref="auditProcess" title="审核流程" :actions="actions" :query="{ nameCode: $route.query.id }"></audit-process>
        </el-card>

        <!-- 按钮 -->
        <ws-footer>
            <el-button class="buttons" @click="onBack">返回</el-button>
            <ws-throttle>
                <el-button class="buttons" :loading="btnLoading" v-if="getSubmitPermission" type="primary" @click="save">提交审核</el-button>
            </ws-throttle>
        </ws-footer>

        <!-- 流程提示 -->
        <el-dialog custom-class="successDialog" title="" @close="tipsDialog = false" :visible.sync="tipsDialog" width="35%" append-to-body center>
            <div class="dialogBox">
                <div class="dialogIcon"><i class="el-icon-warning successIcon"></i></div>
                <div>
                    您有
                    <i class="num">1</i>
                    条权限申请正在审核中，请审批流程完结后再提交申请！
                </div>
            </div>
            <span slot="footer">
                <el-button type="primary" @click="tipsDialog = false">好 的</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import AuditProcess from '@/components/AuditProcess'

import _ from 'lodash-es'
import { getRules } from './data.js'
// 总部权限申请-城市权限勾选
import cityTree from './components/cityTree.vue'
// 总部权限申请-机构授权
import orgTree from './components/orgTree.vue'
// 总部权限申请-功能授权
import menuTree from './components/menuTree.vue'

// 分支机构
import branchMenu from './components/branchMenu.vue'
import dayjs from 'dayjs'

export default {
  name: 'powerApply',
  components: {
    AuditProcess,
    cityTree,
    orgTree,
    menuTree,

    branchMenu
  },
  data () {
    return {
      tipsDialog: false,
      // 列表搜索
      powerApply: {
        powerType: '2',
        time: new Date(),
        textarea: '',
        orgType: '',
        hierarchy: '1',
        // 按照职务授权
        deptId: '',

        // 按照部门-传参:eg: '122,222,333'
        deptIds: [],
        positionIds: [],

        // 权限申请类型(1 个人权限;  2_职务权限;   3部门权限)
        type: 3
      },
      actions: {
        moduleName: '/index/todo',
        op: 'flowNode'
      },
      // 表单验证
      rules: getRules.call(this),
      btnLoading: false, // 按钮 loading
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      // 总部还是分支机构， 默认总部
      orgType: 'headquartersRole',
      funcOption: [
        { label: '一级机构', id: 20 },
        { label: '二级机构', id: 30 },
        { label: '实体店', id: 40 }
      ],
      activeTab: '',
      // 使用部门-List
      roleIdList: [],
      // 使用职务-List
      positionList: [],

      userEnterTime: '',

      tabList: [],

      positionSelectList: [],

      // 是否有正在审核中的数据
      inReview: true,
      // 27-总部权限申请；23-分支结构权限申请
      flowId: null,

      // 重新提交场景 - 查询详情的Id
      procInsId: null,

      moduleName: '',

      // 详情-做数据回填
      headquartersTree: {
        web: [],
        app: [],
        applet: []
      },

      cityIds: [],

      orgTreeData: {
        // 全选的Ids
        orgIds: [],
        orgHalfIds: []
      },

      // 重新提交场景-查询详情-url中传入的参数
      roleId: ''
    }
  },
  watch: {
    // 全局的 mixin里面的 main\src\utils\permission.js
    defaultMenuOptions: {
      deep: true,
      immediate: true,
      handler: function (newV) {
        let tabList = newV?.menuList.filter(item => item.resourcesUrl && item.category === 1)
        this.tabList = tabList.map(item => {
          return { ...item, id: (item.resourcesUrl || '').split('&')[1] }
        })
      }
    }
  },
  computed: {
    // 是否禁用功能授权
    disableFeatureAuth () {
      let roleOption = this.$baseMethod.getStore('roleOption')
      if (roleOption.deptType == 2 && this.flowId === '23') {
        return true
      }
    },

    /**
     * 没有权限或者有正在审核中的单子，都不让提交审核
     */
    getSubmitPermission () {
      return this.powerList.personPermissionApply && !this.inReview
    },

    optionProps () {
      return {
        lazy: true,
        value: 'id',
        label: 'name',
        children: 'child',
        checkStrictly: true,
        lazyLoad: this.getDeptData,
        leaf: 'isLeaf',
        emitPath: false,
        expandTrigger: 'hover',
        // 按照部门授权-多选；按职务授权-单选
        multiple: this.powerApply.type === 3
      }
    },

    /**
     * 当前角色的orgType, 决定是否展示数据权限
     */
    currenRoleOrgType () {
      let roleOption = sessionStorage.getItem('roleOption')

      roleOption = JSON.parse(roleOption)
      return roleOption.orgType
    }
  },
  created () {
    this.flowId = String(this.$route.query.id)
    this.procInsId = this.$route.query.procInsId
    this.roleId = this.$route.query.roleId

    this.getModuleName()

    this.queryProcess()

    let roleOption = this.$baseMethod.getStore('roleOption')

    // 总部申请
    if (this.flowId === '27') {
      this.powerApply.orgType = roleOption.orgType
    } else {
      //分支机构申请 orgType默认20 depType == 2取账号
      if (roleOption.deptType == 2) {
        this.powerApply.orgType = roleOption.orgType
      } else {
        this.powerApply.orgType = 20
      }
    }

    if (this.procInsId) {
      this.getDetail()
    }
  },

  methods: {
    /**
     * 查询进行中的审批流数据
     */
    async queryProcess () {
      const roleType = this.flowId === '27' ? 1 : 2

      let params = {
        op: 'personPermissionCheck',
        data: {
          roleType
        }
      }

      try {
        const url = this.getModuleUrl(params.op)

        if (!url) {
          this.$message({
            message: '查询正在审批中数据无权限',
            duration: 6000,
            type: 'error'
          })
          return
        }
        let res = await this.$axios(url, params)
        if (res.code !== 1) {
          this.tipsDialog = true

          this.inReview = true
        } else {
          this.inReview = false
        }
      } catch (error) {
        if (error.code !== 1) {
          this.tipsDialog = true
          this.inReview = true
        }
      }
    },

    getModuleUrl (op) {
      return this.$getModuleUrl(this.moduleName, op)
    },

    /**
     * 表单校验
     */
    checkForm () {
      let isOk = true

      this.$refs['modifyForm'].validate(valid => {
        isOk = valid
      })

      if (!this.checkedApprovaForm()) {
        this.$message.error('还有审批人没选择，请补充完整!')
        isOk = false
      }

      return isOk
    },

    /**
     * 获取总部权限申请 数据
     *
     * 个人和部门下面的数据结构是一样的
     */
    headquartersApplyData () {
      let { powerType, time, positionIds } = this.powerApply

      time = dayjs(time).format('YYYY-MM-DD HH:mm:ss')

      // app总部的菜单
      let { web, app, applet } = this.$refs['menuRef'].getTreeNodes()

      let orgList = this.$refs['orgRef']?.getTreeNodes() || { all: [] }
      // 城市
      let cityIdList = this.$refs['cityRef']?.getTreeNodes() || { all: [] }

      let nodeFormJson = {
        powerType,
        // 权限实效为临时权限才有时间
        time: powerType === '2' ? time : null,
        textarea: this.powerApply.textarea
      }

      let data = {
        // 权限申请的类型编码
        nameCode: this.$route.query.id,
        // 流程id
        procDefId: this.$refs.auditProcess.procdefId,
        // 审核信息
        approvalInfo: this.createdApprovalInfo(),
        // 节点信息(json字符串)
        nodeFormJson: JSON.stringify(nodeFormJson),

        userAuthPerm: {
          menuIds: web.all,
          appMenuIds: app.all,
          miniMenuIds: applet.all,
          // 机构id(全国-99,否则时部分数据) - 不包含半选节点id
          orgList: orgList.all,
          // 城市id(全国-99,否则时部分数据) - 不包含半选节点id
          cityIdList: cityIdList.all,
          // 权限申请类型(1_个人权限;2_职务权限;3_部门权限)
          type: this.powerApply.type,
          // deptId: this.powerApply.deptId,

          // 权限类型(1_总部权限,2_分支机构)
          roleType: 1,
          // 总部
          orgType: this.powerApply.orgType
        },
        flag: true
      }

      if (this.powerApply.powerType === '2') {
        // 有效期(永久权限不传)
        data.userAuthPerm.validTime = time
      }

      if (this.powerApply.type === 2) {
        // 职务权限时提交
        data.userAuthPerm.deptId = this.powerApply.deptId
        data.userAuthPerm.positionIds = positionIds.join(',')
        data.userAuthPerm.deptIds = null
      } else {
        data.userAuthPerm.deptId = null
        data.userAuthPerm.deptIds = this.powerApply.deptIds.join(',')
        data.userAuthPerm.positionIds = null
      }

      let valid = true

      // 一个权限都没勾
      if (web.all.length === 0 && app.all.length === 0 && applet.all.length === 0) {
        this.$message.error('请勾选功能权限')

        return {
          data,
          valid: false
        }
      }

      // 总部才需要判断，总区大区，没有数据权限
      if (this.currenRoleOrgType === 0 && orgList.all.length === 0) {
        this.$message.error('请勾选机构权限')
        return {
          data,
          valid: false
        }
      }

      if (this.currenRoleOrgType === 0 && cityIdList.all.length === 0) {
        this.$message.error('请勾选城市权限')
        return {
          data,
          valid: false
        }
      }

      return {
        data,
        valid
      }
    },

    /**
     * 获取分支机构权限申请数据
     */
    getBranchApplyData () {
      let { powerType, time, orgType } = this.powerApply

      time = dayjs(time).format('YYYY-MM-DD HH:mm:ss')

      // app总部的菜单
      let { web, app } = this.$refs['branchMenuRef'].getTreeNodes()

      let nodeFormJson = {
        powerType,
        // 权限实效为临时权限才有时间
        time: powerType === '2' ? time : null,
        textarea: this.powerApply.textarea
      }

      let data = {
        // 权限申请的类型编码
        nameCode: this.$route.query.id,
        // 流程id
        procDefId: this.$refs.auditProcess.procdefId,
        // 审核信息
        approvalInfo: this.createdApprovalInfo(),
        // 节点信息(json字符串)
        nodeFormJson: JSON.stringify(nodeFormJson),

        userAuthPerm: {
          menuIds: web.all,
          appMenuIds: app.all,
          // 功能授权-其实就是角色层级
          orgType,
          // 权限类型(1_总部权限,2_分支机构)
          roleType: 2
        },
        flag: true
      }

      if (this.powerApply.powerType === '2') {
        // 有效期(永久权限不传)
        data.userAuthPerm.validTime = time
      }

      let valid = true

      if (web.all.length === 0) {
        this.$message.error('请勾选web端OA总部功能权限')
        valid = false
      }

      return {
        data,
        valid
      }
    },

    // 保存
    async save () {
      if (!this.checkForm()) return

      let result
      if (this.flowId === '27') {
        result = this.headquartersApplyData()
      } else {
        result = this.getBranchApplyData()
      }

      if (!result.valid) return
      console.log(result.data)

      this.btnLoading = true

      try {
        console.log('校验通过')

        let res = await this.$axios(this.getModuleUrl('personPermissionApply'), {
          op: 'personPermissionApply',
          data: result.data
        })

        if (res.code == 1) {
          if (res.msg === '001') {
            //接口响应正常  msg返回001 提示审批流变更
            this.$confirm('当前审批配置的工作流规则有更新。确认后，流程区将按新工作流刷新节点。', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.$refs.auditProcess.getFlowable()
              })
              .catch(() => { })
          } else {
            this.$router.replace({ path: '/applySuccess' })
          }
        }
      } catch (error) {
      } finally {
        this.btnLoading = false
      }
    },
    checkedApprovaForm () {
      let allList = this.$refs.auditProcess.allList
      const arr = allList.filter(item => {
        return item.memberType == 3 || item.memberType == 4
      })
      return arr.every(item => {
        return item.userInfos.length > 0
      })
    },
    createdApprovalInfo () {
      let allList = this.$refs.auditProcess.allList
      return allList.map((items, i) => {
        return {
          nodeKey: items.nodeKey,
          userIds: items.userInfos
            .filter((item, j) => {
              return item.id && !item.isDefUser
            })
            .map(item => {
              return item.id
            })
        }
      })
    },
    /**
     * 获取使用部门List
     */
    getDeptData (node, resolve) {
      let data = {}

      if (node.level !== 0) {
        data.id = node.data.id

        // 说明没有子节点了
        if (node.data.isLeaf) {
          resolve([])
          return
        }
      }

      let selectedIds = this.powerApply.deptIds.concat([])
      this.$axios(this.getModuleUrl('getUserDeptTreeLazy'), {
        op: 'getUserDeptTreeLazy',
        data: data
      })
        .then(res => {
          let list = JSON.parse(res.data) || []
          list.forEach(p => {
            delete p.children
            return p
          })
          resolve(list)

          // 多选的场景下，需要对数据做回显操作
          if (this.powerApply.type === 3) {
            setTimeout(() => {
              this.powerApply.deptIds = selectedIds
            }, 100)
          }
        })
        .catch(error => {
          console.log('获取部门树失败', error)
          resolve && resolve([])
        })
    },

    /**
     * 使用部门
     */
    async getPositionData () {
      this.powerApply.positionIds = []

      if (!this.powerApply.deptId) {
        this.positionList = []
        return false
      }

      try {
        let res = await this.$axios(this.getModuleUrl('getUserDeptPositions'), {
          op: 'getUserDeptPositions',
          data: {
            deptId: this.powerApply.deptId
          }
        })
        if (res.code == 1) {
          this.positionList = JSON.parse(res.data)
        }
      } catch (e) { }
    },

    onBack () {
      this.$router.replace({
        name: 'index'
      })
    },

    getModuleName () {
      let m = null

      // 首页-总部权限申请
      if (this.flowId === '27') {
        let resourcesUrl = (this.tabList[0] || {}).resourcesUrl
        this.activeTab = (resourcesUrl || '').split('&')[1]

        this.setPowerType()
        m = resourcesUrl
      } else {
        // powerApplyBranchRole 系统管理 角色权限管理 / 首页 分支机构权限申请
        m = '/powerApplyBranchRole'
      }

      this.moduleName = m
    },

    setPowerType () {
      // 部门权限申请
      if (this.activeTab === '1') {
        this.powerApply.type = 3
      } else {
        // 个人权限申请
        this.powerApply.type = 1
      }
    },

    onUpdateTree (key, obj) {
      this.treeSelectKey[key] = obj.all
    },
    onChangeDept () {
      this.powerApply.deptId = ''
      this.powerApply.deptIds = []
    },

    onChangePosition (list) {
      if (list.length === 0) {
        this.positionSelectList = []
        return
      }

      this.positionSelectList = this.positionList.filter(p => list.includes(p.id))
    },

    /**
     * 重新提交的场景-做数据回显
     */
    async getDetail () {
      // 这里的接口是 权限申请详情的
      let opt = {
        procinstId: this.procInsId,
        op: 'flowDetail'
      }

      try {
        let applyDetailResult = await this._axios(opt, '', '/new/flowable/form/select')

        let result = applyDetailResult.data

        result.nodeFormJson = JSON.parse(result.nodeFormJson)

        // 这里不走权限授权
        let res = await this._axios({
          op: 'repeatDetail',
          id: Number(result.nodeFormJson.roleId)
        }, "", "/authority/permissionApply/select")

        let data = res.data

        this.setDetail(data, result)
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 详情数据回显
     */
    setDetail (data, applyDetail) {
      // 个人权限申请
      if (applyDetail.nodeFormJson.type === 1) {
        this.activeTab = '2'
      }

      if (applyDetail.nodeFormJson.type === 2) {
      }

      this.powerApply.powerType = applyDetail.nodeFormJson.time ? '2' : '1'
      if (applyDetail.nodeFormJson.time) {
        this.powerApply.time = new Date(applyDetail.nodeFormJson.time).getTime()
      }
      this.powerApply.textarea = applyDetail.nodeFormJson.textarea

      if (data.orgType === 0) {
        this.powerApply.type = applyDetail.nodeFormJson.type

        this.headquartersTree = {
          web: data.menuIds || [],
          app: data.appMenuIds || [],
          applet: data.miniProgramMenuIds || []
        }

        this.orgTreeData = {
          // 全选的Ids
          orgIds: data.orgIds || [],
          orgHalfIds: data.orgHalfIds || []
        }

        this.cityIds = data.cityIds || []
      }
    }
  }
}
</script>

<style scoped lang="scss">
.content-style {
    padding: 0px 40px !important;
    background-color: #fff;
    margin-bottom: 24px;

    .tab-wrap {
        ::v-deep > .el-tabs__header {
            display: flex;
            justify-content: center;
            margin-bottom: 0;

            .el-tabs__nav-wrap {
                background-color: #f5f7fa;
                border-radius: 4px 0px 0px 4px;

                .el-tabs__active-bar {
                    width: 0 !important;
                }

                &::after {
                    width: 0;
                }
            }

            .el-tabs__item {
                width: 124px;
                height: 40px;
                text-align: center;
                color: #606266;
                padding: 0;

                &.is-active {
                    background-color: #f05259;
                    color: #fff;
                    opacity: 1;
                }

                &.is-top:last-child {
                    border-radius: 0px 4px 4px 0px !important;
                }
            }
        }

        ::v-deep .el-tabs__nav-wrap {
            display: inline-block;
            border-radius: 4px 4px 4px 4px !important;
        }
    }
}

.cardBox {
    padding: 4px 20px 0 20px;
    margin-bottom: 64px;
    box-shadow: none;

    /deep/ .treeBox {
        border-bottom: 1px solid #dcdfe6;

        .treeHeader {
            height: 62px;
            line-height: 62px;

            .collapseBtn {
                margin-left: 20px;
                font-size: 16px;
                padding: 0;
                line-height: 62px;
            }
        }
    }

    .applyReason {
        height: 38px;
        font-size: 16px;
        font-weight: bold;
    }

    .el-collapse-item__header,
    /deep/ .roleFunHeader {
        width: 80px;
        height: 28px;
        font-size: 16px;
        font-weight: bold;
        color: #303133;
        margin-bottom: 16px;
    }

    /deep/ .el-form-item__label {
        font-weight: 400 !important;
        padding: 0;
    }

    /deep/ .el-tree-node__label {
        height: 36px !important;
        font-size: 14px !important;
        line-height: 36px !important;
    }

    /deep/ .el-tree-node__content {
        height: 36px !important;
        font-size: 14px !important;
        line-height: 36px !important;
    }

    /deep/ .currency-apply-audit {
        margin-top: 14px;
        padding: 0 !important;
    }
}

/deep/ .el-loading-mask {
    z-index: 2066;
}

.el-button--primary:hover {
    background: #ffa4a4 !important;
    border-color: #ffa4a4 !important;
    color: #fff !important;
}

.dialogBox {
    text-align: center;
    margin-bottom: 10px;

    .num {
        font-style: normal;
        color: #f05259;
    }

    .dialogIcon {
        text-align: center;
        margin-bottom: 18px;

        .successIcon {
            width: 50px;
            height: 50px;
            font-size: 50px;
            color: #e6a23c;
        }
    }

    .titile {
        font-size: 20px;
        font-weight: 500;
        color: #303133;
        margin-bottom: 20px;
    }
}
.positionTag {
    margin-right: 20px;
    margin-bottom: 22px;
}
</style>
