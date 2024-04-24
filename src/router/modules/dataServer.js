import Layout from '@/layout'
export default [
  {
    path: '/dataServer',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/',
        component: () => import('@/views/dataServer'),
        name: 'dataServer',
        meta: {
          title: '数据中台',
          isMain: true
        }
      },
      {
        path: 'dispatchDataAnalysis',
        component: () => import('@/views/dataServer/dispatchDataAnalysis/dataBoard/index'),
        name: 'dispatchDataAnalysis',
        meta: {
          title: '调度数据看板',
          activeMenu: '/dataServer'
        }
      },
      {
        path: 'tencentTravelOrderAnalysis',
        component: () => import('@/views/dataServer/tencentTravelOrderAnalysis/index'),
        name: 'tencentTravelOrderAnalysis',
        meta: {
          title: '出行订单分析',
          activeMenu: '/dataServer'
        }
      },
      {
        path: 'unusualOrder',
        component: () => import('@/views/dataServer/unusualOrder/index'),
        name: 'unusualOrder',
        meta: {
          title: '异常订单明细',
          activeMenu: '/dataServer'
        }
      },
      {
        path: 'dispatchCountDetails',
        component: () => import('@/views/dataServer/dispatchDataAnalysis/dataBoard/generalDispatchDataKanban/dispatchCountDetails'),
        name: 'dispatchCountDetails',
        meta: {
          title: '调度次数明细表',
          activeMenu: '/dataServer'
        }
      },
      // 乘客类 充值送活动分析
      {
        path: 'rechargeActivity',
        component: () => import('@/views/dataServer/passengersClass/rechargeActivity'),
        name: 'rechargeActivity',
        meta: {
          title: '充值送活动分析',
          activeMenu: '/dataServer',
          isMain: true
        }
      },
      // 乘客类 机构推荐分析
      {
        path: 'orgRecommend',
        component: () => import('@/views/dataServer/passengersClass/orgRecommend'),
        name: 'orgRecommend',
        meta: {
          title: '机构推荐分析',
          activeMenu: '/dataServer',
          isMain: true
        }
      },
      {
        path: 'orderAnalysis',
        component: () => import('@/views/dataServer/orderAnalysis'),
        name: 'orderAnalysis',
        meta: {
          title: '订单分析',
          activeMenu: '/dataServer',
          isMain: true
        }
      },
      {
        path: 'orderAnalysisCancelDetail',
        component: () => import('@/views/dataServer/orderAnalysis/cancel/cancelDetail'),
        name: 'orderAnalysisCancelDetail',
        meta: {
          title: '司机取消次数',
          activeMenu: '/dataServer',
          isMain: true
        }
      },
      {
        path: 'conversionDetail',
        component: () => import('@/views/dataServer/orderAnalysis/conversion/conversionDetail'),
        name: 'conversionDetail',
        meta: {
          title: '司机取消次数',
          activeMenu: '/dataServer',
          isMain: true
        }
      },
      //全局最优调度分析
      {
        path: 'optimalAnalysis',
        component: () => import('@/views/dataServer/optimalAnalysis/dataBoard/index'),
        name: 'optimalAnalysis',
        meta: {
          title: '全局最优调度分析',
          activeMenu: '/dataServer',
          isMain: true
        }
      },
      // 司机类  司机分析
      {
        path: 'driverAnalysis',
        component: () => import('@/views/dataServer/driveClass/driverAnalysis'),
        name: 'driverAnalysis',
        meta: {
          title: '未入网司机分析',
          activeMenu: '/dataServer',
          isMain: true
        }
      },
      {
        path: 'annualData',
        component: () => import('@/views/dataServer/driveClass/annualData'),
        name: 'annualData',
        meta: {
          title: '司机年度数据',
          activeMenu: '/dataServer',
          isMain: true
        }
      },
      {
        path: 'annualData/form',
        component: () => import('@/views/dataServer/driveClass/annualData/form'),
        name: 'annualDataForm',
        meta: {
          title: '司机年度数据',
          activeMenu: '/dataServer',
          isMain: true
        }
      },
      // 机构类 电商销售分析
      {
        path: 'retailersOnline',
        component: () => import('@/views/dataServer/retailersOnline/index'),
        name: 'retailersOnline',
        meta: {
          title: '本地生活统计',
          activeMenu: '/dataServer',
          isMain: true
        }
      },
      // 电商类-全国业绩分析
      {
        path: 'performanceAnalysis',
        component: () => import('@/views/dataServer/performanceAnalysis'),
        name: 'performanceAnalysis',
        meta: {
          title: '全国业绩分析',
          activeMenu: '/dataServer',
          isMain: true
        }
      },
      // 机构类 智能客服
      {
        path: 'customerService',
        component: () => import('@/views/dataServer/customer-service/index'),
        name: 'customerServiceComponent',
        meta: {
          title: '智能客服分析',
          activeMenu: '/dataServer',
          isMain: true
        }
      },
      // 包干分析
      {
        path: 'vipAnalysis',
        component: () => import('@/views/dataServer/vipAnalysis/index'),
        name: 'vipAnalysis',
        meta: {
          title: '包干分析',
          activeMenu: '/dataServer',
          isMain: true
        }
      },
      // 特许经营费分析
      {
        path: 'vipIncome',
        component: () => import('@/views/dataServer/vipIncome/index'),
        name: 'vipIncome',
        meta: {
          title: '特许经营费分析',
          activeMenu: '/dataServer',
          isMain: true
        }
      },
      // 会员数分析
      {
        path: 'vipCount',
        component: () => import('@/views/dataServer/vipCount/index'),
        name: 'vipCount',
        meta: {
          title: '会员数分析',
          activeMenu: '/dataServer',
          isMain: true
        }
      },
      // 推广员类  推广员分析
      {
        path: 'promoterAnalysis',
        component: () => import('@/views/dataServer/promoter/analysis/index.vue'),
        name: 'promoterAnalysis',
        meta: {
          title: '推广员分析',
          activeMenu: '/dataServer',
          isMain: true
        }
      },
      //供应商数据分析
      {
        path: 'SupplierAnalysis',
        component: () => import('@/views/dataServer/SupplierAnalysis/index'),
        name: 'SupplierAnalysis',
        meta: {
          title: '供应商数据分析',
          activeMenu: '/dataServer',
          isMain: true
        }
      },
      // 本地生活类 电商商品分析
      {
        path: 'commodityAnalysis',
        name: 'commodityAnalysis',
        component: () => import('@/views/dataServer/ecommerceAnalytics/commodityAnalysis/index.vue'),
        meta: {
          title: '电商商品分析',
          activeMenu: '/dataServer',
          isMain: true
        }
      },
      // 本地生活类 电商搜索词分析
      {
        path: 'searchTermAnalysis',
        name: 'searchTermAnalysis',
        component: () => import('@/views/dataServer/ecommerceAnalytics/searchTermAnalysis/index.vue'),
        meta: {
          title: '电商搜索词分析',
          activeMenu: '/dataServer',
          isMain: true
        }
      },
      //车生活数据看板
      {
        path: 'carLifeDataBoard',
        component: () => import('@/views/dataServer/carLifeDataBoard/dataBoard/index'),
        name: 'carLifeDataBoard',
        meta: {
          title: '车生活数据看板',
          activeMenu: '/dataServer',
          isMain: true,
          keepAlive: true
        }
      },
      // 综合运营类-实体店基本情况
      {
        path: 'storeInfo',
        component: () => import('@/views/dataServer/synthesizeOperations/storeInfo/index'),
        name: 'storeInfo',
        meta: {
          title: '实体店基本情况',
          activeMenu: '/dataServer',
          isMain: true,
          keepAlive: true
        }
      },
      // 综合运营类-实体店运营分析
      {
        path: 'storeAnalysis',
        component: () => import('@/views/dataServer/synthesizeOperations/storeAnalysis/index'),
        name: 'storeAnalysis',
        meta: {
          title: '实体店运营分析',
          activeMenu: '/dataServer',
          isMain: true,
          keepAlive: true
        }
      },
      {
        path: 'institutionalIncome',
        component: () => import('@/views/dataServer/institutionalIncome/index.vue'),
        name: 'institutionalIncome',
        meta: {
          title: '机构收入',
          activeMenu: '/dataServer'
        }
      },
      // 智慧生活类 全量业务录入统计
      {
        path: 'sellPerformance',
        component: () => import('@/views/dataServer/sellPerformance/index'),
        name: 'sellPerformance',
        meta: {
          title: '全量业务录入统计',
          activeMenu: '/dataServer',
          isMain: true
        }
      }
    ]
  }
]
