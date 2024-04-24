<template>
  <div>
    <div class="panel-title">人员基本信息</div>
    <el-form label-width="100px">
      <div class="person-wrap">
        <el-col :span="12">
          <span class="label-desc">姓名：</span>
          {{ info.user.name }}
        </el-col>
        <el-col :span="12">
          <span class="label-desc">出行方式：</span>

          {{ getTravelMode }}
        </el-col>

        <el-col :span="12">
          <span class="label-desc">手机号码：</span>

          {{ info.user.phone }}
        </el-col>
        <el-col :span="12">
          <span class="label-desc">抵达时间：</span>

          {{ info.staffInfo.arriveTime }}
        </el-col>

        <el-col :span="12">
          <span class="label-desc">分支机构：</span>

          {{ info.user.deptName }}
        </el-col>

        <el-col :span="12">
          <span class="label-desc">抵达站点：</span>
          {{ info.staffInfo.station }}
        </el-col>

        <el-col :span="12">
          <span class="label-desc">职位：</span>
          {{ info.user.positionName }}
        </el-col>

        <el-col v-if="info.staffInfo.travelMode !== 3" :span="12">
          <span class="label-desc">班次：</span>

          {{ info.staffInfo.travelFrequency }}
        </el-col>

        <el-col :span="12">
          <span class="label-desc">性别：</span>

          {{ info.user.gender === 1 ? '男' : '女'}}
        </el-col>

        <el-col :span="12">
          <span class="label-desc">会议状态：</span>
          {{ info.conference.statusName }}
        </el-col>

        <el-col :span="12">
          <span class="label-desc">年龄：</span>
          {{ info.user.age }}
        </el-col>

        <div class="person-pic-wrap">
          <img class="preview-pic" :src="info.staffInfo.picture" alt="" />
          <span class="desc">学员照片</span>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
// 结业人员信息
export default {
  name: 'graduationPersonInfo',
  props: {
    info: {
      type: Object,
      default: () => { }
    }
  },
  computed: {
    getTravelMode () {
      let e = {
        1: '飞机',
        2: '火车',
        3: '自驾'
      }

      return e[this.info.staffInfo.travelMode] || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-title {
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #303133;
  padding-bottom: 16px;
}

.person-wrap {
  position: relative;
  background: #f5f7fa;
  border-radius: 8px;

  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #303133;
  padding-top: 14px;
  padding-bottom: 14px;
  margin-bottom: 24px;

  .label-desc {
    color: #606266;
    display: inline-block;
    width: 100px;
    text-align: right;
    line-height: 20px;
    margin: 10px 0;
  }

  &::after {
    display: block;
    visibility: hidden;
    height: 0;
    clear: both;
    content: ' ';
  }

  .person-pic-wrap {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 88px;
    height: 112px;
    background: #606266;
    border-radius: 8px;
    overflow: hidden;

    .preview-pic {
      width: 88px;
      height: 112px;
    }

    .desc {
      margin-top: 4px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #909399;
    }
  }
}
</style>
