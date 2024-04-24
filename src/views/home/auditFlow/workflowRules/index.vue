<template>
    <div class="taskFlowlist">
        <div class="form-content-wrap">
            <div>
                <div class="middle">
                    <div class="middleTitle">流程配置信息</div>
                </div>
                <!-- 组件中自动计算column宽度 只计算第一个el-table中的el-table__body-wrapper 此处先把弹窗table的放在前面-->
                <processPointDia v-if="persionsListVisable" :showProcessPerson="persionsListVisable" :personType='1' :listTitle="persionsListTitle" :procinstId="$route.query.procinstId" :personList="personList" @closepop="persionsListVisable = false"></processPointDia>
                <!-- table表格 -->
                <div class="tableList" v-loading="detailLoading" >
                    <el-table :data="tableData" style="width: 100%" :border="true" :header-cell-style="headerStyle">
                        <el-table-column type="index" label="节点" width="80"></el-table-column>
                        <el-table-column label="节点名称" prop='nodeName'></el-table-column>
                        <el-table-column label="节点类型" prop='nodeType'></el-table-column>
                        <el-table-column label="设置成员方式">
                            <template slot-scope="scope">
                                <span>{{ scope.row.memberType ? scope.row.memberType : '--' }}</span>
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
                                <span>{{ scope.row.approvalType ? scope.row.approvalType : '--' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="审批人为空时" prop='backupUserName'>
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
            <div>
                <div class="middle">
                    <div class="middleTitle">最后操作日志</div>
                </div>
                 <table class="mailTable" v-loading="operationLoading">
                    <tr>
                        <td class="column head">操作人</td>
                        <td class="column">{{logData.updateUserName}}</td>
                        <td class="column head">所属部门</td>
                        <td class="column">{{logData.updateUserDepart}}</td>
                    </tr>
                    <tr>
                        <td class="column head">操作类型</td>
                        <td class="column">{{logData.opTypeName}}</td>
                        <td class="column head">操作时间</td>
                        <td class="column">{{logData.createTime}}</td>
                    </tr>
                </table>
            </div>
        </div>
        <!-- <PersionsList
            v-if="persionsListVisable"
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
        ></PersionsList> -->
       <ws-footer>
        <el-button @click='onBack'>返回</el-button>
       </ws-footer>
    </div>
</template>

<script>
import processPointDia from '../components/processPointDia';
export default {
    components: {
        processPointDia
    },
    name: 'workflowRules',
    data() {
        return {
            logData:[],
            loading: false,
            saveLoading: false,
            detailLoading: false,
            //角色select框
            roleOptions: [],
            positionOptions: [],
            persionsListVisable: false,
            persionsListTitle: '节点人员列表',
            // moduleName_persionList: '/systemManage/taskFlow',
            // op_persionList: { selectList: 'listByIdsSort', selectCount: 'listByIdsSortCount' },
            // userType: 'users', //用户类型，users：指定用户；userGroup: 用户组
            // personsListParam: {
            //     emploIds: null
            // },
            routeQuery: this.$route.query,
            headerStyle: {
                background: '#F5F7FA',
                'font-family': 'PingFangSC-Medium, PingFang SC',
                'font-weight': '600',
                color: '#606266'
            },
            tableData: [],

            operationLoading:false,
            personList:[]
        };
    },
    created() {
        this.getProcDefLogs();
        this.getDeatailData();
    },
    computed: {
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
    methods: {
        //获取数据
         getDeatailData() {
            try {
                this.detailLoading = true;
                this.$axios('/new/flowable/definition/select', {
                    op: 'detail',
                    data: { procdefId: this.$route.query.procdefId } //{"body":{id:this.routeQuery.id}}
                }).then(res => {
                    if (res.code == 1) {
                        this.tableData = JSON.parse(res.data);
                    }
                    this.detailLoading = false;
                });
            } catch (err) {
                this.detailLoading = false;
            }
        },
        //操作记录
        getProcDefLogs() {
            this.operationLoading=true
            let queryParams={
                body:{
                    procinstId: this.$route.query.procinstId
                }
            }
            this.$axios('/new/flowable/definition/select', {
                op: 'procDefLogs',
                data: queryParams
            }).then(res => {
                if(JSON.parse(res.data).length>0){
                    this.logData = JSON.parse(res.data)[0];
                }
                this.operationLoading=false
            }).catch(()=>{
                this.operationLoading=false
            });
        },
        //人员列表
        persionList(rowData) {
            // if (rowData.groupId) {
            //     this.userType = 'userGroup';
            //     this.moduleName_persionList = '/systemManage/accountGroup';
            //     this.op_persionList = { selectList: 'selectUserSortList', selectCount: 'selectUserSortCount' };
            //     this.personsListParam = { id: rowData.groupId };
            // } else {
            //     this.userType = 'users';
            //     this.moduleName_persionList = '/systemManage/taskFlow';
            //     this.op_persionList = { selectList: 'listByIdsSort', selectCount: 'listByIdsSortCount' };
            //     this.personsListParam = {
            //         employIds: rowData.userIds.split(',').map(item => {
            //             return Number(item);
            //         })
            //     };
            // }
            console.log(rowData.userIds)
            this.personList = rowData.userIds.split(',')
            this.persionsListVisable = true;
        },
        onBack() {
          this.$router.go(-1)
        }
    }
};
</script>

<style lang="scss" scoped>
.taskFlowlist {
    width: 100%;
    height: 100%;
    // overflow: auto;
    .form-content-wrap {
        width: 100%;
        min-height:calc(100% - 64px);
        background: #ffffff;
        margin-bottom: 64px;
        padding: 32px 40px;
        border-radius: 8px;
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
        .middle {
            width: 100%;
            height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            margin-top: 14px;
            .middleTitle {
                height: 28px;
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 600;
                color: #303133;
                line-height: 28px;
            }
        }
        .footer {
            width: 100%;
            margin-top: 40px;
            .footerTittle {
                height: 28px;
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 600;
                color: #303133;
                line-height: 28px;
                margin-bottom: 25px;
            }
        }

        .saveButon {
            position: fixed;
            bottom: 0;
            left: 0;
            width: calc(100% + 166px);
            height: 64px;
            background: #ffffff;
            box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.04);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999;
        }
    }
    .buttons {
        width: 160px;
        height: 40px;
    }
}
.mailTable {
    border-radius: 4px;
    border-collapse: collapse;
    border-style: hidden;
    border: 1px solid #DCDFE6;
    width: 100%;
    color: #606266;
}
.head {
    border-radius: 4px;
    background-color: #f5f7fa;
    text-align: left;
    width: 15% !important;
}
.column {
    height: 40px;
    border: 1px solid #dcdfe6;
    padding: 0 16px;
    width: 25%;
}
</style>
