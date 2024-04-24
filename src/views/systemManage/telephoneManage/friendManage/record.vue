<template>
    <div>
        <ws-table-el ref="table" v-bind="tableConfig">
            <template #search>
                <search-group>
                    <label>姓名：</label>
                    <el-input v-model.trim="searchOptions.name" placeholder="请输入人员姓名" :maxlength="20" clearable>
                    </el-input>
                </search-group>
                <search-group>
                    <label>手机号：</label>
                    <el-input v-model.trim="searchOptions.phone" placeholder="请输入人员手机号" :maxlength="20" clearable>
                    </el-input>
                </search-group>
            </template>
            <template #options>
                <el-button-group style="float:right">
                    <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                    <ws-throttle>
                        <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left">
                        </el-button>
                    </ws-throttle>
                </el-button-group>
            </template>
            <template>
                <ws-table-column-el prop="name" width="120" label="姓名" />
                <ws-table-column-el prop="phone" width="120" label="手机号" />
                <ws-table-column-el prop="departmentName" width="140" label="任职部门" />
                <ws-table-column-el prop="positionName" width="120" label="职务" />
                <ws-table-column-el prop="initiatorName" width="100" label="发起人" />
                <ws-table-column-el prop="applicationStatusStr" width="100" label="好友状态" />
                <ws-table-column-el prop="applicationTime" label="申请时间" />
                <ws-table-column-el prop="approvalDate" label="通过/拒绝时间" />
                <ws-table-column-el prop="refuseRemark" label="通过/拒绝原因" />
            </template>
        </ws-table-el>
        <ws-footer>
            <el-button class="buttons" @click="onBack">返回</el-button>
        </ws-footer>
    </div>
</template>
  <script>
export default {
    name: 'applicationRecordList',
    data() {
        return {
            searchOptions: {
                userId:this.$route.query.userId,
                name:'',
                phone:''
            },
            tableConfig: {
                pageSizeList: [20, 50, 100],
                filterColumns: false,
                lazyQuery: {
                moduleName: "/friendManage",
                    op: {
                        selectList: "selectFriendApplicationList",
                        selectCount: "selectFriendApplicationCount",
                    },
                },
            }
        }
    },
    methods: {
        search() {
            this.$nextTick(() => this.$refs.table.search());
        },
        reset() {       
            this.$refs.table.reset();
        },
        onBack() {
          this.$router.push({
            name: 'telephoneManage',
            params:{
                from:"friendManage"
            }
          })
        }
    },
    created() {
    },
    mounted() {
    },
}
</script>
<style lang="scss" scoped>
</style>