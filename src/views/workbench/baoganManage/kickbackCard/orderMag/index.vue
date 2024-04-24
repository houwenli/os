<template>
    <div class="bg-page" :class="isFolder ? 'addWidth' : ''">
        <div class="sidebar">
            <tabs @changeWidth="changeWidth"></tabs>
        </div>
        <ws-table-el align="left" ref="table" v-bind="tableConfig" :col="8" labelWidth="96px">
            <template #search>
                <search-group>
                    <label for>业务订单号：</label>
                    <el-input v-model.trim="searchOptions.orderNum" placeholder="请输入业务订单号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>司机ID：</label>
                    <el-input v-model.trim="searchOptions.driverId" placeholder="请输入司机ID" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>手机号码：</label>
                    <el-input v-model.trim="searchOptions.driverPhone" placeholder="请输入手机号码" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>交易订单号：</label>
                    <el-input v-model.trim="searchOptions.transNum" placeholder="请输入交易订单号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>商户订单号：</label>
                    <el-input v-model.trim="searchOptions.merchantOrderNum" placeholder="请输入商户订单号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>创建时间：</label>
                    <ws-date-range
                        class="create-time"
                        :startTime.sync="searchOptions.createTimeBegin"
                        :endTime.sync="searchOptions.createTimeEnd"
                        :pickerOptions="{ disabledDate: null }"
                    ></ws-date-range>
                </search-group>
                <search-group>
                    <label for>套餐城市：</label>
                    <ws-city v-model="searchOptions.cityCode" :defaultProps="{ checkStrictly: true }" level="2"></ws-city>
                </search-group>
                <search-group>
                    <label for>支付方式：</label>
                    <el-select v-model="searchOptions.payType" placeholder="请选择" collapse-tags clearable multiple>
                        <el-option v-for="item in baoganPayTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>状态：</label>
                    <el-select v-model="searchOptions.payStatus" placeholder="请选择" collapse-tags clearable multiple>
                        <el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>支付时间：</label>
                    <ws-date-range
                        class="create-time"
                        :startTime.sync="searchOptions.payStartTime"
                        :endTime.sync="searchOptions.payEndTime"
                        :pickerOptions="{ disabledDate: null }"
                    ></ws-date-range>
                </search-group>
                <search-group>
                    <label for>退款时间：</label>
                    <ws-date-range
                        class="create-time"
                        :startTime.sync="searchOptions.refundTimeBegin"
                        :endTime.sync="searchOptions.refundTimeEnd"
                        :pickerOptions="{ disabledDate: null }"
                    ></ws-date-range>
                </search-group>
            </template>
            <template #searchBtns>
                <el-button-group v-if="powerList[op.list] || powerList[op.listDecrypt]">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn" @click="reset()" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
                <ws-throttle>
                    <el-button v-if="powerList[op.fileExport]" style="margin-left: 20px" @click="fileExport" plain :loading="exportLoading">导出</el-button>
                </ws-throttle>
            </template>
            <template>
                <ws-table-column-el prop="orderNum" label="业务单号"></ws-table-column-el>
                <ws-table-column-el prop="driverId" label="司机ID"></ws-table-column-el>
                <ws-table-column-el prop="driverName" label="司机姓名"></ws-table-column-el>
                <ws-table-column-el prop="driverPhone" label="手机号码"></ws-table-column-el>
                <ws-table-column-el prop="regionName" label="套餐城市"></ws-table-column-el>
                <ws-table-column-el prop="packageDay" label="套餐天数"></ws-table-column-el>
                <ws-table-column-el prop="platformRate" label="平台费收入(%)"></ws-table-column-el>
                <ws-table-column-el prop="orderAmount" label="订单金额(元)">
                    <template slot-scope="scope">
                        <span>{{ scope.row.orderAmount | regFenToYuan }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="payType" label="支付方式">
                    <template slot-scope="scope">
                        <span>{{ scope.row.payType | baoganPayTypeFilters }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="payStatus" label="状态">
                    <template slot-scope="scope">
                        <span>{{ formatLable(scope.row.payStatus, statusOptions) }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="createTime" label="创建时间"></ws-table-column-el>
                <ws-table-column-el label="操作" fixed="right" min-width="100">
                    <template slot-scope="scope">
                        <el-button v-if="powerList[op.detail] || powerList[op.detailDecrypt]" type="text" style="color: #0088ff" @click="handleDetail(scope.row)">详情</el-button>
                        <el-button v-if="powerList[op.refund] && scope.row.payStatus === 1" type="text" style="color: #0088ff" @click="handleRefund(scope.row)">退款</el-button>
                        <el-button v-if="powerList[op.audit] && scope.row.payStatus === 4" type="text" style="color: #0088ff" @click="handleExa(scope.row)">审核</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
        <!-- 退款、审核 -->
        <el-dialog :title="['退款申请', '退款审核'][dialogType]" :visible.sync="dialogVisible" width="450px" center :before-close="handleClose">
            <div v-loading="dialogLoading">
                <el-form :model="dialogInfo" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="业务单号：" class="item">
                        <span>{{ dialogInfo.orderId }}</span>
                    </el-form-item>
                    <el-form-item label="司机姓名：" class="item">
                        <span>{{ dialogInfo.driverName }}</span>
                    </el-form-item>
                    <el-form-item label="实付金额：" class="item">
                        <span>{{ dialogInfo.money | regFenToYuan }} 元</span>
                    </el-form-item>
                    <el-form-item label="退款金额：" class="item">
                        <span>{{ dialogInfo.remainingMoney | regFenToYuan }} 元</span>
                    </el-form-item>
                    <el-form-item label="退款天数：" class="item">
                        <span>{{ dialogInfo.remainingDay }} 天</span>
                    </el-form-item>

                    <el-form-item v-if="dialogType == 0" label="退款备注：" prop="refundNotes">
                        <el-input
                            type="textarea"
                            v-model="dialogInfo.refundNotes"
                            placeholder="备注原因,线下退款账号,最大128字"
                            show-word-limit
                            maxlength="128"
                            :autosize="{ minRows: 3, maxRows: 6 }"
                        ></el-input>
                    </el-form-item>
                    <el-form-item v-if="dialogType == 1" label="退款审核：" prop="exam">
                        <el-radio-group v-model="dialogInfo.exam">
                            <el-radio :label="1">通过</el-radio>
                            <el-radio :label="0">不通过</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="dialogType == 1" label="审核备注：" prop="examNotes">
                        <el-input type="textarea" v-model="dialogInfo.examNotes" placeholder="审核备注,最大128字" show-word-limit maxlength="128" :autosize="{ minRows: 3, maxRows: 6 }"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button v-if="isShow" type="primary" :loading="submitLoading" @click="handleSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import tabs from '../../components/tabs'
import { formatLable } from '@/utils/util.js'
export default {
    components: { tabs },
    data() {
        return {
            isFolder: false,
            searchOptions: {
                orderNum: '',
                driverId: '',
                driverPhone: '',
                merchantOrderNum: '',
                transNum: '',
                cityCode: '',
                payType: [],
                payStatus: [],
                refundTimeBegin: '',
                refundTimeEnd: '',
                createTimeBegin: this.$baseMethod.getBeforeDay(-6),
                createTimeEnd: this.$baseMethod.getBeforeDay(),
                payStartTime: '',
                payEndTime: ''
            },
            tableConfig: {
                emptyModel: true,
                indexColumn: true,
                loading: true,
                filterColumns: false,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/workbench/baoganManage/orderMag',
                    op: {
                        selectList: 'list',
                        selectCount: 'count',
                        encryptList: 'listDecrypt'
                    },
                    beforeQuery: this.beforeQuery,
                    // afterQuery:this.afterQuery,
                    immediate: true
                }
            },
            moduleName: '/workbench/baoganManage/orderMag',
            op: {
                listDecrypt: 'listDecrypt',
                list: 'list',
                detailDecrypt: 'detailDecrypt',
                detail: 'detail',
                refund: 'refund',
                refundDetail: 'refundDetail',
                audit: 'audit',
                fileExport: 'fileExport'
            },
            statusOptions: [
                // 状态 1 支付成功；3 已退款 4 审核中
                { id: 1, value: '支付成功' },
                // { id: 2, value: '退款中' },
                { id: 3, value: '已退款' },
                { id: 4, value: '审核中' }
            ],
            // 弹框
            dialogType: 0,
            dialogVisible: false,
            dialogInfo: {
                orderId: '',
                driverName: '',
                money: '',
                remainingMoney: '',
                remainingDay: '',
                /** */
                refundNotes: '',
                /** */
                exam: 1,
                examNotes: ''
            },
            dialogLoading: false,
            submitLoading: false,
            isShow: false,
            exportLoading: false,
            rules: {
                refundNotes: [{ required: true, message: '请填写退款备注', trigger: 'blur' }],
                exam: [{ required: true, message: '请选择退款审批', trigger: 'change' }],
                // examNotes: [{ required: true, message: '请填写审批备注', trigger: 'blur' }]
            }
        }
    },
    computed: {
        ...mapState({
            baoganPayTypeFilters: state => state.baogan.baoganPayTypeFilters,
        })
    },
    // activated() {
    //     this.search()
    // },

    methods: {
        beforeQuery() {
            return this.getParams()
        },
        getParams() {
            return this.searchOptions
        },
        search() {
            this.$refs.table.search()
        },
        reset() {
            this.searchOptions = {
                orderNum: '',
                driverId: '',
                driverPhone: '',
                merchantOrderNum: '',
                transNum: '',
                cityCode: '',
                payType: [],
                payStatus: [],
                refundTimeBegin: '',
                refundTimeEnd: '',
                createTimeBegin: this.$baseMethod.getBeforeDay(-6),
                createTimeEnd: this.$baseMethod.getBeforeDay(),
                payStartTime: '',
                payEndTime: ''
            }
            this.search()
        },
        handleDetail(row) {
            this.$router.push({
                name: 'orderMagDetail',
                query: { orderId: row.orderNum, isEncrypt: this.$refs.table.isEncrypt }
            })
        },
        // 退款，审核弹框
        handleRefund(row) {
            this.opDialog(0, row.orderNum)
        },
        handleExa(row) {
            this.opDialog(1, row.orderNum)
        },
        opDialog(type, orderId) {
            this.dialogType = type
            this.dialogVisible = true
            this.getRefundDetail(orderId)
        },
        // 获取退款信息
        getRefundDetail (orderId) {
            let param = {
                data: { orderId },
                op: this.op.refundDetail
            }
            const url = this.$getModuleUrl(this.moduleName, param.op)
            this.dialogLoading = true
            this.$axios(url, param).then(res => {
                this.dialogLoading = false
                this.isShow = true
                const result = JSON.parse(res.data)
                this.dialogInfo = {
                    ...result,
                    refundNotes: '',
                    /** */
                    exam: 1,
                    examNotes: ''
                }
            }).catch(() => {
                this.dialogLoading = false
                this.isShow = false
            })
        },
        // 弹框关闭
        handleClose() {
            this.$refs['ruleForm'].resetFields()
            this.dialogVisible = false
            this.isShow = false
        },
        handleSubmit() {
            this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
                this.submit()
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        submit() {
            const type = this.dialogType
            const { orderId, remainingMoney, refundNotes, exam, examNotes } = this.dialogInfo
            let data = {}
            if (type === 0) {
                data = {
                    orderId,
                    refundWay: 0,
                    amount: remainingMoney,
                    remark: refundNotes
                }
            } else {
                data = {
                    orderIds: [orderId],
                    pass: exam === 1,
                    auditRemark: examNotes
                }
            }
            let param = {
                data,
                op: this.op[['refund', 'audit'][this.dialogType]]
            }
            const url = this.$getModuleUrl(this.moduleName, param.op)
            this.submitLoading = true
            this.$axios(url, param).then(res => {
                this.submitLoading = false
                const msg = ['退款', '审核'][this.dialogType]
                this.$message.success(`${msg}操作成功！`)
                this.handleClose()
                this.search()
            }).catch(() => {
                this.submitLoading = false
            })
        },
        // 导出
        fileExport() {
            let param = {
                data: this.getParams(),
                op: this.op.fileExport
            }
            const url = this.$getModuleUrl(this.moduleName, param.op)
            this.exportLoading = true
            this.$axios(url, param).then(res => {
                this.$message.success('导出中，请稍后到文件中心下载！')
                this.exportLoading = false
            }).catch(() => {
                this.exportLoading = false
            })
        },
        changeWidth(isFolder) {
            this.isFolder = isFolder
        },
        formatLable: formatLable
    }
}
</script>

<style lang="scss" scoped>
.bg-page {
    display: flex;
    transition: 0.5s;
    .sidebar {
        flex: 1;
        margin-right: 14px;
    }
}
.bg-page /deep/ .ws-table-warp {
    border-radius: 0 0 8px 8px;
    padding: 24px !important;
    width: 89%;
}
.addWidth /deep/ .ws-table-warp {
    width: 92%;
}
/deep/ .table-column-header-button {
    padding: 10px 12px;
}
/deep/ .el-dialog__header {
    text-align: center;
}
/deep/ .el-textarea {
    width: 350px;
}

.create-time {
    /deep/.el-date-editor {
        width: 100% !important;
    }
}
.demo-ruleForm {
    /deep/ .item {
        margin-bottom: 0px;
    }
    /deep/.el-textarea {
        width: 100%;
    }
}
</style>
