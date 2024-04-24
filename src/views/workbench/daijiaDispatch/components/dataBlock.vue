<template>
  <div class="sensitiveThesaurus-menu">
    <div class="show-data-box">
        <div class="driver-box">
            <div class="title-box color-green" style="min-width: 112px;">
                <div class="first">代驾司机总数</div>
                <div class="num">{{data.totalDriverNum}}</div>
            </div>
            <div class="driver-other">
                <div class="item">
                    <div class="item-1">未接单</div>
                    <div class="item-2">{{data.newDriverNum}}</div>
                </div>
                <el-divider direction="vertical"></el-divider>
                <div class="item">
                    <div class="item-1">已接单</div>
                    <div class="item-2">{{data.oldDriverNum}}</div>
                </div>
                <el-divider direction="vertical"></el-divider>
                <div class="item">
                    <div class="item-1">在线司机</div>
                    <div class="item-2">{{data.onlineDriverNum}}</div>
                </div>
                <el-divider direction="vertical"></el-divider>
                <div class="item">
                    <div class="item-1">服务中</div>
                    <div class="item-2">{{data.serviceDriverNum}}</div>
                </div>
                <el-divider direction="vertical"></el-divider>
                <div class="item" style="min-width: 112px;">
                    <div class="item-1">行程待开始</div>
                    <div class="item-2">{{data.waitDriverNum}}</div>
                </div>
            </div>
        </div>
        <div class="order-box">
            <div class="title-box color-blue" style="min-width: 112px;">
                <div class="first">代驾订单数</div>
                <div class="num">{{data.totalOrderNum}}</div>
            </div>
            <div class="order-other">
                <div class="item" style="min-width: 112px;">
                    <div class="item-1">未接订单数</div>
                    <div class="item-2">{{data.matchingOrderNum}}</div>
                </div>
                <el-divider direction="vertical"></el-divider>
                <div class="item" style="min-width: 112px;">
                    <div class="item-1">已接订单数</div>
                    <div class="item-2">{{data.matchedOrderNum}}</div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      data: Object,
    },
    mounted() {
    },
    methods: {}
  };
</script>

<style scoped lang="scss">
.sensitiveThesaurus-menu {
    margin-top: 8px;
    margin-bottom: 24px;
}
.show-data-box {
    display: flex;
}
.driver-box {
    display: flex;
    flex: 2;
    background: #F5F7FA;
    border-radius: 8px;
    border: 1px solid #EBEEF5;
    padding: 16px;
}
.title-box {
    position: relative;
    border-radius: 4px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 22px;
    padding: 12px 16px;
    display: flex;
    flex: 1;
    flex-direction: column;
    margin-right: 12px;
    .first {
        margin-bottom: 8px;
    }
    &.color-green {
        background: #2AC39B;
    }
    &.color-blue {
        background: #0088FF;
    }
}
.title-box::before {
    content: '';
    position: absolute;
    right: -11px;
    top: 37%;
    transform: rotate(-45deg);
    width: 0;
    height: 0;
    border-right: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-top: 12px solid rgba(255, 255, 255, 1);
    font-size: 0;
    line-height: 0;
    opacity: 1;
}
.driver-other {
    background: #fff;
    display: flex;
    flex: 5;
    .item {
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 12px 16px;
        .item-1 {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #606266;
            line-height: 22px;
            margin-bottom: 8px;
        }
        .item-2 {
            font-size: 20px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #303133;
            line-height: 24px;
        }
    }
    .el-divider--vertica{
        margin-top: 10px !important;
        height: 4em;
    }
}
.order-box {
    display: flex;
    flex: 1;
    margin-left: 10px;
    background: #F5F7FA;
    border-radius: 8px;
    border: 1px solid #EBEEF5;
    padding: 16px;
}
.order-other {
    background: #fff;
    display: flex;
    flex: 2;
    .item {
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 12px 16px;
        .item-1 {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #606266;
            line-height: 22px;
            margin-bottom: 8px;
        }
        .item-2 {
            font-size: 20px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #303133;
            line-height: 24px;
        }
    }
    .el-divider--vertica{
        margin-top: 10px !important;
        height: 4em;
    }
}
/deep/.el-divider--vertical{
    height: 4em;
    margin-top: 10px;
}
</style>
