<template>
    <div class="__approval_field_wrap_container">
        <!-- 业务反馈工单 -->
        <div class="block_container">
            <el-form label-position="right" label-width="170px" ref="el-form">
                <div class="block_item_container">
                    <span class="block_item_title">审批发起信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="审批编号：">{{ dataObject.procdefNo }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="审批类型：">{{ dataObject.name }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="发起时间：">{{ dataObject.startTime || '' }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="发起人：">{{ dataObject.startUserName }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="所属部门：">{{ dataObject.startDeptName }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="发起人类型：">{{ dataObject.startType | sponsorTypeFilters}}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="block_item_container" v-if="orderDetailObj.orderId">
                    <span class="block_item_title">订单信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="订单编号：">{{ orderDetailObj.orderId }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="订单起点城市：">{{ orderDetailObj.startCityName }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="订单起点：">{{ orderDetailObj.startOrder }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="订单终点：">{{ orderDetailObj.endOrder }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="预估里程：">{{ $baseMethod.regRiceToKm(orderDetailObj.estimateDistance)}}公里</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="预估时长：">{{ $baseMethod.regSecondToMinute(orderDetailObj.estimateTime)}}分钟</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="乘客ID：">{{ orderDetailObj.appUserId }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="乘客手机号：">{{ orderDetailObj.appUserPhone }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="司机ID：">{{ orderDetailObj.driverId }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="司机手机号：">{{ orderDetailObj.driverPhone }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="block_item_container">
                    <span class="block_item_title">工单内容</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="24">
                            <el-form-item label="工单类型：">{{ nodeFormJson.complaintTypeName }}</el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="工单描述：">{{ nodeFormJson.complaintContent }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="block_item_container" v-if="srcList && srcList.length > 0">
                    <span class="block_item_title" v-if="srcList.some(v=>{ return v})" >工单附件</span>

                    <div class="imgList">
                        <div class="imgList_item">
                            <!-- 需判断attachmentInfoList里面每条数据的imgUrl是否存在，不存在就不展示，否则页面上是白框 -->
                            <span v-for="(img, index) in srcList" :key="index">
                                <img :src="img" width="150px" height="150px" @click="onPreview(index)" />
                                <!-- <div :class="img.opType == 2 ? 'red imgName' : 'imgName'">{{ img.name }}</div> -->
                            </span>
                        </div>
                        <ws-image-viewer :visible.sync="visible" :src-list="srcList" :currentIndex="currentIndex" />
                    </div>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import BaseInfo from './base/approvalInfo.vue';
import { mapState } from 'vuex';
export default {
    //离职审批
    name: 'errorOrderApproval',
    components: { BaseInfo },
    props: {
        nodeFormJson: {
            type: Object,
            default: () => {},
        },
        dataObject: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        ...mapState(['sponsorTypeFilters']),
        nodeForm() {
            return JSON.parse(this.dataObject.nodeFormJson).exceptionOrderProcessInfo;
        },
        srcList() {
            if(this.nodeFormJson.extraFile){
                return JSON.parse(this.nodeFormJson.extraFile)
            }else{
                return []
            }
        }
    },
    data() {
        return {
            headerStyle: {
                background: '#F5F7FA',
                'font-family': 'PingFangSC-Medium, PingFang SC',
                'font-weight': '600',
                color: '#606266',
            },
            currentIndex:1,
            orderDetailObj: {},
            visible: false
        };
    },
    mounted() {
        this.getOrderDetail()
    },
    methods: {
        onPreview(index) {
            this.visible = true;
            this.currentIndex = index;
        },
        // 查询订单详情
        getOrderDetail() {
            if(!this.nodeFormJson.orderId){
                return false;
            }
            let data={
                op:'query',
                data:{
                    id: this.nodeFormJson.orderId+''
                }
            }
            // let URL = this.$getModuleUrl(this.moduleName, data.op)
            try {
                this.$axios('/customer/order/select',data).then(res => {
                    if (res.code === 1) {
                       this.orderDetailObj=JSON.parse(res.data)
                    }
                });
            } catch (error) {
                console.log(error);
            }

        },
    }
};
</script>

<style lang="scss" scoped>
.el-table {
    border-radius: 10px;
}
.red {
    color: rgb(253, 32, 32);
}
</style>
