<template>
    <div class="driverTransferControl">
        <ws-table-el ref="table" v-bind="tableConfig" v-show="!btnDisabled">
            <template #search>
                    <search-group>
                        <label for>司机ID：</label>
                        <el-input v-model.trim="searchOptions.driverId" @change="changeRules('driverId')" placeholder="请输入司机ID" clearable></el-input>
                    </search-group>
                    <search-group>
                        <label for>姓名：</label>
                        <el-input v-model.trim="searchOptions.name" maxlength="20" placeholder="请输入姓名" clearable></el-input>
                    </search-group>
                    <search-group>
                        <label for>身份证：</label>
                        <el-input v-model.trim="searchOptions.idNumber" maxlength="18" @change="changeRules('idNumber')" placeholder="请输入身份证" clearable></el-input>
                    </search-group>
                    <search-group>
                        <label for>申请原因：</label>
                        <el-select v-model="searchOptions.applyReasonType" placeholder="请选择申请原因" clearable>
                            <el-option v-for="item in applyReasonTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                        </el-select>
                    </search-group>
            </template>
            <template #searchBtns>
                <el-button-group>
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()" :disabled="btnDisabled">查 询</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn" @click="reset()" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
                <el-button style="margin-left: 10px;" class="el-button el-button--default el-button--medium is-plain" type="button" icon="el-icon-circle-plus" @click="toDetail('add')">新增</el-button>
            </template>
            <template>
                <ws-table-column-el prop="driverId" label="司机ID"></ws-table-column-el>
                <ws-table-column-el prop="name" label="姓名" width="80"></ws-table-column-el>
                <ws-table-column-el prop="idCardNumber" label="身份证号码" min-width="200"></ws-table-column-el>
                <ws-table-column-el prop="applyReasonType" label="申请原因">
                    <template slot-scope="scope">
                        {{ _arrayFomatter(scope.row.applyReasonType, applyReasonTypeFilters, {value: 'id', label: 'value'}) }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="applyDesc" min-width="200" label="申请描述"></ws-table-column-el>
                <ws-table-column-el prop="createTime" label="申请时间"></ws-table-column-el>
                <ws-table-column-el prop="audit" label="当前进度">
                    <template slot-scope="scope">
                        {{ _arrayFomatter(scope.row.audit, auditFilters, {value: 'id', label: 'value'}) }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el label="操作" width="80" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" style="color:#0088ff;" @click="toDetail('detail', scope.row)">详情</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
        <router-view />
    </div>
</template>

<script>
import { arrayFomatter } from '@/utils/commMethods'

export default {
    name: 'driverTransfer',
    data() {
        return {
            btnDisabled: false,
            moduleName: '/workbench/BRdriverTransfer',
            searchOptions: {
                driverId: '',
                name: '',
                idNumber: '',
                applyReasonType: ''
            },
            tableConfig: {
                // emptyModel: true,
                // indexColumn: true,
                filterColumns: false,
                // layout: 'flow',
                loading: true,
                pageSizeList: [20,30,50],
                lazyQuery: {
                    moduleName: '/workbench/BRdriverTransfer',
                    op: {
                        selectList: 'pageList',
                        selectCount: 'selectPageCount'
                    },
                    immediate: false,
                    afterQuery: this.afterQuery
                }
            },
            applyReasonTypeFilters: [ // 申请原因
                { id: 1, value: '车主身故/残疾' },
                { id: 2, value: '证件纠纷 ' }
            ],
            auditFilters: [ //审核状态
                { id: 0, value: '未完全提交审核信息' },
                { id: 10, value: '待审核' },
                { id: 20, value: '审核中' },
                { id: 30, value: '审核通过' },
                { id: 40, value: '审核不通过' }
            ],
            
        }
    },
    activated() {
        if (this.$route.query.update) {
            this.search();
        }
       
    },
    created(){
        let { orgType } = this.$baseMethod.getStore('roleOption');
        if (orgType === 0) {
            //只在总部禁用
            this.$message.error('当前账号为总部，暂无法查看或操作')
            this.btnDisabled = true;
        }
    },
    mounted() {
        this.search();
    },
    methods: {
        _arrayFomatter(a, b, c) {
            return arrayFomatter(a, b, c)
        },
        afterQuery(data) {
            return data.body || [];
        },
        changeRules(type){
            let reg;
            switch(type){
                case 'driverId':
                    reg = /^([0-9]*)$/;
                    if (!reg.test(this.searchOptions[type])) {
                        this.$message.error('限制纯数字');
                        this.searchOptions[type] = '';
                    }
                    break;
                case 'idNumber':
                    this.searchOptions[type] = this.searchOptions[type].toUpperCase()
                    reg = this.$regexList.get("idCardNumber");
                    if (!reg.test(this.searchOptions[type])) {
                        this.$message.error('限制数字及字母X（不区分大小写），15或18个字')
                        this.searchOptions[type] = '';
                    }
                    break;
                default: ;
            }
        },
        search() {
            this.$refs.table.search()
        },
        reset() {
            this.searchOptions = {
                driverId: '',
                name: '',
                idNumber: '',
                applyReasonType: ''
            }
            this.search()
        },
        // 跳转新增，编辑，详情
        toDetail(type, row) {
            let query = { type }
            if (row) {
                query.id = row.changeApplyId
            }
            this.$router.refresh({ name: 'driverTransferEdit', query });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    }
}
</script>

<style lang="scss" scoped>
.driverTransferControl {
    .ws-table-warp {
        border-radius: 0px 0px 8px 8px;
        padding: 24px !important;
        // min-height: calc(100vh - 176px) !important;
        /deep/.searchBtns{
            margin-right: 0 !important;
        }
        /deep/.option-box {
            margin-bottom: 20px !important;
        }
    }
}
</style>
