<template>
    <el-form class="rule-form" label-position="right" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
        <div class="org-open-apply-title"></div>
        <!-- 新增分公司/分支机构 -->
        <el-row :gutter="40" v-if="pageType === 'addBranchCompany'">
            <el-col :span="8">
                <el-form-item label="机构全称:" prop="name">
                    <el-input v-model.trim="ruleForm.name" placeholder="请输入机构全称" maxlength="50"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="机构简称:" prop="simpleName">
                    <el-input v-model.trim="ruleForm.simpleName" placeholder="请输入机构简称" maxlength="12"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="设立时间:" prop="establishTime">
                    <el-date-picker
                        style="width: 100%"
                        v-model="ruleForm.establishTime"
                        :picker-options="pickerOptions"
                        type="date"
                        placeholder="请选择日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="注册资本:" prop="registeredCapital">
                    <el-input v-model.trim="ruleForm.registeredCapital" placeholder="请输入注册资本" @input="validateNumber($event, 'registeredCapital')" maxlength="10"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="分公司类型:" prop="importantStatus">
                    <el-select required v-model="ruleForm.importantStatus" style="width: 100%">
                        <el-option v-for="item in companyTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
                <el-form-item label="社会信用代码:" prop="serviceNo">
                    <el-input v-model.trim="ruleForm.serviceNo" @input="abcNumber($event, 'serviceNo', '')" placeholder="请输入社会信用代码" maxlength="20"></el-input>
                </el-form-item>
            </el-col> -->
            <el-col :span="8">
                <div class="orgClass" style="display: flex">
                    <el-form-item label="机构所在地:" required prop="cityAreaCodeList" style="flex: 5; padding-right: 8px">
                        <ws-city
                            placeholder="选择省市"
                            @change="orgApplyAreaChange"
                            :data="orgProvinceCityList"
                            ref="ws-city"
                            level="2"
                            v-model="ruleForm.cityAreaCodeList"
                            :defaultProps="{ checkStrictly: false }"
                            clearable
                        ></ws-city>
                    </el-form-item>
                    <el-form-item prop="submitAreaCode" required style="flex: 2">
                        <el-select @change="orgApplyCityAreaChange" required v-model="ruleForm.submitAreaCode" style="width: 100%" placeholder="请选择区域" filterable>
                            <el-option v-for="item in localJurisdictionList" :key="item.id" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="8">
                <el-form-item label="上级机构:" prop="parentId">
                    <!-- 新增分公司的  上级机构 -->
                    <el-select  v-model="ruleForm.parentId" style="width: 100%" @change="parentIdChange" filterable>
                        <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="业务城市:" prop="cityCodeList">
                    <ws-city ref="wscity" level="2" v-model="ruleForm.cityCodeList" :defaultProps="{ checkStrictly: false }" @change="getCityNameList" :clearable="false"></ws-city>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="分公司等级:" prop="grade">
                    <el-select required v-model="ruleForm.grade" style="width: 100%">
                        <el-option v-for="item in gradeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="详细地址:" prop="address">
                    <el-input disabled v-model="ruleForm.address" placeholder="请采集详细地址"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" class="add-adress" style="display: flex; position: relative; padding: 0; left: -12px">
                <el-form-item prop="supplementAddress" label-width="0" style="width: calc(100% - 106px); padding-right: 8px">
                    <el-input v-model.trim="ruleForm.supplementAddress" placeholder="请输入门牌号" maxlength="20"></el-input>
                </el-form-item>
                <el-button type="primary" @click="chooseLocal">采集地址</el-button>
            </el-col>
        </el-row>
        <div class="org-open-apply-title to-top" v-if="pageType === 'addPhysicalStore'">基本信息</div>
        <!-- 新增服务中心 和 新增实体店 -->
        <el-row :gutter="40" v-if="pageType === 'addServiceCentre' || pageType === 'addPhysicalStore'">
            <el-col :span="8">
                <!-- <el-form-item label="机构所在地" required> -->
                <div class="orgClass" style="display: flex">
                    <el-form-item label="机构所在地:" required prop="cityAreaCodeList" style="flex: 5; padding-right: 8px">
                        <ws-city
                            placeholder="选择省市"
                            @change="orgApplyAreaChange"
                            :data="orgProvinceCityList"
                            ref="ws-city"
                            level="2"
                            v-model="ruleForm.cityAreaCodeList"
                            :defaultProps="{ checkStrictly: false }"
                            clearable
                        ></ws-city>
                    </el-form-item>
                    <el-form-item required prop="submitAreaCode" style="flex: 2">
                        <el-select @change="orgApplyCityAreaChange" required v-model="ruleForm.submitAreaCode" style="width: 100%" placeholder="请选择区域" filterable>
                            <el-option v-for="(item, index) in localJurisdictionList" :key="index" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <!-- </el-form-item> -->
            </el-col>
            <el-col :span="8" class="flex">
                <el-form-item label="业务运营范围:" prop="cityCodeList" class="pdr8">
                    <ws-city ref="wscity" level="2" v-model="ruleForm.cityCodeList" :defaultProps="{ checkStrictly: false }" @change="setCityName" :data="provinceCityList" :clearable="false"></ws-city>
                </el-form-item>
                <el-form-item label-width="0" prop="areaCodes" class="mgl10">
                    <el-select
                        class="mgl0"
                        v-model="ruleForm.areaCodes"
                        multiple
                        clearable
                        collapse-tags
                    >
                        <el-option
                            v-for="item in areaCodesList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.code"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="40" v-if="pageType === 'addServiceCentre'">
            <el-col :span="8">
                <el-form-item label="详细地址:" prop="address">
                    <el-input disabled v-model="ruleForm.address" placeholder="请采集详细地址"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" class="add-adress" style="display: flex; position: relative; padding: 0; left: -12px">
                <el-form-item prop="supplementAddress" label-width="0" style="width: calc(100% - 106px); padding-right: 8px">
                    <el-input v-model.trim="ruleForm.supplementAddress" placeholder="请输入门牌号" maxlength="20"></el-input>
                </el-form-item>
                <el-button type="primary" @click="chooseLocal">采集地址</el-button>
            </el-col>
        </el-row>

         <!-- 新增服务中心 和 新增实体店 -->
        <el-row :gutter="40" v-if="pageType === 'addServiceCentre' || pageType === 'addPhysicalStore'">
            <!-- <el-col :span="8" v-if="pageType === 'addPhysicalStore'">
                <el-form-item label="店面位置:" prop="storeLocation">
                    <el-select required v-model="ruleForm.storeLocation" style="width: 100%">
                        <el-option v-for="item in storeLocationFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col> -->
            <!-- <el-col :span="8" v-if="pageType === 'addPhysicalStore'">
                <el-form-item label="经度:" prop="longitude">
                    <el-input disabled v-model="ruleForm.longitude"></el-input>
                </el-form-item>
            </el-col> -->
            <!-- <el-col :span="8" v-if="pageType === 'addPhysicalStore'">
                <el-form-item label="纬度:" prop="latitude">
                    <el-input disabled v-model="ruleForm.latitude"></el-input>
                </el-form-item>
            </el-col> -->
            <el-col :span="8">
                <el-form-item label="机构全称:" prop="name">
                    <el-input v-model.trim="ruleForm.name" placeholder="请输入机构全称" maxlength="50"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="机构简称:" prop="simpleName">
                    <el-input v-model.trim="ruleForm.simpleName" placeholder="请输入机构简称" maxlength="12"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="pageType === 'addServiceCentre'">
                <el-form-item label="设立时间:" prop="establishTime">
                    <el-date-picker
                        style="width: 100%"
                        v-model="ruleForm.establishTime"
                        :picker-options="pickerOptions"
                        type="date"
                        placeholder="请选择日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="机构类型:" prop="centerType">
                  <!-- 服务中心 -->
                    <el-select v-if="pageType === 'addServiceCentre'" required v-model="ruleForm.centerType" style="width: 100%">
                        <el-option v-for="item in centerTypeCenFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                    <!-- 实体店 -->
                    <el-select v-else required v-model="ruleForm.centerType" style="width: 100%" @change='onChangePhysicalStoreCenterType'>
                        <el-option v-for="item in centerTypeStoFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="上级机构:" prop="parentId">
                  <!-- 服务中心的 上级机构 -->
                  <template v-if="pageType === 'addServiceCentre'">
                    <el-select  v-model="ruleForm.parentId" style="width: 100%" @change="parentIdChange" filterable>
                        <el-option
                            v-for="item in companyList"
                            :key="pageType === 'addPhysicalStore' ? item.relationId : item.id"
                            :label="pageType === 'addPhysicalStore' ? item.orgName : item.name"
                            :value="pageType === 'addPhysicalStore' ? item.relationId : item.id"
                        ></el-option>
                    </el-select>
                      </template>
                    <!-- 新增实体店 有二级懒加载 -->
                    <template  v-else>
                      <ws-organization
                          :key="cascaderKey"
                          ref="cascader"
                          v-model="ruleForm.parentId"
                          :defaultProps="{ checkStrictly: false, lazyLoad }"
                          @change="storeParentIdChange"
                          filterable
                      />
                    </template>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="注册资本:" v-if="pageType === 'addServiceCentre'" prop="registeredCapital">
                    <el-input v-model.trim="ruleForm.registeredCapital" placeholder="请输入注册资本" @input="validateNumber($event, 'registeredCapital')" maxlength="10"></el-input>
                </el-form-item>
            </el-col>
            <!-- <el-col :span="8" v-if="pageType === 'addPhysicalStore'">
                <el-form-item label="开店状态:" prop="openStatus">
                    <el-select required v-model="ruleForm.openStatus" style="width: 100%" @change="openStatusChange">
                        <el-option v-for="item in openStatusFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col> -->
            <!-- <el-col :span="8" v-if="pageType === 'addPhysicalStore' && ruleForm.openStatus === 1">
                <el-form-item label="承诺开店时间:" prop="promiseOpenTime">
                    <el-date-picker
                        style="width: 100%"
                        v-model="ruleForm.promiseOpenTime"
                        :picker-options="openStatusPickerOptions"
                        type="date"
                        placeholder="请选择日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
            </el-col> -->
        </el-row>
        <div class="org-open-apply-title to-top" v-if="pageType === 'addServiceCentre'">营业执照信息</div>
        <!-- <el-row :gutter="40" v-if="pageType === 'addBranchCompany' || pageType === 'addServiceCentre'">
            <el-col :span="8">
                <el-form-item label="单位性质:" prop="rpcOrgBusinessAo.bLUnitProperty" :rules="rules.bLUnitProperty">
                    <el-input v-model.trim="ruleForm.rpcOrgBusinessAo.bLUnitProperty" placeholder="请输入单位性质" maxlength="20"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="负责人:" prop="rpcOrgBusinessAo.bLPersonChargeName" :rules="rules.bLPersonChargeName">
                    <el-input v-emoji v-model.trim="ruleForm.rpcOrgBusinessAo.bLPersonChargeName" placeholder="请输入姓名" maxlength="20"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="办证时间:" prop="rpcOrgBusinessAo.bLHandleTime" :rules="rules.bLHandleTime">
                    <el-date-picker style="width: 100%" v-model="ruleForm.rpcOrgBusinessAo.bLHandleTime" type="date" placeholder="请选择日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="经营范围:" prop="rpcOrgBusinessAo.bLScope" :rules="rules.bLScope">
                    <el-input v-model.trim="ruleForm.rpcOrgBusinessAo.bLScope" type="textarea" placeholder="请输入经营范围" maxlength="1000"></el-input>
                </el-form-item>
            </el-col>
        </el-row> -->
        <el-row :gutter="40" v-if="pageType === 'addServiceCentre'">
            <el-col :span="8">
                <el-form-item label="企业性质:" prop="orgBusiness.bLUnitProperty" :rules="rules.bLUnitProperty">
                    <el-input v-model.trim="ruleForm.orgBusiness.bLUnitProperty" placeholder="请输入单位性质" maxlength="50"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="单位名称:" prop="orgBusiness.orgName" :rules="rules.orgName">
                    <el-input v-model.trim="ruleForm.orgBusiness.orgName" placeholder="请输入单位名称" maxlength="50"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="统一社会信用代码:" prop="orgBusiness.serviceNo" :rules="rules.serviceNo">
                    <el-input v-model.trim="ruleForm.orgBusiness.serviceNo" @input="abcNumber($event, 'orgBusiness', 'serviceNo')" placeholder="请输入社会信用代码" maxlength="20"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="实际经营场所:" prop="orgBusiness.address" :rules="rules.addresss">
                    <el-input v-model.trim="ruleForm.orgBusiness.address" placeholder="请输入实际经营场所" maxlength="50"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="个人/对公账号:" prop="orgBusiness.broughtAccount" :rules="rules.broughtAccount">
                    <el-input v-model.trim="ruleForm.orgBusiness.broughtAccount" placeholder="请输入银行账户" maxlength="20"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="办证时间:" prop="orgBusiness.bLHandleTime" :rules="rules.bLHandleTime">
                    <el-date-picker style="width: 100%" v-model="ruleForm.orgBusiness.bLHandleTime" type="date" placeholder="请选择日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="16">
                <el-form-item label="备注:" prop="orgBusiness.remark">
                    <el-input v-model.trim="ruleForm.orgBusiness.remark" placeholder="请输入备注" maxlength="50"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="经营范围:" prop="orgBusiness.bLScope" :rules="rules.bLScope">
                    <el-input v-model.trim="ruleForm.orgBusiness.bLScope" type="textarea" placeholder="请输入经营范围" maxlength="1000"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <div class="org-open-apply-title to-top">
            负责人信息
            <span>(负责人手机号将作为登录账号使用，请正确填写)</span>
        </div>
        <el-row :gutter="40">
            <el-col :span="8">
                <el-form-item label="负责人手机号:" prop="rpcPersonChargeInfoAo.personChargePhone" :rules="rules.personChargePhone">
                    <el-input v-model.trim="ruleForm.rpcPersonChargeInfoAo.personChargePhone" placeholder="请输入负责人手机号" maxlength="11" @input="personChargePhoneChange"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="负责人姓名:" prop="rpcPersonChargeInfoAo.personChargeName" :rules="showRpcOrgInfo ? {} : rules.personChargeName">
                    <el-input v-emoji v-model.trim="ruleForm.rpcPersonChargeInfoAo.personChargeName" :disabled="showRpcOrgInfo" placeholder="请输入姓名" maxlength="10"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="负责人身份证:" prop="rpcPersonChargeInfoAo.personChargeNo" :rules="showRpcOrgInfo ? {} : rules.personChargeNo">
                    <el-input v-model.trim="ruleForm.rpcPersonChargeInfoAo.personChargeNo" :disabled="showRpcOrgInfo" placeholder="请输入身份证号码" maxlength="20"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="负责人职务:" prop="rpcPersonChargeInfoAo.personChargePostId" :rules="rules.personChargePostId">
                    <!-- pageType为实体店时，负责人的职务只能是预备店长 -->
                    <el-select required v-model="ruleForm.rpcPersonChargeInfoAo.personChargePostId" @change="personChargePostIdChange" :disabled="pageType === 'addPhysicalStore' && showRpcOrgInfo" style="width: 100%">
                        <el-option v-for="item in filteRoutSourcingHead" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24" v-if="rpcOrgInfo.length > 0" class="org-font">
                <div class="org-font-span">{{ ruleForm.rpcPersonChargeInfoAo.personChargePhone }} 已任职情况如下 :</div>
                <el-table
                    :data="rpcOrgInfo"
                    border
                    style="width: 100%"
                    :header-cell-style="{
                        background: '#F5F7FA',
                        'font-family': 'PingFangSC-Medium, PingFang SC',
                        'font-weight': '600',
                        color: '#606266',
                    }"
                    class="org-table"
                >
                    <el-table-column prop="deptName" label="任职机构" width=""></el-table-column>
                    <el-table-column prop="positionName" label="职务" width=""></el-table-column>
                    <el-table-column prop="positionTypeName" label="职务类型"></el-table-column>
                    <el-table-column label="任命时间" width="">
                        <template slot-scope="scope">
                            {{ scope.row.entryDate.substring(0, 10) }}
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>

        <!-- 一定不要删除 -->
        <div v-show='false'>{{reShowList}}</div>
    </el-form>
