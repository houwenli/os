<template>
    <div v-if="breadcrumbList.length > 0" class="ws_breadcrumb">
        <i class="el-input__icon el-icon-arrow-left" @click="backClick"></i>
        <ul>
            <li v-for="(item, index) in breadcrumbList" :key="index" @click="liEvent(item, index)">
                {{ item.name }}
                <span v-show="breadcrumbList.length !== index + 1">{{ character }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        character: {
            type: String,
            default: '/'
        },
        breadcrumbList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {};
    },
    methods: {
        liEvent(item, index) {
            this.breadcrumbList.length > 1 && this.$emit('click', item, index);
        },

        backClick() {
            this.breadcrumbList.length > 1 && this.$emit('goUp');
        }
    }
};
</script>

<style lang="scss" scoped>
.ws_breadcrumb {
    display: flex;
    align-items: baseline;
    margin-bottom: 12px;

    .el-icon-arrow-left {
        font-size: 16px;
        color: #0088ff;
        cursor: pointer;
        line-height: 0;
    }

    ul {
        flex: 1;

        li {
            cursor: pointer;
            display: inline-block;
            font-size: 14px;
            font-weight: 400;
            color: #303133;
            line-height: 17px;
            span {
                padding: 0 6px;
            }
        }

        li:hover {
            color: #0088ff;
            span {
                color: #303133;
            }
        }

        li:last-child {
            color: #909399;
            cursor: default;
        }
    }
}
</style>
