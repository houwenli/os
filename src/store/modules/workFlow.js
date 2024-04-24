const workFlow = {
    namespaced: true,
    state: {
        status: {},
        // 职务机构类型
        rewardTypeFilters: [
            {
                id: 1,
                value: '固定配比'
            },
            {
                id: 2,
                value: '阶梯奖励'
            },
        ],
        // 参与业务类型
        businessTypesFilters: [
            {
                id: 200,
                value: '普通网约车'
            },
            {
                id: 300,
                value: '巡游出租车'
            },
            {
                id: 400,
                value: '专车'
            },
            {
                id: 500,
                value: '豪华车'
            },
            {
                id: 600,
                value: '商务车'
            },
        ],
        // 可用渠道
        availableChannelFilters: [
            {
                id: 0,
                value: '不限'
            },
            {
                id: 1,
                value: 'app'
            },
            {
                id: 2,
                value: '小程序'
            },
        ],
        // 服务城市
        useCityFilters: [
            {
                id: 0,
                value: '不限'
            },
            {
                id: 1,
                value: '活动城市可用'
            },
            {
                id: 2,
                value: '领券城市可用'
            },
        ],
        // 业务类型
        fitBusinessFilters: [
            {
                id: 1,
                value: '网约车'
            },
            {
                id: 2,
                value: '顺风车'
            },
            {
                id: 3,
                value: '货运'
            },
            {
                id: 4,
                value: '代驾'
            },
        ],
        couponsTypeFilters: [
            {
                id: 1,
                value: '满减'
            },
            {
                id: 2,
                value: '折扣'
            },
            {
                id: 3,
                value: '立减'
            }
        ]
    },

    mutations: {
        SET_STATUS: (state, status) => {
            state.status = status;
        }
    },

    actions: {
        //
        editStatus({ commit }, data) {
            commit('SET_STATUS', data);
        },

        modifyStatus({ commit }, data) {
            commit('SET_STATUS', data);
        }
    }
};

export default workFlow;
