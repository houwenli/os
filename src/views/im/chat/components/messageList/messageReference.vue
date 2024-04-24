<template>
    <div class="cloudCustomData" :class="message.flow === 'out' ? 'right' : ''" v-if="isCloudCustomData()">
        <p>{{ messageReply.messageSender }}：</p>
        <span v-html="getHtml(messageReply.messageAbstract)"></span>
    </div>
</template>
<script>
export default {
    props: {
        message: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            messageReply: '', // 引用信息
        }
    },
    methods: {
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
        getHtml(text){
            text = text.replace('[图片]', '<span style="color: #0088FF;">[图片]</span>')
            text = text.replace('[文件]', '<span style="color: #0088FF;">[文件]</span>')
            text = text.replace('[视频]', '<span style="color: #0088FF;">[视频]</span>')
            return text
        }
    }
}
</script>
<style scoped lang="scss">
.cloudCustomData {
    display: block;
    width: 100%;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #909399;
    line-height: 17px;
    // margin-bottom: 25px;
    // border-radius: 8px;
    margin-bottom: 15px;
    border-bottom: 1px solid #909399;
    padding-bottom: 10px;
}
// .right{
//     left: auto;
//     right: 57px;
// }
</style>