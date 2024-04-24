/**
 * 群组方法
 */
import IM from '@/utils/tim/tim';
import PinyinMatch from "pinyin-match";
export default {
    // 获取群成员数量
    async queryGroupUserList(offset = 0){
        const self = this;
        if(self.conversation?.type !== 'GROUP'){
            return false;
        }
        const options = {
            groupID: self.conversation?.groupProfile?.groupID,
            offset,
        };
        let chatConversationID = self.conversation?.groupProfile?.groupID;// 已请求的群组id
        await IM.getGroupMemberList(options).then((res) => {
            // 此处判断 返回的id是否和当前id相同，避免频繁切换对话框问题
            if(chatConversationID !== self.conversation?.groupProfile?.groupID){
                // console.log('self.allMemberList值', self.allMemberList)
                // console.log('请求的groupID值', self.conversation?.groupProfile?.groupID)
                // console.log('返回的groupID值', chatConversationID)
                // console.log('请求的offset值', offset)
                self.allMemberList = [];
                return false;
            }
            if(offset === 0){
                self.allMemberList = [];
            }
            // console.log('offset', offset)
            // console.log('res.data.offset', res.data.offset)
            if(res.data.offset !== 0){
                self.allMemberList = [...self.allMemberList, ...res.data.memberList];
                self.queryGroupUserList(res.data.offset)
            }else if(res.data.offset === 0){
                // console.log('返回的groupID值1', chatConversationID)
                // console.log('请求的groupID值2', self.conversation?.groupProfile?.groupID)
                // console.log('请求的offset值', offset)
                self.allMemberList = self.allMemberList.concat(res.data.memberList);
                self.handleGroupUserList()
            }
        });
    },
    // 处理群组成员，筛选信息
    handleGroupUserList(){
        const self = this;
        self.baseAllMemberList = self.$baseMethod.deepClone(self.allMemberList)
        // groupAllUserList: [], // 群全部成员
        // admin: [], // 管理员
        // member: [], // 群成员
        // muteMember: [],// 禁言人员
        let t = {
            groupAllUserList: [], // 群全部成员
            admin: [], // 管理员
            member: [], // 群成员
            muteMember: [],// 禁言人员
            atObj: {}
        }
        self.allMemberList.map((item) => {
            t.atObj[item.userID] = item.nick || item.userID;
            switch (item?.role) {
                case 'Admin':
                t.admin.push(item);
                    break;
                case 'Member':
                t.member.push(item);
                    break;
                default:
                    break;
            }
        });
        const time = new Date().getTime();
        t.muteMember = self.allMemberList.filter((item) => item?.muteUntil * 1000 - time > 0);
        self.allMemberList.sort(self.compareUp(self.allMemberList, "role"));
        console.log('self.allMemberList', self.allMemberList)
        t.groupAllUserList = self.$baseMethod.deepClone(self.allMemberList)
        // console.log('添加之前t',t)
        self.$store.commit('im/UPDATE_BASEGROUPUSERLIST', {
            groupAllUserList: [], // 群全部成员
            admin: [], // 管理员
            member: [], // 群成员
            muteMember: [],// 禁言人员
        })
        // console.log('添加之前是什么值',self.$store.state.im.baseGroupUserList)
        // 缓存群成员
        self.$store.commit('im/UPDATE_BASEGROUPUSERLIST', t)
    },
    // 群成员列表排序
    compareUp(data, propertyName) { 
        if ((typeof data[0][propertyName]) != "number") { // 属性值为非数字  
            return function(object1, object2) {  
                let value1 = object1[propertyName];  
                let value2 = object2[propertyName];  
                // if(value1 === 'Owner' && (value2 === 'Admin' || value2 === 'Member')){
                //     return value2.localeCompare(value1);
                // }else if((value1 === 'Admin' || value1 === 'Member') && value2 === 'Owner'){
                //     return value1.localeCompare(value2);
                // }else if((value1 === 'Admin' && value2 === 'Member') || (value1 === 'Member' && value2 === 'Admin')){
                //     return value1.localeCompare(value2);
                if(value1 === 'Admin' && value2 === 'Member'){
                    return value1.localeCompare(value2);
                }else if(value1 === 'Admin' && value2 === 'Owner'){
                    return value2.localeCompare(value1);
                }else if(value2 === 'Admin' && value1 === 'Owner'){
                    return value2.localeCompare(value1);
                }else if(value2 === 'Admin' && value1 === 'Member'){
                    return value1.localeCompare(value2);
                }else{
                    // 2 = r 2  在前
                    return value2.localeCompare(value1);
                }
            }  
        } 
    },
    // @框模糊查询群成员
    searchGroupUser() {
        const self = this;
        self.allMemberList = []
        let value = self.searchGroupUserItem
        if(value){
            let base = [...self.baseAllMemberList]
            let t = []
            base.map(item => {
                if(item.userID.indexOf(value) > -1 || PinyinMatch.match((item.nick || item.userID), value)){
                    t.push(item)
                }
            })
            self.allMemberList = [...t]
            if(self.allMemberList.length === 0){
                self.showGroupMemberList = false;
            }
        }else{
            self.allMemberList = [...self.baseAllMemberList]
        }
        
    },
    // 获取群信息
    getGroupProfile(){
        const self = this;
        let groupID = self.conversation?.groupProfile?.groupID;
        IM.getGroupProfile({groupID}).then((res) => {
            console.log('群信息', res.data.group)
            const groupInfo = res.data.group
            // 群初始未读人数  总人数 - 自己
            self.groupUserListL = groupInfo.memberCount-1;
            self.$store.commit('im/UPDATE_GROUPUSERLISTLENGTH', groupInfo.memberCount)
            self.getUserInGroupInfo();
        }).catch((error)=> {
            self.$message.warning('未找到该群聊')
            self.$store.commit("im/UPDATE_ISREFRESHCONVERSATION", true)
        });
    },
    // 查询当前用户在群里的状态
    getUserInGroupInfo(){
        const self = this;
        let options = {
            groupID: self.toChatId,
            userIDList: [self.IMUserInfo.userID]
        }
        IM.getGroupMemberProfile(options)
        .then(function(imResponse) {
            let o = {}
            if (imResponse.data.memberList[0].role === 'Owner') {
                o['isOwner'] = true;
            }else{
                o['isOwner'] = false;
            }
            if (imResponse.data.memberList[0].role === 'Admin' || imResponse.data.memberList[0].role === 'Owner') {
                o['isOwnerOrAdmin'] = true;
            }else{
                o['isOwnerOrAdmin'] = false;
            }
            if(imResponse.data.memberList[0].muteUntil === 0 || imResponse.data.memberList[0].muteUntil < (new Date().getTime())/1000){
                o['isMute'] = false;
            }else{
                o['isMute'] = true;
            }
            self.$store.commit('im/UPDATE_USERPOWER', {
                ...self.$store.state.im.userPower,
                ...o
            })
        }).catch(function(imError) {
            console.warn('getGroupMemberProfile error:', imError);
        });
    }, 
}