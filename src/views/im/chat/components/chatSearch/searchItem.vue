<template>
    <div>
        <div v-for="(item, index) in transformData" :key="index">
            <!-- 文本消息 -->
            <div class="all_con" v-if="item && item.msgFormat === 'TIMTextElem'">
                <div class="all_left">
                    <div class="nameIcon" v-if="item.imagePath">
                        <img :src="item.imagePath ? item.imagePath : head_user" alt="" />
                    </div>
                    <div class="nameIcon text" v-else>
                        {{ item.fromName.slice(0, 1) }}
                    </div>
                    <div>
                        <div class="content-info">
                            <p>{{ item.fromName }}</p>
                            <p class="time">{{ getNowTime(item.msgTime) }}</p>
                        </div>
                        <p class="textEle">{{ item.msgContext }}</p>
                    </div>
                </div>
            </div>
            <!-- 文件消息 -->
            <div class="all_con" v-if="item && item.msgFormat === 'TIMFileElem'">
                <div class="all_left">
                    <div class="nameIcon" v-if="item.imagePath">
                        <img :src="item.imagePath ? item.imagePath : head_user" alt="" />
                    </div>
                    <div class="nameIcon text" v-else>
                        {{ item.fromName.slice(0, 1) }}
                    </div>
                    <div>
                        <div class="content-info">
                            <p>{{ item.fromName }}</p>
                            <p class="time">{{ getNowTime(item.msgTime) }}</p>
                        </div>
                        <div style="display: flex">
                            <img style="width: 48px; height: 48px; margin-right: 12px" src="../../image/icon_bule_file.png" />
                            <div style="margin-top: 2px">
                                <p class="file_name">{{ item.msgContext.FileName }}</p>
                                <p class="file_label">{{ item.msgContext.FileSize | fileSizeFilters }}</p>
                            </div>
                            <div class="file_icon_box">
                                <span @click="download(item.msgContext)"><img src="../../image/icon_hischat_down.png" title="单击下载" /></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 视频消息 -->
            <div class="all_con" v-if="item && item.msgFormat === 'TIMVideoFileElem'">
                <div class="all_left">
                    <div class="nameIcon" v-if="item.imagePath">
                        <img :src="item.imagePath ? item.imagePath : head_user" alt="" />
                    </div>
                    <div class="nameIcon text" v-else>
                        {{ item.fromName.slice(0, 1) }}
                    </div>
                    <div>
                        <div class="content-info">
                            <p>{{ item.fromName }}</p>
                            <p class="time">{{ getNowTime(item.msgTime) }}</p>
                        </div>
                        <p>
                            <span>视频链接：</span>
                            <span class="videoUrl" @click="handleVideoDia(item.msgContext.VideoUrl)">{{ item.msgContext.VideoUrl }}</span>
                        </p>
                    </div>
                </div>
            </div>
            <!-- 音频消息 -->
            <div class="all_con" v-if="item && item.msgFormat === 'TIMSoundElem'">
                <div class="all_left">
                    <div class="nameIcon" v-if="item.imagePath">
                        <img :src="item.imagePath ? item.imagePath : head_user" alt="" />
                    </div>
                    <div class="nameIcon text" v-else>
                        {{ item.fromName.slice(0, 1) }}
                    </div>
                    <div>
                        <div class="content-info">
                            <p>{{ item.fromName }}</p>
                            <p class="time">{{ getNowTime(item.msgTime) }}</p>
                        </div>
                        <audio id="audio-element" :ref="'audio' + index" controls hidden="true">
                            <source :src="item.msgContext.Url" type="audio/mpeg" />
                            Your browser does not support the audio tag.
                        </audio>
                        <div class="musicView">
                            <span>{{ item.msgContext.Second + '″' }}</span>
                            <img :src="audioPause" :ref="'audioImg' + index" alt="" class="playSuspend" @click="palyAuto(item, index, item.msgContext.Second)" />
                        </div>
                    </div>
                </div>
            </div>
            <!-- 图片消息 -->
            <div class="all_con" v-if="item && item.msgFormat === 'TIMImageElem'">
                <div class="all_image">
                    <div class="nameIcon" v-if="item.imagePath">
                        <img :src="item.imagePath ? item.imagePath : head_user" alt="" />
                    </div>
                    <div class="nameIcon text" v-else>
                        {{ item.fromName.slice(0, 1) }}
                    </div>
                    <div>
                        <div class="content-info">
                            <p>{{ item.fromName }}</p>
                            <p class="time">{{ getNowTime(item.msgTime) }}</p>
                        </div>
                        <div>
                            <el-image style="width: 80px; height: 80px" :src="item.msgContext.ImageInfoArray[0].URL" :preview-src-list="[item.msgContext.ImageInfoArray[0].URL]"></el-image>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 播放视频弹窗 -->
        <PlayVideoDia ref="playVideoDia" :visible.sync="videoVisible" :videoUrl="videoUrl"></PlayVideoDia>
    </div>
