<template>
    <div class="data_form">
        <h2 class="flow_title">活动规则</h2>
        <div :class="[isHeader ? 'gift_content' : '']">
            <el-row v-if="isHeader" class="form_line">
                <el-col :span="12">
                    <el-form-item label="限购设置：">
                        <p v-if="formData.purchaseLimitSet === 0">{{ `${getEnumVal(PURCHASE_LIMIT, formData.purchaseLimitSet)}` }}</p>
                        <p v-else>{{ `${getEnumVal(PURCHASE_LIMIT, formData.purchaseLimitSet)} ${formData.purchaseLimit}个礼包` }}</p>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="倒计时设置：">
                        <p>{{ countDown[formData.countdownSetting] }}</p>
                    </el-form-item>
                </el-col>
            </el-row>

            <ws-table-el v-bind="tableConfig" :data="formData[listName]" :header-cell-style="{ background: '#F5F7FA' }">
                <template>
                    <ws-table-column-el prop="ruleContent" label="活动规则内容"></ws-table-column-el>
                </template>
            </ws-table-el>
        </div>
    </div>
</template>

<script>
import { PURCHASE_LIMIT } from '@/utils/enum';
export default {
    props: {
        formData: {
            type: Object,
            default: () => {},
        },
        isHeader: {
            type: Boolean,
            default: false
        },
        listName:{
            type: String,
            default: () => {
                return 'activityRules'
            },
        }
    },
    data() {
        return {
            PURCHASE_LIMIT,
            countDown: {
                1: '开启',
                2: '关闭',
            },
            tableConfig: {
                // pageSizeList: [5, 10, 20, 50],
                filterColumns: false,
                // indexColumn: false,
                pagination: false,
            },
        };
    },
};
</script>

<style lang="scss" scoped>
@import '../comm.scss';

.gift_content {
    padding: 16px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
}

.form_line {
    margin-bottom: 16px;
}
</style>
