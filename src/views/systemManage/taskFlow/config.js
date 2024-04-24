/**
 * groups 决定审核流 - 设置成员到底怎么取值
 */
export const groups = {
    A: [
        { category: 1, flowNameId: 1 }, //网约车 入网
        { category: 2, flowNameId: 1 }, //出租车 入网
        { category: 1, flowNameId: 2 }, //网约车 修改资料
        { category: 2, flowNameId: 2 }, //出租车 修改资料
        { category: 1, flowNameId: 3 }, //司机头像
        { category: 1, flowNameId: 4 }, //车辆保险
        { category: 1, flowNameId: 5 }, //合规资质审核
        { category: 1, flowNameId: 6 }, //司机医学检测报告审核
        { category: 1, flowNameId: 7 }, //身份证找回申请
        { category: 1, flowNameId: 10 },//身份证更换申请
        { category: 1, flowNameId: 11 },//异常订单处理申请
        { category: 1, flowNameId: 13 },//司机风控扣款返还审核
        { category: 1, flowNameId: 15 },//合伙人资料补充
        { category: 11, flowNameId: 70 },//购车订单审批
        { category: 11, flowNameId: 71 },//订金退款审批
        { category: 11, flowNameId: 72 },//新能源团购订单审批
        { category: 12, flowNameId: 80 },//代驾异常订单退款
        { category: 12, flowNameId: 81 },//代驾报名费退款
        { category: 12, flowNameId: 82 },//代驾司机入网申请
        { category: 12, flowNameId: 83 },//代驾异常单刷单审批
        { category: 13, flowNameId: 90 },//求救工单
    ],
    B: [
        { category: 1, flowNameId: 8 }, // 修改系统双证
        { category: 5, flowNameId: 24 }, //总部通用审批
        { category: 5, flowNameId: 29 }, //机构通用审批
        { category: 5, flowNameId: 27 },//总部权限申请
        { category: 5, flowNameId: 23 },//机构权限申请
        { category: 7, flowNameId: 25 },//技术需求申请
        { category: 7, flowNameId: 28 },//业务需求申请
        { category: 7, flowNameId: 21 },//代驾业务需求申请
        { category: 7, flowNameId: 26 }, //需求关闭
        { category: 9, flowNameId: 50 },//入职审批
        { category: 9, flowNameId: 51 },//转正审批
        { category: 9, flowNameId: 52 },//调岗审批
        { category: 9, flowNameId: 53 },//离职审批
        { category: 9, flowNameId: 54 },//员工离职审批
        { category: 8, flowNameId: 40 },//出行卷配置申请
        { category: 8, flowNameId: 41 },//红包申请
        { category: 8, flowNameId: 42 },//新增实体卡申请
        { category: 8, flowNameId: 43 },//领取实体卡申请
        { category: 8, flowNameId: 44 },//出行卷补量申请
        { category: 8, flowNameId: 45 },//红包补量申请
        { category: 8, flowNameId: 46 },//补偿奖励配置
        { category: 8, flowNameId: 47 },//新增电商优惠券申请
        { category: 8, flowNameId: 48 },//电商优惠券补量配置
        { category: 8, flowNameId: 49 },//换电券申请
        { category: 8, flowNameId: 140 },//换电券补量
        { category: 10, flowNameId: 60 },//活动申请 用户
        { category: 10, flowNameId: 61 },//活动申请 车主
        { category: 10, flowNameId: 62 },//机构活动申请
        { category: 10, flowNameId: 63 },//机构活动申请
        { category: 10, flowNameId: 64 },//机构活动申请
    ],
    C: [
        { category: 3, flowNameId: 30 },//分公司变更申请
        { category: 3, flowNameId: 31 },//服务中心变更申请
        { category: 3, flowNameId: 32 },//实体店变更申请
        { category: 3, flowNameId: 33 },//门店开通申请
        { category: 3, flowNameId: 35 }, //独立法人公司变更申请
        { category: 3, flowNameId: 36 },//门店合并申请
        { category: 3, flowNameId: 37 },//机构人员变动审批
        { category: 3, flowNameId: 38 },//转移机构申请
        { category: 3, flowNameId: 39 },//开业变更申请
    ],
    D: [
        { category: 13, flowNameId: 92 },//客服反馈工单审批
    ],
    E: [
        { category: 13, flowNameId: 91 },//业务反馈工单审批
    ],
}

/**
 * 直属上级下拉
 */
export const getManagerLevelList = () => {
  // 返回[1,2,3,4,5....10]
  return new Array(10).fill().map((p, index) => String(index+1))
}