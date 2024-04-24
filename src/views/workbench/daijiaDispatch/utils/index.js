// 时间戳转换成年-月-日-时-分-秒格式
export const timestampToTime13 = (timestamp, unit = '') => {
    if (!timestamp) {
        return unit;
    }
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
};

/**
 * @description: 处理金额
 * @param {number} val
 * @return {string} 
 */
export const parseMoney = (val) => {
    let value = Math.round((val / 100) * 100) / 100 || 0;
    if (Math.abs(value) < 10000) {
        return value ? value + ' 元' : '0.00';
    } else if (10000 <= Math.abs(value) && Math.abs(value) < 100000000) {
        let temp = (value / 10000).toFixed(2);
        return temp + ' 万元';
    } else {
        let temp = (value / 100000000).toFixed(4);
        return temp + ' 亿元';
    }
};

/**
 * @description: 正则切分千分位  例:10000 => 10,000
 * @param {Number | String} num
 * @return {String} 
 */
export const addCommas = (num) => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

/**
 * @description: 计算日期前一天/后一天
 * @param {Date} date 代表指定的日期
 * @param {Number} day 传-1表始前一天，传1表始后一天
 * @return {String} 格式：2018/09/27
 */
export const getNextDate = (date, day) => {
    var dd = new Date(date);
    dd.setDate(dd.getDate() + day);
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
    return y + "/" + m + "/" + d;
}

/**
 * @description: 转成年/月/日格式
 * @param {Date} date
 * @return {String}
 */
export const formatDate = (date) => {
    var date = date ? new Date(date) : new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '/' + m + '/' + d;
}

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1
                    ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length)
            );
        }
    }
    return fmt;
}

/**
 * @description: 创建时间段数据
 * @param {Date} time
 * @param {number} num 相差天数 len+1
 * @return {Array} 
 */
export const toTimeDuration = (time = new Date(), num = 7) => {
    const today = formatDate(time)
    let list = []
    for (let i = 0; i < num + 1; i++) {
        let time = getNextDate(today, -i);
        list[i] = time
    }
    return list.reverse()
}

/**
 * @description: 计算两个时间相差天数
 * @param {String} d1 yyyy-mm-dd格式
 * @param {String} d2 yyyy-mm-dd格式
 * @return {Number}
 */
export const datedifference = (d1, d2) => {
    var dateBegin = new Date(d1.replace(/-/g, "/"));//将-转化为/，使用new Date
    var dateEnd = new Date(d2.replace(/-/g, "/"));//获取当前时间
    var dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
    return dayDiff
}


/**
 * @description: 订单类型
 */
export const serviceType = {
    0: '全部',
    20: '实时',
    21: '预约',
    22: '扫码',
    40: '拼车',
    70: '包车',
}
/**
 * @description: 层级
 */
export const orgType = [
    { text: '总部', code: 0 },
    {
        text: '总区',
        code: 4
    },
    {
        text: '大区',
        code: 10
    },
    {
        text: '一级机构',
        code: 20
    },
    {
        text: '二级机构',
        code: 30
    },
    {
        text: '实体店',
        code: 40
    }
]

/**
 * @description: 订单总览
 */
export const tableColumnOrder = [
    { prop: 'serviceType', label: '类型', handleData: true, slotName: 'serviceType' },
    { prop: 'orderCnt', label: '下单总量' },
    { prop: 'finishAndPaidOrderCnt', label: '完成行程订单总量' },
    { prop: 'finishAndPaidOrderAmt', label: '完成行程订单总金额', handleAmt: (val) => parseMoney(val) },
    { prop: 'cancelCnt', label: '取消订单总量' },
    { prop: 'passengerCnt', label: '下单乘客量' },
    { prop: 'driverCnt', label: '接单司机量' },
]
/**
 * @description: 已付款详情
 */
export const tableColumnPaid = [
    { prop: 'desc', label: '支付类型' },
    { prop: 'paidCnt', label: '订单总量' },
    { prop: 'paidAmt', label: '订单总金额', handleAmt: (val) => parseMoney(val) },
    { prop: 'actualPaidAmt', label: '实付总金额', handleAmt: (val) => parseMoney(val) },
    { prop: 'discountAmt', label: '优惠总金额', handleAmt: (val) => parseMoney(val) },
    { prop: 'driverAmt', label: '司机实际所得总金额', handleAmt: (val) => parseMoney(val) },
    { prop: 'repairAmt', label: '补偿总金额', handleAmt: (val) => parseMoney(val) },
    { prop: 'balanceAmt', label: '余额支付总金额', handleAmt: (val) => parseMoney(val) },
    { prop: 'platformChargeAmt', label: '平台费总金额', handleAmt: (val) => parseMoney(val) },
    { prop: 'companyIncome', label: '公司收益', handleAmt: (val) => parseMoney(val) },
]
/**
 * @description: 下单渠道的完单统计(单)
 */
export const tableColumnChannel = [
    { prop: 'desc', label: '下单渠道' },
    { prop: 'allOrder', label: '全部' },
    { prop: 'realOrder', label: '实时订单' },
    { prop: 'appointmentOrder', label: '预约订单' },
    { prop: 'charteredOrder', label: '包车订单' },
]
/**
 * @description: 特殊订单的完单统计(单)
 */
export const tableColumnSpecial = [
    { prop: 'desc', label: '下单渠道' },
    { prop: 'inviteOrderCnt', label: '邀约订单' },
    { prop: 'fixedPriceCnt', label: '一口价订单' },
    { prop: 'oldManModeCnt', label: '助老模式订单' },
    { prop: 'receiveAirportCnt', label: '接机订单' },
    { prop: 'sendAirportCnt', label: '送机订单' },
]

