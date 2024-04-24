<template>
    <div class="branchContainer">
        <ws-table-el :col="8" ref="table" v-bind="tableConfig" :header-cell-style="{ background: '#F5F7FA' }">
            <template #search>
                <search-group>
                    <label for>推广员姓名：</label>
                    <el-input v-model.trim="searchOptions.promoter" placeholder="请输入推广员姓名" :maxlength="30" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>推广员手机号：</label>
                    <el-input v-model.trim="searchOptions.promoterPhone" placeholder="请输入推广员手机号" :maxlength="30" clearable></el-input>
                </search-group>
                <!-- <search-group>
                    <label for>推广员所属机构：</label> -->
                    <!-- <el-select v-model="searchOptions.agencyNumber" clearable placeholder="请选择">
                        <el-option v-for="item in institutionList" :key="item.agencyNumber" :label="item.name" :value="item.agencyNumber"></el-option>
                    </el-select> -->
                    <!-- <el-select v-model="searchOptions.agencyNumber" clearable filterable remote reserve-keyword placeholder="请选择机构" :remote-method="remotePromoteOrgList">
                        <el-option v-for="item in institutionList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                    </el-select>
                </search-group> -->
            </template>
            <template #options>
                <div style="display: flex; justify-content: flex-end">
                    <el-button-group v-if="getModulePower('/workbench/BRpromoterMgr').selectListOfPr">
                        <el-button type="primary" style="width: 95px" icon="el-icon-search" @click="btnEvent('search', 2)">查询</el-button>
                        <el-button class="resetBtn" type="primary" @click="btnEvent('reset', 1)" icon="el-icon-refresh-left"></el-button>
                    </el-button-group>
                    <el-button v-if="getModulePower('/workbench/BRpromoterMgr').addOfPr" icon="el-icon-circle-plus" class="btn-right btnStyle" @click="btnEvent('add')">新增</el-button>
                </div>
            </template>
            <!-- 表格 -->
            <template>
                <ws-table-column-el prop="promoter" label="推广员姓名"></ws-table-column-el>
                <ws-table-column-el prop="promoterPhone" label="推广员手机号"></ws-table-column-el>
                <ws-table-column-el prop="agencyName" label="实体店名称"></ws-table-column-el>

                <ws-table-column-el label="操作" width="247px" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="getModulePower('/workbench/BRpromoterMgr').updateOfPr" @click="btnEvent('edit', scope.row)" class="c0088ff">修改</el-button>
                        <el-button type="text" class="c0088ff" @click="btnEvent('code', scope.row)">推广码</el-button>
                        <el-button type="text" v-if="getModulePower('/workbench/BRpromoterMgr').deleteOfPr" @click="btnEvent('del', scope.row.promoterId)">删除</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>

        <el-dialog :title="dialogTitle" top="148px" :visible.sync="dialogVisible" :lock-scroll="true" width="32%">
            <div class="dialog-box" v-if="dialogType === 'code'">
                <img class="qr-code" :src="dialogData.cdnUrl" />
                <p class="code-text">鼠标右键点击图片另存为保存</p>
            </div>

            <div v-else class="dialog-box">
                <el-form :model="dialogData" status-icon :rules="rules" ref="dialogData" label-width="110px" class="demo-ruleForm">
                    <el-form-item label="推广员姓名：" prop="promoter">
                        <el-input type="text" maxlength="10" v-model="dialogData.promoter" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="推广员手机号：" prop="promoterPhone">
                        <el-input type="tel" maxlength="11" v-model="dialogData.promoterPhone" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="所属机构：" prop="agencyNumber">
                        <!-- <el-select v-model="dialogData.agencyNumber" clearable placeholder="请选择">
                            <el-option v-for="item in dialogOption" :key="item.agencyNumber" :label="item.name" :value="item.agencyNumber"></el-option>
                        </el-select> -->
                        <el-select v-model="dialogData.agencyNumber" filterable remote reserve-keyword placeholder="请选择机构" :remote-method="remoteOrgList" style="width: 100%">
                            <el-option v-for="item in dialogOption" :key="item.agencyNumber" :label="item.orgName" :value="item.agencyNumber"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="dialog-btn">
                    <el-button :loading="btnLoading" @click="dialogVisible = false">取消</el-button>
                    <el-button :loading="btnLoading" type="primary" @click="submitForm">保存</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { _axios } from '@/utils/commMethods';
