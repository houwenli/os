<template>
    <div class="__approval_field_wrap_container">
        <div class="block_container">
            <el-form label-position="right" label-width="120px" ref="el-form">
                <BaseInfo :dataObject="dataObject" />

                <div class="block_item_container">
                    <span class="block_item_title">变动类型</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="变动类型：">
                                {{ nodeForm.opType == 1 ? '新增人员' : nodeForm.opType == 2 ? '修改人员资料' : nodeForm.opType == 5 ? '调整岗位' : nodeForm.opType == 6 ? '人员离职' : '' }}
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="block_item_container" v-if="nodeForm.opType == 1 || nodeForm.opType == 2">
                    <span class="block_item_title">人员基础信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="姓名：">
                                <span :class="nodeForm.opType == 2 && nodeForm.personalInfoChangedFields && nodeForm.personalInfoChangedFields.includes('name') ? 'red' : ''">
                                    {{ newNodeForm.name }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="入职日期：">
                                <span :class="nodeForm.opType == 2 && nodeForm.personalInfoChangedFields && nodeForm.personalInfoChangedFields.includes('entryDate') ? 'red' : ''">
                                    {{ (newNodeForm.entryDate || '').split(' ')[0] }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="身份证号码：">
                                <span :class="nodeForm.opType == 2 && nodeForm.personalInfoChangedFields && nodeForm.personalInfoChangedFields.includes('identityCard') ? 'red' : ''">
                                    {{ newNodeForm.identityCard }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号码：">
                                <span :class="nodeForm.opType == 2 && nodeForm.personalInfoChangedFields && nodeForm.personalInfoChangedFields.includes('phone') ? 'red' : ''">
                                    {{ newNodeForm.phone }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="出生日期：">
                                <span :class="nodeForm.opType == 2 && nodeForm.personalInfoChangedFields && nodeForm.personalInfoChangedFields.includes('birthday') ? 'red' : ''">
                                    {{ (newNodeForm.birthday || '').split(' ')[0] }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="年龄：">
                                <span :class="nodeForm.opType == 2 && nodeForm.personalInfoChangedFields && nodeForm.personalInfoChangedFields.includes('age') ? 'red' : ''">
                                    {{ newNodeForm.age }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="性别：">
                                <span :class="nodeForm.opType == 2 && nodeForm.personalInfoChangedFields && nodeForm.personalInfoChangedFields.includes('sexStr') ? 'red' : ''">
                                    {{ newNodeForm.sexStr }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="民族：">
                                <span :class="nodeForm.opType == 2 && nodeForm.personalInfoChangedFields && nodeForm.personalInfoChangedFields.includes('nation') ? 'red' : ''">
                                    {{ newNodeForm.nation }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="籍贯：">
                                <span :class="nodeForm.opType == 2 && nodeForm.personalInfoChangedFields && nodeForm.personalInfoChangedFields.includes('nativePlace') ? 'red' : ''">
                                    {{ newNodeForm.nativePlace }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="户籍类型：">
                                <span :class="nodeForm.opType == 2 && nodeForm.personalInfoChangedFields && nodeForm.personalInfoChangedFields.includes('registeredResidenceTypeStr') ? 'red' : ''">
                                    {{ newNodeForm.registeredResidenceTypeStr }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="婚姻状况：">
                                <span :class="nodeForm.opType == 2 && nodeForm.personalInfoChangedFields && nodeForm.personalInfoChangedFields.includes('maritalStatusStr') ? 'red' : ''">
                                    {{ newNodeForm.maritalStatusStr }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="生育状况：">
                                <span :class="nodeForm.opType == 2 && nodeForm.personalInfoChangedFields && nodeForm.personalInfoChangedFields.includes('fertilityStatusStr') ? 'red' : ''">
                                    {{ newNodeForm.fertilityStatusStr }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="政治面貌：">
                                <span :class="nodeForm.opType == 2 && nodeForm.personalInfoChangedFields && nodeForm.personalInfoChangedFields.includes('politicalTypeStr') ? 'red' : ''">
                                    {{ newNodeForm.politicalTypeStr }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="入党时间：">
                                <span :class="nodeForm.opType == 2 && nodeForm.personalInfoChangedFields && nodeForm.personalInfoChangedFields.includes('joinPartyDate') ? 'red' : ''">
                                    {{ newNodeForm.joinPartyDate }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="身份证地址：">
                                <span :class="nodeForm.opType == 2 && nodeForm.personalInfoChangedFields && nodeForm.personalInfoChangedFields.includes('identityCardAddress') ? 'red' : ''">
                                    {{ newNodeForm.identityCardAddress }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="居住住址：">
                                <span :class="nodeForm.opType == 2 && nodeForm.personalInfoChangedFields && nodeForm.personalInfoChangedFields.includes('currentAddress') ? 'red' : ''">
                                    {{ newNodeForm.currentAddress }}
                                </span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <div class="block_item_container" v-if="(nodeForm.opType == 1 || nodeForm.opType == 2) && newNodeForm.veteransStatus == 1">
                    <span class="block_item_title">退役信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="是否退役军人：">
                                <span :class="nodeForm.opType == 2 && nodeForm.personalInfoChangedFields && nodeForm.personalInfoChangedFields.includes('veteransStatusStr') ? 'red' : ''">
                                    {{ newNodeForm.veteransStatusStr }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="退役部队级别：">
                                <span :class="nodeForm.opType == 2 && nodeForm.personalInfoChangedFields && nodeForm.personalInfoChangedFields.includes('veteransForceLevel') ? 'red' : ''">
                                    {{ newNodeForm.veteransForceLevel }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="入伍日期：">
                                <span :class="nodeForm.opType == 2 && nodeForm.personalInfoChangedFields && nodeForm.personalInfoChangedFields.includes('enlistDate') ? 'red' : ''">
                                    {{ newNodeForm.enlistDate }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="转业日期：">
                                <span :class="nodeForm.opType == 2 && nodeForm.personalInfoChangedFields && nodeForm.personalInfoChangedFields.includes('transferDate') ? 'red' : ''">
                                    {{ newNodeForm.transferDate }}
                                </span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <div class="block_item_container" v-if="(nodeForm.opType == 1 || nodeForm.opType == 2) && JSON.stringify(nodeForm.educationInfo) !== '{}'">
                    <span class="block_item_title">学历信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="最高学历：">
                                <span :class="nodeForm.opType == 2 && nodeForm.educationInfoChangedFields && nodeForm.educationInfoChangedFields.includes('educationStr') ? 'red' : ''">
                                    {{ newNodeForm.educationStr }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="毕业院校：">
                                <span :class="nodeForm.opType == 2 && nodeForm.educationInfoChangedFields && nodeForm.educationInfoChangedFields.includes('schoolName') ? 'red' : ''">
                                    {{ newNodeForm.schoolName }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="起止年月：">
                                <span :class="nodeForm.opType == 2 && nodeForm.educationInfoChangedFields && nodeForm.educationInfoChangedFields.includes('startTime') ? 'red' : ''">
                                    {{ (newNodeForm.startTime || '').split(' ')[0] ? `${(newNodeForm.startTime || '').split(' ')[0]}~` : '' }}{{ (newNodeForm.endTime || '').split(' ')[0] }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="所学专业：">
                                <span :class="nodeForm.opType == 2 && nodeForm.educationInfoChangedFields && nodeForm.educationInfoChangedFields.includes('major') ? 'red' : ''">
                                    {{ newNodeForm.major }}
                                </span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <div class="block_item_container" v-if="nodeForm.opType == 1 || nodeForm.opType == 2">
                    <span class="block_item_title">职位信息</span>
                    <ws-table-el ref="table" v-bind="tableConfigone" :data="nodeForm.positionInfo" class="header_top">
                        <template>
                            <ws-table-column-el prop="departmentTypeStr" label="组织架构类型">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.departmentTypeStr }}</span>
                                </template>
                            </ws-table-column-el>
                            <ws-table-column-el prop="deptName" label="部门">
                                <template slot-scope="scope">
                                    <el-popover trigger="click" :content="scope.row.deptFullName" placement="top" width="200">
                                        <div class="completeDuty" slot="reference">{{ scope.row.deptName }}</div>
                                    </el-popover>
                                </template>
                            </ws-table-column-el>
                            <ws-table-column-el prop="positionName" label="职位">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.positionName }}</span>
                                </template>
                            </ws-table-column-el>
                            <ws-table-column-el prop="positionTypeStr" label="职位类型">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.positionTypeStr }}</span>
                                </template>
                            </ws-table-column-el>
                        </template>
                    </ws-table-el>
                </div>
                <div class="block_item_container" v-if="(nodeForm.opType == 1 || nodeForm.opType == 2) && nodeForm.jobInfo && nodeForm.jobInfo.length !== 0">
                    <span class="block_item_title">工作经历</span>
                    <ws-table-el ref="table" v-bind="tableConfigtwo" :data="nodeForm.jobInfo" class="header_top">
                        <template>
                            <ws-table-column-el prop="companyName" label="公司名称">
                                <template slot-scope="scope">
                                    <span :class="nodeForm.opType == 2 && (scope.row.opType == 1 || scope.row.opType == 2) ? 'red' : ''">{{ scope.row.companyName }}</span>
                                </template>
                            </ws-table-column-el>
                            <ws-table-column-el prop="startTime" label="起止年月">
                                <template slot-scope="scope">
                                    <span :class="nodeForm.opType == 2 && (scope.row.opType == 1 || scope.row.opType == 2) ? 'red' : ''">
                                        {{ (scope.row.startTime || '').split(' ')[0] }}~{{ (scope.row.endTime || '').split(' ')[0] }}
                                    </span>
                                </template>
                            </ws-table-column-el>
                            <ws-table-column-el prop="departmentName" label="部门">
                                <template slot-scope="scope">
                                    <span :class="nodeForm.opType == 2 && (scope.row.opType == 1 || scope.row.opType == 2) ? 'red' : ''">{{ scope.row.departmentName }}</span>
                                </template>
                            </ws-table-column-el>
                            <ws-table-column-el prop="positionName" label="职位">
                                <template slot-scope="scope">
                                    <span :class="nodeForm.opType == 2 && (scope.row.opType == 1 || scope.row.opType == 2) ? 'red' : ''">{{ scope.row.positionName }}</span>
                                </template>
                            </ws-table-column-el>
                        </template>
                    </ws-table-el>
                </div>
                <div class="block_item_container header_top" v-if="(nodeForm.opType == 1 || nodeForm.opType == 2) && (nodeForm.familyInfo || []).length !== 0">
                    <span class="block_item_title">家庭成员</span>
                    <ws-table-el ref="table" v-bind="tableConfigthree" :data="nodeForm.familyInfo" class="header_top">
                        <template>
                            <ws-table-column-el prop="name" label="姓名">
                                <template slot-scope="scope">
                                    <span :class="nodeForm.opType == 2 && (scope.row.opType == 1 || scope.row.opType == 2) ? 'red' : ''">{{ scope.row.name }}</span>
                                </template>
                            </ws-table-column-el>
                            <ws-table-column-el prop="relation" label="关系">
                                <template slot-scope="scope">
                                    <span :class="nodeForm.opType == 2 && (scope.row.opType == 1 || scope.row.opType == 2) ? 'red' : ''">{{ scope.row.relation }}</span>
                                </template>
                            </ws-table-column-el>
                            <ws-table-column-el prop="phone" label="联系电话">
                                <template slot-scope="scope">
                                    <span :class="nodeForm.opType == 2 && (scope.row.opType == 1 || scope.row.opType == 2) ? 'red' : ''">{{ scope.row.phone }}</span>
                                </template>
                            </ws-table-column-el>
                        </template>
                    </ws-table-el>
                </div>

                <div class="block_item_container" v-if="nodeForm.opType == 5 || nodeForm.opType == 6">
                    <span class="block_item_title">人员基础信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="姓名：">{{ nodeForm.employeeName }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="身份证号码：">{{ nodeForm.identityCard }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号码：">{{ nodeForm.phone }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="入职日期：">{{ nodeForm.entryDate }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <div class="block_item_container" v-if="nodeForm.opType == 6">
                    <span class="block_item_title">职位信息</span>
                    <ws-table-el ref="table" v-bind="tableConfigsix" :data="nodeForm.positionList" class="header_top">
                        <template>
                            <ws-table-column-el prop="departmentTypeName" label="组织架构类型"></ws-table-column-el>
                            <ws-table-column-el prop="deptName" label="部门">
                                <template slot-scope="scope">
                                    <el-popover trigger="click" :content="scope.row.departmentNameComplete" placement="top" width="200">
                                        <div class="completeDuty" slot="reference">{{ scope.row.departmentName }}</div>
                                    </el-popover>
                                </template>
                            </ws-table-column-el>
                            <ws-table-column-el prop="positionName" label="职位"></ws-table-column-el>
                            <ws-table-column-el prop="positionTypeName" label="职位类型"></ws-table-column-el>
                        </template>
                    </ws-table-el>
                </div>

                <div class="block_item_container" v-if="nodeForm.opType == 5">
                    <span class="block_item_title">调整前职位</span>
                    <ws-table-el ref="table" v-bind="tableConfigfour" :data="nodeForm.batchList" class="header_top">
                        <template>
                            <ws-table-column-el prop="departmentTypeName" label="组织架构类型"></ws-table-column-el>
                            <ws-table-column-el prop="deptName" label="部门">
                                <template slot-scope="scope">
                                    <el-popover trigger="click" :content="scope.row.departmentNameComplete" placement="top" width="200">
                                        <div class="completeDuty" slot="reference">{{ scope.row.departmentName }}</div>
                                    </el-popover>
                                </template>
                            </ws-table-column-el>
                            <ws-table-column-el prop="positionName" label="职位"></ws-table-column-el>
                            <ws-table-column-el prop="positionTypeName" label="职位类型"></ws-table-column-el>
                        </template>
                    </ws-table-el>
                </div>

                <div class="block_item_container" v-if="nodeForm.opType == 5">
                    <span class="block_item_title">调整后职位</span>
                    <ws-table-el ref="table" v-bind="tableConfigfive" :data="nodeForm.goalList" class="header_top">
                        <template>
                            <ws-table-column-el prop="departmentTypeName" label="组织架构类型"></ws-table-column-el>
                            <ws-table-column-el prop="deptName" label="部门">
                                <template slot-scope="scope">
                                    <el-popover trigger="click" :content="scope.row.departmentNameComplete" placement="top" width="200">
                                        <div class="completeDuty" slot="reference">{{ scope.row.departmentName }}</div>
                                    </el-popover>
                                </template>
                            </ws-table-column-el>
                            <ws-table-column-el prop="positionName" label="职位"></ws-table-column-el>
                            <ws-table-column-el prop="positionTypeName" label="职位类型"></ws-table-column-el>
                        </template>
                    </ws-table-el>
                </div>

                <div class="block_item_container" v-if="nodeForm.opType == 5">
                    <span class="block_item_title">调岗原因</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="24">
                            <el-form-item label="调岗类型：">{{ nodeForm.jobTransferTypeName }}</el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="调岗原因：">{{ nodeForm.reason }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <div class="block_item_container" v-if="nodeForm.opType == 6">
                    <span class="block_item_title">离职原因</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="24">
                            <el-form-item label="离职原因：">{{ nodeForm.reasonStr }}</el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="离职原因备注：">{{ nodeForm.remark }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="block_item_container header_top" v-if="[1,2,5,6].includes(nodeForm.opType)">
                    <span class="block_item_title">附件资料</span>
                    <div class="imgList" v-if="nodeForm.opType === 1 || nodeForm.opType === 2">
                        <div class="imgList_item">
                            <div v-for="(item, index) in this.nodeForm.files" :key="index">
                                <img width="150px" height="150px" :src="item.fileUrl" @click="onPreview(index)" />
                                <div :class="['imgName', item.opType == 1 || item.opType == 2 ? 'red' : '']">{{ item.name }}</div>
                            </div>
                        </div>
                        <ws-image-viewer :visible.sync="visible" :src-list="srcList" :currentIndex="currentIndex" />
                    </div>
                    <div v-else>
                        <upload-file :fileList="nodeForm.files" pageType="detail" :isShowRename="false" :isShowDelete="false" :isShowDownload="false"></upload-file>
                    </div>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import BaseInfo from './base/approvalInfo.vue';
import uploadFile from '@/components/uploadFile/index';
export default {
    //分公司变更审批
    name: 'changebranchApproval',
    components: { BaseInfo , uploadFile },
    props: {
        nodeFormJson: {
            type: Object,
            default: () => {},
        },
        dataObject: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        nodeForm() {
            // 机构人员调岗和人员离职 附件使用uploadFile组件回显需要用到fileName
            let nodeForm = JSON.parse(this.dataObject.nodeFormJson)
            nodeForm.files = nodeForm.files || []
            if([5,6].includes(nodeForm.opType)){
                nodeForm.files.forEach(item=>{
                    item.fileName = item.name
                })
            }
            return nodeForm;
        },
    },
    data() {
        return {
            visible: false,
            srcList: [],
            newNodeForm: {},
            currentIndex: 0,
            tableConfigone: {
                filterColumns: false,
                pagination: false,
                indexColumn: false,
                autoHeight: false,
            },
            tableConfigtwo: {
                filterColumns: false,
                pagination: false,
                autoHeight: false,
            },
            tableConfigthree: {
                filterColumns: false,
                pagination: false,
                autoHeight: false,
            },
            tableConfigfour: {
                filterColumns: false,
                pagination: false,
                indexColumn: false,
                autoHeight: false,
            },
            tableConfigfive: {
                filterColumns: false,
                pagination: false,
                indexColumn: false,
                autoHeight: false,
            },
            tableConfigsix: {
                filterColumns: false,
                pagination: false,
                indexColumn: false,
            },
        };
    },
    methods: {
        onPreview(index) {
            this.visible = true;
            this.currentIndex = index;
        },
        getSrcList() {
            this.$nextTick(() => {
                this.srcList = (this.nodeForm.files || []).map(item => {
                    return item.fileUrl;
                });
            });
        },
        openDept(val) {
            this.$alert(val, '完整部门信息', {
                confirmButtonText: '取消',
            });
        },
        filterTable() {
            this.nodeForm.positionInfo = (this.nodeForm.positionInfo || []).filter(item => item.opType != 3);
            // this.nodeForm.beforePositionInfo = this.nodeForm.beforePositionInfo.filter(item => item.opType != 3);
            this.nodeForm.familyInfo = (this.nodeForm.familyInfo || []).filter(item => item.opType != 3);
            this.nodeForm.jobInfo = (this.nodeForm.jobInfo || []).filter(item => item.opType != 3);
            // console.log(this.nodeForm.positionInfo);
        },
    },
    mounted() {
        console.log(this.dataObject, '11111');
        console.log(this.nodeForm, 'nodeForm');
        this.newNodeForm = {
            ...this.nodeForm.personalInfo,
            ...this.nodeForm.educationInfo,
            ...this.nodeForm.jobInfo,
        };
        this.getSrcList();
        this.filterTable();
    },
};
</script>

<style lang="scss" scoped>
.imgList {
    margin-top: 16px;
}
.imgList_item {
    display: flex;
    flex-wrap: wrap;
    img {
        margin-left: 16px;
    }
    .imgName {
        text-align: center;
        margin-left: 16px;
    }
}
.red {
    color: rgb(253, 32, 32);
}
.header_top {
    margin: 16px 0 32px 0;
}
// /deep/.ws-table__wrapper .ws-table__body-warp table tr td {
//     height: 39px !important;
// }
// /deep/.ws-table__wrapper .ws-table__body-warp table tr th {
//     height: 39px !important;
// }
</style>
