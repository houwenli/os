<template>
    <div class="content-recording">
        <div>
            <label for class="textluyin">录音文件：</label>
            <el-button plain :loading="loading" @click="getAudio" v-if="btnShow" class="dropdownItem">获取录音文件</el-button>
            <audio @canplay="getDuration" ref="audio" controls="controls" v-show="audioShow" type="audio/mpeg"></audio>
            <p v-if="tips">订单无录音文件</p>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        type: Number,
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
        }
    },
    methods: {
		getAudio() {
			let prames = {
                data: JSON.stringify({
                    orderId: this.$route.query.orderId,
                }),
                op: 'downObs'
            }
            let URL = '/expOrder/select'
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
             // 此时可以获取到duration
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
	},
}
</script>
<style scoped>
.content-recording{
	position: relative;
	padding: 30px 0;
}
.textluyin {
    font-weight: 400;
    color: #606266;
    line-height: 14px;
}
/* .dropdownItem {
    color: #f05259;
} */
</style>
