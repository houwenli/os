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

// 新增分公司表单数据
export const branchComForm = {
    name: '', // 机构全称
    simpleName: '', //机构简称
    establishTime: '', //设立时间
    registeredCapital: '', //注册资本
    importantStatus: '', //分公司类别
    serviceNo: '', //社会信用代码
    // submitProvinceCode: '', // 机构所在地区-省区编码
    // submitCityCode: '', // 机构所在地区-城市编码
    // submitAreaCode: '', // 机构所在地区-区域编码
    cityAreaCodeList: [], //机构所在地
    submitAreaCode: '', //机构所在地城市
    submitProvinceName: '',
    submitCityName: '',
    submitAreaName: '',
    parentId: '', //上级机构
    parentName: '',
    cityCodeList: [], //业务城市
    provinceName: '',
    cityName: '',
    areaName: '',
    // provinceCode  cityCode  areaCode
    // businessCityCode: '', //业务城市辖区
    grade: '', // 分公司等级
    address: '', //采集地址
    supplementAddress: '', //门牌号
    orgBusiness: {
        bLUnitProperty: '', //单位性质
        companyName: '', // 单位名称1
        serviceNo: '', //社会信用代码
        businessAddress: '', // 实际经营场所1
        broughtAccount: '', // 个人/对公账号
        bLHandleTime: '', // 办证时间
        remark: '', // 备注
        bLScope: '', // 经营范围
        legalPerson:'',// 法人
        legalPhone:'' ,// 法人手机号
        legalIdNumber:'',//法人身份证
    },
    rpcPersonChargeInfoAo: {
        personChargePhone: '', // 负责人手机号
        personChargeName: '', // 负责人姓名
        personChargeNo: '', // 负责人身份证
        personChargePostId: '', // 负责人职务
        personChargePostName: '', // 负责人职务名称
        employeeExist: false, // true-手机已注册 false-手机未注册
    },
}
// 新增服务中心表单数据
export const serviceCenForm = {
    cityAreaCodeList: [], //机构所在地
    submitAreaCode: '', //机构所在地城市
    submitProvinceName: '',
    submitCityName: '',
    submitAreaName: '',
    cityCodeList: [], //业务城市
    provinceName: '',
    cityName: '',
    areaName: '',
    registeredCapital: '', //注册资本
    // businessCityCode: '', //业务城市辖区
    address: '', //采集地址
    supplementAddress: '', //门牌号
    name: '', //机构全称
    simpleName: '', //机构简称
    establishTime: '', //设立时间
    centerType: '', //机构类型
    parentId: '', //上级机构
    parentName: '',
    orgBusiness: {
        bLUnitProperty: '', //单位性质
        orgName: '', // 单位名称
        serviceNo: '', //社会信用代码
        businessAddress: '', // 实际经营场所1
        broughtAccount: '', // 个人/对公账号
        bLHandleTime: '', // 办证时间
        remark: '', // 备注
        bLScope: '', // 经营范围
        legalPerson:'',// 法人
        legalPhone:'' ,// 法人手机号
        legalIdNumber:'',//法人身份证
    },
    rpcPersonChargeInfoAo: {
        personChargePhone: '', // 负责人手机号
        personChargeName: '', // 负责人姓名
        personChargeNo: '', // 负责人身份证
        personChargePostId: '', // 负责人职务
        personChargePostName: '',
        employeeExist: false, // true-手机已注册 false-手机未注册
    },
    areaCodes: []
}
// 新增实体店表单数据
export const physicalStoreForm = {
    cityAreaCodeList: [], //机构所在地
    submitAreaCode: '', //机构所在地城市
    // submitProvinceName: '',
    // submitCityName: '',
    // submitAreaName: '',
    cityCodeList: [], //业务城市
    // provinceName: '',
    // cityName: '',
    // areaName: '',
    // registeredCapital: '', //注册资本
    // businessCityCode: '', //业务城市辖区
    // address: '', //采集地址
    // supplementAddress: '', //门牌号
    // storeLocation: '', //店面位置
    // latitude: '', //纬度
    // longitude: '', //经度
    name: '', //机构全称
    simpleName: '', //机构简称
    centerType: '', //机构类型
    parentId: '', //上级机构
    // parentName: '',
    // openStatus: '', //开店状态
    // promiseOpenTime: '', // 承诺开店时间
    // orgBusiness: {
        // bLUnitProperty: '', //单位性质
        // orgName: '', // 单位名称1
        // serviceNo: '', //社会信用代码
        // address: '', // 实际经营场所1
        // broughtAccount: '', // 个人/对公账号
        // bLHandleTime: '', // 办证时间
        // remark: '', // 备注
        // bLScope: '', // 经营范围
        // legalPerson:'',// 法人
        // legalPhone:'' ,// 法人手机号
        // legalIdNumber:'',//法人身份证
    // },
    rpcPersonChargeInfoAo: {
        personChargePhone: '', // 负责人手机号
        personChargeName: '', // 负责人姓名
        personChargeNo: '', // 负责人身份证
        personChargePostId: '', // 负责人职务
        personChargePostName: '',
        employeeExist: false, // true-手机已注册 false-手机未注册
    },
    areaCodes: []
}

