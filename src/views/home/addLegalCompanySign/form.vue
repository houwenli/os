<template>
    <div>
        <div class="org-legal-company">
            <!-- 表单 -->
            <el-form class="legal-form" label-position="right" :model="legalForm" :rules="rules" ref="legalForm" label-width="120px">
                <div class="org-legal-company-title">公司信息</div>
                <el-row :gutter="40">
                    <el-col :span="8">
                        <!-- <el-form-item label="独立法人公司:" prop="companyName">
                            <el-select v-model="legalForm.companyName" style="width: 100%" clearable placeholder="请选择公司名称" @change="changeCompanyName">
                                <el-option v-for="item in companyNameList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item> -->

                        <el-form-item label="独立法人公司:" prop="companyName">
                            <el-select
                                style="width: 100%"
                                v-model="legalForm.companyName"
                                placeholder="请输入独立法人公司"
                                clearable
                                filterable
                                remote
                                reserve-keyword
                                :popper-append-to-body="true"
                                :remote-method="getCompanyNameList"
                                @change="changeCompanyName"
                                @clear="handleCompanyNameClear"
                            >
                                <el-option v-for="item in companyNameList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="实际控制人:" prop="controlName">
                            <el-input v-emoji v-model.trim="legalForm.controlName" placeholder="请输入姓名" maxlength="10" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="控制人电话:" prop="controlPhone">
                            <el-input v-model.trim="legalForm.controlPhone" placeholder="请输入手机号" maxlength="11" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="控制人身份证:" prop="controlIdNumber">
                            <el-input v-model.trim="legalForm.controlIdNumber" placeholder="请输入控制人身份证号码" maxlength="20" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="办公场地:" prop="officeSpace">
                            <el-input v-model.trim="legalForm.officeSpace" placeholder="请输入详细地址" maxlength="50" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="org-legal-company-title to-top">法人信息</div>
                <el-row :gutter="40">
                    <el-col :span="8">
                        <el-form-item label="法定代表人:" prop="legalRepresentative">
                            <el-input v-emoji v-model.trim="legalForm.legalRepresentative" placeholder="请输入独立法人姓名" maxlength="10" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="法人身份证:" prop="legalIdNumber">
                            <el-input v-model.trim="legalForm.legalIdNumber" placeholder="请输入独立法人身份证号码" maxlength="20" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="法人性别:" prop="legalSex">
                            <el-select required v-model="legalForm.legalSex" style="width: 100%" :disabled="true">
                                <el-option label="男" :value="1"></el-option>
                                <el-option label="女" :value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="法人电话:" prop="legalPhone">
                            <el-input v-model.trim="legalForm.legalPhone" placeholder="请输入独立法人手机号" maxlength="11" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="org-legal-company-title to-top">签约信息</div>
                <el-row :gutter="40">
                    <el-col :span="8" style="height: 58px">
                        <el-form-item label="机构简称:">
                            <organizationOptions :valueKey="'relationId'" :selectOptions="selectOptions" @select="handleSelect" @orgTypeChange="orgTypeChange"></organizationOptions>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="8">
                        <el-form-item label="分公司简称:" prop="signCompanySimpleName">
                            <el-select
                                style="width: 100%"
                                v-model="legalForm.signCompanySimpleName"
                                placeholder="分公司名称"
                                clearable
                                filterable
                                remote
                                reserve-keyword
                                :popper-append-to-body="false"
                                :remote-method="remoteMethod"
                                @change="branchComChange"
                            >
                                <el-option v-for="item in simpleBranchName" :key="item.orgId" :label="item.orgName" :value="item.orgName"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="8">
                        <el-form-item label="签约时间" prop="signTime">
                            <el-date-picker style="width: 100%" v-model="legalForm.signTime" type="date" placeholder="请选择日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="机构全称:">
                            <el-input v-model.trim="legalForm.signCompanyName" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="机构编码:">
                            <el-input v-model.trim="legalForm.agencyNumber" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="机构总经理:">
                            <el-input v-model.trim="legalForm.corporateManager" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系方式:">
                            <el-input v-model.trim="legalForm.corporateManagerPhone" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="上级机构:">
                            <el-input v-model.trim="legalForm.parentOrg" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="org-legal-company-title to-top-big no-bottom">
                签约附件信息
                <span class="tip-font">(支持JPG、PNG、PDF、WORD、EXCEL，大小不超过50M)</span>
            </div>
            <el-row :gutter="20" class="pic-upload">
                <el-col :span="8" class="pic-list" v-for="(item, index) in attachmentList" :key="item.id">
                    <upload-file
                        class="uploadFile"
                        ref="uploadFileRef"
                        :fileType="[
                            'image/png',
                            'image/jpeg',
                            'application/msword',
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            'application/vnd.ms-excel',
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            'application/pdf',
                        ]"
                        :fileTypeMessage="['png', 'jpg', 'word', 'excel', 'pdf']"
                        limitCount="1"
                        uploadDesc=""
                        :fileMap="item"
                        :index="index"
                        :picSize="52428800"
                    ></upload-file>
                </el-col>
            </el-row>
            <div class="org-legal-company-title to-top-big no-bottom" v-if="signStatus === 1 && legalForm.signCompanyName">
                解约附件资料信息
                <span class="tip-font">(支持JPG、PNG、PDF、WORD、EXCEL，大小不超过50M)</span>
            </div>
            <div class="org-legal-company-title to-top-big no-bottom" v-if="signStatus === 1 && legalForm.signCompanyName">
                <span class="tip-font">{{ legalForm.signCompanyName }}已与独立法人公司{{ singCorporationName }}签约，重新签约需与原独立法人公司{{ singCorporationName }}解约，请上传解约文件</span>
            </div>
            <el-row :gutter="20" v-if="signStatus === 1 && legalForm.signCompanyName">
                <el-col :span="8" v-for="(item, index) in attachmentEndList" :key="item.id">
                    <upload-file
                        class="uploadFile"
                        ref="uploadEndFileRef"
                        :fileType="[
                            'image/png',
                            'image/jpeg',
                            'application/msword',
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            'application/vnd.ms-excel',
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            'application/pdf',
                        ]"
                        :fileTypeMessage="['png', 'jpg', 'word', 'excel', 'pdf']"
                        limitCount="1"
                        uploadDesc=""
                        :fileMap="item"
                        :index="index"
                        :picSize="52428800"
                    ></upload-file>
                </el-col>
            </el-row>
        </div>
        <div class="org-legal-company process-box">
            <!-- 审核流程 -->
            <div class="org-legal-company-title" style="margin-bottom: 0">审核流程</div>
            <audit-process class="audit-process" title="" ref="auditProcess" :actions="actions" :query="{ nameCode: 35 }"></audit-process>
        </div>
        <!-- 底部导航 -->
        <footer-fixed backTo="index">
            <ws-throttle>
                <el-button :loading="btnLoading" type="primary" style="width: 160px; height: 36px" @click="submitForm">提交审核</el-button>
            </ws-throttle>
        </footer-fixed>
    </div>
