<template>
    <div>
        <MaskForWord :show="showForwar" @update:show="(e) => cancel()">
            <Transfer
                title="转发"
                :list="transferList"
                :isSearch="true"
                :isCustomItem="true"
                :resultShow="true"
                :type="transferType"
                @submit="handleForWordMessage"
                @cancel="cancel"
                @search="handleSearchMember"
            >
                <template #left="{ data }">
                    <img class="avatar" v-if="handleAvatar(data) !== 1" :src="handleAvatar(data)" />
                    <HeadImg v-else :headName="handleName(data)" :other_w="'is36w'"></HeadImg>
                    <span class="name">{{ handleName(data) }}</span>
                </template>
                <template #right="{ data }">
                    <img class="avatar" v-if="handleAvatar(data) !== 1" :src="handleAvatar(data)" />
                    <HeadImg v-else :headName="handleName(data)" :other_w="'is36w'"></HeadImg>
                    <span class="name">{{ handleName(data) }}</span>
                </template>
            </Transfer>
        </MaskForWord>
    </div>
</template>
<script>
import MaskForWord from '../mask';
import Transfer from '../transfer';
import IM from '../../../../../utils/tim/tim';
import HeadImg from '../headImg';
export default {
    props: {
        conversationData: {
            type: Array,
            default: () => []
        },
        showForwar: {
            type: Boolean,
            default: () => false
        },
        forwarMessage:  {
            type: Object,
            default: () => {}
        },
        chatConversationID:  {
            type: String,
            default: () => ''
        },
    },
    components: {
        Transfer,
        MaskForWord,
        HeadImg
    },
    watch: {
        conversationData: {
            handler (newV, oldV){
                if(newV){
                    this.conversationData.map(item => {
                        switch (item.type) {
                            case IM.TIM.TYPES.CONV_C2C:
                                item['userID'] = item?.userProfile?.userID || '';
                                break;
                            case IM.TIM.TYPES.CONV_GROUP:
                                item['userID'] = item?.groupProfile?.groupID || '';
                                break;
                            default:
                                break;
                        }
                        return item;
                    })
                }
            },
            immediate: true,
            deep: true,
        },
        'chatConversationID': function(newV, oldV){
            if(newV){

            }
        }
    },
    data() {
        return {
            transferType: 'messageForwar',
            transferList: [...this.conversationData],
            searchValue: ''
        }
    },
    methods: {
        // transfer 弹出框查询
        async handleSearchMember (value) {
            const self = this;
            self.searchValue = value;
            switch (self.transferType) {
                case 'messageForwar':
                    try {
                        let imResponse = []
                        let friendUser = await self.friendList(value);
                        let gourpList = await self.getGroupMemberList(value)
                        imResponse = [...friendUser, ...gourpList]
                        if(imResponse.length > 0){
                            self.transferList = [...imResponse];
                        }else{
                            self.transferList = [];
                        }
                        if(value === ''){
                            self.transferList = [...this.conversationData];
                        }
                    } catch (error) {
                        self.$message.error('该用户不存在')
                        self.searchUserList = [...self.allUserList];
                        return;
                    }
                    break;
                default:
                    break;
            }
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
                        if(resData.length > 0){
                            resData.map(item => {
                                item['nick'] = item.name;
                                item['userID'] = 'wsstore_' + item.id;
                                item['type'] = 'ADDUSER';
                                return item
                            })
                        }
                        return resData || [];
                    }
                })
                .catch(error => {
                    console.log('error', error);
                });
        },
        async getGroupMemberList(name = '') {
            const self = this;
            const moduleName = '/chat';
            let reqData = {
                data: {
                    body: {
                        fuzzyContent: name,
                    },
                    currentPage: 1,
                    pageSize: 10000,
                },
                op: 'selectGroupMemberByUserIds',
            };
            const URL = self.$getModuleUrl(moduleName, reqData.op);
            return await self.$axios('/web/im/select', reqData)
                .then(result => {
                    if (result.code === 1) {
                        let resData = JSON.parse(result.data);
                        let t = [];
                        if (resData.body.length > 0) {
                            resData.body.map(item => {
                                if(item.matchType === 1){
                                    let o = {
                                        'type': 'selfGroup',
                                        'groupID': item.groupId,
                                        'userID': item.groupId,
                                        'avatar': item.faceUrl || IM.baseInfo.groupAvatar,
                                        'name': item.groupName
                                    }
                                    t.push(o)
                                }
                            })
                        }
                        return t;
                    }
                })
                .catch(error => {
                    console.log('error', error);
                    that.loading = false;
                });
        },
        async handleForWordMessage(list){
            console.log(list)
            const self = this;
            list.map(item => {
                let to = '';
                let toConversationID = '';
                switch (item.type) {
                    case IM.TIM.TYPES.CONV_C2C:
                        to = item?.userProfile?.userID || '';
                        toConversationID = 'C2C' + to
                        break;
                    case IM.TIM.TYPES.CONV_GROUP:
                        to = item?.groupProfile?.groupID || '';
                        toConversationID = 'GROUP' + to
                        break;
                    case 'selfGroup':
                        to = item?.groupID || '';
                        toConversationID = 'GROUP' + to
                        item.type = 'GROUP'
                        break;
                    default:
                        to = item.userID;
                        toConversationID = 'C2C' + to
                        item.type = 'C2C'
                        break;
                }
                console.log(to)
                console.log(toConversationID)
                let message = IM.createForwardMessage({
                    to,
                    conversationType: item.type,
                    message: self.forwarMessage
                })
                IM.sendMessage(message)
                .then(function(imResponse){
                    if(toConversationID === self.chatConversationID){
                        self.$store.commit("im/UPDATE_FORWARDMESSAGE", imResponse.data.message)
                    }
                }).catch(function(error){
                    console.log(error)
                });
            })
            self.cancel()
        },
        handleAvatar(item) {
            const self = this;
            let avatar = '';
            switch (item.type) {
                case IM.TIM.TYPES.CONV_C2C:
                    avatar = self.isUrl(item?.userProfile?.avatar)
                    ? item?.userProfile?.avatar
                    : 1;
                break;
                case IM.TIM.TYPES.CONV_GROUP:
                    avatar = self.isUrl(item?.groupProfile?.avatar)
                    ? item?.groupProfile?.avatar
                    : IM.baseInfo.groupAvatar;
                break;
                case 'ADDUSER':
                    avatar = 1
                break;
                case 'selfGroup':
                    avatar = item.avatar
                break;
            }
            return avatar;
        },
        handleName(item) {
            let name = '';
            switch (item.type) {
                case IM.TIM.TYPES.CONV_C2C:
                    name = item?.userProfile.nick || item?.userProfile?.userID || '';
                break;
                case IM.TIM.TYPES.CONV_GROUP:
                    name = item.groupProfile.name || item?.groupProfile?.groupID || '';
                break;
                case 'ADDUSER':
                    name = item.nick
                break;
                case 'selfGroup':
                    name = item.name
                break;
            }
            return name;
        },
        isUrl(url) {
            return /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(url);
        },
        cancel(){
            this.$emit('update:showForwar', false)
        }
    }
}
</script>
<style scoped>
.main .list-item .avatar{
    margin: 0 !important;
}
</style>