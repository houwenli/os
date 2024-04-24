<template>
  <div class="permission-functionMenu-list">
    <ws-table-el ref="table" v-bind="tableConfig">
      <template #search>
        <search-group>
          <label for>员工姓名：</label>
          <el-input v-model.trim="searchOptions.userName" :maxlength="30" placeholder="请输入人员姓名" clearable></el-input>
        </search-group>
        <search-group>
          <label for>手机号码：</label>
          <el-input v-model.trim="searchOptions.phone" :maxlength="11" placeholder="请输入员工手机号码" clearable></el-input>
        </search-group>
      </template>
      <template #options>
        <el-button type="primary" v-if="oaPowerList.beginPositionTransfer" @click="goTo('transferJobForm')">发起调岗</el-button>
      </template>
      <template #searchBtns>
        <div style="float: right">
          <el-button-group v-if="oaPowerList.selectPositionTransferList">
            <el-button type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
            <ws-throttle>
              <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
            </ws-throttle>
          </el-button-group>
        </div>
      </template>
      <template>
        <ws-table-column-el prop="userId" label="人员ID"></ws-table-column-el>
        <ws-table-column-el prop="userName" label="员工姓名"></ws-table-column-el>
        <ws-table-column-el prop="phone" label="手机号码"></ws-table-column-el>
        <ws-table-column-el prop="deptName" label="任职部门"></ws-table-column-el>
        <ws-table-column-el prop="positionName" label="职务" width="150"></ws-table-column-el>

        <ws-table-column-el prop="transferDate" label="调岗时间"></ws-table-column-el>
        <ws-table-column-el prop="createUserName" label="发起人"></ws-table-column-el>
        <ws-table-column-el label="操作" fixed="right">
          <template slot-scope="{ row }">
            <el-button type="text" v-if="oaPowerList.selectPositionTransferDetail" class="c0088ff" @click="goTo('transferJobDetail', row.id)">详情</el-button>
          </template>
        </ws-table-column-el>
      </template>
    </ws-table-el>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchOptions: {
        userName: '',
        phone: ''
      },
      tableConfig: {
        filterColumns: false,
        lazyQuery: {
          moduleName: '/workbench/ehr/transferJob',
          op: {
            selectList: 'selectPositionTransferList'
          }
        }
      },
      moduleName: '/workbench/ehr/transferJob'
    }
  },
  methods: {
    goTo(name, id) {
      this.$router.push({ name, query: { id } })
    },
    search(type = 1) {
      this.$refs.table.search(type)
    },
    reset() {
        this.$refs.table.reset()
    }
  }
}
</script>

<style lang="scss" scoped>
.ws-table-warp {
  padding: 24px 24px 16px 24px !important;
}
/deep/.pagination-warp {
  height: 30px;
  padding-bottom: 0px !important;
  padding-top: 16px;
  box-sizing: content-box;
}
/deep/.el-pagination {
  padding: 0px !important;
}
.permission-functionMenu-list {
  width: 100%;
}
.c0088ff {
  color: #0088ff;
}

/deep/ .el-button--default.is-plain {
  width: 95px !important;
}
</style>
