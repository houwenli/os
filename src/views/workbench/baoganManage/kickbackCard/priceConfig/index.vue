<template>
    <div class="bg-page" :class="isFolder ? 'addWidth' : ''">
        <div class="sidebar">
            <tabs @changeWidth="changeWidth"></tabs>
        </div>
        <ws-table-el align="left" ref="table" v-bind="tableConfig" :col="8" labelWidth="96px" @selection-change="selectionChange">
            <template #search>
                <search-group>
                    <label for>套餐城市：</label>
                    <ws-city v-model="searchOptions.cityCode" :defaultProps="{checkStrictly: true}" level="2"></ws-city>
                </search-group>
                <search-group>
                    <label for>生效时间：</label>
                    <ws-date-range
                        class="create-time"
                        :startTime.sync="searchOptions.startTimeStart"
                        :endTime.sync="searchOptions.endTimeEnd"
                        :pickerOptions="{ disabledDate: null }"
                    ></ws-date-range>
                </search-group>
                <search-group>
                    <label for>功能状态：</label>
                    <el-select v-model="searchOptions.packageStatus" placeholder="请选择" collapse-tags clearable>
                        <el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>创建时间：</label>
                    <ws-date-range
                        class="create-time"
                        :startTime.sync="searchOptions.createTimeStart"
                        :endTime.sync="searchOptions.createTimeEnd"
                        :pickerOptions="{ disabledDate: null }"
                    ></ws-date-range>
                </search-group>
                <search-group>
                    <label for>修改时间：</label>
                    <ws-date-range
                        class="create-time"
                        :startTime.sync="searchOptions.updateTimeStart"
                        :endTime.sync="searchOptions.updateTimeEnd"
                        :pickerOptions="{ disabledDate: null }"
                    ></ws-date-range>
                </search-group>
            </template>
            <template #options>
                <el-button v-if="powerList[op.add]" type="primary" style="margin-left: 20px" @click="handleAdd">新增</el-button>
                <el-dropdown @command="handleBatch" v-if="powerList[op.import] || powerList[op.isUse]">
                    <el-button type="primary" style="margin-left: 20px">
                        批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a" v-if="powerList[op.import]">批量导入</el-dropdown-item>
                        <el-dropdown-item command="b" v-if="powerList[op.isUse]">批量上架</el-dropdown-item>
                        <el-dropdown-item command="c" v-if="powerList[op.isUse]">批量下架</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown @command="handleOneKey" v-if="powerList[op.isUse]">
                    <el-button type="primary" style="margin-left: 20px">
                        一键操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a">一键上架</el-dropdown-item>
                        <el-dropdown-item command="b">一键下架</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </template>
            <template #searchBtns>
                <el-button-group v-if="powerList[op.list]">
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
                <ws-table-column-el prop="cityName" label="省份-城市"></ws-table-column-el>
                <ws-table-column-el prop="startTime" label="开始时间"></ws-table-column-el>
                <ws-table-column-el prop="endTime" label="结束时间"></ws-table-column-el>
                <ws-table-column-el prop="statusAndTime" label="功能状态">
                    <!-- <template slot-scope="scope">
                        <span>{{ formatLable(scope.row.packageStatus, statusOptions) }}</span>
                    </template> -->
                </ws-table-column-el>
                <ws-table-column-el prop="userName" label="创建人"></ws-table-column-el>
                <ws-table-column-el prop="createTime" label="创建时间"></ws-table-column-el>
                <ws-table-column-el prop="updateTime" label="修改时间"></ws-table-column-el>
                <ws-table-column-el label="操作" fixed="right" min-width="140">
                    <template slot-scope="scope">
                        <el-button v-if="powerList[op.detail]" type="text" style="color: #0088ff" @click="handleDetail(scope.row)">详情</el-button>
                        <el-button
                            v-if="powerList[op.edit] && ['已下架','待上架'].includes(scope.row.statusAndTime)"
                            type="text"
                            style="color: #0088ff"
                            @click="handleEdit(scope.row)">
                            修改
                        </el-button>
                        <el-button
                            v-if="powerList[op.isUse] && ['已下架','待上架'].includes(scope.row.statusAndTime)"
                            type="text"
                            style="color: #0088ff"
                            @click="handleUpdate(scope.row, 1)">
                            上架
                        </el-button>
                        <el-button
                            v-if="powerList[op.isUse] && ['已上架（生效中）','已上架（待生效）'].includes(scope.row.statusAndTime)"
                            type="text"
                            style="color: #0088ff"
                            @click="handleUpdate(scope.row, 0)">
                            下架
                        </el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import tabs from '../../components/tabs'
