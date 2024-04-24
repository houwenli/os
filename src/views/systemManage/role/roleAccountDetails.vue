<template>
  <div>
      <div class="branchContainer">
          <!-- 列表 -->
          <ws-table-el ref="table" v-bind="tableConfig" :col="8" :header-cell-style="{ background: '#F5F7FA' }">
              <template #search>
                  <search-group style="marginright: 154px">
                      <label for>所属部门：</label>
                      <el-input v-model.trim="searchOptions.dept" :maxlength="30" placeholder="请输入所属部门" clearable></el-input>
                  </search-group>
                  <search-group style="marginright: 154px">
                      <label for>人员姓名：</label>
                      <el-input v-model.trim="searchOptions.name" :maxlength="30" placeholder="请输入员工姓名" clearable></el-input>
                  </search-group>
                  <search-group>
                      <label for>人员手机号：</label>
                      <el-input v-model.trim="searchOptions.mobile" :maxlength="11" placeholder="请输入员工手机号" clearable></el-input>
                  </search-group>
              </template>
              <template #options>
                  <el-button-group class="fr" v-if="oaPowerList.selectAccountList">
                      <el-button type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
                      <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
                  </el-button-group>
              </template>
              <template>
                  <ws-table-column-el prop="name" label="人员姓名" min-width='40'></ws-table-column-el>
                  <ws-table-column-el prop="code" label="工号" min-width='60'></ws-table-column-el>
                  <ws-table-column-el prop="phone" label="手机号" min-width='120'></ws-table-column-el>
                  <ws-table-column-el prop="depart" label="所属部门" min-width='240'>
                      <template slot-scope="scope" >
                          <div v-for="(item, index) in scope.row.depart" :key="index">{{ item }}</div>
                      </template>
                  </ws-table-column-el>
                  <ws-table-column-el prop="createTime" label="关联时间" min-width='80'></ws-table-column-el>

                  <ws-table-column-el label="操作" fixed='right' min-width='50'>
                    <template #default="{row}">
                      <el-button type='text' @click='onRemove(row.id)' :disabled="roleClassify == 3">移除</el-button>
                    </template>
                  </ws-table-column-el>
              </template>

          </ws-table-el>
          <ws-footer>
              <el-button class="buttons" @click="onBack">返回</el-button>
          </ws-footer>
      </div>
  </div>
</template>

<script>
// 帐号详情
export default {
    name: 'roleDetails',
    data() {
        return {
            searchOptions: {
                dept: '', // 部门
                name: '', // 员工姓名
                mobile: '', // 手机号
                roleId: this.$route.query.id
            },
            tableConfig: {
                filterColumns: false,
                labelWidth: '84px',
                lazyQuery: {
                    url: '/authority/role/select', // 功能角色关联账号 调用的是账号管理的接口
                    op: {
                        selectList: 'selectAccountList',
                        selectCount: 'selectAccountCount'
                    }
                }
            },
            moduleName: '/systemManage/role',

            // 角色id
            roleId: null,
            roleClassify: null
        };
    },
    created() {
      let id = this.$route.query.id

      if(!id) {
        this.$message.error('未知的角色')
        return
      }

      this.roleId = id
      this.roleClassify = this.$route.query.roleClassify
    },
    methods: {
        // 搜索
        search(type = 1) {
            this.$refs.table.search(type);
        },
        // 重置
        reset() {
            this.$refs.table.reset();
        },
        /**
         * 移除，移除的是帐号和角色的关联关系
         */
        onRemove(userId) {
          let data = {
            op: 'deleteUserRole',
            data: {
              roleId: this.roleId,
              userId
            }
          }
           this.$confirm('是否移除该帐号和角色的关联关系', '提示')
            .then(async() => {
              try {
                await this.$axios(`/authority/role/delete`, data)

                this.$message.success('移除成功')
                this.search(2)
              } catch (error) {
              }
           })
           .catch(() => {})
        },

        onBack() {
          this.$router.push({
            name: 'role'
          })
        }
    }
};
</script>
<style scoped lang="scss">

/deep/.pagination-warp {
    height: 30px;
    padding-bottom: 0px !important;
    padding-top: 16px;
    box-sizing: content-box;
}
.branchContainer {
    margin-bottom: 80px;
}
</style>
