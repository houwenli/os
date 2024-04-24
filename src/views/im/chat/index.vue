<template>
    <div class="box" style="padding-left: 0 !important;padding-bottom: 0 !important;padding-right: 16px !important;border-radius: 0;" v-loading="loading">
        <div class="t_left">
            <div class="seek">
                <div @click="handleSearch">
                    <el-input placeholder="搜索消息/联系人" v-model="lookup" :readonly="true" clearable prefix-icon="el-icon-search"></el-input>
                </div>
                <hr />
            </div>
            <!-- 左侧消息列表 -->
            <conversation-list v-if="rListOff" v-bind="{
                    rList,
                    isActive,
                    IMUserInfo
                }" @setZi="setZi"></conversation-list>
        </div>
        <div class="t_right" v-if="rRightOff">
            <!--名字-->
            <div class="t_right_top">
                <div class="t_right_top_box">
                    <div class="t_right_top_left">
                        <head-img :imgUrl="avatar" :headName="chatName || toChatId" :other_w="'is40w'"></head-img>
                        <div class="info-box">
                            <div :style="toType !== 'C2C' ? 'margin-top: 8px': ''">{{chatName || toChatId}}</div>
                            <div v-if="toType === 'C2C'">{{toChatUserOrg}}</div>
                        </div>
                    </div>
                    <div class="t_right_top_right">
                        <img class="topRightIcon el-icon-gg" v-if="toType === 'GROUP'" src="./image/icon_gg.png" @click="openDrawer('notification')">
                        <img class="topRightIcon el-icon-folder-opened" src="./image/icon_chat_text.png" @click="openDrawer('file')">
                        <img class="topRightIcon el-icon-user" src="./image/icon_chat_add.png" @click="addUser()">
                        <img class="topRightIcon el-icon-tickets" src="./image/icon_chat_his.png" @click="messageHistory()">
                        <img class="topRightIcon el-icon-setting" src="./image/icon_chat_set.png" @click="openDrawer('setting')">
                    </div>
                </div>
                <hr />
            </div>
            <!--内容-->
            <div class="t_right_con" id="t_right_con" ref="t_right_con">
                <div v-if="!hList.nextReqMessageID" class="t_r_nmore">没有更多了</div>
                <div v-else class="t_r_more" @click="getMessageList()">查看更多</div>
                <div v-if="hList" ref="message-box">
                    <div class="message-item" v-for="(item, index) in hList.messageList" :key="index" ref="message-item">
                        <!-- 时间提醒 -->
                        <div style="margin-bottom: 16px;" class="TIMGroupTipElem" v-if="getShowTime(item.time, (index > 0 ? hList.messageList[index-1].time : 0))">{{getShowTime(item.time, (index > 0 ? hList.messageList[index-1].time : 0))}}</div>
                        <!-- 群提示信息 -->
                        <div v-if="item.type == 'TIMGroupTipElem'" class="TIMGroupTipElem" v-html="newTIMGroupTipElem(item)" :id="item.ID"></div>
                        <!-- 自定义信息 -->
                        <MessageCustom v-else-if="item.type == 'TIMCustomElem' && getDataType(item.payload, 'ws_group_notice', true)" class="TIMGroupTipElem" :message="item" :id="item.ID"></MessageCustom>
                        <!-- 处理公告展示问题 -->
                        <div v-else-if="item.type == 'TIMCustomElem' && getDataType(item.payload, 'ws_group_notice', false)" :class="noticeGetData(item).flow === 'out' ? 't-self-message':'t-recieve-message'" :id="item.ID" :data-type="item.type">
                            <head-img @click.native="firendChange(item.from)" v-if="noticeGetData(item).flow === 'in'" :headName="noticeGetData(item).nick || noticeGetData(item).from" :other_w="'is40w'"></head-img>
                            <span class="user-recieve-name" v-if="item.conversationType !== 'C2C' && noticeGetData(item).flow === 'in'">{{noticeGetData(item).nick || noticeGetData(item).from}}</span>
                            <div style="background: #FDF6EC;" :class="[noticeGetData(item).flow === 'out' ? 't-self-message-body':'t-recieve-message-body', item.conversationType !== 'C2C' ? 'mt20' : '']">
                                <MessageNotice :message="item" @openDrawer="openDrawer"></MessageNotice>
                            </div>
                            <span class="user-self-name" v-if="item.conversationType !== 'C2C' && noticeGetData(item).flow === 'out'">{{noticeGetData(item).nick || noticeGetData(item).from}}</span>
                            <head-img v-if="noticeGetData(item).flow === 'out'" :headName="noticeGetData(item).nick || noticeGetData(item).from" :other_w="'is40w'"></head-img>
                        </div>
                        <!-- 回复信息 -->
                        <MessageRevoked v-else-if="item.isRevoked" :isEdit="item.type === MSG_TYPES.MSG_TEXT" :message="item" @edit="handleEdit(item)"></MessageRevoked>
                        <div v-else :class="item.flow === 'out' ? 't-self-message':'t-recieve-message'" :id="item.ID" :data-type="item.type">
                            <!-- 对方头像 -->
                            <head-img  @click.native="firendChange(item.from)" v-if="item.flow === 'in'" :imgUrl="item.avatar" :headName="item.nick || item.from" :other_w="'is40w'"></head-img>
                            <span class="user-recieve-name" v-if="item.conversationType !== 'C2C' && item.flow === 'in'">{{item.nick || item.from}}</span>
                            <!-- 聊天内容 -->
                            <div :class="[item.flow === 'out' ? 't-self-message-body':'t-recieve-message-body', item.conversationType !== 'C2C' ? 'mt20' : '']" @click.prevent.right="showRightIDFun(item, index, $event)">
                                <MessageReference :message="item"></MessageReference>
                                <MessageList :message="item" :showRightID.sync="showRightID" 
                                    :conversation="conversation"
                                    :showForwar.sync="showForwar"
                                    :forwarMessage.sync="forwarMessage"
                                    :showReference.sync="showReference"
                                    :referenceMessage.sync="referenceMessage"
                                    :referenceInfo.sync="referenceInfo"
                                    :showH.sync="showH"
                                    :messageH.sync="messageH"
                                    ></MessageList>
                            </div>
                            <div class="read-status" v-if="item.flow === 'out' && IMUserInfo.userID !== toChatId">
                                <span v-if="item.status === 'success' && item.conversationType !== 'C2C'">
                                    <div v-if="item.readReceiptInfo.unreadCount == 0" class="read" data-nav-type="0">全部已读</div>
                                    <div v-else class="unread" @click="showReadReceipt(item)" >{{item.readReceiptInfo.unreadCount || groupUserListL}}人未读</div>
                                </span>
                                <span v-else-if="item.status === 'success'">
                                    <div v-if="item.isPeerRead" class="read">已读</div>
                                    <div v-else class="unread">未读</div>
                                </span>
                            </div>
                            <!-- 个人头像 -->
                            <span class="user-self-name" v-if="item.conversationType !== 'C2C' && item.flow === 'out'">{{item.nick || item.from}}</span>
                            <head-img v-if="item.flow === 'out'" :imgUrl="item.avatar" :headName="item.nick || item.from" :other_w="'is40w'"></head-img>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 回复弹出框 -->
            <div class="reference feedbackClass"  v-if="showReference">
                <div class="reference-box feedbackClass-box">
                    <div class="reference-box-show">
                        <p>{{ referenceMessage.nick ? referenceMessage.nick : referenceMessage.from }}:</p>
                        <p>{{ referenceInfo.referenceMessageForShow }}</p>
                    </div>
                    <img src="./image/icon_dele@2x.png" class="feedDe" @click="hideShowReference()" />
                </div>
            </div>
            <!--输出框-->
            <div class="t_right_bot">
                <hr />
                <div class="rigit-box">
                    <!-- 发送表情 -->
                    <div class="icture_a">
                        <el-popover :disabled="isDisabled" ref="popover4" placement="top" width="400" height='160' :trigger="'click'">
                            <div style="height: 160px; overflow: auto;">
                                <img style="width:30px; cursor: pointer; margin:1px 2px 3px 4px;" v-for="(item,index) in emojiMap" @click="setEmj(item)" :key="index" :src="emojiUrl+item" />
                            </div>
                            <div slot="reference">
                                <img src="./image/small_icon.png" class="message_white_box_icon" style="width: 28px;">
                            </div>
                        </el-popover>
                    </div>
                    <!-- 发送图片 -->
                    <div class="icture">
                        <i class="el-icon-picture-outline" style="width: 30px;height: 30px;color: #909399;font-size: 25px;padding-top: 3px;padding-left: 1px;"></i>
                        <!-- <img src="./image/send_icon.png" class="message_white_box_icon"> -->
                        <input :disabled="isDisabled" @change="sendImg" id="imagePicker" accept="image/gif,image/jpeg,image/jpg,image/png,image/bmp,image/webp" type="file" />
                    </div>
                    <!-- 发送文件 -->
                    <div class="icture-file">
                        <!-- <i class="el-icon-folder-add"></i> -->
                        <img src="./image/send_icon.png" class="message_white_box_icon">
                        <input :disabled="isDisabled" @change="sendFile" id="filePicker" type="file" />
                    </div>
                </div>
                <!-- @人员 -->
                <div class="memberList" v-if="showGroupMemberList">
                    <el-input
                        placeholder="请输入搜索"
                        suffix-icon="el-icon-search"
                        @input="searchGroupUser"
                        v-model="searchGroupUserItem">
                    </el-input>
                    <ul class="memberList-box" ref="dialog">
                        <li v-show="!searchGroupUserItem" class="memberList-box-header" @click="selectAt('allMember', allMember)">
                            @
                            <span>{{ allMember[0].allText }}</span>
                            <span>({{ allMemberList.length }})</span>
                        </li>
                        <li
                            class="memberList-box-body"
                            v-for="(item, index) in allMemberList"
                            :key="index"
                            @click="selectAt('oneMember', item)"
                        >
                            <head-img :imgUrl="item.avatar" :headName="item.nick || item.userID"></head-img>
                            <span>{{ item.nick ? item.nick : item.userID }}</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <textarea :placeholder="isDisabled ? '禁止发言' : '请输入消息'" 
                        id="drop_area"
                        ref="inputEle"
                        v-model="textarea" 
                        maxlength="200" 
                        :disabled="isDisabled"
                        @keydown="messageSendlisten"
                        @keyup.delete="deleteAt"
                        @paste="inputPaste"
                        @input="inputChange"></textarea>
                    <!-- <div class="t_limit">当前还可发送{{200-(textarea.length)}}个字</div> -->
                    <div class="t_limit"><img src="./image/enter_icon.png">发送 / Ctrl+ <img src="./image/enter_icon.png">换行</div>
                    <el-button class="r_i" :disabled="isDisabled" @click="sendText" :type="isDisabled ? 'info' : 'primary'">发送</el-button>
                </div>
            </div>
            <!-- 右侧抽屉 -->
            <right-drawer :drawer.sync="drawer" :drawerType.sync="drawerType" :key="toChatId" v-bind="{ conversation, userPower, toChatUserOrg }" ref="rightDrawer"></right-drawer>
        </div>
        <div class="t_right" v-else>
            <div style="height:100%;width:100%;position: relative;background-color: #ffffff;text-align: center;">
                <div style="width:320px;height:220px;margin:auto;top:0;left:0;right:0;bottom: 0;position: absolute;">
                    <img style="width:320px;height:200px;" src="./image/im_default@2x.png" />
                    <p style="color: #606266;font-size: 18px;line-height: 25px;">有问题，即时沟通，高效解决</p>
                </div>
            </div>
        </div>
        <!-- 单聊邀请成员、群聊添加成员 -->
        <mask-dialog :show="dialogShow" @update:show="(e) => (dialogShow = e)">
            <transfer-select v-bind="{
                'title': transferTitle,
                'list': transferList,
                isSearch,
                isRadio,
                selectedList,
                'type': transferType,
                isUserAndOrg
                }" @submit="submit" @cancel="cancel" @search="handleSearchMember" />
        </mask-dialog>
        <!-- 全局搜索 -->
        <globalSearch v-if="searchVisible" ref="globalSearch" :visible.sync="searchVisible"></globalSearch>
        <!-- 单聊、群聊 -->
        <chatSearch v-if="chatVisible" ref="chatSearch" :conversation="conversation" :visible.sync="chatVisible"></chatSearch>
        <!-- 转发 -->
        <Forwar :showForwar.sync="showForwar" :conversationData="rList" :chatConversationID="chatConversationID" :forwarMessage="forwarMessage" v-if="showForwar"></Forwar>
        <!-- 这条信息的已读未读 -->
        <MessageReadReceipt
            :isShowReadReceipt.sync="isShowReadReceipt"
            :message="showReadReceiptMessage" 
            @closeDialog="closeDialog"
            :conversation="conversation"></MessageReadReceipt>
        <!-- 人员信息弹框 -->
        <PersonMsg :dialogVisible="personDialogVisible" @getCancel="getCancel" ref="person" @contextmenu.prevent></PersonMsg>
    </div>
