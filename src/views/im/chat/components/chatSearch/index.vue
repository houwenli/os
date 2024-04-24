<template>
    <div>
        <el-dialog title="聊天记录" :visible.sync="visible" :before-close="close" width="1140px">
            <div class="ordinary">
                <div class="content-wrap">
                    <div v-if="conversation.type === 'C2C'" style="display: flex;align-items: center;justify-content: center;margin-bottom: 16px;">
                        <head-img 
                            :imgUrl="conversation.userProfile.avatar !== undefined ? conversation.userProfile.avatar : ''" 
                            :headName="conversation.userProfile.nick || conversation.userProfile.userID" 
                            style="width: 24px;height: 24px">
                        </head-img>
                        <span style="margin-left: 8px;">{{ conversation.userProfile.nick }}</span>
                    </div>
                    <div class="content-row">
                        <div class="content-top">
                            <div class="con1 con2">
                                <!-- <img src="../../../../../assets/images/chat/icon_search.png" alt="" class="img1" /> -->
                                <el-input placeholder="请填写搜索内容" class="ipt" v-model="params.fuzzyContent" @input="handleInput" prefix-icon="el-icon-search"></el-input>
                            </div>
                        </div>
                        <div class="content-bottom">
                            <div class="grid-content bg-purple">
                                <div class="bg_top">
                                    <el-tabs v-model="activeName" @tab-click="handleTabClick">
                                        <el-tab-pane label="全部" name="all"></el-tab-pane>
                                        <el-tab-pane label="文件" name="TIMFileElem"></el-tab-pane>
                                        <el-tab-pane label="图片或视频" name="TIMImageElem"></el-tab-pane>
                                        <!-- <el-tab-pane label="链接" name="TIMTextElem"></el-tab-pane> -->
                                        <div
                                            class="all"
                                            style="overflow: auto"
                                            v-infinite-scroll="loadData"
                                            :infinite-scroll-disabled="disabledLoad"
                                            :infinite-scroll-delay="200"
                                            :infinite-scroll-distance="30"
                                            :infinite-scroll-immediate="true"
                                            v-loading="loading"
                                        >
                                            <searchItem ref="searchItem" :msgType="activeName" :chatData="findHistoryChatMsgArray" :searchWord="params.fuzzyContent"></searchItem>
                                        </div>
                                    </el-tabs>
                                </div>
                            </div>
                            <div v-if="conversation.type === 'GROUP'" class="grid-content bg-purple-light">
                                <div class="text">添加筛选条件</div>
                                <div class="member flex-box">
                                    <label>群成员：</label>
                                    <div class="chooseMember" @click="send">
                                        <div class="el-input__inner" v-if="checkedMember.length === 0">点击选择</div>
                                        <el-tag v-for="tag in checkedMember" :key="tag.nick" type="info">
                                            {{ tag.nick }}
                                        </el-tag>
                                    </div>
                                </div>
                                <div class="data">
                                    <div class="flex-box">
                                        <label>开始日期：</label>
                                        <el-date-picker
                                            v-model="params.createTimeStartStamp"
                                            type="date"
                                            default-time="00:00:00"
                                            placeholder="开始：点击选择"
                                            :picker-options="startPickerOptions"
                                            @change="handleTimeChange($event, 'start')"
                                        ></el-date-picker>
                                    </div>
                                    <div class="flex-box">
                                        <label>截止日期：</label>
                                        <el-date-picker
                                            v-model="params.createTimeEndStamp"
                                            :picker-options="endPickerOptions"
                                            default-time="23:59:59"
                                            type="date"
                                            placeholder="截止：点击选择"
                                            @change="handleTimeChange($event, 'end')"
                                        ></el-date-picker>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 选择群成员 -->
        <selectUser ref="selectUser" :visible.sync="selectUserVisible" :userList="userList" @success="sureMember"></selectUser>
    </div>
</template>

