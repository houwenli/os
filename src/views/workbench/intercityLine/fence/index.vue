<!--围栏管理-->
<template>
    <div class="settle-payCompang-list">
        <ws-table-el ref="table" v-bind="tableConfig" :col="8">
            <template #search>
                <search-group>
                    <label for>名称：</label>
                    <el-input v-model.trim="searchOptions.fenceName" placeholder="围栏名称" clearable></el-input>
                </search-group>
                <search-group>
                    <label>创建时间：</label>
                    <ws-date-range :startTime.sync="searchOptions.createTimeStart" :endTime.sync="searchOptions.createTimeEnd" :picker-options="pickerOptions"></ws-date-range>
                </search-group>
                <search-group>
                    <label>修改时间：</label>
                    <ws-date-range :startTime.sync="searchOptions.updateTimeStart" :endTime.sync="searchOptions.updateTimeEnd" :picker-options="pickerOptions"></ws-date-range>
                </search-group>

                <!-- <search-group>
          <el-button-group v-if="oaPowerList.queryFencePage">
            <ws-enter-event>
              <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            </ws-enter-event>
            <ws-throttle>
              <el-button type="primary" class="table-column-header-button" @click="reset" icon="el-icon-refresh-left"></el-button>
            </ws-throttle>
          </el-button-group>
          <el-button style="margin-left: 20px" v-if="oaPowerList.addFence" @click="enterEdit('add', {})" plain>绘制围栏</el-button>
        </search-group> -->
            </template>

            <template #options>
                <el-button-group v-if="getModulePower('/workbench/fence').queryFencePage" style="float: right">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn" @click="reset" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
                <el-button style="margin-left: 20px" v-if="getModulePower('/workbench/fence').addFence" @click="enterEdit('add', {})" plain>绘制围栏</el-button>
            </template>

            <template>
                <ws-table-column-el align="center" prop="fenceId" label="围栏ID"></ws-table-column-el>
                <ws-table-column-el align="center" prop="fenceName" label="围栏名称"></ws-table-column-el>
                <ws-table-column-el align="center" label="围栏类型">
                    <template slot-scope="scope">
                        {{ scope.row.fenceType == 2 ? '多边形' : '圆形' }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="address" label="中心位置"></ws-table-column-el>
                <ws-table-column-el align="center" label="业务类型">
                    <template slot-scope="scope">
                        {{ scope.row.busType == 0 ? '专线' : '' }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="createTime" label="创建时间"></ws-table-column-el>
                <ws-table-column-el align="center" prop="updateTime" label="修改时间"></ws-table-column-el>
                <ws-table-column-el align="center" min-width="200" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="enterDetail('detail', scope.row)" style="color: #0088ff" v-if="getModulePower('/workbench/fence').queryFenceDetail">详情</el-button>
                        <el-button type="text" @click="enterEdit('edit', scope.row)" style="color: #0088ff" v-if="getModulePower('/workbench/fence').updateFence">
                            编辑
                        </el-button>
                        <el-button type="text" @click="deleteItem(scope.row)" style="color: #0088ff" v-if="getModulePower('/workbench/fence').removeFence">删除</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'intercityLineFence',
    data() {
        return {
            searchOptions: {
                fenceName: '',
                createTimeStart: null,
                createTimeEnd: null,
                updateTimeStart: null,
                updateTimeEnd: null
            },
            tableConfig: {
                topFixedRange: 55,
                filterColumns: false,
                lazyQuery: {
                    moduleName: '/workbench/fence',
                    op: {
                        selectList: 'queryFencePage',
                        selectCount: 'queryFencePageCount'
                    },
                    beforeQuery: this.beforeQuery
                }
            },
            op: {
                delete: 'removeFence'
            },
            moduleName: '/workbench/fence',
            pickerOptions: {
                disabledDate: this.disabledDate
            }
        };
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
        },
        enterEdit(type, row) {
            let query = {
                type,
                id: row.id,
                fenceId: row.fenceId
            };
            this.$router.refresh({ name: 'intercityLineFenceEdit', query });
        },
        enterDetail(type, row) {
            let query = {
                type,
                id: row.id,
                fenceId: row.fenceId
            };
            this.$router.refresh({ name: 'intercityLineFenceForm', query });
        },
        beforeQuery() {
            return {
                ...this.searchOptions
            };
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        disabledDate(time) {
            return time.getTime() > new Date(this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd 23:59:59'));
        },
        deleteItem(row) {
            let data = {
                data: JSON.stringify({
                    id: row.id,
                    fenceId: row.fenceId
                }),
                op: this.op.delete
            };
            this.$confirm(`确定要删除此条数据吗`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                let URL = this.getModuleUrl(this.op.delete);
                this.$axios(URL, data).then(res => {
                    let data = JSON.parse(res.data).anwserCode;
                    if (data.code == 1) {
                        this.$message.success('删除成功');
                        this.search();
                    } else {
                        this.$message.error(data.message);
                    }
                });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.ws-table__wrapper .ws-table__search .search_group {
    margin-right: 20px;
}
</style>
