import Layout from '@/layout'
export default [
  {
    path: '/personalComplaint',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/',
        component: () => import('@/views/personalComplaint'),
        name: 'personalComplaint',
        meta: {
          title: '个人投诉',
          isMain: true
        }
      }
    ]
  }
]
