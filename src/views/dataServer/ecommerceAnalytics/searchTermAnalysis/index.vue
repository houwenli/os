<template>
    <div class="app-container content-box">
        <ws-table-el ref="table" v-bind="tableConfig" :header-cell-style="{ background: '#F5F7FA' }">
            <template #search>
                <search-group>
                    <label for>时间：</label>
                    <!-- <ws-date-range :startTime.sync="searchOptions.start" :endTime.sync="searchOptions.end" :picker-options="pickerOptions"></ws-date-range> -->
                    <el-select v-model.trim="searchOptions.timeType" placeholder="请选择">
                        <el-option v-for="item in timeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>搜索词：</label>
                    <el-input v-model.trim="searchOptions.searchName" placeholder="请输入搜索词" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>用户：</label>
                    <el-select v-model.trim="searchOptions.userType" placeholder="请选择" clearable>
                        <el-option label="新用户" value="1"></el-option>
                        <el-option label="老用户" value="0"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>地区：</label>
                    <!-- <ws-city placeholder="选择省市" @change="orgApplyAreaChange" :data="orgProvinceCityList" ref="ws-city"
                        v-model="searchOptions.provinceId" :defaultProps="{ checkStrictly: false }" clearable></ws-city> -->
                    <el-select v-model="searchOptions.provinceId" clearable>
                        <el-option v-for="item in orgProvinceCityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>端口：</label>
                    <el-select v-model.trim="searchOptions.source" placeholder="请选择" clearable>
                        <el-option v-for="item in portOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </search-group>
            </template>
            <template #options>
                <div style="text-align: right;">
                    <el-button-group v-if="powerList.pageSearchAnalysis">
                        <el-button type="primary" icon="el-icon-search" @click="handleSearch()">查询</el-button>
                        <ws-throttle>
                            <el-button class="resetBtn" type="primary" icon="el-icon-refresh-left" @click="handleReset"></el-button>
                        </ws-throttle>
                    </el-button-group>
                    <ws-throttle><el-button v-if="powerList.exportSearchAnalysis" style="margin-left: 16px;" plain @click="exportExcel">导出</el-button></ws-throttle>
                </div>
            </template>
            <template>
                <el-table-column key="index" label="排名" type="index" width="75" :index="indexFormat"></el-table-column>
                <ws-table-column-el prop="searchName" label="搜索词"></ws-table-column-el>
                <ws-table-column-el prop="searchTotals" label="搜索总量"></ws-table-column-el>
                <ws-table-column-el prop="searchNumber" label="搜索人次">
                    <template slot="header">
                        搜索人次
                        <el-tooltip content="各端口/全部端口的搜索总人数，进行用户去重" placement="top-start" class="info-tooltip">
                                <i class="el-icon-question" :style="{color:'#333'}"></i>
                        </el-tooltip>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
import { portOptions, timeOptions } from "../constants";
export default {
    data() {
        return {
            moduleName: '/dataServer/searchTermAnalysis',
            op: {
                queryProvinces: 'queryAllProvinces',
                export: 'exportSearchAnalysis'
            },
            tableConfig: {
                loading: true,
                filterColumns: false,
                emptyModel: true,
                indexColumn: false,
                lazyQuery: {
                    moduleName: '/dataServer/searchTermAnalysis',
                    op: {
                        selectList: 'pageSearchAnalysis'
                    },
                },
                pageSizeList: [20, 50, 100]
            },
            searchOptions: {
                timeType: 1,
                searchName: '',
                source: '',
                userType: '',
                provinceId: ''
            },
            portOptions,
            timeOptions,
            orgProvinceCityList: [],
            pickerOptions: {
                disabledDate(time) {
                    let curDate = Date.now();
                    let three = 90 * 86400000;
                    let threeMonths = curDate - three;
                    let current =
                        new Date(new Date().toLocaleDateString()).getTime() +
                        (86400000 - 1000);
                    return time.getTime() > current || time.getTime() < threeMonths;
                }
            }
        }
    },
    created() {
        this.getProvinceCityList()
    },
    methods: {
        // 获取省市
        getProvinceCityList() {
            const URL = this.$getModuleUrl(this.moduleName, this.op.queryProvinces);
            let opt = {
                data: JSON.stringify({}),
                op: this.op.queryProvinces
            }
            this.$axios(URL,opt).then(res=>{
                let dataList = JSON.parse(res.data) || []
                this.orgProvinceCityList = dataList
            })
        },

        indexFormat(index) {
            return index + (this.$refs.table.currentPage - 1) * this.$refs.table.pageSize + 1;
        },

        handleSearch() {
            this.$refs.table.search()
        },

        handleReset() {
            this.$refs.table.reset()
        },
        // 导出
        exportExcel() {
            const reqData = {
                data: this.searchOptions,
                op: this.op.export
            };
            let URL = this.$getModuleUrl(this.moduleName, reqData.op);
            this.$axios(URL, reqData).then(res => {
                this.$message.success('文件正在导出，请到文件下载界面进行下载');
            });
        },
        renderHeader(h, { column }) {
            return h('div', column.label, h('el-tooltip', {
                props: {
                    content: '各端口/全部端口的搜索总人数，进行用户去重',
                    placement: 'top-start'
                },
                class: 'info-tooltip'
            }))
        },
    },
}
</script>

<style lang="scss" scoped>

</style>
