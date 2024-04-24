// 时间快捷选项数据
export const timeButtonGroupList = [
  {
    value: "YESTERDAY",
    label: "今日",
    getTime() {
      const start = new Date(new Date().toLocaleDateString());
      let endTime = start.getTime() - 3600 * 1000 * 24;
      start.setTime(start.getTime() - 1000);
      const end = new Date(endTime);
      return [end, start];
    },
    days: 0,
    queryType:'1',
  },
  {
    value: "SEVEN",
    label: "本周",
    getTime() {
      let end = new Date();
      let start = new Date(new Date().toLocaleDateString());
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      end.setTime(new Date(new Date().toLocaleDateString()).getTime() + (86400000 - 1000));
      return [start, end];
    },
    days: -7,
    queryType:'2',
  },
  {
    value: "THIRTY",
    label: "本月",
    getTime() {
      let end = new Date();
      let start = new Date(new Date().toLocaleDateString());
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      end.setTime(new Date(new Date().toLocaleDateString()).getTime() + (86400000 - 1000));
      return [start, end];
    },
    days: -30,
    queryType:'3',
  },
  {
    value: "CUSTOM",
    label: "自定义",
    queryType:'4',
  }
]
