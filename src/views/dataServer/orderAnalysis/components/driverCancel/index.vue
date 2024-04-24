<template>
    <div class="driver-cancel">
        <div class="table-title" v-if="title">{{ title }}</div>
        <Table customClass="custom-class" v-bind="$attrs" v-on="$listeners" :tableData="driverCancelList" :tableColumn="tableColumn">
            <div class="more" v-if="empty" @click="more">
                展开更多
                <i class="el-icon-arrow-down"></i>
            </div>
        </Table>
    </div>
</template>
 
<script>
import Table from '../../components/table';
export default {
    name: 'driverCancel',
    components: {
        Table,
    },
    props: {
        title: {
            type: String,
            default: '',
        },
        driverCancelList: {
            type: Array,
            default: () => [],
        },
        tableColumn: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
        };
    },

    computed: {
        empty() {
            let len = this.driverCancelList.length;
            return len > 6 && len != 49;
        },
    },

    methods: {
        more() {
            this.$emit('loadMore');
        },
    },
};
</script>
 
<style scoped lang="scss">
.table-title {
    width: 330px;
    height: 40px;
    line-height: 40px;
    background: url('~@/assets/order/table-title.png') no-repeat;
    background-size: 100% 100%;
    padding-left: 40px;
    font-size: 14px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
}

.more {
    text-align: center;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #f05259;
    height: 40px;
    line-height: 40px;
    background: #f5f7fa;
    cursor: pointer;
}

.custom-class {
    margin-top: 0 !important;
}
</style>