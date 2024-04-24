<template>
    <div>
        <ws-table-el ref="table" v-bind="tableConfig" :col="8">
            <template #search>
                <search-group>
                    <label for>系统名称：</label>
                    <el-input v-model.trim="searchOptions.name" :maxlength="20" placeholder="请输入系统名称" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>权限控制：</label>
                    <el-select v-model="searchOptions.status" placeholder="请选择权限控制" :clearable="true">
                        <el-option v-for="item in statusList" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
            </template>

            <template #options>
                <div style="float: right">
                    <el-button-group v-if="powerControl(['selectList'])">
                        <el-button type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
                        <ws-throttle>
                            <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
                        </ws-throttle>
                    </el-button-group>
                    <el-button style="margin-left: 10px;width:96px" plain v-if="powerControl(['saveSystem'])" @click="changePath('add')" icon="el-icon-circle-plus">新增</el-button>
                </div>
            </template>

            <template>
                <ws-table-column-el width="305" prop="name" label="系统名称" show-overflow-tooltip></ws-table-column-el>
                <ws-table-column-el prop="sysCode" label="系统编码"></ws-table-column-el>
                <ws-table-column-el prop="status" label="权限控制">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == 1" class="start">启用</div>
                        <div v-if="scope.row.status == 2" class="stop">停用</div>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el label="操作" fixed="right" width="200">
                    <template slot-scope="scope">
                        <el-button v-if="powerControl(['selectSystemDetail'])" @click="changePath('detail', scope.row)" type="text" style="color: #0088ff">详情</el-button>
                        <el-button v-if="powerControl(['updateSystem'])" type="text" @click="changePath('edit', scope.row)" style="color: #0088ff">修改</el-button>
                        <el-button v-if="powerControl(['updateStatus'])" type="text" @click="updateStatus(scope.row)">
                            {{ scope.row.status === 1 ? '停用' : '启用' }}
                        </el-button>
                        <el-button v-if="scope.row.status === 2 && powerControl(['logicDelSystem'])" type="text" @click="deleteOp(scope.row)">删除</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
// 小程序OP管理
export default {
    name: 'appletMenu',
    data() {
        return {
            row: {},
            searchOptions: {
                name: '',
                // 小程序OP管理 固定传3
                sysType: 3,
                status: ''
            },
            tableConfig: {
                filterColumns: false,
                lazyQuery: {
                    moduleName: '/technology/systemInfo',
                    op: {
                        selectList: 'selectList',
                        selectCount: 'selectCount'
                    }
                }
            },
            showDelete: false,
            moduleName: '/technology/systemInfo',
            statusList: [
                { id: 1, value: '启用' },
                { id: 2, value: '停用' }
            ]
        };
    },

    methods: {
        search(type = 2) {
            this.$refs.table.search(type);
        },
        reset() {
            this.searchOptions = {
                name: '',
                sysType: '3',
                status: ''
            };
            this.search();
        },
        changePath(type, row) {
            this.$router.push({
                name: 'appletDetail',
                query: { type, id: row ? row.id : null, sysType: '3' }
            });
        },

        updateStatus(row) {
            this.$confirm(`确认${row.status == 1 ? '停用' : '启用'}`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
            }).then(() => {
                let data = {
                    data: JSON.stringify({
                        id: row.id,
                        status: row.status == 1 ? 2 : 1
                    }),
                    op: 'updateStatus'
                }
                this.$axios(this.getModuleUrl(data.op), data).then(res => {
                    if (res.code == 1) {
                        this.$message.success(`${row.status == 1 ? '停用' : '启用'}成功`);
                        this.search();
                    }
                }).catch(()=> {})
            }).catch(() => {
            })
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        deleteOp(op) {
            this.$confirm('确定删除此系统？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
            }).then(() => {
                let data = {
                    data: JSON.stringify({
                        id: op.id,
                    }),
                    op: 'logicDelSystem'
                }
                this.$axios(this.getModuleUrl(data.op), data).then(res => {
                    if (res.code == 1) {
                        this.$message.success('删除成功');
                        this.search();
                    }
                }).catch(()=> {})
            }).catch(() => {
            })
        }
    }
};
</script>

