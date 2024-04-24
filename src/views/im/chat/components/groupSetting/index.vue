<template>
    <!-- 群聊设置 -->
    <div class="group-setting">
        <div class="setting-head-img-box">
            <head-img v-if="!showEdit" :imgUrl="avatar" :headName="chatName" :other_w="'is48w'"></head-img>
            <div v-else>
                <el-upload
                    class="upload-img"
                    :multiple="false"
                    :show-file-list="false"
                    :data="actionQuery"
                    :on-success="handleSuccess"
                    :before-upload="beforeUpload"
                    :action="uploadFile">
                        <img v-if="fileImg" style="width 48px;height: 48px" class="el-upload-list__item-thumbnail" :src="fileImg" alt="">
                        <i v-else slot="default" class="el-icon-plus"></i>
                    </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </div>
            <div class="info-box">
                <div v-if="isOwner && !showEdit" class="show-info"><span>{{ chatName }}</span><span @click="editName()">编辑</span></div>
                <div v-else-if="!showEdit" class="show-info"><span>{{ chatName }}</span></div>
                <div v-if="showEdit" class="edit-input">
                    <el-input v-model="updateName" maxlength="10"></el-input><span @click="updateGroupProfile()">确认</span><span @click="showEdit = false">取消</span>
                </div>
            </div>
        </div>
        <!-- 群成员列表 -->
        <group-user-list v-bind="{...$attrs, userList, userNumber, isOwnerOrAdmin, conversationID, selfUserID, isOwner}" :key="userNumber" @addUser="addGroupMember" @searchGroupUser="searchGroupUser"></group-user-list>
        <!-- 会话置顶 -->
        <pin-conversation v-bind="{conversationID, isPinned,}"></pin-conversation>
        <!-- 邀请申请是否需要审核 -->
        <invitation-approval v-if="isOwnerOrAdmin" @queryGroupOtherInfo="queryGroupOtherInfo" v-bind="{conversationID, interfaceInfo}"></invitation-approval>
        <!-- 群管理 -->
        <div class="setting-li" @click="innerDrawer = true" v-if="isOwnerOrAdmin">
            <span>群权限管理</span>
            <i class="el-icon-arrow-right"></i>
        </div>
        <el-drawer v-if="innerDrawer && isOwnerOrAdmin" :title="innerDrawerName" :size="'512px'" :append-to-body="false" :modal="false" :visible.sync="innerDrawer">
            <div class="setting-li" @click="openChild(item.type, item.name)" v-for="(item, index) in managerList" :key="index">
                <span>{{item.name}}</span>
                <i class="el-icon-arrow-right"></i>
            </div>
        </el-drawer>
        <el-drawer v-if="threeDrawer && isOwnerOrAdmin" :title="threeDrawerName" :size="'512px'" :append-to-body="false" :modal="false" :visible.sync="threeDrawer">
            <div class="setting-li" @click="openThreeChild()">
                <img class="add-user" src="../../image/icon_ending.png" />
                <span>{{threeButtonName}}</span>
                <i class="el-icon-arrow-right"></i>
            </div>
            <div class="three-list-title">
                {{getThreeListTitle(threeDrawerType)}}
            </div>
            <!-- 列表 -->
            <user-list v-bind="{
                    ...$attrs,
                    'userList': {
                        'managerSet': member.admin,
                        'groupMemberMute': member.muteMember,
                        'changeOwner': []
                    }[threeDrawerType],
                    threeDrawerType,
                    isOwnerOrAdmin,
                    isOwner,
                    conversationID
                }"></user-list>
        </el-drawer>
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
    </div>
</template>
<script>
import HeadImg from '../headImg'; // 头像展示
import PinConversation from '../pinConversation'; // 会话置顶
import InvitationApproval from './invitationApproval/index'; // 邀请人员是否需要审核
import GroupUserList from './groupUserList'; // 群成员列表
import IM from '../../../../../utils/tim/tim';
import UserList from '../userList'; // 成员列表
import MaskDialog from '../mask'; // 群聊聊天设置
import TransferSelect from '../transfer'; // 群聊聊天设置
import { 
    addGroupMember,
    submitAddMember,
    submitAddAdmin,
    submitOwner,
    submitMuteTime,
    } from './js/addGroupMember' // 添加 - 群成员、管理员、禁言人员
