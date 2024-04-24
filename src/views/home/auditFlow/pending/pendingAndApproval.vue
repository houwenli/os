<template>
    <div class="pendingAndApproval">
        <!-- 组件中自动计算column宽度 只计算第一个el-table中的el-table__body-wrapper 此处先把弹窗table的放在前面-->
        <processPointDia :personList="personList" :procinstId='processId' v-if="showDiaList"
            :showProcessPerson="showDiaList" @closepop="closepop" :personType="1" :isStartUser="isStartUser">
        </processPointDia>

        <div class="bgBox">
          <!-- 审批节点流程 组件 -->
            <steps v-if="getModulePower('/index/todo').approvalStep" :dataList="stepData" :sosData="nodeFormJson" :stepId="processListId"
                :processId="processId" @showPerList="showPerList" />

            <!-- 网约车 出租车 行政（通用）自动生成 其他类型采用动态组件 -->
            <RenderFields :formFields="fieldData" :dataObject="formData" ref="parser" :fieldStatus="fieldStatus" />
            <component :is="getComponent" :dataObject="row" :nodeFormJson="nodeFormJson" :category="category" @formHandle="formHandle"
                ref="componentList" />

            <!-- 网约车 司机入网审核和司机修改资料审核 添加审核不通过原因 -->
            <reasonRefuse class="reason-refuse" v-if="[1,2].includes(flowNameId) && processId && [2,7].includes(flowStatus)" :dataList="refuseList"></reasonRefuse>
            <!-- 审批流程记录 -->
            <pointRecordList @get-data="getData" :flowNameId='flowNameId' :flowStatus='flowStatus' v-if='processId' :processId='processId' :key="refreshLogKey"></pointRecordList>
        </div>

        <!-- 底部按钮 -->
        <footerBtns
          v-if='row'
          :detail='row'
          :taskId='taskId'
          :procinstId='processId'
          :currentNodesUserIds='currentNodesUserIds'
          :flowStatus="flowStatus"
          @approval-handler="handleApproval"
          @onComment-handler="handlerOnComment"
          ref="footerBtns"
          @onComment="onComment"
        />
        <!--   :operation="operation" -->


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
// 审批节点流程 组件
import steps from '@/views/workFlow/components/steps.vue'
// 审批流程记录
import pointRecordList from "@/views/workFlow/components/pointRecordList.vue"
import footerBtns from '../components/footerBtns.vue';
// 节点人员列表 弹窗
import processPointDia from '../components/processPointDia.vue';
import RenderFields from './components/RenderFields/render';
import { fields as fakeFiledsData, fieldsMapper } from './components/RenderFields/data';
import { _axios } from '@/utils/commMethods';
//审批表单
import inductionApproval from './approvalComponent/inductionApproval'; //入职审批
import becomManageApproval from './approvalComponent/becomManageApproval'; //转正审批
import transferManageApproval from './approvalComponent/transferManage'; //调岗审批
import quitApproval from './approvalComponent/quitApproval'; //离职审批
import selfQuitApproval from './approvalComponent/selfQuitApproval'; //个人离职审批
import medicalReportApproval from './approvalComponent/medicalReportApproval'; //司机医学检测报告审核

//机构申请表单
import changebranchApproval from './approvalComponent/changebranchApproval.vue'; //分公司申请
import corporationApproval from './approvalComponent/corporationApproval.vue'; //独立法人
import openStoreApproval from './approvalComponent/openStoreApproval.vue'; //开店
import serviceCenterApproval from './approvalComponent/serviceCenterApproval.vue'; //服务中心
import storeApproval from './approvalComponent/storeApproval.vue'; //实体店

// 实体店开业
import storeConsolidationApproval from './approvalComponent/storeConsolidationApproval.vue'; //门店合并
import transferMechanismApproval from './approvalComponent/transferMechanismApproval.vue'; //转移机构
import openingChangeApproval from './approvalComponent/openingChangeApproval.vue'; //开业变更

