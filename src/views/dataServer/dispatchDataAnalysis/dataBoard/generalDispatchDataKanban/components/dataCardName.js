const dataCardName = [
  {
    name: 'orderCnt',
    cardName: '总单量',
    tips: '统计维度内，产生的订单总量'
  },
  {
    name: 'scheduleSuccessOrderCnt',
    cardName: '调度成功订单量',
    tips: '统计维度内，调度成功订单是可逆的，由调度系统分配订单到司机，且司机已接单的订单数视为调度成功订单；<br/>若司机接单后取消订单，回流至调度池，则当前订单状态为调度中订单，相对应的数据需校对，直至乘客确认上车无法司机无法取消订单视为调度成功订单'
  },
  {
    name: 'failedOrderCnt',
    cardName: '调度失败订单量',
    tips: '统计维度内，调度失败订单不可逆，分为两种情况的失败：1 订单系统调度超时 2 订单调度中，乘客主动取消订单'
  },
  {
    name: 'schedulingOrderCnt',
    cardName: '调度中订单量',
    tips: '统计维度内，当前时间点正在调度系统调度的订单'
  },
  {
    name: 'scheduleCnt',
    cardName: '调度总次数',
    tips: '统计维度内，所有订单被调度的总次数，包含调度成功订单和调度失败订单；若选中“今日”则需加上调度中订单的调度次数'
  },
  {
    name: 'scheduleTime',
    cardName: '调度总时长',
    tips: '统计维度内，订单在（初始化阶段）+（运力计算阶段）+ （运力过滤阶段）通过（抢单）（派单）直至司机接单的时间点所耗费的时长',
    unit: 'h'
  },
  {
    name: 'findDriverCnt',
    cardName: '调度遍历司机数',
    tips: '统计维度内，调度筛选过滤完下发派单通知的司机数量，此数据不去重'
  },
  {
    name: 'addDriverCnt',
    cardName: '调度总司机数',
    tips: '统计维度内，由调度系统过滤出来的司机数量去重，并且发送推送触达司机的司机数量'
  },
  {
    name: 'scheduleCntAvg',
    cardName: '单均调度次数',
    tips: '统计维度内，单均调度次数=调度总次数/下单量，四舍五入精确到小数点后一位',
    unit: '次'
  },
  {
    name: 'scheduleTimeAvg',
    cardName: '单均调度时长',
    tips: '调度总时长/下单量  单位s 四舍五入精确到小数点后一位',
    unit: 's'
  },
  {
    name: 'findDriverCntAvg',
    cardName: '单均遍历司机数',
    tips: '调度遍历司机数/下单量 四舍五入精确到小数点后一位',
    unit: '个'
  },
  {
    name: 'addDriverCntAvg',
    cardName: '单均调度司机数',
    tips: '调度司机数/下单量 四舍五入精确到小数点后一位',
    unit: '个'
  }
]

export default dataCardName
