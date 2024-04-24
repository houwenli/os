import Vue from 'vue';
import Router from 'vue-router';
import store from '../store/index';
// import { initGlobalState } from 'qiankun';
// export const qiankunActions = initGlobalState({});

Vue.use(Router);
const originalPush = Router.prototype.push;
const originalReplace = Router.prototype.replace;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};
// replace
Router.prototype.replace = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject);
    return originalReplace.call(this, location).catch(err => err);
};

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    noCache: true                // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/index'         // 当前激活的菜单
    activeTags: routeName        // 当前激活的tags
    isMain: false                // 是否为主体应用，解决打开不必要的tags
    isTable: false               // 是否
    subName: name                // qiankun子应用
    isNestRoute: false           // 嵌套路由
  }
 */

import Home from './modules/home.js'; //首页模块
import Workbench from './modules/workbench'; // 工作台
import BusinessSystem from './modules/businessSystem'; //业务系统
import Technology from './modules/technology'; //技术中台
import DataServer from './modules/dataServer'; //数据中台
import SystemManage from './modules/systemManage'; //系统管理
import PersonalCenter from './modules/personalCenter'; //个人中心
import SubSystem from './modules/subSystem'; //微应用配置
import HandleError from './modules/handleError'; //系统错误处理和登录
import personalComplaint from './modules/personalComplaint'; //投诉
import chatMessages from './modules/chatMessages' //消息中心
import addressList from './modules/addressList' //通讯录
import dogcart from './modules/dogcart'//两轮车质检记录
import twoWheeled from './modules/two-wheeled-business.js' // 两轮车
import shoppingMallBusiness from './modules/shopping-mall-business.js' // 万顺福

// 公共路由
export const constantRoutes = [...HandleError, ...Home, ...Workbench, ...BusinessSystem, ...Technology,...DataServer, ...SystemManage, ...PersonalCenter, ...SubSystem, ...personalComplaint, ...chatMessages, ...addressList,...dogcart,
...twoWheeled,
...shoppingMallBusiness
];
const router = new Router({
    mode: 'history',
    // scrollBehavior: () => ({
    //     y: 0,
    // }),
    routes: constantRoutes,
});

router.beforeEach(async (to, from, next) => {
    if(to.path.includes('/login')&&to.path.split('/').pop()==='login'){
        next('/mainLogin')
        return
    }
    let containerEl = document.getElementById('subapp-viewport');
    let { path, meta, query, name } = to;
    let { title, subName, activeTags } = meta;
    let { pathMap } = store.state.breadcrumb;
    let { moduleName = meta.moduleName, systemCode = meta.systemCode } = pathMap[path] || {};
    let {
        loadMicroApp: { appCache },
        breadcrumb: { records },
    } = store.state;
    activeTags = activeTags || name;
    store.commit('breadcrumb/update', { path, moduleName: subName ? moduleName : title, systemCode, query, name: subName, activeTags: subName ? '' : activeTags });
    // 子系统跳转systemCode变化时
    if (from.meta.subName && from.meta.systemCode) {
        // from.meta.subName && from.meta.systemCode && from.meta.systemCode != to.meta.systemCode 原始条件在多入口之间切换时有问题，这里直接卸载
        let isDelTag = !records.some(v => v.systemCode === from.meta.systemCode);
        // 卸载已加载子应用
        await store.dispatch('loadMicroApp/unmountSubApp', { isFree: isDelTag, systemCode: from.meta.systemCode });
    }

    // appCache
    if (subName) {
        to.meta.systemCode = systemCode;
        to.meta.moduleName = moduleName;
        store.commit('breadcrumb/setPathMap', { [path]: { path, moduleName, systemCode } });
        // 新加载子应用
        if (containerEl && !appCache.some(v => v.systemCode === systemCode)) {
            store.commit('loadMicroApp/addSubApp', { systemCode, moduleName, path });
        }
        let subApp = appCache.find(v => v.systemCode === systemCode);
        if (subApp && subApp.status === 'unmount') {
            store.dispatch('loadMicroApp/mountSubApp', { systemCode });
        }
    }
    next();
});

export default router;
