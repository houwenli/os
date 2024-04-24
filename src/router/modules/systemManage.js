import Layout from '@/layout'
export default [
  {
    path: '/systemManage',
    component: Layout,
    hidden: true,
    meta: {
      title: '系统管理'
    },
    children: [
      {
        path: '/',
        component: () => import('@/views/systemManage'),
        name: 'systemManage',
        meta: {
          isMain: true,
          title: '系统管理'
        }
      },
      {
        path: 'personnel',
        name: 'personnel',
        component: () => import('@/views/systemManage/personnel/index.vue'),
        meta: {
          title: '账号管理',
          activeMenu: '/systemManage'
        }
      },
      {
        path: 'personnel/add',
        component: () => import('@/views/systemManage/personnel/form.vue'),
        name: 'personnelAdd',
        meta: {
          title: '新增人员',
          activeMenu: '/systemManage',
          activeTags: 'personnel'
        }
      },
      {
        path: 'organization',
        component: () => import('@/views/systemManage/organization/list.vue'),
        name: 'organization',
        meta: {
          title: '组织管理',
          activeMenu: '/systemManage'
        }
      },
      {
        path: 'institutionalOrganization',
        component: () => import('@/views/systemManage/institutionalOrganization/list.vue'),
        name: 'institutionalOrganization',
        meta: {
          title: '机构组织管理',
          activeMenu: '/workbench'
        }
      },
      {
        path: 'operateLog',
        component: () => import('@/views/systemManage/operateLog'),
        name: 'operateLog',
        meta: {
          title: '操作日志',
          activeMenu: '/systemManage'
        }
      },
      {
        path: 'loginLog',
        component: () => import('@/views/systemManage/loginLog'),
        name: 'loginLog',
        meta: {
          title: '登录日志',
          activeMenu: '/systemManage'
        }
      },
      {
        path: 'appLog',
        component: () => import('@/views/systemManage/appLog'),
        name: 'appLog',
        meta: {
          title: '万顺云登录日志',
          activeMenu: '/systemManage'
        }
      },
      {
        path: 'analysis',
        component: () => import('@/views/systemManage/analysis'),
        name: 'analysis',
        meta: {
          title: '系统登录分析',
          activeMenu: '/systemManage'
        }
      },
      {
        path: 'role',
        component: () => import('@/views/systemManage/role'),
        name: 'role',
        meta: {
          title: '角色权限',
          activeMenu: '/systemManage'
        }
      },
      {
        path: 'role/form',
        component: () => import('@/views/systemManage/role/form.vue'),
        name: 'RoleForm',
        meta: {
          title: '角色管理',
          activeMenu: '/systemManage',
          activeTags: 'role'
        }
      },
      // 角色管理详情
      {
        path: 'role/detail',
        component: () => import('@/views/systemManage/role/detail.vue'),
        name: 'roleDetail',
        meta: {
          title: '角色管理',
          activeMenu: '/systemManage',
          activeTags: 'role'
        }
      },
      {
        path: 'role/roleDetails',
        component: () => import('@/views/systemManage/role/roleAccountDetails.vue'),
        name: 'RoleDetails',
        meta: {
          title: '账号详情',
          activeMenu: '/systemManage',
          activeTags: 'role'
        }
      },
      {
        path: 'accountGroup',
        component: () => import('@/views/systemManage/accountGroup/list.vue'),
        name: 'accountGroup',
        meta: {
          title: '账号组管理',
          activeMenu: '/systemManage'
        }
      },
      {
        path: 'accountGroup/manageGroups',
        component: () => import('@/views/systemManage/accountGroup/manageGroups.vue'),
        name: 'accountGroupManageGroups',
        meta: {
          title: '管理组员',
          activeMenu: '/systemManage',
          activeTags: 'accountGroup'
        }
      },
      // 废弃-全局未搜索到
      {
        path: 'accountGroup/manageGroups/add',
        component: () => import('@/views/systemManage/accountGroup/membersManage.vue'),
        name: 'addManageGroups',
        meta: {
          title: '添加组员',
          activeMenu: '/systemManage',
          activeTags: 'accountGroup'
        }
      },
      {
        path: 'accountGroup/details',
        component: () => import('@/views/systemManage/accountGroup/details.vue'),
        name: 'accountGroupDetails',
        meta: {
          title: '详情',
          activeMenu: '/systemManage',
          activeTags: 'accountGroup'
        }
      },
      {
        path: 'authorization',
        component: () => import('@/views/systemManage/authorization/list.vue'),
        name: 'authorization',
        meta: {
          title: '职务授权',
          activeMenu: '/systemManage'
        }
      },
      {
        path: 'authorization/add',
        component: () => import('@/views/systemManage/authorization/authorizationAdd.vue'),
        name: 'authorizationAdd',
        meta: {
          title: '职务授权新增',
          activeMenu: '/systemManage',
          activeTags: 'authorization'
        }
      },
      {
        path: 'authorization/detail',
        component: () => import('@/views/systemManage/authorization/authorizationDetail.vue'),
        name: 'authorizationDetail',
        meta: {
          title: '职务授权详情',
          activeMenu: '/systemManage',
          activeTags: 'authorization'
        }
      },
      {
        path: 'taskFlow',
        component: () => import('@/views/systemManage/taskFlow/list.vue'),
        name: 'taskFlow',
        meta: {
          title: '工作流管理',
          activeMenu: '/systemManage'
        }
      },
      {
        path: 'taskFlow/add',
        component: () => import('@/views/systemManage/taskFlow/add.vue'),
        name: 'addTaskFlow',
        meta: {
          title: '工作流管理新增',
          activeMenu: '/systemManage',
          activeTags: 'taskFlow'
        }
      },
      {
        path: 'taskFlow/detail',
        component: () => import('@/views/systemManage/taskFlow/detail.vue'),
        name: 'flowDetail',
        meta: {
          title: '工作流管理详情',
          activeMenu: '/systemManage',
          activeTags: 'systemInfo'
        }
      },
      {
        path: 'accountDetail',
        component: () => import('@/views/systemManage/authorization/accountDetail.vue'),
        name: 'accountDetail',
        meta: {
          title: '账号详情',
          activeMenu: '/systemManage',
          activeTags: 'authorization'
        }
      },
      {
        path: 'complaint',
        component: () => import('@/views/systemManage/complaint/list.vue'),
        name: 'complaint',
        meta: {
          title: '投诉管理'
        }
      },
      {
        path: 'complaintDetails',
        component: () => import('@/views/systemManage/complaint/form.vue'),
        name: 'complaintDetails',
        meta: {
          title: '投诉管理',
          // activeMenu: '/systemManage',
          activeTags: 'complaint'
        }
      },
      {
        path: 'telephoneManage',
        component: () => import('@/views/systemManage/telephoneManage/index.vue'),
        name: 'telephoneManage',
        meta: {
          title: '通讯录权限',
          activeMenu: '/systemManage',
          isMain: true
          // keepAlive: true,
        }
      },
      {
        path: 'telephoneManage/friendManage',
        component: () => import('@/views/systemManage/telephoneManage/friendManage/list.vue'),
        name: 'friendManageList',
        meta: {
          title: '好友列表',
          activeMenu: '/systemManage',
          activeTags: 'telephoneManage'
        }
      },
      {
        path: 'telephoneManage/applicationRecord',
        component: () => import('@/views/systemManage/telephoneManage/friendManage/record.vue'),
        name: 'applicationRecordList',
        meta: {
          title: '申请记录',
          activeMenu: '/systemManage',
          activeTags: 'telephoneManage'
        }
      }
    ]
  }
]
