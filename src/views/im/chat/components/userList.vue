<template>
    <div class="list-box">
        <ul class="list-ul">
            <li v-for="(item,index) in userList" :key="index">
                <img v-if="$attrs.isOwner && item.userID !== $attrs.selfUserID && item.role != 'Owner'" class="el-icon-error" @click="deleteUser(index)" src="../image/icon_dele@2x.png" />
                <img v-else-if="!$attrs.isOwner && $attrs.isOwnerOrAdmin && item.userID !== $attrs.selfUserID && item.role === 'Member'" class="el-icon-error" @click="deleteUser(index)" src="../image/icon_dele@2x.png" />
                <!-- <i v-if="$attrs.isOwner && item.userID !== $attrs.selfUserID && item.role != 'Owner'" class="el-icon-error" @click="deleteUser(index)"></i>
                <i v-else-if="!$attrs.isOwner && $attrs.isOwnerOrAdmin && item.userID !== $attrs.selfUserID && item.role === 'Member'" class="el-icon-error" @click="deleteUser(index)"></i> -->
                <head-img :imgUrl="item.avatar !== undefined ? item.avatar : ''" :headName="item.nick || item.userID" :other_w="'is32w'"></head-img>
                <div class="identity" v-if="item.role !== 'Member'">{{getIdentity(item.role)}}</div>
                <div class="text" :class="item.role === 'Member' ? 'mt4' : ''">{{item.nick || item.userID}}</div>
            </li>
        </ul>
    </div>
</template>
<script>
import HeadImg from './headImg'; // 头像展示
import IM from '../../../../utils/tim/tim'
export default {
    props: {
        userList: {
            type: Array,
            default: []
        }
    },
    components: {
        HeadImg
    },
    methods: {
        // 获取成员身份
        getIdentity(role){
            return {
                'Owner': '群主',
                'Admin': '管理员',
            }[role]
        },
        // 删除人员
        deleteUser(index){
            const self = this;
            let groupID = IM.disConversationID({'conversationID': self.$attrs.conversationID, 'chatType': ''}), 
                userID = self.userList[index].userID+'';
            console.log(self.$attrs)
            console.log(groupID, userID)
            if(self.$attrs.threeDrawerType === 'managerSet'){ // 删除群管理员
                // 删除群管理员
                IM.setGroupMemberRole({groupID, userID, roleType: 'M'})
                .then(function(imResponse) {
                    // console.info('修改权限成功', imResponse)
                }).catch(function(imError) {
                    console.warn('修改权限失败', imError); // 置顶会话失败的相关信息
                });
            }else if(self.$attrs.threeDrawerType === 'groupMemberMute'){ // 删除禁言成员
                // 删除禁言人员
                IM.setGroupMemberMuteTime({groupID, userID})
                .then(function(imResponse) {
                    // console.info('修改权限成功', imResponse)
                }).catch(function(imError) {
                    console.warn('删除禁言人员失败', imError); // 置顶会话失败的相关信息
                });
            }else{
                // 删除群成员 reason 删除原因 非必须
                IM.deleteGroupMember({groupID, 'userIDList': [userID]})
                .then(function(imResponse) {
                    // console.info('删除群成员成功', imResponse)
                }).catch(function(imError) {
                    console.warn('修改权限失败', imError); // 置顶会话失败的相关信息
                });
            }
        }
    }
}
</script>
<style scoped lang="scss">
.list-box {
    height: auto;
    overflow: hidden;
    padding: 13px 16px 0 16px;
    cursor: pointer;
    .list-ul {
        display: flex;
        flex-wrap: wrap;
        li {
            // flex: 1;
            margin-right: 17px;
            position: relative;
            display: inline-block;
            margin-bottom: 16px;
            font-size: 0;
            .el-icon-error {
                position: absolute;
                right: -1px;
                top: -7px;
                opacity: 0;
                cursor: pointer;
                width: 16px;
                height: 16px;
            }
            .identity {
                background: #FFFFFF;
                border-radius: 2px;
                border: 1px solid #DCDFE6;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #0088FF;
                line-height: 16px;
                text-align: center;
                margin-top: -14px;
                margin-left: -4px;
                position: relative;
                width: 40px;
                transform: scale(0.7);
            }
            .text {
                height: 17px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #606266;
                line-height: 17px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-left: -8px;
                text-align: center;
                width: 48px;
            }
            .mt4 {
                margin-top: 4px;
            }
            i {
                font-size: 16px;
            }
        }
        li:nth-child(8n){
            margin-right: 0;
        }
        li:hover{
            .el-icon-error{
                opacity: 1;
            }
        }
    }
}
</style>