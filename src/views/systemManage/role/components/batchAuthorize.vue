<template>
    <el-form ref='form' :model="formModel" label-width="120px" :rules="rules">
        <el-row>
            <!-- <el-col :span="8">
                <el-form-item label="角色层级：">
                    <el-select v-model="formModel.orgType" @change="onChangeOrgType"  style="width: 100%;">
                        <el-option v-for="(item, index) in roleLevelList" :key="index" :label="item.text" :value="item.code" clearable></el-option>
                    </el-select>
                </el-form-item>
            </el-col> -->
            <el-col :span="8">
                <el-form-item label="授权类型：">
                    <el-select v-model="formModel.type"  style="width: 100%;">
                        <el-option :value="1" label="批量增加"></el-option>
                        <el-option :value="2" label="批量删减"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="选择角色：" prop="roleIds">
                    <el-select v-model="formModel.roleIds" filterable multiple placeholder="请选择角色" style="width: 100%;" collapse-tags @change="onChangeRole">
                        <el-option v-for="(item, index) in roleList" :key="index" :value="item.roleId" :label="item.roleName"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
// 批量授权
import { getRoleLevelList } from '../data.js'

export default {
  name: 'batchAuthorize',
  data () {
    return {
      roleLevelList: getRoleLevelList(),
      formModel: {
        orgType: 0,
        type: 1,
        roleIds: []
      },

      rules: {
        roleIds: [
          { required: true, type: 'array', message: '请选择角色' }
        ]
      },

      roleList: [], // 已选择角色
      /**
       * 角色在切换时，如果已经缓存，则不调用
       */
      cacheRoleMap: {}
    }
  },

  created () {
    this.getRoleList()
  },

  methods: {
    /**
     * 查询角色列表
     */
    async getRoleList () {
      let orgType = this.formModel.orgType

      // 缓存
      if (this.cacheRoleMap[orgType]) {
        this.roleList = this.cacheRoleMap[orgType]
        return
      }

      try {
        const res = await this.$axios('/authority/role/select', {
          data: {
            orgType,
            personnelFlag: 1
          },
          op: 'getAllRoleByType'
        })

        let list = JSON.parse(res.data) || []

        this.roleList = list
        this.cacheRoleMap[orgType] = list
      } catch (error) {
      }
    },

    onChangeOrgType () {
      this.formModel.roleIds = []
      this.roleList = []

      // 通知父组件切换视图， 总部和分支机构显示显示的树不一样
      this.$emit('updateOrgType', this.formModel.orgType)

      this.getRoleList()
    },
    /**
     * 父组件刷新角色树
     */
    onChangeRole () {
      this.$emit('updateRole', this.formModel.roleIds)
    },

    checkForm () {
      let isOk = true

      this.$refs['form'].validate(valid => {
        isOk = valid
      })

      return isOk
    },
    /**
     * 通过ref 直接拿到所有参数
     */
    getFormModel () {
      if (!this.checkForm()) return

      return { ...this.formModel }
    }
  }
}
</script>
