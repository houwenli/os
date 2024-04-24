<template>
    <div class="home">
        <!-- 业务申请 -->
        <apply-enter :imgList="imgList" v-if="imgList.length"></apply-enter>
        <!-- 人事异动申请 -->
        <apply-enter :imgList="ehrList" title="人事异动申请" v-if="ehrList.length"></apply-enter>
        <!-- 卡卷申请 -->
        <apply-enter :imgList="activeList" title="活动申请" v-if="activeList.length"></apply-enter>
        
    </div>
</template>

<script>
import ApplyEnter from './components/ApplyEnter';
import TabPane from './components/TabPane.vue';
import InfoCard from './components/InfoCard.vue';
import {mapGetters} from 'vuex';
import { opsEnums } from './auditFlow/allApprovalRecord/data.js';
import {getHomeServesMap} from './data.js'

export default {
    name: 'Home',
    components: {
        TabPane,
        ApplyEnter,
        InfoCard,
    },
    data() {
        return {
            approvalTypeList:[],
            selected: '0',
            moduleName: '/index',
            cardList: [],
            tabList: ['待办详情', '审批处理记录', '审批发起记录', '抄送给我的', '全部审批记录'],
            noticeList: [],
            knowledgeList: [], // 知识园地
            // 政策文件
            policyList: [],
            // 会议通知
            meetingNotice: [],
            meetingNoticeCount: 0,

            knowledgeCount: 0,
            noticeCount: 0,
            policyCount: 0,
            agencyCount: 0,
            // examineCount: 0,
            // handleCount: 0,
            copyCount: 0,
            loading: false,
            activeName: '0',
            menuOptions: [],
            imgList: [],
            ehrList: [],
            activeList: [],
        };
    },
    computed: {
        ...mapGetters('login', ['menuList', 'userInfo']),
    },
    watch: {
        defaultMenuOptions: {
            deep: true,
            immediate: true,
            handler: function (newV) {
                this.imgList = (newV || {}).menuList.filter(item => {
                    return item.resourcesUrl == '/index/business';
                });
                this.ehrList = (newV || {}).menuList.filter(item => {
                    return item.resourcesUrl == '/index/ehrSystem';
                });
                this.menuOptions = (newV || {}).menuList.map(item => {
                    return item.resourcesUrl.substring(7);
                });
                this.activeList = (newV || {}).menuList.filter(item => {
                    return item.resourcesUrl == '/index/activity';
                });
            },
        },
    },

    created() {
        this.getActiveName();
        this.getOpList()
    },
    methods: {
        getOpList() {
          // op 是配置在 首页路由下的
          let res = this.menuList.find(item => item.resourcesUrl === '/index')

          if (!res) return

          // 拿到待办的op列表
          let agencyOps = res.children.find(item => item.resourcesUrl === '/index/todo')
          // 为空 则表示 没有配置全部审批记录这个op
          if (!agencyOps) return

          // 待办里面的所有op
          const allOpList = agencyOps.children || []

          const searchOps = allOpList.find(item => item.resourcesUrl === '/allApprovalRecord/search/ops')

          if (!searchOps) return

          let ops = (searchOps.children || []).map(p => p.op)
          // 基础配置op
          const baseMenuMap=this.$store.getters['login/baseMenuMap']
          ops=[...Object.keys(baseMenuMap),...ops]
          let collections = opsEnums.map(item => {
            const list = item.list.filter(p => ops.includes(p.op))

            return {
              ...item,
              list
            }
          })

          // 只要list 有长度， 说明就是有权限
          const businessTypeList = collections.filter(p => p.list.length)
          // 默认初始化
          this.approvalTypeList =  businessTypeList.map(p => {
              return {
                // 大类
                categoryName: p.id,
                ops: p.list.map(p => p.id)
              }
            })
        },
        getAgencyCount(type, moduleName) {
            const opt = {
                data: {
                    pageSize: 5,
                    currentPage: 1,
                    body: {
                        searchFlag: 'Login',
                        isApprove: '1',
                    },
                },
                op: this.getOP(type, 'count'),
            };
            this.$axios(this.getModuleUrl(opt.op, moduleName), opt).then(res => {
                const { code, data, msg } = res;
                if (code == 1) {
                    this.agencyCount = JSON.parse(data);
                }
            });
        },
        getCopyCount(type, moduleName) {
            const opt = {
                data: {
                    pageSize: 5,
                    currentPage: 1,
                    body: {},
                },
                op: this.getOP(type, 'count'),
            };
            this.$axios(this.getModuleUrl(opt.op, moduleName), opt).then(res => {
                const { code, data } = res;
                if (code == 1) {
                    this.copyCount = JSON.parse(data);
                }
            });
        },
        getActiveName() {
            let opOne = this.getModulePower('/index/todo').hasOwnProperty('todoList').toString();
            let optwo = this.getModulePower('/index/todo').hasOwnProperty('approvalRecord').toString();
            let opthree = this.getModulePower('/index/todo').hasOwnProperty('selectPage').toString();
            let opFour = this.getModulePower('/index/todo').hasOwnProperty('ccTaskList').toString();
            let opfive = this.getModulePower('/index/todo').hasOwnProperty('startRecord').toString();
            let opList = [opOne, optwo, opthree, opFour, opfive];
            if (opList.indexOf('true') >= 0) {
                this.activeName = opList.indexOf('true').toString();
            }
        },
        changeTab() {
            this.selected = this.activeName;
            this.getExamineList(this.selected, '/index/todo');
        },
        getModuleUrl(op, moduleName) {
            return this.$getModuleUrl(moduleName, op);
        },
        /**
         * @description: 获取op
         * @param {*} type 类型
         * @param {*} moduele  模块名称
         * @return {*}
         */
        getOP(type, moduele) {
            return new Map([
                ['list_0', 'todoList'],
                ['list_1', 'approvalRecord'],
                ['list_2', 'selectPage'],
                ['list_3', 'ccTaskList'],
                ['list_4', 'startRecord'],
                ['count_0', 'todoCount'],
                ['count_1', 'myApprovalRecordCount'],
                ['count_2', 'selectCount'],
                ['count_3', 'unreadCount'],
                ['count_4', 'todoCount'],
            ]).get(`${moduele}_${type}`);
        },
        async getExamineList(type, moduleName) {
            this.loading = true;
            this.cardList = [];
            type == 0 ? this.getAgencyCount(type, moduleName) : type == 3 ? this.getCopyCount(type, moduleName) : '';
            let body;
            if (type == 0) {
                body = {
                    searchFlag: 'Login',
                    isApprove: '1',
                };
            } else if (type == 1) {
                body = {
                    searchFlag: 'Login',
                    isApprove: '2',
                    searchType:0
                };
            } else if (type == 2) {
                body = {
                    startUserId: '',
                    startUserName: '',
                    startUserPhone: '',
                    approvalType: '',
                    flowStatus: '',
                    categoryName: '',
                    beginTime: '',
                    endTime: '',
                    approveTimeBegin: '',
                    approveTimeEnd: '',
                };
            } else if (type == 3) {
                body = {
                    startUserId: '',
                    startUserName: '',
                    startUserPhone: '',
                    approvalType: '',
                    categoryName: '',
                    beginTime: '',
                    endTime: '',
                    approveTimeBegin: '',
                    approveTimeEnd: '',
                };
            } else if (type == 4) {
                body = {
                    searchFlag: 'ALL',
                    beginTime: this.$baseMethod.getBeforeDay(-7, 'yyyy-MM-dd 00:00:00'),
                    endTime: this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd 23:59:59'),
                    approvalTypeList:this.approvalTypeList
                };
            }

            const opt = {
                data: {
                    pageSize: 5,
                    currentPage: 1,
                    body,
                },
                op: this.getOP(type, 'list'),
            };

            let list = []

            try {
              // 这里2个是不走鉴权的， 任何用户可以看自己提交的申请和自己审批的申请
              if (type === "1" || type === "2") {
                let {url, op} = getHomeServesMap(type)

                let res = await this._axios(Object.assign(opt.data, {op}), '', url)

                // 审批处理记录是新接口-字段又包了一层
                if (type === "1") {
                  list =  res.data.body
                } else {
                  list = res.data
                }
              } else {
                let {data} = await this.$axios(this.getModuleUrl(opt.op, moduleName), opt)
                list = JSON.parse(data)
              }

              this.cardList = list
            } catch (error) {
              this.cardList = []
            } finally {
              this.loading = false;
            }
        },
        /**
         * @description: 通过type获取列表
         * @param {Number} type 类型
         */
        async getCardList(type, moduleName, op) {
          const url = this.getModuleUrl(op, moduleName)

          if(!url) return

            const params = {
                data: {
                    pageSize: op == 'informationList' ? 12 : 5,
                    currentPage: '',
                    body: {
                        title: null,
                        startTime: '',
                        endTime: '',
                        readStatus: null,
                        noticeType: type,
                    },
                    next: null,
                    pageId: null,
                },
                op
            };

            try {
              let res = await this.$axios(url, params)

              const { code, data} = res;
              if (code == 1) {
                  const body = JSON.parse(data).body;
                  if (body && body.length > 0) {
                      moduleName == '/index/information' && (this.noticeList = body);
                      moduleName == '/index/policy' && (this.policyList = body);
                      moduleName == '/index/knowledge' && (this.knowledgeList = body);
                  }
              }
            } catch (err) {
              console.log(err)
            }
        },

        /**
         * @description: 通过type获取列表数量
         * @param {Number} type
         * @return {Array}
         */
        async getKnowledgeCount(type, moduleName, op) {
          const url = this.getModuleUrl(op, moduleName)

          if(!url) return

            const opt = {
                data: {
                    body: {
                        title: null,
                        startTime: '',
                        endTime: '',
                        readStatus: null,
                        noticeType: type,
                    },
                },
                op,
            };

            try {
              const res = await this.$axios(url, opt)

               const { code, data } = res;
                if (code == 1) {
                    let toObj = JSON.parse(data).count;
                    moduleName == '/index/information' && (this.noticeCount = toObj);
                    moduleName == '/index/policy' && (this.policyCount = toObj);
                    moduleName == '/index/knowledge' && (this.knowledgeCount = toObj);
                }
            } catch (error) {
            }
        },

        //跳转到待办/处理列表时第一条数据的业务类型需要以参数传到列表中，列表默认业务类型值为第一条的业务类型
        toDetail() {
            let cardList = this.cardList;
            let activeName = this.activeName;

            let categoryType = cardList.length > 0 ? (cardList[0] || {}).category : '';
            //如果cardList[0].category不为空就跳对应的业务类型，如果为空就跳网约车业务类型：1
            switch (activeName) {
                case '0':
                    this.$router.push({ name: 'pendingList', query: { busType: categoryType ? categoryType : 1 } });
                    break;
                case '1':
                    this.$router.push({ name: 'handleList', query: { status: '2', busType: categoryType ? categoryType : 1 } });
                    break;
                case '2':
                    this.$router.push({ name: 'approvalSendRecord' });
                    break;
                case '3':
                    this.$router.push({ name: 'carbonCopyList' });
                    break;
                default:
                    this.$router.push({ name: 'allApprovalList' });
                    break;
            }
        },

        /**
         * 查询会议通知
         */
        async getMettingNotice() {
          let url = this.getModuleUrl('conferenceMessageList', '/index/conference')

          if(!url) return
            let params = {
              data: {
                pageSize: 10,
                currentPage: 1,
                body:{
                  confName: '',
                  status: '',
                  dealStatus: '',
                  publishStartTime: '',
                  publishEndTime: ''
                }
              },
              op: 'conferenceMessageList'
            }
          try {
            let res = await this.$axios(url, params)
            let data = JSON.parse(res.data)
            if (data) {
              let list = data.body || []

              list.forEach(item => {
                item.noticeTitle = item.messageTitle
                item.sendUserName = item.publishUserName
                item.sendTime = item.publishTime
                return item
              })

              this.meetingNotice = list
              this.meetingNoticeCount = data.count   || 0
            }
          } catch (error) {
            console.log(error)
          }
        }
    },
};
</script>

