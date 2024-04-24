import * as types from './mutation-types';

const mutations = {
    [types.GET_TRANSPORT_LIST](state, pram) {
        state.transportList = pram;
    },
    setDriverInfo(state, pram) {
        state.driverInfo = pram
    }
}
export default mutations;
