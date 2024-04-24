<template>
    <div class="branchContainer">
        <ws-table-el :col="8" ref="table" v-bind="tableConfig" :header-cell-style="{ background: '#F5F7FA' }"
            @selection-change="onDistribution">
            <template #search>
                <!-- <search-group>
                    <label for>部门类型：</label>
                    <el-select v-model="searchOptions.deptType" clearable @change="changeParttime()"
                        placeholder="请选择部门类型" style="width: 80%">
                        <el-option label="总部" :value="1"></el-option>
                        <el-option label="总区" :value="4"></el-option>
                        <el-option label="大区" :value="5"></el-option>
                        <el-option label="分支机构" :value="2"></el-option>
                    </el-select>
                </search-group> -->
                <search-group>
                    <label for>部门名称：</label>
                    <el-cascader v-if="searchOptions.deptType != 2" :props="optionProps" clearable filterable
                        collapse-tags @change="handleChange()" v-model="searchOptions.deptId" placeholder="请选择部门名称"
                        :options="departmentOption" separator="-" >
                    </el-cascader>
                    <el-select v-else @change="handleOrgChange()" v-model="searchOptions.orgType" clearable
                        placeholder="请选择部门名称" :style="{ width: '80%' }" :disabled="searchOptions.deptType.length == 0">
                        <el-option v-for="item in orgOption" :key="item.id" :label="item.value" :value="item.id">
                        </el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>职务：</label>
                    <el-select v-model.trim="searchOptions.positionId" filterable placeholder="请选择职务名称" clearable
                        :disabled="!searchOptions.deptId && !searchOptions.orgType">
                        <el-option v-for="item of searchOptions.deptType != 2 ? positionOptions : orgOptionslecet"
                            :label="item.name" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>角色名称：</label>
                    <el-select v-model="searchOptions.roleId" clearable filterable remote reserve-keyword
                        placeholder="请选择角色名称" :remote-method="remoteMethod" :loading="loading">
                        <el-option v-for="item in roleIdList" :key="item.roleId" :label="item.roleName"
                            :value="item.roleId">
                        </el-option>
                    </el-select>
                </search-group>
            </template>
            <template #options>
                <div class="searchClass">
                    <div>
                        <el-button type="primary" @click="deleteAll" v-if="powerList.batchOperate">
                            批量删除
                        </el-button>
                    </div>
                    <div>
                        <el-button-group v-if="powerList.selectList">
                            <el-button type="primary" style="width: 95px" v-if="powerList.selectList"
                                icon="el-icon-search" @click="search(2)">查询</el-button>
                            <el-button class="resetBtn" type="primary" v-if="oaPowerList.selectCount" @click="reset"
                                icon="el-icon-refresh-left"></el-button>
                        </el-button-group>
                        <el-button v-if="oaPowerList.add" icon="el-icon-circle-plus" class="btn-right btnStyle"
                            @click="modifyInfo('add')">新增</el-button>
                    </div>
                </div>
            </template>
            <!-- 表格 -->
            <template>
                <ws-table-column-el prop="positionName" label="职务"></ws-table-column-el>
                <ws-table-column-el prop="deptName" label="部门名称"></ws-table-column-el>
                <ws-table-column-el prop="deptType" label="部门类型">
                    <template slot-scope="scope">
                        {{ deptTypeList[scope.row.deptType] }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="roleName" label="关联角色"></ws-table-column-el>
                <ws-table-column-el prop="updateUserName" label="修改人"></ws-table-column-el>
                <ws-table-column-el prop="updateTime" label="修改时间"></ws-table-column-el>
                <ws-table-column-el label="操作" min-width="300px" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="oaPowerList.update" @click="modifyInfo('edit', scope.row)"
                            class="c0088ff">修改</el-button>
                        <el-button type="text" class="c0088ff" @click="detailsFunc(scope.row)">账号详情</el-button>
                        <el-button v-if="oaPowerList.selectDetails" type="text" class="c0088ff"
                            @click="modifyInfo('authorizationDetail', scope.row)">权限详情</el-button>
                        <!--- 首页总部权限申请的职务权限，不能移除职务 --->
                        <el-button v-if="oaPowerList.delete && scope.row.roleClassify == 1" type="text"
                            @click="deleteHandler(scope.row.id,scope.row.roleClassify)">删除</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
        <!-- 删除职务 -->
        <el-dialog title="删除职务权限" :visible.sync="delDialogVisible" v-if="delDialogVisible" width="30%" :center="true"
            append-to-body>
            <span class="dialogCon">删除后该职务下所有人员将关闭本次删除的权限，请确认删除</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delDialogVisible = false" :loading="delLoading">取 消</el-button>
                <ws-throttle>
                    <el-button type="primary" @click="enterDelete()" :loading="delLoading">确 定</el-button>
                </ws-throttle>
            </span>
        </el-dialog>
        <!-- 批量操作 -->
        <el-dialog title="删除职务权限" :visible.sync="operationDialogVisible" v-if="operationDialogVisible" width="30%"
            :center="true" append-to-body>
            <span class="dialogCon">{{diaMsg}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="operationDialogVisible = false">取 消</el-button>
                <ws-throttle>
                    <el-button type="primary" @click="enterOperation()">确 定</el-button>
                </ws-throttle>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'authorization',
    data() {
        return {
            searchOptions: {
                deptType: '', //部门类型
                orgType: '', // 部门
                positionId: '', // 职务
                deptId: '', //分支机构
                roleId: '', //角色名称
            },
            tableConfig: {
                multi: true,
                filterColumns: false,
                lazyQuery: {
                    moduleName: '/systemManage/authorization',
                    op: {
                        selectList: 'selectList',
                        selectCount: 'selectCount',
                    },
                },
            },
            moduleName: '/systemManage/authorization',
            delName: '该角色仍有账号使用，不能删除该角色',
            delBtn: false,
            delId: '',
            departmentOption: [],
            positionOptions: [],
            orgOptionslecet: [],
            //部门下拉框参数
            optionProps: {
                value: 'id',
                label: 'name',
                children: 'child',
                checkStrictly: true,
                emitPath: false,
            },
            delDialogVisible: false,
            stopDialogVisible: false,
            operationDialogVisible: false,
            positionId: 0,
            id: 0,
            status: '', //启用停用状态
            delLoading: false,
            deptType: '', //部门类型
            //分支机构下拉框
            orgOption: [
                {
                    id: 20,
                    value: '分公司',
                },
                {
                    id: 30,
                    value: '服务中心',
                },
                {
                    id: 40,
                    value: '实体店',
                },
            ],
            roleIdList: [], //角色名称下拉框
            authorizationList: [], //选中的数组
            diaMsg: '',
            loading: false,
            deptTypeList: { 1: '总部', 2: '分支机构', 4: '总区', 5: '大区' },
        };
    },
    watch: {

    },
    mounted(){
        this.getDepartmentList()
    },
    methods: {
        search() {
            this.$nextTick(() => this.$refs.table.search());
        },
        reset() {
            this.searchOptions = {
                deptType: '', //部门类型
                orgType: '',
                positionId: '', // 职务
                deptId: '',
            };

            this.search();
        },
        // 账号详情
        detailsFunc(row) {
            let { roleId: id, positionId, deptType, roleClassify } = row
            let val = deptType
            if (deptType == 4 || deptType == 5) {
                val = 1
            }
            this.$router.push({
                name: 'accountDetail',
                query: {
                    id,
                    positionId,
                    deptType: val,
                    roleClassify
                },
            });
        },
        // 批量授权， 新增修改
        modifyInfo(type, val) {
            if (type == 'add') {
                this.$router.push({
                    name: 'authorizationAdd',
                });
            } else {
                this.$router.push({
                    name: 'authorizationDetail',
                    query: { type, positionId: val.positionId, deptId: val.deptId, deptType: val.deptType, orgType: val.orgType, roleId: val.roleId, id: val.id },
                });
            }
        },
        // 删除角色
        deleteHandler(id, ify) {
            if (ify == 3) return
            this.delDialogVisible = true;
            this.id = id;
        },
        enterDelete() {
            this.$axios(this.getModuleUrl('delete'), {
                data: { id: this.id },
                op: 'delete',
            }).then(res => {
                this.delDialogVisible = false;
                this.$message.success('删除成功');
                this.reset();
            });
        },
        //部门类型select框change事件
        changeParttime() {
            this.searchOptions.orgType = '';
            this.searchOptions.positionId = '';
            this.searchOptions.deptId = '';
            let deptType = this.searchOptions.deptType;
            if (deptType == 2) return;
            // 部门
            this.$axios(this.getModuleUrl('selectChildDeptByPosition'), {
                op: 'selectChildDeptByPosition',
                data: JSON.stringify({ deptType: deptType == 1 ? 0 : deptType }),
            }).then(res => {
                let data = JSON.parse(res.data);
                this.handleString(data);
                this.departmentOption = data;
            });
        },

        // 获取总部下面的所有部门
        getDepartmentList(){
            this.$axios(this.getModuleUrl('selectChildDeptByPosition'), {
                op: 'selectChildDeptByPosition',
                data: JSON.stringify({ deptType: 0 }),
            }).then(res => {
                let data = JSON.parse(res.data);
                this.handleString(data);
                this.departmentOption = data;
            });
        },

        //根据部门查询职务
        handleChange(val) {
            this.searchOptions.positionId = '';
            if (this.searchOptions.deptId) {
                this.$axios('/authority/Organizational/select', {
                    op: 'selectDepartmentpositionList',
                    data: JSON.stringify({ id: this.searchOptions.deptId }),
                }).then(res => {
                    this.positionOptions = JSON.parse(res.data);
                });
            }
        },
        //获取选中中的选项
        onDistribution(val) {
            console.log(val, 'bnbnb');
            this.authorizationList = val;
        },
        //批量操作
        deleteAll() {
            //过滤获取所有停用状态的数组
            if (this.authorizationList.length <= 0) {
                this.$message.error(`请勾选需要删除的数据`);
                return;
            }
            for (let i = 0; i < this.authorizationList.length; i++) {
                if (this.authorizationList[i].roleClassify == 3) {
                    this.$message.error(`存在不能删除项`);
                    return;
                }
            }
            this.operationDialogVisible = true;
            this.diaMsg = `删除后该职务下所有人员将关闭本次删除的权限，请确认删除`;
        },
        //批量操作确认
        async enterOperation() {
            try {
                let ids = this.authorizationList.map(item => item.id);
                let res = await this.$axios(this.getModuleUrl('batchOperate'), {
                    op: 'batchOperate',
                    data: { ids },
                });
                if (res.code == 1) {
                    let data = JSON.parse(res.data);
                    this.operationDialogVisible = false;
                    this.$message.success(`成功删除${data}条职务`);
                    this.search();
                }
            } catch (error) { }
        },
        //远程搜索角色
        async remoteMethod(name) {
            try {
                this.loading = true;
                if (name !== '') {
                    //请求接口
                    let res = await this.$axios(this.getModuleUrl('getRoleByType'), {
                        op: 'getRoleByType',
                        data: { name, orgType: '' },
                    });
                    if (res.code == 1) {
                        this.roleIdList = JSON.parse(res.data);
                        this.loading = false;
                    }
                } else {
                    this.roleIdList = [];
                    this.loading = false;
                }
            } catch (error) { }
        },
        handleOrgChange() {
            this.searchOptions.positionId = '';
            if (this.searchOptions.orgType) {
                this.$axios(this.getModuleUrl('selectOrgPositions'), {
                    op: 'selectOrgPositions',
                    data: { orgType: this.searchOptions.orgType },
                }).then(res => {
                    this.orgOptionslecet = JSON.parse(res.data);
                });
            }
        },
        //递归将id转为字符串
        handleString(arr) {
            arr.id = String(arr.id);
            if (arr.child) {
                arr.child.forEach(item => {
                    this.handleString(item);
                });
            }
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
};
</script>

<style scoped lang="scss">
.ws-table-warp {
    padding: 24px 24px 16px 24px !important;
}

/deep/.pagination-warp {
    height: 30px;
    padding-bottom: 0px !important;
    padding-top: 16px;
    box-sizing: content-box;
}

.cooperation-tableList {
    height: 100%;
}

.btn-right {
    float: right;
    margin-left: 16px;
}

.c0088ff {
    color: #0088ff;
}

.btnStyle {
    color: #f05259;
    border: 1px solid #f05259;
    width: 95px;
}

::v-deep .el-dialog .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
}

.searchClass {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
