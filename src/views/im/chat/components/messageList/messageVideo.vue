<template>
    <div class="message-video">
        <div class="message-video-box" :class="[!messageData.progress && messageData.message.status === 'success' && 'message-video-cover']" @click="toggleShow">
            <img class="message-img" :class="[isWidth ? 'isWidth' : 'isHeight']" :src="messageData.snapshotUrl" alt="" v-if="messageData.snapshotUrl && !messageData.progress" />
            <video v-else :src="messageData.url"></video>
            <div class="progress" v-if="messageData.progress">
                <progress :value="messageData.progress" max="1"></progress>
            </div>
        </div>
        <div class="dialog-video" v-if="show" @click.self="toggleShow">
            <header>
                <i class="el-icon-circle-close" @click.stop="toggleShow"></i>
            </header>
            <div class="dialog-video-box" @click.self="toggleShow">
                <video :class="[isWidth ? 'isWidth' : 'isHeight']" :src="messageData.url" controls autoplay></video>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        message: {
            type: Object,
            default: () => ({}),
        },
    },
    data () {
        return {
            messageData: {},
            show: false,
        }
    },
    watch: {
        message: {
            handler(newV, oldV){
                if(newV){
                    this.messageData = {
                        progress: newV?.status === 'unSend' && newV?.progress,
                        url: newV?.payload?.videoUrl,
                        snapshotUrl: newV?.payload?.snapshotUrl,
                        message: newV,
                    }
                }
            },
            immediate: true,
            deep: true,
        }
    },
    computed: {
        isWidth: function () {
            const { snapshotWidth = 0, snapshotHeight = 0 } = this.messageData?.message?.payload;
            return snapshotWidth >= snapshotHeight;
        }
    },
    methods: {
        toggleShow () {
            if (!(this.message).progress) {
                this.show = !this.show;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.message-video {
    position: relative;
    &-cover {
        display: inline-block;
        position: relative;
        &::before {
            position: absolute;
            z-index: 1;
            content: '';
            width: 0px;
            height: 0px;
            border: 15px solid transparent;
            border-left: 20px solid #ffffff;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            margin: auto;
        }
        video {
            max-width: 300px;
        }
    }

    .progress {
        position: absolute;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        padding: 0 20px;
        left: 0;
        top: 0;
        background: rgba(#000000, 0.5);
        display: flex;
        align-items: center;
        progress {
            color: #006eff;
            appearance: none;
            border-radius: 0.25rem;
            background: rgba(#ffffff, 1);
            width: 100%;
            height: 0.5rem;
            &::-webkit-progress-value {
                background-color: #006eff;
                border-radius: 0.25rem;
            }
            &::-webkit-progress-bar {
                border-radius: 0.25rem;
                background: rgba(#ffffff, 1);
            }
            &::-moz-progress-bar {
                color: #006eff;
                background: #006eff;
                border-radius: 0.25rem;
            }
        }
    }
}
.dialog-video {
    position: fixed;
    z-index: 12;
    width: 100vw;
    height: calc(100vh);
    background: rgba(#000000, 0.3);
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    header {
        display: flex;
        justify-content: flex-end;
        width: 100%;
        box-sizing: border-box;
        padding: 10px 10px;
        .el-icon-circle-close{
            font-size: 50px;
            margin-top: 50px;
            margin-right: 50px;
            position: absolute;
        }
    }
    &-box {
        display: flex;
        flex: 1;
        max-height: 100%;
        padding: 6rem;
        box-sizing: border-box;
        justify-content: center;
        align-items: center;
        video {
            max-width: 100%;
            max-height: 100%;
        }
    }
}

.isWidth {
    width: 100%;
}
.isHeight {
    height: 100%;
}
</style>