<template>
    <div>
        <tabs moduleName="/workbench/assetInventory"></tabs>
        <ws-table-el align="left" ref="table" v-bind="tableConfig">
            <template #search>
                <search-group>
                    <label for>手机号：</label>
                    <el-input v-model.trim="searchOptions.phone" placeholder="请输入司机手机号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>创建时间：</label>
                    <ws-date-range
                        :startTime.sync="searchOptions.createTimeStart"
                        :endTime.sync="searchOptions.createTimeEnd"
                        :pickerOptions="{ disabledDate: null }"
                    ></ws-date-range>
                </search-group>
                <search-group>
                    <label for>车牌号：</label>
                    <el-input v-model.trim="searchOptions.carNumber" placeholder="请输入司机车牌号" clearable></el-input>
                </search-group>
            </template>
            <template #searchBtns>
                <el-button-group v-if="powerList.list">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn" @click="reset()" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
                <el-button v-if="powerList.export" style="margin-left: 20px" @click="derive" plain>导出</el-button>
            </template>
            <template #options>
                <el-button-group>
                    <el-button v-if="powerList.upload" type="primary" @click="batchImport">批量导入</el-button>
                </el-button-group>
            </template>
            <template>
                <ws-table-column-el align="center" prop="name" label="姓名"></ws-table-column-el>
                <ws-table-column-el align="center" prop="phone" label="手机号"></ws-table-column-el>
                <ws-table-column-el align="center" prop="agencyNumberName" label="归属机构"></ws-table-column-el>
                <ws-table-column-el align="center" prop="carNumber" label="车牌号"></ws-table-column-el>
                <ws-table-column-el align="center" prop="sexName" label="性别"></ws-table-column-el>
                <ws-table-column-el align="center" prop="age" label="年龄"></ws-table-column-el>
                <ws-table-column-el align="center" prop="carAge" label="车龄"></ws-table-column-el>
                <ws-table-column-el align="center" prop="greenCarName" label="是否新能源车"></ws-table-column-el>
                <ws-table-column-el align="center" prop="remainingYears" label="双证运营剩余年限"></ws-table-column-el>
                <ws-table-column-el align="center" prop="createTime" label="创建时间"></ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
import tabs from '../../components/tabs.vue';
export default {
    components: {
        tabs
    },
    data() {
        return {
            moduleName: '/workbench/assetInventory/infoReport/list',
            searchOptions: {
                phone: '',
                createTimeStart: '',
                createTimeEnd: '',
                carNumber: '',
            },
            tableConfig: {
                emptyModel: true,
                indexColumn: true,
                loading: true,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/workbench/assetInventory/infoReport/list',
                    op: {
                        selectList: 'list',
                        selectCount: 'count',
                    },
                },
            },
        }
    },
    methods: {
        search() {
            this.$refs.table.search();
        },
        reset() {
            this.searchOptions = {
                phone: '',
                createTimeStart: '',
                createTimeEnd: '',
                carNum: '',
            };
            this.search();
        },
        batchImport() {
            this.$router.push({ name: 'infoReportBatchImport' })
        },
        derive() {
            let param = {
                data: this.searchOptions,
                op: 'export'
            };
            let URL = this.powerList.export;
            this.$axios(URL, param).then(res => {
                this.$message.success('导出中，请稍后到文件中心下载！');
            });
        }
    }
};
</script>

<style lang="scss" scoped></style>
