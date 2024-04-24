<template>
    <div class="video-dialog">
    <itineraryRecording :type="1"></itineraryRecording>
        <div>
            <span class="textluyin">录像文件：</span>
            <el-button plain :loading="loading" @click="getSource" v-if="btnShow">获取录像文件</el-button>
            <el-button type="primary" circle icon="el-icon-caret-right" @click="handleShow(1)" v-if="isVideoReady && !loading"></el-button>
        </div>
        <div style="margin-top: 30px" v-if="isLive">
            <span class="textluyin">实时视频：</span>
            <el-button plain @click="handleShow(2)">查看视频</el-button>
        </div>
        <el-dialog :visible.sync="dialogVisible" width="1140px" top="10vh" :close-on-click-modal="false" v-if="dialogVisible" :before-close="beforeCloce">
            <span slot="title">
                <span v-if="playType == 1">
                    <b>录像文件</b>
                    <span class="video-title">{{ videoInfo.videoName }}&emsp;|&emsp;{{ videoInfo.videoTime }}</span>
                </span>
                <span v-else>
                    <b>实时监控</b>
                    <span class="video-title">
                        车辆{{ config.carNum }},{{ config.userName }}
                        <span class="fr">{{ nowTime }}</span>
                    </span>
                </span>
            </span>
            <div v-if="playType == 2">
                <div id="playbox" style="width: 1092px; height: 600px; background: #000; overflow: hidden"></div>
                <div class="msg">
                    <el-button :plain="isSpeaking" @click="handleSpeak">
                        <i class="el-icon-mic"></i>
                        {{ isSpeaking ? '点击关闭说话' : '点击开始说话' }}
                    </el-button>
                    <el-button type="primary" @click="isSending = true">
                        <i class="el-icon-s-comment"></i>
                        给乘客发短信
                    </el-button>
                </div>
            </div>
            <div v-else class="video-box">
                <div class="video-list" :style="{ left: `${leftVal}px` }">
                    <span class="btn" @click="showList"><i :class="leftVal === 0 ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i></span>
                    <h4>录像列表</h4>
                    <div class="list">
                        <ul>
                            <li
                                v-for="(item, index) in videoList"
                                :key="index"
                                @click="
                                    activeIndex = index;
                                    videoInfo = item;
                                    source = item.downLoadUrl;
                                "
                                :class="{ active: activeIndex == index }"
                            >
                                <el-row>
                                    <el-col :span="3">
                                        <img :src="imgSrc" alt="" />
                                    </el-col>
                                    <el-col :span="21">
                                        <p>{{ item.videoName }} 时间：{{ item.videoTime }}</p>
                                    </el-col>
                                </el-row>
                            </li>
                        </ul>
                    </div>
                </div>
                <vue-aliplayer-v2 :source="source" ref="VueAliplayerV2" :options="options" @ended="handleEnded()" @error="handleError" />
            </div>
        </el-dialog>
        <el-dialog :visible.sync="isSending" width="600px" top="20vh" :close-on-click-modal="false" title="给乘客发短信">
            <el-input type="textarea" :rows="4" maxlength="140" show-word-limit v-model="msg"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button
                    @click="
                        isSending = false;
                        msg = '';
                    "
                >
                    取 消
                </el-button>
                <el-button type="primary" @click="sendMsg">确认发送</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import VueAliplayerV2 from 'vue-aliplayer-v2';
