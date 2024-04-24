/**
 *
 * @param {*} oldArray  老数组
 * @param {*} newArray  新数组
 * @param {*} key       关键字段
 */
export function updateArray(oldArray, newArray, key) {
    //return toStr(t) === '[object Object]'
    let result = oldArray;
    newArray.map(item_new => {
        if (
            !result.find(item_f => {
                return item_f[key] == item_new[key];
            })
        ) {
            result.push(item_new);
        }
    });
    result.map((item_old, index) => {
        if (
            !newArray.find(item_new => {
                return item_new[key] == item_old[key];
            })
        ) {
            result.splice(index, 1);
        }
    });
    return result;
}

/***
 * 生成一个不重复的ID
 */
export function createId() {
    let idStr = Date.now().toString(36);
    idStr += Math.random().toString(36).substr(3);
    return idStr;
}
