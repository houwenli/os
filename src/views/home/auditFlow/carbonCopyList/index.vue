<template>
    <div class="carbonCopy">
        <ws-table-el ref="table" v-bind="tableConfig" highlight-current-row :col="8" :header-cell-style="{ background: '#F5F7FA' }">
            <!-- 头部筛选部分   -->
            <template #search>
                <search-group>
                    <label for>发起人ID：</label>
                    <el-input v-model.trim="searchOptions.startUserId" placeholder="请输入发起人ID" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>发起人：</label>
                    <el-input v-model.trim="searchOptions.startUserName" placeholder="请输入发起人姓名" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>手机号码：</label>
                    <el-input v-model.trim="searchOptions.startUserPhone" placeholder="请输入发起人手机号码" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>业务类型：</label>
                    <el-select v-model="busType" placeholder="请选择" min-width="353px" filterable>
                        <el-option v-for="item in businessTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>审核类型：</label>
                    <el-select v-model="searchOptions.approvalType" placeholder="请选择" min-width="353px" filterable>
                        <el-option v-for="item in checkTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>发起时间：</label>
                    <ws-date-range :startTime.sync="searchOptions.beginTime" :endTime.sync="searchOptions.endTime"></ws-date-range>
                </search-group>
                <search-group>
                    <label for>完成时间：</label>
                    <ws-date-range :startTime.sync="searchOptions.approveTimeBegin" :endTime.sync="searchOptions.approveTimeEnd"></ws-date-range>
                </search-group>
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
                <ws-table-column-el prop="categoryName" label="业务类型"></ws-table-column-el>
                <ws-table-column-el prop="name" label="审核类型"></ws-table-column-el>
                <ws-table-column-el prop="procdefNo" label="审批编号"></ws-table-column-el>
                <ws-table-column-el prop="startUserId" label="发起人ID"></ws-table-column-el>
                <ws-table-column-el prop="startUserName" label="发起人" width="80"></ws-table-column-el>
                <ws-table-column-el prop="startUserPhone" label="发起人手机号"></ws-table-column-el>
                <!-- <ws-table-column-el prop="startDeptName" label="发起人所属部门"></ws-table-column-el> -->
                 <ws-table-column-el prop="startDeptName" label="发起人所属部门" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-popover trigger="click" :content='scope.row.startDeptName' placement="top" width="200">
                            <span class='completeDuty' slot="reference">{{scope.row.startDeptNameSmall}}</span>
                        </el-popover>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="startTime" label="发起时间"></ws-table-column-el>
                <ws-table-column-el prop="finishTime" label="完成时间"></ws-table-column-el>
                <ws-table-column-el prop="flowProgress" label="流程节点"></ws-table-column-el>
                <ws-table-column-el prop="flowStatus" label="流程状态" width="150">
                    <template slot-scope="scope">
                        <span class="bg_none" :style="`${FLOW_STATUS[scope.row.flowStatus]['style']}`">{{ FLOW_STATUS[scope.row.flowStatus]['value'] }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="readFlag" label="阅读状态">
                    <template slot-scope="scope">{{ scope.row.readFlag == 0 ? '未读' : '已读' }}</template>
                </ws-table-column-el>
                <ws-table-column-el prop="copyToTime" label="抄送时间"></ws-table-column-el>
                <ws-table-column-el fixed="right" width="220" label="操作">
                    <template slot-scope="scope">
                        <!-- v-if="oaPowerList.details" -->
                        <el-button type="text" style="color: #0088ff" v-if="getModulePower('/index/todo').flowForm" @click="goDetail(scope.row)">详情</el-button>
                        <span v-else>--</span>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>
<script>
import { FLOW_STATUS, FLOW_PATH } from '@/utils/enum';
export default {
    name: 'carbonCopy',
    data() {
        return {
            moduleName: '/index/todo',
            busType: null,
            businessTypeList: [],
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
                        selectList: 'ccTaskList',
                        selectCount: 'ccCount'
                    },
                    beforeQuery: this.beforeQuery
                }
            },
            searchOptions: {
                startUserId: '',
                startUserName: '',
                startUserPhone: '',
                approvalType: '',
                categoryName: '',
                beginTime: '',
                endTime: '',
                approveTimeBegin: '',
                approveTimeEnd: ''
            },
            checkTypeList: [],
            dialogVisible: false,
            FLOW_STATUS
        };
    },
    created() {
        this.getBusinessOptions();
        this.getcheckList();
    },
    activated() {
        this.handleSearch();
    },
    watch: {
        busType: {
            handler(value) {
                this.searchOptions.approvalType = '';
                this.handleSearch();
                this.getcheckList();
                console.log(value);
            },
            deep: true
        }
    },
    methods: {
        handleReset() {
            this.busType = null;
            this.$refs.table.reset();
        },
        beforeQuery() {
            this.searchOptions.categoryName = this.busType;
            return this.searchOptions;
        },
        //获取业务类型选项
        getBusinessOptions() {
            let opt = {
                op: 'businessType'
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
                        id: this.busType ? this.busType : 0
                    }
                },
                op: 'workflowName'
            };
            this.$axios(this.getModuleUrl(opt.op), opt).then(res => {
                const { data } = res;
                this.checkTypeList = JSON.parse(data);
            });
        },
        //点击详情跳转后更改阅读状态
        changeReadStatus(readId) {
            let opt = {
                data: {
                    id: readId
                },
                op: 'readUpdate'
            };
            this.$axios(this.getModuleUrl(opt.op), opt).then(res => {
                const { code, msg } = res;
                if (code === 1) {
                    console.log(msg);
                    this.handleSearch(); // 跳转详情后刷新表格呈现已读状态
                }
            });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        goDetail(row) {
          const category = Number(row.category)
          const nameId = row.nameId

            let pathName = category === 7 ? 'needApproval' : 'pendingAndApproval';

            // 跳转到新工作流详情页
            if ( FLOW_PATH.includes(category)) {
              pathName = 'workFlow'
            }

            // 将总部权限申请和分支机构权限申请都走新审核流
            if (category === 5 && ([23,27].includes(nameId))) {
              pathName = 'workFlow'
            }

            // 业务类型 为 网约车审批， 审批类型为  司机合伙人申请/司机合伙人补充资料  ，走新的审批流页面
            if(category === 1 && (nameId === 14 || nameId === 15)) {
              pathName = 'workFlow'
            }

            this.$router.push({
              name: pathName,
              query: {
                row: JSON.stringify({ id:row.procInsId,nodeKey:row.nodeKey,type:'4',ccTaskId:row.id}),
                id:row.procInsId,
                nodeKey:row.nodeKey,
                type:'4',
                ccTaskId:row.id
              }
              });
            this.changeReadStatus(row.id);
        },
        handleSearch() {
            this.$refs.table.search();
        }
    }
};
</script>
<style lang="scss" scoped>
.carbonCopy {
    ::v-deep.ws-table-warp {
        .search-wrap {
            margin: 0 auto 20px;
            .search-item {
                label {
                    overflow: visible;
                    width: 70px !important;
                    flex: 0 0 70px !important;
                }
            }
        }
        .option-box {
            margin-bottom: 20px;
        }
        .right {
            float: right;
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
    }
}
</style>
