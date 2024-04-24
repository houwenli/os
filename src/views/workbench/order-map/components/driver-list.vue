<!--
 * @Author: DaiYu
 * @Date: 2022-09-13 10:24:48
 * @LastEditors: DaiYu
 * @LastEditTime: 2022-09-24 18:21:22
 * @FilePath: \main\src\views\workbench\order-map\components\driver-list.vue
-->
<template>
    <el-dialog title="司机列表" class="dispatch-log" ref="dialog" :visible.sync="dialogVisible" width="70%">
        <ws-table-el align="left" ref="listTable" :total="total" v-bind="tableConfig" :col="8">
            <template>
                <ws-table-column-el align="center" prop="driverId" label="司机ID"></ws-table-column-el>
                <ws-table-column-el align="center" prop="status" label="司机状态">
                    <template slot-scope="scope">
                        {{ valueToLabel(scope.row.status) }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="regionName" label="所在热区"></ws-table-column-el>
                <!-- <ws-table-column-el align="center" prop="scope" label="所在范围"></ws-table-column-el> -->
            </template>
        </ws-table-el>
    </el-dialog>
</template>

<script>
export default {
    name: 'DriverList',
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        recordId: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            tableConfig: {
                filterColumns: false,
                emptyModel: true,
                indexColumn: true,
                // layout: 'flow',
                loading: true,
                pageSizeList: [20, 30, 50],
                autoHeight: false,
                height:500,
                lazyQuery: {
                    moduleName: '/workbench/orderMap/dispatchLog',
                    op: {
                        selectList: 'driverRecordPageList',
                        // selectCount: 'count',
                    },
                    beforeQuery: this.beforeQuery,
                    afterQuery: this.afterQuery,
                    immediate: true,
                },
            },
            statusOptions: [
                {
                    value: -1,
                    label: '全部',
                },
                {
                    value: 0,
                    label: '未出车',
                },
                {
                    value: 1,
                    label: '出车离线',
                },
                {
                    value: 2,
                    label: '出车空闲',
                },
                {
                    value: 3,
                    label: '服务中在线',
                },
                {
                    value: 4,
                    label: '服务中离线',
                },
            ],
            total: 0,
            dialogVisible: this.value,
            moduleName: '/workbench/orderMap/dispatchLog',
        };
    },
    watch: {
        dialogVisible(val) {
            this.$emit('input', val);
        },
    },
    methods: {
        beforeQuery() {
            return {
                recordId: this.recordId,
            };
        },
        afterQuery(data) {
            this.total = data.count;
            return data;
        },
        valueToLabel(status) {
            return this.statusOptions.find(item => item.value === status).label;
        },
    },
};
</script>

<style lang="scss" scoped>
.dispatch-log {
    ::v-deep {
        .el-dialog__body {
            padding: 30px 24px;
        }
        .ws-table-warp {
            padding: 0 !important;
        }
    }
}
</style>
