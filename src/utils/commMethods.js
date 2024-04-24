export const _axios = async function (param, moduleName, postUrl) {
    try {
        const op = param.op;
        const url = postUrl ? postUrl : $vuex.$getModuleUrl(moduleName, op);
        delete param.op;
        const resData = await $vuex.$axios(url, { data: JSON.stringify(param), op });
        return { ...resData, data: resData.data && JSON.parse(resData.data) };
    } catch (err) {
        console.error(`[路由地址]：${window.location.pathname} ; [op]: ${param.op} ;[moduleName]: ${moduleName}`)
        return Promise.reject(err)
    }
};

// 判断接口返回值类型 不为null
export const judgeType = function (val, valType = {}) {
    let type = Object.prototype.toString.call(val);
    if (type === '[object Null]' || type === '[object Undefined]') return valType;
    if (type === '[object String]' && val === 'null') return valType;
    return val;
};

// 数字转换简体汉字
export const numTransform = function (num) {
    let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    let unit = ['', '十', '百', '千', '万'];
    num = parseInt(num);
    let getWan = temp => {
        let strArr = temp.toString().split('').reverse();
        let newNum = '';
        for (var i = 0; i < strArr.length; i++) {
            newNum = (i == 0 && strArr[i] == 0 ? '' : i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? '' : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i])) + newNum;
        }
        return newNum;
    };
    let overWan = Math.floor(num / 10000);
    let noWan = num % 10000;
    if (noWan.toString().length < 4) {
        noWan = '0' + noWan;
    }
    return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num);
};

// 获取浏览器版本和内核版本
export const getBroswer = function () {
    var sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/edge\/([\d.]+)/))
        ? (sys.edge = s[1])
        : (s = ua.match(/rv:([\d.]+)\) like gecko/))
            ? (sys.ie = s[1])
            : (s = ua.match(/msie ([\d.]+)/))
                ? (sys.ie = s[1])
                : (s = ua.match(/firefox\/([\d.]+)/))
                    ? (sys.firefox = s[1])
                    : (s = ua.match(/chrome\/([\d.]+)/))
                        ? (sys.chrome = s[1])
                        : (s = ua.match(/opera.([\d.]+)/))
                            ? (sys.opera = s[1])
                            : (s = ua.match(/version\/([\d.]+).*safari/))
                                ? (sys.safari = s[1])
                                : 0;

    if (sys.edge) return { broswer: 'Edge', version: sys.edge };
    if (sys.ie) return { broswer: 'IE', version: sys.ie };
    if (sys.firefox) return { broswer: 'Firefox', version: sys.firefox };
    if (sys.chrome) return { broswer: 'Chrome', version: sys.chrome };
    if (sys.opera) return { broswer: 'Opera', version: sys.opera };
    if (sys.safari) return { broswer: 'Safari', version: sys.safari };

    return { broswer: '', version: '0' };
};
// [ Object, Object ]数组去重
export const removeDuplicate = function (arr) {
    let tempObj = {}; // 这是一个对象
    return arr.reduce((returnVal, currentVal) => {
        // 观察同一属性的值，并放入对象中，若对象中存在该值，则表明重复不进行处理，若对象中不存在该值，表示新值，需要存进去
        if (!tempObj[currentVal.id]) {
            tempObj[currentVal.id] = true; // 若文中Ably的值为true，表示这个值存在，不会走里面的push方法
            returnVal.push(currentVal);
        }
        // a总和，也就是每一次处理后的返回结果 b当前值 c 索引值
        return returnVal;
    }, []);
};

/**
 * 根据子节点key的value，找父节点id，组成数组
 * @param {String} target  匹配的目标值
 * @param {Array} list  匹配的树形结构数据
 * @param {String} key 匹配数据中的key
 * @param {Array} result  结果
 * @returns
 */
export const findParents = function (target, list = [], key = 'resourcesUrl', result = []) {
    if (!list || list.length == 0) return result;
    for (let i = 0; i < list.length; i += 1) {
        const item = list[i];
        if (item[key] == target.path) {
            result.push(item);
            if (result.length == 1) return result;
            return true;
        }
        if (item.children) {
            result.push(item);
            const find = findParents(target, item.children, key, result);
            if (find) {
                return result;
            }
            result.pop();
        }
    }
    return false;
}

// 数据转换
export const arrayFomatter = function (val, arrayTemp, selfAttribute = { value: 'value', label: 'label' }) {
    let str = "";
    for (let i = 0, max = arrayTemp.length; i < max; i++) {
        if (arrayTemp[i][selfAttribute.value] == val) {
            str = arrayTemp[i][selfAttribute.label]
            break;
        }
    }
    return str
}
