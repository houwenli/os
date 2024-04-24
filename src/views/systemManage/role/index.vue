<template>
    <div>
      <!-- 列表 -->
      <ws-table-el ref="table" v-bind="tableConfig" :col="8">
          <template #search>
              <search-group>
                  <label for>角色名称：</label>
                  <el-input v-model.trim="searchOptions.name" placeholder="请输入角色名称" :maxlength="30" clearable></el-input>
              </search-group>
              <search-group>
                  <label for>角色类型：</label>
                  <el-select v-model="searchOptions.roleClassify" clearable placeholder="请选择">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="基础角色" value="1"></el-option>
                      <el-option label="个人角色" value="2"></el-option>
                      <el-option label="部门角色" value="3"></el-option>
                      <el-option label="通用角色" value="4"></el-option>
                  </el-select>
              </search-group>
              <search-group>
                  <label for>使用人：</label>
                  <el-input v-model.trim="searchOptions.userName" placeholder="请输入姓名" maxlength='10' clearable />
              </search-group>
                <search-group>
                  <label for>状态：</label>
                  <el-select v-model='searchOptions.status'>
                    <el-option label='全部' value=''></el-option>
                    <el-option label='启用' value='1'></el-option>
                    <el-option label='停用' value='2'></el-option>
                  </el-select>
              </search-group>
                <!-- <search-group>
                  <label for>角色层级：</label>
                    <el-select v-model='searchOptions.orgType'>
                    <el-option  v-for='(item, index) in roleLevelList' :key='index' :label='item.text' :value='item.code' clearable></el-option>
                  </el-select>
                </search-group> -->
                <search-group>
                  <label for>菜单名称：</label>
                  <menuCascaderTree :disabled='searchOptions.orgType === null || searchOptions.orgType === ""' style="width: 100%;" :orgType='searchOptions.orgType' v-model='searchOptions.menuId'></menuCascaderTree>
                </search-group>
                <search-group>
                  <label for>角色时效：</label>
                  <el-select v-model='searchOptions.validType' placeholder="请选择类型">
                    <el-option label="永久角色" value="1"></el-option>
                    <el-option label="临时角色" value="2"></el-option>
                  </el-select>
                </search-group>
          </template>
          <template #options>
              <el-button type="primary" class="batchCopyBtn" v-if="oaPowerList.updateRoles" @click="onAdd('batchCopy')">批量授权</el-button>
              <div class="optonsBtn fr">
                  <el-button-group v-if="oaPowerList.selectList">
                      <el-button class="queryBtn" type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
                      <el-button type="primary" class="resetBtn" @click="reset" icon="el-icon-refresh-left"></el-button>
                  </el-button-group>
                  <el-button class="exportBtn" plain v-if="oaPowerList.export" @click="exportExcel">导出</el-button>
                  <el-button class="saveBtn" plain v-if="oaPowerList.save" @click="onOpenOrgModal">新增</el-button>
              </div>
          </template>
          <!-- 表格 -->
          <template>
              <ws-table-column-el prop="name" label="角色名称"></ws-table-column-el>
              <ws-table-column-el prop="orgName" label="角色层级"></ws-table-column-el>
              <ws-table-column-el prop="validType" label="角色时效">
                <template slot-scope="scope">
                    <span>{{validTypeStr[scope.row.validType]}}</span>
                </template>
              </ws-table-column-el>
              <ws-table-column-el label="角色类型" width="140px">
                  <template slot-scope="scope">
                      <span>{{roleStr[scope.row.roleClassify]}}</span>
                  </template>
              </ws-table-column-el>
              <ws-table-column-el label='绑定账号数' prop='empCount'></ws-table-column-el>
              <ws-table-column-el label="状态" width="170px">
                  <template slot-scope="scope">
                      <span :class="scope.row.status == 1 ? 'start' : 'stop'">
                          {{ scope.row.status == 1 ? '启用' : '停用' }}
                      </span>
                  </template>
              </ws-table-column-el>
              <ws-table-column-el label="修改人" prop='updateName' width="200px"></ws-table-column-el>
              <ws-table-column-el width="200px" prop='updateTime' label="修改时间"></ws-table-column-el>
              <ws-table-column-el label="操作" width="400px" fixed="right">
                  <template slot-scope="scope">
                    <!-- 通用角色只有修改和权限详情 -->
                    <div v-if="scope.row.roleClassify === 4">
                        <el-button type="text" v-if="oaPowerList.update" @click="modifyInfo('update', scope.row.id, scope.row.roleClassify, scope.row.roleType, scope.row.orgType)" class="c0088ff">
                          修改
                        </el-button>
                        <el-button
                            v-if="oaPowerList.authorityDetails"
                            type="text"
                            class="c0088ff"
                            @click="toDetail(scope.row)"
                        >
                            权限详情
                        </el-button>
                    </div>
                    <div v-else>
                        <el-button type="text" v-if="oaPowerList.update" @click="modifyInfo('update', scope.row.id, scope.row.roleClassify, scope.row.roleType, scope.row.orgType)" class="c0088ff">
                          修改
                        </el-button>
                        <el-button type="text" v-if="oaPowerList.disabled" @click="deactivate(scope.row.id, scope.row.status)" class="c0088ff">
                            {{ scope.row.status === 1 ? '停用' : '启用' }}
                        </el-button>
                        <!-- 个人角色不能查看帐号详情 -->
                        <el-button v-if="oaPowerList.selectAccountList && scope.row.roleClassify != 2" type="text" class="c0088ff" @click="goAccountDetail(scope.row.id,scope.row.roleClassify)">
                            账号详情
                        </el-button>
                        <!-- 基础角色才可以复制新建 -->
                        <el-button
                            v-if="oaPowerList.copyAndCreate && scope.row.roleClassify == 1"
                            type="text"
                            class="c0088ff"
                            @click="modifyInfo('copyAndCreate', scope.row.id, scope.row.roleClassify, scope.row.roleType, scope.row.orgType)"
                        >
                            复制新建
                        </el-button>
                        <el-button
                            v-if="oaPowerList.authorityDetails"
                            type="text"
                            class="c0088ff"
                            @click="toDetail(scope.row)"
                        >
                            权限详情
                        </el-button>
                        <el-button v-if="oaPowerList.delete && scope.row.status == 2" type="text" @click="deactivate(scope.row.id, 'del')">删除</el-button>
                    </div>
                  </template>
              </ws-table-column-el>
          </template>
      </ws-table-el>
      <!-- 弹窗 -->
      <el-dialog :title="delTitle + '角色'" :visible.sync="delDialog" custom-class="delDialog" v-if="delDialog" width="30%" :center="true" append-to-body :lock-scroll="false">
          <span class="dialogCon">{{ delCon }}</span>
          <span slot="footer" class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button v-if="delBtn" type="primary" @click="delRole" :loading="delLoading">确 定</el-button>
          </span>
      </el-dialog>
      <el-dialog title="新增角色" :visible.sync="orgTypeDialog" @close="orgTypeCancel" v-if="orgTypeDialog" width="604px" append-to-body :lock-scroll="false">
          <el-row>
              <el-col :span="12">
                  <el-radio class="orgChoice fl" @click="onAdd('headquartersRole')" border v-model="radio" label="headquartersRole">总部角色</el-radio>
              </el-col>
              <!-- <el-col :span="12">
                  <el-radio class="orgChoice fr" @click="onAdd('branchRole')" border v-model="radio" label="branchRole">分支机构角色</el-radio>
              </el-col> -->
          </el-row>
          <div slot="footer" class="dialog-footer">
              <el-button class="dialogBtn" @click="orgTypeCancel">取 消</el-button>
              <el-button class="dialogBtn" type="primary" @click="orgTypeJump">确 定</el-button>
          </div>
      </el-dialog>
    </div>
