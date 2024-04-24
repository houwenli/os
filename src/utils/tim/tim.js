// 从v2.11.2起，SDK 支持了 WebSocket，推荐接入；v2.10.2及以下版本，使用 HTTP
// import TIM from 'tim-js-sdk';
import TIM from 'tim-js-sdk/tim-js-friendship.js';
import TIMUploadPlugin from 'tim-upload-plugin';
import { genTestUserSig } from './GenerateTestUserSig'
sessionStorage.removeItem('IMUserInfo')
let IMUserInfo = JSON.parse(sessionStorage.getItem('IMUserInfo'));
let isLoginLoading = IMUserInfo?.isLoginLoading || false,
    subscribeFailEventList = []

const urlHostname = window.location.hostname;
const reg = /oa([-0-9a-zA-Z*]*).wsecar.com/;
let SDKAppID = 1400235026; // 默认使用开发和测试环境的SDKAppID
if(urlHostname !== 'localhost'){
    const result = urlHostname.match(reg);
    const env = result ? result[1] : '';
    if(!env){
        SDKAppID = 1400236865; // env为空，替换为生产环境SDKAppID
    }
}
let options = {
    SDKAppID
};
// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
let tim; // SDK 实例通常用 tim 表示

// 初始化IM
const init = (self) => {
    //必须登录
    let userInfo = JSON.parse(sessionStorage.getItem('_ccmUser'))
    if (!userInfo) {
      return Promise.reject()
    }
    let IMUserInfo = JSON.parse(sessionStorage.getItem('IMUserInfo'));
    if (IMUserInfo?.isLoginLoading) {
        return Promise.resolve()
    }
    if (tim && !IMUserInfo?.isLoginLoading) {
        tim.logout().then(function (imResponse) {
            console.log("我退出登录了!")
        }).catch(function (imError) {
            console.warn('logout error:', imError);
        });
    }
    if (tim && IMUserInfo?.isLoginLoading) {
      return Promise.resolve()
    }
    return new Promise((resolve, reject) => {
        // 获取userSig
        IMgenTestUserSig(self).then((data) => {
            let config = JSON.parse(data.data)
            let userSig = config.urlSig;
            let userID = config.imAccount;
            sessionStorage.setItem('IMUserInfo', JSON.stringify({
                userID,
                isLoginLoading: true
            }))
            // 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
            tim = TIM.create(options);
            // 设置日志级别，1 release级别，SDK 输出关键信息，生产环境时建议使用
            tim.setLogLevel(1)
            // 注册腾讯云即时通信 IM 上传插件
            tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });
            tim.on(TIM.EVENT.SDK_READY, () => {
                // 监听SDK未初始化时的事件
                console.log('IM SDK初始化成功',{
                    userID,
                    isLoginLoading: true
                });
                subscribeFailEventList.map(({eventName, rest}) => {
                    tim.on(eventName, ...rest)
                })
                subscribeFailEventList = []
                resolve()
            })
            tim.on(TIM.EVENT.SDK_NOT_READY, () => {
                sessionStorage.setItem('IMUserInfo', JSON.stringify({
                    userID,
                    isLoginLoading: false
                }))
                console.log('IM SDK初始化失败=isLoginLoading=false');
                subscribeFailEventList = []
                tim = null
            })
            tim.login({ 
                userID,
                userSig 
            }).then((imResponse) => {
                console.log("登录成功!", imResponse)
                return Promise.resolve(imResponse);
            }, () => {
                sessionStorage.setItem('IMUserInfo', JSON.stringify({
                    userID,
                    isLoginLoading: false
                }))
                subscribeFailEventList = []
                reject()
            })
        })
    })
}

const IMgenTestUserSig = async(self) => {
    return self.$axios('/web/im/select', {
        op: 'getUserSign',
        data: {}
    })
}

// 获取会话列表的接口
const getConversationList = () => {
    // if (!tim) {
    //   return new Promise((resolve, reject) => {
    //     init().then(() => {
    //       tim.getConversationList().then(resolve, reject)
    //     }, reject)
    //   })
    // }
    return tim.getConversationList()
}

