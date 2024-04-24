<template>
    <div class="__approval_field_wrap_container">
        <div class="block_container">
            <el-form label-position="right" label-width="160px" ref="el-form">
                <BaseInfo :dataObject="dataObject" />
                <div class="block_item_container">
                    <span class="block_item_title">申请信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="出行券名称：">{{ nodeForm.couponsName }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="App端显示名称：">{{ nodeForm.showName }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="配置数量：">{{ nodeForm.totalNumber }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="出行券类型：">{{ nodeForm.couponsType | opTypeFilter }}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if='nodeForm.couponsType==1'>
                            <el-form-item label="满减金额：">{{`满${changeYuan(nodeForm.amountLimitation*1)}减${changeYuan(nodeForm.faceValue*1)}元`}}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if='nodeForm.couponsType==3'>
                            <el-form-item label="减免金额（元）：">{{ changeYuan(nodeForm.faceValue*1) }}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if='nodeForm.couponsType==2'>
                            <el-form-item label="折扣值：">{{ `${changeYuan(nodeForm.faceValue*1)}折`  }}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if='nodeForm.couponsType==2'>
                            <el-form-item label="最高减免金额（元）：">{{ changeYuan(nodeForm.amountLimitation*1) }}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="nodeForm.advancedConfig==1 &&nodeForm.couponsPeriodType==1">
                            <el-form-item label="有效期：">{{ `领券后${nodeForm.validDay}天有效` }}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="nodeForm.advancedConfig==1 &&nodeForm.couponsPeriodType==2">
                            <el-form-item label="有效期：">{{ `${nodeForm.effectiveStartTime}至${nodeForm.effectiveEndTime}` }}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="nodeForm.advancedConfig==1">
                            <el-form-item label="可用时间段：">{{ `${nodeForm.availableStartTime}至${nodeForm.availableEndTime}` }}</el-form-item>
                        </el-col>
                        <!-- // 内容在OA 6.4版本中同步过，6.4 在11.3号上线，此内容11.8号上线，所以注释 -->
                        <el-col :span="12" v-if="nodeForm.advancedConfig == 1">
                            <el-form-item label="可用渠道：">{{ availableChannel[nodeForm.availableChannel] }}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="nodeForm.advancedConfig == 1">
                            <el-form-item label="适用城市：">{{ nodeForm.useCity |useCityFilter}}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="nodeForm.serviceId">
                            <el-form-item label="适用业务：">{{ nodeForm.serviceId }}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="nodeForm.serviceCar">
                            <el-form-item label="适用车型：">{{ nodeForm.serviceCar }}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="nodeForm.serviceOrder">
                            <el-form-item label="适用订单：">{{ nodeForm.serviceOrder }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import BaseInfo from './base/approvalInfo.vue';
export default {
    //出行卷配置
    name: 'couponConfigure',
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
        nodeForm() {
            return JSON.parse(this.dataObject.nodeFormJson);
        },
    },
    filters: {
        opTypeFilter(val) {
            if (val == 1) {
                return '满减';
            } else if (val == 2) {
                return '折扣';
            } else if (val == 3) {
                return '立减';
            }
        },
        useCityFilter(val){
            if (val == 0) {
                return '不限';
            } else if (val == 1) {
                return '活动城市可用';
            } else if (val == 2) {
                return '领券城市可用';
            }
        }
    },
    data() {
        return {
            availableChannel: {
                0: '不限',
                1: 'APP',
                2: '小程序',
            },

        };
    },
    created() {
        this.filterCar();
    },
    mounted() {
        console.log(this.nodeForm);
    },
    methods: {
        //单位转换
        changeYuan(num) {
            let str = (num / 100).toFixed(2) + '';
            let intSum = str.substring(0, str.indexOf('.')).replace(/\B(?=(?:\d{3})+$)/g, ',');
            let dot = str.substring(str.length, str.indexOf('.'));
            let ret = intSum + dot;
            return ret;
        },
        filterCar() {
            let serviceIdList = this.nodeForm.serviceId.split(','); //适用业务
            let serviceCarList = this.nodeForm.serviceCar.split(','); //适用车型
            let serviceOrderList = this.nodeForm.serviceOrder.split(','); //适用订单
            if (serviceIdList.length) {
                serviceIdList = serviceIdList.map(item => {
                    if (item == 1) {
                        return '网约车';
                    }
                    if (item == 2) {
                        return '顺风车';
                    }
                    if (item == 3) {
                        return '货运';
                    }
                    if (item == 4) {
                        return '代驾';
                    }
                });
                this.nodeForm.serviceId = serviceIdList.join(';');
            }
            if (serviceCarList.length) {
                serviceCarList = serviceCarList.map(item => {
                    if (item == 10) {
                        return '快车';
                    }
                    if (item == 20) {
                        return '专车';
                    }
                    if (item == 30) {
                        return '豪华车';
                    }
                    if (item == 40) {
                        return '商务车';
                    }
                });
                this.nodeForm.serviceCar = serviceCarList.join(';');
            }
            if (serviceOrderList.length) {
                serviceOrderList = serviceOrderList.map(item => {
                    if (item == 20) {
                        return '实时单';
                    }
                    if (item == 21) {
                        return '预约单';
                    }
                    if (item == 22) {
                        return '扫码单';
                    }
                    if (item == 70) {
                        return '包车单';
                    }
                    if (item == 40) {
                        return '拼车单';
                    }
                });
                this.nodeForm.serviceOrder = serviceOrderList.join(';');
            }
        },
    },
};
</script>

<style></style>
