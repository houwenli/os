<template>
    <div>
        <div class="priceSet">
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm" :disabled="editType==='detail'">
                <div>
                    <h3>基本信息</h3>
                    <el-row :gutter="20" v-loading="detailLoading">
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="8">
                            <el-form-item label="套餐城市：" prop="cityCode">
                                <ws-city v-model="form.cityCode" :defaultProps="{ checkStrictly: false, emitPath: false }" multiple level="2" :disabled="editType!=='add'"></ws-city>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="8">
                            <el-form-item label="生效时间：" prop="startTime">
                                <ws-date-range
                                    class="create-time"
                                    :startTime.sync="form.startTime"
                                    :endTime.sync="form.endTime"
                                    :intervalTime="365"
                                    :pickerOptions="pickerOptions"
                                ></ws-date-range>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="8">
                            <el-form-item label="是否上架：" prop="packageStatus" v-if="editType!=='detail'">
                                <el-radio-group v-model="form.packageStatus">
                                    <el-radio :label="0">否</el-radio>
                                    <el-radio :label="1">是</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="状态：" prop="packageStatus" v-else><span>{{ statusAndTime }}</span></el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div>
                    <h3>套餐信息</h3>
                    <table class="priceList" :class="[editType==='detail'?'detail':'']" v-loading="detailLoading">
                        <tr>
                            <th>套餐价格(元)</th>
                            <th>套餐天数</th>
                            <th>平台费收入(%)</th>
                            <th v-if="editType !== 'detail'">操作</th>
                        </tr>
                        <tr v-for="(item, i) in form.list" :key="i">
                            <td>
                                <el-form-item label="" label-width="0" :prop="`list.${i}.packagePrice`" :rules="rules.packagePrice">
                                    <el-input v-model="item.packagePrice" placeholder="(0, 100000]整数" clearable />
                                </el-form-item>
                            </td>
                            <td>
                                <el-form-item label="" label-width="0" :prop="`list.${i}.packageDay`" :rules="rules.packageDay">
                                    <el-input v-model="item.packageDay" placeholder="(0, 10000]整数" clearable />
                                </el-form-item>
                            </td>
                            <td>
                                <el-form-item label="" label-width="0" :prop="`list.${i}.platformRate`" :rules="rules.platformRate">
                                    <el-input v-model="item.platformRate" placeholder="[0-100.00]" clearable />
                                </el-form-item>
                            </td>
                            <td v-if="editType !== 'detail'">
                                <el-button type="text" style="color: #F05259" @click="handleDel(i)">删除</el-button>
                                <el-button v-if="form.list.length < 9" type="text" style="color: #F05259" @click="handleAdd">新增</el-button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-if="editType === 'detail'" class="operateLogs">
                    <h3>操作记录</h3>
                    <el-table :data="tableLogs" border style="width: 100%" header-row-class-name="table-head">
                        <el-table-column align="center" type="index" label="序号" width="120px" />
                        <el-table-column align="center" prop="userName" label="操作人" />
                        <el-table-column align="center" prop="operationTypeStr" label="操作类型" />
                        <el-table-column align="center" prop="updateTime" label="操作时间" />
                    </el-table>
                </div>
            </el-form>
        </div>
        <div class="footerBtn">
            <el-button plain @click="back">取 消</el-button>
            <el-button v-if="editType!=='detail'" type="primary" :loading="saveLoading" @click="handleSave">保 存</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        const validatePrice = (rule, value, callback) => {
            const reg = /^(100000|\d{1,5})$/
            if (reg.test(value) && value > 0) {
                callback()
            } else {
                callback(new Error('请输入(0, 100000]整数！'))
            }
        };
        const validateDay = (rule, value, callback) => {
            const reg = /^(?:0|[1-9][0-9]{0,3}|10000)$/
            if (reg.test(value) && value > 0) {
                callback()
            } else {
                callback(new Error('请输入(0, 10000]整数！'))
            }
        };
        const validatePerc = (rule, value, callback) => {
            const reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/
            if (value >= 0 && reg.test(value) && value <= 100) {
                callback()
            } else {
                callback(new Error('请输入[0-100.00]'))
            }
        };
        return {
            form: {
                cityCode: [],
                startTime: '',
                endTime: '',
                packageStatus: 0,
                list: [{packagePrice: '', packageDay: '', platformRate: ''}]
            },
            rules: {
                cityCode: [{ required: true, message: '请选择城市', trigger: 'change' }],
                startTime: [{ required: true, message: '请选择生效时间', trigger: 'blur' }],
                packageStatus: [{ required: true, message: '请选择是否上架', trigger: 'blur' }],
                packagePrice: [
                    { required: true, message: '请输入套餐价格', trigger: 'blur' },
                    { validator: validatePrice, trigger: 'blur' }
                ],
                packageDay: [
                    { required: true, message: '请输入套餐天数', trigger: 'blur' },
                    { validator: validateDay, trigger: 'blur' }
                ],
                platformRate: [
                    { required: true, message: '请输入平台费收入', trigger: 'blur' },
                    { validator: validatePerc, trigger: 'blur' }
                ]
            },
            moduleName: '/workbench/baoganManage/priceConfig',
            editType: 'add',
            id: null,
            op: {
                detail: 'queryDetail',
                add: 'save',
                edit: 'update'
            },
            detailLoading: false,
            saveLoading: false,
            tableLogs: [],
            statusAndTime: null,
            pickerOptions: {
                shortcuts: null,
                disabledDate(time) {
                    let curDay = new Date().toLocaleDateString();
                    return time.getTime() < new Date(curDay).getTime() || time.getTime() > new Date(curDay).getTime() + 24 * 3600 * 1000 * 31;
                },
            },
        }
    },
    created() {
        const { type, id } = this.$route.query
        this.editType = type
        this.id = id
        if (this.editType !== 'add') {
            this.getData(this.id)
        }
    },
    methods: {
        // 保存
        handleSave() {
            this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
                const startT = new Date(this.form.startTime).getTime();
                const endT = new Date(this.form.endTime).getTime();
                const curTime = new Date().getTime(); // 当前时间
                if (curTime > endT) {
                    this.$message.error('结束时间要大于当前时间');
                    return;
                }
                if (startT > endT) {
                    this.$message.error('结束时间要大于开始时间');
                    return;
                }
                const op = this.op[this.editType]
                const url = this.$getModuleUrl(this.moduleName, op);
                this.saveLoading = true
                const { id, cityCode, startTime, endTime, packageStatus, list } = this.form
                const params = {
                    id, startTime, endTime, packageStatus,
                    list: list.map(item => {
                        return {
                            packagePrice: this.$baseMethod.regYuanToFen(item.packagePrice),
                            packageDay: item.packageDay,
                            platformRate: item.platformRate
                        }
                    })
                }
                if (this.editType === 'add') {
                   params.cityCodeList = cityCode 
                }
                if (this.editType === 'edit') {
                    params.cityCode = cityCode[0]
                }
                this.$axios(url, {data: params, op}).then(res => {
                    this.saveLoading = false
                    const result = JSON.parse(res.data)
                    if (result && result.anwserCode && result.anwserCode.code === 1) {
                        const msg = { add: '新增', edit: '修改' }[this.editType]
                        this.$message.success(msg + '成功！');
                        this.$router.push({
                            name: 'priceConfig',
                            params: {
                                Refresh: true
                            }
                        })
                    } else {
                        this.$message.error(result.anwserCode && result.anwserCode.message)
                    }
                }).catch(() => {
                    this.saveLoading = false
                })
            } else {
                console.log('error submit!!');
                return false;
            }
        });
        },
        // 获取详情
        getData(id) {
            let param = {
                data: {id},
                op: this.op.detail
            };
            const url = this.$getModuleUrl(this.moduleName, param.op);
            this.detailLoading = true
            this.$axios(url, param).then(res => {
                this.detailLoading = false
                const result = JSON.parse(res.data)
                const { id, cityCode, startTime, endTime, packageStatus, list, loglist, statusAndTime } = result.data
                this.form = {
                    id, cityCode: [cityCode], startTime, endTime, packageStatus: packageStatus == 1 ? packageStatus : 0,
                    list: list.map(item => {
                        return {
                            packagePrice: this.$baseMethod.regFenToYuan(item.packagePrice, false),
                            packageDay: item.packageDay,
                            platformRate: item.platformRate
                        }
                    })
                }
                this.tableLogs = loglist || []
                this.statusAndTime = statusAndTime
            }).catch(() => {
                this.detailLoading = false
            })
        },
        // 添加一条
        handleAdd() {
            const len = this.form.list.length - 1
            let flag = true
            this.$refs['ruleForm'].validateField([
                `list.${len}.packagePrice`,
                `list.${len}.packageDay`,
                `list.${len}.platformRate`],
                errorMessage => {
                    if (errorMessage) {
                        flag = false
                    }
                }
            )
            if (flag) {
                let arr = [...this.form.list]
                arr.push({packagePrice: '', packageDay: '', platformRate: ''})
                this.form = {
                    ...this.form,
                    list: [...arr]
                }
            } else {
                this.$message.error('请正确填写再新增！')
            }
              
        },
        // 删除一条
        handleDel(i) {
            if(this.form.list.length <= 1) {
                this.$message.error('最少一条！')
                return;
            }
            let arr = [...this.form.list]
            arr.splice(i, 1)
            this.form = {
                ...this.form,
                list: [...arr]
            }  
        },
        back() {
            this.$router.push(this.moduleName)
        }
    }
}
</script>

