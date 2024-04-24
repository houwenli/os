
export function getRules () {
  const validateTime = (rule, value, callback) => {
    let currentTime = Date.now()

    if (value) {
      let diff = currentTime > new Date(value).getTime()

      if (diff) {
        callback('请选择正确的有效期!')
      } else {
        callback()
      }
    }
  }

  return {
    textarea: [
      {
        required: true,
        message: '请输入申请原因',
        trigger: 'change',
      },
    ],
    deptId: [
      {
        required: true,
        message: '请选择使用的部门',
        trigger: 'change',
      },
    ],
    deptIds: [
      {
        required: true,
        type: "array",
        message: '请选择使用的部门'
      }
    ],
    positionIds: [
      {
        required: true,
        message: '请选择使用的职务',
        trigger: 'change',
      },
    ],

    time: [
      {
        required: true,
        message: '请选择有效日期',
        trigger: ['change', 'blur'],
      },
      {
        validator: validateTime,
        trigger: ['change', 'blur']
      }
    ]
  }
}