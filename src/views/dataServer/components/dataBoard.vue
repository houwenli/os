<!-- 数据看板组件 -->
<template>
    <div>
        <el-row class="view_box">
            <el-col  v-for="item in dataConfig" :key="item.field" class="view_cont">
                <div class="title">{{ item.title }}</div>
                <div class="number">
                    <count-to :startVal="0" :decimals="item.type === 'money' ? 2 : 0" :duration="1000" :endVal="Number(dataInfo[item.field] || 0)"></count-to>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import countTo from 'vue-count-to'
export default {
    components: { countTo },
    name: 'dataBoard',
    props: {
        dataInfo: {
            type: Object,
            default: () => {}
        },
        dataConfig: {
            type: Array,
            default: () => []
        }
    }
}
</script>

<style lang="scss" scoped>
.view_box {
    height: 108px;
    background: #f5f7fa;
    border-radius: 8px;
    display: flex;
    width: 100%;
    margin: 0px 0px 24px 0px;
    .view_cont {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .title {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #606266;
            margin-bottom: 12px;
            line-height: 20px;
        }
        .number {
            font-size: 24px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #303133;
            line-height: 28px;
        }
    }
}
</style>
