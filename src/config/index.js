/*
 * @Author: CuteBoy
 * @Date: 2022-01-08 14:57:20
 * @Description: 
 */

let env = '-dev03', domain = "wsecar.com";//开发环境请修改这里的默认配置
let SUB03_MICRO_APP, SUB04_MICRO_APP, SUB05_MICRO_APP, SUB02_MICRO_APP;
let originArr = window.location.origin.split('.');
if (!window.location.host.startsWith("127.0.0.1") && !window.location.host.startsWith("localhost")) {
  let envName = originArr[0].split('-')[1];
  env = envName ? '-' + envName : '';
  domain = originArr.slice(1).join('.');
  SUB03_MICRO_APP = `https://ordersystem${env}.${domain}`;
  SUB04_MICRO_APP = `https://passengerpersona${env}.${domain}`;
  SUB05_MICRO_APP = `https://dms${env}.${domain}`;
} else {
  env = "-dev03"
  SUB03_MICRO_APP = `http://10.208.2.46:8003`;
  SUB04_MICRO_APP = `http://10.208.2.12:8004`;
  SUB05_MICRO_APP = `http://10.208.2.14:8005`;
}
const config = {
  // 微应用配置
  SUB03_MICRO_APP,
  SUB04_MICRO_APP,
  SUB05_MICRO_APP,
  // 后台接口配置
  API_URL: process.env.VUE_APP_API_URL,
};

export default config;