</template>

<script>
import FooterFixed from '../components/FooterFixed';
import AuditProcess from '@/components/AuditProcess';
import UploadFile from './uploadFile/index.vue';
import { _axios } from '@/utils/commMethods';
import organizationOptions from '../components/organization-options.vue';
export default {
    name: 'addLegalCompanySign',
    components: {
        FooterFixed,
        AuditProcess,
        UploadFile,
        organizationOptions,
    },
    data() {
        return {
            moduleName: '/addLegalCompanySign',
            pageType: 'addLegalCompanySign',
            signStatus: null, // 显示解约附件  1:显示  0不显示
            legalForm: {
                companyName: '', // 独立法人公司
                controlName: '', // 实际控制人
                controlPhone: '', // 控制人电话
                controlIdNumber: '', // 控制人身份证
                officeSpace: '', // 办公场地
                legalRepresentative: '', // 法定代表人
                legalIdNumber: '', // 法人身份证
                legalSex: '', // 法人性别
                legalPhone: '', // 法人电话
                signCompanySimpleName: '', // 分公司简称
                signTime: '', // 签约时间
                signCompanyName: '', // 分公司全称
                agencyNumber: '', // 机构编码
                corporateManager: '', // 分公司总经理
                corporateManagerPhone: '', // 联系方式
                orgType: '', // 机构类型
                parentOrg: '', // 上级机构
                rpcFileAos: [], // 附件信息
                terminationFiles: [], // 解约附件信息
                corporateCompanyId: '', // 法人分公司id
            },
            rules: {
                companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
                controlName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                controlPhone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    {
                        // pattern: /^1\d{10}$/,
                        pattern: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
                        message: '请输入正确的电话号码',
                        trigger: 'blur',
                    },
                ],
                controlIdNumber: [
                    { required: true, message: '请输入实际控制人身份证号码', trigger: 'blur' },
                    {
                        pattern: /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                        message: '请输入正确的身份证号码',
                        trigger: 'blur',
                    },
                ],
                officeSpace: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
                legalRepresentative: [{ required: true, message: '请输入独立法人姓名', trigger: 'blur' }],
                legalIdNumber: [
                    { required: true, message: '请输入独立法人身份证号码', trigger: 'blur' },
                    {
                        pattern: /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                        message: '请输入正确的身份证号码',
                        trigger: 'blur',
                    },
                ],
                legalSex: [{ required: true, message: '请选择法人性别', trigger: 'change' }],
                legalPhone: [
                    { required: true, message: '请输入独立法人手机号', trigger: 'blur' },
                    {
                        pattern: /^1\d{10}$/,
                        message: '请输入正确的电话号码',
                        trigger: 'blur',
                    },
                ],
                signCompanySimpleName: [{ required: true, message: '请选择分公司', trigger: 'change' }],
                signTime: [{ required: true, message: '请选择签约时间', trigger: 'blur' }],
            },
            actions: {
                moduleName: '/index/todo',
                op: 'flowNode',
            },
            mapShow: false,
            isUpload: false,
            cityOpt: {},
            superOrgList: [], // 上级机构
            attachmentList: [], // 附件列表
            attachmentEndList: [], // 解约附件列表
            btnLoading: false,
            rpcFileAos: [],
            terminationFiles: [],
            personPostOption: [], // 职务列表
            simpleBranchName: [],
            companyName: '',
            companyNameList: [], //独立法人公司列表
            selectOptions: [
                {
                    value: '20',
                    label: '一级机构',
                },
                {
                    value: '30',
                    label: '二级机构',
                },
            ],
            singCorporationName: '', // 签约的机构全称
        };
    },
    computed: {},
    created() {
        // 签约
        this.getAttachmentNameList({ orgType: 60 }).then(res => {
            this.attachmentList = res || [];
        });
        // 解约
        this.getAttachmentNameList({ orgType: 70 }).then(res => {
            this.attachmentEndList = res || [];
        });
        // 获取负责人职务
        this.getPersonPostOption();
        // 获取独立法人公司列表
        this.getCompanyNameList();
    },
    mounted() {},
    methods: {
        // 获取附件名称list-通用接口
        getAttachmentNameList(parm) {
            let data = {
                data: JSON.stringify(parm),
                op: 'detail',
            };
            let URL = '/orgWeb/attachment/select';
            return new Promise((resolve, reject) => {
                $vuex.$axios(URL, data).then(
                    response => {
                        let dataList = JSON.parse(response.data);
                        resolve(dataList);
                    },
                    response => {
                        reject(response.data);
                    }
                );
            });
        },
        uploadImgValidate(uploadFileName) {
            if (uploadFileName == 'uploadFileRef') {
                if (!this.attachmentList.length) return true;
            } else if (uploadFileName == 'uploadEndFileRef') {
                if (!this.attachmentEndList.length) return true;
            }
            let components = this.$refs[uploadFileName];
            for (let i = 0; i < components.length; i++) {
                let item = components[i];
                let list = item.pageFileList;
                let upload = uploadFileName == 'uploadFileRef' ? this.attachmentList[i] : this.attachmentEndList[i];
                if (!list.length) {
                    this.$message.error(`${upload.name}上传位不能为空`);
                    return;
                }
            }
            return true;
        },
        submitForm() {
            this.$refs.legalForm.validate(valid => {
                if (valid) {
                    let rpcWorkFlowAoList = this.createdApprovalInfo();
                    if (!this.uploadImgValidate('uploadFileRef') || !this.setApprovalPer(rpcWorkFlowAoList)) return;
                    if (this.signStatus === 1 && !this.uploadImgValidate('uploadEndFileRef')) return;
                    let formData = JSON.parse(JSON.stringify(this.legalForm));
                    this.rpcFileAos = [];
                    this.terminationFiles = [];
                    if (this.$refs.uploadFileRef) {
                        this.$refs.uploadFileRef.forEach(item => {
                            this.rpcFileAos.push(...item.pageFileList);
                        });
                    }
                    if (this.$refs.uploadEndFileRef) {
                        this.$refs.uploadEndFileRef.forEach(item => {
                            this.terminationFiles.push(...item.pageFileList);
                        });
                    }
                    this.btnLoading = true;
                    let opt = {
                        data: {
                            ...formData,
                            companyName: this.companyName,
                            rpcFileAos: this.rpcFileAos,
                            terminationFiles: this.terminationFiles,
                            rpcWorkFlowAoList,
                        },
                        op: 'save',
                    };
                    this.$axios(this.getModuleUrl(opt.op), opt)
                        .then(res => {
                            if (res.code == 1) {
                                this.btnLoading = false;
                                this.$message.success('新增成功');
                                this.$router.push({ path: '/index' });
                            } else {
                                this.btnLoading = false;
                            }
                        })
                        .catch(err => {
                            if (err.code == -110) {
                                this.btnLoading = false;
                                this.$router.push({ path: '/index' });
                            } else if (err.code == -100) {
                                this.$confirm('当前审批配置的工作流规则有更新。确认后，流程区将按新工作流刷新节点。', '提示', {
                                    confirmButtonText: '确定',
                                    type: 'warning',
                                }).then(() => {
                                    this.$refs.auditProcess.getFlowable();
                                    this.btnLoading = false;
                                });
                            } else {
                                this.btnLoading = false;
                            }
                        });
                }
            });
        },
        // 获取分公司
        remoteMethod(name) {
            if (name !== '') {
                let opt = {
                    data: {
                        orgType: 20,
                        orgName: name,
                    },
                    op: 'selectSignInfo',
                };
                this.$axios('/resource/corporateCompany/select', opt).then(res => {
                    this.simpleBranchName = JSON.parse(res.data) || [];
                });
            } else {
                this.simpleBranchName = [];
            }
        },
        // 分公司简称改变
        branchComChange(name) {
            // if(name) {
            this.simpleBranchName.some(item => {
                if (name === item.orgName) {
                    this.legalForm.signCompanyName = item.signCompanyName;
                    this.legalForm.agencyNumber = item.agencyNumber;
                    this.legalForm.corporateManager = item.corporateManager;
                    this.legalForm.corporateManagerPhone = item.corporateManagerPhone;
                    this.legalForm.parentOrg = item.parentOrg;
                    return true;
                }
            });
            // }
        },
        // 获取负责人职务选项
        getPersonPostOption() {
            let opt = {
                data: {
                    orgType: 60,
                },
                op: 'selectOrgPositionList',
            };
            // this.$axios(this.getModuleUrl(opt.op), opt).then(res => {
            this.$axios('/authority/positionAuth/select', opt).then(res => {
                this.personPostOption = JSON.parse(res.data) || [];
            });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        //审核流程校验
        setApprovalPer(list) {
            if (!list.length) return true;
            for (let item of list) {
                if ((item.memberType == '3' || item.memberType == '4') && item.userIds.length == 0) {
                    this.$message.error(`还有审批人没选择，请补充完整`);
                    return false;
                }
                delete item.memberType;
            }
            return true;
        },
        createdApprovalInfo() {
            let allList = this.$refs.auditProcess.allList;
            let approvalInfo = allList.map((items, i) => {
                return {
                    memberType: items.memberType,
                    nodeId: items.nodeKey,
                    procDefId: items.procdefId,
                    userIds: items.userInfos
                        .filter((item, j) => {
                            return !item.isDefUser;
                        })
                        .map((item, j) => {
                            return item.id;
                        }),
                };
            });
            return approvalInfo;
        },
        chooseLocal(bool, cityOpt) {
            this.cityOpt = cityOpt;
            this.mapShow = bool;
        },
        getMapInfo({ lat, lng, formattedAddress }) {
            this.physicalStoreForm.longitude = lng;
            this.physicalStoreForm.latitude = lat;
            this.physicalStoreForm.address = formattedAddress ? formattedAddress : '';
        },
        phoneChange(val) {
            if (val) {
                let flag = /^1\d{10}$/.test(val);
                if (!flag) {
                    this.$message.error('请输入正确的电话号码');
                }
            }
        },
        // 获取独立法人公司列表
        getCompanyNameList(name) {
            let opt = {
                data: { companyName: name },
                op: 'queryAllCorporateCompanyList',
            };
            this.$axios('/resource/corporateCompany/select', opt).then(res => {
                this.companyNameList = JSON.parse(res.data).listVo || [];
            });
        },
        changeCompanyName(id) {
            if (id) {
                this.getCompanyNameDetail(id);
            }
        },
        // 获取独立法人公司详情
        getCompanyNameDetail(id) {
            let opt = {
                data: { corporateCompanyId: id },
                op: 'corporateCompanyDetail',
            };
            this.$axios('/resource/corporateCompany/select', opt).then(res => {
                let data = JSON.parse(res.data);
                const { corporateCompanyId, companyName, controlName, controlPhone, controlIdNumber, officeSpace, legalRepresentative, legalIdNumber, legalSex, legalPhone, signTime } = data;
                this.legalForm.controlName = controlName;
                this.legalForm.controlPhone = controlPhone;
                this.legalForm.controlIdNumber = controlIdNumber;
                this.legalForm.officeSpace = officeSpace;
                this.legalForm.legalRepresentative = legalRepresentative;
                this.legalForm.legalIdNumber = legalIdNumber;
                this.legalForm.legalSex = legalSex;
                this.legalForm.legalPhone = legalPhone;
                this.legalForm.signTime = signTime;
                this.legalForm.corporateCompanyId = corporateCompanyId;
                this.companyName = companyName;
            });
        },
        handleSelect(data) {
            const { signCompanyName, agencyNumber, corporateManager, corporateManagerPhone, parentOrg, signStatus, singCorporationName } = data;
            this.legalForm.signCompanyName = signCompanyName;
            this.legalForm.agencyNumber = agencyNumber;
            this.legalForm.corporateManager = corporateManager;
            this.legalForm.corporateManagerPhone = corporateManagerPhone;
            this.legalForm.parentOrg = parentOrg;
            this.signStatus = signStatus;
            this.singCorporationName = singCorporationName;
        },
        orgTypeChange(value) {
            this.legalForm.orgType = value;
        },
        handleCompanyNameClear() {
            this.legalForm.controlName = '';
            this.legalForm.controlPhone = '';
            this.legalForm.controlIdNumber = '';
            this.legalForm.officeSpace = '';
            this.legalForm.legalRepresentative = '';
            this.legalForm.legalIdNumber = '';
            this.legalForm.legalSex = '';
            this.legalForm.legalPhone = '';
            this.legalForm.signTime = '';
            this.legalForm.corporateCompanyId = '';
            this.companyName = '';
        },
    },
};
</script>

