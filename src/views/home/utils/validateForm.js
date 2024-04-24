/**
 * @description: 自定义指定
 * @param {*}
 * @return {*}
 */

export const validateNumber = (rule, value, callback) => {
    const reg = /^[0-9]+(.[0-9]{1,2})?$/;
    !reg.test(value) && callback('纯数字支持两位小数')
    callback()
}

export const validatePhone = (rule, value, callback) => {
    const reg = /^1\d{10}$/;
    !reg.test(value) && callback('请输入正确的手机号')
    callback()
}

/**
 * @description: 绑定值
 * @param {*}
 * @return {*}
 */

export const ruleForm = {
    orgType: 20, //申请类型
    name: '', //机构全称
    simpleName: '', //机构简称
    establishTime: '', //开业时间
    registeredCapital: '', //注册
    importantStatus: '', //公司类别
    serviceNo: '', //社会统一信用代码
    locationOrg: [], //机构所在地
    submitCityCode: '', //机构所在地城市
    parentRelationId: '', //上级机构
    provinceCode: [], //业务城市
    address: '', //采集地址
    supplementAddress: '', //门牌号
    latitude: '', //纬度
    longitude: '', //经度
    contactPerson: '', //负责人姓名
    contactPhone: '', //负责人联系
    personIdNumber: '' //负责人身份证
}

/**
 * @description: 校验规则
 * @param {*}
 * @return {*}
 */

export const rules = {
    orgType: [
        { required: true, message: '请选择申请类型', trigger: 'blur' },
    ],
    name: [
        { required: true, message: '请输入机构全称', trigger: 'blur' },
    ],
    simpleName: [
        { required: true, message: '请输入机构简称', trigger: 'blur' },
    ],
    establishTime: [
        { required: true, message: '请选择开业时间', trigger: 'blur' },
    ],
    registeredCapital: [
        { required: true, validator: validateNumber, trigger: 'blur' },
    ],
    importantStatus: [
        { required: true, message: '请选择分公司类别', trigger: 'blur' },
    ],
    serviceNo: [
        { required: true, message: '请输入社会统一信用代码', trigger: 'blur' },
    ],
    locationOrg: [
        { required: true, message: '请输入机构所在地省市', trigger: 'blur' },
    ],
    submitCityCode: [
        { required: true, message: '请输入机构所在城市', trigger: 'blur' },
    ],
    parentRelationId: [
        { required: true, message: '请选择上级机构', trigger: 'blur' },
    ],
    provinceCode: [
        { required: true, message: '请选择业务城市', trigger: 'blur' },
    ],
    address: [
        { required: true, message: '请采集地址', trigger: 'blur' },
    ],
    supplementAddress: [
        { required: true, message: '请输入门牌号', trigger: 'blur' },
    ],
    contactPerson: [
        { required: true, message: '请输入负责人姓名', trigger: 'blur' },
    ],
    contactPhone: [
        { required: true, validator: validatePhone, trigger: 'blur' },
    ],
    personIdNumber: [
        { required: true, message: '请输入负责人身份证', trigger: 'blur' },
    ],
}

