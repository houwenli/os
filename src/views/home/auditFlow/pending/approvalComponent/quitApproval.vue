<template>
    <div class="__approval_field_wrap_container">
        <div class="block_container">
            <el-form label-position="right" label-width="120px" ref="el-form">
                <BaseInfo :dataObject="dataObject" />
                <div class="block_item_container">
                    <span class="block_item_title">员工离职信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="员工姓名：">{{ nodeForm.employeeName }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="员工工号：">{{ nodeForm.jobNumber }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="预计离职时间：">{{ nodeForm.plannedResignationDate }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="block_item_container">
                    <span class="block_item_title">员工岗位信息</span>
                    <el-table :cell-style='{padding:"3px"}' :data="nodeForm.positionList" style="width: 100%;margin:16px 0;" :border="true" :header-cell-style="headerStyle">
                        <el-table-column label="组织架构类型" prop='departmentTypeName'></el-table-column>
                        <el-table-column label="部门" prop='departmentName'>
                            <template slot-scope="scope">
                                <el-popover trigger="click" :content='scope.row.departmentNameComplete' placement="top" width="200">
                                    <div class='completeDuty' slot="reference">{{scope.row.departmentName}}</div>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column label="职位" prop='positionName'></el-table-column>
                        <el-table-column label="职位类型" prop='positionTypeName'></el-table-column>
                    </el-table>
                </div>
                <div class="block_item_container">
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

            </el-form>
        </div>
    </div>
</template>

<script>
import BaseInfo from './base/approvalInfo.vue';
export default {
    //离职审批
    name: 'quitApproval',
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
        return {
            headerStyle: {
                background: '#F5F7FA',
                'font-family': 'PingFangSC-Medium, PingFang SC',
                'font-weight': '600',
                color: '#606266'
            },
        };
    },
    mounted() {
        console.log(this.dataObject);
    }
};
</script>

<style lang="scss" scoped>
.el-table{
    border-radius:10px;
}
</style>
