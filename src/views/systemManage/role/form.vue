<template>
<div>
    <div class="panel-container">
        <!-- 角色配置 -->
        <h3 class="title">角色配置</h3>
        <el-form ref="modifyForm" :model="modifyForm" label-width="120px" :rules="rules" class="form-container">
            <!-- 角色名称 -->
            <el-row v-if="routerType.type !== 'batchCopy'">
                <el-col :span="6">
                    <el-form-item prop="name" label="角色名称：">
                        <el-input v-model.trim="modifyForm.name" placeholder="请输入角色名称" :disabled="this.routerType.type == 'roleDetails'" :maxlength="30" />
                    </el-form-item>
                </el-col>
                <!-- <el-col
                    :span="6"
                >
                    <el-form-item label="角色层级：">
                        <el-select
                            :disabled="this.routerType.type == 'roleDetails' || this.routerType.type == 'update'"
                            v-model="modifyForm.orgType"
                             @change="orgTypeChange"
                            :style="{ width: '100%' }"
                        >
                            <el-option v-for="item in roleLevelOptions" :label="item.text" :value="item.code" :key="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col> -->
                <!-- 角色简介 -->
                <el-col :span="6">
                    <el-form-item v-if="$route.query.roleType != 2" prop="roleDesc" label="角色描述：">
                        <el-input
                            v-model.trim="modifyForm.roleDesc"
                            :placeholder="this.routerType.type == 'roleDetails' ? '' : '请输入角色描述'"
                            :disabled="this.routerType.type == 'roleDetails'"
                            :maxlength="80"
                        />
                    </el-form-item>
                    <el-form-item v-if="routerType.roleType == 2" label="所属人员：">
                        <el-input v-model.trim="modifyForm.createName" disabled />
                    </el-form-item>
                </el-col>
                <!-- 角色类型 -->
                <el-col
                  v-if="this.routerType.type != 'branchRole' && this.routerType.type != 'headquartersRole'"
                    :span="6"
                >
                    <el-form-item prop="roleDesc" label="角色类型：">
                        <el-input disabled :maxlength="30" :value="staticList[$route.query.roleType] || '基础角色'" />
                    </el-form-item>
                </el-col>
                <el-col :span="6" class="formItem">
                    <el-form-item label="角色时效：">
                        <el-select v-model="modifyForm.validType" placeholder="请选择" style="width: 100%" :disabled="this.routerType.type === 'roleDetails' || this.routerType.type === 'update'">
                            <el-option label="永久权限" :value="1"></el-option>
                            <el-option label="临时权限" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" class="formItem" v-if="modifyForm.validType == 2">
                    <el-form-item label="有效日期至：">
                        <el-date-picker v-model="modifyForm.validTimeStr" type="datetime"
                            :picker-options="pickerOptions" placeholder="选择有效日期" value-format="timestamp"
                            clearable style="width: 100%" :disabled="this.routerType.type == 'roleDetails'"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 批量授权/选择角色 -->
            <batchAuthorize ref='batchAuthorize' v-if="routerType.type === 'batchCopy'" @updateOrgType='updateOrgType' @updateRole='updateRole'></batchAuthorize>
        </el-form>

        <!-- 权限配置 -->
        <template v-if="routerType.type !== 'roleDetails'">
          <component
            v-if="visible"
            :is="dynamicComponentName"
            ref="tree"
            :key='updateKey'
          />
        </template>

        <!-- 修改记录 -->
        <updateRecord v-if='modifyForm.id' :modify-form="logModel" />

        <!-- 底部按钮 -->
        <ws-footer>
            <el-button @click="goBack" :loading="btnLoading">返回</el-button>
            <el-button  v-if="this.routerType.type !== 'roleDetails'" type="primary" @click="onCheck" :loading="btnLoading">保存</el-button>
        </ws-footer>
    </div>
    </div>
</template>

<script>
import updateRecord from './components/updateRecord.vue';
// 总部
import headquartersRole from './components/headquartersRole.vue';
// 分支机构
import branchRole from './components/branchRole.vue';
// 批量授权-角色配置
import batchAuthorize from './components/batchAuthorize.vue'
import { Loading } from 'element-ui'
import { getRoleAddRules, roleForbranchOptions, roleForHeadquartersOptions } from './data.js'

