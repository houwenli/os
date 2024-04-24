<template>
    <div>
        <ws-table-el ref="table" v-bind="tableConfig" :col="8">
            <template #search>
                <search-group>
                    <label for>状态：</label>
                    <el-select v-model="searchOptions.status" placeholder="请选择使用状态" clearable>
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="停用" value="0"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>Deeplink名称：</label>
                    <el-input v-model.trim="searchOptions.deeplinkName" placeholder="请输入内容模糊查询" clearable :maxlength="20"></el-input>
                </search-group>
            </template>
            <template #searchBtns>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                    <ws-throttle>
                        <el-button type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
                <ws-throttle>
                    <el-button v-if="true" icon="el-icon-circle-plus" class="btn-right btnStyle" @click="openDialog('add')">新增</el-button>
                </ws-throttle>
            </template>
            <template>
                <ws-table-column-el prop="deeplinkName" label="Deeplink名称"></ws-table-column-el>
                <ws-table-column-el prop="deeplinkPath" label="Deeplink路径"></ws-table-column-el>
                <ws-table-column-el prop="status" label="状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == 1" class="start">启用</div>
                        <div v-if="scope.row.status == 0" class="stop">停用</div>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el fixed="right" label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="oaPowerList.detail" @click="openDialog('detail', scope.row.id)" style="color: #0088ff">详情</el-button>
                        <el-button type="text" v-if="oaPowerList.updateDeepLink" @click="openDialog('updateDeepLink', scope.row.id)" style="color: #0088ff">编辑</el-button>
                        <el-button type="text" v-if="oaPowerList.updateStatus" @click="updateStatus(scope.row)" style="color: #0088ff">
                            {{ `${scope.row.status == 1 ? '停用' : '启用'}` }}
                        </el-button>
                        <el-button type="text" v-if="oaPowerList.deleteDeepLink && scope.row.status == 0" @click="deleteOp(scope.row.id)">删除</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template> 

<script>
export default {
    name: 'deeplinkConfig',
    data() {
        return {
            moduleName:'/technology/deeplinkMenu/passenger',
            searchOptions: {
                deeplinkName: '',
                status: null,
                suitPort:"0",
            },
            tableConfig: {
                emptyModel: true,
                filterColumns: false,
                loading: true,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/technology/deeplinkMenu/passenger',
                    op: {
                        selectList: 'select',
                        selectCount: 'count',
                    },
                },
            },
        };
    },
    methods: {
        updateStatus(row) {
            this.$confirm(`确认${row.status == 1 ? '停用' : '启用'}`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
            }).then(() => {
                let data = {
                    data: JSON.stringify({
                        id: row.id,
                        status: row.status == 1 ? 0 : 1
                    }),
                    op: 'updateStatus'
                }
                this.$axios(this.getModuleUrl(data.op), data).then(res => {
                    if (res.code == 1) {
                        if (row.status == 1) {
                            this.$message.success('停用成功');
                        } else {
                            this.$message.success('启用成功');
                        }
                        this.search();
                    }
                }).catch(()=> {})
            }).catch(() => {})
        },
        deleteOp(id) {
            this.$confirm('确定删除此Deeplink配置？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
            }).then(() => {
                let data = {
                    data: JSON.stringify({
                        id,
                    }),
                    op: 'deleteDeepLink'
                }
                this.$axios(this.getModuleUrl(data.op), data).then(res => {
                    if (res.code == 1) {
                        this.$message.success('删除成功');
                        this.search();
                    }
                }).catch(()=> {})
            }).catch(() => {})
        },
        openDialog(type,id) {
            this.$router.push({
                path: 'passengerForm',
                query: {
                    type,
                    id,
                },
            })
        },
        search() {
            this.$refs.table.search();
        },
        reset() {
            this.$refs.table.reset();
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
    created() {
    }
};
</script>

<style lang="scss" scoped>
.btnStyle {
    color: #f05259;
    border: 1px solid #f05259;
    width: 95px;
    margin-left: 10px;
}
</style>

