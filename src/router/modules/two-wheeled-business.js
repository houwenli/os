import Layout from '@/layout'

export default [
  {
    path: '/two-wheeled-business',
    component: Layout,
    children: [
      {
        path: '',
        name: 'twoWheeled',
        component: () => import("@/views/two-wheeled-business/index.vue"),
        meta: {
          title: '两轮车',
          isMain: true
        },
      }
    ]
  },
]