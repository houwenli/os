<template>
  <div>
    <ws-table-el
      class="page-container"
      :col="8"
      ref="table"
      v-bind="tableConfig"
      highlight-current-row
      :header-cell-style="{ background: '#F5F7FA' }"
    >
      <template #search>
        <search-group>
          <label for>会议名称：</label>
          <el-input
            maxlength="50"
            v-model.trim="searchOptions.confName"
            placeholder="请输入标题内容"
            clearable
          ></el-input>
        </search-group>

        <search-group>
          <label for>阅读状态：</label>
          <el-select
            v-model="searchOptions.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="未读" :value="1"></el-option>
            <el-option label="已读" :value="2"></el-option>
          </el-select>
        </search-group>
        <search-group>
          <label for>处理状态：</label>
          <el-select
            v-model="searchOptions.dealStatus"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="未处理" :value="1"></el-option>
            <el-option label="已处理" :value="2"></el-option>
          </el-select>
        </search-group>
        <search-group>
          <label for>发布时间：</label>
          <ws-date-range
            :startTime.sync="searchOptions.publishStartTime"
            :endTime.sync="searchOptions.publishEndTime"
          ></ws-date-range>
        </search-group>
      </template>
      <template #options>
          <div class='operate-group'>
            <el-button-group
              v-if="
                getModulePower('/index/conference').conferenceMessageList
              "
            >
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleSearch()"
                >查询</el-button
              >
              <ws-throttle>
                <el-button
                  class="resetBtn"
                  type="primary"
                  icon="el-icon-refresh-left"
                  @click="handleReset"
                ></el-button>
              </ws-throttle>
            </el-button-group>
          </div>
      </template>

      <!-- 数据表格部分 -->
      <template>
        <ws-table-column-el
          align="left"
          width="200"
          prop="confName"
          label="会议名称"
        ></ws-table-column-el>
        <ws-table-column-el
          align="left"
          width="200"
          prop="messageTitle"
          label="消息标题"
        >
          <template slot-scope="{ row }">
            <div title="查看消息" class="title" @click="goDetail(row)">
              {{ row.messageTitle }}
            </div>
          </template>
        </ws-table-column-el>
        <ws-table-column-el
          align="center"
          prop="publishTime"
          label="发布时间"
        ></ws-table-column-el>
        <ws-table-column-el
          align="center"
          prop="publishUserName"
          label="发布者"
        ></ws-table-column-el>
        <ws-table-column-el align="center" label="阅读状态">
          <template slot-scope="{ row }">
            <div v-if="row.status === 1">
              <span class="un-read"></span>
              <span>未读</span>
            </div>
            <div v-else class="read">已读</div>
          </template>
        </ws-table-column-el>
        <ws-table-column-el align="center" label="处理状态">
          <template slot-scope="{ row }">
            <div v-if="row.dealStatus === 1">
              <span class="un-read"></span>
              <span>未处理</span>
            </div>
            <div v-else class="read">已处理</div>
          </template>
        </ws-table-column-el>
        <ws-table-column-el
          fixed="right"
          width="100"
          align="center"
          label="操作"
        >
          <template slot-scope="{ row }">
            <el-button type="text" style="color: #0088ff" @click="goDetail(row)"
              >查看</el-button
            >
          </template>
        </ws-table-column-el>
      </template>
    </ws-table-el>

    <ws-footer>
      <el-button @click="onBack">返回</el-button>
    </ws-footer>
  </div>
</template>

<script>
export default {
  name: 'conference',
  data () {
    return {
      moduleName: '/index/conference',
      tableConfig: {
        filterColumns: false,
        pageCreateTime: 'updateTime',
        lazyQuery: {
          moduleName: '/index/conference',
          op: {
            selectList: 'conferenceMessageList'
          }
        },
      },
      searchOptions: {
        confName: '',
        status: '',
        dealStatus: '',
        publishStartTime: '',
        publishEndTime: ''
      }
    };
  },

  methods: {
    handleReset () {
      this.$refs.table.reset();
    },

    goDetail (row) {
      // 根据不同情况跳到不同详情
      let pathMap = {
        // 开会通知
        1: '/conference/detailNotice',
        // 推荐信,需要传入状态展示是否接收,入学为1，结业为2
        2: '/conference/detailLetter',
        // 个人信息填报
        3: '/conference/detailPersonal'
      }

      let path = pathMap[row.messageType]

      this.$router.push({
        path,
        query: {
          id: row.id
        }
      })
    },
    handleSearch () {
      this.$refs.table.search();
    },
    getModuleUrl (op) {
      return this.$getModuleUrl(this.moduleName, op);
    },

    onBack () {
      this.$router.push({
        name: 'index'
      })
    }
  }
};
</script>

<style scoped lang="scss">
.page-container {
  margin-bottom: 64px;
}

.operate-group {
  text-align: right;
}

.addButton {
  margin-left: 16px;
  color: #f05259;
  border: 1px solid #f05259;
  background: #fff;
}

.title {
  cursor: pointer;
}

.title:hover {
  color: #f05259;
}
.un-read {
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  margin-right: 4px;
  background: #f05259;
}

.read {
  color: #909399;
}

.read-number {
  color: rgb(0, 136, 255);
  cursor: pointer;
}
</style>
