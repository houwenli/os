import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import order from './modules/order';
import finance from './modules/finance';
import intercityLine from './modules/intercityLine';
import enterprisemanagement from './modules/enterprisemanagement';
import orderAnalysis from './modules/orderAnalysis';
import createPersistedState from 'vuex-persistedstate'; //解决vuex状态持久化问题

const modulesFiles = require.context('./modules', false, /\.js$/);

//自动导入modules下的文件
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
    const value = modulesFiles(modulePath);
    modules[moduleName] = value.default;
    return modules;
}, {});

Vue.use(Vuex);

//兼容其他系统接入  暂时
modules['order'] = order; //接入自主订单
modules['finance'] = finance; //接入计价
modules['intercityLine'] = intercityLine; //接入围栏
modules['enterprisemanagement'] = enterprisemanagement; //接入企业后台下单包车计价
modules['orderAnalysis'] = orderAnalysis; //接入订单分析
const store = new Vuex.Store({
    modules,
    getters,
    plugins: [
        createPersistedState({
            key: 'oaVuex',
            paths: ['user', 'subStore', 'tagsView', 'breadcrumb'],
            storage: window.sessionStorage,
        })
        // process.env.NODE_ENV !== 'production' && subSystemLogger(),
    ],
});

export default store;
// systemConfigProject中systemCode为null时添加提示
// function subSystemLogger() {
//     return function (store) {
//         store.subscribe(({ type, payload }) => {
//             if (type === 'subStore/UPDATE_SYSTEM_CONFIG_PROJECT') {
//                 if (!payload.systemCode) {
//                     console.log(`%c${payload.moduleName} systemCode为${payload.systemCode}`, 'background: #E6A23C; color: #fff; border-radius: 3px;padding:2px 5px')
//                 }
//             }
//         });
//     };
// }
