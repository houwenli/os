<template>
    <div class="__approval_field_wrap_container">
        <div class="block_container">
            <el-form label-position="right" label-width="120px" ref="el-form">
                <BaseInfo :dataObject="dataObject" />
                <div class="block_item_container">
                    <span class="block_item_title">员工入职信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="员工姓名：">{{ nodeForm.employeeName }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号码：">{{ nodeForm.phone }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="部门：">
                                <el-popover trigger="click" :content='nodeForm.deptNameComplete' placement="top" width="200">
                                    <span class='completeDuty' slot="reference">{{nodeForm.departmentName}}</span>
                                </el-popover>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="职位：">{{ nodeForm.positionName }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="员工类型：">{{ nodeForm.employeeTypeName }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="办公地点：">{{ nodeForm.officeAddressName }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="预计入职日期：">{{ nodeForm.expectedEntryDateStr }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <div class="block_item_container" v-if='nodeForm.fileList && nodeForm.fileList.length > 0'>
                    <span class="block_item_title">附件</span>
                    <el-row class="block_item_wrap"   style="background: none">
                        <div class="files_container">
                            <el-col :span="8" v-for="file in nodeForm.fileList" :key="file.fileId">
                                <div class="file_container">
                                    <img :src="require('@/assets/index/fileIcon.png')" />
                                    <div class="text">
                                        <h1>{{ file.fileName }}</h1>
                                        <span v-if="file.fileSize">{{ file.fileSize }}</span>
                                    </div>

                                    <div class="file_shadow">
                                        <div class="imgBox">
                                            <span @click="handlePreview(file.cdnUrl || file.URL||file.fileUrl)" v-if="(file.fileType.indexOf('.doc') > -1 ||
                                            file.fileType.indexOf('.docx') > -1 ||
                                            file.fileType.indexOf('.ppt') > -1 ||
                                            file.fileType.indexOf('.pptx') > -1 ||
                                            file.fileType.indexOf('.xls') > -1 ||
                                            file.fileType.indexOf('.xlsx') > -1||
                                            file.fileType.indexOf('.excel') > -1)">
                                                <i class="el-icon-zoom-in" style='margin-right:30px;'></i>
                                            </span>
                                            <a v-else-if="(file.fileType.indexOf('.pdf') > -1 || file.fileType.indexOf('.png') > -1 || file.fileType.indexOf('.jpeg')> -1|| file.fileType.indexOf('.jpg') > -1) && (file.cdnUrl || file.URL||file.fileUrl)" :href="file.cdnUrl || file.URL||file.fileUrl" target="_blank">
                                                <i class="el-icon-zoom-in" style='margin-right:30px;'></i>
                                            </a>
                                            <i class="el-icon-download" @click="handleDownLoad(file.cdnUrl || file.URL||file.fileUrl)"></i>
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                        </div>
                    </el-row>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import BaseInfo from './base/approvalInfo.vue';
import download from '../components/RenderFields/download';
export default {
    //入职审批
    name: 'inductionApproval',
    components: { BaseInfo },
    props: {
        nodeFormJson: {
            type: Object,
            default: () => {}
        },
        dataObject: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        nodeForm() {
            return JSON.parse(this.dataObject.nodeFormJson);
        }
    },
    data() {
        return {};
    },
    mounted() {
        console.log(this.dataObject);
    },
    methods: {
        handleDownLoad(item) {
            download(item);
        },
        handlePreview(item) {
            // 使用微软方式预览
            window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(item)}`);
        }
    }
};
</script>

<style></style>
