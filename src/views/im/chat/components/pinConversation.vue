<template>
    <!-- 会话置顶 -->
    <div class="pin-box">
        <span>会话置顶</span>
        <el-switch
            :disabled="true"
            v-model="isPinned"
            active-color="#0088FF"
            @click.native="pinConversation()"
            inactive-color="#DCDFE6">
        </el-switch>
    </div>
</template>
<script>
import IM from '../../../../utils/tim/tim'
export default {
    data() {
        return {
            isPinned: this.$attrs.isPinned,
        }
    },
    watch: {
        '$attrs.isPinned': function(newV, oldV){
            this.isPinned = newV
        }
    },
    methods: {
        pinConversation(){
            const self = this;
            IM.pinConversation({ conversationID: this.$attrs.conversationID, isPinned: !this.$attrs.isPinned })
            .then(function(imResponse) {
                // 置顶会话成功
            }).catch(function(imError) {
                console.warn('会话置顶失败', imError); // 置顶会话失败的相关信息
            });
        } 
    }
}
</script>
<style scoped lang="scss">
.pin-box {
    height: 70px;
    background: #F5F7FA;
    border-radius: 4px;
    line-height: 70px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
    padding: 0 16px 24px;
    margin-bottom: 16px;
    display: flex;
    span {
        flex: 1;
    }
    /deep/.el-icon-arrow-right{
        margin-top: 27px;
        margin-right: -5px;
    }
    /deep/.el-switch{
        margin-top: 25px;
    }
    /deep/.el-switch.is-disabled .el-switch__core,
    /deep/.el-switch.is-disabled .el-switch__label {
        cursor: pointer;
    }
}
</style>