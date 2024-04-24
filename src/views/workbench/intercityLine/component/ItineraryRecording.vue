<template>
    <div class="content-recording">
        <div v-if="oaPowerList.downObs">
            <el-button type="primary" :loading="loading" @click="getAudio" v-if="btnShow">获取录音文件</el-button>
            <audio @canplay="getDuration" ref="audio" controls="controls" v-show="audioShow" type="audio/mpeg"></audio>
            <p v-if="tips">订单无录音文件</p>
        </div>
        <div v-if="!oaPowerList.downObs">暂无权限</div>
    </div>
</template>
<script>
export default {
    props: {
        type: String,
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
			audioSrc:'',
            duration: '',
			op: {
				downObs: 'downObs',
			},
			moduleName: '',
        }
    },
    methods: {
		getAudio() {
			let prames = {
                data: JSON.stringify({
                    orderId: this.orderId ? this.orderId : this.$route.query.orderId,  
                }),
                op: 'downObs'
            }
            let URL = this.getModuleUrl(prames.op)
            this.loading = true;
            this.$axios(URL, prames,{responseType: 'arraybuffer',}).catch(buf=>{
                this.loading = false;
                if (buf.byteLength < 106) {
                    this.btnShow = false;
                    this.tips = true;
                } else if(buf){
					let buffer = buf;
                    let mp3Url = window.URL.createObjectURL(
                        new Blob([buffer], { type: "audio/mpeg" })
                    );
                    this.audioSrc = mp3Url;
                    this.$refs.audio.src = mp3Url;
                    this.$refs.audio.load();
				}
			})
		},
        getDuration() {
            this.duration = this.$refs.audio.duration;
            if(this.duration < 1) {
                this.btnShow = false;
                this.tips = true;
            } else {
                this.btnShow = false;
                this.audioShow = true;
                this.$refs.audio.play();
            }
        },
		getModuleUrl (op) {
			return this.$getModuleUrl(this.moduleName, op);
		}
	},
    mounted() {
        if(this.type == 1) {
            this.moduleName = '/order/real-time'
        } else if (this.type == 2) {
            this.moduleName = '/order/subscribe'
        } else if (this.type == 3) {
            this.moduleName = '/order/scan-code'
        } else if (this.type == 4) {
            this.moduleName = '/order/free-ride'
        }
    }
}
</script>
<style scoped>
.content-recording{
	position: relative;
	padding: 30px 0;
}
</style>