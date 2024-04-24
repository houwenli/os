// 时间快捷选项数据
export const timeButtonGroupList = [
  {
    value: "TODAY",
    label: "今日",
    days: 0,
    getTime() {
      const start = new Date(new Date().toLocaleDateString());
      let endTime = start.getTime() + 3600 * 1000 * 24 - 1;
      const end = new Date(endTime);
      return [start, end];
    },
    tips: '展示今天00:00截止到当前时间的数据'
  },
  {
    value: "YESTERDAY",
    label: "昨日",
    getTime() {
      const start = new Date(new Date().toLocaleDateString());
      let endTime = start.getTime() - 3600 * 1000 * 24;
      start.setTime(start.getTime() - 1000);
      const end = new Date(endTime);
      return [end, start];
    },
    days: -1,
    tips: '展示昨天00:00-23:59的数据'
  },
  {
    value: "SEVEN",
    label: "近7天",
    getTime() {
      let end = new Date();
      let start = new Date(new Date().toLocaleDateString());
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      end.setTime(
        new Date(new Date().toLocaleDateString()).getTime() +
        (86400000 - 1000)
      );
      return [start, end];
    },
    days: -7,
    tips: '展示当前时间前7天的数据'
  },
  {
    value: "THIRTY",
    label: "近1个月",
    getTime() {
      let end = new Date();
      let start = new Date(new Date().toLocaleDateString());
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      end.setTime(
        new Date(new Date().toLocaleDateString()).getTime() +
        (86400000 - 1000)
      );
      return [start, end];
    },
    days: -30,
    tips: '展示当前时间前1个月的数据'
  },
  {
    value: "ALL",
    label: "近3个月",
    getTime() {
      let end = new Date();
      let start = new Date(new Date().toLocaleDateString());
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      end.setTime(
        new Date(new Date().toLocaleDateString()).getTime() +
        (86400000 - 1000)
      );
      return [start, end];
    },
    days: -90,
    tips: '展示当前时间前3个月的数据'
  },
  {
    value: "CUSTOM",
    label: "自定义",
    tips: '自定义选择时间'
  }
]
// 订单类型查询数据
export const orderType = [
  {
    label: '全部',
    value: 'ALL',
  },
  {
    label: '实时单',
    value: "SS",
  },
  {
    label: '预约单',
    value: "YY",
  },
]