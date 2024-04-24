<template>
    <div class="__approval_field_wrap_container">
        <div class="block_container">
            <el-form label-position="right" label-width="170px" ref="el-form">
                <BaseInfo :dataObject="dataObject" />
                <div class="block_item_container">
                    <span class="block_item_title">申请信息</span>
                    <div style="margin-top:16px;">
                        <el-table :data="nodeForm" :header-cell-style="{ background: '#F5F7FA' }" border >
                            <el-table-column prop="couponsName" label="换电券名称"></el-table-column>
                            <el-table-column prop="showName" label="App显示别名"></el-table-column>
                            <el-table-column label="优惠券类型">
                                <template>
                                    满减
                                </template>
                            </el-table-column>
                            <el-table-column label="优惠金额">
                                <template slot-scope="scope">
                                    {{changeMoney(scope.row)}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="totalNumber" label="数量"></el-table-column>
                            <el-table-column prop="validDay" label="有效期">
                                <template slot-scope="scope">
                                    领取后{{scope.row.validDay}}天有效
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import BaseInfo from './base/approvalInfo.vue';
export default {
    //离职审批
    name: 'electricApproval',
    components: { BaseInfo },
    props: {
        nodeFormJson: {
            type: Object,
            default: () => {},
        },
        dataObject: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        nodeForm() {
            let obj = JSON.parse(this.dataObject.nodeFormJson)
            let arr = [obj]
            console.log(arr,'llppp');
            return arr
        },
        changeMoney() {
            return function (val) {
                let str = '满' + this.$baseMethod.regFenToYuan(val.amountLimitation)  + '元减' + this.$baseMethod.regFenToYuan(val.faceValue) + '元'
                return str
            }
            
        }
    },
    data() {
        return {
            headerStyle: {
                background: '#F5F7FA',
                'font-family': 'PingFangSC-Medium, PingFang SC',
                'font-weight': '600',
                color: '#606266',
            },
        };
    },
    mounted() {
    },
};
</script>

<style lang="scss" scoped>
/deep/.el-table {
    border-radius: 10px;
    th {
        font-weight: 600;
        color: #666 !important;
        div {
            line-height: 19px;
        }
    }
}
.red {
    color: rgb(253, 32, 32);
}
</style>
