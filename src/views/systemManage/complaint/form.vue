<template>
    <div>
        <!-- 投诉详情 -->
        <el-card class="box">
            <personalComplaint :disabled="true" />
        </el-card>
    </div>
</template>

<script>
import personalComplaint from '../../personalComplaint/toComplaint.vue';
export default {
    name: 'complaintForm',
    components: { personalComplaint }
};
</script>

<style lang="scss" scoped>
.el-card{
    box-shadow: none !important;
    min-height: calc(100% - 64px) !important;
    border-radius: 8px;
}
</style>
