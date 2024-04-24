<template>
  <ws-table-el ref="table" v-bind="tableConfig" :col="8">
    <template #search>
      <search-group>
        <label for>司机ID：</label>
        <el-input v-model.trim="searchOptions.driverId" placeholder="请输入司机ID" clearable></el-input>
      </search-group>
      <search-group>
        <label for>司机姓名：</label>
        <el-input v-model.trim="searchOptions.driverName" placeholder="请输入司机姓名" clearable></el-input>
      </search-group>
      <search-group>
        <label for>司机账号：</label>
        <el-input v-model.trim="searchOptions.driverPhone" placeholder="请输入司机账号" clearable></el-input>
      </search-group>
      <search-group>
        <label for>订单号：</label>
        <el-input v-model.trim="searchOptions.orderId" placeholder="请输入订单号" clearable></el-input>
      </search-group>
      <search-group>
        <label for>乘客账号：</label>
        <el-input v-model.trim="searchOptions.passengerPhone" placeholder="请输入乘客账号" clearable></el-input>
      </search-group>
    </template>
    <template #searchBtns>
      <el-button-group v-if="powerList[op.selectList]">
        <ws-enter-event>
          <el-button type="primary" icon="el-icon-search" @click="search()">查 询</el-button>
        </ws-enter-event>
        <ws-throttle>
          <el-button type="primary" class="resetBtn" @click="reset()" icon="el-icon-refresh-left"></el-button>
        </ws-throttle>
      </el-button-group>
    </template>
    <template>
      <ws-table-column-el prop="orderId" label="订单号"></ws-table-column-el>
      <ws-table-column-el prop="startAddr" label="订单起点"></ws-table-column-el>
      <ws-table-column-el prop="endAddr" label="订单终点"></ws-table-column-el>
      <ws-table-column-el prop="driverPhone" label="司机账号"></ws-table-column-el>
      <ws-table-column-el prop="driverId" label="司机ID"></ws-table-column-el>
      <ws-table-column-el prop="driverName" label="司机姓名"></ws-table-column-el>
      <ws-table-column-el prop="passengerPhone" label="乘客账号"></ws-table-column-el>
      <ws-table-column-el prop="createTime" label="上传时间"></ws-table-column-el>
      <ws-table-column-el label="操作" width="320">
        <template slot-scope="scope">
          <el-image :ref="scope.row.fileUrl" :preview-src-list="[imgUrl]" style="width: 0px; height: 0px"
            :src="scope.row.fileUrl">
            查看图片
          </el-image>
          <el-button type="text" style="color:#0088ff;" class="table-text" @click="preview(scope.row.fileUrl)">查看图片</el-button>
        </template>
      </ws-table-column-el>
    </template>
  </ws-table-el>
</template>

<script>
export default {
  data() {
    return {
      moduleName: '/workbench/huizhou',
      imgUrl: '',
      searchOptions: {
        driverId: '',
        driverPhone: '',
        driverName: '',
        orderId: '',
        passengerPhone: '',
      },
      tableConfig: {
        loading: true,
        lazyQuery: {
          moduleName: '/workbench/huizhou',
          op: {
            selectList: 'list',
            selectCount: 'count',
          },
          // beforeQuery: this.beforeQuery,
          // immediate: false,
        },
      },
      op: {
        selectList: 'list',
        selectCount: 'count',
      },
      refreshLoading: false,
      enableLoading: null,
      delLoading: null,
    };
  },
  methods: {
    // 查看图片
    search(type = 2) {
      let reg = /^[0-9]*$/;
      if (!reg.test(this.searchOptions.driverId)) {
          this.$message.error('请输入正确的司机ID');
          return;
      }
      let regPhone = /^1[3-9]\d{9}$/;
      if (!regPhone.test(this.searchOptions.driverPhone) && !!this.searchOptions.driverPhone) {
          this.$message.error('请输入正确的手机号码！');
          return false;
      }
      this.$refs.table.search(type);
    },
    preview(val) {
      this.imgUrl = val;
      this.$refs[val].clickHandler()
    },
    reset() {
      this.searchOptions = {
        driverId: '',
        driverPhone: '',
        driverName: '',
        orderId: '',
        passengerPhone: '',
      };
      this.search();
    },
    getModuleUrl(op) {
      return this.$getModuleUrl(this.moduleName, op);
    },
  },
};
</script>

<style>

</style>
