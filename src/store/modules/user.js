import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  namespaced: true,
  state: {
    token: getToken(),
    name: '',
    roles: [],
    permissions: [],
    userInfo: {},
    subsystemStatus: {},
    isHavePerssion: {},
    vipFilters: [    //司机类型
      { id: 0, value: '非包干司机' },
      { id: 1, value: '有效包干司机' },
      { id: 2, value: '无效包干司机' },
      { id: 3, value: '全部包干司机' }
    ],
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    UPDATE_USER_INFO(state, payload) {
      state.userInfo = payload;
    },
    SET_SUBSYSTEM_STATUS(state, payload) {
      state.subsystemStatus = payload;
    },
    UPATE_HAVE_PERSSION(state, payload) {
      state.isHavePerssion = payload;
    },
    // SET_ORG(state, payload) {
    //   state.headquarters = payload;
    // }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          const user = res.user
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', user.userName)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
