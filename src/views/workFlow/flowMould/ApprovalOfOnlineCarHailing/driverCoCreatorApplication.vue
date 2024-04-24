<template>
    <div class="founderReview">
        <div class="reviewBox">
            <div class="leftBox">
                <div class="titleBox">
                    <h2 class="listTitle">司机合伙人履职承诺书</h2>
                </div>
                <div class="contentBox">
                    <div class="imgBox">
                        <el-image :src="dataObject.imageUrl" :preview-src-list="[...dataObject.imageUrl]"></el-image>
                    </div>
                </div>
            </div>
            <div class="rightBox">
                <el-form class="flow_form" :inline="true" label-width="140px" :model="handleData">
                    <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="handleData" :title="item.title"></dataForm>
                    <dataForm v-for="item in confingList(2, activtyConfig.length - 1)" :key="item.index" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
// 网约车审批-司机合伙人审批
import dataForm from '@/views/workFlow/components/dataForm.vue';
export default {
    name: 'driverCoCreatorApplication',
    components: { dataForm },
    props: {
        dataObject: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            activtyConfig: [
                {
                    title: '审批发起信息',
                    formConfig: [
                        {
                            label: '审批编号',
                            key: 'procdefNo',
                        },
                        // 前端自定义的name  因为name字段在对象中重名了
                        {
                            label: '审批类型',
                            key: 'feApprovalTypeName',
                        },
                        {
                            label: '发起时间',
                            key: 'startTime',
                        },
                        {
                            label: '发起人',
                            key: 'startUserName',
                        },
                        {
                            label: '所属部门',
                            key: 'startDeptName',
                        },
                        {
                            label: '发起人类型',
                            key: 'startType',
                            nodeHandle: (item, data) => {
                                let orgType =new Map([
                                    [1,'司机'],
                                    [2,'总部人员'],
                                    [3,'机构人员'],
                                ]);
                                return orgType.get(data.startType);
                            },
                        },
                        // {
                        //   label: '申请类型',
                        //   key: 'applyType',
                        //   nodeHandle: (item, data) => {
                        //     if (data['applyType'] !== undefined) {
                        //       return data['applyType'] === 0 ? '新申请' : '补充资料'
                        //     }

                        //     return ''
                        //   }
                        // }
                    ],
                },
                {
                    title: '司机基本信息',
                    formConfig: [
                        {
                            label: '姓名',
                            key: 'driverName',
                        },
                        {
                            label: '政治面貌',
                            key: 'politicalOutlookStr',
                        },
                        {
                            label: '证件号码',
                            key: 'idNumber',
                        },
                        {
                            label: '是否退役军人',
                            key: 'servicemenStr',
                        },
                        {
                            label: '车辆类型',
                            key: 'carTypeStr',
                        },
                        {
                            label: '合规类型',
                            key: 'complianceTypeStr',
                        },
                        {
                            label: '包干状态',
                            key: 'vipStr',
                        },
                        {
                            label: '近30天订单数',
                            key: 'thirtyDayOrders',
                            nodeHandle: (item, data) => {
                                let val = data.thirtyDayOrders;
                                if (data.thirtyDayOrders) {
                                    return `${val}单`;
                                }
                                else if (!data.thirtyDayOrders) {
                                    return '--';
                                }
                            },
                        },
                    ],
                },
            ],
        };
    },
    computed: {
        handleData() {
            let pageData = JSON.parse(JSON.stringify(this.dataObject));
            let driverName= pageData.nodeFormJson.name;
            return { ...pageData,driverName };
        },
        confingList() {
            return function (start, end) {
                let config = this.$baseMethod.deepClone(this.activtyConfig);
                return config.splice(start, end);
            };
        },
    },
};
</script>
<style lang="scss" scoped>
.founderReview {
    .reviewBox {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .leftBox {
            width: 40%;
            .imgBox {
                text-align: center;
                /deep/ .el-image__preview {
                    text-align: center;
                    width: 60% !important;
                }
            }
        }
        .rightBox {
            width: 60%;
            /deep/ .data_form {
                margin-left: 40px;
                .el-form-item__label{
                    font-weight: bold;
                }
                .form_line {
                    margin-right: 40px;
                }
            }
        }
        .titleBox {
            padding-top: 20px;
            margin-left: 40px;
        }
        .listTitle {
            height: 25px;
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            line-height: 25px;
            margin-bottom: 16px;
            padding-left: 8px;
            position: relative;
        }
        .listTitle::after {
            content: '';
            position: absolute;
            left: 0;
            top: 6px;
            width: 4px;
            height: 16px;
            background: #f05259;
            border-radius: 0px 84px 84px 0px;
        }
        .contentBox {
            margin-left: 40px;
            margin-right: 40px;
            // width: 100%;
            box-sizing: border-box;
            padding: 16px 0;
            // margin: 0 24px;
            background: #f5f7fa;
            border-radius: 8px;
            min-height: 50px;
            color: #606266;
        }
    }
}
</style>