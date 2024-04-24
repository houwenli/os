export const userInfo = state => state.userInfo;

export const userArea = state => state.userArea;

export const userCompany = state => state.userCompany;

export const dimFilters = state => state.dimFilters;

export const vipTypeFilters = state => state.vipTypeFilters;

export const trafficFilters = state => state.trafficFilters;

export const partnerFilters = state => state.partnerFilters;

export const promoteStateFilters = state => state.promoteStateFilters;

export const staffStateFilters = state => state.staffStateFilters;

export const exportTypeFilters = state => state.exportTypeFilters;

export const getStateValueById = (state, getters) => (id, name, type = 'id') => {
    if (!state[name]) {
        return {};
    }
    return state[name].filter(todo => todo[type] === id)[0] || {};
};
