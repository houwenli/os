<template>
    <div>
        <div class="form-content-wrap">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="司机类型" prop="type">
                            <el-select v-model="form.type" placeholder="请选择司机类型" style="width: 100%" clearable>
                                <el-option label="网约车司机" :value="1"></el-option>
                                <el-option label="出租车司机" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex">
                    <el-col :span="8">
                        <el-form-item label="身份证号" placeholder="请输入身份证号" prop="idCard" style="width: 100%">
                            <el-input v-model="form.idCard"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="15" class="btn">
                        <el-button class="buttons" type="primary" @click="searchCap('form')">查询</el-button>
                        <el-button class="buttons" type="primary" @click="resetCap('form')">重置</el-button>
                    </el-col>
                </el-row>
            </el-form>

            <div class="content">
                <div class="contentOne">
                    <div class="item">姓名: {{information.name}}</div>
                    <div class="item">车牌号: {{information.carNum}}</div>
                </div>
                <div class="contentOne">
                    <div class="item">注册账号: {{information.phone}}</div>
                    <div class="item">注册时间: {{information.registerTime}}</div>
                </div>
                <div class="contentOne">
                    <div >审核状态: {{information.audit | auditFilter}}</div>
                </div>
            </div>
        </div>

        <ws-footer>
          <el-button  @click="goBack()">返回</el-button>
        </ws-footer>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rules: {
                type: [
                    {
                        required: true,
                        message: '请选择司机类型',
                        trigger: 'change'
                    }
                ],
                idCard: [
                    {
                        required: true,
                        message: '请输入身份证号码',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                        message: '请输入正确的身份证号',
                        trigger: 'blur'
                    }
                ]
            },
            //表单信息
            form: {
                type: '',
                idCard: ''
            },
            //查询信息
            information: {
                registerTime: '', //注册时间
                name: '', //姓名
                audit: '', //审核状态 0待完善资料  10 待审核  20审核中 30审核通过 40审核不通过
                carNum: '', //车牌号
                phone: '' //注册账号
            },
            moduleName: '/technology/information'
        };
    },
    filters: {
        //过滤审核状态
        auditFilter(val) {
            if (val === 0) {
                return '待完善资料';
            } else if (val === 10) {
                return '待审核';
            } else if (val === 20) {
                return '审核中';
            } else if (val === 30) {
                return '审核通过';
            } else if (val === 40) {
                return '审核不通过';
            } else {
                return '';
            }
        }
    },
    methods: {
        searchCap(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    //调用查询司机身份验证信息接口
                    let data = {
                        op: 'queryInfo',
                        data: this.form
                    };
                    this.$axios(this.getModuleUrl('queryInfo'), data).then(res => {
                        let data = JSON.parse(res.data);
                        this.information = data;
                    });
                } else {
                    return false;
                }
            });
        },
        resetCap(formName) {
            this.$refs[formName].resetFields();
            this.information = {};
        },
        goBack() {
          this.$router.push({
            path: '/technology'
          })
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    }
};
</script>

<style lang="scss" scoped>

    .form-content-wrap {
        width: 100%;
        height: calc(100vh - 160px);
        background: #ffffff;
        padding: 32px 48px;
        border-radius: 8px;
        box-sizing: border-box;
        margin-bottom: 64px;
        .content {
            width: 100%;
            background: #f5f7fa;
            border-radius: 8px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #606266;
            padding: 1px 82px 24px 82px;
            margin-top: 20px;

        }
    }
    .btn {
        margin-left: 15px;
        margin-top: -2px;
    }
    .buttons {
        width: 160px;
        height: 40px;
    }
.contentOne {
    display: flex;
    margin-top: 24px;

    .item {
      flex: 1;
    }
}
</style>
