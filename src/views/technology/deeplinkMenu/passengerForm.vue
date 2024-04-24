<template>
    <div class="container">
        <div class="form-content-wrap">
            <div class="panel">
                <div class="title">基础信息</div>
                <el-form ref="form" :model="form" :rules="rules" label-width="120px" :hide-required-asterisk="routeData.type === 'detail'">
                    <el-row>
                        <el-col>
                            <el-form-item label="Deeplink名称:" prop="deeplinkName">
                                <el-input :maxlength="30" v-model.trim="form.deeplinkName" :disabled="routeData.type === 'detail'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col>
                            <el-form-item label="Deeplink路径:" prop="deeplinkPath">
                                <el-input v-model.trim="form.deeplinkPath" maxlength="300" :disabled="routeData.type === 'detail'"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="panel" style="margin-bottom: 0px" v-if="routeData.type === 'detail'">
                <div class="title">操作记录</div>
                <ws-table-el ref="table" v-bind="tableConfig" :col="8">
                    <template>
                        <ws-table-column-el prop="opUserName" label="操作人"></ws-table-column-el>
                        <ws-table-column-el prop="opType" label="操作类型"></ws-table-column-el>
                        <ws-table-column-el prop="opTime" label="操作时间"></ws-table-column-el>
                    </template>
                </ws-table-el>
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
                suitPort: 0,
                deeplinkName: '',
                deeplinkPath: '',
                status: 0
            },
            rules: {
                deeplinkName: [
                    {
                        required: true,
                        message: '请填写Deeplink名称',
                        trigger: 'change',
                    },
                ],
                deeplinkPath: [
                    {
                        required: true,
                        message: '请填写Deeplink路径',
                        trigger: 'blur',
                    },
                ],
            },
            searchOptions: {
                objectId: this.$route.query.id,
            },
            tableConfig: {
                filterColumns: false,
                loading: true,
                indexColumn: false,
                lazyQuery: {
                    moduleName: '/technology/deeplinkMenu/passenger',
                    op: {
                        selectList: 'queryOpLogs',
                        selectCount: 'countOpLogs',
                    },
                },
            },
            moduleName: '/technology/deeplinkMenu/passenger',
        };
    },
    methods: {
        async getDetail(id) {
            try {
                let params = {
                    data: JSON.stringify({
                        id,
                    }),
                    op: 'detail',
                };
                let {data} = await this.$axios(this.getModuleUrl(params.op), params)
                const res = JSON.parse(data)
                this.form.deeplinkName = res.data.deeplinkName
                this.form.deeplinkPath = res.data.deeplinkPath
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
            if (!this.checkForm()) return;
            try {
                let data = {}
                if(this.routeData.type === 'add') {
                    data = {
                        data: JSON.stringify(this.form),
                        op: this.routeData.type,
                    };
                } else {
                    data = {
                        data: JSON.stringify({
                            id:this.routeData.id,
                            suitPort: 0,
                            deeplinkName : this.form.deeplinkName,
                            deeplinkPath : this.form.deeplinkPath,
                        }),
                        op: this.routeData.type,
                    }
                }

                await this.$axios(this.getModuleUrl(data.op),data);

                //页面跳转
                this.$message.success({ add: '新增成功', updateDeepLink: '修改成功' }[this.routeData.type]);
                this.goBack()
            } catch (e) {}
        },
        goBack() {
            this.$router.push({ path: 'passenger' });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
    created() {
        this.routeData = this.$route.query;
        if (['detail', 'updateDeepLink'].includes(this.routeData.type)) {
            this.getDetail(this.routeData.id);
        }
    },
    mounted() {},
};
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
</style>
