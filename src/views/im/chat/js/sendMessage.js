/**
 * 发送信息的方法
 */
import IM from '@/utils/tim/tim';
import { MSG_TYPES } from './utils';
export default {
    //发送消息
    setButton (message) {
        const self = this
        if(self.isSendSuccess){
            return false;
        }
        self.isSendSuccess = true;
        // 图片和文件预加载
        if(message.type == MSG_TYPES.MSG_IMAGE || message.type == MSG_TYPES.MSG_FILE){
            self.hList.messageList = [...self.hList.messageList, ...[message]]
        }
        // 发送消息
        let promise = IM.sendMessage(message);
        promise.then(function (imResponse) {
            self.isSendSuccess = false;
            self.showGroupMemberList = false;
            // 发送成功
            self.textarea = ''
            // self.hList.messageList.push(imResponse.data.message)
            let i = self.hList.messageList.findIndex(({ ID }) => ID === message.ID)
            if(i != -1){
                self.hList.messageList[i] = imResponse.data.message
            }else{
                self.hList.messageList = [...self.hList.messageList, ...[imResponse.data.message]]
            }
            self.below()
        }).catch(function (imError) {
            self.isSendSuccess = false;
            // 发送成功
            self.textarea = '';
            if(imError.message){
                self.$message.warning(imError.message)
                self.textarea = '';
            }
            // 发送失败
            console.warn('sendMessage error:', imError);
        });
    },
    // 发送textarea
    sendText(){
        const self = this
        let cloudCustomData = '';
        let message;
        if (self.textarea.split(" ").join("").length == 0) return this.$message({
            message: '请输入正确信息',
            type: 'warning'
        });
        if(self.showReference){
            let o = {
                messageFeature: {
                    needTyping: 1,
                    version: 1,
                },
                messageReply: {
                    messageAbstract: self.referenceInfo.referenceMessageForShow,
                    messageSender: self.referenceMessage.nick || self.referenceMessage.from,
                    messageID: self.referenceMessage.ID,
                    messageType: self.referenceMessageType,
                    version: 1,
                }
            }
            cloudCustomData = JSON.stringify(o);
            self.showReference = false;
        }
        if (self.atType.length > 0) {
            const options = {
                to: self.conversation?.groupProfile?.groupID,
                payload: {
                    text: self.textarea,
                    atUserList: self.atType,
                },
            };
            message = IM.createTextAtMessage(options)
            self.atType = []
        }else{
            message = IM.createMessage({
                type: MSG_TYPES.MSG_TEXT,
                to: self.toChatId,
                conversationType: self.toType === 'C2C' ? 'C2C' : 'GROUP',
                content: self.textarea,
                cloudCustomData
            })
        }
        self.setButton(message)
    },
    // 发送图片
    sendImg(){
        const self = this;
        let imgInfo = { width: 0, height: 0 };
        let imagesFile = document.getElementById('imagePicker').files[0];
        self.getUploadImgWH(imagesFile, imgInfo)
        let message = IM.createMessage({
            type: MSG_TYPES.MSG_IMAGE,
            to: self.toChatId,
            conversationType: self.toType === 'C2C' ? 'C2C' : 'GROUP',
            content: document.getElementById('imagePicker'),
            onProgress: function (event) { 
                // console.log('图片文件上传后的进度返回', event)
                self.$store.commit("im/UPDATE_IMGFILEPERCENTAGE", {...{uploadProgress: event}, ...imgInfo})
                self.below()
            }
        })
        self.setButton(message)
        document.getElementById('imagePicker').value = ''
    },
    // 发送文件
    sendFile (e) {
        const self = this;
        let imgInfo = { width: 0, height: 0 };
        let message = IM.createMessage({
            type: MSG_TYPES.MSG_FILE,
            to: self.toChatId,
            conversationType: self.toType === 'C2C' ? 'C2C' : 'GROUP',
            content: document.getElementById('filePicker'),
            onProgress: function (event) { 
                // console.log('图片文件上传后的进度返回', event)
                self.$store.commit("im/UPDATE_IMGFILEPERCENTAGE", {...{uploadProgress: event}, ...imgInfo})
            }
        })
        self.setButton(message)
        document.getElementById('filePicker').value = ''
    },
    //发送表情
    setEmj (val) {
        let obj = this.emojiMap
        let findKey = (value, compare = (a, b) => a === b) => {
            return Object.keys(obj).find(k => compare(obj[k], value))
        }
        this.$refs.popover4.showPopper = false;
        this.textarea = this.textarea.concat(findKey(val))
    },
    // 回车发送文本 阻止浏览器默认换行操作
    messageSendlisten (event) {
        if(event.keyCode === 13 && event.ctrlKey){
            this.textarea += '\n' 
            event.preventDefault(); // 阻止浏览器默认换行操作
            return false;
        }else if(event.keyCode === 13) {
            this.sendText(); // 发送文本
            event.preventDefault(); // 阻止浏览器默认换行操作
            return false;
        }
    },
    // 监听输入框粘贴的是图片直接发送
    inputPaste(event){
        const self = this;
        const imagesFile = event.clipboardData.files[0];// 获取剪贴板图片
        if (!imagesFile) {
            return;
        }
        let imgInfo = { width: 0, height: 0 };
        let msgType = ['image/png', 'image/jpg','image/jpeg','image/gif','image/bmp','image/webp',].includes(fileType)
        if(msgType){
            self.getUploadImgWH(imagesFile, imgInfo)
        }
        const fileType = imagesFile.type;
        let message = IM.createMessage({
            type: msgType ? MSG_TYPES.MSG_IMAGE : MSG_TYPES.MSG_FILE,
            to: self.toChatId,
            conversationType: self.toType === 'C2C' ? 'C2C' : 'GROUP',
            content: imagesFile,
            onProgress: function (event) { 
                // console.log('图片文件上传后的进度返回', event)
                self.$store.commit("im/UPDATE_IMGFILEPERCENTAGE", {...{uploadProgress: event}, ...imgInfo})
                self.below()
            }
        })
        self.setButton(message)
    },
    // 发送框区域---拖拽发送
    dropEvent(e) {
        const self = this;
        e.stopPropagation()
        e.preventDefault()
        const imagesFile = e.dataTransfer.files[0];// 获取剪贴板图片
        if (!imagesFile) {
            return;
        }
        const fileType = imagesFile.type;
        let imgInfo = { width: 0, height: 0 };
        let msgType = ['image/png', 'image/jpg','image/jpeg','image/gif','image/bmp','image/webp',].includes(fileType)
        if(msgType){
            self.getUploadImgWH(imagesFile, imgInfo)
        }
        let message = IM.createMessage({
            type: msgType ? MSG_TYPES.MSG_IMAGE : MSG_TYPES.MSG_FILE,
            to: self.toChatId,
            conversationType: self.toType === 'C2C' ? 'C2C' : 'GROUP',
            content: imagesFile,
            onProgress: function (event) { 
                // console.log('图片文件上传后的进度返回', event)
                self.$store.commit("im/UPDATE_IMGFILEPERCENTAGE", {...{uploadProgress: event}, ...imgInfo})
                self.below()
            }
        })
        self.setButton(message)
    },
    // 信息展示区---拖拽发送
    dropEvent1(e) {
        const self = this;
        e.stopPropagation()
        e.preventDefault()
        const imagesFile = e.dataTransfer.files[0];// 获取剪贴板图片
        if (!imagesFile) {
            return;
        }
        const fileType = imagesFile.type;
        let imgInfo = { width: 0, height: 0 };
        let msgType = ['image/png', 'image/jpg','image/jpeg','image/gif','image/bmp','image/webp',].includes(fileType)
        if(msgType){
            self.getUploadImgWH(imagesFile, imgInfo)
        }
        let message = IM.createMessage({
            type: msgType ? MSG_TYPES.MSG_IMAGE : MSG_TYPES.MSG_FILE,
            to: self.toChatId,
            conversationType: self.toType === 'C2C' ? 'C2C' : 'GROUP',
            content: imagesFile,
            onProgress: function (event) { 
                // console.log('图片文件上传后的进度返回', event)
                self.$store.commit("im/UPDATE_IMGFILEPERCENTAGE", {...{uploadProgress: event}, ...imgInfo})
                self.below()
            }
        })
        self.setButton(message)
    },
    // 监听拖拽发送
    multipleDragEvent() {
        // 发送框区域---监听拖拽发送
        let dropbox = document.getElementById('drop_area');
        dropbox.addEventListener("dragleave", function (e) {
            e.stopPropagation();
            e.preventDefault();
        }, false)
        dropbox.addEventListener("dragenter", function (e) {
            e.stopPropagation();
            e.preventDefault();
        }, false)
        dropbox.addEventListener("dragover", function (e) {
            e.stopPropagation();
            e.preventDefault();
        }, false)
        dropbox.addEventListener("drop", this.dropEvent, false)

        // 信息展示区---监听拖拽发送
        let dropbox1 = document.getElementById('t_right_con');
        dropbox1.addEventListener("dragleave", function (e) {
            e.stopPropagation();
            e.preventDefault();
        }, false)
        dropbox1.addEventListener("dragenter", function (e) {
            e.stopPropagation();
            e.preventDefault();
        }, false)
        dropbox1.addEventListener("dragover", function (e) {
            e.stopPropagation();
            e.preventDefault();
        }, false)
        dropbox1.addEventListener("drop", this.dropEvent1, false)
    },
    // 撤回重新编辑
    handleEdit(item) {
        this.textarea = item.payload.text;
    },
    // 获取上传图片的宽度和高度
    getUploadImgWH(imagesFile, imgInfo){
        const self = this;
        let fileReader = new FileReader();
        fileReader.readAsDataURL(imagesFile); //根据图片路径读取图片
        fileReader.onload = function(e) {
          let base64 = this.result;
          let img = new Image();
          img.src = base64;
          img.onload = function() {
            console.log("宽：" + img.naturalWidth + " 高：" + img.naturalHeight);
            imgInfo.width =  img.naturalWidth;
            imgInfo.height =  img.naturalHeight;
          }
        }
    }
}