<script>
import searchItem from './searchItem';
import selectUser from './selectUser';
import HeadImg from '../headImg'
export default {
    name: 'chatSearch',
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        conversation: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            op: {
                findHistoryChatMsg: 'findHistoryChatMsg',
            },
            params: {
                chatId: '',
                fuzzyContent: '',
                msgFormat: '',
                userIds: [],
                fromId: '',
                toId: '',
                createTimeStartStamp: '',
                createTimeEndStamp: '',
            },
            group: '',
            activeName: 'all',
            startPickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
            endPickerOptions: {
                _target: () => this,
                disabledDate: time => {
                    return this.disabledTime(time);
                },
            },
            loading: false,
            currentPage: 0,
            pageSize: 10,
            total: 20,
            disabledLoad: true,

            // 新增人参数
            findHistoryChatMsgArray: [],
            sendPeople: false,
            checkedMember: [],
            userList: [],
            userNumber: '',
            selectUserVisible: false,
        };
    },
    components: {
        searchItem,
        selectUser,
        HeadImg
    },
    computed: {
        noMore() {
            return this.detailData && this.detailData.count === 0;
        },
    },
    watch: {
        visible: {
            handler(newVal) {
                if (newVal == true) {
                    this.findHistoryChatMsgArray = [];
                    this.getChatList();
                }
            },
        },
        chatConversationID: {
            handler(newVal) {
            },
        },
        conversation: {
            handler(newVal) {
            },
            deep: true,
            immediate: true,
        },
    },
    mounted() {
        this.searchContent();
        this.userList = this.$store.state.im.baseGroupUserList.groupAllUserList;
        this.userNumber = this.userList.length || 0;

    },
    methods: {
        disabledTime(time) {
            if (this.params.createTimeStartStamp) {
                return time.getTime() < new Date(this.params.createTimeStartStamp).getTime();
            } else {
                return time.getTime() > Date.now() - 8.64e7; // 加- 8.64e7则表示包当天
            }
        },
        handleTimeChange(e, type) {
            if (type === 'start') {
                this.params.createTimeStartStamp = e ? this.timestampToTime(e) : null;
            } else {
                this.params.createTimeEndStamp = e ? this.timestampToTime(e, '23:59:59') : null;
            }
            this.searchContent();
        },
        sureMember(userIds, userList) {
            this.checkedMember = userList;
            this.params.userIds = userIds;
            this.searchContent();
        },
        getChatList() {
            let that = this;
            let IMUserInfo = JSON.parse(sessionStorage.getItem('IMUserInfo'));
            this.loading = true;
            this.currentPage++;
            this.disabledLoad = false;
            let arrayLengh = this.findHistoryChatMsgArray.length;
            // 判断类型
            let allMsgFormats = ['TIMTextElem', 'TIMLocationElem', 'TIMFaceElem', 'TIMCustomElem', 'TIMSoundElem', 'TIMImageElem', 'TIMFileElem', 'TIMVideoFileElem'];
            let msgFormats;
            let activeName = this.activeName;
            if (activeName === 'all') {
                msgFormats = allMsgFormats;
            } else if (activeName === 'TIMImageElem') {
                msgFormats = ['TIMImageElem', 'TIMVideoFileElem'];
            } else {
                msgFormats = [activeName];
            }
            // const url = this.getModuleUrl(this.op.historyMsgList);
            const url = '/web/im/select';
            let data = {
                fuzzyContext: this.params.fuzzyContent,
                nextId: arrayLengh > 0 ? this.findHistoryChatMsgArray[arrayLengh - 1].id : null,
                chatId: this.conversation.groupProfile ? this.conversation.groupProfile.groupID : null,
                fromId: this.conversation.userProfile ? IMUserInfo.userID : null,
                toId: this.conversation.userProfile ? this.conversation.userProfile.userID : null,
                msgFormats: msgFormats,
                userIds: this.params.userIds,
                createTimeStartStamp: this.params.createTimeStartStamp ? (new Date(this.params.createTimeStartStamp).getTime())/1000 : null,
                createTimeEndStamp: this.params.createTimeEndStamp ? (new Date(this.params.createTimeEndStamp).getTime())/1000 : null,
            };
            const reqData = {
                data: {
                    body: data,
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                },
                op: 'findHistoryChatMsg',
            };
            let tempArray = [];
            this.$axios(url, reqData)
                .then(result => {
                    this.loading = false;
                    if (result.code === 1) {
                        let resData = JSON.parse(result.data);
                        console.log('返回数据', resData);
                        if (resData.body.length === 0) {
                            this.disabledLoad = true;
                        }
                        if (resData && resData != undefined) {
                            tempArray.push(resData.body);
                            this.findHistoryChatMsgArray = this.findHistoryChatMsgArray.concat(tempArray.flat(Infinity)) || [];
                        }
                    }
                })
                .catch(error => {
                    that.loading = false;
                });
        },
        loadData() {
            this.getChatList();
        },
        handleInput(name) {
            let that = this;
            let timer;
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                that.inputFn(name);
            }, 800);
        },
        inputFn() {
            this.searchContent();
        },
        handleTabClick(e) {
            this.searchContent();
        },
        searchContent() {
            this.loading = false;
            this.currentPage = 0;
            this.findHistoryChatMsgArray = [];
            this.getChatList();
            window.scrollTo(0, 0);
        },
        back(type) {
            let { query } = this.$route;
            this.$router.push({
                path: this.prePageName,
                query: { refresh: type, ...query },
            });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        close() {
            this.params.fuzzyContent = '';
            this.findHistoryChatMsgArray = [];
            this.$emit('update:visible', false);
        },
        // 选择人群
        send() {
            this.selectUserVisible = true;
        },
        cancel() {
            this.selectUserVisible = false;
        },
        timestampToTime(cellValue, hhmmss = '00:00:00') {
            if (cellValue == null || cellValue == '') return '';
            let date = new Date(cellValue);
            let year = date.getFullYear();
            let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
            let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            // let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
            // let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
            // let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            return year + '-' + month + '-' + day + ' ' + hhmmss;
        },
    },
};
</script>

