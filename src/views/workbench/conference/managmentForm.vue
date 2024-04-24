<template>
    <div class="container">
        <div v-if="visbile === 0" class="form-content-wrap">
            <div class="managmentForm">
                <div class="panel">
                    <div class="title">基础信息</div>
                    <el-form ref="form" :model="form" :rules="rules" label-width="120px" :hide-required-asterisk="routeData.type === 'detail'">
                        <el-row>
                            <el-col>
                                <el-form-item label="会议主题:" prop="name">
                                    <el-input :maxlength="30" v-model.trim="form.name" :disabled="routeData.type === 'detail'"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row style="display:flex;">
                            <el-col :span="10">
                                <el-form-item label="会议地点:" prop="address">
                                    <el-input v-model.trim="form.address" maxlength="300" :disabled="routeData.type === 'detail'"></el-input>
                                </el-form-item>
                            </el-col>
                            <div style="width:63px;height:10px"></div>
                            <el-col :span="12">
                                <el-form-item label="会议时间:" prop="signTime">
                                    <ws-date-range :startTime.sync="form.signTime" :endTime.sync="form.returnTime" :pickerOptions='pickerOptions' :disabled="routeData.type === 'detail'"></ws-date-range>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <el-form-item label="参会描述:" prop="description">
                                    <el-input type="textarea" :rows="5" v-model="form.description" :disabled="routeData.type === 'detail'" maxlength="1000" show-word-limit></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <el-form-item label="参会要求:" prop="requirement">
                                    <el-input type="textarea" :rows="5" v-model="form.requirement" :disabled="routeData.type === 'detail'" maxlength="1000" show-word-limit></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div class="panel">
                    <div class="title">会议管理配置</div>
                    <el-form label-width="120px">
                        <el-row>
                            <el-col>
                                <el-form-item label="会务组人员:" prop="deeplinkPath">
                                    <el-button class="m8" v-if="routeData.type != 'detail'" icon="el-icon-circle-plus" plain @click="visbile = 1">添加人员</el-button>
                                    <div>
                                        <el-tag
                                            v-for="tag in form.organizerIds"
                                            :key="tag.userId"
                                            type="info"
                                            @close="handleClose(tag, 1)"
                                            :closable="routeData.type != 'detail'">
                                            {{tag.name}}
                                        </el-tag>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="routeData.type != 'detail'">
                            <el-col>
                                <el-form-item label="参会人员设置：" prop="deeplinkPath">
                                    <el-checkbox-group disabled v-model="checkboxType">
                                        <!-- <el-checkbox :label="1">指定人员参与</el-checkbox> -->
                                        <el-checkbox :label="2">指定机构推荐</el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <!-- <el-row v-if="checkboxType.includes(1)">
                            <el-col>
                                <el-form-item label="指定参会人员:" prop="conferenceUsers">
                                    <el-button v-if="routeData.type != 'detail'" icon="el-icon-circle-plus" plain @click="visbile = 2">添加人员</el-button>
                                    <div>
                                        <el-tag
                                            v-for="tag in form.conferenceUsers"
                                            :key="tag.userId"
                                                type="info"
                                            @close="handleClose(tag, 2)"
                                            :closable="routeData.type != 'detail'">
                                            {{tag.name}}
                                        </el-tag>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row> -->
                        <el-row v-if="checkboxType.includes(2)">
                            <el-col>
                                <el-form-item label="指定推荐机构:" prop="deptIds">
                                    <el-button class="m8" v-if="routeData.type != 'detail'" icon="el-icon-circle-plus" plain @click="visbile = 3">选择机构</el-button>
                                    <div>
                                        <el-tag
                                            v-for="tag in form.deptIds"
                                            :key="tag.id"
                                            type="info"
                                            @close="handleClose(tag, 3)"
                                            :closable="routeData.type != 'detail'">
                                            {{tag.name}}
                                        </el-tag>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
        </div>
        <staff
            v-else-if="visbile === 1 || visbile === 2"
            :visbile.sync="visbile"
            @getDialogData="getDialogData"
        />
        <org
            v-else-if="visbile === 3"
            :visbile.sync="visbile"
            @getDialogData="getDialogData"
        />
        <ws-footer v-if="visbile === 0">
            <el-button  @click="goBack">{{ routeData.type === 'detail' ? '返回' : '取消' }}</el-button>
            <el-button v-if="routeData.type != 'detail'" type="primary" @click="onSubmit">保存</el-button>
        </ws-footer>
    </div>
</template>
<script>
import {cloneDeep} from 'lodash-es'
import staff from './components/staff.vue'
import org from './components/organization.vue'
import dayjs from 'dayjs'

