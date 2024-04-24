
const state = {
    businessTypeFilters: [],//业务类型
}

const mutations = {
    //业务类型
    SET_SYSTEM_TYPE: (state, parm) => {
        state.businessTypeFilters = parm
    }

}


const actions = {
    //业务类型
    getBusinessType({ commit }, data) {
        let queryData={
            op: "selectAllSysType"
        }
        return new Promise((resolve,reject)=>{
            $vm.$axios("authority/systemInfo/select",queryData).then((res)=>{
                let result=JSON.parse(res.data);
                let _businessTypeData=result.map((item)=>{
                    return{
                        id:item.sysTypeCode,
                        value:item.sysTypeName
                    }
                })
                commit('SET_SYSTEM_TYPE', _businessTypeData)
                resolve(_businessTypeData)
            })
        })
    }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

