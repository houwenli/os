<template>
    <!-- 营销活动 优惠商城 -->
    <el-form class="flow_form" :inline="true" label-width="140px" :model="formData">
        <dataForm v-for="item in confingList(0, 2)" :key="item.index" :formConfig="item.formConfig" :formData="formData" :title="item.title"></dataForm>
        <activityCity :formData="formData" />
        <activityCrowd :formData="formData"/>
        <activityRule :formData="formData" :isHeader="true" />
        <activityGift :formKeys="giftKeys" :formData="formData.activityPacks" />
        <div class="data_form">
            <h2 class="flow_title">礼包图片：</h2>
            <div class="pic_box">
                <div v-for="(item, index) in imgList" :key="index">
                    <ws-image-upload :key="index" ref="imageUpload" :quantity="1" :urlList="getUrlList(item)" :inputReadyOnly="true" :isDelete="false" />
                    <div class="img_name">{{ item.name }}</div>
                </div>
            </div>
        </div>
    </el-form>
</template>

<script>
import activityCrowd from '../../../components/marketing/activityCrowd.vue';
import activityCity from '../../../components/marketing/activityCity.vue';
import activityRule from '../../../components/marketing/activityRule.vue';
import dataForm from '../../../components/dataForm.vue';
import activityGift from '../../../components/marketing/activityGift';
import { ACTIVITY_TYPE, PURCHASE_LIMIT } from '@/utils/enum';
export default {
    name: 'discount',
    components: { dataForm, activityCrowd, activityCity, activityGift, activityRule },
    props: {
        dataObject: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            PURCHASE_LIMIT,
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
                    title: '基础信息',
                    formConfig: [
                        {
                            label: '活动类型',
                            key: 'activityType',
                            nodeHandle: (item, data) => {
                                let val = data[item.key];
                                return this.getEnumVal(ACTIVITY_TYPE, val);
                            },
                        },
                        {
                            label: '活动时间',
                            key: ['activityStartDate', 'activityEndDate'],
                            nodeHandle: (item, data) => {
                                let val = item.key;
                                return data[val[0]] && data[val[1]] && `${data[val[0]]} ~ ${data[val[1]]}`;
                            },
                        },
                    ],
                },
            ],
            giftKeys: [
                {
                    key: 'activityPackName',
                    nodeHandle: (item, data, index) => {
                        let val = data[item.key];
                        let obj = {
                            label: `礼包${index + 1}名称：`,
                            val,
                        };
                        return obj;
                    },
                },
                {
                    label: '礼包数量：',
                    key: 'totalTimes',
                },
                {
                    label: '礼包售价：',
                    key: 'price',
                    nodeHandle: (item, data) => {
                        let val = data[item.key] ? data[item.key] / 100 : '--';
                        return { val: `${val} 元` };
                    },
                },
                {
                    label: '最高可抵扣金额：',
                    key: 'maxDiscountAmount',
                    nodeHandle: (item, data) => {
                        let val = data[item.key] ? data[item.key] / 100 : '--';
                        return { val: `${val} 元` };
                    },
                },
            ]
        };
    },
    computed: {
        formData() {
            // 优惠商城 只能配置一个礼包，和后端沟通，取param中的 maxDiscountAmount
            let { activityPacks, maxDiscountAmount } = this.dataObject
            if (activityPacks && activityPacks.length === 1) {
                activityPacks[0].maxDiscountAmount = maxDiscountAmount
            }
            return this.dataObject
        },

        confingList() {
            return function (start, end) {
                let config = this.$baseMethod.deepClone(this.activtyConfig);
                return config.splice(start, end);
            };
        },

        imgList() {
            let obj = this.dataObject.activityPacks && this.dataObject.activityPacks.length > 0 ? this.dataObject.activityPacks[0] : {};
            return [
                {
                    name: '礼包主图',
                    url: obj.packImageUrl,
                },
                {
                    name: '礼包详情图',
                    url: obj.packDetailImageUrl,
                },
            ];
        },
    },

    methods: {
        getUrlList(item) {
            let url = item.url;
            if (url) {
                return [url];
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../../../components/comm.scss';

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
