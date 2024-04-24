import Layout from '@/layout'
export default [
  {
    path: '/dogcart',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/dogcart/qualityTesting',
        component: () => import('@/views/dogcart/qualityTesting'),
        name: 'qualityTesting',
        meta: {
          title: '两轮车质检记录',
          isMain: true
        }
      }
    ]
  }
]
