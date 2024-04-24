<template>
    <div >
        <div class="form-content">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="用户类型" prop="type">
                            <el-select v-model="form.type" placeholder="请选择客户端" style="width:100%" clearable>
                                <el-option label="网约车司机" :value="2"></el-option>
                                <el-option label="出租车司机" :value="3"></el-option>
                                <el-option label="分支机构" :value="5"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex">
                    <el-col :span="8">
                        <el-form-item label="手机号" placeholder="请输入手机号" prop="phone" style="width: 100%">
                            <el-input v-model="form.phone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="15" class="btn">
                        <el-button class="buttons" type="primary" @click="searchCap('form')">查询验证码</el-button>
                        <el-button class="buttons" type="primary" @click="resetCap('form')">重置</el-button>
                    </el-col>
                </el-row>
            </el-form>

            <div class="content">
                <div class="item">验证码: {{information.msg}}</div>
                <div class="item">获取时间: {{information.createTime}}</div>
            </div>
        </div>

      <ws-footer>
          <el-button @click="goBack">返回</el-button>
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
                        message: '请选择客户端',
                        trigger: 'change'
                    }
                ],
                phone: [
                    {
                        required: true,
                        message: '请输入手机号码',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                        message: '请输入正确的手机号码',
                        trigger: 'blur'
                    }
                ]
            },
            form: {
                type: '',
                phone: ''
            },
            information: {
                msg: '', //验证码
                createTime: '' //获取时间
            },
            moduleName: '/technology/captcha'
        };
    },
    methods: {
        searchCap(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    //调用查询验证码接口
                    let data = {
                        op: 'querySms',
                        data: this.form
                    };
                    this.$axios(this.getModuleUrl('querySms'), data).then(res => {
                        let data = JSON.parse(res.data);
                        this.information = data;
                    });
                } else {
                    return false;
                }
            });
        },
        //重置
        resetCap(formName) {
            this.$refs[formName].resetFields();
            this.information = {};
        },
        //返回
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

<style lang="scss" >

 .form-content {
        width: 100%;
        height: calc(100vh - 160px);
        background: #ffffff;
        padding-top: 24px;
        padding-left: 24px;
        padding-right: 24px;
        border-radius: 8px;
        margin-bottom: 64px;
        .content {
            display: flex;
            background: #f5f7fa;
            border-radius: 8px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #606266;
            padding: 20px 24px;
            margin: 20px 24px;
            box-sizing: border-box;

            .item {
              flex: 1;
            }
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
</style>