import dayjs from 'dayjs'

export const getTimeStatus = (t) => {
  // 毫秒
  let diff = dayjs().diff(dayjs(t), 'hour')

  return diff
}

/**
 * 信息公告/公司文件/知识园地/会议通知  基本op 是一样的
 * @param {*} noticeType
 * @returns
 */
export const getCommentModuleName = (noticeType)=> {
  let moduleName = ''
  switch (noticeType) {
    case 1:
      moduleName = '/index/information'
      break
    case 2:
      moduleName = '/index/policy'
      break
    case 3:
      moduleName = '/index/knowledge'
    default:
      moduleName = '/index/conference'
      break
  }

  return moduleName
}

export const orgTypeMap = {
  0: '总部',
  4: '总区',
  5: '大区',
  20: '一级机构',
  30: '二级机构',
  40: '实体店',
  50: '出租车公司'
}
