<template>
    <div class="box" ref="main" style="padding-left: 0 !important;padding-bottom: 0 !important;padding-right: 16px !important;border-radius: 0;" v-loading="loading">
        <div class="t_left">
            <div class="seek">
                <el-input placeholder="搜索消息或联系人" v-model="name" @input="cLookup" @focus="focus" clearable></el-input>
            </div>
            <div class="line"></div>
            <div class="t_left_bot">通讯录</div>
            <div class="t_left_list sign" v-if="powerList.selectFriendApplicationRecord" @click.stop="apply" :class="{ active: applySign }">
                <div>
                    <img src="@/assets/icons/apply.png" />
                    <p>好友申请</p>
                </div>
                <div class="count">
                    <p :class="[dataCounts&&dataCounts !== 0 ? 'con':'']" v-if="dataCounts&&dataCounts !== 0">{{ dataCounts }}</p>
                    <img src="@/assets/images/orderMap/iconright.png" />
                </div>
            </div>
            <div class="t_left_list sign" v-if="powerList.selectFriendGroupList" @click.stop="changeF" :class="{ active: firendSign }" style="margin-bottom: 20px">
                <div>
                    <img src="@/assets/icons/friend.png" />
                    <p>我的好友</p>
                </div>
                <div><img src="@/assets/images/orderMap/iconright.png" /></div>
            </div>
            <div class="line"></div>
            <div class="t_left_org">
                <img src="@/assets/logo/logo_small.png" />
                <p>
                    深圳万顺叫车云信息技术有限
                    <br />
                    公司
                </p>
            </div>
            <div class="t_left_line">
                <div class="t_left_orgg sign" v-if="powerList.selectContacts" @click="orgSignChange" :class="{ active: orgSign }">
                    <p>组织架构</p>
                    <img src="@/assets/images/orderMap/iconright.png" />
                </div>
                <div v-if="powerList.selectDeptInfo">
                    <div class="t_left_orgg sign" @click="personChange(item.id, index)" :class="{ active: index == isActive }" v-for="(item, index) in dataMsg" :key="index">
                        <p>{{ item.name }}</p>
                        <img src="@/assets/images/orderMap/iconright.png" />
                    </div>
                </div>
            </div>
        </div>
        <div class="t_right" v-if="t_right" @mousedown.stop="mousedown"></div>
        <div class="t_right_on" v-if="applySign" @mousedown.stop="mousedown">
            <applyList></applyList>
        </div>
        <div class="t_right_on" v-if="firendSign" @mousedown.stop="mousedown">
            <friendList></friendList>
        </div>
        <div class="t_right_on" v-if="orgSign" @mousedown.stop="mousedown">
            <organisation></organisation>
        </div>
        <div class="t_right_on" v-if="orgSign1" @mousedown.stop="mousedown">
            <personInfor :idInfor="idInfor"></personInfor>
        </div>
        <div class="left_position" v-if="chat" @mouseleave="mouseleave" @contextmenu.prevent>
            <div class="topTitle">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="综合" name="all"></el-tab-pane>
                    <el-tab-pane label="联系人" name="linkman"></el-tab-pane>
                    <el-tab-pane label="群组" name="group"></el-tab-pane>
                    <el-tab-pane label="聊天记录" name="chatRecord"></el-tab-pane>
                </el-tabs>
            </div>
            <div
                class="content"
                v-if="activeName == 'all'"
                v-loading="loading"
                v-infinite-scroll="loadData"
                :infinite-scroll-disabled="disabledLoad"
                :infinite-scroll-delay="800"
                :infinite-scroll-distance="30"
                :infinite-scroll-immediate="true"
            >
                <div class="contact" v-if="datacontactsList && datacontactsList.length > 0" style="margin-top: 10px">联系人</div>
                <div class="content_list sign" v-for="(item, index) in datacontactsList.slice(0, 3)" :key="index + 'l'">
                    <div v-if="item.imagePath"><img :src="item.imagePath ? item.imagePath : head_user" alt="" @click="firendChange(item.id)" /></div>
                    <div class="nameIcon" v-else @click="firendChange(item.id)">{{ item.name.slice(0, 1) }}</div>
                    <div class="right_text">
                        <p class="p1" v-html="changekeyWord(item.name)"></p>
                        <p v-if="item.isFriend" class="p2">我的好友</p>
                        <p v-else class="p2">{{ item.deptFullName }}-{{ item.positionName }}</p>
                    </div>
                </div>
                <div class="more sign" @click="moreJump('linkman')" v-if="datacontactsList && datacontactsList.length > 0">
                    <div class="more1">查看更多相关联系人</div>
                    <div class="more2"><img src="@/assets/images/orderMap/iconright.png" /></div>
                </div>
                <div class="t_line" v-if="datacontactsList && datacontactsList.length > 0 && groupList && groupList.length > 0"></div>
                <div class="group" v-if="groupList && groupList.length > 0">我的群组</div>
                <div class="group_list sign" v-for="(item, index) in groupList.slice(0, 3)" :key="index + 'q'" @click="groupJump(item.groupId)">
                    <div class="nameIcon" v-if="item.faceUrl"><img :src="item.faceUrl ? item.faceUrl : groupAvatar" alt="" /></div>
                    <div class="nameIcon" v-else>
                        {{ item.groupName.slice(0, 1) }}
                    </div>
                    <!-- <div class="right_text">
            <div class="p1">张三，李四，王武23王王武王王武</div>
            <span class="p2">(27)</span>
          </div> -->
                    <div class="group_text">
                        <p class="p11" v-html="changekeyWord(item.groupName)"></p>
                        <div class="text_p" v-if="item.userNames ? item.userNames.length > 0 : ''" v-html="changekeyWord(item.userNames.join(','))"></div>
                    </div>
                </div>
                <!-- <p class="center" v-if="groupList && groupList.length == 0">没有找到相关记录</p> -->
                <div class="more sign" v-if="groupList && groupList.length > 0" @click="moreJump('group')">
                    <div class="more1">查看更多相关群组</div>
                    <div class="more2"><img src="@/assets/images/orderMap/iconright.png" /></div>
                </div>
                <div class="t_line" v-if="groupList && groupList.length > 0 && chatArry && chatArry.length > 0"></div>
                <div class="group" @click="moreChat" v-if="chatArry && chatArry.length > 0">聊天记录</div>
                <div class="chat_list sign" v-for="(item, index) in chatArry.slice(0, 3)" :key="index + 'd'">
                    <div v-if="item.imagePath"><img :src="item.imagePath ? item.imagePath : head_user" alt="" /></div>
                    <div class="nameIcon" v-else>
                        {{ item.groupName.slice(0, 1) }}
                    </div>
                    <div class="right_text">
                        <div>
                            <div class="text1" v-if="item.fromName">{{ item.fromName }}></div>
                            <p class="text1">{{ item.groupName ? item.groupName : item.toName }}</p>
                            <span class="text2">{{ getNowTime(item.msgTime) }}</span>
                        </div>
                        <div class="text3" v-html="changekeyWord(item.msgContext)"></div>
                    </div>
                </div>
                <!-- <p class="center" v-if="chatArry && chatArry.length == 0">没有找到相关记录</p> -->
                <div class="more sign" @click="moreJump('chatRecord')" v-if="chatArry && chatArry.length > 0">
                    <div class="more1">查看更多相关聊天记录</div>
                    <div class="more2"><img src="@/assets/images/orderMap/iconright.png" /></div>
                </div>
            </div>
            <div
                class="content"
                v-if="activeName == 'linkman'"
                v-loading="loading"
                v-infinite-scroll="loadData"
                :infinite-scroll-disabled="disabledLoad"
                :infinite-scroll-delay="800"
                :infinite-scroll-distance="30"
                :infinite-scroll-immediate="true"
            >
                <div class="content_list sign" v-for="(item, index) in datacontactsList" :key="index + 'x'">
                    <div v-if="item.imagePath"><img :src="item.imagePath ? item.imagePath : head_user" alt="" @click="firendChange(item.id)" /></div>
                    <div class="nameIcon" v-else @click="firendChange(item.id)">{{ item.name.slice(0, 1) }}</div>
                    <div class="right_text">
                        <div class="p1" v-html="changekeyWord(item.name)"></div>
                        <p v-if="item.isFriend" class="p2">我的好友</p>
                        <p v-else class="p2">{{ item.deptFullName }}-{{ item.positionName }}</p>
                    </div>
                </div>
                <p class="center" v-if="datacontactsList && datacontactsList.length == 0">没有找到相关记录</p>
                <p class="center" v-if="noMoreLimk && datacontactsList && datacontactsList.length > 0">没有更多了~</p>
            </div>
            <div
                class="content"
                v-if="activeName == 'group'"
                v-loading="loading"
                v-infinite-scroll="loadData"
                :infinite-scroll-disabled="disabledLoad"
                :infinite-scroll-delay="800"
                :infinite-scroll-distance="30"
                :infinite-scroll-immediate="true"
            >
                <div class="group_list sign" v-for="(item, index) in groupList" :key="index + 'q'" @click="groupJump(item.groupId)">
                    <div class="nameIcon" v-if="item.faceUrl"><img :src="item.faceUrl ? item.faceUrl : groupAvatar" alt="" /></div>
                    <div class="nameIcon" v-else>
                        {{ item.groupName.slice(0, 1) }}
                    </div>
                    <!-- <div class="right_text">
            <div class="p1">张三，李四，王武23王王武王王武</div>
            <span class="p2">(27)</span>
          </div> -->
                    <div class="group_text">
                        <div class="p11" v-html="changekeyWord(item.groupName)"></div>
                        <div class="text_p" v-if="item.userNames ? item.userNames.length > 0 : ''" v-html="changekeyWord(item.userNames.join(','))"></div>
                    </div>
                </div>
                <p class="center" v-if="groupList && groupList.length == 0">没有找到相关记录</p>
                <p class="center" v-if="noMoreGroup && groupList && groupList.length > 0">没有更多了~</p>
            </div>
            <div
                class="content"
                v-if="activeName == 'chatRecord'"
                v-loading="loading"
                v-infinite-scroll="loadData"
                :infinite-scroll-disabled="disabledLoad"
                :infinite-scroll-delay="800"
                :infinite-scroll-distance="30"
                :infinite-scroll-immediate="true"
            >
                <div class="chat_list sign" v-for="(item, index) in chatArry" :key="index + 'd'">
                    <div v-if="item.imagePath"><img :src="item.imagePath ? item.imagePath : head_user" alt="" /></div>
                    <div class="nameIcon" v-else>
                        {{ item.groupName.slice(0, 1) }}
                    </div>
                    <div class="right_text">
                        <div>
                            <div class="text1" v-if="item.fromName">{{ item.fromName }}></div>
                            <p class="text1">{{ item.groupName ? item.groupName : item.toName }}</p>
                            <span class="text2">{{ getNowTime(item.msgTime) }}</span>
                        </div>
                        <div class="text3" v-html="changekeyWord(item.msgContext)"></div>
                    </div>
                </div>
                <p class="center" v-if="chatArry && chatArry.length == 0">没有找到相关记录</p>
                <p class="center" v-if="noMoreChat && chatArry && chatArry.length > 0">没有更多了~</p>
            </div>
        </div>
        <personMsg :dialogVisible="dialogVisible" @getCancel="getCancel" ref="person" @contextmenu.prevent></personMsg>
    </div>
