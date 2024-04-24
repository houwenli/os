<template>
    <div>
        <div class="apply-success">
            <img class="apply-success-icon" src="@/assets/index/img_result_success.png" alt width="50" />
            <p class="apply-success-title">审批提交成功</p>
            <p class="apply-success-tips">审批已提交成功，你可以在“首页”-“审批发起记录”中查看提交详情和审批进度</p>
            <div class="apply-success-back" @click="goto">返回首页 {{ second }}s</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'applySuccess',

    data() {
        return {
            timer: null,
            setInterval: null,
            second: 3
        };
    },

    mounted() {
        this.timer = setTimeout(() => {
            this.goto();
        }, 3000);

        this.setInterval = setInterval(() => {
            this.second--;
        }, 1000);
    },

    methods: {
        goto() {
            clearInterval(this.timer);
            this.$router.replace({ path: '/index' });
        }
    },

    beforeDestroy() {
        this.timer = null;
        this.setInterval = null;
    }
};
</script>

<style scoped lang="scss">
.apply-success {
    background-color: #fff;
    border-radius: 8px;
    height: calc(100vh - 100px);
    text-align: center;

    &-icon {
        margin-top: 180px;
        margin-bottom: 16px;
    }

    &-title {
        font-size: 20px;
        color: #303133;
        font-weight: 500;
        margin-bottom: 20px;
    }

    &-tips {
        font-size: 14px;
        color: #606266;
        margin-bottom: 60px;
    }

    &-back {
        display: inline-block;
        width: 192px;
        height: 40px;
        line-height: 40px;
        border: 1px solid #dcdfe6;
        background: #ffffff;
        cursor: pointer;
    }
}
</style>