<style scoped lang="scss">
.home {
    .ws-box-card-tab {
        position: relative;
        border-radius: 8px;
        box-shadow: none;
        /deep/ .el-tabs__header {
            margin: 0;
        }
        /deep/ .el-card__body {
            min-height: 263px;
            padding: 0;
        }
        /deep/ .el-tabs__content {
            padding: 10px 16px;
        }
        /deep/ .el-tabs__item.is-active {
            color: #f05259;
            font-weight: 500;
        }
        /deep/ .el-tabs__item {
            font-size: 14px;
            font-weight: 400;
            color: #606266;
            margin: 4px 0;
            padding: 0 20px;
        }
        /deep/ .el-tabs__active-bar {
            height: 4px;
        }
        .ws-box-empty {
            text-align: center;
            margin-top: 15px;
            p {
                text-align: center;
                font-size: 14px;
                color: #606266;
            }
        }
    }
    .ws-between {
        display: flex;
        justify-content: space-between;
        margin-top: 16px;

        .ws-between-notice {
            width: 50%;
            margin-right: 10px;
        }

        .ws-between-knowledge {
            width: 50%;
            margin-left: 10px;
        }
    }

    .more-btn {
        position: absolute;
        right: 16px;
        top: 0;
        display: flex;
        align-items: center;
        height: 48px;
        color: #f05259;
        font-size: 12px;
        cursor: pointer;
        z-index: 20;
        overflow: hidden;
        img {
            vertical-align: text-bottom;
        }
    }
}
</style>
