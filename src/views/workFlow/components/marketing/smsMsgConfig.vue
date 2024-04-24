<template>
    <div class="data_form">
        <h2 class="flow_title">短信配置</h2>
        <div>
            <el-row v-if="formData.smsTemplateId == -1" class="form_line">
                <el-col :span="12">
                    <el-form-item label="短信推送：">不推送</el-form-item>
                </el-col>
            </el-row>
            <ws-table-el v-if="formData.smsTemplateId != -1" v-bind="tableConfig" :data="dataList" :header-cell-style="{ background: '#F5F7FA' }">
                <template>
                    <ws-table-column-el prop="id" label="消息ID" width="500"></ws-table-column-el>
                    <ws-table-column-el prop="smsName" label="消息标题" width="500"></ws-table-column-el>
                    <ws-table-column-el prop="smsTemplate" label="消息内容"></ws-table-column-el>
                </template>
            </ws-table-el>
        </div>
    </div>
</template>
<script>
export default {
    name: 'smsMsgConfig',
    props: {
        formData: {
            type: Object,
            default: () => {},
        },
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
        dataList() {
            return [this.formData.smsTemplate.data];
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../comm.scss';
</style>
