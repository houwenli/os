
// 信息类型
export const MSG_TYPES = {
    MSG_TEXT: 'TIMTextElem',
    MSG_IMAGE: 'TIMImageElem',
    MSG_FILE: 'TIMFileElem',
    MSG_CUSTOM: 'TIMCustomElem',
    MSG_VIDEO: 'TIMVideoFileElem',
    MSG_SOUND: 'TIMSoundElem',
    MSG_LOCATION: 'TIMLocationElem',
}

// 处理
export const translateGroupSystemNotice = (self, message) => {
    if(message.type === 'TIMGroupSystemNoticeElem'){
        return message.payload.operationType
    }else if(message.type === 'TIMGroupTipElem'){
        self.$store.commit("im/UPDATE_ISUPDATECONVERSATION", true)
        return message.payload.operationType
    }else{
        return ''
    }
}

// 处理被踢，退出，解散群聊会话还在问题
export const handleTranslateGroupSystemNotice = (message, IM, self) => {
    if(message.type === 'TIMGroupSystemNoticeElem'){
        const groupName = message.payload.groupProfile.name || message.payload.groupProfile.groupID;
        const conversationID = `GROUP${message.payload.groupProfile.groupID}`
        switch (message.payload.operationType) {
        //     case 1:
        //         return `${message.payload.operatorID} 申请加入群组：${groupName}`;
        //     case 2:
        //         return `成功加入群组：${groupName}`;
        //     case 3:
        //         return `申请加入群组：${groupName} 被拒绝`;
            case 4:
                IM.deleteConversation(conversationID)
                self.$store.commit("im/UPDATE_ISREFRESHCONVERSATION", true)
                // return `你被管理员${message.payload.operatorID} 踢出群组：${groupName}`;
                break;
            case 5:
                IM.deleteConversation(conversationID)
                self.$store.commit("im/UPDATE_ISREFRESHCONVERSATION", true)
                break;
                // return `群：${groupName} 被 ${message.payload.operatorID} 解散`;
        //     case 6:
        //         // return `${message.payload.operatorID} 创建群：${groupName}`;
        //         return `GROUP${message.payload.groupProfile.groupID}`
        //     case 7:
        //         return `${message.payload.operatorID} 邀请你加群：${groupName}`;
            case 8:
                IM.deleteConversation(conversationID)
                self.$store.commit("im/UPDATE_ISREFRESHCONVERSATION", true)
                break;
                // return `你退出群组：${groupName}`;
        //     case 9:
        //         return `你被${message.payload.operatorID} 设置为群：${groupName} 的管理员`;
        //     case 10:
        //         return `你被${message.payload.operatorID} 撤销群：${groupName} 的管理员身份`;
        //     case 12:
        //         return `${message.payload.operatorID} 邀请你加群：${groupName}`;
        //     case 13:
        //         return `${message.payload.operatorID} 同意加群：${groupName}`;
        //     case 14:
        //         return `${message.payload.operatorID} 拒接加群：${groupName}`;
        //     case 255:
        //         return `自定义群系统通知: ${message.payload.userDefinedField}`;
        }
    }
}

/**
 * 获取当前人员是否可以创建群聊
 * @param {*} self 
 * @param {*} deptIds 部门ids []
 * @returns 
 */
 export const selectContactsPer = async (self, deptIds) => {
    const moduleName = '/chat'
    const op = 'selectContactsPer';
    let data = {
        data: {
            deptIds
        },
        op,
    };
    let URL = self.$getModuleUrl(moduleName, op);
    let res = await self.$axios(URL, data)
    if (res.code == 1) {
        let ret = JSON.parse(res.data);
        return ret
    }
}

/**
 * 获取人员部门等相关信息
 * @param {*} self 
 * @param {*} id 人员id
 * @returns 
 */
 export const selectUserHomePage = async (self, id) => {
    if(self.toChatUserOrg){return false}
    const moduleName = '/chat'
    const op = 'selectUserHomePage';
    let data = {
        data: {
            id
        },
        op,
    };
    let URL = self.$getModuleUrl(moduleName, op);
    let res = await self.$axios(URL, data)
    if (res.code == 1) {
        let ret = JSON.parse(res.data);
        return ret
    }
}

function isYestday(time) {
    let date = new Date() //当前时间
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() //今天凌晨
    let yestday = new Date(today - 24 * 3600 * 1000).getTime()
    return time < today && yestday <= time
}
export const caculateTimeago = (dateTimeStamp, showTime) => {
    let time = dateTimeStamp * 1000
    const minute = 1000 * 60 // 把分，时，天，周，半个月，一个月用毫秒表示
    const hour = minute * 60
    const day = hour * 24
    const week = day * 7
    const now = new Date() // 获取当前时间毫秒
    const diffValue = now.getTime() - time // 时间差
  
    // 计算时间差的分，时，天，周，月
    const minC = diffValue / minute
    const hourC = diffValue / hour
    const dayC = diffValue / day
    const weekC = diffValue / week
  
    const datetime = new Date(time)
    let h = datetime.getHours()
    let m = datetime.getMinutes()
    let baseShowTime = `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`
    // 昨天判断
    if (isYestday(time)) {
      if (showTime) {
        return '昨天 ' + baseShowTime
      }
      return '昨天'
    }
    if (dayC < 1) {
      return baseShowTime
    }
    if (dayC > 1 && dayC <= 7) {
      const weekDay = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      if (showTime) {
        return `${weekDay[datetime.getDay()]} ${baseShowTime}`
      }
      return weekDay[datetime.getDay()]
    }
    if (weekC > 1) {
      // 超过一个星期
      const Nyear = datetime.getFullYear()
      const Nmonth = datetime.getMonth() + 1 < 10 ? `0${datetime.getMonth() + 1}` : datetime.getMonth() + 1
      const Ndate = datetime.getDate() < 10 ? `0${datetime.getDate()}` : datetime.getDate()
      if (showTime) {
        return `${Nyear}-${Nmonth}-${Ndate} ${baseShowTime}`
      }
      return `${Nyear}-${Nmonth}-${Ndate}`
    }
}
  
/**
 * @param {*} curTime 要判断的消息的时间戳
 * @param {*} preTime 上一条没显示且最远的一条消息的时间戳
 * @returns
 */
export const getShowTime = (curTime, preTime) => {
    const minute = 60 // 把分，时，天，周，半个月，一个月用毫秒表示
    if (!preTime) {
      // 第一条消息
      return caculateTimeago(curTime, true)
    } else {
      const diffTime = curTime - preTime // 本条消息和上条时间差
      // 5分钟内连续讨论
      if (diffTime / minute < 30) {
        return ''
      } else {
        return caculateTimeago(curTime, true)
      }
    }
}
