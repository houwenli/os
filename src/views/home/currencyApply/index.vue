<template>
    <div>
        <div class="currency-apply">
            <!-- 表单 -->
            <div class="currency-apply-title">通用审批</div>
            <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" @submit.native.prevent>
                <el-form-item label="审批内容:" prop="content">
                    <el-input type="text" v-model="ruleForm.content" placeholder="请输入审批内容" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="审核详情:" prop="detail">
                    <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 6 }" v-model="ruleForm.detail" placeholder="请输入审核详情" maxlength="1000" show-word-limit></el-input>
                </el-form-item>
            </el-form>
            <!-- 上传图片 -->
            <div class="currency-apply-upload-title">
                上传图片
                <span>(最多可上传9张)</span>
            </div>
            <div class="currency-apply-upload">
                <ws-image-upload v-bind="options" :urlList="urlList" />
            </div>
            <!-- 上传附件 -->
            <div class="currency-apply-upload-title">
                附件
                <span>(最多可上传{{ actionQuery.maxLimit }}个)</span>
            </div>
            <div class="currency-apply-upload-file">
                <el-row :gutter="40">
                    <el-col :md="6" :lg="8" v-for="(item, index) in fileList" :key="index">
                        <div class="grid-content bg-purple">
                            <img src="@/assets/index/file_icon.png" alt width="40" style="margin-right: 16px" />
                            <div style="width: 80%">
                                <div class="grid-content-title">{{ item.fileName }}</div>
                                <div class="grid-content-size">{{ item.fileSize }}</div>
                            </div>
                            <i class="el-icon-error" style="position: absolute; top: -6px; right: -6px; color: #8d9096; cursor: pointer" @click.stop="handleCloseFile(index)"></i>
                        </div>
                    </el-col>
                    <el-col :md="6" :lg="8" v-if="uploadFileMax">
                        <div class="grid-content bg-purple">
                            <el-upload :action="uploadFile" :data="actionQuery" :on-success="handleSuccess" :before-upload="beforeUpload" :show-file-list="false">
                                <img class="upload-file-btn" width="40" src="@/assets/index/add-img.png" alt />
                                <span class="upload-file-text">上传附件</span>
                            </el-upload>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>

        <!-- 审核流程 -->
        <div style="margin-bottom: 64px; margin-top: 16px">
            <audit-process
                @update:load="updateLoad"
                :load.sync="isLoaded"
                title="审核流程"
                ref="auditProcess"
                :actions="actions"
                :query="{ nameCode: $route.query.id }"
                :overflowLimit="10"
                custom-class="custom-class"
            ></audit-process>
        </div>

        <!-- 底部按钮 -->
        <footer-fixed>
            <ws-throttle>
                <el-button
                    type="primary"
                    style="width: 160px; height: 36px"
                    :loading="submitLoading"
                    :disabled="disabled"
                    @click="submitForm('ruleForm')"
                    v-if="getModulePower('/currencyApply').startProcess||getModulePower('/currencyApplyBranchRole').startProcess"
                >
                    提交审核
                </el-button>
            </ws-throttle>
        </footer-fixed>
    </div>
</template>

<script>
import FooterFixed from '../components/FooterFixed';
import AuditProcess from '@/components/AuditProcess';