</template>
 
<script>
import IM from '../../../utils/tim/tim'
import { emojiMap, emojiUrl } from '../../../assets/emj'
import ConversationList from './components/conversationList'; // 头像展示
import HeadImg from './components/headImg'; // 头像展示
import RightDrawer from './components/rightDrawer'; // 群聊聊天设置
import { newTIMGroupTipElem } from './js/newTIMGroupTipElem'
import MaskDialog from './components/mask';
import TransferSelect from './components/transfer';
import globalSearch from './components/globalSearch'
import {
    submit,
    cancel,
    toggleMask,
    handleManage,
    handleSearchMember
    } from './js/transferDialog';
import MessageList from './components/messageList';
import MessageRevoked from './components/messageList/messageRevoked';
import { 
    MSG_TYPES,  
    selectContactsPer, 
    selectUserHomePage,
    getShowTime 
    } from './js/utils';
import chatSearch from './components/chatSearch/index';
import Forwar from './components/messageList/forwar';
import MessageReference from './components/messageList/messageReference';
import MessageReadReceipt from './components/messageList/messageReadReceipt';
import MessageCustom from './components/messageList/messageCustom';
import MessageNotice from './components/messageList/messageNotice';
import PersonMsg from '../mailList/components/personMsg'
import sendMessage from './js/sendMessage';
import addListener from './js/addListener';
import groupMethods from './js/groupMethods';

