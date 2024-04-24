<template>
    <div>
        <div class="personM">
            <el-dialog title="个人信息" :visible.sync="visible" width="28%" :before-close="handleClose">
                <div style="max-height:470px; overflow-y: auto; padding-right: 10px;">
                    <div class="content">
                        <div v-if="dataMsgs.imagePath"><img :src="dataMsgs.imagePath" /></div>
                        <div class="nameIcon1" v-else>{{ dataMsgs.name ? dataMsgs.name.slice(0, 1) : '' }}</div>
                        <div class="left_1">
                            <div>
                                <span>{{ dataMsgs.name }}</span>
                            </div>
                            <div>ID：{{ dataMsgs.id }}</div>
                        </div>
                    </div>
                    <div class="line"></div>
                    <div class="con-1">
                        <div>基本信息</div>
                        <div>
                            <span>工号</span>
                            <span>{{ dataMsgs.code }}</span>
                        </div>
                        <div>
                            <span>状态</span>
                            <div class="txy">
                                <p>{{ dataMsgs.employeeStatusStr }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="line"></div>
                    <div class="con-2">
                        <div>组织信息</div>
                        <div v-for="(item, index) in dataMsgs.userDeptPositVoList" :key="index">
                            <div class="y" style="margin-top: 16px">
                                <div class="left_y" v-if="item.partTime == 2">主职</div>
                                <div class="left_y" v-if="item.partTime == 1">兼任</div>
                                <div class="right_y">{{ item.positName }}</div>
                            </div>
                            <div class="L">
                                <div></div>
                                <div class="text_y">{{ item.deptName }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addFriend(dataMsgs.id)" v-if="dataMsgs.addBuddyVisible && !dataMsgs.isFriend" :disabled="dataMsgs.addBuddySetAsh">加好友</el-button>
                    <el-button @click="relieve(dataMsgs.id)" v-if="dataMsgs.isFriend">解除好友</el-button>
                    <el-button type="primary" @click="getConversationProfile(dataMsgs.id)" v-if="dataMsgs.sessionVisible">发消息</el-button>
                </span>
            </el-dialog>
        </div>
        <div class="addFriend">
            <el-dialog title="添加好友" :visible.sync="addFriendVisible" width="40%" :before-close="addFriendClose">
                <div class="block">
                    <div class="remark">备注：</div>
                    <el-input class="textarea" type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" placeholder="请输入" v-model.trim="applicationRemark" maxlength="50" show-word-limit></el-input>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addCancel">取消</el-button>
                    <el-button type="primary" @click="addConfirm">确定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import IM from '@/utils/tim/tim';
export default {
    props: {
        dialogVisible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            moduleName: '/mailList',
            addFriendVisible: false,
            visible: this.dialogVisible,
            targetId: '',
            applicationRemark: null,
            dataMsgs: {},
            id: '',
        };
    },
    watch: {
        dialogVisible: {
            handler: function (val) {
                this.visible = val;
            },
            immediate: true,
        },
    },
    methods: {
        // 添加好友
        addFriend(id) {
            this.targetId = id;
            this.$parent.getCancel();
            this.addFriendVisible = true;
        },
        mesList(id) {
            const op = 'selectUserHomePage';
            let data = {
                data: {
                    id: id,
                },
                op,
            };
            let URL = this.$getModuleUrl(this.moduleName, op);
            this.$axios(URL, data)
                .then(res => {
                    if (res.code == 1) {
                        let data = JSON.parse(res.data) || {};
                        this.dataMsgs = data;
                    }
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        },
        addCancel() {
            this.addFriendVisible = false;
            this.applicationRemark = ''
        },
        addConfirm() {
            const op = 'addFriendApplication';
            let data = {
                data: {
                    targetId: this.targetId,
                    applicationRemark: this.applicationRemark,
                },
                op,
            };
            let URL = this.$getModuleUrl(this.moduleName, op);
            this.$axios(URL, data).then(res => {
                if (res.code == 1) {
                    this.$message.success(res.msg);
                    this.addFriendVisible = false;
                    this.$emit('getConfirm');
                    this.applicationRemark = ''
                }
            });
        },
        relieve(id) {
            let data = {
                userId: id,
            };
            this.$confirm('是否解除好友关系？', '解除好友', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true,
            }).then(() => {
                this.$axios(this.powerList['deleteFriendByUserId'], {
                    data,
                    op: 'deleteFriendByUserId',
                })
                    .then(() => {
                        this.$message.success('解除成功');
                        this.$parent.getCancel();
                        this.$emit('getConfirm');
                    })
                    .catch(err => {
                        console.log('err', err);
                    });
            });
        },
        // 发消息
        getConversationProfile(id) {
            console.log(id);
            this.id = id;
            this.$router.push({ path: '/chat' });
            this.message();
            this.handleClose()
        },
        message() {
            let id = this.id;
            const self = this;
            setTimeout(() => {
                IM.getConversationProfile({ id })
                    .then(function (imResponse) {
                        self.$emit('close');
                        // 获取成功
                        IM.handleCurrentConversation(self, true, imResponse.data.conversation);
                    })
                    .catch(function (imError) {
                        console.warn('getConversationProfile error:', imError); // 获取会话资料失败的相关信息
                    });
            }, 1000);
        },
        handleClose() {
            this.$emit('getCancel');
        },
        addFriendClose() {
            this.addFriendVisible = false;
        },
    },
};
</script>
<style lang="scss" scoped>
.nameIcon1 {
    border: 1px border #0088ff;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #0088ff;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
    }
}
.personM {
    .content {
        display: flex;
        img {
            width: 56px;
            height: 56px;
        }
        .left_1 {
            margin-left: 10px;
            div:nth-child(1) {
                padding-top: 2px;
                span:nth-child(1) {
                    font-size: 18px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #303133;
                    line-height: 25px;
                }
            }
            div:nth-child(2) {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #909399;
                line-height: 20px;
                margin-top: 5px;
            }
        }
    }
    .line {
        margin-top: 16px;
        border-bottom: 1px solid #ebeef5;
    }
    .con-1 {
        padding-top: 16px;
        div:nth-child(1) {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #303133;
            line-height: 22px;
            margin-bottom: 12px;
        }
        div:nth-child(2) {
            display: flex;
            justify-content: space-between;
            padding-bottom: 12px;
            span:nth-child(1) {
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #909399;
                line-height: 22px;
            }
            span:nth-child(2) {
                height: 22px;
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #303133;
                line-height: 22px;
            }
        }
        div:nth-child(3) {
            display: flex;
            justify-content: space-between;
            span:nth-child(1) {
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #909399;
                line-height: 22px;
            }
            .txy {
                width: 59px;
                height: 28px;
                background: #ecf5ff;
                border-radius: 4px;
                line-height: 28px;
                p {
                    font-size: 14px;
                    text-align: center;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    margin-left: 15px;
                    color: #409eff;
                }
            }
        }
    }
    .con-2 {
        padding-top: 12px;
        div:nth-child(1) {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #303133;
            line-height: 22px;
        }
        .y {
            display: flex;
            justify-content: space-between;
            .left_y {
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #909399;
            }
            .right_y {
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #303133;
            }
        }
        .L {
            display: flex;
            justify-content: space-between;
            margin-top: 4px;
        }
        .text_y {
            font-size: 14px;
            width: 220px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #909399;
            line-height: 20px;
            text-align: right;
        }
    }
    /deep/ .el-dialog__header {
        padding: 24px 24px 0px;
    }
    /deep/ .el-dialog__body {
        padding: 40px 24px 15px;
    }
    /deep/ .el-dialog__footer {
        padding: 15px;
        padding-top: 0px;
    }
    /deep/ .el-button--default {
        width: 120px;
        height: 36px;
        border: 1px solid #dcdfe6;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: #606266;
        line-height: 16px;
    }
    /deep/ .el-button--primary {
        width: 120px;
        height: 36px;
        background: #f05259;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 14px;
    }
}
.addFriend {
    .block {
        display: flex;
        .remark {
            width: 50px;
            margin-top: 10px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #606266;
            line-height: 14px;
        }
    }
    /deep/ .el-button--default {
        width: 96px;
        height: 36px;
        border: 1px solid #dcdfe6;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: #606266;
        line-height: 16px;
    }
    /deep/ .el-button--primary {
        width: 96px;
        height: 36px;
        background: #f05259;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 14px;
    }
}
</style>