<template>
    <div :class="['currency-apply', 'currency-apply-audit', customClass]">
        <div class="currency-apply-title-box">
            <div class="currency-apply-title">{{ title }}</div>
            <el-tooltip class="item" effect="dark" content="同一审批人在第一次审批同意后，后续节点中审批将自动通过" placement="right" v-if="checkType">
                <div class="dialogIcon">
                    <i class="el-icon-warning warningIcon"></i>
                    <span class="warningtext">已启用自动去重</span>
                </div>
            </el-tooltip>
        </div>
        <el-timeline style="margin-left: 20px" v-if="isEmptyList">
            <el-timeline-item type="primary" v-for="(items, indexs) in list" :key="indexs">
                <div class="currency-apply-audit-content">
                    <div class="audit-content-header">
                        <div class="audit-content-header-title">{{ items.nodeName }}</div>
                        <div class="audit-content-header-number">
                             {{ handleTips(items) }}
                            <!-- {{items.userInfos[indexs]}} -->
                        </div>
                    </div>
                    <div class="audit-content-footer">
                        <!-- 直属上级直接通过 不显示审批人 -->
                        <div class="audit-content-footer-person" v-if="!(([8,12].includes(parseInt(items.memberType))) && items.memberCount == 0)">
                            <div v-for="(item, index) in items.userInfos" :key="`${index}a`" style="display: flex; align-items: center; margin-bottom: 18px">
                                <el-popover :title="item.name" placement="top" trigger="hover"  popper-class="audit-content-popover" style="position: relative">
                                    <p>{{ item.partimeString }}</p>
                                    <p
                                        style="
                                            text-overflow: -o-ellipsis-lastline;
                                            overflow: hidden;
                                            text-overflow: ellipsis;
                                            display: -webkit-box;
                                            webkit-line-clamp: 2;
                                            line-clamp: 2;
                                            -webkit-box-orient: vertical;
                                        "
                                    >
                                        {{ item.department }}
                                    </p>
                                    <el-button :class="[{ 'is-disabled': item.isDefUser }]" slot="reference" style="height: 40px; width: 90px">{{ handleWord(item.name) }}</el-button>
                                    <i
                                        v-if="!item.isDefUser"
                                        class="el-icon-error"
                                        slot="reference"
                                        style="position: absolute; top: -6px; right: -5px; color: #8d9096; cursor: pointer"
                                        @click.stop="handleCancel(index, item, indexs)"
                                    ></i>
                                </el-popover>
                                <img
                                    src="@/assets/index/icon_next.png"
                                    alt
                                    width="16"
                                    style="margin: 4px 0"
                                    v-if="items.nodeType == 1 && items.approvalType == 1 && !isLast_ShowAdd(index, items.userInfos, items.memberType, items.memberCount)"
                                />
                                <img
                                    src="@/assets/index/icon_or.png"
                                    alt
                                    width="16"
                                    style="margin: 4px 0"
                                    v-if="items.nodeType == 1 && items.approvalType == 3 && !isLast_ShowAdd(index, items.userInfos, items.memberType, items.memberCount)"
                                />
                                <img
                                    src="@/assets/index/icon_joint.png"
                                    alt
                                    width="16"
                                    style="margin: 4px 0"
                                    v-if="(items.nodeType == 2 || (items.nodeType == 1 && items.approvalType == 2)) && !isLast_ShowAdd(index, items.userInfos, items.memberType, items.memberCount)"
                                />
                            </div>
                            <div class="audit-content-footer-btn-dotted" @click="handleReviewerAdd(indexs, items.memberType)" v-if="showApproveAdd(items.memberType, items.memberCount)">
                                <img src="@/assets/index/img_approve_add.png" alt width="24" />
                                <img v-if="showRequire(items.nodeType, items.memberCount)" src="@/assets/index/icon_required.png" alt width="12" style="position: absolute; top: -4px; right: -4px" />
                            </div>
                        </div>
                        <div class="audit-content-footer-checked" @click="showAllMember(indexs)" v-if="isOverflow(items.memberCount)">
                            查看全部{{ items.memberCount }}人
                            <i class="el-icon-arrow-right"></i>
                        </div>
                    </div>
                </div>
            </el-timeline-item>
        </el-timeline>
        <div v-else class="no-data">
            <img src="@/assets/index/img_no_data.png" width="122" alt />
            <p>当前审批未配置工作流，请联系管理员处理</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AuditProcess',

    props: {
        list: {
            type: Array,
            default: () => [],
        },
        checkType: {
            type: [String, Number],
            default: 0
        }
    },
    inject: ['overflowLimit', 'title', 'treeSelectMaxCount', 'customClass'],

    computed: {
        isEmptyList() {
            return this.list.length > 0;
        },

        //判断节点类型  nodeType 审核=>1   抄送=>2
        showRequire() {
            return function (nodeType, memberCount) {
                return nodeType == 1 && (memberCount == null || memberCount == 0);
            };
        },
        isOverflow() {
            return function (memberCount) {
                return memberCount >= this.overflowLimit;
            };
        },

        //处理字体过长
        handleWord() {
            return function (word) {
                return word && word.length > 4 ? `${word.substring(0, 4)}...` : word;
            };
        },
    },

    methods: {
            handleTips(item) {
            //审批方式 approvalType（1：依次审批   2：会签   3：或签)
            const appprovalTypeMaps = { 1: '依次审批', 2: '会签', 3: '或签' };
            if (item.nodeType == 1) {
                const strats = {
                    // 直属上级
                    memberType_8: () => {
                        if (item.backupUserId == null && item.memberCount == 0) {
                            return `直属上级为空 (第${item.managerLevel}级主管)，自动通过`;
                        } else if (item.backupUserId && item.memberCount == 0) {
                            return `直属上级为空 (第${item.managerLevel}级主管)，转交给${item.backupUserName}审批`;
                        } else if (item.memberCount == 1) {
                            return `1个直属上级审批 (第${item.managerLevel}级主管)`;
                        } else {
                            return `${item.memberCount}个直属上级 (第${item.managerLevel}级主管) ${appprovalTypeMaps[item.approvalType]}`;
                        }
                    },
                    //独立法人
                    memberType_9: () => {
                        return `1个独立法人审批`;
                    },
                    // 其他
                    other: () => {
                        if(item.checkType){
                            return `将自动审批通过`;
                        }
                        if (item.memberCount == 1) {
                            return `1人审批`;
                        } else if (item.memberCount > 1) {
                            console.log(`${item.memberCount}个人${appprovalTypeMaps[item.approvalType]}`);
                            return `${item.memberCount}个人${appprovalTypeMaps[item.approvalType]}`;
                        } else {
                            // 直属机构
                            if(item.memberType === '12') return '直属机构为空，自动通过'
                            return '请选择审核人';
                        }
                    }
                };
                let fn = strats[`memberType_${item.memberType}`] || strats['other'];
                return fn();
            } else {
                if (item.memberCount > 0) {
                    return `抄送${item.memberCount}人`;
                } else {
                    return '请选择抄送人';
                }
            }
        },

        showApproveAdd(memberType, memberCount) {
            if (memberType == 3 && memberCount > 0) {
                return false;
            }

            // 8 为直属上级; 12 为直属机构， 不需要加人
            if ([8, 12].includes(parseInt(memberType))) return false;

            //抄送节点无限制
            //抄送（指定成员 发起人自选 指定成员+自选）自选显示+
            if (memberType == 7 || memberType == 6) {
                return true;
            }
            return memberType != 1 && memberType != 2 && memberType != 5 && memberCount < this.treeSelectMaxCount;
        },

        isLast_ShowAdd(itemIndex, items, memberType, memberCount) {
            //处理审批人发起人自选1人情况
            if (memberType == 3 && memberCount > 0) {
                return true;
            }

            if ([8, 12].includes(parseInt(memberType)) && itemIndex === items.length - 1) return true;

            return itemIndex === items.length - 1 && !this.showApproveAdd(memberType, itemIndex);
        },
        handleReviewerAdd(index, memberType) {
            this.$emit('handleReviewerAdd', index, memberType);
        },

        handleCancel(itemIndex, item, indexs) {
            this.$emit('handleCancel', itemIndex, item, indexs);
        },

        showAllMember(index) {
            this.$emit('showAllMember', index);
        },
    },
};
</script>

