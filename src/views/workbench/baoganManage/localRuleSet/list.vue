<template>
    <div class="bg-page" :class="isFolder?'addWidth':''">
        <div class="sidebar"> 
            <tabs @changeWidth="changeWidth"></tabs>
        </div>
        <ws-table-el align="left" ref="table" v-bind="tableConfig" @selection-change="handleSelectionChange" :col="8">
            <template #search>
                <search-group>
                    <label for>地区：</label>
                    <ws-city
                        v-model="searchOptions.cityCodeList"
                        :defaultProps="{ checkStrictly: false, emitPath: false }"
                        level="2"
                        :multiple="true"
                    ></ws-city>
                </search-group>
                <search-group>
                    <label for>全国可用：</label>
                    <el-select v-model="searchOptions.scopeSwitch" placeholder="请选择" clearable>
                        <el-option v-for="item in scopeSwitchFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>包干配置：</label>
                    <el-select v-model="searchOptions.settingStatus" placeholder="请选择" clearable>
                        <el-option v-for="item in scopeSwitchFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>限购对象：</label>
                    <el-select v-model="searchOptions.limitStatus" placeholder="请选择" clearable>
                        <el-option v-for="item in scopeSwitchFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>状态：</label>
                    <el-select v-model="searchOptions.status" placeholder="请选择" clearable>
                        <el-option v-for="item in statusRuleFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>生效时间：</label>
                    <ws-date-range
                        :startTime.sync="searchOptions.effectiveTime"
                        :endTime.sync="searchOptions.effectiveEndTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                    ></ws-date-range>
                </search-group>
                <search-group>
                    <label for>创建时间：</label>
                    <ws-date-range
                        :startTime.sync="searchOptions.startTime"
                        :endTime.sync="searchOptions.endTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                    ></ws-date-range>
                </search-group>
                <search-group>
                    <label for>修改时间：</label>
                    <ws-date-range
                        :startTime.sync="searchOptions.updateStartTime"
                        :endTime.sync="searchOptions.updateEndTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                    ></ws-date-range>
                </search-group>
            </template>
            <template #searchBtns>
                <el-button-group v-if="powerList.list">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn" @click="reset()" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
                <el-button v-if="powerList.exportVipRule" style="margin-left: 20px" plain @click="exportData">导出</el-button>
                <el-button v-if="powerList.save" plain @click="add('new')">
                    <i class="el-icon-circle-plus" style="margin-right: 4px"></i>
                    新增
                </el-button>
            </template>
            <template #options>
                <el-dropdown v-if="powerList.batchOnline" @command="batchOperate">
                    <el-button type="primary">
                        批量操作
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown" class="dropdownItem">
                        <el-dropdown-item command="上架">
                            <span>批量上架</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="下架">
                            <span>批量下架</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </template>
            <template>
                <ws-table-column-el align="center" prop="city" label="省份-城市"></ws-table-column-el>
                <ws-table-column-el align="center" prop="effectiveTime" label="开始时间">
                    <template slot-scope="scope">{{ scope.row.effectiveTime || '-' }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="effectiveEndTime" label="结束时间">
                    <template slot-scope="scope">{{ scope.row.effectiveEndTime || '-' }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="scopeSwitch" label="全国可用">
                    <template slot-scope="scope">{{ scope.row.scopeSwitch | scopeSwitchFilters }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="settingStatus" label="包干配置">
                    <template slot-scope="scope">{{ scope.row.settingStatus | scopeSwitchFilters }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="limitStatus" label="限购对象">
                    <template slot-scope="scope">{{ scope.row.limitStatus | scopeSwitchFilters }}</template>
                </ws-table-column-el>
                <ws-table-column-el width="100" align="center" prop="createUserName" label="创建人"></ws-table-column-el>
                <ws-table-column-el align="center" prop="createTime" label="创建时间"></ws-table-column-el>
                <ws-table-column-el align="center" prop="updateTime" label="修改时间"></ws-table-column-el>
                <ws-table-column-el align="center" prop="statusStr" label="状态">
                    <template slot-scope="scope">{{ scope.row.statusStr }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" label="操作" fixed="right" width="150">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            style="color: #0088ff"
                            v-if="showUp(scope.row)"
                            @click="updateStatus('上架', scope.row.id)"
                        >上架</el-button>
                        <el-button
                            type="text"
                            style="color: #0088ff"
                            v-if="showDown(scope.row)"
                            @click="updateStatus('下架', scope.row.id)"
                        >下架</el-button>
                        <!-- <el-button
                            type="text"
                            style="color: #f05259"
                            v-if="showUp('delete', scope.row)"
                            @click="deleteRule(scope.row.id)"
                        >删除</el-button>-->
                        <el-button
                            type="text"
                            style="color: #0088ff"
                            v-if="powerList.detail"
                            @click="localFormContent('detail', scope.row.id)"
                        >详情</el-button>
                        <el-button
                            type="text"
                            style="color: #0088ff"
                            v-if="showEdit(scope.row)"
                            @click="localFormContent('edit', scope.row.id)"
                        >修改</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import tabs from '../components/tabs.vue';
export default {
    components: { tabs },
    name: 'ruleSet',
    data() {
        return {
            isFolder:false,
            selectedTableData: [], // 表格勾选中的数据
            certGroup: [], // 适购车主
            searchOptions: {
                cityCodeList: [],
                scopeSwitch: '',
                settingStatus: '',
                limitStatus: '',
                status: '',
                effectiveTime: '',
                effectiveEndTime: '',
                startTime: '',
                endTime: '',
                updateStartTime: '',
                updateEndTime: '',
            },
            tableConfig: {
                filterColumns: false,
                emptyModel: true,
                indexColumn: true,
                multi: true,
                // layout: 'flow',
                loading: true,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/workbench/baoganManage/localRuleSet/list',
                    op: {
                        selectList: 'list',
                        selectCount: 'count',
                    },
                    immediate: false,
                },
            },
            moduleName: '/workbench/baoganManage/localRuleSet/list',
        };
    },
    computed: {
        ...mapState({
            scopeSwitchFilters: state => state.baogan.scopeSwitchFilters,
            statusRuleFilters: state => state.baogan.statusRuleFilters,
        }),
    },
    mounted() {
        this.search();
    },
    activated() {
        this.search();
    },
    methods: {
        // 是否显示修改按钮
        showEdit({ cityCode, status }) {
            return (cityCode === 0 || [0, 2].includes(status)) && this.powerList.setting;
        },
        // 是否显示上架按钮
        showUp({ cityCode, status }) {
            return cityCode !== 0 && [0, 2].includes(status) && this.powerList.batchOnline;
        },
        showDown({ cityCode, status }) {
            return cityCode !== 0 && [1, 3].includes(status) && this.powerList.batchOnline;
        },
        // 批量上下架
        batchOperate(type) {
            // 全国数据为默认存在，不允许上下架，所以即使勾选，也默认为没勾选
            this.selectedTableData = this.selectedTableData.filter(item => item.cityCode);
            if (!this.selectedTableData.length) {
                return this.$message.error(`请勾选需要${type}的数据`);
            }
            // 勾选的已上架数据
            const onLineData = this.selectedTableData.filter(data => [1, 3].includes(data.status));
            // 勾选数据中有已下架的
            if (type === '下架' && onLineData.length !== this.selectedTableData.length) {
                return this.$message.error('请勾选需下架的数据');
            }
            // 勾选数据中有已上架的
            if (type === '上架' && onLineData.length) {
                return this.$message.error('请勾选需上架的数据');
            }
            let ids = this.selectedTableData.map(({ id }) => id);
            this.updateStatus(type, ids);
        },
        // 上下架
        updateStatus(type, id) {
            let tips = `确定要${type}吗？${Array.isArray(id) ? '确定后勾选数据全部' + type : ''}`;
            this.$confirm(tips, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true,
            }).then(() => {
                const param = {
                    data: {
                        ids: Array.isArray(id) ? id : [id],
                        status: type === '上架' ? 1 : 2,
                    },
                    op: 'batchOnline',
                };
                const URL = this.powerList.batchOnline;
                this.$axios(URL, param).then(res => {
                    this.$message.success('操作成功');
                    this.search();
                });
            });
        },
        // 删除包干规则
        deleteRule(id) {
            this.$confirm(`确定要删除吗`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true,
            }).then(() => {
                const param = {
                    data: { id },
                    op: 'delete',
                };
                const URL = this.powerList.delete;
                this.$axios(URL, param).then(res => {
                    this.$message.success('操作成功');
                    this.search();
                });
            });
        },
        // 表格的多选回调事件
        handleSelectionChange(selectedData) {
            this.selectedTableData = selectedData;
        },
        // 新增
        add(type) {
            this.$router.push({ name: 'localRuleSetForm', query: { type } });
        },
        // 详情||修改
        localFormContent(type, id) {
            this.$router.push({ name: 'localRuleSetForm', query: { type, id } });
        },
        search() {
            this.$refs.table.search();
        },
        reset() {
            this.searchOptions = {
                cityCodeList: [],
                scopeSwitch: '',
                settingStatus: '',
                limitStatus: '',
                status: '',
                effectiveTime: '',
                effectiveEndTime: '',
                startTime: '',
                endTime: '',
                updateStartTime: '',
                updateEndTime: '',
            };
            this.search();
        },
        // 导出
        exportData() {
            const param = {
                data: this.searchOptions,
                op: 'exportVipRule',
            };
            const URL = this.powerList.exportVipRule;
            this.$axios(URL, param).then(res => {
                this.$message.success('导出中，请稍后到文件中心下载！');
            });
        },
        changeWidth(isFolder){
            this.isFolder = isFolder
        }
    },
};
</script>

<style lang="scss" scoped>
.bg-page{
    display:flex;
    transition: 0.5s;
    .sidebar{
        flex:1;
        margin-right:14px;
    }
}
.bg-page /deep/ .ws-table-warp {
    border-radius: 0 0 8px 8px;
    padding: 24px !important;
    width:89%;
}
.addWidth /deep/ .ws-table-warp {
    width:92%;
}
/deep/ .table-column-header-button {
    padding: 10px 12px;
}
</style>
