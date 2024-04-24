<template>
    <div class="tab-pan">
        <template v-if="isEmptycardList">
            <div v-for="(item, index) in cardList" :key="index" class="tab-pan-content">
                <div class="tab-pan-content-item" @click="toAudit(item)">
                    <div class="tab-pan-content-header">
                        <div v-html="flowTitle(item)"></div>
                    </div>
                    <div class="tab-pan-content-footer">
                        <div v-html="flowTime(item)"></div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <slot></slot>
        </template>
    </div>
</template>

<script>
import { FLOW_STATUS, FLOW_PATH } from '@/utils/enum';
export default {
    name: 'TabPane',
    props: {
        cardList: {
            type: Array,
            default: () => [],
        },
        activeName: {
            type: String,
            default: '0',
        },
    },
    computed: {
        isEmptycardList() {
            return this.cardList.length > 0;
        },
        flowTitle() {
            return function (item) {
                let vm = this;
                let text = item.todoTaskTitle.length > 70 ? item.todoTaskTitle.substring(0, 70) + '...' : item.todoTaskTitle
                // 待审核列表 / 审批处理记录 / 抄送给我的
                if (vm.activeName == 0 || vm.activeName == 1 || vm.activeName == 3) return `<div>${text}</div>`;
                // 审批发起记录 / 全部审批记录
                if (vm.activeName == 2 || vm.activeName == 4)
                    return `<div>${text}<span class="status" style='${FLOW_STATUS[item.flowStatus]['style']}'">${FLOW_STATUS[item.flowStatus]['value']}</span></div>`;
            };
        },
        flowTime() {
            return function (item) {
                let vm = this;
                //待办发起时间 / 审批发起时间 /全部审批的时间
                if (vm.activeName == 0 || vm.activeName == 2 || vm.activeName == 4) return `<div>${item.startTime}</div>`;
                //审批处理时间
                if (vm.activeName == 1) return `<div>${item.approvalTime}</div>`;
                //抄送给我的时间
                if (vm.activeName == 3) return `<div>${item.copyToTime}</div>`;
            };
        },
    },

    methods: {
        toAudit(item) {
          console.log(item)
            if (this.getModulePower('/index/todo').flowForm) {
                let category = Number(item.category)
                let nameId = item.nameId

                this.activeName == 0 && (item.operation = 'agency');
                // 5 【行政审批】 && 24 【权限申请 / administrationApproval】
                // 7 【需求审批】 && 25 【需求申请 / needApproval】
                // let pathName = item.category == 5 && (item.nameId == 23 || item.nameId == 27) ? 'administrationApproval' : 'pendingAndApproval';
                // let pathName = category === 5 && (nameId == 23 || nameId == 27) ? 'administrationApproval' : category === 7 ? 'needApproval' : 'pendingAndApproval';

                let pathName =  category === 7 ? 'needApproval' : 'pendingAndApproval';

                // 跳转到新工作流详情页
                if ( FLOW_PATH.includes(category)) {
                  pathName = 'workFlow'
                }

                // 将总部权限申请和分支机构权限申请都走新审核流
                if (category === 5 && ([23,27].includes(nameId))) {
                  pathName = 'workFlow'
                }

                // 业务类型 为 网约车审批， 审批类型为  司机合伙人申请  ，走新的审批流页面
                if(category === 1 && (nameId === 14 || nameId === 15)) {
                  pathName = 'workFlow'
                }
                let type;
                switch(this.activeName){
                    //代办详情
                  case '0': type='2';break;
                   //审批处理
                  case '1': type='3';break;
                  //我发起的
                  case '2': type='1';break;
                  //抄送我的
                  case '3': type='4';break;
                  //全部审批记录
                  case '4': type='approveAll';break;
                }


                this.$router.push({
                  name: pathName,
                  query: {
                    row: JSON.stringify({
                      id: item.procInsId,
                      taskId: item.taskId,
                      operation: item.operation,
                      nodeKey:item.nodeKey,
                      type:type,
                      ccTaskId:type==='4'?item.id:null
                    }),
                    id: item.procInsId,
                    taskId: item.taskId,
                    operation: item.operation,
                    nodeKey:item.nodeKey,
                    type:type,
                    ccTaskId:type==='4'?item.id:null,
                    category: item.category
                  }
                });

                if (this.activeName == 3) {
                    this.changeReadStatus(item.id);
                }
            } else {
                this.$message.error('暂无详情权限');
            }
        },
        //点击item跳转后更改阅读状态
        changeReadStatus(readId) {
            let opt = {
                data: {
                    id: readId,
                },
                op: 'readUpdate',
            };
            this.$axios(this.getModuleUrl(opt.op), opt).then(res => {
                const { code, msg } = res;
                if (code === 1) {
                    console.log(msg);
                }
            });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl('/index/todo', op);
        },
    },
};
</script>

<style scoped lang="scss">
.tab-pan {
    &-more {
        display: flex;
        align-items: center;
        // justify-content: flex-end;
        color: #f05259;
        font-size: 13px;
        padding: 8px 0 4px 0;
    }

    .tab-pan-content {
        cursor: pointer;
    }

    .tab-pan-content-header {
        flex: 1;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
    }

    &-content {
        color: #606266;

        .tab-pan-content-item {
            position: relative;
            display: flex;
            justify-content: space-between;
            padding: 10px 5px;
            margin: 3px 0;
            font-size: 14px;
            line-height: 1;
            .tab-pan-content-footer {
                color: #909399;
                margin-left: 80px;
            }

            &:hover {
                background-color: #f5f7fa;
                border-radius: 4px;

                .tab-pancontent-header {
                    color: #f05259;
                }
            }
        }
    }

    // ::v-deep .pass {
    //     background: #f5f7fa;
    //     color: #606266;
    // }
    // ::v-deep .reject {
    //     background: #fdf6ec;
    //     color: #e6a23c;
    // }
    // ::v-deep .pending {
    //     background: #e1fef7;
    //     color: #2ac39b;
    // }
    // ::v-deep .handle {
    //     background: #ecf5ff;
    //     color: #409eff;
    // }
    // ::v-deep .cancle {
    //     background: #fef0f0;
    //     color: #f56c6c;
    // }
    // ::v-deep .goback {
    //     background: #f5f7fa;
    //     color: #909399;
    // }
    ::v-deep .status {
        border-radius: 4px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        padding: 4px 8px;
        margin-left: 15px;
    }
}
</style>
