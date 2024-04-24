<template>
    <div class="imgCarousel">
        <el-carousel :autoplay="false" ref="carousel" indicator-position="none" @change="changeOffset">
            <el-carousel-item v-for="(item, index) in imgList" :key="index" @click.native="enlarge(index)">
            <div class="img_container">
                <div class="img_content">
                  <img :src="item.cdnUrl" alt="">
                </div>
            </div>
            </el-carousel-item>
        </el-carousel>
        <div class="imgList">
            <ul :style="{'left': imgOffset+'px'}">
                <li v-for="(item, index) in imgList" :key="index">
                    <img :src="item.cdnUrl" @click="changeImg(index)">
                </li>
            </ul>
        </div>
        <div class="imgName">{{imgName}}</div>
        <ws-image-viewer :srcList="imgUrlList" :visible="visible" :currentIndex="currentIndex" :onClose="closeView" />
    </div>
</template>

<script>
export default {
    data(){
        return {
            imgOffset: 210,
            imgUrlList: [],
            imgName: '',
            visible: false,
            currentIndex: 0,
        }
    },
    props: ["imgList"],
    methods: {
        changeImg(index){
            this.$refs.carousel.setActiveItem(index);
            this.imgName = this.imgList[index].alias;
        },
        changeOffset(newIndex, oldIndex){
            this.imgOffset = 210 - newIndex * 65;
            this.imgName = this.imgList[newIndex].alias;
        },
        enlarge(index){
            this.currentIndex = index;
            this.visible = true;
        },
        closeView(){
            this.visible = false;
        },
    },
    watch: {
        imgList: {
            handler(newVal){
                this.imgName = newVal[0] && newVal[0].alias;
                this.imgUrlList = newVal.map(item => {
                    return item.cdnUrl;
                })
            },
            immediate: true
        }
    }
};
</script>

<style scoped lang="scss">
.imgCarousel {
    overflow: auto;
    width: 468px;
    height: 710px;
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    .el-carousel {
        /deep/ .el-carousel__container {
            height: 623px;
            background-color: rgba(53, 53, 53, 0.75);
        }
    }
    img {
        width: 100%;
        height: auto;
    }
     .img_container {
                width: 100%;
                height: 640px;
                display: flex;
                flex-direction: column;
                padding-top: 62px;
                .img_content {
                    width: 100%;
                    height: 516px;
                    margin: 0 auto;
                }
                img {
                    object-fit: contain;
                    width: 100%;
                    height: 100%;
                }
                .img_title {
                    font-size: 14px;
                    color: #fff;
                    height: 48px;
                    line-height: 48px;
                    text-align: center;
                    margin-top: 14px;
                }
            }
    .imgList {
        position: absolute;
        width: 100%;
        height: 87px;
        bottom: 0;
        background-color: rgba(53, 53, 53, 0.85);
        z-index: 10;
        padding: 5px 6px 2px;
        user-select: none;
        ul {
            box-sizing: border-box;
            height: 87px;
            display: flex;
            align-items: center;
            overflow: auto;
            overflow-y: hidden;
            position: absolute;
            transition: all 0.5s;
            &::-webkit-scrollbar {
                display: none;
            }
            li {
                & + li {
                    margin-left: 6px;
                }
                img {
                    width: 58px;
                    height: 76px;
                    cursor: pointer;
                }
            }
        }
    }
    .imgName{
        position: absolute;
        z-index: 10;
        color: #ccc;
        bottom: 80px;
        left: 50%;
        width: 100%;
        text-align: center;
        height: 48px;
        line-height: 48px;
        background-color: rgba(53, 53, 53, 0.85);
        transform: translateX(-50%);
    }
}
</style>