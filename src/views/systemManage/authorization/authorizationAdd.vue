<template>
    <div class="permissionlist">
        <div class="form-content-wrap">
            <!-- 新增 -->
            <div style="margin-bottom: 36px">
                <!-- <el-tabs class="tab-wrap" v-model="activeName">
                    <el-tab-pane label="总部" name="0"></el-tab-pane>
                    <el-tab-pane label="总区" name="4"></el-tab-pane>
                    <el-tab-pane label="大区" name="5"></el-tab-pane>
                    <el-tab-pane label="一级机构" name="20"></el-tab-pane>
                    <el-tab-pane label="二级机构" name="30"></el-tab-pane>
                    <el-tab-pane label="实体店" name="40"></el-tab-pane>
                </el-tabs> -->
                <div>
                    <div class="middle">
                        <div class="middleTitle">部门及职务</div>
                        <el-button icon="el-icon-circle-plus" class="addButton" @click="addPersonnel()">新增</el-button>
                    </div>
                    <div class="middleTitle" v-if="activeName == 0">
                        <el-radio-group v-model="authorizationType" @change="authorizationTypeChange">
                            <el-radio label="1">按部门授权</el-radio>
                            <el-radio label="2">按职务授权</el-radio>
                        </el-radio-group>
                    </div>
                    <!-- table表格 -->
                    <div class="tableList">
                        <el-table ref="tableRef" :data="tableData" style="width: 100%" :border="true" :header-cell-style="tableStyle">
                            <el-table-column label="选择部门/类型" v-if="activeName == 0">
                                <template slot-scope="scope">
                                    <el-cascader :props="depOptionProps" filterable collapse-tags @change="handleChange(scope.row, scope.$index)" :style="{ width: '95%' }" v-model="scope.row.deptIds" placeholder="请选择部门类型" separator="-"></el-cascader>
                                </template>
                            </el-table-column>
                            <el-table-column label="选择职务" v-if="authorizationType==2||activeName != 0">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.positionIds" :disabled="scope.row.deptIds.length==0 && activeName == 0" multiple collapse-tags placeholder="请选择职务" :style="{ width: '95%' }" @change="positionChange(scope.row)" @focus='getpositionOption(scope.row)'>
                                        <el-option v-for="item in positionOption" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="关联角色">
                                <template slot-scope="scope">
                                    <el-select collapse-tags v-model="scope.row.roleIds" multiple filterable placeholder="请选择角色" :style="{ width: '95%' }" value-key="id">
                                        <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column width="200px" fixed="right" label="操作">
                                <template slot-scope="scope">
                                    <el-button @click="deleteRow(scope.$index)" type="text" style="color: #f05259">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <div class="saveButon">
                <el-button class="buttons" @click="goBack()">取消</el-button>
                <el-button class="buttons" type="primary" @click="onSubmit('form')" :loading="saveLoading">保存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'addPersonnel',
    data() {
        return {
            // table表格数据
            tableData: [],
            saveLoading: false,
            // 角色
            roleOptions: [],
            moduleName: '/systemManage/authorization',
            authorizationType: '1', //授权类型 1：按部门授权，2：按职务授权
            //职务option
            positionOption: [],
            //部门select框配置
            depOptionProps: {
                value: 'id',
                label: 'name',
                children: 'child',
                lazy: true,
                lazyLoad: this.cascaderLazyLoad,
                leaf: 'childFlag',
                multiple: true,
                checkStrictly: true,
            },
            routeQuery: this.$route.query,
            activeName: '0',
            roleList: [],
            tableStyle: {
                background: '#F5F7FA',
                'font-family': 'PingFangSC-Medium, PingFang SC',
                'font-weight': '600',
                color: '#606266',
            },
        };
    },
    created() {
        this.getAllRole(this.routeQuery.orgType);
    },
    watch: {
        activeName(val) {
            this.tableData = [];
            this.getAllRole(val);
            this.selectOrgdep(val, val);
            this.positionOption = [];
            this.roleOptions = [];
        },
    },
    methods: {
        // 部门懒加载
        cascaderLazyLoad(node, resolve) {
            if (node.isLeaf) return resolve();
            if (node.level == 0) {
                this.$axios('authority/Organizational/select', {
                    op: 'getDeptChildList',
                    data: JSON.stringify({ id: 0, orgType: 0 }),
                }).then(res => {
                    const data = JSON.parse(res.data);
                    resolve(this.nodeFilter(data));
                });
            } else {
                this.$axios('authority/Organizational/select', {
                    op: 'getDeptChildList',
                    data: JSON.stringify({ id: node.value }),
                }).then(res => {
                    const data = JSON.parse(res.data);
                    resolve(this.nodeFilter(data));
                });
            }
        },
        // 过滤叶子节点
        nodeFilter(val) {
            val.forEach(item => {
                if (item.childFlag == 1) {
                    item.childFlag = false;
                } else {
                    item.childFlag = true;
                }
            });
            return val;
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        //保存
        async onSubmit() {
            let params = {};
            // 空数据校验
            if (this.tableData.length == 0) return this.$message.error('请添加部门和职务');
            // 部门校验
            if (this.activeName == 0) {
                let departNameArr = this.tableData.map(item => {
                    return item.deptIds;
                });
                let depStatus = departNameArr.some(item => {
                    return item.length == 0;
                });
                if (depStatus) return this.$message.error('请选择部门！');
            }
            // 职务校验
            let ispositionId = this.tableData.some(item => {
                return item.deptIds.length > 0 && !item.positionIds;
            });
            if (ispositionId && this.authorizationType == 2) return this.$message.error('请选择职务！');
            // 角色校验
            let roleIdsArr = this.tableData.map(item => {
                return item.roleIds;
            });
            let roleStatus = roleIdsArr.some(item => {
                return item.length == 0;
            });
            if (roleStatus) return this.$message.error('选择职务后，关联角色必填！');
            //数据处理
            let addList = this.tableData.map(item => {
                if (this.authorizationType == 2 && this.activeName == 0) {
                    return {
                        positionIds: item.positionIds,
                        roleIds: item.roleIds,
                        deptIds: [item.deptIds[item.deptIds.length - 1]],
                    };
                } else if (this.authorizationType == 1 && this.activeName == 0) {
                    return {
                        positionIds: [],
                        roleIds: item.roleIds,
                        deptIds: item.deptIds.map(items => items[items.length - 1]),
                    };
                } else {
                    return {
                        positionIds: item.positionIds,
                        roleIds: item.roleIds,
                        deptIds: [],
                    };
                }
            });
            params = {
                data: {
                    deptType: this.activeName == '0' || this.activeName == '4' || this.activeName == '5' ? 1 : 2, // 部门类型
                    orgType: this.activeName, //机构类型
                    addType: this.activeName == '0' ? this.authorizationType : 2, //授权类型 1：按部门授权，2：按职务授权
                    addList,
                },
                op: 'add',
            };
            try {
                this.saveLoading = true;
                let res = await this.$axios('/authority/positionAuth/save', params);
                if (res.code == 1) {
                    this.$message.success('新增成功');
                    this.$router.push({ name: 'authorization' });
                    this.saveLoading = false;
                }
            } catch (err) {
                this.saveLoading = false;
            }
        },
        // 点击返回
        goBack() {
            this.$router.push({ name: 'authorization' });
        },
        // 点击新增
        addPersonnel() {
            if (this.tableData.length >= 20) {
                return this.$message.error('部门及职务最多添加至20条！');
            }
            //校验信息是否填完整
            let tabledataStatus;
            if (this.activeName == 0 && this.authorizationType == 2) {
                tabledataStatus = this.tableData.every(item => {
                    return item.deptIds && item.positionIds && item.roleIds;
                });
            } else if (this.activeName == 0 && this.authorizationType == 1) {
                tabledataStatus = this.tableData.every(item => {
                    return item.deptIds && item.roleIds;
                });
            } else {
                tabledataStatus = this.tableData.every(item => {
                    return item.positionIds && item.roleIds;
                });
            }
            if (this.tableData.length > 0 && !tabledataStatus) {
                this.$message.error('请将上一栏信息填充完整再添加');
            } else {
                let list = {
                    positionIds: '', // 职务select的value
                    roleIds: '', // 角色id
                    deptIds: '', // 部门名称select框的value
                };
                this.tableData.push(list);
            }
        },
        // 根据部门查角色，获取部门默认角色
        handleChange(row) {
            row.positionIds = '';
            row.roleIds = '';
            if (this.authorizationType == 2) {
                this.selectOrgdep(row.deptIds[row.deptIds.length - 1], 0);
            }
        },
        // 职务变更，清楚已选择角色
        positionChange(row) {
            row.roleIds = '';
        },
        // 删除table
        deleteRow(index) {
            this.tableData.splice(index, 1);
        },
        // 职务select框change事件
        changedeptType(value) {
            value.row.deptIds = '';
            value.row.positionIds = '';
        },
        getpositionOption(row) {
            this.selectOrgdep(row.deptIds[row.deptIds.length - 1], 0);
        },
        // 根据部门类型查询职务
        async selectOrgdep(id, type) {
            let params = {
                op: 'selectDepartmentpositionList',
            };
            if (type == 0) {
                params.data = { id };
            } else {
                params.op = 'selectOrgPositions';
                params.data = { orgType: id };
            }
            let res = await this.$axios('authority/Organizational/select', params);
            this.positionOption = JSON.parse(res.data);
        },
        //切换职务类型change事件
        authorizationTypeChange(val) {
            this.tableData = [];
            if (val == 1) {
                this.depOptionProps.multiple = true;
            } else if (val == 2) {
                this.depOptionProps.multiple = false;
            }
        },
        getAllRole(orgType = 0) {
            this.$axios('/authority/role/select', {
                op: 'getRoleByType',
                data: { orgType },
            }).then(res => {
                let data = JSON.parse(res.data);
                this.roleOptions = data;
            });
        },
    },
};
</script>

