<template>
    <div class="t_left_bot">
        <!-- 左侧消息列表 -->
        <div v-for="(item,index) in rList" :key="index" @click="setZi(item)" :class="{ 'active':item.conversationID === isActive, 'is-top': item.isPinned === true }" @click.prevent.right="show(index)">
            <head-img v-if="item.type === 'C2C'" :imgUrl="item.userProfile.avatar" :headName="item.userProfile.nick || item.userProfile.userID" :other_w="'is48w'"></head-img>
            <head-img v-if="item.type === 'GROUP'" :imgUrl="item.groupProfile.avatar || groupAvatar" :headName="item.groupProfile.name || item.groupProfile.groupID" :other_w="'is48w'"></head-img>
            <div class="left-title" v-if="item.type === 'C2C'">{{IMUserInfo.userID === item.userProfile.userID ? '我（' + (item.userProfile.nick || item.userProfile.userID) + '）' : item.userProfile.nick || item.userProfile.userID }}</div>
            <div class="left-title" v-if="item.type === 'GROUP'">{{item.groupProfile.name || item.groupProfile.groupID}}</div>
            <div class="left-context" v-if="item.type === 'GROUP' && item.groupAtInfoList.length > 0"><span class="at-color">{{handleAt(item)}}</span>{{handleShowLastMessage(item)}}</div>
            <div class="left-context" v-else>{{handleShowLastMessage(item)}}</div>
            <div class="left-time" v-if="item.lastMessage.lastTime">{{item.lastMessage.lastTime | offTime}}</div>
            <div class="left-tip" v-if="item.unreadCount != 0 && IMUserInfo && ('C2C'+IMUserInfo.userID) !== item.conversationID"> {{item.unreadCount > 99 ? '99+' : item.unreadCount}}</div>
            <div class="dialog dialog-item" v-if="toggle && index === showToggle" ref="dialog" v-clickOutSide="handleClose">
                <p class="conversation-options" @click.stop="handleItem('delete', item.conversationID)">删除会话</p>
                <p class="conversation-options" v-if="!item.isPinned" @click.stop="handleItem('ispinned', item.conversationID)">置顶会话</p>
                <p class="conversation-options" v-if="item.isPinned" @click.stop="handleItem('dispinned', item.conversationID)">取消置顶</p>
            </div>
        </div>
    </div>
