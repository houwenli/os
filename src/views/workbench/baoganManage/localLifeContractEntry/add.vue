<template>
<!-- 本地生活包干录入新增 -->
    <div class="flex-column">
        <div class="form-wrap flex-1">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px">
            <div class="title">订单信息</div>
            <div class="conten">
              <el-row :gutter="10">
                <el-col :sm="24" :lg="12" :xl='8'>
                  <el-form-item label="姓名:" prop="name">
                    <el-input v-model.trim="ruleForm.name" placeholder="请输入姓名" clearable maxlength="5"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :lg="12" :xl='8'>
                  <el-form-item label="手机号码:" prop="phone">
                    <el-input v-model.trim="ruleForm.phone" placeholder="请输入手机号码" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :lg="12" :xl='8'>
                  <el-form-item label="金额:" prop="amount">
                    <el-input v-model.number="ruleForm.amount" placeholder="[1,10000000]整数" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :lg="12" :xl='8'>
                  <el-form-item label="打款时间:" prop="drawingTime">
                    <el-date-picker v-model="ruleForm.drawingTime" type="datetime" placeholder="请选择打款时间" value-format="yyyy-MM-dd HH:mm:ss" style="width:400px"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="title">推荐信息</div>
              <el-row :gutter="10">
                <el-col :sm="24" :lg="12" :xl='8'>
                  <el-form-item label="推荐类型:" prop="recommendType">
                    <el-select v-model="ruleForm.recommendType" placeholder="请选择推荐类型" @change="changeType" style="width:400px">
                      <el-option v-for="item in recommendedTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :lg="12" :xl='8' v-if="this.ruleForm.recommendType==1">
                  <el-form-item label="推荐人:" prop="recommendName">
                    <el-input v-model.trim="ruleForm.recommendName" placeholder="请输入推荐人姓名" clearable maxlength="5"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :lg="12" :xl='8' v-if="this.ruleForm.recommendType==1">
                  <el-form-item label="手机号码:" prop="recommendPhone">
                    <el-input v-model.trim="ruleForm.recommendPhone" placeholder="请输入手机号码" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :lg="12" :xl='8' v-if="this.ruleForm.recommendType==1">
                  <el-form-item label="收款账户:" prop="personalAccount">
                    <el-input v-model.trim="ruleForm.personalAccount" placeholder="请输入收款人账户" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :lg="12" :xl='8'>
                  <el-form-item label="机构名称:" prop="idNumber">
                      <organization
                        v-model="ruleForm.idNumber"
                        :showSelect="true"
                        :selectOptions="selectOptions"
                        ref="orgSelect"
                        placeholder="请选择类型"
                        valueKey="idNumber"
                        :orgType="ruleForm.orgType"
                        :reqData="reqData"
                        @orgTypeChange="changeOrgType"
                        @organizationChange="organizationChange">
                      </organization>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :lg="12" :xl='8'>
                    <el-form-item label="分期年限:" prop="stagingYear" v-if="this.ruleForm.recommendType==2">
                      <el-input v-model.trim="ruleForm.stagingYear" placeholder="[0,100]支持两位小数" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :lg="12" :xl='8'>
                  <el-form-item label="绩效比例:" prop="performanceRatio">
                      <el-input v-model.trim="ruleForm.performanceRatio" placeholder="[0,100]支持两位小数" clearable><template slot="append">%</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :lg="12" :xl='8'>
                  <el-form-item label="绩效金额:">
                      <p v-if="this.ruleForm.amount && this.ruleForm.performanceRatio" class="amount-text">{{performanceAmount}}</p>
                      <p v-else class="amount-text">根据比例自动计算</p>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :lg="12" :xl='8'>
                  <el-form-item label="备注:" prop="remark" v-if="this.enterQuery.type=='add'">
                    <el-input v-model="ruleForm.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 10}" placeholder="请输入备注" maxlength="200" show-word-limit></el-input>
                  </el-form-item>
                  <el-form-item label="备注:" prop="remark" v-else>
                    <el-input v-model="ruleForm.recommendRemark" type="textarea" :autosize="{ minRows: 2, maxRows: 10}" placeholder="请输入备注" maxlength="200" show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
          </el-form>
        </div>
        <div class="footer_btn">
            <el-button plain @click="back()">取消</el-button>
            <ws-throttle>
                <el-button type="primary" @click="save('ruleForm')" v-if="powerList.save||powerList.update">确定</el-button>
            </ws-throttle>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import organization from './components/organization-options.vue'
