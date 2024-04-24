<template>
    <div class="index-name">
        <el-card style="width: 24%; height: 131px; margin-bottom: 10px">
            <div class="name-circle">
                <div class="circle-title">
                    <span class="dataCardName">全局最优调度效率</span>
                    <el-tooltip placement="top-start" class="info-tooltip">
                        <i class="el-icon-question" style="color: #333"></i>
                        <div slot="content">
                            全局最优调度效率=1-（综合接驾时间最短/对应阈值*权重+综合接驾距离最近/对应阈值*权重）
                        </div>
                    </el-tooltip>
                </div>
            </div>
            <div class="index-count">
                <!--                <span>总量</span>-->
                <span class="font24">{{NumberMul(datasCard.efficiency,100)}}%</span>
            </div>
        </el-card>
        <el-card style="width: 24%; height: 131px; margin-bottom: 10px">
            <div class="name-circle">
                <div class="circle-title">
                    <span class="dataCardName">综合订单金额（元）</span>
                </div>
            </div>
            <div class="index-count">
                <span class="font24">{{ datasCard.orderAmount }}</span>
            </div>
        </el-card>
        <el-card style="width: 24%; height: 131px; margin-bottom: 10px">
            <div class="name-circle">
                <div class="circle-title">
                    <span class="dataCardName">综合接驾时间（min）</span>
                </div>
            </div>
            <div class="index-count">
                <span class="font24">{{ datasCard.receiveTime }}</span>
            </div>
        </el-card>
        <el-card style="width: 24%; height: 131px; margin-bottom: 10px">
            <div class="name-circle">
                <div class="circle-title">
                    <span class="dataCardName">综合接驾距离（km）</span>
                </div>
            </div>
            <div class="index-count">
                <span class="font24">{{ datasCard.receiveDistance }}</span>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    props: {
        datas: {
            type: Object,
            default: () => {
            }
        }
    },
    data() {
        return {
            datasCard: []
        };
    },
    watch: {
        datas: {
            handler(newVal, oldval) {
                if (newVal) {
                    this.datasCard = newVal
                }
            },
            deep: true,
            immediate: true
        }
    },
    created() {
    },
    methods: {
        NumberMul(arg1, arg2){
            var m = 0;
            var s1 = arg1?arg1.toString():'';
            var s2 = arg2?arg2.toString():'';
            try {
                m += s1.split(".")[1].length;
            } catch (e) {}
            try {
                m += s2.split(".")[1].length;
            } catch (e) {}
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
        }
    }
};
</script>

<style lang="scss" scoped>
.index-name {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 10px 0;

    .name-circle {
        display: flex;
        flex-direction: row;
        justify-content: space-around;

        .circle-title {
            text-align: left;
            flex: 1;

            .info-tooltip {
                margin-left: 8px;
            }
        }
    }

    .index-count {
        .font24 {
            font-size: 24px;
        }

        .margin20 {
            margin: 0 20px;
        }
    }
}

/deep/ .el-card__body {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>
