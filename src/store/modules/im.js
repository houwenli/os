const state = {
    isHandleCurrentConversation: false,  // 是否跳转最新会话
    conversation: {}, // 最新会话
    c2cAddUser: false, // 单聊添加人员
    userPower: {}, // 用户的权限和状态，包括群权限，是否被禁言，是否有创建群权限等
    isRefreshConversation: false, // 是否刷新会话列表并进入第一个聊天会话窗口
    isApplyJoin: false, // 是否重新调取申请人员接口
    forwardMessage: {}, // 转发的信息
    groupUserListLength: 0, // 当前会话群组人数
    baseGroupUserList: {
        user100: [], // 群前100人
        groupAllUserList: [], // 群全部成员
        admin: [], // 管理员
        member: [], // 群成员
        muteMember: [],// 禁言人员
        atObj: {},// @人员的对象
    },
    isUpdateConversation: false, // 是否更新会话信息和内容
    imgFilePercentage: 0, // 图片文件上传进度条
};

const mutations = {
    UPDATE_IS_NEW_CONVERSATION: (state, value) => {
        state.isHandleCurrentConversation = value
    },
    UPDATE_CONVERSATION: (state, value) => {
        state.conversation = value
    },
    UPDATE_C2CADDUSER: (state, value) => {
        state.c2cAddUser = value
    },
    UPDATE_USERPOWER: (state, value) => {
        state.userPower = value
    },
    UPDATE_ISREFRESHCONVERSATION: (state, value) => {
        state.isRefreshConversation = value
    },
    UPDATE_ISAPPLYJOIN: (state, value) => {
        state.isApplyJoin = value
    },
    UPDATE_FORWARDMESSAGE: (state, value) => {
        state.forwardMessage = value
    },
    UPDATE_BASEGROUPUSERLIST: (state, value) => {
        state.baseGroupUserList = value
    },
    UPDATE_ISUPDATECONVERSATION: (state, value) => {
        state.isUpdateConversation = value
    },
    UPDATE_GROUPUSERLISTLENGTH: (state, value) => {
        state.groupUserListLength = value
    },
    UPDATE_IMGFILEPERCENTAGE: (state, value) => {
        state.imgFilePercentage = value
    }
};

const actions = {};

export default {
    namespaced: true,
    state,
    mutations,
};
