<!-- 头像展示 -->
<template>
    <div class="head-img-box" :class="other_w ? other_w : ''">
        <img v-if="isOrganiza" src="../image/icon_pros_blue.png" />
        <img v-else-if="imgUrl" :src="imgUrl" />
        <div v-else>{{ getName(headName) }}</div>
    </div>
</template>
<script>
export default {
    props: {
        imgUrl: {
            type: String,
            default: ''
        },
        headName: {
            type: String,
            default: ''
        },
        isOrganiza: {
            type: Boolean,
            default: false
        },
        other_w: {
            type: String,
            default: () => ''
        }
    },
    data(){
        return {
            isWidth: ''
        }
    },
    methods: {
        getName(name){
            return name.substring(0,1)
        }
    }
}
</script>
<style scoped lang="scss">
.head-img-box {
    display: inline-block;
}
.head-img-box div {
    text-align: center;
    background: #0088FF;
    color: #fff;
    display: flex;
    justify-content: center;
}
.head-img-box img,
.head-img-box div {
    width: 24px;
    height: 24px;
    border-radius: 100%;
    font-size: 12px;
    line-height: 24px;
}
.head-img-box.is48w img,
.head-img-box.is48w div {
    width: 48px;
    height: 48px;
    border-radius: 100%;
}
.head-img-box.is48w div{
    line-height: 48px;
    font-size: 16px;
}

.head-img-box.is40w img,
.head-img-box.is40w div{
    width: 40px;
    height: 40px;
}
.head-img-box.is40w div{
    line-height: 40px;
    font-size: 16px;
}
.head-img-box.is32w img,
.head-img-box.is32w div{
    width: 32px;
    height: 32px;
}
.head-img-box.is32w div{
    line-height: 32px;
    font-size: 14px;
}

.head-img-box.is36w img,
.head-img-box.is36w div{
    width: 36px;
    height: 36px;
}
.head-img-box.is36w div{
    line-height: 36px;
    font-size: 14px;
}
</style>