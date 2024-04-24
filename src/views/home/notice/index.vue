<template>
    <div>
        <div class="main_content">
            <ws-table-el :col="8" ref="table" v-bind="tableConfig" highlight-current-row :header-cell-style="{ background: '#F5F7FA' }">
                <template #search>
                    <search-group>
                        <label for>标题内容：</label>
                        <el-input v-model.trim="searchOptions.noticeTitle" placeholder="请输入标题内容" clearable></el-input>
                    </search-group>
                    <search-group>
                        <label for>阅读状态：</label>
                        <el-select v-model="searchOptions.readStatus" placeholder="请选择状态" clearable>
                            <el-option label="未读" :value="0"></el-option>
                            <el-option label="已读" :value="1"></el-option>
                        </el-select>
                    </search-group>
                    <search-group>
                        <label for>发布时间：</label>
                        <ws-date-range :startTime.sync="searchOptions.startTime" :endTime.sync="searchOptions.endTime"></ws-date-range>
                    </search-group>
                </template>

                <template #options>
                    <div class="search-group">
                        <div v-if="oaPowerList.informationList" class="right">
                            <el-button-group>
                                <el-button type="primary" icon="el-icon-search" @click="handleSearch()">查询</el-button>
                                <ws-throttle>
                                    <el-button class="resetBtn" type="primary" icon="el-icon-refresh-left" @click="handleReset"></el-button>
                                </ws-throttle>
                            </el-button-group>
                        </div>
                    </div>
                </template>

                <template>
                    <ws-table-column-el prop="noticeTitle" label="消息标题">
                        <template slot-scope="scope">
                            <p title="查看消息" class="title" @click="goDetail(scope.row)">{{ scope.row.noticeTitle }}</p>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" label="阅读状态">
                        <template slot-scope="{ row }">
                            <div v-if="row.readStatus == 0">
                                <span class="un-read"></span>
                                <span>未读</span>
                            </div>
                            <div v-else class="read">已读</div>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="sendTime" width="200" label="时间"></ws-table-column-el>
                    <ws-table-column-el align="center" prop="sendUserName" width="150" label="发布者"></ws-table-column-el>
                    <ws-table-column-el align="center" label="阅读量">
                        <template slot-scope="{ row }">
                            <span @click="toReadDetail(row)" class="read-number">{{ row.readNumber }}</span>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="praiseNumber" label="点赞量">
                      <template slot-scope="{ row }">
                            <span v-if="row.praiseNumber*1>0" @click="toThumbsDetail(row)" class="read-number">{{ row.praiseNumber }}</span>
                            <span v-else>{{ row.praiseNumber }}</span>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el align="center" prop="replyNumber" label="评论量">
                      <template slot-scope="{ row }">
                            <span v-if="row.replyNumber*1>0" @click="toCommentDetail(row)" class="read-number">{{ row.replyNumber }}</span>
                            <span v-else>{{ row.replyNumber }}</span>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el fixed="right" width="100" align="center" label="操作">
                        <template slot-scope="scope">
                            <!-- v-if="getModulePower('/index/policy').details"  -->
                            <el-button type="text" style="color: #0088ff" @click="goDetail(scope.row)">详情</el-button>
                        </template>
                    </ws-table-column-el>
                </template>
            </ws-table-el>
        </div>
        <ws-footer>
            <el-button @click="onBack">返回</el-button>
        </ws-footer>
    </div>
</template>

<script>
export default {
  name: 'messageList',
  data () {
    return {
      searchOptions: {
        noticeTitle: '',
        noticeType: 1,
        startTime: null,
        endTime: null,
        readStatus: ''
      },
      moduleName: '/index/information',
      tableConfig: {
        loading: true,
        filterColumns: false,
        emptyModel: true,
        // layout: "flow",
        pageId: 'id',
        pageCreateTime: 'updateTime',
        lazyQuery: {
          moduleName: '/index/information',
          op: {
            selectList: 'informationList',
            selectCount: 'informationCount'
          },
          beforeQuery: this.beforeQuery
        }
      }
    };
  },
  methods: {
    handleSearch () {
      this.$refs.table.search();
    },
    handleReset () {
      this.$refs.table.reset();
    },
    enterForm (row) {
      this.$router.push({ path: '/noticeList/detail', query: { id: row.noticeId } });
    },
    getModuleUrl (op) {
      return this.$getModuleUrl(this.moduleName, op);
    },
    goDetail (row) {
      this.$router.push({ path: '/policy/detail', query: { id: row.noticeId } });
    },
    /**
     * 跳转到阅读详情页
     */
     toThumbsDetail (row) {
      this.$router.push({
        name: 'thumbsDetail',
        query: {
          noticeId: row.noticeId,
          noticeType: 1
        }
      })
    },
    toReadDetail (row) {
      this.$router.push({
        name: 'readDetail',
        query: {
          noticeId: row.noticeId,
          noticeType: 1
        }
      })
    },
    toCommentDetail (row) {
      this.$router.push({
        name: 'commentDetail',
        query: {
          noticeId: row.noticeId,
          noticeType: 1
        }
      })
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
.main_content {
    margin-bottom: 64px;

    .right {
        float: right;
    }

    .title {
        cursor: pointer;
    }

    .title:hover {
        color: #f05259;
    }
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
