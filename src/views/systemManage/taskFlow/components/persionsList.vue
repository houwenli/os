<template>
  <el-dialog  :title="title" width='60%' :visible.sync="isDialogVisible" >
      <div class="mechanism">
          <ws-table-el ref="table" v-bind="tableConfig" tooltip-effect="dark">
              <template>
                  <ws-table-column-el prop="name" label="姓名"></ws-table-column-el>
                  <ws-table-column-el prop="phone" label="手机号码"></ws-table-column-el>
                  <ws-table-column-el label="所属部门"  show-overflow-tooltip >
                      <template slot-scope="scope">
                          <div v-if="scope.row.departPosition&&scope.row.departPosition.length > 0"  class="breakRow">
                              <el-popover v-for='(item,index) in scope.row.departPosition' :key='index' trigger="click" :content='item.departNameTree' placement="top" width="200">
                                  <span class='completeDuty' slot="reference">{{item.departName}}<br /></span>
                              </el-popover>
                          </div>
                          <div v-else>--</div>
                      </template>
                  </ws-table-column-el>
                  <ws-table-column-el label="职务" show-overflow-tooltip >
                      <template slot-scope="scope">
                          <div v-if="scope.row.departPosition&&scope.row.departPosition.length > 0"  class="breakRow">
                              <div class='positionBox' v-for='(item,index) in scope.row.departPosition' :key='index'>{{item.positionName}}<span class="mainTag" v-if="item.isMainPos==0">主职</span></div>
                          </div>
                          <div v-else>--</div>
                      </template>
                  </ws-table-column-el>
                  <ws-table-column-el prop="employeeStatusName" label="员工状态"></ws-table-column-el>
                  <ws-table-column-el prop="accountStatus" label="账号状态" >
                      <template slot-scope="scope">
                          <span class="open" v-if="scope.row.accountStatus == 1" type="success">{{ scope.row.accountStatusName }}</span>
                          <span class="close" v-if="scope.row.accountStatus !== 1" type="info">{{ scope.row.accountStatusName }}</span>
                      </template>
                  </ws-table-column-el>
              </template>
          </ws-table-el>
          <div class="btnDiv">
              <el-button type="primary" @click="handleCancle">关闭</el-button>
          </div>
      </div>
  </el-dialog>
</template>

<script>
export default {
    name: 'persionsList',
    props: {
        title: { type: String, default: '指定人员列表' },
        dialogVisible: { type: Boolean, default: true },
        userType: { type: String, default: 'users' },
        moduleName: { type: String, default: '/systemManage/taskFlow' },
        op: {
            type: Object,
            default: () => {
                return {
                    selectList: 'listByIdsSort',
                    selectCount: 'listByIdsSortCount'
                };
            }
        },
        paramObj: {
            type: Object,
            default: () => {
                return { emploIds: [] };
            }
        }
    },
    data() {
        return {
            // tableData: [],
            tableConfig: {
                filterColumns: false,
                autoHeight: false,
                maxHeight: 400,
                lazyQuery: {
                    moduleName: this.moduleName,
                    op: this.op,
                    beforeQuery: this.beforeQuery,
                }
            },
            isDialogVisible: this.dialogVisible
        };
    },
    methods: {
        beforeQuery() {
            return this.paramObj;
        },
        handleCancle() {
            this.isDialogVisible = false;
        },
        //添加账号组
        handleAddGroup(data) {
            this.isDialogVisible = false;
        },
        //搜索
        search(type = 1) {
            this.$refs.table.search(type);
        }
    },
    watch: {
        dialogVisible(val) {
            this.isDialogVisible = val;
            if (val) {
                this.tableConfig = {
                    filterColumns: false,
                    autoHeight: false,
                    height:400,
                    lazyQuery: {
                        moduleName: this.moduleName,
                        op: this.op,
                        beforeQuery: this.beforeQuery
                    }
                };
                //  this.search();
            } else {
            }
        },
        isDialogVisible(val) {
            this.$emit('visibleChanged', val);
        }
    },
    created() {}
};
</script>

<style scoped lang="scss">
.mechanism {
    width: 100%;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    //  margin-bottom: 28px;
    form {
        padding-top: 0px !important;
    }
    .ws-table-warp {
        padding: 0 !important;
        ::v-deep .option-box {
            margin-bottom: 0px !important;
        }
        .c0088ff {
            color: #0088ff;
        }
        .breakRow{
            padding:5px 10px 5px 0;
        }
    }
    .btnDiv {
      text-align: center;
      margin-top: 20px;
        .el-button {
            width: 100px;
        }
    }
}
.close {
    background: #f5f7fa;
    border-radius: 4px;
    padding: 10px 7px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #909399;
}
.open {
    background: #e1fef7;
    border-radius: 4px;
    padding: 10px 7px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #2ac39b;
}
</style>
