<template>
  <div>
    <h2 class="logs-title">修改记录</h2>

    <el-row type="flex" justify="space-between">
      <el-col :span="12" style="margin-right: 16px">
        <table class="log-table">
          <tr>
            <td class="column head">创建人</td>
            <td class="column">{{ info.createUserName }}</td>
          </tr>
          <tr>
            <td class="column head">创建时间</td>
            <td class="column">{{ info.createTime }}</td>
          </tr>
        </table>
      </el-col>
      <el-col :span="12">
        <table class="log-table">
          <tr>
            <td class="column head">修改人</td>
            <td class="column">{{ info.updateUserName }}</td>
          </tr>
          <tr>
            <td class="column head">修改时间</td>
            <td class="column">{{ info.updateTime }}</td>
          </tr>
        </table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'operateLog',
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="less" scoped>
.logs-title {
  font-size: 16px;
  color: #303133;
  padding: 32px 0 16px;
  font-weight: bold;
}

.log-table {
  margin: 0 auto;
  border-radius: 4px;
  border-collapse: collapse;
  border-style: hidden;
  box-shadow: 0 0 0 1px #d8d8d8;
  width: 100%;

  .head {
    border-radius: 4px;
    background-color: #f5f7fa;
    text-align: left;
    width: 30%;
  }
  .column {
    height: 40px;
    border: 1px solid #dcdfe6;
    padding: 0 16px;
  }
}
</style>
