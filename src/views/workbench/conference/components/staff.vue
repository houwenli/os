<template>
    <div>
        <div class="staff">
            <ws-table-el ref="table" v-bind="tableConfig" @selection-change="onDistribution" :header-cell-style="{ background: '#F5F7FA' }">
                <template #search>
                    <search-group>
                        <label for>姓名：</label>
                        <el-input placeholder="请输入姓名" v-model="searchOptions.name" clearable></el-input>
                    </search-group>
                    <search-group>
                        <label for>机构名称：</label>
                        <el-input placeholder="请输入机构名称" v-model="searchOptions.deptName" clearable></el-input>
                    </search-group>
                </template>
                <template #searchBtns>
                    <el-button-group>
                        <ws-enter-event>
                            <el-button type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
                        </ws-enter-event>
                        <ws-throttle>
                            <el-button type="primary" class="table-column-header-button" @click="$refs.table.reset()" icon="el-icon-refresh-left"></el-button>
                        </ws-throttle>
                    </el-button-group>
                </template>
                <template>
                    <ws-table-column-el prop="name" label="姓名"></ws-table-column-el>
                    <ws-table-column-el prop="deptName" label="机构名称"></ws-table-column-el>
                </template>
            </ws-table-el>
            <ws-footer>
                <el-button  @click="goBack">返回</el-button>
                <el-button type="primary" @click="onSubmit">保存</el-button>
            </ws-footer> 
        </div>
    </div>
</template>
<script>
export default {
    name: 'APP',
    props:{
        visbile : {
            type: Number,
            default: () => null,
        }
    },
    data() {
        return {
            moduleName: '/workbench/conference/management',
            searchOptions: {
                name: '',
                deptName: '', // 员工姓名
                type:this.visbile
            },
            tableConfig: {
                multi: true,
                filterColumns: false,
                lazyQuery: {
                    moduleName: '/workbench/conference/management',
                    op: {
                        selectList: 'selectMeetingUser',
                        selectCount: 'selectMeetingUserCount',
                    },
                },
            },
            saveList:[],
        }
    },
    methods: {
        onDistribution(val) {
            this.saveList = val
        },
        onSubmit() {
            this.$emit('getDialogData',this.saveList,this.visbile)
            this.goBack()
        },
        goBack() {
            this.$emit('update:visbile', 0)
        },
        search() {
            this.$refs.table.search()
        },
        reset(){
            this.searchOptions = {
                name: '',
                deptName: '',
                type:this.visbile
            }
            this.search()
        },
    },
    created() {},
    mounted() {}
}
</script>
<style lang="scss" scoped>
.staff {
    margin-bottom: 64px;
}
</style>
