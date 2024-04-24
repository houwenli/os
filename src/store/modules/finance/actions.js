import * as types from '../../mutation-types'
import { Message } from 'element-ui'
import Vue from 'vue'

/**
 *
 * @param commit
 * @param parm
 * @returns {Promise<any>}
 * Action 通过 store.dispatch 方法触发，执行异步操作。例如：this.$store.dispatch('getCompanyInfo')
 * 组合Action使用：this.$store.dispatch('getCompanyInfo').then((response)=>{...})
 * 在组件中分发多个Action使用 mapActions 辅助函数
 */
// 查询机构信息
export const getPartnerData = ({ commit }, parm) => {
    const URL = '/local/selectOrgOption';
    let opt = {
        data: JSON.stringify(parm),
        op: null
    }
    return new Promise((resolve, reject) => {
        $vuex.$axios(URL,opt).then((response) => {
            let dataList = JSON.parse(response.data)
            // commit(types.SELECT_SERVICE_PARTNER, dataList)
            resolve(dataList)
        }, (response) => {
            reject(response.data)
        })
    })
}
