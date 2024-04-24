/*
 * @Author: DaiYu
 * @Date: 2022-03-04 10:58:36
 * @LastEditors: DaiYu
 * @LastEditTime: 2022-05-11 09:03:21
 * @FilePath: \main\src\router\modules\baoganManage.js
 */
export default [
    {
        path: 'baoganManage',
        component: () => import('@/views/workbench/baoganManage'),
        name: 'baoganManage',
        meta: {
            title: '平台包干管理',
            activeMenu: '/workbench',
            isMain: true,
            isNestRoute: true
        }
        // 使用子路由，三级路由缓存问题？？
        // children: baoganManage
    },
    {
        path: 'baoganManage/priceSet/list', // 认证包干价格设置
        name: 'priceSet',
        component: () => import('@/views/workbench/baoganManage/priceSet/list'),
        meta: {
            title: '认证包干价格设置',
            activeMenu: '/workbench',
            isNestRoute: true,
            keepAlive: true,
            activeTags: 'baoganManage'
        }
    },
    {
        path: 'baoganManage/priceSet/form',
        name: 'priceSetForm',
        component: () => import('@/views/workbench/baoganManage/priceSet/form'),
        meta: {
            title: '认证包干价格详情',
            activeMenu: '/workbench',
            activeTags: 'baoganManage'
        }
    },
    {
        path: 'baoganManage/priceSet/batchImport', // 批量导入
        name: 'priceSetBatchImport',
        component: () => import('@/views/workbench/baoganManage/priceSet/batchImport'),
        meta: { title: '认证包干价格设置批量导入', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },
    {
        path: 'baoganManage/localPriceSet/list', // 本地包干价格设置
        name: 'localPriceSet',
        component: () => import('@/views/workbench/baoganManage/localPriceSet/list'),
        meta: {
            title: '本地包干价格设置',
            activeMenu: '/workbench',
            isNestRoute: true,
            keepAlive: true,
            activeTags: 'baoganManage'
        }
    },
    {
        path: 'baoganManage/localPriceSet/form',
        name: 'localPriceSetForm',
        component: () => import('@/views/workbench/baoganManage/localPriceSet/form'),
        meta: {
            title: '本地包干价格详情',
            activeMenu: '/workbench',
            activeTags: 'baoganManage'
        }
    },
    {
        path: 'baoganManage/localPriceSet/batchImport', // 批量导入
        name: 'localPriceSetBatchImport',
        component: () => import('@/views/workbench/baoganManage/localPriceSet/batchImport'),
        meta: { title: '本地包干价格设置批量导入', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },
    {
        path: 'baoganManage/ruleSet/list', // 认证包干规则设置
        name: 'ruleSet',
        component: () => import('@/views/workbench/baoganManage/ruleSet/list'),
        meta: {
            title: '认证包干规则设置',
            activeMenu: '/workbench',
            isNestRoute: true,
            keepAlive: true,
            breadcrumb: false,
            activeTags: 'baoganManage'
        }
    },
    {
        path: 'baoganManage/ruleSet/form',
        name: 'ruleSetForm',
        component: () => import('@/views/workbench/baoganManage/ruleSet/form'),
        meta: { title: '认证包干规则设置详情', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },
    {
        path: 'baoganManage/ruleSet/batchImport', // 批量导入
        name: 'ruleSetBatchImport',
        component: () => import('@/views/workbench/baoganManage/ruleSet/batchImport'),
        meta: { title: '认证包干规则设置批量导入', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },

    {
        path: 'baoganManage/localRuleSet/list', // 本地包干规则设置
        name: 'localRuleSet',
        component: () => import('@/views/workbench/baoganManage/localRuleSet/list'),
        meta: {
            title: '本地包干规则设置',
            activeMenu: '/workbench',
            isNestRoute: true,
            keepAlive: true,
            breadcrumb: false,
            activeTags: 'baoganManage'
        }
    },
    {
        path: 'baoganManage/localRuleSet/form',
        name: 'localRuleSetForm',
        component: () => import('@/views/workbench/baoganManage/localRuleSet/form'),
        meta: { title: '本地包干规则设置详情', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },
    {
        path: 'baoganManage/localRuleSet/batchImport', // 批量导入
        name: 'localRuleSetBatchImport',
        component: () => import('@/views/workbench/baoganManage/localRuleSet/batchImport'),
        meta: { title: '本地包干规则设置批量导入', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },
    {
        path: 'baoganManage/localDriver/batchImport', // 认证包干批量赠送
        name: 'localDriverBatchImport',
        component: () => import('@/views/workbench/baoganManage/localDriver/batchImport'),
        meta: { title: '批量赠送', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },

    {
        path: 'baoganManage/driver/list', // 司机包干管理
        name: 'driverBgList',
        component: () => import('@/views/workbench/baoganManage/driver/list'),
        meta: {
            title: '司机包干账户',
            activeMenu: '/workbench',
            keepAlive: true,
            breadcrumb: false,
            activeTags: 'baoganManage'
        }
    },
    {
        path: 'baoganManage/driver/form',
        name: 'driverBgForm',
        component: () => import('@/views/workbench/baoganManage/driver/form'),
        meta: { title: '司机包干账户详情', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },
    {
        path: 'baoganManage/driver/batchImport', // 认证包干批量赠送
        name: 'driverBatchImport',
        component: () => import('@/views/workbench/baoganManage/driver/batchImport'),
        meta: { title: '批量赠送', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },
    {
        path: 'baoganManage/driver/batchMatch', // 批量匹配
        name: 'batchMatch',
        component: () => import('@/views/workbench/baoganManage/driver/batchMatch'),
        meta: { title: '批量匹配', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },
    {
        path: 'baoganManage/runningwater/list', // 包干流水记录
        name: 'runningwaterList',
        component: () => import('@/views/workbench/baoganManage/runningwater/list'),
        meta: {
            title: '包干流水记录',
            activeMenu: '/workbench',
            keepAlive: true,
            breadcrumb: false,
            activeTags: 'baoganManage'
        }
    },
    {
        path: 'baoganManage/runningwater/form',
        name: 'runningwaterForm',
        component: () => import('@/views/workbench/baoganManage/runningwater/form'),
        meta: { title: '包干流水详情', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },
    {
        path: 'baoganManage/runningwater/batchImport', // 批量退款
        name: 'refundBatchImport',
        component: () => import('@/views/workbench/baoganManage/runningwater/batchImport'),
        meta: { title: '批量退款', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },
    {
        path: 'baoganManage/refundConfig', // 包干退款设置
        name: 'refundConfig',
        component: () => import('@/views/workbench/baoganManage/refundConfig'),
        meta: {
            title: '包干退款设置',
            activeMenu: '/workbench',
            // keepAlive: true,
            breadcrumb: false,
            activeTags: 'baoganManage'
        }
    },
    {
        path: 'baoganManage/adjustRecord/list', // 认证包干调账记录
        name: 'adjustRecordList',
        component: () => import('@/views/workbench/baoganManage/adjustRecord/list'),
        meta: {
            title: '账户调账记录',
            activeMenu: '/workbench',
            keepAlive: true,
            breadcrumb: false,
            activeTags: 'baoganManage'
        }
    },
    {
        path: 'baoganManage/adjustRecord/local', // 本地包干调账记录
        name: 'adjustRecordLocal',
        component: () => import('@/views/workbench/baoganManage/adjustRecord/local'),
        meta: {
            title: '账户调账记录',
            activeMenu: '/workbench',
            keepAlive: true,
            breadcrumb: false,
            activeTags: 'baoganManage'
        }
    },
    {
        path: 'baoganManage/localLifeContractEntry', // 本地生活包干录入
        name: 'localLifeContractEntry',
        component: () => import('@/views/workbench/baoganManage/localLifeContractEntry/list'),
        meta: {
            title: '账户调账记录',
            activeMenu: '/workbench',
            keepAlive: true,
            breadcrumb: false,
            activeTags: 'baoganManage'
        }
    },
    {
        path: 'baoganManage/localLifeContractEntry/add', // 本地生活包干录入新增
        name: 'localLifeContractEntryAdd',
        component: () => import('@/views/workbench/baoganManage/localLifeContractEntry/add'),
        meta: { title: '本地生活包干录入详情', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },
    {
        path: 'baoganManage/localLifeContractEntry/form', // 本地生活包干录入详情/退款
        name: 'localLifeContractEntryForm',
        component: () => import('@/views/workbench/baoganManage/localLifeContractEntry/form'),
        meta: { title: '本地生活包干录入详情', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },
    {
        path: 'baoganManage/localDriver/list', // 本地司机包干账户
        name: 'localDriverBgList',
        component: () => import('@/views/workbench/baoganManage/localDriver/list'),
        meta: {
            title: '本地司机包干账户',
            activeMenu: '/workbench',
            keepAlive: true,
            breadcrumb: false,
            activeTags: 'baoganManage'
        }
    },
    {
        path: 'baoganManage/localDriver/form',
        name: 'localDriverBgForm',
        component: () => import('@/views/workbench/baoganManage/localDriver/form'),
        meta: { title: '本地司机包干账户详情', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },

    {
        path: 'baoganManage/runningwaterLocal/list', // 本地司机包干流水记录
        name: 'runningwaterLocalList',
        component: () => import('@/views/workbench/baoganManage/runningwaterLocal/list'),
        meta: {
            title: '本地司机包干流水',
            activeMenu: '/workbench',
            keepAlive: true,
            breadcrumb: false,
            activeTags: 'baoganManage'
        }
    },
    {
        path: 'baoganManage/runningwaterLocal/form', // 本地司机包干流水-详情
        name: 'runningwaterLocalForm',
        component: () => import('@/views/workbench/baoganManage/runningwaterLocal/form'),
        meta: { title: '本地司机包干流水详情', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },
    {
        path: 'baoganManage/runningwaterLocal/batchImport', // 本地司机包干流水-批量退款
        name: 'runningwaterLocalRefundBatch',
        component: () => import('@/views/workbench/baoganManage/runningwaterLocal/batchImport'),
        meta: { title: '本地司机批量退款', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },

    // 代驾包干
    {
        path: 'baoganManage/drivingPriceSet/list', // 代驾包干价格设置
        name: 'drivingPriceSet',
        component: () => import('@/views/workbench/baoganManage/drivingPriceSet/list'),
        meta: {
            title: '代驾包干价格设置',
            activeMenu: '/workbench',
            isNestRoute: true,
            keepAlive: true,
            activeTags: 'baoganManage'
        }
    },
    {
        path: 'baoganManage/drivingPriceSet/form',
        name: 'drivingPriceSetForm',
        component: () => import('@/views/workbench/baoganManage/drivingPriceSet/form'),
        meta: {
            title: '代驾包干价格详情',
            activeMenu: '/workbench',
            activeTags: 'baoganManage'
        }
    },
    {
        path: 'baoganManage/drivingPriceSet/batchImport', // 批量导入
        name: 'drivingPriceSetBatchImport',
        component: () => import('@/views/workbench/baoganManage/drivingPriceSet/batchImport'),
        meta: { title: '代驾包干价格设置批量导入', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },
    {
        path: 'baoganManage/drivingRuleSet/list', // 代驾包干规则设置
        name: 'drivingRuleSet',
        component: () => import('@/views/workbench/baoganManage/drivingRuleSet/list'),
        meta: {
            title: '代驾包干规则设置',
            activeMenu: '/workbench',
            isNestRoute: true,
            keepAlive: true,
            breadcrumb: false,
            activeTags: 'baoganManage'
        }
    },
    {
        path: 'baoganManage/drivingRuleSet/form',
        name: 'drivingRuleSetForm',
        component: () => import('@/views/workbench/baoganManage/drivingRuleSet/form'),
        meta: { title: '代驾包干规则设置详情', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },
    {
        path: 'baoganManage/drivingRuleSet/batchImport', // 批量导入
        name: 'drivingRuleSetBatchImport',
        component: () => import('@/views/workbench/baoganManage/drivingRuleSet/batchImport'),
        meta: { title: '代驾包干规则设置批量导入', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },
    {
        path: 'baoganManage/drivingDriver/list', // 代驾司机包干账户
        name: 'drivingDriverBgList',
        component: () => import('@/views/workbench/baoganManage/drivingDriver/list'),
        meta: {
            title: '代驾司机包干账户',
            activeMenu: '/workbench',
            keepAlive: true,
            breadcrumb: false,
            activeTags: 'baoganManage'
        }
    },
    {
        path: 'baoganManage/drivingDriver/form',
        name: 'drivingDriverBgForm',
        component: () => import('@/views/workbench/baoganManage/drivingDriver/form'),
        meta: { title: '代驾司机包干账户详情', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },

    {
        path: 'baoganManage/runningwaterDriving/list', // 代驾司机包干流水记录
        name: 'runningwaterDrivingList',
        component: () => import('@/views/workbench/baoganManage/runningwaterDriving/list'),
        meta: {
            title: '代驾司机包干流水',
            activeMenu: '/workbench',
            keepAlive: true,
            breadcrumb: false,
            activeTags: 'baoganManage'
        }
    },
    {
        path: 'baoganManage/runningwaterDriving/form', // 代驾司机包干流水-详情
        name: 'runningwaterDrivingForm',
        component: () => import('@/views/workbench/baoganManage/runningwaterDriving/form'),
        meta: { title: '代驾司机包干流水详情', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },
    {
        path: 'baoganManage/runningwaterDriving/batchImport', // 代驾司机包干流水-批量退款
        name: 'runningwaterDrivingRefundBatch',
        component: () => import('@/views/workbench/baoganManage/runningwaterDriving/batchImport'),
        meta: { title: '代驾司机批量退款', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },
    // 代驾App包干流水
    {
        path: 'baoganManage/runningwaterApp/list', // 代驾App包干流水记录
        name: 'runningwaterAppList',
        component: () => import('@/views/workbench/baoganManage/runningwaterApp/list'),
        meta: {title: '代驾App包干流水', activeMenu: '/workbench', keepAlive: true, breadcrumb: false, activeTags: 'baoganManage'}
    },
    {
        path: 'baoganManage/runningwaterApp/form', // 代驾App包干流水-详情
        name: 'runningwaterAppForm',
        component: () => import('@/views/workbench/baoganManage/runningwaterApp/form'),
        meta: { title: '代驾App包干流水详情', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },
    {
        path: 'baoganManage/wisdom/list', // 智慧本地司机包干流水记录
        name: 'wisdomList',
        component: () => import('@/views/workbench/baoganManage/wisdom/list'),
        meta: {title: '智慧本地司机包干流水', activeMenu: '/workbench', keepAlive: true, breadcrumb: false, activeTags: 'baoganManage'}
    },
    {
        path: 'baoganManage/wisdom/form', // 智慧本地司机包干流水-详情
        name: 'wisdomForm',
        component: () => import('@/views/workbench/baoganManage/wisdom/form'),
        meta: { title: '智慧本地司机包干流水详情', activeMenu: '/workbench', activeTags: 'baoganManage' }
    },
    {
        path: 'baoganManage/cityVipFeeConfig', // 城市会员费配置
        name: 'cityVipFeeConfig',
        component: () => import('@/views/workbench/baoganManage/cityVipFeeConfig/index'),
        meta: {title: '城市会员费配置', activeMenu: '/workbench', keepAlive: true, breadcrumb: false, activeTags: 'baoganManage'}
    },
    /**
     * 司机减佣卡
     */
    {
        path: 'baoganManage/priceConfig', // 减佣卡价格配置
        name: 'priceConfig',
        component: () => import('@/views/workbench/baoganManage/kickbackCard/priceConfig/index.vue'),
        meta: {title: '减佣卡价格配置', activeMenu: '/workbench', keepAlive: true, breadcrumb: false, activeTags: 'baoganManage'}
    },
    {
        path: 'baoganManage/priceConfig/edit', // 减佣卡价格配置
        name: 'priceConfigEdit',
        component: () => import('@/views/workbench/baoganManage/kickbackCard/priceConfig/form.vue'),
        meta: {title: '减佣卡价格编辑', activeMenu: '/workbench', breadcrumb: false, activeTags: 'baoganManage'}
    },
    {
        path: 'baoganManage/priceConfig/batchImport', // 减佣卡价格配置
        name: 'priceConfigBatchImport',
        component: () => import('@/views/workbench/baoganManage/kickbackCard/priceConfig/batchImport.vue'),
        meta: {title: '减佣卡价格配置导入', activeMenu: '/workbench', breadcrumb: false, activeTags: 'baoganManage'}
    },
    {
        path: 'baoganManage/accountMag', // 减佣卡账户管理
        name: 'accountMag',
        component: () => import('@/views/workbench/baoganManage/kickbackCard/accountMag/index.vue'),
        meta: {title: '减佣卡账户管理', activeMenu: '/workbench', keepAlive: true, breadcrumb: false, activeTags: 'baoganManage'}
    },
    {
        path: 'baoganManage/accountMag/detail', // 减佣卡账户管理详情
        name: 'accountMagDetail',
        component: () => import('@/views/workbench/baoganManage/kickbackCard/accountMag/detail.vue'),
        meta: {title: '减佣卡账户管理详情', activeMenu: '/workbench', breadcrumb: false, activeTags: 'baoganManage'}
    },
    {
        path: 'baoganManage/accountDetail', // 减佣卡账户明细
        name: 'kickbackCardDetail',
        component: () => import('@/views/workbench/baoganManage/kickbackCard/accountDetail/index.vue'),
        meta: {title: '减佣卡账户明细', activeMenu: '/workbench', keepAlive: true, breadcrumb: false, activeTags: 'baoganManage'}
    },
    {
        path: 'baoganManage/orderMag', // 减佣卡订单管理
        name: 'orderMag',
        component: () => import('@/views/workbench/baoganManage/kickbackCard/orderMag/index.vue'),
        meta: {title: '减佣卡订单管理', activeMenu: '/workbench', keepAlive: true, breadcrumb: false, activeTags: 'baoganManage'}
    },
    {
        path: 'baoganManage/orderMag/detail', // 减佣卡订单管理详情
        name: 'orderMagDetail',
        component: () => import('@/views/workbench/baoganManage/kickbackCard/orderMag/detail.vue'),
        meta: {title: '详情', activeMenu: '/workbench', breadcrumb: false, activeTags: 'baoganManage'}
    },
    /** end */
]
