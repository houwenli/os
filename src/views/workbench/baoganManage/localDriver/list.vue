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
                    <ws-city v-model="searchOptions.cityCodeList" level="2" :showCountry="true" :multiple="true"></ws-city>
                </search-group>
                <search-group>
                    <label for>包干状态：</label>
                    <el-select v-model="searchOptions.status" placeholder="请选择" clearable>
                        <el-option v-for="item in bgFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
            </template>
            <template #searchBtns>
                <el-button-group v-if="powerList.pageList || powerList.pageListDecrypt">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn" @click="reset()" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
                <el-button v-if="powerList.exportExpDriverVip" style="margin-left:20px" @click="derive" plain>导出</el-button>
            </template>
            <template #options>
                <el-button type="primary" v-if="powerList.batchFreeUploading" @click="batch()">批量赠送</el-button>
            </template>
            <template>
                <ws-table-column-el align="center" prop="driverId" label="司机ID"></ws-table-column-el>
                <ws-table-column-el align="center" prop="driverName" label="司机姓名"></ws-table-column-el>
                <ws-table-column-el align="center" prop="phone" label="手机号码"></ws-table-column-el>
                <ws-table-column-el align="center" prop="areaCityName" label="包干区域"></ws-table-column-el>
                <ws-table-column-el align="center" prop="status" label="包干状态">
                    <template slot-scope="scope">{{ scope.row.status | bgFilters }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="effictiveDays" label="有效包干总天数"></ws-table-column-el>
                <ws-table-column-el align="center" label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            v-if="powerList.detail || powerList.detailDecrypt"
                            style="color:#0088ff;"
                            @click="detail(scope.row.driverId)"
                        >详情</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import tabs from '../components/tabs.vue';
export default {
    components: { tabs },
    name: 'localDriverBg',
    data() {
        return {
            isFolder:false,
            searchOptions: {
                driverId: '',
                status: '',
                phone: '',
                isMultiCity: '',
                cityCodeList: []
            },
            tableConfig: {
                filterColumns: false,
                emptyModel: true,
                indexColumn: true,
                // layout: 'flow',
                loading: true,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/workbench/baoganManage/localDriver/list',
                    op: {
                        selectList: 'pageList',
                        selectCount: 'count',
                        encryptList: 'pageListDecrypt'
                    },
                    beforeQuery: this.beforeQuery,
                    immediate: false
                }
            },
            moduleName: '/workbench/baoganManage/localDriver/list'
        };
    },
    computed: {
        ...mapState({
            isMultiCityFilters: state => state.baogan.isMultiCityFilters,
            bgFilters: state => state.baogan.bgFilters,
            vipRuleFilters: state => state.baogan.vipRuleFilters
        })
    },
    activated() {
        this.search();
    },
    mounted() {
        this.search();
    },
    methods: {
        batch() {
            this.$router.push({ name: 'localDriverBatchImport' });
        },
        goMatch() {
            this.$router.push({ name: 'batchMatch' });
        },
        detail(id) {
            this.$router.push({ name: 'localDriverBgForm', query: { id, isEncrypt: this.$refs.table.isEncrypt } });
        },
        beforeQuery() {
            return this.searchOptions;
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
                status: '',
                phone: '',
                isMultiCity: '',
                cityCodeList: []
            };
            this.registerCityCode = [];
            this.search();
        },
        derive() {
            // 导出
            let param = {
                data: this.searchOptions,
                op: 'exportExpDriverVip'
            };
            let URL = this.powerList.exportExpDriverVip;
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
