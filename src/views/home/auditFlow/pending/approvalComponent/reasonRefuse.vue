<template>
    <div class="block_item_container">
        <ws-descriptions title="审核不通过原因" type="container" :showToggle="false">
            <el-table :data="dataList" border style="width: 100%" :header-cell-style="{background: '#f5f7fa','font-weight':'bolder'}">
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="dataType" label="资料类型" width="180">
                    <template slot-scope="scope">
                        <span>{{ typeToName(scope.row.dataType) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="dataValue" label="不通过原因"></el-table-column>
            </el-table>
        </ws-descriptions>
    </div>
</template>

<script>
export default {
    name: 'reasonRefuse',
    props: {
        dataList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            dataTypeList: [
                { type: 'idCardList', name: '身份证类' },
                { type: 'driverCerList', name: '驾驶证类' },
                { type: 'licenseCerList', name: '行驶证类' },
                { type: 'personCarList', name: '人车合影类' },
                { type: 'expCerList', name: '网约车证' },
                { type: 'otherList', name: '其他类' }
            ]
        }
    },
    methods: {
        typeToName(type) {
            let name = this.dataTypeList.filter(item => item.type == type);
            return name[0].name || null;
        },
    }
};
</script>

<style lang="scss" scoped>
/deep/ .el-table thead {
    font-size: 14px;
    font-weight: bold!important;
    color: #666;
    background-color: #f5f7fa !important;
}
</style>
