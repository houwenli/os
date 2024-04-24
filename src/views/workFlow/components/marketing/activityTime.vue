<template>
    <div class="data_form">
        <h2 class="flow_title">活动时间</h2>
        <ws-table-el ref="table" :span-method="arraySpanMethod" v-bind="tableConfig" :data="tableData" :header-cell-style="{ background: '#F5F7FA' }">
            <template>
                <ws-table-column-el label="活动日期" prop="activityDate" width="750"></ws-table-column-el>
                <ws-table-column-el prop="activityTime" label="活动时间"></ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
export default {
    name: 'activityTime',
    props: {
        formData: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            tableConfig: {
                filterColumns: false,
                indexColumn: false,
                pagination: false,
            },
            tableData: [],
        };
    },
    created() {
        this.tableDataList();
    },
    methods: {
        tableDataList() {
            let { activityStartDate, activityEndDate, timeList } = this.formData;
            timeList.forEach((item, index) => {
                this.tableData[index] = {
                    activityDate: `${this.$vuex.$baseMethod.formatData(activityStartDate).replace('00:00:00', '')}至 ${this.$vuex.$baseMethod
                        .formatData(activityEndDate)
                        .replace('23:59:59', '')}`,
                    activityTime: `${item.startTime} - ${item.endTime}`,
                };
            });
        },
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            console.log(columnIndex);
            if (rowIndex <= 4) {
                if (rowIndex === 0 && columnIndex === 0) {
                    return [4, 1];
                } else if (rowIndex >= 1 && columnIndex === 0) {
                    return [0, 0];
                }
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../comm.scss';
</style>
