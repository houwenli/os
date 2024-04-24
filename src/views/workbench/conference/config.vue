<template>
    <div class="container">
        <div class="form-content-wrap">
            <div class="configContent">
                <div class="panel">
                    <div class="title m10 ">
                        <div>评价标签配置</div>
                        <el-button class="addBtn" icon="el-icon-circle-plus" plain @click="add">添加配置</el-button>
                    </div>
                    
                    <el-table class="rd8" :data="tableData" :border="true" :header-cell-style="{
                            background: '#F5F7FA',
                            'font-family': 'PingFangSC-Medium, PingFang SC',
                            'font-weight': '600',
                            color: '#606266'
                        }">
                        <el-table-column prop="reason" label="原因文案">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.templateContent" type="text" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="driverStatus" label="操作" width="200px">
                            <template slot-scope="scope">
                                <el-button type="text" @click="delRow(scope.row.templateId)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="panel">
                    <div class="title m16">固定文案配置</div>
                    <el-form ref="form" :model="form" :rules="rules" label-width="126px" :hide-required-asterisk="type === 'detail'">
                        <el-form-item label="推荐信固定文案:" prop="recommend">
                            <el-input type="textarea" :rows="5" v-model="form.recommend"></el-input>
                        </el-form-item>
                        <el-form-item label="结业信固定文案:" prop="finish">
                            <el-input type="textarea" :rows="5" v-model="form.finish"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <ws-footer>
            <el-button  @click="goBack">{{ type === 'detail' ? '返回' : '取消' }}</el-button>
            <el-button v-if="type !== 'detail'" type="primary" @click="onSubmit">确定</el-button>
        </ws-footer>    
    </div>
</template>
<script>
export default {
    name: 'conferenceManagementForm',
    data() {
        return {
            form:{
                recommend:'',
                finish:''
            },
            rules:{
                recommend: [
                    {
                        required: true,
                        message: '请填写推荐信文案',
                        trigger: 'change',
                    },
                ],
                finish: [
                    {
                        required: true,
                        message: '请填写结业信文案',
                        trigger: 'change',
                    },
                ],
            },
            tableData:[],
            type:'',
            rowNumber:1,
            moduleName:'/workbench/conference/management',
        }
    },
    methods: {
        add() {
            this.tableData.push({
                templateContent:"",
                templateId:new Date().getTime()
            })
        },
        delRow(val) {
            this.tableData = this.tableData.filter(item => {
                return item.templateId != val
            })
        },
        getTemplate() {
            let arr = [1,2,3]
            arr.forEach(item => {
                let data = {
                    data:JSON.stringify({type: item}),
                    op:'selectTemplate'
                }
                this.$axios(this.getModuleUrl(data.op),data).then(res => {
                    const resData = JSON.parse(res.data)
                    if (item === 1) {
                        this.tableData = resData
                    } else if (item === 2) {
                        this.form.recommend = resData[resData.length -1].templateContent
                    } else if (item === 3) {
                        this.form.finish = resData[resData.length -1].templateContent
                    }
                }).catch(err => {})
            })
        },
        checkForm() {
            let flag = true;

            if(this.tableData.length) {
                this.tableData.forEach(item => {
                    if (!item.templateContent) flag = false
                });
            } else {
                flag = false
            }
            
            if (!flag) {
                this.$message.error('请填写完整的评价标签！')
                return 
            }
            this.$refs['form'].validate(valid => {
                flag = valid;
            });
            return flag;
        },
        onSubmit() {
            if(!this.checkForm()) return
            let arr = []
            this.tableData.forEach(item => {
                arr.push({content: item.templateContent,type:1,editStatus:1})
            })
            let params = arr.concat([{content: this.form.recommend ,type:2,editStatus:1},{content: this.form.finish,type:3,editStatus:1}])
            console.log(params, 'ioio');
            let data = {
                data:JSON.stringify({tagEditAos: params}),
                op:'tagConfigure'
            }
            this.$axios(this.getModuleUrl(data.op),data).then(res => {
                if(res.code === 1) {
                    this.$message.success('添加配置成功！')
                    this.goBack()
                }
            }).catch(err => {})
        },
        goBack() {
            this.$router.push({name : 'conferenceManagement'})
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
    created() {},
    mounted() {
        this.getTemplate()
    }
}
</script>
<style lang="scss" scoped>
.rd8 {
    border-radius: 8px;
}
.m10 {
    margin-bottom: 10px;
}
.m16 {
    margin-bottom: 10px;
}
.container {
    height: 100%;
    width: 100%;
    .form-content-wrap {
        width: 100%;
        min-height: 100%;
        background: #ffffff;
        padding: 32px 0;
        border-radius: 8px;
        margin-bottom: 64px;
        .configContent {
            width: 1000px;
            margin: 0 auto;
            .recommendTitle {
                text-align: center;
                font-size: 20px;
            }
            .panel {
                margin-bottom: 32px;
                .title {
                    font-size: 16px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #303133;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
            }
        }
        
    }
}
</style>
