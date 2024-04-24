<template>
    <div>
            <!-- 账号组列表 -->
            <ws-table-el ref="table" v-bind="tableConfig" :col="8">
                <template #search>
                    <search-group>
                        <label for>账号组名称：</label>
                        <el-input v-model.trim="searchOptions.userGroupName" :maxlength="11" placeholder="请输入账号组名称" clearable></el-input>
                    </search-group>
                    <search-group>
                        <label for>组员姓名：</label>
                        <el-input v-model.trim="searchOptions.userName" :maxlength="30" placeholder="请输入组员姓名" clearable></el-input>
                    </search-group>
                    <search-group>
                        <label for>组员手机号：</label>
                        <el-input v-model.trim="searchOptions.phone" :maxlength="11" placeholder="请输入组员手机号码" clearable></el-input>
                    </search-group>
                    <search-group>
                        <label for>状态：</label>
                        <el-select v-model.trim="searchOptions.status" placeholder="请选择" clearable>
                            <el-option label="启用" value="1"></el-option>
                            <el-option label="停用" value="2"></el-option>
                        </el-select>
                    </search-group>
                </template>
                <template #options>
                    <div style="float: right">
                        <el-button-group v-if="oaPowerList.selectGroupList">
                            <el-button type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
                            <ws-throttle>
                                <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
                            </ws-throttle>
                        </el-button-group>
                        <el-button v-if="oaPowerList.saveUserGroup" icon="el-icon-circle-plus" plain style="margin-left: 10px" @click="accountGroup = true">新增</el-button>
                    </div>
                </template>
                <template>
                    <ws-table-column-el prop="name" label="账号组名称"></ws-table-column-el>
                    <ws-table-column-el prop="userNum" label="组员数量"></ws-table-column-el>
                    <ws-table-column-el prop="groupDesc" label="描述"></ws-table-column-el>
                    <ws-table-column-el prop="workflowNum" label="关联工作流数量（启用状态）"></ws-table-column-el>
                    <ws-table-column-el label="状态" width="80px">
                        <template slot-scope="scope">
                            <div v-if="scope.row.status == 1" class="start">启用</div>
                            <div v-if="scope.row.status == 2" class="stop">停用</div>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="createUserName" label="创建人"></ws-table-column-el>
                    <ws-table-column-el label="创建时间" width="280px"  >
                        <template slot-scope="scope">
                            <span>{{ scope.row.createTime | time }}</span>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el label="操作" width="280px" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" v-if="oaPowerList.groupDetail" class="c0088ff" @click="gotoAdd('detail', scope.row)">详情</el-button>
                            <el-button type="text" v-if="oaPowerList.manageGroups" class="c0088ff" @click="gotoAdd('manageGroups', scope.row.id)">管理组员</el-button>
                            <el-button type="text" v-if="oaPowerList.state" class="c0088ff" @click="resetPassword(scope.row.status, scope.row.id)">
                                {{ scope.row.status == '1' ? '停用' : '启用' }}
                            </el-button>
                            <el-button type="text" class="c0088ff" v-if="scope.row.status != '1'&&oaPowerList.deleteUserGroup" @click="deleted(scope.row)">删除</el-button>
                        </template>
                    </ws-table-column-el>
                </template>
            </ws-table-el>
            <!-- 启/停 -->
            <el-dialog class="dialogEnter" :title="pasID == 1 ? '停用' : '启用'" :visible.sync="centerDialogVisible" v-if="centerDialogVisible" width="30%" append-to-body center>
                <span>
                    {{ pasID == 1 ? `停用后，账号组在工作流配置时不能被选择，已配置该账号组的工作流不受影响` : '启用后，账号组可在工作流配置时被选择' }}
                    <br />
                    {{ pasID == 1 ? `是否确认禁用账号组？` : '是否确认启用账号组？' }}
                </span>
                <span slot="footer">
                    <el-button @click="centerDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="enterPas()">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog class="delete-dialog" title="删除" :visible.sync="delDialog"   width="30%" :center="true" >
            <span class="dialogCon">是否确认删除账号组？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delDialog = false">取 消</el-button>
                <el-button type="primary" @click="removeAccount()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog class="delete-dialog" title="删除" :visible.sync="delDialogError" width="30%" :center="true" >
            <span class="dialogCon">账号关联了工作流暂时无法删除!</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delDialogError = false">取 消</el-button>
            </span>
        </el-dialog>
            <!-- 新增 -->
            <el-dialog custom-class="dialogAccountGroup" @close="cancel" title="新增账号组" :visible.sync="accountGroup" width="35%" append-to-body>
                <el-form ref="accountGroupForm" :model="accountGroupForm" label-width="110px" :rules="rules">
                    <!-- 名称 -->
                    <el-form-item prop="name" label="账号组名称：">
                        <el-input v-model.trim="accountGroupForm.name" placeholder="请输入账号组名称" :maxlength="10"></el-input>
                    </el-form-item>
                    <!-- 描述 -->
                    <el-form-item prop="groupDesc" label="描述：">
                        <el-input
                            :maxlength="50"
                            :autosize="{ minRows: 6, maxRows: 6 }"
                            show-word-limit
                            placeholder="请输入描术信息，不超过50字"
                            type="textarea"
                            v-model.trim="accountGroupForm.groupDesc"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer">
                    <el-button @click="cancel()" :loading="btnLoading">取 消</el-button>
                    <el-button type="primary" @click="submit('accountGroupForm')" :loading="btnLoading">确 定</el-button>
                </span>
            </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pasID: '', // 启/停
            id: '',
            searchOptions: {
                userGroupName: '',
                userName: '',
                phone: '',
                status: ''
            },
            delDialog:false,
            delDialogError:false,
            tableConfig: {
                filterColumns: false,
                labelWidth: '86px',
                lazyQuery: {
                    moduleName: '/systemManage/accountGroup',
                    op: {
                        selectList: 'selectGroupList',
                        selectCount: 'selectGroupCount'
                    }
                }
            },
            moduleName: '/systemManage/accountGroup',
            centerDialogVisible: false, // 弹出层
            accountGroup: false, // 新增账号组弹窗
            accountGroupForm: {
                nema: '',
                groupDesc: ''
            },
            deletId:'',
            deletWorkflowNum:'',
            rules: {
                name: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请输入账号组名称'
                    }
                ],
                groupDesc: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请输入描述'
                    }
                ]
            },
            btnLoading: false
        };
    },
    filters: {
        // 时间过滤
        time: function (time) {
            if (!time) {
                return '';
            }
            return time.substring(0, time.length - 2);
        }
    },
    methods: {
        // 跳转
        gotoAdd(type, item) {
            if (type === 'detail') {
                // 详情
                let { id, name, status, groupDesc } = item;
                this.$router.push({
                    name: 'accountGroupDetails',
                    query: { id, name, status, groupDesc }
                });
            } else if (type === 'manageGroups') {
                // 管理组员
                let id = item;
                this.$router.push({
                    name: 'accountGroupManageGroups',
                    query: { id }
                });
            }
        },
        //删除
        deleted(row){
            if(row.workflowNum!==0){
                this.delDialogError=true
                return
            }
            this.deletId=  row.id
            this.delDialog=true
        },
       async removeAccount() {       
            let data = {
                data: {
                    groupId: this.deletId,
                },
                op: 'deleteUserGroup',
            };
            try {
                let res = await this.$axios('/authority/group/save', data);
                if(res.code===1){
                    this.$message.success('删除成功')
                    this.delDialog=false
                    this.search()
                }
            } catch (error) {}

        },
        // 停用
        enterPas() {
            this.centerDialogVisible = false;
            let id = this.pasID;
            let data = {
                op: 'updateUserGroupStatus',
                data: JSON.stringify({
                    id: this.id,
                    status: id == 1 ? 2 : 1
                })
            };
            this.$axios('/authority/group/select', data).then(res => {
                this.centerDialogVisible = false;
                this.$message.success('操作成功');
                this.search();
            });
        },
        // 启/停
        resetPassword(pasID, id) {
            this.pasID = pasID;
            this.id = id;
            this.centerDialogVisible = true;
        },
        //搜索
        search(type = 1) {
            this.$refs.table.search(type);
        },
        //重置
        reset() {
            this.searchOptions = {
                userGroupName: '',
                userName: '',
                phone: '',
                status: ''
            };
            this.search();
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        // 新增
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.btnLoading = true;
                    this.$axios(this.getModuleUrl('saveUserGroup'), {
                        data: this.accountGroupForm,
                        op: 'saveUserGroup'
                    })
                        .then(() => {
                            this.btnLoading = false;
                            this.$message.success('新增账号组成功');
                            this.cancel();
                            this.search();
                        })
                        .catch(() => {
                            this.cancel();
                        });
                }
            });
        },
        cancel() {
            this.accountGroup = false;
            this.btnLoading = false;
            this.accountGroupForm = {
                nema: '',
                groupDesc: ''
            };
        }
    }
};
</script>

<style lang="scss" scoped>
/deep/ .cancelBtn{
    color: #0088ff !important;
}
.delete-dialog{
   /deep/.el-dialog__body{ 
    text-align: center;
    }
}
/deep/.cardBox{
    min-height: calc(100vh - 160px) !important;
    border-radius: 8px;
    box-shadow: none;
}
.ws-table-warp {
    padding: 24px 24px 16px 24px !important;
}
/deep/.pagination-warp {
    height: 30px;
    padding-bottom: 0px !important;
    padding-top: 16px;
    box-sizing: content-box;
}
.c0088ff {
    color: #0088ff;
}
::v-deep.dialogEnter .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}
.dialogAccountGroup .el-dialog__body {
    padding-bottom: 0;
}
::v-deep.el-form-item__label {
    font-weight: 400;
}
::v-deep .el-dialog__body {
    margin-right: 30px;
    padding-bottom: 8px;
}
::v-deep.el-button {
    span {
        margin: 0 10px;
    }
}

</style>
