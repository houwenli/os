<template>
    <div class="block_item_container">
        <span class="block_item_title">审批发起信息</span>
        <el-row class="block_item_wrap">
            <el-col :span="12">
                <el-form-item label="审批编号：">{{ dataObject.procdefNo }}</el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="审批类型：">{{ dataObject.name }}</el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="发起时间：">{{ dataObject.startTime || '' }}</el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="发起人：">{{ dataObject.startUserName }}</el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="所属部门：">{{ dataObject.startDeptName }}</el-form-item>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'BaseInfo',
    props: {
        dataObject: {
            type: Object,
            default: () => {}
        }
    }
};
</script>

<style></style>
