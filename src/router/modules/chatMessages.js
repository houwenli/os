// 消息中心
import Layout from '@/layout'
export default [
  {
    path: '/chat',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/chat',
        component: () => import('@/views/im/chat'),
        name: 'chat',
        meta: {
          title: '消息中心',
          isMain: true
        }
      }
    ]
  }
]
