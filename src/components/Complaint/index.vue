<template>
    <!--  -->
    <div @click="complaintClick" :class="isActive ? 'pad' : 'padActive'">
        <i class="icon-icon_ne oa-iconfont svg-icon hamburger"></i>
        <span v-if="isActive">我要投诉</span>
    </div>
</template>

<script>
export default {
    name: 'Hamburger',
    props: {
        isActive: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            moduleName: '/personalComplaint/toComplaint'
        };
    },
    methods: {
        complaintClick() {
            this.$router.push({ name: 'personalComplaint' });
        }
    }
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
    color: #f05259;
    line-height: 36px;
}

.hamburger.is-active {
    color: #f05259;
    padding: 0;
}
.pad {
    padding: 0 18px;
    background-color: #313f5f;
    line-height: 35px;
    span {
        font-size: 14px;
    }
}
.padActive {
    line-height: 38px;
    padding: 0 9px;
    text-align: center;
    border: 1px solid transparent !important;
    .svg-icon {
        margin-right: 3px !important;
    }
}
</style>
