<template>
    <div class="main_content">
        <div class="topSearch">
            <label for>业务类型：</label>
            <el-select v-model="busType" placeholder="请选择业务类型" filterable>
                <el-option v-for="item in businessTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
        <div class="topButton">
            <el-button :type="pendingType" class="pendingBtn" @click="changeStatus('1')">待审核</el-button>
            <el-button :type="approvalType" class="approvalBtn" @click="changeStatus('2')">已审核</el-button>
        </div>
        <ws-table-el :col="8" :key="refresh" ref="table" v-bind="tableConfig" highlight-current-row :header-cell-style="{ background: '#F5F7FA' }">
            <!-- 头部筛选部分   -->

            <template #search>
                <search-group>
                    <label for>发起人ID：</label>
                    <el-input maxlength="50" v-model.trim="searchOptions.startUserId" placeholder="请输入发起人ID" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>发起人：</label>
                    <el-input maxlength="50" v-model.trim="searchOptions.startUserName" placeholder="请输入发起人姓名" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>手机号码：</label>
                    <el-input v-model.trim="searchOptions.startUserPhone" placeholder="请输入发起人手机号码" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>审批类型：</label>
                    <el-select v-model="searchOptions.approvalType" placeholder="请选择" min-width="353px" filterable>
                        <el-option v-for="item in checkTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group v-if="showType">
                    <label for>审核状态：</label>
                    <el-select v-model="searchOptions.approvalStatus" placeholder="请选择">
                        <el-option v-for="item in processStatus" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>发起时间：</label>
                    <ws-date-range :startTime.sync="searchOptions.beginTime" :endTime.sync="searchOptions.endTime"></ws-date-range>
                </search-group>
                <search-group v-if="showType">
                    <label for>审核时间：</label>
                    <ws-date-range :startTime.sync="searchOptions.approveTimeBegin" :endTime.sync="searchOptions.approveTimeEnd"></ws-date-range>
                </search-group>
                <search-group v-if="showType"></search-group>
                <!-- v-if="oaPowerList.list" -->
            </template>

            <template #options>
                <div class="right">
                    <el-button-group>
                        <el-button class="searchBtn" type="primary" icon="el-icon-search" @click="handleSearch()">查询</el-button>
                        <ws-throttle>
                            <el-button class="resetBtn" type="primary" icon="el-icon-refresh-left" @click="handleReset"></el-button>
                        </ws-throttle>
                    </el-button-group>
                </div>
            </template>
            <!-- 数据表格部分 -->
            <template>
                <ws-table-column-el prop="startTime" label="发起时间"></ws-table-column-el>
                <ws-table-column-el prop="startUserId" label="发起人ID"></ws-table-column-el>
                <ws-table-column-el prop="procdefNo" label="审批编号"></ws-table-column-el>
                <ws-table-column-el prop="startUserName" label="发起人"></ws-table-column-el>
                <!-- <ws-table-column-el prop="startDeptName" label="发起人所属部门"> -->
                <ws-table-column-el prop="startDeptName" label="发起人所属部门" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-popover trigger="click" :content="scope.row.startDeptName" placement="top" width="200">
                            <span class="completeDuty" slot="reference">{{ scope.row.startDeptNameSmall }}</span>
                        </el-popover>
                    </template>
                </ws-table-column-el>
                <!-- </ws-table-column-el> -->
                <ws-table-column-el prop="startUserPhone" label="发起人手机号"></ws-table-column-el>
                <ws-table-column-el prop="name" label="审核类型" :clearable="true"></ws-table-column-el>

                <ws-table-column-el v-if="showType" prop="approvalUser" label="审核人" width="96px"></ws-table-column-el>
                <ws-table-column-el v-if="showType" prop="approvalStatus" label="审核状态" width="150">
                    <template slot-scope="{row}">
                        <span class="bg_none" :style='getApprovalStatusStyle(row)'>{{ getApprovalStatusText(row) }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el v-if="showType" prop="approvalTime" label="审核时间"></ws-table-column-el>

                <ws-table-column-el fixed="right" width="220" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" style="color: #0088ff" v-if="!showType && getModulePower('/index/todo').personDetail" @click="goApproval(scope.row, '1')">审核</el-button>
                        <el-button type="text" style="color: #0088ff" v-if="showType && getModulePower('/index/todo').flowForm" @click="goApproval(scope.row, '2')">详情</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>

        <el-dialog append-to-body title="提示" :visible.sync="isWrongTips" width="30%" center :lock-scroll="false">
            <span>{{ this.message }}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isWrongTips = false">取 消</el-button>
                <el-button type="primary" @click="refreshTable()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { FLOW_STATUS, FLOW_PATH } from '@/utils/enum';
export default {
    name: 'pendingList',
    data() {
        return {
            moduleName: '/index/todo',
            busType: parseInt(this.$route.query.busType), //获取跳转路由的第一条默认类型
            status: '1', //按钮状态为待审核
            businessTypeList: [],
            pendingType: 'primary',
            approvalType: '',
            tableConfig: {
                loading: true,
                filterColumns: false,
                emptyModel: true,
                // layout: "flow",
                pageId: 'id',
                pageCreateTime: 'updateTime',
                lazyQuery: {
                    moduleName: '/index/todo',
                    op: {
                        //todoList
                        //todoCount
                        selectList: 'todoList',
                        selectCount: 'todoCount',
                    },
                    beforeQuery: this.beforeQuery,
                },
                hideColumnList: ['审核人', '审核状态', '审核时间'],
            },
            searchOptions: {
                searchFlag: '',
                startUserId: '',
                startUserName: '',
                startUserPhone: '',
                approvalType: '',
                approvalStatus: '',
                isApprove: '',
                categoryName: '',
                beginTime: '',
                endTime: '',
                approveTimeBegin: '',
                approveTimeEnd: '',
                flowStatus: '',
            },
            showType: false,
            checkTypeList: [],
            processStatus: [
                { id: 1, name: '审核通过' },
                { id: 2, name: '审核拒绝' },
            ],
            refresh: '',
            FLOW_STATUS,
            isWrongTips: false,
            message: '',
        };
    },
    created() {
        this.getBusinessOptions();
        this.getcheckList();
        this.judgeRouteQuery();
    },
    mounted() {
        let status = this.$route.query.status;
        status && this.changeStatus(status);
    },
    activated() {
        this.tableSearch();
    },
    watch: {
        busType: {
            handler(value) {
                this.searchOptions.approvalType = '';
                this.tableSearch();
                this.getcheckList();
            },
            deep: true,
        },
    },
    methods: {
        tableSearch() {
            this.$refs.table.search();
        },

        handleReset() {
            this.$refs.table.reset();
        },
        refreshTable() {
            this.isWrongTips = false;
            this.tableSearch();
        },
        beforeQuery() {
            this.searchOptions.searchFlag = 'Login';
            this.searchOptions.categoryName = this.busType;
            this.searchOptions.isApprove = this.status;
            return this.searchOptions;
        },
        //获取业务类型选项
        getBusinessOptions() {
            let opt = {
                op: 'businessType',
            };
            this.$axios(this.getModuleUrl(opt.op), opt).then(res => {
                const { data } = res;
                this.businessTypeList = JSON.parse(data);
            });
        },
        //获取审核类型选项
        getcheckList() {
            let opt = {
                data: {
                    body: {
                        id: this.busType,
                    },
                },
                op: 'workflowName',
            };
            this.$axios(this.getModuleUrl(opt.op), opt).then(res => {
                const { data } = res;
                this.checkTypeList = JSON.parse(data);
            });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        handleSearch() {
            this.$refs.table.search();
        },
        //改变待审核及已审核按钮状态
        changeStatus(status) {
            this.status = status;
            if (status === '1') {
                this.tableConfig.lazyQuery.op = {
                    selectList: 'todoList',
                    selectCount: 'todoCount',
                };
                this.tableConfig.hideColumnList = ['审核人', '审核状态', '审核时间'];
                this.showType = false;
                this.pendingType = 'primary';
                this.approvalType = '';
                this.searchOptions.approvalStatus=''
                this.searchOptions.approveTimeBegin=''
                this.searchOptions.approveTimeEnd=''
            } else {
                this.tableConfig.lazyQuery.op = {
                    selectList: 'myApprovalRecord',
                    selectCount: 'myApprovalRecordCount',
                };
                this.tableConfig.hideColumnList = [];
                this.showType = true;
                this.pendingType = '';
                this.approvalType = 'primary';
            }
            this.tableSearch();
        },
        //跳转详情页
        async goApproval(row, type) {
          const category = Number(row.category)
          const nameId = row.nameId
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
                        // return this.$message.error(codeTips[msg]);
                    } else {
                        let pathName =  category === 7 ? 'needApproval' : 'pendingAndApproval';

                        // 跳转到新工作流详情页
                        if ( FLOW_PATH.includes(category)) {
                          pathName = 'workFlow'
                        }

                        // 将总部权限申请和分支机构权限申请都走新审核流
                        if (category === 5 && ([23,27].includes(nameId))) {
                          pathName = 'workFlow'
                        }

                        // 业务类型 为 网约车审批， 审批类型为  司机合伙人申请  ，走新的审批流页面
                        if(category === 1 && (nameId === 14 || nameId === 15)){
                            pathName = 'workFlow'
                        }

                        // operation: this.status == '1' ? 'agency' : ''
                        this.$router.push({
                          name: pathName,
                          query: {
                            row: JSON.stringify({ id: row.procInsId, taskId: row.taskId,nodeKey:row.nodeKey,type:'2' }),
                            id: row.procInsId,
                            taskId: row.taskId,
                            nodeKey:row.nodeKey,
                            type:'2'
                          }
                        });
                    }
                } else {
                    let pathName = category === 7 ? 'needApproval' : 'pendingAndApproval';

                    // 跳转到新工作流详情页
                    if ( FLOW_PATH.includes(category)) {
                      pathName = 'workFlow'
                    }

                    // 将总部权限申请和分支机构权限申请都走新审核流
                    if (category === 5 && ([23,27].includes(nameId))) {
                      pathName = 'workFlow'
                    }

                    if(category === 1 && (nameId === 14 || nameId === 15)){
                      pathName = 'workFlow'
                    }

                    // operation: this.status == '1' ? 'agency' : ''
                    this.$router.push({
                      name: pathName,
                      query: {
                        row: JSON.stringify({ id: row.procInsId, taskId: row.taskId, nodeKey:row.nodeKey,type: "3"}),
                        id: row.procInsId,
                        taskId: row.taskId,
                        nodeKey: row.nodeKey,
                        type: '3'
                      }
                    });
                }
            } catch (err) {
                console.log(err)
            }
        },
        judgeRouteQuery() {
            if (this.$route.query.status) {
                let routeStatus = this.$route.query.status;
                this.pendingType = '';
                this.approvalType = 'primary';
                this.showType = true;
                this.status = routeStatus;
            }
        },

        getApprovalStatusStyle(row) {
          if ([null, ''].includes(row.approvalStatus)) return ''

          return FLOW_STATUS[row.approvalStatus]['style']
        },

        getApprovalStatusText(row) {
          if ([null, ''].includes(row.approvalStatus)) return ''

          return FLOW_STATUS[row.approvalStatus].value
        }
    },
};
</script>

<style scoped lang="scss">
.main_content {
    position: relative;
    .topSearch {
        position: absolute;
        left: 56px;
        top: 44px;

        label {
            font-size: 14px;
            font-weight: 400;
            color: #606266;
        }
    }
    .topButton {
        position: absolute;
        left: 336px;
        top: 44px;
        display: flex;
        justify-content: left;
        .el-button {
            width: 124px;
            // height: 40px;
            margin-left: 0px;
        }
        .pendingBtn {
            border-top-left-radius: 4px;
            border-top-right-radius: 0;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 0;
        }
        .approvalBtn {
            border-top-left-radius: 0;
            border-top-right-radius: 4px;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 4px;
        }
    }
    ::v-deep.ws-table-warp {
        padding-top: 80px !important;
        .search-wrap {
            margin: 0 auto 20px;
            .search-item {
                label {
                    overflow: visible;
                    width: 70px !important;
                    flex: 0 0 70px !important;
                }
            }
            .statusText {
                display: inline-block;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 14px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                text-align: center;
            }
        }
        .option-box {
            margin-bottom: 20px;
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
        .right {
            float: right;
        }
    }
}
::v-deep.el-dialog .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
