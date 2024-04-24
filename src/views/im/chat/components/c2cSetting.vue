<template>
    <!-- 单聊设置 -->
    <div>
        <div class="setting-head-img-box">
            <head-img :imgUrl="avatar" :headName="chatName" :other_w="'is48w'"></head-img>
            <div class="info-box">
                <div>{{ chatName }}</div>
                <div>{{ $attrs.toChatUserOrg }}</div>
            </div>
        </div>
        <div class="setting-li add-user" @click="addUser()">
            <span>添加新成员</span>
            <i class="el-icon-arrow-right"></i>
        </div>
        <pin-conversation v-bind="{ conversationID, isPinned }"></pin-conversation>
    </div>
</template>
<script>
import HeadImg from './headImg'; // 头像展示
import PinConversation from './pinConversation'; // 会话置顶
export default {
    props: {
        conversation: {
            type: Object,
            default: () => {}
        },
    },
    data(){
        return {}
    },
    watch: {
        conversation: {
            handler (newV, oldV){
                const self = this;
                self.getConversationParams();
            },
            immediate: true,
            deep: true,
        }
    },
    components: {
        HeadImg,
        PinConversation
    },
    methods: {
        getConversationParams(){
            const self = this;
            let {
                type,
                conversationID,
                isPinned,
                userProfile,
                groupProfile

            } = self.conversation;
            self.conversationID = conversationID;
            self.isPinned = isPinned
            // 区分单聊和群聊
            if (type === 'C2C') { // 单聊
                self.avatar = userProfile.avatar
                self.chatName = userProfile.nick || userID
                self.updateName = self.chatName
                self.toChatId = userProfile.userID
            }else if (type === 'GROUP') { // 群聊
                self.avatar = groupProfile.avatar
                self.chatName = groupProfile.name || groupID
                self.toChatId = groupProfile.groupID
            }
        },
        addUser(){
            this.$store.commit("im/UPDATE_C2CADDUSER", true)
        }
    }
}
</script>
<style scoped lang="scss">
.setting-head-img-box {
    display: flex;
    margin-bottom: 24px;
    .t-message-avatar,
    .t-message-avatar-div{
        margin-top: 8px;
    }
    .info-box {
        margin-left: 12px;
        div:nth-child(1) {
            height: 22px;
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #303133;
            line-height: 22px;
            margin-bottom: 6px;
        }
        div:nth-child(2){
            height: 20px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #909399;
            line-height: 20px;
        }
    }
}
.setting-li {
    height: 70px;
    background: #F5F7FA;
    border-radius: 4px;
    line-height: 70px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
    padding: 0 16px 24px;
    margin-bottom: 16px;
    display: flex;
    span {
        flex: 1;
    }
    /deep/.el-icon-arrow-right{
        margin-top: 27px;
        margin-right: -5px;
    }
    /deep/.el-switch{
        margin-top: 25px;
    }
}
</style>