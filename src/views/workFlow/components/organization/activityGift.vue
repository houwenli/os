<template>
    <div class="data_form">
        <h2 class="flow_title">活动礼包</h2>
        <section v-for="(activityPack, index) in [formData.orgActivityPack]" :key="index">
            <!-- <p class="gift_name" :style="{ 'margin-top': index === 0 ? '0px' : '24px' }">{{ `${activityPack.activityPackName}详情` }}</p> -->
            <div class="gift_content">
                <el-row class="form_line">
                    <el-col v-for="keyItem in formKeys" :key="keyItem.index" :span="12">
                        <el-form-item :label="(keyItem.nodeHandle && keyItem.nodeHandle(keyItem, activityPack, index).label) || keyItem.label">
                            <p>{{ (keyItem.nodeHandle && keyItem.nodeHandle(keyItem, activityPack, index).val) || activityPack[keyItem.key] }}</p>
                        </el-form-item>
                    </el-col>
                </el-row>

                <ws-table-el v-bind="tableConfig" :data="activityPack.packRelationAoList" :header-cell-style="{ background: '#F5F7FA' }">
                    <template>
                        <ws-table-column-el prop="giftName" label="出行券名称"></ws-table-column-el>
                        <ws-table-column-el prop="showName" label="App显示别名"></ws-table-column-el>
                        <ws-table-column-el prop="couponsType" label="出行券类型">
                            <template slot-scope="scope">
                                <span>{{ getEnumVal(couponsTypeFilters, scope.row.couponsType, 'value') }}</span>
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el prop="faceValue" label="优惠金额">
                            <template slot-scope="scope">
                                <span>{{ faceValueHandle(scope.row) }}</span>
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el prop="serviceId" label="适用业务">
                            <template slot-scope="scope">
                                <span v-if="scope.row.ifAllBusiness === 1">不限</span>
                                <span v-else>{{ getEnumVal(fitBusinessFilters, scope.row.serviceId ? scope.row.serviceId.split(',') : '', 'value').toString() }}</span>
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el prop="sendNumber" label="数量"></ws-table-column-el>
                        <ws-table-column-el width="350px" prop="effectiveStartTime" label="有效期">
                            <template slot-scope="scope">
                                <span>{{ timeHandle(scope.row) }}</span>
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el width="120px" label="可用时间段">
                            <template slot-scope="scope">
                                <span>{{ availableHandle(scope.row) }}</span>
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el width="120px" prop="useCity" label="适用城市">
                            <template slot-scope="scope">
                                <span>{{ getEnumVal(useCityFilters, scope.row.useCity, 'value') }}</span>
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el prop="unitPrice" label="单价(元)">
                            <template slot-scope="scope">
                                <span>{{ scope.row.unitPrice }}</span>
                            </template>
                        </ws-table-column-el>
                    </template>
                </ws-table-el>
            </div>
        </section>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    props: {
        formData: {
            type: Object,
            default: () => {},
        },
        formKeys: {
            type: Array,
            default: () => [],
        },
    },
    created() {
        this.formData.orgActivityPack.giftPackCount = this.formData.giftPackCount;
    },
    data() {
        return {
            tableConfig: {
                // pageSizeList: [5, 10, 20, 50],
                filterColumns: false,
                indexColumn: false,
                pagination: false,
            },
        };
    },

    computed: {
        ...mapState({
            useCityFilters: state => state.workFlow.useCityFilters,
            fitBusinessFilters: state => state.workFlow.fitBusinessFilters,
            couponsTypeFilters: state => state.workFlow.couponsTypeFilters,
        })
    },

    methods: {
        faceValueHandle(row) {
            let { couponsType, faceValue, amountLimitation } = row;
            let text;
            switch (couponsType) {
                case 1:
                    text = `满${amountLimitation / 100 || '--'}元减${faceValue / 100 || '--'} 元`;
                    break;
                case 2:
                    text = `${amountLimitation / 100 || '--'} 折/${faceValue / 100 || '--'} 元`;
                    break;
                case 3:
                    text = `${faceValue / 100 || '--'} 元`;
                    break;
                default:
                    text = '--';
                    break;
            }
            return text;
        },

        timeHandle(row) {
            let { validDay, effectiveStartTime, effectiveEndTime, couponsPeriodType } = row;
            if (couponsPeriodType === 1) {
                // 红包
                return `领取后${validDay || '--'}天内有效`;
            } else {
                return `${effectiveStartTime || '--'} 至 ${effectiveEndTime || '--'}`;
            }
        },

        availableHandle(row) {
            let { availableStartTime, availableEndTime } = row;
            if (!availableStartTime && !availableEndTime) return '--';
            return `${availableStartTime || '--'}-${availableEndTime || '--'}`;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../comm.scss';

.data_form {
    .form_line {
        margin-bottom: 16px;
    }
    .gift_name {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #303133;
        padding: 0 0 16px 20px;
        position: relative;
    }

    .gift_name::after {
        content: '';
        position: absolute;
        top: 4px;
        left: 0;
        width: 12px;
        height: 12px;
        background: #c0c4cc;
        border-radius: 50%;
    }

    .gift_content {
        width: 100%;
        padding: 16px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
    }

    /deep/ .ws-table-warp {
        padding: 0 !important;
    }
}
</style>