<style lang="scss" scoped>
.ordinary {
    .content-wrap {
        padding: 40px 24px 24px;
        .content-row {
            width: 100%;
            // min-height: 600px;
            border-radius: 8px;
        }
        .content-top {
            width: 100%;
            border-bottom: 1px solid #dcdfe6;
            .con1 {
                display: flex;
                justify-content: center;
                margin-bottom: 16px;
                img {
                    width: 40px;
                    height: 40px;
                }
                .text {
                    font-size: 18px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #303133;
                    line-height: 18px;
                    margin-left: 10px;
                    padding-top: 10px;
                }
            }
            .con2 {
                position: relative;
                display: flex;
                .img1 {
                    width: 16px;
                    height: 16px;
                    position: absolute;
                    left: 30px;
                    z-index: 30;
                    top: 12px;
                }
                .ipt {
                    /deep/ .el-input__inner {
                        padding-left: 30px !important;
                        padding-right: 30px !important;
                        height: 40px;
                        line-height: 40px;
                    }
                }
                .img2 {
                    width: 16px;
                    height: 16px;
                    position: absolute;
                    right: 30px;
                    z-index: 40;
                    top: 12px;
                }
            }
        }
        .content-bottom {
            box-sizing: border-box;
            // padding: 0px 20px;
            display: flex;
            flex-direction: row;
        }
    }
}

.all {
    padding: 12px 16px 16px;
    height: 464px;
    background: #f5f7fa;
}
.grid-content {
    min-height: 495px;
}
/deep/ .el-tabs__nav-wrap::after {
    width: 0;
}
.bg-purple {
    height: 500px;
    overflow: hidden;
    // background: #f5f7fa;
    display: flex;
    flex-direction: column;
    flex: 1;
    .bg_top {
        width: 100%;
        height: 40px;
        background: #fff;
        /deep/.el-tabs__header{
            margin: 0 !important;
        }
    }
    /deep/.el-tabs__active-bar{
        width: 0 !important;
    }
}
.bg-purple-light {
    width: 388px;
    padding-left: 24px;
    .flex-box {
        display: flex;
        flex-direction: row;
        align-items: center;
        & > div {
            flex: 1;
            height: 36px;
            line-height: 36px;
            background: #FFFFFF;
            border-radius: 4px;
            border: 1px solid #DCDFE6;
        }
        label {
            width: 70px;
            text-align: right;
            font-size: 14px;
        }
    }
    .text {
        line-height: 40px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #606266;
    }
    .member {
        .el-input__inner {
            border: 0 !important;
            width: 100%;
            height: 32px;
            line-height: 32px;
            border-radius: 4px;
            padding-left: 10px;
            cursor: pointer;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #c0c4cc;
        }
    }
    .data {
        .flex-box {
            margin-top: 16px;
        }
        /deep/.el-input__inner {
            border: 0 !important;
            height: 32px;
            line-height: 32px;
            border-radius: 4px;
            padding-left: 10px;
            cursor: pointer;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #c0c4cc;
        }
        /deep/ .el-date-editor {
            width: 100% !important;
        }
        /deep/ .el-input__prefix {
            display: none;
        }
    }
}
/deep/ .el-dialog__body {
    padding: 0px;
}
/deep/ .el-dialog__header {
    padding-bottom: 0;
}
/deep/ .el-dialog__title {
    font-size: 18px;
    font-weight: 500;
    color: #303133;
    line-height: 18px;
}
/deep/ .el-dialog__wrapper {
    border-radius: 8px;
}
.center {
    display: flex;
    justify-content: center;
    padding-top: 15px;
}
/depp/ .el-autocomplete-suggestion {
    color: red !important;
    width: 1000px !important;
    div.el-scrollbar {
        width: 368px;
        height: 398px;
        overflow: auto;
    }
}

</style>