</template>

<script>
import {getRoleLevelList} from './data'
import menuCascaderTree from './components/menuCascaderTree.vue'

export default {
    name: 'roleList',
    components: {
      menuCascaderTree
    },
    data() {
        return {
            // 列表查询参数
            searchOptions: {
                name: '',
                roleClassify: '',
                // 使用人
                userName: '',
                // 使用状态
                status: '',
                // 角色层级
                orgType: '',
                validType:'',

                menuId: ''
            },
            // 列表请求参数
            tableConfig: {
                filterColumns: false,
                labelWidth: '100px',
                lazyQuery: {
                    moduleName: '/systemManage/role',
                    op: {
                        selectList: 'selectList',
                        selectCount: 'selectCount',
                    },
                },
            },
            radio: 'headquartersRole',
            moduleName: '/systemManage/role',
            delBtn: true, // 弹窗按钮
            delId: '', // 删除id
            delDialog: false, // 弹窗
            delTitle: '', // 弹窗表头
            delCon: '', // 弹窗内容
            delLoading: false,
            orgTypeDialog: false, // 新增弹窗
            // 角色层级枚举
            roleLevelList: [],
            roleStr:['','基础角色','个人角色','部门角色','通用角色'],
            validTypeStr:['','永久','临时']
        };
    },
    created() {
      let roleLevelList = getRoleLevelList()
      roleLevelList.unshift({
        text: '全部',
        code: ''
      })

      this.roleLevelList = roleLevelList
    },
    methods: {

        // 新增角色取消弹窗
        orgTypeCancel() {
            this.radio = 'headquartersRole';
            this.orgTypeDialog = false;
        },
        // 新增跳转
        orgTypeJump() {
            let type = this.radio;
            this.$router.push({
                name: 'RoleForm',
                query: { type },
            });
        },
        // 搜索
        search(type = 1) {
            this.$refs.table.search(type);
        },
        // 重置
        reset() {
            this.searchOptions = this.$options.data().searchOptions
            this.search();
        },
        // 导出
        async exportExcel() {
            const reqData = {
                data: { ...this.searchOptions },
                op: 'export',
            };

            try {
              await this.$axios(this.getModuleUrl('export'), reqData)
              this.$message.success('文件正在导出，请到文件下载界面进行下载');
            } catch (error) {
            }
        },
        // 帐号详情
        goAccountDetail(id,roleClassify) {
            this.$router.push({
                name: 'RoleDetails',
                query: { id,roleClassify }
            });
        },

        /**
         * 打开选择新增类型
         */
        onOpenOrgModal() {
            let type = this.radio;
            this.$router.push({
                name: 'RoleForm',
                query: { type },
            });
        },
        /**
         * 新增
         * @param {String} type
         *  headquartersRole-总部角色
         *  branchRole-分支机构
         *  batchCopy - 批量授权
         */
        onAdd(type) {
           this.$router.push({
              name: 'RoleForm',
              query: { type }
          });
        },
        // 批量授权， 新增修改
        modifyInfo(type, id, roleType, orgType, org) {
            // if (type === 'save') {
            //   this.orgTypeDialog = true
            //   return
            // }

            this.$router.push({
                name: 'RoleForm',
                query: { type, id, roleType, orgType, org },
            });
        },
         toDetail(row) {
          this.$router.push({
            name: 'roleDetail',
            query: {
              id: row.id
            }
          })
        },
        // 账号停用，删除
        deactivate(id, type) {
            if (type == 1) {
                this.delTitle = '停用';
                this.delCon = '停用该角色后，赋予该角色的账号将不能使用相应权限';
            } else if (type == 2) {
                this.delTitle = '启用';
                this.delCon = '是否启用该角色';
            } else if (type == 'del') {
                this.delTitle = '删除';
                this.delCon = '是否删除该角色！';
            }
            this.delDialog = true;
            this.delId = id;
        },

        // 停用 删除
        async delRole() {
            this.delLoading = true;
            let id = this.delId;
            let prames = {
                op: 'disabled',
                data: { id },
            };
            if (this.delTitle == '删除') {
                prames.op = 'delete';
            }

            try {
              let res = await this.$axios(this.getModuleUrl(prames.op), prames)
              let data = JSON.parse(res.data);

              if (prames.op == 'delete') {
                  this.$message.success('角色删除成功！');
              } else {
                  this.$message.success(`该角色已${data.status == 1 ? '启' : '停'}用`);
              }
              this.search();
            } catch (error) {
            } finally {
              this.delDialog = false;
              this.delLoading = false;
            }
        },
        // 关闭弹窗
        cancel() {
            this.delDialog = false;
            this.delBtn = true;
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    }
};
</script>

<style scoped lang="scss">
.ws-table-warp {
    padding: 24px 24px 16px 24px !important;
}
/deep/.pagination-warp {
    height: 30px;
    padding-bottom: 0px !important;
    padding-top: 16px;
    box-sizing: content-box;
}
.c0088ff {
    color: #0088ff;
}

/deep/ .el-dialog__wrapper .el-dialog__body {
    padding: 42px 54px 56px;
}
/deep/ .delDialog .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 42px 10px 56px;
}
/deep/ .dialogCon {
    text-align: center;
}
.dialogBtn {
    height: 36px;
    width: 98px;
}
.optonsBtn {
    .exportBtn,
    .queryBtn,
    .saveBtn,
    .c0088ff {
        width: 95px;
        margin-left: 10px;
        padding: 10px 25px;
    }
    .reserBtn {
        width: 40px;
        padding: 0;
    }
}
.batchCopyBtn {
    width: 95px;
}
.orgChoice {
    width: 240px;
    height: 72px;
    background: #ffffff;
    border-radius: 4px;
    line-height: 45px;
    // text-align: center;
    margin: 0 !important;
    padding: 12px 20px 0 24px;

    span {
        line-height: 50px;
    }
    /deep/ .el-radio__label {
        font-size: 24px;
        font-weight: 500;
        color: #303133;
    }
    /deep/ .el-radio__input .is-checked {
        width: 18px;
        height: 18px;
    }
    /deep/ .el-radio__input {
        vertical-align: baseline;
    }
    /deep/ .el-radio__inner {
        width: 18px;
        height: 18px;
    }
}
</style>
