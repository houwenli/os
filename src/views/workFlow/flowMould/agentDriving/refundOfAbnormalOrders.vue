<template>
    <!-- 代驾异常订单退款申请 -->
    <div>
        <el-form :model="dataObject" lable-wid>
            <dataForm v-for="(item, index) in confingList(0, 1)" :key="index + 'one'" :formConfig="item.formConfig" :formData="formData" :title="item.title"></dataForm>
            <basicsTable :tableConfig="payRecordsConfigColumns" :list="formData.payRecords" title="第三方支付记录"></basicsTable>
            <dataForm v-for="(item, index) in confingList(1, activtyConfig.length - 1)" :key="index + 'two'" :formConfig="item.formConfig" :formData="formData" :title="item.title"></dataForm>
        </el-form>
    </div>
</template>

<script>
import dataForm from '../../components/dataForm.vue'
import basicsTable from '../../components/agentDriving/basicsTable.vue'
export default {
    name: 'refundOfAbnormalOrders',
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
        console.log(this.formData, '审批详情')
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
                    type: 'money',
                    label: '第三方支付金额（元）',
                    prop: 'thirdOrderPrice'
                },
                {
                    type: 'money',
                    label: '余额支付金额（元）',
                    prop: 'balancePayMoney'
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
                            label: '优惠金额(元)',
                            key: 'discountMoney',
                            nodeHandle: (item, data) => {
                                return data.discountMoney ? (data.discountMoney / 100).toFixed(2) : 0
                            }
                        },
                        {
                            label: '减免金额(元)',
                            key: 'deductionAmount',
                            nodeHandle: (item, data) => {
                                return data.deductionAmount ? (data.deductionAmount / 100).toFixed(2) : 0
                            }
                        },
                        {
                            label: '乘客应付金额(元)',
                            key: 'passengerShouldPayMoney',
                            nodeHandle: (item, data) => {
                                return data.passengerShouldPayMoney ? (data.passengerShouldPayMoney / 100).toFixed(2) : 0
                            }
                        },
                        {
                            label: '乘客实付总金额(元)',
                            key: 'realMoney',
                            nodeHandle: (item, data) => {
                                return data.realMoney ? (data.realMoney / 100).toFixed(2) : 0
                            }
                        },
                        {
                            label: '支付方式',
                            key: 'payType'
                        },
                        {
                            label: '第三方支付金额(元)',
                            key: 'thirdPayMoney',
                            nodeHandle: (item, data) => {
                                return data.thirdPayMoney ? (data.thirdPayMoney / 100).toFixed(2) : 0
                            }
                        },
                        {
                            label: '对账差异金额(元)',
                            key: 'statementDiffMoney',
                            nodeHandle: (item, data) => {
                                return data.statementDiffMoney ? (data.statementDiffMoney / 100).toFixed(2) : 0
                            }
                        },
                        {
                            label: '司机应入账金额(元)',
                            key: 'driverShouldGetMoney',
                            nodeHandle: (item, data) => {
                                return data.driverShouldGetMoney ? (data.driverShouldGetMoney / 100).toFixed(2) : 0
                            }
                        },
                        {
                            label: '司机实际入账金额(元)',
                            key: 'driverRealityGetMoney',
                            nodeHandle: (item, data) => {
                                return data.driverRealityGetMoney ? (data.driverRealityGetMoney / 100).toFixed(2) : 0
                            }
                        },
                        {
                            label: '平台佣金(元)',
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
                            key: 'diffMoney',
                            nodeHandle: (item, data) => {
                                return data.diffMoney ? (data.diffMoney / 100).toFixed(2) : 0
                            }
                        },
                        {
                            label: '司机扣除金额（元）',
                            key: 'deductMoney',
                            nodeHandle: (item, data) => {
                                return data.deductMoney ? (data.deductMoney / 100).toFixed(2) : 0
                            }
                        }
                    ]
                }
            ]
        }
    },
    methods: {}
}
</script>

<style lang="scss" scoped>
.el-form {
    margin: 0px 40px;
}
</style>
