<template>
    <div class="record_text">
        <div class="title">操作日志</div>
        <div class="info">
            <div class="item createInfo">
                <p class="border-top">
                    <label>创建人</label>
                    <span>{{ recordInfo.createUserName }}</span>
                </p>
                <p>
                    <label>创建时间</label>
                    <span>{{ recordInfo.createTime }}</span>
                </p>
            </div>
            <div class="item updateInfo">
                <p class="border-top">
                    <label>最后修改人</label>
                    <span>{{ recordInfo.updateUserName }}</span>
                </p>
                <p>
                    <label>最后修改时间</label>
                    <span>{{ recordInfo.updateTime }}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'recordInfo',
    props: {
        recordInfo: {
            type: Object,
            require: true,
        },
    },
    data() {
        return {};
    },
};
</script>

<style lang="scss" scoped>
.record_text {
    h3 {
        font-size: 20px;
        font-weight: 600;
        color: #303133;
        line-height: 28px;
        padding: 23px 0;
    }
    .title {
        padding: 32px 0 16px 0;
        font-size: 16px;
        font-weight: 600;
        color: #303133;
    }
    .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .item {
            flex: 1;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            &.createInfo {
                margin-right: 16px;
            }
        }
        p {
            width: 100%;
            height: 45px;
            line-height: 45px;
            &.border-top {
                border-bottom: 1px solid #dcdfe6;
            }
            label {
                display: inline-block;
                width: 25%;
                min-width: 100px;
                height: 100%;
                padding: 0 16px;
                box-sizing: border-box;
                background: #f5f7fa;
                border-right: 1px solid #dcdfe6;
                text-align: right;
            }
            span {
                padding: 0 16px;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #606266;
                line-height: 20px;
            }
        }
    }
}
</style>
