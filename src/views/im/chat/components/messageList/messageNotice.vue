<!-- 群公告 -->
<template>
    <div>
        <div class="notice-title">群公告</div>
        <div class="notice-only" :id="'noticeId' + message.ID" v-html="newTIMCustomElem(message)"></div>
        <div class="search-notice" v-show="messageObj['noticeId' + message.ID] >= 280" @click="showNotice">查看全文</div>
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
            messageObj: {}
        }
    },
    mounted(){
        let secObj = document.getElementById('noticeId' + this.message.ID);
        this.$set(this.messageObj, ['noticeId' + this.message.ID], window.getComputedStyle(secObj).height.replace('px', '') * 1)
    },
    
    methods: {
        // 自定义信息展示
        newTIMCustomElem(item){
            let data;
            try{
                data = JSON.parse(item.payload.data);
            }catch(e){
                
            }
            if(data && data.businessID && data.businessID == 'ws_group_notice'){
                // let secObj = document.getElementById('noticeId' + this.message.ID);
                // this.messageObj['noticeId' + this.message.ID] = window.getComputedStyle(secObj).height.replace('px', '') * 1;
                return data.content.replaceAll('\n', '<br />');
            }
        },
        showNotice(){
            this.$emit('openDrawer', 'notification')
        }
    }
}
</script>
<style scoped>
.notice-only {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box !important;
    -webkit-line-clamp: 14 !important;
    -webkit-box-orient: vertical !important;
}
.search-notice {
    margin-top: 12px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #909399;
    line-height: 20px;
}
.notice-title {
    font-size: 18px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #E6A23C;
    line-height: 25px;
    margin-bottom: 10px;
}
</style>