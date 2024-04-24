<template>
    <div class="branchContainer">
        <ws-table-el ref="table" v-bind="tableConfig" :header-cell-style="{ background: '#F5F7FA' }">
            <template #options>
                <div style="display: flex; justify-content: flex-end">
                    <el-button v-if="oaPowerList.addOfBc" icon="el-icon-circle-plus" class="btn-right btnStyle" @click="gotoForm('add')">新增</el-button>
                </div>
            </template>
            <!-- 表格 -->
            <template>
                <ws-table-column-el prop="agencyName" label="绑定机构"></ws-table-column-el>
                <ws-table-column-el prop="accountName" label="开户名"></ws-table-column-el>
                <ws-table-column-el prop="bankCard" label="银行卡号"></ws-table-column-el>
                <ws-table-column-el prop="bankName" label="开户银行"></ws-table-column-el>
                <ws-table-column-el prop="status" label="状态">
                    <template slot-scope="scope">
                        <div class="start" v-if="scope.row.status == 1">启用</div>
                        <div class="stop" v-if="scope.row.status == 0">停用</div>
                    </template>
                </ws-table-column-el>

                <ws-table-column-el label="操作" width="247px" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="getModulePower('/personalCenter/bankCardManage').openOrCloseOfBc" class="c0088ff" type="text" @click="updateStatus(scope.row)">
                            {{ scope.row.status === 1 ? '停用' : '启用' }}
                        </el-button>
                        <el-button type="text" v-if="scope.row.status === 0 && getModulePower('/personalCenter/bankCardManage').updateOfBc" @click="gotoForm('edit', scope.row)" class="c0088ff">
                            编辑
                        </el-button>
                        <el-button type="text" v-if="getModulePower('/personalCenter/bankCardManage').deleteOfBc && scope.row.status === 0" @click="deleteInfo(scope.row)">删除</el-button>
                        <el-button type="text" v-if="getModulePower('/personalCenter/bankCardManage').selectDetails" class="c0088ff" @click="gotoForm('detail', scope.row)">详情</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
        <el-dialog title="删除银行卡" :visible.sync="delDialogVisible" width="30%" :center="true" append-to-body>
            <span v-if="this.isWithdraw" class="dialogCon">是否删除【{{ bankCard }}】银行卡与【{{ agencyName }}】的绑定关系</span>
            <span v-else class="dialogCon">【{{ bankCard }}】银行卡在【{{ agencyName }}】仍有提现审核中，不能删除该机构</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delDialogVisible = false">取 消</el-button>
                <ws-throttle>
                    <el-button type="primary" @click="enterDelete()">确 定</el-button>
                </ws-throttle>
            </span>
        </el-dialog>
        <el-dialog title="停用银行卡" :visible.sync="stopDialogVisible" width="30%" :center="true" append-to-body>
            <span class="dialogCon">是否停用【{{ bankCard }}】银行卡与【{{ agencyName }}】的绑定关系</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="stopDialogVisible = false">取 消</el-button>
                <ws-throttle>
                    <el-button type="primary" @click="enterStop()">确 定</el-button>
                </ws-throttle>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'bankCardManage',
    data() {
        return {
            tableConfig: {
                filterColumns: false,
                // layout: "flow",
                pageSizeList: [20, 50, 100],
                lazyQuery: {
                    moduleName: '/personalCenter/bankCardManage',
                    op: {
                        selectList: 'selectListOfBc',
                        selectCount: 'selectCountOfBc'
                    }
                    // immediate: false
                }
            },
            delDialogVisible: false,
            stopDialogVisible: false,
            id: '', //id
            status: '', //状态
            bankCard: '', //银行卡号
            agencyName: '', //机构名字
            isWithdraw: false, //是否正在提现
            moduleName: '/personalCenter/bankCardManage'
        };
    },
    computed: {},
    methods: {
        search(type = 1) {
            this.$nextTick(() => this.$refs.table.search());
        },
        // 新增银行卡
        gotoForm(type, detail) {
            if (detail) {
                let { accountName, bankCard, bankName, id, idCardNum, reservePhone, relationId } = detail;
                this.$router.push({ name: 'bankCardMgr', query: { type, accountName, bankCard, bankName, id, idCardNum, reservePhone, relationId } });
            } else {
                this.$router.push({ name: 'bankCardMgr', query: { type } });
            }
        },
        // 修改银行卡状态
        updateStatus(val) {
            if (val.status === 0) {
                let data = {
                    data: { id: val.id, status: val.status === 1 ? 0 : 1 },
                    op: 'openOrCloseOfBc'
                };
                this.$axios(this.getModuleUrl('openOrCloseOfBc'), data).then(res => {
                    this.$message.success('启用成功');
                    this.search();
                });
            } else {
                this.stopDialogVisible = true;
                this.id = val.id;
                this.agencyName = val.agencyName;
                this.bankCard = val.bankCard;
                this.status = val.status;
            }
        },
        enterStop() {
            let data = {
                data: { id: this.id, status: this.status === 1 ? 0 : 1 },
                op: 'openOrCloseOfBc'
            };
            this.$axios(this.getModuleUrl('openOrCloseOfBc'), data).then(res => {
                this.search();
                this.stopDialogVisible = false;
                this.$message.success('停用成功');
            });
        },
        // 删除
        deleteInfo(val) {
            let data = {
                data: { bankCard: val.bankCard },
                op: 'selectCardWithdraw'
            };
            this.$axios(this.getModuleUrl('selectCardWithdraw'), data).then(res => {
                let data = JSON.parse(res.data);
                this.isWithdraw = !data.isWithdraw;
                this.bankCard = val.bankCard;
                this.agencyName = val.agencyName;
                this.delDialogVisible = true;
            });
        },
        enterDelete() {
            if (!this.isWithdraw) {
                this.delDialogVisible = false;
            } else {
                let data = {
                    data: { bankCard: this.bankCard },
                    op: 'deleteOfBc'
                };
                this.$axios(this.getModuleUrl('deleteOfBc'), data).then(res => {
                    this.search();
                    this.delDialogVisible = false;
                    this.$message.success('删除成功');
                });
            }
        },

        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    }
};
</script>

<style scoped lang="scss">
.branchContainer {
    font-size: 14px;
    color: #303133;
}
.btn-right {
    float: right;
    margin-left: 16px;
}
.c0088ff {
    color: #0088ff;
}

/deep/ .el-dialog {
    padding: 24px 0 20px 0;
}
/deep/ .el-dialog__header {
    text-align: center;
    padding: 0;
    .el-dialog__title {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
    }
}
/deep/ .el-dialog__body {
    text-align: center;
    padding: 0;
    margin: 10px 0 22px 0;
    color: #606266;
}
.btnStyle {
    color: #f05259;
    border: 1px solid #f05259;
    width: 95px;
}
/deep/ .el-dialog .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
}
/deep/ .el-dialog--center .el-dialog__body {
    text-align: center !important;
    line-height: 25px;
}
/deep/ .ws-table-warp {
    padding: 0 !important;
}
</style>
