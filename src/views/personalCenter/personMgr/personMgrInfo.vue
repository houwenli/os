<template>
    <div>
        <div class="Fapply-box">
            <!-- 个人信息 -->
            <div class="peoInfo" v-if="isDetail">
                <img class="avator" src="../../../assets/images/Avatar.png" alt="" />
                <div class="name">{{ dataOptions.name }}</div>
                <div class="info">
                    <span style="margin-right: 26px">{{ dataOptions.phone }}</span>
                    <span>{{ dataOptions.age }}岁</span>
                </div>
            </div>
            <!-- 基础信息 -->
            <div>
                <div class="title">
                    <span>基础资料</span>
                </div>
                <el-form ref="basicInfo" label-position="right" label-width="8rem" :model="dataOptions" :rules="rules">
                    <el-row type="flex" justify="space-between">
                        <el-col :span="7">
                            <el-form-item prop="orgType" label="机构类型：">
                                <el-select filterable v-model="dataOptions.orgType" placeholder="请选择" :disabled="isDetail" @change="clearOrg(dataOptions.orgType)">
                                    <el-option v-for="item in orgTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item prop="orgId" label="任职机构：">
                                <organization-options
                                    style="display: inline-block"
                                    ref="org"
                                    :disabled="!dataOptions.orgType || isDetail"
                                    placeholder="请输入机构名称搜索"
                                    :orgType="dataOptions.orgType + ''"
                                    v-model="dataOptions.orgId"
                                    :showSelect="false"
                                    valueKey="orgId"
                                ></organization-options>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item prop="name" label="姓名：">
                                <el-input maxlength="20" v-model.trim="dataOptions.name" placeholder="请输入姓名" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between">
                        <el-col :span="7">
                            <el-form-item prop="phone" label="联系电话：">
                                <el-input maxlength="11" v-model.trim="dataOptions.phone" placeholder="请输入电话号码" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item prop="joinWanshunTime" label="加入万顺日期：">
                                <el-date-picker v-model="dataOptions.joinWanshunTime" style="width: 100%" type="date" placeholder="请选择" :disabled="isDetail"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="工号：">
                                <el-input maxlength="20" v-model.trim="dataOptions.jobNumber" :placeholder="isDetail ? '' : '请输入工号'" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between">
                        <el-col :span="7">
                            <el-form-item label="籍贯：">
                                <el-input maxlength="20" v-model.trim="dataOptions.nativePlace" :placeholder="isDetail ? '' : '请输入籍贯'" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item prop="idNumber" label="身份证号码：">
                                <el-input maxlength="18" v-model.trim="dataOptions.idNumber" @blur="addBornTime" placeholder="请输入身份证号码" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item prop="birthDate" label="出生日期：">
                                <el-date-picker v-if="showBirthDate" v-model="dataOptions.birthDate" style="width: 100%" type="date" placeholder="请选择" :disabled="true"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between">
                        <el-col :span="7">
                            <el-form-item label="性别：">
                                <el-select filterable v-model="dataOptions.sex" :placeholder="isDetail ? '' : '请选择'" :disabled="isDetail">
                                    <el-option v-for="item in sexList" :key="item.id" :label="item.value" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="婚姻：">
                                <el-select filterable v-model="dataOptions.maritalStatus" :placeholder="isDetail ? '' : '请选择'" :disabled="isDetail">
                                    <el-option v-for="item in marryList" :key="item.id" :label="item.value" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="民族：">
                                <el-input maxlength="20" v-model.trim="dataOptions.nation" :placeholder="isDetail ? '' : '请输入民族'" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between">
                        <el-col :span="7">
                            <el-form-item label="学历：">
                                <el-select filterable v-model="dataOptions.education" :placeholder="isDetail ? '' : '请选择'" :disabled="isDetail">
                                    <el-option v-for="item in studyList" :key="item.id" :label="item.value" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item prop="political" label="政治面貌：">
                                <el-select filterable v-model="dataOptions.political" placeholder="请选择" :disabled="isDetail">
                                    <el-option v-for="item in politicsList" :key="item" :label="item" :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item prop="veterans" label="是否退伍军人：">
                                <el-select filterable v-model="dataOptions.veterans" placeholder="请选择" :disabled="isDetail">
                                    <el-option v-for="item in soldierList" :key="item.id" :label="item.value" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between">
                        <el-col :span="7">
                            <el-form-item label="户籍所在地：">
                                <ws-city :placeholder="isDetail ? '' : '请选择'" :disabled="isDetail" v-model="dataOptions.area" :defaultProps="{ checkStrictly: false }"></ws-city>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="详情住址：">
                                <el-input maxlength="50" v-model.trim="dataOptions.address" :placeholder="isDetail ? '' : '请输入详情住址'" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="入党日期：" v-if="dataOptions.political == '预备党员' || dataOptions.political == '共产党员'">
                                <el-date-picker v-model="dataOptions.joinPartyTime" style="width: 100%" type="date" placeholder="请选择" :disabled="isDetail"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" v-if="dataOptions.veterans == 1">
                        <el-col :span="7">
                            <el-form-item label="服役部队级别：">
                                <el-input maxlength="20" v-model.trim="dataOptions.troopLevel" :placeholder="isDetail ? '' : '请输入服役部队级别'" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="入伍日期：">
                                <el-date-picker v-model="dataOptions.enlistedTime" style="width: 100%" type="date" placeholder="请选择" :disabled="isDetail"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="转业日期：">
                                <el-date-picker v-model="dataOptions.demobilizedTime" style="width: 100%" type="date" placeholder="请选择" :disabled="isDetail"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <!-- 职务配置 -->
            <div>
                <div class="title">
                    <span>职务配置</span>
                    <el-button v-if="!isDetail" type="primary" @click="addData(1)" icon="el-icon-circle-plus" class="addBtn">添加职务</el-button>
                </div>
                <div class="tableList">
                    <el-table :data="dataOptions.dutiesList" style="width: 100%" :border="true" :header-cell-style="tableHeaderStyle">
                        <el-table-column label="任职职务(身兼多职可添加职务)">
                            <template slot-scope="scope">
                                <span v-if="isDetail">{{ scope.row.orgDutiesName }}</span>

                                <el-select v-else v-model="scope.row.orgDutiesId" placeholder="请选择">
                                    <el-option
                                        v-for="item in dutyList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                        :disabled="dataOptions.dutiesList.some(val => val.orgDutiesId === item.id)"
                                    ></el-option>
                                </el-select>
                            </template>
                        </el-table-column>

                        <el-table-column label="任命时间">
                            <template slot-scope="scope">
                                <span v-if="isDetail">{{ scope.row.dutiesTime }}</span>

                                <el-date-picker v-else v-model="scope.row.dutiesTime" style="width: 100%" type="date" placeholder="请选择"></el-date-picker>
                            </template>
                        </el-table-column>

                        <el-table-column label="职务类型">
                            <template slot-scope="scope">
                                <span v-if="isDetail">{{ scope.row.orgDutiesType == 1 ? '主职' : scope.row.orgDutiesType == 2 ? '兼任' : '' }}</span>

                                <el-select v-else v-model="scope.row.orgDutiesType" placeholder="请选择职务类型">
                                    <el-option label="主职" :value="1" :disabled="dataOptions.dutiesList.some(val => val.orgDutiesType === 1)"></el-option>
                                    <el-option label="兼任" :value="2"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>

                        <el-table-column fixed="right" label="操作" v-if="!isDetail">
                            <template slot-scope="scope">
                                <el-button v-if="scope.$index !== 0" @click="deleData(1, scope.$index)" type="text" style="color: #f05259">删除</el-button>
                                <div v-else>-</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>

            <!-- 工作经历 -->
            <div style="margin-bottom: 22px">
                <div class="title">
                    <span>工作经历</span>
                    <el-button v-if="!isDetail" type="primary" @click="addData(2)" icon="el-icon-circle-plus" class="addBtn">添加工作经历</el-button>
                </div>
                <div class="familyBox" v-for="(item, index) in dataOptions.jobList" :key="index">
                    <el-form :class="isDetail ? 'jobBoxLight' : 'jobBox'" label-position="right" label-width="8rem" :model="item">
                        <el-row type="flex" justify="space-between">
                            <el-col :span="7">
                                <el-form-item label="工作单位：">
                                    <el-input maxlength="50" v-model.trim="item.company" :placeholder="isDetail ? '' : '请输入工作单位'" :disabled="isDetail"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item label="担任职务：">
                                    <el-input maxlength="20" v-model.trim="item.position" :placeholder="isDetail ? '' : '请输入担任职务'" :disabled="isDetail"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item label="工作时间：">
                                    <el-date-picker
                                        style="width: 100%"
                                        v-model="item.workingTime"
                                        type="daterange"
                                        range-separator="至"
                                        :start-placeholder="isDetail ? '' : '开始日期'"
                                        :end-placeholder="isDetail ? '' : '结束日期'"
                                        :disabled="isDetail"
                                    ></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex">
                            <el-col :span="24">
                                <el-form-item label="工作内容：">
                                    <el-input
                                        type="textarea"
                                        v-model.trim="item.content"
                                        maxlength="500"
                                        rows="5"
                                        show-word-limit
                                        :placeholder="isDetail ? '' : '请输入工作内容'"
                                        :disabled="isDetail"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div v-if="!isDetail && index !== 0" class="deleteJob" @click="deleData(2, index)">删除</div>
                </div>
            </div>

            <!-- 家庭成员 -->
            <div :class="isDetail ? 'family' : ''">
                <div class="title">
                    <span>家庭成员</span>
                    <el-button v-if="!isDetail" type="primary" @click="addData(3)" icon="el-icon-circle-plus" class="addBtn">添加家庭成员</el-button>
                </div>
                <div class="tableList">
                    <el-table :data="dataOptions.familyList" style="width: 100%" :border="true" :header-cell-style="tableHeaderStyle">
                        <el-table-column label="姓名">
                            <template slot-scope="scope">
                                <span v-if="isDetail">{{ scope.row.name }}</span>

                                <el-input maxlength="20" v-else v-model.trim="scope.row.name" placeholder="请输入家庭成员姓名"></el-input>
                            </template>
                        </el-table-column>

                        <el-table-column label="关系">
                            <template slot-scope="scope">
                                <span v-if="isDetail">{{ scope.row.position }}</span>

                                <el-input maxlength="20" v-else v-model.trim="scope.row.position" placeholder="请输入关系"></el-input>
                            </template>
                        </el-table-column>

                        <el-table-column label="联系方式">
                            <template slot-scope="scope">
                                <span v-if="isDetail">{{ scope.row.contact }}</span>

                                <el-input maxlength="11" v-else v-model.trim="scope.row.contact" placeholder="请输入联系方式"></el-input>
                            </template>
                        </el-table-column>

                        <el-table-column fixed="right" label="操作" v-if="!isDetail">
                            <template slot-scope="scope">
                                <el-button v-if="scope.$index !== 0" @click="deleData(3, scope.$index)" type="text" style="color: #f05259">删除</el-button>
                                <div v-else>-</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>

            <!-- 附件资料 -->
            <div>
                <div class="title">
                    <div>
                        <span>附件资料</span>
                        <span class="signTips">(请上传jpg、png格式照片，大小不超过10M)</span>
                    </div>
                </div>
                <div class="picBox">
                    <div class="picMiniBox" v-for="(item, index) in isDetail ? picUrlList : attachmentList" :key="index">
                        <ws-image-upload
                            :key="index"
                            :beforeUpdate="beforeUpdate(item)"
                            ref="imageUpload"
                            :urlList="getUrlList(item)"
                            localPreview
                            :inputReadyOnly="isDetail"
                            :isDelete="!isDetail"
                            v-bind="options"
                        />
                        <div>{{ item.name }}</div>
                    </div>
                </div>
            </div>

            <!-- 记录信息 -->
            <div v-if="isDetail" style="margin-bottom: 20px">
                <div class="title">
                    <span>记录信息</span>
                </div>

                <RecordInfo v-if="recordInfo.recordId" :recordInfo="recordInfo"></RecordInfo>
            </div>

            <div class="btnBox">
                <el-button :loading="btnLoading" class="backBtn" @click="cancel()">返回</el-button>
                <el-button :loading="btnLoading" v-if="!isDetail" style="width: 160px" type="primary" @click="submitForm()">保存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import RecordInfo from '@/components/RecordInfo/RecordInfo.vue';
