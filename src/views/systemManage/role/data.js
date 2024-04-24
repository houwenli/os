/**
 * 角色层级
 */
export const getRoleLevelList = () => [
  {
    text: '总部',
    code: 0
  },
  {
    text: '总区',
    code: 4
  },
  {
    text: '大区',
    code: 5
  },
  {
    text: '一级机构',
    code: 20
  },
  {
    text: '二级机构',
    code: 30
  },
  {
    text: '实体店',
    code: 40
  }
]

/**
 * 总部枚举
 */
export const roleForHeadquartersOptions = [
  { text: '总部', code: 0 },
  { text: '总区', code: 4 },
  { text: '大区', code: 5 }
]

/**
 * 分支机构
 */
export const roleForbranchOptions = [
  { text: '一级机构', code: 20 },
  { text: '二级机构', code: 30 },
  { text: '实体店', code: 40 }
]

/**
 * 新增角色表单校验规则
 */
export function getRoleAddRules () {
  // 角色名称校验
  const nameValidate = (rule, value, cb) => {
    if (value === '') {
      cb('请输入角色名称');
    } else if (value.includes(':')) {
      cb('角色名称不能包含 :');
    } else {
      cb();
    }
  };

  return {
    name: [
      {
        required: true,
        trigger: ['change', 'blur'],
        validator: nameValidate,
      },
    ],
    role: [
      {
        required: true,
        message: '请选择角色',
        trigger: ['change', 'blur']
      },
    ],
  }
}

/**
 * 
 * @param {*} originList 
 * @param {*} disableList [1,3,4] 
 * @param {String} key id / code
 * [{}, {}] disableList.map(p => p.id)
 * @returns 
 */
export function setTreeNodeDisabled(originList, disableList,key) {
  originList.forEach(item => {
    item.disabled = disableList.includes(item[key])
  })
  return originList
}