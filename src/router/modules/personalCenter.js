import Layout from '@/layout'
export default [
  {
    path: '/personalCenter',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/personalCenter',
        component: () => import('@/views/personalCenter/'),
        name: 'personalCenter',
        meta: {
          title: '个人中心',
          isMain: true
        }
      },
      {
        path: '/cashOut',
        component: () => import('@/views/personalCenter/personInfo/cashOut.vue'),
        name: 'cashOut',
        meta: {
          title: '提现',
          isMain: true,
          activeMenu: '/personalCenter',
          activeTags: 'personalCenter'
        }
      },
      {
        path: '/applyStore',
        component: () => import('@/views/personalCenter/personInfo/applyStore.vue'),
        name: 'applyStore',
        meta: {
          title: '新增实体店',
          isMain: true,
          activeMenu: '/personalCenter',
          activeTags: 'personalCenter'
        }
      },
      {
        path: '/personMgrInfo',
        component: () => import('@/views/personalCenter/personMgr/personMgrInfo.vue'),
        name: 'personMgrInfo',
        meta: {
          title: '人员管理详情',
          isMain: true,
          activeMenu: '/personalCenter',
          activeTags: 'personalCenter'
        }
      },
      {
        path: '/bankCardMgr',
        component: () => import('@/views/personalCenter/bankCardMgr/form.vue'),
        name: 'bankCardMgr',
        meta: {
          title: '银行卡管理',
          isMain: true,
          activeMenu: '/personalCenter',
          activeTags: 'personalCenter'
        }
      },
      {
        path: '/branchCompany',
        component: () => import('@/views/personalCenter/personInfo/form/branchCompany.vue'),
        name: 'branchCompany',
        meta: {
          title: '一级机构',
          isMain: true,
          activeMenu: '/personalCenter',
          activeTags: 'personalCenter'
        }
      },
      {
        path: '/serviceCentre',
        component: () => import('@/views/personalCenter/personInfo/form/serviceCentre.vue'),
        name: 'serviceCentre',
        meta: {
          title: '二级机构',
          isMain: true,
          activeMenu: '/personalCenter',
          activeTags: 'personalCenter'
        }
      },
      {
        path: '/physicalStore',
        component: () => import('@/views/personalCenter/personInfo/form/physicalStore.vue'),
        name: 'physicalStore',
        meta: {
          title: '实体店',
          isMain: true,
          activeMenu: '/personalCenter',
          activeTags: 'personalCenter'
        }
      },
      {
        path: '/personMatEdit',
        component: () => import('@/views/personalCenter/personMat/edit.vue'),
        name: 'personMatEdit',
        meta: {
          title: '个人资料-编辑',
          isMain: true,
          activeMenu: '/personalCenter',
          activeTags: 'personalCenter'
        }
      }
    ]
  }
]
