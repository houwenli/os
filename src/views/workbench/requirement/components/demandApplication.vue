<template>
    <div class="requirenment-box">
        <div class="left">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" :rules="rules">
                <div class="title">需求申请表</div>
                <el-form-item label="需求类型：" prop="demandType">
                    <el-radio-group v-model="ruleForm.demandType" class="formRadio">
                        <el-radio-button label="1" v-if="getModulePower('/requirement').businessSave">业务需求</el-radio-button>
                        <el-radio-button label="2" v-if="getModulePower('/requirement').save">技术需求</el-radio-button>
                        <el-radio-button label="3" v-if="getModulePower('/requirement').daijiaSave">代驾技术需求</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="需求名称：" prop="demandName" class="labelPosition">
                    <el-input class="demand" type="textarea" placeholder="请输入需求名称（最多40字）" v-model="ruleForm.demandName" maxlength="40" autosize></el-input>
                </el-form-item>
                <el-form-item label="需求背景：" prop="background" class="labelPosition">
                    <el-input
                        class="deleted"
                        type="textarea"
                        ref="inputTextara"
                        :autosize="{ minRows: 6, maxRows: 8 }"
                        placeholder="请输入需求背景（最多1000字）"
                        v-model="ruleForm.background"
                        maxlength="1000"
                        show-word-limit
                        style="word-break: break-all"
                    ></el-input>
                </el-form-item>
                <el-form-item label="需求目的：" prop="purpose" class="labelPosition">
                    <el-input
                        class="deleted"
                        type="textarea"
                        ref="inputTextara1"
                        :autosize="{ minRows: 6, maxRows: 8 }"
                        placeholder="请输入需求目的（最多1000字）"
                        v-model="ruleForm.purpose"
                        maxlength="1000"
                        show-word-limit
                        style="word-break: break-all"
                    ></el-input>
                </el-form-item>
                <el-form-item label="需求描述：" prop="descrip" class="labelPosition">
                    <tiny-editor ref="editor" id="tinymce" v-model="ruleForm.descrip" :key="timer"></tiny-editor>
                </el-form-item>
                <el-form-item label="图片：" label-width="73px">
                    <div class="imgBox">
                        <div v-for="(item, index) in imgList" :key="index" class="imgUploadBox">
                            <ws-image-upload v-show="$route.query.name === 'edit' || id" :key="index" v-bind="options" ref="imageUpload" :urlList="getUrlList(item)" />
                        </div>
                        <ws-image-upload v-bind="options" ref="imageUpload" :key="timer" />
                        <span class="imgMsg">(不超过10M，支持png,jpg格式)</span>
                    </div>
                </el-form-item>
                <div class="process">
                    <el-form-item label="附件：" label-width="73px">
                        <uploadFile
                            :key="timer"
                            ref="uploadFile"
                            uploadDesc="(不超过10M，支持word,excle,pdf格式)"
                            :picSize="10485760"
                            :fileType="fileType"
                            :fileTypeMessage="fileTypeMessage"
                            @getFile="getFile"
                            :moduleName="moduleName"
                            :isShowRename="Boolean(getModulePower('/workbench/BRrequirement').fileRename)"
                            :isShowDownload="false"
                            :isShowDelete="Boolean(getModulePower('/workbench/BRrequirement').fileDelete)"
                            v-if="getModulePower('/workbench/BRrequirement').fileUpload"
                        ></uploadFile>
                    </el-form-item>
                    <el-form-item label="流程：" label-width="73px">
                        <audit-process v-if="ruleForm.demandType" :key="timerSecond" ref="auditProcess" :actions="actions" title="" :query="approvalTypeId" :overflowLimit="7"></audit-process>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <ws-footer>
            <el-button @click="back">返回</el-button>
            <el-button @click="handleSave('save')" v-if="getDraft()">保存草稿</el-button>
            <el-button type="danger" @click="handleSubmit" v-if="getDraft()">提交审核</el-button>
        </ws-footer>

        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-row>
                <p><i class="el-icon-success icon-img"></i></p>
                <p class="hint">需求已提交成功，你可在“工作台-需求申请-需求管理”中查看提交详情和处理进度。</p>
                <el-button @click="goTo(isActionId, demandStatus)" v-if="detailsPermission">查看详情</el-button>
                <el-button type="danger" @click="sure">确定</el-button>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'list',
    props: { id: { type: Number | String }, resubmitName: { type: String }, type: { type: String } },
    components: {
        TinyEditor: () => import('@/components/TinyEditor'),
        uploadFile: () => import('@/components/uploadFile/index.vue'),
        AuditProcess: () => import('@/components/AuditProcess'),
    },
    data() {
        return {
            fileType: [
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/pdf',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ],
            approvalTypeId: { nameCode: '' },
            timer: '',
            detailId: '',
            timerSecond: '',
            imageFileType: ['image/png', 'image/jpeg'],
            fileTypeMessage: ['word', 'pdf', 'excel'],
            imageFileTypeMessage: ['png', 'jpg'],
            sonMsg: '',
            actions: {
                moduleName: '/index/todo',
                op: 'flowNode',
            },
            options: {
                quantity: 0,
                actions: {
                    url: '/project/docManagement/uploadFile',
                    op: 'fileUpload',
                },
                beforeUpdate: this.beforeUpdate,
                afterUpload: this.afterUpload,
                handleRemove: this.handleRemove,
            },
            imgList: [], //上传图片集合
            data: [],
            list: [],
            autoSaveTimer: 0,
            moduleName: '/workbench/BRrequirement',
            ruleForm: {
                demandType: this.getModulePower('/requirement').save?'2':'1', //需求类型
                demandName: '',
                background: '',
                purpose: '',
                descrip: '',
                processId: '',
                attachmentList: '',
                fileId: '',
                pageFileList: [],
            },
            dialogVisible: false,
            rules: {
                demandName: [{ required: true, message: '请输入需求名称', trigger: ['blur', 'change'] }],
                background: [{ required: true, message: '请输入需求背景', trigger: ['blur', 'change'] }],
                purpose: [{ required: true, message: '请输入需求目的', trigger: ['blur', 'change'] }],
                demandType: [{ required: true, message: '请选择需求类型', trigger: ['blur', 'change'] }],
            },
            searchOptions: {
                demandStatus: '', // 需求状态
            },
            demandStatus: '',
            isActionId: '',
            approvalInfo: '',
            flag: '',
            proDefID: '',
        };
    },
    watch: {
        demandStatus(label) {
            this.searchOptions = {
                demandStatus: label,
            };
            this.$refs.table.tableData = [];
            this.$refs.table.search();
        },
        'ruleForm.demandType': {
            immediate: true,
            handler(val) {
                if (val === '1') {
                    this.approvalTypeId.nameCode = 28;
                }
                if (val === '2') {
                    this.approvalTypeId.nameCode = 25;
                }
                if (val === '3') {
                    this.approvalTypeId.nameCode = 21;
                }                
                this.getAutoSave();
                this.timerSecond = new Date().getTime();
            },
        },
    },
    activated() {
        if (![undefined, ''].includes(this.$route.query.id)) {
            let id = this.$route.query.id;
            this.detailId = id;
        }
        this.timer = '';
        this.empty();
        this.getAutoSave();
        if (this.id) {
            if (this.type === 'jishu') {
                this.approvalTypeId.nameCode = 25;
            } else if (this.type === 'driver') {
                this.approvalTypeId.nameCode = 21;
            } else {
                this.approvalTypeId.nameCode = 28;
            }
            this.getIdDetail();
        }
        if (this.$route.query.name === 'edit') {
            this.getApprovalTypeId();
            this.getDetail();
        }
    },
    mounted() {
        //定时器
        this.autoSaveTimer = setInterval(() => {
            this.change();
        }, 300000);
        this.empty();
    },
    beforeDestroy() {
        if (this.autoSaveTimer !== null) clearInterval(this.autoSaveTimer);
    },
    methods: {
        //查看详情权限控制
        detailsPermission() {
            let moduleName;
            if (this.sonMsg === 'businessDemandManage') {
                moduleName = '/business';
            } else if(this.sonMsg === 'driverRequirementsManage') {
                moduleName = '/driverDemand';
            } else {
                moduleName = '/technologyDemand';
            }
            if (this.getModulePower(moduleName).detail) {
                return true;
            } else {
                return false;
            }
        },
        getApprovalTypeId() {
            if (this.$route.query.type === 'jishu') {
                this.approvalTypeId.nameCode = 25;
            } else if(this.$route.query.type === 'driver'){
                this.approvalTypeId.nameCode = 21;
            } else {
                this.approvalTypeId.nameCode = 28;
            }
        },
        handleRemove(file){
            let index = this.imgList.findIndex(item => {
                return item.fileUrl === file.fileUrl
            })
            this.imgList.splice(index,1)
        },
        afterUpload(res) {
            if (res.code === 1) {
                this.imgList.push(res.data);
            }
            return JSON.parse(res.data).fileUrl;
        },
        getUrlList(item) {
            let url = item.fileUrl;
            if (url) {
                return [url];
            }
        },
        //表单校验
        checkForm() {
            let a = true;
            this.$refs.ruleForm.validate(valid => {
                a = valid;
            });
            return a;
        },
        back() {
            if (this.$route.query.name === 'edit') {
                this.$router.push({
                    name: 'BRrequirementdraft',
                    query: { type: true },
                });
            } else if (this.id) {
                this.imgList = [];
                this.timer = new Date().getTime();
                this.$refs.ruleForm.resetFields();
                this.$emit('emptyId');
                this.$emit('back');
            } else {
                this.$emit('back');
            }
        },
        //重新提交详情
        async getIdDetail() {
            try {
                let params = {
                    data: {
                        ids: [this.id],
                    },
                    op: 'detail',
                };
                let moduleName;
                if (this.$route.query.type === 'jishu') {
                    moduleName = '/technologyDemand';
                } else if(this.$route.query.type === 'driver') {
                    moduleName = '/driverDemand';
                } else {
                    moduleName = '/business';
                }
                let res = await this.$axios(this.$getModuleUrl(moduleName, params.op), params);
                if (res.code === 1) {
                    let arr = JSON.parse(res.data);
                    arr.forEach(item => {
                        this.ruleForm = item;
                        if (item.attachmentList) {
                            this.$refs.uploadFile.pageFileList = item.attachmentList;
                        }
                        if (item.images) {
                            this.imgList = item.images;
                        }
                    });
                }
            } catch (error) {}
        },
        //权限控制
        getDraft() {
            if (this.$route.query.name === 'edit' && (this.getModulePower('/workbench/BRrequirement').resubmit || this.getModulePower('/workbench/BRrequirement').resubmit)) {
                return true;
            } else if (this.$route.query.name !== 'edit' && (this.getModulePower('/requirement').save || this.getModulePower('/requirement').businessSave)) {
                return true;
            } else {
                return false;
            }
        },
        getFile() {
            this.data = this.$refs.uploadFile.pageFileList;
        },
        async change(val) {
            //调用自动保存接口
            try {
                if (this.$route.query.name != 'edit') {
                    let params = {
                        data: {
                            demandName: this.ruleForm.demandName,
                            background: this.ruleForm.background,
                            purpose: this.ruleForm.purpose,
                            descrip: this.ruleForm.descrip,
                            attachmentList: this.$refs.uploadFile.pageFileList,
                        },
                        op: this.ruleForm.demandType === '2' ? 'autoSave' : this.ruleForm.demandType === '3'?'daijiaAutoSave': 'businessAutoSave',
                    };
                    let res = await this.$axios(this.$getModuleUrl('/requirement', params.op), params);
                }
            } catch (error) {}
        },
        sure() {
            this.$emit('transfer', this.sonMsg);
            this.dialogVisible = false;
            this.$route.query.name = '';
        },
        //查看详情
        goTo(id, demandStatus) {
            this.dialogVisible = false;
            this.$store.dispatch('workbench/editStatus', { id });
            this.$router.push({
                path: 'BRrequirement/detail',
                query: {
                    id,
                    demandStatus,
                },
            });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        getFlag() {
            let allList = this.$refs.auditProcess.allList;
            this.approvalInfo = allList.map((items, i) => {
                return {
                    nodeKey: items.nodeKey,
                    userIds: items.userInfos
                        .filter((item, j) => {
                            return !item.isDefUser;
                        })
                        .map((item, j) => {
                            return item.id;
                        }),
                };
            });
            this.flag = allList.some(items => {
                this.proDefId = items.procdefId;
                return ['3', '4', '6', '7'].includes(items.memberType);
            });
        },
        //提交审核
        async handleSubmit() {
            if (!this.checkForm()) {
                this.$message({
                    showClose: true,
                    message: '请输入内容后提交审核',
                    type: 'error',
                });
                return;
            }
            this.getFlag();
            if (this.ruleForm.demandType == '1') {
                this.sonMsg = 'businessDemandManage';
            } else if (this.ruleForm.demandType == '2') {
                this.sonMsg = 'technicalRequirementsManage';
            } else if (this.ruleForm.demandType == '3') {
                this.sonMsg = 'driverRequirementsManage';
            }
            let moduleName;
            var op;
            if (this.ruleForm.demandType == '1') {
                if (this.$route.query.name === 'edit') {
                    moduleName = '/workbench/BRrequirement';
                    op = 'businessResubmit';
                } else {
                    moduleName = '/requirement';
                    op = 'businessSave';
                }
            } else if (this.ruleForm.demandType == '2') {
                if (this.$route.query.name === 'edit') {
                    moduleName = '/workbench/BRrequirement';
                    op = 'resubmit';
                } else {
                    moduleName = '/requirement';
                    op = 'save';
                }
            } else if (this.ruleForm.demandType == '3') {
                if (this.$route.query.name === 'edit') {
                    moduleName = '/workbench/BRrequirement';
                    op = 'daijiaResubmit';
                } else {
                    moduleName = '/requirement';
                    op = 'daijiaSave';
                }
            }
            let params = {
                data: {
                    id: this.$route.query.id || '',
                    demandName: this.ruleForm.demandName,
                    background: this.ruleForm.background,
                    purpose: this.ruleForm.purpose,
                    descrip: this.$refs.editor.getContent(),
                    processId: '1',
                    attachmentList: this.$refs.uploadFile.pageFileList,
                    images: this.imgList
                        ? this.imgList.map(item => {
                              if (typeof item === 'string') {
                                  return JSON.parse(item);
                              }
                              if (typeof item === 'object') {
                                  return item;
                              }
                          })
                        : [],
                    draft: 0,
                    approvalInfo: this.approvalInfo,
                    flag: this.flag,
                    flowId: this.proDefId,
                },
                op: op,
            };
            try {
                let res = await this.$axios(this.$getModuleUrl(moduleName, params.op), params);
                if (res.code === 1) {
                    let data = res.data;
                    this.timer = new Date().getTime();
                    this.$refs.editor.setContent('');
                    data = JSON.parse(data);
                    this.imgList = [];
                    this.isActionId = data.id;
                    this.$refs.ruleForm.resetFields();
                    this.$refs.uploadFile.pageFileList = [];
                    this.$refs.auditProcess.getFlowable();
                    this.dialogVisible = true;
                }
            } catch (error) {}
        },
        //保存草稿
        async handleSave() {
            if (!this.checkForm()) {
                this.$message({
                    showClose: true,
                    message: '请输入内容后提交草稿',
                    type: 'error',
                });
                return;
            }
            this.getFlag();
            let op;
            let moduleName;
            if (this.ruleForm.demandType == '1') {
                if (this.$route.query.name === 'edit') {
                    moduleName = '/workbench/BRrequirement';
                    op = 'businessResubmit';
                } else {
                    moduleName = '/requirement';
                    op = 'businessSave';
                }
            } else if (this.ruleForm.demandType == '2') {
                if (this.$route.query.name === 'edit') {
                    moduleName = '/workbench/BRrequirement';
                    op = 'resubmit';
                } else {
                    moduleName = '/requirement';
                    op = 'save';
                }
            } else if (this.ruleForm.demandType == '3') {
                if (this.$route.query.name === 'edit') {
                    moduleName = '/workbench/BRrequirement';
                    op = 'daijiaResubmit';
                } else {
                    moduleName = '/requirement';
                    op = 'daijiaSave';
                }
            }
            let params = {
                data: {
                    id: this.$route.query.id || '',
                    demandName: this.ruleForm.demandName,
                    background: this.ruleForm.background,
                    purpose: this.ruleForm.purpose,
                    descrip: this.$refs.editor.getContent(),
                    processId: '1',
                    attachmentList: this.$refs.uploadFile.pageFileList,
                    images: this.imgList
                        ? this.imgList.map(item => {
                              if (typeof item === 'string') {
                                  return JSON.parse(item);
                              }
                              if (typeof item === 'object') {
                                  return item;
                              }
                          })
                        : [],
                    draft: 1,
                    approvalInfo: this.approvalInfo,
                    flag: this.flag,
                    flowId: this.proDefId,
                },
                op: op,
            };
            try {
                let res = await this.$axios(this.$getModuleUrl(moduleName, op), params);
                if (res.code === 1) {
                    this.timer = new Date().getTime();
                    this.$refs.ruleForm.resetFields();
                    this.$refs.uploadFile.pageFileList = [];
                    this.imgList = [];
                    this.$refs.editor.setContent('');
                    this.$message.success('提交成功');
                    // return
                    this.$router.push({
                        name: 'BRrequirementdraft',
                    });
                }
            } catch (error) {}
        },
        //获取草稿箱编辑表单详情
        async getDetail() {
            let params = {
                data: {
                    id: this.detailId,
                },
                op: 'draftDetail',
            };
            try {
                let res = await this.$axios(this.getModuleUrl(params.op), params);
                if (res.code === 1) {
                    this.ruleForm = JSON.parse(res.data);
                    if (JSON.parse(res.data).attachmentList) {
                        this.$refs.uploadFile.pageFileList = JSON.parse(res.data).attachmentList;
                    }
                    if (JSON.parse(res.data).images) {
                        this.imgList = JSON.parse(res.data).images;
                    }
                }
            } catch (error) {}
        },
        //获取表单中删除按钮伪元素DOM
        empty() {
            this.$refs.inputTextara.$el.children[1].addEventListener('click', () => {
                this.ruleForm.background = '';
            });
            this.$refs.inputTextara.$el.children[1].style['pointer-events'] = 'none';
            this.$refs.inputTextara1.$el.children[1].addEventListener('click', () => {
                this.ruleForm.purpose = '';
            });
            this.$refs.inputTextara1.$el.children[1].style['pointer-events'] = 'none';
        },
        //获取自动保存内容
        async getAutoSave() {
            let params = {
                data: {},
                op: this.ruleForm.demandType === '2' ? 'getAutoSave' : this.ruleForm.demandType === '3' ? 'daijiaGetAutoSave' :'businessGetAutoSave',
            };         
            try {
                let res = await this.$axios(this.$getModuleUrl(this.ruleForm.demandType === '2' ? '/technologyDemand' :this.ruleForm.demandType === '3' ?
                '/driverDemand' : '/business', params.op), params);
                
                if (res.data != null) {
                    let {
                        demandName,
                        background,
                        purpose,
                        descrip,
                        process,
                        attachmentList,
                        fileId,
                        pageFileList: [],
                    } = this.ruleForm;
                    this.ruleForm = JSON.parse(res.data);
                    this.$refs.uploadFile.pageFileList = JSON.parse(res.data).attachmentList;
                    this.imgList = JSON.parse(res.data).images;
                    if (this.ruleForm.demandType == '1') {
                        this.approvalTypeId.nameCode = 28;
                    }
                    if (this.ruleForm.demandType == '2') {
                        this.approvalTypeId.nameCode = 25;
                    }
                    if (this.ruleForm.demandType == '3') {
                        this.approvalTypeId.nameCode = 21;
                    }
                    this.timerSecond = new Date().getTime();
                }
            } catch (error) {}
        },
    },
};
</script>

<style lang="scss" scoped>
.el-form-item {
    margin-bottom: 20px;
}
/deep/ .audit-content-footer-person {
    margin-top: 21px !important;
}
/deep/ .currency-apply-audit .currency-apply-audit-content .audit-content-header-title {
    margin-bottom: 0px !important;
}
/deep/ .currency-apply-audit .currency-apply-audit-content {
    padding: 0px 8px 0px 12px !important;
    min-height: 80px !important;
    /deep/ .currency-apply-audit .currency-apply-audit-content .audit-content-header-title {
        margin-bottom: 0px !important;
    }
}
.tab-btn {
    /deep/ .el-radio-button__inner {
        width: 124px !important;
    }
}
/deep/ .el-radio-button__inner {
    background-color: #ebeef5;
    border-style: none;
    border-left: 0px solid #dcdfe6 !important;
    border-radius: 0px 3px 3px 0px;
}
.requirenment-box {
    border-radius: 0 0 8px 8px !important;
    background: #fff;
    // border-radius: 8px;
    padding: 24px 24px 32px 24px;
    margin-bottom: 64px;
    /deep/ .el-radio-button {
        border-style: none;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inne {
        background-color: red;
    }
    /deep/ .el-radio-button__orig-radio:checked {
        border-style: none;
        background-color: red;
    }
    .el-form-item__content {
        margin-bottom: 5px;
    }

    /deep/ .el-textarea .el-input__count {
        background: #ffe4c400;
        bottom: -5px !important;
    }
    /deep/ .el-form-item.is-success .el-textarea__inner {
        height: 30px;
    }
    .demand /deep/ .el-input__count {
        display: none !important;
    }
    .bottomMenu {
        width: 100%;
        // margin-left: 15px;
        z-index: 999;
        // padding: 24px 0 0 0;
        bottom: 0px;
        height: 64px;
        margin: 0 auto;
        background-color: #fff;
        position: fixed;
        bottom: 0;
        left: 80px;
        box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.04);
        line-height: 64px;
        .el-button {
            width: 160px;
        }
    }

    .icon-img {
        display: inline-block;
        font-size: 50px;
        color: #67c23a;
        padding: 0px 0px 20px;
    }

    .hint {
        margin-bottom: 40px;
    }
    .left {
        width: 100%;
        background: #fff;
        border-radius: 0px 0px 8px 8px !important;
        padding: 24px 24px 0;
        margin: 0 auto;
        // margin-bottom: 64px;
        /deep/.currency-apply .upload-box .el-button {
            width: 155px !important;
            .upload-btn {
                margin-left: 15px !important;
            }
        }
        .imgBox {
            display: flex;
            .imgUploadBox {
                /deep/ .el-upload--picture-card {
                    display: none;
                }
            }
            .imgMsg {
                color: #909399;
                font-size: 13px;
            }
        }
        .formRadio {
            justify-content: space-between !important;
            margin-right: 590px;
            /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
                color: #f05259;
                background-color: #fff;
                border: 1px solid #f05259 !important;
                // border-left: none !important;
                border-radius: 4px 4px 4px 4px !important;
                -webkit-box-shadow: 0px 0 0 0 #f05259;
            }
            /deep/ .el-radio-button__orig-radio + .el-radio-button__inner {
                background-color: #fff;
                border: 1px solid #dcdfe6 !important;
                border-radius: 4px 4px 4px 4px !important;
            }
        }
        .el-form {
            width: 1000px;
            min-width: 60px;
            margin: 0 auto;
        }
        .process {
            margin-left: 0px;
            /deep/.el-form-item{
                margin-bottom:0px
            }
            /deep/ .el-timeline-item{
                padding-bottom:0px
            }
        }

        .hint {
            margin-bottom: 20px;
        }
        .el-dialog {
            min-width: 300px;
            width: 200px;
        }
    }
    // 下方切换按钮样式
    /deep/ .el-tabs__nav-wrap {
        margin: 0px;
        background: #f5f7fa;
        padding: 0;
        margin-left: 50px;
    }
    .title {
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        padding-bottom: 20px;
    }
    .el-row {
        text-align: center;
    }
    .el-radio-group {
        display: flex;
        justify-content: space-between;
    }
}
/deep/ .el-input__count {
    height: 41px;
}
.deleted /deep/ .el-input__count::before {
    content: '';
    display: inline-block;
    pointer-events: auto;
    position: relative;
    top: 4px;
    margin-right: 5px;
    width: 16px;
    height: 16px;
    background: url(../../../../assets/images/delet.png) no-repeat left 50%;
    background-size: cover;
}
.deleted /deep/ .el-input__count::before:active {
    background-color: #67c23a;
}
/deep/ .currency-apply-audit {
    padding: 0 !important;
}
/deep/ .el-timeline {
    margin-left: -30px !important;
    margin-top: 40px;
}
/deep/ .el-textarea__inner {
    color: #000000;
}
.icon-img {
    display: inline-block;
    font-size: 50px;
    color: #67c23a;
    padding: 0px 0px 20px;
}
.labelPosition {
    display: flex;
    flex-direction: column;
    /deep/.el-form-item__content {
        margin-left: 10px !important;
        margin-top: 0px !important;
    }
}
</style>
