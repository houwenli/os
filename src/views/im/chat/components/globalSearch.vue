<template>
    <div>
        <el-dialog title="搜索" :visible.sync="visible" :before-close="close" width="1140px">
            <div class="ordinary">
                <div class="content-wrap">
                    <div class="content-row">
                        <div class="content-top">
                            <div class="con1 con2">
                                <!-- <img src="../../../../assets/images/chat/icon_search.png" alt="" class="img1" /> -->
                                <el-input placeholder="请填写搜索内容" class="ipt" v-model="params.fuzzyContent" @input="handleInput" prefix-icon="el-icon-search"></el-input>
                            </div>
                        </div>
                        <div class="content-bottom">
                            <el-row>
                                <el-col :span="24">
                                    <div class="grid-content bg-purple">
                                        <div class="bg_top">
                                            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                                                <el-tab-pane label="综合" name="all"></el-tab-pane>
                                                <el-tab-pane label="联系人" name="selectFriendGroupList"></el-tab-pane>
                                                <el-tab-pane label="群组" name="selectGroupMemberByUserIds"></el-tab-pane>
                                                <el-tab-pane label="聊天记录" name="findHistoryChatMsg"></el-tab-pane>
                                                <div
                                                    class="all"
                                                    style="overflow: auto"
                                                    v-infinite-scroll="loadData"
                                                    :infinite-scroll-disabled="disabledLoad"
                                                    :infinite-scroll-delay="800"
                                                    :infinite-scroll-distance="30"
                                                    :infinite-scroll-immediate="true"
                                                    v-loading="loading"
                                                >
                                                    <searchItem
                                                        ref="searchItem"
                                                        :msgType="activeName"
                                                        :findHistoryChatMsgArray="findHistoryChatMsgArray"
                                                        :selectGroupMemberByUserIdsArray="selectGroupMemberByUserIdsArray"
                                                        :selectFriendGroupListArray="selectFriendGroupListArray"
                                                        :searchWord="params.fuzzyContent"
                                                        @jumpTab="jumpTab"
                                                        @close="close"
                                                    ></searchItem>
                                                </div>
                                            </el-tabs>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import searchItem from './searchItem.vue';
