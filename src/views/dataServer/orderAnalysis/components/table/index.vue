<!--
 * @Author: CuteBoy
 * @Date: 2022-09-06 15:32:51
 * @Description: Table组件 继承el-table 二次开发
-->

<template>
    <div :class="['order-review', customClass]">
        <h3 :class="showTool ? 'table-title-flex' : 'table-title'">
            <div v-if="title" class="table-title-tips">{{ title }}
                <el-tooltip class="item" effect="dark" placement="right" v-if="showTip">
                    <div slot="content">
                        <slot name="showTipContent"></slot>
                    </div>
                    <img width="24" src="@/assets/order/icon_tips.png" alt="">
                </el-tooltip>
            </div>
            <!-- 应该做solt -->
            <el-radio-group v-model="serviceType" size="medium" @change="serviceChange" v-if="showTool">
                <el-radio-button :label="20">实时</el-radio-button>
                <el-radio-button :label="21">预约</el-radio-button>
            </el-radio-group>
        </h3>
        <el-table ref="table" v-loading="tableLoading" class="orderTable" :data="tableData" border
            :header-cell-style="cellStyle" v-bind="$attrs" v-on="$listeners">
            <template v-for="(item, index) in tableColumn">
                <el-table-column v-if="item.handleData" :prop="item.prop" :label="item.label" :min-width="item.minWidth"
                    :width="item.width" :column-key="`${index}`" :sortable="item.sortable" :key="index">
                    <template slot-scope="{row}">
                        <slot :name="item.slotName" :row="row"></slot>
                    </template>
                </el-table-column>
                <el-table-column v-else-if="item.handleAmt" :prop="item.prop" :label="item.label"
                    :min-width="item.minWidth" :width="item.width" :sortable="item.sortable" :column-key="`${index}`"
                    :key="`${index}a`">
                    <template slot-scope="scope">
                        {{ item.handleAmt(scope.row[item.prop]) }}
                    </template>
                </el-table-column>
                <el-table-column v-else-if="!item.prop" :label="item.label" :sortable="item.sortable" :type="item.type"
                    :min-width="item.minWidth" :width="item.width" :key="item.type">
                </el-table-column>
                <el-table-column v-else :prop="item.prop" :sortable="item.sortable" :label="item.label"
                    :min-width="item.minWidth" :width="item.width" :column-key="`${index}`" :key="item.prop"
                    :fixed="item.fixed">
                    <template slot-scope="scope">
                        {{ scope.row[item.prop] }}
                    </template>
                </el-table-column>
            </template>
            <template slot="empty">
                <div class="data-empty">
                    <img width="122" src="@/assets/index/empty.png" alt="暂无数据">
                    <p>暂无相关数据</p>
                </div>
            </template>
        </el-table>
        <slot name="loadMore"></slot>
    </div>
</template>
 
<script>
export default {
    name: 'vueName',
    props: {
        id: {
            type: String | Number,
        },
        title: {
            type: String,
            default: ''
        },
        showTip: {
            type: Boolean,
            default: false
        },
        showTool: {
            type: Boolean,
            default: false
        },
        tableData: {
            type: Array,
            default: () => []
        },
        tableColumn: {
            type: Array,
            default: () => []
        },
        tableLoading: {
            type: Boolean,
            default: false
        },
        customClass: {
            type: String,
            default: ''
        }
        // currentPage: {
        //     type: Number,
        //     default: 0
        // }
    },

    data() {
        return {
            serviceType: '20',
        }
    },

    methods: {
        cellStyle() {
            return 'border-color:#DCDFE6;background-color: #F5F7FA;color: #606266;';
        },

        serviceChange() {
            const { id, serviceType } = this
            this.$emit('serviceTypeChange', { id, serviceType })
        },

        // handleSizeChange() { },
        // handleCurrentChange() { }
    }
}
</script>
 
<style scoped lang="scss">
.order-review {
    margin-top: 29px;

    .table-title-flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #303133;
        margin-bottom: 19px;
    }

    .table-title {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #303133;
        line-height: 22px;

        .table-title-tips {
            display: flex;
            margin-bottom: 16px;
        }
    }

    .orderTable {
        // min-height: 274px;
        border-radius: 8px;
    }

    .data-empty {
        margin-top: 6%;
        margin-bottom: 6%;

        p {
            line-height: 1;
        }
    }
}
</style>