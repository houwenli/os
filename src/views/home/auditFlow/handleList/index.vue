<template>
    <div>
        <div class="main_content">
            <div class="search-header">
                <el-form class="search-form" label-width="120px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="发起人ID：">
                                <el-input maxlength="50" v-model.trim="searchOptions.startUserId" placeholder="请输入发起人ID" clearable></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8">
                            <el-form-item label="发起人：">
                                <el-input maxlength="50" v-model.trim="searchOptions.startUserName" placeholder="请输入发起人姓名" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="手机号码：">
                                <el-input v-model.trim="searchOptions.startUserPhone" placeholder="请输入发起人手机号码" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="业务类型：">
                                <el-select v-model="searchOptions.category" placeholder="请选择业务类型" clearable filterable @change="onChangeBusType" style="width: 100%">
                                    <el-option v-for="item in businessTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="审核类型：">
                                <el-select v-model="searchOptions.flowNameCode" placeholder="请选择" min-width="353px" filterable clearable :disabled="!searchOptions.category" style="width: 100%">
                                    <el-option v-for="item in checkTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="处理类型：">
                                <el-select v-model="searchOptions.changeType" clearable placeholder="请选择" style="width: 100%">
                                    <el-option v-for="item in processStatusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row v-show='isFold'>
                        <el-col :span="8">
                            <el-form-item label="发起时间：">
                                <ws-date-range :startTime.sync="searchOptions.beginTime" :endTime.sync="searchOptions.endTime" style="width: 100%"></ws-date-range>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="处理时间：">
                                <ws-date-range :startTime.sync="searchOptions.approveTimeBegin" :endTime.sync="searchOptions.approveTimeEnd" style="width: 100%"></ws-date-range>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="流程状态：" style="width: 100%">
                                <el-select v-model="searchOptions.approvalStatus" clearable placeholder="请选择" style="width: 100%">
                                    <el-option v-for="item in processStatusEnumerate" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <foldSearchPanel :isFold.sync='isFold'></foldSearchPanel>
                </el-form>

                <div class="operate-group">
                    <el-button-group>
                        <el-button class="searchBtn" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
                        <ws-throttle>
                            <el-button class="resetBtn" type="primary" icon="el-icon-refresh-left" @click="onReset"></el-button>
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
                    <el-table-column label="处理时间" prop="approvalTime" min-width="120px"></el-table-column>
                    <el-table-column label="处理类型" min-width="100px">
                        <template slot-scope="scope">
                            {{ CHANGETYPE_STATUS[scope.row.changeType] }}
                        </template>
                    </el-table-column>
                    <el-table-column label="业务类型" prop="categoryName"></el-table-column>
                    <el-table-column label="审核类型" prop="name" min-width="160px"></el-table-column>
                    <el-table-column label="发起人ID" prop="startUserId"></el-table-column>
                    <el-table-column label="发起人" prop="startUserName"></el-table-column>
                    <el-table-column label="发起人手机号" prop="startUserPhone"></el-table-column>
                    <el-table-column label="发起人所属部门" prop="startDeptName" show-overflow-tooltip min-width="120px">
                        <template slot-scope="scope">
                            <el-popover trigger="click" :content="scope.row.startDeptName" placement="top" width="200">
                                <span class="completeDuty" slot="reference">{{ scope.row.startDeptNameSmall }}</span>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="流程状态">
                        <template slot-scope="scope">
                            <span class="bg_none" :style="`${FLOW_STATUS[scope.row.approvalStatus]['style']}`">{{ FLOW_STATUS[scope.row.approvalStatus]['value'] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="发起时间" prop="createTime" min-width="120"></el-table-column>
                    <el-table-column label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" style="color: #0088ff" @click="goApproval(scope.row, '2')">详情</el-button>
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

            <el-dialog append-to-body title="提示" :visible.sync="isWrongTips" width="30%" center :lock-scroll="false">
                <span>{{ this.message }}</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="isWrongTips = false">取 消</el-button>
                    <el-button type="primary" @click="refreshTable()">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { FLOW_STATUS, FLOW_PATH } from '@/utils/enum';
import { CHANGETYPE_STATUS } from './data.js'
import foldSearchPanel from '../components/fold-search-panel.vue'

export default {
  name: 'handleList',
  components: {
    foldSearchPanel
  },
  data () {
    return {
      moduleName: '/index/todo',

      businessTypeList: [],
      searchOptions: {
        searchFlag: 'Login',
        startUserId: '',
        startUserName: '',
        startUserPhone: '',
        flowNameCode: '',
        approvalStatus: '',
        isApprove: '2',
        // 业务类型
        category: '',
        beginTime: '',
        endTime: '',
        approveTimeBegin: '',
        approveTimeEnd: '',
        flowStatus: '',
        processStatus: '',
        changeType: '',
        searchType: 1
      },
      page: {
        currentPage: 1,
        pageSize: 20
      },
      total: 0,
      tableData: [],

      checkTypeList: [],
      processStatusList: [
        { id: -1, name: '撤销' },
        { id: 1, name: '审核通过' },
        { id: 2, name: '审核拒绝' },
        { id: 3, name: '评论' },
        { id: 4, name: '转交' },
        { id: 5, name: '加签' },
      ],
      processStatusEnumerate: [
        { id: -1, name: '已撤销' },
        { id: 1, name: '审核通过' },
        { id: 2, name: '审核拒绝' },
        { id: 3, name: '待审核' },
        { id: 4, name: '审核中' },
        { id: 5, name: '再次审核' },
        { id: 6, name: '自动审核通过' },
        { id: 7, name: '自动审核驳回' },
      ],
      FLOW_STATUS,
      CHANGETYPE_STATUS,
      isWrongTips: false,
      message: '',

      isFold: false
    };
  },
  created () {
    this.getBusinessOptions()

    this.getTableList()
  },

  methods: {
    async getTableList () {
      let params = {
        body: this.searchOptions,
        ...this.page,
        op: 'approvalRecord'
      }

      try {
        const res = await this._axios(params, "", "/new/flowable/todoTask/select")

        this.tableData = res.data.body || []
        this.total = res.data.count
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
      this.isWrongTips = false;
      this.onReset();
    },

    onChangeBusType (val) {
      this.searchOptions.flowNameCode = '';
      this.onSearch();
      if (val !== "") {
        this.getcheckList()
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
            id: this.searchOptions.category,
          }
        }, "", "/flowable/common/select")

        this.checkTypeList = res.data || []
      } catch (error) {

      }
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
    //跳转详情页
    async goApproval (row, type) {
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

      const action = (type) => {
        this.$router.push({
          name: pathName,
          query: {
            row: JSON.stringify({ id: row.procInsId, taskId: row.taskId, nodeKey: row.nodeKey, type }),
            id: row.procInsId,
            taskId: row.taskId,
            nodeKey: row.nodeKey,
            type
          }
        });
      }

      try {
        if (type === '1') {
          let param = {
            procinstId: row.procInsId,
            op: 'auditCheck',
          };
          let res = await this._axios(param, this.moduleName);
          if (res.data.msg == 1 || res.data.msg == 2) {
            let codeTips = {
              1: '当前审批流已被发起人撤回！',
              2: '当前节点已被他人审核完成！',
            };
            let msg = res.data.msg;
            this.message = codeTips[msg];
            this.isWrongTips = true;
          } else {
            action("2")
          }
        } else {
          action("3")
        }
      } catch (err) {
        console.log(err)
      }
    }
  },
};
</script>

<style scoped lang="scss">
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
.main_content {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 56px - 24px - 24px);
    padding: 24px;
    background: #fff;
    border-radius: 8px;
    overflow: auto;
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
