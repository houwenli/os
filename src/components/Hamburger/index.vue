<template>
    <div @click="toggleClick" :class="isActive ? 'pad' : 'padActive'">
        <i :class="{'is-active':isActive}" class="icon-icon_nava_ex oa-iconfont svg-icon hamburger"></i>
        <span v-if="isActive">收起导航</span>
    </div>
</template>

<script>
export default {
    name: "Hamburger",
    props: {
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        toggleClick() {
            this.$emit("toggleClick");
        },
    },
};
</script>

 <style lang="scss" scoped>
.hamburger {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 40px;
    margin-right: 24px;
    font-size: 21px;
    color: #909399;
    line-height: 41px;
}

.hamburger.is-active {
    transform: rotate(180deg);
    color: #909399;
    padding: 0;
    line-height: 46px;
}
.pad {
    padding: 0 20px;
    background-color: #313f5f;
    line-height: 40px;
    span{
        font-size: 14px;
    }
}
.padActive {
    /* padding: 0 8px; */
    line-height: 30px;
    text-align: center;
    .svg-icon {
        margin-right: 1px !important;
    }
}
</style>
