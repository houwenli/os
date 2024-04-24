<template>
    <div>
        <ws-table-el ref="table" v-bind="tableConfig" :header-cell-style="{ background: '#F5F7FA' }">
            <template #search>
                <search-group>
                    <label for>会议主题：</label>
                    <el-input placeholder="请输入会议主题" v-model="searchOptions.name" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>状态：</label>
                    <el-select v-model="searchOptions.status" placeholder="--请选择--" clearable>
                        <el-option v-for="item in status" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
            </template>
            <template #searchBtns>
                <el-button-group>
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="table-column-header-button" @click="reset" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
                <el-button v-if="powerList.create" style="margin-left: 20px" icon="el-icon-circle-plus" plain @click="enterForm({ type: 'create' })">新增</el-button>
                <el-button v-if="powerList.tagConfigure" style="margin-left: 20px" icon="el-icon-circle-plus" plain @click="toConfig">标签配置</el-button>
            </template>
            <template>
                <ws-table-column-el prop="name" label="会议主题"></ws-table-column-el>
                <ws-table-column-el prop="signTime" label="会议时间">
                    <template slot-scope="scope">
                        <div v-if="scope.row.signTime">{{scope.row.signTime + ' - ' + scope.row.returnTime}}</div>
                        <div v-else>-</div>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="publishUserName" label="发布人员"></ws-table-column-el>
                <ws-table-column-el prop="statusName" label="状态"></ws-table-column-el>
                <ws-table-column-el prop="updateTime" label="最后修改时间"></ws-table-column-el>
                <ws-table-column-el label="操作" align="center" width="340px" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="c0088ff" type="text" @click="enterForm({type: 'detail', id: scope.row.id})">详情</el-button>
                        <el-button class="c0088ff" v-if="powerList.update && [0,1].includes(scope.row.status)" type="text" @click="enterForm({type: 'update', id: scope.row.id})">修改</el-button>
                        <el-button class="c0088ff" v-if="powerList.update && [1,2,3].includes(scope.row.status)" type="text" @click="toConferee(scope.row.id)">参会人员</el-button>
                        <el-button class="c0088ff" v-if="powerList.updateStatus && scope.row.status === 0" type="text" @click="updateStatus({id:scope.row.id,status:1})">发布</el-button>
                        <el-button class="c0088ff" v-if="powerList.updateStatus && scope.row.status === 1" type="text" @click="updateStatus({id:scope.row.id,status:2})">开始会议</el-button>
                        <el-button class="c0088ff" v-if="powerList.updateStatus && scope.row.status ===2" type="text" @click="updateStatus({id:scope.row.id,status:3})">结束会议</el-button>
                        <el-button v-if="powerList.updateStatus && [0,1].includes(scope.row.status)" type="text" @click="updateStatus({id:scope.row.id,status:4})">取消会议</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>
<script>
export default {
    name: 'conferenceManagement',
    data() {
        return {
            searchOptions: {
                name: '',
                status: ''
            },
            status: [
                { id: 0, value: '待发布' },
                { id: 1, value: '待开始' }, 
                { id: 2, value: '已开始' },
                { id: 3, value: '已完成' },  
                { id: 4, value: '已取消' }  
            ],
            
            
            tableConfig: {
                filterColumns: false,
                lazyQuery: {
                    moduleName: '/workbench/conference/management',
                    op: {
                        selectList: 'pageList',
                        selectCount: 'pageCount',
                    },
                },
            },
            moduleName:'/workbench/conference/management',
        }
    },
    methods: {
        search() {
            this.$refs.table.search()
        },
        reset(){
            this.searchOptions = {
                name: '',
                status: ''
            }
            this.search()
        },
        enterForm(query) {
            this.$router.push({
                name: 'conferenceManagementForm',
                query
            })
        },
        toConferee(id) {
            this.$router.push({ 
                name: 'conferenceConferee',
                query: {
                    confId: id
                }
            })
        },
        updateStatus(val) {
            let _val = val
            if(val.status === 4 || val.status === 3) {
                let data = {
                    4: '确定取消该会议？',
                    3: '确定结束该会议？'
                }
                this.$confirm(data[val.status], {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true,
                }).then(() => {
                    this.changeStatus(_val)
                }).catch(()=> {})
            } else {
                this.changeStatus(_val)
            }
        },
        changeStatus(val) {
            let data = {
                data : JSON.stringify(val),
                op: 'updateStatus'
            }
            let msglist = ['','发布会议成功！','已开始会议！','已结束会议！','已取消会议！']
            this.$axios(this.getModuleUrl(data.op),data).then(res => {
                if(res.code === 1) {
                    this.$message.success(msglist[val.status])
                    this.search()
                }
            }).catch(err =>{})
        },
        toConfig() {
            this.$router.push({name: 'conferenceConfig'})
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },  
    created() {},
    mounted() {}
}
</script>
<style lang="scss" scoped>
.c0088ff {
    color: #0088ff;
}
</style>
