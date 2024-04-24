<template>
    <div class="rb-table-box">
        <div class="rb-table-title">
            {{ title }}
            <el-button type="text" class="rb-btn rb-table-btn" @click="updateSort" :disabled="sortDisabled" v-if="oaPowerType">调整排序</el-button>
        </div>
        <transition>
            <div class="rb-table-tip" v-if="sortDisabled">
                上下移动调整位置
                <ws-throttle><el-button type="text" class="rb-btn save-btn" @click="handleSave">保存</el-button></ws-throttle>
                <el-button type="text" class="rb-btn cancel-btn" @click="handleCancel">取消</el-button>
            </div>
        </transition>
        <!-- 需要拖拽的位置 -->
        <slot name="dragContent" :slotProps="{ sortDisabled: !sortDisabled, showAll: showAll }"></slot>
        <el-button type="text" @click="show" class="rb-btn show-btn" v-if="$attrs.showBtn">
            {{ !showAll ? '查看全部' : '收起' }}
            <i :class="!showAll ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
        </el-button>
    </div>
</template>

<script>
export default {
    name: 'DragRow',
    props: {
        title: {
            type: String,
            default: ''
        },
        oaPowerType: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            sortDisabled: false,
            showAll: false
        };
    },
    methods: {
        show() {
            //切换查看全部与收起
            this.showAll = !this.showAll;
            this.$emit('switchShow', { showAll: this.showAll });
        },
        handleSave() {
            //保存排序
            this.$emit('save');
            this.sortDisabled = false;
        },
        handleCancel() {
            //点击取消
            this.$emit('cancel', { showAll: this.showAll });
            this.sortDisabled = false;
        },
        updateSort() {
            //sortable.js----手动初始化拖拽元素(获取div元素),调用sortable初始化
            this.$emit('before-sort');
            this.sortDisabled = true;
        }
    }
};
</script>

<style lang="scss" scoped>
.rb-table-box {
    .rb-btn {
        color: #0088ff;
    }
    .rb-table-title {
        width: 100%;
        height: 46px;
        line-height: 46px;
        font-size: 16px;
        font-weight: 500;
        background: #f8f8f8;
        border-radius: 4px;
        padding: 0 16px;
        .rb-table-btn {
            float: right;
            font-size: 14px;
            height: 46px;
        }
    }
    .rb-table-tip {
        text-align: center;
        color: #909399;
    }
    .show-btn {
        padding-left: 16px;
    }
    .save-btn {
        padding-left: 24px;
    }
}
</style>