import {
    searchGroupUser
    } from './js/search'
import PinyinMatch from "pinyin-match"
export default {
    components: {
        HeadImg,
        PinConversation,
        GroupUserList,
        UserList,
        MaskDialog,
        TransferSelect,
        InvitationApproval
    },
    props: {
        conversation: {
            type: Object,
            default: () => { }
        },
    },
    computed: {
        uploadFile() {
            return `${process.env.VUE_APP_OAORG_API}/orgWeb/file/addAttachment`;// 借用的不知道那个部分的接口
        },
    },
    data () {
        return {
            showEdit: false,
            avatar: '',
            chatName: '',
            conversationID: '',
            isPinned: '',
            updateName: '',
            innerDrawer: false,
            innerDrawerName: '群权限管理',
            managerList: [
                {
                    name: '群内禁言',
                    type: 'groupMemberMute'
                }
            ],
            threeDrawer: false,
            threeDrawerName: '',
            threeButtonName: '',
            threeDrawerType: '',
            // 群成员分类信息
            member: {
                admin: [], // 管理员
                member: [], // 群成员
                muteMember: [],// 禁言人员
            },
            userList: [], // 群成员列表
            baseUserList: [], // 群成员 Const
            userNumber: '', // 群成员数量
            isOwnerOrAdmin: this.$store.state.im.userPower.isOwnerOrAdmin, // 是否是群主或者管理员
            isOwner: this.$store.state.im.userPower.isOwner,
            // transfer 参数
            dialogShow: false,
            transferTitle: '',
            transferList: [],
            isSearch: '',
            isRadio: '',
            selectedList: [],
            allUserList: [],
            transferType: '',
            isUserAndOrg: false,
            selfUserID: '', // 自己的id
            // 上传头像
            dialogVisible: false,
            dialogImageUrl: '',
            fileImg: '',
            actionQuery: {
                op: 'upload',
                data: {},
                token: $vuex.$baseMethod.getStore('_ccmUser').token
            },
            fileType: ['png', 'jpg', 'jpeg'],
            interfaceInfo: {}, // 群组资料
        }
    },
    mounted () {
        if(this.isOwner){
            this.managerList.splice(0, 0,{
                name: '管理员设置',
                type: 'managerSet'
            },{
                name: '群主转让',
                type: 'changeOwner'
            })
        }
        // console.log('this.$store.state.im.baseGroupUserList', this.$store.state.im.baseGroupUserList)
        this.userList = this.$store.state.im.baseGroupUserList.groupAllUserList;
        this.baseUserList = this.$baseMethod.deepClone(this.$store.state.im.baseGroupUserList.groupAllUserList)
        this.userNumber = this.userList.length;
        this.member = {
            admin: this.$store.state.im.baseGroupUserList.admin, // 管理员
            member: this.$store.state.im.baseGroupUserList.member, // 群成员
            muteMember: this.$store.state.im.baseGroupUserList.muteMember,// 禁言人员
        }
    },
    watch: {
        conversation: {
            handler (newV, oldV) {
                console.log('群信息更新')
                const self = this;
                self.getConversationParams();
                self.queryGroupOtherInfo();
            },
            immediate: true,
            deep: true,
        },
        '$store.state.im.isApplyJoin': function(newV, oldV){
            if(newV){
                const self = this;
                self.queryGroupOtherInfo();
                self.$store.commit("im/UPDATE_ISAPPLYJOIN", false)
            }
        },
        '$store.state.im.baseGroupUserList': {
            handler (newV, oldV){
                console.log('刷新成员信息', newV)
                this.userList = newV.groupAllUserList;
                this.member = {
                    admin: newV.admin, // 管理员
                    member: newV.member, // 群成员
                    muteMember: newV.muteMember,// 禁言人员
                }
                this.userNumber = newV.groupAllUserList.length;
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        // 查询加群人数
        queryGroupOtherInfo(){
            const self = this;
            const moduleName = '/chat'
            const op = 'queryGroupOtherInfo';
            let data = {
                data: {
                    'groupId': self.conversation.groupProfile.groupID,
                },
                op,
            };
            let URL = self.$getModuleUrl(moduleName, op);
            this.$axios(URL, data).then((res) => {
                self.interfaceInfo = JSON.parse(res.data);
            });
        },
        beforeUpload(file) {
            let upFileType = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
            if (file.name.length > 40) {
                this.$message.error(`文件名不能大于40个字符长度`);
                return false;
            }
            if (!this.fileType.includes(upFileType)) {
                this.$message.error('文件格式不支持上传');
                return false;
            }
            if (file.size > 20 * 1024 * 1024) {
                this.$message.error(`文件超过20M，无法上传`);
                return false;
            }
        },
        handleSuccess(response, file, fileList) {
            if (response.code === 1) {
                // this.fileImg = response.data;
                this.createShortUrl(response.data);
            } else {
                this.$message.error(response.msg);
            }
        },
        // 创建短链接
        async createShortUrl(sourceUrl){
            const self = this;
            const moduleName = '/chat'
            const op = 'createShortUrl';
            let data = {
                data: {
                    sourceUrl
                },
                op,
            };
            let URL = self.$getModuleUrl(moduleName, op);
            let res = await self.$axios(URL, data)
            if (res.code == 1) {
                self.fileImg = (JSON.parse(res.data)).shortUrl;
                // self.fileImg = 'https://s-fat03.wsecar.com/bIJX';
            }
        },
        // transfer 弹出框展示类型
        async toggleMask (type) {
            const self = this;
            self.selectedList = [];
            switch (type) {
                case 'add':
                    self.isSearch = true;
                    self.isRadio = false;
                    self.transferList = [];
                    self.transferTitle = '添加成员';
                    self.isUserAndOrg = true;
                    break;
                case 'addAdmin':
                    self.isSearch = true;
                    self.isRadio = false;
                    self.transferList = self.member.member;
                    self.transferTitle = '新增管理员';
                    self.isUserAndOrg = false;
                    break;
                case 'changeOwner':
                    self.isSearch = true;
                    self.isRadio = true;
                    self.transferList = [...self.member.admin, ...self.member.member];
                    self.transferTitle = '转让群组';
                    self.isUserAndOrg = false;
                    break;
                case 'addMute':
                    self.isSearch = true;
                    self.isRadio = false;
                    self.transferList = self.member.member;
                    if (self.conversation.groupProfile.selfInfo.role === 'Owner') {
                        self.transferList = [...self.member.member];
                    }
                    self.transferTitle = '新增禁言用户';
                    self.isUserAndOrg = false;
                    break;
                default:
                    break;
            }
            self.transferType = type;
            self.dialogShow = !self.dialogShow;
        },
        // transfer 弹出框查询
        async handleSearchMember (value) {
            const self = this;
            let imResponse = {};
            const options = {
                groupID: this.conversation.groupProfile.groupID,
                userIDList: [value],
            };
            switch (self.transferType) {
                case 'addAdmin': // 添加管理员
                case 'addMute': // 添加禁言人员
                    let addAdminList = [];
                    if(value){
                        let base = [...self.member.member]
                        let t = []
                        base.map(item => {
                            if(item.userID.indexOf(value) > -1 || PinyinMatch.match((item.nick || item.userID), value)){
                                t.push(item)
                            }
                        })
                        addAdminList = [...t]
                    }else{
                        addAdminList = [...self.member.member]
                    }
                    self.transferList = addAdminList
                    break;
                case 'changeOwner': // 群主转让
                    let changeOwnerList = [];
                    if(value){
                        let base = [...self.member.admin, ...self.member.member]
                        let t = []
                        base.map(item => {
                            if(item.userID.indexOf(value) > -1 || PinyinMatch.match((item.nick || item.userID), value)){
                                t.push(item)
                            }
                        })
                        changeOwnerList = [...t]
                    }else{
                        changeOwnerList = [...self.member.admin, ...self.member.member]
                    }
                    self.transferList = changeOwnerList
                    break;
                case 'add':
                    try {
                        const imResponse = await self.friendList(value);
                        // console.log('搜索出来的成员', imResponse)
                        self.transferList = imResponse;
                        self.transferList.map(item => {
                            if(item.imagePath){
                                item['avatar'] = item.imagePath
                            }
                            return item;
                        })
                    } catch (error) {
                        self.$message.error('该用户不存在')
                        self.searchUserList = [...self.allUserList];
                        return;
                    }
                    break;
                case 'remove':
                    try {
                        imResponse = await IM.getGroupMemberProfile(options);
                        if (imResponse.data.memberList.length === 0) {
                            const message = '该用户不在群组内';
                            return self.$message.error(message);
                        }
                        self.transferList = self.transferList.filter((item) => item.userID !== imResponse?.data?.memberList[0]?.userID);
                        self.transferList = [
                            ...self.transferList,
                            ...imResponse?.data?.memberList,
                        ];
                    } catch (error) {
                        const message = '该用户不存在';
                        self.$message.error(message)
                    }
                    break;
                default:
                    break;
            }
        },
        // 提交 transfer 弹出框选中项
        submit(userList) {
            console.log('transfer选中返回的列表', userList)
            const self = this;
            if (self.transferType === 'remove') {
                self.userList = userList;
                self.delDialogShow = !this.delDialogShow;
            } else {
                self.handleManage(userList, this.transferType);
            }
            self.dialogShow = false;
        },
        // 处理 transfer 弹出框确认事件
        handleManage(userList, type) {
            const self = this;
            let userIDList = [];
            userList.map((item) => {
                userIDList.push(item.userID);
                return item;
            });
            console.log('add', userIDList)
            console.log('addAdmin', userIDList)
            console.log('changeOwner', userList[0])
            console.log('addMute', userIDList)
            switch (type) {
                case 'add':
                    self.submitAddMember(userIDList);
                    break;
                case 'addAdmin':
                    userList.map(item => {
                        self.submitAddAdmin(item);
                    })
                    break;
                case 'changeOwner':
                    self.submitOwner(userIDList[0]);
                    break;
                case 'addMute':
                    userList.map(item => {
                        self.submitMuteTime(item.userID);
                    })
                    break;
                default:
                    break;
            }
        },
        // 群聊 - 添加群成员
        addGroupMember(){
            addGroupMember(this)
        },
        // 群聊 - 提交选中的人员
        submitAddMember(userIDList){
            submitAddMember(this, userIDList)
        },
        // 群聊 - 添加群管理员
        submitAddAdmin(user){
            submitAddAdmin(this, user)
        },
        // 群聊 - 群转让
        submitOwner(user){
            submitOwner(this, user)
        },
        // 群聊 - 添加禁言人员
        submitMuteTime(user){
            submitMuteTime(this, user)
        },
        // 隐藏 transfer 弹框
        cancel () {
            this.toggleMask();
        },
        // 模糊搜索群组内人员
        searchGroupUser(value){
            searchGroupUser(this, value)
        },
        // transfer 弹出框查找好友
        async friendList (name = '') {
            let self = this;
            const moduleName = '/chat'
            let reqData = {
                data: {
                    body: {name},
                    currentPage: '1',
                    pageSize: 10000,
                },
                op: 'selectEmps',
            };
            const URL = self.$getModuleUrl(moduleName, reqData.op);
            return await self.$axios(URL, reqData)
                .then(result => {
                    if (result.code === 1) {
                        let resData = JSON.parse(result.data);
                        resData.map(item => {
                            item['nick'] = item.name;
                            item['userID'] = 'wsstore_' + item.id;
                            return item
                        })
                        return resData || [];
                    }
                })
                .catch(error => {
                    console.log('error', error);
                });
        },
        // 获取信息
        getConversationParams () {
            const self = this;
            let {
                type,
                conversationID,
                isPinned,
                userProfile,
                groupProfile

            } = self.conversation;
            console.log('self.conversation', self.conversation)
            self.conversationID = conversationID;
            self.isPinned = isPinned;
            // 区分单聊和群聊
            if (type === 'C2C') { // 单聊
                self.avatar = userProfile.avatar;
                self.chatName = userProfile.nick || userID;
                self.updateName = self.chatName;
            } else if (type === 'GROUP') { // 群聊
                self.avatar = groupProfile.avatar || IM.baseInfo.groupAvatar;
                self.chatName = groupProfile.name || groupID;
                self.updateName = self.chatName;
                self.fileImg = self.avatar
            }
        },
        // 获取标题
        getThreeListTitle (t) {
            return {
                'managerSet': '群内管理员列表',
                'groupMemberMute': '群内禁言成员列表',
            }[t]
        },
        // 
        openThreeChild () {
            const self = this;
            if(self.threeDrawerType === 'managerSet'){
                self.toggleMask('addAdmin')
            }else if(self.threeDrawerType === 'groupMemberMute'){
                self.toggleMask('addMute')
            }
        },
        // 打开第3级draw
        openChild (type, name) {
            const self = this;
            if (type === 'changeOwner') {
                // 展示dialog
                self.toggleMask('changeOwner')
                return false;
            }
            if (type === 'managerSet') {
                self.threeDrawerName = '群权限设置'
                self.threeButtonName = '添加群管理员'

            } else if (type === 'groupMemberMute') {
                self.threeDrawerName = '群内禁言设置'
                self.threeButtonName = '添加群内禁言人员'
            }
            self.threeDrawerType = type;
            self.threeDrawer = true;
            self.threeDrawerName = name;
        },
        // 编辑群名称
        editName () {
            this.showEdit = true;
            this.updateName = this.chatName;
        },
        // 更新群名称
        updateGroupProfile () {
            const self = this;
            let conversationID = IM.disConversationID({ 'conversationID': self.conversationID, chatType: '' })
            IM.updateGroupProfile({
                groupID: IM.disConversationID({ conversationID, chatType: 'GROUP' }),
                name: self.updateName,
                avatar: self.fileImg
            }).then(function (imResponse) {
                self.showEdit = false;
            }).catch(function (imError) {
                console.warn('群名修改失败', imError); // 置顶会话失败的相关信息
            });
        },
    }
}
</script>
<style scoped lang="scss">
.setting-head-img-box {
    display: flex;
    margin-bottom: 24px;
    .t-message-avatar,
    .t-message-avatar-div {
        margin-top: 8px;
    }
    .info-box {
        margin-left: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        span:nth-child(1) {
            height: 22px;
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            line-height: 22px;
            margin-bottom: 6px;
        }
        span:nth-child(2) {
            height: 20px;
            font-size: 14px;
            font-weight: 400;
            color: #0088ff;
            line-height: 20px;
            margin-left: 16px;
            cursor: pointer;
        }
        .show-info {
            padding-top: 13px;
        }
        .edit-input {
            margin-top: 7px;
            span {
                height: 20px;
                font-size: 14px;
                font-weight: 400;
                color: #0088ff;
                line-height: 20px;
                cursor: pointer;
            }
            span:nth-child(2) {
                margin-left: 16px;
            }
            span:nth-child(3) {
                margin-left: 12px;
            }
            /deep/.el-input {
                width: 200px;
                height: 36px;
                background: #ffffff;
                border-radius: 4px;
            }
        }
    }
}
.setting-li {
    height: 70px;
    background: #f5f7fa;
    border-radius: 4px;
    line-height: 70px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
    padding: 0 16px 24px;
    margin-bottom: 16px;
    display: flex;
    cursor: pointer;
    .add-user{
        width: 16px;
        height: 16px;
        margin-top: 27px;
        margin-right: 8px;
    }
    span {
        flex: 1;
    }
    /deep/.el-icon-arrow-right {
        margin-top: 27px;
        margin-right: -5px;
    }
}
.three-list-title {
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
    line-height: 22px;
}
.group-setting {
    padding-bottom: 60px;
    /deep/.el-drawer__wrapper {
        top: 0 !important;
        right: 0 !important;
    }
}
/deep/.upload-img{
    width: 48px;
    height: 48px;
    border-radius: 100%;
    text-align: center;
    line-height: 48px;
    img {
        width: 48px;
        height: 48px;
        border-radius: 100%;
    }
}
</style>