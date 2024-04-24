<template>
  <div>
    <div class="page-container">
      <el-form label-width="120px" class="form-panel" ref="formModel" :model="formModel" :rules="rules" :disabled="Boolean(id)">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="模块名称：" prop="name">
              <el-input maxlength="20" v-model.trim="formModel.name" placeholder="请输入模块名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="!id">
            <div class="save-btn">
              <el-button type="primary" @click="onSave">保存</el-button>

              <div class="save-text-tips">* 提示:请先配置模块名称，再配置功能菜单</div>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <!-- 功能菜单 -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="功能菜单配置" name="menu"></el-tab-pane>
      </el-tabs>

      <!-- op基础配置-总部-分公司-服务中心-实体店 -->
      <div class="menu-list">
        <div class="menu-item" :class="{ 'menu-item-active': index === activeMenu }" v-for="(item, index) in tabOptions" @click="onChangeMenu(item, index)" :key="item.id">
          {{ item.name }}
        </div>
      </div>

      <functionConfig ref="functionBox" :id="id" :menus="menus" @update="onUpdate" :orgType="orgType" />

      <!-- 操作记录 -->
      <operateLog :info="editLogs" v-if="$route.query.type === 'detail'"></operateLog>
    </div>

    <ws-footer>
      <el-button @click="onBack">返回</el-button>
    </ws-footer>
  </div>
</template>

<script>
import functionConfig from '../components/functionConfig/index.vue' // 菜单配置
import operateLog from '@/views/technology/oaDeploy/components/operateLog.vue'

export default {
  name: 'edit',

  components: {
    functionConfig,
    operateLog
  },

  data() {
    const validName = (rule, value, callback) => {
      const reg =/^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/
      if(!reg.test(value)) {
        callback("请输入中文汉字")
        return
      }

      callback()
    }

    return {
      formModel: {
        name: ''
      },

      rules: {
        name: [
          {
            required: true,
            message: '请输入模块名称',
            trigger: ['change', 'blur']
          },
          {
            validator: validName,
            trigger: ['change', 'blur']
          }
        ]
      },

      activeName: 'menu',

      activeMenu: 0,

      moduleName: '/technology/systemInfo',

      menusList: [],

      // 当前选择的机构（默认 op基础配置）
      orgType: -1,
      tabOptions: [
        {
          id: -1,
          name: 'OP基础配置',
          module: '/oaDeploy/webSystem/org'
        },
        {
          id: 0,
          name: '总部',
          module: '/oaDeploy/webSystem/org'
        },
        {
          id: 20,
          name: '分公司',
          module: '/oaDeploy/webSystem/org'
        },
        {
          id: 30,
          name: '服务中心',
          module: '/oaDeploy/webSystem/org'
        },
        {
          id: 40,
          name: '实体店',
          module: '/oaDeploy/webSystem/org'
        }
      ],

      id: null,
      menus: [],

      editLogs: {
        createUserName: '',
        createTime: '',
        updateUserName: '',
        updateTime: ''
      }
    }
  },

  created() {
    let { id, type } = this.$route.query

    if (id) {
      this.id = id

      this.disabled = type === 'edit' ? false : true

      this.getDetail()
    }
  },

  methods: {
    /**
     * 切换机构
     */
    onChangeMenu(item, index) {
      this.activeMenu = index
      this.orgType = item.id

      if (!this.id) {
        return
      }

      this.getDetail()
    },

    /**
     * 查询系统详情
     */
    async getDetail() {
      let params = {
        data: {
          id: this.id,
          orgType: this.orgType
        },
        op: 'selectAppSystemDetail'
      }

      try {
        let url = this.$getModuleUrl(this.moduleName, 'selectAppSystemDetail')
        let res = await this.$axios(url, params)

        let data = JSON.parse(res.data)

        this.id = data.id
        this.formModel.name = data.name

        this.menus = data.menus || []

        Object.assign(this.editLogs, data)
      } catch (error) {}
    },

    onCheck() {
      let isOk = true

      this.$refs['formModel'].validate(valid => {
        isOk = valid
      })

      return isOk
    },

    async onSave() {
      let valid = this.onCheck()

      if (!valid) return

      let body = {
        data: this.formModel,
        op: 'saveAppSystem'
      }

      try {
        let url = this.$getModuleUrl(this.moduleName, 'saveAppSystem')
        let res = await this.$axios(url, body)

        const id = JSON.parse(res.data).id

        this.$router.replace({
          name: 'systemInfoH5Edit',
          query: {
            id,
            t: Date.now(),
            type: 'edit'
          }
        })
      } catch (error) {
        console.log(error)
      }
    },

    onBack() {
      this.$router.push({
        name: 'systemInfo'
      })
    },

    onUpdate() {
      this.getDetail()
    }
  }
}
</script>

<style lang="less" scoped>
.page-container {
  // height: 100%;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 64px;

  .form-panel {
    background: #f5f7fa;
    border: 1px solid #ebeef5;
    padding: 24px;
    padding-bottom: 2px;
    border-radius: 8px;
    margin-bottom: 16px;
  }
}

.menu-list {
  padding: 24px 0 12px;
  border-bottom: 2px solid #e4e7ed;
  display: flex;
  font-size: 14px;
  color: #606266;
  width: fit-content;
  margin-bottom: 16px;

  .menu-item {
    min-width: 64px;
    text-align: center;
    margin-right: 24px;
    cursor: pointer;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 2px;
      bottom: -14px;
      left: 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }

  .menu-item-active {
    color: #f05259;

    &::after {
      background: #f05259;
    }
  }
}

.save-btn {
  display: flex;
  align-items: center;
  .save-text-tips {
    margin-left: 16px;
    color: #f05259;
    font-size: 14px;
  }
}
</style>
