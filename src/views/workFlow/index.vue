<template>
    <div class="pendingAndApproval">
        <!-- 组件中自动计算column宽度 只计算第一个el-table中的el-table__body-wrapper 此处先把弹窗table的放在前面-->
        <processPointDia
            :personList="personList"
            :procinstId="processId"
            v-if="showDiaList"
            :showProcessPerson="showDiaList"
            @closepop="closepop"
            :personType="1"
            :isStartUser="isStartUser"
        />

        <div class="bgBox">
            <!-- 流程图 组件 公用的 -->
            <steps v-if="getModulePower('/index/todo').approvalStep" :dataList="stepData" :stepId="processListId" :processId="processId" @showPerList="jumpDia"></steps>

            <!-- 不同的业务类型+审核类型  拿到不同的审批流详情组件 -->
            <!-- { ...nodeFormJson, ...row } -->
            <component :is="componentName" v-if='hasDetailData' :dataObject="detailData" ref="parser" />

            <!-- 审批流程记录 组件 公用的 -->
            <pointRecordList v-if='processId' :processId="processId" :key="refreshLogKey"></pointRecordList>
        </div>

        <footerBtns
          v-if='row'
          :detail='row'
          :taskId='taskId'
          :procinstId='processId'
          :currentNodesUserIds='currentNodesUserIds'
          :flowStatus="flowStatus"
          @approval-handler="handleApproval"
          ref="footerBtns"
          @onComment="onComment"
        />

        <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" :center="true" append-to-body>
            <p class="dialogCon">{{ errorMsg }}</p>
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
// 批量查询flowMould 下面的组件，进行注册
import flowMould from './mould';
import steps from './components/steps.vue';
import pointRecordList from './components/pointRecordList';
import footerBtns from '@/views/home/auditFlow/components/footerBtns.vue'
import processPointDia from '@/views/home/auditFlow/components/processPointDia.vue'
import mouldConfig from './mouldConfig';

