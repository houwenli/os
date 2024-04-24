<template>
    <div>
        <div class="page-container" style="min-height: 100%">
            <div class="inner-container" style="min-height: 100%">
                <div class="first-level-title">
                    {{ orginalData.noticeTitle }}
                </div>
                <div class="sub-info-container">
                    <div class="left">
                        <span>发布人:</span>
                        <span>{{ orginalData.sendUserName }}</span>
                    </div>
                    <div class="right">
                        <div class="type">
                            {{ orginalData.noticeTypeText }}
                        </div>
                        <div class="time">
                            <span>{{ orginalData.sendTime }}</span>
                        </div>
                    </div>
                </div>

                <!-- 正文 -->
                <div class="content">
                    <rich-text-preview :html='orginalData.noticeContent'  :lazy='false'></rich-text-preview>
                </div>
                <div class="article-footer">
                    <div class="right">
                        <img class="eye-icon" src="../../../assets/icons/login_icon_visible@2x.png" alt="" />
                        <span class="read-count">{{ orginalData.readNumber || 0 }}人已读</span>

                        <div class="likes" @click="onLike">
                            <img src="../../../assets/icons/msg_icon_favour2@2x.png" alt="" v-show="orginalData.praiseType === 1" />
                            <img src="../../../assets/icons/msg_icon_favour1@2x.png" alt="" v-show="orginalData.praiseType === 0" />
                            <span>{{ orginalData.praiseNumber || 0 }}</span>
                        </div>
                    </div>
                </div>
                <!-- 分割线 -->
                <div class="articel-division-line"></div>
                <template v-if="orginalData.attachmentList.length">
                    <div class="attachment-container">
                        <div class="panel-title">附件：</div>

                        <div v-for="(item, index) in orginalData.attachmentList" :key="index" class="attachment-item">
                            <div class="attachment-item-info">
                                <div class="attachment-item-left">
                                    <img src="../../../assets/icons/iconw@2x.png" alt="" />
                                </div>
                                <div class="attachment-item-right">
                                    <div>{{ item.fileName }}</div>
                                    <div class="attachment-size">{{ item.fileSize }}</div>
                                </div>
                            </div>
                            <div class="operate-groups">
                                <span class="operate-btn" @click="onPreview(item.fileUrl)">预览</span>
                                <span class="operate-btn" v-if="orginalData.canDown" @click="onDownload(item)">下载</span>
                            </div>
                        </div>
                    </div>
                </template>

                <!-- 留言 -->
                <div class="comment-container">
                    <div class="panel-title">写留言：</div>
                    <div class="write-comment">
                        <div class="avator avator-me">我</div>
                        <el-input class="write-comment-content" type="textarea" :rows="4" maxlength="300" v-model="comment" placeholder="说点什么吧" show-word-limit></el-input>

                        <el-button type="danger" :disabled="disabledComment" @click="onSendComent">发表</el-button>
                    </div>

                    <div class="panel-title all-comment-title">
                        全部留言：
                        <span>({{ commentList.length }}条)</span>
                    </div>

                    <div class="comment-content">
                        <div class="comment-item" v-for="(item, index) in commentList" :key="index">
                            <!-- 附属信息 -->
                            <div class="comment-sub-info">
                                <div class="avator avator-me">{{ getFirstName(item.userName) }}</div>
                                <div class="right">
                                    <span class="comment-username">{{ item.userName }}</span>
                                    <span class="set-comment-top" v-if="item.top === 1">置顶</span>
                                    <div class="full-dept">{{ item.deptName }}</div>

                                    <!-- 留言正文 -->
                                    <div class="comment-item-content">
                                        <div v-html="item.messageContent"></div>
                                    </div>

                                    <!-- 主留言的时间 -->
                                    <div class="comment-time">{{ showTimeText(item.createTime) }}</div>
                                </div>
                            </div>

                            <!-- 回复信息 -->
                            <div class="reply-list">
                                <div v-for="(replyItem, rIndex) in getCurrentReplyList(item)" :key="rIndex" class="reply-item">
                                    <div class="avator reply-avator">{{ getFirstName(replyItem.userName) }}</div>

                                    <div class="right">
                                        <div class="reply-username">{{ replyItem.userName }}</div>
                                        <div class="full-dept">{{ replyItem.deptName }}</div>
                                        <div class="reply-content">{{ replyItem.messageContent }}</div>
                                        <div class="reply-time">{{ showTimeText(replyItem.createTime) }}</div>
                                    </div>
                                </div>

                                <div class="show-more-reply" @click="onShowAllReply(item)" v-if="item.replyList.length > 3 && !item.show">查看全部{{ item.replyList.length }}条回复</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ws-footer>
            <el-button @click="back" plain>返回</el-button>
        </ws-footer>
    </div>
