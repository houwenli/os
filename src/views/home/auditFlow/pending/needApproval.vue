<template>
    <div>
        <div class="needApproval">
            <!-- 组件中自动计算column宽度 只计算第一个el-table中的el-table__body-wrapper 此处先把弹窗table的放在前面-->
            <processPointDia :personList="personList" :procinstId="processId" v-if="showDiaList" :showProcessPerson="showDiaList" @closepop="closepop" :personType="1" :isStartUser="isStartUser" />

            <div class="bgBox">
                <!-- 步骤条节点 -->
                <steps v-if="getModulePower('/index/todo').approvalStep" :stepId="processListId" :processId="processId" :dataList="stepData" @showPerList="showPerList"></steps>
                <!-- 发起信息 -->
                <div class="approvalInfo">
                    <div class="startPart">
                        <div class="first-level-title">审批发起信息</div>
                        <div class="textBox">
                            <el-form ref="StartForm" :model="rowData" label-width="140px">
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="审批编号：">
                                            {{ rowData.procdefNo }}
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="审批类型：">
                                            {{ rowData.name }}
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="发起时间：">
                                            {{ rowData.startTime }}
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="发起人：">
                                            {{ rowData.startUserName }}
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="所属部门：">
                                            {{ rowData.startDeptName }}
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>
                    </div>

                    <div class="approvalContent">
                        <div class="first-level-title">{{ judgeNeedTitle }}</div>
                        <div class="textBox">
                            <el-form ref="contentForm" :model="needForm" label-width="140px">
                                <el-row>
                                    <el-col :span="24">
                                        <el-form-item label="需求名称：">
                                            {{ needForm.demandName }}
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!-- 需求申请内容 -->
                                <div v-if="[25, 28].includes(nameId)">
                                    <div style="margin: 16px 0">
                                      <el-form-item label="需求背景：" class="desc">
                                        <div v-html="needForm.background" class="descBox"></div>
                                      </el-form-item>
                                    </div>

                                    <div style="margin: 16px 0">
                                      <el-form-item label="需求目的：" class="desc">
                                          <div v-html="needForm.purpose" class="descBox"></div>
                                      </el-form-item>
                                    </div>
                                    <div style="margin: 16px 0" class="desc">
                                      <el-form-item prop="name" label="需求描述：">
                                          <div class="descBox" >
                                              <rich-text-preview :html='needForm.descrip'></rich-text-preview>
                                          </div>
                                      </el-form-item>
                                    </div>
                                </div>
                                <!-- 需求关闭内容 -->
                                <div v-else-if="nameId === 26">
                                    <el-row>
                                        <el-col :span="24">
                                            <el-form-item label="需求提出人：">
                                                {{ needForm.createByName }}
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="24">
                                            <el-form-item label="提出人所属部门：">
                                                {{ needForm.department }}
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="24">
                                            <el-form-item prop="name" label="需求关闭原因：">
                                                <div class="descBox">
                                                    <div v-html="needForm.closeReason"></div>
                                                </div>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </div>
                            </el-form>
                        </div>
                    </div>

                    <div v-if="[25, 28].includes(nameId) && (srcList.lenght || fileList.lenght)" class="approvalFile __approval_field_wrap_container">
                        <div class="imgBox" v-if="srcList.lenght">
                            <div class="first-level-title" >图片</div>
                            <div class="img-list">
                                <img class="needImg" v-for="(img, index) in srcList" :key="index" :src="img" @click="onPreview(index)" />
                            </div>
                            <ws-image-viewer :visible.sync="visible" :src-list="srcList" :currentIndex="currentIndex" />
                        </div>

                        <div v-if="fileList.lenght">
                            <div class="first-level-title" >附件</div>
                            <el-row :gutter="40">
                                <el-col :md="6" :lg="8" v-for="(item, index) in fileList" :key="index">
                                    <div class="file_container">
                                        <img src="@/assets/index/fileIcon.png" style="margin-right: 10px" />
                                        <div class="attachment-item-text">
                                            <div>
                                                <a :href="item.fileUrl" target="_blank" :downLoad="item.fileName">{{ item.fileName }}</a>
                                            </div>
                                            <div class="attachment-item-size">{{ item.fileSize }}</div>
                                        </div>

                                        <div class="file_shadow">
                                            <div class="imgBox">
                                                <span @click="handlePreview(item.fileUrl)" v-if="showFilePreview(item.fileType)">
                                                    <i class="el-icon-zoom-in" style="margin-right: 30px"></i>
                                                </span>
                                                <a
                                                    v-else-if="
                                                        (item.fileType.indexOf('pdf') > -1 ||
                                                            item.fileType.indexOf('png') > -1 ||
                                                            item.fileType.indexOf('jpeg') > -1 ||
                                                            item.fileType.indexOf('jpg') > -1) &&
                                                        item.fileUrl
                                                    "
                                                    :href="item.fileUrl"
                                                    target="_blank"
                                                >
                                                    <i class="el-icon-zoom-in" style="margin-right: 30px"></i>
                                                </a>
                                                <i class="el-icon-download" @click="handleDownLoad(item.fileUrl)"></i>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>

                <!-- 审批流程记录 -->
                <pointRecordList v-if="processId" :processId="processId" :key="refreshLogKey"></pointRecordList>

                <footerBtns
                    v-if="Object.keys(rowData).length"
                    :detail="rowData"
                    :taskId="taskId"
                    :procinstId="processId"
                    :currentNodesUserIds="currentNodesUserIds"
                    :flowStatus="flowStatus"
                    @approval-handler="handleApproval"
                    approveType="need"
                    ref="footerBtns"
                    @onComment="onComment"
                />
            </div>
        </div>

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
import steps from '@/views/workFlow/components/steps.vue';
import processPointDia from '../components/processPointDia.vue';
import pointRecordList from '@/views/workFlow/components/pointRecordList.vue';
import footerBtns from '../components/footerBtns.vue';
import { _axios } from '@/utils/commMethods';
import download from './components/RenderFields/download';
import RichTextPreview from 'rich-text-preview'

