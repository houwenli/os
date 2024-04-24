<template>
    <el-card :class="['ws-box-card', { 'ws-box-card-height': type == 0 }]" :style="{ 'height': type == 1 ? '100%' : ''}">
        <div slot="header" class="ws-box-card-clearfix">
            <div class="ws-box-card-title">
                <img v-if="type == 1" width="16" src="@/assets/index/notice_news.png" alt />
                <img v-if="type == 2" width="16" src="@/assets/index/policy_news.png" alt />
                <img v-if="type == 3" width="16" src="@/assets/index/knowledge_news.png" alt />
                <img v-if="type == 4" width="16" src="@/assets/index/conference_news.png" alt />
                <el-button size="small" type="text" style="color: #303133; font-size: 14px; margin-left: 3px">
                    {{ titleName }}
                    <span style="font-size: 12px; color: #f05259" v-if="showNumber">({{ total }})</span>
                </el-button>
            </div>
            <el-button type="text" style="padding: 0; height: 25px; font-size: 12px" @click="toList()" v-if="showMore">
                <div style="display: flex; align-items: center">
                    更多
                    <img src="@/assets/index/icon_more.png" alt width="16" />
                </div>
            </el-button>
        </div>
        <template v-if="isEmpty && type != 1 ">
            <div v-for="(item, index) in dataSource" :key="index" >
              <div  class="content-item" :class="item.readStatus == 0 ? 'un-read' : ''" @click='onView(item)'>
                <div class="left"><div class="dot"></div></div>
                <div class="right">
                  <div class="content-title">{{ item.noticeTitle }}</div>

                  <div class="status">
                    <span class="user-name">{{ item.sendUserName }}</span>
                    <span class="time">{{ item.sendTime }}</span>
                  </div>
                </div>
              </div>
            </div>
        </template>

        <template v-else-if="isEmpty && type == 1">
            <div v-for="(item, index) in dataSource" :key="index" class="ws-box-card-content" >
                <div  class="content-item" :class="item.readStatus == 0 ? 'un-read' : ''" @click='toDetail(item.noticeId)'>
                  <div class="left"><div class="dot"></div></div>
                  <div class="right">
                    <div class="content-title">{{ item.noticeTitle }}</div>

                    <div class="status">
                      <span class="user-name">{{ item.sendUserName }}</span>
                      <span class="time">{{ item.sendTime }}</span>
                    </div>
                  </div>
                </div>
            </div>
        </template>
        <template v-else-if="showEmpty">
            <div class="ws-box-empty" style="text-align: center">
                <img src="@/assets/index/empty.png" alt />
                <p>{{ emptyTips }}</p>
            </div>
        </template>
    </el-card>
</template>

<script>
export default {
    props: {
        type: {
            type: Number
        },
        titleName: {
            type: String,
            default: ''
        },
        showNumber: {
            type: Boolean,
            default: true
        },
        showMore: {
            type: Boolean,
            default: true
        },
        total: {
            type: Number,
            default: 0
        },
        dataSource: {
            type: Array,
            default: () => []
        },
        showEmpty: {
            type: Boolean,
            default: true
        },
        emptyTips: {
            type: String,
            default: '暂无数据'
        }
    },
    computed: {
        isEmpty() {
            return this.dataSource.length > 0;
        }
    },
    methods: {
        toList() {
            switch (this.type) {
                case 1:
                    this.$router.push({ path: 'noticeList' });
                    break;
                case 2:
                    this.$router.push({ path: 'policy' });
                    break;
                case 3:
                    this.$router.push({ path: 'knowledgeList' });
                    break;
                case 4:
                    this.$router.push({ path: 'conference' });
                    break;
                default:
                    break;
            }
        },

        toDetail(id) {
          this.$router.push({
            path: '/policy/detail',
            query: {
              id: id
            }
          })
        },

        onView(row) {
          // 根据不同情况跳到不同详情
          let pathMap = {
            // 开会通知
            1: '/conference/detailNotice',
            // 推荐信,需要传入状态展示是否接收,入学为1，结业为2
            2: '/conference/detailLetter',
            // 个人信息填报
            3: '/conference/detailPersonal'
          }

          if (this.type === 4) {
            let path = pathMap[row.messageType]

            this.$router.push({
              path,
              query: {
                id: row.id
              }
            })
          } else {
            this.toDetail(row.noticeId)
          }
        }
    }
};
</script>

<style scoped lang="scss">
.ws-box-card-height {
    height: 100%;
    ::v-deep .el-card__body {
        height: 100%;
        .ws-box-empty {
            margin-top: -20px;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
        }
    }
}

.content-item {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 6px 6px;
  border-radius: 6px;
  margin-bottom: 8px;
  color: #909399;

  &:hover {
    background-color: #f5f7fa;

    .content-title {
      color: #f05259;
    }
  }

  .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    margin-right: 4px;
  }


  .right{
    flex: 1;

    .content-title {
      word-break: break-all;
      flex: 1;
    }

    display: flex;
    justify-content: space-between;

    .status {
      display: flex;
      text-align: right;
    }
    .user-name {
      margin-left: 12px;
      margin-right: 16px;
      text-align: right;
    }

    .time {
      display: inline-block;
      height: 20px;
      position: relative;

      &::after {
        position: absolute;
        left: -8px;
        top: 4px;
        content: ' ';
        width: 1px;
        height: 14px;
        background: #e4e7ed;
      }
    }
  }
}
.un-read {
    .dot {
      background: #f05259;
    }

    .content-title {
      word-break: break-all;
      color: #303133;
    }
  }

.ws-box-card {
    box-shadow: none;
    border-radius: 8px;
    ::v-deep.el-card__header {
        padding: 11px 16px;
    }
    ::v-deep .el-card__body {
        padding: 10px 20px 10px 16px;
    }

    .ws-box-card-clearfix {
        display: flex;
        justify-content: space-between;
        height: 25px;
    }

    .ws-box-card-content {
        color: #606266;
        .ws-box-card-content-item {
            position: relative;
            display: flex;
            justify-content: space-between;
            padding: 7px 5px;
            margin: 3px 0;
            &:hover {
                background-color: #f5f7fa;
                border-radius: 4px;
                .ws-box-card-content-header {
                    color: #f05259;
                }
            }
        }

        .ws-box-card-content-header {
            flex: 1;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
        }
    }

    .ws-box-card-content-read {
        color: #909399;
    }

    .ws-box-card-content-spot {
        &::after {
            content: '';
            position: absolute;
            right: -6px;
            top: 4px;
            border-radius: 50%;
            width: 9px;
            height: 9px;
            background-color: red;
        }
    }
    .ws-box-card-title {
        display: flex;
        align-items: center;
        color: #303133;
        font-size: 14px;
        font-weight: 500;
    }
    .ws-box-card-content-footer {
        color: #909399;
        .el-divider {
            margin: 0 18px 0 14px;
            background-color: #e4e7ed;
        }
    }
    .ws-box-empty {
        margin: 30px 0;

        img {
            width: 100px;
        }
        p {
            text-align: center;
            font-size: 14px;
            color: #606266;
            margin-top: 10px;
        }
    }
}

</style>
