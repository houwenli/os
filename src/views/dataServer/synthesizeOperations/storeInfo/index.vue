<template>
    <div class="storeInfo">
        <ws-table-el align="left" ref="table" v-bind="tableConfig" labelWidth="95px">
            <template #search>
                <search-group>
                    <label for>名称：</label>
                    <el-input v-model="searchOptions.orgName" placeholder="请输入实体店名称" clearable />
                </search-group>
                <search-group>
                    <label for>机构编码：</label>
                    <el-input v-model="searchOptions.stationNumber" placeholder="请输入机构编码" clearable />
                </search-group>
                <search-group v-if="roleType!=30 && roleType!=40">
                    <label for>上级机构：</label>
                    <organization
                        v-model="searchOptions.agencyNumber"
                        :showSelect="true"
                        :selectOptions="selectOptions"
                        ref="orgSelect"
                        placeholder="请输入机构名称搜索"
                        valueKey="agencyNumber"
                        :reqData="reqData"
                        :orgType="searchOptions.orgType"
                        @orgTypeChange="orgTypeChange"
                    />
                </search-group>
                
                <search-group>
                    <label for>门店状态：</label>
                    <el-select v-model="searchOptions.openStatus" placeholder="请选择门店状态" clearable>
                        <el-option v-for="item in openStatusOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>运营状态：</label>
                    <el-select v-model="searchOptions.status" placeholder="请选择运营状态" clearable>
                        <el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>注册时间：</label>
                    <ws-date-range
                        :startTime.sync="searchOptions.startTime"
                        :endTime.sync="searchOptions.endTime"
                    ></ws-date-range>
                </search-group>
            </template>
            <template #searchBtns>
                <el-button-group v-if="powerList[op.list]">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn" @click="reset()" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
                <el-button v-if="powerList[op.export]" style="margin-left: 20px" @click="handleExport" plain>导出</el-button>
            </template>
            <template>
                <ws-table-column-el align="center" prop="orgName" label="实体店名称"></ws-table-column-el>
                <ws-table-column-el align="center" prop="agencyNumber" label="机构编码"></ws-table-column-el>
                <ws-table-column-el align="center" prop="parentAgency" label="上级机构"></ws-table-column-el>
                <ws-table-column-el align="center" prop="openStatus" label="门店状态">
                    <template slot-scope="scope">
                        <span>{{ format(scope.row.openStatus, openStatusOptions) }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="status" label="运营状态">
                    <template slot-scope="scope">
                        <span>{{ format(scope.row.status, statusOptions) }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="createTime" label="注册时间"></ws-table-column-el>
                <ws-table-column-el align="center" prop="auditPassDriverCnt" label="入网司机量"></ws-table-column-el>
                <ws-table-column-el align="center" prop="vipValidDriverCnt" label="认证包干司机量"></ws-table-column-el>
                <ws-table-column-el align="center" prop="vipInvalidDriverCnt" label="已过期包干司机量"></ws-table-column-el>
                <ws-table-column-el align="center" prop="notVipDriverCnt" label="从未包干司机量"></ws-table-column-el>
                <ws-table-column-el align="center" prop="vipRemainDays90DriverCnt" label="90天内将过期包干司机量"></ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
import organization from '@/components/orgSelect/organization-options.vue';

export default {
    name: 'storeInfo',
    components: { organization },
    data() {
        return {
            searchOptions: {
                orgName: '',
                openStatus: '',
                status: '',
                orgType: '',
                agencyNumber: '',
                stationNumber: '',
                startTime: '',
                endTime: ''
            },
            tableConfig: {
                // filterColumns: false,
                loading: true,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/dataServer/storeInfo',
                    op: {
                        selectList: 'queryList',
                        // selectCount: 'count'
                    },
                    beforeQuery: this.beforeQuery
                },
            },
            moduleName: '/dataServer/storeInfo',
            op: {
                list: 'queryList',
                count: 'count',
                export: 'export'
            },
            reqData: {
                op: 'selectOrgByOrgType',
                moduleName: '/dataServer/storeInfo'
            },
            statusOptions: [
                { id: 1, value: '正常' },
                { id: 2, value: '锁定登录' },
                { id: -2, value: '禁止入驻' },
            ],
            openStatusOptions: [
                { id: 1, value: '待开业' },
                { id: 2, value: '已开业' },
            ],
            roleType: 0
        }
    },
    computed: {
        selectOptions() {
            const allOrg = [
                { value: '10', label: '大区' },
                { value: '20', label: '城市分公司' },
                { value: '30', label: '区县分公司' },
                // { value: '40', label: '实体店' }
            ];
            const map = { 0: 0, 4: 0, 5: 1, 20: 2, 30: 3 }
            // 账户类型： 0 总部，4 总区 5 大区 20 分公司 30 服务中心 40 实体店
            return allOrg.slice(map[this.roleType], allOrg.length);
        }
        
    },
    mounted() {
        const role = this.$baseMethod.getStore('roleOption')
        this.roleType = (role && role.orgType) || 0
    },
    methods: {
        // 查询
        search() {
            this.$refs.table.search();
        },
        reset() {
            this.searchOptions = {
                orgName: '',
                openStatus: '',
                status: '',
                orgType: '',
                agencyNumber: '',
                stationNumber: '',
                startTime: '',
                endTime: ''
            };
            this.search();
        },
        beforeQuery() {
            return this.setParams()
        },
        handleExport() {
            // 导出
            const param = {
                data: this.setParams(),
                op: this.op.export,
            };
            const URL = this.$getModuleUrl(this.moduleName, param.op);
            this.$axios(URL, param).then(res => {
                this.$message.success('导出中，请稍后到文件中心下载！');
            });
        },
        setParams() {
            const { orgType, agencyNumber } = this.searchOptions
            return {
                ...this.searchOptions,
                orgType: agencyNumber ? orgType : ''
            }
        },
        format(val, arr) {
            const el = arr.find(item => {
                return item.id + '' === val + ''
            })
            return el ? el.value : ''
        },
        orgTypeChange(val) {
            this.searchOptions = {
                ...this.searchOptions,
                orgType: val
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>