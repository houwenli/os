<template>
    <div class="conferee" >
        <ws-table-el v-if="visible === 1" ref="table" v-bind="tableConfig" :header-cell-style="{ background: '#F5F7FA' }">
            <template #search>
                <search-group>
                    <label for>机构类型：</label>
                    <el-select v-model="searchOptions.orgType" placeholder="--请选择--" clearable>
                        <el-option v-for="item in orgs" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
            </template>
            <template #searchBtns>
                <el-button-group>
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="table-column-header-button" @click="reset" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
                <ws-throttle><el-button v-if="powerList.confereeRemind" style="margin-left: 20px" plain  :disabled='disabled'
                    :class="disabled ?'disabled-btn': ''"  @click="onWarnAll">一键提醒</el-button></ws-throttle>
                <!-- <el-button style="margin-left: 20px" plain @click="allAudit">一键审核</el-button> -->
                <ws-throttle>
                  <el-button
                    v-if="powerList.confereeListFileExport"
                    style="margin-left: 20px"
                    plain
                    :disabled='disabled'
                    :class="disabled ?'disabled-btn': ''"
                    @click="exportFile">导出</el-button>
                </ws-throttle>
            </template>
            <template>
                <ws-table-column-el prop="userName" label="参会人姓名"></ws-table-column-el>
                <ws-table-column-el prop="orgName" label="机构名称"></ws-table-column-el>
                <ws-table-column-el prop="confirmTime" label="审核时间"></ws-table-column-el>
                <ws-table-column-el prop="travelTime" label="出发时间"></ws-table-column-el>
                <ws-table-column-el prop="attendTime" label="参会时间"></ws-table-column-el>
                <ws-table-column-el prop="statusName" label="状态"></ws-table-column-el>
                <ws-table-column-el prop="remark" label="备注"></ws-table-column-el>
                <ws-table-column-el label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" class="c0088ff" v-if="[0].includes(scope.row.status) && powerList.checkMeeting" @click="audit({confId:scope.row.confId,userId:scope.row.userId})">审核</el-button>
                        <el-button type="text" class="c0088ff" v-if="[1,2].includes(scope.row.status) && powerList.confereeRemind" @click="warn({conferenceStaffId: scope.row.id})">提醒</el-button>
                        <el-button type="text" class="c0088ff" v-if="[2].includes(scope.row.status) && powerList.confereeConfirm" @click="sure(scope.row.confId,scope.row.id)">参会确认</el-button>
                        <el-button type="text" class="c0088ff" v-if="[3].includes(scope.row.status) && powerList.confereeComment" @click="toevaluate({confId:scope.row.confId,userId:scope.row.userId})">评价</el-button>
                        <el-button type="text" class="c0088ff" v-if="[5,6].includes(scope.row.status) && powerList.confereeComment" @click="toevaluate({confId:scope.row.confId,userId:scope.row.userId,type:'detail'})">查看评价</el-button>
                        <el-button type="text" v-if="[0,1,2].includes(scope.row.status) && powerList.confereeDel" @click="remove(scope.row.id)">移除</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
        <ws-footer v-if="visible === 1">
            <el-button  @click="goBack">返回</el-button>
        </ws-footer>
        <letter v-else :visible.sync="visible" :dialogData="dialogData"/>
    </div>
</template>
<script>
import letter from './components/letter.vue'
export default {
    name: 'APP',
    components:{
        letter
    },
    data() {
        return {
            searchOptions: {
                orgType:'',
                confId:this.$route.query.confId
            },
            routeData: this.$route.query,
            orgs: [
                { id: 0, value: '总部' },
                { id: 20, value: '一级机构' },
                { id: 30, value: '二级机构' },
                { id: 40, value: '实体店' }
            ],
            tableConfig: {
                filterColumns: false,
                lazyQuery: {
                    moduleName: '/workbench/conference/management',
                    op: {
                        selectList: 'confereeList',
                        selectCount: 'confereeCount',
                    },

                    afterQuery: (list)=> {
                      this.disabled = list.length === 0

                      return list
                    }
                },
            },
            moduleName:'/workbench/conference/management',
            visible:1,
            dialogData:{
                confId: '',
                userId: ''
            },

            disabled: false
        }
    },
    methods: {
        onWarnAll() {
          this.warn({confId: this.$route.query.confId})
        },
        audit(val) {
            this.dialogData.confId = val.confId
            this.dialogData.userId = val.userId
            this.visible = 2
        },
        // allAudit() {
        //     let data = {
        //         data: JSON.stringify({
        //             confId: this.routeData.confId,
        //         }),
        //         op: 'checkAllMeeting'
        //     }
        //     this.$axios(this.getModuleUrl(data.op),data).then(res => {
        //         if(res.code === 1) {
        //             this.$message.success("审核成功！")
        //             this.search()
        //         }
        //     })
        // },
        search() {
            this.$refs.table.search()
        },
        reset(){
            this.searchOptions.orgType = ''
            this.search()
        },
        warn(val) {
            let data = {
                data : JSON.stringify(val),
                op: 'confereeRemind'
            }
            this.$axios(this.getModuleUrl(data.op),data).then(res => {
                if(res.code === 1) this.$message.success('已发出参会提醒！')
            }).catch(err =>{})
        },
        sure(confId,conferenceStaffId) {
            console.log(confId,conferenceStaffId,'pplll');
            let data = {
                data : JSON.stringify({
                    confId,
                    conferenceStaffId
                }),
                op: 'confereeConfirm'
            }
            this.$axios(this.getModuleUrl(data.op),data).then(res => {
                if(res.code === 1) {
                    this.$message.success('已确认该人员参会！')
                    this.search()
                }
            }).catch(err =>{})
        },
        remove(id) {
            this.$confirm('确定移除该人员？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true,
                callback: ()=> {
                    let data = {
                        data : JSON.stringify({
                            id: id
                        }),
                        op: 'confereeDel'
                    }
                    this.$axios(this.getModuleUrl(data.op),data).then(res => {
                        if(res.code == 1) {
                            this.$message.success('移除人员成功！')
                            this.search()
                        }
                    }).catch(err =>{})
                }
            })
        },
        toevaluate(query) {
            this.$router.push({
                name: 'conferenceEvaluate',
                query
            })
        },
        exportFile() {
            let data = {
                data : JSON.stringify({
                    confId: this.routeData.confId,
                    orgType: this.searchOptions.orgType
                }),
                op: 'confereeListFileExport'
            }
            this.$axios(this.getModuleUrl(data.op),data).then(res => {
                if(res.code === 1) this.$message.success('导出成功！')
            }).catch(err =>{})
        },
        goBack() {
            this.$router.push({ name: 'conferenceManagement'})
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    }
}
</script>
<style lang="scss" scoped>
.conferee {
    min-height: 100%;
    margin-bottom: 64px;
}
.c0088ff {
    color: #0088ff;
}

.disabled-btn {
  background: #F05259 !important;
  opacity: 0.4;
  color: #FFFFFF !important;
}
</style>
