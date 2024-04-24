/*
 * @Author: CuteBoy
 * @Date: 2022-01-19 16:32:05
 * @Description:
 */
let { passengerId, driverId, passengerPhone, fromDriverId, systemConfigProject = {} } = JSON.parse(sessionStorage.getItem('oaVuex')) || {};

const state = {
    passengerId,
    driverId,
    passengerPhone,
    fromDriverId,
    systemConfigProject,
    activeSysName: '',
};

const mutations = {
    UPATE_PASSENGER_ID: (state, id) => {
        state.passengerId = id;
    },
    UPATE_DRIVER_ID: (state, id) => {
        state.driverId = id;
    },
    UPATE_Phone: (state, id) => {
        state.passengerPhone = id;
    },
    UPATE_From_DriverId: (state, id) => {
        state.fromDriverId = id;
    },
    UPDATE_SYSTEM_CONFIG_PROJECT: (state, options) => {
        state.systemConfigProject = options;
    },
    UPDATE_ACTIVE_SYSNAME(state, payload) {
        state.activeSysName = payload;
    },
};

export default {
    namespaced: true,
    state,
    mutations,
};
