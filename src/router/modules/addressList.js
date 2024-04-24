import Layout from '@/layout'
export default [
  {
    path: '/mailList',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/mailList',
        component: () => import('@/views/im/mailList'),
        name: 'mailList',
        meta: {
          title: '通讯录',
          isMain: true
        }
      }
    ]
  }
]
