import Layout from '@/layout'
export default [
  {
    path: '/technology',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/technology/index.vue'),
        name: 'technology',
        meta: {
          title: '技术中台',
          isMain: true
        }
      },
      {
        path: 'captcha',
        component: () => import('@/views/technology/retrieveCaptcha/index.vue'),
        name: 'captcha',
        meta: {
          title: '司机找回验证码'
        }
      },
      {
        path: 'information',
        component: () => import('@/views/technology/queryInformation/index.vue'),
        name: 'information',
        meta: {
          title: '身份证查询司机信息'
        }
      },
      {
        path: 'oaDeploy',
        component: () => import('@/views/technology/oaDeploy/index.vue'),
        name: 'oaDeploy',
        meta: {
          title: 'oa功能配置',
          activeMenu: '/technology',
          isMain: true
        }
      },
      {
        path: 'systemInfo',
        component: () => import('@/views/technology/systemInfo/index.vue'),
        name: 'systemInfo',
        meta: {
          title: '系统信息管理'
        }
      },
      {
        path: 'systemDetail',
        component: () => import('@/views/technology/oaDeploy/index.vue'),
        name: 'systemDetail',
        meta: {
          title: '系统信息管理',
          activeMenu: '/technology',
          activeTags: 'systemInfo'
        }
      },
      {
        path: 'systemInfo/h5Edit',
        component: () => import('@/views/technology/systemInfo/h5Edit/index.vue'),
        name: 'systemInfoH5Edit',
        meta: {
          title: '万顺云办公外链',
          activeMenu: '/technology'
        }
      },
      {
        path: 'deeplinkMenu',
        component: () => import('@/views/technology/deeplinkMenu/index.vue'),
        name: 'deeplinkMenu',
        meta: {
          title: 'deeplink菜单',
          activeMenu: '/technology',
          isMain: true
        }
      },
      {
        path: 'deeplinkMenu/passenger',
        component: () => import('@/views/technology/deeplinkMenu/passenger.vue'),
        name: 'passenger',
        meta: {
          title: '乘客deeplink',
          activeMenu: '/technology',
          isMain: true
        }
      },
      {
        path: 'deeplinkMenu/driver',
        component: () => import('@/views/technology/deeplinkMenu/driver.vue'),
        name: 'driver',
        meta: {
          title: '司机deeplink',
          activeMenu: '/technology',
          isMain: true
        }
      },
      {
        path: 'deeplinkMenu/driverForm',
        component: () => import('@/views/technology/deeplinkMenu/driverForm.vue'),
        name: 'driverForm',
        meta: {
          title: 'driverForm',
          activeTags: 'driver',
          isMain: true
        }
      },
      {
        path: 'deeplinkMenu/djDriver',
        component: () => import('@/views/technology/deeplinkMenu/djDriver.vue'),
        name: 'djDriver',
        meta: {
          title: '代驾司机deeplink',
          activeMenu: '/technology',
          isMain: true
        }
      },
      {
        path: 'deeplinkMenu/djDriverForm',
        component: () => import('@/views/technology/deeplinkMenu/djDriverForm.vue'),
        name: 'djDriverForm',
        meta: {
          title: 'djDriverForm',
          activeTags: 'djDriver',
          isMain: true
        }
      },
      {
        path: 'deeplinkMenu/passengerForm',
        component: () => import('@/views/technology/deeplinkMenu/passengerForm.vue'),
        name: 'passengerForm',
        meta: {
          title: 'passengerForm',
          activeTags: 'passenger',
          isMain: true
        }
      },
      {
        path: 'appletMenu',
        component: () => import('@/views/technology/appletMenu/index.vue'),
        name: 'appletMenu',
        meta: {
          title: '小程序OP管理',
          activeMenu: '/technology',
          isMain: true
        }
      },
      {
        path: 'appletDetail',
        component: () => import('@/views/technology/oaDeploy/index.vue'),
        name: 'appletDetail',
        meta: {
          title: '系统信息管理',
          activeMenu: '/technology',
          activeTags: 'appletMenu'
        }
      }
    ]
  }
]
