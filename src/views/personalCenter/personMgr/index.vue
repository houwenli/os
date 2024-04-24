<template>
    <div class="branchContainer">
        <ws-table-el :col="8" ref="table" v-bind="tableConfig">
            <template #search>
                <search-group>
                    <label for>姓名：</label>
                    <el-input v-model.trim="searchOptions.name" placeholder="请输入姓名" :maxlength="30" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>联系电话：</label>
                    <el-input v-model.trim="searchOptions.phone" placeholder="请输入联系电话" :maxlength="30" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>状态：</label>
                    <el-select v-model="searchOptions.status" clearable placeholder="请选择">
                        <el-option v-for="item in statusList" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>任职机构：</label>
                    <el-select v-model="searchItem" clearable filterable remote reserve-keyword placeholder="请选择" @change="changeType" value-key="code" :remote-method="remotePromoteOrgList">
                        <el-option v-for="item in orgList" :key="item.code" :label="item.name" :value="item"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>机构类型：</label>
                    <el-select v-model="searchOptions.orgType" placeholder="请选择" clearable filterable @change="clearOrg(searchOptions.orgType)">
                        <el-option v-for="item in orgTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>职务：</label>
                    <el-select v-model="searchOptions.dutiesId" clearable placeholder="请选择" :no-data-text="searchOptions.orgType ? '无数据' : '请先选择机构类型'">
                        <el-option v-for="item in businessType" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </search-group>
            </template>
            <template #options>
                <div style="display: flex; justify-content: flex-end">
                    <el-button-group v-if="getModulePower('/workbench/BRpersonMgr').orgEmployList">
                        <el-button type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
                        <ws-throttle>
                            <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
                        </ws-throttle>
                    </el-button-group>
                    <el-button v-if="getModulePower('/workbench/BRpersonMgr').saveOrgEmploy" icon="el-icon-circle-plus" class="btn-right btnStyle" @click="detailsFunc('add', null)">新增</el-button>
                    <el-button v-if="getModulePower('/workbench/BRpersonMgr').export" class="btn-right btnStyle" @click="exportExcel">导出</el-button>
                </div>
            </template>
            <!-- 表格 -->
            <template>
                <ws-table-column-el prop="name" label="姓名" width="250" :show-overflow-tooltip="true"></ws-table-column-el>
                <ws-table-column-el prop="phone" label="联系电话" width="200"></ws-table-column-el>
                <ws-table-column-el label="机构类型" width="150" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.orgType | orgTypeFilters }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="orgName" label="任职机构" width="200" :show-overflow-tooltip="true"></ws-table-column-el>
                <ws-table-column-el label="职务" width="250" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dutiesList.map(item => item.orgDutiesName).join(',') }}</span>
                        <!-- <span v-else>{{ scope.row.dutiesList[0].orgDutiesName + ',' + scope.row.dutiesList[1].orgDutiesName + '...' }}</span> -->
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="joinWanshunTime" label="加入万顺叫车日期" width="180">
                    <template slot-scope="scope">
                        <span>{{ $baseMethod.formatData(scope.row.joinWanshunTime, 'yyyy-MM-dd') }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="status" label="状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == 1" class="start">在职</div>
                        <div v-if="scope.row.status == 2" class="stop">离职</div>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el label="操作" width="250px" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="getModulePower('/personalCenter/personMgr').orgEmployDetail" class="c0088ff" @click="detailsFunc('detail', scope.row.id)">详情</el-button>
                        <el-button
                            type="text"
                            v-if="getModulePower('/personalCenter/personMgr').updateOrgEmploy && getModulePower('/personalCenter/personMgr').orgEmployDetail"
                            @click="detailsFunc('edit', scope.row.id)"
                            class="c0088ff"
                        >
                            修改
                        </el-button>
                        <el-button type="text" v-if="getModulePower('/personalCenter/personMgr').updateOrgEmpStatus" class="c0088ff" @click="stateTab(scope.row)">状态标记</el-button>
                        <el-button type="text" v-if="scope.row.status == 2 && getModulePower('/personalCenter/personMgr').updateOrgEmpInvalid" @click="deleteHandler(scope.row)">删除</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>

        <el-dialog append-to-body :title="rowInfo.name + '状态标记'" :visible.sync="changeDialog" width="30%" :lock-scroll="false">
            <div style="width: 85%">
                <div class="statusSelect">
                    <span class="titleSelect">状态：</span>
                    <el-select v-model="dataOptions.status" filterable placeholder="请选择状态">
                        <el-option v-for="item in statusList" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </div>
                <div class="statusSign">{{ dataOptions.status == 1 ? '在职状态，任职机构显示该人员信息' : '离职状态，任职机构不显示该人员信息' }}</div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button :loading="changeLoading" @click="changeDialog = false">取 消</el-button>
                <el-button :loading="changeLoading" type="primary" @click="changeState()">保 存</el-button>
            </span>
        </el-dialog>

        <el-dialog class="deleteDialog" append-to-body :title="'删除' + rowInfo.name" :visible.sync="deleteDialog" center width="30%" :lock-scroll="false">
            <span>删除后，机构将不再显示该人员信息！</span>
            <span slot="footer" class="dialog-footer">
                <el-button :loading="deleteLoading" @click="deleteDialog = false">取 消</el-button>
                <el-button :loading="deleteLoading" type="primary" @click="deleteRow()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
    name: 'personManager',
    data() {
        return {
            statusList: [
                { id: 1, value: '在职' },
                { id: 2, value: '离职' }
            ],
            businessType: [],
            searchOptions: {
                name: '',
                phone: '',
                status: '',
                code: '',
                orgType: '',
                dutiesId: ''
            },
            tableConfig: {
                // labelWidth: '74px',
                filterColumns: false,
                // layout: "flow",
                pageSizeList: [20, 50, 100],
                lazyQuery: {
                    moduleName: '/workbench/BRpersonMgr',
                    op: {
                        selectList: 'orgEmployList',
                        selectCount: 'orgEmployCount'
                    },
                    beforeQuery: this.beforeQuery,
                    immediate: false
                }
            },
            dataOptions: {
                id: '',
                status: '',
                phone: ''
            },
            changeDialog: false,
            changeLoading: false,
            deleteDialog: false,
            deleteLoading: false,
            rowInfo: {},
            orgList: [],
            moduleName: '/workbench/BRpersonMgr',
            searchItem: {}
        };
    },
    computed: {
        ...mapState('personalCenter', ['orgTypeFilters'])
    },
    watch: {
        beforeQuery() {
            return this.searchOptions;
        }
    },
    created() {
        this.getOrgOptionList({ name: '' }).then(res => {
            this.orgList = res;
            let newArr = res.filter(item => {
                return item.partTime == 2;
            });
            if (newArr.length !== 0) {
                this.searchItem = newArr[0];
                this.changeType(this.searchItem);
            }
            this.search();
        });
    },
    methods: {
        ...mapActions('personalCenter', ['getOrgOptionList']),
        //查询机构接口
        async remotePromoteOrgList(queryString) {
            this.getOrgOptionList({ name: queryString }).then(res => {
                this.orgList = res;
            });
        },
        search() {
            this.$nextTick(() => {
                this.$refs.table.search();
            });
        },
        reset() {
            this.searchOptions = {
                name: '',
                phone: '',
                status: '',
                code: '',
                orgType: '',
                dutiesId: ''
            };
            this.searchItem = '';
            this.search();
        },
        clearOrg(orgType) {
            this.searchOptions.dutiesId = '';
            this.getOrgDuties(orgType);
        },
        changeType(data) {
            if (data.code) {
                this.searchOptions.orgType = data.orgType;
                this.searchOptions.code = data.code;
                this.clearOrg(data.orgType);
            } else {
                this.searchOptions.code = '';
            }
        },
        //根据机构类型获取职务列表
        getOrgDuties(orgType) {
            if (!orgType) {
                this.businessType = [];
                return;
            }
            let data = {
                data: JSON.stringify({ orgType }),
                op: 'orgDuties'
            };
            this.$axios('/authority/personalCenter/select', data).then(res => {
                this.businessType = JSON.parse(res.data);
            });
        },
        // 新增修改详情
        detailsFunc(type, id) {
            this.$router.push({
                path: '/personMgrInfo',
                query: { type, id: id ? id : null }
            });
        },
        // 状态标记
        stateTab(row) {
            this.rowInfo = row;
            this.dataOptions.id = row.id;
            this.dataOptions.status = row.status;
            this.dataOptions.phone = row.phone;
            this.changeDialog = true;
        },
        changeState() {
            this.changeLoading = true;
            if ((this.rowInfo.status = 2)) {
                this.rowInfo.status = 1;
            }
            let opt = {
                data: JSON.stringify(this.dataOptions),
                op: 'updateOrgEmpStatus'
            };
            this.$axios(this.getModuleUrl('updateOrgEmpStatus'), opt)
                .then(res => {
                    this.$refs.table.search();
                    this.changeDialog = false;
                    this.changeLoading = false;
                    this.$message.success('状态修改成功！');
                })
                .catch(() => {
                    this.$refs.table.search();
                    this.changeLoading = false;
                    this.$message.warning('状态修改失败！');
                });
        },
        // 删除
        deleteHandler(row) {
            this.rowInfo = row;
            this.deleteDialog = true;
        },
        deleteRow() {
            this.deleteLoading = true;
            let opt = {
                data: JSON.stringify({
                    id: this.rowInfo.id,
                    status: -1,
                    phone: this.rowInfo.phone
                }),
                op: 'updateOrgEmpInvalid'
            };
            this.$axios(this.getModuleUrl('updateOrgEmpInvalid'), opt)
                .then(res => {
                    this.$message.success('删除成功！');
                    this.deleteLoading = false;
                    this.deleteDialog = false;
                    this.search();
                })
                .catch(() => {
                    this.deleteDialog = false;
                    this.$message.warning('删除失败！');
                });
        },
        // 导出
        exportExcel() {
            const reqData = {
                data: { ...this.searchOptions },
                op: 'export'
            };
            this.$axios(this.getModuleUrl('export'), reqData).then(res => {
                this.$message.success('文件正在导出，请到文件下载界面进行下载');
            });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    }
};
</script>

<style scoped lang="scss">
.branchContainer {
    font-size: 14px;
    color: #303133;
}
.btn-right {
    float: right;
    margin-left: 16px;
}
.c0088ff {
    color: #0088ff;
}
.statusSign {
    color: #f56c6c;
    margin-top: 21px;
}
.statusSelect {
    display: flex;
    align-items: center;
}
.titleSelect {
    width: 45px;
    flex-shrink: 0;
}
/deep/ .el-dialog {
    padding: 24px 0 20px 0;
}
/deep/ .el-dialog__header {
    text-align: center;
    padding: 0;
    .el-dialog__title {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
    }
}
/deep/ .el-dialog__body {
    text-align: center;
    padding: 0;
    margin: 10px 0 22px 0;
    color: #606266;
}
.btnStyle {
    color: #f05259;
    border: 1px solid #f05259;
    width: 95px;
}
/deep/ .el-dialog .el-dialog__body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.el-select {
    width: 85%;
}
/deep/ label {
    font-weight: 400 !important;
}
/deep/ .ws-table-warp {
    padding: 0 !important;
}
</style>
