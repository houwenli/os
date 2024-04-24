<template>
    <el-form label-position="right" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px">
        <div class="org-open-apply-title">机构信息</div>
        <el-row :gutter="10">
            <el-col :span="8">
                <el-form-item label="申请类型:" prop="orgType">
                    <el-select required v-model="ruleForm.orgType" style="width: 100%" @change="orgApplyChange">
                        <el-option label="一级机构" :value="20"></el-option>
                        <el-option label="二级机构" :value="30"></el-option>
                        <el-option label="实体店" :value="40"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="8">
                <el-form-item label="机构全称:" prop="name">
                    <el-input v-model.trim="ruleForm.name" placeholder="请输入机构全称" maxlength="50"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="机构简称:" prop="simpleName">
                    <el-input v-model.trim="ruleForm.simpleName" placeholder="请输入机构简称" maxlength="10"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="设立时间:" prop="establishTime">
                    <el-date-picker
                        style="width: 100%"
                        v-model="ruleForm.establishTime"
                        :picker-options="pickerOptions"
                        type="date"
                        placeholder="请选择日期"
                        value-format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="10" v-if="ruleForm.type === 20">
            <el-col :span="8">
                <el-form-item label="注册资本:" prop="registeredCapital">
                    <el-input v-model.trim="ruleForm.registeredCapital" placeholder="请输入注册资本"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="分公司类别:" prop="importantStatus">
                    <el-select required v-model="ruleForm.importantStatus" style="width: 100%">
                        <el-option label="重点分公司" value="1"></el-option>
                        <el-option label="非重点分公司" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="社会统一信用代码:" prop="serviceNo">
                    <el-input v-model.trim="ruleForm.serviceNo" placeholder="请输入社会统一信用代码" maxlength="10"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="8">
                <el-form-item label="机构所在地:" required>
                    <div style="display: flex">
                        <el-form-item prop="locationOrg">
                            <ws-city
                                placeholder="选择省市"
                                :defaultProps="{ checkStrictly: false }"
                                v-model="ruleForm.locationOrg"
                                level="2"
                                clearable
                                @change="orgApplyAreaChange"
                                ref="ws-city"
                            ></ws-city>
                        </el-form-item>
                        <el-form-item prop="localJurisdiction" style="flex: 1">
                            <el-select required v-model="ruleForm.submitCityCode" style="width: 100%" placeholder="请选择区域" filterable>
                                <el-option v-for="(item, index) in localJurisdictionList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="上级机构:" prop="superOrg">
                    <el-select required v-model="ruleForm.parentRelationId" style="width: 100%">
                        <el-option v-for="(item, index) in superOrgList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="业务城市:" prop="provinceCode">
                    <ws-city :defaultProps="{ checkStrictly: true }" v-model="ruleForm.provinceCode" level="2" clearable style="width: 100%" class="businessCity"></ws-city>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="8">
                <el-form-item label="详细地址:" prop="address">
                    <el-input disabled v-model="ruleForm.address" placeholder="请采集详细地址"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="16">
                <el-form-item prop="supplementAddress" label-width="0">
                    <el-input v-model.trim="ruleForm.supplementAddress" placeholder="请输入门牌号" style="width: 188px"></el-input>
                    <el-button type="primary" @click="chooseLocal" style="margin-left: 10px">采集地址</el-button>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="8">
                <el-form-item label="经度:" prop="lng">
                    <el-input disabled v-model="ruleForm.latitude"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="纬度:" prop="lat">
                    <el-input disabled v-model="ruleForm.longitude"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <div class="org-open-apply-title">
            负责人信息
            <span>(负责人手机号将作为登录账号使用，请正确填写)</span>
        </div>
        <el-row :gutter="10">
            <el-col :span="8">
                <el-form-item label="负责人姓名:" prop="contactPerson">
                    <el-input v-model.trim="ruleForm.contactPerson" placeholder="请负责人姓名"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="负责人手机号:" prop="contactPhone">
                    <el-input v-model="ruleForm.contactPhone" placeholder="请负责人手机号"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="负责人身份证:" prop="personIdNumber">
                    <el-input v-model.trim="ruleForm.personIdNumber" placeholder="请负责人身份证"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
export default {
    name: 'ValidateForm',

    data() {
        return {
            localJurisdictionList: [],
            superOrgList: [],
            moduleName: '/index/todo'
        };
    },

    props: {
        ruleForm: {
            type: Object,
            default: () => {},
            require: true
        },
        rules: {
            type: Object,
            default: () => {},
            require: true
        }
    },

    computed: {
        pickerOptions() {
            return {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
                }
            };
        }
    },

    methods: {
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },

        validate(callback) {
            this.$refs.ruleForm.validate(valid => {
                callback(valid);
            });
        },

        orgApplyChange() {
            this.superOrgList = [];
            let opt = {
                data: {
                    cityCode: this.ruleForm.locationOrg[1],
                    orgType: this.ruleForm.orgType
                },
                op: 'selectRegionInfoByCity'
            };
            this.$axios(this.getModuleUrl(opt.op), opt).then(res => {
                if (res.code == 1) {
                    const data = JSON.parse(res.data);
                    this.ruleForm.superOrg = '';
                    this.superOrgList = data;
                }
            });
        },

        orgApplyAreaChange() {
            this.localJurisdictionList = [];
            let opt = {
                data: {
                    cityCode: this.ruleForm.locationOrg[1]
                },
                op: 'selectRegionByCity'
            };
            this.$axios(this.getModuleUrl(opt.op), opt).then(res => {
                if (res.code == 1) {
                    this.localJurisdictionList = JSON.parse(res.data);
                    this.orgApplyChange();
                }
            });
        },

        chooseLocal() {
            let node = this.$refs['ws-city']['$refs'].cascader.getCheckedNodes();
            if (node.length > 0) {
                let { path, pathLabels } = node[0];
                this.$emit('chooseLocal', true, {
                    label: pathLabels[1],
                    cityCode: path[1]
                });
            } else {
                this.$message.info('请先选择所在城市区县');
            }
        }
    },

    created() {
        this.orgApplyChange();
        this.orgApplyChange();
    }
};
</script>

<style scoped lang="scss">
.org-open-apply-title {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 20px;

    span {
        font-size: 14px;
        font-weight: 400;
        color: #f56c6c;
    }
}

::v-deep .businessCity {
    .el-cascader--medium {
        width: 100%;
    }
}
</style>
