<template>
  <div class="main-log">
    <div class="log-item">
      <label for="">最后修改人</label>
      <span>{{logObj.operatorName}}</span>
    </div>
    <div class="log-item">
      <label for="">最后修改时间</label>
      <span>{{logObj.operatorTime}}</span>
    </div>
  </div>
</template>
<script>
export default {
    props: {
        logObj: {
            type: Object,
            default() {
                return {};
            },
        },
    },
};
</script>
<style lang="scss" scoped>
.main-log {
    display: flex;
    justify-content: space-between;
    margin: 14px 0 24px 0;
    .log-item {
        width: 48%;
        min-width: 413px;
        border: 1px solid #ebeef5;
        border-radius: 5px;
        label {
            display: inline-block;
            background: #f5f7fa;
            height: 48px;
            line-height: 48px;
            width: 25%;
            min-width: 103px;
            text-align: right;
            padding-right: 10px;
            font-weight: 500;
            border-right: 1px solid #ebeef5;
            border-radius: 5px 0 0 5px;
        }
        span {
            padding-left: 10px;
        }
    }
}
</style>
