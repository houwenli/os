import variables from '@/assets/styles/element-variables.scss'
import defaultSettings from '@/settings'

const {showSettings, tagsView, fixedHeader, sidebarLogo, hideTabs} = defaultSettings

const state = {
    theme: variables.theme,
    showSettings,
    tagsView,
    fixedHeader,
    sidebarLogo,
    hideTabs
}

const mutations = {
    CHANGE_SETTING: (state, {key, value}) => {
        if (state.hasOwnProperty(key)) {
            state[key] = value
        }
    },
    TOGGLE_TABS: (state) => {
        state.hideTabs = !state.hideTabs
    },
}

const actions = {
    changeSetting ({commit}, data) {
        commit('CHANGE_SETTING', data)
    },
    toggleTabs({ commit }) {
        commit('TOGGLE_TABS')
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