<style lang="scss" scoped>
    .priceSet {
        background: #fff;
        border-radius: 8px;
        height: calc(100% - 40px);
        overflow-y: auto;
        padding: 24px;
        // padding-bottom: 40px;
        .ruleForm {
            h3 {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 15px;
            }
            .ws-city {
                width: 100%;
                /deep/.el-cascader {
                    width: 100% !important;
                }
            }
            .ws-daterange {
                width: 100%;
                /deep/.el-date-editor--datetimerange.el-input__inner {
                    width: 100% !important;
                }
            }
        }
        .priceList {
            width: 100%;
            border-left: 1px solid #ebeef5;
            border-top: 1px solid #ebeef5;
            th, td {
                border-right: 1px solid #ebeef5;
                border-bottom: 1px solid #ebeef5;
            }
            th {
                height: 40px;
                line-height: 40px;
                color: #303133;
                background: #f5f7fa;
            }
            td {
                padding: 0px 8px;
                text-align: center;
                /deep/.el-form-item {
                    margin: 20px 0;
                }
            }
            &.detail {
                td {
                    /deep/.el-form-item {
                        margin: 5px 0;
                    }
                }
            }
        }
    }
    .footerBtn {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 60px;
        background: #fff;
        border-top: 1px solid #f2f2f2;
        display: flex;
        justify-content: center;
        align-items: center;
        .el-button {
            padding: 10px 65px;
        }
    }
    .operateLogs {
        margin-top: 20px;
        /deep/.table-head {
            th {
                color: #303133;
                background: #f5f7fa;
            }
        }
    }
</style>