</template>
<script>
import PlayVideoDia from './playVideoDia';
import audioPause from '@/assets/images/chat/audio_pause.png';
import audioPlay from '@/assets/images/chat/audio_play.png';
import head_user from '@/assets/images/chat/head_user.png';
export default {
    name: 'searchItem',
    props: {
        chatData: {
            type: Array,
            default: () => [],
        },
    },
    components: {
        PlayVideoDia,
    },
    filters: {
        // 换算文件大小
        fileSizeFilters: function (value) {
            if (value > 1024 * 1024) {
                value = (value / 1024 / 1024).toFixed(0) + 'MB';
            } else if (value > 1024) {
                value = (value / 1024).toFixed(0) + 'KB';
            } else {
                value += 'KB';
            }
            return value;
        },
    },
    data() {
        return {
            audioPause,
            audioPlay,
            head_user,
            duration: 0, // 音频时长
            isPlaying: false,
            timer: null,
            transformData: null,
            videoUrl: '',
            videoVisible: false,
        };
    },
    watch: {
        chatData: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.handleParentData(newVal);
                }
            },
            immediate: true,
        },
    },
    methods: {
        handleParentData(data) {
            let tempData = data || [];
            if (tempData && tempData.length != 0) {
                tempData.forEach(item => {
                    if (item !== null && item.msgFormat === 'TIMImageElem' && typeof item.msgContext === 'string') {
                        item.msgContext = JSON.parse(item.msgContext);
                    }
                    if (item !== null && item.msgFormat === 'TIMVideoFileElem' && typeof item.msgContext === 'string') {
                        item.msgContext = JSON.parse(item.msgContext);
                    }

                    if (item !== null && item.msgFormat === 'TIMSoundElem' && typeof item.msgContext === 'string') {
                        item.msgContext = JSON.parse(item.msgContext);
                    }

                    if (item !== null && item.msgFormat === 'TIMFileElem' && typeof item.msgContext === 'string') {
                        item.msgContext = JSON.parse(item.msgContext);
                    }
                });
            }
            this.transformData = tempData;
        },
        palyAuto(e, index, second) {
            let audioRef = 'audio' + index;
            let audioImgRef = 'audioImg' + index;
            let audio = this.$refs[audioRef][0];
            let audioImg = this.$refs[audioImgRef][0];
            if (audio.paused) {
                audioImg.src = this.audioPlay;
                audio.play();
                this.audioEnd(second, audioImg);
            } else {
                audioImg.src = this.audioPause;
                audio.pause();
                clearTimeout(this.timer);
            }
        },
        audioEnd(second, audioImg) {
            let that = this;
            this.timer = setTimeout(() => {
                audioImg.src = that.audioPause;
            }, (second + 1) * 1000);
        },
        handleVideoDia(url) {
            this.videoUrl = url;
            this.videoVisible = true;
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
        // 下载文件
        download(fileObj) {
            const file = fileObj;
            const option = {
                mode: 'cors',
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded',
                }),
            };
            // 浏览器支持fetch则用blob下载，避免浏览器点击a标签，跳转到新页面预览的行为
            // If the browser supports fetch, use blob to download, so as to avoid the browser clicking the a tag and jumping to the preview of the new page
            if (window.fetch) {
                fetch(file.Url, option)
                    .then(res => res.blob())
                    .then(blob => {
                        const a = document.createElement('a');
                        const url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = file.FileName;
                        a.click();
                    });
            } else {
                const a = document.createElement('a');
                a.href = file.Url;
                a.target = '_blank';
                a.download = file.FileName;
                a.click();
            }
        },
    },
    beforeDestroy() {
        clearTimeout(this.timer);
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
    flex-direction: column;
    .all_left {
        display: flex;
        flex-direction: row;
        > div:nth-of-type(2) {
            margin-left: 15px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #606266;
            line-height: 20px;
            display: flex;
            flex: 1;
            flex-direction: column;
        }
    }
    .content-info{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 6px;
        color: #303133;
        font-size: 16px;
        .time{
            font-size: 12px;
        }
    }
    .textEle {
        color: #909399;
        font-size: 14px;
        line-height: 20px;
    }
    .all_image {
        display: flex;
        > div:nth-of-type(2) {
            margin-left: 15px;
            display: flex;
            flex: 1;
            flex-direction: column;
            p {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #606266;
                line-height: 12px;
                margin-bottom: 10px;
            }
            div {
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
}
span.videoUrl {
    width: 350px !important;
    color: #0088ff;
    cursor: pointer;
    display: flex;
}
.musicView {
    width: 250px !important;
    display: flex;
    align-items: center;
    position: relative;
    span {
        font-size: 16px;
        color: #303133;
    }
    .playSuspend {
        width: 20px !important;
        height: 20px !important;
        overflow: hidden;
        border-radius: 50%;
        cursor: pointer;
    }
}
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
.nameIcon.text {
    border: 1px border #0088ff;
    background: #0088ff;
}

.file_name {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 600;
    color: #606266;
    line-height: 20px;
    margin-bottom: 5px !important;
}
.file_label {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #c0c4cc;
    line-height: 17px;
    margin-top: 2px;
}
.file_icon_box {
    cursor: pointer;
    img {
        width: 16px;
        height: 16px;
        margin-left: 16px;
        margin-top: 5px;
    }
}
</style>
