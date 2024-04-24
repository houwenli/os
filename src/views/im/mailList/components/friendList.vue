<template>
    <div class="box_list">
        <div class="t_list">我的好友</div>
        <div class="t_box">
            <div class="t_content" v-for="(item, index) in dataOptions" :key="index">
                <div class="list">
                    <div class="text">{{ item.firstLetter ? item.firstLetter : '' }}</div>
                    <div class="content_left" v-for="(i, indx) in item.userFriendList" :key="indx">
                        <div v-if="i.imagePath"><img :src="i.imagePath" @click="firendChange(i.userId)" /></div>
                        <div class="nameIcon" @click="firendChange(i.userId, index)" v-else>{{ i.name.slice(0, 1) }}</div>
                        <div class="left_on">
                            <div>
                                <span>{{ i.name }}</span>
                            </div>
                            <div>{{ i.departmentName }}-{{ i.positionName }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <personMsg :dialogVisible="dialogVisible" @getCancel="getCancel" @getConfirm="getConfirm" ref="person"></personMsg>
    </div>
</template>
<script>
import personMsg from './personMsg.vue';
export default {
    components: {
        personMsg,
    },
    data() {
        return {
            moduleName: '/mailList',
            dialogVisible: false,
            addFriendVisible: false,
            applicationRemark: null,
            dataOptions: [],
            dataMsgs: {},
            id: '',
            targetId: '',
        };
    },
    mounted() {
        this.firendList();
    },
    methods: {
        firendList() {
            const op = 'selectFriendGroupList';
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
            this.firendList();
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
    font-size: 18px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
    line-height: 73px;
    height: 73px;
    border-bottom: 1px solid #ebeef5;
}
.sign {
    cursor: pointer;
}
.t_content {
    // display: flex;
    // flex-direction: column;
    // overflow-x: hidden;
    // overflow-y: auto;
    // flex: 1;
    .list {
        // margin-top: 10px;
        padding: 15px;
        // border: 1px solid #ccc;
        cursor: pointer;
        .text {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #606266;
            line-height: 20px;
            padding-bottom: 16px;
        }
        div.content_left:not(:first-child){
            margin-top: 0;
        }
        .content_left {
            display: flex;
            padding: 15px;
            margin-top: 15px;
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
                }
                div:nth-child(2) {
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #909399;
                    line-height: 20px;
                    margin-top: 2px;
                }
            }
            &:hover {
                transition: 300ms;
                background: #f5f7fa !important;
            }
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