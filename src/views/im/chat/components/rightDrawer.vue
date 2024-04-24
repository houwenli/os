<template>
    <div>
        <!-- 右侧抽屉 -->
        <el-drawer v-if="showDrawer" :title="drawerName" :visible.sync="showDrawer" @close="handleClose" :modal="false" :size="toType === 'C2C' ? '424px' : '512px'" :custom-class="getCustomClass()" :direction="direction" :before-close="handleClose">
            <file-list v-if="drawerType === 'file'" v-bind="{ conversation }"></file-list>
            <!-- 单聊聊天设置 -->
            <c2c-setting v-if="drawerType === 'setting' && toType === 'C2C'" v-bind="{ conversation, toChatUserOrg }"></c2c-setting>
            <!-- 群聊聊天设置 -->
            <group-setting ref="groupSetting" v-if="drawerType === 'setting' && toType === 'GROUP'" v-bind="{ conversation }"></group-setting>
            <!-- 群公告 -->
            <notification-setting ref="notification" v-if="drawerType === 'notification' && toType === 'GROUP'" v-bind="{ conversation }"></notification-setting>
            <!-- 解散和退出群聊 -->
            <div v-if="toType === 'GROUP' && drawerType === 'setting'" class="operaiton-group" @click="operationGroup(userPower.isOwner ? '1' : '2')">{{!userPower.isOwner ? '退出群聊' : '解散群聊'}}</div>
        </el-drawer>
    </div>
</template>
<script>
import C2cSetting from './c2cSetting'; // 单聊聊天设置
import GroupSetting from './groupSetting'; // 群聊聊天设置
import FileList from './fileList'; // 文件展示
import notificationSetting from './notificationSetting/index';
import IM from '../../../../utils/tim/tim'

export default {
    components: {
        C2cSetting,
        GroupSetting,
        FileList,
        notificationSetting,
    },
    props: {
        drawer: {
            type: Boolean,
            default: () => false,
        },
        drawerType: {
            type: String,
            default: () => '',
        },
        conversation: {
            type: Object,
            default: () => {},
        },
        userPower:  {
            type: Object,
            default: () => {},
        },
        toChatUserOrg: {
            type: String,
            default: () => '',
        },
    },
    data() {
        return {
            avatar: '',
            chatName: '',
            toChatId: '',
            toType: '',
            toIsPinned: '',
            chatConversationID: '',
            needUpdateInfo: this.$attrs.needUpdateInfo,
            showDrawer: false,
            // 右侧抽屉
            // drawer: false,
            direction: 'rtl',
            drawerName: '文件',
        };
    },
    watch: {
        drawerType: function (newVal) {
            const self = this;
            if (newVal === 'file') {
                self.drawerName = '文件';
            } else if (newVal === 'setting') {
                self.drawerName = '聊天设置';
            } else if (newVal === 'notification') {
                self.drawerName = '公告';
            }
        },
        drawer: function (newVal) {
            this.showDrawer = newVal;
        },
        showDrawer: function (newVal) {
            if (!newVal) {
                let t = newVal;
                this.$emit('update:drawer', t);
                this.$emit('update:drawerType', '');
            }
        },
        conversation: {
            handler(newV, oldV) {
                const self = this;
                self.getConversationParams();
            },
            immediate: true,
            deep: true,
        },
        userPower: {
            handler(newV, oldV) {
                // console.log(newV)
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        getCustomClass(){
            return `drawer-box ${this.drawerType === 'notification' ? 'notification-box': ''} `
        },
        operationGroup(type){
            const self = this;
            let t = type === '1' ? '解散' : '退出'
            self.$confirm(`是否确认${t}该群聊`, '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
            }).then(() => {
                self.handleClose()
                let groupID = self.conversation.groupProfile.groupID;
                if(type === '1'){
                    IM.dismissGroup(groupID)
                }else if(type === '2'){
                    IM.quitGroup(groupID)
                }
                // IM.deleteConversation(self.conversation.conversationID)
                // self.$store.commit('im/UPDATE_ISREFRESHCONVERSATION', true)
            });
            
        },
        getConversationParams() {
            const self = this;
            let { type, conversationID, isPinned, userProfile, groupProfile } = self.conversation;
            self.chatConversationID = conversationID;
            self.toType = type;
            self.toIsPinned = isPinned;
            // 区分单聊和群聊
            if (type === 'C2C') {
                // 单聊
                self.avatar = userProfile.avatar;
                self.chatName = userProfile.nick || userID;
                self.toChatId = userProfile.userID;
            } else if (type === 'GROUP') {
                // 群聊
                self.avatar = groupProfile.avatar;
                self.chatName = groupProfile.name || groupProfile.groupID;
                self.toChatId = groupProfile.groupID;
            }
        },
        handleClose (){
            this.showDrawer = false
        }
    },
};
</script>
<style scoped lang="scss">
/deep/.notification-box {
    .el-drawer__body{
        padding-top: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
}
.operaiton-group {
    position: absolute;
    bottom: 0;
    color: #f05259;
    cursor: pointer;
    background: #fff;
    width: 95%;
    height: 50px;
    padding-top: 10px;
}
</style>
