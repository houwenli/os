<template>
    <div class="__approval_field_wrap_container">
        <div class="block_container">
            <el-form label-position="right" label-width="160px" ref="el-form">
                <BaseInfo :dataObject="dataObject" />
                <div class="block_item_container">
                    <span class="block_item_title">求救信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="求救时间：">{{ nodeForm.sosTime }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="求救终端：">{{ nodeForm.sosClientType }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="求救区域：">{{ nodeForm.sosCurAddress }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="求救人手机号码：">{{ nodeForm.sosPhone }}</el-form-item>
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
    //福卡申领审批
    name: 'addCarApproval',
    components: { BaseInfo },
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
            return JSON.parse(this.dataObject.nodeFormJson);
        },
    },
    data() {
        return {};
    },
    created() {},
    mounted() {
        console.log(this.nodeForm);
    },
    methods: {
        //单位转换
        changeYuan(num) {
            let str = (num / 100).toFixed(2) + '';
            let intSum = str.substring(0, str.indexOf('.')).replace(/\B(?=(?:\d{3})+$)/g, ',');
            let dot = str.substring(str.length, str.indexOf('.'));
            let ret = intSum + dot;
            return ret;
        },
    },
};
</script>

<style></style>
