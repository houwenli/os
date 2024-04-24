/**
 * 系统管理-角色管理-新建
 * 首页-总部权限申请和 分支机构权限申请
*/
const state = {
  // 角色层级
  orgType: '',
  webDefaultKeys: [], // web树回显数据
  appDefaultKeys: [], // app树回显数据
  appletDefaultKeys: [], // 小程序回显数据
  cityDefaultKeys: [], // 城市树回显数据
  orgDefaultKeys: [], // 机构树回显数据
  // 机构展开的key
  orgDefaultExpandedKeys: [],
  cityIdList:[],
  orgAllCheckId:[],
  completed:false,

  webDisabledKeys: [],
  cityDisabledKeys: [],
  orgDisabledKeys: [],
  orgDisabledExpandedKeys:[],
  appDisabledKeys:[],
}

const mutations = {
  /** 在页面销毁时，清空state */
  reset(state) {
    // state.orgType = ''
    state.webDefaultKeys = []
    state.appDefaultKeys = []
    state.appletDefaultKeys = []
    state.orgDefaultKeys = []
    state.cityDefaultKeys = []
    state.orgDefaultExpandedKeys = []
    state.cityIdList = []
    state.orgAllCheckId = []

    state.webDisabledKeys = []
    state.cityDisabledKeys = []
    state.orgDisabledKeys= []
    state.orgDisabledExpandedKeys= []
    state.appDisabledKeys= []
  }
}

export default {
  namespace: true,
  state,
  mutations
}