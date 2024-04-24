<template>
    <div class="bg-page">
        <div class="sidebar">
            <tabs></tabs>
        </div>
        <div class="box">
            <el-form :rules="formRules" :model="dataOptions" ref="form" size="small" :disabled="!isEdit">
                <ws-descriptions title="城市会员费配置">
                    <ws-table-el style="padding: 0 !important;" ref="table" :data="dataOptions.cityPriceList"
                                 v-bind="{pagination: false,autoHeight: false,filterColumns: false,indexColumn: false,loading: true,}"
                                 :header-cell-style="{'background': '#F5F7FA'}" :key="isEdit + tableKey">
                        <template>
                            <ws-table-column-el label="会员等级" align="center">
                                <template slot-scope="scope">
                                    <el-form-item style="margin: 14px 0"
                                                  :prop="'cityPriceList.' + scope.$index + '.gradeName'"
                                                  :rules="formRules.gradeName">
                                        <el-input v-model.trim="dataOptions.cityPriceList[scope.$index].gradeName"
                                                  maxlength="10"
                                                  placeholder="请输入会员等级" style="width: 100%;" clearable></el-input>
                                    </el-form-item>
                                </template>
                            </ws-table-column-el>
                            <ws-table-column-el label="会员费（元）" align="center" width="300">
                                <template slot-scope="scope">
                                    <el-form-item style="margin: 14px 0"
                                                  :prop="'cityPriceList.' + scope.$index + '.price'"
                                                  :rules="formRules.price">
                                        <el-input-number v-model.trim="dataOptions.cityPriceList[scope.$index].price"
                                                         :precision="2" :max="1000000"
                                                         :min="0" :controls="false" placeholder="[1-100000]整数"
                                                         style="width: 100%;" clearable
                                        ></el-input-number>
                                    </el-form-item>
                                </template>
                            </ws-table-column-el>
                            <ws-table-column-el label="会员有效期（天）" align="center" width="300">
                                <template slot-scope="scope">
                                    <el-form-item style="margin: 14px 0"
                                                  :prop="'cityPriceList.' + scope.$index + '.vipDay'"
                                                  :rules="formRules.vipDay">
                                        <el-input-number v-model.trim="dataOptions.cityPriceList[scope.$index].vipDay"
                                                         :precision="0" :max="1000000"
                                                         :min="1" :controls="false" placeholder="[1-100000]整数"
                                                         style="width: 100%;" clearable
                                        ></el-input-number>
                                    </el-form-item>
                                </template>
                            </ws-table-column-el>
                            <ws-table-column-el label="操作" align="center" width="200" v-if="isEdit">
                                <template slot-scope="scope">
                                    <el-button v-if="dataOptions.cityPriceList.length > 1" type="text"
                                               style="margin-right: 10px" @click="tableKey = 'table'+ new Date().getTime();deleteRow(scope.$index)">
                                        删除
                                    </el-button>
                                    <el-button v-if="dataOptions.cityPriceList.length < 20" type="text"
                                               @click="addRuleRow(scope.$index)">新增
                                    </el-button>
                                </template>
                            </ws-table-column-el>
                        </template>
                    </ws-table-el>
                </ws-descriptions>

                <ws-descriptions title="会员费规则配置">
                    <el-form-item style="margin-left: 40px" prop="maxYear" label="最大可购年限（年）："
                                  :rules="formRules.maxYear">
                        <el-input-number v-model.trim="dataOptions.maxYear" :precision="0" :max="100" :min="1"
                                         :controls="false" placeholder="[1-100]整数"
                                         clearable></el-input-number>
                    </el-form-item>
                </ws-descriptions>
            </el-form>

            <ws-descriptions title="操作记录" v-if="!isEdit">
                <ws-table-el style="padding: 0 !important;" ref="table" :data="dataOptions.logList || []"
                             v-bind="{pagination: false,autoHeight: false,filterColumns: false,loading: true}"
                             :header-cell-style="{'background': '#F5F7FA'}">
                    <template>
                        <ws-table-column-el prop="opUserName" label="操作人"></ws-table-column-el>
                        <ws-table-column-el prop="createTime" label="操作时间"></ws-table-column-el>
                    </template>
                </ws-table-el>
            </ws-descriptions>

            <div class="footer_btn" style="z-index: 10 !important;" v-if="powerList.update">
                <el-button @click="isEdit = !isEdit;!isEdit ? getData() : ''" plain>{{ isEdit ? '取消' :'修改' }}</el-button>
                <ws-throttle v-if="isEdit">
                    <el-button @click="save" type="primary">保存</el-button>
                </ws-throttle>
            </div>
        </div>
    </div>
