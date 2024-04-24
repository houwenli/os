<template>
    <div>
        <ws-footer>
            <el-button @click="goBack">返回</el-button>
            <el-button v-if='detail.flowConfig.addComment&& ![-1,1,2,6,7].includes(flowStatus) && this.row.type!=="approveAll"'  @click="onSelectAction('3')">评论</el-button>
            <el-menu mode="horizontal" menu-trigger="click"  v-if='hasMoreOperate'  class="more-operate" @select="onSelectAction" active-text-color='#F05259'>
                <el-submenu index="0"  popper-class="popper-panel">
                    <template slot="title">更多操作</template>
                    <el-menu-item index="1" v-if='detail.flowConfig.addSign'>加签</el-menu-item>
                    <el-menu-item index="2" v-if='detail.flowConfig.addTrans'>转交</el-menu-item>
                </el-submenu>
            </el-menu>
            <!--  && operation -->
            <el-button v-if="isEdit.includes(flowStatus) && taskId && getModulePower('/index/todo').reject" plain @click="handleReject">审核拒绝</el-button>
            <!-- 移除这个字段 && operation -->
            <el-button v-if="isEdit.includes(flowStatus) && taskId && getModulePower('/index/todo').complete" type="primary" @click="handlePass">审核通过</el-button>
            <el-button v-if="getResubmitButtonPermission()" plain @click="resubmit">重新提交</el-button>
            <el-button v-if="getModulePower('/index/todo').flowBackout && isEdit.includes(flowStatus)&&row.type=='1'" plain @click="handleCancel">撤销</el-button>
        </ws-footer>

        <el-dialog title="审核拒绝" :visible.sync="showRejectDia" width="35%" :append-to-body="true" @close='cancel'>
            <!-- 代驾司机入网申请审核拒绝与其他审核不一样 -->
            <el-form v-if="detail.nameId === 82" class="agent-driving-refuse">
                <el-checkbox v-model="depict.licenseFlag" :true-label="1" :false-label="0">驾驶证审核不通过</el-checkbox>
                <el-form-item label="请填写审核不通过原因（必填）：" :required="true">
                    <el-input type="textarea" v-model="depict.licenseFailMsg" maxlength="30" rows="8" resize="none" show-word-limit placeholder="请输入拒绝理由"></el-input>
                </el-form-item>
            
                <el-checkbox v-model="depict.driverImgFlag" :true-label="1" :false-label="0">司机头像审核不通过</el-checkbox>
                <el-form-item label="请填写审核不通过原因（必填）：" :required="true">
                    <el-input type="textarea" v-model="depict.driverImgFailMsg" maxlength="30" rows="8" resize="none" show-word-limit placeholder="请输入拒绝理由"></el-input>
                </el-form-item>

                <el-form-item label="拒绝理由：">
                    <el-input type="textarea" v-model="approvalForm.rejectReason" maxlength="30" rows="8" resize="none" show-word-limit placeholder="请输入拒绝理由"></el-input>
                </el-form-item>
            </el-form>
            <!-- 网约车 司机入网审核和司机修改资料审核 单独处理 -->
            <el-form :model="refuseReasonForm" label-width="100px" v-else-if="[1,2].includes(detail.nameId)">
                <p class="refuse-label">请选择拒绝理由，可多选：</p>
                <el-form-item label="身份证">
                    <el-checkbox-group v-model="refuseReasonForm.idCardList">
                      <el-checkbox label="年龄不符"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="驾驶证">
                    <el-checkbox-group v-model="refuseReasonForm.driverCerList">
                      <el-checkbox label="驾龄不符"></el-checkbox>
                      <el-checkbox label="准驾车型不符合平台要求"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="行驶证">
                    <el-checkbox-group v-model="refuseReasonForm.licenseCerList">
                      <el-checkbox label="车龄不符"></el-checkbox>
                      <el-checkbox label="车辆使用性质不符合平台要求"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="人车合影">
                    <el-checkbox-group v-model="refuseReasonForm.personCarList">
                      <el-checkbox label="人车合影中的车牌号与行驶证不一致"></el-checkbox>
                      <el-checkbox label="人车合影中的人像并非身份证本人"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="网约车证件">
                    <el-checkbox-group v-model="refuseReasonForm.expCerList">
                      <el-checkbox label="网约车证件不符"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="其他原因">
                    <el-checkbox-group v-model="refuseReasonForm.otherList">
                      <el-checkbox label="证件照片不清晰"></el-checkbox>
                      <el-checkbox label="其他"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="" v-if="refuseReasonForm.otherList.indexOf('其他')>=0">
                    <el-input type="textarea" v-model="refuseReasonForm.remark" maxlength="500" rows="8" resize="none" show-word-limit placeholder="请输入其他原因"></el-input>
                </el-form-item>
            </el-form>
            <el-form :model="approvalForm" :rules="rules" ref="approvalForm" label-width="100px" v-else>
                <el-form-item label="备注说明：" prop="rejectReason">
                    <el-input type="textarea" v-model="approvalForm.rejectReason" maxlength="500" rows="8" resize="none" show-word-limit placeholder="请输入拒绝理由"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="cancel">取消</el-button>
                <ws-throttle>
                    <el-button type="primary" @click="confirmReject('approvalForm')">确认拒绝</el-button>
                </ws-throttle>
            </template>
        </el-dialog>

        <el-dialog title="审核通过" :visible.sync="showPassDia" width="35%" :append-to-body="true" :close-on-click-modal='false' :close-on-press-escape='false' @close='cancel'>
            <el-form :model="approvalForm" :rules="rules" ref="ruleForm" class="sign-form" label-width="100px">
                <el-form-item label="通过理由：" prop="passReason">
                    <el-input type="textarea" v-model="approvalForm.passReason" maxlength="500" rows="8" resize="none" show-word-limit placeholder="请输入通过理由"></el-input>
                </el-form-item>
                <template v-if='detail.flowConfig.addCcTask'>
                  <el-form-item label='添加抄送人'>
                      <div class="sign-item">
                        <el-select v-model="signFormModel.changeCcUserIds" clearable multiple @change="(ids) => onRemovePerson('3', ids)">
                              <el-option v-for="item in CcList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                          </el-select>
                          <el-button type="danger" style="margin-left: 8px" @click="onAddCc">添加</el-button>
                      </div>
                  </el-form-item>
                </template>
            </el-form>
            <template #footer>
                <el-button @click="cancel">取消</el-button>
                <ws-throttle>
                    <el-button type="primary" @click="confirmPass">确认通过</el-button>
                </ws-throttle>
            </template>
        </el-dialog>
        <el-dialog title="评论" :visible.sync="showcommand" width="35%" :append-to-body="true" :close-on-click-modal='false' :close-on-press-escape='false' @close='cancel'>
            <el-form :model="approvalForm" :rules="rules" ref="approvalForm" class="sign-form" label-width="100px">
                <el-form-item label="评论内容" prop="remark">
                    <el-input type="textarea" v-model="approvalForm.remark" maxlength="500" rows="8" resize="none" show-word-limit placeholder="请输入内容"></el-input>
                </el-form-item>
                <template v-if='detail.flowConfig.addCcTask'>
                  <el-form-item label='添加抄送人'>
                      <div class="sign-item">
                        <el-select v-model="signFormModel.changeCcUserIds" clearable multiple @change="(ids) => onRemovePerson('3', ids)">
                              <el-option v-for="item in CcList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                          </el-select>
                          <el-button type="danger" style="margin-left: 8px" @click="onAddCc">添加</el-button>
                      </div>
                  </el-form-item>
                </template>
            </el-form>
            <template #footer>
                <el-button @click="cancel">取消</el-button>
                <ws-throttle>
                    <el-button type="primary" @click="handelComments">确认</el-button>
                </ws-throttle>
            </template>
        </el-dialog>

        <!-- 选择人员 弹窗 -->
        <tree-select
            v-if="showChoicePersonModel"
            :dialogVisible.sync="showChoicePersonModel"
            :maxCount="personMaxLength"
            v-bind="personModelConfig"
            @checkedNodeChange="getCheckedNodeList"
        ></tree-select>

        <!-- 加签 弹窗 -->
        <el-dialog :visible.sync="showAddSignModal" title="加签" :close-on-click-modal='false' :close-on-press-escape='false' @close='onResetAddSignModal'>
            <el-form label-width="108px" class="sign-form" ref='signForm' :model="signFormModel" :rules="signRule">
              <!-- 审批方式（1：依次审批2：会签3：或签） -->
              <!-- 为依次审批，才会有 加签方式 -->
              <template v-if='detail.flowConfig.approvalType === 1'>
                <el-form-item label="加签方式：" prop="changeType" >
                    <el-select v-model="signFormModel.changeType">
                        <el-option :value="1" label="在我之前"></el-option>
                        <el-option :value="2" label="在我之后"></el-option>
                    </el-select>
                </el-form-item>
                </template>
                <el-form-item label="加签审批人：" prop="changeUserIds">
                    <div class="sign-item">
                        <el-select v-model="signFormModel.changeUserIds" clearable multiple @change="(ids) => onRemovePerson('1', ids)">
                            <el-option v-for="item in addSignApproverList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                        </el-select>
                        <el-button type="danger" style="margin-left: 8px" @click="onOpenAddPersonDialog">添加</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="加签备注：">
                    <el-input type="textarea" maxlength="500" v-model="signFormModel.remark" placeholder="备注说明，不超过500字" rows="8" show-word-limit></el-input>
                </el-form-item>
                <div class="sign-warn-tips-panel">
                    <div class="title">温馨提示</div>
                    <div class="content">
                        <template v-if='detail.flowConfig.approvalType === 1'>
                          <div>1、前加签，流程先经过被加签人，再由当前审批人处理；</div>
                          <div>2、后加签，流程会执行同意并加签</div>
                        </template>
                        <template v-else>
                          <div>1、加签后，被加签人将被添加至此节点的审批成员列表并可参与审批</div>
                        </template>
                    </div>
                </div>
            </el-form>
            <template #footer>
                <div class="sign-modal-footer">
                    <el-button @click="onCancelAddSignModal">取消</el-button>
                    <el-button type="danger" @click="onSign">确认加签</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 转交弹窗 -->
        <transferDialog
          :currentNodesUserIds='currentNodesUserIds'
          :value.sync="showTransferModal"
          :procinstId="procinstId"
          :list="transferList"
          v-if="showTransferModal"
          :taskId='taskId'
          :approvalType='detail.flowConfig.approvalType'
        />
    </div>
