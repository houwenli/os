import Layout from '@/layout'

// 万顺福
export default [
  {
    path: '/shopping-mall-business',
    component: Layout,
    children: [
      {
        path: '',
        name: 'shoppingMallBusiness',
        component: () => import("@/views/shopping-mall-business/index.vue"),
        meta: {
          title: '万顺福',
          isMain: true
        },
      }
    ]
  },
]