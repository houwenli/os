<template>
    <!-- 花名册详情 -->
    <div class="form-wrap">
        <div class="fee-info">
            <el-form :model="baseInfo" label-width="120px" class="ruleForm">
                <div class="title" style="margin-top: 1px">
                    <span>基本信息</span>
                </div>
                <div class="detail">
                    <el-row :gutter="40">
                        <el-col :span="8">
                            <el-form-item label="姓名：">
                                <el-input readonly v-model="baseInfo.personBasicInfoVo.name" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="司龄(天)：">
                                <el-input readonly v-model="baseInfo.personBasicInfoVo.workingDays" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="员工ID ：">
                                <el-input readonly v-model="baseInfo.personBasicInfoVo.id" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="工号：">
                                <el-input readonly v-model="baseInfo.personBasicInfoVo.jobNumber" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="手机号：">
                                <el-input readonly v-model="baseInfo.personBasicInfoVo.phone" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="办公地点：">
                                <el-input readonly v-model="baseInfo.personBasicInfoVo.officeAddress" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="员工类型：">
                                <el-input readonly v-model="baseInfo.personBasicInfoVo.employeeTypeName" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="员工状态：">
                                <el-input readonly v-model="baseInfo.personBasicInfoVo.employeeStatusName" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="直属上级：">
                                <el-input readonly v-model="baseInfo.personBasicInfoVo.directSupervisor" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="导师：">
                                <el-input readonly v-model="baseInfo.personBasicInfoVo.tutorName" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="title titleTop">
                    <span>个人信息</span>
                </div>
                <div class="detail">
                    <el-row :gutter="40">
                        <el-col :span="8">
                            <el-form-item label="身份证号码：">
                                <el-input readonly v-model="baseInfo.personalInfoVo.identityCard" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="籍贯：">
                                <el-input readonly v-model="baseInfo.personalInfoVo.nativePlace" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="出生日期：">
                                <el-input readonly v-model="baseInfo.personalInfoVo.birthdayStr" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="性别：">
                                <el-input readonly v-model="baseInfo.personalInfoVo.sexName" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="生日月份：">
                                <el-input readonly v-model="baseInfo.personalInfoVo.birthdayMonth" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="年龄：">
                                <el-input readonly v-model="baseInfo.personalInfoVo.age" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="身份证住址：">
                                <el-input readonly v-model="baseInfo.personalInfoVo.identityCardAddress" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="民族：">
                                <el-input readonly v-model="baseInfo.personalInfoVo.nation" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="目前住址：">
                                <el-input readonly v-model="baseInfo.personalInfoVo.currentAddress" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="户口类型：">
                                <el-input readonly v-model="baseInfo.personalInfoVo.registeredResidenceTypeName" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="婚姻状况：">
                                <el-input readonly v-model="baseInfo.personalInfoVo.maritalStatusName" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="生育状况：">
                                <el-input readonly v-model="baseInfo.personalInfoVo.fertilityStatusName" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="个人邮箱：">
                                <el-input readonly v-model="baseInfo.personalInfoVo.email" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="政治面貌：">
                                <el-input readonly v-model="baseInfo.personalInfoVo.politicalTypeName" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8"  v-if="baseInfo.personalInfoVo.politicalType=='4'">
                            <el-form-item label="入党时间：">
                                <el-input readonly v-model="baseInfo.personalInfoVo.joinPartyDateStr" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="title titleTop">
                    <span>教育经历</span>
                </div>
                <div class="detail table-detail">
                    <ws-table-el ref="table1" v-bind="tableConfig1" style="padding: 0 !important">
                        <template>
                            <ws-table-column-el prop="educationName" align="left" label="学历"></ws-table-column-el>
                            <ws-table-column-el prop="schoolName" align="left" label="毕业院校"></ws-table-column-el>
                            <ws-table-column-el prop="major" align="left" label="专业"></ws-table-column-el>
                            <ws-table-column-el prop="educationalModeName" align="left" label="教育方式"></ws-table-column-el>
                            <ws-table-column-el align="left" label="起止年月">
                                <template slot-scope="scope">
                                    <p>{{ scope.row.startTimeStr.substring(0, 7) }}~{{ scope.row.endTimeStr.substring(0, 7) }}</p>
                                </template>
                            </ws-table-column-el>
                            <ws-table-column-el prop="firstDegreeName" align="left" label="是否最高学历"></ws-table-column-el>
                        </template>
                    </ws-table-el>
                </div>
                <div class="title">
                    <span>银行卡信息</span>
                </div>
                <div class="detail">
                    <el-row :gutter="40">
                        <el-col :span="8">
                            <el-form-item label="银行卡卡号：">
                                <el-input v-model="baseInfo.bankCardInfoVo.bankCardNumber" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="bankName" label="银行名称：">
                                <el-input v-model="baseInfo.bankCardInfoVo.bankName" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="bankBranchName" label="分行名称：">
                                <el-input v-model.trim="baseInfo.bankCardInfoVo.bankBranchName" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="bankSubBranchName" label="支行名称：">
                                <el-input v-model.trim="baseInfo.bankCardInfoVo.bankSubBranchName" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="title titleTop">
                    <span>职位信息</span>
                </div>
                <div class="detail table-detail">
                    <ws-table-el ref="table2" v-bind="tableConfig2" style="padding: 0 !important">
                        <template>
                            <ws-table-column-el prop="departmentTypeName" align="left" label="组织架构类型" width="200"></ws-table-column-el>
                            <ws-table-column-el prop="deptName" align="left" label="部门">
                                <!-- deptFullName -->
                                <template slot-scope="scope">
                                    <el-popover width="400" trigger="click" :content="scope.row.deptFullName" placement="top">
                                        <span slot="reference" style='text-decoration:underline'>{{ scope.row.deptName }}</span>
                                    </el-popover>
                                </template>
                            </ws-table-column-el>
                            <ws-table-column-el prop="positionName" align="left" label="职位"></ws-table-column-el>
                            <ws-table-column-el prop="positionTypeName" align="left" label="职位类型" width="200">
                                <template slot-scope="scope">
                                    <span class="mainPosition" v-if="scope.row.positionTypeName == '主职'">{{ scope.row.positionTypeName }}</span>
                                    <span v-else>{{ scope.row.positionTypeName }}</span>
                                </template>
                            </ws-table-column-el>
                        </template>
                    </ws-table-el>
                </div>
                <div class="title">
                    <span>合同信息</span>
                </div>
                <div class="detail table-detail">
                    <ws-table-el ref="table3" v-bind="tableConfig3" style="padding: 0 !important">
                        <template>
                            <ws-table-column-el prop="companyName" align="left" label="合同公司"></ws-table-column-el>
                            <ws-table-column-el prop="contractTypeName" align="left" label="合同类型"></ws-table-column-el>
                            <ws-table-column-el prop="startTime" align="left" label="合同开始日期"></ws-table-column-el>
                            <ws-table-column-el prop="endTime" align="left" label="合同到期日期"></ws-table-column-el>
                        </template>
                    </ws-table-el>
                </div>
                <div class="title">
                    <span>紧急联系人信息</span>
                </div>
                <div class="detail table-detail">
                    <ws-table-el ref="table4" v-bind="tableConfig4" style="padding: 0 !important">
                        <template>
                            <ws-table-column-el prop="name" align="left" label="姓名"></ws-table-column-el>
                            <ws-table-column-el prop="relation" align="left" label="关系"></ws-table-column-el>
                            <ws-table-column-el prop="phone" align="left" label="联系电话"></ws-table-column-el>
                        </template>
                    </ws-table-el>
                </div>
                <div class="title">
                    <span>工作经历</span>
                </div>
                <div class="detail table-detail">
                    <ws-table-el ref="table5" v-bind="tableConfig5" style="padding: 0 !important">
                        <template>
                            <ws-table-column-el prop="companyName" align="left" label="公司名称"></ws-table-column-el>
                            <ws-table-column-el prop="startAndEndTime" align="left" label="起止年月" width="200px">
                                <template slot-scope="scope">
                                    <p>{{ scope.row.startTimeStr.substring(0, 7) }}~{{ scope.row.endTimeStr.substring(0, 7) }}</p>
                                </template>
                            </ws-table-column-el>
                            <ws-table-column-el prop="departmentName" align="left" label="部门"></ws-table-column-el>
                            <ws-table-column-el prop="positionName" align="left" label="职位"></ws-table-column-el>
                            <ws-table-column-el prop="witness" align="left" label="证明人姓名"></ws-table-column-el>
                            <ws-table-column-el prop="witnessPhone" align="left" label="证明人联系电话"></ws-table-column-el>
                        </template>
                    </ws-table-el>
                </div>
                <div class="title">
                    <span>家庭成员</span>
                </div>
                <div class="detail table-detail">
                    <ws-table-el ref="table6" v-bind="tableConfig6" style="padding: 0 !important">
                        <template>
                            <ws-table-column-el prop="name" align="left" label="姓名"></ws-table-column-el>
                            <ws-table-column-el prop="relation" align="left" label="关系"></ws-table-column-el>
                            <ws-table-column-el prop="age" align="left" label="年龄"></ws-table-column-el>
                            <ws-table-column-el prop="companyName" align="left" label="工作单位"></ws-table-column-el>
                            <ws-table-column-el prop="positionName" align="left" label="职务"></ws-table-column-el>
                            <ws-table-column-el prop="phone" align="left" label="联系电话"></ws-table-column-el>
                        </template>
                    </ws-table-el>
                </div>
                <div class="title">
                    <span>退役信息</span>
                </div>
                <div class="detail">
                    <el-row :gutter="40">
                        <el-col :span="8">
                            <el-form-item label="是否为军人：">
                                <el-input readonly v-model="baseInfo.veteransInfoVo.veteransStatusName" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-if="baseInfo.veteransInfoVo.veteransStatusName == '是'">
                            <el-form-item label="服役部队级别：">
                                <el-input readonly v-model="baseInfo.veteransInfoVo.veteransForceLevel" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-if="baseInfo.veteransInfoVo.veteransStatusName == '是'">
                            <el-form-item label="入伍日期：" prop="enlistDate">
                                <el-input readonly v-model="baseInfo.veteransInfoVo.enlistDateStr" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-if="baseInfo.veteransInfoVo.veteransStatusName == '是'">
                            <el-form-item label="转业日期：" prop="transferDate">
                                <el-input readonly v-model="baseInfo.veteransInfoVo.transferDateStr" style="width: 100%" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="title titleTop">
                    <span>图片信息</span>
                </div>
                <div class="detail">
                    <div class="img-list">
                        <div v-for="(img, index) in srcList" :key="index">
                            <img width="100px" height="100px" :src="img" @click="onPreview(index)" />
                            <p>{{ nameList[index] }}</p>
                        </div>
                    </div>
                    <ws-image-viewer :visible.sync="visible" :src-list="srcList" :currentIndex="currentIndex" />
                    <div class="empty_text" v-show="!srcList.length">
                        <img src="../../../assets/images/default-table-content.png" alt />
                        <p>暂无数据</p>
                    </div>
                </div>
                <div class="title">
                    <span>附件信息</span>
                </div>
                <div class="detail">
                    <MyUpload ref="uploadFile" :fileList="baseInfo.fileInfoVoList" :isUpload="false" pageType="detail" :isShowDelete="false"></MyUpload>
                    <div class="empty_text" v-show="!baseInfo.fileInfoVoList.length">
                        <img src="../../../assets/images/default-table-content.png" alt />
                        <p>暂无数据</p>
                    </div>
                </div>

                <div class="title">
                    <p>异动轨迹</p>
                </div>
                <div class="detail">
                    <el-timeline>
                        <el-timeline-item v-for="(item, index) in timeData" :key="index" color="#f05259">
                            <div class="timestamp">
                                {{ item.time }}
                            </div>
                            <div class="nodeName">
                                {{ item.nodeName }}
                            </div>
                            <div class="card" v-for="(otem, oindex) in item.list" :key="oindex">
                                <div class="card-item">
                                    <span class="tagAdd" v-if="otem.typeName == '新增'">新增</span>
                                    <span class="tagAdd" v-if="otem.typeName == '设为主职'">设为主职</span>
                                    <span class="tagDelete" v-if="otem.typeName == '删除'">删除</span>
                                    <p>组织架构类型：{{ otem.departmentType }}</p>
                                    <p>职位类型：{{ otem.positionType }}</p>
                                    <p>机构：{{ otem.departmentName }}</p>
                                    <p>职位：{{ otem.positionName }}</p>
                                    <p v-show="otem.abandonReason">放弃原因：{{ otem.abandonReason }}</p>
                                    <p v-show="otem.reasonType">原因类型：{{ otem.reasonType }}</p>
                                    <!-- <p v-show="otem.remark">备注：{{ otem.remark }}</p> -->
                                    <p class="dealname">经办人：{{ otem.dealName }}</p>
                                </div>
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                    <p style="padding-left: 166px; margin-top: -60px" v-if="baseInfo.moveTrajectoryVoList.length > 0">
                        <el-button type="text" v-show="showAll && baseInfo.moveTrajectoryVoList.length > 5" @click="showAll = !showAll">
                            查看全部轨迹
                            <i class="el-icon-arrow-down"></i>
                        </el-button>
                        <el-button type="text" v-show="!showAll && baseInfo.moveTrajectoryVoList.length > 5" @click="showAll = !showAll">
                            收起
                            <i class="el-icon-arrow-up"></i>
                        </el-button>
                    </p>
                    <div class="empty_text" v-show="!baseInfo.moveTrajectoryVoList.length">
                        <img src="../../../assets/images/default-table-content.png" alt />
                        <p>暂无数据</p>
                    </div>
                </div>
                <div class="title">
                    <span>操作日志</span>
                </div>
                <div class="detail table-detail">
                    <ws-table-el ref="table7" v-bind="tableConfig7" style="padding: 0 !important" class="czTable">
                        <template>
                            <ws-table-column-el prop="jobNumber" align="left" label="操作人工号"></ws-table-column-el>
                            <ws-table-column-el prop="operateName" align="left" label="操作人姓名"></ws-table-column-el>
                            <ws-table-column-el prop="operateTypeName" align="left" label="操作类型"></ws-table-column-el>
                            <ws-table-column-el prop="createTime" align="left" label="操作时间"></ws-table-column-el>
                        </template>
                    </ws-table-el>
                </div>
            </el-form>
        </div>
        <section class="btnBox">
            <el-button class="backBtn" @click="back">返回</el-button>
            <el-button class="backBtn" type="primary" @click="getEdit">修改</el-button>
        </section>
    </div>
