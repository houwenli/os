<template>
    <div class="taskFlowlist">
        <div class="form-content-wrap">
            <ws-descriptions title="订单信息">
                <ws-descriptions-item v-for="(item) in fileds1" :key="item.label" :label="item.label">{{ formData[item.filed] }}</ws-descriptions-item>
                <ws-descriptions-item v-for="(item, index) in formData.passengerPhones" :key="item" :label="`乘客手机号${index+1}`">{{ item||'-' }}</ws-descriptions-item>
                <ws-descriptions-item v-for="(item, index) in formData.realPassengerPhones" :key="item" :label="`实际乘客手机号${index+1}`">{{ item }}</ws-descriptions-item>
                <ws-descriptions-item v-for="(item) in fileds2" :key="item.label" :label="item.label">{{ formData[item.filed] }}</ws-descriptions-item>
                <ws-descriptions-item label="预估里程">{{(Math.round((formData.estimateDistance / 1000) * 100) / 100).toFixed(2) || 0 }}km</ws-descriptions-item>
                <ws-descriptions-item label="预估时长">{{ Math.round(formData.estimateTime / 60) || 0 }}分钟</ws-descriptions-item>
            </ws-descriptions>
            <!-- 录音录像2023-4-25之后上 -->
            <ws-descriptions title="行程录音和录像" v-if="!!$route.query.orderId">
                <VideoPlayer ref="videoPlayer" :orderId="$route.query.orderId" :status="this.formData.orderStatus"/>
            </ws-descriptions>
        </div>
        <ws-footer>
            <el-button @click="onBack">返回</el-button>
        </ws-footer>
    </div>
</template>

<script>
import VideoPlayer from '@/components/videoPlayer'
export default {
    name: 'sosDetail',
    components: {
        VideoPlayer
    },
    data() {
        return {
            fileds1: [
                { label: '订单号', filed: 'orderId' },
                { label: '订单服务类型', filed: 'requestRideType' },
                { label: '下单时间', filed: 'downOrderTime' },
                { label: '订单状态', filed: 'orderStatusStr' }
            ],
            fileds2: [
                { label: '司机ID', filed: 'driverId' },
                { label: '司机手机号', filed: 'driverPhone' },
                { label: '司机姓名', filed: 'driverName' },
                { label: '车牌号码', filed: 'carNum' },
                { label: '系统人证', filed: 'innerDriverCertState' },
                { label: '系统车证', filed: 'innerCarCertState' },
                { label: '所属机构', filed: 'organization' },
                { label: '订单起点', filed: 'startOrder' },
                { label: '订单起点城市', filed: 'startCityName' },
                { label: '订单终点', filed: 'endOrder' }
            ],
            formData:{}
        }
    },
    created() {
        this.getDeatailData()
    },
    methods: {
        //获取数据
        getDeatailData() {
            this.$axios('/sos/select', {
                op: 'order',
                data: { type: this.$route.query.type, orderId: this.$route.query.orderId }
            }).then(res => {
                if (res.code == 1) {
                    let result = JSON.parse(res.data)
                    console.log(result)
                    this.formData = result
                }
            })
        },
        onBack() {
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="scss" scoped>
.taskFlowlist {
    width: 100%;
    height: 100%;

    // overflow: auto;
    .form-content-wrap {
        width: 100%;
        min-height: calc(100% - 64px);
        background: #ffffff;
        margin-bottom: 64px;
        padding: 32px 40px;
        border-radius: 8px;

        .header {
            width: 80px;
            height: 28px;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #303133;
            line-height: 28px;
        }

        .formAll {
            margin-top: 24px;

            .el-select__tags {
                height: 30px;
                overflow-y: auto;
            }
        }

        .middle {
            width: 100%;
            height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            margin-top: 14px;

            .middleTitle {
                height: 28px;
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 600;
                color: #303133;
                line-height: 28px;
            }
        }

        .footer {
            width: 100%;
            margin-top: 40px;

            .footerTittle {
                height: 28px;
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 600;
                color: #303133;
                line-height: 28px;
                margin-bottom: 25px;
            }
        }

        .saveButon {
            position: fixed;
            bottom: 0;
            left: 0;
            width: calc(100% + 166px);
            height: 64px;
            background: #ffffff;
            box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.04);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999;
        }
    }

    .buttons {
        width: 160px;
        height: 40px;
    }
}

.mailTable {
    border-radius: 4px;
    border-collapse: collapse;
    border-style: hidden;
    border: 1px solid #dcdfe6;
    width: 100%;
    color: #606266;
}

.head {
    border-radius: 4px;
    background-color: #f5f7fa;
    text-align: left;
    width: 15% !important;
}

.column {
    height: 40px;
    border: 1px solid #dcdfe6;
    padding: 0 16px;
    width: 25%;
}
</style>
