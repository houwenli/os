<template>
    <div>
        <ws-table-el ref="table" v-bind="tableConfig" :col="8" >
            <template #search>
                <search-group>
                    <label for>用户名称：</label>
                    <el-input v-model.trim="searchOptions.userName" placeholder="请输入操作人姓名" :maxlength="20" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>账号：</label>
                    <el-input v-model.trim="searchOptions.loginName" placeholder="请输入账号名称" :maxlength="20" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>模块名称：</label>
                    <el-input v-model.trim="searchOptions.businessModule" placeholder="请输入模块名称" :maxlength="20" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>操作时间：</label>
                    <ws-date-range :startTime.sync="searchOptions.createTimeStart" :endTime.sync="searchOptions.createTimeEnd"></ws-date-range>
                </search-group>
            </template>

            <template #options>
                <el-button-group v-if="powerList.selectOsLogList" style="float:right;">
                    <el-button type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
                    <ws-throttle>
                        <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
            </template>

            <template>
                <ws-table-column-el prop="userName" width="180" label="操作人"></ws-table-column-el>
                <ws-table-column-el prop="loginName" width="180" label="账号"></ws-table-column-el>
                <ws-table-column-el width="200" label="所属部门及职务">
                    <template slot-scope="scope">
                        <el-popover trigger="click" placement="top">
                            <p>{{ scope.row.depName }}</p>
                            <div slot="reference" class="name-wrapper">
                                {{scope.row.deptPositionName}}
                            </div>
                        </el-popover>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="ip" label="访问IP" width="230"></ws-table-column-el>
                <ws-table-column-el prop="businessModule" width="350" label="模块名称"></ws-table-column-el>
                <ws-table-column-el prop="opButton" label="操作类型"></ws-table-column-el>
                <!-- <ws-table-column-el prop="opDesc" label="操作描述" width="400" show-overflow-tooltip></ws-table-column-el> -->
                <ws-table-column-el prop="createTime" label="操作时间" fixed="right"></ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
export default {
    name: "operationLogList",
    data() {
        return {
            searchOptions: {
                userName: "",
                loginName: "",
                businessModule: "",
                createTimeStart: "",
                createTimeEnd: "",
            },
            tableConfig: {
                pageSizeList: [20, 50, 100],
                filterColumns: false,
                lazyQuery: {
                    moduleName: "/systemManage/operateLog",
                    op: {
                        selectList: "selectOsLogList"
                    },
                },
            },
            moduleName: "/systemManage/operateLog"
        };
    },
    methods: {
        search(type = 1) {
            this.$refs.table.search(type);
        },
        reset() {
            this.$refs.table.reset();
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
};
</script>

<style>
.name-wrapper {
    border-bottom: 1px solid #333;
    display: inline-block;
    cursor: pointer;
}
</style>
