<template>
    <div class="bg-page" :class="isFolder ? 'addWidth' : ''">
        <div class="sidebar">
            <tabs @changeWidth="changeWidth"></tabs>
        </div>
        <ws-table-el align="left" ref="table" v-bind="tableConfig" :col="8" labelWidth="96px">
            <template #search>
                <search-group>
                    <label for>流水号：</label>
                    <el-input v-model.trim="searchOptions.id" placeholder="请输入流水号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>司机ID：</label>
                    <el-input v-model.trim="searchOptions.driverId" placeholder="请输入司机ID" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>手机号码：</label>
                    <el-input v-model.trim="searchOptions.phone" placeholder="请输入手机号码" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>业务单号：</label>
                    <el-input v-model.trim="searchOptions.bussinessOrderNum" placeholder="请输入业务单号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>变动时间：</label>
                    <ws-date-range
                        class="create-time"
                        :startTime.sync="searchOptions.startTime"
                        :endTime.sync="searchOptions.endTime"
                        :pickerOptions="{ disabledDate: null }"
                    ></ws-date-range>
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
                <ws-table-column-el prop="id" label="流水号"></ws-table-column-el>
                <ws-table-column-el prop="bussinessOrderNum" label="业务单号"></ws-table-column-el>
                <ws-table-column-el prop="driverId" label="司机ID"></ws-table-column-el>
                <ws-table-column-el prop="name" label="司机姓名"></ws-table-column-el>
                <ws-table-column-el prop="phone" label="手机号码"></ws-table-column-el>
                <ws-table-column-el prop="platformRate" label="平台费收入(%)"></ws-table-column-el>
                <ws-table-column-el prop="amount" label="变动金额(元)">
                    <template slot-scope="scope">
                        <span>{{['+', '-'][scope.row.serialType-1]}}</span>
                        <span>{{ scope.row.amount | regFenToYuan }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="createTime" label="变动时间"></ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import tabs from '../../components/tabs'
export default {
    components: { tabs },
    data() {
        return {
            isFolder: false,
            searchOptions: {
                id: '',
                driverId: '',
                phone: '',
                bussinessOrderNum: '',
                startTime: this.$baseMethod.getBeforeDay(-6),
                endTime: this.$baseMethod.getBeforeDay()
            },
            tableConfig: {
                emptyModel: true,
                indexColumn: true,
                loading: true,
                filterColumns: false,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/workbench/baoganManage/accountDetail',
                    op: {
                        selectList: 'flowPageList',
                        selectCount: 'flowCount',
                        encryptList: 'flowPageListDecrypt'
                    },
                    beforeQuery: this.beforeQuery,
                    // afterQuery:this.afterQuery,
                }
            },
            moduleName: '/workbench/baoganManage/accountDetail',
            op: {
                listDecrypt: 'flowPageListDecrypt',
                list: 'flowPageList',
                fileExport: 'exportExpDriverCommissionAccountFlow'
            },
            exportLoading: false
        }
    },
    computed: {
        ...mapState(['']),
    },

    methods: {
        beforeQuery() {
            return this.getParams()
        },
        getParams() {
            const { startTime, endTime } = this.searchOptions 
            return {
                ...this.searchOptions,
                startTime,
                endTime
            }
        },
        search() {
            this.$refs.table.search()
        },
        reset() {
            this.searchOptions = {
                id: '',
                driverId: '',
                phone: '',
                bussinessOrderNum: '',
                startTime: this.$baseMethod.getBeforeDay(-6),
                endTime: this.$baseMethod.getBeforeDay()
            }
            this.search()
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
        }
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