import { formatLable } from '@/utils/util.js'
export default {
    components: { tabs },
    data() {
        return {
            isFolder: false,
            searchOptions: {
                cityCode: '',
                startTimeStart: '',
                endTimeEnd: '',
                createTimeStart: this.$baseMethod.formatData(this.$baseMethod.getBeforeDay(-6), 'yyyy-MM-dd') + ' 00:00:00',
                createTimeEnd: this.$baseMethod.formatData(this.$baseMethod.getBeforeDay(), 'yyyy-MM-dd') + ' 23:59:59',
                updateTimeStart: '',
                updateTimeEnd: '',
                packageStatus: ''
            },
            tableConfig: {
                emptyModel: true,
                indexColumn: true,
                loading: true,
                filterColumns: false,
                multi: true,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/workbench/baoganManage/priceConfig',
                    op: {
                        selectList: 'pageQuery',
                        selectCount: 'queryCount'
                    },
                    beforeQuery: this.beforeQuery,
                    afterQuery:this.afterQuery,
                    immediate: true
                }
            },
            moduleName: '/workbench/baoganManage/priceConfig',
            op: {
                list: 'pageQuery',
                add: 'save',
                edit: 'update',
                detail: 'queryDetail',
                import: 'importData',
                isUse: 'updatepackageStatus',
                fileExport: 'export'
            },
            statusOptions: [
                // 0  待上架  4  已下架  1 已上架(待生效) 2 已上架（生效中） 3 已上架（时间失效）
                { id: 0, value: '待上架' },
                { id: 1, value: '已上架(待生效)' },
                { id: 2, value: '已上架(生效中)' },
                { id: 4, value: '已下架' }
            ],
            selections: [],
            exportLoading: false
        }
    },
    computed: {
        ...mapState(['']) 
    },
    activated() {
        if (this.$route.params.Refresh) {
            this.search()
        }
    },

    methods: {
        beforeQuery() {
            return this.getParams()
        },
        afterQuery(datas) {
            this.selections = []
            this.$refs.table.clearSelection()
            return datas
        },
        getParams() {
            const { packageStatus } = this.searchOptions
            return { ...this.searchOptions, statusAndTime: packageStatus }
        },
        search() {
            this.$refs.table.search()
        },
        reset() {
            this.searchOptions = {
                cityCode: '',
                startTimeStart: '',
                endTimeEnd: '',
                createTimeStart: this.$baseMethod.formatData(this.$baseMethod.getBeforeDay(-6), 'yyyy-MM-dd') + ' 00:00:00',
                createTimeEnd: this.$baseMethod.formatData(this.$baseMethod.getBeforeDay(), 'yyyy-MM-dd') + ' 23:59:59',
                updateTimeStart: '',
                updateTimeEnd: '',
                packageStatus: ''
            }
            this.search()
        }, 
        // 新增
        handleAdd() {
            this.toForm('add')
        },
        // 详情
        handleDetail(row) {
            this.toForm('detail', row.id)
        },
        // 修改
        handleEdit(row) {
            this.toForm('edit', row.id)
        },
        toForm(type, id) {
            const query = { type }
            if (id) { query.id = id }
            this.$router.push({
                name: 'priceConfigEdit',
                query
            })  
        },
        // 上下架
        handleUpdate(row, type) {
            const msg = ['是否确认下架？确定后下架数据', '是否确认上架？确定后上架数据'][type]
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    const { id } = row
                    // 0待上架、1已上架、4已下架
                    let status = [4, 1][type]
                    
                    this.updateStatus([id], status, '操作成功！')
                }).catch(() => {          
            });
        },
        // 批量操作
        handleBatch(e) {
            // a: '批量导入', b: '批量上架', c: '批量下架' 
            if (e === 'a') {
                // 批量导入
                this.$router.push({name: 'priceConfigBatchImport'})
                return;
            }
            const arr = this.selections
            if (arr.length === 0) {
                this.$message.error('请选择数据！')
                return;
            }
            const list = arr.filter(item => {
                if (e === 'b') {
                    return item.statusAndTime === '已下架' || item.statusAndTime === '待上架'
                }
                return item.statusAndTime === '已上架（生效中）' || item.statusAndTime === '已上架（待生效）'
            })
            if(list.length === 0) {
                const str = { b: '上架', c: '下架'}
                this.$message.error(`请选择要${str[e]}的数据`)
                return;
            }
            const tips = { b: '是否确认上架？确定后勾选数据全部上架', c: '是否确认下架？确定后勾选数据全部下架'}
            this.$confirm(tips[e], '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    // 0待上架、1已上架、4已下架
                    const ids = list.map(item => {
                        return item.id
                    })
                    this.updateStatus(ids, {b: 1, c: 4}[e], '操作成功！')
                }).catch(() => {          
            });
        },
        // 一键操作 上下架
        handleOneKey(e) {
            const msgEnmu = {
                a: '是否确认上架？确定后实现当前搜索条件下待上架数据全部上架',
                b: '是否确认下架？确定后实现当前搜索条件下，已上架数据全部下架'
            }
            
            this.$confirm(`${msgEnmu[e]}`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    const enmu = { a: 1, b: 4 }
                    const es = { a: -1, b: -2}
                    this.updateStatus([es[e]], enmu[e], '操作成功！', this.getParams())
                }).catch(() => {          
            });
        },
        // 上下架
        updateStatus(ids, status, msg, params = {}) {
            // 1  上架， 4  下架
            let param = {
                data: { listIds: ids, allpackageStatus: status, ...params, },
                op: this.op.isUse
            };
            const url = this.$getModuleUrl(this.moduleName, param.op);
            this.$axios(url, param).then(res => {
                const result = JSON.parse(res.data)
                if (result && result.anwserCode && result.anwserCode.code === 1) {
                    this.$message.success(msg)
                    this.search()
                } else {
                    this.$message.error(result.anwserCode && result.anwserCode.message)
                }
                
            });
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
        // 选择数据
        selectionChange(selections) {
            this.selections = selections;
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
