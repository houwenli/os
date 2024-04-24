<template>
  <div class="settle_payCompang_form">
    <el-card class="mainForm">
      <el-form class="sys_name_form" ref="sysNameForm" label-width="120px" v-if="Object.keys($route.query).length > 0">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item required message="请输入展示优先级" label="系统名称：">
              <el-input maxlength="20" v-model.trim="sysName" placeholder="请输入系统名称" :disabled="pageType === 'detail'"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item required message="请输入系统编码" label="系统编码：">
              <el-input @input="sysCodeChange" maxlength="20" v-model.trim="sysCode" placeholder="请输入系统编码" :disabled="sysNameDisb"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="sysType != 3">
            <el-form-item label="激活路由：">
              <el-input v-model.trim="activeMenu" placeholder="请输入激活路由" :disabled="pageType === 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="sysType != 3">
            <el-form-item label="端口号：">
              <el-input maxlength="20" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" v-model.trim="port" placeholder="请输入端口号" :disabled="pageType === 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="sysType != 3 && pageType !== 'detail'">
            <ws-enter-event>
              <el-button type="primary" @click="save">保存</el-button>
            </ws-enter-event>
          </el-col>
        </el-row>
      </el-form>

      <el-radio-group v-if="orgTypeShow" class="system_type" v-model="sysOrgType">
        <el-radio-button v-for="item in btnList" :key="item.resourcesUrl" :label="item.resourcesUrl">{{ item.resourcesName }}</el-radio-button>
      </el-radio-group>

      <el-tabs v-model="activeName" type="card" v-if="sysType != 3 && sysOrgType == 'webSystem'">
        <el-tab-pane label="功能菜单配置" name="menu"></el-tab-pane>
        <el-tab-pane label="基础配置" name="dispose"></el-tab-pane>
      </el-tabs>

      <div v-show="activeName == 'menu' || sysOrgType == 'appSystem'">
        <!-- 机构类型选择 -->
        <ul v-if="sysType != 3" class="ws_tab">
          <li v-for="item in tabOptions" @click="orgType = item.id" :class="{ is_active: item.id === orgType }" :key="item.id">{{ item.name }}</li>
        </ul>
        <component
          ref="webSystem"
          :is="sysOrgType"
          :sysType="sysType"
          :orgType="orgType"
          :sysName="sysName"
          :sysCode="sysCode"
          @editLog="obj => (editLogs = obj)"
          :moduleName="moduleName"
          :activeMenu="activeMenu"
          :port="port"
        />
      </div>

      <div v-show="activeName == 'dispose'">
        <!-- 基础配置 -->
        <systemForm
          class="systemForm"
          ref="systemForm"
          v-bind="$attrs"
          @pageInit="
            id => {
              getBasicInfo(id), (sysIds = id)
            }
          "
          :moduleName="moduleName"
          :basicsOptions="basicsList"
          :systemInfo="{ ...systemList, orgType }"
          :isOperation="isOperation"
          :sysName="sysName"
          :sysCode="sysCode"
          :sysType="sysType"
        ></systemForm>
      </div>

      <!-- 操作记录 -->
      <operateLog :info="editLogs" v-if="$route.query.type !== 'add'"></operateLog>
    </el-card>
    <ws-footer v-if="sysOrgType != 'appSystem'">
      <el-button @click="onBack">返 回</el-button>
    </ws-footer>
  </div>
</template>

<script>
// web端系统
import webSystem from './webSystem.vue'
// 实体店app
import appSystem from './appSystem.vue'
// 系统表单
import systemForm from './components/systemForm.vue'
// 操作日志
import operateLog from './components/operateLog.vue'