export default {
    name: 'RoleForm',
    components: {
        updateRecord,
        headquartersRole,
        branchRole,
        batchAuthorize
    },
    data() {
        return {
            complaint: 'funcTree',
            moduleName: '/systemManage/role',
            // 新增修改
            modifyForm: {
                // 批量新增的角色ids
                ids: [],
                id: '',
                name: '', //  角色名称
                roleDesc: '', //  角色描述
                role: [],
                roleIds: [],
                orgType: '',
                // 批量增加，批量减少
                type: '',
                powerType:'1',
                time:'',
                validTimeStr:'',
                validType: 1
            },

            // 日志参数
            logModel: {
              createTime: '',
              updateTime: '',
              createName: '',
              updateName: ''
            },
            // 表单验证
            rules: getRoleAddRules(),
            routerType: '',
            dep: [], // 已选择角色

            btnLoading: false, // 保存按钮 loading

            roleIds: [], // 角色详情id

            // 角色id
            roleId: null,


            visible: false,
            // 动态组件，在切换，做强制刷新
            updateKey: 1,
            // 动态组件
            dynamicComponentName: '',
            staticList:['','基础角色','个人角色','部门角色','通用角色'],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                },
            }
        };
    },

    computed: {
      /**
       * 角色层级
       */
      roleLevelOptions() {
        // 角色类型统一以接口返回为主，之前都是url遍地传，字段又被覆写
        if(!['', undefined, null].includes(this.modifyForm.orgType)) {
          const t = roleForbranchOptions.some(p => p.code === this.modifyForm.orgType)

          return t ? roleForbranchOptions : roleForHeadquartersOptions
        }

        return []
      }
    },
    created() {
        let {id} = this.$route.query
        this.routerType = this.$route.query;
        // 角色id
        this.roleId = id
        this.getDynamicComponentName()
    },
    mounted() {
      let type = this.$route.query.type
        if (this.roleId) {
          // 详情，修改，复制
          this.roleIds.push(this.routerType.id);
          this.getRoleDetailById()
        } else {
          // 新建总部， 新建分支机构，批量授权

          if (type === 'branchRole') {
            this.$store.state.role.orgType = 20
            this.modifyForm.orgType = 20
          } else if(type === 'headquartersRole' || type === 'batchCopy') {
            // 总部或者批量授权
            this.$store.state.role.orgType = 0
            this.modifyForm.orgType = 0
          }
          this.visible = true
        }
    },
    beforeDestroy() {
      // 清空Vuex 避免脏数据
      this.$store.commit('reset')
    },
    methods: {
      /**
       * 获取动态组件名
       */
      getDynamicComponentName() {
        let {type,orgType} = this.$route.query
            // 批量授权,新建类型为 总部

            if(type === 'batchCopy' || type === 'headquartersRole') {
              this.dynamicComponentName = 'headquartersRole'
              return
            }

            if (type === 'branchRole'){
               this.dynamicComponentName ='branchRole'
               return
            }


            // 编辑，详情，复制
            if (orgType !== undefined) {
             this.dynamicComponentName = orgType.toString() === '1' ? 'headquartersRole' : 'branchRole'
            }
      },
      /**
       * 查询角色详情
       */
      async getRoleDetailById() {
        let loadingInstance = Loading.service({target: '.panel-container', fullscreen: false, customClass: 'role-load-mask'});
         try {
            let res = await this.$axios('/authority/role/select', {
                data: {
                  id: this.roleId
                },
                op: 'selectDetail',
            })

            let data = JSON.parse(res.data);

            Object.assign(this.modifyForm, {...data})
            Object.assign( this.logModel, {...data})
            if(this.routerType.type === 'copyAndCreate') {
              this.modifyForm.validTimeStr = ''
              this.modifyForm.validType = 1
            } else {
              this.modifyForm.validTimeStr = new Date(this.modifyForm.validTimeStr)
            }
            // 以下数据都存储到vuex中
            this.$store.state.role.orgType = data.orgType
            this.$store.state.role.webDefaultKeys = data.menuIds || []
            this.$store.state.role.appDefaultKeys = data.appMenuIds || []

            // 机构数据
            // orgAllCheckId-全选
            this.$store.state.role.orgDefaultKeys = data.orgAllCheckId || []
            // orgHalfCheckId 半选
            this.$store.state.role.orgDefaultExpandedKeys = data.orgHalfCheckId || []

            this.$store.state.role.cityDefaultKeys = data.cityIdList || []
            this.$store.state.role.appletDefaultKeys = data.miniMenuIds || []
            // this.updateKey = Date.now()
            this.visible = true
         } catch (e) {

         } finally {
            loadingInstance.close()
         }
      },

      /**
       * 功能授权
       */
      orgTypeChange(e) {
          // 更新vuex中 orgType
          this.$store.state.role.orgType = e

          if (this.routerType.type === 'batchCopy') {
              this.modifyForm.role = [];
              let data = {
                  orgType: e,
              };
              this.roleFunc(data);
          }
      },

        // 返回
        goBack() {
            this.$router.push({ name: 'role' });
        },

        checkForm() {
          let isOk = true
          this.$refs['modifyForm'].validate(valid => {
            isOk = valid
          })

          return isOk
        },

        onCheck() {
           let type = this.$route.query.type

            if(type === 'batchCopy') {
              // 批量授权
              let batchAuthorizeFormValid = this.$refs['batchAuthorize'].checkForm()

              if (batchAuthorizeFormValid) {
                 this.onBatchUpdateRoles()
              }
            } else {
              if(this.checkForm()) {
                this.newUpdate()
              }
            }

        },
        /**
         * 批量更新角色
         */
        async onBatchUpdateRoles() {
          let api = this.getModuleUrl('updateRoles')
          let data = this.getBatchCopyRole()
          let loadingInstance = Loading.service({target: '.panel-container', fullscreen: false, customClass: 'role-load-mask'});

          try {
            await this.$axios(api, {
              op: 'updateRoles',
              data
            })

            this.$message.success(`批量授权角色成功`)
            this.btnLoading = false
            this.$router.push({ name: 'role' })
          } catch (error) {
          } finally {
            loadingInstance.close()
          }
        },

        // 角色新增 修改
        async newUpdate() {
          let loadingInstance = Loading.service({target: '.panel-container', fullscreen: false, customClass: 'role-load-mask'});

          try {
              let type = this.routerType.type;

              let params;
              switch (type) {
                  // 分支机构
                  case 'branchRole':
                      params = {
                          op: 'save',
                          data: this.getBranchRole(),
                      };
                      break;
                  // 总部角色
                  case 'headquartersRole':
                      params = {
                          op: 'save',
                          data: this.gatHeadquartersRole(),
                      };
                      break;
                  // 编辑场景
                  case 'update':
                      params = {
                          op: 'update',
                          data: this.routerType.orgType == 1 ? this.gatHeadquartersRole() : this.getBranchRole(),
                      };

                      params.data.id = this.routerType.id;
                      break;
                  // 复制新建
                  case 'copyAndCreate':
                      params = {
                          op: 'save',
                          data: this.routerType.orgType == 1 ? this.gatHeadquartersRole() : this.getBranchRole(),
                      };
                      break;
              }
              //处理角色时效

              if(this.modifyForm.validType == 2) {
                if(this.modifyForm.validTimeStr) {
                  params.data.validTimeStr = this.$baseMethod.formatData(this.modifyForm.validTimeStr, 'yyyy-MM-dd hh:mm:ss')
                } else {
                  return this.$message.error('请填写临时角色的有效期！')
                }
              }
              if(params.op === 'update') {
                params.data.validType = this.modifyForm.validType
              }

              let res = await this.$axios(this.getModuleUrl(params.op), {
                  op: params.op,
                  data: JSON.stringify(params.data),
              });
              const msgObj = {
                  save: '新增',
                  update: '更新',
                  copyAndCreate: '复制',
                  batchCopy: '批量授权',
              };

              if (res.code != 1) return;
              this.$message.success(`${msgObj[params.op]}角色成功`);
              this.btnLoading = false;
              this.$router.push({ name: 'role' });
          } catch (error) {
            console.log(error)
              this.btnLoading = false;
          } finally {
            loadingInstance.close()
          }
        },

        // 批量授权数据
        getBatchCopyRole() {
            let roleConfigData =  this.$refs['batchAuthorize'].getFormModel()

            let menuIds = []
            let appMenuIds = []
            let miniMenuIds = []
            let orgList = []
            let cityIdList = []

            let params = {
              type: roleConfigData.type,
              orgType: roleConfigData.orgType,
              roleIds: roleConfigData.roleIds
            };

            // 获取总部的数据
            if ([0,4,5].includes(params.orgType)) {
                let headquartersRoleData = this.gatHeadquartersRole();

                menuIds = headquartersRoleData.menuIds || []
                appMenuIds = headquartersRoleData.appMenuIds || []
                miniMenuIds = headquartersRoleData.miniMenuIds || []
                orgList = headquartersRoleData.orgList || []
                cityIdList = headquartersRoleData.cityIdList || []

            } else {
              // 获取分支机构的数据
                let branchRoleData = this.getBranchRole()
                menuIds = branchRoleData.menuIds || []
                appMenuIds = branchRoleData.appMenuIds || []
                miniMenuIds = branchRoleData.miniMenuIds || []
            }

            Object.assign(params, {
              menuIds,
              appMenuIds,
              miniMenuIds,
              orgList,
              cityIdList
            })

            return params;
        },

        /**
         * 获取分支机构的数据
         */
        getBranchRole() {
            const webOAPowerIds = this.$refs.tree.getTreeKeys('webOAPowerTreeRef');
            const webOAPowerHalfIds = this.$refs.tree.getHalfTreeKeys('webOAPowerTreeRef');
            const wsFuPowerIds = this.$refs.tree.getTreeKeys('wsFuPowerTreeRef');
            const wsFuPowerHalfIds = this.$refs.tree.getHalfTreeKeys('wsFuPowerTreeRef');
            let { name, roleDesc, orgType } = this.modifyForm;
            let params = {
                name,
                roleDesc,
                roleType: 2,
                orgType,
                menuIds: [...webOAPowerIds, ...webOAPowerHalfIds],
                appMenuIds: [...wsFuPowerIds, ...wsFuPowerHalfIds],
            };
            return params;
        },
        /**
         * 获取总部数据
         */
        gatHeadquartersRole() {
            try {
              const webPowerIds = this.$refs.tree.getTreeKeys('webPowerTreeRef');
              const webPowerHalfIds = this.$refs.tree.getHalfTreeKeys('webPowerTreeRef');
              const appletHalfIds = this.$refs.tree.getHalfTreeKeys('appletPowerTreeRef');
              const appletIds = this.$refs.tree.getTreeKeys('appletPowerTreeRef');
              const appMenuIds = this.$refs.tree.getTreeKeys('appPowerTreeRef');
              const appMenuHalfIds = this.$refs.tree.getHalfTreeKeys('appPowerTreeRef');

              let cityIdList = []
              let orgList = []

              // 角色层级为总部
              if (this.modifyForm.orgType === 0) {
                cityIdList = this.$refs.tree.getTreeKeys('cityTreeRef');
                orgList = this.$refs.tree.orgGetTreeKeys('orgTreeRef');

                // 判断机构和城市是否选择全国的tab
                let cityActiveTab = this.$refs.tree.cityActiveTab
                let orgActiveTab = this.$refs.tree.orgActiveTab

                if (cityActiveTab === '1') {
                  cityIdList = [-99]
                }

                if (orgActiveTab === '1') {
                  orgList = [-99]
                }
              }

              let { name, roleDesc, orgType } = this.modifyForm;
              let data = {
                  name,
                  roleDesc,
                  roleType: 1,
                  orgType,
                  menuIds: [...webPowerIds, ...webPowerHalfIds],
                  appMenuIds: [...appMenuIds, ...appMenuHalfIds],
                  miniMenuIds: [...appletHalfIds, ...appletIds],
                  orgList,
                  cityIdList,
              };
              return data;
            } catch (error) {
              console.log('总部数据收集-报错', gatHeadquartersRole)
            }
        },
        // 机构数据过滤
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },

        // 批量 获取角色信息
        roleFunc(data = { orgType: 0 }) {
            this.$axios('/authority/role/select', {
                data,
                op: 'selectOptions',
            }).then(res => {
                this.dep = JSON.parse(res.data) || []
            }).catch(() => {})
        },

        /**
         * 批量更新场景-更新角色层级，下面的功能授权动态切换
         */
        updateOrgType(orgType) {
          this.$store.state.role.orgType = orgType

          this.modifyForm.orgType = orgType

          if ([0, 4,5].includes(orgType)) {
            // 总部,总区，大区， 都是总部类
            this.dynamicComponentName = 'headquartersRole';

            // 大区，总部，总区，切换问题
            this.$refs.tree.hierarchyChange = orgType
          } else {
              // 分支机构
            this.dynamicComponentName = 'branchRole';

            this.updateKey = Date.now()
          }
        },

        /**
         * 批量更新场景-同步角色数据
         */
        updateRole(roleIds) {
          this.modifyForm.role = roleIds
          this.modifyForm.roleIds = roleIds
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

.role-load-mask {
  .el-loading-spinner {
    top: 15%;
  }
}
</style>
