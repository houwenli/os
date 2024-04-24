<template>
    <div class="form-content-wrap">
        <ws-table-el :col="8" ref="table" v-bind="tableConfig" :header-cell-style="{ background: '#F5F7FA' }">
            <template #search>
                <search-group style="marginright: 154px">
                    <label for>人员姓名：</label>
                    <el-input v-model.trim="searchOptions.name" :maxlength="30" placeholder="请输入员工姓名" clearable>
                    </el-input>
                </search-group>
                <search-group>
                    <label for>人员手机号：</label>
                    <el-input v-model.trim="searchOptions.mobile" :maxlength="11" placeholder="请输入员工手机号" clearable>
                    </el-input>
                </search-group>
            </template>
            <template #options>
                <el-button-group class="fr">
                    <el-button type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
                    <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
                </el-button-group>
            </template>

            <template>
                <ws-table-column-el prop="name" label="人员姓名"></ws-table-column-el>
                <ws-table-column-el prop="code" label="工号"></ws-table-column-el>
                <ws-table-column-el prop="phone" label="手机号"></ws-table-column-el>
                <ws-table-column-el prop="depart" label="部门">
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.depart" :key="index">
                            {{ item }}
                            <br />
                        </span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="createTime" label="关联时间"></ws-table-column-el>
                <ws-table-column-el label="操作" width="150px" fixed="right">
                    <template slot-scope="scope">
                        <!--- 首页总部权限申请的职务权限，不能移除职务下的人员 --->
                        <el-button v-if="$route.query.roleClassify == 1" type="text"
                            @click="deleteHandler(scope.row.id)">移除</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
        <div class="saveButon">
            <el-button class="buttons" @click="goBack">返回</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'roleDetails',
    data() {
        return {
            searchOptions: {
                name: '', // 员工姓名
                mobile: '', // 手机号
                roleId: this.$route.query.id,
                positionId: this.$route.query.positionId,
                deptType: this.$route.query.deptType,
            },
            tableConfig: {
                filterColumns: false,
                labelWidth: '84px',
                lazyQuery: {
                    url: '/authority/role/select', // 功能角色关联账号 调用的是账号管理的接口
                    op: {
                        selectList: 'selectPositionList',
                        selectCount: 'selectPositionCount',
                    },
                },
            },
        };
    },
    computed: {},
    watch: {},
    created() { },
    methods: {
        search(type = 1) {
            this.$refs.table.search(type);
        },
        reset() {
            this.searchOptions = {
                name: '', // 员工姓名
                mobile: '', // 手机号
                roleId: this.$route.query.id,
                positionId: this.$route.query.positionId,
                deptType: this.$route.query.deptType,
            };
            this.search();
        },
        goBack() {
            this.$router.push({ name: 'authorization' });
        },
        // 删除角色
        async deleteHandler(id) {
            try {
                await this.$confirm('是否移除该关联的角色？', '移除角色', {
                    confirmButtonText: '确定',
                    center: true,
                });
                const res = await this.$axios('/authority/role/delete', {
                    op: 'deleteUserRole',
                    data: {
                        roleId: this.$route.query.id,
                        userId: id,
                    },
                });
                if (res.code != 1) {
                    this.$message.error(res.msg);
                } else {
                    this.$message.success('移除成功');
                }
                this.search();
            } catch (err) { }
        },
    },
};
</script>
<style lang="scss" scoped>
.ws-table-warp {
    padding: 24px 24px 16px 24px !important;
    margin-bottom: 59px !important;
}

/deep/.pagination-warp {
    height: 30px;
    padding-bottom: 0px !important;
    padding-top: 16px;
    box-sizing: content-box;
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

.buttons {
    width: 160px;
    height: 36px;
}

.right {
    width: 100%;
    display: flex;
    justify-content: flex-end;
}
</style>