export default {
  name: 'systemInfoForm',
  components: { webSystem, appSystem, systemForm, operateLog },
  data() {
    return {
      btnList: [],
      sysOrgType: '',
      orgType: 0,
      orgTypeShow: false,
      addSys: false,
      sysName: '',
      sysNameDisb: true,
      editLogs: {},
      sysCode: '',
      sysType: '',
      activeName: 'menu',
      basicsList: [], //基础信息
      systemList: {},
      isOperation: false,
      sysIds: '', //新增系统后Id
      activeMenu: '',
      port: '',
      pageType: this.$route.query.type,

      id: ''
    }
  },
  watch: {
    '$route.query': {
      handler(val) {
        let { type, sysType, id } = val || {}
        this.sysType = sysType
        !type && (this.orgTypeShow = true)
        ;(type == 'add' || type == 'edit') && (this.sysNameDisb = false)
        //基础信息是否可编辑
        if (type != 'detail') {
          this.isOperation = true
        }

        if (type == 'add') {
          this.$nextTick(() => {
            // 基础信息解除禁用
            this.$refs.systemForm.isDisabled = false
          })
        }

        //获取基础信息
        if (type == 'edit' || type == 'detail') {
          this.getBasicInfo(id)
        } else {
          this.getBasicInfo()
        }
      },
      deep: true,
      immediate: true
    },
    defaultMenuOptions: {
      deep: true,
      immediate: true,
      handler: function (newV) {
        if (this.sysType * 1 === 3) {
          // 小程序OP管理
          this.sysOrgType = 'webSystem'
        } else {
          // 筛选出 web + app选项数据 web + app OP管理
          let list = ((newV || {}).menuList || []).map(item => {
            let name = item.resourcesUrl.indexOf('/') > -1 ? item.resourcesUrl.split('/')[1] : item.resourcesUrl
            return { ...item, resourcesUrl: name }
          })

          this.btnList = list
          this.sysOrgType = this.$judgeType(this.btnList[0], {}).resourcesUrl
        }
      }
    }
  },
  computed: {
    tabOptions() {
      let orgList = []
      if (this.btnList.length > 0) {
        // 筛选机构类型 【0-总部 20-分公司 30-服务中心 40-实体店】
        let btnInfo = this.btnList.filter(item => item.resourcesUrl === this.sysOrgType)[0]
        orgList = this.$judgeType(btnInfo.children, []).map(item => {
          let moduleInfo = item.resourcesUrl.split('&')

          return { id: moduleInfo[1] * 1, name: item.resourcesName, module: moduleInfo[0] }
        })
        this.orgType = ((orgList || [])[0] || {}).id
      }
      return orgList
    },

    moduleName() {
      let moduleName = ''
      if (this.$route.name === 'appletDetail') {
        // 小程序op 模块名称
        moduleName = '/technology/appletDetail'
      } else {
        // web / app 模块名称
        let data = (this.btnList.filter(item => item.resourcesUrl === this.sysOrgType)[0] || {}).children || []
        moduleName = (data.filter(item => item.resourcesUrl === `/${this.$route.name}/${this.sysOrgType}/org&${this.orgType}`)[0] || {}).resourcesUrl
      }
      return moduleName
    }
  },
  mounted() {
    let id = this.$route.query.id

    if (id !== undefined) {
      this.id = id
    }
  },

  methods: {
    onBack() {
      this.$router.push({
        path: '/technology/systemInfo'
      })
    },
    sysCodeChange(e) {
      this.sysCode = e.replace(/[^a-zA-Z]/g, '').toUpperCase()
    },
    // 保存系统信息
    async save() {
      try {
        // 类型为新添加/编辑系统，并且没有输入系统名称
        let operationType = this.$route.query.type
        if (['add', 'edit'].includes(operationType)) {
          if (!this.sysName || !this.sysCode) {
            this.$message.error(!this.sysName ? '请输入系统名称' : '请输入系统编码')
            return
          }
        }
        let op = this.id ? 'updateSystem' : 'saveSystem'
        let url = this.id ? '/authority/systemInfo/update' : '/authority/systemInfo/save'
        let param = {
          name: this.sysName,
          sysCode: this.sysCode,
          id: this.id || null,
          op,
          port: this.port,
          activeMenu: this.activeMenu
        }
        let res = await this._axios(param, this.moduleName, url)
        if (res.code == 1) {
          this.$message.success('保存成功!')
          this.sysNameDisb = true

          if (!this.id) {
            // 新增
            this.$router.replace({
              path: '/technology/systemDetail',
              query: {
                type: 'edit',
                id: res.data.id,
                sysType: 1,
                t: Date.now()
              }
            })
            return
          }

          //保存新系统id
          // this.sysIds = res.data.id
          // this.systemList.id = res.data.id
          // this.id = res.data.id
          this.$nextTick(() => {
            this.$refs.webSystem.setSysId(res.data.id)
            this.$refs.webSystem.queryOasystem(res.data.id)
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取基本信息
    async getBasicInfo(id) {
      try {
        // id 列表携带系统id || sysIds新增保存服务返回系统id || oa系统不携带参数默认查询oa系统
        if (!id && !this.sysIds && Object.keys(this.$route.query).length > 0) return
        let param = {
          id: id || this.sysIds,
          op: 'selectMainSystemBasicFunctions'
        }

        let res = await this._axios(param, '', '/authority/systemInfo/select')

        if (res.code == 1) {
          let data = res.data
          this.basicsList = data
          this.sysIds = data.id
          this.systemList = {
            id: data.id || id,
            name: data.name
          }
        }
      } catch (error) {
        throw _err
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-tabs__header {
  margin: 18px 0 24px;
}
/deep/ .el-form-item__error {
  padding-top: 2px;
}

// 机构类型选择 样式
.ws_tab {
  padding: 24px 0 12px;
  border-bottom: 2px solid #e4e7ed;
  display: flex;
  font-size: 14px;
  color: #606266;
  width: fit-content;

  li {
    // width: 64px;
    min-width: 64px;
    text-align: center;
    margin-right: 24px;
    cursor: pointer;
    position: relative;
  }

  li::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: -14px;
    left: 0;
  }

  li:last-child {
    margin-right: 0;
  }

  li:hover {
    color: #f05259;
  }

  .is_active {
    color: #f05259;
  }

  .is_active:after {
    background: #f05259;
  }
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 32px 0 16px;
  font-size: 16px;
  font-weight: 600;
}

/deep/ .system_type {
  display: table;
  margin: 0 auto;
}

.mainForm {
  padding: 24px 40px;
  border-radius: 8px;
  margin-bottom: 56px;
  min-height: calc(100% - 56px);

  .sys_name_form {
    padding: 24px 24px 0;
    background: #f5f7fa;
    border-radius: 8px;
    border: 1px solid #ebeef5;
    .el-input {
      width: 100%;
    }
  }
}

/deep/ .el-radio-button__inner {
  width: 124px;
  padding: 12px 16px;
  background: #f0f2f5;
}
/deep/ .el-card__body {
  padding: 0;
}
/deep/ .el-table {
  border-radius: 8px;
}
.systemForm {
  /deep/ .is-scrolling-none {
    max-height: 400px;
    overflow: auto;
  }
  /deep/ .el-table {
    margin-top: 24px;
  }
  /deep/ .title {
    margin: 0;
  }
}
</style>
