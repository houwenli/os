<template>
    <div>
        <div class="org-legal-company">
            <!-- 表单 -->
            <el-form class="legal-form" label-position="right" :model="legalForm" :rules="rules" ref="legalForm" label-width="120px">
                <div class="org-legal-company-title">公司信息</div>
                <el-row :gutter="40">
                    <el-col :span="8">
                        <el-form-item label="独立法人公司:" prop="companyName">
                            <el-input v-model.trim="legalForm.companyName" placeholder="请输入公司名称" maxlength="50"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="实际控制人:" prop="controlName">
                            <el-input v-emoji v-model.trim="legalForm.controlName" placeholder="请输入姓名" maxlength="10"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="控制人电话:" prop="controlPhone">
                            <el-input v-model.trim="legalForm.controlPhone" placeholder="请输入手机号" maxlength="11"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="控制人身份证:" prop="controlIdNumber">
                            <el-input v-model.trim="legalForm.controlIdNumber" placeholder="请输入控制人身份证号码" maxlength="20"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="办公场地:" prop="officeSpace">
                            <el-input v-model.trim="legalForm.officeSpace" placeholder="请输入详细地址" maxlength="50"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="org-legal-company-title to-top">法人信息</div>
                <el-row :gutter="40">
                    <el-col :span="8">
                        <el-form-item label="法定代表人:" prop="legalRepresentative">
                            <el-input v-emoji v-model.trim="legalForm.legalRepresentative" placeholder="请输入独立法人姓名" maxlength="10"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="法人身份证:" prop="legalIdNumber">
                            <el-input v-model.trim="legalForm.legalIdNumber" placeholder="请输入独立法人身份证号码" maxlength="20"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="法人性别:" prop="legalSex">
                            <el-select required v-model="legalForm.legalSex" style="width: 100%">
                                <el-option label="男" :value="1"></el-option>
                                <el-option label="女" :value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="法人电话:" prop="legalPhone">
                            <el-input v-model.trim="legalForm.legalPhone" placeholder="请输入独立法人手机号" maxlength="11"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="org-legal-company-title to-top">签约信息</div>
                <el-row :gutter="40">
                    <el-col :span="8" style="height: 58px">
                        <el-form-item label="机构简称:" prop="signCompanyName">
                            <organizationOptions :valueKey="'relationId'" :selectOptions="selectOptions" @select="handleSelect" @orgTypeChange="orgTypeChange"></organizationOptions>
                        </el-form-item>

                        <!-- <el-form-item label="分公司简称:" prop="signCompanySimpleName">
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
                        </el-form-item> -->
                    </el-col>
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
                <div class="org-legal-company-title to-top">人员信息</div>
                <el-row>
                    <el-col :span="24">
                        <div class="table inline-table">
                            <el-table
                                :data="legalForm.rpcStaffAos"
                                border
                                style="width: 100%"
                                :header-cell-style="{
                                    background: '#F5F7FA',
                                    'font-family': 'PingFangSC-Medium, PingFang SC',
                                    'font-weight': '600',
                                    color: '#606266',
                                }"
                            >
                                <el-table-column label="姓名">
                                    <template slot-scope="scope">
                                        <el-input v-emoji maxlength="10" v-model.trim="scope.row.staffName" placeholder="请输入"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="职务">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.dutiesId" clearable>
                                            <el-option v-for="item in personPostOption" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="联系方式">
                                    <template slot-scope="scope">
                                        <el-input
                                            maxlength="11"
                                            v-model="scope.row.phone"
                                            placeholder="请输入"
                                            v-on:input="handleOnInput"
                                            @blur="scope.row.phone = $event.target.value"
                                            @change="phoneChange"
                                        ></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <template>
                                            <el-button size="small" type="text" @click="delClubData(scope.row, scope.$index)" style="color: #f05259">删除</el-button>
                                        </template>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="link-text">
                                <el-button class="add-btn" @click="addClubData">
                                    <img src="@/assets/images/ic_xizeng.png" alt="" />
                                    添加人员
                                </el-button>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <div class="org-legal-company-title to-top-big">账户信息</div>
                <el-row>
                    <el-col :span="24">
                        <div class="table inline-table">
                            <el-table
                                :data="legalForm.rpcAccountAos"
                                border
                                style="width: 100%"
                                :header-cell-style="{
                                    background: '#F5F7FA',
                                    'font-family': 'PingFangSC-Medium, PingFang SC',
                                    'font-weight': '600',
                                    color: '#606266',
                                }"
                            >
                                <el-table-column label="账户类型">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.accountType" :disabled="true" style="width: 100%">
                                            <el-option label="基本账户" :value="1"></el-option>
                                            <el-option label="一般账户" :value="2"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="账户">
                                    <template slot-scope="scope">
                                        <el-input v-model.trim="scope.row.account" maxlength="20" placeholder="请输入" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="开户行">
                                    <template slot-scope="scope">
                                        <el-input v-model.trim="scope.row.bankName" maxlength="50" placeholder="请输入"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <template v-if="scope.$index == 0">-</template>
                                        <template v-else>
                                            <el-button size="small" type="text" @click="delClubData(scope.row, scope.$index, false)" style="color: #f05259">删除</el-button>
                                        </template>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="link-text">
                                <el-button class="add-btn" v-if="legalForm.rpcAccountAos.length < 4" @click="addClubData(false)">
                                    <img src="@/assets/images/ic_xizeng.png" alt="" />
                                    添加账户
                                </el-button>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-form>

            <div class="org-legal-company-title to-top-big no-bottom">
                附件信息
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
                解约附件信息
                <span class="tip-font">(支持JPG、PNG、PDF、WORD、EXCEL，大小不超过50M)</span>
            </div>
            <div class="org-legal-company-title to-top-big no-bottom" v-if="signStatus === 1 && legalForm.signCompanyName">
                <span class="tip-font">{{ legalForm.signCompanyName }}已与独立法人公司{{ singCorporationName }}签约，重新签约需与原独立法人公司{{ singCorporationName }}解约，请上传解约文件</span>
            </div>
            <el-row :gutter="20" class="pic-upload" v-if="signStatus === 1 && legalForm.signCompanyName">
                <el-col :span="8" class="pic-list" v-for="(item, index) in attachmentEndList" :key="item.id">
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
    name: 'addLegalCompany',
    components: {
        FooterFixed,
        AuditProcess,
        UploadFile,
        organizationOptions,
    },
    data() {
        return {
            moduleName: '/addLegalCompany',
            pageType: 'addLegalCompany',
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
                parentOrg: '', // 上级机构
                // 人员信息
                rpcStaffAos: [
                    {
                        staffName: '',
                        dutiesId: '',
                        phone: '',
                    },
                ],
                // 账户信息
                rpcAccountAos: [
                    {
                        accountType: 1,
                        account: '',
                        bankName: '',
                    },
                ],
                orgType: '',
                rpcFileAos: [], // 附件信息
                terminationFiles: [], // 解约附件信息
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
                signCompanyName: [{ required: true, message: '请选择机构简称', trigger: 'blur' }],
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
            rpcFileAos: [], // 附件信息
            terminationFiles: [], // 解约附件信息
            personPostOption: [], // 职务列表
            simpleBranchName: [],
            companyName: '',
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
        this.getAttachmentNameList({ orgType: 60 }).then(res => {
            this.attachmentList = res || [];
        });
        this.getAttachmentNameList({ orgType: 70 }).then(res => {
            this.attachmentEndList = res || [];
        });
        // 获取负责人职务
        this.getPersonPostOption();
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
        // 新增 人员 账户 数据
        addClubData(type = true) {
            if (type) {
                for (let data of this.legalForm.rpcStaffAos) {
                    if (!data.staffName && !data.dutiesId && !data.phone) {
                        this.$message.error('请先填写上条信息！');
                        return;
                    }
                }
                this.legalForm.rpcStaffAos.push({
                    staffName: '',
                    dutiesId: '',
                    phone: '',
                });
            }
            if (!type) {
                for (let data of this.legalForm.rpcAccountAos) {
                    if (!data.account && !data.bankName) {
                        this.$message.error('请先填写上条信息！');
                        return;
                    }
                }
                this.legalForm.rpcAccountAos.push({
                    accountType: this.legalForm.rpcAccountAos.length > 0 ? 2 : 1,
                    account: '',
                    bankName: '',
                });
            }
        },
        // 删除 人员 账户 数据
        delClubData(row, index, type = true) {
            if (type) {
                this.legalForm.rpcStaffAos.splice(index, 1);
            }
            if (!type) {
                this.legalForm.rpcAccountAos.splice(index, 1);
            }
        },
        // 删除空白人员信息行
        delRpcStaffAos(arr, type) {
            if (type == 'rpcStaffAos') {
                arr = arr.filter(item => {
                    return item.staffName || item.dutiesId || item.phone;
                });
            } else {
                arr = arr.filter(item => {
                    return item.account || item.bankName;
                });
            }
            return arr;
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
                    this.legalForm.rpcStaffAos = this.delRpcStaffAos(this.legalForm.rpcStaffAos, 'rpcStaffAos');
                    this.legalForm.rpcAccountAos = this.delRpcStaffAos(this.legalForm.rpcAccountAos, 'rpcAccountAos');
                    let formData = JSON.parse(JSON.stringify(this.legalForm));
                    delete formData.rpcStaffAos;
                    delete formData.rpcAccountAos;
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
                            rpcStaffAos: this.legalForm.rpcStaffAos,
                            rpcAccountAos: this.legalForm.rpcAccountAos,
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
        handleOnInput(value) {
            value = value.replace(/[^\d]/g, '');
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
