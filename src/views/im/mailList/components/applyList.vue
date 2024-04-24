<template>
    <div class="box_list">
        <div class="t_list">
            <div>好友申请通知</div>
            <div class="sign" @click="refreshBtn">刷新</div>
        </div>
        <div class="t_box">
            <div class="t_content" v-for="(item, index) in dataOptions" :key="index">
                <div class="time">{{ item.firstLetter }}</div>
                <div class="list" v-for="(i, indx) in item.friendApplicationList" :key="indx">
                    <div class="content_left">
                        <div v-if="i.imagePath"><img :src="i.imagePath" @click="firendChange(i.userId, index)" /></div>
                        <div class="nameIcon" @click="firendChange(i.userId, index)" v-else>{{ i.name.slice(0, 1) }}</div>
                        <div class="left_on">
                            <div>
                                <span>{{ i.name }}</span>
                                <span>{{ i.departmentName }}-{{ i.positionName }}</span>
                            </div>
                            <div v-if="(i.initiatorType == 0 && i.applicationStatus == 1) || (i.initiatorType == 1 && i.applicationStatus == 1) || (i.initiatorType == 1 && i.applicationStatus == 0) || (i.initiatorType == 0 && i.applicationStatus == 0)">
                                {{ i.applicationRemark }}
                            </div>
                            <div v-if="(i.initiatorType == 0 && i.applicationStatus == 2) || (i.initiatorType == 1 && i.applicationStatus == 2)">{{ i.refuseRemark }}</div>
                        </div>
                    </div>
                    <div class="content_right" v-if="i.initiatorType == 0 && i.applicationStatus == 0">等待添加</div>
                    <div class="content_right" v-if="i.initiatorType == 0 && i.applicationStatus == 1">对方已添加</div>
                    <div class="content_right" v-if="i.initiatorType == 0 && i.applicationStatus == 2">对方已拒绝</div>
                    <div class="content_right" v-if="i.initiatorType == 1 && i.applicationStatus == 1">我已添加</div>
                    <div class="content_right" v-if="i.initiatorType == 1 && i.applicationStatus == 2">我已拒绝</div>
                    <div class="content_right_1" v-if="i.initiatorType == 1 && i.applicationStatus == 0">
                        <div class="sign" @click="refused(i)">拒绝</div>
                        <div class="sign" @click="add(i)">添加</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="addFriend">
            <el-dialog title="添加好友" :visible.sync="addFriendVisible" width="40%" :before-close="addFriendClose">
                <div class="block">
                    <div class="remark">备注：</div>
                    <el-input class="textarea" type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" placeholder="请输入" v-model.trim="applicationRemark" maxlength="50" show-word-limit></el-input>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addFriendVisible = false">取消</el-button>
                    <el-button type="primary" @click="addConfirm">确定</el-button>
                </span>
            </el-dialog>
        </div>
        <div class="addFriend">
            <el-dialog title="拒绝原因" :visible.sync="refuseFriendVisible" width="40%" :before-close="refuseFriendClose">
                <div class="block">
                    <div class="remark">备注：</div>
                    <el-input
                        class="textarea"
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 4 }"
                        placeholder="请输入拒绝原因"
                        v-model.trim="refuseRemark"
                        maxlength="50"
                        show-word-limit
                    ></el-input>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="refuseFriendVisible = false">取消</el-button>
                    <el-button type="primary" @click="refuseConfirm">确定</el-button>
                </span>
            </el-dialog>
        </div>
        <personMsg :dialogVisible="dialogVisible" @getCancel="getCancel" @getConfirm="getConfirm" ref="person"></personMsg>
    </div>
