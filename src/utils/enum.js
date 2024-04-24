// 部门类型
export const DEP_TYPE = {
    '1': '总部',
    '2': '分支机构'
}

// 流程状态
export const FLOW_STATUS = {
    '-1': {
        value: '已撤销',
        style: 'background: #f5f7fa;color: #909399;'
    },
    '1': {
        value: '审核通过',
        style: 'background: #e1fef7;color: #2ac39b;'
    },
    '2': {
        value: '审核拒绝',
        style: 'background: #f5f7fa;color: #606266;'
    },
    '3': {
        value: '待审核',
        style: 'background: #fdf6ec;color: #e6a23c;'
    },
    '4': {
        value: '审核中',
        style: 'background: #ecf5ff;color: #409eff;'
    },
    '5': {
        value: '再次审核',
        style: 'background: #fdf6ec;color: #e6a23c;'
    },
    '6': {
        value: '自动审核通过',
        style: 'background: #e1fef7;color: #2ac39b;'
    },
    '7': {
        value: '自动审核拒绝',
        style: 'background: #f5f7fa;color: #606266;'
    }
}
//多人审批方式
export const APPROVAL_STATUS = {
    '1': '依次审批',
    '2': '会签',
    '3': '或签',
    '4': '--'
}

//节点状态
export const NODE_STATUS = {
    '1': {
        value: '审核通过',
        class: 'pass'
    },
    '2': {
        value: '审核拒绝',
        class: 'goback'
    },
    '3': {
        value: '审核中',
        class: 'pending'
    },
    '4': {
        value: '已抄送',
        class: 'pass'
    },
    '5': {
        value: '待审核',
        class: 'waiting'
    },
    '6': {
        value: '--',
        class: ''
    },
    '7': {
        value: "流程关闭",
        class: "close"
    },
    '-1': {
        value: "流程关闭",
        class: "close"
    },
}

// 工作流流程详情接新页面 views/workFlow 
// 10-活动审批 11-新能源审批 12-代驾审批
export const FLOW_PATH = [10, 11, 12]

// 营销活动类型
export const ACTIVITY_TYPE = [
    {
        id: 1,
        name: '注册送'
    },
    {
        id: 2,
        name: '消费送'
    },
    {
        id: 4,
        name: '实体店推广'
    },
    {
        id: 6,
        name: '订单推广'
    },
    {
        id: 8,
        name: '推荐乘客'
    },
    {
        id: 9,
        name: '支付活动'
    },
    {
        id: 10,
        name: '平台推广'
    },
    {
        id: 12,
        name: '助力分享'
    },
    {
        id: 13,
        name: '支付立减'
    },
    {
        id: 15,
        name: '等待奖励'
    },
    {
        id: 16,
        name: '优惠商城'
    },
    {
        id: 17,
        name: '定时抢券'
    },
    {
        id: 19,
        name: 'VIP会员权益'
    },
    {
        id: 800,
        name: '车主激励奖'
    },
    {
        id: 200,
        name: '订单增长奖'
    },
    {
        id: 300,
        name: '车主冲单奖'
    },
    {
        id: 500,
        name: '车主完单奖'
    },
    {
        id: 700,
        name: '车主签到奖'
    },
    {
        id: 100,
        name: '包干推荐奖'
    },
    {
        id: 1001,
        name: '推荐乘客'
    },
    {
        id: 1002,
        name: '推荐司机'
    },
    {
        id: 1007,
        name: '推荐会员活动'
    },
    {
        id: 900,
        name: '高峰津贴奖'
    },
    {
        id: 3,
        name:'推荐充值'
    },
    {
        id: 5,
        name:'推荐充值'
    },
    {
        id: 22,
        name:'推荐乘客充值'
    },
    {
        id: 14,
        name:'充值送'
    },
    {
        id: 25,
        name:'两轮车换电'
    },
    {
        id: 26,
        name:'抽奖活动'
    }
]

// 目标人群
export const TARGET_PEOPLE = [
    {
        id: -1,
        name: '不限人群'
    },
    {
        id: 1,
        name: '部分人群'
    }
]

// 服务类型
export const SERVE_TYPE = [
    {
        id: 20,
        name: '实时单'
    },
    {
        id: 21,
        name: '预约单'
    },
    {
        id: 22,
        name: '扫码单'
    }
]

// 限购类型
export const PURCHASE_LIMIT = [
    {
        id: 0,
        name: '不限'
    },
    {
        id: 1,
        name: '活动周期内限购'
    },
    {
        id: 2,
        name: '每月限购'
    },
    {
        id: 3,
        name: '每周限购'
    },
    {
        id: 4,
        name: '每日限购'
    },
]

// 风险类型
export const PARTICIPATE_CONDITION = [
    {
        id: -1,
        name: '不限'
    },
    {
        id: 0,
        name: '黑名单'
    },
    {
        id: 1,
        name: '无风险'
    },
    {
        id: 2,
        name: '有风险'
    },
    {
        id: 3,
        name: '疑似风险'
    }
]
export const CCREAD_STATUS = [
//抄送已读状态
    {
        id: 0,
        name: '未读'
    },
    {
        id: 1,
        name: '已读'
    },

]