export default {
    name: 'globalSearch',
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            moduleName: '/imsystem/messageManage',
            prePageName: '/imsystem/messageManage/details',
            op: {
                findHistoryChatMsg: 'findHistoryChatMsg',
                selectGroupMemberByUserIds: 'selectGroupMemberByUserIds',
                selectFriendGroupList: 'selectFriendGroupList',
            },
            params: {
                chatId: '',
                fuzzyContent: '', // 聊天记录
                msgFormat: '',
                userIds: [],
            },
            group: '',
            phone: null,
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
            pageSize: 20,
            total: 20,
            detailData: [],
            chatArray: [],
            findHistoryChatMsgArray: [],
            selectGroupMemberByUserIdsArray: [],
            selectFriendGroupListArray: [],
            userNickName: '',
            disabledLoad: true,
        };
    },
    components: {
        searchItem,
    },
    computed: {
        noMore() {
            return this.detailData && this.detailData.count === 0;
        },
        // disabledLoad() {
        //   return this.loading || this.noMore;
        // }
    },
    mounted() {
        // const { chatId } = this.$route.query;
        // this.params.chatId = chatId;
        // (this.params.createTimeStartStamp = this.$baseMethod.formatData(
        //   new Date().getTime() - 3600 * 24 * 30 * 1000,
        //   "yyyy-MM-dd hh:mm:ss"
        // )),
        //   (this.params.createTimeEndStamp = this.$baseMethod.formatData(
        //     new Date().getTime(),
        //     "yyyy-MM-dd hh:mm:ss"
        //   ));
    },
    methods: {
        disabledTime(time) {
            if (this.params.createTimeStartStamp) {
                return time.getTime() < new Date(this.params.createTimeStartStamp).getTime();
            } else {
                return time.getTime() > Date.now() - 8.64e7; // 加- 8.64e7则表示包当天
            }
        },

        getChatList() {
            let that = this;
            this.loading = true;
            this.currentPage++;
            let arrayLengh = this.findHistoryChatMsgArray.length;
            this.disabledLoad = false;
            // const url = this.getModuleUrl(this.op.historyMsgList);
            const url = '/web/im/select';
            let data = {
                fuzzyContext: this.params.fuzzyContent,
                nextId: arrayLengh > 0 ? this.findHistoryChatMsgArray[arrayLengh - 1].id : null,
            };
            const reqData = {
                data: {
                    body: data,
                    currentPage: this.activeName == 'all' ? '1' : this.currentPage,
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
        getGroupMemberList() {
            let that = this;
            this.loading = true;
            this.disabledLoad = false;
            this.currentPage++;
            let arrayLength = this.selectGroupMemberByUserIdsArray.length;
            let data = {
                fuzzyContent: this.params.fuzzyContent,
                groupMemberLastMsgId: arrayLength > 0 ? this.selectGroupMemberByUserIdsArray[arrayLength - 1].groupMemberLastMsgId : null,
            };
            let reqData = {
                data: {
                    body: data,
                    currentPage: this.activeName == 'all' ? '1' : this.currentPage,
                    pageSize: this.pageSize,
                },
                op: 'selectGroupMemberByUserIds',
            };
            let tempArray = [];
            this.$axios('/web/im/select', reqData)
                .then(result => {
                    this.loading = false;
                    if (result.code === 1) {
                        let resData = JSON.parse(result.data);
                        if (resData.body.length === 0) {
                            this.disabledLoad = true;
                        }
                        if (resData && resData != undefined) {
                            tempArray.push(resData.body);
                            this.selectGroupMemberByUserIdsArray = this.selectGroupMemberByUserIdsArray.concat(tempArray.flat(Infinity)) || [];
                        }
                    }
                })
                .catch(error => {
                    console.log('error', error);
                    that.loading = false;
                });
        },
        getFriendList() {
            let that = this;
            this.loading = true;
            this.currentPage++;
            this.disabledLoad = false;
            let reqData = {
                data: {
                    body: { name: this.params.fuzzyContent },
                    currentPage: this.activeName == 'all' ? '1' : this.currentPage,
                    pageSize: this.pageSize,
                },
                op: 'selectEmps',
            };
            let tempArray = [];
            this.$axios('/authority/permission/contacts/select', reqData)
                .then(result => {
                    this.loading = false;
                    if (result.code === 1) {
                        let resData = JSON.parse(result.data);
                        if (resData.length === 0) {
                            this.disabledLoad = true;
                        }
                        if (resData && resData != undefined) {
                            tempArray.push(resData);
                            this.selectFriendGroupListArray = this.selectFriendGroupListArray.concat(tempArray.flat(Infinity)) || [];
                        }
                    }
                })
                .catch(error => {
                    console.log('error', error);
                    that.loading = false;
                });
        },
        loadData() {
            switch (this.activeName) {
                case 'selectGroupMemberByUserIds':
                    this.getGroupMemberList();
                    break;
                case 'findHistoryChatMsg':
                    this.getChatList();
                    break;
                case 'selectFriendGroupList':
                    this.getFriendList();
                    break;
                case 'all':
                    this.getGroupMemberList();
                    this.getChatList();
                    this.getFriendList();
                    break;
                default:
                    console.log('没有匹配到');
                    break;
            }
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
        jumpTab(msgType) {
            this.activeName = msgType;
            this.searchContent();
        },
        handleTabClick(e) {
            this.searchContent();
        },
        searchContent() {
            this.loading = false;
            this.currentPage = 0;
            this.selectGroupMemberByUserIdsArray = [];
            this.findHistoryChatMsgArray = [];
            this.selectFriendGroupListArray = [];
            switch (this.activeName) {
                case 'selectGroupMemberByUserIds':
                    this.getGroupMemberList();
                    break;
                case 'findHistoryChatMsg':
                    this.getChatList();
                    break;
                case 'selectFriendGroupList':
                    this.getFriendList();
                    break;
                case 'all':
                    this.getGroupMemberList();
                    this.getChatList();
                    this.getFriendList();
                    break;
                default:
                    console.log('没有匹配到');
                    break;
            }
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
        querySearch(queryString, cb) {
            var restaurants = this.getMemberList;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            cb(results);
        },
        createFilter(queryString) {
            return restaurant => {
                return restaurant.userName.toLowerCase().indexOf(queryString.toLowerCase()) === 0 || restaurant.phone.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
            };
        },
        handleTagSelect(item) {
            if (!JSON.stringify(this.checkedMember).includes(JSON.stringify(item))) {
                this.checkedMember.push(item);
            }
        },
        close() {
            this.$emit('update:visible', false);
        },
    },
};
</script>

<style lang="scss" scoped>
.ordinary {
    .content-wrap {
        padding: 80px 24px 24px;
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
        }
    }
}

.all {
    padding: 12px 16px 16px;
    height: 464px;
    background: #f5f7fa;
}
.grid-content {
    flex: 1;
    min-height: 495px;
}
/deep/ .el-tabs__nav-wrap::after {
    width: 0;
}
.bg-purple {
    height: 500px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
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
    width: 100%;
    padding: 0 15px;
    .text {
        line-height: 40px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #606266;
    }
    .member {
        padding-top: 10px;
        p {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #606266;
            line-height: 12px;
            margin-bottom: 5px;
        }
        /deep/.el-input__inner {
            width: 100%;
            height: 34px;
            line-height: 34px;
            background: #f5f7fa;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            padding-left: 10px;
            cursor: pointer;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #c0c4cc;
        }
    }
    .data {
        margin-top: 20px;
        p {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #606266;
            line-height: 12px;
            margin-bottom: 5px;
        }
        /deep/.el-input__inner {
            height: 34px;
            line-height: 34px;
            background: #f5f7fa;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
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
