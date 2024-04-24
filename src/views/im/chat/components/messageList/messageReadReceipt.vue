<template>
    <div class="readBox">
        <el-dialog
            title="消息接收人列表"
            :visible.sync="isShowReadReceipt"
            width="30%"
            :modal-append-to-body="false"
            :before-close="closeDialog"
            :close="closeDialog">
            <div class="read-main-box">
                <div class="main-item">
                    <p class="read-title"><span></span>{{unReadUserList.length}}人未读</p>
                    <ul class="main-item-ul">
                        <li v-for="(item, index) in unReadUserList" :key="index">
                            <HeadImg :imgUrl="item.avatar" :headName="item.nick || item.userID"></HeadImg>
                            <span>{{item.nick || item.userID}}</span>
                        </li>
                    </ul>
                </div>
                <div class="main-item">
                    <p class="read-title"><span></span>{{readUserList.length}}人已读</p>
                    <ul class="main-item-ul bg-acy">
                        <li v-for="(item, index) in readUserList" :key="index">
                            <HeadImg :imgUrl="item.avatar" :headName="item.nick || item.userID"></HeadImg>
                            <span>{{item.nick || item.userID}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="closeDialog">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import IM from '../../../../../utils/tim/tim';
import HeadImg from '../headImg';
export default {
    props: {
        conversation: {
            type: Object,
            default: () => {}
        },
        isShowReadReceipt: {
            type: Boolean,
            default: false
        },
        message: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            readUserList: [],
            unReadUserList: [],
            groupID: '',
            readUserIDList: [],
            unreadUserIDList: [],
            isGetResult: 0,
        }
    },
    components: {
        HeadImg
    },
    watch: {
        isShowReadReceipt: function(newV, oldV){
            const self = this;
            if(newV){
                self.isGetResult = 0;
                self.readUserList = [];
                self.unReadUserList = [];
                self.groupID = '';
                self.readUserIDList = [];
                self.unreadUserIDList = [];
                // 已读
                self.getGroupMessageReadMemberList(0);
                // 未读
                self.getGroupMessageReadMemberList(1);
            }
        }
    },
    methods: {
        closeDialog(){
            this.$emit('closeDialog')
        },
        getGroupMessageReadMemberList(type){
            const self = this;
            let options = {
                message: self.message
            }
            if(type === 1){
                options['filter'] = 1
            }
            IM.getGroupMessageReadMemberList(options)
            .then(function(imResponse) {
                const { isCompleted, cursor, messageID, readUserIDList, unreadUserIDList } = imResponse.data;
                if(type === 0){
                    self.readUserIDList = readUserIDList;
                    self.isGetResult++;
                }else if(type === 1){
                    self.isGetResult++;
                    self.unreadUserIDList = unreadUserIDList;
                }
                // console.log(self.isGetResult)
                if(self.isGetResult == 2){
                    // console.log('已读成员数量', self.readUserIDList.length)
                    // console.log('未读成员数量', self.unreadUserIDList.length)
                    self.groupID = self.conversation.groupProfile.groupID;
                    if(self.readUserIDList.length > 0){
                        self.getList(0)
                    }
                    if(self.unreadUserIDList.length > 0){
                        self.getList(1)
                    }
                }
            }).catch(function(imError) {
                if(imError.code === 10062){
                    self.$message.warning('已读回执信息不存在')
                }else{
                    self.$message.warning(imError.message)
                }
                console.log(imError)
                // 拉取群消息已读群成员列表失败
            });
        },
        getGroupMemberProfile(t, type){
            const self = this;
            IM.getGroupMemberProfile({groupID: self.groupID, userIDList: t})
            .then(function(imResponse) {
                if(type === 0){
                    self.readUserList.push.apply(self.readUserList, imResponse.data.memberList);
                    // self.readUserList.push(imResponse.data.memberList);
                    // console.log('self.readUserList', self.readUserList)
                }else if(type === 1){
                    self.unReadUserList.push.apply(self.unReadUserList, imResponse.data.memberList);
                    // self.unReadUserList.push(imResponse.data.memberList);
                    // console.log('self.unReadUserList', self.unReadUserList)
                }
            }).catch(function(imError) {
                console.log(imError)
                // 拉取群消息已读群成员列表失败
            });
        },
        getList(type){
            const self = this;
            if(type === 0){
                for(let i = 0; i < self.readUserIDList.length; i = i+50){
                    let t = self.readUserIDList.slice(i, (i+50 > self.readUserIDList.length ? self.readUserIDList.length : i+50))
                    setTimeout(function(){
                        self.getGroupMemberProfile(t, 0)
                    }, 0);
                }
            }else if(type === 1){
                for(let j = 0; j < self.unreadUserIDList.length; j = j+50){
                    let t = self.unreadUserIDList.slice(j, (j+50 > self.unreadUserIDList.length ? self.unreadUserIDList.length : j+50))
                    setTimeout(function(){
                        self.getGroupMemberProfile(t, 1)
                    }, 0);
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.readBox {
    .read-title {
        display: flex;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        color: #303133;
        line-height: 14px;
        margin-bottom: 16px;
        font-weight: 600;
        span {
            display: block;
            width: 12px;
            height: 12px;
            background: #C0C4CC;
            border-radius: 12px;
            margin-right: 8px;
        }
    }
    .read-main-box {
        display: flex;
        // height: 408px;
        justify-content: space-between;
        .main-item {
            width: 50%;
            .main-item-ul {
                border-radius: 4px;
                border: 1px solid #DCDFE6;
                height: 408px;
                padding: 16px;
                overflow: auto;
                &.bg-acy {
                    background: #F5F7FA;
                }
                li {
                    display: flex;
                    align-items: center;
                    height: 40px;
                    span {
                        margin-left: 8px;
                        font-weight: 600;
                    }
                }
            }
            &:first-child {
                margin-right: 16px;
                flex: 1;
            }
        }
    }
    .dialog-footer {
        display: flex;
        justify-content: flex-end;
    }
}


</style>