<template>
    <div class="content-recording">
        <div v-if="getModulePower('/workbench/mixedOrder').downObsExp">
            <el-button type="primary" :loading="loading" @click="getAudio" v-if="btnShow">获取录音文件</el-button>
            <audio @canplay="getDuration" ref="audio" controls="controls" v-show="audioShow" type="audio/mpeg"></audio>
            <p v-if="tips">订单无录音文件</p>
        </div>
        <div v-if="!getModulePower('/workbench/mixedOrder').downObsExp">暂无权限</div>
    </div>
</template>
<script>
export default {
    props: {
        type: {
            default: null
        },
        orderId: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            btnShow: true,
            audioShow: false,
            tips: false,
            loading: false,
            audioSrc: '',
            duration: '',
            op: {
                downObs: 'downObsExp'
            },
            moduleName: '/workbench/mixedOrder'
        };
    },
    methods: {
        getAudio() {
            let prames = {
                data: JSON.stringify({
                    orderId: this.orderId ? this.orderId : this.$route.query.orderId
                }),
                op: 'downObsExp'
            };
            let URL = this.getModuleUrl(prames.op);
            this.loading = true;
            this.$axios(URL, prames, { responseType: 'arraybuffer' }).catch(buf => {
                this.loading = false;
                if (buf.byteLength < 106) {
                    this.btnShow = false;
                    this.tips = true;
                } else if (buf) {
                    let buffer = buf;
                    let mp3Url = window.URL.createObjectURL(new Blob([buffer], { type: 'audio/mpeg' }));
                    this.audioSrc = mp3Url;
                    this.$refs.audio.src = mp3Url;
                    this.$refs.audio.load();
                }
            });
        },
        getDuration() {
            this.duration = this.$refs.audio.duration;
            if (this.duration < 1) {
                this.btnShow = false;
                this.tips = true;
            } else {
                this.btnShow = false;
                this.audioShow = true;
                this.$refs.audio.play();
            }
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    },

};
</script>
<style scoped>
.content-recording {
    position: relative;
    padding: 30px 0;
}
</style>
