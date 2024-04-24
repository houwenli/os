/*
 * @Author: CuteBoy
 * @Date: 2022-01-24 16:49:22
 * @Description:
 */
import { loadMicroApp } from 'qiankun';
import { systemList as constSystemList } from '@/qiankun/systemList.js';
import router from '@/router';

const state = {
    appCache: [],
};

const getEntry = port => {
    return process.env.NODE_ENV !== 'production' ? `//${window.location.hostname}:${port}` : '';
};

const getSystemList=()=>{
    const systemList=JSON.parse(sessionStorage.getItem('systemList'))||[]
    return [...constSystemList,...systemList]
}

export const filterApp = ({ path, systemCode, moduleName }) => {
    let { name, port } = getSystemList().find(v => path.startsWith(`/${v.name}`));
    return {
        name: `${name}-${systemCode}`,
        entry: getEntry(port) + `/child-${name}/`,
        container: `#subapp-viewport`,
        props: {
            //子应用导航栏状态
            subSystemNavbarStatus: {
                showNavBar: false,
            },
            globalState: { systemConfigProject: { systemCode, moduleName } },
            mainRouter: router,
        },
    };
};

const mutations = {
    addSubApp(state, { path, systemCode, moduleName } = {}) {
        let opts = filterApp({ path, systemCode, moduleName });
        opts.props.mainStore = this;
        let app = loadMicroApp(opts);
        state.appCache.push({ systemCode, app, status: 'mount' });
    },
    setSubApp(state, payload) {
        let app = state.appCache.find(v => v.systemCode === payload.systemCode);
        if (app) {
            app = Object.assign(app, payload);
        }
    },
    removeSubApp(state, payload) {
        state.appCache.splice(state.appCache.indexOf(payload), 1);
    },
    clearSubApp(state) {
        state.appCache.map(({ app, systemCode, status }) => {
            if (status === 'mount') {
                app.unmount()
            }
            sessionStorage.removeItem(`${systemCode}-methodList`)
            sessionStorage.removeItem(`${systemCode}-navTabList`)
        })
        state.appCache = [];
    },
};

const actions = {
    unmountSubApp({ commit, state }, { systemCode, isFree } = {}) {
        let activeApp = state.appCache.find(v => v.systemCode === systemCode || v.status === 'mount');
        let clearCache = () => {
            commit('setSubApp', { systemCode: activeApp.systemCode, app: null });
            commit('removeSubApp', activeApp);
            // 清除子应用session
            sessionStorage.removeItem(`${systemCode}-methodList`);
            sessionStorage.removeItem(`${systemCode}-navTabList`);
        };
        if (!activeApp) return;
        if (activeApp.status === 'mount') {
            return activeApp.app.unmount().then(() => {
                commit('setSubApp', { systemCode: activeApp.systemCode, status: 'unmount' });
                if (isFree) {
                    clearCache();
                }
            });
        } else {
            if (isFree) {
                clearCache();
            }
        }
    },
    mountSubApp({ commit, state }, { systemCode = '' }) {
        let currentApp = state.appCache.find(v => v.systemCode === systemCode);
        if (currentApp && currentApp.status === 'unmount') {
            commit('setSubApp', { systemCode, status: 'mount' });
            currentApp.app.mount();
        }
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