import organizationOptions from '../components/Organization/organization-options.vue';
import { mapState, mapActions } from 'vuex';
export default {
    components: { RecordInfo, organizationOptions },
    data() {
        return {
            tableHeaderStyle: {
                background: '#F5F7FA',
                'font-size': '14px',
                'font-family': 'PingFangSC-Medium, PingFang SC',
                'font-weight': '500',
                color: '#606266'
            },
            btnLoading: false,
            dutyList: [],
            dataOptions: {
                avage: '',
                name: '',
                phone: '',
                age: '',
                veterans: 0,
                orgType: '',
                dutiesList: [{}],
                jobList: [{}],
                familyList: [{}],
                picInfo: {},
                area: []
            },
            recordInfo: {},
            rules: {
                orgType: [
                    {
                        required: true,
                        message: '请选择机构类型',
                        trigger: 'blur'
                    }
                ],
                orgId: [
                    {
                        required: true,
                        message: '请选择任职机构',
                        trigger: 'blur'
                    }
                ],
                name: [
                    {
                        required: true,
                        message: '请输入人员姓名',
                        trigger: 'blur'
                    }
                ],
                phone: [
                    {
                        required: true,
                        message: '请输入联系电话',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                        message: '请输入正确的电话号码',
                        trigger: 'blur'
                    }
                ],
                joinWanshunTime: [
                    {
                        required: true,
                        message: '请选择加入万顺日期',
                        trigger: 'blur'
                    }
                ],
                idNumber: [
                    {
                        required: true,
                        message: '请输入身份证号码',
                        trigger: 'blur'
                    }
                ],
                birthDate: [
                    {
                        required: true,
                        message: '请选择出生日期',
                        trigger: 'blur'
                    }
                ],
                political: [
                    {
                        required: true,
                        message: '请选择政治面貌',
                        trigger: 'blur'
                    }
                ],
                veterans: [
                    {
                        required: true,
                        message: '请选择是否退伍军人',
                        trigger: 'blur'
                    }
                ]
            },
            sexList: [
                { id: 0, value: '女' },
                { id: 1, value: '男' },
                { id: 2, value: '保密' }
            ],
            marryList: [
                { id: 0, value: '未婚' },
                { id: 1, value: '已婚' },
                { id: 2, value: '离异' },
                { id: 3, value: '丧偶' },
                { id: 4, value: '未知' }
            ],
            studyList: [
                { id: 0, value: '未知' },
                { id: 1, value: '小学' },
                { id: 2, value: '初中' },
                { id: 3, value: '高中' },
                { id: 4, value: '中专' },
                { id: 5, value: '大专' },
                { id: 6, value: '本科' },
                { id: 8, value: '硕士' },
                { id: 9, value: '博士' }
            ],
            politicsList: ['群众', '共青团员', '预备党员', '共产党员'],
            soldierList: [
                { id: 0, value: '否' },
                { id: 1, value: '是' }
            ],
            statusList: [
                { id: 1, value: '在职' },
                { id: 2, value: '离职' }
            ],
            attachmentList: [],
            picUrlList: [],
            options: {
                quantity: 1,
                actions: {
                    url: '/authority/orgFile/upload', //上传地址，优先级高于moduleName
                    op: 'upload' //上传op，优先级高于moduleName
                },
                afterUpload: () => [],
                handleRemove: this.handleRemove
            },
            moduleName: '/personalCenter/personMgr',
            isDetail: false,
            showBirthDate: true
        };
    },
    watch: {
        'dataOptions.orgType': {
            handler: function (val) {
                if (val == 402) {
                    this.getAttachmentNameList({ attachmentType: 101 }).then(res => {
                        this.attachmentList = res;
                    });
                } else {
                    this.getAttachmentNameList({ attachmentType: 100 }).then(res => {
                        this.attachmentList = res;
                    });
                }
            },
            immediate: true
        }
    },
    computed: {
        ...mapState('personalCenter', ['orgTypeFilters'])
    },
    mounted() {
        if (this.$route.query.id) {
            this.getData();
        }
        if (this.$route.query.type == 'detail') {
            this.isDetail = true;
        }
        this.getAttachmentNameList({ attachmentType: 100 }).then(res => {
            this.attachmentList = res;
        });
    },
    methods: {
        ...mapActions('personalCenter', ['getAttachmentNameList']),
        addBornTime() {
            this.dataOptions.birthDate = '';
            let idNumber = this.dataOptions.idNumber;
            if (idNumber && idNumber.length == 15) {
                this.dataOptions.birthDate = idNumber.substr(4, 4) + '-' + idNumber.substr(8, 2) + '-' + idNumber.substr(10, 2);
            } else if (idNumber && idNumber.length == 18) {
                this.dataOptions.birthDate = idNumber.substr(6, 4) + '-' + idNumber.substr(10, 2) + '-' + idNumber.substr(12, 2);
            }
            this.reload();
        },
        clearOrg(orgType) {
            this.dataOptions.orgId = '';
            this.$refs.org && this.$refs.org.changeOrg();
            this.dataOptions.dutiesList = [{}];
            this.getDuty(orgType);
        },
        //根据机构类型获取职务列表
        getDuty(orgType) {
            if (!orgType) {
                this.dutyList = [];
                return;
            }
            let data = {
                data: JSON.stringify({ orgType }),
                op: 'orgDuties'
            };
            return this.$axios('/authority/personalCenter/select', data).then(res => {
                this.dutyList = JSON.parse(res.data);
            });
        },
        //添加
        addData(type) {
            switch (type) {
                case 1:
                    for (let data of this.dataOptions.dutiesList) {
                        if (!data.orgDutiesId || !data.dutiesTime || !data.orgDutiesType) {
                            this.$message.error('请填写完整再添加！');
                            return;
                        }
                    }
                    this.dataOptions.dutiesList.push({});
                    break;
                case 2:
                    for (let data of this.dataOptions.jobList) {
                        if (!data.company || !data.position || !data.workingTime || !data.content) {
                            this.$message.error('请填写完整再添加！');
                            return;
                        }
                    }
                    this.dataOptions.jobList.push({});
                    break;
                case 3:
                    for (let data of this.dataOptions.familyList) {
                        if (!data.name || !data.position || !data.contact) {
                            this.$message.error('请填写完整再添加！');
                            return;
                        }
                    }
                    this.dataOptions.familyList.push({});
                    break;
                default:
                    break;
            }
        },
        //删除
        deleData(type, index) {
            const fieldArr = ['dutiesList', 'jobList', 'familyList'];
            this.dataOptions[fieldArr[type - 1]].splice(index, 1);
        },
        reload() {
            this.showBirthDate = false;
            this.$nextTick(() => (this.showBirthDate = true));
        },
        //获取人员信息
        getData() {
            let data = {
                data: JSON.stringify({ id: this.$route.query.id }),
                op: 'orgEmployDetail'
            };
            let URL = this.getModuleUrl('orgEmployDetail');
            this.$axios(URL, data).then(res => {
                this.dataOptions = JSON.parse(res.data);
                this.dataOptions.area = [];
                const { dutiesList, jobList, familyList } = this.dataOptions;
                this.getDuty(this.dataOptions.orgType).then(_ => {
                    let dutyIds = this.dutyList.map(item => item.id);
                    dutiesList.forEach(item => {
                        if (!dutyIds.includes(item.orgDutiesId)) {
                            item.id = item.orgDutiesId;
                            item.orgDutiesId = item.orgDutiesName;
                        }
                    });
                });

                this.recordInfo = {
                    recordId: this.dataOptions.id,
                    orgType: 100,
                    infoType: 1
                };
                this.dataOptions.attachmentInfoVoList = this.dataOptions.attachmentInfoVoList || [];
                this.picUrlList = this.dataOptions.attachmentInfoVoList;
                this.dataOptions.provinceCode && this.dataOptions.area.push(this.dataOptions.provinceCode);
                this.dataOptions.cityCode && this.dataOptions.area.push(this.dataOptions.cityCode);
                this.dataOptions.areaCode && this.dataOptions.area.push(this.dataOptions.areaCode);
                if (this.$route.query.type !== 'add') {
                    this.$nextTick(() => {
                        this.$refs.org.remoteMethod(this.dataOptions.orgName);
                    });
                }

                !dutiesList.length && this.addData(1);
                !jobList.length && this.addData(2);
                !familyList.length && this.addData(3);
                this.dataOptions.jobList.forEach(item => {
                    if (item.workingEnd === '至今') {
                        item.workingEnd = this.$baseMethod.formatData(new Date(), 'yyyy-MM-dd');
                    }
                    this.$set(item, 'workingTime', [item.workingStart || '', item.workingEnd || '']);
                });
            });
        },
        getUrlList(item) {
            if (this.isDetail) {
                let url = item.waterMarkImageUrl || item.imgUrl;
                return [url];
            }
            if (this.picUrlList) {
                let list = this.picUrlList.filter(o => item.id == o.attachmentTypeID) || [];
                if (list.length) {
                    let url = list[0].waterMarkImageUrl || list[0].imgUrl;
                    return [url];
                }
                return [];
            }
        },
        beforeUpdate(item) {
            return () => {
                return {
                    attachmentTypeID: item.id || null,
                    id: item.id || null,
                    ifAudit: 1,
                    orgID: this.backData ? this.backData.id : this.dataOptions.id,
                    orgType: 100,
                    processId: this.backData ? this.backData.processId : this.dataOptions.processId
                };
            };
        },
        cancel() {
            this.$router.refresh({ name: 'personalCenter', params: { activeName: 'personMgr' } });
        },
        //检测是否填写
        checkBsNullValue() {
            let data = {
                orgType: '机构类型',
                orgId: '任职机构',
                name: '姓名',
                phone: '联系电话',
                joinWanshunTime: '加入万顺日期',
                idNumber: '身份证号码',
                birthDate: '出生日期',
                political: '政治面貌',
                veterans: '是否退役军人'
            };
            let res = true;
            let nameList = ['orgType', 'orgId', 'name', 'phone', 'joinWanshunTime', 'idNumber', 'birthDate', 'political', 'veterans'];
            nameList.every(item => {
                if (!this.dataOptions[item] && this.dataOptions[item] !== 0) {
                    this.$message.error(`基础资料${data[item]}不能为空`);
                    res = false;
                    return false;
                } else {
                    return true;
                }
            });
            for (let data of this.dataOptions.dutiesList) {
                if (!data.orgDutiesId || !data.dutiesTime || !data.orgDutiesType) {
                    this.$message.error('请完善职务配置！');
                    return false;
                }
            }
            let orgDutiesTypeNum = 0;
            for (let data of this.dataOptions.dutiesList) {
                if (data.orgDutiesType == 1) {
                    orgDutiesTypeNum = orgDutiesTypeNum + 1;
                }
            }
            if (orgDutiesTypeNum == 0 && this.$route.query.type == 'add') {
                this.$message.error('职务类型必须有一条主职！');
                return false;
            }
            return res;
        },
        //提交
        submitForm() {
            if (!this.checkBsNullValue()) {
                return false;
            }
            let checkNullPic = this.$refs.imageUpload.filter(item => item.fileList.length == 0);
            // if (checkNullPic.length) {
            //     this.$message.error('请完善附件资料图片');
            //     return false;
            // }

            let successInfo;
            let op;

            this.dataOptions.jobList.forEach(item => {
                item.workingStart = item.workingTime && item.workingTime[0];
                item.workingEnd = item.workingTime && item.workingTime[1];
            });
            this.dataOptions.dutiesList.forEach(item => {
                if (typeof item.dutiesTime == 'object') {
                    item.dutiesTime = this.changeTime(item.dutiesTime);
                }
            });
            if (this.$route.query.type == 'add') {
                successInfo = '新增成功';
                op = 'saveOrgEmploy';
            } else {
                successInfo = '修改成功';
                op = 'updateOrgEmploy';
            }
            let data = {
                data: JSON.stringify({
                    ...this.dataOptions,
                    provinceCode: this.dataOptions.area && this.dataOptions.area[0],
                    cityCode: this.dataOptions.area && this.dataOptions.area[1],
                    areaCode: this.dataOptions.area && this.dataOptions.area[2]
                }),
                op: op
            };
            let URL = this.getModuleUrl(data.op);

            this.$refs['basicInfo'].validate(valid => {
                if (valid) {
                    this.btnLoading = true;
                    this.$axios(URL, data)
                        .then(res => {
                            this.btnLoading = false;
                            this.backData = JSON.parse(res.data);
                            this.$message.success(successInfo);

                            this.$refs.imageUpload.map(item => {
                                item.multipleUploadImage();
                            });
                            this.$router.refresh({ name: 'personalCenter', params: { activeName: 'personMgr' } });
                        })
                        .catch(() => {
                            this.btnLoading = false;
                        });
                }
            });
        },
        changeTime(data) {
            const resDate = data.getFullYear() + '-' + this.p(data.getMonth() + 1) + '-' + this.p(data.getDate());
            return resDate;
        },
        p(s) {
            return s < 10 ? '0' + s : s;
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    }
};
</script>

<style lang="scss" scoped>
.Fapply-box {
    padding: 32px 40px;
    width: 100%;
    background: #ffffff;
    border-radius: 8px;
}
.peoInfo {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    .name {
        font-size: 28px;
        color: #303133;
        margin: 12px 0;
    }
    .info {
        font-size: 15px;
        color: #606266;
    }
}

.avator {
    width: 124px;
    height: 124px;
    border-radius: 50%;
}
.title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 16px;
    height: 40px;
    font-weight: 600;
    .signTips {
        font-size: 15px;
        color: #f56c6c;
        font-weight: 500;
        margin-left: 5px;
    }
}
.el-select {
    width: 100%;
}
.addBtn {
    background: #ffffff;
    color: #f05259;
}
.btnBox {
    position: fixed;
    bottom: 0;
    left: 0;
    width: calc(100% + 166px);
    height: 64px;
    background: #ffffff;
    box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.04);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    .backBtn {
        width: 160px;
        margin-right: 16px;
    }
}

