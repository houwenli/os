<template>
    <div :title="getTime(message)">
        <MessageText v-if="message.type === MSG_TYPES.MSG_TEXT" :message="message"></MessageText>
        <MessageImage v-if="message.type === MSG_TYPES.MSG_IMAGE" :message="message"></MessageImage>
        <MessageVideo  v-if="message.type === MSG_TYPES.MSG_VIDEO" :message="message"></MessageVideo>
        <MessageFile v-if="message.type === MSG_TYPES.MSG_FILE" :message="message" :forwarClick.sync="forwarClick"></MessageFile>
        <MessageAudio v-if="message.type === MSG_TYPES.MSG_SOUND" :message="message"></MessageAudio>
        <MessageLocation v-if="message.type === MSG_TYPES.MSG_LOCATION" :message="message"></MessageLocation>
        <!-- <MessageCustom v-if="message.type === MSG_TYPES.MSG_CUSTOM" :message="message"></MessageCustom> -->
        <div ref="rightMouse" v-if="showRightID === message.ID && 
            message.type !== MSG_TYPES.MSG_SOUND && 
            message.type !== MSG_TYPES.MSG_VIDEO &&
            message.type !== MSG_TYPES.MSG_LOCATION" class="dialog dialog-item" v-clickOutSide="handleClose">
            <p class="conversation-options" v-if="message.type === MSG_TYPES.MSG_TEXT" @click.stop="handleMseeage(message, handleMessage.copy)">复制</p>
            <p class="conversation-options" v-if="message.status === 'success'" @click.stop="handleMseeage(message, handleMessage.forward)">转发</p>
            <p class="conversation-options" v-if="message.status === 'success'" @click.stop="handleMseeage(message, handleMessage.reply)">回复</p>
            <p class="conversation-options" v-if="message.status === 'success' && message.flow === 'out' && newDate - message.time < 2 * 60" @click.stop="handleMseeage(message, handleMessage.revoke)">撤回</p>
        </div>
    </div>
</template>

<script>
import { MSG_TYPES } from '../../js/utils';
import MessageText from './messageText';
import MessageImage from './messageImage';
import MessageVideo from './messageVideo';
import MessageFile from './messageFile';
import MessageCustom from './messageCustom';
import MessageAudio from './messageAudio';
import MessageLocation from './messageLocation';
import useClipboard from 'vue-clipboard3';
import IM from '../../../../../utils/tim/tim';
// import MessageReadReceipt from './messageReadReceipt';

