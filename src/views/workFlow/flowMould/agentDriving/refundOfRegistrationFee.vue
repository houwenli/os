<template>
    <!-- 代驾报名费退款申请 -->
    <div>
        <el-form :model="dataObject" lable-wid>
            <dataForm v-for="(item, index) in confingList(0, 1)" :key="index + 'one'" :formConfig="item.formConfig" :formData="formData" :title="item.title"></dataForm>
            <basicsTable :tableConfig="payRecordsConfigColumns" :list="formData.payRecords" title="乘客支付记录"></basicsTable>
            <dataForm v-for="(item, index) in confingList(1, activtyConfig.length - 1)" :key="index + 'two'" :formConfig="item.formConfig" :formData="formData" :title="item.title"></dataForm>
        </el-form>
    </div>
</template>

<script>
import dataForm from '../../components/dataForm.vue'
import basicsTable from '../../components/agentDriving/basicsTable.vue'
export default {
    name: 'refundOfRegistrationFee',
    components: { dataForm, basicsTable },
    props: {
        dataObject: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        confingList() {
            return function (start, end) {
                let config = this.$baseMethod.deepClone(this.activtyConfig)
                return config.splice(start, end)
            }
        }
    },
    created() {
        this.setSumPric()
    },
    data() {
        return {
            formData: { ...this.dataObject, ...this.dataObject.nodeFormJson.valetOrderInfo },
            payRecordsConfigColumns: [
                {
                    label: '支付时间',
                    prop: 'payTime'
                },
                {
                    label: '商户订单号',
                    prop: 'paySerialNum'
                },
                {
                    label: '交易订单号',
                    prop: 'outTradeNo'
                },
                {
                    label: '支付金额',
                    prop: 'sumPric',
                    type: 'money'
                }
            ],
            activtyConfig: [
                {
                    title: '审批发起信息',
                    formConfig: [
                        {
                            label: '审批编号',
                            key: 'procdefNo'
                        },
                        {
                            label: '审批类型',
                            key: 'name'
                        },
                        {
                            label: '发起时间',
                            key: 'startTime'
                        },
                        {
                            label: '发起人',
                            key: 'startUserName'
                        },
                        {
                            label: '所属部门',
                            key: 'startDeptName'
                        }
                    ]
                },
                {
                    title: '支付异常信息',
                    formConfig: [
                        {
                            label: '异常类型',
                            key: 'status'
                        },
                        {
                            label: '订单状态',
                            key: 'payStatus'
                        },
                        {
                            label: '订单金额(元)',
                            key: 'orderMoney',
                            nodeHandle: (item, data) => {
                                return data.orderMoney ? (data.orderMoney / 100).toFixed(2) : 0
                            }
                        },
                        {
                            label: '支付方式',
                            key: 'payType'
                        },
                        {
                            label: '支付金额(元)',
                            key: 'realMoney',
                            nodeHandle: (item, data) => {
                                return data.realMoney ? (data.realMoney / 100).toFixed(2) : 0
                            }
                        },
                        {
                            label: '平台所得(元)',
                            key: 'msgServiceFee',
                            nodeHandle: (item, data) => {
                                return data.msgServiceFee ? (data.msgServiceFee / 100).toFixed(2) : 0
                            }
                        }
                    ]
                },
                {
                    title: '处理结果',
                    formConfig: [
                        {
                            label: '处理方式',
                            key: 'processType'
                        },
                        {
                            label: '退款金额(元)',
                            key: 'realMoney',
                            nodeHandle: (item, data) => {
                                return data.realMoney ? (data.realMoney / 100).toFixed(2) : 0
                            }
                        }
                    ]
                }
            ]
        }
    },
    methods: {
        setSumPric() {
            let sumPric = null
            this.formData.payRecords.forEach(item => {
                item.thirdOrderPrice = item.thirdOrderPrice === null ? 0 : item.thirdOrderPrice
                item.balancePayMoney = item.balancePayMoney === null ? 0 : item.balancePayMoney
                // 乘客支付记录中支付金额字段取thirdOrderPrice+balancePayMoney的和前端自定义sumPric字段显示
                sumPric = item.balancePayMoney + item.thirdOrderPrice
                this.$set(item, 'sumPric', sumPric)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.el-form {
    margin: 0px 40px;
}
</style>
