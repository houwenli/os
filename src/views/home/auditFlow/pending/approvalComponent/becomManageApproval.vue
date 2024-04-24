<template>
    <div class="__approval_field_wrap_container">
        <div class="block_container">
            <el-form label-position="right" label-width="120px" ref="el-form">
                <BaseInfo :dataObject="dataObject" />
                <div class="block_item_container">
                    <span class="block_item_title">转正员工信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="员工姓名：">{{ nodeForm.name }}</el-form-item>
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
                            <el-form-item label="主职：">{{ nodeForm.positionName }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="员工类型：">{{ nodeForm.employeeTypeStr }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="办公地点：">{{ nodeForm.officeAddressStr }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="员工工号：">{{ nodeForm.jobNumber }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="block_item_container">
                    <span class="block_item_title">转正时间</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="实际入职日期：">{{ nodeForm.entryDate }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="试用期：">{{ nodeForm.probationPeriodStr }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="预计转正日期：">{{ nodeForm.plannedConfirmationDate }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="实际转正日期：">{{ nodeForm.realConfirmationDate }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="block_item_container" v-if="nodeForm.remark">
                    <span class="block_item_title">转正备注</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="24">
                            <el-form-item label="员工转正备注：">{{ nodeForm.remark }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import BaseInfo from './base/approvalInfo.vue';
export default {
    //转正审批
    name: 'becomManageApproval',
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
    }
};
</script>

<style></style>
