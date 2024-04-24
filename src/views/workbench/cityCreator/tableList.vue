<template>
    <div>
        <ws-table-el ref="table" v-bind="tableConfig" :col="8">
            <template #search>
                <search-group>
                    <label for>姓名：</label>
                    <el-input v-model.trim="searchOptions.name" placeholder="请输入姓名" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>联系电话：</label>
                    <el-input v-model.trim="searchOptions.phone" maxlength="11" placeholder="请输入联系电话" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>职务：</label>
                    <el-row :gutter="4">
                        <el-col :span="8">
                            <el-select v-model="searchOptions.jobSelectOrg" @change="searchOptions.positionId = ''" placeholder="请选择">
                                <el-option v-for="(item, index) in orgOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="16">
                            <el-select v-model="searchOptions.positionId" clearable placeholder="请选择" no-data-text="无数据">
                                <el-option v-for="item in dutyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </search-group>
                <search-group>
                    <label for>机构：</label>

                    <el-row :gutter="4">
                        <el-col :span="8">
                            <el-select
                                v-model="searchOptions.selectOrg"
                                @change="
                                    searchOptions.departmentId = '';
                                    orgList = [];
                                "
                                placeholder="请选择"
                            >
                                <el-option v-for="(item, index) in orgOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="16">
                            <el-select
                                class="search-input-with-select"
                                v-model="searchOptions.departmentId"
                                :remote-method="getOrgList"
                                filterable
                                clearable
                                remote
                                reserve-keyword
                                placeholder="请输入机构名称"
                                :loading="optionsLoading"
                                no-data-text="无数据"
                            >
                                <el-option v-for="item in orgList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </search-group>
                <search-group>
                    <label for>在职状态：</label>
                    <el-select v-model="searchOptions.workStatus" clearable placeholder="请选择" no-data-text="无数据">
                        <el-option v-for="(item, index) in jobStatus" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>是否城市合伙人：</label>
                    <el-select v-model="searchOptions.isUrbanCoFunder" clearable placeholder="请选择" no-data-text="无数据">
                        <el-option v-for="(item, index) in urbanCoFunderList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </search-group>
            </template>
            <template #options>
                <!-- <el-button-group> -->
                <ws-enter-event>
                    <el-button plain v-if="powerList.submitApproval" @click="enterForm('add', {})">新增机构人员</el-button>
                </ws-enter-event>
                <ws-enter-event>
                    <el-button plain v-if="powerList.jobTransfer" @click="enterForm('adjust', {})">机构人员调岗</el-button>
                </ws-enter-event>
                <ws-enter-event>
                    <el-button plain v-if="powerList.resignationApply" @click="enterForm('leave', {})">机构人员离职</el-button>
                </ws-enter-event>
                <ws-enter-event>
                    <el-button plain v-if="powerList.import" @click="enterForm('createPeople', {})">调整城市合伙人</el-button>
                </ws-enter-event>
                <!-- </el-button-group> -->
            </template>
            <template #searchBtns>
                <el-button-group>
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn" @click="reset" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>

                <el-button style="margin-left: 20px" v-if="powerList.export" @click="exportOrgManager" plain>导出</el-button>
            </template>

            <template>
                <ws-table-column-el prop="name" label="姓名" min-width="80"></ws-table-column-el>
                <ws-table-column-el prop="jobNumber" label="工号" min-width="120"></ws-table-column-el>
                <ws-table-column-el prop="phone" label="联系电话" min-width="180"></ws-table-column-el>
                <ws-table-column-el prop="departmentNameStr" label="任职机构" min-width="240">
                    <template slot-scope="scope">
                        <div v-for="(item, i) in (scope.row.departmentNameStr || '').split(',')" :key="i">
                            <el-popover placement="top" trigger="click" :content="(scope.row.deptFullNameList && scope.row.deptFullNameList[i]) || '暂无'">
                                <div slot="reference">
                                    <p style="margin: 5px 0">{{ item }}</p>
                                </div>
                            </el-popover>
                        </div>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="positionNameStr" label="职务" min-width="240">
                    <template slot-scope="scope">
                        <div v-for="(item, v) in (scope.row.positionNameStr || '').split(',')" :key="v">
                            <p style="margin: 5px 0">{{ item }}</p>
                        </div>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="entryDate" label="入职日期" min-width="140">
                    <template slot-scope="scope">
                        <span>{{ $baseMethod.formatData(scope.row.entryDate, 'yyyy-MM-dd') }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="workStatusStr" label="在职状态" min-width="80"></ws-table-column-el>
                <ws-table-column-el prop="workStatusStr" label="是否城市合伙人" min-width="80">
                    <template slot-scope="scope">
                        {{ scope.row.isUrbanCoFunder == 1 ? '是' : '否' }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el label="操作" fixed="right" min-width="140">
                    <template slot-scope="scope">
                        <el-button type="text" @click="enterForm('detail', scope.row)" v-if="powerList.detailInfo" style="color: #0088ff">详情</el-button>
                        <el-button type="text" @click="enterForm('edit', scope.row)" v-if="powerList.updateApproval && scope.row.opList.includes(2)" style="color: #0088ff">修改资料</el-button>
                        <!-- <el-button type="text" @click="enterForm('adjust',scope.row)" style="color:#0088ff;" v-if="powerList.regularizationApproval && scope.row.opList.includes(4)">职务调整</el-button> -->
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'cityCreatorList',
    data() {
        return {
            searchOptions: {
                name: '',
                phone: '',
                positionId: '',
                workStatus: '', //在职状态
                selectOrg: '', //机构选择
                departmentId: '', //机构名称
                jobSelectOrg: '', //职务选择机构
            },
            options: [], //模糊查询列表
            loading: false,
            tableConfig: {
                filterColumns: false,
                lazyQuery: {
                    moduleName: '/workbench/BRcityCreator',
                    op: {
                        selectList: 'selectList',
                        selectCount: 'selectCount',
                    },
                    beforeQuery: this.beforeQuery,
                },
            },
            op: {
                selectList: 'selectList',
                selectCount: 'selectCount',
                detail: 'detail',
                updateStatus: 'updateStatus',
                orgDuties: 'deptPositions',
                export: 'export',
            },
            dutyList: [],
            dataOptions: {
                id: '',
                status: '',
            },
            submitState: 2, //审核状态
            remark: '', //审核不通过理由
            submitDialog: false, //审核弹窗
            auditRow: {}, //提交审核row
            roleOption: {},
            moduleName: '/workbench/BRcityCreator',
            jobStatus: [
                //在职状态
                { label: '在职', value: 1 },
                { label: '离职', value: 2 },
            ],
            urbanCoFunderList: [
                { label: '否', value: 0 },
                { label: '是', value: 1 },
            ],
            orgList: [],
            optionsLoading: false,
            inputWidth: 0,
        };
    },
    watch: {
        'searchOptions.jobSelectOrg': function (val) {
            if (val) {
                this.getOrgDuties(val);
            }
        },
        // 'searchOptions.selectOrg':function(val){
        //   if(val){
        //     this.getOrgList(val)
        //   }
        // }
    },
    computed: {
        ...mapState('workbench', ['orgTypeFilters']),
        orgOptions() {
            let { orgType } = this.roleOption;
            let orgList = [
                { label: '分公司', value: 20 },
                { label: '服务中心', value: 30 },
                { label: '实体店', value: 40 },
            ];
            //单独处理超管 ---------后端要求超管使用wsecar判断
            let { username } = this.$baseMethod.getStore('_ccmUser');
            if (username == 'wsecar') {
                return orgList;
            }
            if (orgType === 40) this.searchOptions.selectOrg = this.searchOptions.jobSelectOrg = orgType; //实体店默认选中
            //根据登录部门向下兼容分支机构选项
            return orgList.filter(org => org.value >= orgType);
        },
    },
    mounted() {
        this.roleOption = this.$baseMethod.getStore('roleOption') || {};
        this.getOrgDuties();
    },
    methods: {
        search() {
            this.$refs.table.search();
        },
        reset() {
            this.$refs.table.reset();
        },
        enterForm(type, row) {
            let query = {
                type,
                id: row.id,
                phone: row.phone,
            };
            if (type === 'leave') {
                this.$router.push({ name: 'leavePosition' });
                return;
            }
            if (type === 'createPeople') {
                this.$router.push({ name: 'createPeople' });
                return;
            }
            this.$router.push({ name: type == 'adjust' ? 'cityCreatorAdjustPosition' : 'cityCreatorForm', query });
        },
        getOrgDuties(val) {
            // this.options = [];
            if (!val) {
                this.dutyList = [];
                return;
            }
            let data = {
                data: JSON.stringify({ orgType: val }),
                op: 'selectUrbanCoFunderPositions',
            };
            this.$axios('/personnel/urbanCoFunder/select', data).then(res => {
                this.dutyList = JSON.parse(res.data);
            });
        },
        handleShow() {
            this.inputWidth = this.$refs['$input'].$el.offsetWidth;
        },
        getOrgList(val) {
            if (!this.searchOptions.selectOrg) {
                this.$message.error('请选择机构类型后再搜索机构');
                return;
            }
            let data = {
                data: JSON.stringify({ orgType: this.searchOptions.selectOrg, departmentName: val }),
                op: 'fuzzySelectUrbanCoFunderDepartment',
            };
            this.optionsLoading = true;
            this.$axios('/personnel/urbanCoFunder/select', data)
                .then(res => {
                    this.orgList = JSON.parse(res.data);
                    this.optionsLoading = false;
                })
                .catch(() => {
                    this.optionsLoading = false;
                    this.orgList = [];
                });
        },
        exportOrgManager() {
            let opt = {
                data: JSON.stringify({
                    ...this.searchOptions,
                    // orgType: this.roleOption.orgType,
                    // departmentId: this.roleOption.currentDepId,
                    // source: 1
                }),
                op: this.op.export,
            };
            this.$axios(this.getModuleUrl(opt.op), opt).then(res => {
                this.$message.success(`导出成功，请到文件下载中下载`);
            });
        },
        beforeQuery() {
            return {
                ...this.searchOptions,
                // departmentId: this.roleOption.currentDepId,
                // source: 1
            };
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
};
</script>

<style scoped lang="scss">
.search-input-with-select {
    width: 100% !important;
}
</style>