</template>

<script>
import TreeSelect from '@/components/treeSelect/treeSelect.vue';
import { mapGetters } from 'vuex'
import transferDialog from './transferDialog.vue'
import {cloneDeep} from 'lodash-es'
import {getResubmitPagePermission, submitMap} from './data.js'

export default {
  name: 'processFooter',
  components: {
    TreeSelect,
    transferDialog
  },
  props: {
    /**
     * 流程id
     */
    procinstId: {
      type: [String, Number]
    },
    /**
     * @flowStatus
     * -1：撤销，
     * 1：通过
     * 2：驳回
     * 3：待审核 【可操作】
     * 4：审核中 【可操作】
     * 5：再次审核
     * 6：自动审核通过
     * 7： 自动审核驳回
     */
    flowStatus: {
      type: Number,
      default: 0
    },
    // operation: {
    //   type: String,
    //   drfault: ''
    // },
    approveType: {
      type: String,
      default: ''
    },
    /**
     * 当前审批节点的人员Id
     */
    currentNodesUserIds: {
      type: Array,
      default: () => []
    },

    /**
     * 详情数据
     */
    detail: {
      type: Object,
      default: () => {}
    },

    /**
     * 任务id
     */
    taskId: {
      type: String
    }
  },
  data () {
    return {
      checkedCities: '',
      depict:{
        licenseFlag:0,
        driverImgFlag:0,
        licenseFailMsg:'',//驾驶证不通过原因
        driverImgFailMsg:''//司机头像审核不通过原因
      },
      moduleName: '/index/todo',
      showRejectDia: false,
      showPassDia: false,
      showcommand:false,
      isEdit: [3, 4], // 3：待审核 4：审核中 可进行驳回审核操作
      row:{},//路由参数
      approvalForm: {
        checkList: [],
        rejectReason: '',
        passReason: '',
        remark:'',//评论内容
       
      },
      refuseReasonForm: {
        idCardList:[],//身份证类
        driverCerList:[],//驾驶证类
        licenseCerList:[],//行驶证类
        personCarList:[],//身份证类
        expCerList:[],//人车合影类
        otherList:[],//其他
        remark:'',//评论内容
      },
      rules: {
        rejectReason: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入拒绝理由'
          }
        ],
        remark: [
          {
            required: true,
            trigger: ['blur','change'],
            message: '请输入评论内容'
          }
        ],
      },

      // 添加人员的弹窗
      showChoicePersonModel: false,
      personMaxLength: 5,
      personModelConfig: {
        title: "添加成员",
        expandOnClickNode: false,
        moduleName: '/systemManage/taskFlow',
        listModuleName: '/systemManage/taskFlow',
        funcDefaultNode: [],

        opObj: {
          selectTree: 'selectOrganizationalTreeByidNew',
          selectList: 'listByFuzzyNameNew'
        },
        funcRoleProps: {
          label: 'name',
          value: 'id',
          children: 'children',
          isLeaf: 'leaf',
          disabled: this.setTreeDisabled
        }
      },

      // 抄送人
      CcList: [],
      // 转交
      transferList: [],
      // 转交人姓名
      transferName: '',
      showTransferModal: false,
      // 加签 - 弹窗
      showAddSignModal: false,

      signFormModel: {
        // 加签方式 1-前加签; 2-审核后并加签（后加签）; 3-审核并加抄; 4-转交; 5-普通审核通过
        changeType: '',
        // 流程新增的人
        changeUserIds: [],
        remark: '',
        // 依次签名-后加签-备注
        addSignMark: '',
        // 抄送的人员名单
        changeCcUserIds: [],
        taskId: this.taskId
      },
      signRule: {
        changeType: [
          { required: true, message: '请选择加签方式' }
        ],
        changeUserIds: [
          {
            required: true, message: '请添加加签审批人',
            type: 'array',
            max: 5
          }
        ]
      },
      // 加签审批人 列表
      addSignApproverList: [],
      // 1-加签； 2-转交; 3-加抄
      actionType: ''
    };
  },
  created(){
    this.row=JSON.parse(this.$route.query.row)
  },
  computed: {
    ...mapGetters(['login/userInfo']),

    /**
     * 根据配置决定是否显示更多按钮
     */
    hasMoreOperate() {
      if(!(this.isEdit.includes(this.flowStatus) && this.taskId)) return false
      const flowConfig = this.detail.flowConfig || {}
      return Boolean(flowConfig.addSign) || Boolean(flowConfig.addTrans)
    }
  },
  methods: {
    setTreeDisabled (node, data) {
      return !data.isLeaf;
    },
    /**
     * @return {Boolean} 检查添加的节点人员和当前审批的人是否存在重复
     */
    checkDuplicatePerson () {
      // 获取当前登录帐号的信息，转交人，或者加抄人不能是自己
      const userId = this['login/userInfo'].id

      let list = this.signFormModel.changeUserIds

      if (userId && list.includes(userId)) return false

      return !this.currentNodesUserIds.some(p => list.includes(Number(p)))
    },
  async  handelComments(){
    if (!this.checkForm()) return
      let data = {
                data: {
                   remark:this.approvalForm.remark,
                   type:this.row.type,
                   nodeKey: this.row.nodeKey,
                   procInstId:this.row.id,
                   ccUserIds:this.signFormModel.changeCcUserIds,
                   ccTaskId:this.row.type==='4'?this.row.ccTaskId:null
                },
                op: 'comment',
            };
            try {
                let res = await this.$axios('/new/flowable/todoTask/save', data);
                if(res.code===1){
                  let data=JSON.parse(res.data)
                  if (data.code===1) {
                  this.showcommand=false;
                    this.$emit('onComment')
                  this.$message.success('评论成功');
                  }
                  if(data.code===200){
                  this.showcommand=false;
                  this.$emit('onComment')
                  this.$message.success('评论成功');
                  } else if(data.code===-101||data.code===-108){
                    this.$message.error(data.msg);
                    this.$emit('onComment-handler', { type: -101});
                  }

                }
            } catch (error) {}


    },
    //合并数据
    getCheckedNodeList (result) {
      // 加签
      if (this.actionType === '1') {
        this.addSignApproverList = result
        this.signFormModel.changeUserIds = result.map(p => p.id)
      }

      // 转交
      if (this.actionType === '2') {
        if (result.length === 0) return

        this.transferList = result
        this.transferName = result[0].name

        setTimeout(() => {
          this.showTransferModal = true
        }, 500);
      }

      if (this.actionType === '3') {
        this.CcList = result
        this.signFormModel.changeCcUserIds = result.map(p => p.id)
      }
    },

    onSelectAction (index) {
      this.actionType = index
      // 加签
      if (index === '1') {
        this.personMaxLength = 5
        this.showAddSignModal = true
      }

      // 转交
      if (index === '2') {
        this.personMaxLength = 1
        this.showChoicePersonModel = true
      }
      //评论
      if(index === '3'){
        this.showcommand = true
      }
    },
    goBack () {
      this.$router.go(-1);
    },
    handleReject () {
      //请求获取checkList接口，入参为详情传入
      this.showRejectDia = true;
    },
    handlePass () {
      this.actionType = '3'
      this.showPassDia = true;
      // 权限审批不走表单校验
      // if (this.approveType == 'power' || this.approveType == 'need') {
      //   this.showPassDia = true
      //   return
      // }

      // this.$parent?.$refs['parser'].$refs['el-form'].validate(valid => {
      //   if (valid) {
      //     this.showPassDia = true;
      //   }
      // });
    },
    /**
     * 审核拒绝
     */
    confirmReject (formName) {
      this.actionType = ''
      if(this.detail.nameId === 82){
        // 代驾司机入网申请的审核拒绝与其他审核不一样
        const remark = this.approvalForm.rejectReason
        if(!(this.depict.licenseFlag || this.depict.driverImgFlag)){
            this.$message.error('请选择不通过内容')
            return
        }
        if((this.depict.licenseFlag&& !this.depict.licenseFailMsg)||(this.depict.driverImgFlag&& !this.depict.driverImgFailMsg)){
            this.$message.error('审核不通过原因必填')
            return
        }
        let depict = JSON.stringify(this.depict)
        this.$emit('approval-handler', { type: 1, approvalForm: this.approvalForm, remark,depict });
      }else if([1,2].includes(this.detail.nameId)){
        // 网约车 司机入网审核和司机修改资料审核 单独处理
        let check = false;
        for (let key in this.refuseReasonForm) {
          if(Array.isArray(this.refuseReasonForm[key]) && this.refuseReasonForm[key].length){
            check =true
          }
        }
        if(!check) {
          this.$message.error('拒绝理由必须选一个!')
          return
        }
        if(this.refuseReasonForm.otherList.indexOf('其他')>=0 && !this.refuseReasonForm.remark){
          this.$message.error('选择了其他下,必须输入其他原因')
          return
        }
        let refuseReasonForm = _.cloneDeep(this.refuseReasonForm)
        let otherIndex = refuseReasonForm.otherList.indexOf('其他')
        // 如果审核拒绝选中其他原因的其他，并且输入理由，则把理由push到otherList里面
        if(refuseReasonForm.remark && otherIndex>=0){
          refuseReasonForm.otherList.splice(otherIndex,1)
          refuseReasonForm.otherList.push(refuseReasonForm.remark)
        }
        delete refuseReasonForm.remark
        this.$emit('approval-handler', { type: 1, ...refuseReasonForm });
      }else{
        this.$refs[formName].validate(valid => {
            if (valid) {
                const remark = this.approvalForm.rejectReason
                this.$emit('approval-handler', { type: 1, approvalForm: this.approvalForm, remark });
            }
        });
      }
      
    },
    checkForm() {
            let a = true;
            this.$refs.approvalForm.validate(valid => {
                a = valid;
            });
            return a;
        },
    /**
     * 场景：
     *  1、直接确认通过-普通审核  changeType = 5
     *  2、后加签-确认通过 changeType = 2
     */
    confirmPass () {
      let data = cloneDeep(this.signFormModel)

      data.remark = this.approvalForm.passReason

      // 后加签-确认通过
      if (this.signFormModel.changeType === 2) {
        data.changeType = 2
      } else {
        data.changeType = 5
      }

      data.approvalType = this.detail.flowConfig.approvalType
      this.$emit('approval-handler', { type: 0, approvalForm: this.approvalForm, ...data});
    },
    /**
     * 由于后加签-需要刷新当前页面，需要在父页面手动关闭一下dialog
     * 提交动作又是在父组件中，需要在接口提交成功后，关闭
     */
    closeAfterDialog() {
      this.showAddSignModal = false
      this.showPassDia = false
    },
    /**
     * 审批通过和审批拒绝弹窗取消的重置
     */
    cancel () {
      this.approvalForm = {
        checkList: [],
        rejectReason: '',
        passReason: ''
      };
      this.signFormModel.changeCcUserIds = []
      this.CcList = []
      this.showRejectDia = false;
      this.showPassDia = false;
      this.showcommand = false;
      this.depict = {
        licenseFlag:0,
        driverImgFlag:0,
        licenseFailMsg:'',//驾驶证不通过原因
        driverImgFailMsg:''//司机头像审核不通过原因
      }
    },
    /**
     * 添加抄送人
     */
    onAddCc () {
      this.personMaxLength = 5
      this.actionType = '3'
      this.showChoicePersonModel = true
    },

    onCancelAddSignModal () {
      this.showAddSignModal = false
    },
    /**
     * 重置加签的弹窗
     * 点击取消和右上角的x  都会调用这里
     */
    onResetAddSignModal() {
      this.signFormModel = this.$options.data().signFormModel
      this.signFormModel.taskId = this.taskId
      // 重置存储 审核人的数组
      this.addSignApproverList = []
    },

    checkSignForm() {
      let isOk = true
      this.$refs['signForm'].validate(valid => isOk = valid)

      return isOk
    },

    /**
     * 确认加签
     */
    async onSign () {
      if (!this.checkSignForm()) return

      if (!this.checkDuplicatePerson()) {
        this.$message.warning('审核人已存在，不可重复添加')
        return
      }

      const approvalType = this.detail.flowConfig.approvalType

      if (this.signFormModel.changeType === 2) {
        this.signFormModel.addSignMark = this.signFormModel.remark
      }

      // 提交接口
      let params = {
        op: 'complete',
        data: {
          procinstId: this.procinstId,
          ...this.signFormModel
        }
      }
      const url = this.$getModuleUrl('/index/todo', 'complete')

      // 依次审批
      if (approvalType === 1) {
        // 在我之前加签
        if (this.signFormModel.changeType === 1) {

          params.data.approvalType = 1

          try {
            await this.$axios(url, params)
            this.$message.success('加签成功')
            this.$router.replace({
              name: 'index'
            })
          } catch (error) {

          }
        }

        // 在我之后加签
        if (this.signFormModel.changeType === 2) {
          this.showPassDia = true
        }
      } else {
        // 会签 或者或签
        params.data.approvalType = approvalType
        params.data.changeType = 0

        try {
          await this.$axios(url, params)

          this.$message.success('加签成功')
          this.$router.replace({
              name: 'index'
            })
        } catch (error) {

        }

      }
    },


    /**
     * 根据类型移除 已经添加的人
     * @param {String} 1-加签; 3-加抄
     * @param {Array<Number>} ids 人员id
     */
    onRemovePerson (type,ids) {
      let listKey
      let key = ''

      if (type === '1') {
        listKey = 'addSignApproverList'
        key = 'changeUserIds'
      }

      if (type === '3') {
        listKey = 'CcList'
        key = 'changeCcUserIds'
      }
      const res = this[listKey].filter(item => ids.includes(item.id))

      this[listKey] = res
      this.signFormModel[key] = ids
    },

    onOpenAddPersonDialog () {
      // 必须先选择加签方式，不然选择的人不知道存到哪个对象上
      if (this.detail.flowConfig.approvalType === 1 && this.signFormModel.changeType === '') {
        this.$message.warning('请选择加签方式')
        return
      }

      this.showChoicePersonModel = true
    },

    // 撤销
    handleCancel() {
        this.$confirm("确认要撤销当前审批流吗?","撤销审批", {
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              await this.onRevoke()
              done()
            } else {
              done()
            }
          }
        }).then(() => {
        }).catch(() => {})
    },

    /**
     * 撤销接口
     */
    async onRevoke() {
      let data = {
        data: { procinstId: this.row.id },
        op: 'flowBackout'
      };

      try {
        await this.$axios(this.$getModuleUrl('/index/todo', 'flowBackout'), data)
        this.$message.success('撤销成功');
        this.$router.replace({name: 'index'})
        return true
      } catch (error) {
        return false
      }
    },


    //重新提交按钮权限
    getResubmitButtonPermission() {
      // 审批发起记录 显示
      if (this.row.type!='1') return false;

      return getResubmitPagePermission.call(this, this.detail)
    },
    resubmit(){
      const query = {
        // 审批类型
        id: this.detail.nameId,
        // 跳过去查详情的入参
        procInsId: this.$route.query.id
      }

      //机构审批和通用审批跳转路径一样 只是审核流id不一样
      if(this.detail.nameId==24||this.detail.nameId==29){
          this.$router.push({ path :'/currencyApply',query});
      } else{

        this.$router.push({
          path: submitMap[this.detail.nameId].modelName,
          query
        });
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.more-operate {
    // width: 320px;
    margin: 0 8px;
    border: none;
    box-sizing: border-box;
    display: flex;
    .menucComment{
    text-align: center;
    color: #606266 !important;
    height: 38px !important;
    border-radius: 4px !important;
    border: 1px solid #dcdfe6;
    width: 158px;
    margin-right: 9px;
    border-bottom-color:#dcdfe6 !important
    }
    /deep/ .menucComment.is-active{
    border-radius: 4px !important;
    border: 1px solid #dcdfe6;
    background-color: #fff !important;
    border-bottom-color:#dcdfe6 !important
    }
    .menucComment:focus, .menucComment:hover {
    color: #F05259 !important;
    border-color: rgb(251, 203, 205);
    background-color: rgb(254, 238, 238) !important;
    border-bottom-color:rgb(251, 203, 205)!important
}


    /deep/ .el-submenu {
      width: 160px;
      .el-submenu__title {
        padding: 0;
        text-align: center;
      }
    }

    .more-operate-btn {
        min-width: 120px;
    }

    /deep/ .el-submenu__title {
        color: #606266;
        height: 36px !important;
        margin-bottom: 0 !important;
        border-bottom: 0px !important;
        line-height: 36px !important;
    }
    /deep/ .el-submenu {
        border-radius: 4px;
        border: 1px solid #dcdfe6;
    }

    /deep/ .el-submenu:hover {
        border-color: rgb(251, 203, 205);
        background-color: rgb(254, 238, 238);

        .el-submenu__title {
            color: #f05259;
            background: transparent;
            border-color: transparent;
        }
    }

}

.sign-form {
    /deep/ .el-select {
        width: 100%;
    }
    .sign-item {
        display: flex;
    }
}
.sign-warn-tips-panel {
    height: 100px;
    background: #f5f7fa;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    padding: 16px 0 16px 20px;

    .title {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #606266;
        margin-bottom: 8px;
    }

    .content {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #606266;
        line-height: 20px;
    }
}
.agent-driving-refuse{
    /deep/.el-form-item__label{
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
    }
    /deep/.el-textarea__inner{
        height: 80px;
    }
}
</style>
<style lang='scss'>
.popper-panel {
  box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.06);
  overflow: hidden;

  .el-menu--popup-bottom-start {
     border: 1px solid #E4E7ED;
     border-radius: 8px;
  }
  .el-menu {
    text-align: center;
    min-width: 160px;

    .el-menu-item {
      padding: 0;
      margin-left: 0;
      margin-right: 0;
      border-radius: 0 !important;
    }
  }
  .el-menu .is-active {
    background: #F5F7FA !important;
  }
}
.refuse-label {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>