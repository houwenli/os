<template>
    <!-- 代驾异常单刷单审批 -->
    <div>
        <el-form :model="dataObject">
            <dataForm v-for="(item, index) in confingList(0, 1)" :key="index + 'one'" :formConfig="item.formConfig" :formData="formData" :title="item.title"></dataForm>
            <basicsTable :tableConfig="payRecordsConfigColumns" :list="formData.payRecords" title="乘客支付记录"></basicsTable>
            <dataForm v-for="(item, index) in confingList(1, 1)" :key="index + 'two'" :formConfig="item.formConfig" :formData="formData" :title="item.title"></dataForm>
            <basicsTable :tableConfig="riskControlInformationConfigColumns" :list="formData.hitRuleList" title="风控信息"></basicsTable>
            <dataForm v-for="(item, index) in confingList(2, activtyConfig.length - 1)" :key="index + 'three'" :formConfig="item.formConfig" :formData="formData" :title="item.title"></dataForm>
        </el-form>
    </div>
</template>

<script>
import dataForm from '../../components/dataForm.vue'
import basicsTable from '../../components/agentDriving/basicsTable.vue'
export default {
    name: 'abnormalSingleBrush',
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
                    prop: 'outTradeNo'
                },
                {
                    label: '交易订单号',
                    prop: 'tradeNo'
                },
                {
                    type: 'money',
                    label: '第三方支付金额(元)',
                    prop: 'thirdOrderPrice'
                },
                {
                    type: 'money',
                    label: '余额支付金额(元)',
                    prop: 'balancePayMoney'
                }
            ],
            riskControlInformationConfigColumns: [
                {
                    label: '命中指标',
                    prop: 'hitTarget'
                },
                {
                    label: '单位',
                    prop: 'unit'
                },
                {
                    label: '规则',
                    prop: 'rule'
                },
                {
                    label: '规则值',
                    prop: 'ruleValue'
                },
                {
                    label: '触发订单数',
                    prop: 'triggerCount'
                },
                {
                    label: '实际值',
                    prop: 'actualValue'
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
                    title: '基本信息',
                    formConfig: [
                        {
                            label: '司机手机号',
                            key: 'phone'
                        },
                        {
                            label: '司机ID',
                            key: 'driverId'
                        },
                        {
                            label: '事件编号',
                            key: 'eId'
                        },
                        {
                            label: '订单号',
                            key: 'orderId'
                        },
                        {
                            label: '命中时间',
                            key: 'hitIndexTime'
                        }
                    ]
                },
                {
                    title: '支付异常信息',
                    formConfig: [
                        {
                            label: '订单状态',
                            key: 'payStatus'
                        },
                        {
                            label: '异常类型',
                            key: 'status'
                        },
                        {
                            label: '订单金额(元)',
                            key: 'orderMoney',
                            nodeHandle: (item, data) => {
                                return data.orderMoney ? (data.orderMoney / 100).toFixed(2) : 0
                            }
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
                            label: '应付金额(元)',
                            key: 'passengerShouldPayMoney',
                            nodeHandle: (item, data) => {
                                return data.passengerShouldPayMoney ? (data.passengerShouldPayMoney / 100).toFixed(2) : 0
                            }
                        },
                        {
                            label: '支付方式',
                            key: 'payType'
                        },
                        {
                            label: '用户支付总金额(元)',
                            key: 'realMoney',
                            nodeHandle: (item, data) => {
                                return data.realMoney ? (data.realMoney / 100).toFixed(2) : 0
                            }
                        },
                        {
                            label: '余额支付金额(元)',
                            key: 'balancePayMoney',
                            nodeHandle: (item, data) => {
                                return data.balancePayMoney ? (data.balancePayMoney / 100).toFixed(2) : 0
                            }
                        },
                        {
                            label: '第三方支付金额(元)',
                            key: 'thirdPayMoney',
                            nodeHandle: (item, data) => {
                                return data.thirdPayMoney ? (data.thirdPayMoney / 100).toFixed(2) : 0
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
                            key: 'diffMoney',
                            nodeHandle: (item, data) => {
                                return data.diffMoney ? (data.diffMoney / 100).toFixed(2) : 0
                            }
                        },
                        {
                            label: '为司机入账金额(元)',
                            key: 'giveDriverMoney',
                            nodeHandle: (item, data) => {
                                return data.giveDriverMoney ? (data.giveDriverMoney / 100).toFixed(2) : 0
                            }
                        }
                    ]
                }
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
.el-form {
    margin: 0px 40px;
}
</style>