<style lang="scss">
.permissionlist {
    height: 100%;
    .middleTitle {
        height: 28px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #303133;
        line-height: 28px;
        margin-bottom: 16px;
    }
    .form-content-wrap {
        width: 100%;
        background: #ffffff;
        padding: 24px 40px;
        margin-bottom: 59px;
        border-radius: 8px;
        .tab-wrap {
            .el-tabs__nav-wrap::after {
                content: none;
            }
            .el-tabs__nav {
                margin: auto;
            }
            .el-tabs__header {
                display: flex;
                justify-content: center;
                margin-bottom: 0;
                .el-tabs__nav-wrap {
                    background-color: #f0f2f5;
                    border-radius: 4px 0px 0px 4px;
                    .el-tabs__active-bar {
                        width: 0 !important;
                    }
                    ::after {
                        width: 0;
                    }
                }
                .el-tabs__item {
                    width: 124px;
                    height: 40px;
                    text-align: center;
                    color: #606266;
                    padding: 0;
                    .is-top:last-child {
                        border-radius: 0px 4px 4px 0px !important;
                    }
                }
                .is-active {
                    background-color: #f05259;
                    color: #fff;
                    opacity: 1;
                }
                &.is-top:last-child {
                    // padding-right: 20px;
                    border-radius: 0px 4px 4px 0px !important;
                }
                .el-tabs__item:last-child() {
                    border-radius: 0px 4px 4px 0px !important;
                }
            }
            .el-tabs__nav-wrap {
                display: inline-block;
                border-radius: 4px 4px 4px 4px !important;
            }
        }
        .roleSelect {
            overflow: auto;
        }
        .header {
            width: 80px;
            height: 28px;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #303133;
            line-height: 28px;
        }
        .middle {
            width: 100%;
            height: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 24px;
            margin-bottom: 16px;
            .addButton {
                border: 1px solid #f05259;
                border-radius: 4px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #f05259;
            }
        }
        .ws-organization {
            /deep/ .el-cascader {
                width: 100%;
            }
        }
        .footer {
            width: 100%;
            margin-top: 32px;
        }
        .el-col-7 {
            .el-form-item {
                margin-bottom: 0px !important;
            }
        }
        .saveButon {
            position: fixed;
            bottom: 0;
            left: 0;
            width: calc(100% + 166px);
            height: 64px;
            background: #ffffff;
            box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.04);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999;
        }
    }
    .buttons {
        width: 160px;
        height: 36px;
    }
}
</style>
