import router from "@/router"
import Layout from '@/layout';
export const createSubSystemRoutes=(list=[])=>{
    return list.map(({ name, title, ...args }) => {
        let path = `/${name}/*`;
        return {
            path,
            name,
            component: Layout,
            meta: {
                title,
                subName: name,
                isMain: false,
                ...args,
            },
        };
    })
}
export default {
  namespaced: true,
  state: {
    systemList: []
  },
  mutations: {
    changeSystemList(state, data) {
      state.systemList = data
      $vuex.$baseMethod.setStore('systemList',data);
    }
  },
  actions: {
    async getSystemList({ commit }, data) {
      try {
        let params = {
          data: { status: 1 },
          op: 'selectAllOuterChainSystem'
        }
        let res = await $vuex.$axios('/authority/systemInfo/select', params)
        let data=JSON.parse(res.data)
        // 接口返回的数据字段和静态数据不一致，这里做统一
        const systemList=data.map(({sysCode,name,port,activeMenu})=>({
          name:sysCode,
          title:name,
          port,
          activeMenu
      }))
        commit('changeSystemList', systemList)
        // 这里不能直接缓存生成的路由表，stringify时组件中的render函数会丢失
        let routes=createSubSystemRoutes(systemList)
        // router.addRoutes(routes);
        routes.forEach(r=>router.addRoute(r))
      } catch (error) {
        console.log(error)
      }
    }
  }
}