export default {
    name: 'conferenceManagementForm',
    components:{
        staff,
        org
    },
    data() {
        return {
            form: {
                name:'',
                address:'',
                signTime:'',
                returnTime:'',
                description:'',
                requirement:'',
                organizerIds:[],
                conferenceUsers:[],
                deptIds:[],
                notify:false
            },
            checkboxType:[2],
            rules:{
                name: [
                    {
                        required: true,
                        message: '请填写会议主题',
                        trigger: 'change',
                    },
                ],
                address: [
                    {
                        required: true,
                        message: '请填写会议地点',
                        trigger: 'change',
                    },
                ],
                signTime: [
                    {
                        required: true,
                        message: '请填写会议时间',
                        trigger: 'change',
                    },
                ],
                description: [
                    {
                        required: true,
                        message: '请填写参会描述',
                        trigger: 'change',
                    },
                ],
                requirement: [
                    {
                        required: true,
                        message: '请填写参会要求',
                        trigger: 'change',
                    },
                ],
            },
            visbile:0,
            moduleName:'/workbench/conference/management',
            routeData:this.$route.query,

            pickerOptions: {
              disabledDate(time) {
                // 昨天的23:59:59
                let preveTime = dayjs().hour(0).minute(0).second(0).subtract(1,'second').valueOf()
                // time.getTime() 拿到的是今天的 00:00:00
                return time.getTime() <= preveTime
              }
            }
        }
    },
    methods: {
        async getDetail() {
            try {
                let data = {
                    data:JSON.stringify({
                        id : this.routeData.id
                    }),
                    op: 'detail'
                }
                let res = await this.$axios(this.getModuleUrl(data.op),data)
                let resData = JSON.parse(res.data)

                let organizerList = []
                let conferenceUserList = []

                resData.organizerList = resData.organizerList || []
                resData.conferenceUserList = resData.conferenceUserList || []
                resData.orgList = resData.orgList || []
                //转id为userId
                resData.organizerList.forEach(item => {
                    organizerList.push({
                        userId: item.id,
                        name: item.name
                    })
                })
                resData.conferenceUserList.forEach(item => {
                    conferenceUserList.push({
                        userId: item.id,
                        name: item.name,
                        orgType: item.orgType,
                        deptId: item.deptId
                    })
                })

                if(resData.conferenceUserList.length > 0 && resData.orgList.length > 0) {
                    this.checkboxType = [1,2]
                } else {
                    if(resData.conferenceUserList.length > 0) this.checkboxType = [1]
                    if(resData.orgList.length > 0) this.checkboxType = [2]
                }

                this.form = {
                    name: resData.name,
                    address: resData.address,
                    signTime: resData.signTime,
                    returnTime: resData.returnTime,
                    description: resData.description,
                    requirement: resData.requirement,
                    organizerIds: organizerList,
                    conferenceUsers: conferenceUserList,
                    deptIds:resData.orgList,
                    notify:false
                }
            } catch (error) {

            }
        },
        checkForm() {
            let flag = true;
            this.$refs['form'].validate(valid => {
                flag = valid;
            });
            return flag;
        },
        async onSubmit() {
            if(!this.checkForm()) return
            if(this.form.organizerIds.length === 0) {
                this.$message.error('请添加会务组人员！')
                return
            }

            if (this.form.deptIds.length === 0) {
              this.$message.error('请添加指定推荐机构！')
              return
            }

            let form = cloneDeep(this.form)
            let organizerIds = []
            let conferenceUsers = []
            let deptIds = []

            this.form.organizerIds.forEach(item => organizerIds.push(item.userId) )
            this.form.conferenceUsers.forEach(item => conferenceUsers.push({userId:item.userId,deptId:item.deptId,orgType:item.orgType}) )
            this.form.deptIds.forEach(item => deptIds.push(item.id))

            form.organizerIds = organizerIds
            form.conferenceUsers = conferenceUsers
            form.deptIds = deptIds

            if(this.routeData.type === 'update') form.id = this.routeData.id
            try {
                let data = {
                    data: JSON.stringify(form),
                    op: this.routeData.type
                }
                const res = await this.$axios(this.getModuleUrl(data.op),data)

                if(res.code === 1) {
                    let status = {
                        create:'新增会议成功！',
                        update:'修改会议成功！'
                    }
                    this.$message.success(status[this.routeData.type])
                    this.goBack()
                }
            } catch (error) {}
        },
        getDialogData(list,val) {
            console.log(list,val,'lplp');
            if (val === 1) {
                for (let i = 0; i < list.length; i++) {
                    if (!this.form.organizerIds.some(e => e.userId == list[i].userId)) this.form.organizerIds.push(list[i]);
                }
            } else if (val === 2) {
                for (let i = 0; i < list.length; i++) {
                    if (!this.form.conferenceUsers.some(e => e.userId == list[i].userId)) this.form.conferenceUsers.push(list[i]);
                }
            } else {
                for (let i = 0; i < list.length; i++) {
                    if (!this.form.deptIds.some(e => e.id == list[i].id)) this.form.deptIds.push(list[i]);
                }
            }
        },
        handleClose(tag, type) {
            if (type === 1) {
                this.form.organizerIds = this.form.organizerIds.filter(item => {
                    return item.userId != tag.userId
                })
            } else if (type === 2) {
                this.form.conferenceUsers = this.form.conferenceUsers.filter(item => {
                    return item.userId != tag.userId
                })
            } else if (type === 3) {
                this.form.deptIds = this.form.deptIds.filter(item => {
                    return item.id != tag.id
                })
            }
        },
        goBack() {
            this.$router.push({ name: 'conferenceManagement'})
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
    created() {},
    mounted() {
        if(this.routeData.type != 'create') this.getDetail()
    },
}
</script>
<style lang="scss" scoped>
.m8{
    margin-bottom: 8px;
}
.container {
    height: 100%;
    width: 100%;
    .form-content-wrap {
        width: 100%;
        min-height: 100%;
        background: #ffffff;
        padding: 32px 0px;
        border-radius: 8px;
        margin-bottom: 64px;
        .managmentForm {
            width: 1000px;
            margin: 0 auto;
            .panel {
                margin-bottom: 32px;
                .title {
                    font-size: 16px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #303133;
                    margin-bottom: 16px;
                }
            }
        }
    }
}
.el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
}
</style>
