import IM from '../../../../utils/tim/tim';
// transfer 弹出框展示类型
export const toggleMask = async(self, type) => {
    self.selectedList = [];
    switch (type) {
        case 'add':
            self.isSearch = true;
            self.isRadio = false;
            self.transferList = []; //await self.friendList();
            self.transferTitle = '添加成员';
            self.isUserAndOrg = true;
            break;
        case 'creatGroup':
            self.isSearch = true;
            self.isRadio = false;
            self.transferList = []; //await self.friendList();
            self.transferTitle = '添加成员';
            self.selectedList = [{
                ...self.conversation.userProfile
            }]
            self.isUserAndOrg = true;
            break;
        case 'addAdmin':
            self.isSearch = false;
            self.isRadio = true;
            self.transferList = self.member.member;
            self.transferTitle = '新增管理员';
            self.isUserAndOrg = false;
            break;
        default:
            break;
    }
    self.transferType = type;
    self.dialogShow = !self.dialogShow;
}

// 隐藏 transfer 弹框
export const cancel = (self) => {
    self.toggleMask();
}

// 提交 transfer 弹出框选中项
export const submit = (self, userList) => {
    self.handleManage(userList, self.transferType);
    self.dialogShow = false;
}

// transfer 弹出框查询
export const handleSearchMember = async(self, value) => {
    switch (self.transferType) {
        case 'add':
        case 'creatGroup':
            try {
                const imResponse = await friendList(self, value);
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
        default:
            break;
    }
}

// 查找好友
async function friendList(self, name = '') {
    let reqData = {
        data: {
            body: {name},
            currentPage: '1',
            pageSize: 10000,
        },
        op: 'selectEmps',
    };
    return await self.$axios('/authority/permission/contacts/select', reqData)
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
}

// 处理 transfer 弹出框确认事件
export const handleManage = (self, userList, type) => {
    let userIDList;
    if(self.transferType !== 'creatGroup'){
        userIDList = [];
        userList.map((item) => {
            userIDList.push(item.userID);
            return item;
        });
    }else{
        userIDList = {
            'userList': userList.t_selectList,
            'name': userList.groupName,
        }
    }
    switch (type) {
        case 'add':
            submitAddMember(self, userIDList);
            break;
        case 'creatGroup':
            submitCreatGroup(self, userIDList);
            break;
        case 'addAdmin':
            self.submitAddAdmin(userIDList[0]);
            break;
        default:
            break;
    }
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
    //     console.warn('添加群成员失败', JSON.stringify(imError)); 
    // });
}

// 单聊 - 创建群聊
export const submitCreatGroup = (self, userListObj) => {
    const {
        userList,
        name
    } = userListObj
    let memberList = [];
    userList.map(item => {
        // memberList.push({'userID': item.userID})
        let t = item.userID.replace('wsstore_', '')
        memberList.push(t)
    })
    const options = {
        // name,
        // memberList,
        groupName: name,
        userIds: memberList
    };

    const op = 'oaCreateGroupChat';
    let data = {
        data: options,
        op,
    };
    let URL = self.$getModuleUrl(self.moduleName, op);
    self.$axios(URL, data).then((res) => {
        self.isCreateC2CChat = true;
        if(res.code === 1){
            let data = JSON.parse(res.data)
            setTimeout(() => {
                IM.getConversationProfile({id: data?.groupId, type: 'GROUP'})
                .then(function(imResponse) {
                    self.$emit('close')
                    // 获取成功
                    IM.handleCurrentConversation(self, true, imResponse.data.conversation)
                }).catch(function(imError) {
                    console.warn('getConversationProfile error:', imError); // 获取会话资料失败的相关信息
                });
            }, 1000)
        }else{
            self.$message.error(res.msg)
        }
    });

    // IM.createGroup(options)
    // .then(function (imResponse) {
    //     setTimeout(() => {
    //         IM.getConversationProfile({id: imResponse?.data?.group?.groupID, type: 'GROUP'})
    //         .then(function(imResponse) {
    //             self.$emit('close')
    //             // 获取成功
    //             IM.handleCurrentConversation(self, true, imResponse.data.conversation)
    //         }).catch(function(imError) {
    //             console.warn('getConversationProfile error:', imError); // 获取会话资料失败的相关信息
    //         });
    //     }, 1000)
    // }).catch(function (imError) {
    //     console.warn('创建群聊失败', imError); 
    // });
}