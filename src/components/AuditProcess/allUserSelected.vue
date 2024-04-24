<template>
    <el-dialog title="查看全部成员" :lock-scroll="false" :visible.sync="showMember" width="60%" :close-on-click-modal="false" :before-close="handleClose">
        <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container">
            <div class="currency-apply-audit-content" v-for="(items, indexs) in currAllUserInfos" :key="indexs">
                <div class="audit-content-footer-person">
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
                            <el-button :class="[{ 'is-disabled': item.isDefUser }]" slot="reference" style="height: 40px">{{ handleWord(item.name) }}</el-button>

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
                            v-if="items.approvalType == 1 && !isLast_ShowAdd(index, items.userInfos, items.memberType, items.memberCount)"
                        />
                        <img
                            src="@/assets/index/icon_or.png"
                            alt
                            width="16"
                            style="margin: 4px 0"
                            v-if="items.approvalType == 3 && !isLast_ShowAdd(index, items.userInfos, items.memberType, items.memberCount)"
                        />
                        <img
                            src="@/assets/index/icon_joint.png"
                            alt
                            width="16"
                            style="margin: 4px 0"
                            v-if="items.approvalType == 2 && !isLast_ShowAdd(index, items.userInfos, items.memberType, items.memberCount)"
                        />
                    </div>
                    <div class="audit-content-footer-btn-dotted" @click="handleReviewerAdd(items.memberType)" v-if="showApproveAdd(items.memberType, items.memberCount)">
                        <img src="@/assets/index/img_approve_add.png" alt width="24" />
                        <img v-if="showRequire(items.nodeType, items.memberCount)" src="@/assets/index/icon_required.png" alt width="12" style="position: absolute; top: -4px; right: -4px" />
                    </div>
                </div>
            </div>
        </el-scrollbar>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleConfirm">关闭</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: 'showMember',

    props: {
        currAllUserInfos: {
            type: Array,
            default: () => []
        },

        showMember: {
            type: Boolean,
            default: false
        },
        //当前展示数据
        index: {
            type: Number,
            default: 0
        }
    },

    inject: ['treeSelectMaxCount'],

    computed: {
        //处理字符
        handleWord() {
            return function (word) {
                return word && word.length > 4 ? `${word.substring(0, 4)}...` : word;
            };
        },

        //判断节点类型  nodeType=>1  nodeType=>2
        showRequire() {
            return function (nodeType, memberCount) {
                return nodeType == 1 && (memberCount == null || memberCount == 0);
            };
        },

        //是否为空
        isEmptyItem() {
            return function (item) {
                return item.length > 0;
            };
        },

        //1：审批人指定成员2：审批人指定账号组3：审批人发起人自选1人 4：审批人发起人自选多人5：抄送人指定成员 6：抄送人发起人自选 7：抄送人指定成员+自选 8：直属上级
        showApproveAdd() {
            return function (memberType, memberCount) {
                if (memberType == 3 && memberCount > 0) {
                    return false;
                }
                
                // 8 为直属上级; 12 为直属机构， 不需要加人
                if ([8, 12].includes(parseInt(memberType))) return false;

                //抄送节点无限制
                if (memberType == 7) {
                    return true;
                }
                return memberType != 1 && memberType != 2 && memberType != 5 && memberType != 9 && memberCount < this.treeSelectMaxCount;
            };
        },

        //最后一个且不展示添加按钮
        isLast_ShowAdd() {
            return function (itemIndex, items, memberType, memberCount) {
                //处理审批人发起人自选1人情况
                if (memberType == 3 && memberCount > 0) {
                    return true;
                }
                if ([8, 12].includes(parseInt(memberType)) && itemIndex === items.length - 1) return true;
                return itemIndex === items.length - 1 && !this.showApproveAdd(memberType, itemIndex);
            };
        }
    },

    methods: {
        handleClose(done) {
            this.$emit('update:showMember', false);
        },

        handleConfirm() {
            this.$emit('getResult', this.result);
            this.$emit('update:showMember', false);
        },

        handleCancel(itemIndex, item, indexs) {
            this.$emit('handleCancel', itemIndex, item, this.index);
        },

        handleReviewerAdd(memberType) {
            this.$emit('handleReviewerAdd', this.index, memberType);
        }
    }
};
</script>

<style scoped lang="scss">
.currency-apply-audit-content {
    border-radius: 4px;
    padding: 18px 8px 12px 12px;
    height: 400px;

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
        flex-wrap: wrap;
        padding: 18px 8px 12px 12px;
        background: #f5f7fa;
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
/deep/ .el-dialog__footer {
    text-align: center;
}
</style>
