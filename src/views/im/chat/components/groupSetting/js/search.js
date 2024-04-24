import IM from '../../../../../../utils/tim/tim';
import PinyinMatch from "pinyin-match"
// 查询组内成员
export const searchGroupUser = (self, value) => {
    self.userList = []
    if(value){
        let base = [...self.baseUserList]
        let t = []
        base.map(item => {
            // if(item.userID.indexOf(value) > -1 || PinyinMatch.match((item.nick || item.userID), value)){
            if(PinyinMatch.match((item.nick), value)){
                t.push(item)
            }
        })
        self.userList = [...t]
    }else{
        self.userList = [...self.baseUserList]
    }
    
}