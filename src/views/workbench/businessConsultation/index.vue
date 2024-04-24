<template>
    <div>
        <div>
            <ws-table-el ref="table" v-bind="tableConfig" :col="8">
                <template #search>
                    <search-group>
                        <label for>业务关键词：</label>
                        <el-input v-model.trim="searchOptions.keyWords" placeholder="请输入内容模糊查询" clearable></el-input>
                    </search-group>
                </template>
                <template #searchBtns>
                    <el-button-group>
                        <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                        <ws-throttle>
                            <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
                        </ws-throttle>
                    </el-button-group>
                    <ws-enter-event>
                        <el-button type="primary" @click="openDialog" v-if="oaPowerList.selectDictByCondition">注意事项</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button icon="el-icon-circle-plus" class="btn-right btnStyle" @click="goTo('add')" v-if="oaPowerList.addOne">新增</el-button>
                    </ws-throttle>
                </template>
                <template>
                    <ws-table-column-el prop="keyWords" label="业务关键词">
                        <template slot-scope="scope">
                            <p style="white-space: pre-line">{{ scope.row.keyWords }}</p>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="content" label="业务内容">
                        <template slot-scope="scope">
                            <p style="white-space: pre-line">{{ scope.row.content }}</p>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="department" label="业务部门"></ws-table-column-el>
                    <ws-table-column-el prop="contactUserName" label="联系人">
                        <template slot-scope="scope">
                            <span v-for="(item, index) in scope.row.businessContractList" :key="index">
                                <span v-if="index != 0">、</span>
                                {{ item.contactUserName }}
                            </span>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="businessPhone" label="业务电话">
                        <template slot-scope="scope">
                            <span v-for="(item, index) in scope.row.businessContractList" :key="index">
                                <span v-if="index != 0">、</span>
                                <span v-for="(phoneItem, phoneIndex) in item.businessPhoneList" :key="phoneIndex">
                                    <span v-if="phoneIndex != 0">/</span>
                                    {{ phoneItem.businessPhone }}
                                </span>
                            </span>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el label="操作" fixed="right" width="120px">
                        <template slot-scope="scope">
                            <el-button type="text" @click="goTo('update', scope.row.id)" v-if="oaPowerList.updateById">修改</el-button>
                            <el-button type="text" @click="openDelectdialog(scope.row.id)" v-if="oaPowerList.deleteById">删除</el-button>
                        </template>
                    </ws-table-column-el>
                </template>
            </ws-table-el>
        </div>

        <el-dialog title="注意事项" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :show-close="false">
            <el-input type="textarea" placeholder="删除后不可恢复，确认删除吗?" v-model="ditValue" maxlength="200" show-word-limit></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="update" v-if="oaPowerList.updateDictionaryById">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="删除" :visible.sync="dialogFormVisibleDelect" width="30%">
            <span>删除后不可恢复，确认删除吗?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDelect = false">取 消</el-button>
                <el-button type="primary" @click="delect()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'businessConsultationList',
    data() {
        return {
            tableDate: [],
            searchOptions: {
                keyWords: '', // 业务关键词
            },
            tableConfig: {
                emptyModel: true,
                filterColumns: false,
                loading: true,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/workbench/businessConsultation',
                    op: {
                        selectList: 'selectList',
                        selectCount: 'selectCount',
                    },
                    beforeQuery: this.beforeQuery,
                },
            },
            moduleName: '/workbench/businessConsultation',
            dialogFormVisible: false,
            dialogFormVisibleDelect: false,
            delectId: '',
            ditValue: '',
            oldDitValue: '',
            id: ''
        };
    },
    mounted() {
        this.getDitValue();
    },
    methods: {
        async getDitValue() {
            const param = {
                op: 'selectDictByCondition',
                data: {
                    category: 'businessconsulting',
                    ditkey: 'mattersattention',
                },
            };
            try {
              let res =  await this.$axios(this.getModuleUrl(param.op), param)
              let data = JSON.parse(res.data) || []
              this.ditValue = data[0].ditValue;
              this.id = data[0].id
            } catch (error) {
            }
        },
        openDelectdialog(id) {
            this.delectId = id;
            this.dialogFormVisibleDelect = true;
        },
        //删除列表
        delect() {
            const param = {
                op: 'deleteById',
                data: {
                    id: this.delectId,
                },
            };
            // this.$axios('/businessConsulting/update', param).then(res => {
            this.$axios(this.getModuleUrl(param.op), param).then(res => {
                if (res.code === 1) {
                    this.$message.success('删除成功');
                    (this.dialogFormVisibleDelect = false), this.$refs.table.search();
                }
            });
        },
        beforeQuery() {
            return this.searchOptions;
        },
        search() {
            this.$refs.table.search();
        },
        reset() {
            this.searchOptions = {
                keyWords: '', // 业务关键词
            };
            this.search();
        },
        // 跳转新增，编辑
        goTo(type, id = null) {
            let query = { type };
            type !== 'add' && (query.id = id);
            this.$router.push({
                name: 'businessConsultationEdit',
                query,
            });
        },
        openDialog() {
            this.oldDitValue = this.ditValue;
            this.dialogFormVisible = true;
        },
        //取消注意事项
        cancel() {
            this.ditValue = this.oldDitValue;
            this.dialogFormVisible = false;
        },
        //修改注意事项
        update() {
            const param = {
                op: 'updateDictionaryById',
                data: {
                    id: this.id,
                    category: 'businessconsulting',
                    ditkey: 'mattersattention',
                    ditValue: this.ditValue,
                    sort: '1',
                    ditDesc: '初始化',
                },
            };

            this.$axios(this.getModuleUrl(param.op), param).then(res => {
                if (res && res.code === 1) {
                    this.dialogFormVisible = false;
                    this.$message.success('注意事项修改成功');
                }
            });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
};
</script>

<style lang="scss" scoped>
.btnStyle {
    color: #f05259;
    border: 1px solid #f05259;
    width: 95px;
}

.el-button--text:first-child {
    color: rgb(0, 136, 255);
}

/deep/ .ws-table-warp {
    min-height: calc(100vh - 100px) !important;
    padding: 24px 24px 24px 24px !important;
    display: flex;
    flex-direction: column;
}
/deep/.pagination-warp {
    height: 30px;
    padding-bottom: 0px !important;
    padding-top: 16px;
    box-sizing: content-box;
}
/deep/ .searchBtns {
    margin: 0px;
    display: flex;
    justify-content: space-between;
}
/deep/ .el-textarea__inner {
    min-height: 130px !important;
}
/deep/ .el-button--medium {
    margin-left: 10px;
}
</style>
