const state = {
    records: [], // 页签字段 path moduleName systemCode activeTags query
    pathMap: {}, // 授权菜单 + 已访问子应用页systemCode map { path: { moduleName, systemCode, path } }
    systemUrls: [] // 授权菜单中的子应用跳转链接
};

const mutations = {
    clear(state, index) {
        state.records.splice(index, 1);
    },
    update(state, view = {}) {
        let { path, systemCode, activeTags } = view;
        let item = state.records.find(v => v.path === path || (systemCode && v.systemCode === systemCode) || (activeTags && v.activeTags === activeTags));
        if (item) {
            // 主应用页签名不更新
            item = Object.assign(item, view, { moduleName: item.moduleName });
        } else {
            state.records.push(view);
        }
    },
    add(state, view) {
        state.records.push(view)
    },
    setPathMap(state, payload) {
        state.pathMap = Object.assign(state.pathMap, payload);
    },
    delAll(state) {
        state.records = [];
        state.pathMap = {};
    },
    setSystemUrls(state, payload) {
        state.systemUrls = payload
    }
};

const actions = {
    setSystemUrls({ commit }, payload = []) {
        let pathMap = payload.reduce((pre, cur) => {
            pre[cur.path] = cur
            return pre
        }, {})
        commit('setSystemUrls', payload.map(v => v.path))
        commit('setPathMap', pathMap)
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
