<template>
    <el-form label-width="138px">
        <!-- <div class="inline-block"> -->
        <!-- <span class="label" :style="{width: formGroup.width + 'px'}">{{item.label}} ： </span>
            <span class="text" v-if="item.filters">{{format(item) | propsFilters(item.filters) || '-'}} {{item.unit}}</span>
            <span class="text" v-else>{{format(item)}} {{item.unit}}</span> -->
        <el-form-item :label="item.label" v-for="item in formGroup.attribute" :key="item.label">
            <span v-if="item.filters">{{ format(item) | propsFilters(item.filters) }} {{ item.unit }}</span>
            <span v-else-if="item.value">{{ item.value }}</span>
            <span v-else>{{ format(item) }} {{ item.unit }}</span>
        </el-form-item>
        <!-- </div> -->
    </el-form>
</template>

<script>
/**
     * formGroup: {
            title: '基础信息',
            width: 125,
            attribute: [
                {
                    label: '订单号', name: 'orderId', filters: '', unit: '元',
                    format: (val) => this.$baseMethod.regFenToYuan(val.orderId),
                },
                {label: '商户订单号', name: 'outTradeNo'},
                {label: '车主类型', name: 'partnerType', filters: 'motorcycleOwnerFilters'},
            ]
        },
     */
export default {
    props: {
        formGroup: { type: Object },
        formData: { type: Object }
    },

    data() {
        return {};
    },
    methods: {
        format(item) {
            if (item.format) {
                return this.validata(item.format(this.formData));
            }
            return this.validata(this.formData[item.name]);
        },
        validata(val) {
            if (val === null || val === '' || val === undefined) {
                return '-';
            }
            return val;
        }
    }
};
</script>

<style scoped lang="scss">
.el-form {
    width: 800px;
    padding: initial;
    /deep/ .el-form-item {
        display: inline-block;
        margin-bottom: initial;
        width: 300px;
        margin-right: 50px;
        vertical-align: top;
        .el-form-item__label {
            height: 20px;
            line-height: 20px;
        }
        .el-form-item__content {
            line-height: 20px;
            margin-bottom: 20px;
        }
    }
}
</style>
