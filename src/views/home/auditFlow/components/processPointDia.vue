<template>
    <el-dialog :title="listTitle" width="70%" :visible="showProcessPerson" @close="closeDia">
        <el-table :data="tableData" border :max-height='420' header-row-class-name="header-row">
            <el-table-column min-width="100" prop="name" label="姓名"></el-table-column>
            <el-table-column min-width="130" prop="phone" label="手机号码"></el-table-column>
            <!-- 司机没有所属部门和职务就展示“--” -->
            <el-table-column label="所属部门" min-width="300px">
                <template slot-scope="scope">
                    <div v-if="scope.row.departPositionListStr && JSON.parse(scope.row.departPositionListStr).length > 0">
                        <el-popover trigger="click" v-for="(item, index) in JSON.parse(scope.row.departPositionListStr)" :key="index" :content="item.departNameTree" placement="top" width="200">
                            <div class="completeDuty" slot="reference">{{ item.departName }}</div>
                        </el-popover>
                    </div>
                    <div v-else>--</div>
                </template>
            </el-table-column>
            <el-table-column label="职务" min-width="300">
                <template slot-scope="scope">
                    <div v-if="scope.row.departPositionListStr && JSON.parse(scope.row.departPositionListStr).length > 0">
                        <div style="margin-bottom: 4px" v-for="(item, index) in JSON.parse(scope.row.departPositionListStr)" :key="index">
                            {{ item.positionName }}
                             <span class="mainTag" v-if="item.isMainPos == 0">主职</span>
                           
                        </div>
                    </div>
                    <div v-else>--</div>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="statusName" min-width="80" label="员工状态" v-if="personType == 1"></el-table-column>
            <el-table-column prop="accountStatus" min-width="80" label="账号状态" align="center" v-if="personType == 1">
                <template slot-scope="scope">
                    <span class="open" v-if="scope.row.accountStatus == 1" type="success">{{ scope.row.accountStatusName }}</span>
                    <span class="close" v-if="scope.row.accountStatus !== 1" type="info">{{ scope.row.accountStatusName }}</span>
                </template>
            </el-table-column> -->
        </el-table>
        <template #footer>
            <div style="text-align: center">
                <el-button type="primary" @click="closeDia()">关闭</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script>
export default {
  name: 'progressNodesModal',
  props: {
    /**
     * 人员ID List
     */
    personList: {
      type: Array,
      default: false
    },
    showProcessPerson: {
      type: Boolean,
      default: true
    },
    listTitle: {
      type: String,
      default: '节点人员列表'
    },
    procinstId: {
      type: String
    },
    isNodeUser: {
      type: Boolean,
      default: true
    },
    personType: {
      type: Number,
      default: 0  //1 节点人员 2已审人员 3抄送已读
    },
    /**
     * 是否是流程图的开始节点
     */
    isStartUser: {
      type: Boolean,
      // default: true
    },
    methods: {
      /**
       * 查询节点人员列表
       */
      async getNodeList () {
        let params = {
          procinstId: this.procinstId,
          isNodeUser: this.personType === 1 ? true : false,
          isStartUser: this.isStartUser,
          userIds: this.personList
        }
        let queryData = {
          op: 'detail',
          data: JSON.stringify(params)
        }

        try {
          const res = await this.$axios('/new/flowable/user/select', queryData)
          this.tableData = JSON.parse(res.data) || []
        } catch (e) {
        }
      },
      closeDia () {
        this.$emit('closepop');
      }
    }
  },
  created () {
    this.getNodeList()
  },
  data () {
    return {
      tableData: []
    };
  },
  methods: {
    /**
     * 查询节点人员列表
     */
    async getNodeList () {
      let params = {
        procinstId: this.procinstId,
        isNodeUser: this.personType === 1 ? true : false,
        isStartUser: this.isStartUser || false,
        userIds: this.personList
      }
      let queryData = {
        op: 'detail',
        data: JSON.stringify(params)
      }

      try {
        const res = await this.$axios('/new/flowable/user/select', queryData)
        this.tableData = JSON.parse(res.data) || []
      } catch (e) {
      }
    },
    closeDia () {
      this.$emit('closepop');
    }
  }
};
</script>
<style lang="scss" scoped>
.mainTag{
  margin-left: 8px;
  background: #fdf6ec;
  color: #e6a23c;
  border-radius: 4px;
  padding: 3px 10px;
  border-radius: 4px;
}
/deep/.el-table{
  border-radius: 8px
}
/deep/ .header-row {
  
  th {
     background: #f5f7fa;
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
