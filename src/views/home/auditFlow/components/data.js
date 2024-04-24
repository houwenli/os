/**
 * oa-首页-审批发起记录， 只有以下审批类型能重新提交
 */
export const submitMap = {
  24: { modelName: '/currencyApply' },
  29: { modelName: '/currencyApplyBranchRole' },
  30: { modelName: '/addBranchCompany' },
  31: { modelName: '/addServiceCentre' },
  32: { modelName: '/addPhysicalStore' },
  27: { modelName: '/powerApply' }
};

/**
 * 查询重新提交的页面权限
 */
export function getResubmitPagePermission (row) {
  // 机构审批变更类型为编辑-->不展示 为新增-->展示
  if (row.opType == 2) return false

  //是否属于指定业务类型
  if (!submitMap[row.nameId]) return false

  // 审核状态权限(审批流列表 是字符串类型，详情又是Number类型)
  if (!['-1', '1', '2', '6'].includes(String(row.flowStatus))) return false

  let modelName = submitMap[row.nameId].modelName

  // 判断页面权限
  if (!this.getModulePower(modelName)) return false

  return true
}