export default {
    name: 'workFlow',
    components: {
        steps,
        processPointDia,
        pointRecordList,
        footerBtns,
        ...flowMould,
    },

    data() {
        return {
            moduleName: '/index/todo',
            row: null,
            processId: '',
            taskId: '',
            refreshLogKey:'',
            processListId: '',
            flowStatus: 0,
            categoryName: '',
            category: '',
            flowNameId: '',
            showDiaList: false,
            isStartUser: false,
            // 数据结构[{ nodeName: '发起申请',  approvalType: '发起申请', approvalStatus: '已完成',detailTitel:'杨过过',approvalTime:'2022-2-17 12:00'}]
            stepData: [],
            personList: [], //dialog弹窗数组
            nodeFormJson: null,
            centerDialogVisible: false,
            errorMsg: '',
            componentName: '',

            // 当前节点用户ids
            currentNodesUserIds: [],
            id: null,

            detailData: {
              nodeFormJson: {
                clientType: "",
                roleId: "",
                textarea: "",
                time: "",
                roleType: "",
                type: null,
                powerType: "",
                funcType: "",

                params: {}
              }
            },

            hasDetailData: false
        };
    },


    created() {
      let row = JSON.parse(this.$route.query.row);
      this.taskId = row.taskId;
      this.id = row.id

      this.getFlowDetail();
    },

    methods: {
        // 获取流程模块名称
        getComponentName() {
            let { category,  nameId } = this.detailData;
            let activityType = this.detailData.nodeFormJson.activityType
            let result = mouldConfig[category];

            // category 老的系统，可能大的业务类型类目对应的就只用一个审核类型，且category的值就是nameId的值，所以是字符串判断
            if (Object.prototype.toString.call(result) === '[object String]') {
                this.componentName = result;
            } else {
              // 营销活动都是用 activityType去找组件名
              this.componentName = result[activityType || nameId];
            }

            console.log(`[debug-views/workFlow/index] category=${category}`, `id=${activityType || nameId}`, `组件名称===${this.componentName}`);
        },
        onComment(){
            this.refreshLogKey= Date.now()
        },
        async getFlowDetail() {
            try {
                let opt = {
                    procinstId: this.id,
                    taskId: this.taskId,
                    op: 'flowDetail',
                };
                let res = await this._axios(opt, '', '/new/flowable/form/select');
                if (res.code === 1) {
                    const data = res.data;

                    // 下面的展平动作，在司机合伙人场景， 因为name字段重名了， 所有增加一个前端使用的自定义字段
                    data.feApprovalTypeName = data.name

                    if (data.nodeFormJson) {
                      data.nodeFormJson =  JSON.parse(data.nodeFormJson)

                      if (data.nodeFormJson.params) {
                        let p = JSON.parse(data.nodeFormJson.params)
                        // params在nodeFormJson里面还是字符串json 目前未使用，暂不处理
                        data.nodeFormJson = {...data.nodeFormJson, ...p}
                      }
                    } else {
                      data.nodeFormJson = {}
                    }

                    this.row = data
                    this.processId = this.id;
                    this.processListId = this.row.procDefId;
                    this.flowStatus = this.row.flowStatus;
                    this.categoryName = this.row.categoryName;

                    // 业务类型
                    this.category = this.row.category;
                    this.flowNameId = this.row.nameId;
                    // 审批节点的数据
                    this.nodeFormJson = data.nodeFormJson
                    // let activeityData = this.nodeFormJson.params ? JSON.parse(this.nodeFormJson.params) : {};

                    // this.nodeFormJson = { ...this.nodeFormJson, ...activeityData };

                    // 之前就是将数据展平
                    this.detailData = {...data, ...data.nodeFormJson}

                    // this.getComponentName({ ...this.row, ...this.nodeFormJson });
                    this.getComponentName()
                    this.getStepsData();

                    // 控制子组件渲染-内部可能会依赖详情接口，二次请求数据的场景
                    this.hasDetailData = true
                }
            } catch (err) {
                console.log(err)
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
                op: 'approvalStep'
            };

            try {
              const res = await this.$axios(this.getModuleUrl(opt.op), opt)

              let list = JSON.parse(res.data) || []

              this.stepData = list;

              // 拿到当前节点的人员ids

              const node = this.stepData.find(p => p.approvalStatus === '3')

              if (node) {
                // 拿到当前节点人员id, 避免加抄/转交中选中的人重复
                this.currentNodesUserIds = (node.userIds || '').split(',')
              }
            } catch (error) {
              console.log('报错---流程节点', error)
            }
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        /**
         * @param {Number} type 0-通过; 1-拒绝
         * @param {Object} approvalForm
         * @param {Object} rest 包含多个参数
         */
        async handleApproval({ type, approvalForm, ...rest }) {
          let row={...JSON.parse(this.$route.query.row),id: this.id, taskId: null}
          const refreshPageState = () => {
            // 后加签以后-是没有流程id的 所有需要删除taskId
            this.taskId = null
            // 路由跳转
            this.$router.replace({
              name: 'workFlow',
              query: {
                row: JSON.stringify(row),
                t: Date.now()
              }
            });
          }

            let queryData = {
                taskId: this.taskId,
                nodeFormJson: JSON.stringify(this.row.nodeFormJson),
                procinstId: this.processId,
               ...rest
            };

            // 总部权限申请和分支机构权限申请
            if (this.row.category === '5' && [23,27].includes(this.row.nameId)) {
              // 首页的权限申请入口
              queryData.depict = 's'
            }

            let op = type == 0 ? 'complete' : 'reject';
            let query = {
                op: op,
                ...queryData
            };

            try {
              const res = await this._axios(query, '/index/todo')

              if (res.code == 1) {
                  this.$message.success(type == 0 ? '审批成功' : '拒绝成功');

                  // 加签成功 + 后加签， 直接查详情
                  if (type === 0 && rest.changeType === 2) {
                    refreshPageState()
                  } else {
                    this.$router.push({
                      name: "index"
                    })
                  }
              } else {
                  this.$refs.footerBtns.showPassDia = false;
                  this.errorMsg = res.msg;
                  this.centerDialogVisible = true;
              }
            } catch (error) {
              // 在 app端签名后，web端再提交就直接调用详情接口刷新
              if (error.code === 0 && error.msg === '此审核流程状态变更' || error.code === -108) {
                refreshPageState()
              }
            }
        },
        jumpDia(val, personList, isStartUser) {
            this.showDiaList = val;
            this.personList = personList.split(',');

            // 总部权限申请和分支机构权限申请
            if (this.detailData.category === '5' && [23,27].includes(this.row.nameId)) {
              // 以前代码就是一直为false
              this.isStartUser = false;
            } else {
              this.isStartUser = isStartUser;
            }
        },
        closepop() {
            this.showDiaList = false;
        },
        enterPas() {
          this.centerDialogVisible = false;
          this.$router.push({
            name: "index"
          })
        }
    },
};
</script>
<style lang="scss" scoped>
.pointRecordList{
    margin-bottom: 60px;
    /deep/ .ws-table-warp{
        min-height: 50vh !important;
    }
}
.pendingAndApproval {
    .bgBox {
        border-radius: 8px;
        background: #fff;
        min-height: 84vh;
        ::v-deep.block_container {
            width: 100%;
        }
    }
}

::v-deep.el-dialog .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
}
.dialogCon {
    text-align: center;
}

/deep/ .ws-table-warp {
    min-height: auto !important;
}
</style>
