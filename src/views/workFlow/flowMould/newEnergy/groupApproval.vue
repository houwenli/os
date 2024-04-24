<template>
    <!-- 营销活动 优惠商城 -->

    <el-form class="flow_form" :inline="true" label-width="140px" :model="handleData">
        <dataForm v-for="item in activtyConfig" :key="item.index" :formConfig="item.formConfig" :formData="handleData" :title="item.title"></dataForm>
        <div class="data_form">
            <h2 class="flow_title">图片信息：</h2>
            <div class="img-list">
                <div class="img-box" v-for="(item, index) in identityImgList" :key="item.imgUrl">
                    <div>
                        <img :src="item.imgUrl" @click="onPreview(index, 'identity')" />
                        <span class="img-name">{{ item.name }}</span>
                    </div>
                    <div class="invoice-info">
                        <div>
                            <span>发票代码：</span>
                            <span>{{ item.invoiceCode || '--' }}</span>
                        </div>
                        <div>
                            <span>发票号：</span>
                            <span>{{ item.invoiceNo || '--' }}</span>
                        </div>
                        <div>
                            <span>价税合计：</span>
                            <span>{{ item.totalAmount | propsFilters('regFenToYuan') }}</span>
                        </div>
                    </div>
                </div>
                <!-- 无图展示 -->
                <div class="no-img" v-if="identityImgList.length == 0">暂无附件</div>
            </div>

            <ws-image-viewer :visible.sync="identityVisible" :src-list="identityList" :currentIndex="currentIndex" />
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
            default: () => {},
        },
    },
    data() {
        return {
            currentIndex: 0,
            identityVisible: false,
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
                            nodeHandle: (item, data) => {
                                return '团购订单审批';
                            },
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
                    title: '销售信息',
                    formConfig: [
                        {
                            label: '订单编号',
                            key: 'orderNo',
                        },
                        {
                            label: '跟进实体店',
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
                        {
                            label: '跟进实体店ID',
                            key: 'idNumber',
                        },
                        {
                            label: '价税合计总和',
                            key: 'orderCarPrice',
                            nodeHandle: (item, data) => {
                                let num = data[item.key];
                                return num ? this.changeYuan(num) : '0.00';
                            },
                        },
                        {
                            label: '推荐司机姓名',
                            key: 'driverName',
                        },
                        {
                            label: '推荐司机手机号',
                            key: 'driverPhone',
                        },
                    ],
                },
            ],
        };
    },
    computed: {
        identityImgList() {
            return this.dataObject.grouponOrderInfo.invoiceList;
        },
        identityList() {
            return this.dataObject.grouponOrderInfo.invoiceList.map(item => item.imgUrl);
        },
        handleData() {
            let pageData = JSON.parse(JSON.stringify(this.dataObject));

            let orderInfo = pageData.grouponOrderInfo;
            return { ...orderInfo, ...pageData };
        },
    },

    methods: {
        onPreview(index, type) {
            switch (type) {
                case 'identity':
                    this.identityVisible = true;
                    break;
            }
            this.currentIndex = index;
        },
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
    .img-list {
        display: flex;
        width: 100%;

        // justify-content: left;
        flex-wrap: wrap;
        justify-content: space-between;
        .img-box {
            // width: 150px;
            // height: 182px;

            display: flex;
            width: calc(50% - 8px);
            padding: 20px 24px;
            margin-bottom: 16px;
            box-sizing: border-box;
            cursor: pointer;
            object-fit: cover;
            background: #f5f7fa;
            border-radius: 8px;
            img {
                width: auto;
                height: 115px;
            }
            > div {
                display: flex;
                flex-direction: column;
                span.img-name {
                    text-align: center;
                    display: inline-block;
                    width: 150px;
                    padding-top: 16px;
                    color: #606266;
                }
                // margin-right: 24px;
            }
            .invoice-info {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 115px;
                span:nth-of-type(1) {
                    text-align: right;
                    display: inline-block;
                    width: 102px;
                    color: #606266;
                    color: #606266;
                }
                span:nth-of-type(2) {
                    flex: 1;
                    color: #606266;
                }
            }
        }
        .img-box:nth-of-type(even) {
            margin-left: 16px;
        }
    }
}
</style>
