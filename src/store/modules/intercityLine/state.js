const state = {
    roundtripFilters: [  //里程往返
        {id: 1, value: '往程'},
        {id: 2, value: '返程'},
    ],
    singleStateFilters: [  //派单状态
        {id: 0, value: '待派单'},
        {id: 1, value: '待确认'},
        {id: 2, value: '已确认'},
    ],
    businessTypes: [ //业务类型
        {id: '10', value: '快车'},
        {id: '20', value: '专车 '},
        {id: '30', value: '豪华车 '},
        {id: '40', value: '商务车 '},
    ],
    requestRideTypeFilters: [ //服务类型
        {id: 10, value: '快车'},
        {id: 20, value: '专车'},
        {id: 30, value: '豪华车'},
        {id: 40, value: '商务车'},
    ],
    driverOrderStatusFilters: [ // 司机订单状态
        {id: -20, value: '已关闭'},
        {id: 0, value: '待确认'},
        {id: 10, value: '已确认'},
        {id: 20, value: '行程中'},
        {id: 30, value: '结束行程'},
        {id: 50, value: '已完成'},
    ],
    passengerOrderStatusFilters: [ // 乘客订单状态
        {id: -20, value: '已关闭'},
        {id: 0, value: '等待接单'},
        {id: 10, value: '预约成功'},
        {id: 20, value: '等待接驾'},
        {id: 30, value: '行程中'},
        {id: 40, value: '行程结束'},
        {id: 60, value: '已完成'},
    ],
    // 支付状态
    passengerpayStatusFilters:[
      {id: 10, value: '未付款'},
      {id: 20, value: '已付款'},
      {id: 30, value: '已退款'},
    ],
    orderTypesFilters: [
        {id: 20, value: '实时单'},
        {id: 21, value: '预约单'},
        {id: 22, value: '扫码单'},
        {id: 70, value: '包车单'},
        {id: 40, value: '拼车单'},
        {id: 80, value: '城际专线'},
    ],
    //城际专线 - 结算信息 - 结算类型
    settleTypeFilters: [
        {id: 10, value: '巡游车车费收入'},
        {id: 12, value: '二维码巡游车车费'},
        {id: 20, value: '网约车车费'},
        {id: 22, value: '扫码起单'},
        {id: 23, value: '网约车预付车费'},
        {id: 24, value: '网约车尾款车费'},
        {id: 26, value: '包车尾款'},
        {id: 27, value: '包车车费'},
        {id: 30, value: '分享推荐奖励'},
        {id: 40, value: '活动奖励'},
        {id: 50, value: '补款'},
        {id: 60, value: '提现失败返还'},
        {id: 70, value: '提现手续费返还'},
        {id: 80, value: '提现'},
        {id: 90, value: '老系统余额'},
        {id: 100, value: '异常单补款'},
        {id: 101, value: '异常单扣款'},
        {id: 102, value: '异常单退款'},
        {id: 110, value: '转借入'},
        {id: 120, value: '借入利息'},
        {id: 130, value: '借入终止'},
        {id: 140, value: '借入终止利息扣款'},
        {id: 200, value: '街坊专车车费'},
        {id: 201, value: '专车尾款车费'},
        {id: 202, value: '专车预付车费'},
        {id: 300, value: '感谢红包'},
        {id: 410, value: '刷单扣款'},
        {id: 420, value: '投诉扣款'},
        {id: 430, value: '异常扣款'},
        {id: 450, value: '提现手续费'},
        {id: 460, value: '取消订单扣款'},
        {id: 500, value: '司机包干流水'},
        {id: 510, value: '充值送推荐奖励'},
        {id: 520, value: '万顺福卡推荐奖励'},
        {id: 530, value: '平台费包干推荐奖励'},
        {id: 550, value: '包干订单退款'},
        {id: 560, value: '平台费包干推荐奖励回收'},
        {id: 570, value: '冲单奖'},
        {id: 600, value: '村村通拼车车费'},
        {id: 610, value: '运力合作订单车费'},
    ],
    // 交委运管类型
    driverLevelFilters: [
        {id: 0, value: 'A类'},
        {id: 1, value: 'B类'},
        {id: 2, value: 'C类'},
        {id: 3, value: 'D类'},
        {id: 4, value: '-'},
        {id: 5, value: '-'},
        {id: 6, value: '-'},
        {id: 7, value: '-'},
        {id: 8, value: '-'},
    ],
    // 下单来源
    paltformFilters: [
        {id: 1, value: 'APP 安卓'},
        {id: 2, value: 'APP IOS'},
        {id: 3, value: '小程序'},
    ],
    // 渠道类型
    channelTypesFilters: [
        {id: 1, value: '万顺叫车平台'},
        {id: 10, value: '渠道商'},
        {id: 30, value: '开放平台'},
        {id: 40, value: '企业用车'}
    ],
    // 退款状态
    refundRecordStatesFilters: [
        {id: 0, value: '未退款'},
        {id: 1, value: '已退款'}
    ],
    // 支付状态
    payStatusFilters: [
        {id: 1, value: '订单付款'},
        {id: 70, value: '预支付'}
    ],
    // 城际专线-合伙人类型
    partnerTypeFilters:[    
        {id: 1, value: '普通车主'},
        {id: 2, value: '共享合伙人'},
        {id: 3, value: '高级合伙人'},
    ],
    // 城际专线-司机类型
    vipTypeFilters: [
        {id: 0, value: '非包干司机'},
        {id: 1, value: '有效包干司机 '},
        {id: 2, value: '无效包干司机 '},
        {id: 3, value: '全部包干司机 '},
        {id: '', value: '全部司机 '}
    ],
    // 城际专线-取消类型
    cancelReasonFilters: [
        {id: 1, value: '乘客取消'},
        {id: 2, value: '后台取消'},
        {id: 3, value: '系统取消'},
    ],
    //城际订单标签
    cityorderFilters:[
      {id: 1, value: '后台自主下单'},
    ]
}

export default state;
