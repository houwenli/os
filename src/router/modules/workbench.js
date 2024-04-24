import Layout from '@/layout'
import baoganManage from './baoganManage'
import assetInventory from './assetInventory'
export default [
  {
    path: '/workbench',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/',
        component: () => import('@/views/workbench'),
        name: 'workbench',
        meta: {
          title: '工作台',
          isMain: true
        }
      },
      {
        path: 'BRorder',
        component: () => import('@/views/workbench/order'),
        name: 'BRorder',
        meta: {
          title: '自主下单',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true,
          keepAlive: true
        }
      },
      {
        // 自主下单司机列表
        path: 'placeOrder/drivers',
        name: 'placeOrderDrivers',
        component: () => import('@/views/workbench/order/placeOrder/drivers'),
        meta: {
          title: '司机列表',
          activeMenu: '/workbench',
          isMain: true,
          // isNestRoute: true,
          activeTags: 'BRorder'
        }
      },
      {
        //实时订单详情
        path: 'real-time/form',
        name: 'realTimeForm',
        component: () => import('@/views/workbench/order/real-time/form'),
        meta: {
          title: '实时订单详情',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true
        }
      },
      {
        //预约订单详情
        path: 'subscribe/form',
        name: 'subscribeForm',
        component: () => import('@/views/workbench/order/subscribe/form'),
        meta: {
          title: '预约订单详情',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true
        }
      },
      {
        //扫码订单详情
        path: 'scan-code/form',
        name: 'scanCodeForm',
        component: () => import('@/views/workbench/order/scan-code/form'),
        meta: {
          title: '扫码订单详情',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true
        }
      },
      {
        //村村通司机订单 - 详情
        path: 'free-ride/form',
        name: 'orderFreeRideForm',
        component: () => import('@/views/workbench/order/free-ride/form'),
        meta: {
          title: '司机订单详情',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true
        }
      },
      {
        //包车订单详情
        path: 'charter/form',
        name: 'charterForm',
        component: () => import('@/views/workbench/order/charter/form'),
        meta: {
          title: '包车订单详情',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true
        }
      },
      {
        path: 'BRcharterPrice',
        component: () => import('@/views/workbench/charterPrice/index'),
        name: 'BRcharterPrice',
        meta: {
          title: '企业后台下单包车计价',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true,
          keepAlive: true
        }
      },
      {
        path: 'charterValuationForm',
        component: () => import('@/views/workbench/charterPrice/form'),
        name: 'charterValuationForm',
        meta: {
          title: '包车计价详情',
          activeMenu: '/workbench',
          isMain: true,
          activeTags: 'BRcharterPrice'
        }
      },
      {
        path: 'DLdownLoad',
        component: () => import('@/views/workbench/downLoad/index'),
        name: 'DLdownLoad',
        meta: {
          title: '文件下载',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true
        }
      },
      {
        path: 'DJdownLoad',
        component: () => import('@/views/workbench/djdownLoad/index'),
        name: 'DJdownLoad',
        meta: {
          title: '代驾文件下载',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true
        }
      },
      {
        path: 'BRintercityLine',
        component: () => import('@/views/workbench/intercityLine'),
        name: 'intercityLineFence',
        meta: {
          title: '专线围栏管理',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true,
          keepAlive: true
        }
      },
      {
        // 围栏详情
        path: 'BRintercityLine/form',
        name: 'intercityLineFenceForm',
        component: () => import('@/views/workbench/intercityLine/fence/form.vue'),
        meta: {
          title: '专线围栏管理详情',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true
        }
      },
      {
        // 围栏编辑
        path: 'BRintercityLine/edit',
        name: 'intercityLineFenceEdit',
        component: () => import('@/views/workbench/intercityLine/fence/edit.vue'),
        meta: {
          title: '围栏编辑',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true
        }
      },
      {
        // 计价管理详情
        path: 'valuation/form',
        name: 'intercityLineValuationForm',
        component: () => import('@/views/workbench/intercityLine/valuation/form.vue'),
        meta: {
          title: '计价管理详情',
          activeMenu: '/workbench',
          isMain: true,
          activeTags: 'intercityLineFence'
        }
      },
      {
        path: 'BRtrackQuery',
        component: () => import('@/views/workbench/trackquery'),
        name: 'BRtrackQuery',
        meta: {
          title: '轨迹查询',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true
        }
      },
      ...baoganManage,
      ...assetInventory,
      {
        // 疫情防控菜单
        path: 'BRepidemicControl',
        name: 'epidemicControl',
        component: () => import('@/views/workbench/epidemicControl'),
        meta: {
          title: '疫情防控',
          activeMenu: '/workbench',
          // isMain: true,
          isNestRoute: true,
          keepAlive: true
        }
      },
      {
        path: 'BRepidemicControl/edit',
        name: 'epidemicControlEdit',
        component: () => import('@/views/workbench/epidemicControl/form.vue'),
        meta: {
          title: '疫情防控详情',
          activeMenu: '/workbench',
          activeTags: 'epidemicControl'
        }
      },
      {
        path: 'BRepidemicControl/monitorEdit',
        name: 'monitorEdit',
        component: () => import('@/views/workbench/epidemicControl/monitorForm.vue'),
        meta: {
          title: '防疫监控详情',
          activeMenu: '/workbench',
          activeTags: 'epidemicControl'
        }
      },
      {
        path: 'whiteList',
        name: 'whiteList',
        component: () => import('@/views/workbench/epidemicControl/whiteList'),
        meta: {
          title: '白名单',
          activeMenu: '/workbench',
          activeTags: 'whiteList',
          isNestRoute: true
        }
      },
      {
        path: 'batchFileUp',
        name: 'batchFileUp',
        component: () => import('@/views/workbench/epidemicControl/batchFileUp'),
        meta: {
          title: '黑白名单批量上传',
          activeMenu: '/workbench',
          activeTags: 'whiteList',
          isNestRoute: true
        }
      },
      {
        // 车主更换身份
        path: 'BRdriverTransfer',
        name: 'driverTransfer',
        component: () => import('@/views/workbench/driverTransfer'),
        meta: {
          title: '司机更换身份',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true
        }
      },
      {
        // 车主更换身份新增，编辑，详情
        path: 'BRdriverTransfer/edit',
        name: 'driverTransferEdit',
        component: () => import('@/views/workbench/driverTransfer/form'),
        meta: {
          title: '车主更换身份',
          activeMenu: '/workbench',
          isMain: true,
          activeTags: 'BRdriverTransfer'
        }
      },
      {
        path: 'BRrequirement',
        name: 'BRrequirement',
        meta: {
          title: '需求申请',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true,
          keepAlive: true
        },
        component: () => import('@/views/workbench/requirement/list')
      },
      {
        path: 'BRrequirement/draft',
        name: 'BRrequirementdraft',
        meta: {
          title: '需求管理草稿箱',
          auth: true,
          isMain: true,
          isNestRoute: true
        },
        component: () => import('@/views/workbench/requirement/draftbox')
      },
      {
        path: 'BRrequirement/detail',
        name: 'BRrequirementdetail',
        meta: {
          title: '需求管理详情',
          auth: true,
          isMain: true,
          isNestRoute: true
        },
        component: () => import('@/views/workbench/requirement/requirementDetail')
      },
      {
        // 城市合伙人列表
        path: 'BRcityCreator',
        component: () => import('@/views/workbench/cityCreator/tableList'),
        name: 'BRcityCreator',
        meta: {
          title: '机构人员管理',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true,
          keepAlive: false
        }
      },
      {
        path: 'cityCreatorForm',
        component: () => import('@/views/workbench/cityCreator/formContent'),
        name: 'cityCreatorForm',
        meta: {
          title: '城市合伙人详情',
          activeMenu: '/workbench',
          isMain: true,
          activeTags: 'BRcityCreator'
        }
      },
      {
        path: 'cityCreatorAdjustPosition',
        component: () => import('@/views/workbench/cityCreator/adjustPositionInfo'),
        name: 'cityCreatorAdjustPosition',
        meta: {
          title: '城市合伙人职务调整',
          activeMenu: '/workbench',
          isMain: true,
          activeTags: 'BRcityCreator'
        }
      },
      {
        path: 'leavePosition',
        component: () => import('@/views/workbench/cityCreator/leavePosition'),
        name: 'leavePosition',
        meta: {
          title: '城市合伙人离职',
          activeMenu: '/workbench',
          isMain: true,
          activeTags: 'BRcityCreator'
        }
      },
      {
        path: 'createPeople',
        component: () => import('@/views/workbench/cityCreator/createPeople'),
        name: 'createPeople',
        meta: {
          title: '调整城市合伙人',
          activeMenu: '/workbench',
          isMain: true,
          activeTags: 'BRcityCreator'
        }
      },
      {
        // 推广员管理
        path: 'BRpromoterMgr',
        component: () => import('@/views/workbench/promoterMgr/index'),
        name: 'BRpromoterMgr',
        meta: {
          title: '推广员管理',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true,
          keepAlive: true
        }
      },
      {
        //业务咨询名单列表
        path: 'businessConsultation',
        component: () => import('@/views/workbench/businessConsultation/index'),
        name: 'businessConsultationList',
        meta: {
          title: '业务咨询名单',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true,
          keepAlive: false
        }
      },
      {
        //业务咨询名单新增、编辑
        path: 'businessConsultationEdit',
        component: () => import('@/views/workbench/businessConsultation/form.vue'),
        name: 'businessConsultationEdit',
        meta: {
          title: '业务咨询名单详情',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true,
          keepAlive: false,
          activeTags: 'businessConsultation'
        }
      },
      {
        path: 'OMfirstOrgManage',
        component: () => import('@/views/workbench/OMfirstOrgManage/index.vue'),
        name: 'OMfirstOrgManage',
        meta: {
          title: '一级机构等级管理',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true,
          keepAlive: true
        }
      },
      {
        path: 'transportMap',
        component: () => import('@/views/workbench/transport-map'),
        name: 'transportMap',
        meta: {
          title: '运力图谱',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true,
          activeTags: 'transportMap'
        }
      },
      {
        path: 'transportMap/cityMap',
        //市订单分布图
        component: () => import('@/views/workbench/transport-map/cityMap'),
        name: 'cityMap',
        meta: {
          title: '运力图谱',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true,
          activeTags: 'transportMap'
        }
      },
      {
        // 人事异动记录
        path: 'personnelChangeRecord',
        component: () => import('@/views/workbench/personnelChangeRecord/index.vue'),
        name: 'personnelChangeRecord',
        meta: {
          title: '城市合伙人异动记录',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true,
          keepAlive: false
        }
      },
      {
        path: 'orgPostMange',
        component: () => import('@/views/workbench/orgPostMange/index.vue'),
        name: 'orgPostMange',
        meta: {
          title: '机构职务管理',
          activeMenu: '/workbench'
        }
      },
      {
        path: 'orderMap',
        component: () => import('@/views/workbench/order-map/index.vue'),
        name: 'orderMap',
        meta: {
          title: '订单分布图',
          activeMenu: '/workbench',
          isMain: true,
          isNestRoute: true
        }
      },
      {
        path: 'orderMap/offLine',
        component: () => import('@/views/workbench/order-map/offLine/index.vue'),
        name: 'orderMapOffLine',
        meta: {
          title: '订单分布图(历史)',
          activeMenu: '/workbench',
          breadcrumb: false,
          activeTags: 'orderMap'
        }
      },
      {
        path: 'orderMap/offLine/city',
        component: () => import('@/views/workbench/order-map/offLine/cityMap.vue'),
        name: 'orderCityMapOffLine',
        meta: {
          title: '订单分布图(历史)',
          activeMenu: '/workbench',
          breadcrumb: false,
          activeTags: 'orderMap'
        }
      },
      {
        path: 'orderMap/dispatch',
        component: () => import('@/views/workbench/order-map/dispatch/index.vue'),
        name: 'orderMapDispatch',
        meta: {
          title: '订单人工调度',
          activeMenu: '/workbench',
          breadcrumb: false,
          activeTags: 'orderMap'
        }
      },
      {
        path: 'orderMap/dispatch/city',
        component: () => import('@/views/workbench/order-map/dispatch/cityMap.vue'),
        name: 'orderCityMapDispatch',
        meta: {
          title: '订单人工调度',
          activeMenu: '/workbench',
          breadcrumb: false,
          activeTags: 'orderMap'
        }
      },
      {
        path: 'orderMap/dispatchLog',
        component: () => import('@/views/workbench/order-map/dispatch-log/index.vue'),
        name: 'dispatchLog',
        meta: {
          title: '人工调度记录',
          activeMenu: '/workbench',
          breadcrumb: false,
          activeTags: 'orderMap'
        }
      },
      {
        path: 'conference/management',
        component: () => import('@/views/workbench/conference/management.vue'),
        name: 'conferenceManagement',
        meta: {
          title: '会议管理',
          activeMenu: '/workbench'
        }
      },
      {
        path: 'conference/managmentForm',
        component: () => import('@/views/workbench/conference/managmentForm.vue'),
        name: 'conferenceManagementForm',
        meta: {
          title: '会议管理详情',
          activeMenu: '/workbench'
        }
      },
      {
        path: 'conference/conferee',
        component: () => import('@/views/workbench/conference/conferee.vue'),
        name: 'conferenceConferee',
        meta: {
          title: '参会人员',
          activeMenu: '/workbench'
        }
      },
      {
        path: 'conference/evaluate',
        component: () => import('@/views/workbench/conference/evaluate.vue'),
        name: 'conferenceEvaluate',
        meta: {
          title: '参会人员评价',
          activeMenu: '/workbench'
        }
      },
      {
        path: 'conference/config',
        component: () => import('@/views/workbench/conference/config.vue'),
        name: 'conferenceConfig',
        meta: {
          title: '标签配置',
          activeMenu: '/workbench'
        }
      },
      // 代驾--司机分布图
      {
        path: 'distributionMap',
        component: () => import('@/views/workbench/daijiaDispatch/distributionMap'),
        name: 'distributionMap',
        meta: {
          title: '代驾司机分布图',
          activeMenu: '/workbench',
          isMain: true
        }
      },
      // 代驾--司机分布图 -- 城市
      {
        path: 'distributionMap/city',
        component: () => import('@/views/workbench/daijiaDispatch/cityDistribution'),
        name: 'distributionMapCity',
        meta: {
          title: '代驾司机分布图',
          activeMenu: '/workbench',
          isMain: false,
          activeTags: 'distributionMap'
        }
      },
      // 代驾--订单热区
      {
        path: 'orderHotSpot',
        component: () => import('@/views/workbench/daijiaDispatch/orderHotSpot'),
        name: 'orderHotSpot',
        meta: {
          title: '代驾订单热区',
          activeMenu: '/workbench',
          isMain: true
        }
      },
      {
        path: 'ehr/transferJob',
        name: 'transferJob',
        meta: {
          title: '调岗管理',
          activeMenu: '/systemManage',
          isMain: true,
          isNestRoute: true,
          activeTags: 'BRorder'
        },
        component: () => import('@/views/workbench/ehr/transferJob')
      },
      {
        path: 'ehr/transferJob/form',
        name: 'transferJobForm',
        meta: {
          title: '发起调岗',
          activeMenu: '/systemManage',
          isMain: true
        },
        component: () => import('@/views/workbench/ehr/transferJob/form')
      },
      {
        path: 'ehr/transferJob/detail',
        name: 'transferJobDetail',
        meta: {
          title: '调岗详情',
          activeMenu: '/systemManage',
          isMain: true
        },
        component: () => import('@/views/workbench/ehr/transferJob/detail')
      }
    ]
  }
]
