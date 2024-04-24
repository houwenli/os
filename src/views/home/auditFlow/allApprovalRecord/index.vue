<template>
    <div class="allApprovalRecord">
        <ws-table-el ref="table" v-bind="tableConfig" highlight-current-row :col="8" :header-cell-style="{ background: '#F5F7FA' }">
            <!-- 头部筛选部分   -->
            <template #search>
                <search-group>
                    <label for>发起人类型：</label>
                    <el-select v-model="searchOptions.startType" placeholder="请选择" filterable clearable>
                        <el-option v-for="item in sponsorTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for v-if="[1,4].includes(searchOptions.startType)">所属机构：</label>
                    <label for v-if="[2, 3, ''].includes(searchOptions.startType)">所属部门：</label>
                    <OrgSelectComponent :startType="searchOptions.startType" v-model="organizationId" valueKey="id" :key="timer"></OrgSelectComponent>
                </search-group>
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
                    <el-select v-model="searchOptions.categoryName" placeholder="请选择" min-width="353px" filterable clearable @change="onChangeBusinessType">
                        <el-option v-for="item in businessTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>审核类型：</label>
                    <!-- 这里的auditType只是给用户看的， 实际提交字段为searchOptions.approvalTypeList  -->
                    <el-select v-model="auditType" placeholder="请选择" min-width="353px" filterable clearable @change="onChangeAuditType">
                        <el-option v-for="item in checkTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>流程状态：</label>
                    <el-select v-model="searchOptions.flowStatus" placeholder="请选择" clearable>
                        <el-option v-for="item in processStatusFilters" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>发起时间：</label>
                    <ws-date-range :startTime.sync="searchOptions.beginTime" :endTime.sync="searchOptions.endTime" clearable></ws-date-range>
                </search-group>
                <search-group>
                    <label for>完成时间：</label>
                    <ws-date-range :startTime.sync="searchOptions.approveTimeBegin" :endTime.sync="searchOptions.approveTimeEnd" clearable></ws-date-range>
                </search-group>
            </template>

            <template #options>
                <div style="float: right" v-if="allOpList.length">
                    <el-button-group>
                        <el-button class="searchBtn" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
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
                <ws-table-column-el prop="startType" label="发起人类型">
                    <template slot-scope="scope">{{ scope.row.startType | sponsorTypeFilters }}</template>
                </ws-table-column-el>
                <ws-table-column-el prop="startDeptName" label="发起人所属部门" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-popover trigger="click" :content="scope.row.startDeptName" placement="top" width="200">
                            <span class="completeDuty" slot="reference">{{ scope.row.startDeptNameSmall }}</span>
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
                <ws-table-column-el fixed="right" width="120" label="操作">
                    <template slot-scope="{ row }">
                        <el-button type="text" style="color: #0088ff" v-if="getModulePower('/index/todo').flowForm" @click="goDetail(row)">详情</el-button>
                        <el-button v-if="getRevokeButtonPermission(row)" type="text" style="color: #0088ff" @click="handleCancel(row)">撤销</el-button>
                    </template>
                </ws-table-column-el>

                <el-dialog title="撤销审批" :visible.sync="dialogVisible" width="30%" :center="true" append-to-body>
                    <span class="dialogCon">确认要撤销当前审批流吗?</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="clickDefine()">确定</el-button>
                    </span>
                </el-dialog>
            </template>
        </ws-table-el>
    </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import { FLOW_STATUS, FLOW_PATH } from '@/utils/enum';
import OrgSelectComponent from '../components/org-select.vue';
import { opsEnums } from './data.js';

