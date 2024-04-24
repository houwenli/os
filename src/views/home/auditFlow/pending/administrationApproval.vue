<template>
    <div class="administrationApproval">
        <div class="ws-table-warp box">
            <!-- 组件中自动计算column宽度 只计算第一个el-table中的el-table__body-wrapper 此处先把弹窗table的放在前面-->
            <processPointDia
                v-if="showDiaList"
                :personList="personList"
                :procinstId="processId"
                :showProcessPerson="showDiaList"
                @closepop="closepop"
                :personType="1"
                :isStartUser="false"
            ></processPointDia>
            <!-- 节点 -->
            <steps v-if="getModulePower('/index/todo').approvalStep" :dataList="dataList" :processId="processId" :stepId="processListId" @showPerList="jumpDia"></steps>
            <!-- 发起信息 -->
            <div class="approve">
                <h3>
                    <span></span>
                    审批发起信息
                </h3>
                <div class="text">
                    <el-form ref="modifyForm" :model="dataRow" label-width="5.9375rem">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item prop="name" label="审批编号：">
                                    {{ dataRow.procdefNo }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="name" label="审批类型：">
                                    {{ dataRow.name }}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item prop="name" label="发起时间：">
                                    {{ dataRow.startTime }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="name" label="发起人：">
                                    {{ dataRow.startUserName }}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item prop="name" label="所属部门：">
                                    {{ dataRow.startDeptName }}
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
            <div class="approve">
                <h3>
                    <span></span>
                    申请原因
                </h3>
                <div class="text">
                    <el-form label-width="5.9375rem">
                        <el-form-item label="申请原因：">
                            {{ roleFrom.textarea }}
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <!-- 权限时效 -->
            <div class="prescription">
                <h3>
                    <span></span>
                    权限信息
                </h3>
                <div class="text">
                    <el-form ref="modifyForm" label-width="5.9375rem">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item prop="orgType" label="申请类型：">
                                    {{ roleData.applyPermissionType == 1 ? '个人' : '部门' }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="roleData.applyPermissionType == 2">
                                <el-form-item prop="orgType" label="使用部门：">
                                    {{ roleData.deptName }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="orgType" label="权限类型：">
                                    {{ roleFrom.powerType == '永久权限' ? '永久权限' : '临时权限' }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="roleFrom.powerType != '永久权限'">
                                <el-form-item prop="time" label="有效期至：">
                                    {{ $vuex.$baseMethod.formatData(roleFrom.time) }}
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>

            <div class="prescription" v-if="roleData.applyPermissionType == 2">
                <h3>
                    <span></span>
                    角色信息
                </h3>
                <el-tag
                    class="pointer"
                    v-for="(tag,index) in roleData.positions"
                    @click="clickTree(tag.id,index)"
                    :key="tag.id"
                    :closable="false"
                    :type="listStatus === index ? 'danger': 'info'"
                    >
                    {{tag.name}}
                </el-tag>
            </div>
            <!-- 权限展示 -->
            <div class="role" :key='refresh'>
                <!-- 功能 -->
                <div>
                    <h3>
                        <span></span>
                        功能权限
                    </h3>
                    <el-row>
                        <el-col :span="12">
                            <div class="tips">
                                <span></span>
                                <p>Web端oa</p>
                            </div>
                            <div class="funcRoleDetails">
                                <ws-tree
                                    v-if="roleFrom.roleId && selectPositionId"
                                    ref="tree"
                                    :defaultProps="defaultProps"
                                    node-key="id"
                                    v-loading="oaTreeDataLoading"
                                    :set-node-expand="setNodeExpand"
                                    @load="(node, resolve) => loadNodeMech(node, resolve, 'oa')"
                                    lazy
                                ></ws-tree>
                            </div>
                        </el-col>
                        <!-- oaTree -->
                        <el-col :style="{ paddingLeft: '12px' }" :span="12">
                            <div class="tips">
                                <span></span>
                                <p>云办公App</p>
                            </div>
                            <div class="funcRoleDetails">
                                <ws-tree
                                    v-if="roleFrom.roleId && selectPositionId"
                                    ref="tree"
                                    :defaultProps="defaultProps"
                                    node-key="id"
                                    v-loading="wsfTreeDataLoading"
                                    :set-node-expand="setNodeExpand"
                                    @load="(node, resolve) => loadNodeMech(node, resolve, 'wsf')"
                                    lazy
                                ></ws-tree>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <!-- 数据 -->
                <div v-if="roleFrom.funcType == '总部'">
                    <h3>
                        <span></span>
                        数据权限
                    </h3>
                    <el-row>
                        <!-- orgTree -->
                        <el-col :span="12">
                            <div class="tips">
                                <span></span>
                                <p>机构权限</p>
                            </div>
                            <div class="funcRoleDetails">
                                <ws-tree
                                    v-if="roleFrom.roleId && selectPositionId"
                                    ref="tree"
                                    :defaultProps="defaultProps"
                                    node-key="id"
                                    v-loading="orgTreeDataLoading"
                                    :set-node-expand="setNodeExpand"
                                    @load="(node, resolve) => loadNodeMech(node, resolve, 'org')"
                                    lazy
                                ></ws-tree>
                            </div>
                        </el-col>
                        <!-- cityTree -->
                        <el-col :style="{ paddingLeft: '12px' }" :span="12">
                            <div class="tips">
                                <span></span>
                                <p>城市权限</p>
                            </div>
                            <div class="funcRoleDetails">
                                <ws-tree
                                    v-if="roleFrom.roleId && selectPositionId"
                                    ref="tree"
                                    @load="(node, resolve) => loadNodeMech(node, resolve, 'city')"
                                    lazy
                                    v-loading="cityTreeDataLoading"
                                    :defaultProps="defaultProps"
                                    node-key="id"
                                    :set-node-expand="setNodeExpand"
                                ></ws-tree>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
             <!-- 审批流程记录 -->
            <pointRecordList v-if='processId' :processId='processId' :key="refreshLogKey"></pointRecordList>
        </div>

        <!-- 底部按钮 todo需要对参数进行重构下 -->
        <footerBtns
          v-if='processId'
          :detail='dataRow'
          :taskId='taskId'
          :procinstId='processId'
          :currentNodesUserIds='currentNodesUserIds'
          :flowStatus="dataRow.flowStatus"
          @approval-handler="handleApproval"
          @onComment="onComment"
          approveType="power"
          ref="footerBtns"
        />

        <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" :center="true" append-to-body>
            <span class="dialogCon">{{ errorMsg }}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <ws-throttle>
                    <el-button type="primary" @click="enterPas()">确 定</el-button>
                </ws-throttle>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import footerBtns from '../components/footerBtns';
import steps from '@/views/workFlow/components/steps.vue'
import wsTree from '@/components/Tree';
import pointRecordList from "@/views/workFlow/components/pointRecordList.vue"
import processPointDia from '../components/processPointDia';
export default {
    name: 'administrationApproval',
    components: {
        steps,
        wsTree,
        footerBtns,
        processPointDia,
        pointRecordList,
    },
    data() {
        return {

            //  发起信息
            dataRow: {
                name: '',
                type: '',
                time: '',
                user: '',
                branch: '',
                reason: '',
            },
            // 机构数据
            defaultProps: {
                id: 'id',
                label: 'name',
                children: 'children',
            },
            refreshLogKey:'',
            orgTreeDataLoading: false,
            cityTreeDataLoading: false,
            oaTreeDataLoading: false,
            wsfTreeDataLoading: false,
            treeDataLoading: false,
            moduleName: '/index/todo',
            // 权限统计
            roleData: {
                validTime: '',
                type: '',
                menuTree: [],
                applyPermissionType:'',
                deptName:'',
                positionNames:[]
            },
            // 权限时效信息
            roleFrom: {
                textarea: '',
                orgType: '',
                time: '',
            },
            dataList: [],
            isShowCheck: false,
            processListId: this.$route.query.procDefId,
            showDiaList: false,
            personList: [],
            centerDialogVisible: false,
            errorMsg: '',
            roleType: 1,
             // 审批流id
            processId: '',
            // 任务id
            taskId: '',
            procinstId: '',
            selectPositionId: null,
            refresh:0,
            listStatus:0,

            // 当前节点用户ids
            currentNodesUserIds: [],
            id: null
        };
    },
    created() {
        const row = JSON.parse(this.$route.query.row);

        this.taskId = row.taskId;
        this.id = row.id

        this.getDetailData()
    },
    methods: {
        async getDetailData() {
          this.procinstId = this.id;

          let opt = {
              data: JSON.stringify({
                  procinstId: this.id,
                  taskId: this.taskId
              }),
              op: 'flowDetail',
          };


          try {
            let { data } = await this.$axios('/new/flowable/form/select', opt);
            this.processId = this.id;

            this.dataRow = JSON.parse(data);
            let nodeFormJson = JSON.parse(JSON.parse(data).nodeFormJson);
            this.roleFrom = nodeFormJson;

            this.processListId = this.dataRow.procDefId;
            this.getStepsData();
            this.getRoleDate(this.roleFrom.roleId);
          } catch (error) {
          }
        },
        //根据角色查询机构权限树懒加载
        async loadNodeMech(node, resolve, type) {
            let id = node.data.id ? node.data.id : 0;
            let data = {}
            if(this.roleData.applyPermissionType == 2) {
                data = {
                    city: {
                        op: 'selectPermissionCityTreeLazy',
                        data: { roleId: this.roleFrom.roleId, id, positionId:this.selectPositionId},
                    },
                    org: {
                        op: 'selectPermissionOrgTreeLazy',
                        data: { roleId: this.roleFrom.roleId, id ,positionId:this.selectPositionId },
                    },
                    oa: {
                        op: 'selectPermissionMenuTreeLazy',
                        data: { roleId: this.roleFrom.roleId, id, clientType: 1 ,positionId:this.selectPositionId},
                    },
                    wsf: {
                        op: 'selectPermissionMenuTreeLazy',
                        data: { roleId: this.roleFrom.roleId, id, clientType: 2 ,positionId:this.selectPositionId},
                    },
                }[type];
            } else {
                data = {
                    city: {
                        op: 'selectPermissionCityTreeLazy',
                        data: { roleId: this.roleFrom.roleId, id},
                    },
                    org: {
                        op: 'selectPermissionOrgTreeLazy',
                        data: { roleId: this.roleFrom.roleId, id },
                    },
                    oa: {
                        op: 'selectPermissionMenuTreeLazy',
                        data: { roleId: this.roleFrom.roleId, id, clientType: 1 },
                    },
                    wsf: {
                        op: 'selectPermissionMenuTreeLazy',
                        data: { roleId: this.roleFrom.roleId, id, clientType: 2 },
                    },
                }[type];
            }

            if (node.level == 0) {
                this[`${type}TreeDataLoading`] = true;
                let arr = await this.getTree(data);
                this.$nextTick(() => {
                    resolve(arr || []);
                });
                this[`${type}TreeDataLoading`] = false;
            }
            if (node.level > 0) {
                let arr = await this.getLoadTree(data);
                this.$nextTick(() => {
                    resolve(arr || []);
                });
            }
        },
        onComment(){
            this.refreshLogKey= Date.now()
        },
        //获取第一级树
        async getTree(data) {
            let res = await this.$axios('/authority/permissionApply/select', data);
            if (res.code == 1) {
                let data = JSON.parse(res.data);
                return data;
            }
        },
        //懒加载下一级接口
        async getLoadTree(data) {
            let res = await this.$axios('/authority/permissionApply/select', data);
            if (res.code == 1) {
                let data = JSON.parse(res.data);
                return data;
            }
        },
        setNodeExpand() {},
        /**
         * @param {Number} type 0-通过; 1-拒绝
         * @param {Object} approvalForm
         * @param {Object} rest 包含多个参数
         */
        async handleApproval({ type, approvalForm, ...rest }) {
          const refreshPageState = () => {
            // 后加签以后-是没有流程id的 所有需要删除taskId
            this.taskId = null
            let row={...JSON.parse(this.$route.query.row),id: this.id, taskId: null}
            // 路由跳转
            this.$router.replace({
              name: 'administrationApproval',
              query: {
                row: JSON.stringify(row),
                t: Date.now()
              }
            });
          }

          let queryData = {
              taskId: this.taskId,
              nodeFormJson: this.dataRow.nodeFormJson,
              procinstId: this.procinstId,
              depict: 's',
              ...rest
          };

          let op = type == 0 ? 'complete' : 'reject';
          let query = {
              op: op,
              data: JSON.stringify(queryData),
          };

            try {
                await this.$axios(this.getModuleUrl(query.op), query);

                this.$message.success(type == 0 ? '审批成功' : '拒绝成功');

                 // 加签成功 + 后加签， 直接查详情
                if (type === 0 && rest.changeType === 2) {
                  refreshPageState()
                } else {
                  this.$router.go(-1);
                }
            } catch (error) {
                // 在 app端签名后，web端再提交就直接调用详情接口刷新
                if (error.code === 0 && error.msg === '此审核流程状态变更' || error.code === -108) {
                  refreshPageState()
                }

                this.$refs.footerBtns.showPassDia = false;
                this.errorMsg = error.msg;
                this.centerDialogVisible = true;
            }
        },
         /**
         * 拿到审批流程的节点数据
         */
        async getStepsData() {
            let opt = {
                data: {
                    procinstId: this.processId,
                    procdefId: this.processListId,
                },
                op: 'approvalStep',
            };

            try {
              const res = await this.$axios(this.getModuleUrl(opt.op), opt)

               const { code, data } = res;
                if (code == 1) {
                    this.dataList = JSON.parse(data);
                    // 拿到当前节点的人员ids

                    const node = this.dataList.find(p => p.approvalStatus === '3')

                    if (node) {
                      // 拿到当前节点人员id, 避免加抄/转交中选中的人重复
                      this.currentNodesUserIds = (node.userIds || '').split(',')
                    }
                }
            } catch (error) {
            }
        },
        // 详情
        async getRoleDate(id) {
            try {
                this.treeDataLoading = true;
                let param = {
                    op: 'personDetail',
                    data: {
                        id,
                    },
                };
                let roleRes = await this.$axios('/authority/permissionApply/select', param);
                let data = JSON.parse(roleRes.data);
                this.roleData = data;

                this.selectPositionId = this.roleData.positions ? this.roleData.positions[0].id : true
                this.listStatus = 0
                this.treeDataLoading = false;
            } catch (error) {
                console.log(error);
            }
        },
        // 打开弹窗
        jumpDia(val, personList) {
            this.showDiaList = val;
            this.personList = personList.split(',');
        },
        // 关闭弹窗
        closepop() {
            this.showDiaList = false;
        },
        enterPas() {
            this.centerDialogVisible = false;
            this.$router.go(-1);
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        clickTree(id,index) {
            if(this.listStatus != index) {
                this.selectPositionId = id
                this.refresh = Date.now()
                this.listStatus = index
            }
        }
    },
};
</script>
<style lang="scss" scoped>
.approve,
.prescription,
.role {
    padding: 0 40px;
    h3 {
        height: 70px;
        font-size: 16px;
        font-weight: 400;
        color: #303133;
        line-height: 80px;
        span {
            display: inline-block;
            width: 4px;
            height: 16px;
            background: #f05259;
            border-radius: 0px 84px 84px 0px;
        }
    }
    .text {
        padding: 20px 102px 2px 82px;
        background: #f5f7fa;
        border-radius: 8px;
        min-height: 50px;
    }
    .tips {
        height: 16px;
        span {
            display: inline-block;
            width: 12px;
            height: 12px;
            background: #c0c4cc;
            border-radius: 50%;
            margin-right: 8px;
        }
        i {
            font-style: normal;
            color: #f05259;
        }
        font-size: 12px;
        font-weight: 400;
        color: #303133;
        p {
            display: inline-block;
            font-size: 14px;
            font-weight: 500;
            color: #303133;
            margin-right: 8px;
        }
    }
    .tipsCity {
        margin-top: 20px;
    }
    .funcRoleDetails,
    .orgRoleDetails,
    .cityRoleDetails {
        overflow: auto;
        height: 556px;
        width: 100%;
        margin-top: 16px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        padding: 16px;
    }
    .orgRoleDetails,
    .cityRoleDetails {
        height: auto;
    }
}
.approve {
    .text {
        /deep/.el-form-item__content {
            word-wrap: break-word;
        }
    }
}
.box {
    margin-bottom: 60px;
}

.prescription .text {
    padding: 8px 82px;
    .el-form-item {
        margin-bottom: 0;
    }
}
/deep/.el-form-item__label {
    font-weight: 400;
}

/deep/.ws-table-warp .option-box {
    margin-top: 0;
    margin-bottom: 0;
}
.ws-table-warp .search-wrap .search-item {
    margin-top: 16px;
    padding-left: 0;
}

/deep/.ws-table-warp .paginationClass {
    height: 40px;
    padding: 5px 0;
    background: #f5f7fa;
    .el-pagination__editor.el-input {
        .el-input__inner {
            background: #f5f7fa;
        }
    }
    .btn-next,
    .btn-prev,
    .el-pager li {
        background: #f5f7fa;
    }
    .el-pagination .el-select .el-input .el-input__inner {
        background: #f5f7fa;
    }
}

/deep/ .node-content-level1 {
    font-size: 14px !important;
}
/deep/.el-loading-mask {
    z-index: 998 !important;
}
.pointer {
    cursor: pointer;
    margin-right: 20px;
}
</style>
