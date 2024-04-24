/**
 * 这2种是不走权限验证的
 * @param {} type tab的activeName
 */
export const getHomeServesMap = (type) => {
  let m = {
    // 审批处理记录
    1: {
      op: "approvalRecord",
      url: "/new/flowable/todoTask/select"
    },
    // 审批发起记录
    2: {
      op: "selectPage",
      url: "/flowable/approvalInitiationRecord/select"
    }
  }

  return m[type]
}