</template>
 
<script>
import applyList from './components/applyList';
import friendList from './components/friendList';
import organisation from './components/organisation';
import personInfor from './components/personInfor.vue';
import personMsg from './components/personMsg.vue';
import head_user from '@/assets/images/chat/head_user.png';
// import IM from '@/utils/tim/tim';
import IM from '../../../utils/tim/tim'
export default {
    name: '',
    components: {
        applyList,
        friendList,
        organisation,
        personInfor,
        personMsg,
    },
    data() {
        return {
            head_user,
            groupAvatar: IM.baseInfo.groupAvatar,
            moduleName: '/mailList',
            name: '', //用户查找的名字
            loading: false,
            applySign: false,
            t_right: true,
            firendSign: false,
            orgSign: false,
            orgSign1: false,
            activeName: 'all',
            chat: false,
            idInfor: '',
            dialogVisible: false,
            dataCounts: '',
            dataMsg: [],
            currentPage: 1,
            pageSize: 20,
            datacontactsList: [], //联系人
            groupList: [], // 群组
            chatArry: [],
            isClose: false,
            disabledLoad: true,
            noMoreLimk: false,
            noMoreGroup: false,
            noMoreChat: false,
            isActive: -1,
        };
    },
    created() {
        this.applyCount();
        this.orgMessage();
    },
    methods: {
        applyCount() {
            const op = 'selectPendingReviewApplicationCount';
            let data = {
                data: {},
                op,
            };
            let URL = this.$getModuleUrl(this.moduleName, op);
            this.$axios(URL, data).then(res => {
                let data = JSON.parse(res.data);
                this.dataCounts = data;
            });
        },
        orgMessage() {
            const op = 'selectDeptInfo';
            let data = {
                data: {},
                op,
            };
            let URL = this.$getModuleUrl(this.moduleName, op);
            this.$axios(URL, data).then(res => {
                let data = JSON.parse(res.data);
                this.dataMsg = data;
            });
        },
        // 联系人
        contactsList() {
            this.loading = true;
            const op = 'selectEmps';
            let data = {
                data: {
                    body: { name: this.name },
                    currentPage: 1,
                    pageSize: 20,
                },
                op,
            };
            let URL = this.$getModuleUrl(this.moduleName, op);
            this.$axios(URL, data).then(res => {
                this.loading = false;
                let data = JSON.parse(res.data);
                this.datacontactsList = data;
            });
        },
        gpList() {
            this.loading = true;
            const op = 'selectGroupMemberByUserIds';
            let data = {
                data: {
                    body: { fuzzyContent: this.name },
                    currentPage: 1,
                    pageSize: 20,
                },
                op,
            };
            let URL = this.$getModuleUrl(this.moduleName, op);
            this.$axios(URL, data).then(res => {
                this.loading = false;
                let data = JSON.parse(res.data);
                this.groupList = data.body;
            });
        },
        chatList() {
            this.loading = true;
            const op = 'findHistoryChatMsg';
            let data = {
                data: {
                    body: { fuzzyContext: this.name },
                    currentPage: 1,
                    pageSize: 20,
                },
                op,
            };
            let URL = this.$getModuleUrl(this.moduleName, op);
            this.$axios(URL, data).then(res => {
                this.loading = false;
                let data = JSON.parse(res.data);
                this.chatArry = data.body;
            });
        },
        focus() {
            this.chat = true;
        },
        mouseleave() {
            this.isClose = true;
        },
        mousedown() {
            if (this.isClose) {
                this.chat = false;
                this.name = null;
                this.isClose = false;
                (this.datacontactsList = []), //联系人
                    (this.groupList = []), // 群组
                    (this.chatArry = []);
                this.currentPage = 1;
                this.activeName = 'all';
            }
        },
        cLookup(name) {
            let that = this;
            that.inputFn(name);
        },
        inputFn() {
            this.search();
        },
        search() {
            if (this.activeName == 'linkman' && this.name) {
                this.datacontactsList = [];
                this.currentPage = 1;
                this.moreLinkman();
            } else if (this.activeName == 'all' && this.name) {
                this.contactsList();
                this.gpList();
                this.chatList();
            } else if (this.activeName == 'group' && this.name) {
                this.groupList = [];
                this.currentPage = 1;
                this.moreGroup();
            } else if (this.activeName == 'chatRecord' && this.name) {
                this.chatArry = [];
                this.currentPage = 1;
                this.moreChat();
            }
        },
        firendChange(id) {
            this.dialogVisible = true;
            this.$refs.person.mesList(id);
        },
        getCancel() {
            this.dialogVisible = false;
        },
        changekeyWord(word) {
            if (word.includes(this.name)) {
                let replaceReg = new RegExp(this.name, 'g');
                let replaceString = '<font style="color:#0088FF!important;">' + this.name + '</font>';
                word = word.replace(replaceReg, replaceString);
                return word;
            } else {
                return word;
            }
        },
        // 跳转群会话
        groupJump(groupId) {
            console.log(groupId);
            this.$router.push({ path: '/chat' });
            const self = this;
            setTimeout(() => {
                IM.getConversationProfile({ id: groupId, type: 'GROUP' })
                    .then(function (imResponse) {
                        self.$emit('close');
                        // 获取成功
                        IM.handleCurrentConversation(self, true, imResponse.data.conversation);
                    })
                    .catch(function (imError) {
                        console.warn('getConversationProfile error:', imError); // 获取会话资料失败的相关信息
                    });
            }, 1000);
        },
        moreJump(type) {
            this.activeName = type;
            this.search();
        },
        moreLinkman() {
            this.loading = true;
            this.disabledLoad = false;
            const op = 'selectEmps';
            let tempArray = [];
            let data = {
                data: {
                    body: { name: this.name },
                    currentPage: this.currentPage++,
                    pageSize: this.pageSize,
                },
                op,
            };
            let URL = this.$getModuleUrl(this.moduleName, op);
            this.$axios(URL, data).then(res => {
                this.loading = false;
                // let data = JSON.parse(res.data);
                // this.datacontactsList = data;
                if (res.code === 1) {
                    let resData = JSON.parse(res.data);
                    if (resData.length === 0) {
                        this.disabledLoad = true;
                        this.noMoreLimk = true;
                    }
                    if (resData && resData != undefined) {
                        tempArray.push(resData);
                        this.datacontactsList = this.datacontactsList.concat(tempArray.flat(Infinity)) || [];
                    }
                }
            });
        },
        moreGroup() {
            let that = this;
            this.loading = true;
            this.disabledLoad = false;
            let arrayLength = this.groupList.length;
            let data = {
                fuzzyContent: this.name,
                groupMemberLastMsgId: arrayLength > 0 ? this.groupList[arrayLength - 1].groupMemberLastMsgId : null,
            };
            const op = 'selectGroupMemberByUserIds';
            let reqData = {
                data: {
                    body: data,
                    currentPage: this.currentPage++,
                    pageSize: this.pageSize,
                },
                op,
            };
            let tempArray = [];
            let URL = this.$getModuleUrl(this.moduleName, op);
            this.$axios(URL, reqData)
                .then(result => {
                    this.loading = false;
                    if (result.code === 1) {
                        let resData = JSON.parse(result.data);
                        if (resData.body.length === 0) {
                            this.disabledLoad = true;
                            this.noMoreGroup = true;
                        }
                        if (resData && resData != undefined) {
                            tempArray.push(resData.body);
                            this.groupList = this.groupList.concat(tempArray.flat(Infinity)) || [];
                        }
                    }
                })
                .catch(error => {
                    console.log('error', error);
                    that.loading = false;
                });
        },
        moreChat() {
            let that = this;
            this.loading = true;
            let arrayLengh = this.chatArry.length;
            this.disabledLoad = false;
            const op = 'findHistoryChatMsg';
            let data = {
                fuzzyContext: this.name,
                nextId: arrayLengh > 0 ? this.chatArry[arrayLengh - 1].id : null,
            };
            const reqData = {
                data: {
                    body: data,
                    currentPage: this.currentPage++,
                    pageSize: this.pageSize,
                },
                op,
            };
            let URL = this.$getModuleUrl(this.moduleName, op);
            let tempArray = [];
            this.$axios(URL, reqData)
                .then(result => {
                    this.loading = false;
                    if (result.code === 1) {
                        let resData = JSON.parse(result.data);
                        if (resData.body.length === 0) {
                            this.disabledLoad = true;
                            this.noMoreChat = true;
                        }
                        if (resData && resData != undefined) {
                            tempArray.push(resData.body);
                            this.chatArry = this.chatArry.concat(tempArray.flat(Infinity)) || [];
                        }
                    }
                })
                .catch(error => {
                    that.loading = false;
                });
        },
        handleClick() {
            this.search();
        },
        // 分页加载
        loadData() {
            if (this.activeName == 'linkman' && this.name) {
                this.moreLinkman();
            } else if (this.activeName == 'all' && this.name) {
                this.contactsList();
                this.gpList();
                this.chatList();
            } else if (this.activeName == 'group' && this.name) {
                this.moreGroup();
            } else if (this.activeName == 'chatRecord' && this.name) {
                this.moreChat();
            }
        },
        getNowTime(temp) {
            if (!temp) {
                return '';
            }
            var date = new Date(temp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
            var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            return Y + M + D + h + m + s;
        },
        apply() {
            this.isActive = -1;
            this.applySign = true;
            this.firendSign = false;
            this.t_right = false;
            this.orgSign = false;
            this.orgSign1 = false;
        },
        orgSignChange() {
            this.isActive = -1;
            this.orgSign = true;
            this.orgSign1 = false;
            this.applySign = false;
            this.t_right = false;
            this.firendSign = false;
        },
        personChange(id, index) {
            this.idInfor = id;
            this.isActive = index;
            this.orgSign1 = true;
            this.orgSign = false;
            this.applySign = false;
            this.t_right = false;
            this.firendSign = false;
        },
        changeF() {
            this.isActive = -1;
            this.applySign = false;
            this.firendSign = true;
            this.t_right = false;
            this.orgSign1 = false;
            this.orgSign = false;
        },
    },
};
</script>
<style scoped lang="scss" src="./style/index.scss"></style>