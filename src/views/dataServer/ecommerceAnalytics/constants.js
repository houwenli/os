export const columnOptions = {
    // 商品点击TOP分析
    1: [
        {
            label: '点击总人数',
            prop: 'clickNumber'
        },
        {
            label: '点击总量',
            prop: 'clickTotals'
        },
        {
            label: '人均点击量',
            prop: 'clickPer'
        }
    ],
    // 商品购物车TOP分析
    2: [
        {
            label: '加购总人数',
            prop: 'shoppingNumber'
        },
        {
            label: '加购总件数',
            prop: 'shoppingTotals'
        },
        {
            label: '人均加购件数',
            prop: 'shoppingPer',
            content: '加购总件数/加购总人数'
        },
        {
            label: '加购价值预估',
            prop: 'shoppingAmount',
            content: '对应SKU商品的万顺售价*加购数量的计算总和'
        }
    ],
    // 商品下单TOP分析
    3: [
        {
            label: '下单总人数',
            prop: 'orderNumber'
        },
        {
            label: '下单总订单数',
            prop: 'orderTotals'
        },
        {
            label: '下单总金额',
            prop: 'orderAmount'
        }
    ],
    // 商品支付TOP分析
    4: [
        {
            label: '支付总人数',
            prop: 'payNumber'
        },
        {
            label: '支付总订单数',
            prop: 'payTotals'
        },
        {
            label: '支付总金额',
            prop: 'payAmount'
        },
        {
            label:'商品总毛利',
            prop: 'grossMargin'
        },
        {
            label:'商品毛利率(%)',
            prop: 'grossMarginRatio'
        }
    ],
    // 商品退款TOP分析
    5: [
        {
            label: '总订单数',
            prop: 'orderNumbers'
        },
        {
            label: '总退款数',
            prop: 'refundNumber'
        },
        {
            label: '退款率',
            prop: 'refundRatio',
            content: '总退款数/总订单数',
            format: (val) => {
                return `${((val.refundRatio / 100)|| 0).toFixed(2)}%`
            }
        }
    ],
    // 商品复购TOP分析
    6: [
        {
            label: '复购总人数',
            prop: 'repurchaseNumber',
            content: '二次或多次购买该SPU的用户总数，已进行用户去重'
        },
        {
            label: '复购总订单量',
            prop: 'repurchase',
            content: '二次或多次购买该SPU的总订单数之和，不计首单数'
        },
        {
            label: '总复购金额',
            prop: 'repurchaseAmount',
            content: '二次或多次购买该SPU的订单*售卖价格之和，不计首单金额'
        },
        {
            label: '复购比',
            prop: 'repurchaseRatio',
            content: '复购总人数/购买该商品的去重总人数',
            format: (val) => {
                return `${((val.repurchaseRatio / 100)|| 0).toFixed(2)}%`
            }
        },
        {
            label: '平均复购件数',
            prop: 'repurchasePieces',
            content: '总复购订单量/复购总人数'
        }
    ],
    // 商品首单TOP分析
    7: [
        {
            label: '首单用户总数',
            prop: 'firstorderNumber'
        },
        {
            label: '首单件数总量',
            prop: 'firstorderTotals'
        },
        {
            label: '首单总支付金额',
            prop: 'firstorderAmount'
        },
        {
            label: '首单均价',
            prop: 'firstorderPer',
            content: '件数均价=首单总下单金额/首单用户总数'
        }
    ],
    // 商品收藏TOP分析
    9: [
        {
            label: 'SPU价格',
            prop: 'price'
        },
        {
            label: '收藏总人数',
            prop: 'attentionNumber'
        },
        {
            label: '收藏总价值',
            prop: 'attentionPrice'
        },
    ]
}
export const portOptions = [
    {
        label: '万顺福商城小程序',
        value: 3
    },
    {
        label: '乘客端H5',
        value: 6
    },
    {
        label: '车主端H5',
        value: 5
    },
    {
        label: '网页版H5',
        value: 2
    }
]
export const topRankOptions = [
    {
        label: 'TOP50',
        value: 1
    },
    {
        label: 'TOP100',
        value: 2
    },
    {
        label: 'TOP200',
        value: 3
    },
    {
        label: 'TOP500',
        value: 4
    }
]
export const analysisOption = [
    {
        label: '商品点击TOP分析',
        value: 1
    },
    // {
    //     label: '商品购物车TOP分析',
    //     value: 2
    // },
    {
        label: '商品下单TOP分析',
        value: 3
    },
    {
        label: '商品支付TOP分析',
        value: 4
    },
    // {
    //     label: '商品退款TOP分析',
    //     value: 5
    // },
    // {
    //     label: '商品复购TOP分析',
    //     value: 6
    // },
    // {
    //     label: '商品首单TOP分析',
    //     value: 7
    // }
    {
        label: '商品收藏TOP分析',
        value: 9
    },
]

