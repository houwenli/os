<template>
  <div>
    <ws-table-el ref="table" v-bind="tableConfig" :col="8" >
        <template #search>
            <search-group>
                <label for>登录账号：</label>
                <el-input v-model.trim="searchOptions.phone" placeholder="请输入登录账号" :maxlength="20" clearable></el-input>
            </search-group>
            <search-group>
                <label for>账号人员姓名：</label>
                <el-input v-model.trim="searchOptions.name" placeholder="请输入账号人员姓名" :maxlength="20" clearable></el-input>
            </search-group>
            <search-group>
                <label for>账号所属部门：</label>
                <el-cascader
                    :props="optionProps"
                    clearable
                    filterable
                    collapse-tags
                    @change="handleChange()"
                    v-model="searchOptions.deptId"
                    :options="departmentOption"
                    placeholder="请选择账号所属部门"
                    separator="-"
                ></el-cascader>
            </search-group>
            <search-group>
                <label for>部门类型：</label>
                <el-select v-model="searchOptions.depType" placeholder="请选择部门类型" min-width="353px" clearable filterable>
                    <el-option v-for="item in departmentType" :key="item.type" :label="item.label" :value="item.type"></el-option>
                </el-select>
            </search-group>
            <search-group>
                <label for>登录时间：</label>
                <dateRange :startTime.sync="searchOptions.startTime" :endTime.sync="searchOptions.endTime" value-format="yyyy-MM-dd HH:mm:ss"/>
                <!-- <ws-date-range :startTime.sync="searchOptions.startTime" :endTime.sync="searchOptions.endTime"></ws-date-range> -->
            </search-group>
        </template>

        <template #options>
            <div v-if="oaPowerList.selectList" style="float: right">
                <el-button-group v-if="oaPowerList.selectList">
                    <el-button type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
                    <ws-throttle>
                        <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
                <el-button style="margin-left: 16px" plain @click="exportExcel">导出</el-button>
            </div>
        </template>

        <template>  
            <ws-table-column-el prop="phone" width="180" label="登录账号"></ws-table-column-el>
            <ws-table-column-el prop="name" label="账号人员姓名" width="200"></ws-table-column-el>
            <ws-table-column-el prop="businessModule" width="200" label="所属部门及职务">
                <template slot-scope="scope">
                    <el-popover trigger="click" placement="top">
                        <p>{{ scope.row.deptName }}</p>
                        <div slot="reference" class="name-wrapper">
                            {{scope.row.deptPositionName}}
                        </div>
                    </el-popover>
                </template>
            </ws-table-column-el>
            <ws-table-column-el prop="depTypeName" label="部门类型"></ws-table-column-el>
            <ws-table-column-el prop="loginTime" width="250" label="登录时间"></ws-table-column-el>
            <ws-table-column-el prop="ip" width="250" label="登录ip"></ws-table-column-el>
            <ws-table-column-el prop="os" width="250" label="登录版本"></ws-table-column-el>
            <ws-table-column-el prop="softVersion" width="150" label="app版本号"></ws-table-column-el>
            <ws-table-column-el prop="city" label="登陆城市" fixed="right"></ws-table-column-el>
        </template>
    </ws-table-el>
  </div>
</template>
<script>
import dateRange from './dateRange.vue'
export default {
  name: 'appLogList',
  components:{
    dateRange
  },
  data () {
    return {
        searchOptions:{
            phone:'',
            name:'',
            deptId:'',
            depType:'',
            startTime:this.$baseMethod.getBeforeDay(-30, "yyyy-MM-dd hh:mm:ss"),
            endTime:this.$baseMethod.getBeforeDay(0, "yyyy-MM-dd 23:59:59")
        },
        departmentType:[
            {
                label:'总部',
                type:'1'
            },
            {
                label:'分支机构',
                type:'2'
            },
        ],
        tableConfig: {
            pageSizeList: [20, 50, 100],
            filterColumns: false,
            lazyQuery: {
                moduleName: "/systemManage/appLog",
                op: {
                    selectList: "selectList",
                    selectCount: "selectCount",
                },
            },
        },
        moduleName: "/systemManage/appLog",
        departmentOption:[],
        optionProps: {
            lazy: true,
            value: 'id',
            label: 'name',
            children: 'child',
            checkStrictly: true,
            lazyLoad: this.depLazy,
            leaf: 'isLeaf',
        },
    }
  },
  methods: {
        search(type = 1) {
            this.$nextTick(() => this.$refs.table.search());
        },
        reset() {
            this.$refs.table.reset();
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        async exportExcel () {
            try {
                const reqData = {
                    data: { ...this.searchOptions },
                    op: 'exportLog',
                };
                let res = await this.$axios(this.getModuleUrl('exportLog'), reqData)
                if(res.code == 1) this.$message.success('文件正在导出，请到文件下载界面进行下载')
            } catch (error) {
                
            }
        },
        async depLazy(node, resolve) {
            try {
                let data = {
                    op: 'getDeptChildList',
                    data: { id: node.level == 0 ? 0 : node.data.id },
                };
                let res = await this.$axios('authority/Organizational/select', data);
                resolve(JSON.parse(res.data));  
            } catch (error) {
                
            }
        },
        handleChange() {
            this.searchOptions.deptId = this.searchOptions.deptId[this.searchOptions.deptId .length - 1]
        }
  },
  created () {
  },
  mounted () {
  },
}
</script>
<style lang="scss" scoped>
.btn-right {
    float: right;
    margin-left: 16px;
}
.btnStyle {
    color: #f05259;
    border: 1px solid #f05259;
    width: 95px;
}
.name-wrapper {
    border-bottom: 1px solid #333;
    display: inline-block;
    cursor: pointer;
}
</style>