</template>

<script>
// 取省市两级
function formatProvinceCity(list) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].children) {
            list[i].children = list[i].children.map(({ name, code }) => {
                return { name, code };
            });
        }
    }
    return list;
}
export default {
    name: 'ValidateForm',
    props: {
        ruleForm: {
            type: Object,
            default: () => {},
            require: true
        },
        rules: {
            type: Object,
            default: () => {},
            require: true
        },
        /**
         * 入口类型
         */
        pageType: {
            type: String,
            default: 'addBranchCompany'
        }
    },

    data() {
        return {
            localJurisdictionList: [],
            superOrgList: [],
            moduleName: '/addBranchCompany',
            // 分公司类别 选项
            companyTypeFilters: [
                { id: 1, value: '重点分公司' },
                { id: 2, value: '非重点分公司' }
            ],
            // 分公司等级  选项
            gradeFilters: [
                { id: 1, value: '大一' },
                { id: 2, value: '大二' },
                { id: 3, value: '小一' },
                { id: 4, value: '小二' },
                { id: 5, value: '小三' },
            ],
            // 服务中心  机构类型 选项
            centerTypeCenFilters: [
                { id: 1, value: '服务中心' },
                { id: 8, value: '服务中心（县市区）' },
            ],
            // 实体店  机构类型 选项
            centerTypeStoFilters: [
                { id: 5, value: '实体店' },
            ],
            // 实体店  店面位置 选项
            storeLocationFilters: [
                { id: 1, value: '写字楼' },
                { id: 2, value: '临街' },
                { id: 3, value: '商场' },
            ],
            // 实体店  开店状态 选项
            // openStatusFilters: [
            //     { id: 1, value: '待开业' },
            //     { id: 2, value: '已开业' },
            // ],
            companyList: [], // 机构所在地列表
            personPostOption: [], // 负责人职务 选项
            orgProvinceCityList: [], // 省市
            provinceCityAreaList: [], // 省市区
            orgType: 20,
            cascaderKey: 1,
            rpcOrgInfo: [],
            showRpcOrgInfo: false,
            nodeList: []
        };
    },

    created() {
        // 获取省市
        this.getProvinceCityList()
        this.getProvinceCityAreaList()

        // 获取负责人职务
        if(this.pageType == 'addServiceCentre') {
            this.orgType = 30
        } else if(this.pageType == 'addPhysicalStore') {
            this.orgType = 40
        } else if (this.pageType== 'addBranchCompany') [
            this.getCompany()
        ]
        this.getPersonPostOption(this.orgType)
    },

    computed: {
        pickerOptions() {
            return {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
                }
            };
        },
        filteRoutSourcingHead() {
            if(this.pageType === 'addPhysicalStore') return this.personPostOption?this.personPostOption.filter(v=>v.outSourcingHead == 2):[]
            return this.personPostOption
        },
        /**
         * 重新提交进来的场景-需要手动调用 查询市的select枚举； 查询上级机构的枚举
         */
        reShowList() {
          let id = this.$route.query.id

          // 有业务id, 说明是重新提交
          if (id === undefined) return ''

          // 默认进来查询省的接口有值； 详情接口返回的市有值
          if (this.provinceCityAreaList.length > 0 && this.ruleForm.cityAreaCodeList && this.ruleForm.cityAreaCodeList.length > 0) {
             let list = this.getAreaListByCode(this.ruleForm.cityAreaCodeList);
             this.localJurisdictionList = list;

              if(this.pageType === 'addServiceCentre' ){
                this.getCompanyList({cityCode: this.ruleForm.cityAreaCodeList[1]})
              }
              if(this.pageType === 'addPhysicalStore'){
                this.getOrgByCityCode({cityCode: this.ruleForm.cityAreaCodeList[1],centerType:null})

                // 强制组件刷新
                this.cascaderKey = Date.now()
              }
          }

          // 一定要return一个值
          return ''
        },
        provinceCityList({ provinceCityAreaList }) {
            return formatProvinceCity(_.cloneDeep(provinceCityAreaList))
        },
        areaCodesList({ provinceCityAreaList, ruleForm }) {
            let [provinceCode, cityCode] = ruleForm.cityCodeList || [];
            return (
                provinceCityAreaList
                    .find((v) => v.code == provinceCode)
                    ?.children.find((v) => v.code == cityCode)?.children || []
            );
        },
    },

    methods: {
      /**
       * 查询上级机构
       */
        async getCompany(){
          try {
            let res = await this.$axios('/authority/organizational/select',{
                op:'getBigRegionList',
                data:{}
            })

            this.companyList = JSON.parse(res.data) || []
          } catch (error) {
          }
        },
        // 数字和纯字母
        abcNumber(val,name,name1) {
            if(!name1){
                this.ruleForm[name] = val.replace(/[^A-Za-z0-9]/g, '');
            }else{
                this.ruleForm[name][name1] = val.replace(/[^A-Za-z0-9]/g, '');
            }

        },
        dataData(){
            if(this.$route.query.procInsId) return this.detailData
            return this.ruleForm
        },
        // 获取省市区
        getProvinceCityAreaList() {
            const URL = '/local/selectAreaTree';
            let opt = {
                data: JSON.stringify({}),
                op: 'select'
            }
            this.$axios(URL,opt).then(res=>{
                this.provinceCityAreaList = JSON.parse(res.data) || []
            })
        },
        // 获取省市
        getProvinceCityList() {
            const URL = '/local/selectAreaTreeNoPermission';
            let opt = {
                data: JSON.stringify({}),
                op: 'select'
            }
            this.$axios(URL,opt).then(res=>{
                let dataList = JSON.parse(res.data) || []
                //获取省市
                dataList.map((item) => {
                    if (item.children.length) {
                        item.children.map(cityItem => {
                            delete cityItem.children
                        })
                    }
                })
                this.orgProvinceCityList = dataList
            })
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        // 校验表单
        validate(callback) {
            this.$refs.ruleForm.validate(valid => {
                callback(valid);
            });
        },
        // 机构所在地改变
        orgApplyAreaChange(val, list) {
            this.ruleForm.address = ''
            this.ruleForm.longitude = ''
            this.ruleForm.latitude = ''
            this.ruleForm.submitAreaCode = ''
            if(!list) {
                list = {}
                this.orgProvinceCityList.some(item => {
                    if(item.code === val[0]) {
                        list.provinceName = item.name
                        item.children.some(i => {
                            if(i.code === val[1]) {
                                list.cityName = i.name
                                return true
                            }
                        })
                        return true
                    }
                })
            }
            this.ruleForm.submitProvinceName = list.provinceName
            this.ruleForm.submitCityName = list.cityName
            this.localJurisdictionList = this.getAreaListByCode(val) || []

            // 根据不同入口类型处理数据
             // 服务中心和实体店
            if (this.pageType === 'addServiceCentre' || this.pageType === 'addPhysicalStore') {
              // this.ruleForm.parentId = ''
              // 强制组件刷新
              this.cascaderKey = Date.now()

              if (this.ruleForm.cityAreaCodeList.length && this.pageType === 'addPhysicalStore') {
                return
              }

              if (val && val.length) {
                // 重新获取上级机构
                this.getCompanyList({
                  cityCode: this.ruleForm.cityAreaCodeList[1]
                })
              } else {
                this.companyList = []
              }

            }
        },
        getAreaListByCode(code) {
            let city,
                areaList = []
            city =
                this.provinceCityAreaList.filter((item) => item.code == code[0]) || []

            if (city.length) {
                areaList = city[0]['children'].filter((e) => e.code == code[1]) || []
            }
            return (areaList.length && areaList[0].children) || []
        },
        orgApplyCityAreaChange(val) {
            this.localJurisdictionList.some(item => {
                if(val == item.code) {
                    this.ruleForm.submitAreaName = item.name
                    return true
                }
            })
        },
        parentIdChange(val) {
            if(val) {
                this.companyList.some(item => {
                    if(val == item.id) {
                        this.ruleForm.parentName = item.name
                        return true
                    }
                })
            }
        },
        getCityNameList(val, list) {
            let getCodeList = this.$refs.wscity.getData()
            if(!list) {
                list = {}
                getCodeList.some(item => {
                    if(item.code === val[0]) {
                        list.provinceName = item.name
                        item.children.some(i => {
                            if(i.code === val[1]) {
                                list.cityName = i.name
                                return true
                            }
                        })
                        return true
                    }
                })
            }
            this.ruleForm.provinceName = list.provinceName
            this.ruleForm.cityName = list.cityName
        },
        setCityName(_, { provinceName, cityName }) {
            this.ruleForm.provinceName = provinceName
            this.ruleForm.cityName = cityName
            this.ruleForm.areaCodes = []
        },
        // 采集地址
        chooseLocal() {
            let node = this.$refs['ws-city']['$refs'].cascader.getCheckedNodes();
            if (node.length > 0) {
                let { path, pathLabels } = node[0];
                this.$emit('chooseLocal', true, {
                    label: pathLabels[1],
                    cityCode: path[1]
                });
            } else {
                this.$message.error('请先选择所在城市区县');
            }
        },
        //获取分公司上级机构
        getCompanyList(params) {
            let that = this
            that.moduleName = '/addBranchCompany'
            let data = {
                data: params,
                op: 'selectRegionInfoByCity'
            }
            // let URL = '/resource/theCompany/select'
            if(that.pageType === 'addServiceCentre') {
                data.op = 'selectCompanyInfoByCity'
                data.data.orgType = 20
                // URL = '/resource/companyServiceCenter/select'
                that.moduleName = '/addServiceCentre'
            }
            // return new Promise((resolve, reject) => {
            //     $vuex.$axios(that.getModuleUrl(data.op), data).then(
            //     (response) => {
            //         let dataList = JSON.parse(response.data)
            //         resolve(dataList)
            //     },
            //     (response) => {
            //         reject(response.data)
            //     }
            //     )
            // })
            that.$axios(that.getModuleUrl(data.op), data).then(res => {
                let dataList = JSON.parse(res.data) || []
                this.companyList = dataList
            })
        },
        personChargePhoneChange(val) {
            let flag = (/^[0-9]*$/).test(val)
            if(!flag) {
                this.ruleForm.rpcPersonChargeInfoAo.personChargePhone = ''
                return
            }
            if(val.length == 11) {
                this.showRpcOrgInfo = false
                this.ruleForm.rpcPersonChargeInfoAo.employeeExist = false
                this.ruleForm.rpcPersonChargeInfoAo.personChargeName = ''
                this.ruleForm.rpcPersonChargeInfoAo.personChargeNo = ''
                this.ruleForm.rpcPersonChargeInfoAo.employeeId = ''
                let opt = {
                    data: {
                        phone: val
                    },
                    op: 'selectResponsiblePerson'
                }
                this.$axios('/personnel/urbanCoFunder/select', opt).then(res => {
                    if(res.code == 1) {
                        let data = JSON.parse(res.data) || {}
                        this.rpcOrgInfo = data.positionInfoList || []
                        if(this.rpcOrgInfo.length > 0) {
                            this.showRpcOrgInfo = true
                            this.ruleForm.rpcPersonChargeInfoAo.employeeExist = true
                            this.ruleForm.rpcPersonChargeInfoAo.personChargeName = data.name
                            this.ruleForm.rpcPersonChargeInfoAo.personChargeNo = data.identityCard
                            this.ruleForm.rpcPersonChargeInfoAo.employeeId = data.employeeId
                            if(this.pageType === 'addPhysicalStore') {
                                this.ruleForm.rpcPersonChargeInfoAo.personChargePostId = this.filteRoutSourcingHead[0].id
                            }
                        }
                    }
                })
            }
        },
        // 获取负责人职务选项
        getPersonPostOption(orgType) {
            let opt = {
                data: {
                    orgType,
                },
                op: 'selectOrgPositionList'
            };
            this.$axios('/authority/positionAuth/select', opt).then(res => {
                this.personPostOption = JSON.parse(res.data) || [];
                this.personPostOption.forEach((item, index) => {
                    if(item.name == '独立法人') {
                        this.personPostOption.splice(index, 1)
                    }
                })
            });
        },
        lazyLoad(node, resolve) {
            let item = node.data
            if (
                (!this.ruleForm.cityAreaCodeList.length ||
                !this.ruleForm.centerType) &&
                this.ruleForm.submitAreaCode != 0
            ) {
                this.$message.error('选择机构类型和所在地区后获取上级机构列表')
                return false
            }
            let parmas = item
                ? {
                    centerType: this.ruleForm.centerType,
                    ...item
                }
                : {
                    cityCode: this.ruleForm.cityAreaCodeList[1],
                    centerType: this.ruleForm.centerType || null
                }
            this.getOrgByCityCode(parmas).then((item) => {
                const { level } = node
                const nodes = item.map((i) => ({
                    ifChild: i.ifChild,
                    orgName: i.orgName,
                    orgType: i.orgType,
                    relationId: i.relationId,
                    leaf: level >= 1
                }))
                this.nodeList = nodes
                resolve(nodes)
            })
        },
        getOrgByCityCode(param) {
            const URL = '/resource/companyServiceStation/select'
            const opt = {
                data: param,
                op: 'selectCompanyCenterExceptTaxi'
            }

            return new Promise((resolve, reject) => {
                $vuex.$axios(URL, opt).then(
                (res) => {
                    let dataList = JSON.parse(res.data) || []
                    let nodes = dataList.map((item) => {
                      item.leaf = item.ifChild == 0
                      return item
                    })
                    resolve(nodes)
                },
                (response) => {
                    reject(response.data)
                }
                )
            })
        },
        storeParentIdChange(val) {
            if(!val) {
                this.nodeList.some(item => {
                    if(this.ruleForm.parentId === item.relationId) {
                        this.ruleForm.parentName = item.orgName
                    }
                })
            } else {
                this.ruleForm.parentName = val.orgName
            }
        },
        // 负责人职务改变获取名称
        personChargePostIdChange(id) {
            this.personPostOption.some(item => {
                if(item.id == id) {
                    this.ruleForm.rpcPersonChargeInfoAo.personChargePostName = item.name
                    return true
                }
            })
        },
        //纯数字支持两位小数
        validateNumber(val,name){
            this.ruleForm[name] = val
              .replace(/[^\d.]/g, "")
              .replace(/\.{2,}/g, ".")
              .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3")
        },

        /**
         * 实体店的
         */
        onChangePhysicalStoreCenterType() {
           this.cascaderKey = Date.now()
            if (!this.ruleForm.cityAreaCodeList) {
                return false
            }

            this.ruleForm.parentId = ''
        }
    },
};
</script>