/**
 * @description: 校验规则
 * @param {*}
 * @return {*}
 */
// 新增分公司表单数据 校验
export const branchComRules = {
    name: [
        { required: true, message: '请输入机构全称', trigger: 'blur' },
    ],
    simpleName: [
        { required: true, message: '请输入机构简称', trigger: 'blur' },
    ],
    establishTime: [
        { required: true, message: '请选择设立时间', trigger: 'blur' },
    ],
    registeredCapital: [
        { required: true, validator: validateNumber, trigger: 'blur' },
    ],
    importantStatus: [
        { required: true, message: '请选择分公司类别', trigger: 'change' },
    ],
    serviceNo: [
        { required: false, message: '请输入统一社会信用代码', trigger: 'blur' },
    ],
    cityAreaCodeList: [
        { required: true, message: '请选择机构所在地省市', trigger: 'change' },
    ],
    submitAreaCode: [
        { required: true, message: '请选择机构所在城市', trigger: 'change' },
    ],
    parentId: [
        { required: true, message: '请选择上级机构', trigger: 'change' },
    ],
    cityCodeList: [
        { required: true, message: '请选择业务城市', trigger: 'change' },
    ],
    // businessCityCode: [
    //     { required: true, message: '请选择业务城市', trigger: 'blur' },
    // ],
    grade: [
        { required: true, message: '请选择分公司等级', trigger: 'change' },
    ],
    address: [
        { required: true, message: '请采集地址', trigger: 'blur' },
    ],
    supplementAddress: [
        { required: true, message: '请输入门牌号', trigger: 'blur' },
    ],
    // bLUnitProperty: [
    //     { required: true, message: '请输入单位性质', trigger: 'blur' },
    // ],
    // bLPersonChargeName: [
    //     { required: true, message: '请输入姓名', trigger: 'blur' },
    // ],
    // bLHandleTime: [
    //     { required: true, message: '请选择办证时间', trigger: 'blur' },
    // ],
    // bLScope: [
    //     { required: true, message: '请输入经营范围', trigger: 'blur' },
    // ],
    personChargePhone: [
        { required: true, message: '请输入负责人手机号', trigger: 'blur' },
        {
            pattern: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
            message: '请输入正确的电话号码',
            trigger: 'blur'
        }
    ],
    personChargeName: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
    ],
    personChargeNo: [
        { required: true, message: '请输入身份证号码', trigger: 'blur' },
        {
            pattern: /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: '请输入正确的身份证号码',
            trigger: 'blur'
        }
    ],
    personChargePostId: [
        { required: true, message: '请选择职务', trigger: 'change' },
    ],
}
// 新增服务中心表单数据 校验
export const serviceCenRules = {
    cityAreaCodeList: [
        { required: true, message: '请选择机构所在地省市', trigger: 'change' },
    ],
    submitAreaCode: [
        { required: true, message: '请选择机构所在城市', trigger: 'change' },
    ],
    cityCodeList: [
        { required: true, message: '请选择业务城市', trigger: 'change' },
    ],
    // businessCityCode: [
    //     { required: true, message: '请选择业务城市', trigger: 'blur' },
    // ],
    address: [
        { required: true, message: '请采集地址', trigger: 'blur' },
    ],
    supplementAddress: [
        { required: true, message: '请输入门牌号', trigger: 'blur' },
    ],
    name: [
        { required: true, message: '请输入机构全称', trigger: 'blur' },
    ],
    simpleName: [
        { required: true, message: '请输入机构简称', trigger: 'blur' },
    ],
    establishTime: [
        { required: true, message: '请选择设立时间', trigger: 'blur' },
    ],
    centerType: [
        { required: true, message: '请选择机构类型', trigger: 'blur' }
    ],
    parentId: [
        { required: true, message: '请选择上级机构', trigger: 'change' },
    ],
    // bLUnitProperty: [
    //     { required: true, message: '请输入单位性质', trigger: 'blur' },
    // ],
    // bLPersonChargeName: [
    //     { required: true, message: '请输入姓名', trigger: 'blur' },
    // ],
    // bLHandleTime: [
    //     { required: true, message: '请选择办证时间', trigger: 'blur' },
    // ],
    // bLScope: [
    //     { required: true, message: '请输入经营范围', trigger: 'blur' },
    // ],
    personChargePhone: [
        { required: true, message: '请输入负责人手机号', trigger: 'blur' },
        {
            pattern: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
            message: '请输入正确的电话号码',
            trigger: 'blur'
        }
    ],
    personChargeName: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
    ],
    personChargeNo: [
        { required: true, message: '请输入身份证号码', trigger: 'blur' },
        {
            pattern: /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: '请输入正确的身份证号码',
            trigger: 'blur'
        }
    ],
    personChargePostId: [
        { required: true, message: '请选择职务', trigger: 'change' },
    ],
    areaCodes: [{ required: true, message: '请选择区', trigger: 'change' }]
}
// 新增实体店表单数据 校验
export const physicalStoreRules = {
    cityAreaCodeList: [
        { required: true, message: '请选择机构所在地省市', trigger: 'change' },
    ],
    submitAreaCode: [
        { required: true, message: '请选择机构所在城市', trigger: 'change' },
    ],
    cityCodeList: [
        { required: true, message: '请选择业务城市', trigger: 'change' },
    ],
    areaCodes: [
        { required: true, message: '请选择区', trigger: 'change' },
    ],
    // businessCityCode: [
    //     { required: true, message: '请选择业务城市', trigger: 'blur' },
    // ],
    address: [
        { required: true, message: '请采集地址', trigger: 'blur' },
    ],
    supplementAddress: [
        { required: true, message: '请输入门牌号', trigger: 'blur' },
    ],
    storeLocation: [
        { required: true, message: '请选择店面位置', trigger: 'change' },
    ],
    name: [
        { required: true, message: '请输入机构全称', trigger: 'blur' },
    ],
    simpleName: [
        { required: true, message: '请输入机构简称', trigger: 'blur' },
    ],
    centerType: [
        { required: true, message: '请选择机构类型', trigger: 'change' }
    ],
    parentId: [
        { type: "number",required: true, message: '请选择上级机构', trigger: 'change' },
    ],
    openStatus: [
        { required: true, message: '请选择开店状态', trigger: 'change' },
    ],
    promiseOpenTime: [
        { required: true, message: '请选择承诺开店时间', trigger: 'blur' },
    ],
    // bLUnitProperty: [
    //     { required: true, message: '请输入单位性质', trigger: 'blur' },
    // ],
    // orgName: [
    //     { required: true, message: '请输入单位名称', trigger: 'blur' },
    // ],
    // serviceNo: [
    //     { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
    // ],
    // bLPersonChargeName: [
    //     { required: true, message: '请输入法人姓名', trigger: 'blur' },
    // ],
    // addresss: [
    //     { required: true, message: '请输入实际经营场所', trigger: 'blur' },
    // ],
    // broughtAccount: [
    //     { required: true, message: '请输入银行账户', trigger: 'blur' },
    // ],
    // bLHandleTime: [
    //     { required: true, message: '请选择办证时间', trigger: 'blur' },
    // ],
    // bLScope: [
    //     { required: true, message: '请输入经营范围', trigger: 'blur' },
    // ],
    personChargePhone: [
        { required: true, message: '请输入负责人手机号', trigger: 'blur' },
        {
            pattern: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
            message: '请输入正确的电话号码',
            trigger: 'blur'
        }
    ],
    personChargeName: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
    ],
    personChargeNo: [
        { required: true, message: '请输入身份证号码', trigger: 'blur' },
        {
            pattern: /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: '请输入正确的身份证号码',
            trigger: 'blur'
        }
    ],
    personChargePostId: [
        { required: true, message: '请选择职务', trigger: 'change' },
    ],
}
