<template>
<!-- 本地生活包干录入详情/退款 -->
    <div class="flex-column">
        <div class="form-wrap flex-1">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px">
            <div>
              <ws-descriptions title="订单信息">
                <ws-descriptions-item label="订单号">
                    <span>{{ formData.orderCode }}</span>
                </ws-descriptions-item>
                <ws-descriptions-item label="状态">
                    <span>{{ formData.orderType | stateFilters }}</span>
                </ws-descriptions-item>
                <ws-descriptions-item label="姓名">
                    <span>{{ formData.name }}</span>
                </ws-descriptions-item>
                <ws-descriptions-item label="手机号">
                    <span>{{ formData.phone }}</span>
                </ws-descriptions-item>
                <ws-descriptions-item label="金额">
                    <span>{{ formData.amount&&formData.amount.toFixed(2) }}</span>
                </ws-descriptions-item>
                <ws-descriptions-item label="打款时间">
                    <span>{{ formData.drawingTime }}</span>
                </ws-descriptions-item>
                  <ws-descriptions-item label="创建人" v-if="this.enterQuery.type=='detail'">
                      <span>{{ formData.createUserName }}</span>
                  </ws-descriptions-item>
                  <ws-descriptions-item label="创建时间" v-if="this.enterQuery.type=='detail'">
                      <span>{{ formData.createTime }}</span>
                  </ws-descriptions-item>
              </ws-descriptions>
            </div>
            <div v-if="this.enterQuery.type=='detail'">
              <ws-descriptions title="推荐信息">
                <ws-descriptions-item label="推荐类型">
                    <span>{{ formData.recommendType | recommendedTypeFilters }}</span>
                </ws-descriptions-item>
                <ws-descriptions-item label="推荐人">
                    <span>{{ formData.recommendType&&formData.recommendType!=2?formData.recommendName:'-' }}</span>
                </ws-descriptions-item>
                <ws-descriptions-item label="手机号码">
                    <span>{{ formData.recommendType&&formData.recommendType!=2?formData.recommendPhone:'-' }}</span>
                </ws-descriptions-item>
                <ws-descriptions-item label="机构名称">
                    <span>{{ formData.deptFullName }}</span>
                </ws-descriptions-item>
                <ws-descriptions-item label="绩效比例">
                    <span v-if="formData.performanceRatio">{{ formData.performanceRatio }}%</span>
                    <span v-else>-</span>
                </ws-descriptions-item>
                <ws-descriptions-item label="绩效金额">
                    <span>{{ formData.performanceAmount&&formData.performanceAmount.toFixed(2) || '-' }}</span>
                </ws-descriptions-item>
                <ws-descriptions-item label="分期年限" v-if="formData.recommendType&&formData.recommendType==2">
                    <span>{{ formData.stagingYear }}</span>
                </ws-descriptions-item>
                <ws-descriptions-item label="备注">
                    <span>{{ formData.recommendRemark || '-' }}</span>
                </ws-descriptions-item>
                <ws-descriptions-item label="" v-if="formData.recommendType&&formData.recommendType==1">
                </ws-descriptions-item>
              </ws-descriptions>
            </div>
            <div v-if="this.enterQuery.type=='detail'&&this.formData.recommendType==2">
              <ws-descriptions title="绩效账期">
                  <template>
                    <ws-table-el v-bind="tableConfig" ref="table" style="width: 100%; padding: 0 !important" :header-cell-style="{ background: '#F5F7FA' }">
                      <ws-table-column-el align="center" prop="amount" label="每期金额(元)">
                        <template slot-scope="scope">{{ scope.row.amount?scope.row.amount.toFixed(2):'-' }}</template>
                      </ws-table-column-el>
                      <ws-table-column-el align="center" prop="enterTime" label="入账时间"></ws-table-column-el>
                    </ws-table-el>
                  </template>
              </ws-descriptions>
            </div>
            <div v-if="this.enterQuery.type=='detail'&&this.formData.orderType==2">
              <ws-descriptions title="退款信息">
                <ws-descriptions-item label="退款金额">
                    <span>{{ formData.refundAmount&&formData.refundAmount.toFixed(2) }}</span>
                </ws-descriptions-item>
                <ws-descriptions-item label="退款时间">
                    <span>{{ formData.refundTime }}</span>
                </ws-descriptions-item>
                <ws-descriptions-item label="备注">
                    <span>{{ formData.refundRemark || '-' }}</span>
                </ws-descriptions-item>
                <ws-descriptions-item label="操作人">
                    <span>{{ formData.operateUserName }}</span>
                </ws-descriptions-item>
                <ws-descriptions-item label="操作时间">
                    <span>{{ formData.operateTime }}</span>
                </ws-descriptions-item>
                <ws-descriptions-item label="">
                </ws-descriptions-item>
              </ws-descriptions>
            </div>
            <div v-if="this.enterQuery.type=='refund'">
              <ws-descriptions title="退款信息">
                <el-form-item label="退款金额:" prop="refundAmount">
                  <el-input v-model.number="ruleForm.refundAmount" placeholder="请输入退款金额" style="width: 400px;"></el-input>
                </el-form-item>
                <el-form-item label="退款时间:">
                    <el-form-item prop="refundTime">
                      <el-date-picker type="datetime" placeholder="请选择退款时间" v-model="ruleForm.refundTime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 400px;"></el-date-picker>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                  <el-input type="textarea" autosize placeholder="请输入备注" v-model="ruleForm.remark" maxlength="200" :autosize="{ minRows: 2, maxRows: 10}" style="width: 400px;"></el-input>
                </el-form-item>
              </ws-descriptions>
            </div>
            <div class="footer_btn">
                <el-button plain @click="back()" v-if="this.enterQuery.type=='detail'">返回</el-button>
                <el-form-item v-if="this.enterQuery.type=='refund'" class="footer_btn">
                  <el-button plain @click="back()">取消</el-button>
                  <ws-throttle>
                      <el-button type="primary" @click="submitForm('ruleForm')" v-if="powerList.refund">确定</el-button>
                  </ws-throttle>
                </el-form-item>
            </div>
          </el-form>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    components: { },
    data() {
        return {
            formData: {},
            moduleName: '/workbench/baoganManage/localLifeContractEntry',
            tableConfig: {
                filterColumns: false,
                emptyModel: true,
                indexColumn: true,
                // layout: 'flow',
                loading: true,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/workbench/baoganManage/localLifeContractEntry',
                    // url: '/localLivingContract/select',
                    op: {
                        selectList: 'PerformanceBillPage',
                    },
                    beforeQuery: () => ({ id: this.enterQuery.id })
                },
            },
            enterQuery: null,
            ruleForm: {
              refundAmount: '',
              refundTime: '',
              remark: ''
            },
            rules: {
              refundAmount: [
                { required: true, message: '请输入退款金额', trigger: 'blur' },
                { type: 'number', message: '请输入退款金额', trigger: 'blur' }
              ]
            }
        };
    },
    computed: {
        ...mapState({
            recommendedTypeFilters: state => state.baogan.recommendedTypeFilters,
            stateFilters: state => state.baogan.stateFilters
        }),
        formContentStatus() {
            return {
                detail: '详情',
                refund: '退款'
            }[this.enterQuery.type];
        },
    },
    created() {
      let { query } = this.$route;
      this.enterQuery = query;
      this.getDetail()
    },
    methods: {
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
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
                  this.formData = resData
                }
            })
        },
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (!valid) return;
            const data = {
                data: {
                  orderId: this.enterQuery.id,
                  ...this.ruleForm
                },
                op: 'refund',
            };
            const URL = this.getModuleUrl(data.op);
            this.$axios(URL, data).then(res => {
                if (res.code == 1) {
                    this.$message.success("退款成功");
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
    .title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        padding: 32px 0 16px;
        &:first-of-type {
            padding: 0;
        }
    }
}
.el-table {
    border-radius: 8px;
    border-top: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    border-bottom: none;
}
/deep/ .el-textarea .el-input__count {
    line-height: 14px;
}
</style>
