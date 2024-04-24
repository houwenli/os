<template>
    <div class="org_post_mange">
        <ws-table-el ref="table" v-bind="tableConfig" :col="8">
            <template #search>
                <search-group>
                    <label>所属机构：</label>
                    <el-select v-model="searchOptions.orgType" filterable placeholder="--请选择--" clearable>
                        <el-option v-for="item in orgPostFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>职务名称：</label>
                    <el-input v-model.trim="searchOptions.name" placeholder="请输职务名称" clearable></el-input>
                </search-group>
            </template>

            <template #searchBtns>
                <el-button-group>
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn" @click="reset" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
                <el-button class="add_btn" v-if="oaPowerList.saveOrgPosition" plain style="margin-left: 24px" @click="dialogVisible = true">新增</el-button>
            </template>

            <template>
                <ws-table-column-el align="center" prop="id" label="职务id"></ws-table-column-el>
                <ws-table-column-el align="center" prop="orgType" label="所属机构">
                    <template slot-scope="scope">
                        <span>{{ scope.row.orgType | orgPostFilters }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="name" label="职务"></ws-table-column-el>
                <ws-table-column-el align="center" prop="deptHead" label="是否负责人">
                    <template slot-scope="scope">
                        <span>{{ scope.row.deptHead ? '是' : '否' }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" width="100" label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" class="mgr10 c0088ff" :tabindex="scope.$index" v-if="oaPowerList.updateOrgPosition" @click="open(scope.row)">
                            修改
                        </el-button>
                        <el-popconfirm
                            v-if="oaPowerList.delOrgPosition && scope.row.outSourcingHead !== 1"
                            title="删除后不可恢复，确认删除吗？"
                            @confirm="del(scope.row.id)"
                            icon="el-icon-info"
                            icon-color="red"
                        >
                            <el-button type="text" slot="reference" style="color: #f05259">删除</el-button>
                        </el-popconfirm>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>

        <!-- 修改弹框 -->
        <el-dialog :title="title" :visible.sync="dialogVisible" :before-close="resetForm" width="600px">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
                <el-form-item label="所属机构" prop="orgType">
                    <el-select v-model="form.orgType" filterable placeholder="--请选择--" clearable :disabled="form.outSourcingHead === 1">
                        <el-option v-for="item in orgPostFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职位名称" prop="name">
                    <el-input v-model.trim="form.name" placeholder="请输职务名称" maxlength="20" clearable></el-input>
                </el-form-item>
                <el-form-item label="是否负责人" prop="deptHead">
                    <el-select v-model="form.deptHead" filterable placeholder="--请选择--" clearable :disabled="form.outSourcingHead === 1">
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm">取消</el-button>
                <el-button type="primary" @click="confirm">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    components: {},
    data() {
        return {
            moduleName: '/workbench/orgPostMange',
            tableConfig: {
                filterColumns: false,
                lazyQuery: {
                    moduleName: '/workbench/orgPostMange',
                    op: {
                        selectList: 'selectOrgList',
                        selectCount: 'selectOrgCount',
                    },
                },
            },
            searchOptions: {},
            dialogVisible: false,
            form: {},
            rules: {
                orgType: [
                    {
                        required: true,
                        message: '请选择所属机构',
                        trigger: 'blur',
                    },
                ],
                name: [
                    {
                        required: true,
                        message: '请输入职位名称',
                        trigger: 'blur',
                    },
                ],
                deptHead: [
                    {
                        required: true,
                        message: '请选择是否负责人',
                        trigger: 'blur',
                    },
                ],
            },
            op: {
                add: 'saveOrgPosition',
                update: 'updateOrgPosition',
                delete: 'delOrgPosition',
            },
        };
    },
    computed: {
        ...mapState('workbench', ['orgPostFilters']),
        title() {
            return this.form.id == null ? '新增' : '修改';
        },
    },
    methods: {
        open(value) {
            this.form = { ...value };
            this.dialogVisible = true;
        },
        search() {
            this.$refs.table.search();
        },
        reset() {
            this.$refs.table.reset();
        },
        async updatePosition() {
            try {
                let { id, orgType, name, deptHead } = this.form;
                let isAdd = id == null;
                let op = isAdd ? this.op.add : this.op.update;
                let data = Object.assign({}, { orgType, name, deptHead }, isAdd ? {} : { id });
                let res = await this._axios({ ...data, op }, this.moduleName);
                if (res.code == 1) {
                    this.$message.success(`${isAdd ? '新增' : '修改'}成功`);
                    this.search();
                }
            } catch (_err) {
                throw _err;
            }
        },
        confirm() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.updatePosition();
                    this.dialogVisible = false;
                    this.form = {};
                } else {
                    return false;
                }
            });
        },
        resetForm() {
            this.form = {};
            this.$refs.form.resetFields();
            this.dialogVisible = false;
        },
        async del(id) {
            try {
                let res = await this._axios({ id, op: this.op.delete }, this.moduleName);
                if (res.code == 1) {
                    this.$message.success('删除成功');
                    this.search();
                }
            } catch (_err) {
                throw _err;
            }
        },
    },
    created() {},
};
</script>

<style scoped lang="scss">
.org_post_mange {
    .el-select,
    .el-input {
        width: 100%;
    }
    .c0088ff {
        color: #0088ff;
    }

    .mgr10 {
        margin-right: 10px;
    }

    .add_btn {
        width: 95px;
    }
}
</style>
