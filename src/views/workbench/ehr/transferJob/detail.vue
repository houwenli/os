<template>
  <div>
    <div class="form-content">
      <ws-descriptions title="调岗信息" :showToggle="false">
        <ws-descriptions-item label="员工姓名">{{ detailData.userName }}</ws-descriptions-item>
        <ws-descriptions-item label="员工ID">{{ detailData.userId }}</ws-descriptions-item>
      </ws-descriptions>
      <ws-descriptions title="调岗前岗位" :showToggle="false">
        <el-table class="custome-table" :data="detailData.beforeUserDeptPositionVo" border header-row-class-name="heardClass" max-height="442px">
          <el-table-column label="部门" prop="deptName"></el-table-column>
          <el-table-column label="职位" prop="positionName"></el-table-column>
        </el-table>
      </ws-descriptions>
      <ws-descriptions title="调岗后岗位" :showToggle="false">
        <el-table class="custome-table" :data="detailData.afterUserDeptPositionVo" border header-row-class-name="heardClass" max-height="442px">
          <el-table-column label="部门" prop="deptName"></el-table-column>
          <el-table-column label="职位" prop="positionName"></el-table-column>
        </el-table>
      </ws-descriptions>
      <ws-descriptions title="修改信息" :showToggle="false">
        <ws-descriptions-item label="实际调整日期">{{ detailData.transferDate }}</ws-descriptions-item>
        <ws-descriptions-item label="发起人">{{ detailData.createUserName }}</ws-descriptions-item>
        <ws-descriptions-item label="调岗原因">
          <template slot="content">
            <el-tooltip :disabled="detailData.transferReason === null || detailData.transferReason?.length <= 44" placement="top" effect="light">
              <template #content>
                <div v-html="handleContentText">
                </div>
              </template>
              <div class="text-outer-line">
                {{ detailData.transferReason?.length > 44 ? (detailData.transferReason.substring(0, 44) + '...') : detailData.transferReason !== null ? detailData.transferReason : '-' }}
              </div>
          </el-tooltip>
          </template>
        </ws-descriptions-item>
      </ws-descriptions>
      <div class="footer_btn">
        <el-button plain @click="back()">返 回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
const splitBigText = (len, text) =>  {
  let count = len
  let start = 0
  let current = ''
  let textArr = []

  while (text?.length) {
    current = text.substring(start, count)
    textArr.push(current)
    // 剩余字符串
    text = text.substring(start + count)
  }

  return textArr
}



export default {
  name: 'transferJobForm',
  data() {
    return {
      moduleName: '/workbench/ehr/transferJob',
      detailData: {
        userName: '',
        userId: '',
        beforeUserDeptPositionVo: [],
        afterUserDeptPositionVo: [],

        transferDate: '',
        createUserName: '',
        transferReason: ''
      }
    }
  },

  computed: {
    handleContentText() {
      let count = 44
      let text = this.detailData.transferReason

      if (text?.length > count) {
        let arr = splitBigText(60, text)

        return arr.join('<br/>')
      }

      return text
    }
  },

  created() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      let params = {
        data: { id: this.$route.query.id },
        op: 'selectPositionTransferDetail'
      }
      let URL = this.powerList[params.op]
      try {
        let res = await this.$axios(URL, params)
        this.detailData = JSON.parse(res.data)

      } catch (error) {
        console.log(error)
      }
    },


    back() {
      this.$router.push({ name: 'transferJob' })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-content {
  width: 100%;
  min-height: calc(100% - 64px);
  background: #ffffff;
  margin-bottom: 64px;
  padding: 32px 40px;
  border-radius: 8px;
}
/deep/.heardClass {
  th {
    background: #f5f7fa;
    font-weight: 600;
    color: #303133;
    line-height: 20px;
  }
}

.text-outer-line {
  width: 100%;
  padding-left: 16px;
  padding-right: 16px;
  border-right: 1px solid rgb(235, 238, 245);
  border-bottom: 1px solid rgb(235, 238, 245);
}
</style>
