import Layout from '@/layout'
export default [
  {
    path: '/businessSystem',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/',
        component: () => import('@/views/businessSystem'),
        name: 'businessSystem',
        meta: {
          title: '业务系统',
          isMain: true
        }
      }
    ]
  }
]
