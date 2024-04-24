<template>
    <div>
        <div class="content">
            <ws-table-el ref="table" v-bind="tableConfig" :col="8">
                <template #search>
                    <search-group>
                        <label for>菜单名称：</label>
                        <el-input v-model.trim="searchOptions.name" placeholder="请输入内容模糊查询" clearable :maxlength="20"></el-input>
                    </search-group>
                    <search-group>
                        <label for>应用端口：</label>
                        <el-select v-model="searchOptions.orgType" placeholder="请选择应用端口">
                            <el-option v-for="item in applicationPort" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </search-group>
                    <search-group>
                        <label for>使用状态：</label>
                        <el-select v-model="searchOptions.status" placeholder="请选择使用状态">
                            <el-option label="启用" value="1"></el-option>
                            <el-option label="禁用" value="2"></el-option>
                        </el-select>
                    </search-group>
                </template>
                <template #searchBtns>
                    <el-button-group>
                        <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                        <ws-throttle>
                            <el-button type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
                        </ws-throttle>
                    </el-button-group>
                    <ws-throttle>
                        <el-button icon="el-icon-circle-plus" class="btn-right btnStyle" @click="openDialog('add')" v-if="powerList.saveDeeplink">新增</el-button>
                    </ws-throttle>
                </template>
                <template>
                    <ws-table-column-el prop="orgType" label="应用端口">
                        <template slot-scope="scope">
                            <span>{{ portText(scope.row.orgType) }}</span>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="parentName" label="父级">
                        <template slot-scope="scope">
                            {{ `${scope.row.parentName === null ? '-' : scope.row.parentName}` }}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="name" label="子级">
                        <template slot-scope="scope">
                            {{ `${scope.row.name === null ? '-' : scope.row.name}` }}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="code" label="菜单code"></ws-table-column-el>
                    <ws-table-column-el prop="url" label="菜单URL"></ws-table-column-el>
                    <ws-table-column-el prop="status" label="使用状态">
                        <template slot-scope="scope">
                            {{ `${scope.row.status == 1 ? '启用' : '禁用'}` }}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="updateUserName" label="修改人"></ws-table-column-el>
                    <ws-table-column-el prop="updateTime" label="修改时间"></ws-table-column-el>
                    <ws-table-column-el fixed="right" label="操作" min-width='200'>
                        <template slot-scope="scope">
                            <el-button type="text" @click="openDialog('details', scope.row)" style="color: #0088ff">详情</el-button>
                            <el-button type="text" @click="openDialog('update', scope.row)" v-if="powerList.updateDeeplink" style="color: #0088ff">编辑</el-button>
                            <el-button type="text" @click="openDialogState(scope.row.id, scope.row.status)" v-if="powerList.changeDeeplinkStatus" style="color: #0088ff">
                                {{ `${scope.row.status == 1 ? '禁用' : '启用'}` }}
                            </el-button>
                            <el-button type="text" @click="openDelect(scope.row.id)" v-if="powerList.deleteDeeplink&&scope.row.status === 2 ">删除</el-button>
                        </template>
                    </ws-table-column-el>
                </template>
            </ws-table-el>
        </div>
        <el-dialog :title="formType" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false" @closed="closed">
            <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                <el-form-item label="应用端口：" prop="orgType">
                    <el-select :disabled="this.formType != '新增'" v-model="ruleForm.orgType">
                        <el-option v-for="(item, index) in applicationPort" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="菜单层级：" prop="type">
                    <el-select :disabled="this.formType != '新增'" v-model="ruleForm.type">
                        <el-option label="父菜单" :value="1"></el-option>
                        <el-option label="子菜单" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="父菜单名称：" v-if="ruleForm.type == '2'" prop="parentId">
                    <el-select :disabled="this.formType != '新增' && this.formType != '编辑'" v-model="ruleForm.parentId">
                        <el-option v-for="item in linkList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="父菜单名称：" v-else prop="parentName">
                    <el-input :disabled="this.formType != '新增' && this.formType != '编辑'" v-model.trim="ruleForm.parentName" placeholder="请输入菜单名称" :maxlength="20"></el-input>
                </el-form-item>

                <el-form-item label="子菜单名称：" v-if="ruleForm.type == '2'" prop="name">
                    <el-input :disabled="this.formType != '新增' && this.formType != '编辑'" v-model.trim="ruleForm.name" placeholder="请输入菜单名称" :maxlength="20"></el-input>
                </el-form-item>

                <el-form-item label="菜单URL：" prop="url">
                    <el-input :disabled="this.formType != '新增' && this.formType != '编辑'" v-model.trim="ruleForm.url" placeholder="请输入deeplink" :maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="菜单code：" prop="code">
                    <el-input :disabled="this.formType != '新增'" v-model.trim="ruleForm.code" placeholder="请输入菜单code" :maxlength="10"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="formType != '详情'">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="删除菜单" :visible.sync="delDialog" custom-class="delDialog" v-if="delDialog" width="30%" :center="true" append-to-body :lock-scroll="false">
            <span class="dialogCon">是否删除该菜单？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delDialog = false">取 消</el-button>
                <el-button type="primary" @click="delect">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchOptions: {
                orgType: '',
                name: '',
                status: '',
            },
            tableConfig: {
                emptyModel: true,
                filterColumns: false,
                loading: true,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    // url: '/authority/deeplink/select',
                    moduleName: '/technology/deeplinkMenu',
                    op: {
                        selectList: 'selectList',
                        selectCount: 'selectCount',
                    },
                },
            },
            moduleName: '/technology/deeplinkMenu',
            rules: {
                orgType: [{ required: true, message: '请选择应用端口', trigger: 'blur' }],
                type: [{ required: true, message: '请选择菜单层级', trigger: 'blur' }],
                url: [{ required: true, message: '请输入deeplink', trigger: 'blur' }],
                code: [
                    { required: true, trigger: 'blur', message: '请输入code' },
                    {
                        pattern: /^\d+$/,
                        message: '请输入正整数',
                        trigger: ['blur', 'change'],
                    },
                ],
                name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
                parentName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
                parentId: [{ required: true, message: '请选择父菜单', trigger: 'blur' }],
            },
            applicationPort: [
                {
                    label: '总部',
                    value: 0,
                },
                {
                    label: '分公司',
                    value: 20,
                },
                {
                    label: '服务中心',
                    value: 30,
                },
                {
                    label: '实体店',
                    value: 40,
                },
            ],
            linkList: [],
            delDialog: false, //删除的弹框
            dialogFormVisible: false, //新增的弹框
            delId: '',
            formType: '',
            changeStateId: '',
            formState: '',
            ruleForm: {
                orgType: 0,
                type: 1,
                parentId: '',
                parentName: '',
                name: '',
                url: '',
                code: '',
            },
        };
    },

    watch: {
        'ruleForm.orgType': {
            handler(val) {
                this.getDeepSelect(val);
                if (this.formType === '新增') {
                    this.ruleForm.parentId = '';
                }
            },
            immediate: true,
        },
        'ruleForm.type': {
            handler(val) {
                this.$refs['ruleForm'] && this.$refs['ruleForm'].clearValidate();
            },
        },
    },

    computed: {
        portText() {
            return function (orgType) {
                if (orgType === null) return '-';
                let val = this.applicationPort.filter(item => item.value == orgType)[0];
                return val?.label;
            };
        },
    },

    methods: {
        //修改启用/禁用
        async openDialogState(id, status) {
            try {
                let op = 'changeDeeplinkStatus';
                let res = await this._axios({ id, status: status == '1' ? '2' : '1', op }, '', this.getModuleUrl(op));
                if (res.code == 1) {
                    this.$message.success(`${status == '1' ? '禁用' : '启用'}成功`);
                    this.$refs.table.search();
                }
            } catch (_err) {
                throw _err;
            }
        },
        //保存
        save() {
            this.$refs['ruleForm'].validate(async valid => {
                if (valid) {
                    try {
                        if (this.ruleForm.type === 1) {
                            this.ruleForm.name = this.ruleForm.parentName;
                        }
                        let op = this.formType == '编辑' ? 'updateDeeplink' : 'saveDeeplink';
                        let url = this.getModuleUrl(op);
                        this.ruleForm.name = this.ruleForm.name.replace(/ /g, '');
                        let res = await this._axios({ ...this.ruleForm, op }, '', url);
                        if (res.code == 1) {
                            this.dialogFormVisible = false;
                            this.$message.success('保存成功');
                            this.$refs.table.search();
                        }
                    } catch (_err) {
                        throw _err;
                    }
                }
            });
        },
        async getDeepSelect(orgType) {
            try {
                let res = await this._axios({ orgType, op: 'selectListByOrgType' }, '', '/authority/deeplink/select');
                res.code == 1 && (this.linkList = res.data);
            } catch (_err) {
                throw _err;
            }
        },

        //详情/新增/编辑
        openDialog(type, row) {
            try {
                this.dialogFormVisible = true;

                switch (type) {
                    case 'add':
                        this.formType = '新增';
                        break;
                    case 'update':
                        this.formType = '编辑';
                        this.ruleForm = JSON.parse(JSON.stringify(row));
                        break;
                    default: {
                        this.ruleForm = JSON.parse(JSON.stringify(row));
                        this.formType = '详情';
                    }
                }
            } catch (_err) {
                throw _err;
            }
        },
        //删除列表
        openDelect(id) {
            this.delId = id;
            this.delDialog = true;
        },
        async delect() {
            let op = 'deleteDeeplink';
            let res = await this._axios({ id: this.delId, op }, '', this.getModuleUrl(op));
            if (res.code == 1) {
                this.$message.success('删除成功');
                this.delDialog = false;
                this.$refs.table.search();
            }
        },
        closed() {
            this.ruleForm = {
                orgType: 0,
                type: 1,
                parentId: '',
                name: '',
                url: '',
                code: '',
            };

            this.$refs['ruleForm'] && this.$refs['ruleForm'].clearValidate();
        },
        search() {
            this.$refs.table.search();
        },
        reset() {
            this.searchOptions = {
                orgType: '',
                name: '',
                status: '',
            };
            this.search();
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
};
</script>

<style lang="scss" scoped>
.content {
    height: 100%;
}
.ws-table-warp {
    display: flex;
    flex-direction: column;
    padding: 24px 24px 16px 24px !important;
}
/deep/.pagination-warp {
    height: 30px;
    padding-bottom: 0px !important;
    padding-top: 16px;
    box-sizing: content-box;
}
/deep/.el-dialog {
    width: 604px;
    .dialogCon {
        text-align: center;
    }
    .el-form-item {
        width: 100%;

        .el-select {
            width: 100% !important;
            // background: #f05259;
        }
    }
    .el-form-item__content {
        margin-left: 0 !important;
        width: calc(100% - 110px);
    }
    .el-dialog__body {
        padding: 35px 24px 24px 24px !important;
        display: flex;
        flex-direction: column;
    }
}
.btnStyle {
    color: #f05259;
    border: 1px solid #f05259;
    width: 95px;
}

/deep/ .searchBtns {
    margin: 0px;
    display: flex;
    justify-content: space-between;
}
/deep/ .el-button--medium {
    margin-left: 10px;
}
</style>
