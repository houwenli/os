const state = {
    visitedViews: [],
    cachedViews: []
}

const mutations = {
    ADD_VISITED_VIEW: (state, view) => {
        for (const v of state.visitedViews) {
            if (v.path === view.path) return
            if (!view.title && view.meta.subName && (v.meta.subName === view.meta.subName)) return
        }
        const obj = Object.assign({}, view, {
            title: view.title || view.meta.title || (view.matched[0] && view.matched[0].meta && view.matched[0].meta.title) || 'no-name'
        })
        delete obj.matched
        state.visitedViews.push(obj)
    },
    ADD_CACHED_VIEW: (state, view) => {
        if (state.cachedViews.includes(view.name)) return
        if (!view.meta.noCache) {
            state.cachedViews.push(view.name)
        }
    },
    DEL_VISITED_VIEW: (state, index) => {
        state.visitedViews.splice(index, 1)
    },
    DEL_CACHED_VIEW: (state, view) => {
        const index = state.cachedViews.indexOf(view.name)
        index > -1 && state.cachedViews.splice(index, 1)
    },
    DEL_OTHERS_VISITED_VIEWS: (state, view) => {
        state.visitedViews = state.visitedViews.filter(v => {
            return v.meta.affix || v.path === view.path
        })
    },
    DEL_OTHERS_CACHED_VIEWS: (state, view) => {
        const index = state.cachedViews.indexOf(view.name)
        if (index > -1) {
            state.cachedViews = state.cachedViews.slice(index, index + 1)
        } else {
            state.cachedViews = []
        }
    },
    DEL_ALL_VISITED_VIEWS: state => {
        // keep affix tags
        const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
        state.visitedViews = affixTags
    },
    DEL_ALL_CACHED_VIEWS: state => {
        state.cachedViews = []
    },
    UPDATE_VISITED_VIEW: (state, view) => {
        for (let v of state.visitedViews) {
            if (view.meta.type === 'modules' && view.title === v.title) {
                const obj = Object.assign(v, view);
                delete obj.matched
                v = obj
                return false
            }
            if (!view.meta.type && v.meta.subName === view.meta.subName) {
                const obj = Object.assign(v, view);
                delete obj.matched
                v = obj
            }
        }
    }
}

const actions = {
    addView({ dispatch }, view) {
        dispatch('addVisitedView', view)
        dispatch('addCachedView', view)
    },
    addVisitedView({ commit }, view) {
        commit('ADD_VISITED_VIEW', view)
    },
    addCachedView({ commit }, view) {
        commit('ADD_CACHED_VIEW', view)
    },

    delView({ dispatch, state }, index) {
        return new Promise(resolve => {
            dispatch('delVisitedView', index)
            resolve({
                visitedViews: [...state.visitedViews]
            })
        })
    },
    delVisitedView({ commit, state }, view) {
        return new Promise(resolve => {
            commit('DEL_VISITED_VIEW', view)
            resolve([...state.visitedViews])
        })
    },
    delCachedView({ commit, state }, view) {
        return new Promise(resolve => {
            commit('DEL_CACHED_VIEW', view)
            resolve([...state.cachedViews])
        })
    },

    delOthersViews({ dispatch, state }, view) {
        return new Promise(resolve => {
            dispatch('delOthersVisitedViews', view)
            dispatch('delOthersCachedViews', view)
            resolve({
                visitedViews: [...state.visitedViews],
                cachedViews: [...state.cachedViews]
            })
        })
    },
    delOthersVisitedViews({ commit, state }, view) {
        return new Promise(resolve => {
            commit('DEL_OTHERS_VISITED_VIEWS', view)
            resolve([...state.visitedViews])
        })
    },
    delOthersCachedViews({ commit, state }, view) {
        return new Promise(resolve => {
            commit('DEL_OTHERS_CACHED_VIEWS', view)
            resolve([...state.cachedViews])
        })
    },

    delAllViews({ dispatch, state }, view) {
        return new Promise(resolve => {
            dispatch('delAllVisitedViews', view)
            dispatch('delAllCachedViews', view)
            resolve({
                visitedViews: [...state.visitedViews],
                cachedViews: [...state.cachedViews]
            })
        })
    },
    delAllVisitedViews({ commit, state }) {
        return new Promise(resolve => {
            commit('DEL_ALL_VISITED_VIEWS')
            resolve([...state.visitedViews])
        })
    },
    delAllCachedViews({ commit, state }) {
        return new Promise(resolve => {
            commit('DEL_ALL_CACHED_VIEWS')
            resolve([...state.cachedViews])
        })
    },

    updateVisitedView({ commit }, view) {
        commit('UPDATE_VISITED_VIEW', view)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
