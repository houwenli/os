export default [
    // {
    //     path: 'assetInventory',
    //     component: () => import('@/views/workbench/assetInventory'),
    //     name: 'assetInventory',
    //     meta: {
    //         title: '运力资产盘点',
    //         activeMenu: '/workbench',
    //         isMain: true,
    //         isNestRoute: true,
    //     },
    // },
    {
        path: 'assetInventory/assetReport/list',
        name: 'assetReportList',
        component: () => import('@/views/workbench/assetInventory/assetReport/list'),
        meta: {
            title: '运力资产上报',
            activeMenu: '/workbench',
            isNestRoute: true,
            keepAlive: true,
            activeTags: 'assetInventory',
        },
    },
    {
        path: 'assetInventory/assetReport/form',
        name: 'assetReportForm',
        component: () => import('@/views/workbench/assetInventory/assetReport/form'),
        meta: {
            title: '详情',
            activeMenu: '/workbench',
            isNestRoute: true,
            keepAlive: true,
            activeTags: 'assetInventory',
        },
    },
    // {
    //     path: 'assetInventory/infoReport/list',
    //     name: 'infoReportList',
    //     component: () => import('@/views/workbench/assetInventory/infoReport/list'),
    //     meta: {
    //         title: '运力信息上报',
    //         activeMenu: '/workbench',
    //         isNestRoute: true,
    //         keepAlive: true,
    //         activeTags: 'assetInventory',
    //     },
    // },
    // {
    //     path: 'assetInventory/infoReport/batchImport',
    //     name: 'infoReportBatchImport',
    //     component: () => import('@/views/workbench/assetInventory/infoReport/batchImport'),
    //     meta: {
    //         title: '批量导入',
    //         activeMenu: '/workbench',
    //         isNestRoute: true,
    //         keepAlive: true,
    //         activeTags: 'assetInventory',
    //     },
    // },
]