<template>
  <div>
    <div class="main_content">
      <ws-table-el v-if="moduleName" :col="8" ref="table" v-bind="tableConfig" highlight-current-row
        :header-cell-style="{ background: '#F5F7FA' }">
        <template #search>
          <search-group>
            <label for>机构类型：</label>
            <!-- <organization v-model="searchOptions.userName" :showSelect="true" :selectOptions="selectOptions"
              ref="orgSelect" placeholder="请输入机构名称搜索" valueKey="agencyNumber"></organization> -->
              <el-select v-model="searchOptions.orgType" clearable>
                            <el-option label="总部" :value="0"></el-option>
                            <el-option label="一级机构" :value="20"></el-option>
                            <el-option label="二级机构" :value="30"></el-option>
                            <el-option label="实体店" :value="40"></el-option>
                        </el-select>
          </search-group>
          <search-group>
            <label for>用户姓名：</label>
            <el-input v-model="searchOptions.userName" clearable placeholder="请输入用户姓名"></el-input>
          </search-group>
          <search-group>
            <label for>用户手机号：</label>
            <el-input v-model="searchOptions.userPhone" clearable maxlength="11" placeholder="请输入用户手机号"></el-input>
          </search-group>
        </template>
        <template #options>
          <div class="right">
            <el-button-group v-if='powerList.praiseList'>
              <el-button type="primary" icon="el-icon-search" @click="handleSearch()">查询</el-button>
              <ws-throttle>
                <el-button type="primary" icon="el-icon-refresh-left" @click="handleReset"></el-button>
              </ws-throttle>
            </el-button-group>
          </div>
        </template>

        <!-- 数据表格部分 -->
        <template>
          <!-- <ws-table-column-el type="index" width="50" label="序号" /> -->
          <ws-table-column-el prop="orgType" label="机构类型" min-width="120px">
            <template slot-scope="scope">
                      <span>{{ scope.row.orgType| orgTypeFilters}}</span>
                  </template>
          </ws-table-column-el>
          <ws-table-column-el prop="orgName" label="机构名称" min-width="120px"></ws-table-column-el>
          <ws-table-column-el prop="userName" label="用户姓名" min-width="120px"></ws-table-column-el>
          <ws-table-column-el prop="userPhone" label="用户手机号" min-width="120px"></ws-table-column-el>
          <ws-table-column-el prop="createTime" label="点赞时间" min-width="120px"></ws-table-column-el>
        </template>
      </ws-table-el>
    </div>

    <ws-footer>
      <el-button @click="onBack">返回</el-button>
    </ws-footer>
  </div>
</template>

<script>
import { getCommentModuleName, orgTypeMap } from './data.js'
import organization from '@/components/orgSelect/organization-options.vue';
export default {
  name: 'readDetail',
  components: {
    organization
  },
  data() {
    return {
      moduleName: '',
      tableConfig: {
        loading: true,
        filterColumns: false,
        lazyQuery: {
          moduleName: '',
          op: {
            selectList: 'praiseList',
            selectCount: 'praiseCount'
          }
        },
      },
      searchOptions: {
        userName: '',
        code: '',
        orgType: '',
        readChannel: '',
        readStartDate: '',
        readEndDate: '',
        // 消息id
        orgNoticeId: ''
      }
    };
  },
  computed: {
    selectOptions() {
            let arr = [
                {value: '20', label: '城市分公司'},
                {value: '30', label: '区县分公司'},
                {value: '40', label: '实体店'}
            ]
            if (this.orgType === 20) {
                arr = [
                    {value: '30', label: '区县分公司'},
                    {value: '40', label: '实体店'}
                ]
            }
            if (this.orgType === 30) {
                arr = [
                    {value: '40', label: '实体店'}
                ]
            }
            return arr
        },
  },
  filters: {
    orgTypeFilters(val) {
      if(val == 0){
        return '总部'
      }else if(val == 10){
        return '省区'
      }else if (val == 20) {
        return '一级机构'
      } else if (val == 30) {
        return '二级机构'
      } else {
        return '实体店'
      }
    }
  },
  created() {
    let { noticeType, noticeId } = this.$route.query

    if (noticeType !== undefined && noticeId !== undefined) {
      this.moduleName = getCommentModuleName(noticeType*1)

      this.tableConfig.lazyQuery.moduleName = this.moduleName
      this.searchOptions.orgNoticeId = noticeId*1
    }
  },
  methods: {
    handleReset() {
      this.$refs.table.reset();
    },

    handleSearch() {
      this.$refs.table.search();
    },
    getModuleUrl(op) {
      return this.$getModuleUrl(this.moduleName, op);
    },

    onBack() {
      this.$router.go(-1)
    },

    getOrgTypeText(orgType) {
      return orgTypeMap[orgType]
    }
  }
};
</script>

<style lang="scss" scoped>
.main_content {
  margin-bottom: 64px;
}

.right {
  display: flex;
  justify-content: flex-end;
}
</style>

