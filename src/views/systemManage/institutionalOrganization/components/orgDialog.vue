<template>
    <div class="processPointDia">
        <el-dialog :title="`${dataInfo.name}组织调整`" width="1100px" :visible="showProcessPerson" @close="closeDia()">
            <div class="mechanism" v-loading="loading">
                <el-form ref="form" :model="form" label-width="130px" class="form" :rules="rules">
                    <el-row type="flex" justify="space-between" :gutter="70">
                        <el-col :span="12">
                            <el-form-item label="原归属大区名称:">
                                <el-input disabled v-model.trim="form.parentName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="原大区ID:">
                                <el-input disabled v-model.trim="form.odlparentId"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row justify="space-between" :gutter="70">
                        <el-col :span="12">
                            <el-form-item label="选择新大区:" prop='parentId'>
                                <el-select v-model="form.parentId" placeholder="请选择新大区" style="width: 100%">
                                    <el-option v-for="item in hierarchyOption" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="title">调整记录</div>
                <ws-table-el ref='table' v-bind="tableConfig" :total="total" @currentChange='currentChange' :data="tableData" border>
                    <ws-table-column-el prop="userName" align="left" label="修改人"></ws-table-column-el>
                    <ws-table-column-el prop="updateTime" align="left" label="修改时间"></ws-table-column-el>
                </ws-table-el>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="closeDia()">取消</el-button>
                    <ws-throttle>
                        <el-button type="primary" @click="enterDia()">确定</el-button>
                    </ws-throttle>
                </span>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props: {
        showProcessPerson: {
            type: Boolean,
            default: true,
        },
        listTitle: {
            type: String,
        },
        dataInfo: {
            type: Object,
            default: '',
        },
    },
    watch: {
        dataInfo(val) {
            if (val.orgType == 20) {
                this.getEditPerson();
                this.getParentName(val.parentId);
                this.getLastorgSelect();
            }
        },
    },
    data() {
        return {
            tableConfig: {
                filterColumns: false,
                pageSizeList: [10],
            },
            tableData: [],
            form: {
                parentName: '', //原大区名
                odlparentId: '', //原大区id
                parentId: '', //调整后id
            },
            total: 0,
            //大区select框
            hierarchyOption: [],
            moduleName: '/systemManage/institutionalOrganization',
            loading: false,
            rules: {
                parentId: [{ required: true, message: '请选择新大区名称', trigger: 'change' }],
            },
        };
    },
    methods: {
        closeDia() {
            this.$emit('closepop');
            this.form.parentId = '';
        },
        //获取父级部门name接口
        getParentName(id) {
            let data = {
                op: 'selectDeptDetailInfo',
                data: { id },
            };
            this.$axios(this.getModuleUrl(data.op), data).then(res => {
                let data = JSON.parse(res.data);
                let { id, name } = data;
                this.form.parentName = name;
                this.form.odlparentId = id;
            });
        },
        //获取所有大区下拉框接口
        getLastorgSelect() {
            let data = {
                op: 'selectDeptList',
                data: { orgType: 5 },
            };
            this.$axios(this.getModuleUrl(data.op), data).then(res => {
                let data = JSON.parse(res.data);
                //过滤掉上级大区
                data = data.filter(item => item.id !== this.form.odlparentId);
                this.hierarchyOption = data;
            });
        },
        //调整组织接口
        enterDia() {
            let form = this.$refs['form'];
            form.validate(valid => {
                if (valid) {
                    this.loading = true;
                    let data = {
                        op: 'transferDept',
                        data: { id: this.dataInfo.id, parentId: this.form.parentId },
                    };
                    this.$axios(this.getModuleUrl(data.op), data)
                        .then(res => {
                            if (res.code == 1) {
                                this.$message.success('调整成功');
                                this.getEditPerson();
                                this.loading = false;
                                this.$emit('closepop');
                                this.$emit('refresh');
                            }
                        })
                        .catch(() => {
                            this.loading = false;
                        });
                }
            });
        },
        //获取修改人信息接口
        getEditPerson() {
            let data = {
                op: 'selectUserOperationPage',
                data: { pageSize: 10, currentPage: 1, body: { deptId: this.dataInfo.id } },
            };
            this.$axios(this.getModuleUrl(data.op), data).then(res => {
                let data = JSON.parse(res.data);
                console.log(data);
                this.tableData = data.body;
                this.total = data.count;
            });
        },
        //分页
        currentChange(currentPage) {
            let data = {
                op: 'selectUserOperationPage',
                data: { pageSize: currentPage.pageSize, currentPage: currentPage.currentPage, body: { deptId: this.dataInfo.id } },
            };
            this.$axios(this.getModuleUrl(data.op), data).then(res => {
                let data = JSON.parse(res.data);
                this.tableData = data.body;
            });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
};
</script>
<style lang="scss" scoped>
.mechanism {
    width: 100%;
    border-radius: 4px;
    form {
        padding: 0 20px 0 20px !important;
    }
}
.close {
    background: #f5f7fa;
    border-radius: 4px;
    padding: 10px 7px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #909399;
}
.open {
    background: #e1fef7;
    border-radius: 4px;
    padding: 10px 7px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #2ac39b;
}
.title {
    text-align: left !important;
    height: 28px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #303133;
    line-height: 28px;
    margin-left: 20px;
}
/deep/.ws-table-warp .empty-table {
    height: 100% !important;
}
.ws-table-warp {
    padding: 15px 32px 32px 32px !important;
}
/deep/.el-dialog__header {
    text-align: left !important;
    margin: 0 0 25px 20px !important;
}
/deep/.el-table__body-wrapper .is-scrolling-none {
    height: 100% !important;
}
/deep/.el-table {
    height: 100% !important;
}
</style>