<style scoped lang="scss">
.currency-apply-audit {
    background: #ffffff;
    border-radius: 8px;
    padding: 32px 40px 32px 40px;

    /deep/ .el-timeline-item__tail {
        border-left: 1px dashed #f05259;
    }
    .currency-apply-title-box{
        margin-bottom: 21px; 
        display: flex;
        align-items: center;
        .currency-apply-title {
            font-size: 16px;
            color: #303133;
            font-weight: bold;
            margin-right:8px;
        }
        .warningIcon {
            width: 16px;
            height: 16px;
            color: #e6a23c;
        }
        .warningtext {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #e6a23c;
        }
    }
    .audit-content-footer {
        width: 75%;
    }
    .currency-apply-audit-content {
        display: flex;
        justify-content: space-between;
        background: #f5f7fa;
        border-radius: 4px;
        padding: 18px 8px 12px 12px;
        min-height: 88px;

        .audit-content-header-title {
            font-size: 16px;
            color: #303133;
            margin-bottom: 8px;
        }
        .audit-content-header-number {
            color: #909399;
            font-size: 14px;
        }
        .audit-content-footer-person {
            display: flex;
            justify-content: flex-end;
            flex-wrap: wrap;
        }
        .audit-content-footer-btn-dotted {
            position: relative;
            background: #ffffff;
            width: 80px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            border: 1px dotted #0088ff;
            cursor: pointer;
        }
        .audit-content-footer-btn-solid {
            background: #ffffff;
            width: 80px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
        }
        .audit-content-footer-checked {
            margin-top: 12px;
            padding: 9px 8px;
            border-radius: 16px;
            background: #ffffff;
            color: #0088ff;
            font-size: 14px;
            float: right;
            line-height: 1;
            cursor: pointer;
        }

        /deep/ .el-button {
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            color: #606266;
        }

        /deep/ .el-button.is-disabled {
            color: #606266;
            cursor: pointer;
            background-image: none;
            background-color: #ffffff;
            border: 1px solid #dcdfe6;
        }
    }

    .no-data {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        p {
            color: #606266;
            font-size: 18px;
            margin-top: 16px;
        }
    }

    /deep/ .el-timeline-item__node--normal {
        top: 20px;
    }

    /deep/ .el-timeline-item__tail {
        top: 20px;
    }
    
}
</style>
