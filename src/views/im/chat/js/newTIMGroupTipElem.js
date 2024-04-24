export const newTIMGroupTipElem = (self, message) => {
    let userName = message.nick || message?.payload?.userIDList.join(',');
    if (message?.payload?.memberList?.length > 0) {
        userName = '';
        message?.payload?.memberList?.map((user) => {
        userName += `${user?.nick || user?.userID},`;
        });
        userName = userName.slice(0, -1);
    }
    let h = '';
    switch (message.payload.operationType) {
        case 1:
            h = `${userName} 加入群组`;
            break;
        case 2:
            h = `群成员：${userName} 退出群组`;
            break;
        case 3:
            // h  = `群成员${userName} 被${message.payload.operatorID}踢出群组`;
            h  = `群成员：${userName} 被踢出群组`;
            break;
        case 4:
            h  = `群成员：${userName} 成为管理员`;
            break;
        case 5:
            h  = `群成员：${userName} 被撤销管理员`;
            break;
        case 6:
            h = handleTipGrpUpdated(message.payload)
            break;
        case 7:
            for (const member of message.payload.memberList) {
                if (member.muteTime > 0) {
                    h = `群成员：${ member.nick || member.userID}被禁言`;
                } else {
                    h = `群成员：${ member.nick || member.userID}被取消禁言`;
                }
            }
            break;
        default:
        break;
    }
    return h
}

function handleTipGrpUpdated(payload){
    let t = ''
    const { newGroupProfile } = payload;
    const { operatorID } = payload;
    const name = Object.keys(newGroupProfile)[0];
    switch (name) {
        case 'muteAllMembers':
            if (newGroupProfile[name]) {
                t  = `管理员${operatorID}开启全员禁言`;
            } else {
                t  = `管理员${operatorID} 取消全员禁言`;
            }
            break;
        case 'ownerID':
            t  = `${newGroupProfile[name]} 成为新的群主`;
            break;
        case 'groupName':
            t  = `${operatorID} 修改群名为：${newGroupProfile[name]}`;
            break;
        case 'notification':
            t  = `${operatorID} 发布新公告`;
            break;
        default:
        break;
    }
    return t
}