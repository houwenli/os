const workbench = {
    namespaced: true,
    state: {
        status: {},
        // 职务机构类型
        orgTypeFilters: [
            { id: 5, value: '大区' },
            { id: 10, value: '省区' },
            { id: 20, value: '分公司' },
            { id: 30, value: '服务中心' },
            { id: 40, value: '实体店' },
        ],
        orgPostFilters: [
            { id: 4, value: '总区' },
            { id: 5, value: '大区' },
            // { id: 10, value: '省区' },
            { id: 20, value: '分公司' },
            { id: 30, value: '服务中心' },
            { id: 40, value: '实体店' },
            { id: 60, value: '独立法人公司' },
        ],
        sexFilters: [//性别
            { id: 2, value: '女' },
            { id: 1, value: '男' },
        ],
        maritalStatusFilters: [//本部信息管理-婚姻状况
            { id: 1, value: '未婚' },
            { id: 2, value: '已婚' },
            { id: 3, value: '离异' },
            { id: 4, value: '其他' },
        ],
        educationFilters: [//本部信息管理-学历
            { id: 1, value: '小学' },
            { id: 2, value: '初中' },
            { id: 3, value: '高中' },
            { id: 4, value: '中专' },
            { id: 5, value: '大专' },
            { id: 6, value: '本科' },
            { id: 7, value: '硕士' },
            { id: 8, value: '博士' },
        ],
        veteransFilters: [
            { id: 1, value: '是' },
            { id: 0, value: '否' },
        ],
        idenceTypeFilters: [
            { id: 1, value: '本市城镇' },
            { id: 2, value: '外埠城镇' },
            { id: 3, value: '本市农村' },
            { id: 4, value: '外埠农村' },
        ],
        fertilityStatusFilters: [//生育状况
            { id: 1, value: '未育' },
            { id: 2, value: '一胎' },
            { id: 3, value: '二胎' },
            { id: 4, value: '多胎' },
        ],
        politicalListFilters: [//政治面貌
            { id: 1, value: '群众' },
            { id: 2, value: '共青团员' },
            { id: 3, value: '预备党员' },
            { id: 4, value: '共产党员' },
        ],
        indicatorsNameFilters: [
            {
                id: 1,
                value: '完成行程订单数'
            },
            {
                id: 2,
                value: '完单司机数'
            },
            {
                id: 3,
                value: '新增实体店数'
            },
            {
                id: 4,
                value: '订单合规率'
            },
            {
                id: 5,
                value: '购买包干金额'
            },
            {
                id: 6,
                value: '活跃实体店数'
            }
        ],
        levelListFilters: [
            {
                id: 1,
                value: '大一'
            },
            {
                id: 2,
                value: '大二'
            },
            {
                id: 3,
                value: '小一'
            },
            {
                id: 4,
                value: '小二'
            },
            {
                id: 5,
                value: '小三'
            }
        ],
        // 一二级机构排名管理动态表头label映射
        tableColumnsTitleFilters: {
            isTripOrder: '完成行程订单数',
            isTripOrderRanking: '完成行程订单数排名',
            isOrderDriver: '完单司机数',
            isOrderDriverRanking: '完单司机数排名',
            isAddAgency: '新增实体店数',
            isAddAgencyRanking: '新增实体店数排名',
            isAppropriateOrder: '订单合规率',
            isAppropriateOrderRanking: '订单合规率排名',
            isVipAmount: '购买包干金额',
            isVipAmountRanking: '购买包干金额排名',
            isActiveAgency: '活跃实体店数',
            isActiveAgencyRanking: '活跃实体店数排名'
        },
        // 一二级机构排名管理动态表头prop映射
        propKeyFilters: {
            isTripOrder: 'tripOrder',
            isOrderDriver: 'orderDriver',
            isAddAgency: 'addAgency',
            isAppropriateOrder: 'appropriateOrder',
            isVipAmount: 'vipAmount',
            isActiveAgency: 'activeAgency',
            isTripOrderRanking: 'tripOrderRanking',
            isOrderDriverRanking: 'orderDriverRanking',
            isAddAgencyRanking: 'addAgencyRanking',
            isAppropriateOrderRanking: 'appropriateOrderRanking',
            isVipAmountRanking: 'vipAmountRanking',
            isActiveAgencyRanking: 'activeAgencyRanking'
        },
        // 一二级机构排名管理动态表头tip映射
        tipContentFilter: {
            tripOrder: '司机结束行程的订单数量',
            orderDriver: '完成行程订单大于等于1单以上的司机数量',
            addAgency: '开业时间在当月的实体店数量',
            appropriateOrder: '双证司机完成行程订单量/完成总行程订单量，系统A类、E类、F类、K类都算双证司机',
            vipAmount: '累计购买包干费用',
            activeAgency: '当月包干金额大于0或日均完成行程订单大于等于10单或注册审核通过司机数大于0的实体店数',
        },
        // 配置比例与配置名称的对应关系
        propNameFilters: {
            isTripOrder: 'tripOrderRatio',
            isOrderDriver: 'orderDriverRatio',
            isAddAgency: 'addAgencyRatio',
            isAppropriateOrder: 'appropriateOrderRatio',
            isVipAmount: 'vipAmountRatio',
            isActiveAgency: 'activeAgencyRatio'
        },
        //转岗类型
        jobTransferFilters: [
            {
                value: '业务调整',
                id: 1,
            },
            {
                value: '个人职业发展',
                id: 2,
            },
            {
                value: '发文调整',
                id: 3,
            },
            {
                value: '部门撤销',
                id: 4,
            },
            {
                value: '其他',
                id: 5,
            },
        ],
        // 审核状态
        auditStatusFilters: [
            {
                value: '待审核',
                id: 1,
            },
            {
                value: '审核通过',
                id: 3,
            },
            {
                value: '审核不通过',
                id: 4,
            },
        ],
        reportStatusFilters: [
            {
                value: '上报',
                id: 1,
            },
            {
                value: '不上报',
                id: 2,
            },
            {
                value: '取消上报',
                id: 3,
            },
        ],
        antiepidemicStatusFilters: [
            {
                value: '防疫中',
                id: 1,
            },
            {
                value: '未防疫',
                id: 0,
            },
        ],
        detectStatusFilters: [
            {
                value: '已核酸',
                id: 100,
            },
            {
                value: '未核酸',
                id: 101,
            },
            {
                value: '未知',
                id: 102,
            },
        ],
        conferenceForm:{
            name:'',
            address:'',
            signTime:'',
            returnTime:'',
            description:'',
            requirement:'',

            organizerIds: [], //会议管理会务组人员
            conferenceUsers:[], //会议管理参与人员
            deptIds:[], //会议管理参与的机构

            notify:false,
        },
        localTypeFilters: [
            {
                value: '非包干',
                id: 0,
            },
            {
                value: '有效包干',
                id: 1,
            },
            {
                value: '无效包干',
                id: 2,
            },
        ],
        vipTypeFilters: [
            {
                value: '非包干',
                id: 0,
            },
            {
                value: '有效包干',
                id: 1,
            },
            {
                value: '无效包干',
                id: 2,
            },
        ],
        partnerTypeFilters: [
            {
                value: '普通车主',
                id: 1,
            },
            {
                value: '共享合伙人',
                id: 2,
            },
            {
                value: '高级合伙人',
                id: 3,
            },
        ],
        complianceTypeFilters: [
            {
                value: '双证司机',
                id: 1,
            },
            {
                value: '单人证司机',
                id: 2,
            },
            {
                value: '单车证司机',
                id: 3,
            },
            {
                value: '无证司机',
                id: 4,
            },
        ],
        checkStatusTypeFilters:[
            {
                value: '未入库',
                id: 0,
            },
            {
                value: '已入库',
                id: 1,
            },
        ],
        //两轮车质检工具机构类型
        dogcartOrgTypeFilters: [
            { id: 0, value: '-' },
            { id: 5, value: '-' },
            { id: 10, value: '-' },
            { id: 20, value: '城市分公司' },
            { id: 30, value: '区县分公司' },
            { id: 40, value: '实体店' },
            { id: 100, value: '-' },

        ],
    },

    mutations: {
        SET_STATUS: (state, status) => {
            state.status = status;
        }
    },

    actions: {
        //
        editStatus({ commit }, data) {
            commit('SET_STATUS', data);
        },

        modifyStatus({ commit }, data) {
            commit('SET_STATUS', data);
        }
    }
};

export default workbench;
