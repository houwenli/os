<!--
 * @Author: DaiYu
 * @Date: 2022-03-28 09:30:06
 * @LastEditors: DaiYu
 * @LastEditTime: 2022-09-26 08:48:23
 * @FilePath: \main\src\views\workbench\order-map\components\push-dialog.vue
-->
<template>
    <el-dialog title="发送确认" :visible.sync="visible" width="50%" center destroy-on-close :close-on-click-modal="false" @close="close">
        <div class="content">
            <div class="inline-block">
                <label for class="label">热区定位点：</label>
                <span class="text">{{ info.regionName }}</span>
            </div>
            <div class="inline-block">
                <label for class="label">预估发送司机数量：</label>
                <span class="text">{{ info.driverCount }}</span>
            </div>
            <div v-if="info.scope" class="inline-block">
                <label for class="label">推送范围：</label>
                <span class="text">{{ info.scope }}</span>
            </div>
            <div class="inline-block">
                <label for class="label">推送方式：</label>
                <span class="text">PUSH</span>
            </div>
            <div class="inline-block">
                <label for class="label">消息示例：</label>
                <span class="text">系统检测到该地区附近订单较多，您可点击导航前往接单</span>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">返回</el-button>
            <el-button type="primary" @click="confirm">确定发送</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'PushDialog',
    model: {
        prop: 'show',
        event: 'my-close',
    },
    props: {
        info: {
            type: Object,
            required: true,
        },
        show: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            moduleName: '/workbench/orderMap/dispatch',
        };
    },
    computed: {
        visible: {
            get() {
                return this.show;
            },
            set(val) {
                this.$emit('my-close', val);
            },
        },
    },
    methods: {
        close() {
            this.$emit('my-close', false);
        },
        confirm() {
            this.$emit('confirm')
        },
    },
};
</script>

<style lang="scss" scoped>
.content {
    .inline-block {
        display: flex;
        padding: 6px 0 6px 50px;
        .label {
            display: inline-block;
            min-width: 130px;
        }
    }
}
.dialog-footer {
    text-align: center;
}
</style>