import HRTC from "./SDK/hrtc";
import * as CryptoJS from 'crypto-js';
import itineraryRecording from './ItineraryRecording'
export default {
    name: 'videoPlayer',
    props: {
        orderId: {
            type: String,
            default: () => ''
        },
        status: {
            type: Number,
            default: () => 0
        }
    },
    components: {
        VueAliplayerV2,itineraryRecording
    },
    computed: {
        isLive() {
            return this.status > 10 && this.status < 60;
        }
    },
    data() {
        return {
            options: {
                isLive: false, //切换为直播流的时候必填
                height: '600px'
            },
            source: 'https://player.alicdn.com/video/aliyunmedia.mp4',
            dialogVisible: false,
            loading: false,
            btnShow: true,
            videoInfo: {},
            videoList: [],
            isVideoReady: false,
            timer: null,
            playType: 1,
            //webrtc相关参数
            client: null,
            stream: null,
            config: {
                appId: '63fc7062fa163edab4691564e5f4372f',
                domain: '63fc7062fa163edab4691564e5f4372f.cloudrtc.myhuaweicloud.com',
                countryCode: 'CN',
                appSecret: '8EC007E837934FDCA382D6680EE6C106',
                roomId: '999',
                userId: '23333',
                userName: '23333',
                role: '0'
            },
            nowTime: '',
            msg: '',
            isSending: false,
            isSpeaking: false,
            leftVal: 0,
            imgSrc: require('@/assets/images/icon_video@2x.png'),
            activeIndex: 0
        };
    },
    watch: {
        isVideoReady(val) {
            if (val) {
                clearInterval(this.timer);
            }
        }
    },
    methods: {
        handleShow(type) {
            this.dialogVisible = true;
            this.playType = type;
            if (type == 2) {
                let params = {
                    data: {
                        orderId: this.orderId
                    },
                    op: 'getDirectSeedingParam'
                };
                let url = '/expOrder/select';
                this.$axios(url, params).then(res => {
                    let result = JSON.parse(res.data);
                    this.config = { ...this.config, ...result };
                    this.config.userId = this.config.userId + '';
                    // this.config.roomId = '10086';
                    if (!!this.nowTimes) this.nowTimes();
                    this.isBrowserSupport();
                    this.init();
                    setTimeout(() => {
                        this.joinRoom();
                    }, 1000);
                });
            }
        },
        getSource() {
            this.isVideoReady = true;
            this.loading = true;
            let params = {
                data: {
                    orderId: this.orderId
                },
                op: 'downObsVideo'
            };
            let url = '/expOrder/select';
            this.$axios(url, params)
                .then(res => {
                    let result = JSON.parse(res.data);
                    this.videoList = result;
                    this.videoInfo = result[0];
                    this.source = result[0].downLoadUrl;
                    this.isVideoReady = true;
                    this.loading = false;
                })
                .catch(err => {
                    this.isVideoReady = false;
                    this.loading = false;
                });
        },
        // webRTC相关方法
        async isBrowserSupport() {
            let check = false;
            try {
                check = await HRTC.checkSystemRequirements();
                console.warn('browser isSupport: ' + check);
            } catch (error) {
                console.error(`check browser isSupport error: ${error.getCode()} - ${error.getMsg()}`);
                if (error.getCode() !== 90100025) {
                    console.error(`browser Support part ability of RTC`);
                    check = true;
                }
            }
            return check;
        },
        beforeCloce(done) {
            if (this.playType == 2) {
                this.leaveRoom();
            }
            done();
        },
        leaveRoom() {
            this.stream && this.stream.close();
            this.client.leave();
            console.log('client.leave---------------------------------------------------');
        },
        async joinRoom() {
            let SignatureAndCtime = this.getSignatureAndCtimeArray(this.config.appId, this.config.roomId, this.config.userId);
            let option = {
                userId: this.config.userId,
                userName: this.config.userName,
                signature: SignatureAndCtime[0],
                ctime: SignatureAndCtime[1],
                role: 0
            };
            try {
                await this.client.join(this.config.roomId, option);
                console.log('join room success-------------------------------------------------------------------------------------------------');
            } catch (error) {
                console.log('join room fail', error);
            }
        },
        handleSpeak() {
            this.isSpeaking = !this.isSpeaking;
            if (this.isSpeaking) {
                this.stream = HRTC.createStream({
                    audio: true,
                    video: false
                });
                this.stream.initialize().then(() => {
                    this.client.publish(this.stream);
                });
            } else {
                this.client.unpublish(this.stream);
            }
        },
        init() {
            this.client = HRTC.createClient(this.config);
            this.client.on('stream-added', event => {
                const stream = event.stream;
                this.client.subscribe(stream, { video: true, audio: true });
            });
            this.client.on('stream-subscribed', event => {
                const stream = event.stream;
                // console.log(!stream.hasVideo(),'11111111')
                stream.play('playbox', {
                    objectFit: 'contain',
                    playElementHidden: !stream.hasVideo()
                });
            });
            this.client.on('peer-leave', event => {});
            this.client.on('stream-removed', event => {
                event.stream.close();
            });
        },
        //生成签名信息和时间
        getSignatureAndCtimeArray(appId, roomId, userId) {
            const ctimeNum = 7200000; // 单位：毫秒
            const ctime1 = Math.floor((ctimeNum + new Date().getTime()) / 1000);
            const message = `${appId}+${roomId}+${userId}+${ctime1}`;
            return [CryptoJS.HmacSHA256(message, this.config.appSecret).toString(), ctime1]; // 使用HmacSHA256加密
        },

        timeFormate(timeStamp) {
            let year = new Date(timeStamp).getFullYear();
            let month = new Date(timeStamp).getMonth() + 1 < 10 ? '0' + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1;
            let date = new Date(timeStamp).getDate() < 10 ? '0' + new Date(timeStamp).getDate() : new Date(timeStamp).getDate();
            let hh = new Date(timeStamp).getHours() < 10 ? '0' + new Date(timeStamp).getHours() : new Date(timeStamp).getHours();
            let mm = new Date(timeStamp).getMinutes() < 10 ? '0' + new Date(timeStamp).getMinutes() : new Date(timeStamp).getMinutes();
            let ss = new Date(timeStamp).getSeconds() < 10 ? '0' + new Date(timeStamp).getSeconds() : new Date(timeStamp).getSeconds();
            var d = new Date(timeStamp).getDay();
            let day;
            if (d == 0) {
                day = '日';
            } else if (d == 1) {
                day = '一';
            } else if (d == 2) {
                day = '二';
            } else if (d == 3) {
                day = '三';
            } else if (d == 4) {
                day = '四';
            } else if (d == 5) {
                day = '五';
            } else if (d == 6) {
                day = '六';
            }
            this.nowTime = year + '年' + month + '月' + date + '日' + ' ' + hh + ':' + mm + ':' + ss;
        },
        nowTimes() {
            this.timeFormate(new Date());
            setInterval(this.nowTimes, 1000);
            this.clear();
        },
        clear() {
            clearInterval(this.nowTimes);
            this.nowTimes = null;
        },
        sendMsg() {
            if (!this.msg) return;
            let data = {
                data: {
                    msg: this.msg,
                    orderId: this.orderId
                },
                op: 'sendPassengerSms'
            };
            this.$axios('/expOrder/select', data).then(res => {
                this.msg = '';
                this.$message.success('发送成功');
            });
        },
        showList() {
            let timer = null;
            if (this.leftVal === 0) {
                timer = setInterval(() => {
                    if (this.leftVal > -228) {
                        this.leftVal = this.leftVal - 4;
                    } else {
                        clearInterval(timer);
                    }
                }, 1);
            } else {
                timer = setInterval(() => {
                    if (this.leftVal < 0) {
                        this.leftVal = this.leftVal + 4;
                    } else {
                        clearInterval(timer);
                    }
                }, 1);
            }
        },
        handleEnded() {
            let msg = this.activeIndex < this.videoList.length - 1 ? '播完了,即将播放下一条视频' : '没有下一条视频了';
            this.$message.info(msg);
            setTimeout(() => {
                if (this.activeIndex < this.videoList.length - 1) {
                    this.activeIndex++;
                    this.videoInfo = this.videoList[this.activeIndex];
                    this.source = this.videoList[this.activeIndex].downLoadUrl;
                }
            }, 3000);
        },
        handleError() {
            console.log('error---------------------------------------------------------------------------');
            this.$message.info('播放出错，即将播放下一条视频');
            setTimeout(() => {
                if (this.activeIndex < this.videoList.length - 1) {
                    this.activeIndex++;
                    this.videoInfo = this.videoList[this.activeIndex];
                    this.source = this.videoList[this.activeIndex].downLoadUrl;
                }
            }, 3000);
        }
    }
};
</script>
<style lang="scss" scoped>
.audioBox {
    padding: 0 20px;
}

