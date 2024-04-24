<template>
  <div>
    <div class="meun-title">
        <div class="back-box" @click='goBack' v-if='showBack'>
            <img src="../image/icon_more1@2x.png" />
            <span class="btn-back">返回</span>
            <span class="line">|</span>
        </div>
        <!-- <el-button type="info" plain icon="el-icon-back" @click='goBack' v-if='showBack'>返回</el-button> -->
        <span class="title-text">{{ meunTitle }}</span>
    </div>
    <div class="time-btn">
        <span class="time">最后更新时间：{{newDate}}</span>
        <span class="refresh" @click="handleClickRefresh"><img src="../image/icon_reset_line@2x.png" />刷新</span>
        <!-- <el-button type="primary" icon="el-icon-refresh" @click="handleClickRefresh"></el-button> -->
    </div>
  </div>
</template>

<script>
  import * as util from "../utils/index";
  export default {
    props: {
      showBack: Boolean,
      meunTitle: String,
    },
    data() {
      return {
        newDate: '', //当前时间
        waitTime: 60, //当前时间倒计时
        dateShow: false, // 日期选择插件
        tabPosition: '今天',
        value1: new Date(),
      };
    },
    mounted() {
      this.newDate = util.timestampToTime13(new Date());
      this.getTime(60);
    },
    methods: {
      // 返回上一页
      goBack() {
        this.$emit('goBack', 1)
      },
      // 刷新
      handleClickRefresh() {
        this.newDate = util.timestampToTime13(new Date());
        this.getTime(60);
        this.$emit('func', 60);
      },
      getTime(waitTime) {
        let _this = this;
        let _waitTime = waitTime;
        if (_waitTime == 0) {
          waitTime = _waitTime;
          this.handleClickRefresh();
        } else {
          waitTime--;
          setTimeout(function () {
            _this.getTime(waitTime);
          }, 1000);
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  .meun-title {
    display: inline-block;
    margin: 0 0 15px 0;
    .back-box{
        display: inline-block;
        cursor: pointer;
        img{
            width: 16px;
            height: 16px;
            top: 3px;
            position: relative;
            margin-right: 3px;
        }
    }
    .btn-back {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #606266;
        line-height: 20px;
    }
    .line {
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #909399;
        line-height: 20px;
        margin-left: 12px;
        margin-right: 14px;
    }
    .title-text{
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #303133;
        line-height: 22px;
    }
  }
  .time-btn {
    display: inline-block;
    float: right;
    .time {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #909399;
        line-height: 20px;
    }
    .refresh {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #F05259;
        line-height: 20px;
        cursor: pointer;
        img{
            margin-left: 16px;
            margin-right: 4px;
            width: 16px;
            height: 16px;
            position: relative;
            top: 3px;
        }
    }
  }
  
</style>
