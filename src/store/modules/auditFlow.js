const state = {
    processStatusFilters: [{
            id: -1,
            name: '已撤销'
        },
        {
            id: 3,
            name: '待审核'
        },
        {
            id: 4,
            name: '审核中'
        },
        {
            id: 1,
            name: '审核通过'
        },
        {
            id: 2,
            name: '审核拒绝'
        },
        {
            id: 6,
            name: '自动审核通过'
        },
        {
            id: 7,
            name: '自动审核拒绝'
        }
    ],
    changeTypeFilters:[
        {
         id:-1,
         name:'撤销'   
        }, 
        {
            id:1,
            name:'通过'   
        }, 
        {
            id:2,
            name:'驳回'   
        }, 
        {
            id:3,
            name:'评论'   
        }, 
        {
            id:4,
            name:'转交'   
        },  
        {
            id:5,
            name:'加签'   
        }
    ],
    sponsorTypeFilters: [
        {
            // 发起人类型
            id: 1,
            value: '司机',
        },
        {
            id: 2,
            value: '总部人员',
        },
        {
            id: 3,
            value: '机构人员',
        },
        {
            id: 4,
            value: '代驾司机',
        }, {
            id: 5,
            value: '乘客',
        },
    ],
}
const mutations = {
};
const actions ={

};
export default {
    namespaced: true,
    state,
    mutations,
    actions
};