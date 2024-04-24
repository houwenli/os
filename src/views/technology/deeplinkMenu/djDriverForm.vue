<template>
    <div class="container">
        <div class="form-content-wrap">
            <div class="panel">
                <div class="title">基础信息</div>
                <el-form ref="form" :model="form" :rules="rules" label-width="120px" :hide-required-asterisk="routeData.type === 'detail'">
                    <el-row>
                        <el-col>
                            <el-form-item label="Deeplink名称:" prop="deepLinkName">
                                <el-input :maxlength="30" v-model.trim="form.deepLinkName" :disabled="routeData.type === 'detail'" placeholder="请输入deeplink名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col>
                            <el-form-item label="Deeplink路径:" prop="deepLinkUrl">
                                <el-input v-model.trim="form.deepLinkUrl" maxlength="300" :disabled="routeData.type === 'detail'" placeholder="请输入deeplink路径"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="panel" style="margin-bottom: 0px" v-if="routeData.type === 'detail'">
                <div class="title">操作记录</div>
                <el-table :data="settleList" stripe border style="width: 100%;">
                    <el-table-column prop="operationUser" label="操作人"></el-table-column>
                    <el-table-column prop="operationTypeName" label="操作类型"></el-table-column>
                    <el-table-column prop="createTime" label="操作时间"></el-table-column>
                </el-table>
            </div>
        </div>
        <ws-footer>
            <el-button @click="goBack">{{ routeData.type === 'detail' ? '返回' : '取消' }}</el-button>
            <el-button v-if="routeData.type !== 'detail'" type="primary" @click="onSubmit">保存</el-button>
        </ws-footer>
    </div>
</template>
<script>
export default {
    name: 'APP',
    data() {
        return {
            routeData: null,
            form: {
                deepLinkName: '',
                deepLinkUrl: '',
            },
            rules: {
                deepLinkName: [
                    {
                        required: true,
                        message: '请填写Deeplink名称',
                        trigger: 'change'
                    }
                ],
                deepLinkUrl: [
                    {
                        required: true,
                        message: '请填写Deeplink路径',
                        trigger: 'blur'
                    }
                ]
            },
            settleList:[],
            detailLoading: false,
            moduleName: '/technology/deeplinkMenu/djDriver'
        }
    },
    methods: {
        async getDetail(id) {
            try {
                let params = {
                    data: JSON.stringify({
                        id
                    }),
                    op: 'detail'
                }
                let { data } = await this.$axios(this.getModuleUrl(params.op), params)
                const res = JSON.parse(data)
                console.log(res)
                this.form.deepLinkName = res.deepLinkName
                this.form.deepLinkUrl = res.deepLinkUrl
                this.settleList = res.operationRecordListVos
            } catch (error) {}
        },
        checkForm() {
            let flag = true
            this.$refs['form'].validate(valid => {
                flag = valid
            })

            return flag
        },
        async onSubmit() {
            if (!this.checkForm()) return
            try {
                let data = {}
                if (this.routeData.type === 'add') {
                    data = {
                        data: JSON.stringify(this.form),
                        op: this.routeData.type
                    }
                } else {
                    data = {
                        data: JSON.stringify({
                            id: this.routeData.id,
                            deepLinkName: this.form.deepLinkName,
                            deepLinkUrl: this.form.deepLinkUrl
                        }),
                        op: this.routeData.type
                    }
                }

                await this.$axios(this.getModuleUrl(data.op), data)

                //页面跳转
                this.$message.success({ add: '新增成功', update: '修改成功' }[this.routeData.type])
                this.goBack()
            } catch (e) {}
        },
        goBack() {
            this.$router.push(this.moduleName)
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op)
        }
    },
    created() {
        this.routeData = this.$route.query
        if (['detail', 'update'].includes(this.routeData.type)) {
            this.getDetail(this.routeData.id)
        }
    },
    mounted() {}
}
</script>
<style lang="scss" scoped>
.container {
    height: 100%;
    width: 100%;
    .form-content-wrap {
        width: 100%;
        min-height: 100%;
        background: #ffffff;
        padding: 24px 40px;
        border-radius: 8px;
        margin-bottom: 64px;
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
/deep/ .el-table th.el-table__cell{
    background-color: #f5f7fa !important;
}
</style>