.picBox {
    display: flex;
    margin-bottom: 40px;
    color: #606266;
    flex-wrap: wrap;
}
.picMiniBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 40px;
    div {
        margin-top: 5px;
    }
}
.tableList {
    margin-bottom: 22px;
}
.jobBox {
    background: #f5f7fa;
    border-radius: 8px;
    border: 1px solid #dcdfe6;
    padding: 24px 24px 0 0;
}
.jobBoxLight {
    background: #ffffff;
    border-radius: 8px;
    border: 1px solid #dcdfe6;
    padding: 24px 24px 0 0;
}
.deleteJob {
    color: #f05259;
    margin: 8px 0;
    text-align: end;
    cursor: pointer;
}
.familyBox:nth-child(2) {
    margin-bottom: 35px;
}
/deep/ .el-dialog .el-dialog__body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
/deep/ label {
    font-weight: 400 !important;
}
/deep/ .el-textarea.is-disabled {
    .el-textarea__inner {
        color: #606266;
        cursor: auto;
    }
}
.ws-city,
.ws-organization-options,
.el-select {
    width: 100%;
}
/deep/ .el-cascader {
    width: 100%;
}
/deep/ .el-select {
    width: 100%;
}
/deep/ .el-form-item {
    margin-bottom: 20px;
}
/deep/ .el-textarea.is-disabled {
    .el-textarea__inner {
        color: #606266;
    }
}
/deep/ .el-range-editor.is-disabled {
    input,
    .el-range-separator {
        color: #606266;
    }
}
/deep/ .el-table {
    border-radius: 8px;
}
/deep/ .family .el-table .cell {
    height: 23px;
}
</style>