/**
 * @description: 合规明细数据
 */
export const tableColumnCompliance = [
    { label: '序号', type: "index", width: 100 },
    { prop: 'companyName', label: '机构名称' },
    { prop: 'parentName', label: '上级机构' },
    { prop: 'agencyNumber', label: '机构编码' },
    { prop: 'orderCertDoubleCnt', label: '双证订单数' },
    { prop: 'finishedOrderCnt', label: '完成行程订单数' },
    { prop: 'rate', label: '订单合规率', handleAmt: (val) => `${val}%` },
]

/**
 * @description: 司机取消次数排名 
 */
export const tableColumnDriverCancel1 = [
    { label: '排名', type: "index", width: 100 },
    { prop: 'stationName', label: '实体店名称' },
    { prop: 'parentName', label: '上级机构' },
    { prop: 'cancelCnt', label: '取消次数' },
]

/**
 * @description: 司机取消次数排名 一级机构
 */
export const tableColumnDriverCancel = [
    { label: '排名', type: "index", width: 100 },
    { prop: 'driverName', label: '司机姓名' },
    { prop: 'cancelCnt', label: '取消次数' },
]

/**
 * @description: 司机取消次数排名 二级机构
 */
export const tableColumnDriverCancelOne = [
    { label: '排名', type: "index", width: 100 },
    { prop: 'stationName', label: '实体店名称' },
    { prop: 'cancelCnt', label: '取消次数' },
]

/**
 * @description: 司机取消次数排名top 二级机构
 */
export const tableColumnDriverCancelTop = [
    { label: '排名', type: "index", width: 100 },
    { prop: 'driverName', label: '司机姓名' },
    { prop: 'orgName', label: '上级机构' },
    { prop: 'cancelCnt', label: '取消次数' },
]

/**
 * @description: 订单取消地域分布（仅统计实时单）
 */
export const tableColumnArea = [
    { prop: 'companyName', label: '一级机构', fixed: true },
    { prop: 'rate', label: '取消率', width: 90, sortable: true, handleAmt: (val) => `${val}%` },
    { prop: 'cancelCnt', label: '取消订单总量', width: 130, sortable: true, },
    { prop: 'beforePassengerCancelCnt', label: '接单前乘客取消订单', handleData: true, slotName: 'beforePassengerCancelCnt' },
    { prop: 'beforeSystemCancelCnt', label: '接单前系统取消订单', handleData: true, slotName: 'beforeSystemCancelCnt' },
    { prop: 'beforeBackCancelCnt', label: '接单前平台取消订单', handleData: true, slotName: 'beforeBackCancelCnt' },
    { prop: 'afterDriverCancelCnt', label: '接单后司机取消订单', handleData: true, slotName: 'afterDriverCancelCnt' },
    { prop: 'afterPassengerCancelCnt', label: '接单后乘客取消订单', handleData: true, slotName: 'afterPassengerCancelCnt' },
    { prop: 'afterSystemCancelCnt', label: '接单后系统取消订单', handleData: true, slotName: 'afterSystemCancelCnt' },
    { prop: 'afterBackCancelCnt', label: '接单后平台取消订单', handleData: true, slotName: 'afterBackCancelCnt' },
]


/**
 * @description: 订单取消地域分布（仅统计实时单）
 */
export const tableColumnAreaLow = [
    { prop: 'companyName', label: '实体店', fixed: true },
    { prop: 'rate', label: '取消率', width: 100, sortable: true, handleAmt: (val) => `${val}%` },
    { prop: 'afterOrderCancelCnt', label: '接单后取消订单总量',  handleData: false, slotName: 'afterOrderCancelCnt' },
    { prop: 'afterDriverCancelCnt', label: '接单后司机取消订单量', handleData: true, slotName: 'afterDriverCancelCnt' },
    { prop: 'afterPassengerCancelCnt', label: '接单后乘客取消订单量', handleData: true, slotName: 'afterPassengerCancelCnt' },
    { prop: 'afterSystemCancelCnt', label: '接单后系统取消订单量', handleData: true, slotName: 'afterSystemCancelCnt' },
    { prop: 'afterBackCancelCnt', label: '接单后平台取消订单量', handleData: true, slotName: 'afterBackCancelCnt' },
]


/**
 * @description: 订单取消地域分布（仅统计实时单）
 */
export const tableColumnOrderDetailed = [
    { label: '序号', type: "index", width: 100 },
    { prop: 'orderId', label: '订单号' },
    { prop: 'startAddress', label: '订单起点' },
    { prop: 'endAddress', label: '订单终点' },
    { prop: 'createTime', label: '取消时间' },
]

/**
 * 防抖
 */
export const debounce = (fun, delay = 500) => {
    let timer; //定时器
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fun.apply(this, args);
        }, delay);
    };
}
// 获取近多少天日期
export const getFinalDay = (day, theDate) => {
    var toDay = new Date();
    if (theDate) {
        toDay = new Date(theDate);
    }
    var targetDay_milliseconds = toDay.getTime() + 1000 * 60 * 60 * 24 * day;
    toDay.setTime(targetDay_milliseconds);
    var tYear = toDay.getFullYear();
    var tDate = toDay.getDate();
    var tMonth = toDay.getMonth();
    tMonth = getHandleMonth(tMonth + 1);
    tDate = getHandleMonth(tDate);
    return tYear + '-' + tMonth + '-' + tDate;
}
export const getHandleMonth = (month) => {
    var m = month;
    if (month.toString().length == 1) {
        m = '0' + month;
    }
    return m;
}
