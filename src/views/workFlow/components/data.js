/**
 * 审批流节点状态
 */
export const processStatus = [
  {
    status: 1,
    text: '未处理'
  },
  {
    status: 2,
    text: '已处理'
  },
  {
    status: 3,
    text: '当前'
  },
  {
    status: 8,
    text: '已拒绝'
  }

  // 如果是抄送，好像是 是空字符串
]

/**
 * 后端不好处理审批流返回的脏数据
 * 如果流程节点中遇到 8或者3， 表示后面的流程状态应该都为1. 未处理
 */
export const fixProcessList = (list) => {

  let nodeIndex = null

  list.find((p, index) => {
    if (['3', '8'].includes(p.approvalStatus)) {
      nodeIndex = index
      return true
    }
  })

  console.log('nodeIndex', nodeIndex)
  if (nodeIndex !== null) {
    // 将后续流程全部变为未处理
    for (let i = nodeIndex + 1; i < list.length; i++) {
      list[i].approvalStatus = '1'
    }
  }

  return list
}

/**
 * 审批流状态
 */
 export const flowStatusMap = {
  '-1': '已撤销',
  1: '审核通过',
  2: '审核拒绝',
  3: '待审核',
  4: '审核中',
  5: '再次审核',
  6: '自动审核通过',
  7: '自动审核拒绝',
  9: '他人已审核'
}