</template>
<script>
import IM from '../../../../utils/tim/tim'
import HeadImg from './headImg'; // 头像展示
const clickOutSide = {
    // 初始化指令
    bind(el, binding, vnode){
        function documentHandler(e){
            // 这里判断点击的元素是否是本身,是本身,则返回
            if(el.contains(e.target)){
                return false;
            }
            // 判断指令中是否绑定了函数
            if(binding.expression){
                binding.value(0)
            }
        }
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler)
    },
    update(){},
    unbind(el, binding){
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__
    }
}
export default {
    components: {
        HeadImg,
    },
    directives: { clickOutSide },
    props: {
        rList: {
            type: Array,
            default: []
        },
        isActive: {
            type: String,
            default: '1'
        },
        IMUserInfo: {
            type: Object,
            default: () => {}
        },
    },
    data() {
        return {
            toggle: false,
            showToggle: '',
            groupAvatar: IM.baseInfo.groupAvatar
        }
    },
    watch: {
        IMUserInfo: function(newV){
            console.log(newV)
        }
    },
    methods: {
        setZi(item){
            this.$emit('setZi', item);
        },
        handleClose(){
            this.showToggle = '';
            this.toggle = false;
        },
        handleAt(item) {
            const List = [
                `[有人@我]`,
                `[@所有人]`,
                `[@所有人][有人@我]`,
            ];
            let showAtType = '';
            for (let index = 0; index < item.groupAtInfoList.length; index++) {
                if (item.groupAtInfoList[index].atTypeArray[0] && item.unreadCount > 0) {
                showAtType = List[item.groupAtInfoList[index].atTypeArray[0] - 1];
                }
            }
            return showAtType;
        },
        handleShowLastMessage(item) {
            const { lastMessage } = item;
            const conversation = item;
            let showNick = '';
            let lastMessagePayload = '';
            if (conversation.type === IM.TIM.TYPES.CONV_GROUP) {
                if (lastMessage.fromAccount === conversation.groupProfile.selfInfo.userID) {
                    showNick = '我'
                } else {
                    showNick = lastMessage.nameCard || lastMessage.nick || lastMessage.fromAccount;
                }
            }
            if (lastMessage.type === IM.TIM.TYPES.MSG_TEXT) {
                lastMessagePayload = lastMessage.payload.text;
            } else {
                lastMessagePayload = lastMessage.messageForShow;
            }

            if (lastMessage.isRevoked) {
                lastMessagePayload = '撤回了一条消息';
            }
            // 处理群组提示信息   && lastMessage.type === IM.TIM.TYPES.MSG_CUSTOM
            if (conversation.type === IM.TIM.TYPES.CONV_GROUP && (lastMessage.type === IM.TIM.TYPES.MSG_CUSTOM || lastMessage.type === IM.TIM.TYPES.MSG_GRP_TIP)) {
                return this.handleTipMessageShowContext(lastMessage);
            }
            return `${showNick ? `${showNick}：` : ''}${lastMessagePayload}`;
        },
        handleTipMessageShowContext(message) {
            const TIM = IM.TIM;
            const options = {
                message,
                text: '',
            };
            let userName = message?.nick || message?.payload?.userIDList?.join(',');
            if (message?.payload?.memberList?.length > 0) {
                userName = '';
                message?.payload?.memberList?.map((user) => {
                userName += `${user?.nick || user?.userID},`;
                });
                userName = userName.slice(0, -1);
            }
            if (message.type === IM.TIM.TYPES.MSG_CUSTOM){
                let data;
                try{
                    data = JSON.parse(message.payload.data);
                }catch(e){
                    
                }
                if(data && data.businessID){
                    let h = '';
                    switch(data.businessID){
                        case 'ws_group_tips_oc':
                            h = `${data.operatorName}发布新公告`;
                            break;
                        case 'ws_oc_order':
                            h = `订单信息`;
                            break;
                        case 'ws_group_tips':
                            h = `${data.content}`
                            break;
                        case 'ws_group_notice':
                            h = `${data.operatorName}发布公告`
                            break;
                        default: 
                            h = `${data.content}`
                            break;
                    }
                    return h;
                }else{
                    if(message.payload.data === 'group_create'){
                        if(message.nick){
                            return `${message.nick}创建群组`
                        }else{
                            return `${message.payload.extension}`
                        }
                    }else{
                        return `${message.payload.extension}`
                    }
                    
                }
            }else if(message.type === IM.TIM.TYPES.MSG_GRP_TIP){
                switch (message.payload.operationType) {
                    case TIM.TYPES.GRP_TIP_MBR_JOIN:
                        options.text = `${userName} 加入群组`;
                    break;
                    case TIM.TYPES.GRP_TIP_MBR_QUIT:
                        options.text = `群成员：${userName} 退出群组`;
                    break;
                    case TIM.TYPES.GRP_TIP_MBR_KICKED_OUT:
                        // options.text = `群成员：${userName} 被${message.payload.operatorID}踢出群组`;
                        options.text = `群成员：${userName} 被踢出群组`;
                    break;
                    case TIM.TYPES.GRP_TIP_MBR_SET_ADMIN:
                        options.text = `群成员：${userName} 成为管理员`;
                    break;
                    case TIM.TYPES.GRP_TIP_MBR_CANCELED_ADMIN:
                        options.text = `群成员：${userName} 被撤销管理员`;
                    break;
                    case TIM.TYPES.GRP_TIP_GRP_PROFILE_UPDATED:
                    // options.text =  `${userName} 修改群组资料`;
                        options.text = this.handleTipGrpUpdated(message);
                    break;
                    case TIM.TYPES.GRP_TIP_MBR_PROFILE_UPDATED:
                        for (const member of message.payload.memberList) {
                            if (member.muteTime > 0) {
                            options.text = `群成员：${member.userID}被禁言`;
                            } else {
                            options.text = `群成员：${member.userID}被取消禁言`;
                            }
                        }
                    break;
                    default:
                        options.text = `[群提示消息]`;
                    break;
                }
                return options.text;
            }
            
        },
        handleTipGrpUpdated(message) {
            const { payload } = message;
            const { newGroupProfile } = payload;
            const { operatorID } = payload;
            let text = '';
            const name = Object.keys(newGroupProfile)[0];
            switch (name) {
                case 'muteAllMembers':
                    if (newGroupProfile[name]) {
                        text = `管理员 ${operatorID} 开启全员禁言`;
                    } else {
                        text = `管理员 ${operatorID} 取消全员禁言`;
                    }
                break;
                case 'ownerID':
                    text = `${newGroupProfile[name]} 成为新的群主`;
                break;
                case 'groupName':
                    text = `${operatorID} 修改群名为 ${newGroupProfile[name]}`;
                break;
                case 'notification':
                    text = `${operatorID} 发布新公告`;
                break;
                default:
                break;
            }
            return text;
        },
        handleItem(type, conversationID){
            const self = this;
            this.showToggle = '';
            this.toggle = false;
            if(type === 'delete'){ // 删除会话
                IM.deleteConversation(conversationID)
                .then(function (imResponse) {
                    self.$store.commit("im/UPDATE_ISREFRESHCONVERSATION", true)
                }).catch(function (imError) {
                    console.log(imError)
                });
            }else if(type === 'ispinned' || type === 'dispinned'){ // 置顶会话
                IM.pinConversation({ conversationID, isPinned: type === 'ispinned' ? true : false})
                .then(function(imResponse) {
                    // 置顶会话成功
                }).catch(function(imError) {
                    console.warn('会话置顶失败', imError); // 置顶会话失败的相关信息
                });
            }
        },
        show(index){
            this.showToggle = index;
            this.toggle = true;
        },
    },
    filters: {
        //接收时间
        offTime: function (value) {
            var v = value
            var date = new Date(v * 1000)
            var Y = date.getFullYear() + '-'
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
            var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
            var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
            var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
            let dt = new Date(Date.parse(new Date()))
            let current = dt.getFullYear() + "-" + dt.getMonth() + "-" + dt.getDate()
            let system = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
            if (current == system) { return h + m } else { return Y + M + D }
        },
    }
}
</script>
<style scoped lang="scss"  src="./../style/conversation-list.scss"></style>