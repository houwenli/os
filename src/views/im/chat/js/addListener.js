/**
 * 监听方法
 */
import IM from '@/utils/tim/tim';
import { 
    translateGroupSystemNotice,
    handleTranslateGroupSystemNotice
    } from './utils';
export default {
    // 收到的消息
    $onMessageReceived(value) {
        const self = this;
        console.log('收到信息的监听', value)
        let message = value.data[0]
        if(message.conversationID === this.chatConversationID) {
            let isOut = message.flow === 'out'
            // if (!isOut) {
            //     // 标记消息为已读
            //     IM.setMessageRead({conversationID: message.conversationID})
            // }
            self.hList.messageList = [...self.hList.messageList, ...[message]]
            if(self.hList.messageList.length > 0){
                IM.sendMessageReadReceipt(self.hList.messageList).then(res => {
                }).catch(error => {
                })  
            }
            self.below()
            if (!isOut) {
                // 标记消息为已读
                IM.setMessageRead({conversationID: message.conversationID})
            }
        }else if(message.type === IM.TIM.TYPES.MSG_GRP_TIP && message?.payload?.operationType){// 群提示信息消除未读数
            IM.setMessageRead({conversationID: message.conversationID})
        }
        if(translateGroupSystemNotice(self, message)){
            self.hlData()
        }
        handleTranslateGroupSystemNotice(message, IM, self)
    },
    /**
     * 监测发出去的消息的已读未读回执
     * @param {*} event 
     */
    $addMessageReadReceiptReceived(event){
        console.log('监测发出去的消息的已读未读回执', event)
        const self = this
        const readReceiptInfoList = event.data;
        readReceiptInfoList.forEach((item) => {
            const { groupID, userID, messageID, readCount, unreadCount, isPeerRead } = item;
            // messageID - 消息 ID
            // userID - C2C 消息接收方
            // isPeerRead - C2C 消息对端是否已读
            // groupID - 群组 ID
            // readCount - 群消息已读人数
            // unreadCount - 群消息未读人数
            // console.log('监测的已读未读', item)
            let i = self.hList.messageList.findIndex(({ ID }) => ID === event.data[0].messageID)
            self.hList.messageList[i].readReceiptInfo = {
                    readCount,
                    unreadCount
                }
        });
    },
    // 监听会话列表
    $addOnConversationListUpdated(e){
        const self = this;
        console.log("收到会话列表监听", e)
        // self.hlData() 
        self.rList = e.data
        self.rList.map((item, index) => {
            if(item.type === '@TIM#SYSTEM'){
                self.rList.splice(index, 1)
            }
            if(self.chatConversationID && self.chatConversationID === item.conversationID){
                self.conversation = { ...item }
            }
        })
    },
}