</template>

<script>
import Tabs from '../components/tabs.vue';

export default {
    components: {Tabs},
    data () {
        return {
            moduleName: '/workbench/baoganManage/cityVipFeeConfig',
            dataOptions: {
                maxYear: '',
                cityPriceList: [
                    {vipGrade: '', gradeName: '', price: '', vipDay: ''}
                ],
            },
            formRules: {
                gradeName: [{required: true, message: '请输入会员等级', trigger: 'blur'}],
                price: [{required: true, message: '请输入会员费', trigger: 'blur'}],
                vipDay: [{required: true, message: '请输入会员有效期', trigger: 'blur'}],
            },
            isEdit: false,
            tableKey: 1
        }
    },
    mounted () {
        this.getData();
    },
    methods: {
        async save () {
            if (this.checkForm('form')) {
                this.$confirm(`请确认是否城市会员配置`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    const url = this.getModuleUrl('update')
                    let data = JSON.parse(JSON.stringify(this.dataOptions))
                    data.cityPriceList.forEach((item)=>item.price = this.$baseMethod.regYuanToFen(item.price))
                    const reqData = {
                        data,
                        op: 'update'
                    }
                    this.$axios(url, reqData).then(res => {
                        if (res.code === 1) {
                            this.$message.success(`保存成功`)
                            this.isEdit = !this.isEdit
                        } else {
                            this.$message.error(res.msg)
                        }
                    })
                })
            }
        },
        getData () {
            let data = {
                op: 'findList'
            }
            let URL = this.getModuleUrl(data.op)
            this.$axios(URL, data).then(res => {
                if (res.code == 1) {
                    this.dataOptions = JSON.parse(res.data)
                    this.dataOptions.cityPriceList.forEach((item)=>item.price = this.$baseMethod.regFenToYuan(item.price))
                }
            })
        },
        addRuleRow (i) {
            if (this.checkForm('form')) {
                let opt = {vipGrade: this.dataOptions.cityPriceList.length+1, gradeName: '', price: '', vipDay: ''}
                this.dataOptions.cityPriceList.push(opt)
            }
        },
        deleteRow (i) {
            this.dataOptions.cityPriceList.splice(i, 1);
        },
        checkForm (formName) {
            let flag = false
            const gradeNames = this.dataOptions.cityPriceList.map(rowData => rowData.gradeName);
            let isDup = gradeNames.length !== [...new Set(gradeNames)].length;
            if (isDup) {
                this.$message.error('会员等级名称不允许重复');
                return false
            }
            this.$refs[formName].validate(valid => {
                if (!valid) {
                    return false
                }
                flag = true
            })
            return flag
        },
        getModuleUrl (op) {
            return this.$getModuleUrl(this.moduleName, op)
        }
    }
}
</script>
<style lang="scss" scoped>
.bg-page {
    display: flex;

    .sidebar {
        flex: 1;
        width: 200px;
        margin-right: 14px;
    }

    .box {
        border-radius: 8px;
        padding: 15px 24px 56px;
        background: #fff;
        width: 100%;
        height: 100%;
        overflow-y: auto;
    }

    .btn {
        text-align: center;

    }

    /deep/ .el-input-number .el-input__inner {
        text-align: left !important;
    }
}
</style>