// 拉取消息列表
const getMessageList = ({ conversationID, nextReqMessageID, count = 15 }) => {
    return tim.getMessageList({ conversationID, count, nextReqMessageID })
}

// 收到推送的单聊、群聊、群提示、群系统通知的新消息
const addMessageReceived = (...rest) => { // fn, ctx
    if (tim) {
      tim.on(TIM.EVENT.MESSAGE_RECEIVED, ...rest)
    } else {
      subscribeFailEventList.push({eventName: TIM.EVENT.MESSAGE_RECEIVED, rest})
    }
}
const removeMessageReceived = (fn) => {
    tim && tim.off(TIM.EVENT.MESSAGE_RECEIVED, fn)
}

// 将某会话下所有未读消息已读上报,当打开会话或切换会话时调用该接口
const setMessageRead = ({conversationID}) => {
    return tim.setMessageRead({ conversationID })
}

function createMessage({ type, to, content, conversationType = 'C2C', onProgress, cloudCustomData = ''}) {
    let message
    switch (type) {
      case TIM.TYPES.MSG_TEXT: {
        // 文本消息
        message = createTextMessage(to, content, conversationType, cloudCustomData)
        break
      }
      case TIM.TYPES.MSG_IMAGE: {
        message = createImageMessage(to, content, conversationType, onProgress)
        // 图片消息
        break
      }
      case TIM.TYPES.MSG_FILE: {
        // 文件消息
        message = createFileMessage(to, content, conversationType, onProgress)
        break
      }
    }
    return message
}


// 创建文本消息
function createTextMessage(to, text, conversationType, cloudCustomData) {
    return tim.createTextMessage({
        to,
        conversationType,
        payload: {
            text,
        },
        needReadReceipt: true,
        cloudCustomData
    })
}

// 创建图片消息
function createImageMessage(to, file, conversationType, onProgress) {
    return tim.createImageMessage({
        to,
        conversationType,
        payload: {
            file,
        },
        onProgress,
        needReadReceipt: true
    })
}
  
// 创建文件消息
function createFileMessage(to, file, conversationType, onProgress) {
    return tim.createFileMessage({
        to,
        conversationType,
        payload: {
            file,
        },
        onProgress,
        needReadReceipt: true
    })
}

// 创建@消息
const createTextAtMessage = ({to, payload}) => {
    return tim.createTextAtMessage({
        to,
        conversationType: 'GROUP',
        payload
    })
}

// 发送消息
const sendMessage = (message, disablePush = true) => {
    return tim.sendMessage(message, {
      offlinePushInfo: {
        disablePush, // true如果接收方不在线，则消息将存入漫游，但不进行离线推送
      },
    })
}

/**
 * 发送群消息是否已读回执
 */
function sendMessageReadReceipt(messageList) {
    return tim.sendMessageReadReceipt(messageList)
}

// 拉取群消息列表
function getGroupMessageList({ conversationID, nextReqMessageID = null, count = 15 }){
    return tim.getMessageList({conversationID, count, nextReqMessageID}).then(function(imResponse) {
        let messageList = imResponse.data.messageList;
        let nextReqMessageID = imResponse.data.nextReqMessageID;
        let isCompleted = imResponse.data.isCompleted;
        if(messageList.length > 0 ){
            return tim.getMessageReadReceiptList(messageList).then(function(data){
                data = {
                        data: {
                            messageList: [...data.data.messageList],
                            nextReqMessageID,
                            isCompleted
                        }
                    }
                return Promise.resolve(data)
            })
        }
    }).catch(function(imError) {
        wx.showToast({
            title: imError.message,
            icon: 'none',
            duration: 2000
        })
        console.log('拉取已读回执列表失败', imError)
    });
}

// 获取实时发出去的消息的已读未读人数
const addMessageReadReceiptReceived  = (...rest) => { // fn, ctx
    if (tim) {
      tim.on(TIM.EVENT.MESSAGE_READ_RECEIPT_RECEIVED, ...rest);
    }
}
const removeMessageReadReceiptReceived = (fn) => {
    tim && tim.off(TIM.EVENT.MESSAGE_READ_RECEIPT_RECEIVED, fn)
}

