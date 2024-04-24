/*
 * @Author: DaiYu
 * @Date: 2022-06-09 17:25:00
 * @LastEditors: DaiYu
 * @LastEditTime: 2022-06-09 17:51:16
 * @FilePath: \main\src\utils\decimal.js
 */
import { Decimal } from 'decimal.js';
// args第一位为被操作数据

//加
function add(a, b) {
    return new Decimal(a).add(new Decimal(b)).toNumber();
}
//减
function sub(a, b) {
    return new Decimal(a).sub(new Decimal(b)).toNumber();
}
// 乘
function mul(a, b) {
    return new Decimal(a).mul(new Decimal(b)).toNumber();
}
// 除
function div(a, b) {
    return new Decimal(a).div(new Decimal(b)).toNumber();
}

export {
    add,
    sub,
    mul,
    div,
};
