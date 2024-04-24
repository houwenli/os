<template>
    <div class="message-audio" :class="[message.flow === 'out' && 'reserve']" @click.self="play">
        <audio ref="audio" :src="message.payload.url" controls hidden="true"></audio>
        <div class="musicView">
            <span>{{ message.payload.second }}″</span>
            <img :src="audioPause" ref="audioImg" alt="" class="playSuspend" @click.self="play" />
        </div>
    </div>
</template>
<script>
import audioPause from '@/assets/images/chat/audio_pause.png';
import audioPlay from '@/assets/images/chat/audio_play.png';
export default {
    props: {
        message: {
            type: Object,
            default: () => { }
        }
    },
    data () {
        return {
            audioPause,
            audioPlay
        }
    },
    methods: {
        play () {
            const self = this;
            const audioPlayer = this.$refs.audio;
            if (audioPlayer.paused) {
                this.$refs.audioImg.src = this.audioPlay;
                audioPlayer.play();
                audioPlayer.addEventListener('ended', function () {
                    self.$refs.audioImg.src = self.audioPause;
                }, false);
            } else {
                this.$refs.audioImg.src = this.audioPlay;
                audioPlayer.pause();
                audioPlayer.load();
                audioPlayer.addEventListener('ended', function () {
                    self.$refs.audioImg.src = self.audioPause;
                }, false);
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.message-audio {
    display: flex;
    align-items: center;
    position: relative;
    .icon {
        margin: 0 4px;
    }
    audio {
        width: 0;
        height: 0;
    }
}
.reserve {
    flex-direction: row-reverse;
}
.mask {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 1;
}
.musicView {
    display: flex;
    // justify-content: space-between;
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
</style>