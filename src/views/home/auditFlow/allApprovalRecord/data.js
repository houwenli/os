/**
 * 业务类型, 审核类型 枚举 op
 * op 表示查询的op
 * revoke 表示撤销的op， 撤销的op 字符串明明规则是  op+Revoke
 * opPrefix 表示一种大类的op前缀， 因为拿到的权限表其实是没有层级的 - 可能后续会使用到这个前缀
 *
 * 因为最终拿到的op其实是平级的， 为了避免op重名， 所有下面op 都以 opPrefix + 司机入网申请翻译 这种组合
 */
export const opsEnums = [
  {
    "id": 1,
    "name": "网约车审批",
    opPrefix: 'onlineCarHailing',
    // 查询的op
    list: [
      {
        "id": 1,
        "name": "司机入网申请",
        op: 'onlineCarHailingDriverAccessApplication',
        revoke: 'onlineCarHailingDriverAccessApplicationRevoke'
      },
      {
        "id": 2,
        "name": "司机修改资料",
        op: 'onlineCarHailingDriverModifiesData',
        revoke: 'onlineCarHailingDriverModifiesDataRevoke'
      },
      {
        "id": 3,
        "name": "司机头像审核",
        op: 'onlineCarHailingDriverPortraitReview',
        revoke: 'onlineCarHailingDriverPortraitReviewRevoke'
      },
      {
        "id": 4,
        "name": "车辆保险审核",
        op: 'onlineCarHailingVehicleInsuranceReview',
        revoke: 'onlineCarHailingVehicleInsuranceReviewRevoke'
      },
      {
        "id": 5,
        "name": "合规资质审核",
        op: 'onlineCarHailingComplianceQualificationReview',
        revoke: 'onlineCarHailingComplianceQualificationReviewRevoke'
      },
      {
        "id": 6,
        "name": "司机医学检测报告审核",
        op: 'onlineCarHailingDriverMedicalTestReportReview',
        revoke: 'onlineCarHailingDriverMedicalTestReportReviewRevoke'
      },
      {
        "id": 7,
        "name": "身份证找回申请",
        op: 'onlineCarHailingApplicationForIDCardRetrieval',
        revoke: 'onlineCarHailingApplicationForIDCardRetrievalRevoke'
      },
      {
        "id": 8,
        "name": "修改系统双证",
        op: 'onlineCarHailingModifyTheSystemDoubleCertificate',
        revoke: 'onlineCarHailingModifyTheSystemDoubleCertificateRevoke'
      },
      {
        "id": 10,
        "name": "身份证更换申请",
        op: 'onlineCarHailingApplicationForReplacementOfIDCard',
        revoke: 'onlineCarHailingApplicationForReplacementOfIDCardRevoke'
      },
      {
        "id": 11,
        "name": "异常订单处理申请",
        op: 'onlineCarHailingExceptionOrderProcessingApplication',
        revoke: 'onlineCarHailingExceptionOrderProcessingApplicationRevoke'
      },
      {
        "id": 13,
        "name": "司机风控扣款返还",
        op: 'onlineCarHailingRefundOfDriversRiskControlDeduction',
        revoke: 'onlineCarHailingRefundOfDriversRiskControlDeductionRevoke'
      },
      {
        id: 14,
        name: '司机合伙人申请',
        op: 'onlineCarHailingDriverCoCreatorApplication',
        revoke: 'onlineCarHailingDriverCoCreatorApplicationRevoke'
      },
      {
        id: 15,
        name: '司机合伙人补充资料',
        op: 'onlineCarHailingDriverSupplementaryInformation',
        revoke: 'onlineCarHailingDriverSupplementaryInformationRevoke'
      }
    ]
  },
  {
    "id": 2,
    "name": "新出租车审批",
    opPrefix: 'newTaxi',
    list: [
      {
        "id": 1,
        "name": "司机入网申请",
        op: 'newTaxiDriverAccessApplication',
        revoke: 'newTaxiDriverAccessApplicationRevoke'
      },
      {
        "id": 2,
        "name": "司机修改资料",
        op: 'newTaxiDriverModifiesData',
        revoke: 'newTaxiDriverModifiesDataRevoke'
      }
    ]
  },
  {
    "id": 3,
    "name": "机构审批",
    opPrefix: 'org',
    list: [
      {
        "id": 30,
        "name": "城市分公司变更申请",
        op: 'orgBranchChangeApplication',
        revoke: 'orgBranchChangeApplicationRevoke'
      },
      {
        "id": 31,
        "name": "区县分公司变更申请",
        op: 'orgServiceCenterChangeRequest',
        revoke: 'orgServiceCenterChangeRequestRevoke'
      },
      {
        "id": 32,
        "name": "实体店变更申请",
        op: 'orgPhysicalStoreChangeApplication',
        revoke: 'orgPhysicalStoreChangeApplicationRevoke'
      },
      {
        "id": 33,
        "name": "实体店附件变更申请",
        op: 'orgApplicationForChangeOfPhysicalStoreSccessories',
        revoke: 'orgApplicationForChangeOfPhysicalStoreSccessoriesRevoke'
      },
      {
        "id": 35,
        "name": "独立法人公司申请",
        op: 'orgApplicationOfIndependentLegalEntity',
        revoke: 'orgApplicationOfIndependentLegalEntityRevoke'
      },
      {
        "id": 36,
        "name": "门店合并申请",
        op: 'storeConsolidationApplication',
        revoke: 'storeConsolidationApplicationRevoke'
      },
      {
        "id": 37,
        "name": "机构人员变动申请",
        op: 'orgApplicationForChangeOfUrbanCoCreators',
        revoke: 'orgApplicationForChangeOfUrbanCoCreatorsRevoke'
      },
      {
        "id": 38,
        "name": "转移机构申请",
        op: 'transferAgencyApplication',
        revoke: 'transferAgencyApplicationRevoke'
      },
      {
        "id": 39,
        "name": "开业变更申请",
        op: 'applicationForChangeOfPractice',
        revoke: 'applicationForChangeOfPracticeRevoke'
      }
    ]
  },
  {
    "id": 5,
    "name": "行政审批",
    opPrefix: 'administration',
    list: [
      {
        "id": 24,
        "name": "总部通用审批",
        op: 'administrationGeneralApproval',
        revoke: 'administrationGeneralApprovalRevoke'
      },
      {
        "id": 29,
        "name": "机构通用审批",
        op: 'mechanismAdministrationGeneralApproval',
        revoke: 'mechanisAdministrationGeneralApprovalRevoke'
      },
      {
        "id": 23,
        "name": "分支机构权限申请",
        op: 'administrationBranchAuthorityApplication',
        revoke: 'administrationBranchAuthorityApplicationRevoke'
      },
      {
        "id": 27,
        "name": "总部权限申请",
        op: 'administrationHeadquartersAuthorityApplication',
        revoke: 'administrationHeadquartersAuthorityApplicationRevoke'
      }
    ]
  },
  {
    "id": 7,
    "name": "需求审批",
    opPrefix: 'demand',
    list: [
      {
        "id": 25,
        "name": "技术需求申请",
        op:"demandDemandApplication",
        revoke: 'demandDemandApplicationRevoke'
      },
      {
        "id": 28,
        "name": "业务需求申请",
        op:"businessDemandDemandApplication",
        revoke: 'businessDemandDemandApplicationRevoke'
      },
      {
        "id": 26,
        "name": "需求关闭",
        op:"demandDemandClosure",
        revoke: 'demandDemandClosureRevoke'
      },
      {
        "id": 21,
        "name": "代驾业务需求申请",
        op:"daijiaDemandDemandApplication",
        revoke: 'daijiaDemandDemandApplicationRevoke'
      }
    ]
  },
  {
    "id": 8,
    "name": "卡券审批",
    opPrefix: 'coupons',
    list: [
      {
        "id": 40,
        "name": "出行券配置申请",
        op: 'couponsTraveVoucherConfigurationApplication',
        revoke: 'couponsTraveVoucherConfigurationApplicationRevoke'
      },
      {
        "id": 41,
        "name": "红包配置申请",
        op: 'couponsRedPacketConfigurationApplication',
        revoke: 'couponsRedPacketConfigurationApplicationRevoke'
      },
      {
        "id": 42,
        "name": "实体福卡新增申请",
        op: 'couponsApplicationForAdditionOfPhysicalWelfareCard',
        revoke: 'couponsApplicationForAdditionOfPhysicalWelfareCardRevoke'
      },
      {
        "id": 43,
        "name": "实体福卡领取申请",
        op: 'couponsApplicationForPhysicalWelfareCard',
        revoke: 'couponsApplicationForPhysicalWelfareCardRevoke'
      },
      {
        "id": 44,
        "name": "出行券补量申请",
        op: 'couponsApplicationForSupplementOfTravelVouchers',
        revoke: 'couponsApplicationForSupplementOfTravelVouchersRevoke'
      },
      {
        "id": 45,
        "name": "红包补量申请",
        op: 'couponsRedPacketSupplementApplication',
        revoke: 'couponsRedPacketSupplementApplicationRevoke'
      },
      {
        "id": 46,
        "name": "出行券补偿奖励申请",
        op: 'couponsVoucherAllocationCompensation',
        revoke: 'couponsVoucherAllocationCompensationRevoke'
      },
      {
        "id": 47,
        "name": "电商优惠券配置申请",
        op: 'couponsecommerceSupplementApplication',
        revoke: 'couponsecommerceSupplementApplicationRevoke'
      },
      {
        "id": 48,
        "name": "电商优惠券补量申请",
        op: 'couponsecommerceSupplementApplication',
        revoke: 'couponsecommerceSupplementApplicationRevoke'
      },
      {
        "id": 49,
        "name": "换电券配置申请",
        op: 'CarApplication',
        revoke: 'revokeCarApplication'
      },
      {
        "id": 140,
        "name": "换电券补量申请",
        op: 'AddCarApplication',
        revoke: 'revokeAddCarApplication'
      }
    ]
  },
  {
    "id": 9,
    "name": "人事审批",
    opPrefix: 'humanAffairs',
    list: [
      {
        "id": 50,
        "name": "入职审批",
        op: 'humanAffairsEnrollmentApproval',
        revoke: 'humanAffairsEnrollmentApprovalRevoke'
      },
      {
        "id": 51,
        "name": "转正审批",
        op: 'humanAffairsEmploymentConfirmationApproval',
        revoke: 'humanAffairsEmploymentConfirmationApprovalRevoke'
      },
      {
        "id": 52,
        "name": "调岗审批",
        op: 'humanAffairsPostTransferApproval',
        revoke: 'humanAffairsPostTransferApprovalRevoke'
      },
      {
        "id": 53,
        "name": "离职审批",
        op: 'humanAffairsResignationApproval',
        revoke: 'humanAffairsResignationApprovalRevoke'
      },
      {
        "id": 54,
        "name": "员工离职申请",
        op: 'humanAffairsEmployeeResignationApplication',
        revoke: 'humanAffairsEmployeeResignationApplicationRevoke'
      }
    ]
  },
  {
    "id": 10,
    "name": "活动审批",
    opPrefix: 'active',
    list: [
      {
        "id": 60,
        "name": "用户活动上线申请",
        op: 'activeUserActivityCreationRequest',
        revoke: 'activeUserActivityCreationRequestRevoke'
      },
      {
        "id": 61,
        "name": "车主活动创建申请",
        op: 'activeOwnerActivityCreationApplication',
        revoke: 'activeOwnerActivityCreationApplicationRevoke'
      },
      {
        "id": 62,
        "name": "机构活动上线申请",
        op: 'activeOrganizationActivityCreationApplication',
        revoke: 'activeOrganizationActivityCreationApplicationRevoke'
      },
      {
        "id": 63,
        "name": "电商活动上线申请",
        op: 'onlineActivityCreationApplication',
        revoke: 'onlineActivityCreationApplicationRevoke'
      },
      {
        "id": 64,
        "name": "代驾司机活动上线申请",
        op: 'designatedDriver',
        revoke: 'designatedDriverRevoke'
      }
    ]
  },
  {
    "id": 11,
    "name": "新能源审批",
    opPrefix: 'newEnergy',
    list: [
      {
        "id": 70,
        "name": "购车订单审批",
        op: 'newEnergyApprovalOfVehiclePurchaseOrder',
        revoke: 'newEnergyApprovalOfVehiclePurchaseOrderRevoke'
      },
      {
        "id": 71,
        "name": "订金退款审批",
        op: 'newEnergyDepositRefundApproval',
        revoke: 'newEnergyDepositRefundApprovalRevoke'
      },
      {
        "id": 72,
        "name": "新能源团购订单审核",
        op: 'newEnergyDepositRefundApproval',
        revoke: 'newEnergyDepositRefundApprovalRevoke'
      }
    ]
  },
  {
    // 代驾审批目前没有撤销功能，撤销op可暂时不配置
    "id": 12,
    "name": "代驾审批",
    opPrefix: 'agentDriving',
    list: [
      {
        "id": 80,
        "name": "代驾异常订单退款",
        op: 'agentDrivingRefundOfRegistrationFee',
        revoke: 'agentDrivingRefundOfRegistrationFeeRevoke'
      },
      {
        "id": 81,
        "name": "代驾报名费退款",
        op: 'agentDrivingRefundOfAbnormalOrders',
        revoke: 'agentDrivingRefundOfAbnormalOrdersRevoke'
      },
      {
        "id": 82,
        "name": "代驾司机入网",
        op: 'agentDrivingValetDriverAccessApplication',
        revoke: 'agentDrivingValetDriverAccessApplicationRevoke'
      },
      {
        "id": 83,
        "name": "代驾异常单刷单审批",
        op: 'agentDrivingAbnormalSingleBrush',
        revoke: 'agentDrivingAbnormalSingleBrushRevoke'
      }
    ]
  }, {
      // 工单审批
      "id": 13,
      "name": "工单审批",
      opPrefix: 'sos',
      list: [{
            "id": 90,
            "name": "车基求救工单",
            op: 'sosPortraitReview',
            revoke: 'sosPortraitReviewRevoke'
        },
        {
            "id": 91,
            "name": "业务反馈工单",
            op: 'workOrderApprovalBusiness',
            revoke: 'workOrderApprovalBusinessRevoke'
        },
        {
            "id": 92,
            "name": "客服反馈工单",
            op: 'workOrderApprovalCustomer',
            revoke: 'workOrderApprovalCustomerRevoke'
        }
      ]
  }
]