export default {
    name: 'currencyApply',
    components: { FooterFixed, AuditProcess },

    data() {
        return {
            moduleName: '/currencyApply',
            ruleForm: {
                content: '',
                detail: '',
            },
            rules: {
                content: [
                    {
                        required: true,
                        message: '请输入审批内容',
                        trigger: 'blur',
                    },
                ],
                detail: [
                    {
                        required: true,
                        message: '请输入审批详情',
                        trigger: 'blur',
                    },
                ],
            },
            options: {
                quantity: 9,
                actions: {
                    url: '/flowFile/upload',
                    op: 'upload',
                },
                beforeUpdate: this.beforeUpdate,
                afterUpload: this.afterUpload,
                handleRemove: this.handleRemove,
            },
            reviewerList: [],
            ccList: [],
            actionQuery: {
                op: 'upload',
                data: {},
                token: $vuex.$baseMethod.getStore('_ccmUser').token,
                maxLimit: 9,
            },
            actions: {
                moduleName: '/index/todo',
                op: 'flowNode',
            },
            fileList: [],
            imgList: [],//图片上传集合
            urlList:[],//图片展示集合
            isLoaded: false,
            submitLoading: false,
            disabled:false,
            resubmissionData: {},
        };
    },

    created() {
        if (this.$route.query.procInsId) {
            this.resubmissionData = this.$route.query;
            this.getDetailData();
        }
        this.getFileMaxNumber();
    },

    computed: {
        uploadFile() {
            return `${process.env.VUE_APP_PROCESS_API}/flowFile/upload`;
        },

        uploadFileMax() {
            return this.fileList.length < this.actionQuery.maxLimit;
        },
    },

    methods: {
        getFileMaxNumber() {
            let opt = {
                data: null,
                op: 'getFileMaxNumber',
            };
            this.$axios('/flowable/common/select', opt).then(res => {
                if (res.code == 1) {
                    this.actionQuery.maxLimit = this.options.quantity = Number(res.data);
                }
            });
        },
        updateLoad(val){
            if(val===true){
                this.disabled = true;
            }      
        },
        getUrlList(item) {
            let url = item.url;
            if (url) {
                return [url];
            }
        },
        //获取重新提交详情
        async getDetailData() {
            let opt = {
                data: JSON.stringify({
                    procinstId: this.resubmissionData.procInsId,
                    taskId: this.resubmissionData.taskId,
                }),
                op: 'flowDetail',
            };

            try {
                const res = await this.$axios('/new/flowable/form/select', opt);
                let data = JSON.parse(JSON.parse(res.data).nodeFormJson);
                this.ruleForm = data;
                data.imgList.forEach(item => {
                    this.urlList.push(item.URL);
                });
                this.imgList= data.imgList;
                this.fileList = data.fileList;
            } catch (error) {}
        },
        beforeUpdate() {
            return {};
        },

        afterUpload(res) {
            if (res.code === 1) {
                this.imgList.push(res.data);
            }
            return res.data.URL;
        },
        handleRemove(url) {
            this.imgList = this.imgList.filter(item => {
                return item.URL != url;
            });
        },

        handleSuccess(response) {
            if (response.code === 1) {
                this.fileList.push(response.data);
            } else {
                this.$message.error(response.msg);
            }
        },

        handleCloseFile(index) {
            this.fileList.splice(index, 1);
        },

        beforeUpload(file) {
            // 允许上传的文件类型
            const whiteList = [
                'audio/mpeg',
                'application/msword',
                'application/vnd.ms-excel',
                'application/x-zip-compressed',
                'officedocument.spreadsheetml.sheet',
                'image/png',
                'text/csv',
                'image/jpeg',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ];
            if (!whiteList.includes(file.type)) {
                this.$message.error('上传的文件格式不支持!');
                return false;
            }
            if (file.size > 20971520) {
                this.$message.error('文件大小不能超过20M!');
                return false;
            }
            return this.fileList.length < this.actionQuery.maxLimit;
        },

        //处理数据
        createdApprovalInfo() {
            let allList = this.$refs.auditProcess.allList;
            return allList.map((items, i) => {
                return {
                    nodeId: items.nodeKey,
                    userIds: items.userInfos
                        .filter((item, j) => {
                            return item.id && !item.isDefUser;
                        })
                        .map(item => {
                            return item.id;
                        }),
                };
            });
        },

        checkedApprovaForm() {
            let allList = this.$refs.auditProcess.allList;
            const arr = allList.filter(item => {
                return item.memberType == 3 || item.memberType == 4;
            });
            return arr.every(item => {
                return item.userInfos.length > 0;
            });
        },

        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },

        //提交申请
        submitForm(formName) {
            let moduleName;
            if(this.$route.query.id==='29'){
                moduleName='/currencyApplyBranchRole'
            }else if(this.$route.query.id==='24'){
                moduleName='/currencyApply'
            }
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.checkedApprovaForm()) {
                        let form = Object.assign(this.ruleForm, { imgList:this.imgList, fileList: this.fileList });
                        let opt = {
                            data: {
                                nameCode: this.$route.query.id,
                                procDefId: this.$refs.auditProcess.procdefId,
                                approvalInfo: this.createdApprovalInfo(),
                                nodeFormJson: JSON.stringify(form),
                                flag: true,
                            },
                            op: 'startProcess',
                        };

                        this.submitLoading = true;
                       
                        this.$axios(this.$getModuleUrl(moduleName, opt.op), opt)
                            .then(res => {
                                //提交成功
                                const { msg } = res.data && JSON.parse(res.data);
                                if (res.code == 1 && msg == null) {
                                    this.$router.replace({ path: '/applySuccess' });
                                }
                                //有新的工作流
                                if (res.code == 1 && msg == '001') {
                                    this.$confirm('当前审批配置的工作流规则有更新。确认后，流程区将按新工作流刷新节点。', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning',
                                    })
                                        .then(() => {
                                            this.$refs.auditProcess.getFlowable();
                                        })
                                        .catch(() => {});
                                }
                            })
                            .catch(e => {})
                            .finally(() => {
                                this.submitLoading = false;
                            });
                    } else {
                        this.$message.error('还有审批人没选择，请补充完整!');
                    }
                } else {
                    window.scrollTo(0, 0);
                    return false;
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.currency-apply {
    background: #ffffff;
    border-radius: 8px;
    padding: 32px 40px 8px 40px;

    /deep/ .el-form-item__label {
        font-weight: 500;
    }

    .currency-apply-upload-title {
        color: #606266;
    }

    &-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 16px;
    }

    &-upload-title {
        margin: 32px 0 16px 0;

        span {
            color: #f56c6c;
        }
    }
    &-upload-file {
        .grid-content {
            display: flex;
            border-radius: 4px;
            min-height: 80px;
            margin-bottom: 24px;
            position: relative;

            .grid-content-title {
                font-size: 14px;
                color: #606266;
                margin-bottom: 8px;
                width: 90%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .grid-content-size {
                color: #c0c4cc;
                font-size: 12px;
            }
        }
        .bg-purple {
            background: #f5f7fa;
            border-radius: 8px;
            padding: 16px;
        }
        .upload-file-btn {
            background: #fff;
            padding: 4px;
            border-radius: 4px;
            box-sizing: content-box;
        }

        /deep/ .el-upload--text {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            text-align: left;
            display: flex;
            align-items: center;
        }
        .upload-file-text {
            margin-left: 16px;
            font-size: 14px;
            color: #606266;
        }
    }
}

/deep/.currency-apply-audit {
    margin-top: 16px;
    padding: 32px 40px 20px 40px !important;
}
</style>
