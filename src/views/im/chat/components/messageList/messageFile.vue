<template>
    <div>
        <template v-if="!message.payload.fileUrl">
            <!-- <img :width="316" :height="48" v-loading="true" /> -->
            <div style="display: flex;overflow: hidden; width: 316px;height: 48px;">
                <img style="width: 48px;height: 48px;margin-right: 12px;" src="../../image/icon_bule_file.png" />
            </div>
            <el-progress :text-inside="true" :stroke-width="3" :color="'#F05259'" :percentage="imgFilePercentage"></el-progress>
        </template>
        <template v-else>
            <div style="display: flex;overflow: hidden;">
                <img style="width: 48px;height: 48px;margin-right: 12px;" src="../../image/icon_bule_file.png" />
                <div style="margin-top: 2px;overflow: hidden;">
                    <p class="file_name">{{message.payload.fileName}}</p>
                    <p class="file_label">{{message.payload.fileSize | fileSizeFilters}} {{getTime(message.clientTime)}} {{message.nick || message.from}}</p>
                </div>
                <div class="file_icon_box">
                    <span @click="download(message.payload)"><img src="../../image/icon_hischat_down.png" title="单击下载"></span>
                    <span @click="forwarC()"><img src="../../image/icon_hischat_share.png" title="转发"></span>
                </div>
            </div>
            <el-progress v-if="showDownID == message.conversationID" :percentage="percentageNum" :show-text="false" :stroke-width="2" :color="'#F05259'"></el-progress>
        </template>
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
            imgFilePercentage: 0,
            showDownID: '',
            receivedLength: 0, // 下载进度
            fileAllSize: 0, // 总进度
            percentageNum: 0,
        }
    },
    filters: {
        // 换算文件大小
        fileSizeFilters: function (value) {
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
        '$store.state.im.imgFilePercentage': function(newV){ // 更新当前会话信息
            const self = this;
            if(newV){
                let t = Math.round(newV.uploadProgress*100);
                self.imgFilePercentage = t == 100 ? 99 : t;
            }
        },
        receivedLength: function(newV){
            const self = this;
            if(newV){
                let t = Math.round((newV / self.fileAllSize) * 100);
                self.percentageNum = t;
            }
        }
    },
    methods: {
        getTime(msgTime){
            msgTime = msgTime * 1000
            return this.$baseMethod.formatData(msgTime)
        },
        forwarC(){
            this.$emit('update:forwarClick', true)
        },
        // 下载文件
        download(fileObj){
            let self = this;
            self.showDownID = this.message.conversationID;
            console.log('self.showDownID', self.showDownID)
            const file = fileObj;
            self.fileAllSize = fileObj.fileSize;
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
    }
}
</script>
<style lang="scss" scoped>
.file_name {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 600;
    color: #606266;
    line-height: 20px;
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
    width: 66px;
    img {
        width: 16px;
        height: 16px;
        margin-left: 16px;
    }
}

/deep/ .el-progress--circle .el-progress__text, 
/deep/ .el-progress--dashboard .el-progress__text{
    margin-left: 38%;
}
</style>