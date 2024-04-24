<template>
    <div>
        <template v-if="!newImg(message)">
            <img :width="imgInfo.width" :height="imgInfo.height" v-loading="true" />
            <el-progress :text-inside="true" :stroke-width="3" :color="'#F05259'" :percentage="imgFilePercentage"></el-progress>
        </template>
        <template v-else>
            <div v-html="newImg(message)" @click="showImgView(message)"></div>
        </template>
        <ws-image-viewer :srcList="srcList" :visible.sync="isShowImgView"></ws-image-viewer>
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
            isShowImgView: false,
            srcList: [],
            imgFilePercentage: 0, // this.$store.state.im.imgFilePercentage
            imgInfo: {}
        }
    },
    watch: {
        '$store.state.im.imgFilePercentage': function(newV){ // 更新当前会话信息
            const self = this;
            if(newV){
                // console.log(newV)
                let t = Math.round(newV.uploadProgress*100);
                self.imgFilePercentage = t == 100 ? 99 : t;
                let w = newV.width, h = newV.height;
                // 198 为最小缩略图尺寸
                if(newV.width > 198 || newV.height > 198){
                    if(newV.width > newV.height && newV.height > 198){
                        h = 198;
                        w = Math.round((198/newV.height) * newV.width);
                    }else if(newV.width < newV.height && newV.width > 198){
                        w = 198;
                        h = Math.round((198/newV.width) * newV.height);
                    }else if(newV.width >= 400){
                        w = 400
                    }
                    self.imgInfo.width = w;
                    self.imgInfo.height = h;
                }else{
                    self.imgInfo.width = w;
                    self.imgInfo.height = h;
                }
                // console.log('w='+w)
                // console.log('h='+h)
            }
        },
    },
    methods: {
        // 图片信息展示
        newImg (val) {
            let i = val.payload.imageInfoArray.findIndex(({ sizeType }) => sizeType == 3)
            let imgObj = val.payload.imageInfoArray[i];
            let w = imgObj.width;
            let h = imgObj.height;
            if (w > 400) { w = 400 }
            if(w != 0 && h != 0){
                return `<img style='width:${w}px;height:${h}px;' src='${imgObj.imageUrl}'/>`
            }else{
                return false;
            }
        },
        // 图片预览
        showImgView(item){
            this.isShowImgView = true;
            this.srcList = [ item.payload.imageInfoArray[0].imageUrl ]
        },
    }
}
</script>
<style scoped>
/deep/ .el-progress--circle .el-progress__text, 
/deep/ .el-progress--dashboard .el-progress__text{
    margin-left: 38%;
}
</style>