export default {
    components: {
        HeadImg,
        RightDrawer,
        ConversationList,
        MaskDialog,
        TransferSelect,
        MessageList,
        globalSearch,
        chatSearch,
        MessageRevoked,
        Forwar,
        MessageReference,
        MessageReadReceipt,
        MessageCustom,
        PersonMsg,
        MessageNotice
    },
    name: '',
    data () {
        return {
            moduleName: '/chat',
            // defaultAvatar: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1651318081,2860235060&fm=26&gp=0.jpg",//默认头像,如果用户没有上传头像或者头像路径错误展示这个路径
            MSG_TYPES: MSG_TYPES,
            emojiMap: emojiMap,
            emojiUrl: emojiUrl,
            myAvatar: '',//我的头像
            chatName: '',//查看的某个人name
            avatar: '',//查看的某个人avatar
            lookup: "",//用户查找的名字
            isActive: '1',
            loading: false,//加载中
            textarea: "",//输入信息
            rListOff: false,
            rRightOff: false,
            rList: [],//会话列表
            hList: {messageList: []},//具体信息
            chatConversationID: '', // 当前聊天页面conversationID
            toChatId: '', // 对方ID
            toType: '',// 聊天窗口类型
            toIsPinned: false, // 会话是否置顶
            // needUpdateInfo: 0, // 是否需要更新信息
            conversation: {}, // 当前会话
            // 右侧抽屉
            drawerType: '',
            drawer: false,
            // 单聊邀请成员、群聊添加成员 // transfer 参数
            dialogShow: false,
            transferTitle: '',
            transferList: [],
            transferType: '',
            isSearch: '',
            isRadio: '',
            selectedList: [],
            allUserList: [],
            isUserAndOrg: false,
            // isCreatGroup: false, // 是否是新创建的群聊
            // createGroupID: '', // 新建的群聊ID
            searchVisible: false,
            isHandleCurrentConversation: IM.isHandleCurrentConversation,
            chatVisible: false,
            // 鼠标右键
            showRightID: '',
            isShowReadReceipt: false, // 已读未读的信息展示
            showReadReceiptMessage: {}, // 已读未读的信息项
            showForwar: false, // 是否展示转发弹框
            forwarMessage: {}, // 需要转发的消息
            showReference: false, // 是否展示回复信息
            referenceMessage: {}, // 回复的信息
            referenceInfo: {}, // 回复信息的展示
            showH: '', // 鼠标点击高度
            messageH: '', // 信息高度
            // @人员
            showGroupMemberList: false,
            allMember: [ // 所有人
                {
                allText: '所有人',
                type: IM.TIM.TYPES.MSG_AT_ALL,
                },
            ],
            atType: [],
            atAllText: '',
            atOneText: [],
            allMemberList: [],
            baseAllMemberList: [],
            searchGroupUserItem: '',
            // 操作权限
            isOperation: false,
            groupUserListL: 0, // 群组人员数量，处理已读未读显示问题
            IMUserInfo: {},
            userPower: {}, // 当前登录人的相关权限
            isCreateC2CChat: false,
            toChatUserOrg: '', // 单聊对方的部门
            personDialogVisible: false, // 个人信息弹框是否展示
            isSendSuccess: false, // 控制多次点击发送
        }
    },
    watch: {
        conversation: {
            handler (newV, oldV){
                if(newV.type){
                    const self = this;
                    self.updateConversationParams();
                }
            },
            immediate: true,
            deep: true,
        },
        '$store.state.im.isHandleCurrentConversation': function(newV){
            const self = this;
            if(newV){
                if(self.$store.state.im.conversation.type){
                    self.setZi(self.$store.state.im.conversation)
                    self.$store.commit("im/UPDATE_IS_NEW_CONVERSATION", false)
                }else{
                    self.$message.warning('未找到该聊天窗口')
                    self.$store.commit("im/UPDATE_ISREFRESHCONVERSATION", true)
                    return false;
                }
            }
        },
        '$store.state.im.c2cAddUser': function(newV){
            const self = this;
            if(newV){
                self.addUser()
                self.$store.commit("im/UPDATE_C2CADDUSER", false)
            }
        },
        '$store.state.im.userPower': {
            handler (newV, oldV){
                if(newV){
                    const self = this;
                    self.userPower = newV;
                }
            },
            immediate: true,
            deep: true,
        },
        '$store.state.im.isRefreshConversation': function(newV){
            const self = this;
            if(newV){
                self.$store.commit("im/UPDATE_ISREFRESHCONVERSATION", false)
                self.setZi()
            }
        },
        '$store.state.im.forwardMessage': function(newV){ // 消息转发给当前窗口
            const self = this;
            if(newV.type){
                self.hList.messageList.push(newV)
                self.below()
                self.$store.commit("im/UPDATE_FORWARDMESSAGE", {})
            }
        },
        'chatConversationID': function(newV, oldV){
            if(newV){
                const self = this;
                // 获取信息列表
                self.getMessageList();
            }
        },
        '$store.state.im.isUpdateConversation': function(newV){ // 更新当前会话信息
            const self = this;
            if(newV){
                self.$store.commit("im/UPDATE_ISUPDATECONVERSATION", false)
                self.getConversationParams();
            }
        },
    },
    computed: {
        isDisabled() {
            // console.log('this.isOperation', this.isOperation)
            // console.log('this.userPower', this.userPower)
            if(this.conversation.type === 'C2C'){
                return !this.isOperation || false;
            }else if(this.conversation.type === 'GROUP'){
                return !this.isOperation || this.userPower?.isMute || false;
            }
            
        }
    },
    methods: {...{
        /**
         * 公告专用
         */
        noticeGetData(message){
            let data;
            let noticeObj = {}
            try {
                data = JSON.parse(message.payload.data)
            }catch(e){}
            if(data && data.businessID){
                if(data.businessID === 'ws_group_notice'){
                    let flow = 'in';
                    if('wsstore_' + (data.createUserId || data.operatorId) === this.IMUserInfo.userID){
                        flow = 'out'
                    }
                    noticeObj = {
                        flow: flow,
                        operatorName: data.createName || data.operatorId,
                        nick: data.createName || data.operatorName,
                        from: 'wsstore_' + data.createUserId || data.operatorId, 
                    };
                }
            }
            return noticeObj
        },
        /**
         * 判断custom自定义类型
         * payload  item.payload
         * businessID 自定义信息类型
         * flag  是/否 默认 true
         */ 
        getDataType(payload, businessID, flag = true){
            let data;
            try {
                data = JSON.parse(payload.data)
            }catch(e){}
            if(data && data.businessID){
                if(data.businessID === businessID){
                    flag = !flag;
                }
            }
            return flag;
        },
        showRightIDFun(item, index, e){
            this.showRightID = item.ID;
            let mouseY = e.clientY - 147;// - 147 e.clientY - 147 -> 减去到浏览器上边距
            let tRightConH = this.$refs.t_right_con.clientHeight;
            this.showH = tRightConH - mouseY;
            // this.messageH = this.$refs['message-item'][index].clientHeight;
            this.messageH = e.pageY;
        },
        firendChange(id) {
            id = id.replace('wsstore_', '')
            this.personDialogVisible = true;
            this.$refs.person.mesList(id);
        },
        getCancel() {
            this.personDialogVisible = false;
        },
        // 时间展示
        getShowTime(time, pretime){
            return getShowTime(time, pretime)
        },
        // 关闭已读未读弹窗
        closeDialog(){
            this.isShowReadReceipt = false;
            this.showReadReceiptMessage = {}
        },
        // 查询会话权限
        findPermissionAndUserStatus(){
            const self = this;
            const op = 'findPermissionAndUserStatus';
            let data = {
                data: {},
                op,
            };
            self.conversation.type === 'C2C' ? 
                data.data['toId'] = self.toChatId : 
                data.data['groupId'] = self.toChatId;
            let URL = self.$getModuleUrl(self.moduleName, op);
            this.$axios(URL, data).then((res) => {
                if (res.code == 1) {
                    let result = JSON.parse(res.data)
                    self.isOperation = {
                        '-1': true, // 可以沟通， 
                        1: false, // 对方状态异常 
                        2: false, // 用户封禁 
                        3: false, // 无沟通权限  
                        4: false, // 仅常用语沟通  
                        5: false, // 不能聊天 ，最后聊天时间超过后台配置的时间， 
                        7: false, // 会话被封禁
                    }[result.checkResult]
                    self.$store.commit('im/UPDATE_USERPOWER', {
                        ...self.$store.state.im.userPower,
                        isOperation: self.isOperation
                    })
                }
            });
        },
        // 选中的@人员
        async selectAt(type, item) {
            const self = this;
            let atName = '';
            switch (type) {
                case 'allMember':
                    self.atText = '所有人';
                    self.textarea = `@所有人`;
                    self.$refs.inputEle.focus();
                    self.showGroupMemberList = false;
                    (self.atType).push(IM.TIM.TYPES.MSG_AT_ALL);
                    (self.atOneText).push({ name: self.atText, userID: IM.TIM.TYPES.MSG_AT_ALL });
                break;
                case 'oneMember':
                    atName = item.nameCard || item.nick || item.userID;
                    // let isHasAt = e.target.value.indexOf('@', 0);
                    self.textarea += `${item.nameCard || item.nick || item.userID}`;
                    // 为后续删除的@成员创建存储数组。
                    // Create a stored array for subsequent deleted @ members.
                    (self.atOneText).push({ name: atName, userID: item.userID });
                    self.$refs.inputEle.focus();
                    self.showGroupMemberList = false;
                    (self.atType).push(item.userID);
                break;
            }
        },
        // 删除选中@人员
        deleteAt(e) {
            const self = this;
            const array = self.atOneText;
            for (let index = 0; index < array.length; index++) {
                // 判断输入框中是否有@+尼克/名片/用户名字符串。
                // Judge whether there is a string of @ + Nick / namecard / userid in the input box.
                const flagName = `@${(array[index]).name}`;
                if (self.textarea.indexOf(flagName) === -1) {
                const { userID } = array[index];
                self.atType.splice((self.atType).indexOf(userID), 1);
                self.atOneText = [];
                }
            }
            return self.atType;
        },
        // 监控输入框的变化
        inputChange(e){
            const self = this;
            if(self.conversation?.type === 'GROUP'){
                let endStr = ''
                if(e.target.value.length >= 1){
                    endStr = e.target.value.charAt(e.target.value.length-1)
                }
                if ((endStr === '@' && e.data === '@') || (endStr === '@' && e.data === null)) {
                    self.showGroupMemberList = true;
                    if(self.baseAllMemberList.length === 0){
                        self.queryGroupUserList(0);
                    }else{
                        self.searchGroupUserItem = '';
                        self.searchGroupUser()
                    }
                    return false;
                }
                if (endStr !== '@' || e.data === '') {
                    self.showGroupMemberList = false;
                }
            }
        },
        // 隐藏回复引用的信息
        hideShowReference(){
            this.showReference = false;
            this.referenceMessage = {};
            this.referenceInfo = {};
        },
        // 已读未读
        showReadReceipt(item){
            this.isShowReadReceipt = true;
            this.showReadReceiptMessage = item
        },
        submit(userList){
            submit(this, userList)
        },
        cancel(){
            cancel(this)
        },
        toggleMask(type){
            toggleMask(this, type)
        },
        handleSearchMember(value){
            handleSearchMember(this, value)
        },
        handleManage(userList, type){
            handleManage(this, userList, type)
        },
        // 群聊 - 提交选中的人员
        submitAddMember(userIDList){
            submitAddMember(this, userIDList)
        },
        // 聊天记录，区分单聊和群聊
        messageHistory(){
            const self = this;
            this.chatVisible = true
            // self.toType === 'C2C' ? 'C2C' : 'GROUP',
        },
        // 添加新成员，区分群聊和单聊
        addUser(){
            if(this.toType === 'C2C' && this.userPower?.allowCreateGroup !== 1){
                this.$message.warning("没有创建群聊的权限！")
                return false;
            }
            this.toType === 'C2C' ? this.toggleMask('creatGroup') : this.toggleMask('add')
        },
        // 打开右侧弹框
        openDrawer(type) {
            this.drawer = true;
            this.drawerType = type;
        },
        //自动保持在最底部
        below () {
            this.$nextTick(() => {
                let container = this.$el.querySelector("#t_right_con");
                if(container){
                    container.scrollTop = container.scrollHeight;
                }
                
            })
        },
        // 群提示消息处理
        newTIMGroupTipElem(item){
            return newTIMGroupTipElem(this, item)
        },
        //消息已读
        read (id) {
            let promise = IM.setMessageRead({ conversationID: id });
            promise.then(function (imResponse) {
                // 已读上报成功，指定 ID 的会话的 unreadCount 属性值被置为0
            }).catch(function (imError) {
                // 已读上报失败
                console.warn('setMessageRead error:', imError);
            });
        },
        // 记录创建的单聊
        createC2CChat(){
            const self = this;
            if(self.isCreateC2CChat){
                return false;
            }
            const op = 'createC2CChat';
            let data = {
                data: {
                    'toId': self.toChatId
                },
                op,
            };
            let URL = self.$getModuleUrl(self.moduleName, op);
            this.$axios(URL, data).then((res) => {
                self.isCreateC2CChat = true;
            });
        },
        //获取会话资料
        async setZi (item) {
            const self = this;
            if(!item){
                self.rRightOff = false;
                return false;
            }
            self.conversation = { ...item }
            if(self.chatConversationID &&  self.chatConversationID === self.conversation.conversationID) return false;
            // 初始化一些数据
            self.isCreateC2CChat = false;
            self.showGroupMemberList = false;
            self.toChatUserOrg = '';
            // self.textarea = ""; 缓存输入框文字
            // 初始化聊天窗口信息
            self.hList = {
                messageList: []
            };
            self.getConversationParams();
            self.findPermissionAndUserStatus();
            let s = await selectContactsPer(self, [self.IMUserInfo.userID.replace('wsstore_', '')])
            self.$store.commit('im/UPDATE_USERPOWER', {
                ...self.$store.state.im.userPower,
                allowCreateGroup: s?.allowCreateGroup || 1
            })
            self.multipleDragEvent();
        },
        // 更新conversation
        updateConversationParams(){
            const self = this;
            let {
                conversationID, 
                userProfile, // C2C
                groupProfile, // GROUP
                type, // 信息类型
                userID = '', 
                groupID = '',
                isPinned,
            } = self.conversation;
            self.chatConversationID = conversationID;
            self.isActive = conversationID
            self.toType = type
            self.toIsPinned = isPinned
            // 区分单聊和群聊
            if (type === 'C2C') { // 单聊
                userID = userProfile.userID
                self.avatar = userProfile.avatar
                self.chatName = userProfile.nick || userID
                self.toChatId = userID
            }else if (type === 'GROUP') { // 群聊
                groupID = groupProfile.groupID
                self.avatar = groupProfile.avatar || IM.baseInfo.groupAvatar
                self.chatName = groupProfile.name || groupID
                self.toChatId = groupID
            }
        },
        // 获取conversation数据
        async getConversationParams(){
            const self = this;
            let {
                conversationID, 
                userProfile, // C2C
                groupProfile, // GROUP
                type, // 信息类型
                userID = '', 
                groupID = '',
                isPinned,
            } = self.conversation;
            self.chatConversationID = conversationID;
            self.isActive = conversationID
            self.toType = type
            self.toIsPinned = isPinned
            
            // 区分单聊和群聊
            if (type === 'C2C') { // 单聊
                userID = userProfile.userID
                self.avatar = userProfile.avatar
                self.chatName = userProfile.nick || userID
                self.toChatId = userID
                self.createC2CChat();
                // 获取对方部门信息
                let t = await selectUserHomePage(self, userID.replace('wsstore_', ''))
                if(t){
                    self.toChatUserOrg = t.userDeptPositVoList[0].deptName;
                }
            }else if (type === 'GROUP') { // 群聊
                groupID = groupProfile.groupID
                self.avatar = groupProfile.avatar || IM.baseInfo.groupAvatar
                self.chatName = groupProfile.name || groupID
                self.toChatId = groupID
                self.getGroupProfile();
                self.queryGroupUserList(0);
            }
        },
        //消息查看更多
        getMessageList () {
            const self = this
            let conversationID = self.chatConversationID
            let nextReqMessageID = self.hList?.nextReqMessageID
            let promise;
            if(!nextReqMessageID){
                self.rRightOff = false;
            }
            self.toType === 'C2C' ? promise = IM.getMessageList({ conversationID, nextReqMessageID }) : promise = IM.getGroupMessageList({ conversationID, nextReqMessageID })
            promise.then(function (imResponse) {
                console.log('我是聊天记录', imResponse)
                if(imResponse){
                    self.hList.messageList = [...imResponse.data.messageList, ...self.hList.messageList]; // 消息列表。
                    self.hList.nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
                    self.hList.isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
                    if(imResponse?.data?.messageList.length > 0){
                        IM.sendMessageReadReceipt(imResponse.data.messageList).then(res => {
                        }).catch(error => {
                        })
                    }
                    //设置消息已读
                    self.read(conversationID)
                }
                self.rRightOff = true
                if(!nextReqMessageID){
                    self.below()
                }
            });
        },
        //获取会话列表
        hlData () {
            const self = this
            IM.getConversationList()
            .then(function (imResponse) {
                self.rList = []
                let t = [...imResponse.data.conversationList]
                console.log(t, '会话列表')
                self.rList = imResponse.data.conversationList
                self.rList.map((item, index) => {
                    if(item.type === '@TIM#SYSTEM'){
                        self.rList.splice(index, 1)
                    }
                    if(self.chatConversationID && self.chatConversationID === item.conversationID){
                        self.conversation = { ...item }
                    }
                })
                let id = self.IMUserInfo.userID.replace('wsstore_', '')
                IM.getConversationProfile({id})
                self.rListOff = true
            }).catch(function (imError) {
                console.log(imError)
            });
        },
        // 初始化IM聊天页面
        initChat () {
            // 监听事件
            IM.addMessageReceived(this.$onMessageReceived, this)
            IM.addMessageReadReceiptReceived(this.$addMessageReadReceiptReceived, this)
            IM.addOnConversationListUpdated(this.$addOnConversationListUpdated, this)
            this.hlData()
        },
        init() {
            const self = this;
            IM.init(self).then(() => {
                self.IMUserInfo = self.$baseMethod.getStore('IMUserInfo')
                self.initChat()
            }).catch(()=>{
                sessionStorage.removeItem('IMUserInfo')
            })
        },
        handleSearch(url) {
            this.searchVisible = true;
        }
    },
    ...sendMessage,
    ...addListener,
    ...groupMethods
    },
    mounted(){
        const self = this;
        self.init();     
    },
    destroyed () {
        console.log("销毁监听事件！")
        IM.removeMessageReceived(this.$onMessageReceived, this)
        IM.removeMessageReadReceiptReceived(this.$addMessageReadReceiptReceived)
        IM.removeOnConversationListUpdated(this.$addOnConversationListUpdated)
        // 离开页面退出当前账号
        // IM.logout().then(function (imResponse) {
        //     console.log("我退出登录了!")
        //     sessionStorage.removeItem('IMUserInfo')
        //     console.log(imResponse.data);
        // }).catch(function (imError) {
        //     console.warn('logout error:', imError);
        // });
    }
}
</script>
<style scoped lang="scss" src="./style/index.scss"></style>