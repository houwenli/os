const state = {
    InvoiceType: [ // 发票类型
        {id: 1, value: '纸质发票'},
        {id: 2, value: '电子发票'},
    ],
    treatmentStateFilters: [ // 发票处理状态
        {id: 1, value: '待开票'},
        {id: 2, value: '已开票'},
        {id: 3, value: '开票失败'},
    ],
    riseTypeFilters: [ // 抬头类型
        {id: 1, value: '企业单位'},
        {id: 2, value: '个人'}
    ],
    invoiceRecordSateFilters: [
        {id: 0, value: '审核不通过'},
        {id: 1, value: '待开票'},
        {id: 2, value: '已开票'},
        {id: 3, value: '已开票'},
        {id: 6, value: '冲红失败'},
        {id: 7, value: '冲红中'},
        {id: 8, value: '冲红成功'},
        {id: 9, value: '已开票'},
        {id: 10, value: '开票失败'},
        {id: 11, value: '审核不通过'},
        {id: 12, value: '待审核'},
        {id: 13, value: '审核通过'},
        {id: 14, value: '开纸质发票'},
        {id: 15, value: '释放行程'}
    ],
    invoiceFilters: [
        {id: 1, value: '纸质发票'},
        {id: 2, value: '电子发票'},
        {id: 3, value: '机打发票'},
        {id: 4, value: '第三方电子发票'},
    ],
    auditFilters: [ // 审核状态
        {id: 1, value: '待审核'},
        {id: 2, value: '审核通过'},
        {id: 3, value: '审核不通过'}
    ],
    makeOutAnInvoiceFilters: [ // 开票类型
        {id: -3, value: '开票失败'},
        {id: -1, value: '开票失败'},
        {id: 1, value: '待开票'},
        {id: 2, value: '已开票'},
        {id: 3, value: '已开票'},
        {id: 6, value: '冲红中'},
        {id: 7, value: '已冲红'}
    ]
}

export default state;
