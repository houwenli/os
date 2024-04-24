<template>
    <ws-table-el ref="table" v-bind="tableConfig" :col="8">
        <template #search>
            <search-group>
                <label for>司机ID：</label>
                <el-input v-model.trim="searchOptions.driverId" placeholder="请输入司机ID" clearable></el-input>
            </search-group>
            <search-group>
                <label for>司机姓名：</label>
                <el-input v-model.trim="searchOptions.name" placeholder="请输入司机姓名" clearable></el-input>
            </search-group>
            <search-group>
                <label for>手机号码：</label>
                <el-input v-model.trim="searchOptions.phone" placeholder="请输入手机号码" clearable></el-input>
            </search-group>
            <search-group>
                <label for>更新时间：</label>
                <ws-date-range
                    :startTime.sync="searchOptions.updateTimeStart"
                    :endTime.sync="searchOptions.updateTimeEnd"
                    :pickerOptions="{ disabledDate: null }"
                ></ws-date-range>
            </search-group>
        </template>
        <template #searchBtns>
            <el-button-group v-if="powerList[op.selectList]">
                <ws-enter-event>
                    <el-button type="primary" icon="el-icon-search" @click="search()">查 询</el-button>
                </ws-enter-event>
                <ws-throttle>
                    <el-button type="primary" class="resetBtn" @click="reset()" icon="el-icon-refresh-left"></el-button>
                </ws-throttle>
            </el-button-group>
            <ws-throttle>
                <el-button v-if="powerList[op.add]" plain @click="toEdit('add')" icon="el-icon-circle-plus" style="margin-left: 20px">新增司机</el-button>
            </ws-throttle>
            <ws-throttle>
                <el-button plain v-if="powerList.refresh" @click="refresh" :loading="refreshLoading" style="margin-left: 20px">刷新API接口</el-button>
            </ws-throttle>
        </template>
        <template>
            <ws-table-column-el prop="driverId" label="司机ID"></ws-table-column-el>
            <ws-table-column-el prop="phone" label="手机号码"></ws-table-column-el>
            <ws-table-column-el prop="name" label="司机姓名"></ws-table-column-el>
            <ws-table-column-el prop="agencyName" label="所属机构"></ws-table-column-el>
            <ws-table-column-el label="上报状态">
                <template slot-scope="{row:{reportStatus}}">
                    <span>{{ reportStatus | reportStatusFilters }}</span>
                </template>
            </ws-table-column-el>
            <ws-table-column-el label="是否连续">
                <template slot-scope="{row:{coiled}}">
                    <span>{{ coiled ? '是' : '否' }}</span>
                </template>
            </ws-table-column-el>
            <ws-table-column-el label="防疫状态">
                <template slot-scope="{row:{status}}">
                    <span>{{ status | antiepidemicStatusFilters }}</span>
                </template>
            </ws-table-column-el>
            <ws-table-column-el prop="updateTime" label="更新时间"></ws-table-column-el>
            <ws-table-column-el label="操作" width="320">
                <template slot-scope="scope">
                    <el-button v-if="powerList[op.detail]" type="text" style="color: #0088ff" @click="toEdit('detail', scope.row)">详情</el-button>
                    <el-button type="text" v-if="powerList[op.changeStatus]" @click="enable(scope.row)" :loading="enableLoading === scope.row.id">
                        <span v-if="scope.row.status === 1">停止防疫</span>
                        <span v-else style="color: #0088ff">开启防疫</span>
                    </el-button>
                    <el-button type="text" v-if="powerList[op.del]" @click="handelDelte(scope.row)" :loading="delLoading === scope.row.id">删除</el-button>
                </template>
            </ws-table-column-el>
        </template>
    </ws-table-el>
</template>

<script>
export default {
    data() {
        return {
            moduleName: '/workbench/BRepidemicControl',
            searchOptions: {
                driverId: '',
                name: '',
                phone: '',
                updateTimeStart: '',
                updateTimeEnd: '',
            },
            tableConfig: {
                emptyModel: true,
                indexColumn: true,
                filterColumns: false,
                // layout: 'flow',
                // pageId: 'id',
                // multi: true,
                loading: true,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/workbench/BRepidemicControl',
                    op: {
                        selectList: 'selectList',
                        selectCount: 'selectCount',
                    },
                    // beforeQuery: this.beforeQuery,
                    // immediate: false,
                },
            },
            op: {
                selectList: 'selectList',
                selectCount: 'selectCount',
                add: 'monitorAdd',
                detail: 'monitorDetail',
                changeStatus: 'changeStatus',
                del: 'monitorDelete',
                refresh: 'refresh'
            },
            refreshLoading: false,
            enableLoading: null,
            delLoading: null
        }
    },
    methods: {
        refresh() {
            this.refreshLoading = true;
            let params = {
                data: JSON.stringify({}),
                op: this.op.refresh,
            };
            let URL = this.getModuleUrl(params.op);
            this.$axios(URL, params)
                .then(res => {
                    if (res.code === 1) {
                        this.$message.success('刷新成功！');
                        this.search();
                    }
                }).finally(() => {
                    this.refreshLoading = false;
                })
        },
        // 启/停用
        enable(row) {
            const { id, status } = row;
            let msg = status ? '停止' : '开启';
            this.$confirm(`是否${msg}防疫?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.enableLoading = id;
                    let params = {
                        data: JSON.stringify({
                            id,
                            status: status ? 0 : 1,
                        }),
                        op: this.op.changeStatus,
                    };
                    let URL = this.getModuleUrl(params.op);
                    this.$axios(URL, params)
                        .then(res => {
                            if (res.code === 1) {
                                this.$message.success('操作成功！');
                                this.search(1);
                            }
                        }).finally(() => {
                            this.enableLoading = null;
                        })
                })
                .catch(() => {});
        },
        // 删除
        handelDelte(row) {
            this.$confirm('此操作将删除司机, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    const { id } = row;
                    this.delLoading = id;
                    let params = {
                        data: JSON.stringify({
                            id,
                        }),
                        op: this.op.del,
                    };
                    let URL = this.getModuleUrl(params.op);
                    this.$axios(URL, params)
                        .then(res => {
                            if (res.code === 1) {
                                this.$message.success('删除成功！');
                                this.search(1);
                            }
                        }).finally(() => {
                            this.delLoading = null;
                        })
                })
                .catch(() => {});
        },
        search(type = 2) {
            this.$refs.table.search(type);
        },
        reset() {
            this.searchOptions = {
                driverId: '',
                name: '',
                phone: '',
                updateTimeStart: '',
                updateTimeEnd: '',
            };
            this.search();
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        toEdit(type, row) {
            let query = { type };
            if (row) {
                query.id = row.id;
            }
            this.$router.push({ name: 'monitorEdit', query });
        },
    }
}
</script>

<style>

</style>