<style lang="scss" scoped>
.org-legal-company {
    background: #ffffff;
    border-radius: 8px;
    padding: 32px 40px;

    ::v-deep.legal-form {
        .el-form-item__label {
            font-weight: 500;
        }
    }

    &-title {
        font-size: 16px;
        font-weight: 600;
        font-family: PingFangSC-Medium, PingFang SC;
        color: #303133;
        margin-bottom: 16px;
    }
    .to-top {
        margin-top: 10px;
    }
    .to-top-big {
        margin-top: 32px;
    }
    .no-bottom {
        margin-bottom: 0;
    }
    ::v-deep.table {
        position: relative;
        .link-text {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 57px;
            border: 1px solid #ebeef5;
            border-top: none;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            .add-btn {
                width: 96px;
                height: 36px;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #f05259;
                display: flex;
                justify-content: center;
                align-items: center;
                border: none;
                background: #fff;
                &:hover {
                    background: #fff;
                }
                & > span {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                img {
                    margin-right: 4px;
                }
            }
        }
    }
    .tip-font {
        color: #f56c6c;
        font-size: 14px;
        font-weight: 400;
        font-family: PingFangSC-Regular, PingFang SC;
    }
    ::v-deep.audit-process {
        .currency-apply-audit {
            padding: 21px 0 0 0;
        }
        .currency-apply-title {
            margin-bottom: 0;
        }
    }

    .el-table {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        &::before {
            display: none;
        }
        .el-table__cell {
            border-bottom: none;
        }
        .el-select {
            width: 100%;
        }
    }
}
.process-box {
    margin: 16px 0 64px;
}
</style>
