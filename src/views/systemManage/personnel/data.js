const orgTypeList = [
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
  },
  {
    text: '出租车公司',
    code: 50
  }
]

/**
 * 组织机构类型
 */
export const getOrgTypeList = (orgTypeListIds) => {
  return orgTypeList.filter(p => orgTypeListIds.includes(p.code))
}

/**
 * 帐号管理，表单rule
 */
export const getPersonnelRules = () => {
  return {
    name:[
      {
        required: true,
        message: '请输入人员姓名',
        trigger: ['blur', 'change'],
      },
    ],
    phone: [
      {
        required: true,
        message: '请输入手机号码',
        trigger: ['blur', 'change'],
      },
      {
        pattern: /^1[0-9]{10}$/,
        message: '请输入正确的手机号码',
        trigger: ['blur', 'change']
      }
    ]
  }
}
