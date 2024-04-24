<template>
    <div>
        <!-- 列表 -->
        <ws-table-el ref="table" v-bind="tableConfig" :col="8">
            <template #search>
                <search-group>
                    <label for>姓名：</label>
                    <el-input v-emoji v-model.trim="searchOptions.name" placeholder="请输入姓名模糊查询" :maxlength="30" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>联系电话：</label>
                    <el-input v-emoji v-model.trim="searchOptions.phone" placeholder="请输入联系电话" :maxlength="30" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>当前职务：</label>
                    <el-select v-model="searchOptions.positionType" :disabled="positionDisabled" clearable placeholder="请选择类型" style="width: 45% !important; min-width: 0 !important">
                        <el-option v-for="item in positionTypeOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                    <el-select v-model="searchOptions.positionId" clearable placeholder="请选择职务" style="width: 55% !important; min-width: 0 !important; margin-left: 4px !important">
                        <el-option v-for="item in postOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>更新时间：</label>
                    <ws-date-range :startTime.sync="searchOptions.updateTimeStart" :endTime.sync="searchOptions.updateTimeEnd"></ws-date-range>
                </search-group>
                <search-group>
                    <label for>异动类型：</label>
                    <el-select v-model="searchOptions.changeType" clearable placeholder="请选择">
                        <el-option v-for="item in changeTypeOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>审核状态：</label>
                    <el-select v-model="searchOptions.approvalStatus" clearable placeholder="请选择">
                        <el-option v-for="item in auditStatusOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
            </template>
            <template #options>
                <el-button class="fr" style="margin-left: 15px" plain v-if="oaPowerList.export" @click="exportExcel">导出</el-button>
                <el-button-group class="fr" v-if="oaPowerList.selectList">
                    <el-button class="queryBtn" type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
                    <el-button type="primary" class="resetBtn" @click="reset" icon="el-icon-refresh-left"></el-button>
                </el-button-group>
            </template>
            <!-- 表格 -->
            <template>
                <ws-table-column-el prop="employeeId" label="员工ID"></ws-table-column-el>
                <ws-table-column-el prop="name" label="姓名"></ws-table-column-el>
                <ws-table-column-el prop="jobNumber" label="工号"></ws-table-column-el>
                <ws-table-column-el prop="phone" label="联系电话"></ws-table-column-el>
                <ws-table-column-el prop="deptNameList" label="当前任职机构">
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.UserDeptPositVo" :key="index">
                            {{ item.deptName }}
                            <br />
                        </span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="post" label="当前职务">
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.UserDeptPositVo" :key="index">
                            {{ item.positName }}
                            <br />
                        </span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="entryDateName" label="入职日期"></ws-table-column-el>
                <ws-table-column-el prop="updateTime" label="更新时间"></ws-table-column-el>
                <ws-table-column-el prop="changeTypeName" label="异动类型"></ws-table-column-el>
                <ws-table-column-el prop="procdefNo" label="审批单号">
                    <template slot-scope="scope">
                        <el-button type="text" style="color: #0088ff" @click="toProcess(scope.row.procinstId)">{{ scope.row.procdefNo }}</el-button>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="approvalStatusName" label="审批状态"></ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
export default {
    name: 'personnelChangeRecordList',
    data() {
        return {
            // 列表查询参数
            searchOptions: {
                name: '',
                phone: '',
                updateTimeStart: this.$baseMethod.getBeforeDay(-30, 'yyyy-MM-dd hh:mm:ss'),
                updateTimeEnd: this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd hh:mm:ss'),
                changeType: '',
                positionId: '',
                approvalStatus: '',
            },
            // 列表请求参数
            tableConfig: {
                filterColumns: false,
                labelWidth: '100px',
                lazyQuery: {
                    moduleName: '/workbench/personnelChangeRecord',
                    op: {
                        selectList: 'selectList',
                        selectCount: 'selectCount',
                    },
                },
            },
            positionTypeOptions: [
                { value: '一级机构', id: 20 },
                { value: '二级机构', id: 30 },
                { value: '实体店', id: 40 },
            ],
            postOptions: [],
            positionDisabled: false,
            auditStatusOptions: [
                { value: '待审核', id: 0 },
                { value: '审核中', id: 1 },
                { value: '已撤销', id: 2 },
                { value: '审核通过', id: 3 },
                { value: '审核拒绝', id: 4 },
            ],
            changeTypeOptions: [
                { value: '入职', id: 1 },
                { value: '调岗', id: 3 },
                { value: '离职', id: 4 },
            ],
            moduleName: '/workbench/personnelChangeRecord',
        };
    },
    created() {
        let roleOption = this.$baseMethod.getStore('roleOption');
        if (roleOption.orgType == 30) {
            this.positionTypeOptions.shift();
        } else if (roleOption.orgType == 40) {
            this.searchOptions.positionType = 40;
            this.positionDisabled = true;
            this.positionChange(40);
        }
    },
    watch: {
        'searchOptions.positionType'(e) {
            if (e == '') {
                this.postOptions = [];
                this.searchOptions.positionId = '';
            } else {
                this.positionChange(e);
                this.searchOptions.positionId = '';
            }
        },
    },
    methods: {
        async positionChange(e) {
            let data = {
                op: 'selectUrbanCoFunderPositions',
                data: {
                    orgType: e,
                },
            };
            let res = await this.$axios('/personnel/urbanCoFunder/select', data);
            this.postOptions = JSON.parse(res.data);
        },
        // 跳转流程
        toProcess(id) {
            this.$router.push({ name: 'pendingAndApproval', query: { row: JSON.stringify({ id }) } });
        },
        // 搜索
        search(type = 1) {
            this.$refs.table.search(type);
        },
        // 重置
        reset() {
            this.searchOptions = {
                name: '',
                phone: '',
                updateTimeStart: this.$baseMethod.getBeforeDay(-30, 'yyyy-MM-dd hh:mm:ss'),
                updateTimeEnd: this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd hh:mm:ss'),
                changeType: '',
                positionId: '',
                approvalStatus: '',
            };
            this.search();
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        // 导出
        exportExcel() {
            const reqData = {
                data: { ...this.searchOptions },
                op: 'export',
            };
            this.$axios(this.getModuleUrl('export'), reqData).then(res => {
                this.$message.success('文件正在导出，请到文件下载界面进行下载');
            });
        },
    },
};
</script>

<style scoped lang="scss"></style>
