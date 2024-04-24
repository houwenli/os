<template>
    <div>
        <el-timeline :reverse="reverse">
            <el-timeline-item v-for="(activity, index) in formData" :key="index" color="#f05259">
                <div class="timestamp">2021-11-3014:00:00</div>
                <div class="node clearfix">
                    <div class="nodeLeft">
                        <p>
                            <span>入职成功</span>
                            <span>所属组织架构类型:总部</span>
                            <span>职务类型：主职</span>
                        </p>
                        <span>经办人:XXX</span>
                    </div>
                    <div class="nodeRight">
                        <p>
                            <span>部门:研发部</span>
                            <span>岗位:开发工程师</span>
                        </p>
                        <span>原因类型:业务调整</span>
                    </div>
                </div>
            </el-timeline-item>
        </el-timeline>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    props: {
        reverse: {//正序倒序
            type: Boolean,
            default: true
        },
        formData: {//表单数据
            type: Array,
            default: () => []
        }
    },
    data() {
        return {};
    },
    computed: {
        ...mapState('')
    }
};
</script>

<style lang="scss" scoped>
.el-timeline {
    margin-left: 150px;
    width: 70% !important;
    min-width: 850px;
    .timestamp {
        position: absolute;
        left: -150px;
        top: 1px;
        line-height: 20px;
        text-align: right;
        color: #606266;
    }
    .clearfix:after {
        content: '';
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }
    .clearfix {
        *zoom: 1;
    }
    .nodeLeft,
    .nodeRight {
        float: left;
        position: relative;
        top: -5px;
        width: 50%;
        line-height: 28px;
        font-size: 15px;
        color: #606266;
        padding-right: 60px;
        p {
            display: flex;
            justify-content: space-between;
        }
        span {
            display: inline-block;
            padding-bottom: 10px;
        }
    }
    /deep/ .el-timeline-item:last-child {
        padding: 0;
        .el-timeline-item__tail {
            display: inline-block !important;
        }
        /deep/ .el-timeline-item:last-child {
            padding: 0;
            .el-timeline-item__tail {
                display: inline-block !important;
            }
        }
    }
    /deep/ .el-timeline-item__node--normal {
        width: 14px;
        height: 14px;
    }
    /deep/ .el-timeline-item__tail {
        left: 5px;
        border-left: 1px dashed #f05259;
    }
    /deep/ .el-timeline-item__wrapper {
        padding-left: 44px !important;
    }
}
</style>

