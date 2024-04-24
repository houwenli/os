<template>
    <div v-loading='loading'>
        <div class="panel-container">
            <!-- 角色配置 -->
            <h3 class="title">角色配置</h3>
            <el-form disabled ref="modifyForm" label-width="120px" class="form-container">
                <!-- 角色名称 -->
                <el-row>
                    <el-col :span="6">
                        <el-form-item prop="name" label="角色名称：">
                            <el-input v-model.trim="modifyForm.name" :maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="6">
                        <el-form-item label="角色层级：">
                            <el-select v-model="modifyForm.orgType" :style="{ width: '100%' }">
                                <el-option v-for="item in roleLevelOptions" :label="item.text" :value="item.code" :key="item.code"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <!-- 角色简介 -->
                    <el-col :span="6">
                        <!-- 只要不是个人角色，就有角色描述 -->
                        <el-form-item v-if="modifyForm.roleClassify != 2" prop="roleDesc" label="角色描述：">
                            <el-input v-model.trim="modifyForm.roleDesc" :maxlength="80" />
                        </el-form-item>
                        <!-- 个人角色 -->
                        <el-form-item v-if="modifyForm.roleClassify == 2" label="所属人员：">
                            <el-input v-model.trim="modifyForm.createName" />
                        </el-form-item>
                    </el-col>
                    <!-- 角色类型 -->
                    <el-col :span="6">
                        <el-form-item prop="roleDesc" label="角色类型：">
                            <el-input :maxlength="30" :value="staticList[modifyForm.roleClassify] || '基础角色'" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" class="formItem">
                        <el-form-item label="角色时效：">
                            <el-select v-model="modifyForm.validType" style="width: 100%">
                                <el-option label="永久权限" :value="1"></el-option>
                                <el-option label="临时权限" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" class="formItem" v-if="modifyForm.validType == 2">
                        <el-form-item label="有效日期至：">
                            <el-date-picker v-model="modifyForm.validTimeStr" type="datetime" value-format="timestamp" clearable style="width: 100%"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <!-- 详情 -->
            <detailsTree :roleIds="roleIds" v-if="hasDetailData" :orgType="modifyForm.orgType" :roleType="modifyForm.roleType" />
            <!-- 修改记录 -->
            <updateRecord :modify-form="logModel" />
            <!-- 底部按钮 -->
            <ws-footer>
                <el-button @click="goBack">返回</el-button>
            </ws-footer>
        </div>
    </div>
</template>

<script>
import updateRecord from './components/updateRecord.vue';
// 详情组件
import detailsTree from './components/roleDetails.vue';

import { roleForbranchOptions, roleForHeadquartersOptions } from './data.js'

export default {
  name: 'RoleForm',
  components: {
    updateRecord,
    detailsTree,
  },
  data () {
    return {
      moduleName: '/systemManage/role',
      // 新增修改
      modifyForm: {
        // 批量新增的角色ids
        ids: [],
        id: '',
        name: '', //  角色名称
        roleDesc: '', //  角色描述
        role: [],
        orgType: '',
        // 批量增加，批量减少
        type: '',
        powerType: '1',
        time: '',
        validTimeStr: '',
        validType: 1,
        // 角色类型(1基本角色, 2个人角色，3职务角色，4通用角色)
        roleClassify: ''
      },

      // 日志参数
      logModel: {
        createTime: '',
        updateTime: '',
        createName: '',
        updateName: ''
      },

      roleIds: [], // 角色详情id

      hasDetailData: false,
      staticList: ['', '基础角色', '个人角色', '部门角色', '通用角色'],
      loading: true
    };
  },

  computed: {
    /**
     * 角色层级
     */
    roleLevelOptions () {
      if (!['', undefined, null].includes(this.modifyForm.orgType)) {
        const t = roleForbranchOptions.some(p => p.code === this.modifyForm.orgType)

        return t ? roleForbranchOptions : roleForHeadquartersOptions
      }

      return []
    }
  },
  created () {
    let { id } = this.$route.query

    if (id) {
      this.roleIds.push(id);
      this.getRoleDetailById(id)
    }
  },

  methods: {
    /**
     * 查询角色详情
     */
    async getRoleDetailById (id) {
      try {
        let res = await this.$axios('/authority/role/select', {
          data: {
            id
          },
          op: 'selectDetail',
        })

        let data = JSON.parse(res.data);

        Object.assign(this.modifyForm, { ...data })
        Object.assign(this.logModel, { ...data })

        this.modifyForm.validTimeStr = new Date(this.modifyForm.validTimeStr)
        // 保证详情数据返回再渲染子组件
        this.hasDetailData = true
      } catch (e) {

      } finally {
        this.loading = false
      }
    },

    // 返回
    goBack () {
      this.$router.push({ name: 'role' });
    },
    getModuleUrl (op) {
      return this.$getModuleUrl(this.moduleName, op);
    }
  }
};
</script>

<style scoped lang="scss">
.panel-container {
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 80px;
    background: #fff;
    min-height: calc(100vh - 140px);

    .title {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 700;
        color: #303133;
        margin-bottom: 16px;
    }

    .form-container {
        /deep/ .el-form-item__label {
            font-weight: 400;
        }
    }
}

</style>