// 需求申请的审批页面
export default {
  name: 'needApproval',
  components: {
    steps,
    processPointDia,
    pointRecordList,
    footerBtns,
    RichTextPreview
  },
  data () {
    return {
      moduleName: '/index/todo',
      visible: false,
      currentIndex: 0,
      // 详情数据
      rowData: {},
      refreshLogKey:'',
      showDiaList: false,
      stepData: [], // 步骤条数据
      personList: [], //dialog弹窗数组
      processId: '',
      processListId: '', // 步骤条参数
      flowStatus: 0,
      descHtml: '', //需求描述图文html结构
      fileList: [],
      nameId: null, // 25:需求申请，26：需求关闭
      //提交的表单信息
      needForm: {},
      centerDialogVisible: false,
      errorMsg: '',
      srcList: [], //图片列表
      isStartUser: false,
      // 当前节点用户ids
      currentNodesUserIds: [],
      id: null,

      // 从哪一个路由过来的
      fromRouteName: ''
    };
  },
  created () {
    let row = JSON.parse(this.$route.query.row);

    this.taskId = row.taskId;
    this.id = row.id;

    this.getDetailData();
  },
  beforeRouteEnter(to, from, next) {
    let name = from.name === '/' ? 'pendingList' : from.name
    next((vm) => {
      vm.fromRouteName = name
    })
  },

  computed: {
    judgeNeedTitle () {
      return [25, 28].includes(this.nameId) ? '需求申请内容' : '需求关闭信息';
    },
  },
  methods: {
    onPreview (index) {
      this.visible = true;
      this.currentIndex = index;
    },
    onComment(){
            this.refreshLogKey= Date.now()
        },
    async getDetailData () {
      let opt = {
        data: JSON.stringify({
          procinstId: this.id,
          taskId: this.taskId,
        }),
        op: 'flowDetail',
      };
      try {
        const res = await this.$axios('/new/flowable/form/select', opt);

        this.rowData = JSON.parse(res.data);

        this.nameId = this.rowData.nameId;
        this.processId = this.id;
        this.processListId = this.rowData.procDefId;
        this.flowStatus = this.rowData.flowStatus;
        this.nodeFormJson = JSON.parse(this.rowData.nodeFormJson);
        this.needForm = this.nodeFormJson
        this.srcList = (this.needForm.images || []).map(item => item.fileUrl);
        this.fileList = this.needForm.attachmentList || [];
        this.fileList&&this.fileList.map(item => {
          let newList = item.fileUrl.split('.');
          item.fileType = newList[newList.length - 1];
        });
        this.getStepsData();
      } catch (error) {
        console.log('查询审批流详情异常')
        console.log(error)
      }
    },
    getModuleUrl (op) {
      return this.$getModuleUrl(this.moduleName, op);
    },
    /**
     * 拿到审批流程的节点数据
     */
    async getStepsData () {
      let opt = {
        data: {
          procinstId: this.processId,
          procdefId: this.processListId,
        },
        op: 'approvalStep',
      };

      try {
        const url = this.getModuleUrl('approvalStep');
        const res = await this.$axios(url, opt);

        const { code, data } = res;
        if (code == 1) {
          this.stepData = JSON.parse(data);

          // 拿到当前节点的人员ids

          const node = this.stepData.find(p => p.approvalStatus === '3');

          if (node) {
            // 拿到当前节点人员id, 避免加抄/转交中选中的人重复
            this.currentNodesUserIds = (node.userIds || '').split(',');
          }
        }
      } catch (error) {
        console.log('查询审批流节点数据报错')
        console.log(error)
      }
    },
    /**
     * 提交审核
     * @param {Number} type 0-通过; 1-拒绝
     * @param {Object} approvalForm
     * @param {Object} rest 包含多个参数
     */
    async handleApproval ({ type, approvalForm, ...rest }) {
      const refreshPageState = () => {
        // 后加签以后-是没有流程id的 所有需要删除taskId
        this.taskId = null;
        let row={...JSON.parse(this.$route.query.row),id: this.id, taskId: null}
        // 路由跳转
        this.$router.replace({
          name: 'needApproval',
          query: {
            row: JSON.stringify(row),
            t: Date.now(),
          },
        });
      };

      try {
        let queryData = {
          taskId: this.taskId,
          nodeFormJson: this.rowData.nodeFormJson,
          procinstId: this.processId,
          ...rest,
        };
        let op = type == 0 ? 'complete' : 'reject';
        let query = {
          op: op,
          ...queryData,
        };

        const res = await this._axios(query, '/index/todo');
        if (res.code == 1) {
          this.$message.success(type == 0 ? '审批成功' : '拒绝成功');

          // 加签成功 + 后加签， 直接查详情
          if (type === 0 && rest.changeType === 2) {
            refreshPageState();
          } else {
            this.$router.push({
              name: this.fromRouteName
            })
          }
        } else {
          this.$refs.footerBtns.showPassDia = false;
          this.errorMsg = res.msg;
          this.centerDialogVisible = true;
        }
      } catch (error) {
        // 在 app端签名后，web端再提交就直接调用详情接口刷新
        if ((error.code === 0 && error.msg === '此审核流程状态变更') || error.code === -108) {
          refreshPageState();
        }
      }
    },
    //打开人员弹窗
    showPerList (val, personList, isStartUser) {
      this.showDiaList = val;
      this.personList = personList.split(',');
      this.isStartUser = isStartUser;
    },
    //关闭人员弹窗
    closepop () {
      this.showDiaList = false;
    },
    handleDownLoad(item) {
      download(item);
    },
    handlePreview (item) {
      // 使用微软方式预览
      window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(item)}`);
    },

    /**
     * 以下文件类型可以预览
     */
    showFilePreview (fileType) {
      return fileType.indexOf('doc') > -1 || fileType.indexOf('docx') > -1 ||
        fileType.indexOf('ppt') > -1 || fileType.indexOf('pptx') > -1 ||
        fileType.indexOf('xls') > -1 ||
        fileType.indexOf('xlsx') > -1 ||
        fileType.indexOf('excel') > -1
    },

    enterPas() {
      this.centerDialogVisible = false;
      this.$router.push({
        name: this.fromRouteName
      })
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .needImg {
    width: 115px !important;
    height: 115px !important;
    margin-right: 15px;
}
.needApproval {
    margin-bottom: 64px;
    .bgBox {
        border-radius: 8px;
        background: #fff;
        min-height: 84vh;
        .approvalInfo {
            padding: 0 40px;

            .approvalContent {
                .textBox {
                    ::v-deep.el-form {
                        .el-form-item {
                            .el-form-item__content {
                                word-wrap: break-word;
                                white-space: pre-wrap;
                            }
                        }
                    }
                }
            }
        }
    }
    .__approval_field_wrap_container {
        padding: 32px 0 0 0;
        flex-direction: column;
        display: flex;
        .imgBox {
            padding-bottom: 15px;
            .imgtitle {
                font-weight: 400;
                font-size: 16px;
            }
            .img-list {
                padding-top: 15px;
            }
        }
    }
}

.file_container {
    position: relative;
    display: flex;
    align-items: center;
    height: 80px;

    .attachment-item-text {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: rgba(0, 0, 0, 0.65);
    }

    .attachment-item-size {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #c0c4cc;
    }

    &:hover {
      .file_shadow {
        display: block;
      }
    }
}

.textBox {
    padding: 15px 82px 15px 15px;
    background: #f5f7fa;
    border-radius: 8px;
    ::v-deep.el-form-item__label {
        font-weight: 400;
    }
    ::v-deep.el-form-item {
        margin-bottom: 0;
    }
}
.descBox {
    position: relative;
    width: 100%;
    background-color: #fff;
    border-radius: 8px;
    margin-top: 10px;
    padding: 6px 10px;
    min-height: 120px;
    overflow-x: auto;
    ::v-deep img {
        -webkit-user-drag: none;
    }
}

// 一级标题
.first-level-title {
    position: relative;
    font-size: 16px;
    line-height: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #303133;
    padding-left: 6px;
    margin-bottom: 16px;
    margin-top: 32px;
    font-weight: 600;

    &::before {
        position: absolute;
        left: 0;
        top: 0;
        content: ' ';
        width: 4px;
        height: 16px;
        background: #f05259;
        border-radius: 0px 84px 84px 0px;
    }
}
.desc{
    display: flex;
    flex-direction: column;
    /deep/.el-form-item__content{
        margin-left: 60px !important;
    }
}
</style>
