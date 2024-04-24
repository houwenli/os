<template>
    <!-- 邀请是否需要审批 -->
    <div class="pin-box">
        <div class="switch-box">
            <span>邀请是否需要审批</span>
            <el-switch
                :disabled="true"
                v-model="interfaceInfo.toJoinSwitch === 1 ? true : false"
                active-color="#0088FF"
                @click.native="updateJoinOption()"
                inactive-color="#DCDFE6">
            </el-switch>
        </div>
        <div v-if="interfaceInfo.toJoinSwitch === 1" class="user-box" @click="openApplyJoin()">
            <span>加入申请<span class="tip">{{interfaceInfo.toJoinCount || 0}}</span></span>
            <i class="el-icon-arrow-right"></i>
        </div>
        <ApplyJoinList :applyJoinDrawer.sync="applyJoinDrawer" v-bind="{...$attrs}"></ApplyJoinList>
    </div>
</template>
<script>
import IM from '../../../../../../utils/tim/tim';
import ApplyJoinList from './applyJoinList';
export default {
    props: {
        interfaceInfo: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        ApplyJoinList
    },
    data() {
        return {
            applyJoinDrawer: false,
        }
    },
    watch: {
        'interfaceInfo': {
            handler(newV, oldV){
            },
            immediate: true,
            deep: true,
        }
    },
    methods: {
        openApplyJoin(){
            this.applyJoinDrawer = true
        },
        // 查询加群人数
        // queryGroupOtherInfo(){
        //     const self = this;
        //     const moduleName = '/chat'
        //     const op = 'queryGroupOtherInfo';
        //     let data = {
        //         data: {
        //             'groupId': self.$attrs.conversationID.replace('GROUP', ''),
        //         },
        //         op,
        //     };
        //     let URL = self.$getModuleUrl(moduleName, op);
        //     this.$axios(URL, data).then((res) => {
        //         console.log(res)
        //         self.interfaceInfo = JSON.parse(res.data);
        //     });
        // },
        // 更新
        updateJoinOption(){
            const self = this;
            let groupID = self.$attrs.conversationID.replace('GROUP', '');
            let options = {
                groupID,
                joinOption: self.interfaceInfo.toJoinSwitch === 1 
                    ? IM.TIM.TYPES.JOIN_OPTIONS_FREE_ACCESS 
                    : IM.TIM.TYPES.JOIN_OPTIONS_NEED_PERMISSION 
            }
            IM.updateGroupProfile(options)
            .then(async function(imResponse) {
                let msg = `群主已${self.interfaceInfo.toJoinSwitch === 1 ? "关闭" : "开启"}邀请审批操作`
                self.$emit('queryGroupOtherInfo')
                const moduleName = '/chat'
                const op = 'sendGroupMsg';
                let data = {
                    data: {
                        "toGroupId": groupID,
                        "msgType":2,
                        "businessID":"ws_group_tips",
                        "msg": msg,
                        "toAccountType":1,
                        "customMsg":{
                            "businessID":"ws_group_tips",
                            "content": msg}
                        },
                    op,
                };
                let URL = self.$getModuleUrl(moduleName, op);
                let res = await self.$axios(URL, data)
                console.warn('邀请是否需要审批', imResponse); 
                // 置顶会话成功
            }).catch(function(imError) {
                console.warn('邀请是否需要审批', imError); // 置顶会话失败的相关信息
            });
        } 
    }
}
</script>
<style scoped lang="scss">
.pin-box {
    background: #F5F7FA;
    border-radius: 4px;
    
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
    padding: 0 16px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    .switch-box {
        height: 70px;
        line-height: 70px;
        display: flex;
        align-items: center;
    }
    .user-box {
        height: 60px;
        line-height: 60px;
        display: flex;
        align-items: center;
        cursor: pointer;
        span {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #606266;
            .tip {
                width: 24px;
                height: 18px;
                background: #F05259;
                border-radius: 9px;
                padding: 0px 6px;
                color: #fff;
                margin-left: 14px;
                font-size: 12px;
            }
        }
    }
    span {
        flex: 1;
    }
    /deep/.el-switch.is-disabled .el-switch__core,
    /deep/.el-switch.is-disabled .el-switch__label {
        cursor: pointer;
    }
}
</style>