<template>
  <div>
    <ws-table-el ref="table" v-bind="tableConfig">
        <template #search>
            <search-group>
                <label>姓名：</label>
                <el-input v-model.trim="searchOptions.name" placeholder="请输入人员姓名" :maxlength="20" clearable></el-input>
            </search-group>
            <search-group>
                <label>手机号：</label>
                <el-input v-model.trim="searchOptions.phone" placeholder="请输入人员手机号" :maxlength="20" clearable></el-input>
            </search-group>
        </template>
        <template #options>
            <el-button-group style="float:right">
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                <ws-throttle>
                    <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
                </ws-throttle>
            </el-button-group>
        </template>
        <template>
            <ws-table-column-el width="140" prop="name" label="姓名"/>
            <ws-table-column-el width="140"prop="phone" label="手机号"/>
            <ws-table-column-el prop="departmentName" label="任职部门"/>
            <ws-table-column-el prop="positionName" label="职务"/>
            <ws-table-column-el width="100" prop="friendCount" label="好友数"/>
            <ws-table-column-el label="操作">
                <template slot-scope="scope">
                    <el-button @click="toList(scope.row.userId)" type="text" style="color: #0088ff">
                        好友列表
                    </el-button>
                    <el-button @click="toRecord(scope.row.userId)" type="text" style="color: #0088ff">
                        申请记录
                    </el-button>
                </template>
            </ws-table-column-el>
        </template>
    </ws-table-el>
  </div>
</template>
<script>
export default {
  name: 'friend',
  data () {
    return {
        searchOptions:{
            name:'',
            phone:''
        },
        tableConfig: {
            pageSizeList: [20, 50, 100],
            filterColumns: false,
            lazyQuery: {
                moduleName: "/friendManage",
                op: {
                    selectList: "selectPage",
                    selectCount: "selectCount",
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
    toList(userId) {
        this.$router.push({
            path:"telephoneManage/friendManage",
            query:{
                userId
            }
        })
    },
    toRecord(userId) {
        this.$router.push({
            path:"telephoneManage/applicationRecord",
            query:{
                userId
            }
        })
    }
  },
  created () {
  },
  mounted () {
  },
}
</script>
<style lang="scss" scoped>

</style>
