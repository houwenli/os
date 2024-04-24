<!--本地包干调账记录  -->
<template>
    <div class="bg-page" :class="isFolder?'addWidth':''">
        <div class="sidebar">
            <tabs @changeWidth="changeWidth"></tabs>
        </div>
        <ws-table-el align="left" ref="table" v-bind="tableConfig" :col="8">
            <template #search>
                <search-group>
                    <label for>司机ID：</label>
                    <el-input v-model.trim="searchOptions.driverId" placeholder="请输入司机ID" clearable maxlength="19"></el-input>
                </search-group>
                <search-group>
                    <label for>手机号码：</label>
                    <el-input v-model.trim="searchOptions.phone" placeholder="请输入手机号码" clearable maxlength="11"></el-input>
                </search-group>
                <search-group>
                    <label for>包干区域：</label>
                    <ws-city v-model="searchOptions.cityCodes" level="2" :showCountry="true" :multiple="true"></ws-city>
                </search-group>
                <search-group>
                    <label for>操作时间：</label>
                    <ws-date-range
                        :startTime.sync="searchOptions.startTime"
                        :endTime.sync="searchOptions.endTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                    ></ws-date-range>
                </search-group>
            </template>
            <template #searchBtns>
                <el-button-group v-if="powerList.adjustList">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn" @click="reset()" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
                <el-button v-if="powerList.adjustExport" style="margin-left:20px" @click="derive" plain>导出</el-button>
            </template>
            <template>
                <ws-table-column-el align="center" prop="driverId" label="司机ID"></ws-table-column-el>
                <ws-table-column-el align="center" prop="driverName" label="司机姓名"></ws-table-column-el>
                <ws-table-column-el align="center" prop="phone" label="手机号码"></ws-table-column-el>
                <ws-table-column-el align="center" prop="cityName" label="包干区域"></ws-table-column-el>
                <ws-table-column-el align="center" prop="beforeEndDate" label="原包干结束时间"></ws-table-column-el>
                <ws-table-column-el align="center" prop="afterEndDate" label="新包干结束时间"></ws-table-column-el>
                <ws-table-column-el align="center" prop="createUserName" label="操作人"></ws-table-column-el>
                <ws-table-column-el align="center" prop="createTime" label="操作时间"></ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import tabs from '../components/tabs.vue';
export default {
    components: { tabs },
    name: 'adjustRecordLocal',
    data() {
        return {
            isFolder:false,
            searchOptions: {
                driverId: '',
                phone: '',
                startTime: this.$baseMethod.formatData(new Date().getTime() - 3600 * 24 * 7 * 1000, 'yyyy-MM-dd 00:00:00'),
                endTime: this.$baseMethod.formatData(new Date().getTime(), 'yyyy-MM-dd 23:59:59'),
                cityCodes: []
            },
            tableConfig: {
                filterColumns: false,
                emptyModel: true,
                indexColumn: true,
                // layout: 'flow',
                loading: true,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/workbench/baoganManage/adjustRecord/local',
                    op: {
                        selectList: 'adjustList',
                        selectCount: 'adjustCount'
                    },
                    beforeQuery: this.beforeQuery,
                    immediate: false
                }
            },
            moduleName: '/workbench/baoganManage/adjustRecord/local'
        };
    },
    activated() {
        this.search();
    },
    mounted() {
        this.search();
    },
    methods: {
        beforeQuery() {
            let cityCode = []
            if(this.searchOptions.cityCodes.length){
                cityCode = this.searchOptions.cityCodes.map(item=>{
                    return item[0]? item[1]: 0
                })
            }
            return {
                ...this.searchOptions,
                cityCodes: cityCode
            };
        },
        search() {
            let reg = /^[0-9]*$/;
            if (!reg.test(this.searchOptions.driverId)) {
                this.$message.error('请输入正确的司机ID');
                return;
            }
            this.$refs.table.search();
        },
        reset() {
            this.searchOptions = {
                driverId: '',
                phone: '',
                startTime: this.$baseMethod.formatData(new Date().getTime() - 3600 * 24 * 7 * 1000, 'yyyy-MM-dd 00:00:00'),
                endTime: this.$baseMethod.formatData(new Date().getTime(), 'yyyy-MM-dd 23:59:59'),
                cityCodes: []
            };
            this.search();
        },
        derive() {
            // 导出
            let param = {
                data: this.beforeQuery(),
                op: 'adjustExport'
            };
            let URL = this.powerList.adjustExport;
            this.$axios(URL, param).then(res => {
                this.$message.success('导出中，请稍后到文件中心下载！');
            });
        },
        changeWidth(isFolder){
            this.isFolder = isFolder
        }
    }
};
</script>

<style lang="scss" scoped>
.bg-page{
    display:flex;
    transition: 0.5s;
    .sidebar{
        flex:1;
        margin-right:14px;
    }
}
.bg-page /deep/ .ws-table-warp {
    border-radius: 0 0 8px 8px;
    padding: 24px !important;
    width:89%;
}
.addWidth /deep/ .ws-table-warp {
    width:92%;
}
/deep/ .table-column-header-button {
    padding: 10px 12px;
}
</style>
