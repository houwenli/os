<template>
    <div>
        <el-card class="cardBox">
            <el-row>
                <h3 class="detailsFunHeader">基础信息</h3>
                <el-form label-width="96px">
                    <el-row type="flex">
                        <el-col :span="8">
                            <el-form-item label="账号组名称：">
                                <el-input v-model.trim="details.name" :disabled="true" :maxlength="10"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :offset="1" :span="8">
                            <el-form-item label="账号组状态：">
                                <el-input :value="details.status == '1' ? '启用' : '停用'" :disabled="true" :maxlength="10"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="17">
                            <el-form-item label="描述：">
                                <el-input v-model.trim="details.groupDesc" :disabled="true" :maxlength="10"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
            <el-row>
                <h3 class="detailsFunHeader">组员详情</h3>
                <ws-table-el ref="table" v-bind="tableConfig">
                    <template>
                        <ws-table-column-el prop="name" label="组员姓名"></ws-table-column-el>
                        <ws-table-column-el prop="phone" label="组员手机号"></ws-table-column-el>
                        <ws-table-column-el prop="deptName" label="所属部门" min-width="200">
                            <template slot-scope="scope">
                        <el-popover v-for='(item,index) in scope.row.departPosition' :key='index' trigger="click" :content='item.departNameTree' placement="top" width="240">
                            <div class='completeDuty' slot="reference">{{item.departName}}</div>
                        </el-popover>
                    </template>
                        </ws-table-column-el>
                        <ws-table-column-el prop="positionName" label="职务" min-width="200">
                            <template slot-scope="scope">
                                <div class="positionBox" v-for="(item, index) in scope.row.departPosition" :key="index">{{ item.positionName }}{{ item.isMainPos == 0 ? '(主职)' : '' }}</div>
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el prop="accountStatusName" label="账号状态">
                            <template slot-scope="scope">
                        <div v-if="scope.row.accountStatus == 1" class="start">启用</div>
                        <div v-if="scope.row.accountStatus == 2" class="stop">停用</div>
                    </template>
                        </ws-table-column-el>
                    </template>
                </ws-table-el>
            </el-row>
            <el-row>
                <h3 class="detailsFunHeader">关联工作流</h3>
                <ws-table-el ref="table" v-bind="tableValue">
                    <template>
                        <ws-table-column-el prop="name" label="工作流名称"></ws-table-column-el>
                        <ws-table-column-el prop="categoryName" label="业务类型"></ws-table-column-el>
                        <ws-table-column-el prop="nodeNum" label="节点数"></ws-table-column-el>
                    </template>
                </ws-table-el>
            </el-row>
            <el-row>
                <h3 class="detailsFunHeader">操作信息</h3>
                <ws-table-el ref="table" v-bind="tableData">
                    <template>
                        <ws-table-column-el prop="createUser" label="操作人"></ws-table-column-el>
                        <ws-table-column-el prop="operationType" label="操作类型"></ws-table-column-el>
                        <ws-table-column-el prop="operationTime" label="操作时间"></ws-table-column-el>
                    </template>
                </ws-table-el>
            </el-row>
            <div class="goBackStyle">
                <el-button class="buttons" @click="goBack">返回</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            moduleName: '/systemManage/accountGroup',
            details: {
                name: '',
                status: '',
                groupDesc: '',
            },
            tableData: {
                filterColumns: false,
                autoHeight: false,
                pageSizeList: [10, 20, 50, 100],
                lazyQuery: {
                    moduleName: '/systemManage/accountGroup',
                    op: {
                        selectList: 'groupDetail',
                        selectCount: 'groupDetailCount',
                    },
                    beforeQuery: this.beforeQuery,
                },
            },
            tableConfig: {
                filterColumns: false,
                autoHeight: false,
                // labelWidth: '80px',
                pageSizeList: [10, 20, 50, 100],
                lazyQuery: {
                    url: '/authority/group/select',
                    op: {
                        selectList: 'selectUserSortList',
                        selectCount: 'selectUserSortCount'
                    },
                    beforeQuery: this.beforeQuery,
                },
            },
            tableValue:  {
                filterColumns: false,
                autoHeight: false,
                pageSizeList: [10, 20, 50, 100],
                lazyQuery: {
                    moduleName: '/systemManage/accountGroup',
                    op: {
                        selectList: 'selectGroupWorkFlowList',
                        selectCount: 'selectGroupWorkFlowCount',
                    },
                    beforeQuery: this.beforeQuery,
                },
            },
        };
    },
    methods: {
        // 返回
        goBack() {
            this.$router.push({ name: 'accountGroup' });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        beforeQuery() {
            return {
                userGroupId: this.details.id,
                id: this.$route.query.id,
            };
        },
    },
    created() {
        this.details = this.$route.query;
    },
};
</script>

<style lang="scss" scoped>
.cardBox {
    padding: 20px;
    margin: 0;
    .detailsFunHeader {
        width: 100px;
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        margin-top: 16px;
        margin-bottom: 16px;
    }
    ::v-deep.el-form-item__label {
        font-weight: 400;
    }
    margin-bottom: 56px;
}
::v-deep.ws-table-warp {
    padding: 0 !important;
    .option-box {
        margin-bottom: 0 !important;
    }
}
.goBackStyle {
    z-index: 999;
    position: fixed;
    bottom: 0;
    left: 80px;
    width: 100%;
    height: 64px;
    background: #ffffff;
    box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.04);
    display: flex;
    justify-content: center;
    align-items: center;
}
.buttons {
    width: 160px;
    height: 36px;
}
</style>
