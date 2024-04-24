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

// 包车计价新增页面的企业名称下拉选项请求
export const getCompanyNameFilters = ({ commit }, parm) => {
  $vuex.$axios('charteredbusorder/charging/enterprise/select', { data: {}, op: 'enterPriseList' }).then(res => {
          commit('getCompanyNameFilters', JSON.parse(res.data))
    }).catch(err => {
        // $vuex.$message.error('获取对接系统数据失败!')
        // 请求失败的时候清空旧数据，防止数据重叠
        commit('getCompanyNameFilters', [])
    })
}

// 包车计价新增页面的司机收入比例请求
export const getDriverRatioFilters = ({ commit }, parm) => {
    $vuex.$axios('charteredbusorder/charging/enterprise/select', { data: {}, op: 'getTransportDriverRatio' }).then(res => {
        commit('getDriverRatioFilters', JSON.parse(res.data))
    }).catch(err => {
        // $vuex.$message.error('获取对接系统数据失败!')
        // 请求失败的时候清空旧数据，防止数据重叠
        commit('getDriverRatioFilters', [])
    })
}