const clickOutSide = {
    // 初始化指令
    bind(el, binding, vnode){
        function documentHandler(e){
            // 这里判断点击的元素是否是本身,是本身,则返回
            if(el.contains(e.target)){
                return false;
            }
            // 判断指令中是否绑定了函数
            if(binding.expression){
                binding.value(0)
            }
        }
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler)
    },
    update(){},
    unbind(el, binding){
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__
    }
}
export default {
    props: {
        conversation: {
            type: Object,
            default: () => { }
        },
        message: {
            type: Object,
            default: () => { }
        },
        showRightID: {
            type: String,
            default: () => ''
        },
        showForwar: {// 信息的已读未读弹框控制
            type: Boolean,
            default: () => false
        },
        showReference: {// 回复信息是否展示
            type: Boolean,
            default: () => false
        },
        referenceMessage: {// 回复的具体信息
            type: Object,
            default: () => {}
        },
    },
    directives: { clickOutSide },
    components: {
        MessageText,
        MessageImage,
        MessageFile,
        MessageCustom,
        MessageVideo,
        MessageAudio,
        MessageLocation
    },
    data () {
        return {
            MSG_TYPES: MSG_TYPES,
            handleMessage: {
                copy: 'copy',
                forward: 'forward',
                reply: 'reply',
                revoke: 'revoke'
            },
            newDate: '',
            forwarClick: false,
        }
    },
    watch: {
        showRightID: function(newV, oldV){
            if(newV){
                this.newDate = ((new Date()).getTime())/1000
                this.$nextTick(() => {
                    if(this.$refs.rightMouse){
                        // h  弹出框高度
                        // showH 鼠标点击位置距离可视窗口下边距
                        // messageH 信息显示高度  定位点
                        let h = this.$refs.rightMouse.clientHeight;
                        if(this.$attrs.showH - h > 0){
                            let hh = this.$attrs.messageH;
                            this.$refs.rightMouse.style.top = hh + 'px'
                        }else if(this.$attrs.showH - h < 0){
                            let hh = this.$attrs.messageH - h;
                            this.$refs.rightMouse.style.top = hh + 'px'
                        }
                    }
                })
            }
        },
        forwarClick: function(newV, oldV){
            if(newV){
                this.forwarClick = false;
                this.handleMseeage(this.message, this.handleMessage.forward)
            }
        },
    },
    methods: {
        getTime(message){
            return this.$baseMethod.formatData(new Date(message.time*1000))
        },
        isCloudCustomData(){
            const self = this;
            let flag = false;
            if(self.message.cloudCustomData !== ''){
                const cloudCustomData = JSON.parse(self.message.cloudCustomData);
                self.messageReply = cloudCustomData.messageReply ? cloudCustomData.messageReply : '';
                if(self.messageReply){
                    flag =true;
                }
            }
            return flag;
        },
        handleClose(){
            this.$emit('update:showRightID', '')
            this.$emit('update:messageH', '')
            this.$emit('update:showH', '')
        },
        async handleMseeage(message, type) {
            const self = this;
            switch (type) {
                case self.handleMessage.copy:
                    try {
                        if (message?.type === MSG_TYPES.MSG_TEXT && message?.payload?.text) {
                            const { toClipboard } = useClipboard();
                            await toClipboard(message?.payload?.text);
                        }
                    } catch (error) {
                        handleErrorPrompts(error);
                    }
                    break;
                case self.handleMessage.forward:
                    self.$emit('update:showForwar', true)
                    self.$emit('update:forwarMessage', message)
                    break;
                case self.handleMessage.revoke:
                    try {
                        await IM.revokeMessage(message);
                    } catch (error) {
                        handleErrorPrompts(error);
                    }
                    break;
                case self.handleMessage.reply:
                    let referenceMessageForShow = '', 
                        referenceMessageType = '';
                    switch (message.type) {
                        case MSG_TYPES.MSG_TEXT:
                            referenceMessageForShow = message?.payload?.text;
                            referenceMessageType = 1;
                            break;
                        case MSG_TYPES.MSG_CUSTOM:
                            referenceMessageForShow = '[自定义消息]';
                            referenceMessageType = 2;
                            break;
                        case MSG_TYPES.MSG_IMAGE:
                            referenceMessageForShow = '[图片]';
                            referenceMessageType = 3;
                            break;
                        case MSG_TYPES.MSG_AUDIO:
                            referenceMessageForShow = '[语音]';
                            referenceMessageType = 4;
                            break;
                        case MSG_TYPES.MSG_VIDEO:
                            referenceMessageForShow = '[视频]';
                            referenceMessageType = 5;
                            break;
                        case MSG_TYPES.MSG_FILE:
                            referenceMessageForShow = '[文件]';
                            referenceMessageType = 6;
                            break;
                        case MSG_TYPES.MSG_FACE:
                            referenceMessageForShow = '[表情]';
                            referenceMessageType = 8;
                            break;
                    }
                    self.$emit('update:referenceInfo',{referenceMessageForShow,referenceMessageType})
                    self.$emit('update:referenceMessage', message)
                    self.$emit('update:showReference', true)
            }
        },
        handleErrorPrompts(error){
            console.log(error)
        }
    }
}
</script>
<style scoped lang="scss">
.dialog{
    position: fixed;
    z-index: 5;
    padding: 4px;
    &-item {
        width: 80px;
        background: #FFFFFF;
        box-shadow: 0px 6px 17px 0px rgba(0,0,0,0.2);
        border-radius: 4px;
    }
    .conversation-options:hover {
        background: #F5F7FA;
    }
    .conversation-options {
        font-size: 12px;
        width: 72px;
        border-radius: 2px;
        padding: 8px 0 8px 8px;
    }
}
</style>