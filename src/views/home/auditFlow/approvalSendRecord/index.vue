<template>
    <div>
        <div class="approvalSendRecord">
            <div class="search-header">
                <el-form class="search-form" label-width="120px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="发起人ID：">
                                <el-input v-model.trim="searchOptions.startUserId" placeholder="请输入发起人ID" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="发起人：">
                                <el-input v-model.trim="searchOptions.startUserName" placeholder="请输入发起人姓名" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="手机号码：">
                                <el-input v-model.trim="searchOptions.startUserPhone" placeholder="请输入发起人手机号码" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="业务类型：">
                                <el-select v-model="searchOptions.categoryName" placeholder="请选择" min-width="353px" filterable style="width: 100%" @change="onChangeBusType">
                                    <el-option v-for="item in businessTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="审核类型：">
                                <el-select v-model="searchOptions.approvalType" placeholder="请选择" min-width="353px" filterable style="width: 100%" :disabled="!searchOptions.categoryName">
                                    <el-option v-for="item in checkTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="流程状态：">
                                <el-select v-model="searchOptions.flowStatus" placeholder="请选择" style="width: 100%">
                                    <el-option v-for="item in processStatusFilters" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-show="isFold">
                        <el-col :span="8">
                            <el-form-item label="发起时间：">
                                <ws-date-range :startTime.sync="searchOptions.beginTime" :endTime.sync="searchOptions.endTime"></ws-date-range>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="完成时间：">
                                <ws-date-range :startTime.sync="searchOptions.approveTimeBegin" :endTime.sync="searchOptions.approveTimeEnd"></ws-date-range>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <foldSearchPanel :isFold.sync="isFold"></foldSearchPanel>
                </el-form>

                <div class="operate-group">
                    <el-button-group>
                        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
                        <ws-throttle>
                            <el-button type="primary" icon="el-icon-refresh-left" @click="onReset"></el-button>
                        </ws-throttle>
                    </el-button-group>
                </div>
            </div>

            <div class="search-box flex-page-table">
                <el-table style="border-radius: 8px; overflow: hidden" :data="tableData" border :header-cell-style="{ background: '#F5F7FA', 'font-weight': 600, color: '#666' }">
                    <el-table-column label="序号" width="50">
                        <template slot-scope="{ $index }">
                            {{ (page.currentPage - 1) * page.pageSize + $index + 1 }}
                        </template>
                    </el-table-column>

                    <el-table-column prop="categoryName" label="业务类型" min-width="80px"></el-table-column>
                    <el-table-column prop="name" label="审核类型" min-width="140px"></el-table-column>
                    <el-table-column prop="procdefNo" label="审批编号" min-width="140px"></el-table-column>
                    <el-table-column prop="startUserId" label="发起人ID"></el-table-column>
                    <el-table-column prop="startUserName" label="发起人" width="80"></el-table-column>
                    <el-table-column prop="startUserPhone" label="发起人手机号" min-width="140px"></el-table-column>

                    <el-table-column prop="startDeptName" label="发起人所属部门" min-width="120px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-popover trigger="click" :content="scope.row.startDeptName" placement="top" width="200">
                                <span class="completeDuty" slot="reference">{{ scope.row.startDeptNameSmall }}</span>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="startTime" label="发起时间" min-width="160px"></el-table-column>
                    <el-table-column prop="finishTime" label="完成时间" min-width="160px"></el-table-column>
                    <el-table-column prop="flowProgress" label="流程节点"></el-table-column>
                    <el-table-column prop="flowStatus" label="流程状态" width="150">
                        <template slot-scope="scope">
                            <span class="bg_none" :style="`${FLOW_STATUS[scope.row.flowStatus]['style']}`">{{ FLOW_STATUS[scope.row.flowStatus]['value'] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" min-width="120" label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" style="color: #0088ff" @click="goDetail(scope.row)">详情</el-button>
                            <el-button
                                v-if="isRevoke(scope.row)"
                                type="text"
                                style="color: #0088ff"
                                @click="onRevoke(scope.row)"
                            >
                                撤销
                            </el-button>
                            <el-button type="text" style="color: #0088ff" v-if="getResubmitButtonPermission(scope.row)" @click="resubmission(scope.row)">重新提交</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div class="search-footer">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="page.currentPage"
                    :page-sizes="[20, 50, 100, 200]"
                    :page-size="20"
                    layout="total,sizes, prev, pager, next, jumper"
                    :total="total"
                />
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import { FLOW_STATUS, FLOW_PATH } from '@/utils/enum';
import { getResubmitPagePermission, submitMap } from '../components/data.js'
import foldSearchPanel from '../components/fold-search-panel.vue'

export default {
  name: 'approvalSendRecord',
  components: {
    foldSearchPanel
  },

  data () {
    return {
      moduleName: '/index/todo',
      businessTypeList: [],

      searchOptions: {
        startUserId: '',
        startUserName: '',
        startUserPhone: '',
        approvalType: '',
        flowStatus: '',
        categoryName: '',
        beginTime: '',
        endTime: '',
        approveTimeBegin: '',
        approveTimeEnd: '',
      },

      checkTypeList: [],
      FLOW_STATUS,

      page: {
        currentPage: 1,
        pageSize: 20
      },
      total: 0,
      tableData: [],

      isFold: false
    };
  },

  computed: {
    //流程状态下拉option
    ...mapState('auditFlow', ['processStatusFilters']),
    isRevoke(){
        return function(row){
            // 权限
            if(!this.getModulePower('/index/todo').flowBackout) return false
            
            // 代驾审批没有撤销功能
            if(Number(row.category === 12)) return false
            
            //审核状态
            return [3,4].includes(Number(row.flowStatus))
        }
    }
  },
  created () {
    this.getBusinessOptions();

    this.getTableList()
  },

  methods: {
    async getTableList () {
      let params = {
        body: this.searchOptions,
        ...this.page
      }

      try {
        const listResponse = await this._axios(Object.assign(params, { op: 'selectPage' }), "", "/flowable/approvalInitiationRecord/select")

        const totalResponse = await this._axios(Object.assign(params, { op: 'selectCount' }), "", "/flowable/approvalInitiationRecord/select")

        this.tableData = listResponse.data || []
        this.total = totalResponse.data
      } catch (error) {
      }
    },

    handleSizeChange (size) {
      this.page.pageSize = size
      this.page.currentPage = 1

      this.getTableList()
    },
    handleCurrentChange (current) {
      this.page.currentPage = current

      this.getTableList()
    },


    refreshTable () {
      this.onReset();
    },

    onSearch () {
      this.page = this.$options.data().page
      this.total = 0

      this.getTableList()
    },

    onReset () {
      this.searchOptions = this.$options.data().searchOptions

      this.onSearch()
    },

    onChangeBusType (val) {
      this.searchOptions.approvalType = '';
      this.onSearch();
      if (val !== "") {
        this.getcheckList()
      }
    },

    //重新提交按钮权限
    getResubmitButtonPermission (row) {
      return getResubmitPagePermission.call(this, row)
    },

    //重新提交
    resubmission (row) {
      //机构审批和通用审批跳转路径一样 只是审核流id不一样
      if (row.nameId == 24 || row.nameId == 29) {
        this.$router.push({
          path: '/currencyApply',
          query: {
            id: row.nameId,
            procInsId: row.procInsId
          }
        });
      } else {
        this.$router.push({
          path: submitMap[row.nameId].modelName,
          query: {
            id: row.nameId,
            procInsId: row.procInsId
          }
        });
      }
    },

    //获取业务类型选项
    async getBusinessOptions () {
      try {
        let res = await this._axios({ op: 'businessType' }, "", "/flowable/common/select")
        this.businessTypeList = res.data || []
      } catch (error) {
      }
    },

    //获取审核类型选项
    async getcheckList () {
      try {
        let res = await this._axios({
          op: "workflowName",
          body: {
            id: this.searchOptions.categoryName,
          }
        }, "", "/flowable/common/select")

        this.checkTypeList = res.data || []
      } catch (error) {

      }
    },

    getModuleUrl (op) {
      return this.$getModuleUrl(this.moduleName, op);
    },
    goDetail (row) {
      const category = Number(row.category)
      const nameId = row.nameId

      let pathName = category === 7 ? 'needApproval' : 'pendingAndApproval';


      // 跳转到新工作流详情页
      if (FLOW_PATH.includes(category)) {
        pathName = 'workFlow'
      }

      // 将总部权限申请和分支机构权限申请都走新审核流
      if (category === 5 && ([23, 27].includes(nameId))) {
        pathName = 'workFlow'
      }

      if (row.category === 1 && (row.nameId === 14 || row.nameId === 15)) {
        pathName = 'workFlow'
      }

      this.$router.push({
        name: pathName,
        query: {
          row: JSON.stringify({ id: row.procInsId, nodeKey: row.nodeKey, type: '1' }),
          id: row.procInsId,
          nodeKey: row.nodeKey,
          type: '1'
        }
      });
    },

    /**
     * 撤销
     */
    onRevoke (row) {
      let data = {
        data: { procinstId: row.procInsId },
        op: 'flowBackout',
      };

      this.$confirm("确认要撤销当前审批流吗?", "撤销审批", {
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {

            await this.$axios(this.getModuleUrl('flowBackout'), data)
            this.$message.success('撤销成功');

            this.onSearch()

            done()
          } else {
            done()
          }
        }
      }).then(() => {
      }).catch(() => { })


    },
  },
};
</script>
<style lang="scss" scoped>
.approvalSendRecord {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 56px - 24px - 24px);
    padding: 24px;
    background: #fff;
    border-radius: 8px;
    overflow: auto;
}

.search-header {
    padding: 24px 24px 0 24px;
    background: #fff;

    box-sizing: border-box;

    .search-form {
        position: relative;
        padding: 24px;
        border-radius: 8px;
        background: #f5f7fa;
        border: 1px solid #ebeef5;

        /deep/ .el-form-item label {
            font-weight: 400;
        }
    }
}

.search-box {
    flex: 1;
}

.search-footer {
    display: flex;
    justify-content: flex-end;
    height: 60px;
    background: #fff;
    padding: 15px 0;
}

.operate-group {
    display: flex;
    justify-content: flex-end;
    margin: 20px 0;
}
.bg_none {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    text-align: center;
}
</style>
