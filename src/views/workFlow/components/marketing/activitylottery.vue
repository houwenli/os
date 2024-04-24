<template>
  <div class="data_form">
    <h2 class="flow_title">{{ giftTitle }}</h2>
    <ws-table-el style="border-radius: 8px" ref="table" :data="dataList" :filterColumns="false" :pagination="false">
      <template>
        <ws-table-column-el align="center" prop="priority" label="排序"></ws-table-column-el>
        <ws-table-column-el align="center" prop="activityPackName" label="名称"></ws-table-column-el>
        <!-- <ws-table-column-el align="center" prop="packImageUrl" label="奖品图片"></ws-table-column-el> -->
        <ws-table-column-el label="奖品图片" width="80">
          <template slot-scope="scope">
            <img :src="scope.row.packImageUrl" width="50" height="50" />
          </template>
        </ws-table-column-el>
        <ws-table-column-el align="center" prop="packCount" label="奖品总数"></ws-table-column-el>
        <ws-table-column-el align="center" prop="" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="getInfo(scope.row)" style="color: #0088ff">详情</el-button>
          </template>
        </ws-table-column-el>
      </template>
    </ws-table-el>
    <el-dialog v-if="dialogVisible" title="奖品详情" :visible.sync="dialogVisible" width="60%">
      <div v-if="activityPacks.rewardType == 1">
        <ws-table-el style="border-radius: 8px" ref="tableData" :data="activityPacks.couponsOrRedPackets" :filterColumns="false" :pagination="false">
          <template>
            <ws-table-column-el prop="giftName" label="出行券名称"></ws-table-column-el>
            <ws-table-column-el prop="showName" label="App显示别名"></ws-table-column-el>
            <ws-table-column-el prop="activityPackType" label="出行券类型">
              <template slot-scope="scope">
                <p v-if="scope.row.couponsType">{{ scope.row.couponsType | couponsTypeFilters }}</p>
                <p v-else>-</p>
              </template>
            </ws-table-column-el>
            <ws-table-column-el prop="faceValue" label="优惠金额">
              <template slot-scope="scope">
                <p v-if="scope.row.couponsType !== 2">{{ StringToNumber(scope.row.faceValue) }}元</p>
                <p v-else>{{ StringToNumber(scope.row.faceValue) }}折</p>
              </template>
            </ws-table-column-el>
            <ws-table-column-el prop="serviceId" label="适用业务">
              <template slot-scope="scope">
                <div v-if="scope.row.ifAllBusiness === 0">
                  <p>{{ scope.row.serviceId && scope.row.serviceId.split(',') | businessFilters }}</p>
                </div>
                <div v-if="scope.row.ifAllBusiness === 1">不限</div>
              </template>
            </ws-table-column-el>
            <ws-table-column-el prop="sendNumber" label="数量"></ws-table-column-el>
            <ws-table-column-el prop="validDay" label="有效期">
              <template slot-scope="scope">
                <div v-if="scope.row.validDay || scope.row.effectiveStartTime">
                  <p v-if="scope.row.couponsPeriodType === 1">
                    {{ `领取后${scope.row.validDay}天内` }}
                  </p>
                  <p v-if="scope.row.couponsPeriodType === 2">
                    {{ `${scope.row.effectiveStartTime || '--'} 至 ${scope.row.effectiveEndTime || '--'}` }}
                  </p>
                </div>
                <div v-else>-</div>
              </template>
            </ws-table-column-el>
            <ws-table-column-el prop="availableChannel" label="可用渠道">
              <template slot-scope="scope">
                <p v-if="scope.row.availableChannel || scope.row.availableChannel === 0">
                  {{ scope.row.availableChannel | availableChannelFilters }}
                </p>
                <p v-else>-</p>
              </template>
            </ws-table-column-el>
            <ws-table-column-el prop="effectiveStartTime" label="可用时间段">
              <template slot-scope="scope">{{ scope.row.availableStartTime }}-{{ scope.row.availableEndTime }}</template>
            </ws-table-column-el>
            <ws-table-column-el prop="availableChannel" label="适用城市">
              <template slot-scope="scope">
                <p v-if="scope.row.useCity || scope.row.useCity === 0">{{ scope.row.useCity | useCityFilters }}</p>
                <p v-else>-</p>
              </template>
            </ws-table-column-el>
          </template>
        </ws-table-el>
      </div>
      <div v-if="activityPacks.rewardType == 2">
        <el-form-item label="兑奖地址：" label-width="140px" prop="redemptionAddress">
          <span>{{ activityPacks.saveActivityGoodAo.redemptionAddress?activityPacks.saveActivityGoodAo.redemptionAddress:'暂无相关信息' }}</span>
        </el-form-item>
        <el-form-item label="兑奖码：" label-width="140px">
          <span>{{ '实物抽奖兑换码'}}</span>
        </el-form-item>
        <el-form-item label="兑奖客服：" label-width="140px" prop="url">
          <img v-if="activityPacks.saveActivityGoodAo.url" :src="activityPacks.saveActivityGoodAo.url" alt="" />
          <span v-else>{{'暂无相关信息'}}</span>
        </el-form-item>
        <el-form-item label="兑奖期限：" label-width="140px" prop="redemptionEnd">
          <span>{{ activityPacks.saveActivityGoodAo.redemptionStart }}-{{ activityPacks.saveActivityGoodAo.redemptionEnd }}</span>
        </el-form-item>
      </div>
      <div v-if="activityPacks.rewardType == 0">谢谢参与</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import giftTable from './giftTable.vue'

export default {
  components: { giftTable },
  props: {
    formData: {
      type: Array,
      default: () => []
    },
    formKeys: {
      type: Array,
      default: () => []
    },
    giftTitle: {
      type: String,
      default: '活动奖励'
    },
    tableList: {
      type: Array,
      default: () => []
    },
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      dataList: [
        {
          name: '333'
        }
      ],
      activityPacks: {}
    }
  },
  watch: {
    formData: {
      handler(val) {
        console.log(val)
      },
      immediate: true
    }
  },
  filter: {
    couponsTypeFilters: [
      {
        id: 1,
        value: '满减券'
      },
      {
        id: 2,
        value: '折扣券'
      },
      {
        id: 3,
        value: '立减券'
      }
    ],
    businessFilters: [
      { value: '网约车', id: '1' },
      { value: '顺风车', id: '2' },
      { value: '货运', id: '3' },
      { value: '代驾', id: '4' }
    ],
    useCityFilters: [
      {
        id: 0,
        value: '不限'
      },
      {
        id: 1,
        value: '活动城市可用'
      },
      {
        id: 2,
        value: '领券城市可用'
      }
    ],
    availableChannelFilters: [
      { id: 0, value: '不限' },
      { id: 1, value: 'APP' },
      { id: 2, value: '小程序' }
    ]
  },
  computed: {},
  mounted() {
    this.getdataList()
  },
  methods: {
    StringToNumber(val) {
      return (val / 100).toFixed(2)
    },
    getdataList() {
      this.dataList = this.formData
    },
    getInfo(val) {
      console.log(val)
      this.activityPacks = val
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../comm.scss';

.data_form {
  .form_line {
    margin-bottom: 16px;
  }

  .gift_name {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #303133;
    padding: 0 0 16px 20px;
    position: relative;
  }

  .gift_name::after {
    content: '';
    position: absolute;
    top: 4px;
    left: 0;
    width: 12px;
    height: 12px;
    background: #c0c4cc;
    border-radius: 50%;
  }

  .gift_content {
    width: 100%;
    padding: 16px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
  }

  /deep/ .ws-table-warp {
    padding: 0 !important;
  }
}
</style>
