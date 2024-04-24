import * as types from '../mutation-types';
const state = {
    provinceCityList: [], //省市列表
    // 实体店  店面位置 选项
    storeLocationFilters: [
        { id: 1, value: '写字楼' },
        { id: 2, value: '临街' },
        { id: 3, value: '商场' },
    ],
    updateTypeFilters: [
        { id: 1, value: '新增' },
        { id: 2, value: '修改' },
        { id: 3, value: '状态标记' },
    ],
    // 职务机构类型
    orgTypeFilters: [
        {
            id: 20,
            value: '一级机构',
        },
        {
            id: 30,
            value: '二级机构',
        },
        {
            id: 40,
            value: '实体店',
        },
    ],
    licenseStatusFilters: [
        //牌照状态
        { id: 0, value: '无' },
        { id: 1, value: '有' },
    ],
    marketStatusFilters: [
        //是否是独立市场
        { id: 0, value: '否' },
        { id: 1, value: '是' },
    ],
    signStatusFilters: [
        //独立法人签约状态
        { id: 1, value: '已签约' },
        { id: 2, value: '已解约' },
    ],
    companyTypeFilters: [
        //分公司类别
        { id: 1, value: '重点分公司' },
        { id: 2, value: '非重点分公司' },
    ],
    centerTypeFilters: [
        // 服务中心类型
        { id: 1, value: '服务中心' },
        { id: 8, value: '服务中心(县市区)' },
    ],
    orgStateFilters: [
        //机构运营状态
        { id: 1, value: '正常' },
        { id: 2, value: '锁定登录' },
        { id: -1, value: '禁止入驻' },
        { id: -2, value: '停止运营' },
    ],
    stationTypeFilters: [
        // 服务站类型
        { id: 1, value: '社区服务站' },
        { id: 2, value: '连锁店' },
        { id: 3, value: '服务车队' },
        { id: 4, value: '出租车服务站' },
        { id: 5, value: '实体店' },
        { id: 6, value: '专线车队' },
        { id: 7, value: '出租车服务队' },
    ],
    evaluateFilters: [
        { id: 0, value: '否' },
        { id: 1, value: '是' },
    ],
    sexFilters: [
        //性别
        { id: 2, value: '女' },
        { id: 1, value: '男' },
    ],
    gradeFilters: [
        //分公司等级
        { id: 1, value: '大一' },
        { id: 2, value: '大二' },
        { id: 3, value: '小一' },
        { id: 4, value: '小二' },
        { id: 5, value: '小三' },
    ],
    // 活动基数
    activityBaseFilters: [
        { id: 1, value: '普通店' },
        { id: 2, value: '新店' },
        { id: 3, value: '休眠店' },
    ],
    activityNameFilters: [
        { id: 1, value: '新店开门红活动' },
        { id: 2, value: '激励活动' },
        { id: 3, value: '实体店晋级活动' },
    ],
    openStatusFilters: [
        { id: 1, value: '待开业' },
        { id: 2, value: '已开业' },
    ],
    //---------- 个人中心
    //员工类型
    employeeTypes: [
        {
            label: '全职',
            value: 1,
        },
        {
            label: '实习',
            value: 2,
        },
        {
            label: '顾问',
            value: 3,
        },
        {
            label: '外包',
            value: 4,
        },
        {
            label: '劳务',
            value: 5,
        },
    ],
    //员工状态
    employeeStatuss: [
        {
            label: '试用',
            value: 1,
        },
        {
            label: '正式',
            value: 2,
        },
        {
            label: '待离职',
            value: 3,
        },
        {
            label: '离职',
            value: 4,
        },
    ],
    // 所属组织架构类型
    deptTypes: [
        {
            label: '总部',
            value: 1,
        },
        {
            label: '分支机构',
            value: 2,
        },
    ],
    // 最高学历
    highestEducationNames: [
        {
            name: '小学',
            id: 1,
        },
        {
            name: '初中',
            id: 2,
        },
        {
            name: '高中',
            id: 3,
        },
        {
            name: '中专',
            id: 4,
        },
        {
            name: '大专',
            id: 5,
        },
        {
            name: '本科',
            id: 6,
        },
        {
            name: '硕士',
            id: 7,
        },
        {
            name: '博士',
            id: 8,
        },
        {
            name: '其他',
            id: 9,
        },
    ],
    // 试用期
    probations: [
        {
            label: '一个月',
            value: 1,
        },
        {
            label: '两个月',
            value: 2,
        },
        {
            label: '三个月',
            value: 3,
        },
        {
            label: '四个月',
            value: 4,
        },
        {
            label: '五个月',
            value: 5,
        },
        {
            label: '六个月',
            value: 6,
        },
    ],
    // 合同类型
    contractTypes: [
        {
            label: '固定期限劳动合同',
            value: 1,
        },
        {
            label: '无固定期限劳动合同',
            value: 2,
        },
        {
            label: '实习协议',
            value: 3,
        },
        {
            label: '外包协议',
            value: 4,
        },
        {
            label: '劳务合同',
            value: 5,
        },
        {
            label: '退休返聘协议',
            value: 6,
        },
        {
            label: '其他',
            value: 7,
        },
    ],
    // 合同期限
    contractPeriods: [
        {
            label: '一年',
            value: 1,
        },
        {
            label: '两年',
            value: 2,
        },
        {
            label: '三年',
            value: 3,
        },
        {
            label: '六个月',
            value: 4,
        },
        {
            label: '无固定期限',
            value: 5,
        },
        {
            label: '其他',
            value: 6,
        },
    ],
    // 办公地点
    officeAddressList: [
        {
            name: '深圳',
            id: 1,
        },
        {
            name: '北京',
            id: 2,
        },
        {
            name: '武汉光谷',
            id: 3,
        },
        {
            name: '武汉东西湖',
            id: 4,
        },
        {
            name: '大区',
            id: 5,
        },
        {
            name: '分公司',
            id: 6,
        },
    ],
    // 性别
    sexs: [
        {
            label: '男',
            value: 1,
        },
        {
            label: '女',
            value: 2,
        },
    ],
    //户口类型
    registeredResidenceTypes: [
        {
            label: '本市城镇',
            value: 1,
        },
        {
            label: '本市农村',
            value: 2,
        },
        {
            label: '外埠城镇',
            value: 3,
        },
        {
            label: '外埠农村',
            value: 4,
        },
    ],
    //婚姻状况
    maritalStatuss: [
        {
            label: '未婚',
            value: 1,
        },
        {
            label: '已婚',
            value: 2,
        },
        {
            label: '离异',
            value: 3,
        },
        {
            label: '其他',
            value: 4,
        },
    ],
    //生育状态
    fertilityStatuss: [
        {
            label: '未育',
            value: 1,
        },
        {
            label: '一胎',
            value: 2,
        },
        {
            label: '二胎',
            value: 3,
        },
        {
            label: '多胎',
            value: 4,
        },
    ],
    //政治面貌
    politicalTypes: [
        {
            label: '群众',
            value: 1,
        },
        {
            label: '共青团员',
            value: 2,
        },
        {
            label: '预备党员',
            value: 3,
        },
        {
            label: '共产党员',
            value: 4,
        },
    ],
    //教育方式
    educationalModes: [
        {
            label: '全日制',
            value: 1,
        },
        {
            label: '函授',
            value: 2,
        },
        {
            label: '成人自考',
            value: 3,
        },
        {
            label: '网络教育',
            value: 4,
        },
        {
            label: '其他',
            value: 5,
        },
    ],
    //是否最高学历
    firstDegrees: [
        {
            name: '否',
            id: 0,
        },
        {
            name: '是',
            id: 1,
        },
    ],
    orgList: [], // 机构
};

