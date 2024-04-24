<template>
    <div class="bg-page" :class="isFolder ? 'addWidth' : ''">
        <div class="sidebar">
            <tabs @changeWidth="changeWidth"></tabs>
        </div>
        <ws-table-el align="left" ref="table" v-bind="tableConfig" :col="8" labelWidth="96px">
            <template #search>
                <search-group>
                    <label for>司机ID：</label>
                    <el-input v-model.trim="searchOptions.driverId" placeholder="请输入司机ID" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>手机号码：</label>
                    <el-input v-model.trim="searchOptions.phone" placeholder="请输入手机号码" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>套餐状态：</label>
                    <el-select v-model="searchOptions.packageStatus" placeholder="请选择" collapse-tags clearable>
                        <el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
            </template>
            <template #searchBtns>
                <el-button-group v-if="powerList[op.list] || powerList[op.listDecrypt]">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn" @click="reset()" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
                <ws-throttle>
                    <el-button v-if="powerList[op.fileExport]" style="margin-left: 20px" @click="fileExport" plain :loading="exportLoading">
                        导出
                    </el-button>
                </ws-throttle>
            </template>
            <template>
                <ws-table-column-el prop="driverId" label="司机ID"></ws-table-column-el>
                <ws-table-column-el prop="name" label="司机姓名"></ws-table-column-el>
                <ws-table-column-el prop="phone" label="手机号码"></ws-table-column-el>
                <ws-table-column-el prop="packageStatus" label="套餐状态">
                    <template slot-scope="scope">
                        <span>{{ formatLable(scope.row.packageStatus, statusOptions) }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="currentAmount" label="剩余总金额(元)">
                    <template slot-scope="scope">
                        <span>{{ scope.row.currentAmount | regFenToYuan }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el label="操作" fixed="right" width="80px">
                    <template slot-scope="scope">
                        <el-button
                            v-if="powerList[op.detail] || powerList[op.detailDecrypt]"
                            type="text"
                            style="color: #0088ff"
                            @click="handleDetail(scope.row)">
                            详情
                        </el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { formatLable } from '@/utils/util.js'
import tabs from '../../components/tabs'
export default {
    components: { tabs },
    data() {
        return {
            isFolder: false,
            searchOptions: {
                driverId: '',
                phone: '',
                packageStatus: '',
            },
            tableConfig: {
                emptyModel: true,
                indexColumn: true,
                loading: true,
                filterColumns: false,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/workbench/baoganManage/accountMag',
                    op: {
                        selectList: 'pageList',
                        selectCount: 'count',
                        encryptList: 'pageListDecrypt'
                    },
                    beforeQuery: this.beforeQuery,
                    // afterQuery:this.afterQuery,
                    immediate: true
                }
            },
            moduleName: '/workbench/baoganManage/accountMag',
            op: {
                list: 'pageList',
                listDecrypt: 'pageListDecrypt',
                detail: 'accountDetail',
                detailDecrypt: 'accountDetailDecrypt',
                fileExport: 'exportExpDriverCommissionAccount'
            },
            statusOptions: [
                { id: 1, value: '有效' },
                { id: 0, value: '无效' },
            ],
            exportLoading: false
        }
    },
    computed: {
        // ...mapState(['']),
    },
    // activated() {
    //     this.search()
    // },

    methods: {
        beforeQuery() {
            return this.getParams()
        },
        getParams() {
            const params = { ...this.searchOptions }
            return params
        },
        search() {
            this.$refs.table.search()
        },
        reset() {
            this.searchOptions = {
                driverId: '',
                phone: '',
                packageStatus: '',
            }
            this.search()
        }, 
        // 详情
        handleDetail(row) {
            const { driverId } = row
            this.$router.push({
                name: 'accountMagDetail',
                query: { driverId, isEncrypt: this.$refs.table.isEncrypt }
            })
        },
        // 导出
        fileExport() {
            let param = {
                data: this.getParams(),
                op: this.op.fileExport
            };
            const url = this.$getModuleUrl(this.moduleName, param.op);
            this.exportLoading = true
            this.$axios(url, param).then(res => {
                this.$message.success('导出中，请稍后到文件中心下载！');
                this.exportLoading = false
            }).catch(() => {
                this.exportLoading = false
            })
        },
        changeWidth(isFolder) {
            this.isFolder = isFolder
        },
        formatLable: formatLable
    }
}
</script>

<style lang="scss" scoped>

.bg-page {
    display: flex;
    transition: 0.5s;
    .sidebar {
        flex: 1;
        margin-right: 14px;
    }
}
.bg-page /deep/ .ws-table-warp {
    border-radius: 0 0 8px 8px;
    padding: 24px !important;
    width: 89%;
}
.addWidth /deep/ .ws-table-warp {
    width: 92%;
}
/deep/ .table-column-header-button {
    padding: 10px 12px;
}
/deep/ .el-dialog__header {
    text-align: center;
}
/deep/ .el-textarea {
    width: 350px;
}

.create-time {
    /deep/.el-date-editor {
        width: 100% !important;
    }
}
</style>
