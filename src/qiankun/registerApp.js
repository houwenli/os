import router from '@/router';
import store from '../store/index';
import { initialState } from './globalState';
import { systemList } from './systemList';

const getEntry = port => {
    return process.env.NODE_ENV !== 'production' ? `//${window.location.hostname}:${port}` : '';
};

const createApps = systemList.map(({ name, port, ...args }) => {
    let entry = getEntry(port) + `/child-${name}/`;
    return {
        name,
        entry,
        activeRule: `/${name}`,
        props: {
            //子应用导航栏状态
            subSystemNavbarStatus: {
                showNavBar: false,
                ...args,
            },
        },
    };
});
const microApps = [
    /**
     * name: 微应用名称 - 具有唯一性
     * entry: 微应用入口 - 通过该地址加载微应用，这里我们使用 config 配置
     * container: 微应用挂载节点 - 微应用加载完成后将挂载在该节点上
     * activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用
     */
    ...createApps,
];
/* 重构apps */
export const filterApps = () => {
    microApps.forEach(item => {
        // 必选，微应用的容器节点的选择器或者 Element 实例。
        item.container = '#subapp-viewport';
        // 可选，主应用需要传递给微应用的数据。
        Object.assign(item.props, {
            routerBase: item.activeRule, // 下发基础路由
            globalState: initialState, // 下发全局数据方法
            mainRoute: router, //父级路由实例
            mainStore: store, //父级vuex实例
        });
    });
    return microApps;
};

/* qiankun全局声明周期钩子 */
export const microConfig = {
    beforeLoad: [app => { }], // 预加载
    beforeMount: [app => { }], // 挂载前回调
    afterMount: [app => { }], // 挂载后回调
    beforeUnmount: [app => { }], // 卸载前回调
    afterUnmount: [app => { }], // 卸载后回调
};
