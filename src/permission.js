import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from "./store/index"
NProgress.configure({
    showSpinner: false
})

const whiteList = ['/mainLogin', '/auth-redirect', '/bind', '/register']
// const menuMap = {
//     '首页': '/index',
//     '工作台': '/workbench',
//     '业务系统': '/businessSystem',
//     '技术中台': '/technology',
//     '数据中心': '/dataServer',
//     '系统管理': '/systemManage',
//     '个人中心': '/personalCenter',
// }
// let firstEnter = false
router.beforeEach(async (to, from, next) => {
    NProgress.start()
    // 跳转页面为主应用 删除子应用存储的methodList，组件库获取优先获取‘methodList’
    // !to.meta.subName && $vuex.$baseMethod.removeStore('methodList')
    const userInfo = sessionStorage.getItem('_ccmUser') // $vuex.$baseMethod.getStore('_ccmUser');

    if (userInfo) {
        /* has token*/
        if (to.path === '/mainLogin') {
            next()
            NProgress.done()
        } else {
            next();
        }
        // else {
        //     if (to.fullPath.lastIndexOf(to.meta.subName) > 1) {
        //         next({
        //             path: to.fullPath.slice(to.meta.subName.length + 1)
        //         })
        //     } else {
        //         const oaMethodList = window.$vuex.$baseMethod.getStore('os-methodList');
        //         if (!firstEnter && !oaMethodList) {
        //             store.dispatch('login/getMenuList').then(() => {
        //                 let menuList = store.state.login.menuList;
        //                 let firstMenuName = menuList[0]?.resourcesName;
        //                 firstEnter = true;
        //                 next({ path: menuMap[firstMenuName] });
        //             });
        //         } else {
        //             next();
        //         }
        //     }
        // }
    } else {
        // 没有token
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单，直接进入
            next()
        } else {
            next(`/mainLogin?redirect=${to.fullPath}`) // 否则全部重定向到登录页
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})
