<template>
    <div class="base-form-wrap">
        <div class="common-form-style">
            <div class="form-wrap">
                <ws-descriptions :showToggle="false" title="个人资料">
                    <div class="base-content">
                        <div class="inline-block">
                            <label for class="label"><span style="color: #f05259">* </span>姓名：</label>
                            <el-input :disabled="routerQurey.type == 'detail' || forbidAble" v-emoji v-model.trim="dataOptions.personalInfo.name" maxlength="10" placeholder="请输入姓名" clearable></el-input>
                        </div>
                        <div class="inline-block">
                            <label for class="label"><span style="color: #f05259">* </span>手机号码：</label>
                            <el-input :disabled="routerQurey.type == 'detail' || forbidAble" v-model.trim="dataOptions.personalInfo.phone" @blur="checkedValue(null, rules.phone)" maxlength="11" placeholder="请输入手机号码" clearable></el-input>
                        </div>
                        <div class="inline-block" v-if="routerQurey.type != 'add'">
                            <label for class="label">工号：</label>
                            <el-input disabled v-model.trim="dataOptions.personalInfo.jobNumber" maxlength="11" placeholder="请输入工号" clearable></el-input>
                        </div>
                        <div class="inline-block">
                            <label for class="label"><span style="color: #f05259">* </span>身份证号码：</label>
                            <el-input :disabled="routerQurey.type == 'detail' || forbidAble" v-model.trim="dataOptions.personalInfo.identityCard" maxlength="18" placeholder="请输入身份证号码" clearable></el-input>
                        </div>
                        <div class="inline-block">
                            <label for class="label">出生日期：</label>
                            <el-date-picker :disabled="routerQurey.type == 'detail' || forbidAble" @change="countAge" v-model.trim="dataOptions.personalInfo.birthday" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="date" placeholder="--请选择--"></el-date-picker>
                        </div>
                        <div class="inline-block">
                            <label for class="label">年龄(系统计算)：</label>
                            <el-input disabled v-model.trim="dataOptions.personalInfo.age" maxlength="11" placeholder="" clearable></el-input>
                        </div>
                        <div class="inline-block">
                            <label for class="label">性别：</label>
                            <el-select :disabled="routerQurey.type == 'detail' || forbidAble" clearable v-model.trim="dataOptions.personalInfo.sex" placeholder="--请选择--">
                                <el-option v-for="item in sexFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                            </el-select>
                        </div>
                        <div class="inline-block">
                            <label for class="label">民族：</label>
                            <el-input :disabled="routerQurey.type == 'detail' || forbidAble" v-model.trim="dataOptions.personalInfo.nation" maxlength="10" placeholder="请输入民族" clearable></el-input>
                        </div>
                        <div class="inline-block">
                            <label for class="label">入职日期：</label>
                            <el-date-picker :disabled="routerQurey.type != 'add' || forbidAble" v-model.trim="dataOptions.personalInfo.entryDate" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="date" placeholder="--请选择--"></el-date-picker>
                        </div>
                        <div class="inline-block">
                            <label for class="label">身份证地址：</label>
                            <el-input :disabled="routerQurey.type == 'detail' || forbidAble" v-model.trim="dataOptions.personalInfo.identityCardAddress" maxlength="50" placeholder="请输入身份证地址" clearable></el-input>
                        </div>
                        <div class="inline-block">
                            <label for class="label">目前住址：</label>
                            <el-input :disabled="routerQurey.type == 'detail' || forbidAble" v-model.trim="dataOptions.personalInfo.currentAddress" maxlength="50" placeholder="请输入详情住址" clearable></el-input>
                        </div>
                        <div class="inline-block">
                            <label for class="label">户口类型：</label>
                            <el-select :disabled="routerQurey.type == 'detail' || forbidAble" clearable v-model.trim="dataOptions.personalInfo.registeredResidenceType" placeholder="--请选择--" filterable>
                                <el-option v-for="item in idenceTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                            </el-select>
                        </div>
                        <div class="inline-block">
                            <label for class="label">婚姻状况：</label>
                            <el-select :disabled="routerQurey.type == 'detail' || forbidAble" clearable v-model.trim="dataOptions.personalInfo.maritalStatus" placeholder="--请选择--">
                                <el-option v-for="item in maritalStatusFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                            </el-select>
                        </div>
                        <div class="inline-block">
                            <label for class="label">生育状况：</label>
                            <el-select :disabled="routerQurey.type == 'detail' || forbidAble" clearable v-model.trim="dataOptions.personalInfo.fertilityStatus" placeholder="--请选择--">
                                <el-option v-for="item in fertilityStatusFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                            </el-select>
                        </div>
                        <div class="inline-block">
                            <label for class="label">籍贯：</label>
                            <el-input :disabled="routerQurey.type == 'detail' || forbidAble" v-model.trim="dataOptions.personalInfo.nativePlace" maxlength="10" placeholder="请输入籍贯" clearable></el-input>
                        </div>
                        <div class="inline-block">
                            <label for class="label">政治面貌：</label>
                            <el-select @change="changePoliticalType" :disabled="routerQurey.type == 'detail' || forbidAble" clearable v-model.trim="dataOptions.personalInfo.politicalType" placeholder="--请选择--">
                                <el-option v-for="item in politicalListFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                            </el-select>
                        </div>
                        <div class="inline-block">
                            <label for class="label">是否退役军人：</label>
                            <el-select @change="changeVeterans" :disabled="routerQurey.type == 'detail' || forbidAble" clearable v-model.trim="dataOptions.personalInfo.veteransStatus" placeholder="--请选择--">
                                <el-option v-for="item in veteransFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                            </el-select>
                        </div>
                        <div class="inline-block" v-if="dataOptions.personalInfo.politicalType == 4">
                            <label for class="label">入党日期：</label>
                            <el-date-picker :disabled="routerQurey.type == 'detail' || forbidAble" v-model.trim="dataOptions.personalInfo.joinPartyDate" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="date" placeholder="--请选择--"></el-date-picker>
                        </div>
                        <template v-if="dataOptions.personalInfo.veteransStatus == '1'">
                            <div class="inline-block">
                                <label for class="label">服役部队级别：</label>
                                <el-input :disabled="routerQurey.type == 'detail' || forbidAble" v-model.trim="dataOptions.personalInfo.veteransForceLevel" maxlength="10" placeholder="请输入服役部队级别" clearable></el-input>
                            </div>
                            <div class="inline-block">
                                <label for class="label">入伍日期：</label>
                                <el-date-picker :disabled="routerQurey.type == 'detail' || forbidAble" v-model.trim="dataOptions.personalInfo.enlistDate" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="date" placeholder="--请选择--"></el-date-picker>
                            </div>
                            <div class="inline-block">
                                <label for class="label">转业日期：</label>
                                <el-date-picker :disabled="routerQurey.type == 'detail' || forbidAble" v-model.trim="dataOptions.personalInfo.transferDate" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="date" placeholder="--请选择--"></el-date-picker>
                            </div>
                        </template>
                    </div>
                </ws-descriptions>
                <ws-descriptions :showToggle="false" title="学历信息">
                    <div class="base-content">
                        <div class="inline-block">
                            <label for class="label">最高学历：</label>
                            <el-select :disabled="routerQurey.type == 'detail' || forbidAble" clearable v-model.trim="dataOptions.educationInfo.education" placeholder="--请选择--" filterable>
                                <el-option v-for="item in educationFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                            </el-select>
                        </div>
                        <div class="inline-block">
                            <label for class="label">毕业院校：</label>
                            <el-input :disabled="routerQurey.type == 'detail' || forbidAble" v-model.trim="dataOptions.educationInfo.schoolName" maxlength="20" placeholder="请输入毕业院校" clearable></el-input>
                        </div>
                        <div class="inline-block">
                            <label for class="label">所学专业：</label>
                            <el-input :disabled="routerQurey.type == 'detail' || forbidAble" v-model.trim="dataOptions.educationInfo.major" maxlength="20" placeholder="请输入所学专业" clearable></el-input>
                        </div>
                        <div class="inline-block">
                            <label for class="label">起止年月：</label>
                            <ws-date-range :intervalTime=10000 type="monthrange" :disabled="routerQurey.type == 'detail' || forbidAble" value-format="yyyy-MM" :picker-options="pickerOptions" :startTime.sync="dataOptions.educationInfo.startTime" :endTime.sync="dataOptions.educationInfo.endTime">
                            </ws-date-range>
                        </div>
                    </div>
                </ws-descriptions>
                <ws-descriptions :showToggle="false" title="职务信息">
                    <div class="content-table">
                        <div class="table">
                            <table>
                                <thead>
                                    <tr>
                                        <td>任职机构</td>
                                        <td><span style="color: #f05259">* </span>任职职务(身兼多职可添加职务)</td>
                                        <td><span style="color: #f05259">* </span>职务类型</td>
                                        <td style="width: 150px">操作</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(data, index) in dataOptions.positionInfo" :key="index">
                                        <td>
                                            <!--详情和修改资料 选择框-->
                                            <!-- <el-cascader
                        :ref="'selectDept'+ index"
                        :props="optionProps"
                        clearable
                        filterable
                        collapse-tags
                        @change="handleChangeDept(data,index)"
                        v-model="data.departmentId"
                        :options="departmentOption"
                        placeholder="请选择"
                        separator="-"
                        v-if="data.opType == 1 || data.opType == 2"
                        style="width:100%"
                    ></el-cascader> -->
                                            <!-- <el-select v-if="data.opType == 1" disabled  v-model="data.departmentId" placeholder="--请选择--">
                        <el-option v-for="item in roleOption.roleList" :key="item.deptId" :label="item.name" :value="item.deptId"></el-option>
                      </el-select> -->
                                            <el-input disabled v-model.trim="data.deptName"></el-input>
                                        </td>
                                        <td>
                                            <el-input v-if="data.departmentType == 1 || data.disabled || data.name == '独立法人'" disabled v-model.trim="data.positionName"></el-input>
                                            <el-select v-if="data.list  && data.departmentType !=1 && !data.disabled" v-model="data.positionId" placeholder="--请选择--">
                                                <el-option v-for="item in data.list" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                            </el-select>
                                        </td>
                                        <td>
                                            <el-select disabled v-model.trim="data.positionType" placeholder="--请选择--" filterable>
                                                <el-option label="主职" :value="2"></el-option>
                                                <el-option label="兼任" :value="1"></el-option>
                                            </el-select>
                                        </td>
                                        <td style="padding: 0 10px;">
                                            <template v-if="data.disabled || data.name == '独立法人'"> - </template>
                                            <template v-else>
                                                <el-button size="small" type="text" @click="delData(1,index)">删除职务</el-button>
                                            </template>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div v-if="!dataOptions.positionInfo.length && routerQurey.type == 'detail'" class="empty_text">
                                <p>暂无数据</p>
                            </div>
                            <div class="add-text" v-if="showAddPosition">
                                <span class="add-btn" @click="addData(1)"><img src="@/assets/images/ic_xizeng.png" alt="" />添加职务</span>
                            </div>
                        </div>
                    </div>
                </ws-descriptions>
                <ws-descriptions :showToggle="false" title="工作经历">
                    <div class="content-table">
                        <div class="table">
                            <table>
                                <thead>
                                    <tr>
                                        <td><span style="color: #f05259"> </span>公司名称</td>
                                        <td><span style="color: #f05259"> </span>起止年月</td>
                                        <td><span style="color: #f05259"> </span>部门</td>
                                        <td><span style="color: #f05259"> </span>职位</td>
                                        <td style="width: 150px" v-if="routerQurey.type != 'detail'">操作</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(data, index) in dataOptions.jobInfo" :key="index">
                                        <td>
                                            <el-input v-model.trim="data.companyName" clearable :maxlength="30" :disabled="routerQurey.type == 'detail' || forbidAble"></el-input>
                                        </td>
                                        <td>
                                            <span class="td-disable" v-if="routerQurey.type == 'detail' || forbidAble">{{$baseMethod.formatData(data.startTime,'yyyy-MM')}} 至 {{$baseMethod.formatData(data.endTime,'yyyy-MM')}}</span>
                                            <ws-date-range v-else :intervalTime=10000 type="monthrange" value-format="yyyy-MM" :picker-options="pickerOptions" :startTime.sync="data.startTime" :endTime.sync="data.endTime">
                                            </ws-date-range>
                                        </td>
                                        <td>
                                            <el-input v-model.trim="data.departmentName" clearable :maxlength="20" :disabled="routerQurey.type == 'detail' || forbidAble"></el-input>
                                        </td>
                                        <td>
                                            <el-input v-model.trim="data.positionName" clearable :maxlength="20" :disabled="routerQurey.type == 'detail' || forbidAble"></el-input>
                                        </td>
                                        <td style="padding: 0 10px;" v-if="routerQurey.type != 'detail'">
                                            <template v-if="data.disabled || forbidAble"> - </template>
                                            <template v-else>
                                                <el-button size="small" type="text" @click="delData(2, index)">删除</el-button>
                                            </template>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div v-if="!dataOptions.jobInfo.length && routerQurey.type == 'detail'" class="empty_text">
                                <p>暂无数据</p>
                            </div>
                            <div class="add-text" v-if="routerQurey.type != 'detail' && dataOptions.jobInfo.length < 10 && !forbidAble">
                                <span class="add-btn" @click="addData(2)"><img src="@/assets/images/ic_xizeng.png" alt="" />添加工作经历
                                </span>
                            </div>
                        </div>
                    </div>
                </ws-descriptions>
                <ws-descriptions :showToggle="false" title="家庭成员">
                    <div class="content-table">
                        <div class="table">
                            <table>
                                <thead>
                                    <tr>
                                        <td><span style="color: #f05259"> </span>姓名</td>
                                        <td><span style="color: #f05259"> </span>关系</td>
                                        <td><span style="color: #f05259"> </span>联系方式</td>
                                        <td style="width: 150px" v-if="routerQurey.type != 'detail'">操作</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(data, index) in dataOptions.familyInfo" :key="index">
                                        <td>
                                            <el-input v-model.trim="data.name" clearable :maxlength="10" :disabled="routerQurey.type == 'detail' || forbidAble"></el-input>
                                        </td>
                                        <td>
                                            <el-input v-model.trim="data.relation" clearable :maxlength="10" :disabled="routerQurey.type == 'detail' || forbidAble"></el-input>
                                        </td>
                                        <td>
                                            <el-input v-model.trim="data.phone" @blur="checkedValue(index, rules.contact)" clearable :maxlength="11" :disabled="routerQurey.type == 'detail' || forbidAble"></el-input>
                                        </td>
                                        <td style="padding: 0 10px;" v-if="routerQurey.type != 'detail'">
                                            <template v-if="forbidAble"> - </template>
                                            <template v-else>
                                                <el-button size="small" type="text" @click="delData(3, index)">删除</el-button>
                                            </template>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div v-if="!dataOptions.familyInfo.length && routerQurey.type == 'detail'" class="empty_text">
                                <p>暂无数据</p>
                            </div>
                            <div class="add-text" v-if="routerQurey.type != 'detail' && !forbidAble">
                                <span class="add-btn" @click="addData(3)"><img src="@/assets/images/ic_xizeng.png" alt="" />添加家庭成员
                                </span>
                            </div>
                        </div>
                    </div>
                </ws-descriptions>
                <ws-descriptions :showToggle="false">
                    <template slot="title">附件资料<span class="files-des">(请上传jpg、png格式照片，大小不超过10M)</span></template>
                    <div>
                        <div v-if="routerQurey.type == 'detail'">
                            <upload-file :fileList="picUrlList" pageType="detail" :isShowRename="false" :isShowDelete="false" :isShowDownload="false"></upload-file>
                        </div>
                        <div v-else>
                            <div class="pic-list" v-for="item in (routerQurey.type == 'detail' ?picUrlList:attachmentList)" :key="item.id">
                                <ws-image-upload liveUpload ref="imageUpload" class="image-upload" :isDelete="!readable" :inputReadyOnly="readable" :actions="actions" :urlList="getUrlList(item)" :quantity="1" :afterUpload="afterUpload">
                                </ws-image-upload>
                                <span class="file-name">{{item.name}}</span>
                            </div>
                        </div>
                    </div>
                </ws-descriptions>
                <ws-descriptions :showToggle="false" v-if="routerQurey.type != 'detail' && idNumber" title="审核流程">
                    <audit-process ref="auditProcess" :afterQuery="afterQuery" title="" :actions="action" :query="{ nameCode: 37,idNumber }"></audit-process>
                </ws-descriptions>

                <detailTimeLine v-if="routerQurey.type === 'detail' && powerList.selectMoveTrajectory" />

                <div class="fixed-btns">
                    <el-button plain @click="back()">返 回</el-button>
                    <ws-throttle>
                        <el-button type="primary" v-if="routerQurey.type != 'detail'" @click="save()">确 定</el-button>
                    </ws-throttle>
                    <ws-throttle>
                        <el-button type="primary" v-if="routerQurey.type === 'detail'" @click="printPDF()">打印员工档案</el-button>
                    </ws-throttle>
                </div>
            </div>
        </div>
        <printPdfElements :baseInfo="baseInfo" ref="pdfCom" :htmlTitle="htmlTitle" class="pdf-com" />
        <!-- 新增职位弹框 -->
        <el-dialog v-if="showAddPositionDialog" append-to-body :close-on-click-modal="false" :lock-scroll="false" title="新增职位" :visible.sync="showAddPositionDialog" width="30%" center>
            <el-form label-position="right" :model="ruleFormDept" :rules="rulesDept" ref="ruleFormDept" label-width="115px">
                <el-form-item label="部门:" prop="departmentId">
                    <el-cascader ref="selectDept" :props="optionProps" clearable filterable collapse-tags @change="handleChangeDept()" v-model="ruleFormDept.departmentId" :options="departmentOption" placeholder="请选择" separator="-"></el-cascader>
                </el-form-item>
                <el-form-item label="职位:" prop="positionId">
                    <el-select v-model.trim="ruleFormDept.positionId" filterable placeholder="请选择" @change="handleChangePosition()" clearable :disabled="ruleFormDept.departmentId.length == 0">
                        <el-option v-for="item of positionOptions" :label="item.name" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button style="width: 98px" @click="showAddPositionDialog = false">取 消</el-button>
                <el-button style="width: 98px" type="primary" @click="addPosition()">确 认</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { mapState } from 'vuex';