<style scoped lang="scss">
::v-deep.rule-form {
    .el-form-item__label {
        font-weight: 500;
    }
    .ws-organization {
        width: 100%;
        .el-cascader {
            width: 100%;
        }
    }
}
.org-open-apply-title {
    font-size: 16px;
    font-weight: 600;
    font-family: PingFangSC-Medium, PingFang SC;
    color: #303133;
    margin-bottom: 16px;

    span {
        font-size: 14px;
        font-weight: 400;
        color: #f56c6c;
        font-family: PingFangSC-Regular, PingFang SC;
    }
}
.to-top {
    margin-top: 10px;
}

::v-deep .businessCity {
    .el-cascader--medium {
        width: 100%;
    }
}
::v-deep.ws-city {
    width: 100%;
    .el-cascader.el-cascader--medium {
        width: 100%;
        .el-input.el-input--medium.el-input--suffix {
            width: 100%;
            .el-input__inner {
                width: 100%;
            }
        }
    }
}
::v-deep.orgClass {
    .el-form-item:last-child {
        .el-form-item__content {
            margin: 0 !important;
        }
    }
}
::v-deep.org-font {
    padding-left: 70px !important;
    // & {
    font-size: 14px;
    font-weight: 400;
    color: #f56c6c;
    font-family: PingFangSC-Regular, PingFang SC;
    // }
}
::v-deep.org-table {
    margin: 10px 0 20px;
    border-radius: 8px;
    &::before {
        display: none;
    }
    .el-table__cell {
        border-bottom: none;
    }
    thead {
        tr {
            th:first-child {
                border-top-left-radius: 8px;
            }
            th:last-child {
                border-top-right-radius: 8px;
            }
        }
    }
    .el-table__row:last-child {
        td:first-child {
            border-bottom-left-radius: 8px;
        }
        td:last-child {
            border-bottom-right-radius: 8px;
        }
    }
    .add-adress {
        padding: 0 !important;
        .el-form-item {
            // width: calc(100% - 106px);
            ::v-deep.el-form-item__content {
                margin: 0 8px !important;
            }
        }
    }
}
/deep/ .el-form-item__label {
    padding: 0px !important;
}
/deep/ .el-input--medium {
    margin-left: 10px;
}
.flex {
    display: flex;
}
.pdr8 {
    padding-right: 8px;
}
.rule-form ::v-deep {
    .mgl10 {
        margin-left: 10px;
    }
    .mgl0 .el-input {
        margin-left: 0;
    }
}
</style>
