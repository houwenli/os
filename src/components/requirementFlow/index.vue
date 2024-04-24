<template>
    <div ref="preview">
        <el-col :span="10" class="right-contant">
            <div class="backBox" v-if="isShowBack">
                <div class="backBtn">
                    <el-button @click="goBack()">返回</el-button>
                </div>
            </div>
            <div class="right-header">
                <div class="right-title">
                    <span style="font-weight: 600; color: ##303133">{{ personName }}提交的需求申请</span>
                </div>
                <div class="right-icon">
                    <img :src="srcList[imgType]" alt="" />
                </div>
            </div>
            <div class="detail">
                <el-timeline>
                    <el-timeline-item class="ite" v-for="(activity, index) in flowDataList" :key="index" :icon="activity.icon" :type="activity.type" color="#f05259">
                        <div class="timestamp">
                            {{ activity.nodeName }}
                        </div>
                        <div class="nodeTop">
                            <div v-if="!activity.nodeType">
                                <div class="timeStyle">
                                    <span class="nodeStyle">{{ activity.startUserName }}</span>
                                    <span class="nodeTime">{{ activity.createTime }}</span>
                                </div>
                            </div>
                            <div class="nodeName" v-if="activity.nodeType == '1'">
                                <template>
                                    <!-- 已审核 -->
                                    <div v-for="items in activity.alreadyAppUsers" :key="items.id" class="timeStyle">
                                        <div class="remarkBox">
                                            <div class="nodeStyleBox">
                                                <span class="nodeStyle">{{ items.name }} ({{ items.approvalStatus == 1 ? '已同意' : '已驳回' }})</span>
                                                <span class="nodeTime">{{ items.createTime }}</span>
                                            </div>
                                            <div class="allOpinionBox">
                                                <div class="opinionBox"  v-if="items.remark">
                                                    <span v-html="items.remark"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 未审核 -->
                                    <div v-for="item in activity.unapproval" :key="+item.id">
                                        <span class="nodeStyle">{{ item.name }} (未审批)</span>
                                        <!-- <span class="nodeStyle">{{item.createTime}}</span> -->
                                    </div>
                                </template>
                            </div>
                        </div>

                        <div class="nodeNameBox" v-if="activity.nodeType == '2'">
                            <div>
                                <span class="nodeStyle" style="padding-right: 8px">
                                    抄送{{
                                        activity.ccReadUsers ? (activity.userInfos ? activity.userInfos.length + activity.ccReadUsers.length : 0) : activity.userInfos ? activity.userInfos.length : 0
                                    }}人
                                </span>
                                <span style="font-weight: 500px">({{ activity.ccReadUsers ? activity.ccReadUsers.length : 0 }}人已读)</span>
                            </div>
                            <div class="nodeCopy">
                                <!-- 未读 -->
                                <span v-for="(val, i) in activity.unread" :key="val.id">
                                    <el-tag style="margin: 2px">{{ val.name }}</el-tag>
                                </span>
                                <!-- 已读 -->
                                <span v-for="(val, i) in activity.ccReadUsers" :key="i" style="position: relative; display: 'inline-block'; width: 36px; height: 10px">
                                    <el-tag style="margin: 2px">{{ val.name }}</el-tag>
                                    <i class="el-icon-success" style="position: absolute; top: -8px; right: -2px; color: #25c69c"></i>
                                </span>
                            </div>
                        </div>
                    </el-timeline-item>
                </el-timeline>
            </div>
        </el-col>
        <!-- 需求关闭申请 -->
        <el-col :span="10" class="right-contant" v-if="showCloseProcess">
            <div v-if="showCloseProcess" class="right-contantt">
                <div class="right-header">
                    <div class="right-title1">
                        <span style="font-weight: 600; color: ##303133">{{ personName }}提交的需求关闭申请</span>
                    </div>
                    <div class="right-icon">
                        <img :src="closeSrcList[closeImgType]" alt="" class="img-style" />
                    </div>
                </div>
                <div class="detail">
                    <el-timeline>
                        <el-timeline-item v-for="(activity, index) in closeFlowDataList" :key="index" :icon="activity.icon" :type="activity.type" color="#f05259">
                            <div class="timestamp">
                                {{ activity.nodeName }}
                            </div>
                            <div class="nodeTop">
                                <div v-if="!activity.nodeType">
                                    <div class="timeStyle">
                                        <span class="nodeStyle">{{ activity.startUserName }}</span>
                                        <span class="nodeTime" style="color: #909399">{{ activity.createTime }}</span>
                                    </div>
                                </div>
                                <div class="nodeName" v-if="activity.nodeType == '1'">
                                    <template>
                                        <!-- 已审核 -->
                                        <div v-for="items in activity.alreadyAppUsers" :key="items.id">
                                        <div  class="timeStyle">
                                            <span class="nodeStyle">{{ items.name }} ({{ items.approvalStatus == 1 ? '已同意' : '已驳回' }})</span>
                                            <span class="nodeTime" style="color: #909399">{{ items.createTime }}</span>
                                        </div>
                                        <div class="allOpinionBox">
                                                <div class="opinionBox" v-if="items.remark">
                                                    <span >{{ items.remark }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- 未审核 -->
                                        <div v-for="item in activity.closeUnapproval" :key="item.id">
                                            <span class="nodeStyle">{{ item.name }} (未审批)</span>
                                            <!-- <span class="nodeStyle">{{item.createTime}}</span> -->
                                        </div>
                                    </template>
                                </div>
                            </div>

                            <div class="nodeNameBox" v-if="activity.nodeType == '2'">
                                <div>
                                    <span class="nodeStyle">
                                        抄送{{
                                            activity.ccReadUsers
                                                ? activity.userInfos
                                                    ? activity.userInfos.length + activity.ccReadUsers.length
                                                    : 0
                                                : activity.userInfos
                                                ? activity.userInfos.length
                                                : 0
                                        }}人
                                    </span>
                                    <span>({{ activity.ccReadUsers ? activity.ccReadUsers.length : 0 }}人已读)</span>
                                </div>
                                <div class="nodeCopy1">
                                    <!-- 未读 -->
                                    <span v-for="(val, i) in activity.closeUnread" :key="val.id">
                                        <el-tag type="info" style="margin: 2px">{{ val.name }}</el-tag>
                                    </span>
                                    <!-- 已读 -->
                                    <span v-for="(val, i) in activity.ccReadUsers" :key="i" style="position: relative; display: 'inline-block'; width: 36px; height: 10px">
                                        <el-tag type="info" style="margin: 2px">{{ val.name }}</el-tag>
                                        <i class="el-icon-success" style="position: absolute; top: -8px; right: -2px; color: #25c69c"></i>
                                    </span>
                                </div>
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </div>
        </el-col>
    </div>
</template>

<script>
export default {
    name: 'requirementFlow',
    props: {
        //请求op
        isShowBack: {
            type: Boolean,
            default: false,
        }, //是否展示返回按钮
        isShowCancel: {
            type: Boolean,
            default: false,
        }, //是否展示撤销按钮
        opString: {
            type: String,
            default: 'processDetail',
        }, //请求op
        urlString: {
            type: String,
            default: '/demand/manage/select',
        }, //请求url
        processId: {
            type: String,
        }, //流程id
        personName: {
            type: String,
        }, //申请提出人
        projectId: {
            type: String,
            default: '',
        }, //项目id
        showCloseProcess: {
            type: Boolean,
            default: false,
        }, //是否展示申请关闭
        closeProcessId: {
            type: String,
        }, //流程关闭id
        noFreeTrial: {
            type: Boolean,
            default: true,
        } //是否为免审
    },
    data() {
        return {
            revoke: this.$route.query.approvalStatus == 0 || this.$route.query.demandStatus == 0 ? true : false,
            imgType: '',
            srcList: {
                1: 'https://wanshunjiaoche-file-public-1301582899.cos.ap-guangzhou.myqcloud.com/oaMessageImpl/9/1647415147780_oUf0S.png',
                2: 'https://wanshunjiaoche-file-public-1301582899.cos.ap-guangzhou.myqcloud.com/oaMessageImpl/9/1647415608370_6yDsd.png',
                '-1': 'https://wanshunjiaoche-file-public-1301582899.cos.ap-guangzhou.myqcloud.com/oaMessageImpl/9/1647415665451_7uoBw.png',
                3: 'https://wanshunjiaoche-file-public-1301582899.cos.ap-guangzhou.myqcloud.com/oaMessageImpl/9/1647415699659_x4Jom.png',
                4: 'https://wanshunjiaoche-file-public-1301582899.cos.ap-guangzhou.myqcloud.com/oaMessageImpl/9/1647415725919_vwpdo.png',
            },
            closeImgType: '',
            closeSrcList: {
                1: 'https://wanshunjiaoche-file-public-1301582899.cos.ap-guangzhou.myqcloud.com/oaMessageImpl/9/1647415147780_oUf0S.png',
                2: 'https://wanshunjiaoche-file-public-1301582899.cos.ap-guangzhou.myqcloud.com/oaMessageImpl/9/1647415608370_6yDsd.png',
                '-1': 'https://wanshunjiaoche-file-public-1301582899.cos.ap-guangzhou.myqcloud.com/oaMessageImpl/9/1647415665451_7uoBw.png',
                3: 'https://wanshunjiaoche-file-public-1301582899.cos.ap-guangzhou.myqcloud.com/oaMessageImpl/9/1647415699659_x4Jom.png',
                4: 'https://wanshunjiaoche-file-public-1301582899.cos.ap-guangzhou.myqcloud.com/oaMessageImpl/9/1647415725919_vwpdo.png',
            },
            attachmentName: [],

            flowDataList: [], //审核数据
            unread: [], //未读抄送人
            unapproval: [],
            closeFlowDataList: [], //关闭申请审核数据
            closeUnread: [], //关闭申请未读抄送人
            closeUnapproval: [], //关闭未审核人
        };
    },
    watch: {
        flowDataList(newVal) {
            this.imgType = newVal[0].flowStatus;
            // console.log('这是侦察器', newVal, this.imgType, newVal[0].flowStatus);
        },
        closeFlowDataList(newVal) {
            this.closeImgType = newVal[0].flowStatus;
        }
    },
    created() {
      this.getData();
    },
    methods: {
        goBack() {
            this.$router.push({ name: 'moreSet' });
        },
        getData() {
            let data = {
                data: {
                    processId: this.processId,
                },
                op: this.opString,
            };
            this.$axios(this.urlString, data).then(res => {
                this.flowDataList = JSON.parse(res.data);
                let a = [];
                let b = [];
                this.flowDataList.forEach(item => {
                    if (item.nodeType === '2') {
                        a = item.userInfos;
                        b = item.ccReadUsers;
                        item['unread'] = this.array_diff(a, b);
                    }
                    if (item.nodeType === '1') {
                        a = item.userInfos;
                        b = item.alreadyAppUsers;
                        // return (this.unapproval = this.array_diff(a, b));
                        item['unapproval'] = this.array_diff(a, b);
                    }
                });
            });
            if (this.closeProcessId) {
                let data = {
                    data: {
                        processId: this.closeProcessId,
                    },
                    op: this.opString,
                };
                this.$axios(this.urlString, data).then(res => {
                    this.closeFlowDataList = JSON.parse(res.data);
                    let a = [];
                    let b = [];
                    this.closeFlowDataList.forEach(item => {
                        if (item.nodeType === '2') {
                            a = item.userInfos;
                            b = item.ccReadUsers;
                            // return (this.closeUnread = this.array_diff(a, b));
                            item['closeUnread'] = this.array_diff(a, b);
                        }
                        if (item.nodeType === '1') {
                            a = item.userInfos;
                            b = item.alreadyAppUsers;
                            // return (this.closeUnapproval = this.array_diff(a, b));
                            item['closeUnapproval'] = this.array_diff(a, b);
                        }
                    });
                });
            }
        },
        // 筛选未抄送人员方法
        array_diff(a, b) {
            if (!b) {
                return a;
            } else {
                for (var i = 0; i < b.length; i++) {
                    for (var j = 0; j < a.length; j++) {
                        if (a[j].id == b[i].id) {
                            a.splice(j, 1);
                            j = j - 1;
                        }
                    }
                }
            }
            return a;
        }
    }
};
</script>

<style lang="scss" scoped>
/deep/ .el-tag {
    background-color: rgb(245, 247, 250);
    border-color: rgb(245, 247, 250);
    color: rgb(64, 158, 255);
    font-weight: 600;
}
.right-contantt {
    margin-left: 95px !important;
}
.right-contant {
    // flex: 1;
    border: 1px solid #dcdfe6;
    padding-bottom: 40px;
    border-radius: 8px;
    width: 550px;
    margin: 10px 20px 0;
    padding-bottom: 10px;
    margin-bottom: 7px;
    .backBox {
        height: 100%;
        margin-bottom: 48px;
        position: relative;
        .backBtn {
            position: absolute;
            top: 8px;
            right: 68px;
        }
    }
    .right-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
        /deep/ fieldset,
        img {
            margin-left: -53px;
            border: 0;
            box-sizing: border-box;
            font-family: 'Microsoft YaHei';
            color: #303133;
            width: 64px;
        }
        .right-title1 {
            margin-left: -75px;
        }
        .right-title {
            text-align: center;
            margin: 0 0 0 16px;
            > span {
                width: 160px;
                height: 20px;
                font-size: 14px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #303133;
                line-height: 20px;
            }
        }
        .right-icon {
            margin-right: 68px;
            margin-top: 14px;
            width: 64px;
            height: 64px;
        }
    }
    .detail {
        margin-top: 20px;
        /deep/ .nodeTime {
            font-weight: 500;
          color: rgb(144, 147, 153);
          margin-left: 112px;
        }
        /deep/ .img-style {
            width: 64px;
            height: 64px;
        }
        /deep/ .el-timeline-item:last-child {
            .el-timeline-item__tail {
                // border-left: 1px dashed red !important;
                display: inline-block;
            }
        }
        /deep/ .el-timeline-item__wrapper {
            .el-timeline-item__tail {
                border-left: 1px dashed red !important;
            }
        }
        /deep/ .el-timeline-item__tail {
            border-left: 1px dashed red !important;
        }
        .ite {
            left: 95px;
            // border-left: 1px dashed #f05259 !important;
        }
        .timeStyle {
            display: flex;
            justify-content: space-between;
            width: 350px;
            .remarkBox {
                display: flex;
                flex-direction: column;
                .nodeStyleBox{
                    display: flex;
                    justify-content: space-between;
                    width: 350px;
                }
            }
        }
        .timestamp {
            position: absolute;
            left: -94px;
            top: 0px;
            width: 86px;
            text-align: right;
            color: #303133;
        }
        /deep/ .nodeCopy {
            max-width: 410px;
        }
        /deep/ .nodeStyle {
            font-weight: 600;
        }
        .nodeName {
            position: relative;
            top: -1px;
            margin-bottom: 11px;
            line-height: 28px;
            // font-weight: 600;
            color: #303133;
            .allOpinionBox {
                width: 310px;
                max-width: 310px;
                background-color: #fef0f0;
                .opinionBox {
                    width: 350px;
                    background-color: #fef0f0;
                    border-radius: 4px;
                    padding: 5px 5px 5px 5px;
                    color: #f05259;
                }
            }
        }

        .cancel-btn {
            margin: 0 0 40px 80px;
        }
    }
    .footer {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f2f2f2;
        height: 60px;
        .left-btn {
            margin-left: 10px;
            display: flex;
            justify-content: space-between;
            .icon-btn {
                display: flex;
                flex-flow: column;
                align-items: center;
                justify-content: center;
            }
            .cancel {
                margin-left: 10px;
            }
        }
        .right-btn {
            margin-right: 20px;
        }
    }
    .nodeName {
        // div {
        //     margin-bottom: 32px;
        // }
    }
}
</style>
