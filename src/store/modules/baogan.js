/*
 * @Author: DaiYu
 * @Date: 2022-03-23 14:51:44
 * @LastEditors: DaiYu
 * @LastEditTime: 2022-04-02 18:18:08
 * @FilePath: \main\src\store\modules\baogan.js
 */
const state = {
    statusRuleFilters: [
        {
            id: 0,
            value: '待上架'
        },
        {
            id: 3,
            value: '已上架（待生效）'
        },
        {
            id: 1,
            value: '已上架（生效中）'
        },
        {
            id: 2,
            value: '已下架'
        }
    ],
    scopeSwitchFilters: [
        {
            id: 1,
            value: '开启'
        },
        {
            id: 0,
            value: '关闭'
        }
    ],
    isMultiCityFilters: [
        {
            id: 1,
            value: '是'
        },
        {
            id: 0,
            value: '否'
        }
    ],
    vipRuleFilters: [
        {
            id: 1,
            value: '有效'
        },
        {
            id: 0,
            value: '无效'
        }
    ],
    relevanceFilters: [
        {
            id: 1,
            value: '是'
        },
        {
            id: 0,
            value: '否'
        }
    ],
    bgFilters: [
        {
            id: 0,
            value: '无效'
        },
        {
            id: 1,
            value: '有效'
        }
    ],
    baoganPayTypeFilters: [
        {
            id: 0,
            value: '余额支付'
        },
        {
            id: 1,
            value: '支付宝'
        },
        {
            id: 2,
            value: '微信'
        },
        {
            id: 4,
            value: '微信小程序支付'
        },
        {
            id: 5,
            value: '微信H5支付'
        },
        {
            id: 6,
            value: '支付宝H5支付'
        },
        {
            id: 7,
            value: '支付宝扫码支付'
        },
        {
            id: 8,
            value: '微信扫码支付'
        },
        {
            id: 10,
            value: '云闪付'
        },
        {
            id: 12,
            value: '京东支付'
        },
        {
            id: 201,
            value: '赠送'
        },
        {
            id: 202,
            value: '退款'
        },
        {
            id: 15,
            value: '百度支付'
        },
        {
            id: 20,
            value: '包干账户余额支付'
        },
        {
            id: 21,
            value: '余额支付'
        },
        {
            id: 22,
            value: '福气值支付'
        },
    ],
    buyTypeFilters:[
        {
            id: 1,
            value: '网约车'
        },
        {
            id: 2,
            value: '乘客'
        },
        {
            id: 3,
            value: '电商'
        }
    ],
    payModeTypeFilters:[
        {
            id: 1,
            value: '自付'
        },
        {
            id: 2,
            value: '亲友代付'
        }
    ],
    appPayTypeFilters: [
        {
            id: 1,
            value: '支付宝'
        },
        {
            id: 2,
            value: '微信'
        }
    ],
    appRunningFilters: [
        {
            id: 1,
            value: '支付中'
        },
        {
            id: 2,
            value: '支付成功'
        },
        {
            id: 3,
            value: '支付失败'
        },
        {
            id: 4,
            value: '未支付'
        }
    ],
    bgRunningFilters: [
        {
            id: 1,
            value: '已支付'
        },
        {
            id: 8,
            value: '已转入'
        },
        {
            id: 4,
            value: '审核中'
        },
        {
            id: 5,
            value: '退款中'
        },
        {
            id: 7,
            value: '已驳回'
        },
        {
            id: 3,
            value: '已退款（手动）'
        },
        {
            id: 6,
            value: '已退款（自动）'
        }
    ],
    driverTypeList: [
        {
            value: 'A类车主',
            id: 'A'
        },
        {
            value: 'B类车主',
            id: 'B'
        },
        {
            value: 'C类车主',
            id: 'C'
        },
        {
            value: 'D类车主',
            id: 'D'
        },
        {
            value: 'E类车主',
            id: 'E'
        },
        {
            value: 'F类车主',
            id: 'F'
        },
        {
            value: 'G类车主',
            id: 'G'
        },
        {
            value: 'H类车主',
            id: 'H'
        },
        {
            value: 'K类车主',
            id: 'K'
        }
    ],
    refundWayFilters: [
        {
            id: 4,
            value: '退回钱包余额'
        },
        {
            id: 5,
            value: '线下转账退回'
        },
        {
            id: 1,
            value: '按支付方式退回'
        }
    ],
    buyVipCityFilters: [
        { id: 0, value: '按车牌所在城市' },
        { id: 1, value: '按归属机构所在城市' },
        { id: 2, value: '按车牌和归属机构所在城市' }
    ],
    drivongBuyVipCityFilters: [{ id: 1, value: '按归属机构所在城市' }],
    behalfBusinessTypeFilters: [
        { id: 3, value: '全部' },
        { id: 0, value: '未开通' },
        { id: 1, value: '已开通' }
    ],
    vipLumpSumTypeFilters: [
        { id: 0, value: '非包干' },
        { id: 1, value: '有效包干' },
        { id: 2, value: '无效包干' },
        { id: 3, value: '全部' }
    ],
    localLumpSumTypeFilters: [
        { id: 0, value: '非包干' },
        { id: 1, value: '有效包干' },
        { id: 2, value: '无效包干' },
        { id: 3, value: '全部' }
    ],
    recommendedTypeFilters: [
        { id: 1, value: '个人推荐' },
        { id: 2, value: '机构推荐' }
    ],
    stateFilters: [
        { id: 1, value: '已支付' },
        { id: 2, value: '已退款' }
    ],
    payWayFilters: [
        { id: 0, value: '现金支付' },
        { id: 1, value: '余额支付' }
    ],
    // 智慧生活流水支付方式
    smarterLifePayFilters: [
        { id: 1, value: '支付宝' },
        { id: 2, value: '微信' },
        { id: 4, value: '微信小程序' },
        { id: 10, value: '云闪付' },
        { id: 12, value: '京东支付' },
        { id: 0, value: '司机余额' },
        { id: 31, value: '会员费账户余额' },
        { id: 32, value: '乘客余额' }
    ]
}
export default {
    namespaced: true,
    state,
};
