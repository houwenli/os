<template>
    <div>
        <div class="Fapply-box" v-show="tabDisabled">
            <ws-table-el ref="table" v-bind="tableConfig" :col="8">
                <template #search>
                    <search-group>
                        <label for>服务类型：</label>
                        <el-select v-model="searchOptions.rideType" filterable clearable placeholder="请选择">
                            <el-option v-for="item in rideTypeFilters" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </search-group>
                    <search-group>
                        <label for>企业名称：</label>
                        <el-input v-model.trim="searchOptions.channelName" placeholder="请输入企业名称" clearable></el-input>
                    </search-group>
                    <search-group>
                        <label for>状态：</label>
                        <el-select v-model="searchOptions.status" filterable clearable placeholder="请选择">
                            <el-option label="启用" :value="10"></el-option>
                            <el-option label="停用" :value="20"></el-option>
                        </el-select>
                    </search-group>
                    <!-- <search-group>
                        <el-button-group v-if="getModulePower('/workbench/mixedOrder').selectPage">
                            <ws-enter-event>
                                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                            </ws-enter-event>
                            <ws-throttle>
                                <el-button type="primary" class="table-column-header-button" @click="reset" icon="el-icon-refresh-left"></el-button>
                            </ws-throttle>
                        </el-button-group>
                        <el-button-group v-if="getModulePower('/workbench/mixedOrder').save">
                            <ws-throttle>
                                <el-button style="margin-left: 20px" @click="clickHandle('newly')">新增</el-button>
                            </ws-throttle>
                        </el-button-group>
                    </search-group> -->
                </template>

                <template #options>
                    <div style="float: right">
                        <el-button-group v-if="getModulePower('/workbench/BRcharterPrice').selectPage">
                            <ws-enter-event>
                                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                            </ws-enter-event>
                            <ws-throttle>
                                <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
                            </ws-throttle>
                        </el-button-group>
                        <el-button-group v-if="getModulePower('/workbench/BRcharterPrice').save">
                            <ws-throttle>
                                <el-button class="add_btn" plain style="margin-left: 20px" @click="clickHandle('newly')">新增</el-button>
                            </ws-throttle>
                        </el-button-group>
                    </div>
                </template>

                <template>
                    <ws-table-column-el align="center" prop="rideName" label="服务类型"></ws-table-column-el>
                    <ws-table-column-el align="center" prop="channelName" label="企业名称"></ws-table-column-el>
                    <ws-table-column-el align="center" label="包干司机收入 (%)">
                        <template slot-scope="scope">
                            {{ (scope.row.feeParam && scope.row.feeParam.vipDriverRatio) || '--' }}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" label="本地司机收入 (%)">
                        <template slot-scope="scope">
                            {{ (scope.row.feeParam && scope.row.feeParam.localDriverRatio) || '--' }}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="d" label="非包干司机收入 (%)">
                        <template slot-scope="scope">
                            {{ (scope.row.feeParam && scope.row.feeParam.driverRatio) || '--' }}
                        </template>
                    </ws-table-column-el>
                    <!-- <ws-table-column-el align="center" prop="e" label="运力商/司机收入（%）">
                    <template slot-scope="scope">
                        {{ (scope.row.feeParam && scope.row.feeParam.transportDriverRatio) || '--' }}
                    </template>
                </ws-table-column-el> -->
                    <ws-table-column-el align="center" prop="status" label="状态">
                        <template slot-scope="scope">
                            <el-tag size="small" :type="{ 10: 'success', 20: 'danger' }[scope.row.status]">{{ scope.row.status == 10 ? '已启用' : '已停用' }}</el-tag>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="createTime" label="创建时间"></ws-table-column-el>
                    <ws-table-column-el align="center" label="操作" width="240">
                        <template slot-scope="scope">
                            <el-button type="text" v-if="getModulePower('/workbench/BRcharterPrice').selectDetils" style="color: #0088ff" @click="clickHandle('detail', scope.row)">详情</el-button>
                            <el-button type="text" v-if="scope.row.status == 20 && getModulePower('/workbench/BRcharterPrice').update" style="color: #666" @click="clickHandle('edit', scope.row)">
                                修改
                            </el-button>
                            <el-button type="text" v-if="getModulePower('/workbench/BRcharterPrice').save" style="color: #666" @click="clickHandle('copy', scope.row)">复制</el-button>
                            <el-button
                                type="text"
                                v-if="scope.row.status == 10 && getModulePower('/workbench/BRcharterPrice').updateStatus"
                                @click="updateStatus(scope.row, 20)"
                                style="color: #0088ff; text-decoration: underline"
                            >
                                停用
                            </el-button>
                            <el-button
                                type="text"
                                v-if="scope.row.status == 20 && getModulePower('/workbench/BRcharterPrice').updateStatus"
                                @click="updateStatus(scope.row, 10)"
                                style="color: #0088ff; text-decoration: underline"
                            >
                                启用
                            </el-button>
                            <el-button type="text" style="color: #f56c6c" v-if="scope.row.status == 20 && getModulePower('/workbench/BRcharterPrice').delete" @click="updateStatus(scope.row, -1)">
                                删除
                            </el-button>
                        </template>
                    </ws-table-column-el>
                </template>
            </ws-table-el>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
    name: 'chartervaluation',
    data() {
        return {
            serialType: 3,
            searchOptions: {
                rideType: null,
                channelName: null,
                status: null,
            },
            tableConfig: {
                topFixedRange: 55,
                filterColumns: false,
                loading: true,
                pageId: 'id',
                lazyQuery: {
                    moduleName: '/workbench/BRcharterPrice',
                    op: {
                        selectList: 'selectPage',
                        selectCount: 'selectCount',
                    },
                    beforeQuery: this.beforeQuery,
                },
            },
            moduleName: '/workbench/BRcharterPrice',
            tabDisabled: true,
        };
    },
    computed: {
        ...mapGetters('enterprisemanagement', ['rideTypeFilters']),
        userInfo() {
            const userInfo = JSON.parse(window.sessionStorage.getItem('_ccmUser'));
            return userInfo;
        },
    },
    activated() {
        this.search();
        let { orgType } = this.$baseMethod.getStore('roleOption');
        if (orgType === 0) {
            this.tabDisabled = false;
        } else {
            this.tabDisabled = true;
        }
    },
    methods: {
        search() {
            this.$refs.table.search();
        },
        reset() {
            this.$refs.table.reset();
        },
        beforeQuery() {
            return this.searchOptions;
        },
        // 停用/启用/删除操作
        updateStatus(row, status) {
            let msg =
                {
                    10: '启用',
                    20: '停用',
                    '-1': '删除',
                }[status] || status;
            let op = '';
            let params = {};
            switch (status) {
                case 10:
                    op = 'updateStatus';
                    params = {
                        data: JSON.stringify({
                            id: row.id,
                            status: status,
                        }),
                        op: op,
                    };
                    break;
                case 20:
                    op = 'updateStatus';
                    params = {
                        data: JSON.stringify({
                            id: row.id,
                            status: status,
                        }),
                        op: op,
                    };
                    break;
                default:
                    op = 'delete';
                    params = {
                        data: JSON.stringify({
                            id: row.id,
                        }),
                        op: op,
                    };
            }
            this.$confirm(`确定${msg}此计价？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true,
            }).then(() => {
                let loading = this.$loading({
                    lock: true,
                    text: '加载中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                });

                let URL = this.getModuleUrl(params.op);
                this.$axios(URL, params)
                    .then(res => {
                        loading.close();
                        this.$message.success('操作成功');
                        this.search();
                    })
                    .catch(err => {
                        loading.close();
                    });
            });
        },
        //新增,编辑和详情点击功能
        clickHandle(type, row) {
            if (type !== 'newly') {
                var query = {
                    id: row.id,
                    type,
                };
            } else {
                var query = {
                    type,
                };
            }
            this.$router.refresh({ name: 'charterValuationForm', query });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
};
</script>

<style lang="scss" scoped>
.add_btn {
    width: 95px;
}
.serial_type {
    text-align: center;
    margin-top: 50px;
    margin-bottom: 16px;
}
.ws-table-warp {
    padding: 24px 24px 16px 24px !important;
}
.Fapply-box {
    min-height: 100%;
    width: 100%;
    background: #ffffff;
    border-radius: 8px;
}
</style>
