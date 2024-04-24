<template>
    <div>
        <div class="inline-block">
            <span class="label">
                <span style="color: #f05259">*</span>
                选择城市:
            </span>
            <ws-city :disabled="disabled" @change="cityChange" :data="provinceCityAreaList" v-model="cityCodeArr" :defaultProps="{ checkStrictly: false }"></ws-city>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'areaListTempl',
    props: {
        multiple: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            cityCode: [],
            cityCodeArr: []
        };
    },
    watch: {
        cityCode(val) {
            if (val.length == 3 && [441900, 442000].indexOf(val[2]) >= 0) {
                this.cityCodeArr = [val[0], val[1], 0];
            } else {
                this.cityCodeArr = val;
            }
        }
    },
    computed: {
        ...mapState(['provinceCityAreaList'])
    },
    created() {},
    mounted() {},
    methods: {
        cityChange(id) {
            this.$emit('onCityChange', id);
        }
    }
};
</script>

<style lang="scss" scoped>
.label {
    margin-right: 18px;
}
.ws-city /deep/ .el-cascader {
    width: 250px !important;
}
</style>
