<template>
    <div class="mask" @click.self="toggleView" v-if="show">
        <slot />
    </div>
</template>
  
<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: () => false,
        },
    },
    data() {
        return {}
    },
    methods: {
        toggleView(){
            this.$emit('update:show', !this.show)
        }
    }
  };
</script>
  
<style lang="scss" scoped>
.mask {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 2006;
    background: rgba(#000000, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    main {
        position: relative;
    }
}
</style>
  