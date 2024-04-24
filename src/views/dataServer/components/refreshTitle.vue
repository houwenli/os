<template>
    <div class="title_box">
        <div class="title">{{ title }}</div>
        <div class="recharge-title">
            <div class="time-text" v-if="latestUpdateTime">最近更新时间：{{ latestUpdateTime }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'refreshTitle',
    props:{
        title:{
            type:String,
            default:''
        },
        latestUpdateTime:{
            type:String,
            default:''
        }
    },
    
}
</script>

<style lang="scss" scoped>
.title_box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
        height: 22px;
        font-size: 16px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #303133;
        line-height: 22px;
    }
    .recharge-title {
        display: flex;
        align-items: center;
    }
    .time-text {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #909399;
    }
}
</style>
