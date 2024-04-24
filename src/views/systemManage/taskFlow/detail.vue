<template>
  <div>
    <div class="taskFlowlist">
        <div class="form-content-wrap">
            <div class="header">基础信息</div>
            <div class="formAll">
                <el-form ref="form" :model="form" label-width="100px" :rules="rules" :disabled="true">
                    <el-row type="flex" :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="业务类型:" prop="categoryName">
                                <el-input v-model.trim="form.categoryName" style="width: 100%"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="工作流名称:" prop="name">
                                <el-input v-model.trim="form.name" style="width: 100%"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="描述:" prop="descr">
                                <el-input :disabled="true" type="textarea" :rows="1" v-model="form.descr"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <!-- 组件中自动计算column宽度 只计算第一个el-table中的el-table__body-wrapper 此处先把弹窗table的放在前面-->
            <PersionsList
            :dialogVisible.sync="persionsListVisable"
            :title="persionsListTitle"
            :paramObj="personsListParam"
            :moduleName="moduleName_persionList"
            :userType="userType"
            :op="op_persionList"
            @visibleChanged="
                val => {
                    persionsListVisable = val;
                }
            "
        ></PersionsList>
            <div class="ws-table-warp">
                <div class="middle">
                    <div class="middleTitle">流程配置信息</div>
                </div>
                <!-- table表格 -->
                <div class="tableList" v-loading="detailLoading">
                    <el-table
                        :data="tableData"
                        style="width: 100%"
                        :border="true"
                        :header-cell-style="{
                            background: '#F5F7FA',
                            'font-family': 'PingFangSC-Medium, PingFang SC',
                            'font-weight': '600',
                            color: '#606266',
                        }"
                    >
                        <el-table-column type="index" label="节点" width="70"></el-table-column>

                        <el-table-column label="节点名称">
                            <template slot-scope="scope">
                                <span>{{ scope.row.nodeName }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="节点类型">
                            <template slot-scope="scope">
                                <span>{{ scope.row.nodeType }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="设置成员方式">
                            <template slot-scope="scope">
                                <span>{{ getMemberTypeText(scope.row) }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="指定人员详情">
                            <template slot-scope="scope">
                                <span style="color: #0088ff; cursor: pointer" @click="persionList(scope.row)">
                                    {{ getPersonName(scope.row) }}
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="多人审批方式">
                            <template slot-scope="scope">
                                <span>{{ scope.row.approvalType }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="审批人为空时">
                            <template slot-scope="scope">
                                <span v-if ="scope.row.backupUserId" style="color: #0088ff; cursor: pointer" @click="persionList({userIds:scope.row.backupUserId+''})">
                                    {{scope.row.backupUserName}}
                                </span>
                                <span v-else>{{ scope.row.backupUserName ? scope.row.backupUserName : '--' }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>

            <div class="middle" v-if='showHighSettingPanel'>
              <div class="middleTitle">高级设置</div>
              <highSettings v-if='hasFlowConfigData' :config='flowConfig' disabled></highSettings>
            </div>
            <div >
                <div class="middle">
                    <div class="middleTitle">操作日志</div>
                </div>
                <!-- table表格 -->
                    <ws-table-el ref="table" v-bind="tableConfig" >
                        <ws-table-column-el label="操作人">
                            <template slot-scope="scope">
                                <span>{{ scope.row.updateUserName }}</span>
                            </template>
                        </ws-table-column-el>

                        <ws-table-column-el label="所属部门">
                            <template slot-scope="scope">
                                <div>
                                    <el-popover  trigger="click" :content='scope.row.updateUserDepart' placement="top" width="200">
                                        <span class='completeDuty' slot="reference">{{scope.row.updateUserDepartSmall}}</span>
                                    </el-popover>
                                </div>
                            </template>
                        </ws-table-column-el>

                        <ws-table-column-el label="操作类型">
                            <template slot-scope="scope">
                                <span>{{ scope.row.opTypeName }}</span>
                            </template>
                        </ws-table-column-el>

                        <ws-table-column-el label="操作时间">
                            <template slot-scope="scope">
                                <span>
                                    {{ scope.row.updateTime }}
                                </span>
                            </template>
                        </ws-table-column-el>
                    </ws-table-el>
            </div>

        </div>
    </div>
    <ws-footer>
      <el-button @click="goBack">返回</el-button>
    </ws-footer>
  </div>
</template>

<script>
import PersionsList from './components/persionsList.vue';
import highSettings from './components/highSettings.vue'

export default {
    name: 'flowdetail',
    components: { PersionsList, highSettings },
    data() {
        return {
            //表单验证规则
            rules: {},
            form: {
              flowNameId: '',
                categoryName: '', //业务类型
                name: '', //工作流名称
                upTime: '', //生效时间
                descr: '', //描述
            },
            flowConfig: {
              addSign: 0,
              addTrans: 0,
              addCcTask: 0
            },
            loading: false,
            saveLoading: false,
            detailLoading: false,
            operationLoading: false,
            operationData: [],
            tableData: [],
            //角色select框
            roleOptions: [],
            positionOptions: [],
            persionsListVisable: false,
            persionsListTitle: '指定人员列表',
            moduleName_persionList: '/systemManage/taskFlow',
            op_persionList: { selectList: 'listByIdsSort', selectCount: 'listByIdsSortCount' },
            userType: 'users', //用户类型，users：指定用户；userGroup: 用户组
            personsListParam: {
                emploIds: null
            },
            routeQuery: this.$route.query,

            tableConfig: {//操作日志分页
                filterColumns: false,
                autoHeight: false,
                // loading: true,
                lazyQuery: {
                    moduleName: '/systemManage/taskFlow',
                    op: {
                        selectList: 'procDefLogs',
                        selectCount: 'procDefLogsCount'
                    },
                    beforeQuery:this.beforeQuery
                },
                pageSizeList:[5,10,20,50]
            },
            hasFlowConfigData: false,
            // 工作流业务id
            id: ''
            // moduleName: '/systemManage/taskFlow',
        };
    },
    computed: {
        showHighSettingPanel() {
          let hasOp = this.$getModuleUrl('/systemManage/taskFlow', 'highSettings')

          if (hasOp) {
            this.getFlowConfig()
            return true
          }
          return false
        },

        getPersonName() {
            return function (data) {
                let personName = '';
                if (data.groupId) {
                    if (data.approveGroupName && data.approveGroupName.split(',').length > 2) {
                        let approveGroupName = data.approveGroupName.slice(0, data.approveGroupName.length - 1);
                        let approveGroupNameArray = approveGroupName.split(',');
                        personName = approveGroupNameArray[0] + '、' + approveGroupNameArray[1] + '等' + approveGroupNameArray.length + '人';
                    } else {
                        personName = data.approveGroupName;
                    }
                } else if (data.userNames) {
                    if (data.userNames != '' && data.userNames.split(',').length > 2) {
                        let userNames = data.userNames.slice(0, data.userNames.length - 1);
                        let userNamesArray = userNames.split(',');
                        personName = userNamesArray[0] + '、' + userNamesArray[1] + '等' + userNamesArray.length + '人';
                    } else {
                        personName = data.userNames;
                    }
                }
                return personName;
            };
        }
    },
    created() {
      const {id, flowNameId} = this.$route.query

      if(id) {
        this.id = id
        this.getDeatailData();
      }
    },
    methods: {
        //获取数据
        async getDeatailData() {
            try {
                this.detailLoading = true;
                const url = this.$getModuleUrl('/systemManage/taskFlow', 'detail')

                const res = await this.$axios(url, {
                    op: 'detail',
                    data: { procdefId: this.id }
                })

                if (res.code == 1) {
                    this.tableData = JSON.parse(res.data);
                    if (this.tableData.length > 0) {
                        this.form = this.tableData[0];
                    }
                }
                this.detailLoading = false;

            } catch (err) {
                this.detailLoading = false;
            }
        },

        /**
         * 获取 高级配置
         */
        async getFlowConfig() {
          try {
             const res = await this.$axios(this.$getModuleUrl('/systemManage/taskFlow', 'detail'), {
                op: 'flowConfig',
                data: { procdefId: this.id }
              })

              this.flowConfig = JSON.parse(res.data)
              this.hasFlowConfigData = true
          } catch (error) {
          }
        },

        beforeQuery(){
            return {
                procdefId: this.routeQuery.id,
                category: this.routeQuery.category,
                flowNameId: this.routeQuery.flowNameId
            }
        },
        //点击返回
        goBack() {
            this.$router.push({ name: 'taskFlow' });
        },
        //人员列表
        persionList(rowData) {
            if (rowData.groupId) {
                this.userType = 'userGroup';
                this.moduleName_persionList = '/systemManage/taskFlow';
                this.op_persionList = { selectList: 'selectUserSortList', selectCount: 'selectUserSortCount' };
                this.personsListParam = { id: rowData.groupId };
            } else {
                this.userType = 'users';
                this.moduleName_persionList = '/systemManage/taskFlow';
                this.op_persionList = { selectList: 'listByIdsSort', selectCount: 'listByIdsSortCount' };
                this.personsListParam = {
                    employIds: rowData.userIds.split(',').map(item => {
                        return Number(item);
                    })
                };
            }
            this.persionsListVisable = true;
        },

        /**
         * 显示设置成员文案
         */
        getMemberTypeText(row) {
          if (!row.memberType) return '--'

          if (row.managerLevel !== null && row.memberTypeCode === 8) {
            return `${row.memberType} 第${row.managerLevel}级主管`
          }

          return row.memberType
        }
    }
};
</script>

<style lang="scss" scoped>
.taskFlowlist {
    width: 100%;
    margin-bottom: 68px;
    background: #ffffff;
    padding: 32px 48px;
    border-radius: 8px;
    .form-content-wrap {
        width: 100%;
        .header {
            width: 80px;
            height: 28px;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #303133;
            line-height: 28px;
        }
        .formAll {
            margin-top: 24px;
            .el-select__tags {
                height: 30px;
                overflow-y: auto;
            }
        }
    }

    .ws-table-warp{
        padding: 0!important;
        min-height: auto;
        margin-bottom: 50px;
        ::v-deep.option-box{
            margin:0
        }
    }
}
 .middle {
      width: 100%;
      margin: 16px 0;

      .middleTitle {
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 600;
          color: #303133;
          margin: 16px 0;
      }
  }
</style>
