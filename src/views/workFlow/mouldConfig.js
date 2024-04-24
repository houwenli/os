export default {
    // 营销活动
    10: {
        1: 'register', // 注册送
        2: 'consumption', // 消费送
        8: 'recommend', // 推荐乘客
        9: 'payment', // 支付活动
        10: 'platform', // 平台推广
        // 12: 'assist', // 助力分享
        13: 'payDecrement', // 支付立减
        19: 'vipEquity', // 会员权益

        15: 'waitReward', // 等待奖励
        16: 'discount', // 优惠商城
        17: 'timing', // 定时抢券
        4: 'storePromotion', //实体店推广
        6: 'orderPromotion', //订单推广
        23:'ECommercePromotion',//电商推广
        800: 'inspire', // 车主 激励奖
        200: 'orderIncrease', // 车主 订单增长奖
        300: 'orderRush', // 车主 冲单奖
        500: 'newDriverOrder', // 车主 完单奖
        700: 'signIn', // 车主 签到奖
        100: 'recommendLocalCharge', // 包干推荐奖

        1001: 'recommendPassenger', //机构活动：推荐乘客
        1002: 'recommendDriver', //机构活动：推荐司机
        1007: 'recommendMember', //机构活动：推荐会员活动
        1008: 'recommendRideHailing', //机构活动：推荐代驾司机

        900: 'fastigiumAllowance', // 高峰津贴奖
        22: 'recommendRecharge', //推荐充值
        14: 'rechargeSend', //充值送
        3:'recommendRechargeOrg', //机构推荐充值  推荐乘客充值
				5:'recommendRechargeOrg',  //机构推荐充值  推荐企业充值
				24: 'nosecreat', // 免密送
        1009: 'recommendDrivingOrder', //机构活动：推荐代驾订单,
        25: 'electric',
        26: 'lottery',
        1000: 'completionAward', // 代驾司机完单奖 对应的nameId=64
        27:'ordinaryRecharge' //普通充值送
    },
    // 新能源
    11: {
        70: 'carBuyOrderApproval',
        71: 'depositRefundApproval',
        72: 'groupApproval', // 团购订单审批
    },
    // 网约车审批-新审批流程（之前有好多是旧的审批）
    1: {
      // 司机合伙人申请
      14: "driverCoCreatorApplication",
      //司机合伙人补充资料
      15: "driverCoCreatorApplication",
    },
    // 行政审批
    5: {
      // 总部权限申请
      27: 'powerApply',
      // 分支机构权限申请
      23: 'powerApply'
    },
    12: {
        80:'refundOfAbnormalOrders',//代驾异常订单退款
        81:'refundOfRegistrationFee',//代驾报名费退款
        82:'valetDriverAccessApplication',//代驾司机入网
        83:'abnormalSingleBrush',//代驾异常单刷单审批
    }
}