</template>
<script>
import head_user from '@/assets/images/chat/head_user.png';
import personMsg from './personMsg.vue';
export default {
    components: {
        personMsg,
    },
    data() {
        return {
            head_user,
            addFriendVisible: false,
            applicationRemark: '',
            refuseFriendVisible: false,
            refuseRemark: '',
            moduleName: '/mailList',
            dataOptions: [],
            friendApplicationId: null,
            dialogVisible: false,
        };
    },
    mounted() {
        this.applyList();
    },
    methods: {
        refreshBtn() {
            this.$parent.applyCount();
            this.applyList();
        },
        applyList() {
            const op = 'selectFriendApplicationRecord';
            let data = {
                data: {
                    name: null,
                    pageSize: null,
                    currentPage: null,
                },
                op,
            };
            let URL = this.$getModuleUrl(this.moduleName, op);
            this.$axios(URL, data).then(res => {
                let data = JSON.parse(res.data) || [];
                this.dataOptions = data;
                // console.log(this.dataOptions);
            });
        },
        //查看个人信息
        firendChange(id) {
            this.dialogVisible = true;
            this.$refs.person.mesList(id);
        },
        getCancel() {
            this.dialogVisible = false;
        },
        getConfirm() {
            this.applyList();
        },
        // 添加
        add(options) {
            const op = 'approvalFriendApplication';
            let data = {
                data: {
                    friendApplicationId: options.friendApplicationId,
                    applicationStatus: 1,
                    applicationRemark: this.applicationRemark,
                },
                op,
            };
            let URL = this.$getModuleUrl(this.moduleName, op);
            this.$axios(URL, data).then(res => {
                if (res.code == 1) {
                    this.$message.success(res.msg);
                    this.addFriendVisible = false;
                    this.applyList();
                    this.$parent.applyCount();
                }
            });
        },
        // 拒绝
        refused(options) {
            this.friendApplicationId = options.friendApplicationId;
            this.refuseFriendVisible = true;
        },
        addFriendClose() {
            this.addFriendVisible = false;
        },
        refuseFriendClose() {
            this.refuseFriendVisible = false;
        },
        addConfirm() {
            const op = 'approvalFriendApplication';
            let data = {
                data: {
                    friendApplicationId: this.friendApplicationId,
                    applicationStatus: 1,
                    applicationRemark: this.applicationRemark,
                },
                op,
            };
            let URL = this.$getModuleUrl(this.moduleName, op);
            this.$axios(URL, data).then(res => {
                if (res.code == 1) {
                    this.$message.success(res.msg);
                    this.addFriendVisible = false;
                    this.applyList();
                    this.$parent.applyCount();
                }
            });
        },
        refuseConfirm() {
            const op = 'approvalFriendApplication';
            let data = {
                data: {
                    friendApplicationId: this.friendApplicationId,
                    applicationStatus: 2,
                    refuseRemark: this.refuseRemark,
                },
                op,
            };
            let URL = this.$getModuleUrl(this.moduleName, op);
            this.$axios(URL, data).then(res => {
                if (res.code == 1) {
                    this.$message.success(res.msg);
                    this.refuseFriendVisible = false;
                    this.applyList();
                    this.$parent.applyCount();
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.box_list {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
}
.t_box {
    overflow: auto;
    padding: 0px 16px 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
}
.t_list {
    margin: 0px 16px;
    border-bottom: 1px solid #ebeef5;
    line-height: 73px;
    height: 73px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div:nth-child(1) {
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #303133;
    }
    div:nth-child(2) {
        width: 96px;
        height: 36px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #909399;
        line-height: 36px;
        text-align: center;
        cursor: pointer;
    }
}
.nameIcon {
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
.t_content {
    // display: flex;
    // flex-direction: column;
    // overflow-x: hidden;
    // overflow-y: auto;
    .time {
        text-align: center;
        padding-top: 16px;
    }
    .list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        padding: 15px;
        cursor: pointer;
        .content_left {
            display: flex;
            align-items: center;
            img {
                width: 48px;
                height: 48px;
            }
            .left_on {
                margin-left: 10px;
                div:nth-child(1) {
                    span:nth-child(1) {
                        font-size: 16px;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: #303133;
                        line-height: 22px;
                    }
                    span:nth-child(2) {
                        font-size: 14px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #606266;
                        line-height: 20px;
                        margin-left: 12px;
                    }
                }
                div:nth-child(2) {
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #909399;
                    line-height: 20px;
                    margin-top: 2px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-top: 5px;
                }
            }
        }
        .sign {
            cursor: pointer;
        }
        .content_right {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #909399;
            line-height: 20px;
        }
        .content_right_1 {
            margin-left: 10px;
            display: flex;
            div:nth-child(1) {
                width: 96px;
                height: 36px;
                background: #ffffff;
                border-radius: 4px;
                border: 1px solid #dcdfe6;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #909399;
                line-height: 36px;
                text-align: center;
            }
            div:nth-child(2) {
                margin-left: 10px;
                width: 96px;
                height: 36px;
                background: #f05259;
                border-radius: 4px;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #ffffff;
                line-height: 36px;
                text-align: center;
            }
        }
        &:hover {
            transition: 300ms;
            background: #f5f7fa !important;
        }
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
/deep/ .el-dialog__header {
    height: 57px;
    padding: 24px 15px 10px;
}
/deep/ .el-dialog__body {
    padding: 15px;
}
/deep/ .el-dialog__title {
    font-size: 18px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
    line-height: 18px;
}
/deep/ .el-dialog__close {
    font-size: 24px;
}
.active {
    transition: 300ms;
    background: #f5f7fa !important;
}
</style>