</template>

<script>
import { getTimeStatus } from './data.js'
import RichTextPreview from 'rich-text-preview'
import axios from 'axios'

export default {
  name: 'messageForm',
  components: {
    RichTextPreview
  },
  data () {
    return {
      orginalData: {
        title: '',
        // 阅读量
        readNumber: '',
        // 点赞量
        praiseNumber: '',
        // 留言量
        replyNumber: '',
        noticeTypeText: '',
        sendUserName: '',
        noticeContent: '',
        // 1-消息通知, 2-政策文件, 3-知识园地
        noticeType: '',
        attachmentList: [],

        // 点赞
        praiseType: '',
        canDown: ''
      },
      // 留言列表
      commentList: [],
      comment: '',
      op: {
        detail: 'informationDetail',
        download: 'announcementDownload',
        fileMarkDownloaded: 'annFileMarkDownloaded',
      },
      URL: '/message/oaInformation/select',
      moduleName: '/index/information',
      id: null,

      // 记录从哪一个页面跳转进入的
      fromPath: ''
    };
  },
   beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.fromPath = from.path
    })
   },
  computed: {
    /**
     * 评论的moduleName
     */
    getCommentModuleName () {
      let moduleName = ''
      switch (this.orginalData.noticeType) {
        case 1:
          moduleName = '/index/information'
          break
        case 2:
          moduleName = '/index/policy'
          break
        default:
          moduleName = '/index/knowledge'
          break
      }

      return moduleName
    },

    disabledComment () {
      if (this.comment && this.comment.trim().length !== 0) {
        return false
      }

      return true
    }
  },
  mounted () {
    const id = this.$route.query.id

    if (id !== undefined) {
      this.id = id
      this.getData()

      this.getCommentList()
    }
  },
  methods: {
    /**
     * 当前时间 - t 小于24H时 就显示 xx小时前
     */
    showTimeText (t) {
      let diff = getTimeStatus(t)

      if (diff <= 24 && diff >= 0) return `${diff}小时前`

      return t
    },
    async getData () {
      let params = {
        data: JSON.stringify({
          id: this.id,
        }),
        op: this.op.detail,
      };

      try {
        const res = await this.$axios(this.URL, params)
        const data = JSON.parse(res.data)

        data.attachmentList = data.attachmentList || []

        data.noticeTypeText = this.getNoticeTypeText(data.noticeType)

        this.orginalData = data
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 查询留言列表
     */
    async getCommentList () {
      let url = this.$getModuleUrl(this.getCommentModuleName, 'allReply')

      let params = {
        op: 'allReply',
        data: {
          // 消息id
          orgNoticeId: this.id
        }
      }
      try {
        const res = await this.$axios(url, params)

        if (res.code === 1) {
          let list = JSON.parse(res.data) || []
          list.forEach(p => {
            p.show = false
          })

          this.commentList = list
        }
      } catch (error) { }
    },

    handleDownload (data) {
      let opt = {
        data: {
          fileId: data.fileId,
          fileName: data.fileName,
        },
        op: this.op.download,
      };
      let recordParam = {
        data: { id: this.orginalData.id },
        op: this.op.fileMarkDownloaded,
      };
      if (this.getModulePower('/index/information').announcementDownload) {
        this.$axios('/message/announcement/update', recordParam);
        this.$downFile(this.URL, opt);
      }
    },

    getNoticeTypeText (type) {
      const typeMap = {
        1: '信息公告',
        2: '公司文件',
        3: '知识园地'
      }

      return typeMap[type]
    },

    getCurrentReplyList (item) {
      if (item.show) {
        return item.replyList
      }

      return item.replyList.filter((p, index) => index < 3)
    },

    back () {
      let pathMap = {
        1: '/noticeList',
        2: '/policy',
        3: '/knowledgeList',
        4: '/conferenceList'
      }

      if (this.fromPath === '/') {
        // 直接返回对应的列表页面-说明在当前页面刷新过
        // 如果详情接口报错，也能直接返回首页
        this.$router.push({ path: pathMap[this.orginalData.noticeType] || '/index' })
        return
      }

      let safeUrl = ['/noticeList', '/index', '/policy', '/knowledgeList', '/conferenceList'].find(p => p === this.fromPath)

      if (safeUrl) {
        this.$router.push({ path: safeUrl });
      } else {
        // 说明从其他子系统或者主应用其他入口 切换过来的
        this.$router.push({ path: pathMap[this.orginalData.noticeType] || '/index' })
      }
    },
    getModuleUrl (op) {
      return this.$getModuleUrl(this.moduleName, op);
    },

    /**
     * 预览文件
     */
    onPreview (url) {
      if (!url) return
      let ext = url.substring(url.lastIndexOf('.'))

      if (ext === '.pdf') {
        window.open(url)
      } else {
        // word ppt excel 直接用 微软的在线预览 如果文件内容是空的，就会报错
        window.open(`https://view.officeapps.live.com/op/view.aspx?src=${url}`)
      }
    },

    async onDownload (item) {
      if (!item.fileUrl) return

      let a = document.createElement('a')

      try {
        let res = await this.getBlob(item.fileUrl)
        a.href = window.URL.createObjectURL(res.data)
        a.download = item.fileName
        a.click()

        window.URL.revokeObjectURL(a.href);
      } catch (error) {
        this.$message.error(error.message || error.msg)
      }

    },

    /**
     * 获取文件流
     */
    getBlob(url) {
      return new Promise((resolve, reject) => {
        axios.get(url, {
          responseType: 'blob'
        }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    /**
     * 展开当前留言全部回复
     */
    onShowAllReply (item) {
      item.show = !item.show
    },


    /**
     * 点赞
     */
    async onLike () {
      let praiseType = this.orginalData.praiseType === 1 ? 0 : 1

      let url = this.$getModuleUrl(this.getCommentModuleName, 'updatePraise')

      let params = {
        op: 'updatePraise',
        data: {
          // 消息id
          orgNoticeId: this.id,
          praiseType: praiseType
        }
      }
      try {
        const res = await this.$axios(url, params)

        if (res.code === 1) {
          this.orginalData.praiseType = praiseType

          this.getData()
        }
      } catch (error) { }
    },

    /**
     * 发送留言
     */
    async onSendComent () {
      let url = this.$getModuleUrl(this.getCommentModuleName, 'addReply')

      let params = {
        op: 'addReply',
        data: {
          // 消息id
          orgNoticeId: this.id,
          messageContent: this.comment.trim(),
          noticeType: this.orginalData.noticeType,
          replyType: 1
        }
      }
      try {
        await this.$axios(url, params)
        this.$message.success('留言成功')
        this.comment = ''

        this.getCommentList()
      } catch (error) { }
    },


    getFirstName (userName) {
      if (userName) {
        return userName.substring(0, 1)
      }
      return ''
    }
  },
};
</script>

<style lang="scss" scoped>
@import './index.scss';
.content {
    position: relative;
    overflow-x: auto;
    // min-height: 500px;
}
</style>

<style lang='scss'>
.content {
    img {
        -webkit-user-drag: none;
    }
}
</style>
