<template>
    <div>
        <div v-for="item in dataList" :key="item.id">
            <div class="module" :class="dataList.length > 1 ? 'marb-border':''">
                <div class="moduleTitle">
                    <div class="moduleIcon">
                        <div>{{ item.operatorName.slice(0, 1) }}</div>
                    </div>
                    <div class="moduleName">
                        <div class="moduleUserName">{{ item.operatorName }}</div>
                        <div class="moduleTime">{{ item.distributeTime }}</div>
                    </div>
                    <div class="moduleMore"></div>
                    <el-popover placement="bottom" :popper-class="'im-self-9507828-p0'" trigger="click">
                        <img class="moreIcon" slot="reference" src="../../image/icon_more.png" alt="" />
                        <div class="popover">
                            <div @click="handleEdit(item)" class="btn btn1">编辑</div>
                            <div @click="handleDelete(item)" class="btn btn2" v-if="item.hasPower || userPower.isOwnerOrAdmin">删除</div>
                        </div>
                    </el-popover>
                </div>
                <div class="moduleContent">
                    <p v-html="item.content"></p>
                </div>
            </div>
        </div>
        <div class="addIcon" @click="handleAdd">
            <img src="../../image/icon_ending.png" alt="" />
        </div>
    </div>
</template>

<script>
export default {
    name: '',
    props: {
        notificationList: {
            type: Array,
            default: () => [],
        },
    },
    watch: {
        notificationList: {
            handler(newVal) {
                if (newVal) {
                    let IMUserInfo = JSON.parse(sessionStorage.getItem('IMUserInfo'));
                    let currentUserId = IMUserInfo.userID.split('_')[1]
                    newVal.forEach(item => {
                        if (item.createUserId == currentUserId) {
                            item.hasPower = true
                        } else {
                            item.hasPower = false
                        }
                    })
                    this.dataList = newVal;
                }
            },
            deep: true,
            immediate: true,
        },
        '$store.state.im.userPower': {
            handler (newV, oldV){
                if(newV){
                    this.userPower = newV;
                }
            },
            immediate: true,
            deep: true,
        },
    },
    data() {
        return {
            dataList: [],
            op: {
                updateGroupNotification: 'updateGroupNotification',
            },
            userPower: ''
        };
    },
    mounted() {
    },
    methods: {
        handleDelete(item) {
            let that = this;
            this.$confirm(`确定要删除吗`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true,
            }).then(() => {
                const reqData = {
                    data: {
                        id: item.id,
                        operater: '2',
                    },
                    op: 'updateGroupNotification',
                };
                let url = '/web/im/update';
                this.$axios(url, reqData)
                    .then(result => {
                        console.log('result', result);
                        if (result.code === 1) {
                            this.$message.success('删除成功');
                            this.$parent.getNotificationList();
                        }
                    })
                    .catch(error => {
                        that.loading = false;
                    });
            });
        },
        handleAdd() {
            let data = {
                type: 'add',
            };
            this.$parent.handleChangeType('notificationEdit', data);
        },
        handleEdit(item) {
            let data = {
                type: 'edit',
                id: item.id,
                content: item.content,
            };
            this.$parent.handleChangeType('notificationEdit', data);
        },
    },
};
</script>

<style scoped lang="scss">
.addIcon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    position: absolute;
    bottom: 24px;
    right: 24px;
    img {
        width: 100%l;
        height: 100%;
    }
}
.module.marb-border {
    border-bottom: 8px solid #f0f2f5;
}
.module {
    padding: 16px;
    .moduleTitle {
        display: flex;
        align-items: flex-start;
        margin-bottom: 16px;
    }
    .moduleContent {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #303133;
        word-break: break-all;
    }
    .moduleIcon {
        width: 48px;
        height: 48px;
        background: #0088ff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        border-radius: 50%;
        overflow: hidden;
    }
    .moduleName {
        display: flex;
        flex-direction: column;
        margin-left: 12px;
        .moduleUserName {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #303133;
            line-height: 22px;
            margin-bottom: 6px;
        }
        .moduleTime {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #909399;
            line-height: 20px;
        }
    }
    .moduleMore {
        width: 16px;
        height: 16px;
        overflow: hidden;
        margin-left: auto;
        cursor: pointer;
    }
    .moreIcon {
        width: 16px;
        height: 16px;
    }
}
/deep/.el-popover {
    padding: 5px;
}
.popover {
    display: flex; 
    justify-content: center; 
    flex-direction: column;
    .el-button {
        width: 40px;
        margin-left: 0;
        padding: 10px 0;
        text-align: center;
    }
    .btn {
        font-size: 12px;
        border-radius: 2px;
        padding: 4px 4px 2px 4px;
        cursor: pointer;
        width: 40px;
    }
    .btn:hover {
        background: #F5F7FA;
    }
}
</style>
<style>
.im-self-9507828-p0.el-popover {
    width: 50px;
    min-width: 50px;
    padding: 4px;
    text-align: center;
}
</style>
