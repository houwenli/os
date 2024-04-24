<template>
    <div>
        <div class="main_content">
            <ws-table-el v-if="moduleName" :col="8" ref="table" v-bind="tableConfig" highlight-current-row :header-cell-style="{ background: '#F5F7FA' }">
                <template #search>
                    <search-group>
                        <label for>阅读人：</label>
                        <el-input maxlength="10" v-model.trim="searchOptions.userName" clearable placeholder="请输入阅读人姓名"></el-input>
                    </search-group>
                    <search-group>
                        <label for>工号：</label>
                        <el-input maxlength="8" v-model.trim="searchOptions.code" clearable placeholder="请输入员工工号"></el-input>
                    </search-group>
                    <search-group>
                        <label for>阅读时间：</label>
                        <ws-date-range :startTime.sync="searchOptions.readStartDate" :endTime.sync="searchOptions.readEndDate" placeholder="请选择阅读时间"></ws-date-range>
                    </search-group>

                    <search-group>
                        <label for>组织架构类型：</label>
                        <el-select v-model="searchOptions.orgType" clearable>
                            <el-option label="总部" :value="0"></el-option>
                            <el-option label="一级机构" :value="20"></el-option>
                            <el-option label="二级机构" :value="30"></el-option>
                            <el-option label="实体店" :value="40"></el-option>
                        </el-select>
                    </search-group>
                    <search-group>
                        <label for>阅读渠道：</label>
                        <el-select v-model="searchOptions.readChannel" placeholder="请选择阅读渠道" clearable>
                            <el-option label="OA" :value="0"></el-option>
                            <el-option label="万顺云" :value="1"></el-option>
                        </el-select>
                    </search-group>
                </template>
                <template #options>
                    <div class="right">
                        <el-button-group v-if='hasSearchPermission'>
                            <el-button type="primary" icon="el-icon-search" @click="handleSearch()">查询</el-button>
                            <ws-throttle>
                                <el-button type="primary" icon="el-icon-refresh-left" @click="handleReset"></el-button>
                            </ws-throttle>
                        </el-button-group>
                    </div>
                </template>

                <!-- 数据表格部分 -->
                <template>
                    <ws-table-column-el prop="userName" label="阅读人"></ws-table-column-el>
                    <ws-table-column-el prop="code" label="工号"></ws-table-column-el>
                    <ws-table-column-el label="组织架构类型">
                      <template slot-scope="{row}">
                        {{getOrgTypeText(row.orgType)}}
                      </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="" label="阅读渠道">
                        <template slot-scope="{ row }">
                            <span v-if="row.readChannel === '0'">OA</span>
                            <span v-if="row.readChannel === '1'">万顺云</span>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="readTime" label="阅读时间"></ws-table-column-el>
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

export default {
  name: 'readDetail',
  data () {
    return {
      moduleName: '',
      tableConfig: {
        loading: true,
        filterColumns: false,
        lazyQuery: {
          moduleName: '',
          op: {
            selectList: 'readNumDetail',
            selectCount: 'readNumDetailCount'
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
    hasSearchPermission() {
      return this.getModuleUrl('readNumDetail')
    }
  },
  created () {
    let {noticeType, noticeId } = this.$route.query

    if (noticeType !== undefined && noticeId !== undefined) {
      this.moduleName = getCommentModuleName(noticeType*1)

      this.tableConfig.lazyQuery.moduleName = this.moduleName
      this.searchOptions.orgNoticeId = noticeId*1
    }
  },
  methods: {
    handleReset () {
      this.$refs.table.reset();
    },

    handleSearch () {
      this.$refs.table.search();
    },
    getModuleUrl (op) {
      return this.$getModuleUrl(this.moduleName, op);
    },

    onBack () {
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

