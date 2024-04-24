<template>
    <div>
        <el-drawer :title="'加入申请'" :size="'512px'" 
            :before-close="closeDrawer"
            :append-to-body="false" :modal="false" :visible.sync="applyJoinDrawer">
            <div class="list-box" v-for="(item, index) in applyJoinList" :key="index">
                <div class="time">{{item.dateString}}</div>
                <div class="content" v-for="(itemc, indexc) in item.list" :key="indexc">
                    <div class="list-left">
                        <div class="user">{{itemc.title}}</div>
                        <div class="tip" :class="{'doubble': itemc.status === 1}">{{itemc.applyJoinReason}}</div>
                    </div>
                    <div v-if="itemc.status === 1" class="list-right red" @click="operateJoinApply(itemc.id, 2)">同意</div>
                    <div v-if="itemc.status === 1" class="list-right red" @click="operateJoinApply(itemc.id, 3)">拒绝</div>
                    <div v-else-if="itemc.status === 2" class="list-right">已同意</div>
                    <div v-else-if="itemc.status === 3" class="list-right">已拒绝</div>
                    <div v-else-if="itemc.status === 4" class="list-right">已过期</div>
                </div>
                
            </div>
        </el-drawer>
    </div>
</template>
<script>
export default {
    props: {
        applyJoinDrawer: {
            type: Boolean,
            default: () => false
        }
    },
    watch: {
        'applyJoinDrawer': function(newV, oldV){
            if(newV){
                this.findGroupApplylogList()
            }
        }
    },
    data() {
        return {
            applyJoinList: []
        }
    },
    mounted(){
        // console.log('this.$attrs', this.$attrs)
    },
    methods: {
        // 审核
        operateJoinApply(id, operateType){
            const self = this;
            const moduleName = '/chat'
            const op = 'operateJoinApply';
            let data = {
                data: {
                    id,
                    operateType
                },
                op,
            };
            let URL = self.$getModuleUrl(moduleName, op);
            this.$axios(URL, data).then((res) => {
                self.findGroupApplylogList();
            });
        },
        // 关闭抽屉
        closeDrawer(){
            this.$store.commit("im/UPDATE_ISAPPLYJOIN", true)
            this.$emit('update:applyJoinDrawer', false)
        },
        // 获取申请列表
        findGroupApplylogList(){
            const self = this;
            const moduleName = '/chat'
            const op = 'findGroupApplylogList';
            let data = {
                data: {
                    'groupId': self.$attrs.conversationID.replace('GROUP', ''),
                },
                op,
            };
            let URL = self.$getModuleUrl(moduleName, op);
            this.$axios(URL, data).then((res) => {
                // console.log(res)
                if(res.code === 1){
                    self.applyJoinList = JSON.parse(res.data);
                }
            });
        }
    }
}
</script>
<style scoped lang="scss">
.list-box{
    display: flex;
    flex-direction: column;
    flex: 1;
    .time {
        height: 17px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #909399;
        line-height: 17px;
        text-align: center;
        margin-bottom: 16px;
    }
    .content {
        display: flex;
        flex: 1;
        align-items: center;
        background: #F5F7FA;
        padding: 12px;
        border-radius: 4px;
        margin-bottom: 12px;
        .list-left {
            display: flex;
            flex-direction: column;
            flex: 1;
            .user {
                font-size: 14px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #303133;
                line-height: 20px;
            }
            .tip {
                margin-top: 4px;
                max-width: 336px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #909399;
                line-height: 17px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .doubble {
                max-width: 250px;
            }
        }
        
        .list-right {
            width: 96px;
            height: 36px;
            border-radius: 4px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #909399;
            line-height: 14px;
            line-height: 36px;
            text-align: center;
            cursor: pointer;
        }
        .red{
            background: #F05259;
            margin-right: 5px;
            color: #FFFFFF;
        }
    }
}
</style>