const mutations = {
    [types.SELECT_ORG_LIST](state, parm) {
        // 获取机构
        state.orgList = parm;
    },
};

const actions = {
    //查询机构列表
    getOrgOptionList({ commit }, parm) {
        const URL = '/authority/personalCenter/select';
        const opt = {
            data: JSON.stringify(parm),
            op: 'selectCurrentDeptList',
        };
        return new Promise((resolve, reject) => {
            $vuex.$axios(URL, opt).then(
                res => {
                    // let dataList = JSON.parse(res.data) || [];
                    // let nodes = dataList.map(item => {
                    //     item.partTime == 1;
                    //     return item;
                    // });
                    resolve(JSON.parse(res.data));
                },
                response => {
                    reject(response.data);
                }
            );
        });
    },
    getAttachmentNameList({ commit }, parm) {
        let data = {
            data: JSON.stringify(parm),
            op: 'attachmentSelect',
        };
        let URL = '/authority/personalCenter/select';
        return new Promise((resolve, reject) => {
            $vuex.$axios(URL, data).then(
                response => {
                    let dataList = JSON.parse(response.data);
                    resolve(dataList);
                },
                response => {
                    reject(response.data);
                }
            );
        });
    },
    //附件位---机构查询
    getOrgAttachmentNameList({ commit }, parm) {
        let data = {
            data: JSON.stringify(parm),
            op: 'attachmentSelect',
        };
        let URL = '/orgWeb/common/select';
        return new Promise((resolve, reject) => {
            $vuex.$axios(URL, data).then(
                response => {
                    let dataList = JSON.parse(response.data);
                    resolve(dataList);
                },
                response => {
                    reject(response.data);
                }
            );
        });
    },
    //获取省市---机构查询
    getCityAreaDetail() {
        return new Promise(resolve => {
            const URL = '/local/selectAreaTree';
            let opt = {
                data: JSON.stringify({}),
                op: '',
            };
            $vuex.$axios(URL, opt).then(res => {
                let provinceCityAreaList = JSON.parse(res.data) || [];
                resolve(provinceCityAreaList);
            });
        });
    },
    // 查询机构信息
    getPartnerInfo({ commit }, parm) {
        const URL = '/local/selectOrgOption';
        let opt = {
            data: JSON.stringify(parm),
            op: null,
        };
        return new Promise((resolve, reject) => {
            $vuex.$axios(URL, opt).then(
                response => {
                    let dataList = JSON.parse(response.data);
                    // commit(types.SELECT_SERVICE_PARTNER, dataList);
                    resolve(dataList);
                },
                response => {
                    console.log('neiub1', response);
                    reject(response.data);
                }
            );
        });
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
