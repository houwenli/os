import * as types from './mutation-types';

const mutations = {
    [types.GET_USER_IFNO](state, parm) {
        //登录用户信息
        state.userInfo = parm;
    },

    // 获取用户机构
    [types.GET_USER_AREA](state, param) {
        state.userArea = param;
    },

    // 获取分公司
    [types.GET_USER_COMPANY](state, param) {
        state.userCompany = param;
    },

    // 获取一级机构
    [types.GET_PRI_INSTITUTION](state, param) {
        state.primaryInstitutions = param;
    },

    // 获取文件名称
    [types.GET_FILE_LIST](state, param) {
        state.fileList = param;
    },

    // 内容区域宽度（用于菜单展开重新渲染图表）
    SET_AREA_WIDTH(state, param) {
        state.areaWidth = param;
    }
};
export default mutations;
