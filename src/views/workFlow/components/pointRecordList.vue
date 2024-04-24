<template>
    <div class="pointRecordList">
        <div class="listTitle">审批流程记录</div>
        <ws-table-el ref="table" v-bind="tableConfig" header-row-class-name="header-row">
            <template>
                <ws-table-column-el prop="approvalTime" label="操作时间"></ws-table-column-el>
                <ws-table-column-el prop="approvalUserName" label="操作人"></ws-table-column-el>
                <ws-table-column-el prop="approvalUserPhone" label="操作人手机号"></ws-table-column-el>
                <ws-table-column-el prop="positionName" label="职务"></ws-table-column-el>
                <ws-table-column-el prop="deptNameSmall" label="所属部门" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-popover trigger="click" :content="scope.row.deptName" placement="top" width="200">
                            <span class="completeDuty" slot="reference">{{ scope.row.deptNameSmall }}</span>
                        </el-popover>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="approvalStatus" label="操作状态" width="130px">
                    <template slot-scope="scope">
                        <span class="statusText" :class="judgeStatusColor(scope.row.approvalStatus)">{{ scope.row.approvalStatusName }}</span>
                    </template>
                </ws-table-column-el>
                <!-- 网约车司机修改资料，入网申请，审核拒绝的不展示备注信息 -->
                <ws-table-column-el prop="remarkInfo" v-if="!([1,2].includes(this.flowNameId) && [2,7].includes(this.flowStatus))" label="备注信息" fixed="right" min-width="400px" left>
                  <template slot-scope="scope">
                    <div>
                      <el-popover trigger="click" :content="scope.row.remarkText" placement="top" width="600">
                          <span class="completeDuty" slot="reference">{{scope.row.remarkText.length>30?scope.row.remarkText.substr(0, 30) + "..." + '':scope.row.remarkText}}</span>
                      </el-popover>
                      <!-- 转交时需要展示转交人 -->
                      <p v-if="scope.row.approvalStatus=='trans'" v-html="scope.row.remark.split('<br/>')[1]"></p>
                      <span class="remove-btn" v-if="showRevoke(scope.row)" @click="dialogVisibleTrue(scope.row)">撤回</span>

                      <div>
                        <div v-if='scope.row.ccUserList.length' style="margin: 8px 0;">
                          <span>{{scope.row.ccDescText}}：</span>
                          <span >{{scope.row.ccUserList.join('、')}}</span>
                        </div>
                      </div>
                    </div>
                  </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
        <el-dialog
          title="撤回评论" :visible.sync="dialogVisible" width="30%" >
            <span>是否撤回该条评论?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="remove()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- <el-dialog title="备注信息" :visible.sync="showDia" width="60%">
            <el-input type="textarea" disabled v-model="remarkText" rows="9"></el-input>
            <template #footer>
                <el-button @click="showDia = false">关闭</el-button>
            </template>
        </el-dialog> -->
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';

