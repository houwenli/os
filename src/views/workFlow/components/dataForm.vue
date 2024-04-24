<template>
    <div class="data_form">
        <h2 class="flow_title">{{ title || '--' }}</h2>
        <el-row class="form_line">
            <el-col :span="item.span || 12" v-for="item in formConfig" :key="item.index">
                <el-form-item :label="`${item.label}：`" v-if="item.show ? item.show(item, formData) : true">
                    <p v-if="item.nodeHandle">{{ item.nodeHandle(item, formData) }}</p>
                    <span v-else>{{ formData[item.key] || '--' }}</span>
                </el-form-item>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: '',
        },
        formConfig: {
            /**
             *{
                label【展示名称】: '',
                key【字段key】: '',
                show【是否展示】: () => {}
                nodeHandle【数据处理】: (item) => {
                    return ''
                }
             },
             */
            type: Array,
            default: () => [],
        },
        formData: {
            type: Object,
            default: () => {},
        },
    },
};
</script>

<style lang="scss" scoped>
@import './comm.scss';
</style>
