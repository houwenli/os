export const getMenuTypes = () => {
  return [
    {
      id: 1,
      name: 'App应用'
    },
    {
      id: 2,
      name: 'H5应用'
    }
  ]
}

export const getStyleOptions = () => {
  return [
    // 最开始的样式
    {
      text: '样式一',
      value: 1,
      count: null,
      iconSize: {
        width: 44,
        height: 44,
        text: '88px * 88px'
      }
    },
    // 一个面板只能有2个
    {
      text: '样式二',
      value: 2,
      count: 2,
      iconSize: {
        width: 162,
        height: 80,
        text: '324px * 160px'
      }
    },
    // 一个面板只能配置一个
    {
      text: '样式三',
      value: 3,
      count: 1,
      iconSize: {
        width: 343,
        height: 100,
        text: '686px * 200px'
      }
    },
    // 一个面板要求配置4个
    {
      text: '样式四',
      value: 4,
      count: 4,
      iconSize: {
        width: 162,
        height: 80,
        text: '324px * 160px'
      }
    }
  ]
}

/**
 * 新增tab下子菜单的场景
 *
 */
export const getInitMenuTemplate = (orgType, sort) => {
  const secondItem = getInitForSecondMenuTemplate(orgType, 1)

  return {
    _text: '第1层',
    name: '新增导航',
    menuType: 1,
    sort: sort,
    pic: '',
    url: '',
    category: 1,
    orgType,
    checkPic: null,
    menuDesc: null,
    // 导航类型
    type: 1,
    pageType: 1,
    deepLinkId: '',
    functions: null,

    children: [secondItem],
    isOpen: true
  }
}

/**
 * 第二层新增的模板字段
 */
export const getInitForSecondMenuTemplate = (orgType, sort) => {
  const threeItem = getInitForThreeMenuTemplate(orgType, 1)

  return {
    _text: '第二层',
    styleType: 1,
    name: '新增导航',
    url: '',
    pic: null,
    isOpen: true,
    pageType: 1,
    orgType,

    children: [
      // 第三层的结构
      threeItem
    ],
    functions: [],
    deepLinkId: null,
    menuDesc: null,
    deepLinkMenuVo: {
      id: '',
      name: '',
      url: '',
      code: '',
      orgType,
      deepLinkChildVos: null
    },
    sort
  }
}

/**
 * 初始化第三层的结构
 * @param {Number} orgType 角色层级（总部，分公司，服务中心，实体店）
 * @param {Number} sort 排序字段
 * @param {Number} parentId 第三层的父节点ID
 */
export const getInitForThreeMenuTemplate = (orgType, sort = 1, parentId) => {
  let d = {
    _text: '第3层',
    type: 1,
    checkPic: null,
    // 导航路径查询出来的功能菜单配置
    deepLinkMenuVo: null,
    // 导航路径
    deepLinkId: null,
    isOpen: true,
    menuDesc: '',
    name: '',
    orgType,
    pageType: null,
    // parentId,
    pic: '',
    url: '',
    sort: sort,
    children: [],
    menuSysInfoId: null,
    _menuSysInfoId: null,
    menuSysInfoName: '',
    id: ''
  }

  if (parentId !== undefined) {
    d.parentId = parentId
  }

  return d
}

// 导航图标的行内验证规则
export const picRules = [
  {
    required: true,
    message: '导航图标不能为空',
    trigger: ['change', 'blur']
  }
]
// 导航名称规则
export const navNameRules = [
  {
    required: true,
    message: '导航名称不能为空',
    trigger: ['change', 'blur']
  }
]

export const navRules = {
  name: [{ required: true, trigger: 'blur', message: `请输入导航名称` }]
}

export const cardRules = {
  type: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入导航类型'
    }
  ]
}

/**
 * 判断用户选择的H5是选择了相同的
 * @param {Array<Object>} target
 * @returns {{result: Boolean, error: string}} 结果
 */
export const validSameNavgationPathForH5 = target => {
  const m = {}

  for (let i = 0; i < target.length; i++) {
    // 拿到第一层
    let firstLevel = target[i]

    if (!firstLevel.children || firstLevel.children.length === 0) {
      return {
        result: true,
        error: ''
      }
    }

    const secondLevel = firstLevel.children

    for (let j = 0; j < secondLevel.length; j++) {
      if (secondLevel[j].type === 2) {
        const menuSysInfoId = secondLevel[j].menuSysInfoId
        if (!m[menuSysInfoId]) {
          m[menuSysInfoId] = secondLevel[j].menuSysInfoName
        } else {
          // 存在重复的
          return {
            result: false,
            error: m[menuSysInfoId]
          }
        }
      }
    }
  }

  return {
    result: true,
    error: ''
  }
}