const logout = () => {
    return tim.logout();
}

// 会话置顶
const pinConversation = ({ conversationID, isPinned = true }) => {
    return tim.pinConversation({ conversationID, isPinned})
}

// 组装conversationID
const getConversationID = ({conversationID, chatType = 'C'}) => {
    return (chatType === 'C' ? 'C2C' : 'GROUP') + conversationID
}

// 拆解conversationID
const disConversationID = ({conversationID, chatType = 'C'}) => {
    return chatType === 'C' ? conversationID.replace('C2C', '') : conversationID.replace('GROUP', '')
}

// 更新群组信息
/**
 * 
 * @param {
 *  groupID, // 必传
 *  name, // 修改群名称
 *  avatar, // 修改群头像
 *  introduction, // 修改群简介
 *  notification, // 修改群公告
 *  groupCustomField = [] // 修改群组维度自定义字段  [{ key: 'group_level', value: 'high'}] , 默认空数组
 * } options 
 * @returns 
 */
const updateGroupProfile = (options) => {
    return tim.updateGroupProfile(options);
}

// 获取群成员数量 旗舰版会忽略count 直接查询100
const getGroupMemberList = ({groupID, count = 100, offset = 0}) => {
    return tim.getGroupMemberList({ groupID, count, offset });
}

// 删除群成员
const deleteGroupMember = ({groupID, userIDList = [], reason = '你违规了，我要踢你！'}) => {
    return tim.deleteGroupMember({groupID, userIDList, reason})
}

// 禁言群成员
const setGroupMemberMuteTime = ({
    groupID,
    userID,
    muteTime = 0 // 设为0，则表示取消禁言, 禁言600为10分钟
}) => {
    return tim.setGroupMemberMuteTime({groupID, userID, muteTime})
}

// 设定群成员权限角色
const setGroupMemberRole = ({
    groupID,
    userID,
    roleType = 'M'
}) => {
    // TIM.TYPES.GRP_MBR_ROLE_ADMIN（群管理员）,TIM.TYPES.GRP_MBR_ROLE_MEMBER（群普通成员）,TIM.TYPES.GRP_MBR_ROLE_CUSTOM（自定义群成员角色，仅社群支持）
    let role =  {
        'A': TIM.TYPES.GRP_MBR_ROLE_ADMIN, // 管理员
        'M': TIM.TYPES.GRP_MBR_ROLE_MEMBER,// 普通成员 默认
    }[roleType]
    return tim.setGroupMemberRole({
        groupID,
        userID,
        role
    });
}

// 群转让
const changeGroupOwner = ({groupID, newOwnerID}) => {
    return tim.changeGroupOwner({
        groupID,
        newOwnerID
    });
}

// 监听会话列表
const addOnConversationListUpdated = (...rest) => { // fn, ctx
    if (tim) {
      tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, ...rest);
    }
}
const removeOnConversationListUpdated = (fn) => {
    tim && tim.off(TIM.EVENT.CONVERSATION_LIST_UPDATED, fn)
}

// 删除会话
const deleteConversation = (conversationID) => {
    return tim.deleteConversation(conversationID)
}

// 获取好友列表
const getFriendList = () => {
    return tim.getFriendList();
}

// 获取群组信息
const getGroupMemberProfile = ({ groupID, userIDList = [], memberCustomFieldFilter = [] }) => {
    return tim.getGroupMemberProfile({ groupID, userIDList, memberCustomFieldFilter });
}

// 添加群成员
const addGroupMember = ({groupID, userIDList = []}) => {
    return tim.addGroupMember({groupID, userIDList})
}

// 拉取用户资料
const getUserProfile = (userIDList = []) => {
    // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
    return tim.getUserProfile({ userIDList });
}

