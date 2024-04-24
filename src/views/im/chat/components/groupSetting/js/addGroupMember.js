import IM from '../../../../../../utils/tim/tim';
// 群聊 - 添加群成员
export const addGroupMember = (self) => {
    self.toggleMask('add')
}

// 群聊 - 提交选中的人员
export const submitAddMember = (self, userIDList) => {
    if(userIDList.length > 500){
        self.$message.warning('添加人员太多，单次最多添加500人')
        return false;
    }
    const moduleName = '/chat'
    const op = 'addApplyjoingroup';
    let applyJoinList = [];
    userIDList.map(item => {
        let t = {
            userId: item
        }
        applyJoinList.push(t)
    })
    let data = {
        data: {
            'groupId': self.conversation.groupProfile.groupID,
            applyJoinList,
            'applyJoinReason': ''
        },
        op,
    };
    let URL = self.$getModuleUrl(moduleName, op);
    self.$axios(URL, data).then((res) => {
        self.$store.commit("im/UPDATE_ISAPPLYJOIN", true)
        // console.warn('添加群成员成功', res); 
    });
    // const options = {
    //     groupID: self.conversation.groupProfile.groupID,
    //     userIDList,
    // };
    // IM.addGroupMember(options)
    // .then(function (imResponse) {
    //     console.warn('添加群成员成功', imResponse); 
    // }).catch(function (imError) {
    //     if(imError.code === 10005){
    //         self.$message.warning('添加人员太多，单次最多添加500人')
    //     }
    //     console.warn('添加群成员失败', imError); 
    // });
}

// 群聊 - 添加群管理员
export const submitAddAdmin = (self, user) => {
    let groupID = self.conversation.groupProfile.groupID
    console.log(user)
    let roleType = '';
    switch (user.role) {
        case 'Admin':
            roleType = 'M';
        break;
        case 'Member':
            roleType = 'A';
        break;
    }
    const options = {
        groupID: self.conversation.groupProfile.groupID,
        userID: user.userID,
        roleType,
    };
    if(user.muteUntil != 0 && user.muteUntil > (new Date().getTime())/1000){
        IM.setGroupMemberMuteTime({groupID, userID: user.userID})
        .then(function(imResponse) {
            // console.info('修改权限成功', imResponse)
        }).catch(function(imError) {
            console.warn('删除禁言人员失败', imError); // 置顶会话失败的相关信息
        });
    }
    IM.setGroupMemberRole(options)
    .then(function (imResponse) {
    }).catch(function (imError) {
        console.warn('添加群管理员失败', imError); 
    });
}

// 群聊 - 群转让
export const submitOwner = (self, user) => {
    let groupID = self.conversation.groupProfile.groupID
    const options = {
        groupID,
        newOwnerID: user,
    };
    IM.setGroupMemberMuteTime({groupID, userID: user})
    .then(function(imResponse) {
        // console.info('修改权限成功', imResponse)
    }).catch(function(imError) {
        console.warn('删除禁言人员失败', imError); // 置顶会话失败的相关信息
    });
    IM.changeGroupOwner(options)
    .then(function (imResponse) {
    }).catch(function (imError) {
        console.warn('群转让失败', imError); 
    });
}

// 群聊 - 添加禁言人员
export const submitMuteTime = (self, user, type = 'add') => {
    const options = {
        groupID: self.conversation.groupProfile.groupID,
        userID: user,
        muteTime: type === 'add' ? 60 * 60 * 24 * 30 : 0,
    };
    console.log(options)
    IM.setGroupMemberMuteTime(options)
    .then(function (imResponse) {
    }).catch(function (imError) {
        console.warn('添加禁言人员失败', imError); 
    });
}