import * as types from './mutation-types';
// import Vue from 'vue';

/**
 *
 * @param commit
 * @param parm
 * @returns {Promise<any>}
 * Action 通过 store.dispatch 方法触发，执行异步操作。例如：this.$store.dispatch('getCompanyInfo')
 * 组合Action使用：this.$store.dispatch('getCompanyInfo').then((response)=>{...})
 * 在组件中分发多个Action使用 mapActions 辅助函数
 */

export const setUserInfo = ({ commit }, parm) => commit(types.GET_USER_IFNO, parm);

export const getArea = ({ commit }, param) => {
    const url = '/web/common/select';
    const reqData = {
        data: JSON.stringify(param),
        op: 'authInfo'
    };
    return new Promise((resolve, reject) => {
        $vuex.$axios(url, reqData).then(
            response => {
                let result = JSON.parse(response.data) || {};
                commit(types.GET_USER_AREA, result);
                resolve(result);
            },
            response => {
                reject(response.data);
            }
        );
    });
};

export const getAgencies = ({ commit }, param) => {
    const url = '/web/common/select';
    const reqData = {
        data: JSON.stringify(param),
        op: 'authCompany'
    };
    return new Promise((resolve, reject) => {
        $vuex.$axios(url, reqData).then(
            response => {
                let result = JSON.parse(response.data) || [];
                result.forEach(item => {
                    item.leaf = true;
                });
                commit(types.GET_USER_COMPANY, result);
                resolve(result);
            },
            err => {
                reject(err.data);
            }
        );
    });
};

export const getOrgs = ({ commit }, param) => {
    const url = '/web/common/select';
    const reqData = {
        data: JSON.stringify(param),
        op: 'authInfo'
    };
    return new Promise((resolve, reject) => {
        $vuex.$axios(url, reqData).then(
            response => {
                let result = JSON.parse(response.data).region || [];
                // result.forEach(item => {
                //     item.leaf = item.type === 20;
                // });
                resolve(result);
            },
            err => {
                reject(err.data);
            }
        );
    });
};

export const getFileList = ({ commit }, param) => {
    const url = '/web/promoteStatistics/data/select';
    const reqData = {
        data: JSON.stringify(param),
        op: 'queryFileNameList'
    };
    return new Promise((resolve, reject) => {
        $vuex.$axios(url, reqData).then(
            response => {
                let result = JSON.parse(response.data) || {};
                commit(types.GET_FILE_LIST, result);
                resolve(result);
            },
            response => {
                reject(response.data);
            }
        );
    });
};

export const getPrimaryInstitutions = ({ commit }, param) => {
    const url = '/web/promoteStatistics/data/select';
    const reqData = {
        data: JSON.stringify(param),
        op: 'authCompany'
    };
    return new Promise((resolve, reject) => {
        $vuex.$axios(url, reqData).then(
            response => {
                let result = JSON.parse(response.data) || {};
                commit(types.GET_PRI_INSTITUTION, result);
                resolve(result);
            },
            response => {
                reject(response.data);
            }
        );
    });
};

export const setAreaWidth = ({ commit }, param) => {
    commit('SET_AREA_WIDTH', param);
};
