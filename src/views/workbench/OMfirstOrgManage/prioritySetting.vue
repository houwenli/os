<template>
  <div class="main-container">
    <div class="center-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :disabled="pageState==='detail'" label-width="120px" class="ruleForm">
        <h3 class="title">权重配置</h3>
        <div class="list-box">
          <el-row :gutter="0">
            <el-col :span="2" class="bg-purple">
              <div>序号</div>
            </el-col>
            <el-col :span="8" class="bg-purple">
              <div>指标名称</div>
            </el-col>
            <el-col :span="8" class="bg-purple">
              <div>配置比例</div>
            </el-col>
            <el-col :span="6" class="bg-purple">
              <div>操作</div>
            </el-col>
          </el-row>
          <el-row :gutter="0" v-for="(item, i) in ruleForm.indicatorConfigVos" :key="i">
            <el-col :span="2">
              <el-form-item label="" label-width="0">
                <span>{{i+1}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="" :prop="`indicatorConfigVos.${i}.indicatorType`" label-width="0" :rules="rules.indicatorType">
                <el-select v-model="item.indicatorType" filterable clearable placeholder="请选择">
                  <el-option v-for="subItem in indicatorsNameFilters" :key="subItem.id" :label="subItem.value" :value="subItem.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="" :prop="`indicatorConfigVos.${i}.indicatorScore`" label-width="0" :rules="rules.indicatorScore">
                <el-input v-model="item.indicatorScore" placeholder="请输入整数比例" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button type="text" style="color: #0088FF" @click="addRow(i)">新增</el-button>
              <el-button type="text" style="color: #f05259" @click="deleteRow(i)" v-if="i>0">删除</el-button>
            </el-col>
          </el-row>
        </div>
        <div v-if="pageState === 'detail'">
          <h3 class="title">操作记录</h3>
          <div>
            <operation-Logs :logObj="ruleForm.operationLogVo" />
          </div>
        </div>
      </el-form>
      <div class="btn-box">
        <el-button type="primary" @click="pageState = 'edit'" v-if="pageState === 'detail'">修 改</el-button>
        <el-button @click="cancel" v-if="pageState === 'edit'">取 消</el-button>
        <el-button type="primary" @click="save" v-if="pageState === 'edit'">确 定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import operationLogs from './components/operationLogs.vue';
import { mapState } from 'vuex';
export default {
    components: {
        operationLogs,
    },
    data() {
        const numberValidator = (rule, value, callback) => {
            if (!value || !/^(100|[1-9]|[1-9][0-9])$/i.test(value)) {
                callback(new Error('请输入[1-100]的整数'));
            }
            callback();
        };
        return {
            moduleName: '/workbench/OMfirstOrgManage',
            originalTableData: [],
            pageState: 'detail',
            ruleForm: {
                indicatorConfigVos: [{ indicatorType: '', indicatorScore: '', isDelete: 0 }],
                operationLogVo: {},
            },
            rules: {
                indicatorType: [{ required: true, message: '请选择指标名称', trigger: 'change' }],
                indicatorScore: [{ trigger: 'blur', validator: numberValidator }],
            },
        };
    },
    computed: {
        ...mapState('workbench', ['indicatorsNameFilters']),
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        addRow() {
            this.ruleForm.indicatorConfigVos.push({ indicatorType: '', indicatorScore: '', isDelete: 0 });
        },
        deleteRow(i) {
            this.ruleForm.indicatorConfigVos.splice(i, 1);
        },
        getTableData() {
            let params = {
                data: {},
                op: 'indicatorConfigList',
            };
            const URL = this.getModuleUrl(params.op);
            try {
                this.$axios(URL, params).then(res => {
                    const resultData = JSON.parse(res.data);
                    this.originalTableData = JSON.parse(JSON.stringify(resultData.indicatorConfigVos)); // 储存原始数据
                    resultData.indicatorConfigVos.forEach(item => {
                        item.isDelete = 0;
                    });
                    if (resultData.indicatorConfigVos.length) {
                        this.ruleForm = resultData;
                    }
                });
            } catch (error) {
                this.$message.error(error);
            }
        },
        save() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    let dupKey = [],
                        isDup = false;
                    this.ruleForm.indicatorConfigVos.forEach(rowDate => {
                        if (dupKey.includes(rowDate.indicatorType)) {
                            isDup = true;
                        } else {
                            dupKey.push(rowDate.indicatorType);
                        }
                    });
                    if (isDup) {
                        return this.$message.error('一个指标只能被配置一次');
                    }

                    let totalCount = this.ruleForm.indicatorConfigVos.reduce((pre, cur) => {
                        return pre + Number.parseInt(cur.indicatorScore);
                    }, 0);
                    if (totalCount !== 100) {
                        return this.$message.error('各项指标之和需等于100%');
                    }
                    // 需要标识出被删除的数据
                    const currentIds = this.ruleForm.indicatorConfigVos.map(item => {
                        return item.id;
                    });
                    let deleteList = [];
                    this.originalTableData.forEach(rowData => {
                        if (!currentIds.includes(rowData.id)) {
                            rowData.isDelete = 1;
                            deleteList.push(rowData);
                        }
                    });
                    const newTableData = this.ruleForm.indicatorConfigVos.concat(deleteList);

                    const params = {
                        data: { listVo: newTableData },
                        op: 'indicatorConfigSave',
                    };
                    const URL = this.getModuleUrl(params.op);
                    try {
                        this.$axios(URL, params).then(res => {
                            const resData = JSON.parse(res.data);
                            if (resData.anwserCode.code === 1) {
                                this.$message.success('保存成功！');
                            } else {
                                this.$message.error(resData.anwserCode.message);
                            }

                            this.commonOperate();
                        });
                    } catch (error) {
                        this.$message.error(error);
                    }
                }
            });
        },
        cancel() {
            this.$refs['ruleForm'].clearValidate();
            this.commonOperate();
        },
        commonOperate() {
            this.pageState = 'detail';
            this.getTableData();
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
};
</script>
<style lang="scss" scoped>
.main-container {
    min-width: 738px;
    margin-left: 0px !important;
    display: flex;
    .center-container {
        width: 100%;
        margin-top: 8px;
        .title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 14px;
        }
        .list-box {
            border-left: 1px solid #ebeef5;
            border-top: 1px solid #ebeef5;
            margin-bottom: 24px;
            border-radius: 8px;
            .bg-purple {
                background: #f5f7fa;
            }
            /deep/.el-col {
                padding: 16px !important;
                border-right: 1px solid #ebeef5;
                border-bottom: 1px solid #ebeef5;
            }
            /deep/.el-form-item {
                margin-bottom: 0 !important;
            }
            /deep/.el-cascader {
                width: 100%;
            }
            /deep/ .el-input__inner {
                border-color: #ebeef5 !important;
            }
        }
        .btn-box {
            z-index: 999;
            position: fixed;
            bottom: 0;
            left: 80px;
            width: 100%;
            height: 64px;
            background: #ffffff;
            box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.04);
            display: flex;
            justify-content: center;
            align-items: center;
            .el-button{
                width: 160px;
            }
        }
    }
}
</style>
