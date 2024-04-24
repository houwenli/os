<template>
    <div>
        <el-dialog title="播放视频" :visible.sync="visible" :before-close="close" width="60%" :append-to-body='true'>
            <div class="videoWrap">
                <vue-core-video-player ref="video" :src="videoUrl" @pause="pauseFunc" autoplay></vue-core-video-player>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'playVideoDia',
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        videoUrl: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            moduleName: '/imsystem/messageManage',
        };
    },

    mounted() {},
    methods: {
        pauseFunc() {
            this.$refs.video.pause();
        },
        close() {
            this.pauseFunc();
            this.$emit('update:visible', false);
        },
    },
};
</script>
<style lang="scss" scoped>
.videoWrap {
    width: 100%;
    height: 500px;
    overflow: hidden;
}
</style>
