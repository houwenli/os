<template>
    <div>
        <!-- 新增组员列表 -->
        <ws-table-el ref="table" @selection-change="checkChange" v-bind="tableConfig" :col="12">
            <template #search>
                    <search-group>
                        <label for>姓名：</label>
                        <el-input v-model.trim="searchOptions.name" :maxlength="30" placeholder="请输入姓名" clearable></el-input>
                    </search-group>

                    <search-group>
                        <label for>手机号：</label>
                        <el-input v-model.trim="searchOptions.phone" placeholder="请输入手机号码" clearable></el-input>
                    </search-group>

                    <search-group>
                        <label for>所属部门：</label>
                        <el-cascader
                            filterable
                            v-model="searchOptions.deptIds"
                            @change="deptChange"
                            clearable
                            separator="-"
                            placeholder="请选择"
                            :options="departmentOption"
                            :props="deptProps"
                        ></el-cascader>
                    </search-group>
                    <search-group>
                        <label for>职务：</label>
                        <el-select filterable v-model="searchOptions.positionIds" placeholder="请选择" clearable multiple collapse-tags>
                            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </search-group>
            </template>
            <template #options>
                <div class="onsearch">
                    <div class="checkTotal">
                        <span v-if="checkBoxList.length">
                            共勾选
                            <i>{{ checkBoxList.length }}</i>
                            个账号
                        </span>
                    </div>
                    <div>
                        <el-button-group>
                            <el-button type="primary" icon="el-icon-search" :loading="btnLoading" @click="search(2)">查询</el-button>
                            <ws-throttle>
                                <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
                            </ws-throttle>
                        </el-button-group>
                        <ws-throttle>
                            <el-button v-if="oaPowerList.saveUserToGroup" icon="el-icon-circle-plus" style="margin-left: 8px;" type='primary' :loading="btnLoading" @click="addMember('add')">确认添加</el-button>
                        </ws-throttle>
                    </div>
                </div>
            </template>
            <template>
                <ws-table-column-el align="left" prop="name" label="姓名"></ws-table-column-el>
                <ws-table-column-el align="left" prop="phone" label="手机号码"></ws-table-column-el>
                <ws-table-column-el align="left" label="所属部门">
                    <template slot-scope="scope">
                        <el-popover v-for="(item, index) in scope.row.departPosition" :key="index" trigger="click" :content='item.departNameTree' placement="top" width="200">
                            <span class='completeDuty' slot="reference">{{ item.departName }}<br /></span>
                        </el-popover>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="left" label="职务">
                    <template slot-scope="scope">
                        <div class='positionBox' v-for="(item, index) in scope.row.departPosition" :key="index">
                            {{ item.positionName }}<span class="mainTag" v-if="item.isMainPos==0">主职</span>
                        </div>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="left"  prop="employeeStatusName" label="员工状态"> </ws-table-column-el>
                <ws-table-column-el align="left" label="账号状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.accountStatus == 1" class="start">启用</div>
                        <div v-if="scope.row.accountStatus == 2" class="stop">停用</div>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
        <div class="footer-center">
            <el-button type="primary" :loading="btnLoading" @click="$emit('close')">关闭</el-button>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            searchOptions: {
                id: this.$route.query.id,
                name: '',
                phone: '',
                deptIds: '',
                positionIds: []
            },
            tableConfig: {
                filterColumns: false,
                labelWidth: '80px',
                maxHeight: '400px',
                lazyQuery: {
                    url: '/authority/group/select',
                    op: {
                        selectList: 'selectNewUserSortList',
                        selectCount: 'selectNewUserSortCount'
                    }
                },
                multi: true
            },
            departmentOption: [], // 部门
            deptProps: {
                label: 'name',
                value: 'id',
                children: 'child',
                checkStrictly: true
            },
            options: [], // 职务
            btnLoading: false,
            checkBoxList: [],
            moduleName: '/systemManage/accountGroup'
        };
    },
    methods: {
        // 勾选数量
        checkChange(val) {
            let membersList = this.$refs.table.$refs.elTable.selection.map(i => i.id);
            this.checkBoxList = membersList;
        },
        // 添加组员
        addMember() {
            let membersList = this.$refs.table.$refs.elTable.selection.map(i => i.id);
            if (!membersList.length) {
                return this.$message.error('请勾选账号');
            }
            this.btnLoading = true;
            this.$axios(this.getModuleUrl('saveUserToGroup'), {
                op: 'saveUserToGroup',
                data: {
                    groupId: this.$route.query.id,
                    employIds: membersList
                }
            })
                .then(res => {
                    this.$message.success('操作成功');
                    this.btnLoading = false;
                    this.$emit('addSuccess');
                })
                .catch(() => {
                    this.btnLoading = false;
                });
        },
        //搜索
        search(type = 1) {
            this.$refs.table.search(type);
        },
        //重置
        reset() {
            this.$refs.table.reset();
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        // 部门请求
        getSelectValue() {
            this.$axios('authority/Organizational/select', {
                op: 'selectOrganizationalTreeAllDepart',
                data: JSON.stringify({ id: 0 })
            }).then(res => {
                this.departmentOption = JSON.parse(res.data);
            });
        },
        deptChange(e) {
            this.searchOptions.positionIds = [];
            if (!e.length) {
                this.options = [];
                this.searchOptions.positionIds = [];
            } else {
                this.selectDepartment(e);
            }
        },
        // 职务请求
        selectDepartment(e) {
            let id = e[e.length - 1];
            this.$axios('/authority/Organizational/select', {
                op: 'selectDepartmentpositionList',
                data: JSON.stringify({ id })
            }).then(res => {
                this.options = JSON.parse(res.data);
            });
        }
    },
    created() {
        this.getSelectValue();
    }
};
</script>

<style lang="scss" scoped>
.footer-center {
  width: 100%;
  text-align: center;
  margin-top: 20px;
  overflow: hidden;
}
.onsearch {
  display: flex;
  justify-content: space-between;
}

.checkTotal {
    height: 10px;
    i {
        display: inline-block;
        margin-top: 7px;
        color: #f05259;
        font-style: normal;
    }
}
::v-deep.ws-table-warp {
    padding-top: 0 !important;
    min-height: 385px !important;
    padding-bottom: 0 !important;
}
::v-deep.ws-table-warp .search-wrap {
    margin: 0 auto 0 24px !important;
    padding: 0 !important;
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
}
::v-deep.el-table__body-wrapper {
    max-height: 316px !important;
}

::v-deep.ws-table-warp .search-wrap {
    margin-left: 0 !important;
}
::v-deep.empty_text {
    height: 326px !important;
}
::v-deep .el-col-lg-8 {
    width: 50% !important;
}
::v-deep .el-table .cell {
    padding: 5px 10px;
}
</style>
