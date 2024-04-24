import Layout from '../../layout/index.vue'
export default [
  {
    path: '',
    component: Layout,
    hidden: true,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/home'),
        name: 'index',
        meta: {
          title: '首页',
          isMain: true
        }
      },
      {
        path: 'powerApply',
        component: () => import('@/views/home/powerApply'),
        name: 'powerApply',
        meta: {
          title: '权限申请',
          activeMenu: '/index',
          isMain: true,
          activeTags: 'index'
        }
      },
      {
        path: 'quitApply',
        component: () => import('@/views/home/quitApply'),
        name: 'quitApply',
        meta: {
          title: '离职申请',
          activeMenu: '/index',
          isMain: true,
          activeTags: 'index'
        }
      },
      {
        path: 'pendingList',
        component: () => import('@/views/home/auditFlow/pending/index.vue'),
        name: 'pendingList',
        meta: {
          title: '待办详情',
          activeMenu: '/index',
          isMain: true,
          keepAlive: true //缓存上一次searchOption里的查找字段
        }
      },
      {
        path: 'handleList',
        component: () => import('@/views/home/auditFlow/handleList'),
        name: 'handleList',
        meta: {
          title: '审批处理记录',
          activeMenu: '/index',
          isMain: true,
          keepAlive: true,
          activeTags: '/handleList'
        }
      },
      {
        path: 'pendingAndApproval',
        component: () => import('@/views/home/auditFlow/pending/pendingAndApproval.vue'),
        name: 'pendingAndApproval',
        meta: {
          title: '审核详情或处理详情',
          isMain: true,
          activeMenu: '/index',
          activeTags: 'allApprovalList'
        }
      },
      {
        path: 'administrationApproval',
        component: () => import('@/views/home/auditFlow/pending/administrationApproval'),
        name: 'administrationApproval',
        meta: {
          title: '行政审批',
          isMain: true,
          activeMenu: '/index'
        }
      },
      {
        path: 'needApproval',
        component: () => import('@/views/home/auditFlow/pending/needApproval'),
        name: 'needApproval',
        meta: {
          title: '需求审批',
          isMain: false,
          activeMenu: '/index',
          activeTags: '/pendingList'
        }
      },
      {
        path: 'approvalSendRecord',
        component: () => import('@/views/home/auditFlow/approvalSendRecord/index.vue'),
        name: 'approvalSendRecord',
        meta: {
          title: '审批发起记录',
          activeMenu: '/index',
          isMain: true,
          keepAlive: true
        }
      },
      {
        path: 'carbonCopyList',
        component: () => import('@/views/home/auditFlow/carbonCopyList/index.vue'),
        name: 'carbonCopyList',
        meta: {
          title: '抄送给我的',
          activeMenu: '/index',
          isMain: true,
          keepAlive: true
        }
      },
      {
        path: 'allApprovalRecord',
        component: () => import('@/views/home/auditFlow/allApprovalRecord/index.vue'),
        name: 'allApprovalList',
        meta: {
          title: '全部审批记录',
          isMain: true,
          keepAlive: true
        }
      },
      {
        path: 'approvalProcess',
        component: () => import('@/views/home/auditFlow/approvalProcess/index.vue'),
        name: 'approvalProcess',
        meta: {
          title: '流程节点记录',
          activeMenu: '/index',
          isMain: true
        }
      },
      {
        path: 'workflowRules',
        component: () => import('@/views/home/auditFlow/workflowRules'),
        name: 'workflowRules',
        meta: {
          title: '工作流规则',
          activeMenu: '/index',
          isMain: true
        }
      },
      {
        path: 'sosDetail',
        component: () => import('@/views/home/auditFlow/sosDetail'),
        name: 'sosDetail',
        meta: {
          title: '求救详情',
          activeMenu: '/index',
          isMain: true
        }
      },
      {
        path: 'noticeList',
        component: () => import('@/views/home/notice/index'),
        name: 'noticeList',
        meta: {
          title: '信息公告',
          activeMenu: '/index',
          isMain: true
        }
      },
      {
        path: 'knowledgeList',
        component: () => import('@/views/home/knowledge'),
        name: 'knowledgeList',
        meta: {
          title: '知识园地',
          activeMenu: '/index',
          isMain: true
        }
      },
      {
        path: 'policy',
        component: () => import('@/views/home/policy/index'),
        name: 'policy',
        meta: {
          title: '公司文件',
          activeMenu: '/index',
          isMain: true,
          keepAlive: true
        }
      },
      {
        path: 'policy/detail',
        component: () => import('@/views/home/policy/detail'),
        name: 'policyDetail',
        meta: {
          title: '详情',
          activeMenu: '/index',
          isMain: true
        }
      },
      {
        path: 'policy/readDetail',
        component: () => import('@/views/home/policy/readDetail'),
        name: 'readDetail',
        meta: {
          title: '阅读详情',
          activeMenu: '/index',
          isMain: true
        }
      },
      {
        path: 'policy/commentDetail',
        component: () => import('@/views/home/policy/commentDetail'),
        name: 'commentDetail',
        meta: {
          title: '留言详情',
          activeMenu: '/index',
          isMain: true
        }
      },
      {
        path: 'policy/thumbsDetail',
        component: () => import('@/views/home/policy/thumbsDetail'),
        name: 'thumbsDetail',
        meta: {
          title: '点赞详情',
          activeMenu: '/index',
          isMain: true
        }
      },
      {
        path: 'policy/commentDetail/detail',
        component: () => import('@/views/home/policy/replydetail'),
        name: 'orgNewsInfoNoticeCommentDetail',
        meta: {
          title: '留言详情',
          activeMenu: '/index',
          isMain: true
        }
      },
      {
        path: 'conference',
        component: () => import('@/views/home/conference'),
        name: 'conference',
        meta: {
          title: '会议通知',
          activeMenu: '/index',
          isMain: true
        }
      },
      {
        path: 'conference/detailNotice',
        component: () => import('@/views/home/conference/detailNotice'),
        name: 'detailNotice',
        meta: {
          title: '通知详情',
          activeMenu: '/index',
          isMain: true
        }
      },
      {
        path: 'conference/detailLetter',
        component: () => import('@/views/home/conference/detailLetter'),
        name: 'detailLetter',
        meta: {
          title: '通知详情',
          activeMenu: '/index',
          isMain: true
        }
      },
      {
        path: 'conference/detailPersonal',
        component: () => import('@/views/home/conference/detailPersonal'),
        name: 'detailPersonal',
        meta: {
          title: '通知详情',
          activeMenu: '/index',
          isMain: true
        }
      },
      {
        path: 'currencyApply',
        component: () => import('@/views/home/currencyApply'),
        name: 'currencyApply',
        meta: {
          title: '通用审批',
          activeMenu: '/index',
          isMain: true,
          activeTags: 'index'
        }
      },
      {
        path: 'applySuccess',
        component: () => import('@/components/ApplySuccess'),
        name: 'applySuccess',
        meta: {
          title: '审批提交成功',
          activeMenu: '/index',
          isMain: true,
          activeTags: 'index'
        }
      },
      {
        path: 'orgOpenApply',
        component: () => import('@/views/home/orgOpenApply'),
        name: 'orgOpenApply',
        meta: {
          title: '机构开业申请',
          activeMenu: '/index',
          isMain: true
        }
      },
      {
        path: 'addBranchCompany',
        component: () => import('@/views/home/addBranchCompany/form'),
        name: 'addBranchCompany',
        meta: {
          title: '新增分公司',
          activeMenu: '/index',
          isMain: true,
          activeTags: 'index'
        }
      },
      {
        path: 'addServiceCentre',
        component: () => import('@/views/home/addServiceCentre/form'),
        name: 'addServiceCentre',
        meta: {
          title: '新增服务中心',
          activeMenu: '/index',
          isMain: true,
          activeTags: 'index'
        }
      },
      {
        path: 'addPhysicalStore',
        component: () => import('@/views/home/addPhysicalStore/form'),
        name: 'addPhysicalStore',
        meta: {
          title: '新增实体店',
          activeMenu: '/index',
          isMain: true,
          activeTags: 'index'
        }
      },
      {
        path: 'addLegalCompany',
        component: () => import('@/views/home/addLegalCompany/form'),
        name: 'addLegalCompany',
        meta: {
          title: '新增独立法人公司',
          activeMenu: '/index',
          isMain: true,
          activeTags: 'index'
        }
      },
      {
        path: 'addLegalCompanySign',
        component: () => import('@/views/home/addLegalCompanySign/form'),
        name: 'addLegalCompanySign',
        meta: {
          title: '独法公司签约',
          activeMenu: '/index',
          isMain: true,
          activeTags: 'index'
        }
      },
      {
        path: 'cardcouponApply',
        component: () => import('@/views/home/cardcoupon'),
        name: 'cardcouponApply',
        meta: {
          title: '卡券申请',
          activeMenu: '/index',
          isMain: true,
          activeTags: 'index'
        }
      },
      {
        path: 'welfareApply',
        component: () => import('@/views/home/welfare'),
        name: 'welfareApply',
        meta: {
          title: '福卡申请',
          activeMenu: '/index',
          isMain: true,
          activeTags: 'index'
        }
      },
      {
        path: 'workFlow',
        component: () => import('@/views/workFlow/index.vue'),
        name: 'workFlow',
        meta: {
          title: '审核详情或处理详情',
          activeMenu: '/index',
          isMain: true,
          activeTags: 'allApprovalList'
        }
      }
    ]
  }
]