export default {
    name: 'allApprovalRecord',
    components: {
        OrgSelectComponent,
    },
    data() {
        return {
            moduleName: '/index/todo',

            // 业务类型
            businessTypeList: [],
            timer:'',
            orgType: '',
            options: [],
            tableConfig: {
                filterColumns: false,
                lazyQuery: {
                    moduleName: '/index/todo',
                    op: {
                        selectList: 'startRecord',
                        selectCount: 'startRecordCount',
                    },
                    beforeQuery: this.beforeQuery,
                    immediate: false,
                },
            },
            //所属机构 给用户看的 实际传的机构id是searchOptions.startDeptId
            organizationId: '',
            // 审核类型 - 给用户看的， 实际提交查询使用的是下面的 approvalTypeList
            auditType: '',
            searchOptions: {
                startDeptId: '',
                agencyNumber: '',
                startType: '', //发起人类型
                searchFlag: '',
                startUserId: '',
                startUserName: '',
                startUserPhone: '',
                // 审核类型
                approvalTypeList: [],
                flowStatus: '',
                isApprove: '',
                // 业务类型
                categoryName: '',
                beginTime: this.$baseMethod.getBeforeDay(-7, 'yyyy-MM-dd 00:00:00'),
                endTime: this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd 23:59:59'),
                approveTimeBegin: '',
                approveTimeEnd: '',
            },
            checkTypeList: [],
            dialogVisible: false,
            procInsId: null,
            FLOW_STATUS,
            // 查询的所有op
            allOpList: [],
            // 撤销按钮所有op
            revokeOpList: [],
        };
    },
    computed: {
        ...mapState('auditFlow', ['processStatusFilters', 'sponsorTypeFilters']),
        ...mapGetters('login', ['menuList']),
    },
    created() {
        this.getOpList();
    },
    // 改用mounted 详情点击返回保留发起类型选项  但是不知道会有其他问题不 2023年5月12日17:45:19
    mounted(){
        //如果是超管账号 不调用 this.judgmentRole()；
        if (sessionStorage.getItem('roleOption')) {
            this.orgType = JSON.parse(sessionStorage.getItem('roleOption')).orgType;
            this.judgmentRole();
        }
        this.handleSearch();
    },
    // activated() {
    //     //如果是超管账号 不调用 this.judgmentRole()；
    //     if (sessionStorage.getItem('roleOption')) {
    //         this.orgType = JSON.parse(sessionStorage.getItem('roleOption')).orgType;
    //         this.judgmentRole();
    //     }

    //     this.handleSearch();
    // },
    methods: {
        judgmentRole() {
            if ([0, 4, 5].includes(this.orgType)) {
                this.searchOptions.startType = 2;
            }
            if ([20, 30].includes(this.orgType)) {
                this.searchOptions.startType = 3;
            }
            if(this.orgType===40){
                this.searchOptions.startType = 1;
            }
        },
        getOpList() {
          // op 是配置在 首页路由下的
        //   op位置不固定，可能配置在菜单，可能在基础配置里，并且可能交换位置
          const baseMenuMap=this.$store.getters['login/baseMenuMap']
          let res = this.menuList.find(item => item.resourcesUrl === '/index')

          if (!res) return

          // 拿到待办的op列表
          let agencyOps = res.children.find(item => item.resourcesUrl === '/index/todo')
         
          // 为空 则表示 没有配置全部审批记录这个op
          if (!agencyOps&&!Object.keys(baseMenuMap).length) return

          // 待办里面的所有op
          const allOpList = agencyOps?agencyOps.children : []

          // 拿到全部审批记录-查询的op
          let searchOps = allOpList.find(item => item.resourcesUrl === '/allApprovalRecord/search/ops')
          // 为空 则表示 没有配置全部审批记录这个op
          if (!searchOps&&!Object.keys(baseMenuMap).length) return

          let revokeOpList = allOpList.find(item => item.resourcesUrl === '/allApprovalRecord/revoke/ops')
          
          if (revokeOpList) {
              // 拿到所有撤销的op权限
              this.revokeOpList = (revokeOpList.children || []).map(p => p.op)
            }
          this.allOpList = searchOps?searchOps.children : []
          let ops = this.allOpList.map(p => p.op)
          
          ops=[...Object.keys(baseMenuMap),...ops]
          let collections = opsEnums.map(item => {
            const list = item.list.filter(p => ops.includes(p.op))

            return {
              ...item,
              list
            }
          })
        console.log(collections)

          // 只要list 有长度， 说明就是有权限
          this.businessTypeList = collections.filter(p => p.list.length)
          // 默认初始化
          this.searchOptions.approvalTypeList =  this.businessTypeList.map(p => {
              return {
                // 大类
                categoryName: p.id,
                ops: p.list.map(p => p.id)
              }
            })
        },

        /**
         * 切换业务类型
         */
         onChangeBusinessType(val) {
          this.auditType = ''
          if(val === '') {
            this.checkTypeList = []
            // 拼接所有的
            this.searchOptions.approvalTypeList = this.businessTypeList.map(p => {
              return {
                // 大类
                categoryName: p.id,
                ops: p.list.map(p => p.id)
              }
            })
          } else {
            this.checkTypeList = this.businessTypeList.find(p => p.id === val).list

            this.searchOptions.approvalTypeList =  [{
              categoryName: val,
              ops: this.checkTypeList.map(p => p.id)
            }]
          }
        },

        /**
         * 切换审核类型
         * 清空这里的时候，一定是有  业务类型的
         */
         onChangeAuditType(val) {
          if (val === '') {
            // 清空 那的是  业务类型所有  有权限的op
            this.searchOptions.approvalTypeList = [{
              categoryName: this.searchOptions.categoryName,
              ops: this.checkTypeList.map(p => p.id)
            }]
          } else {
             this.searchOptions.approvalTypeList = [{
              categoryName: this.searchOptions.categoryName,
              ops: [val]
             }]
          }
        },
        handleReset() {
            this.timer = new Date().getTime();
            this.organizationId='';
            this.auditType = ''
            this.$refs.table.reset();
            this.judgmentRole()
        },
        beforeQuery() {
            this.searchOptions.searchFlag = 'ALL';
            this.searchOptions.startDeptId=this.organizationId.id
            return this.searchOptions;
        },

        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        handleSearch() {
            this.$refs.table.search();
        },
        goDetail(row) {
          const category = Number(row.category)
          const nameId = row.nameId

          //判断审核类型是否为权限申请，如果是就跳转至'administrationApproval',不是就跳转至'pendingAndApproval'
          // category === 5 && (row.nameId === 23 || row.nameId === 27) ? 'administrationApproval' :
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
              row: JSON.stringify({ id:row.procInsId,type:'approveAll' }),
              id: row.procInsId,
              type: 'approveAll'
            }
          });
        },
        handleCancel(row) {
            this.dialogVisible = true;
            this.procInsId = row.procInsId;
        },
        clickDefine() {
            let data = {
                data: {
                    procinstId: this.procInsId,
                },
                op: 'flowBackout',
            };
            this.$axios(this.getModuleUrl('flowBackout'), data).then(res => {
                this.$message.success('撤销成功');
                this.handleSearch();
                this.dialogVisible = false;
            });
        },
        /**
         * 撤销按钮权限
         * 根据业务类型category + name  会确定一个撤销的op, 查询这个op 是否在配置的撤销op列表中，判断是否有撤销的权限
         */
         getRevokeButtonPermission(row) {
          let flowStatus = Number(row.flowStatus)
          let {category, name, nameId} = row

          // 大类的分类
          let categoryRes = opsEnums.find(p => p.id === Number(category))

          // 具体的op
          let revokeOp = categoryRes.list.find(p => p.name === name || p.id === nameId).revoke
          // 基础配置op
          const baseMenuMap=this.$store.getters['login/baseMenuMap']
          // 先判断权限
          if (!this.revokeOpList.includes(revokeOp)&&!baseMenuMap[revokeOp]) return false
          // 业务权限判断
          //审核状态 isCanRevoke true 可以撤销   false 不可撤销
          return [3,4].includes(flowStatus)&&row.isCanRevoke
        }
    }
};
</script>
<style lang="scss" scoped>
.allApprovalRecord {
    ::v-deep.ws-table-warp {
        .search-wrap {
            margin: 0 auto 20px;
            .search-item {
                label {
                    overflow: visible;
                    width: 80px !important;
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
::v-deep .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}
</style>
