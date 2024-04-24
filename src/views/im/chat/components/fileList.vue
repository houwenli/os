<template>
    <div>
        <!-- <div class="head-box">
            <el-checkbox v-model="checked" @change="checkedAll($event)">全选</el-checkbox>
            <span @click="download()">下载</span>
            <span @click="forward()">转发</span>
            <span @click="del()" class="del">删除</span>
        </div> -->
        <ul>
            <li class="drawer_fileListBox" v-for="(item, index) in list" :key="index" @click="selectItem(item)">
                <div style="display: flex;flex-direction: row;">
                    <div style="display: flex;flex: 1;overflow: hidden;">
                        <!-- <i :class="selectedList.indexOf(item) > -1 ? 'el-icon-circle-check': 'el-icon-chat-round'"></i> -->
                        <img style="width: 48px;height: 48px;margin-right: 12px;"  src="../image/icon_bule_file.png" />
                        <div style="margin-top: 2px;overflow: hidden;">
                            <p class="file_name">{{getMsgContext(item, 'FileName')}}</p>
                            <p class="file_label">{{getMsgContext(item, 'FileSize') | fileSizeFilters}} {{getTime(item.msgTime)}} {{item.fromName || item.fromId}}</p>
                        </div>
                    </div>
                    <div class="file_icon_box">
                        <span @click="download(item)"><img src="../image/icon_hischat_down.png"></span>
                        <!-- <span @click="forward(item)"><img src="../image/icon_hischat_share.png"></span>
                        <span @click="del(item)"><img src="../image/icon_hischart_del.png"></span> -->
                    </div>
                </div>
                <el-progress v-if="showDownID == item.msgKey" :percentage="percentageNum" :show-text="false" :stroke-width="2" :color="'#F05259'"></el-progress>
                <!-- <el-progress style="flex: 1;" :percentage="percentageNum" :show-text="false" :stroke-width="2" :color="'#F05259'"></el-progress> -->
            </li>
        </ul>
    </div>
</template>
<script>
import IM from '../../../../utils/tim/tim'
export default {
    props: {
        conversation: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            moduleName: '/chat',
            op: {
                findHistoryChatMsg: 'findHistoryChatMsg'
            },
            list: [],
            checked: false,
            selectedList: [],

            showDownID: '',
            receivedLength: 0, // 下载进度
            fileAllSize: 0, // 总进度
            percentageNum: 0,
        }
    },
    filters: {
        // 换算文件大小
        fileSizeFilters: function (value) {
            value = value*1
            if(value > 1024 * 1024){
                value = (value / 1024 / 1024).toFixed(0) + 'MB'
            }else if(value > 1024){
                value = (value / 1024).toFixed(0) + 'KB'
            }else{
                value += 'KB'
            }
            return value
        }
    },
    watch: {
        receivedLength: function(newV){
            const self = this;
            if(newV){
                let t = Math.round((newV / self.fileAllSize) * 100);
                self.percentageNum = t;
            }
        }
    },
    mounted(){
        this.getFileList()
    },
    methods: {
        getTime(msgTime){
            msgTime = msgTime * 1000
            return this.$baseMethod.formatData(msgTime)
        },
        // del(item){
        //     item = item || this.selectedList[0]
        //     this.$store.commit('im/UPDATE_MESSAGEOPERATION', {
        //         operationType: 2,
        //     })
        // },
        // forward(item){
        //     item = item || this.selectedList[0]
        //     this.$store.commit('im/UPDATE_MESSAGEOPERATION', {
        //         operationType: 1,
        //     })
        // },
        download(item){
            let self = this;
            self.showDownID = item.msgKey;
            item = item || this.selectedList[0]
            let Obj = JSON.parse(item.msgContext)
            self.fileAllSize = Obj.FileSize;
            // 下载文件
            const file = {
                fileName: Obj.FileName,
                fileUrl: Obj.Url
            };
            const option = {
                mode: 'cors',
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded',
                }),
            };
            // 浏览器支持fetch则用blob下载，避免浏览器点击a标签，跳转到新页面预览的行为
            if (window.fetch) {
                self.receivedLength = 0; // 当前接收到了这么多字节
                let chunks = []; // 接收到的二进制块的数组（包括 body）
                fetch(file.fileUrl, option)
                .then(response => {
                    let reader = response.body.getReader();
                    reader.read().then(function processResult(result) {
                        if (result.done) {
                            let blob = new Blob(chunks);
                            const a = document.createElement('a');
                            const url = window.URL.createObjectURL(blob);
                            a.href = url;
                            a.download = file.fileName;
                            a.click();
                            self.showDownID = '';
                            return false;
                        }
                        chunks.push(result.value);
                        self.receivedLength += result.value.length;
                        // console.log('receivedLength', self.receivedLength)
                        return reader.read().then(processResult)
                    });
                })
            } else {
                const a = document.createElement('a');
                a.href = file.fileUrl;
                a.target = '_blank';
                a.download = file.fileName;
                a.click();
            }
        },
        selectItem(item){
            const index = this.selectedList.indexOf(item);
            if (index > -1) {
                this.selectedList.splice(index, 1);
            }else{
                this.selectedList.push(item);
            }
            if(this.selectedList.length === this.list.length){
                this.checked = true;
            }else{
                this.checked = false;
            }
        },
        checkedAll(v){
            if(v){
                this.selectedList = [...this.list];
            }else{
                this.selectedList = []
            }
        },
        getMsgContext(item, name){
            let obj = JSON.parse(item.msgContext)
            let t = obj[name];
            return t
        },
        getFileList(){
            const self = this;
            let {
                conversationID
            } = self.conversation;
            let chatType = self.conversation.type === 'C2C' ? 'C' : ''
            let chatId = IM.disConversationID({conversationID, chatType})
            const op = self.op.findHistoryChatMsg;
            let data = {
                data: {
                    pageSize: 10000,
                    body: {
                        msgFormats: ['TIMFileElem']
                    }
                },
                op,
            };
            if(chatType === 'C'){
                let IMUserInfo = this.$baseMethod.getStore('IMUserInfo')
                data.data.body = { ...data.data.body, ...{
                    fromId: IMUserInfo.userID,
                    toId: self.conversation.userProfile.userID,
                }}
            }else{
                data.data.body = { ...data.data.body, ...{
                    chatId,
                }}
            }
            let URL = self.$getModuleUrl(self.moduleName, op);
            this.$axios(URL, data).then((res) => {
                if (res.code == 1) {
                    const ret = JSON.parse(res.data);
                    self.list = [];
                    self.list = ret.body;
                }
            });
        }
    }
}
</script>
<style scoped lang="scss">
.drawer_fileListBox{
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    flex-direction: column;
    .file_name {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 600;
        color: #606266;
        line-height: 20px;
        word-break: break-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .file_label {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #C0C4CC;
        line-height: 17px;
        margin-top: 2px;
    }
    .file_icon_box {
        cursor: pointer;
        display: flex;
        align-items: center;
        img {
            width: 16px;
            height: 16px;
            margin-left: 16px;
        }
    }
}
</style>