<template>
    <div>
        <div v-if="msgType === 'all'">
            <!-- 联系人模块 -->
            <div class="module" v-if="formData.selectFriendGroupListArray && formData.selectFriendGroupListArray.length > 0">
                <div class="moduleTitle">联系人</div>
                <div v-for="(item, index) in formData.selectFriendGroupListArray.slice(0, 3)" :key="index" @click="getConversationProfile(item.id)">
                    <div class="all_con">
                        <div class="all_left">
                            <div class="nameIcon" v-if="item.imagePath">
                                <img :src="item.imagePath ? item.imagePath : head_user" alt="" />
                            </div>
                            <div class="nameIcon text" v-else>
                                {{ item.name.slice(0, 1) }}
                            </div>
                            <div class="p_box">
                                <p class="p_text p_name">{{ item.name }}</p>
                                <p class="p_text">{{ item.positionName }}</p>
                                <p>{{ item.deptFullName }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="formData.selectFriendGroupListArray.length > 3" class="moduleLink" @click="jumpTab('selectFriendGroupList')">查看更多联系人</div>
            </div>
            <!-- 群组模块 -->
            <div class="module" v-if="formData.selectGroupMemberByUserIdsArray && formData.selectGroupMemberByUserIdsArray.length > 0">
                <div class="moduleTitle">群组</div>
                <div v-for="(item, index) in formData.selectGroupMemberByUserIdsArray.slice(0, 3)" :key="index" @click="getConversationProfile(item.groupId, 'GROUP')">
                    <div class="all_con">
                        <div class="all_left">
                            <div class="nameIcon" v-if="item.faceUrl">
                                <img :src="item.faceUrl" alt="" />
                            </div>
                            <div class="nameIcon text" v-else>
                                <img :src="groupAvatar" alt="" />
                            </div>
                            <div class="p_box">
                                <div class="p_text p_name">
                                    <p v-html="changekeyWord(item.groupName)"></p>
                                    <p style="margin-left: 10px">({{ item.memberNum }})</p>
                                </div>
                                <div class="p_users" v-if="item.matchType === 2">
                                    <p>包含:</p>
                                    <p v-html="changekeyWord(item.userNames.join('、'))"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="formData.selectGroupMemberByUserIdsArray.length > 3" class="moduleLink" @click="jumpTab('selectGroupMemberByUserIds')">查看更多相关群组</div>
            </div>
            <!-- 聊天记录模块 -->
            <div class="module" v-if="formData.findHistoryChatMsgArray && formData.findHistoryChatMsgArray.length > 0">
                <div class="moduleTitle">聊天记录</div>
                <div v-for="(item, index) in formData.findHistoryChatMsgArray.slice(0, 3)" :key="index" @click="toConversation(item)">
                    <div class="all_con">
                        <div class="all_left">
                            <div class="nameIcon" v-if="item.imagePath">
                                <img :src="item.imagePath ? item.imagePath : head_user" alt="" />
                            </div>
                            <div class="nameIcon text" v-else>
                                {{ item.groupName.slice(0, 1) }}
                            </div>
                            <div class="p_box">
                                <div class="p_title_box">
                                    <p class="p_text p_name" v-if="item.fromName">{{ item.fromName }}</p>
                                    <p v-if="(item.groupName || item.toName) && item.fromName" style="padding-top: 5px;">></p>
                                    <p class="p_text p_name">{{ item.groupName ? item.groupName : item.toName }}</p>
                                    <p class="p_time">{{ getNowTime(item.msgTime) }}</p>
                                </div>
                                <p class="textEle" v-html="changekeyWord(item.msgContext)"></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="formData.findHistoryChatMsgArray.length > 3" class="moduleLink" @click="jumpTab('findHistoryChatMsg')">查看更多聊天记录</div>
            </div>
        </div>

        <!-- 聊天记录 -->
        <div v-if="msgType === 'findHistoryChatMsg'">
            <div v-for="(item, index) in formData.findHistoryChatMsgArray" :key="index" @click="toConversation(item)">
                <div class="all_con">
                    <div class="all_left">
                        <div class="nameIcon" v-if="item.imagePath">
                            <img :src="item.imagePath ? item.imagePath : head_user" alt="" />
                        </div>
                        <div class="nameIcon text" v-else>
                            {{ item.groupName.slice(0, 1) }}
                        </div>
                        <div class="p_box">
                            <div class="p_title_box">
                                <p class="p_text p_name" v-if="item.fromName">{{ item.fromName }}</p>
                                <p style="margin: 0 5px" v-if="(item.groupName || item.toName) && item.fromName">></p>
                                <p class="p_text p_name">{{ item.groupName ? item.groupName : item.toName }}</p>
                                <p class="p_time">{{ getNowTime(item.msgTime) }}</p>
                            </div>
                            <span class="textEle" v-html="changekeyWord(item.msgContext)"></span>
                        </div>
                    </div>
                </div>
            </div>
            <p v-if="formData.findHistoryChatMsgArray && formData.findHistoryChatMsgArray.length == 0" class="center">没有找到相关记录</p>
            <p v-if="noMoreFindHistoryChatMsg && formData.findHistoryChatMsgArray && formData.findHistoryChatMsgArray.length != 0" class="center">没有更多了</p>
        </div>
        <!-- 群组 -->
        <div v-if="msgType === 'selectGroupMemberByUserIds'">
            <div v-for="(item, index) in formData.selectGroupMemberByUserIdsArray" :key="index" @click="getConversationProfile(item.groupId, 'GROUP')">
                <div class="all_con">
                    <div class="all_left">
                        <div class="nameIcon" v-if="item.faceUrl">
                            <img :src="item.faceUrl" alt="" />
                        </div>
                        <div class="nameIcon text" v-else>
                            <img :src="groupAvatar" alt="" />
                        </div>
                        <div class="p_box">
                            <div class="p_text p_name">
                                <p v-html="changekeyWord(item.groupName)"></p>
                                <p style="margin-left: 10px">({{ item.memberNum }})</p>
                            </div>
                            <div class="p_users" v-if="item.matchType === 2">
                                <p>包含:</p>
                                <p v-html="changekeyWord(item.userNames.join('、'))"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p v-if="formData.selectGroupMemberByUserIdsArray && formData.selectGroupMemberByUserIdsArray.length == 0" class="center">没有找到相关记录</p>
            <p v-if="noMoreSelectGroupMemberByUserIds && formData.selectGroupMemberByUserIdsArray && formData.selectGroupMemberByUserIdsArray.length != 0" class="center">没有更多了</p>
        </div>
        <!-- 联系人 -->
        <div v-if="msgType === 'selectFriendGroupList'">
            <div v-for="(item, index) in formData.selectFriendGroupListArray" :key="index" @click="getConversationProfile(item.id)">
                <div class="all_con">
                    <div class="all_left">
                        <div class="nameIcon" v-if="item.imagePath">
                            <img :src="item.imagePath ? item.imagePath : head_user" alt="" />
                        </div>
                        <div class="nameIcon text" v-else>
                            {{ item.name.slice(0, 1) }}
                        </div>
                        <div class="p_box">
                            <p class="p_text p_name">{{ item.name }}</p>
                            <p class="p_text">{{ item.positionName }}</p>
                            <p>{{ item.deptFullName }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <p v-if="formData.selectFriendGroupListArray && formData.selectFriendGroupListArray.length == 0" class="center">没有找到相关记录</p>
            <p v-if="noMoreSelectFriendGroupList && formData.selectFriendGroupListArray && formData.selectFriendGroupListArray.length != 0" class="center">没有更多了</p>
        </div>
    </div>
</template>
<script>
import head_user from '@/assets/images/chat/head_user.png';
import IM from '../../../../utils/tim/tim';
export default {
    name: 'searchItem',
    props: {
        chatData: {
            type: Array,
            default: () => [],
        },
        msgType: {
            type: String,
            default: '',
        },
        findHistoryChatMsgArray: {
            type: Array,
            default: () => [],
        },
        selectGroupMemberByUserIdsArray: {
            type: Array,
            default: () => [],
        },
        selectFriendGroupListArray: {
            type: Array,
            default: () => [],
        },
        searchWord: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            head_user,
            timer: null,
            formData: {
                findHistoryChatMsgArray: [],
                selectGroupMemberByUserIdsArray: [],
                selectFriendGroupListArray: [],
            },
            groupAvatar: IM.baseInfo.groupAvatar,
        };
    },
    watch: {
        findHistoryChatMsgArray: {
            handler(newVal) {
                if (newVal && newVal != undefined) {
                    this.formData.findHistoryChatMsgArray = newVal;
                }
            },
            deep: true,
            immediate: true,
        },
        selectFriendGroupListArray: {
            handler(newVal) {
                if (newVal && newVal != undefined) {
                    this.formData.selectFriendGroupListArray = newVal;
                }
            },
            deep: true,
            immediate: true,
        },
        selectGroupMemberByUserIdsArray: {
            handler(newVal) {
                if (newVal && newVal != undefined) {
                    this.formData.selectGroupMemberByUserIdsArray = newVal;
                }
            },
            deep: true,
            immediate: true,
        },
    },
    computed: {
        noMoreFindHistoryChatMsg() {
            return this.detailData && this.detailData.count === 0;
        },
        noMoreSelectFriendGroupList() {
            return this.detailData && this.detailData.count === 0;
        },
        noMoreSelectGroupMemberByUserIds() {
            return this.detailData && this.detailData.count === 0;
        },
    },
    methods: {
        // 聊天记录跳转会话
        toConversation(item){
            let type = item.groupId.substring(0,5)
            if(type === '200-1'){
                let index = this.findStr(item.groupId, 'wsstore_', 1)
                let id = item.groupId.substring(index, item.groupId.length)
                id = id.replace('wsstore_', '') 
                this.getConversationProfile(id)
            }else if(type === '200-5'){
                this.getConversationProfile(item.groupId, 'GROUP')
            }
        },
        findStr(str, cha, num){
            let x = str.indexOf(cha);
            for(var i=0; i<num; i++){
                x = str.indexOf(cha,x+1);
            }
            return x;
        },
        // 跳转会话
        getConversationProfile(id, type = 'C2C') {
            const self = this;
            IM.getConversationProfile({ id, type })
                .then(function (imResponse) {
                    self.$emit('close');
                    // 获取成功
                    IM.handleCurrentConversation(self, true, imResponse.data.conversation);
                })
                .catch(function (imError) {
                    console.warn('getConversationProfile error:', imError); // 获取会话资料失败的相关信息
                });
        },
        getNowTime(cellValue) {
            if (cellValue == null || cellValue == '') return '';
            let date = new Date(cellValue * 1000);
            let year = date.getFullYear();
            let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
            let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
            let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
            let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        },
        jumpTab(msgType) {
            this.$emit('jumpTab', msgType);
        },
        changekeyWord(word) {
            if (word.includes(this.searchWord)) {
                let replaceReg = new RegExp(this.searchWord, 'g');
                let replaceString = '<font style="color:#0088FF!important;">' + this.searchWord + '</font>';
                word = word.replace(replaceReg, replaceString);
                return word;
            } else {
                return word;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.all_con {
    margin-top: 4px;
    min-height: 80px;
    width: 100%;
    background: #ffffff;
    border-radius: 4px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    position: relative;
    .all_left {
        display: flex;
        align-items: center;
        .nameIcon {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .text {
            border: 1px border #0088ff;
            background: #0088ff;
        }
    }
    .all_right {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #606266;
        line-height: 12px;
    }
}

.module {
    .moduleTitle {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #202f52;
        margin-bottom: 8px;
    }
    .moduleLink {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #0088ff;
        line-height: 20px;
        margin: 8px 0;
        cursor: pointer;
    }
}
.p_box {
    margin-left: 15px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #606266;
    line-height: 12px;
    flex: 1;
    .textEle {
        color: #909399;
        font-size: 14px;
        line-height: 20px;
    }
}
.p_text {
    margin-bottom: 6px;
}
.p_name {
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    display: flex;
    color: #303133;
}
.p_users {
    display: flex;
}

.p_time {
    position: absolute;
    right: 16px;
    color: #909399;
    line-height: 17px;
}

.p_title_box {
    display: flex;
}

.center {
    display: flex;
    justify-content: center;
    padding-top: 15px;
}
</style>
