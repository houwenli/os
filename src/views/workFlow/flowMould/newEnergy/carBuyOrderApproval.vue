<template>
    <!-- 营销活动 优惠商城 -->
    <el-form class="flow_form" :inline="true" label-width="140px" :model="handleData">
        <dataForm v-for="item in activtyConfig" :key="item.index" :formConfig="item.formConfig" :formData="handleData"
            :title="item.title"></dataForm>
        <div class="data_form">
            <h2 class="flow_title">图片信息：</h2>
            <div class="pic_box">
                <div class="pic_box_img" v-for="(item, index) in imgList" :key="index">
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
                            key: 'followAgencyNumber',
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
                    title: '购车司机信息',
                    formConfig: [
                        {
                            label: '司机姓名',
                            key: 'driverName',
                        },
                        {
                            label: '司机ID',
                            key: 'driverId',
                        },
                        {
                            label: '手机号码',
                            key: 'driverPhone',
                        },
                        {
                            label: '所属机构',
                            key: 'driverAgencyName',
                        },
                        {
                            label: '入网状态',
                            key: 'bindStatus',
                            nodeHandle: (item, data) => {
                                let bindStatus = data[item.key];
                                return bindStatus == 0 ? '未入网' : '已入网'
                            },
                        },
                    ],
                },
                {
                    title: '购车人身份信息',
                    formConfig: [
                        {
                            label: '购车人类型',
                            key: 'mainBody',
                            nodeHandle: (item, data) => {
                                let mainBody = data[item.key];
                                return mainBody == 0 ? '个体' : '公户'
                            },
                        },
                        {
                            label: '身份证姓名',
                            key: 'purchaseUserName',
                        },
                        {
                            label: '身份证号码',
                            key: 'puchaseIdCard',
                        },
                        {
                            label: '购车人手机号',
                            key: 'puchasePhone',
                        },
                    ],
                },
                {
                    title: '新能源车辆信息',
                    formConfig: [
                        {
                            label: '车辆品牌',
                            key: 'brandName',
                        },
                        {
                            label: '车辆型号',
                            key: 'modelName',
                        },
                        {
                            label: '车架号',
                            key: 'vehicleNo',
                        },
                        {
                            label: '购车发票号',
                            key: 'invoiceNo',
                        },
                        {
                            label: '销售价格（元）',
                            key: 'purchasePrice',
                            nodeHandle: (item, data) => {
                                let num = data[item.key];
                                return num ? this.changeYuan(num) : '0.00'
                            },
                        },
                        {
                            label: '订金金额（元）',
                            key: 'depositAmount',
                            nodeHandle: (item, data) => {
                                let num = data[item.key];
                                return num ? this.changeYuan(num) : '0.00'
                            },
                        },
                        {
                            label: '尾款金额（元）',
                            key: 'finalPaymentAmount',
                            nodeHandle: (item, data) => {
                                let num = data[item.key];
                                return num ? this.changeYuan(num) : '0.00'
                            },
                        },
                    ],
                },
            ]
        };
    },
    computed: {
        imgList() {
            let fileInfoList = this.dataObject.enterOrderInfo.orderInfo.fileInfoList

            //筛选身份证图片数组并排序
            let idcardList = fileInfoList.filter((item) => item.type == 5) //身份证
            let vehicleList = fileInfoList.filter((item) => item.type == 1) //行驶证
            let business = fileInfoList.filter((item) => item.type == 12) //营业执照
            let situation = fileInfoList.filter((item) => item.type == 13) //情况说明
            this.identityImgList = idcardList.concat(vehicleList, business,situation)
            //筛选支付图片数组并排序
            this.payImgList = fileInfoList.filter((item) => item.type == 11)
            //筛选文件图片数组并排序
            let List1 = fileInfoList.filter((item) => item.type == 6)
            let List2 = fileInfoList.filter((item) => item.type == 7)
            let List3 = fileInfoList.filter((item) => item.type == 2)
            let List4 = fileInfoList.filter((item) => item.type == 8)
            let List5 = fileInfoList.filter((item) => item.type == 3)
            let List6 = fileInfoList.filter((item) => item.type == 4)
            let List7 = fileInfoList.filter((item) => item.type == 9)
            let List8 = fileInfoList.filter((item) => item.type == 10)
            this.fileImgList = List1.concat(List2, List3, List4, List5, List6, List7, List8)
            //设置展示文字
            this.identityImgList = this.identityImgList.map((item) => {
                if (item.type == 5 && item.sort == 1) {
                    item.name = '身份证人像图'
                } else if (item.type == 5 && item.sort == 2) {
                    item.name = '身份证国徽图'
                } else if (item.type == 1 && item.sort == 1) {
                    item.name = '行驶证主页图'
                } else if (item.type == 1 && item.sort == 2) {
                    item.name = '行驶证副页图'
                } else if (item.type == 12) {
                    item.name = '营业执照副本'
                } else if (item.type == 13){
                    item.name = '情况说明'
                }
                return item
            })
            this.payImgList = this.payImgList.map((item) => {
                if (item.type == 11 && item.sort == 1) {
                    item.name = '订金支付凭证'
                } else if (item.type == 11 && item.sort == 2) {
                    item.name = '尾款支付凭证'
                }
                return item
            })
            this.fileImgList = this.fileImgList.map((item) => {
                if (item.type == 6) {
                    item.name = '发票'
                } else if (item.type == 7) {
                    item.name = '合格证'
                } else if (item.type == 2 && item.sort == 1) {
                    item.name = '合同1'
                } else if (item.type == 2 && item.sort == 2) {
                    item.name = '合同2'
                } else if (item.type == 2 && item.sort == 3) {
                    item.name = '合同3'
                } else if (item.type == 8) {
                    item.name = '交车单'
                } else if (item.type == 3) {
                    item.name = '交强险'
                } else if (item.type == 4) {
                    item.name = '商业险'
                } else if (item.type == 9) {
                    item.name = '人车合影'
                } else if (item.type == 10) {
                    item.name = '营运证'
                }
                return item
            })
            // const identityList = this.identityImgList.map((item) => item.imgUrl)
            // const payList = this.payImgList.map((item) => item.imgUrl)
            // const fileList = this.fileImgList.map((item) => item.imgUrl)
            // console.log([...identityList, ...payList, ...fileList]);

            return [...this.identityImgList, ...this.payImgList, ...this.fileImgList]
        },
        handleData() {
            let pageData = JSON.parse(JSON.stringify(this.dataObject))
            let orderInfo = pageData.enterOrderInfo.orderInfo
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
        flex-wrap: wrap;

        .pic_box_img {
            margin-bottom: 10px;
        }
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