</template>

<script>
import MyUpload from './components/myUpload';
export default {
    components: {
        MyUpload
    },
    data() {
        return {
            moduleName: '/personalCenter/personMat',
            picture: {
                localPreview: true,
                quantity: 5,
                actions: {
                    url: '/intelligentPersonnel/personDocument/select', //上传地址，优先级高于moduleName
                    // moduleName: '',      //可根据模块名和op自动匹配上传地址，url和moduleName 择二选一
                    op: 'selectPictureInfo' //上传op，优先级高于moduleName
                },
                beforeUpdate: this.beforeUpdate,
                afterUpload: this.afterUpload
            },
            baseInfo: {
                personBasicInfoVo: {},
                ersonBasicInfoVo: {},
                personalInfoVo: {},
                educationInfoVoList: {},
                bankCardInfoVo: {},
                emergencyContactInfoVoList: {},
                jobInfoVoList: {},
                familyInfoVoList: {},
                veteransInfoVo: {},
                fileInfoVoList: [],
                moveTrajectoryVoList: {},
                veteransInfoVo: {},
                pictureInfoVoList: []
            },
            options: [],
            tableConfig1: {
                data: [],
                filterColumns: false,
                pagination: false,
                indexColumn: true,
                autoHeight: false,
                pageId: 'id'
            },
            tableConfig6: {
                data: [],
                filterColumns: false,
                pagination: false,
                indexColumn: true,
                autoHeight: false,
                pageId: 'id'
            },
            tableConfig2: {
                data: [],
                filterColumns: false,
                pagination: false,
                indexColumn: false,
                autoHeight: false,
                pageId: 'id'
            },
            tableConfig3: {
                data: [],
                filterColumns: false,
                pagination: false,
                indexColumn: false,
                autoHeight: false,
                pageId: 'id'
            },
            tableConfig4: {
                data: [],
                filterColumns: false,
                pagination: false,
                indexColumn: true,
                autoHeight: false,
                pageId: 'id'
            },
            tableConfig5: {
                data: [],
                filterColumns: false,
                pagination: false,
                indexColumn: true,
                autoHeight: false,
                pageId: 'id'
            },
            tableConfig7: {
                filterColumns: false,
                autoHeight: false,
                pageSizeList: ['5', '20', '50', '100'],
                pageId: 'id',
                lazyQuery: {
                    url: '/intelligentPersonnel/personDocument/select',
                    op: {
                        selectList: 'selectOpt',
                        selectCount: 'selectOptCount'
                    },
                    afterQuery: this.afterQuery,
                    beforeQuery: this.beforeQuery,
                    immediate: false
                }
            },
            searchOptions: {
                id: ''
            },
            fileList: [],
            visible: false,
            currentIndex: 0,
            srcList: [],
            nameList: [],
            showAll: true,
            timeData: []
        };
    },
    watch: {
        showAll: function (val) {
            if (val && this.baseInfo.moveTrajectoryVoList.length > 5) {
                this.timeData = this.baseInfo.moveTrajectoryVoList.slice(0, 5);
            } else {
                this.timeData = this.baseInfo.moveTrajectoryVoList;
            }
        }
    },
    created() {
        this.getPersonalInfo().then(res => {
            this.getDetails();
        });
    },
    mounted() {
        this.$nextTick(() => {
            let doms = document.getElementsByClassName('empty-table');
            for (let i = 0; i < doms.length; i++) {
                doms[i].style.height = '300px';
            }
        });
    },
    methods: {
        back() {
            this.$route.params.activeName = 'personInfo';
            this.$emit('getActiveName');
        },
        getPersonalInfo() {
            return new Promise(resolve => {
                const URL = '/authority/personalCenter/select';
                let opt = {
                    data: JSON.stringify({}),
                    op: 'selectPersonalInformation'
                };
                this.$axios(URL, opt)
                    .then(res => {
                        res.code === 1 && (this.searchOptions.id = JSON.parse(res.data).employeeId);
                        this.$refs.table7.search();
                        resolve();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
        },
        afterQuery(data) {
            return data || [];
        },
        beforeQuery() {
            return this.searchOptions;
        },
        getDetails() {
            let data = {
                id: this.searchOptions.id
            };
            this.$axios('/intelligentPersonnel/personDocument/select', { data: JSON.stringify(data), op: 'selectPersonDocumentInfo' })
                .then(res => {
                    this.baseInfo = JSON.parse(res.data);
                    this.tableConfig1.data = this.baseInfo.educationInfoVoList || [];
                    this.tableConfig2.data = this.baseInfo.positionInfoVoList || [];
                    this.tableConfig3.data = this.baseInfo.contractInfoVoList || [];
                    this.tableConfig4.data = this.baseInfo.emergencyContactInfoVoList || [];
                    this.tableConfig5.data = this.baseInfo.jobInfoVoList || [];
                    this.tableConfig6.data = this.baseInfo.familyInfoVoList || [];
                    if (this.baseInfo.pictureInfoVoList.length > 0) {
                        this.baseInfo.pictureInfoVoList.forEach(item => {
                            this.srcList.push(item.fileUrl);
                            this.nameList.push(item.fileName);
                        });
                    }
                    if (this.baseInfo.moveTrajectoryVoList.length > 5) {
                        this.timeData = this.baseInfo.moveTrajectoryVoList.slice(0, 5);
                    } else {
                        this.timeData = this.baseInfo.moveTrajectoryVoList;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        onPreview(index) {
            this.visible = true;
            this.currentIndex = index;
        },
        getEdit() {
            this.$router.push({ name: 'personMatEdit', query: { id:this.searchOptions.id } });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    }
};
</script>

<style lang="scss" scoped>
.form-wrap {
    background-color: #fff;
    padding-top: 2px;
    .fee-info {
        .title {
            width: 100%;
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            margin-top: 32px;
            margin-bottom: 16px;
            p {
                /deep/ .el-button--text {
                    float: right;
                }
            }
        }
        .titleTop{
            margin-top: 10px;
        }

        .detail {
            overflow: hidden;
            /deep/ .ws-table-warp {
                padding-top: 4px !important;
                padding-bottom: 0 !important;
                .pagination-warp {
                    padding-bottom: 0;
                    height: auto;
                }
            }
           .ws-table-warp{
                 /deep/.option-box {
                    margin: 0px !important;
                }
            }
            .inline-block {
                margin-right: 80px;
                margin-top: 30px;
                .label {
                    display: inline-block;
                    text-align: right;
                    margin-right: 15px;
                    min-width: 124px !important;
                    height: 40px;
                    line-height: 40px;
                }
                .text {
                    display: inline-block;
                    margin-right: 5px;
                    line-height: 40px;
                    word-wrap: break-word;
                }
            }
        }
    }
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
.set_btn {
    margin-top: 60px;
    text-align: center;

    .el-button {
        padding: 12px 65px;
    }
}
.flex-box {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
}
.search-left {
    width: calc(100% - 200px);
    position: relative;
}
.search-right {
    position: absolute;
    right: -200px;
    top: 0;
}
.el-timeline {
    margin-left: 120px;
    margin-bottom: 40px;
    .timestamp {
        position: absolute;
        left: -113px;
        top: 1px;
        width: 82px;
        line-height: 20px;
        text-align: right;
        color: #606266;
    }
    .card {
        padding: 6px 16px;
        line-height: 30px;
        width: 260px;
        background: #f5f7fa;
        border-radius: 8px;
        border: 1px solid #ebeef5;
        margin: 5px 32px 40px 0;
        display: inline-block;
        position: relative;
        .card-item {
            .tagAdd {
                position: absolute;
                right: 5px;
                top: 5px;
                padding: 0 4px;
                color: #2ac39b;
                background: #e1fef7;
                border-radius: 4px;
            }
            .tagDelete {
                position: absolute;
                right: 5px;
                top: 5px;
                padding: 0 4px;
                color: #f56c6c;
                background: #fef0f0;
                border-radius: 4px;
            }
            p {
                word-wrap: break-word;
                word-break: break-all;
                overflow: hidden;
            }
        }
    }
    .dealname {
        position: absolute;
        top: 100%;
        font-size: 14px;
        font-weight: 400;
        color: #606266;
    }
}
/deep/ .el-timeline-item__node--normal {
    width: 14px;
    height: 14px;
    left: 1px;
}
/deep/ .el-timeline-item__tail {
    left: 7px;
    border-left: 1px dashed #f05259;
}
/deep/ .el-timeline-item__wrapper {
    padding-left: 47px !important;
}
.nodeName {
    position: relative;
    top: -5px;
    line-height: 28px;
    font-size: 15px;
    font-weight: 600;
    color: #606266;
}

/deep/ .el-timeline-item:last-child {
    padding: 0;
    .el-timeline-item__tail {
        display: inline-block !important;
    }
}
.img-list {
    display: flex;
    img {
        margin: 5px;
    }
    p {
        line-height: 24px;
        text-align: center;
    }
}
.table-detail {
    /deep/ .empty_text {
        height: 200px !important;
    }
}
.mainPosition {
    color: orange;
    background: #fdf6ec;
    border-radius: 4px;
    padding: 0 4px;
}
/deep/ .el-form-item__label {
    font-weight: normal !important;
    line-height: 30px !important;
}
.table-detail {
    /deep/ .empty_text {
        height: 200px !important;
    }
}
.mainPosition {
    color: orange;
    background: #fdf6ec;
    border-radius: 4px;
    padding: 0 4px;
}
/deep/ .el-form-item__label {
    font-weight: normal !important;
    line-height: 30px !important;
}
</style>
