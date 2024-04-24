<template>
    <!-- 营销活动 优惠商城 -->
    <el-form class="flow_form" :inline="true" label-width="140px" :model="handleData">
        <dataForm v-for="item in activtyConfig" :key="item.index" :formConfig="item.formConfig" :formData="handleData"
            :title="item.title"></dataForm>
        <div class="data_form">
            <h2 class="flow_title">订金支付凭证图：</h2>
            <div class="pic_box">
                <div v-for="(item, index) in imgList" :key="index">
                    <ws-image-upload :key="index" ref="imageUpload" :quantity="1" :urlList="getUrlList(item)"
                        :inputReadyOnly="true" :isDelete="false" />
                    <div class="img_name">{{ item.name }}</div>
                </div>
            </div>
        </div>
    </el-form>
</template>

<script>
import dataForm from '@/views/workFlow/components/dataForm.vue';
export default {
    name: 'discount',
    components: { dataForm },
    props: {
        dataObject: {
            type: Object,
            default: () => { },
        },
    },
    data() {
        return {
            tableData: [],
            activtyConfig: [
                {
                    title: '审批发起信息',
                    formConfig: [
                        {
                            label: '审批编号',
                            key: 'procdefNo',
                        },
                        {
                            label: '审批类型',
                            key: 'name',
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
                    ],
                },
                {
                    title: '销售机构信息',
                    formConfig: [
                        {
                            label: '机构编码',
                            key: 'agencyNumber',
                        },
                        {
                            label: '机构名称',
                            key: 'agencyName',
                        },
                        {
                            label: '跟进实体店所属分公司',
                            key: 'agencyNameCompany',
                        },
                        {
                            label: '跟进实体店所属服务中心',
                            key: 'agencyNameServiceCenter',
                        },
                        // {
                        //     label: '所属省份',
                        //     key: 'provinceName',
                        // },
                        // {
                        //     label: '所属城市',
                        //     key: 'cityName',
                        // },
                    ],
                },
                {
                    title: '购车订单信息',
                    formConfig: [
                        {
                            label: '购车人类型',
                            key: 'mainBody',
                            nodeHandle: (item, data) => {
                                let mainBody = data[item.key];
                                return mainBody == 1 ? '个体' : '公户'
                            },
                        },
                        {
                            label: '购车人姓名',
                            key: 'purchaseUserName',
                        },
                        {
                            label: '购车人性别',
                            key: 'gender',
                            nodeHandle: (item, data) => {
                                let gender = data[item.key];
                                return gender == 1 ? '男' : '女'
                            },
                        },
                        {
                            label: '购车人手机号',
                            key: 'puchasePhone',
                        },
                        {
                            label: '车辆品牌',
                            key: 'brandName',
                        },
                        {
                            label: '车辆型号',
                            key: 'modelName',
                        },
                        {
                            label: '订金金额（元）',
                            key: 'depositAmount',
                            nodeHandle: (item, data) => {
                                let num = data[item.key];
                                return num ? this.changeYuan(num) : '0.00'
                            },
                        }
                    ],
                },
                {
                    title: '订金退款备注',
                    formConfig: [
                        {
                            label: '备注信息',
                            key: 'newRefundRemark',
                        },
                    ],
                },
            ]
        };
    },
    computed: {
        imgList() {
            let fileInfoList = this.dataObject.consultOrderInfo.orderInfo.refundImageUrl
            console.log(fileInfoList);
            return fileInfoList ? [{ name: '', imgUrl: fileInfoList }] : null
        },
        handleData() {
            let pageData = JSON.parse(JSON.stringify(this.dataObject))
            let orderInfo = pageData.consultOrderInfo.orderInfo
            return { ...orderInfo, ...pageData }
        }
    },

    methods: {
        getUrlList(item) {
            let url = item.imgUrl;
            if (url) {
                return [url];
            }
        },
        //单位转换
        changeYuan(num) {
            let str = (num / 100).toFixed(2) + '';
            let intSum = str.substring(0, str.indexOf('.')).replace(/\B(?=(?:\d{3})+$)/g, ',');
            let dot = str.substring(str.length, str.indexOf('.'));
            let ret = intSum + dot;
            return ret;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../../components/comm.scss';

.flow_form {
    padding: 0 40px;

    /deep/ .empty-table {
        min-height: 255px;
    }

    /deep/ .ws-table-warp {
        padding: 0 !important;
    }

    /deep/ .image-viewer {
        padding: 0 !important;
    }

    .pic_box {
        display: flex;
    }

    .img_name {
        font-size: 14px;
        font-weight: bold;
        color: #606266;
        line-height: 14px;
        text-align: center;
    }
}
</style>
