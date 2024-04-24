<template>
    <div>
        <ws-table-el ref="table" v-bind="tableConfig"  @selection-change="onDistribution" :header-cell-style="{ background: '#F5F7FA' }">
            <template #search>
                <search-group>
                    <label for>城市：</label>
                    <ws-city
                        v-model="codeList"
                        :defaultProps="{checkStrictly:true}"
                    ></ws-city>
                </search-group>
                <search-group>
                    <label for>机构名称：</label>
                    <el-input placeholder="请输入机构名称" v-model="searchOptions.simpleName" clearable></el-input>
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
                <ws-table-column-el prop="name" label="机构名称"></ws-table-column-el>
                <ws-table-column-el prop="priority" label="机构类型"></ws-table-column-el>
                <ws-table-column-el prop="submitProvinceName" label="机构所在城市">
                    <template slot-scope="scope">
                        {{scope.row.submitProvinceName + '-' + scope.row.submitCityName + '-' + scope.row.submitAreaName}}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="statusName" label="机构状态"></ws-table-column-el>
            </template>
        </ws-table-el>
        <ws-footer>
            <el-button  @click="goBack">返回</el-button>
            <el-button type="primary" @click="onSubmit">保存</el-button>
        </ws-footer>  
    </div>
</template>
<script>
export default {
    name: 'APP',
    data() {
        return {
            moduleName: '/workbench/conference/management',
            searchOptions: {
                simpleName: '',
                submitProvinceCode:'',
                submitCityCode:'',
                submitAreaCode:'',
            },
            codeList: [],
            saveList:[],
            tableConfig: {
                multi: true,
                filterColumns: false,
                lazyQuery: {
                    moduleName: '/workbench/conference/management',
                    op: {
                        selectList: 'orgList',
                        selectCount: 'orgCount',
                    },
                    beforeQuery: this.beforeQuery
                },
                
            },
        }
    },
    areaList() {
      return this.dataOptions.administrationType == 1 ? this.provinceCityList : this.regionList
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
        beforeQuery(){
            this.searchOptions.submitProvinceCode = this.codeList ? this.codeList[0] : ''
            this.searchOptions.submitCityCode = this.codeList ? this.codeList[1] : ''
            this.searchOptions.submitAreaCode = this.codeList ? this.codeList[2] : ''
            return this.searchOptions
        },
        reset(){
            this.searchOptions = {
                simpleName: ''
            },
            this.search()
        },
    },
    created() {},
    mounted() {}
}
</script>
<style lang="scss" scoped></style>
