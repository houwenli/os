<!--计价管理-->
<template>
    <div class="settle-payCompang-list">
        <ws-table-el ref="table" v-bind="tableConfig" :col="8">
            <template #search>
                <search-group>
                    <label for>订单服务类型：</label>
                    <el-select v-model="searchOptions.rideType" filterable clearable placeholder="请选择">
                        <el-option v-for="item in requestRideTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>

                <!-- <search-group>
                <el-button-group v-if="oaPowerList.selectPage">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="table-column-header-button" @click="reset" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
                <el-button style="margin-left: 20px;" v-if="oaPowerList.save" @click="enterForm('add',{})" plain>新增</el-button>
            </search-group> -->
            </template>

            <template #options>
                <el-button-group v-if="getModulePower('/workbench/valuation').selectPage" style="float: right">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn reset" @click="reset" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                    <el-button class="add_btn" style="margin-left: 20px" v-if="getModulePower('/workbench/valuation').save" @click="enterForm('add', {})" plain>新增</el-button>
                </el-button-group>
            </template>

            <template>
                <ws-table-column-el align="center" prop="rideName" label="服务类型"></ws-table-column-el>
                <ws-table-column-el align="center" prop="createTime" label="创建时间"></ws-table-column-el>
                <ws-table-column-el align="center" min-width="250" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="enterForm('detail', scope.row)" v-if="getModulePower('/workbench/valuation').selectDetails" style="color: #0088ff">详情</el-button>
                        <el-button type="text" @click="enterForm('edit', scope.row)" v-if="getModulePower('/workbench/valuation').update" style="color: #0088ff">
                            修改
                        </el-button>
                        <el-button type="text" @click="deleteItem(scope.row)" v-if="getModulePower('/workbench/valuation').delete" style="color: #0088ff">删除</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
    name: 'intercityLineValuation',
    data() {
        return {
            props: {
                expandTrigger: 'hover',
                value: 'code',
                label: 'name',
                checkStrictly: false
            },
            searchOptions: {
                rideType: ''
            },
            tableConfig: {
                filterColumns: false,
                lazyQuery: {
                    moduleName: '/workbench/valuation',
                    op: {
                        selectList: 'selectPage',
                        selectCount: 'selectPageCount'
                    }
                }
            },
            op: {
                selectList: 'selectPage',
                selectCount: 'selectPageCount',
                detail: 'selectDetails',
                updateStatus: 'delete',
                update: 'update',
                detail: 'selectDetails'
            },
            moduleName: '/workbench/valuation'
        };
    },
    computed: {
        ...mapGetters('intercityLine', ['requestRideTypeFilters'])
    },
    activated() {
        this.search();
    },
    methods: {
        search() {
            this.$refs.table.search();
        },
        reset() {
            this.$refs.table.reset();
            this.searchOptions.rideType = '';
        },

        enterForm(type, row) {
            let query = {
                type,
                id: row.id
            };
            this.$router.refresh({ name: 'intercityLineValuationForm', query });
        },
        deleteItem(row) {
            let opt = {
                data: JSON.stringify({
                    id: row.id
                }),
                op: this.op.updateStatus
            };
            this.$confirm('确定删除此计价后，线路管理将无参考价！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                let URL = this.getModuleUrl(this.op.updateStatus);
                this.$axios(URL, opt).then(res => {
                    this.$message.success('删除成功');
                    this.search();
                });
            });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    }
};
</script>

<style scoped>
.add_btn {
    width: 95px;
    border-radius: 4px !important;
}

.reset {
    border-radius: 0px 4px 4px 0 !important;
}
</style>
