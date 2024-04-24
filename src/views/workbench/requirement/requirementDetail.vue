<template>
<div>
    <div class="container">
        <div class="header">
            <el-col :span="14" >
                <ws-descriptions title="需求申请表" :showToggle="false">
                    <ws-descriptions-item label="需求发起人">{{ form.createByName || '--' }}</ws-descriptions-item>
                    <ws-descriptions-item label="需求方">{{ form.department || '--' }}</ws-descriptions-item>
                    <ws-descriptions-item label="发起时间">{{ form.createTime || '--' }}</ws-descriptions-item>
                    <ws-descriptions-item label="需求名称">{{ form.demandName || '--' }}</ws-descriptions-item>
                    <ws-descriptions-item label="需求编号">{{ form.demandCode || '--' }}</ws-descriptions-item>
                    <ws-descriptions-item label=""></ws-descriptions-item>
                </ws-descriptions>

                <div class="text-wrapper">
                  <div class="line">
                    <div class="left-title">需求背景:</div>
                    <textarea class="right-content" v-html="form.background" disabled></textarea>
                  </div>
                  <div class="line">
                    <div class="left-title">需求目的:</div>
                    <textarea class="right-content" v-html="form.purpose" disabled></textarea>
                  </div>
                  <div class="line">
                    <div class="left-title">需求描述:</div>
                    <div class="right-content" style="padding: 0;">
                       <rich-text-preview :html='form.descrip'  :lazy='false' overflow='hidden scroll' :cssText="cssText"></rich-text-preview>
                    </div>
                  </div>
                </div>

                <el-form label-width="73px" >
                    <div>
                      <el-form-item label="图片:" v-show="srcList && srcList.length != 0">
                          <div class="img-list">
                              <img v-for="(img, index) in srcList" :key='index' :src="img"  @click="onPreview(index)"/>
                          </div>
                          <ws-image-viewer :visible.sync="visible" :src-list="srcList" :currentIndex="currentIndex" />
                      </el-form-item>
                    </div>
                    <div>
                      <el-form-item label="附件:" v-show="form.attachmentList && form.attachmentList.length != 0">
                          <upload-file :fileList="form.attachmentList" :pageType="'detail'" :isShowRename="false" :isShowDelete="false"></upload-file>
                      </el-form-item>
                   </div>
                </el-form>
            </el-col>

            <requirement-flow
                style="background-color: white"
                :processId="form.processId"
                :personName="form.createByName"
                :pageType="$route.query.type"
                v-if="form.processId"
                :closeProcessId="form.closeProcessId"
                :showCloseProcess="showCloseProcess"
                :key="timer"
            ></requirement-flow>
        </div>

        <ws-footer>
            <el-button @click="back">返回</el-button>
            <el-button type="primary"  @click="cancel" v-if="revoke && getModulePower('/workbench/BRrequirement').withdraw">撤销</el-button>
        </ws-footer>

        <el-dialog title="撤销需求申请" :visible.sync="dialogFormVisible" width="40%" center>
          <el-form :model="dialogForm" :rules="rules" ref="dialogForm">
              <el-form-item label="撤销原因：" label-width="110px" prop="revocationReason">
                  <el-input type="textarea" :rows="6" resize="none" v-model="dialogForm.revocationReason" autocomplete="off" maxlength="100" show-word-limit placeholder="请输入撤销原因"></el-input>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="confirmCancel" :disabled='disabledReveoke' v-if="getModulePower('/workbench/BRrequirement').withdraw">确 定</el-button>
          </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 富文本预览
import RichTextPreview from 'rich-text-preview'

export default {
    name: 'requirementDetail',
    components: {
        uploadFile: () => import('@/components/uploadFile/index'),
        requirementFlow: () => import('@/components/requirementFlow'),
        RichTextPreview
    },

    data() {
        return {
            moduleName: '/workbench/BRrequirements',
            form: {},
            srcList: [], //图片列表
            visible: false,
            currentIndex: 0,
            showCloseProcess: false,
            timer: '',
            demandType: '',
            revoke: this.$route.query.approvalStatus == 0 ? true : false,
            iframHeight: 'auto',
            cssText:`
                body img {
                    max-width: 100%;
                    height: auto;
                }
            `,

            dialogFormVisible: false,
            dialogForm: {
                revocationReason: '', //需求撤销原因
            },

            rules: {
                revocationReason: [{ required: true, message: '请输入撤销原因', trigger: 'blur' }]
            },
            disabledReveoke: false
        };
    },
    mounted() {
      this.getDetailData();
    },
    methods: {
        onPreview(index) {
            this.visible = true;
            this.currentIndex = index;
        },
        cancel() {
            this.dialogFormVisible = true;
        },
        async getDetailData() {
            let data = {
                data: {
                    ids: [this.$route.query.id],
                },
                op: 'detail',
            };
            try {
                let res = await this.$axios('/demand/apply/select', data);
                let arr = JSON.parse(res.data);
                arr.forEach(item => {
                    this.form = item;
                    this.demandType = item.demandType;
                    if (this.form.closeProcessId) {
                        this.showCloseProcess = true;
                    }
                    if (item.images) {
                        this.srcList = item.images.map(item => item.fileUrl);
                    }

                    this.setIframeContent(item.descrip)
                });
            } catch (error) {}
        },
        back() {
            this.$router.push({ name: 'BRrequirement' });
        },

        confirmCancel() {
          let isOk = true

          this.$refs['dialogForm'].validate(valid => {
            isOk = valid
          })

          if (!isOk) return

          this.disabledReveoke = true
          let data = {
            data: {
                id: this.$route.query.id,
                processId: this.form.processId,
                revocationReason: this.dialogForm.revocationReason,
            },
            op: 'withdraw',
          };

          this.$axios('/demand/manage/update', data).then(() => {
              this.$message.success('需求撤销成功！');
              this.dialogFormVisible = false;
              this.$router.push({name: "BRrequirement"})
          }).catch(() => {}).finally(() => {
            this.disabledReveoke = false
          })
        }
    },
};
</script>

<style lang="scss" scoped>
/deep/ .img-list img {
    width: 100px;
    height: 100px;
    margin: 10px;
    cursor: pointer;
    object-fit: cover;
}
/deep/ .ws-descriptions__title {
    padding: 24px 0 0 0;
}
/deep/ .main-section /deep/ .height-abs {
    padding: 16px 24px 90px 24px !important;
}

.container {
    background-color: #fff;
    margin-bottom: 64px;
    border-radius: 8px;
    overflow: hidden;

    .el-col-14 {
        min-width: 65%;
    }
    .currency-apply {
        background-color: #fff;
    }

    .header {
        display: flex;
        background-color: #fff;
        padding-bottom: 18px;
    }
}
/deep/ div.ws-descriptions__body {
    margin: 0 0 24px 30px;
}
/deep/ div.ws-descriptions__header {
    margin-left: 30px;
}

.text-wrapper {
  .line {
    display: flex;
    margin: 16px 0px 0px 30px;
    overflow-x: auto;
    flex-direction: column;
  }
  .left-title {
    width: 100px;
    // text-align: right;
    margin-bottom: 8px;
    font-weight: 600;
    color:#606266;
  }
  .right-content {
      flex:1;
      background-color: #f5f7fa;
      border: 1px solid #dcdfe6;
      border-radius: 5px;
      padding: 5px 15px;
      min-height: 200px;
      overflow-y: auto;
      resize:none;
      font-size: 16px;
  }
}
/deep/.ws-descriptions{
    margin-bottom:20px
}
/deep/.el-form{
    margin-top: 12px;
}
</style>
