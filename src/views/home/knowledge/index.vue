<template>
  <div>
    <div class="main_content">
        <ws-table-el :col="8" ref="table" v-bind="tableConfig" highlight-current-row :header-cell-style="{ background: '#F5F7FA' }">
            <!-- 头部筛选部分   -->
            <template #search>
                <search-group>
                    <label for>标题内容：</label>
                    <el-input maxlength="50" v-model.trim="searchOptions.noticeTitle" placeholder="标题内容" clearable></el-input>
                </search-group>

                 <search-group>
                    <label for>阅读状态：</label>
                    <el-select v-model="searchOptions.readStatus" placeholder="请选择状态" clearable >
                        <el-option label="未读" :value="0"></el-option>
                        <el-option label="已读" :value="1"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>发布时间：</label>
                    <ws-date-range :startTime.sync="searchOptions.startTime" :endTime.sync="searchOptions.endTime"></ws-date-range>
                </search-group>

                <!-- <search-group>
                    <label for>文件类型：</label>
                    <el-select v-model="searchOptions.newType">
                        <el-option label="请选择文件类型" value></el-option>
                        <el-option label="知识园地" value="0"></el-option>
                        <el-option label="政策文件" value="2"></el-option>
                    </el-select>
                </search-group>


                <search-group>
                    <label for>开始时间：</label>
                    <el-date-picker v-model="searchOptions.startTime" type="datetime" placeholder="开始时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </search-group>
                <search-group>
                    <label for>结束时间：</label>
                    <el-date-picker v-model="searchOptions.endTime" type="datetime" placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </search-group> -->
            </template>
            <template #options>
                <div class="search-group">
                    <div class="right">
                        <el-button-group v-if="getModulePower('/index/knowledge').informationList">
                            <el-button type="primary" icon="el-icon-search" @click="handleSearch()">查询</el-button>
                            <ws-throttle>
                                <el-button class="resetBtn" type="primary" icon="el-icon-refresh-left" @click="handleReset"></el-button>
                            </ws-throttle>
                        </el-button-group>
                        <!-- <ws-throttle>
                            <el-button v-if="getModulePower('/index/knowledge').newsSave" plain type="primary" icon="el-icon-circle-plus" class="addButton" @click="goDetail(0)">新增</el-button>
                        </ws-throttle> -->
                    </div>
                </div>
            </template>

            <!-- 数据表格部分 -->
            <template>
                <ws-table-column-el align="left" width="400" prop="noticeTitle" label="消息标题">
                     <template slot-scope="scope">
                        <p title="查看消息" class="title" @click="goDetail(1, scope.row)">{{ scope.row.noticeTitle }}</p>
                    </template>
                </ws-table-column-el>
                <!-- <ws-table-column-el align="center" prop="newTypeValue" label="文件类型"></ws-table-column-el> -->
                <ws-table-column-el align="center"  label="阅读状态">
                    <template slot-scope="{row}">
                      <div v-if='row.readStatus == 0'>
                       <span class="un-read"></span>
                       <span>未读</span>
                      </div>
                      <div v-else class="read">
                        已读
                      </div>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="sendTime" label="时间"></ws-table-column-el>
                <ws-table-column-el align="center" prop="sendUserName" label="发布者"></ws-table-column-el>
                <ws-table-column-el align="center" label="阅读量">
                  <template slot-scope="{row}">
                    <span @click='toReadDetail(row)' class="read-number">{{row.readNumber}}</span>
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
                      <!-- v-if="getModulePower('/index/knowledge').details" -->
                        <el-button  type="text" style="color: #0088ff" @click="goDetail(1, scope.row)">详情</el-button>
                        <!-- <el-button v-if="getModulePower('/index/knowledge').newsUpdate" type="text" style="color: #0088ff" @click="goDetail(2, scope.row)">修改</el-button>
                        <el-button v-if="getModulePower('/index/knowledge').newsDelete" type="text" style="color: #0088ff" @click="handleDel(scope.row)">删除</el-button> -->
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
    name: 'knowledgeList',
    data() {
        return {
            moduleName: '/index/knowledge',
            tableConfig: {
                loading: true,
                filterColumns: false,
                emptyModel: true,
                // layout: "flow",
                pageId: 'id',
                pageCreateTime: 'updateTime',
                lazyQuery: {
                    moduleName: '/index/knowledge',
                    op: {
                        selectList: 'informationList',
                        selectCount: 'informationCount',
                    },
                    beforeQuery: this.beforeQuery,
                },
            },
            searchOptions: {
                noticeTitle: '',
                noticeType:3,
                readStatus: '',
                startTime: '',
                endTime: '',
                // newType: '',
            },
        };
    },

    activated() {
        this.handleSearch();
    },

    methods: {
        handleReset() {
            this.$refs.table.reset();
        },
        beforeQuery() {
            return this.searchOptions;
        },
        goDetail(type, row) {
            this.$router.push({ path: '/policy/detail', query: {id: row.noticeId} });
        },
        handleSearch() {
            this.$refs.table.search();
        },
        handleDel(row) {
            let opt = {
                data: {
                    id: row.id
                },
                op: 'newsDelete'
            };
            this.$confirm(`删除后不可恢复，所有账号均看不到此条知识库信息！`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                this.$axios(this.getModuleUrl(opt.op), opt).then(res => {
                    this.$refs.table.search();
                    this.$message.success('操作成功');
                });
            });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        toThumbsDetail (row) {
      this.$router.push({
        name: 'thumbsDetail',
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
        /**
         * 跳转到阅读详情页
         */
        toReadDetail(row) {
          this.$router.push({
            name: 'readDetail',
            query: {
              noticeId: row.noticeId,
              noticeType: 3
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
    .onsearch {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .right {
        float: right;
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
}

.un-read {
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  margin-right: 4px;
  background: #F05259;
}
.read {
  color: #909399;
}

.read-number {
  color: rgb(0, 136, 255);
  cursor: pointer;
}
</style>