export default {
    props: {
        processId: {
            //流程参数id
            type: String,
        },
        flowStatus: {
            //审核流状态
            type: Number,
        },
        flowNameId: {
            //审核流状态
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            tableConfig: {
                pagination: true,
                pageId: 'id',
                pageSizeList: [5, 10, 20, 50],
                filterColumns: false,
                // autoHeight: false,
                lazyQuery: {
                    url: '/flowable/approvalInitiationRecord/select',
                    op: {
                        selectList: 'selectApprovalProcessRecordPage',
                        selectCount: 'selectApprovalProcessRecordCount',
                    },
                    beforeQuery: this.beforeQuery,
                    afterQuery:this.afterQuery
                },
            },
            dialogVisible:false,
            commentId:'',
            withdrawId:'',
            approvalTime:'',
            row:{},//路由参数
            // 请求参数
            processSearchOptions: {
                procinstId: '',
                procdefId: '',
                procinstIds: '',
            },
            remarkText: '',
            showDia: false,
            tableData: []
        };
    },
    created(){
      this.row=JSON.parse(this.$route.query.row)
      this.processSearchOptions.procinstId = this.processId;

      let timer = window.setInterval(() => {
        // 一开始没有操作记录，就不要刷新
        if (this.tableData.length !== 0) {
          this.$refs['table'].reset()
        }
      }, 2 * 60 * 1000)

      this.$once('hook:beforeDestroy', () => {
        window.clearInterval(timer)
        timer = null
      })
    },
    computed: {
        ...mapGetters(['login/userInfo']),
    },
    methods: {
        beforeQuery() {
            return this.processSearchOptions;
        },
        afterQuery(data){
            this.tableData = data || []
            this.handleList(data)
            this.$emit('get-data',this.tableData)
            return data
        },
        showRevoke(row) {
            const userId = this['login/userInfo'].id;
            if (userId != row.approvalUser) return false;
            let diff = dayjs().diff(dayjs(row.approvalTime), 'minute');
            if(row.approvalStatus !== '6') return false
            // 评论时间超过2分钟 不让撤销
            if(!(diff >= 0 && diff <= 1)) return false

            return true

        },
        dialogVisibleTrue(row){
            this.withdrawId=row.id;
            this.commentId=row.commentId;
            this.approvalTime=row.approvalTime
            this.dialogVisible=true
        },
       async remove(){
            let diff = dayjs().diff(dayjs(this.approvalTime), 'minute');
            if (diff > 2) {
                this.$message.error('评论时间超过2分钟，不可撤销');
                dialogVisible = false
                // 调用刷新列表的接口
                this.$refs.table.search();
                return;
            }
            let opt = {
                data: {
                    commentId:this.commentId,
                    procInstId: this.withdrawId
                },
                op: 'commentRevoke',
            };
            try{
                const res = await this.$axios('/new/flowable/todoTask/save', opt);
                if(res.code===1){
                    this.$message.success('撤销成功');
                    this.$refs.table.search();
                    this.dialogVisible=false
                }
            }catch(err){
            }
        },
        handleList(list) {
            try {
                list.forEach(item => {
                            // 将前端的字段补齐（上面使用无需容错）
                            // 直接可以使用的备注字段-之前的remark 不用管-也不需要在上面的template中使用
                            item.remarkText = '';

                            // 添加抄送人：  这个后端返回的文案，可能会是其他的场景
                            item.ccDescText = '';

                            // 抄送人人员列表
                            item.ccUserList = [];

                            if (item.remark !== null) {
                                // 示例：哈哈哈<br/>添加抄送人：车车,歌好听,冒烟2,总悟(bu)
                                // 将评论拆分开

                                let arr = item.remark.split('<br/>');
                                item.remarkText = arr[0];

                                // 如果有抄送人，则长度从1开始截取
                                if (arr.length > 1) {
                                    let ccListArr = arr[1].split('：');
                                    if (ccListArr.length && ccListArr.length > 1) {
                                        item.ccDescText = ccListArr[0];
                                        item.ccUserList = ccListArr[1].split(',');
                                    }
                                }
                            }
                });
            } catch (error) {
                console.log('解析报错--[src\views\agenda\components\approvalProcess.vue]-handleList方法');
                console.log(error);
            }
        },
        judgeStatusColor(status) {
            if (status === '1') {
                return 'pass';
            } else if (status === '2') {
                return 'reject';
            } else {
                return 'close';
            }
        },
        // showRemarkDia(remarkInfo) {
        //     if (!remarkInfo) return;

        //     // 替换<br/>
        //     remarkInfo = remarkInfo.replace(/\<br\/>/g, '\r\n');
        //     this.remarkText = remarkInfo;
        //     // this.showDia = true;
        // },
    },
};
</script>
<style lang="scss" scoped>
/deep/.el-dialog{
    text-align: center;
}
.remove-btn {
    margin-left: 8px;
    color: rgb(0, 136, 255);
    cursor: pointer;
}
.pointRecordList {
    background-color: #fff;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;

    /deep/ .el-table {
        border-radius: 8px;

        .header-row {
            th {
                background: #f5f7fa;
            }
        }
    }

    .listTitle {
        position: relative;
        height: 25px;
        padding-left: 8px;
        margin-top: 32px;
        margin-left: 40px;
        font-size: 16px;
        color: #303133;
        line-height: 25px;
        margin-bottom: 16px;
        font-weight: bold;
        &::before {
            position: absolute;
            content: ' ';
            left: 0;
            top: 4px;
            width: 4px;
            height: 16px;
            background: #f05259;
            border-radius: 0px 84px 84px 0px;
        }
    }
    ::v-deep.ws-table-warp {
        padding: 0px 40px 32px !important;
        // min-height: 50vh;
        .empty-table {
            height: 334px !important;
        }
        .statusText {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            text-align: center;
        }
        .pass {
            background: #e1fef7;
            color: #2ac39b;
        }
        .reject {
            background: #f5f7fa;
            color: #606266;
        }
        .close {
            background: #f5f7fa;
            color: #909399;
        }

        .el-table {
            .remarkInfo-column {
                .cell {
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                }
            }

            .remarkStyle {
                text-decoration: underline;
                cursor: pointer;
            }
        }
    }
}
</style>