export default {
    components: {
      organization
    },
    data() {
        const moneyValidator = (rule, value, callback) => {
          if (!/^([1-9][0-9]*)?$/.test(value)) {
            return callback(new Error('请输入金额,[1,10000000]整数'));
          } else if (value > 10000000) {
            return callback(new Error('[1,10000000]整数'));
          }
          return callback();
        };
        return {
            moduleName: '/workbench/baoganManage/localLifeContractEntry',
            ruleForm: {
              name: '', //姓名
              phone: '', //手机号码
              amount: '', //金额
              drawingTime: '', //打款时间
              recommendType: 1, //推荐类型:1个人推荐,2机构推荐
              recommendName: '', //推荐人姓名
              recommendPhone: '', //推荐人手机号
              personalAccount: '', //个人账户
              orgType: '', //机构类型
              idNumber: '', //机构唯一编码
              agencyNumber: '', //机构编码
              deptFullName: '', //部门全称
              stagingYear: '', //分期年限
              performanceRatio: '', //绩效比例
              remark: '', //备注
              recommendRemark: '', //编辑回显备注
            },
            rules: {
              name: [
                { required: true, message: '请输入姓名', trigger: 'blur' },
                { pattern: /^[\u4E00-\u9FA5]{1,10}$/, message: '姓名格式错误，请重新输入', trigger: 'blur' }
              ],
              phone: [
                { required: true, message: '请输入手机号码', trigger: 'blur' },
                { pattern: /^(1[0-9][0-9]\d{8,8})$/, message: '手机号码格式错误，请重新输入', trigger: 'blur' }
              ],
              amount: [
                { required: true, message: '请输入金额', trigger: 'blur' },
                { required: true, trigger: 'blur', validator: moneyValidator }
              ],
              drawingTime: [
                { required: true, message: '请选择打款时间', trigger: 'change' }
              ],
              recommendType: [
                { required: true, message: '请选择推荐类型', trigger: 'change' }
              ],
              recommendName: [
                { required: true, message: '请输入推荐人姓名', trigger: 'blur' },
                { pattern: /^[\u4E00-\u9FA5]{1,10}$/, message: '推荐人姓名格式错误，请重新输入', trigger: 'blur' }
              ],
              recommendPhone: [
                { required: true, message: '请输入推荐人手机号', trigger: 'blur' },
                { pattern: /^(1[0-9][0-9]\d{8,8})$/, message: '手机号码格式错误，请重新输入', trigger: 'blur' }
              ],
              personalAccount: [
                { required: true, message: '请输入个人账户', trigger: 'blur' }
              ],
              idNumber: [
                { required: true, message: '请输入机构名称', trigger: 'blur' }
              ],
              stagingYear: [
                { required: true, message: '请输入分期年限', trigger: 'blur' },
                { pattern: /^(100|(([1-9]){1}[0-9]?|0{1})((\.)([0-9]){1,2})?)$/, message: '分期年限输入错误，请重新输入', trigger: 'blur' }
              ],
              performanceRatio: [
                { required: false, message: '请输入绩效比例', trigger: 'blur' },
                { pattern: /^(100|(([1-9]){1}[0-9]?|0{1})((\.)([0-9]){1,2})?)$/, message: '绩效比例输入错误，请重新输入', trigger: 'blur' }
              ],
            },
            selectOptions: [
              {
                  value: '20',
                  label: '城市分公司',
              },
              {
                  value: '30',
                  label: '区县分公司',
              },
              {
                  value: '40',
                  label: '实体店',
              }
            ],
            reqData: {
              // op: '',
              // moduleName: ''
            },
            edNumber: ''
        };
    },
    computed: {
        ...mapState({
            recommendedTypeFilters: state => state.baogan.recommendedTypeFilters,
            stateFilters: state => state.baogan.stateFilters
        }),
        //绩效金额计算
        performanceAmount() {
          if (this.ruleForm.amount&&this.ruleForm.performanceRatio) {
            return this.ruleForm.amount*this.ruleForm.performanceRatio/100
          }
        },
        formContentStatus() {
            return {
                add: '新增',
                edit: '修改'
            }[this.enterQuery.type];
        },
    },
    created() {
      let { query } = this.$route;
      this.enterQuery = query;
      if (this.enterQuery.type=='edit') {
        this.getDetail()
      }
    },
    methods: {
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        changeOrgType(val) {
            this.ruleForm.orgType = val;
        },
        organizationChange(value, orgName, agencyNumber) {
            this.ruleForm.idNumber = value;
            this.ruleForm.deptFullName = orgName;
            this.ruleForm.agencyNumber = agencyNumber;
            this.edNumber = value
        },
        changeType() {
          this.ruleForm= {
              name: this.ruleForm.name, //姓名
              phone: this.ruleForm.phone, //手机号码
              amount: this.ruleForm.amount, //金额
              drawingTime: this.ruleForm.drawingTime, //打款时间
              recommendType: this.ruleForm.recommendType, //推荐类型:1个人推荐,2机构推荐
              recommendName: '', //推荐人姓名
              recommendPhone: '', //推荐人手机号
              personalAccount: '', //个人账户
              orgType: '', //机构类型
              idNumber: '', //机构唯一编码
              agencyNumber: '', //机构编码
              deptFullName: '', //部门全称
              stagingYear: '', //分期年限
              performanceRatio: '', //绩效比例
              remark: '', //备注
              recommendRemark: '', //编辑回显备注
            },
            setTimeout(() => {
              this.$refs.ruleForm.clearValidate();
            }, 0);
        },
        getDetail() {
            const data = {
                data: { id:this.enterQuery.id },
                op: 'detail',
            };
            const URL = this.getModuleUrl(data.op);
            this.$axios(URL, data).then(res => {
                if (res.code == 1) {
                  let resData = JSON.parse(res.data);
                  this.ruleForm = resData
                  this.edNumber = resData.idNumber //编辑参数赋值
                  this.ruleForm.idNumber = resData.deptFullName //编辑回显
                  this.ruleForm.orgType = this.selectOptions.filter(item => item.value==resData.orgType)[0].value
                  this.ruleForm.recommendRemark = resData.recommendRemark
                }
            })
        },
        save(formName) {
            this.$refs[formName].validate((valid) => {
            if (!valid) return;
            const data = {
              data: {
                  id: this.enterQuery.type=='add'?'':this.enterQuery.id,
                  performanceAmount: this.performanceAmount,
                  name: this.ruleForm.name, //姓名
                  phone: this.ruleForm.phone, //手机号码
                  amount: this.ruleForm.amount, //金额
                  drawingTime: this.ruleForm.drawingTime, //打款时间
                  recommendType: this.ruleForm.recommendType, //推荐类型:1个人推荐,2机构推荐
                  recommendName: this.ruleForm.recommendName, //推荐人姓名
                  recommendPhone: this.ruleForm.recommendPhone, //推荐人手机号
                  personalAccount: this.ruleForm.personalAccount, //个人账户
                  orgType: this.ruleForm.orgType, //机构类型
                  idNumber: this.enterQuery.type=='add'?this.ruleForm.idNumber:this.edNumber, //机构唯一编码
                  agencyNumber: this.ruleForm.agencyNumber, //机构编码
                  deptFullName: this.ruleForm.deptFullName, //部门全称
                  stagingYear: this.ruleForm.stagingYear, //分期年限
                  performanceRatio: this.ruleForm.performanceRatio, //绩效比例
                  remark: this.enterQuery.type=='add'?this.ruleForm.remark:this.ruleForm.recommendRemark, //备注
              },
                op: this.enterQuery.type=='add'?'save':'update',
            }
            const URL = this.getModuleUrl(data.op);
            this.$axios(URL, data).then(res => {
                if (res.code == 1) {
                    this.$message.success(this.enterQuery.type=='add'?"新增成功！":"修改成功！");
                    this.back();
                }
            });
          });
        },
        back() {
            this.$router.push({ name: 'localLifeContractEntry' });
        },
    },
};
</script>

<style lang="scss" scoped>
.form-wrap {
    padding: 32px 40px;
    background: #fff;
    border-radius: 8px;
    /deep/ .el-form-item__content {
      width: 400px;
      height: 36px;
    }
    .title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 16px;
        &:first-of-type {
            padding: 0;
        }
    }
    .conten {
      margin-bottom: 32px;
    }
    .amount-text {
      width: 400px;
      height: 36px;
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      background-color: #F5F7FA;
      color: #C0C4CC;
      padding-left: 15px;
    }
}
.ws-organization-options {
  /deep/.options-wrap {
      width: 116px !important;
      flex: 0 0 116px;
      border-right: 1px solid #dcdfe6;
  }
}
/deep/ .el-textarea .el-input__count {
    line-height: 14px;
}
/deep/ .el-input-group__append {
  background-color: #fff;
  color: #606266;
}
/deep/ .el-input-group--append .el-input__inner, .el-input-group__prepend {
    border-right: none;
}
</style>
