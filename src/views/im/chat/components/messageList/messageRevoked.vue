<template>
    <div class="revoke">
        <label v-if="message.flow === 'in'">{{message.nick || message.from}}</label>
        <label v-else>您</label>
        <span>撤回了一条消息</span>
        <span class="edit" v-if="message.flow === 'out' && isEdit" @click="edit">重新编辑</span>
    </div>
</template>

<script>

export default {
    props: {
        message: {
            type: Object,
            default: () => ({}),
        },
        isEdit: {
            type: Boolean,
            default: () => false,
        },
    },
    methods: {
        edit () {
            this.$emit('edit', this.message);
        }
    }
}
</script>
<style lang="scss" scoped>
.revoke {
    display: flex;
    justify-content: center;
    font-size: 13px;
    color: #a5b5c1;
    background: 0 0;
    padding-left: 0;
    padding-right: 0;
    cursor: pointer;
    .edit {
        cursor: pointer;
        padding: 0 5px;
        color: #006eff;
    }
}
</style>
