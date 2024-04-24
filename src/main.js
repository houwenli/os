import Vue from 'vue'
import App from './App'
import store from './store';
import router from './router'
import ElementUI from 'element-ui'
import Cookies from 'js-cookie'
import VuePlugin from 'vue-plugin'
import * as power from './utils/permission';   //权限事件相关
import echarts from './plugins/echarts'; // Echarts图例
import VueCoreVideoPlayer from 'vue-core-video-player' // 视频

import { _axios, judgeType } from '@/utils/commMethods';
import serviceMap from './serviceMap';
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/base.scss'
import '@/assets/styles/approval.scss'
import './assets/icons' // icon
import './permission' // permission control
import "./assets/icon-font/iconfont.css"

import { qiankunActions } from "./qiankun";
import 'element-ui/lib/theme-chalk/index.css'
import 'vue-plugin/lib/static/css/theme-red/index.css'
import emoji from '@/directive/emoji';
import Footer from '@/components/Footer'
import {createSubSystemRoutes} from "@/store/modules/systemList"


Vue.component(Footer.name, Footer)
Vue.directive('emoji', emoji);
Vue.prototype.$actions = qiankunActions;
Vue.prototype.$echarts = echarts
Vue.prototype._axios = _axios;
Vue.prototype.$judgeType = judgeType;
Vue.prototype._imgUrl = `https://wsjc-web.wsecar.com/oaSystem/`

Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.use(VueCoreVideoPlayer, {
    lang: 'zh-CN'
})

// 防止刷新时空白
const systemList= JSON.parse(sessionStorage.getItem('systemList'))
if(systemList){
    let routes= createSubSystemRoutes(systemList)
    routes.forEach(r=>router.addRoute(r))
}
    

Vue.use(VuePlugin, {
    store,
    router,
    config: {
        debug: 'VUE_APP_BASE_API',
        processEnv: process.env,
        project: {
            moduleName: '万顺福智慧生活管理系统', //项目名
            service: 'VUE_APP_IMP_ACCOUNT', //接口服务
            jumpLink: '/index',
            systemKey: 'os'
        },
        serviceMap
    }
})
power.powerMixin(Vue);               //全局注入权限组件选项

window.$vm = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
