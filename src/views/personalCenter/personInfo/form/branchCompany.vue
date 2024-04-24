<template>
    <!-- 一级机构 -->
    <div class="organize-info">
        <div class="organize-content" :style="!inputDisab?'margin-bottom: 16px;':''">
            <!-- 基础信息 -->
            <section>
                <div class="title">基础信息</div>
                <el-form class="basics-style" :rules="basicsForm" ref="basicsForm" :model="basicsParam" :label-width="labelWidth">
                    <el-row :gutter="40" class="el-row-ws" type="flex" justify="space-between">
                        <el-col :span="rowSpan">
                            <el-form-item label="分公司全称:" prop="name">
                                <el-input :disabled="inputDisab" maxlength="50" :placeholder="!inputDisab?'请输入分公司全称':''" v-model.trim="basicsParam.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="分公司简称:" prop="simpleName">
                                <el-input :disabled="inputDisab" maxlength="10" :placeholder="!inputDisab?'请输入分公司简称':''" v-model.trim="basicsParam.simpleName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="机构编码:" prop="agencyNumber">
                                <el-input :disabled="isDisab" v-model.trim="basicsParam.agencyNumber"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="分公司类型:" prop="importantStatus">
                                <el-select
                                    :class="isDetail"
                                    :disabled="inputDisab"
                                    v-model.trim="basicsParam.importantStatus"
                                    style="width: 100%"
                                    :placeholder="inputDisab ? '请选择' : ''"
                                >
                                    <el-option v-for="item in companyTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="设立时间:" prop="establishTime">
                                <el-date-picker
                                    v-model.trim="basicsParam.establishTime"
                                    :disabled="inputDisab"
                                    :picker-options="pickerOptions"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    type="date"
                                    placeholder="--请选择--"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="注册资本:" prop="registeredCapital">
                                <el-input :disabled="inputDisab" maxlength="10"  @input="validateNumber($event,'registeredCapital')" :placeholder="!inputDisab?'请输入注册资本':''" v-model.trim="basicsParam.registeredCapital"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="机构所在地区:" prop="submitAreaCode">
                                <span class="simulation_show" v-if="inputDisab">
                                    {{ `${basicsParam.submitProvinceName || ''}${basicsParam.submitCityName || ''}${basicsParam.submitAreaName || ''}` }}
                                </span>
                                <div style="display: flex" v-else>
                                    <ws-city
                                        style="flex: 2"
                                        placeholder="选择省市"
                                        :disabled="isDisab"
                                        ref="ws-city"
                                        level="2"
                                        v-model="basicsParam.cityAreaCodeList"
                                        :defaultProps="{ checkStrictly: false }"
                                        clearable
                                    ></ws-city>
                                    <el-select required @change="getSubmitAreaName" v-model="basicsParam.submitAreaCode" style="width: 100%; flex: 1;padding-left: 8px;" placeholder="请选择区域">
                                        <el-option v-for="item in localJurisdictionList" :key="item.id" :label="item.name" :value="item.code"></el-option>
                                    </el-select>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="上级机构:" prop="parentName">
                                <el-input :disabled="isDisab" v-model.trim="basicsParam.parentName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="业务城市:" prop="provinceList">
                                <ws-city
                                    style="width: 100%"
                                    :class="isDetail"
                                    placeholder="选择省市"
                                    :disabled="inputDisab"
                                    ref="ws-city"
                                    level="2"
                                    @change="getCityNameList"
                                    v-model="basicsParam.provinceList"
                                    :defaultProps="{ checkStrictly: false }"
                                    :clearable='false'
                                ></ws-city>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="资料完整度:" prop="dataComplete">
                                <span class="simulation_show">{{ basicsParam.dataComplete && basicsParam.dataComplete / 100 + '%' }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="详细地址:" prop="address" required>
                                <el-input v-if="!inputDisab" :disabled="isDisab" type="textarea" resize="none" :rows="1" placeholder="" v-model.trim="basicsParam.address"></el-input>
                                <el-input v-else :disabled="isDisab" type="textarea" resize="none" :rows="1" placeholder="" v-model.trim="address"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col v-show="!inputDisab" class="address" :span="rowSpan">
                            <el-form-item label="" prop="supplementAddress">
                                <el-input :disabled="inputDisab"  maxlength="20" placeholder="请输入门牌号" v-model.trim="basicsParam.supplementAddress"></el-input>
                            </el-form-item>
                            <el-button @click="choiceAddress" type="primary">采集地址</el-button>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="经度:" prop="longitude">
                                <el-input :disabled="isDisab" placeholder="" v-model.trim="basicsParam.longitude"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="纬度:" prop="latitude">
                                <el-input :disabled="isDisab" placeholder="" v-model.trim="basicsParam.latitude"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="社会信用代码:" prop="serviceNo">
                                <el-input :disabled="inputDisab"  maxlength="20" @input="abcNumber($event,'basicsParam','serviceNo')" :placeholder="inputDisab?'':'请输入社会信用代码'"   v-model.trim="basicsParam.serviceNo"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="运营状态:" prop="status">
                                <span class="simulation_show">{{ basicsParam.status | orgStateFilters }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="场地面积(m²):" prop="spaceArea">
                                <el-input :disabled="inputDisab"  @input="stintNumber($event,'spaceArea')" :placeholder="inputDisab?'':'请输入场地面积'" v-model.trim="basicsParam.spaceArea"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="场地地址:" prop="workAddress">
                                <el-input :disabled="inputDisab" maxlength="50" :placeholder="inputDisab?'':'请输入场地地址'" v-model.trim="basicsParam.workAddress"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="是否有牌照:" prop="licenseStatus">
                                <el-select
                                    :class="isDetail"
                                    :disabled="inputDisab"
                                    v-model.trim="basicsParam.licenseStatus"
                                    style="width: 100%"
                                    :placeholder="inputDisab ? '' : '请选择'"
                                >
                                    <el-option v-for="item in licenseStatusFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="签约独法公司:" prop="corporateCompanyName">
                                <el-input :disabled="isDisab" maxlength="20"  v-model.trim="basicsParam.corporateCompanyName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="分公司等级:" prop="grade">
                                <el-select
                                    :class="isDetail"
                                    v-model.trim="basicsParam.grade"
                                    :disabled="inputDisab"
                                    style="width: 100%"
                                    :placeholder="inputDisab ? '' : '请选择'"
                                >
                                    <el-option v-for="item in gradeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan"  v-if="inputDisab" ></el-col>
                    </el-row>
                </el-form>
            </section>

            <!-- 营业执照 -->
            <section>
                <div class="title">营业执照</div>
                <el-form class="form-style" :rules="manageForm" ref="manageForm" :model="manageParam" :label-width="labelWidth">
                    <el-row :gutter="40" class="el-row-ws" type="flex" justify="space-between">
                        <el-col :span="rowSpan">
                            <el-form-item label="单位性质:" prop="bLUnitProperty">
                                <el-input :disabled="inputDisab" maxlength="20" :placeholder="inputDisab?'':'请输入单位性质'" v-model.trim="manageParam.bLUnitProperty"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="负责人:" prop="bLPersonChargeName">
                                <el-input :disabled="inputDisab" maxlength="20" :placeholder="inputDisab?'':'请输入负责人'" v-model.trim="manageParam.bLPersonChargeName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="办证时间:" prop="bLHandleTime">
                                <el-date-picker
                                    v-model.trim="manageParam.bLHandleTime"
                                    :disabled="inputDisab"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    type="date"
                                    placeholder="--请选择--"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40" class="el-row-ws" type="flex" justify="space-between">
                        <el-col :span="24">
                            <el-form-item label="经营范围:" prop="bLScope">
                                <el-input :disabled="inputDisab" v-model.trim="manageParam.bLScope" type="textarea" resize="none" :rows="20" :placeholder="inputDisab?'':'请输入经营范围'" maxlength="1000" show-word-limit></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </section>

            <!-- 党建社团信息 -->
            <section>
                <div class="title">党建社团信息</div>
                <el-form class="basics-style" ref="form" :model="partyForm" :label-width="labelWidth">
                    <el-row :gutter="40" class="el-row-ws" type="flex" justify="space-between">
                        <el-col :span="rowSpan">
                            <el-form-item label="所属党组织:" prop="name">
                                <el-input v-model.trim="partyForm.associationName" maxlength="20" :disabled="inputDisab" :placeholder="inputDisab ? '' : '请输入所属党组织'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan">
                            <el-form-item label="党员人数:" prop="partyMemberNumber">
                                <el-input maxlength="7" v-model.trim="partyForm.partyMemberNumber" :disabled="inputDisab" :placeholder="inputDisab ? '' : '请输入党员人数'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="rowSpan"></el-col>
                    </el-row>
                    <el-row :gutter="40" class="el-row-ws " type="flex" style="margin:0px">
                        <label class="table-title">参加社会组织:</label>
                        <el-table :class="!inputDisab?'':'tableBr'" :data="partyForm.rpcJAVoList" style="width: 100%" :border="true" :header-cell-style="headerCellStyle">
                            <el-table-column label="组织名称">
                                <template slot-scope="scope">
                                    <span v-if="inputDisab">{{ scope.row.orgName }}</span>
                                    <el-input maxlength="20" v-model.trim="scope.row.orgName" v-else :placeholder="inputDisab ? '' : '请输入'"></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column label="职务">
                                <template slot-scope="scope">
                                    <span v-if="inputDisab">{{ scope.row.duties }}</span>
                                    <el-input maxlength="20" v-model.trim="scope.row.duties" v-else :placeholder="inputDisab ? '' : '请输入'"></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column label="加入时间">
                                <template slot-scope="scope">
                                    <span v-if="inputDisab">{{scope.row.joinTime && scope.row.joinTime ? scope.row.joinTime.slice(0, 10) : '-' }}</span>
                                    <el-date-picker
                                        v-model.trim="scope.row.joinTime"
                                        v-else
                                        type="date"
                                        :placeholder="inputDisab? '' : '请选择'"
                                        :picker-options="pickerOptions"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                    ></el-date-picker>
                                </template>
                            </el-table-column>

                            <el-table-column fixed="right" label="操作" v-if="!inputDisab">
                                <template slot-scope="scope">
                                    <el-button @click="deleteRow(scope.$index)" type="text" style="color: #f05259">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                     <el-row class="el-row-ws addRow" type="flex" justify="center" v-if="!inputDisab">
                          <el-button style="color: #F05259;border-color: rgb(251, 203, 205);"  @click="addPost()" icon="el-icon-circle-plus" class="addBtn">添加职务</el-button>
                     </el-row>
                </el-form>
            </section>

            <!-- 附件资料 -->
            <section class="imageUpload">
                <div class="title">
                    附件资料<span v-if="!inputDisab" style="color: #f05259">(请上传jpg、png格式照片，大小不超过10M)</span>
                </div>
                <div class="picBox">
                    <div class="picMiniBox" v-for="(item, index) in fileList" :key="index">
                        <ws-image-upload
                            :key="index"
                            ref="imageUpload"
                            v-bind="options"
                            :quantity="1"
                            :urlList="getUrlList(item)"
                            :afterUpload="(val) =>afterUpload(val,index)"
                            :handleRemove="(val) =>handleRemove(val,index)"
                            :inputReadyOnly="!inputDisab ? false : true"
                            :isDelete="!inputDisab ? true : false"
                        />
                        <div>{{ item.name }}</div>
                    </div>
                </div>
            </section>

            <!-- 记录信息 -->
            <section v-if="inputDisab">
                <div class="title">记录信息</div>
                <RecordInfo :recordInfo="recordInfo"/>
            </section>

            <section class="btnBox">
                <el-button class="backBtn" @click="cancel()">返回</el-button>
                <el-button v-if="!inputDisab" style="width: 160px" type="primary" @click="submitForm()">提交审核</el-button>
            </section>
        </div>
        <!-- 地址采集 -->
        <a-map title="坐标采集" :show-search="true" v-if='mapShow' :show.sync="mapShow"  @select="addressSure" :cityOpt="cityOpt"></a-map>
        <!-- 审核流程 -->
        <div v-if="!inputDisab" class="auditProcess">
            <div class="title">审核流程</div>
            <audit-process ref="auditProcess" title=" " :actions="actions" :query="{ nameCode: 30 }"></audit-process>
        </div>
   </div>
</template>

<script>
import { _axios } from '../../../../utils/commMethods';
import { mapState } from 'vuex';
import RecordInfo from '../../components/RecordInfo/index.vue';
import AuditProcess from '@/components/AuditProcess';
import AMap from '@/components/AMap';
import { mixin } from '../../components/mixin.js';
export default {
    name: 'personInfo',
    mixins: [mixin],
    data() {
        return {
            moduleName: '/personalCenter/personInfo',
            inputDisab: true,
            isDetail: this.$route.query.type == 'detail' ? 'isDetail' : '',
            mapShow:false,
            //详情-详细地址
            address:'',
            //城市地址
            cityOpt: {
                label:'',
                cityCode:''
            },
            pickerOptions: {
                disabledDate: this.disabledDate
            },
            //记录信息
            recordInfo: {
                agencyNumber: this.$route.query.agencyNumber,
                orgType: this.$route.query.orgType,
                infoType: 1
            },
            //省市区
            provinceCityAreaList: [],
            //区域
            localJurisdictionList: [],
            //上传附件
            options: {
                quantity: 1,
                actions: {
                    url: '/orgWeb/file/addAllAttachment',
                    op: 'upload' //上传op，优先级高于moduleName
                }
            },
            // 基础信息
            basicsForm: {
                importantStatus: [{ required: true, message: '请选择分公司类型', trigger: 'blur' }],
                name: [{ required: true, message: '请输入分公司全称', trigger: 'blur' }],
                simpleName: [{ required: true, message: '请输入分公司简称:', trigger: 'blur' }],
                grade: [{ required: true, message: '请选择分公司等级', trigger: 'blur' }],
                establishTime: [{ required: true, message: '请输入设立时间', trigger: 'blur' }],
                registeredCapital: [{ required: true,  message: '请输入注册资本',trigger: 'blur' }],
                submitAreaCode: [{ required: true, message: '请选择机构所在地区', trigger: 'blur' }],
                provinceList: [{ required: true, message: '请选择业务城市', trigger: 'blur' }],
                serviceNo: [{ required: true, message: '请输入社会信用代码', trigger: 'blur' }],
                licenseStatus: [{ required: true, message: '请选择是否有牌照', trigger: 'blur' }]
            },
            basicsParam: {
                provinceList: [],
                cityAreaCodeList: []
            },
            // 营业信息
            manageForm: {
                bLUnitProperty: [{ required: true, message: '请输入单位性质', trigger: 'blur' }],
                bLPersonChargeName: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
                bLHandleTime: [{ required: true, message: '请选择办证时间', trigger: 'blur' }],
                bLScope: [{ required: true, message: '请输入经营范围', trigger: 'blur' }]
            },
            manageParam: {},
            // 党建社团信息
            partyTable: [],
            partyForm: {
                partyMemberNumber: '',
                associationName: '',
                rpcJAVoList: [{ orgName: '', duties: '', joinTime: '' }]
            },
            //附件
            fileList: [],
            imgList: {
                imgUrl:'' ,
                waterMarkImageUrl: '',
                waterMarkImageFileId:null ,
            },
            //原数据
            rawData: {},
            op: {
                detail: 'selectBaseCompanyDetail', //详情
                update: 'baseWorkflowUpdate' //编辑
            }
        };
    },
    components: {
        RecordInfo,
        AuditProcess,
        AMap,
        uploadFile: () => import('../../../home/addLegalCompany/uploadFile/index.vue')
    },
    created() {
        let vm = this;
        vm.rowData = { ...vm.$route.query };
        if (vm.rowData.type == 'edit') {
            vm.inputDisab = false;
            vm.getOrgAttachmentNameList({ attachmentType: 20 }).then(res => {
                vm.fileList = res;
            });
        }
        vm.getCityAreaDetail().then(res => {
            vm.provinceCityAreaList = res;
            vm.orgDetail();
        });
    },
    computed: {
        ...mapState('personalCenter', ['licenseStatusFilters', 'signStatusFilters', 'companyTypeFilters',  'gradeFilters'])
    },
    methods: {
        //------------------------ 接口请求 ----------------
        //获取详情
        async orgDetail() {
            let vm = this;
            try {
                let param = {
                    agencyNumber: vm.rowData.agencyNumber,
                    op: vm.op.detail
                };
                let res = await _axios(param, vm.moduleName);
                if (res.code == 1) {
                    vm.getDetail(res.data);
                    vm.getLocalJurisdictionList(vm.basicsParam.cityAreaCodeList, true);
                    vm.getLocalJurisdictionList(vm.basicsParam.provinceList, false);
                }
            } catch (err) {
                throw err;
            }
        },
        //提交审核
        async submitForm() {
            let vm = this;
            let approvalInfo = vm.setApprovalInfo();
            try {
                if (vm.inputDisab) return (vm.inputDisab = false);

                // 基础信息必填校验
                let basicsForm = await new Promise(resove => {
                    vm.$refs['basicsForm'].validate(valid => {
                        resove(valid);
                    });
                });
                // 营业信息必填校验
                let manageForm = await new Promise(resove => {
                    vm.$refs['manageForm'].validate(valid => {
                        resove(valid);
                    });
                });
                //基础信息  营业信息 附件位 审核流 校验
                if (!basicsForm || !manageForm  || !this.setApprovalPer(approvalInfo)) return;

                let code = {
                    cityCode: vm.basicsParam.provinceList[1] || '', //业务城市-城市code
                    provinceCode: vm.basicsParam.provinceList[0] || '', //业务城市-省会code
                    submitAreaCode: vm.basicsParam.submitAreaCode + '' || '', //机构所在地区-区域编码
                    submitCityCode: vm.basicsParam.cityAreaCodeList[1] + '' || '', //机构所在地区-城市编码
                    submitProvinceCode: vm.basicsParam.cityAreaCodeList[0] + '' || '' //机构所在地区-省区编码
                };
                let address = vm.basicsParam.workAddress;
                let spaceArea = vm.basicsParam.spaceArea||0;

                //党建信息处理
                let list=vm.partyForm.rpcJAVoList;
                list.map((item,index)=>{
                     if(!item.orgName&&!item.duties&&!item.joinTime){
                        vm.partyForm.rpcJAVoList.splice(index,1)
                     }
                })

                let param = {
                    //基本信息
                    rpcCompanyConsoleAo: {
                        ...vm.basicsParam,
                        ...code,
                        category: 2,
                        orgType: 20
                    },
                    // 党建社团信息
                    rpcCompanyAssociationAo: { ...vm.partyForm,rpcJAAoList:vm.partyForm.rpcJAVoList},
                    // 营业信息
                    rpcCompanyBusinessAo: {
                        ...vm.manageParam,
                        address,
                        spaceArea
                    },
                    // 附件资料
                    attachmentInfoList: vm.fileList,
                    // 审核信息
                    rpcWorkFlowAoList: approvalInfo,
                    orgType: vm.rowData.orgType,
                    op: vm.op.update
                };
                //高亮数据
                let data = vm.getNewData(vm.rawData, param);
                data = {
                    consoleList: data.rpcCompanyConsoleAo, //基础信息
                    businessList: data.rpcCompanyBusinessAo, //营业执照
                    associationList:data.rpcCompanyAssociationAo//党建信息
                };
                param = {
                    ...param,
                    ...data
                };
                delete param.rpcCompanyConsoleAo.spaceArea;
                delete param.rpcCompanyConsoleAo.workAddress;
                delete param.rpcCompanyAssociationAo.rpcJAVoList;
                let res = await _axios(param, vm.moduleName);
                if(res.code == -100){
                    this.$confirm('当前审批配置的工作流规则有更新。确认后，流程区将按新工作流刷新节点。', '提示', {
                        confirmButtonText: '确定',
                        center: true
                    }).then(() => {
                        this.$refs.auditProcess.getFlowable();
                    });
                }else if(res.code == 1){
                    vm.$message.success('提交审核成功');
                    vm.cancel();
                }
            } catch (err) {
                throw err;
            }
        },

        //-----------------  数据处理 -------------------
        //详情数据处理
        getDetail(data) {
            let vm = this;
            let { rpcCompanyConsoleVo, attachmentList, rpcCompanyAssociationVo, rpcCompanyBusinessVo } = data;
            const { submitProvinceCode, submitCityCode, cityCode, provinceCode } = rpcCompanyConsoleVo || {}; // 机构基础信息

            // 基础信息
            vm.basicsParam = { ...rpcCompanyConsoleVo };
            delete vm.basicsParam.rpcCompanyBusinessVo;
            delete vm.basicsParam.rpcCompanyAssociationVo;
            delete vm.basicsParam.attachmentList;
            delete vm.basicsParam.companyBusinessVo;
            //详情-详细地址
            vm.address=vm.basicsParam.address+vm.basicsParam.supplementAddress

            // 运营信息
            vm.manageParam = { ...rpcCompanyBusinessVo };
            vm.manageParam.driverNum = (rpcCompanyConsoleVo && rpcCompanyConsoleVo.driverNum) || '';

            // 党建设团信息
            vm.partyForm = { ...rpcCompanyAssociationVo };

            if (vm.rowData.type == 'edit') {
                // 附件列表
                vm.fileList = vm.setFileList(vm.fileList, attachmentList);
                vm.fileList.map(item => {
                    item.orgType = 20;
                    return item;
                });
            } else {
                vm.fileList = attachmentList;
            }

            //保存原数据
            vm.rawData = {
                rpcCompanyConsoleAo: JSON.parse(JSON.stringify(vm.basicsParam)), //基础信息
                rpcCompanyBusinessAo: JSON.parse(JSON.stringify(vm.manageParam)), //运营信息
                rpcCompanyAssociationAo:JSON.parse(JSON.stringify(vm.partyForm))//党建信息
            };

            //业务城市 机构所在地区 办公地址 办公面积
            vm.basicsParam.provinceList = [provinceCode, cityCode] || [];
            vm.basicsParam.cityAreaCodeList = [submitProvinceCode, submitCityCode] || [];
            let workAddress = (rpcCompanyBusinessVo && rpcCompanyBusinessVo.address) || null;
            let spaceArea = (rpcCompanyConsoleVo.companyBusinessVo &&rpcCompanyConsoleVo.companyBusinessVo.spaceArea) || null;
            vm.$set(vm.basicsParam, 'workAddress', workAddress);
            vm.$set(vm.basicsParam, 'spaceArea', spaceArea);
        },
        //添加组织信息
        addPost() {
            let vm = this;
            if(vm.partyForm.rpcJAVoList.length){
                for (let item of vm.partyForm.rpcJAVoList) {
                     if(!item.orgName&&!item.duties&&!item.joinTime){
                             vm.$message.error(`请先将上条组织信息填写完整`);
                             return
                     }
                }
            }
            vm.partyForm.rpcJAVoList.push({
                orgName: '',
                duties: '',
                joinTime: '',
                opType:2
            });
        },
        //删除组织信息
        deleteRow(arrindex) {
            let vm = this;
            vm.$confirm('是否确认删除该组织信息？', '删除组织', {
                confirmButtonText: '确定',
                center: true
            }).then(() => {
                vm.partyForm.rpcJAVoList.splice(arrindex, 1);
            });
        },

    }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/personInfo.scss';
/deep/ .el-table{
    border-radius:8px 8px 0px 0px;
}
.addBtn{
    border: none;
    background-color: #fff;
}
.addBtn:hover{
    background-color: #fff;
}
.addRow{
    border: 1px solid #EBEEF5;
    border-top: none;
    border-radius: 0 0 8px 8px;
    margin-left: 120px;
}
.tableBr{
    border-radius: 8px;
}
</style>
