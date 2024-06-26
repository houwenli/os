import state from './state';
import mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';

const store = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export default store;