export const timeOptions = [
    {
        label: '近7天',
        value: 0
    },
    {
        label: '近30天',
        value: 1
    },
    {
        label: '近60天',
        value: 2
    }
]

// 列表排序枚举
export const sortMap = {
    /**
     * ascending 升序
     * descending 降序
     */
    //----------------------------商品点击TOP--------------------------------//
    // 点击总人数
    clickNumber: {
        ascending: 101,
        descending: 102
    },
    // 点击总量
    clickTotals: {
        ascending: 103,
        descending: 104
    },
    // 人均点击
    clickPer: {
        ascending: 105,
        descending: 106
    },
    
    //----------------------------商品购物车TOP-------------------------------//
    // 加购总人数
    shoppingNumber: {
        ascending: 201,
        descending: 202
    },
    // 加购总件数
    shoppingTotals: {
        ascending: 203,
        descending: 204
    },
    // 人均加购件数
    shoppingPer: {
        ascending: 205,
        descending: 206
    },
    // 加购价值预估
    shoppingAmount: {
        ascending: 207,
        descending: 208
    },

    //----------------------------商品下单TOP-------------------------------//
    // 下单总人数
    orderNumber: {
        ascending: 301,
        descending: 302
    },
    // 下单总订单数
    orderTotals: {
        ascending: 303,
        descending: 304
    },
    // 下单总金额
    orderAmount: {
        ascending: 305,
        descending: 306
    },

    //----------------------------商品支付TOP-------------------------------//
    // 支付总人数
    payNumber: {
        ascending: 401,
        descending: 402
    },
    // 支付总订单数
    payTotals: {
        ascending: 403,
        descending: 404
    },
    // 支付总金额
    payAmount: {
        ascending: 405,
        descending: 406
    },
    // 商品总毛利
    grossMargin: {
        ascending: 407,
        descending: 408
    },
    // 商品毛利率(%)
    grossMarginRatio: {
        ascending: 409,
        descending: 410
    },

    //----------------------------商品退款TOP-------------------------------//
    // 总订单数
    orderNumbers: {
        ascending: 501,
        descending: 502
    },
    // 总退款数
    refundNumber: {
        ascending: 503,
        descending: 504
    },
    // 退款率
    refundRatio: {
        ascending: 505,
        descending: 506
    },

    //----------------------------商品复购TOP-------------------------------//
    // 复购总人数
    repurchaseNumber: {
        ascending: 601,
        descending: 602
    },
    // 复购总订单量
    repurchase: {
        ascending: 603,
        descending: 604
    },
    // 总复购金额
    repurchaseAmount: {
        ascending: 605,
        descending: 606
    },
    // 复购比
    repurchaseRatio: {
        ascending: 607,
        descending: 608
    },
    // 平均复购件数
    repurchasePieces: {
        ascending: 609,
        descending: 6010
    },
    //----------------------------商品首单TOP-------------------------------//
    // 首单用户总数
    firstorderNumber: {
        ascending: 701,
        descending: 702
    },
    // 首单件数总量
    firstorderTotals: {
        ascending: 703,
        descending: 704
    },
    // 首单总下单金额
    firstorderAmount: {
        ascending: 705,
        descending: 706
    },
    // 首单均价
    firstorderPer: {
        ascending: 707,
        descending: 708
    },
    //----------------------------商品收藏TOP-------------------------------//
    // 收藏总人数
    attentionNumber: {
        ascending: 801,
        descending: 802
    },
    // 收藏总价值
    attentionPrice: {
        ascending: 803,
        descending: 804
    },
    // SPU价格
    price:{
        ascending: 805,
        descending: 806
    }
}