<template>
  <div class="data_form">
      <h2 class="flow_title">活动人群</h2>
      <div :class="{ crowd_box: formData['crowdControlAos'].length > 0 }">
          <el-row class="form_line">
              <el-col :span="24">
                  <el-form-item label="活动人群：">
                      <span>{{ formData['crowdControlAos'].length === 0 || formData['crowdControlAos'][0].drivercrowdId == -1 ? '不限人群' :formData['crowdControlAos'][0].drivercrowdId == -2? '指定人群' : '部分人群' }}</span>
                  </el-form-item>
              </el-col>
          </el-row>
          <ul v-if="formData['crowdControlAos'].length>0 && formData['crowdControlAos'][0].drivercrowdId != -1" class="people_tag clearfix">
              <li v-for="item in formData['crowdControlAos']" :key="item.index">{{item.drivercrowdName }}</li>
          </ul>
      </div>
  </div>
</template>

<script>
import { TARGET_PEOPLE } from '@/utils/enum';
export default {
  props: {
      formData: {
          type: Object,
          default: () => {},
      },
  },
  data() {
      return {
          TARGET_PEOPLE,
      };
  },
  mounted() {
    console.log(111,this.formData)
  },
};
</script>

<style lang="scss" scoped>
@import '../comm.scss';

.crowd_box {
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.people_tag {
  width: 100%;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  li {
      font-size: 14px;
      background: #ecf5ff;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: #409eff;
      padding: 8px 24px;
      border-radius: 4px;
      margin-top: 16px;
      margin-right: 16px;
  }
}
</style>