export default {
    name: 'promoterManage',
    data() {
        return {
            moduleName: '/workbench/BRpromoterMgr',
            dialogVisible: false,
            btnLoading: false,
            institutionList: [],
            searchOptions: {
                promoter: '',
                promoterPhone: '',
                agencyNumber: ''
            },
            tableConfig: {
                filterColumns: false,
                pageSizeList: [20, 50, 100],
                lazyQuery: {
                    moduleName: '/workbench/BRpromoterMgr',
                    op: {
                        selectList: 'selectListOfPr',
                        selectCount: 'selectCountOfPr'
                    },
                    immediate: false
                }
            },
            rules: {
                promoter: [
                    { required: true, message: '请输入推广员姓名', trigger: 'change' },
                    { pattern: this.$regexList.get('name'), message: '输入的名字为2-10个汉字' }
                ],
                promoterPhone: [
                    { required: true, message: '请输入推广员手机号', trigger: 'change' },
                    { pattern: this.$regexList.get('mobile'), message: '输入的手机号码格式不正确' }
                ],
                agencyNumber: [{ required: true, message: '请选择所属机构', trigger: 'change' }]
            },
            dialogType: '',
            dialogTitle: '',
            dialogData: {
                promoter: '',
                promoterPhone: '',
                agencyNumber: ''
            },
            operationType: '',
            dialogOption: []
        };
    },
    watch: {
        dialogVisible(val) {
            let vm = this;
            !val && vm.$refs['dialogData'] && vm.$refs['dialogData'].resetFields();
            !val &&
                (vm.dialogData = {
                    promoter: '',
                    promoterPhone: '',
                    agencyNumber: ''
                });
        }
    },
    methods: {
        btnEvent(type, data) {
            let vm = this;
            vm.dialogType = '';
            let titleList = {
                add: '新增',
                edit: '修改',
                code: '推广码'
            };
            vm.dialogTitle = titleList[type];
            vm.operationType = type; // 保存事件类型

            switch (type) {
                case 'search':
                    vm.$refs.table.search(data);
                    break;

                case 'reset':
                    vm.searchOptions = {};
                    vm.$refs.table.search(data);
                    break;

                case 'add':
                    vm.dialogVisible = true;
                    break;

                case 'edit':
                    vm.dialogData = data;
                    vm.dialogVisible = true;
                    break;

                case 'code':
                    vm.dialogType = 'code';
                    vm.dialogVisible = true;
                    vm.dialogData = data;
                    break;

                case 'del':
                    vm.$alert('删除后不可恢复，确认删除吗！', '删除', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        showCancelButton: true,
                        center: true
                    })
                        .then(async () => {
                            let res = await _axios({ promoterId: data, op: 'deleteOfPr' }, vm.moduleName);
                            res.code === 1 && vm.btnEvent('search', 1);
                        })
                        .catch(() => (vm.dialogVisible = false));
                    break;
            }
        },

        submitForm() {
            let vm = this;
            try {
                this.$refs['dialogData'].validate(async valid => {
                    if (valid) {
                        vm.btnLoading = true;
                        vm.dialogData.op = vm.operationType === 'add' ? 'addOfPr' : 'updateOfPr';
                        let res = await _axios(vm.dialogData, vm.moduleName);
                        vm.btnLoading = false;
                        if (res.code === 1) {
                            vm.dialogVisible = false;
                            vm.btnEvent('reset', 1);
                        }
                    }
                });
            } catch (err) {
            }
        },
        //查询机构接口
        async remotePromoteOrgList(queryString) {
            this.institutionList = await this.queryOrg(queryString);
        }, //查询机构接口
        async remoteOrgList(queryString) {
            this.dialogOption = await this.queryDiaOrg(queryString);
        },
        // 查询推广员所属机构【搜索】
        async queryOrg(queryString) {
            let vm = this;
            try {
                let res = await _axios({ op: 'selectPromoteOrgList', agencyName: queryString }, vm.moduleName);
                if (res.code === 1) {
                    let data = res.data;
                    return data;
                }
            } catch (err) {
            }
        },
        // 查询推广员所属机构【弹框】
        async queryDiaOrg(queryString) {
            let vm = this;
            try {
                let res = await _axios({ op: 'select', orgName: queryString || '',orgType:40 }, vm.moduleName);
                if (res.code === 1) {
                    let data = res.data;
                    this.dialogOption = data;
                    return data;
                }
            } catch (err) {
            }
        },
        search(type = 1) {
            this.$nextTick(() => {
                this.$refs.table.search();
            });
        }
    }
};
</script>

<style scoped lang="scss">
.branchContainer {
    font-size: 14px;
    color: #303133;

    .btn-right {
        float: right;
        margin-left: 16px;
    }
    .c0088ff {
        color: #0088ff;
    }

    .demo-ruleForm {
        padding: 13px 72px 0px 44px;
    }
    /deep/ .el-dialog__body {
        padding: 0 0 40px;
        color: #606266;
    }

    .dialog-btn {
        display: flex;
        justify-content: flex-end;
        margin-top: 29px;
        padding-right: 24px;
    }

    .qr-code {
        width: 300px;
        height: 300px;
        margin: 36px auto 0;
        display: block;
    }

    .code-text {
        text-align: center;
        color: #606266;
        line-height: 20px;
        font-size: 14px;
        padding: 30px 0 0px;
    }

    /deep/ .el-cascader,
    .el-select {
        width: 100%;
    }

    /deep/ .el-form-item__label {
        padding: 0;
        font-weight: 500;
    }

    /deep/ .el-form-item__error {
        padding-top: 1px;
    }

    /deep/ .el-form-item {
        margin-bottom: 16px;
    }
    .btnStyle {
        color: #f05259;
        border: 1px solid #f05259;
        width: 95px;
    }
}

</style>
