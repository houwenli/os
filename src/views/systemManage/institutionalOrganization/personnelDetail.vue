<template>
    <div v-loading="loading" class="bigbox">
        <div class="title">人员详情</div>
        <div class="header">
            <div class="headerTitle">基础信息</div>
            <el-form ref="form" :model="form" label-width="90px" :rules="rules" :disabled="disabledFlag">
                <el-row type="flex" justify="space-between">
                    <el-col :span="10">
                        <el-form-item label="人员姓名:" prop="name">
                            <el-input v-model.trim="form.name" :placeholder="placeholder.name" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="手机号码:" prop="phone">
                            <el-input v-model.trim="form.phone" :placeholder="placeholder.phone" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row type="flex" justify="space-between">
                    <el-col :span="10">
                        <el-form-item label="工号:">
                            <el-input v-model.trim="form.code" :placeholder="placeholder.code" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="入职日期:" prop="entryDate">
                            <el-date-picker v-model="form.entryDate" style="width: 100%" type="date" value-format="yyyy-MM-dd" :placeholder="placeholder.entryDate" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <div class="middle">
            <div class="middleTitle">
                <div class="text">部门及职务</div>
            </div>
            <div class="tableContent">
                <el-table :data="tableData" style="width: 100%" :border="true" :header-cell-style="{
                        background: '#F5F7FA',
                        'font-family': 'PingFangSC-Medium, PingFang SC',
                        'font-weight': '600',
                        color: '#606266',
                    }">
                    <el-table-column label="部门名称">
                        <template slot-scope="scope">
                            <span>
                                {{ scope.row.deptName}}
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column label="职务">
                        <template slot-scope="scope">
                            <span>
                                {{ scope.row.positName }}
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column label="是否兼任">
                        <template slot-scope="scope">
                            <span :class="scope.row.partTime==2?'zhuzhi':'jianren'">
                                {{ scope.row.partTime | positionTime }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="footer">
            <div class="footerTittle">修改记录</div>
            <div style="display: flex; justify-content: center">
                <update-list :table-data="createEmploy" :table-style="{ width: '100%', marginRight: '16px' }" />
                <update-list :table-data="updateEmploy" :table-style="{ width: '100%' }" />
            </div>
        </div>
    </div>
</template>

<script>
import updateList from '../../../components/TableList';
export default {
    name: 'personnelDetail',
    components: { updateList },
    filters: {
        positionTime(val) {
            if (val === 1) {
                return '兼任';
            } else if (val === 2) {
                return '主职';
            } else {
                return ' ';
            }
        },
    },
    props: {
        personnelId: '',
    },
    data() {
        // 手机号正则验证
        const phoneRule = (rule, value, callback) => {
            const regExp = this.$regexList.get('mobile');
            if (regExp.test(value) === false) {
                callback(new Error('手机号格式错误'));
            } else {
                callback();
            }
        };
        return {
            disabledFlag: true, // 是否禁用表单
            loading: false,
            form: {
                code: '',
                entryDate: '',
                phone: '',
                name: '',
            },
            departmentOption: [],
            // 总部职位option
            postOption: [
                {
                    name: '',
                    id: '',
                },
            ],
            // 分支机构职位option
            branchOption: [],
            allBranchOption: [],
            // table数据
            tableData: [],
            // 创建人
            createEmploy: [
                { label: '创建人', value: '' },
                { label: '创建时间', value: '' },
            ],
            updateEmploy: [
                { label: '修改人', value: '' },
                { label: '修改时间', value: '' },
            ],
            // 表单验证规则
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入人员姓名',
                        trigger: 'blur',
                    },
                ],
                phone: [
                    {
                        required: true,
                        message: '请输入手机号码',
                        trigger: 'blur',
                    },
                    { validator: phoneRule, trigger: 'blur' },
                ],
            },
            newloading: false,
            moduleName: '/systemManage/institutionalOrganization',
            saveLoading: false,
            editData: {
                deptIds: [],
                positionId: [],
                partTime: '',
            },
            edit: {},
            positName: '',
        };
    },
    computed: {
        placeholder() {
            let list;
            this.disabledFlag && (list = {});
            !this.disabledFlag &&
                (list = {
                    name: '请输入人员姓名',
                    phone: '请输入手机号码',
                    code: '请输入工号',
                    entryDate: '当前日期',
                });
            return list;
        },
    },
    watch: {
        personnelId: {
            handler: function (val) {
                this.queryIdInfo();
                this.disabledFlag = true;
            },
            immediate: true,
        },
    },
    methods: {
        // 根据个人ID查询个人信息
        async queryIdInfo() {
            const vm = this;
            if (!vm.personnelId) return;
            const param = {
                data: JSON.stringify({ id: vm.personnelId }),
                op: 'selectOrganizationalEmploy',
            };
            vm.loading = true;
            const res = await this.$axios(this.getModuleUrl(param.op), param);
            vm.loading = false;

            if (res.code == 1) {
                const detailData = JSON.parse(res.data);
                console.log(detailData);
                this.$nextTick(() => {
                    vm.form = detailData;
                    vm.tableData = detailData.udpList.map(item => {
                        return {
                            deptId: item.deptId || [],
                            positionId: item.positionId || '',
                            partTime: item.partTime || '',
                            positName: item.positName,
                            depType: item.depType,
                            deptName: item.deptName,
                            isEdit: false,
                        };
                    });
                    vm.createEmploy[0].value = (detailData.createUser || {}).name;
                    vm.createEmploy[1].value = detailData.createTime;
                    vm.updateEmploy[0].value = (detailData.updateUser || {}).name;
                    vm.updateEmploy[1].value = detailData.updateTime;
                    vm.loading = false;
                });
            }
        },

        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
};
</script>

<style lang="scss" scoped>
.bigbox {
    padding: 25px;
    width: 100%;
    height: 100%;
    overflow: auto;
    .title {
        height: 28px;
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #303133;
        line-height: 28px;
    }
    .header {
        .headerTitle {
            margin-bottom: 15px;
            height: 25px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 600;
            color: #303133;
            line-height: 25px;
            margin-top: 20px;
        }
    }
    .middle {
        margin-top: 12px;
        .middleTitle {
            width: 100%;
            height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            .text {
                height: 25px;
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 600;
                color: #303133;
                line-height: 25px;
            }
            .addButton {
                border: 1px solid #f05259;
                border-radius: 4px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #f05259;
            }
        }
    }
    .footer {
        width: 100%;
        margin-top: 40px;
        .footerTittle {
            margin-bottom: 15px;
            height: 25px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 600;
            color: #303133;
            line-height: 25px;
            margin-top: 20px;
        }
    }
    .saveButon {
        width: 100%;
        height: 50px;
        text-align: center;
        margin-top: 45px;
        .buttons {
            width: 160px;
            height: 40px;
        }
    }

    /deep/ .el-form-item__label {
        width: 135px !important;
    }

    /deep/ .el-form-item__content {
        margin-left: 135px !important;
    }
}
.zhuzhi {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #e6a23c;
    padding: 0 4px;
    background: #fdf6ec;
    border-radius: 4px;
}
.jianren {
    padding: 0 4px;
}
</style>