.textluyin {
    font-weight: 400;
    color: #606266;
    line-height: 14px;
}
.video-dialog {
    .video-title {
        display: inline-block;
        width: 990px;
        height: 36px;
        line-height: 36px;
        background: #f0f2f5;
        border-radius: 18px;
        padding: 0 20px;
        margin-left: 10px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #303133;
    }
    b {
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #303133;
    }
    .msg {
        height: 48px;
        text-align: center;
        margin-top: 10px;
    }
    /deep/ .el-dialog__wrapper .el-dialog__header {
        padding: 14px 24px;
    }
    /deep/ .el-dialog__body {
        padding: 0 24px 24px !important;
    }
}
.video-box {
    overflow: hidden;
    position: relative;
    .video-list {
        width: 228px;
        height: 100%;
        background: #303133;
        position: absolute;
        top: 0;
        z-index: 9;
        padding: 16px 0;
        color: #fff;
        h4 {
            padding: 0 16px;
            font-size: 16px;
            font-weight: 600;
        }
        .list {
            margin-top: 16px;
            width: 100%;
            height: calc(100% - 80px);
            overflow-y: scroll;
            li {
                padding: 8px 16px;
                cursor: pointer;
                .el-row {
                    height: 40px;
                }
                img {
                    width: 20px;
                    margin: 10px 0;
                }
                p {
                    color: #909399;
                    font-size: 12px;
                }
            }
        }
        .active {
            background: #1f2124;
            p {
                color: #fff !important;
            }
        }
        .list::-webkit-scrollbar-track {
            background: #303133 !important;
        }
        .list::-webkit-scrollbar-thumb {
            background: rgba(144, 147, 153, 1) !important;
        }
        .list::-webkit-scrollbar {
            width: 4px !important;
        }
        .btn {
            width: 20px;
            height: 40px;
            position: absolute;
            background: #111;
            color: #fff;
            line-height: 40px;
            text-align: center;
            opacity: 0.7;
            right: -20px;
            top: calc(50% - 20px);
            border-radius: 0 4px 4px 0;
            cursor: pointer;
        }
    }
}
</style>
