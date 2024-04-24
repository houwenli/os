<template>
    <div>
        <template v-if="$route.meta.isNestRoute">
            <ws-table-el ref="table" v-bind="tableConfig" :col="8">
                <template #search>
                    <search-group>
                        <label for>系统名称：</label>
                        <el-input v-model.trim="searchOptions.name" :maxlength="20" placeholder="请输入系统名称" clearable></el-input>
                    </search-group>
                    <search-group>
                        <label for>业务类型：</label>
                        <el-select v-model="searchOptions.sysType" filterable placeholder="请选择业务类型" :clearable="true">
                            <el-option v-for="item in businessTypeList" :key="item.id" :label="item.value" :value="item.id"></el-option>
                        </el-select>
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
                        <el-button-group v-if="powerList.selectList">
                            <el-button type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
                            <ws-throttle>
                                <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
                            </ws-throttle>
                        </el-button-group>
                        <el-button style="margin-left: 10px" plain v-if="powerList.saveSystem" @click="changePath('add')" icon="el-icon-circle-plus">新增</el-button>
                    </div>
                </template>

                <template>
                    <ws-table-column-el width="305" prop="name" label="系统名称" show-overflow-tooltip></ws-table-column-el>
                    <ws-table-column-el width="305" prop="url" label="url"></ws-table-column-el>
                    <ws-table-column-el width="400" prop="sysDesc" label="描述" show-overflow-tooltip></ws-table-column-el>
                    <ws-table-column-el label="业务类型" :formatter="sysTypeFormat"></ws-table-column-el>
                    <ws-table-column-el prop="status" label="权限控制">
                        <template slot-scope="scope">
                            <div v-if="scope.row.status == 1" class="start">启用</div>
                            <div v-if="scope.row.status == 2" class="stop">停用</div>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el label="操作" fixed="right" width="150">
                        <template slot-scope="scope">
                            <el-button v-if="powerList.selectSystemDetail" @click="changePath('detail', scope.row)" type="text" style="color: #0088ff">详情</el-button>

                            <el-button v-if="powerList.updateSystem && powerList.selectSystemDetail" type="text" @click="changePath('edit', scope.row)" style="color: #0088ff">修改</el-button>
                            <el-button v-if="powerList.updateStatus" type="text" @click="updateStatus(scope.row)">
                                {{ scope.row.status === 1 ? '停用' : '启用' }}
                            </el-button>
                        </template>
                    </ws-table-column-el>
                </template>
            </ws-table-el>

            <el-dialog append-to-body title="提示" :visible.sync="showDelete" width="30%" center :lock-scroll="false">
                <span>确认{{ row.status == 1 ? '停用' : '启用' }}？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button style="width: 98px" @click="showDelete = false">取 消</el-button>
                    <el-button style="width: 98px" type="primary" @click="changeType()">确 定</el-button>
                </span>
            </el-dialog>
        </template>
        <router-view v-else />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    name: 'systemInfo',
    data() {
        return {
            row: {},
            searchOptions: {
                name: '',
                sysType: '',
                status: ''
            },
            tableConfig: {
                pageSizeList: [20, 50, 100],
                filterColumns: false,
                lazyQuery: {
                    moduleName: '/systemManage/systemInfo',
                    op: {
                        selectList: 'selectList',
                        selectCount: 'selectCount'
                    }
                }
            },
            showDelete: false,

            fromType: '',

            dataQuery: {},
            moduleName: '/systemManage/systemInfo',
            statusList: [
                { id: 1, value: '启用' },
                { id: 2, value: '停用' }
            ],
            // sysTypeList: []
            businessTypeList: []
        };
    },
    created() {
        this.getBusinessOptions();
    },
    methods: {
        ...mapActions('systemManage', ['getBusinessType']),
        //获取业务类型选项
        getBusinessOptions() {
            this.getBusinessType().then(res => {
                this.businessTypeList = res;
            });
        },
        search(type = 1) {
            this.$refs.table.search(type);
        },
        reset() {
            this.searchOptions = {
                name: '',
                sysType: '',
                status: ''
            };
            this.search();
            // this.$refs.table.reset();
        },
        changePath(type, row) {
            this.$router.push({
                name: 'systemInfoForm',
                query: { type, id: row ? row.id : null }
            });
            this.dataQuery = row;
            this.fromType = type;
            this.showSysDialog = true;
        },

        updateStatus(row) {
            this.showDelete = true;
            this.row = row;
        },
        //停用启用
        changeType() {
            let statusId;
            if (this.row.status == 1) {
                statusId = 2;
            } else {
                statusId = 1;
            }
            let data = {
                data: JSON.stringify({
                    id: this.row.id,
                    status: statusId
                }),
                op: 'updateStatus'
            };

            this.$axios(this.getModuleUrl(data.op), data).then(res => {
                this.showDelete = false;
                if (res.code == 1) {
                    if (this.row.status == 1) {
                        this.$message.success('停用成功');
                    } else {
                        this.$message.success('启用成功');
                    }
                    this.search();
                }
            });
        },
        sysTypeFormat(row) {
            const sysTypeObj = this.businessTypeList.find(item => item.id == row.sysType);
            return sysTypeObj ? sysTypeObj.value : '';
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    },
    mounted() {}
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
