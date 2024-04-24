<template>
    <div id="pdfDom" v-if="baseInfo">
        <!-- <h2>员工档案</h2> -->
        <el-form label-width="160px" label-position="top">
            <div class="pdfpage"></div>
            <div class="title pt50">
                <span>个人资料</span>
            </div>
            <div class="detail">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="姓名：">
                            <p>{{ baseInfo.personalInfo.name }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号码：">
                            <p>{{ baseInfo.personalInfo.phone }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="工号：">
                            <p>{{ baseInfo.personalInfo.jobNumber }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="身份证号码：">
                            <p>{{ baseInfo.personalInfo.identityCard }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="出生日期：">
                            <p>{{ baseInfo.personalInfo.birthday||"".substring(0, 10) }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="年龄(系统计算)：" label-width="200px">
                            <p>{{ baseInfo.personalInfo.age }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别：">
                            <p>{{ baseInfo.personalInfo.sexName }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="民族：">
                            <p>{{ baseInfo.personalInfo.nation }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="入职日期：">
                            <p>{{ baseInfo.personalInfo.entryDate||"".substring(0, 10) }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="身份证地址：">
                            <p>{{ baseInfo.personalInfo.identityCardAddress }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="目前住址：">
                            <p>{{ baseInfo.personalInfo.currentAddress }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="户口类型：">
                            <p>{{ baseInfo.personalInfo.registeredResidenceTypeName }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="婚姻状况：">
                            <p>{{ baseInfo.personalInfo.maritalStatusName }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="生育状况：">
                            <p>{{ baseInfo.personalInfo.fertilityStatusName }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="籍贯：">
                            <p>{{ baseInfo.personalInfo.nativePlace }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="政治面貌：">
                            <p>{{ baseInfo.personalInfo.politicalTypeName }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否退役军人：">
                            <p>{{ baseInfo.personalInfo.veteransStatusName }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="入党日期：" v-if="baseInfo.personalInfo.politicalType == 4">
                            <p>{{ baseInfo.personalInfo.joinPartyDate }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="服役部队级别：" v-if="baseInfo.personalInfo.veteransStatus == 1">
                            <p>{{ baseInfo.personalInfo.veteransForceLevel }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="入伍日期：" v-if="baseInfo.personalInfo.veteransStatus == 1">
                            <p>{{ baseInfo.personalInfo.enlistDate }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="转业日期：" v-if="baseInfo.personalInfo.veteransStatus == 1">
                            <p>{{ baseInfo.personalInfo.transferDate }}</p>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <div class="pdfpage"></div>
            <div class="title pt50">
                <span>学历信息</span>
            </div>
            <div class="detail">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="最高学历：">
                            <p>{{ baseInfo.educationInfo.educationName }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="毕业院校：">
                            <p>{{ baseInfo.educationInfo.schoolName }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所学专业：">
                            <p>{{ baseInfo.educationInfo.major }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="起止年月：">
                            <p v-if="baseInfo.educationInfo.startTime||baseInfo.educationInfo.endTime">{{`${(baseInfo.educationInfo.startTime||"").substring(0, 7)}~${(baseInfo.educationInfo.endTime||"").substring(0, 7)}`}}</p>
                            <p v-else></p>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <div class="pdfpage"></div>
            <div class="title pt50">
                <span>职务信息</span>
            </div>
            <div class="table-d">
                <table border="0" cellspacing="0" cellpadding="0" width="100%" class="table">
                    <tr>
                        <!-- <th style="width: 36px">序号</th> -->
                        <th style="width: 130px">任职机构</th>
                        <th style="width: 151px"><span style="color: #f05259">* </span>任职职务(身兼多职可添加职务)</th>
                        <th style="width: 110px">职务类型</th>
                    </tr>
                    <tr v-for="(data, index) in baseInfo.positionInfo" :key="index">
                        <!-- <td>{{ index + 1 }}</td> -->
                        <td>{{ data.deptName }}</td>
                        <td>{{ data.positionName }}</td>
                        <td>{{ data.positionTypeName }}</td>
                        <!-- <td>{{ item.startTimeStr.substring(0, 7) }}~{{ item.endTimeStr.substring(0, 7) }}</td>
                        <td>{{ item.firstDegreeName }}</td> -->
                    </tr>
                </table>
            </div>
            <!-- <div class="empty_text" v-show="!baseInfo.educationInfoVoList.length">
                <p>暂无数据</p>
            </div> -->
            <div class="pdfpage"></div>
            <div class="title pt50">
                <span>工作经历</span>
            </div>
            <div class="table-d">
                <table border="0" cellspacing="0" cellpadding="0" width="100%" class="table">
                    <tr>
                        <th style="width: 86px">公司名称</th>
                        <th style="width: 110px">起止年月</th>
                        <th style="width: 136px">部门</th>
                        <th style="width: 76px">职位</th>
                    </tr>
                    <tr v-for="(data, index) in baseInfo.jobInfo" :key="index">
                        <td>{{ data.companyName }}</td>
                        <td>
                            {{ data.startTime.substring(0, 7) }}~{{ data.endTime.substring(0, 7) }}
                        </td>
                        <td>{{ data.departmentName }}</td>
                        <td>{{ data.positionName }}</td>
                    </tr>
                </table>
            </div>
            <!-- <div class="empty_text" v-show="!baseInfo.positionInfoVoList.length">
                <p>暂无数据</p>
            </div> -->
            <div class="pdfpage"></div>
            <div class="title pt50">
                <span>家庭成员</span>
            </div>
            <div class="table-d">
                <table border="0" cellspacing="0" cellpadding="0" width="100%" class="table">
                    <tr>
                        <th style="width: 130px">姓名</th>
                        <th style="width: 151px">关系</th>
                        <th style="width: 110px">联系方式</th>
                        <!-- <th style="width: 84px">操作</th> -->
                    </tr>
                    <tr v-for="(data, index) in baseInfo.familyInfo" :key="index">
                        <td>{{ data.name }}</td>
                        <td>{{ data.relation }}</td>
                        <td>{{ data.phone }}</td>
                    </tr>
                </table>
            </div>
            <!-- <div class="empty_text" v-show="!baseInfo.contractInfoVoList.length">
                <p>暂无数据</p>
            </div> -->
            <div class="pdfpage"></div>
        </el-form>
    </div>
</template>

<script>
export default {
    props: ['htmlTitle','baseInfo'],
    data() {
        return {
            cNum: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
        };
    },
    created() {
        console.log(this.baseInfo,'infos');
        
    },
    methods: {
        getPdfFile() {
            this.getPdf('#pdfDom');
        }
    }
};
</script>

<style lang="scss" scoped>
#pdfDom {
    width: 600px;
    margin: 0 auto;
    min-height: 1000px;
    padding: 20px 40px;
    font-family: PingFangSC-Medium, PingFang SC;
    color: #303133;

    h2 {
        font-size: 22px;
        font-weight: 500;
        line-height: 30px;
        text-align: center;
    }
    p {
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        min-height: 20px;
    }
    .title {
        font-size: 16px;
        font-weight: 500;
        margin: 16px 0;
    }
    .pt50 {
        margin-top: 50px;
    }
    .title2 {
        font-size: 14px;
    }
    /deep/ .el-form-item__label {
        font-size: 12px;
        line-height: 20px;
        color: #606266;
        padding-bottom: 0px;
    }
    /deep/ .el-form-item {
        margin-bottom: 2px;
        border-bottom: 1px solid #909399;
    }
    .promiss {
        font-size: 14px;
        font-weight: 400;
        color: #606266;
    }
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
            .tag {
                position: absolute;
                right: 5px;
                top: 5px;
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
    margin-bottom: 11px;
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
/deep/ .ws-table-warp {
    padding: 0 !important;
}
.table-d{
    border-top: 1px solid #303133;
    border-left: 1px solid #303133;
    border-collapse: collapse;
}
.table-d table th,td {
    border-right: 1px solid #303133;
    border-bottom: 1px solid #303133;
}
.table {
    font-size: 12px;
    margin-bottom: 0;
    /deep/ .el-form-item {
        margin-bottom: 0 !important;
    }
    /deep/ .el-form-item__error {
        top: 80%;
        font-size: 12px;
    }
    th,
    td {
        line-height: 20px;
        height: 40px;
    }
    th {
        height: 40px;
        line-height: 20px;
        text-align: left;
        padding-left: 4px;
        background: #909399;
        word-break: break-all;
        word-wrap: break-word;
        color: #fff;
    }
    td {
        text-align: left;
        padding-left: 4px;
        word-break: break-all;
        word-wrap: break-word;
    }
}
.empty_text {
    margin-top: 0;
    border: 1px solid #303133;
    border-top: none;
    p {
        margin-top: 0;
        line-height: 40px !important;
    }
}
</style>
