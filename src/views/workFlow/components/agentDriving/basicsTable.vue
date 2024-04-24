<template>
    <div>
        <!-- 一级标题 -->
        <div class="ws-first-level-title">
            <template v-if="title">{{ title }}</template>
        </div>
        <div class="list-container">
            <el-table :data="list" :header-cell-style="{ background: '#F5F7FA' }" border>
                <el-table-column v-for="(item, index) in tableConfig" :key="index" :prop="item.prop" :label="item.label">
                    <template slot-scope="scope">
                        <p v-if="item.type === 'money'">{{ scope.row[item.prop] ? scope.row[item.prop] / 100 : 0 }}</p>
                        <p v-else>
                            {{ scope.row[item.prop] }}
                        </p>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'basicsTable',
    props: {
        // 表格描述
        tableConfig: {
            type: Array,
            default: () => []
        },
        // 表格数据
        list: {
            type: Array,
            default: () => []
        },
        // 标题
        title: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
// 一级标题
.ws-first-level-title {
    position: relative;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 600;
    color: #333;
    padding-left: 8px;
    margin-top: 32px;
    margin-bottom: 16px;

    &::before {
        position: absolute;
        left: 0;
        top: 3px;
        content: ' ';
        width: 4px;
        height: 16px;
        background: #f05259;
        border-radius: 0px 84px 84px 0px;
    }
}

.list-table-panel {
    margin: 16px 0;
    padding: 16px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
}

.list-container {
    border-radius: 8px;
    overflow: hidden;

    /deep/ .el-table {
        .el-table__header-wrapper .el-table__cell {
            font-size: 14px;
            font-weight: 600;
            color: #666;
        }
    }
}

.default-bg {
    width: 100%;
    box-sizing: border-box;
    background: #f5f7fa;
    border-radius: 8px;
    margin-bottom: 16px;
    padding: 24px;
}
</style>
