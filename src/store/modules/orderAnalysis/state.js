const state = {
    // 内容区域宽度（用于菜单展开重新渲染图表）
    areaWidth: null,
    userInfo: {},

    userArea: {}, // 用户区域

    primaryInstitutions: [], // 一级机构

    fileList: [], // 文件列表

    userCompany: [],

    dimFilters: [
        { value: ' 司机类型', id: 1 },
        { value: ' 运管类型', id: 2 },
        { value: ' 车主类型', id: 3 }
    ],

    vipTypeFilters: [
        { value: ' 无效包干', id: 0 },
        { value: ' 有效包干', id: 1 },
        { value: ' 非包干', id: 2 }
    ],

    trafficFilters: [
        { value: 'A类司机', id: 0 },
        { value: 'B类司机', id: 1 },
        { value: 'C类司机', id: 2 },
        { value: 'D类司机', id: 3 }
    ],

    partnerFilters: [
        { value: '普通车主', id: 1 },
        { value: '共享合伙人', id: 2 },
        { value: '高级合伙人', id: 3 }
    ],
    orderLevelFilters: [
        { value: '不限', id: 0 },
        { value: '正常', id: 1 },
        { value: '疑似风险', id: 2 }
    ],
    activeStatusFilters: [
        { value: '已失效', id: 0 },
        { value: '已生效', id: 1 },
        { value: '待提交', id: 2 },
        { value: '待生效', id: 4 },
        { value: '待审核', id: 6 }
    ],
    severTypeFilters: [
        { value: '实时订单', id: 20 },
        { value: '预约订单', id: 21 },
        { value: '扫码起单', id: 22 }
    ],
    rewardContentFilters: [{ value: '金额奖励', id: 1 }],
    promoteStateFilters: [
        { value: '小推广码', id: 1 },
        { value: '大推广码', id: 2 },
        { value: '海报', id: 3 }
    ],
    staffStateFilters: [
        { value: '司机', id: 1 },
        { value: '推广员', id: 2 }
    ],
    exportTypeFilters: [
        { value: '按城市维度导出', id: 1 },
        { value: '按实体店维度导出', id: 2 },
        { value: '按日期维度导出', id: 3 },
        { value: '按一级机构维度导出', id: 4 }
    ]
};

export default state;
