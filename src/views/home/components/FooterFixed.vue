<template>
    <div :class="['fixed-footer', { 'fixed-footer-closed': !isOpened }]">
        <el-button @click="back" style="width: 160px;height: 36px;margin-right: 6px;">{{ name }}</el-button>
        <slot></slot>
    </div>
</template>
 
<script>
import { mapState } from "vuex";
export default {
    name: 'FooterFixed',

    props: {
        name: {
            type: String,
            default: '返回'
        },

        backTo: {
            type: String,
        },
    },

    computed: {
        ...mapState({
            isOpened: (state) => state.app.sidebar.opened,
        }),
    },

    methods: {
        back() {
            this.backTo ? this.$router.push({ path: this.backTo }) : this.$router.go(-1);
        }
    }
}
</script>
 
<style scoped lang="scss">
.fixed-footer {
    box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.04);
    height: 64px;
    line-height: 64px;
    position: fixed;
    right: 0;
    bottom: 0;
    width: calc(100% - 160px);
    background: #fff;
    text-align: center;
    transition: width 0.5s;
}

.fixed-footer-closed {
    width: calc(100% - 80px);
}
</style>