import AuditProcess from '@/components/AuditProcess';
import printPdfElements from './printPdf/printPDF.vue'; //打印pdf的模板文件
import { getPdf } from './printPdf/pdf.js'; //pdf 工具方法
import detailTimeLine from './components/detailTimeLine.vue';
import uploadFile from '@/components/uploadFile/index';
export default {
    name: 'cityCreatorForm',
    components: {
        AuditProcess,
        detailTimeLine,
        printPdfElements,
        uploadFile
    },
    data() {
        return {
            op: {
                detail: 'detailInfo', //基础信息op
                submitCheck: 'submitCheck',
                update: 'updateApproval',
                save: 'submitApproval',
                deptPositions: 'deptPositions',
                getIdNumber: 'getIdNumber',
            },
            dataOptions: {
                personalInfo: {
                    name: '',
                    phone: '',
                    jobNumber: '',
                    identityCard: '',
                    birthday: '',
                    age: '',
                    sex: '',
                    nation: '',
                    entryDate: '',
                    identityCardAddress: '',
                    currentAddress: '',
                    registeredResidenceType: '',
                    maritalStatus: '',
                    fertilityStatus: '',
                    nativePlace: '',
                    politicalType: '',
                    veteransStatus: '',
                    joinPartyDate: '',
                    veteransForceLevel: '',
                    enlistDate: '',
                    transferDate: '',
                }, //基础信息
                personalInfoChangedFields: [],
                educationInfo: {
                    education: '',
                    schoolName: '',
                    major: '',
                    startTime: '',
                    endTime: '',
                }, //学历信息
                educationInfoChangedFields: [],
                positionInfo: [], //任职信息
                jobInfo: [], //工作经历
                familyInfo: [], //家庭成员
                files: [], //附件资料
            },
            rules: {
                contact: {
                    reg: 'mobile',
                    message: '家庭成员请填写格式正确的联系方式',
                    field: 'phone',
                    key: 'familyInfo',
                },
                phone: {
                    reg: 'mobile',
                    message: '个人资料请填写格式正确的手机号',
                    field: 'personalInfo',
                    key: 'phone',
                },
            },
            actions: {
                url: '/file/upload',
                op: 'upload',
            },
            // 审核
            action: {
                moduleName: '/workbench/BRcityCreator',
                op: 'flowNode',
            },
            routerQurey: {},
            pickerOptions: {
                disabledDate: time => {
                    return time.getTime() > new Date().getTime();
                },
            },

            picUrlList: [],
            attachmentList: [],
            imgListMap: [],
            originObject: '{}', //详情数据保存
            forbidAble: false, //是否禁止输入
            forbidAdd: false, //职务是否能新增
            roleOption: {}, //账号信息
            procdefId: '', //审核节点
            idNumber: '',
            md5: '',
            deljobInfo: [],
            delfamilyInfo: [],
            auditProcessList: [],
            moduleName: '/workbench/BRcityCreator',
            htmlTitle: '',
            baseInfo: null,
            departmentOption: [], //部门下拉
            optionProps: {
                value: 'id',
                label: 'departmentName',
                children: 'childList',
                checkStrictly: true,
            },
            showAddPositionDialog: false,
            ruleFormDept: {
                departmentId: '',
                departmentName: '',
                positionId: '',
                positionName: '',
            },
            rulesDept: {
                departmentId: [
                    {
                        required: true,
                        message: '请选择部门',
                        trigger: 'blur',
                    },
                ],
                positionId: [
                    {
                        required: true,
                        message: '请选择职位',
                        trigger: 'blur',
                    },
                ],
            },
            positionOptions: [],
            isSuperAdmin: false, //兼容超管所需用户名
            oldphone: '',
        };
    },
    computed: {
        ...mapState('workbench', ['sexFilters', 'maritalStatusFilters', 'educationFilters', 'veteransFilters', 'idenceTypeFilters', 'fertilityStatusFilters', 'politicalListFilters']),
        // 上传位是否只读
        readable() {
            return ['detail'].includes(this.routerQurey.type) || this.forbidAble;
        },
        showAddPosition() {
            if (this.routerQurey.type == 'add') {
                return true;
            }
            return false;
        },
    },
    watch: {},
    mounted() {
        this.routerQurey = this.$route.query;
        this.roleOption = this.$baseMethod.getStore('roleOption') || {};
        // this.roleOption.roleList.map(v=>{
        //   let index = v.name.indexOf('-')
        //   v.name = v.name.slice(0,index)
        // })
        //判断是否超管账号
        let { username } = this.$baseMethod.getStore('_ccmUser');
        this.isSuperAdmin = username == 'wsecar';
        this.getIdNumber();
        if (this.routerQurey.id) {
            this.getData();
        }
        this.getAttachmentNameList({ attachmentType: 100 }).then(res => {
            this.attachmentList = res;
        });
        //获取部门下拉
        this.getSelectValue();
    },
    methods: {
        back() {
            this.$router.push({
                path: '/workbench/BRcityCreator',
                query: { type: 'detail', orgId: this.$route.query.orgId },
            });
        },
        // 获取附件占位列表
        getAttachmentNameList(parm) {
            let data = {
                data: JSON.stringify(parm),
                op: 'attachmentSelect',
            };
            let URL = '/orgWeb/common/select';
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
        // 获取职务名称
        getPositionName(item) {
            let positionName = item.list.filter(v => v.id == item.positionId)[0] ? item.list.filter(v => v.id == item.positionId)[0].name : '';
            return positionName;
        },
        // 获取idNumber
        getIdNumber() {
            let { orgType } = this.roleOption;
            //总部账号不请求此接口（后端暂时不删）
            //后端要求超管使用wsecar判断
            if ([0, 4, 5, 10].includes(orgType) || this.isSuperAdmin) {
                return false;
            }

            let data = {
                data: JSON.stringify({
                    departmentId: this.roleOption.currentDepId,
                }),
                op: this.op.getIdNumber,
            };
            this.$axios(this.getModuleUrl(this.op.getIdNumber), data).then(res => {
                this.idNumber = JSON.parse(res.data);
            });
        },
        //获取部门下拉
        getSelectValue() {
            // 部门
            this.$axios('/personnel/urbanCoFunder/select', {
                op: 'getOaCurrentDepartTree',
                data: JSON.stringify({}), //type 0-全部，1-总部，2-分支机构
            }).then(res => {
                let data = JSON.parse(res.data);
                this.departmentOption = this.setDisabled(data);
            });
        },
        //禁用大区和总区
        setDisabled(treeData) {
            treeData.forEach(data => {
                if ([0, 4, 5, 10].includes(data.orgType)) {
                    data.disabled = true;
                }
                if (data.childList) {
                    this.setDisabled(data.childList);
                }
            });
            return treeData;
        },
        handleChangeDept(item, index) {
            this.$nextTick(() => {
                let checkNodes = this.$refs.selectDept.getCheckedNodes()[0];
                this.ruleFormDept.positionId = '';
                let id = this.ruleFormDept.departmentId[this.ruleFormDept.departmentId.length - 1];
                let orgType = checkNodes.data.orgType;
                this.getPosition(id, orgType);
            });
        },
        // 获取新增职务下拉
        getPosition(id, orgType) {
            let data = {
                data: JSON.stringify({
                    orgType: orgType,
                    departmentId: id,
                }),
                op: 'deptPositions',
            };
            this.$axios('/personnel/urbanCoFunder/select', data).then(res => {
                //list 过滤独立法人选项
                let dataList = JSON.parse(res.data).filter(v => v.name !== '独立法人');
                // this.dataOptions.positionInfo[index].list = dataList || []
                this.positionOptions = dataList;
            });
        },
        //职务显示字段
        handleChangePosition() {
            let info = this.positionOptions.filter(i => {
                return i.id == this.ruleFormDept.positionId;
            })[0];
            if (info) {
                this.ruleFormDept.positionName = info.name;
            }
        },
        addPosition() {
            this.$refs['ruleFormDept'].validate(valid => {
                if (valid) {
                    let checkNodes = this.$refs.selectDept.getCheckedNodes()[0];
                    let departmentId = this.ruleFormDept.departmentId[this.ruleFormDept.departmentId.length - 1];
                    //寻找重复元素
                    let repeatItem = this.dataOptions.positionInfo.find(item => {
                        return item.departmentId == departmentId && item.positionId == this.ruleFormDept.positionId;
                    });
                    if (repeatItem) {
                        this.$message.error('职位已存在，不允许重复新增');
                        return false;
                    }
                    // 后端要求不加
                    // if (this.dataOptions.positionInfo.length >= 49) {
                    //   this.$message.error('职务最多允许添加50个')
                    //   return false
                    // }
                    this.dataOptions.positionInfo.push({
                        list: this.positionOptions,
                        // departmentId: this.roleOption.currentDepId,
                        departmentId: departmentId,
                        deptName: checkNodes.pathLabels.join('-'),
                        departmentType: 2,
                        positionId: this.ruleFormDept.positionId,
                        positionName: this.ruleFormDept.positionName,
                        positionType: this.dataOptions.positionInfo.length ? 1 : 2,
                        opType: 1,
                    });
                    this.showAddPositionDialog = false;
                    this.ruleFormDept = {
                        departmentId: '',
                        departmentName: '',
                        positionId: '',
                        positionName: '',
                    };
                }
            });
        },
        // 获取职务下拉
        getPositionList(item) {
            let data = {
                data: JSON.stringify({
                    orgType: item.orgType,
                    departmentId: item.departmentId,
                }),
                op: this.op.deptPositions,
            };
            this.$axios(this.getModuleUrl(this.op.deptPositions), data).then(res => {
                //list 过滤独立法人选项
                let dataList = JSON.parse(res.data).filter(v => v.name !== '独立法人');
                this.$set(item, 'list', dataList);
            });
        },
        //政治面貌变动交互
        changePoliticalType(val) {
            if (val != 4) {
                this.dataOptions.personalInfo.joinPartyDate = '';
            }
        },
        // 是否退役军人变动交互
        changeVeterans(val) {
            if (val == 2) {
                this.dataOptions.personalInfo.veteransForceLevel = '';
                this.dataOptions.personalInfo.enlistDate = '';
                this.dataOptions.personalInfo.transferDate = '';
            }
        },
        afterQuery(list, id) {
            this.auditProcessList = _.cloneDeep(list);
        },
        // 获取工作流审批人员信息
        createdApprovalInfo() {
            let result = [],
                allList = this.$refs.auditProcess.allList;
            this.procdefId = this.$refs.auditProcess.procdefId;
            for (let i = 0; i < allList.length; i++) {
                const e = allList[i];
                let userIds = [];
                //memberType = 9 传所有ID，memberType != 9 有新增传新增，无新增传[]
                if (e.memberType != 9) {
                    let origin = this.auditProcessList.filter(item => item.nodeKey == e.nodeKey)[0];
                    if (origin.userInfos.length != e.userInfos.length) {
                        e.userInfos
                            .filter(item => {
                                return origin.userInfos.indexOf(item) == -1;
                            })
                            .map(o => {
                                userIds.push(o.id);
                            });
                    } else {
                        userIds = [];
                    }
                } else {
                    for (let j = 0; j < e.userInfos.length; j++) {
                        userIds.push(e.userInfos[j].id);
                    }
                }
                let obj = {
                    nodeKey: e.nodeKey,
                    userIds,
                };
                result.push(obj);
            }
            return result;
        },
        afterUpload(res, file) {
            try {
                let fileUrl = res.data
                // let { privateWmFileId: waterMarkImageFileId, publicDownWaterMarkUrl: fileUrl } = JSON.parse(res.data);
                this.imgListMap.push({
                    // waterMarkImageFileId: waterMarkImageFileId,
                    fileUrl: fileUrl,
                    opType: 2,
                });
                return [res.data];
            } catch (error) {
                console.log(error);
                return [];
            }
        },
        checkCodeBirth() {
            let regex = this.$regexList.get('idCardNumber'),
                code = this.dataOptions.personalInfo.identityCard,
                birthday;
            if (!regex.test(code)) {
                this.$message.error('请输入格式正确的身份证号码');
                return false;
            } else {
                if (code.length == 15) {
                    birthday = '19' + code.substr(6, 2) + '-' + code.substr(8, 2) + '-' + code.substr(10, 2);
                } else if (code.length == 18) {
                    birthday = code.substr(6, 4) + '-' + code.substr(10, 2) + '-' + code.substr(12, 2);
                }
                if (this.dataOptions.personalInfo.birthday && birthday !== this.dataOptions.personalInfo.birthday.split(' ')[0]) {
                    this.$message.error('身份证号码与出生日期不匹配');
                    return false;
                }
                return true;
            }
        },
        checkedValue(index, rules) {
            let { key, reg, field, message } = rules;
            let regex = /^(((\d{3,4}-)?[0-9]{7,8})|(1(3|4|5|6|7|8|9)\d{9}))$/;
            let data;
            if (Array.isArray(this.dataOptions[key])) {
                data = this.dataOptions[key][index];
                if (!regex.test(data[field])) {
                    this.$message.error(message);
                    data[field] = '';
                }
            } else {
                data = this.dataOptions[field][key];
                if (!regex.test(data)) {
                    this.$message.error(message);
                    this.dataOptions[field][key] = '';
                }
                if (field == 'personalInfo' && key == 'phone' && this.routerQurey.type == 'add' && this.dataOptions.personalInfo.phone) {
                    this.getData(this.dataOptions.personalInfo.phone);
                }
            }
        },
        // 检测改动字段
        checkedChangeValue(obj, markObj) {
            let beforeSaveData = JSON.parse(this.originObject);
            let checkObject = this.dataOptions[obj];

            if (Array.isArray(checkObject)) {
                checkObject.map((item, index) => {
                    let oriData = beforeSaveData[obj].filter(v => v.id == item.id)[0];
                    if (JSON.stringify(item) != JSON.stringify(oriData)) {
                        item.opType = item.opType ? item.opType : 2;
                    }
                });
                return;
            }
            let originObject = beforeSaveData[obj];
            for (let key in checkObject) {
                if (checkObject[key] != originObject[key]) {
                    this.dataOptions[markObj].push(key);
                }
            }
        },
        addData(type) {
            switch (type) {
                case 1:
                    this.showAddPositionDialog = true;
                    // for (let data of this.dataOptions.positionInfo) {
                    //   if (!data.positionId || !data.positionType) {
                    //     this.$message.error('请填写完整再添加！')
                    //     return
                    //   }
                    // }
                    // this.dataOptions.positionInfo.push({
                    //   list: [],
                    //   // departmentId: this.roleOption.currentDepId,
                    //   departmentId: "",
                    //   deptName: this.roleOption.currentDepName.slice(0,this.roleOption.currentDepName.indexOf('-')),
                    //   departmentType: 2,
                    //   positionId: '',
                    //   positionName: '',
                    //   positionType: this.dataOptions.positionInfo.length?1:2,
                    //   opType: 1
                    // })
                    // let list = this.dataOptions.positionInfo
                    // this.getPosition(list[list.length-1],list.length-1)
                    break;
                case 2:
                    for (let data of this.dataOptions.jobInfo) {
                        if (!data.companyName || !data.departmentName || !data.positionName || !data.startTime || !data.endTime) {
                            this.$message.error('请填写完整再添加！');
                            return;
                        }
                    }
                    this.dataOptions.jobInfo.push({
                        companyName: '',
                        departmentName: '',
                        positionName: '',
                        startTime: '',
                        endTime: '',
                        opType: 1,
                    });
                    break;
                case 3:
                    for (let data of this.dataOptions.familyInfo) {
                        if (!data.name || !data.relation || !data.phone) {
                            this.$message.error('请填写完整再添加！');
                            return;
                        }
                    }
                    this.dataOptions.familyInfo.push({
                        name: '',
                        relation: '',
                        phone: '',
                        opType: 1,
                    });
                    break;
                default:
                    break;
            }
        },
        delData(type, index) {
            const fieldArr = ['positionInfo', 'jobInfo', 'familyInfo'];

            if (this.dataOptions[fieldArr[type - 1]][index].id) {
                this[`del${fieldArr[type - 1]}`].push({ ...this.dataOptions[fieldArr[type - 1]][index], opType: 3 });
            }

            this.dataOptions[fieldArr[type - 1]].splice(index, 1);
        },
        // 自动计算年龄
        countAge(val) {
            let date = new Date();
            let today = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
            let birthDate = val.split('-');
            // 分别计算年月日差值
            let age = today.map((value, index) => {
                return value - birthDate[index];
            });
            // 当天数为负数时，月减 1，天数加上月总天数
            if (age[2] < 0) {
                let lastMonth = new Date(today[0], today[1], 0);
                age[1]--;
                age[2] += lastMonth.getDate();
            }
            // 当月数为负数时，年减 1，月数加上 12
            if (age[1] < 0) {
                age[0]--;
                age[1] += 12;
            }
            this.dataOptions.personalInfo.age = age[0];
        },
        getData(val) {
            let sendData = {
                employeeId: this.$route.query.id,
                source: 1,
            };
            if (val) {
                sendData = {
                    phone: val,
                    source: 1,
                };
            }
            let data = {
                data: JSON.stringify(sendData),
                op: this.op.detail,
            };
            let URL = this.getModuleUrl(this.op.detail);
            this.$axios(URL, data).then(res => {
                if (JSON.parse(res.data).md5) {
                    this.dataOptions = { ...this.dataOptions, ...JSON.parse(res.data) };
                    this.htmlTitle = this.dataOptions.personalInfo.name + '的员工档案';
                    // 若根据手机号有数据返回，即只能新增职业信息
                    if (val && this.dataOptions.md5) {
                        this.forbidAble = true;
                        if (this.dataOptions.positionInfo.length) {
                            this.forbidAdd = true;
                        }
                        // this.routerQurey.type = 'detail'
                    }
                    this.dataOptions.positionInfo.map(item => {
                        this.getPositionList(item);
                        item.disabled = true;
                    });

                    this.originObject = JSON.stringify({ ...this.dataOptions });
                    this.picUrlList = this.dataOptions.files || [];
                    this.picUrlList.forEach(item=>item.fileName = item.name)
                    this.imgListMap = _.cloneDeep(this.picUrlList);

                    //需打印的值
                    this.baseInfo = _.cloneDeep(JSON.parse(res.data));
                }
            });
        },
        getUrlList(item) {
            if (this.routerQurey.type == 'detail') {
                let url = item.waterMarkImageUrl || item.fileUrl;
                return [url];
            }
            if (this.picUrlList) {
                let list = this.picUrlList.filter(o => item.id == o.attachmentTypeID) || [];
                if (list.length) {
                    let url = list[0].fileUrl;
                    return [url];
                }
                return [];
            }
        },
        uploadImgValidate() {
            if (!this.attachmentList.length) return true;
            let components = this.$refs.imageUpload;
            for (let i = 0; i < components.length; i++) {
                let item = components[i];
                let list = item.getUrlList();
                let upload = this.attachmentList[i];
                // if (!list.length) {
                //   this.$message.error(`${upload.name}上传位图片不能为空`)
                //   return
                // }
                upload.url = list[0];
            }
            // opType: 1,新增  2,修改  null,无改动
            this.picUrlList = this.attachmentList.map((v, i) => {
                if (v.url) {
                    return {
                        ...v,
                        attachmentTypeID: v.id,
                        opType: this.imgListMap.filter(item => components[i].getUrlList()[0] == item.fileUrl)[0].id ? null : 2,
                        fileUrl: this.imgListMap.filter(item => components[i].getUrlList()[0] == item.fileUrl)[0].fileUrl,
                        waterMarkImageFileId: this.imgListMap.filter(item => components[i].getUrlList()[0] == item.fileUrl)[0].waterMarkImageFileId,
                    };
                }
            });
            this.picUrlList = this.picUrlList.filter(Boolean);
            return true;
        },
        checkNull(obj, name, type) {
            if (Array.isArray(this.dataOptions[obj])) {
                if (!this.dataOptions[obj].length) {
                    this.$message.error(`请完善${name}信息`);
                    return false;
                }
                let returnValue = true;
                this.dataOptions[obj].map(data => {
                    if (type == 1) {
                        if (!data.positionId || !data.positionType) {
                            this.$message.error(`请完善${name}信息`);
                            returnValue = false;
                            return false;
                        }
                    }
                });
                return returnValue;
            }
        },
        checkBsNullValue() {
            let data = {
                name: '姓名',
                phone: '手机号码',
                identityCard: '身份证号码',
                // birthday: '出生日期',
                // sex: '性别',
                // nation: '民族',
                // entryDate: '入职日期',
                // identityCardAddress: '身份证地址',
                // currentAddress: '居住地址',
                // registeredResidenceType: '户口类型',
                // maritalStatus: '婚姻状况',
                // fertilityStatus: '生育状况',
                // nativePlace: '籍贯',
                // politicalType: '政治面貌',
                // veteransStatus: '是否退役军人'
            };
            let res = true;
            let nameList = [
                'name',
                'phone',
                'identityCard',
                // 'birthday',
                // 'sex',
                // 'nation',
                // 'entryDate',
                // 'identityCardAddress',
                // 'currentAddress',
                // 'registeredResidenceType',
                // 'maritalStatus',
                // 'fertilityStatus',
                // 'nativePlace',
                // 'politicalType',
                // 'veteransStatus',
            ];
            let partyData = { joinPartyDate: '入党日期' };
            let partyList = ['joinPartyDate'];
            let armyData = { veteransForceLevel: '服役部队级别', enlistDate: '入伍日期', transferDate: '转业日期' };
            let armyList = ['veteransForceLevel', 'enlistDate', 'transferDate'];
            if (this.dataOptions.personalInfo.politicalType == 4) {
                data = { ...data, ...partyData };
                nameList = [...nameList, ...partyList];
            }
            if (this.dataOptions.personalInfo.veteransStatus == 1) {
                data = { ...data, ...armyData };
                nameList = [...nameList, ...armyList];
            }
            nameList.every(item => {
                if (!this.dataOptions.personalInfo[item] && this.dataOptions.personalInfo[item] !== 0) {
                    this.$message.error(`基本信息${data[item]}不能为空`);
                    res = false;
                    return false;
                } else {
                    return true;
                }
            });
            return res;
        },
        checkSamePosition() {
            let hash = {};
            let returnValue = true;
            this.dataOptions.positionInfo.reduce((prev, cur) => {
                let key = '' + cur.departmentId + cur.positionId;
                if (hash[key]) {
                    returnValue = false;
                    return false;
                }
                hash[key] = true;
            }, []);
            return returnValue;
        },
        async save() {
            //不属于总部职务的需要校验审核流（包括超管）
            if (!this.isSuperAdmin && ![0, 4, 5, 10].includes(this.roleOption.orgType) && !this.$refs.auditProcess.procdefId) {
                this.$message.error('当前审批未配置工作流，请联系管理员处理');
                return;
            }
            // 新增代入信息 不校验
            if (!this.forbidAble) {
                if (!this.checkBsNullValue()) {
                    return false;
                }
                if (!this.checkCodeBirth()) {
                    return false;
                }
                if (
                    !this.checkNull('positionInfo', '职务', 1)
                    // || !this.checkNull('jobInfo','工作经历',2)
                    // || !this.checkNull('familyInfo','家庭成员',3)
                ) {
                    return false;
                }
            }
            //校验职务不含主职
            let mainPosition = (this.dataOptions.positionInfo || []).filter(i => i.positionType == 2);
            if (mainPosition.length <= 0) {
                this.$message.error('职位必须存在一个主职');
                return false;
            }
            //校验是不是有相同的分支机构和职务
            if (!this.checkSamePosition()) {
                this.$message.error('职务信息存在重复职务！');
                return false;
            }
            // 校验附件
            if (!this.uploadImgValidate()) return;

            let files = this.picUrlList;
            let approvalInfo = [0, 4, 5, 10].includes(this.roleOption.orgType) || this.isSuperAdmin ? null : this.createdApprovalInfo();
            let originObject = JSON.parse(this.originObject);

            if (this.routerQurey.type == 'edit' || this.routerQurey.type == 'add') {
                let checkData = {
                    employeeId: this.routerQurey.id || this.dataOptions.personalInfo.id,
                    opType: this.routerQurey.type == 'add' ? 1 : 2,
                    md5: this.dataOptions.md5,
                    source: 1,
                };
                if (!this.forbidAble && this.routerQurey.type == 'add') {
                    checkData = {
                        phone: this.dataOptions.personalInfo.phone,
                        opType: 1,
                        md5: this.dataOptions.md5,
                        source: 1,
                    };
                }
                // 后端要求删除submitCheck接口
                // let inData = {
                //   data: JSON.stringify(checkData),
                //   op: this.op.submitCheck
                // }
                // // 查询是否为最新数据
                // let res = await this.$axios(this.getModuleUrl(this.op.submitCheck), inData)
                // if(res.code != 1){
                //   this.$message.error(res.msg)
                //   return
                // }
            }

            let successInfo = '修改成功';
            // 修改记录改动字段
            if (this.routerQurey.type == 'edit') {
                this.dataOptions.personalInfoChangedFields = [];
                this.dataOptions.educationInfoChangedFields = [];
                this.checkedChangeValue('personalInfo', 'personalInfoChangedFields');
                this.checkedChangeValue('educationInfo', 'educationInfoChangedFields');
                this.checkedChangeValue('jobInfo');
                this.checkedChangeValue('familyInfo');
            }
            let sendPositionInfo = _.cloneDeep(this.dataOptions.positionInfo);
            sendPositionInfo.map(item => {
                if (item.list) {
                    item.positionName = this.getPositionName(item) || item.positionName;
                }
                if (Array.isArray(item.departmentId)) {
                    item.departmentId = item.departmentId[item.departmentId.length - 1];
                }
                delete item.disabled;
            });
            let familyInfo = _.cloneDeep(this.dataOptions.familyInfo);
            let jobInfo = _.cloneDeep(this.dataOptions.jobInfo);
            // push删除的原有信息
            this.deljobInfo.map(v => {
                jobInfo.push(v);
            });
            this.delfamilyInfo.map(v => {
                familyInfo.push(v);
            });

            let nodeFormAo = {
                ...this.dataOptions,
                familyInfo,
                jobInfo,
                positionInfo: sendPositionInfo,
                files,
                departmentId: this.roleOption.currentDepId,
            };
            //educationInfo 字段为空就直接返回null (后端要求处理)
            console.log(nodeFormAo.educationInfo);
            let exitItem = Object.values(nodeFormAo.educationInfo).find(i => !['', null, undefined].includes(i)); //存在有非空值
            if (!exitItem) nodeFormAo.educationInfo = null;

            if (this.routerQurey.type == 'add') {
                successInfo = '新增成功';
                delete nodeFormAo.personalInfoChangedFields;
                delete nodeFormAo.educationInfoChangedFields;
            }
            let sendData = {
                nodeFormAo,
                source: 1,
                approvalInfo,
                procDefId: this.procdefId,
            };
            let data = {
                data: JSON.stringify(sendData),
                op: this.routerQurey.type == 'add' ? this.op.save : this.op.update,
            };
            let URL = this.getModuleUrl(data.op);
            this.$axios(URL, data).then(res => {
                if (res.msg == '001') {
                    this.$confirm('当前审批配置的工作流规则有更新。确认后，流程区将按照新工作流刷新节点。', '提交失败', {
                        confirmButtonText: '确定',
                        showCancelButton: false,
                        showClose: false,
                        closeOnClickModal: false,
                        type: 'warning',
                    }).then(() => {
                        this.$refs.auditProcess.getFlowable();
                    });
                    return;
                }
                this.backData = JSON.parse(res.data);
                this.$message.success(successInfo);
                this.$router.afterSaveBack({ path: this.moduleName });
            });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },

        printPDF() {
            getPdf(this.htmlTitle);
        },
    },
};
</script>

<style lang="scss" scoped>
/deep/ .el-range-separator {
    width: 6%;
}
.td-disable {
    background-color: #f5f7fa;
    display: block;
    line-height: 36px;
}
.base-form-wrap {
    .form-wrap {
        min-width: 1020px;
        background: #ffffff;
        padding: 0 40px 20px 40px;
        border-radius: 8px;
        /deep/ .ws-descriptions {
            margin-bottom: 8px !important;
            .ws-descriptions__header {
                padding: 24px 0 0 0 !important;
            }
            .ws-descriptions__title {
                line-height: 16px !important;
                font-size: 16px;
            }
        }
        .files-des {
            color: #f05259;
            font-size: 14px !important;
            font-weight: 400;
        }
        .ws-descriptions__body {
            .base-content {
                width: 100%;
                background: #fff;
                .inline-box {
                    display: inline-block;
                }
            }
            .settle-payCompang-list {
                width: 100%;
            }
            .ws-table__wrapper {
                width: 100%;
            }
        }
    }
}
.common-form-style {
    min-height: 100%;
    .base-content {
        width: 100%;
        .el-collapse-item {
            margin-bottom: 10px;
        }
        .title {
            font-size: 18px;
            color: rgba(96, 98, 102, 1);
            border-bottom: 1px solid #dfe2e8;
            padding: 32px 10px 15px;
        }
        .el-input__suffix {
            line-height: 30px;
        }
        .label {
            display: inline-block;
            text-align: right;
            width: 120px;
            margin-right: 8px;
            font-weight: 500;
        }
        .block,
        .inline-block {
            margin-right: 20px;
            margin-top: 16px;
            .el-input {
                width: 353px;
            }
            .el-select {
                width: 353px !important;
            }
            .el-date-editor--monthrange.el-input__inner {
                width: 353px;
            }
            /deep/ .el-range-editor--medium.el-input__inner {
                width: 353px !important;
            }
            .tips {
                color: #909399;
                margin-left: 20px;
            }
        }
    }
    .content-table {
        .inline-table {
            margin-left: 173px;
        }
        .addBtn {
            color: #f05259;
            border: 1px solid #f05259;
            border-radius: 4px;
            padding: 8px 24px;
            cursor: pointer;
        }
        .table {
            table thead tr td {
                background: #ebeef5;
            }
            td {
                text-align: left;
                span {
                    padding: 0 10px;
                    line-height: 36px;
                }
            }
            tbody {
                td span {
                    padding: 0 10px;
                }
            }
            .add-text {
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid #ddd;
                border-top: none;
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
                .add-btn {
                    height: 36px;
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #f05259;
                    display: flex;
                    justify-content: center;
                    cursor: pointer;
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
                        width: 14px;
                        margin-right: 4px;
                        margin-top: 2px;
                    }
                }
            }
            table {
                border-collapse: separate;
                border-spacing: 0;
                border: 1px #ddd;
            }
            table thead tr:first-child td:last-child,
            table tbody tr td:last-child {
                border-right: 1px solid #ddd;
            }
            table tbody tr:last-child td {
                border-bottom: 1px solid #ddd;
            }

            table thead tr:first-child td:first-child {
                border-top-left-radius: 8px;
            }
            table thead tr:first-child td:last-child {
                border-top-right-radius: 8px;
            }
            // table tbody tr:last-child td:first-child {
            //   border-bottom-left-radius: 8px;
            // }
            // table tbody tr:last-child td:last-child {
            //   border-bottom-right-radius: 8px;
            // }
        }
        thead {
            tr {
                td {
                    background: #ebeef5;
                    padding: 0 10px;
                    text-align: left;
                    span {
                        padding: 0 !important;
                    }
                }
            }
        }
        td {
            border-left: 1px solid #ddd;
            border-top: 1px solid #ddd;
            position: relative;
            .table-text {
                line-height: 36px;
            }
        }
    }
    /deep/ .content-table table .el-input__inner {
        border: none !important;
        text-align: left !important;
        padding: 0 10px;
        border-bottom-left-radius: 8px;
    }
    .inline-block {
        display: inline-block;
    }
    .pic-list {
        display: inline-block;
        width: 160px;
        text-align: center;
        margin: 10px;
        .image-upload {
            width: 150px;
            height: 150px;
        }
        .file-name {
            display: block;
            margin-top: 8px;
            word-break: break-all;
        }
    }
    .fixed-btns {
        position: fixed;
        bottom: 0;
        z-index: 100;
        left: 80px;
        right: 0px;
        padding: 14px;
        text-align: center;
        background: #fff;
        border-top: 1px solid #ebeef5;

        span {
            font-size: 16px;
            line-height: 22px;
        }

        .el-button {
            padding: 6px 60px;
        }
    }
}
/deep/ .el-range-editor--medium .el-range-separator {
    line-height: 36px !important;
}
.main-section .height-abs {
    padding-bottom: 80px !important;
}

.pdf-com {
    position: fixed;
    bottom: 5000px;
    left: 0;
}
/deep/.el-select,
/deep/.el-cascader {
    width: calc(100% - 50px);
}
</style>