import personChangeApproval from './approvalComponent/personChangeApproval.vue'; //机构人员
//卡卷审批
import couponReplenishment from './approvalComponent/couponReplenishment.vue'; //卡卷补量申请
import couponConfigure from './approvalComponent/couponConfigure.vue'; //卡卷配置申请
import addCarApproval from './approvalComponent/addCarApproval.vue'; //福卡申领申请
import ecommercecoupon from './approvalComponent/ecommercecoupon.vue'//电商优惠券
import addecommercecoupon from './approvalComponent/addecommercecoupon.vue'
import electric from './approvalComponent/electric.vue' //换电券配置
import electricAdd from './approvalComponent/electricAdd.vue' //换电券配置
import errorOrderApproval from './approvalComponent/errorOrderApproval.vue'; //异常订单
import compensateContent from './approvalComponent/compensateContent.vue'; //出行券配置补偿申请
import workOrderApprovalBusiness from './approvalComponent/workOrderApprovalBusiness.vue'; //业务反馈工单
import sosInfo from './approvalComponent/sosInfo.vue'; //求救工单
import {componentNameMap} from './data.js'

import reasonRefuse from './approvalComponent/reasonRefuse.vue'

export default {
    name: 'pendingAndApproval',
    components: {
        steps,
        processPointDia,
        pointRecordList,
        footerBtns,
        RenderFields,
        inductionApproval,
        becomManageApproval,
        transferManageApproval,
        quitApproval,
        selfQuitApproval,
        changebranchApproval,
        corporationApproval,
        openStoreApproval,
        serviceCenterApproval,
        storeApproval,
        storeConsolidationApproval,
        transferMechanismApproval,
        openingChangeApproval,
        personChangeApproval,
        medicalReportApproval,
        couponConfigure,
        couponReplenishment,
        addCarApproval,
        errorOrderApproval,
        compensateContent,
        ecommercecoupon,
        addecommercecoupon,
        electric,
        electricAdd,
        reasonRefuse,
        workOrderApprovalBusiness,
        sosInfo,
    },

    data() {
        return {
            moduleName: '/index/todo',
            // 详情数据
            refreshLogKey:'',
            row: null,
            fieldStatus: 1, //0：可审批驳回 1：代表详情
            formConfOpen: false,
            formData: {},
            fieldsData: null,
            fakeFiledsData,
            fieldsMapper,
            // 审批流id
            processId: '',
            // 任务id
            taskId: '',
            processListId: '',
            flowStatus: 0,
            categoryName: '',
            category: '',
            flowNameId: '',
            showDiaList: false,
            isStartUser: false,
            // 数据结构[{ nodeName: '发起申请',  approvalType: '发起申请', approvalStatus: '已完成',detailTitel:'杨过过',approvalTime:'2022-2-17 12:00'}]
            stepData: [],
            refuseList: [],
            fieldData: {},
            personList: [], //dialog弹窗数组
            nodeFormJson: null,
            centerDialogVisible: false,
            errorMsg: '',
            componentNameMap: componentNameMap,
            newForm: {},

            // 当前节点用户ids
            currentNodesUserIds: [],
            id: null
        };
    },

    beforeRouteEnter(to, from, next) {
        to.meta.activeTags = from.name;
       next()
    },
    computed: {
        getComponent() {
            //判断是否动态生成
            if (this.flowNameId && this.category) {
                let isExit = fakeFiledsData.some(fieldData => {
                    return fieldData.approvalType == this.flowNameId && fieldData.categoryName == this.category;
                });
                if (!isExit) {
                    //生成动态组件
                    let approvalComponentName = (this.componentNameMap.find(item => item.flowNameId == this.flowNameId) || {}).componentName || '';
                    return approvalComponentName;
                } else {
                    return null;
                }
            }

            return null;
        },
    },
    created() {
        let row = JSON.parse(this.$route.query.row);
        console.log(row)
        this.taskId = row.taskId;
        this.id = row.id

       this.getDetailData()
    },
    methods: {
        // 获取加密后的文件新路径
        async getAuthfileUrl() {
            let key = 'attachmentInfoList'
            let urls = []
            switch(this.flowNameId){
                case 30: // 分公司变更申请
                case 31: // 服务中心变更申请
                case 32: // 实体店变更申请
                    key="attachmentInfoList"
                    urls = this.nodeFormJson.attachmentInfoList.map(({imgUrl}) =>imgUrl)
                    break
                case 33: // 实体店附件变更申请
                    key=""
                    break
                case 35: // 独立法人公司申请
                    key="rpcFileAos"
                    urls = this.nodeFormJson.rpcFileAos.map(({imgUrl}) =>imgUrl)
                    // urls = this.nodeFormJson.rpcFileAos.map((item) =>{
                    //     item.imgUrl = JSON.parse(imgUrl).publicDownUrl
                    //     return item
                    // })
                    break
                case 37: // 机构人员变动申请
                    key=""
                    break
            }
            let opt = {
                data: {
                    urls
                },
                op: 'newUrl',
            };

          try {
            const res = await this.$axios('/new/flowable/form/select', opt)
            let result = JSON.parse(res.data);
            this.nodeFormJson[key] = this.nodeFormJson[key].map((item,index) => {
                item.imgUrl = result.urls[index]
                return item
            })
          } catch (error) {
          }
        },
        async getDetailData() {
          let opt = {
            data: JSON.stringify({
                procinstId: this.id,
                taskId: this.taskId
            }),
            op: 'flowDetail',
          };

          try {
            const res = await this.$axios('/new/flowable/form/select', opt)

              this.row = JSON.parse(res.data);
              this.processId = this.id;
              this.processListId = this.row.procDefId;
              this.flowStatus = this.row.flowStatus;
              this.categoryName = this.row.categoryName;
              this.nodeFormJson = JSON.parse(this.row.nodeFormJson);
              this.category = this.row.category;
              this.flowNameId = this.row.nameId;
                //   统一处理改动较大
                //   //  机构审批图片权限处理
                //   if(this.row.category == 3) {
                //     this.getAuthfileUrl()
                //   }
              this.getNodeFormData();
              this.getStepsData();

          } catch (error) {

          }
        },
        //获取审批流程记录的数据
        getData(data) {
            if (data && data.length) {
                let remarkSrting = JSON.parse(data[0].remark);;
                this.refuseList = [];
                for (let key in remarkSrting) {
                    if (remarkSrting[key].length) {
                        this.refuseList.push({
                            dataType: key,
                            dataValue: remarkSrting[key].toString()
                        });
                    }
                }
            }
        },
        //评论成功之后 刷新审批流程记录
        onComment(){
            this.refreshLogKey= Date.now()
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
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
                  let list = JSON.parse(res.data) || []

                  this.stepData = list;

                  // 拿到当前节点的人员ids

                  const node = this.stepData.find(p => p.approvalStatus === '3')

                  if (node) {
                    // 拿到当前节点人员id, 避免加抄/转交中选中的人重复
                    this.currentNodesUserIds = (node.userIds || '').split(',')
                  }
                }
            } catch (error) {
              console.log(error)
            }
        },
        handleBackData() {
            //处理业务系统的垃圾数据
            let approvalData = {
                _approvalName: this.row.name,
                _startUserName: this.row.startUserName,
                _procInsId: this.row.procdefNo,
                _startTime: this.row.startTime,
                _positionName: this.row.startDeptName,
            };
            if (this.row.nameId == 11) {
                //订单异常的
                this.formData =
                    Object.assign(
                        {
                            ...this.nodeFormJson.exceptionOrderProcessInfo.exceptionOrderMoneyDetail,
                            ...this.nodeFormJson.exceptionOrderProcessInfo.exceptionOrderBaseInfoVo,
                            passengerPayRecords: this.nodeFormJson.exceptionOrderProcessInfo.passengerPayRecords,
                        },
                        { ...approvalData }
                    ) || {};
            } else {
                if (this.row.nameId == 10) {
                    //司机头像的
                    this.nodeFormJson.fileList = this.nodeFormJson.fileAoList.filter(item => {
                        return ['.pdf', '.doc', '.ppt', '.docx'].includes(item.fileSuffix);
                    });
                    let imgList = this.nodeFormJson.fileAoList.filter(item => {
                        return ['.jpg', '.png'].includes(item.fileSuffix);
                    });

                    this.nodeFormJson.attachmentList = imgList.map(item => {
                        return {
                            src: item.cdnUrl,
                            title: item.fileName,
                        };
                    });
                } else if (this.row.nameId == 6) {
                    this.nodeFormJson.attachmentList = this.nodeFormJson.urls.map(item => {
                        return {
                            src: item,
                            title: '',
                        };
                    });
                }
                this.formData = Object.assign({ ...this.nodeFormJson }, { ...approvalData }) || {};
            }

            if (this.row.nameId != 10 && this.row.nameId != 6) {
                this.formData.attachmentList = Object.keys(this.fieldsMapper)
                    .map(key => {
                        let obj = this.formData[key]
                            ? {
                                title: this.fieldsMapper[key],
                                src: this.formData[key],
                            }
                            : null;
                        return obj;
                    })
                    .filter(item => item != null);
            }

            //通用申请和身份证更换申请 附件预览加文件类型
            if (this.row.nameId == 24 || this.row.nameId == 10) {
                this.nodeFormJson.fileList.map(item => {
                    let newList = this.row.nameId == 24 ? item.URL.split('.') : item.cdnUrl.split('.');
                    item.fileType = newList[newList.length - 1];
                });
            }
        },
        formHandle(val) {
            this.newForm = val;
        },
        //评论的时候type:-101 审核状态变更 刷新页面
        handlerOnComment(type){
         let row={...JSON.parse(this.$route.query.row),id: this.id, taskId: null}
         const refreshPageState = () => {
            // 路由跳转
            this.$router.replace({
              name: 'pendingAndApproval',
              query: {
                row: JSON.stringify(row),
                t: Date.now()
              }
            });
          }
          if(type===-101){
            refreshPageState()
          }
        },

        /**
         * 根据业务类型-拿到render所需要的json数据
         */
        getNodeFormData() {
          // 移除operation 相关字段
          //  && this.operation ? 0 : 1
            // this.fieldStatus = (this.row.flowStatus == 3 || this.row.flowStatus == 4);
            // this.fieldStatus = (this.row.flowStatus == 3 || this.row.flowStatus == 4);
            this.fieldStatus = [3,4].includes(this.row.flowStatus) ? 0 :1
            this.fieldData =
                fakeFiledsData.find(fieldData => {
                    return fieldData.approvalType == this.row.nameId && fieldData.categoryName == this.row.category;
                }) || {};
            this.formConfOpen = true;
            let flowData = this.row.nodeFormJson ? JSON.parse(this.row.nodeFormJson) : {};
            // 和后端【ZZN】确定，备注信息取row.remark，非 this.row.nodeFormJson.remark 2022/3/19
            this.nodeFormJson = { ...flowData, examineRemark: this.row.remark };
            this.handleBackData();
        },
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
              name: 'pendingAndApproval',
              query: {
                row: JSON.stringify(row),
                t: Date.now()
              }
            });
          }
            let dataObject = this.$refs['parser'].dataObject;

            if (this.fieldData.approvalType == 1) {
                // 网约车 / 出租车 入网申请 在render文件中有相关处理 处理之后传到后台的参数就变中文了，故这里需要处理
                let carCertStateEnum = {
                    '无车证': -1,
                    '有车证': 1,
                    '车证过期': 2,
                    '不可查': 3
                }
                let driverCertStateEnum = {
                    '无人证': -1,
                    '有人证': 1,
                    '人证过期': 2,
                    '不可查': 3
                }
                dataObject.innerCarCertState = carCertStateEnum[dataObject.innerCarCertState] || dataObject.innerCarCertState
                dataObject.innerDriverCertState = driverCertStateEnum[dataObject.innerDriverCertState] || dataObject.innerDriverCertState
            }

            // type 1拒绝 0通过
            let formData;
            if (this.row.category == 1 && this.row.nameId == 1 && type == 0) {
                formData = JSON.stringify({
                    ...this.nodeFormJson,
                    innerDriverCertState: dataObject.innerDriverCertState,
                    innerCarCertState: dataObject.innerCarCertState,
                    carType: dataObject.carType,
                });
            } else if (this.row.category == 1 && this.row.nameId == 2 && type == 0) {
                formData = JSON.stringify({ ...this.nodeFormJson, carType: dataObject.carType });
            } else if (this.row.category == 1 && this.row.nameId == 5 && type == 0) {
                formData = JSON.stringify({ ...this.nodeFormJson, innerDriverCertState: dataObject.innerDriverCertState, innerCarCertState: dataObject.innerCarCertState });
            } else if (this.row.category == 1 && this.row.nameId == 6 && type == 0) {
                let list = this.nodeFormJson.healthApproveList.filter(item => {
                    return item.expireRule == 1 && !item.reviewInputTime;
                });
                formData = JSON.stringify({ ...this.nodeFormJson, ...this.newForm });
                if (list.length > 0) {
                    this.$message.error('请选择过期时间');
                    return;
                }
            }

            let t = ''
            // 首页-电商卡券申请的
                     // 首页-电商卡券申请的
            if (this.row.category==8&&this.row.nameId==47) {
                t=47  //电商卡券数据结构为数组， 在此位置做特殊处理
            } else {
              // 之前的其他业务场景- this.nodeFormJson 为对象结构 - 有的审核类型，type字段是空，维持之前的样子即可
              t = this.nodeFormJson.type
            }
            let queryData = {
                taskId: this.taskId,
                nodeFormJson: formData ? formData : this.row.nodeFormJson,
                procinstId: this.processId,
                type: t,
                ...rest
            };
            if([1,2].includes(this.row.nameId)) {
                queryData = {
                    taskId: this.taskId,
                    nodeFormJson: formData ? formData : this.row.nodeFormJson,
                    procinstId: this.processId,
                    type: t,
                    remark: type == 0 ?rest.remark:JSON.stringify(rest)
                };
            }
            //卡卷op名称去重,调用卡卷接口,后期修改
            let op;
            if (this.flowNameId == 40 && type == 0) {
                op = 'passApplyTravelCoupon';
            } else if (this.flowNameId == 41 && type == 0) {
                op = 'passApplyRedPacket';
            } else if (this.flowNameId == 42 && type == 0) {
                op = 'passActivityFuka';
            }
            else if(this.flowNameId == 46 && type == 0){
                op='passApplyCompensation'
            }
            else if(this.flowNameId == 47 && type == 0){
                op='passApplyTravelCoupon'
            }
            else if(this.flowNameId == 48 && type == 0){
                op='passApplyTravelCoupon'
            }
            else {
                op = type == 0 ? 'complete' : 'reject';
            }
            let query = {
                op: op,
                ...queryData,
            };

            try {
              const res = await this._axios(query, '/index/todo')

              if (res.code == 1) {
                this.$message.success(type == 0 ? '审批成功' : '拒绝成功');

                  // 加签成功 + 后加签， 直接查详情
                  if (type === 0 && rest.changeType === 2) {
                    refreshPageState()
                  } else {
                    this.$router.go(-1);
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
        showPerList(val, personList, isStartUser) {
            this.showDiaList = val;
            this.personList = personList.split(',');
            this.isStartUser = isStartUser;
        },
        closepop() {
            this.showDiaList = false;
        },
        enterPas() {
            this.centerDialogVisible = false;
            this.$router.go(-1);
        }
    },
};
</script>
<style lang="scss" scoped>
.pendingAndApproval {
    .bgBox {
        border-radius: 8px;
        background: #fff;
        min-height: 100%;
        margin-bottom: 64px;

        ::v-deep.block_container {
            width: 100%;
        }
    }

    .field_wrap_container {
        ::v-deep .img_container {
            height: 500px;
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
.reason-refuse {
    padding: 0 40px 0 48px;
    width: 60%;
    margin-left: 40%;
    /deep/ .ws-table-warp {
        padding: 0!important;
    }
}
</style>
