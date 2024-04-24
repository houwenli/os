<template>
    <el-dialog :title="title" :visible.sync="isDialogVisible" append-to-body top="1vh" width="50%">
        <div class="mechanism">
            <el-form :model="searchOptions" label-width="100px" style="padding-top: 24px">
                <el-col :span="15">
                    <el-form-item label="账号组名称：">
                        <el-input style="width: 100%" v-model.trim="searchOptions.userGroupName" :maxlength="10" placeholder="请输入账号组名称" clearable></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="7" :offset="2">
                    <el-form-item label="" style="float: right">
                        <el-button-group>
                            <el-button type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
                        </el-button-group>
                    </el-form-item>
                </el-col>
            </el-form>

            <ws-table-el ref="table" v-bind="tableConfig">
                <template>
                    <ws-table-column-el prop="name" label="账号组名称" ></ws-table-column-el>
                    <ws-table-column-el prop="userNum" label="组员数量" ></ws-table-column-el>
                    <ws-table-column-el prop="groupDesc" label="描述"></ws-table-column-el>
                    <ws-table-column-el  label="状态" width="80px">
                        <template slot-scope="scope">
                            <div v-if="scope.row.status == 1" class="start">启用</div>
                            <div v-if="scope.row.status == 2" class="stop">停用</div>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el label="操作" width="180px" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" class="c0088ff" @click="handleAddGroup(scope.row)">确认添加</el-button>
                        </template>
                    </ws-table-column-el>
                </template>
            </ws-table-el>

            <div class="btnDiv">
                <el-button type="primary" @click="handleCancle">关闭</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'groupSelect',
    props: {
        title: { type: String, default: '指定账号组' },
        dialogVisible: { type: Boolean, default: true }
    },
    data() {
        return {
            tableData: [],
            searchOptions: {
                status: 1,
                userGroupName: ''
            },
            tableConfig: {
                filterColumns: false,
                autoHeight: false,
                lazyQuery: {
                    moduleName: '/systemManage/accountGroup',
                    op: {
                        selectList: 'selectGroupList',
                        selectCount: 'selectGroupCount'
                    },
                    beforeQuery: this.beforeQuery
                }
            },
            isDialogVisible: this.dialogVisible
        };
    },
    methods: {
        //搜索
        search(type = 1) {
            this.$refs.table.search(type);
        },
        beforeQuery() {
            return this.searchOptions;
        },
        handleCancle() {
            this.isDialogVisible = false;
        },
        //添加账号组
        async handleAddGroup(data) {
            if (!data.userNum || data.userNum <= 0) {
                this.$message.warning('当前账号组没有成员，请重新选择');
                return;
            }
            this.isDialogVisible = false;
            let personList = await this.getPersonByGroup(data);
            this.$emit('selectGroup', { groupData: data, personList: personList });
        },
        //获取账号组人员
        getPersonByGroup(data) {
            return new Promise(resolve => {
                this.$axios('/authority/group/select', {
                    op: 'selectUserListAll',
                    data: { body: { id: data.id, name: null, phone: null } }
                }).then(res => {
                    if (res.code == 1) {
                        resolve(res.data ? JSON.parse(res.data) : []);
                    } else resolve([]);
                });
            });
        }
    },
    watch: {
        dialogVisible(val) {
            this.isDialogVisible = val;
            if (val) {
                /* if(this.$refs.table){
                this.search()
                }*/
            } else {
            }
        },
        isDialogVisible(val) {
            this.$emit('visibleChanged', val);
        }
    },
    created() {}
};
</script>

<style scoped lang="scss">
.mechanism {
    width: 100%;
    // height: 600px;
    // padding: 16px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    //  margin-bottom: 28px;
    form {
        padding-top: 0px !important;
    }
    /* table,
    tr,
    td {
        height: 40px !important;
    }
    .el-table {
        //  height: calc(100% - 150px);
        // overflow: auto;
    }
    .el-pagination {
        align-self: flex-end;
    }*/
    .ws-table-warp {
        padding: 0 !important;
        min-height: 45vh !important;
        ::v-deep .option-box {
            margin-bottom: 0px !important;
        }
         ::v-deep .empty-table{
            height:400px!important;
        }
        .c0088ff {
            color: #0088ff;
        }
    }
    .btnDiv {
        margin-top:30px;
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: center;
        // margin-top: 45px;
        .el-button {
            width: 100px;
            height: 40px;
        }
    }
}
</style>