// 创建群组
const createGroup = ({memberList = [], name = ''}) => {
    let IMUserInfo = JSON.parse(sessionStorage.getItem('IMUserInfo'))
    let groupID = `200-5-${IMUserInfo?.userID}-${((new Date()).getTime()).toString(16)}`;
    console.log(groupID, name, memberList)
    let sceneCodeValue = JSON.stringify({
        "sc": "5",
        "ct": "5",
        "su": "",
        "fa": "",
        "bzt": "200",
        "ft": ""
        })
    return tim.createGroup({
        type: TIM.TYPES.GRP_PUBLIC,
        name,
        groupID,
        memberList, // 如果填写了 memberList，则必须填写 userID
        groupCustomField: [
            {"Key": "namea", "Value": name},
            {"Key": "sceneCode","Value": sceneCodeValue},
            {"Key": "storeId","Value": "-1"},
            {"Key": "bizId","Value": ""},
            {"Key": "nameb","Value": name},
            {"Key": "fromAcc","Value": ""},
            {"Key": "fromTp","Value": ""},
            {"Key": "chatTp","Value": "5"}
        ]
    });
}

// 跳转会话
const getConversationProfile = ({type = 'C2C', id}) => {
    let conversationID = '';
    if(type === 'C2C'){
        conversationID = `C2Cwsstore_${id}`
    }else if(type === 'GROUP'){
        conversationID = `GROUP${id}`
    }
    return tim.getConversationProfile(conversationID)
}

// 默认的基础数据
const baseInfo = {
    groupAvatar: 'https://sdk-web-1252463788.cos.ap-hongkong.myqcloud.com/im/assets/images/Work.svg'
}

// 需要跳转的会话
const handleCurrentConversation = (self, isHandleCurrentConversation, conversation) => {
    self.$store.commit("im/UPDATE_IS_NEW_CONVERSATION", isHandleCurrentConversation)
    self.$store.commit("im/UPDATE_CONVERSATION", conversation)
}

// 查找message
const findMessage = (messageID) => {
    return tim.findMessage(messageID)
}

// 转发信息
const createForwardMessage = ({to, conversationType = 'C2C', message = {}}) => {
    return tim.createForwardMessage({
        to,
        conversationType: conversationType,
        payload: message, // 消息实例，已收到的或自己已发出的消息
    })
}

// 删除消息
const deleteMessage = (messageList) => {
    return tim.deleteMessage(messageList)
}

// 撤回信息
const revokeMessage = (message) => {
    tim.revokeMessage(message);
}

// 获取群成员已读未读人员信息
/**
 * 
 * @param {*} filter 0 已读   1未读 
 * 
 * @returns 
 */
const getGroupMessageReadMemberList = ({
    message,
    filter = 0,
    cursor = '', // 第一次拉取传''
    count = 2000,
  }) => {
    return tim.getGroupMessageReadMemberList({
        message,
        filter,
        cursor,
        count,
      })
}

// 解散群组
const dismissGroup = (groupID) => {
    return tim.dismissGroup(groupID)
}

// 退出群组
const quitGroup = (groupID) => {
    return tim.quitGroup(groupID)
}

// 获取群资料
const getGroupProfile = ({ groupID, groupCustomFieldFilter = [] }) => {
    return tim.getGroupProfile({ groupID });
}
export default {
    TIM,
    tim,
    baseInfo,
    handleCurrentConversation,
    init,
    getConversationList,
    getMessageList,
    addMessageReceived,
    removeMessageReceived,
    setMessageRead,
    createMessage,
    sendMessage,
    sendMessageReadReceipt,
    getGroupMessageList,
    addMessageReadReceiptReceived,
    removeMessageReadReceiptReceived,
    logout,
    pinConversation,
    getConversationID,
    disConversationID,
    updateGroupProfile,
    getGroupMemberList,
    deleteGroupMember,
    setGroupMemberMuteTime,
    setGroupMemberRole,
    changeGroupOwner,
    addOnConversationListUpdated,
    removeOnConversationListUpdated,
    deleteConversation,
    getFriendList,
    getGroupMemberProfile,
    addGroupMember,
    getUserProfile,
    createGroup,
    getConversationProfile,
    findMessage,
    createForwardMessage,
    deleteMessage,
    revokeMessage,
    getGroupMessageReadMemberList,
    createTextAtMessage,
    dismissGroup,
    quitGroup,
    getGroupProfile
};