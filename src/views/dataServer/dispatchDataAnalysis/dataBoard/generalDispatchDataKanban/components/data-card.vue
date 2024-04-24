<template>
    <div class="index-name">
        <el-card style="width: 24%; height: 131px; margin-bottom: 10px" v-for="(item, index) in dataCardList" :key="index">
            <div class="name-circle">
                <div class="circle-title">
                    <span class="dataCardName">{{ item.cardName }}</span>
                    <el-tooltip placement="top-start" class="info-tooltip">
                        <i class="el-icon-question" style="color: #333"></i>
                        <div slot="content" v-html="item.tips"></div>
                    </el-tooltip>
                </div>
                <el-progress type="circle" v-show="item.ratio" :percentage="item.ratio" :width="60"></el-progress>
            </div>

            <div class="index-count">
                <span>总量</span>
                <span class="font24 margin20">{{ item.number }}</span>
                <span class="font24">{{ item.unit }}</span>
            </div>
        </el-card>
    </div>
</template>

<script>
import dataCardName from './dataCardName';
export default {
    props: {
        bindList: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            dataCardList: []
        };
    },
    watch: {
        bindList: {
            handler(newVal, oldval) {
                if (newVal) {
                    this.handleDataCardData(newVal);
                }
            },
            deep: true,
            immediate: true
        }
    },
    created() {
        this.dataCardList.push(...dataCardName);
    },
    methods: {
        handleDataCardData(data) {
            Object.keys(data).forEach(key => {
                this.dataCardList.forEach((item, index) => {
                    if (key === item.name) {
                        item['number'] = data[key];
                    }
                    if (this.dataCardList[index].name === 'scheduleSuccessOrderCnt') {
                        this.dataCardList[index]['ratio'] = data['scheduleSuccessOrderRatio'];
                    }
                    if (this.dataCardList[index].name === 'failedOrderCnt') {
                        this.dataCardList[index]['ratio'] = data['failedOrderRatio'];
                    }
                    if (this.dataCardList[index].name === 'schedulingOrderCnt') {
                        this.dataCardList[index]['ratio'] = data['scheduleOrderRatio'];
                    }
                });
            });
            this.$forceUpdate();
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
