<template>
    <div class="requirenment-box">
        <div class="radioCont">
            <div class="top" style="background-color: white"></div>
            <div class="draftStyle">
                <el-button @click="draft" class="draftBtn">
                    <div class="draftBox">
                        <img class="pic-draft" src="@/assets/icons/drafts.png" v-if="getModulePower('/workbench/BRrequirement').draftList" />
                        <div class="draftTiltle">草稿箱({{ draftCount }})</div>
                    </div>
                </el-button>
            </div>
        </div>
        <div class="radioBox">
            <el-radio-group v-model="demandPermission" class="formRadio">
                <el-radio-button size="medium" label="1"  v-if="getModulePower('/business').businessDemandApplyAllList"><span>所有需求</span></el-radio-button>
                <el-radio-button size="medium" label="2"  v-if="getModulePower('/business').businessDemandApplyList"><span>我发起的</span></el-radio-button>
            </el-radio-group>
            <el-radio-group class="top_radio" v-model="approvalStatus">
                <el-radio-button label="" size="medium"><span class="search-btn">全部</span></el-radio-button>
                <el-radio-button :label="0" size="medium"><span class="search-btn">审批中</span></el-radio-button>
                <el-radio-button :label="1" size="medium"><span class="search-btn">已驳回</span></el-radio-button>
                <el-radio-button :label="2" size="medium">
                    <span class="search-btn">已撤销</span>
                </el-radio-button>
                <el-radio-button :label="3" size="medium">
                    <span class="search-btn">审批通过</span>
                </el-radio-button>
            </el-radio-group>
        </div>
        <div class="right">
            <ws-table-el ref="table" v-bind="tableConfig" highlight-current-row :header-cell-style="{ background: '#F5F7FA' }" @select="tableSelect">
                <!-- 数据表格部分 -->
                <template>
                    <ws-table-column-el prop="demandCode" label="需求编号"></ws-table-column-el>
                    <ws-table-column-el prop="demandName" label="需求名称"></ws-table-column-el>
                    <ws-table-column-el prop="createByName" label="需求提出人"></ws-table-column-el>
                    <ws-table-column-el prop="department" label="所属部门">
                        <template slot-scope="scope">
                            <p v-for="(item, index) in scope.row.department.split(',')" :key="index">{{ item }}</p>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="createTime" label="提交时间"></ws-table-column-el>
                    <ws-table-column-el prop="approvalStatusName" label="审批状态" width="95">
                        <template slot-scope="scope" prop="approvalStatus">
                            <el-tag style="background-color: #ecf5ff; border-color: #d9ecff; color: #409eff" v-if="scope.row.approvalStatus == 0">{{ scope.row.approvalStatusName }}</el-tag>
                            <el-tag type="warning" v-if="scope.row.approvalStatus == 1">{{ scope.row.approvalStatusName }}</el-tag>
                            <el-tag type="info" v-if="scope.row.approvalStatus == 2">{{ scope.row.approvalStatusName }}</el-tag>
                            <el-tag type="success" v-if="scope.row.approvalStatus == 3">{{ scope.row.approvalStatusName }}</el-tag>
                        </template>
                    </ws-table-column-el>

                    <ws-table-column-el prop="approvalTime" label="审批时间">
                        <template slot-scope="scope">
                            {{ scope.row.approvalTime || '-' }}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el fixed="right" width="160" label="操作">
                        <template v-slot="scope">
                            <el-button type="text" style="color: #0088ff" @click="goToPage(scope.row)" v-if="getModulePower('/business').detail">详情</el-button>
                            <el-button
                                type="text"
                                style="color: #0088ff"
                                v-if="(scope.row.demandStatus == 3 || scope.row.demandStatus == 4) && getModulePower('/business').submit"
                                @click="hanldeResubmit(scope.row.id, 'cxtj', 'yewu')"
                            >
                                重新提交
                            </el-button>
                        </template>
                    </ws-table-column-el>
                </template>
            </ws-table-el>
        </div>
    </div>
</template>

<script>
export default {
    name: 'list',
    data() {
        return {
            demandPermission: '2', //需求权限 我的或者全部
            options: [
                {
                    value: '',
                    label: '全部',
                },
                {
                    value: '0',
                    label: '待规划',
                },
                {
                    value: '1',
                    label: '进行中',
                },
                {
                    value: '2',
                    label: '已完成',
                },
                {
                    value: '6',
                    label: '已关闭',
                },
                {
                    value: '5',
                    label: '已挂起',
                },
            ],
            value: '',
            ruleForm: {},
            sonMsg: 'demandApplication',
            draftCount: '',
            data: [],
            list: [],
            moduleName: '/workbench/BRrequirement',
            searchOptions: {
                demandStatus: '', // 需求状态
            },
            tableConfig: {
                layout: 'flow',
                pageId: '1000000',
                pageCreateTime: '',
                filterColumns: false,
                emptyModel: true,
                indexColumn: true,
                lazyQuery: {
                    moduleName: '/business',
                    op: {
                        selectList: 'businessDemandApplyList',
                        selectCount: 'businessDemandApplyCount',
                    },
                    beforeQuery: this.beforeQuery,
                },
            },
            approvalStatus: '',
            demandStatus: '',
            selectNameString: '', //复选框选中的数据项
            selectIdString: '', //复选框选中的数据项
            finishedCount: '', //已完成总数
            hangCount: '', //已挂起总数
            closedCount: '', //已关闭总数
        };
    },
    watch: {
        approvalStatus(label) {
            this.searchOptions = {
                approvalStatus: label,
            };
            this.$refs.table.tableData = [];
            this.$refs.table.search();
        },
        demandPermission(val) {
            if (val === '2') {
                this.$refs.table.reset();
                this.tableConfig.lazyQuery.op.selectList = 'businessDemandApplyList';
                this.tableConfig.lazyQuery.op.selectCount = 'businessDemandApplyCount';
            }
            if (val === '1') {
                this.$refs.table.reset();
                this.tableConfig.lazyQuery.op.selectList = 'businessDemandApplyAllList';
                this.tableConfig.lazyQuery.op.selectCount = 'businessDemandApplyAllCount';
            }
            this.approvalStatus = '';
        },
    },
    activated() {
        this.$nextTick(() => {
            this.approvalStatus = '';
            this.$refs.table.reset();
        });
        this.getDraftCount();
    },
    methods: {
        tableSelect(val) {
            this.showRemove = val.length ? true : false;
            let selectDemandName = [];
            let selectId = [];
            val.forEach(item => {
                selectDemandName.push(item.demandName);
                selectId.push(item.id);
                this.selectNameString = selectDemandName.toString();
                this.selectIdString = selectId.toString();
                return;
            });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        //详情
        goToPage(row) {
            this.$router.push({
                path: 'BRrequirement/detail',
                query: {
                    type: row.type,
                    id: row.id,
                    processId: row.processId,
                    approvalStatus: row.approvalStatus,
                    demandStatus: row.demandStatus,
                },
            });
        },
        draft() {
            this.$router.push({
                name: 'BRrequirementdraft',
                query: 2,
            });
        },
        //重新提交
        hanldeResubmit(id, name, type) {
            this.$emit('transfer1', id, name, this.sonMsg, type);
        },
        //获取草稿箱总数
        async getDraftCount() {
            let data = {
                data: {},
                op: 'draftCount',
            };
            try {
                let res = await this.$axios(this.getModuleUrl(data.op), data);
                if (res.data > 99) {
                    this.draftCount = '99+';
                } else {
                    this.draftCount = res.data;
                }
            } catch (error) {}
        },
    },
};
</script>

<style lang="scss" scoped>
/deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    color: #606266 !important;
}
.search-btn {
    display: block;
    height: 100%;
}
.el-form-item {
    margin-bottom: 24px;
}
/deep/ .audit-content-footer-person {
    margin-top: 21px !important;
}
/deep/ .currency-apply-audit .currency-apply-audit-content .audit-content-header-title {
    margin-bottom: 0px !important;
}
/deep/ .currency-apply-audit .currency-apply-audit-content {
    padding: 0px 8px 0px 12px !important;
    min-height: 80px !important;
    /deep/ .currency-apply-audit .currency-apply-audit-content .audit-content-header-title {
        margin-bottom: 0px !important;
    }
}
.tab-btn {
    /deep/ .el-radio-button__inner {
        width: 124px !important;
    }
}
/deep/ .el-radio-button__inner {
    background-color: #ebeef5;
    border-style: none;
    border-left: 0px solid #dcdfe6 !important;
    border-radius: 0px 3px 3px 0px;
}
.requirenment-box {
    background: #fff;
    border-radius: 0 0 8px 8px !important;
    padding: 24px;
    .radioBox {
        height: 26px;
        margin-left: 24px;
        display: flex;
        justify-content: space-between;
        // display: flex
        .formRadio {
            width: 210px;
            display: flex;
            justify-content: space-between !important;
            /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
                color: #f05259 !important;
                background-color: #fff;
                border: 1px solid #f05259 !important;
                border-radius: 4px 4px 4px 4px !important;
                -webkit-box-shadow: 0px 0 0 0 #f05259;
            }
            /deep/ .el-radio-button__orig-radio + .el-radio-button__inner {
                background-color: #fff;
                border: 1px solid #dcdfe6 !important;
                border-radius: 4px 4px 4px 4px !important;
            }
        }
    }
    /deep/ .el-radio-button {
        border-style: none;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inne {
        background-color: red;
    }
    /deep/ .el-radio-button__orig-radio:checked {
        border-style: none;
        background-color: red;
    }
    .el-form-item__content {
        margin-bottom: 5px;
    }
    /deep/ .el-textarea .el-input__count {
        background: #ffe4c400;
        bottom: -5px !important;
    }
    /deep/ .el-form-item.is-success .el-textarea__inner {
        height: 30px;
    }
    .demand /deep/ .el-input__count {
        display: none !important;
    }
    /deep/ .draftBtn {
        padding-right: 20px;
        color: #f05259;
        border-color: #f05259;
    }
    .pic-draft {
        width: 16px;
    }
    .draftBox {
        display: flex;
    }
    /deep/ .el-button--medium {
        padding: 0px 15px 0px 15px !important;
    }
    /deep/ .draftTiltle {
        margin-top: 1px;
        padding-left: 5px;
    }
    .bottomMenu {
        width: 100%;
        // margin-left: 15px;
        z-index: 999;
        // padding: 24px 0 0 0;
        bottom: 0px;
        height: 64px;
        margin: 0 auto;
        background-color: #fff;
        position: fixed;
        bottom: 0;
        left: 80px;
        box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.04);
        line-height: 64px;
        .el-button {
            width: 160px;
        }
    }

    .icon-img {
        display: inline-block;
        font-size: 50px;
        color: #67c23a;
        padding: 0px 0px 20px;
    }

    .hint {
        margin-bottom: 20px;
    }
    .left {
        width: 100%;
        background: #fff;
        border-radius: 0px 0px 8px 8px !important;
        padding: 24px 24px 0;
        margin: 0 auto;
        margin-bottom: 64px;
        .el-form {
            width: 1000px;
            min-width: 60px;
            margin: 0 auto;
        }
        .process {
            margin-left: 0px;
        }

        .hint {
            margin-bottom: 20px;
        }
        .el-dialog {
            min-width: 300px;
            width: 200px;
        }
    }
    .radioCont {
        background: white;
        padding: 10px 25px 10px 10px;
        border-radius: 8px 8px 0px 0px;
        display: flex;
        margin-left: 240px;
        margin-top: -70px;
        .top {
            width: 100%;
            // height: 100%;
            flex: 10;
        }
        .draftBtn {
            width: 100%;
            flex: 1;
        }
    }
    /deep/ .ws-table-warp {
        border-radius: 0px 0px 8px 8px !important;
        // margin-top: -78px;
    }
    /deep/ .ws-table-warp .el-table th {
        padding: 0 0;
    }
    // 下方切换按钮样式
    /deep/ .el-tabs__nav-wrap {
        margin: 0px;
        background: #f5f7fa;
        padding: 0;
        margin-left: 50px;
    }
    .title {
        font-size: 16px;
        font-weight: bold;
        text-align: center;
    }
    .apply-btn {
        margin: 24px;
    }
    .el-row {
        text-align: center;
    }
    .el-radio-group {
    }
    .top {
        // display: flex;
        background-color: white;
        .selectStyle {
            display: inline;
        }
    }
    .top_radio {
        border-bottom: 1px solid #dcdfe6 !important;
        border-radius: 0px 0px 0px 0px !important;
        margin: 11px 26px -11px 0px;
        /deep/ .el-radio-button.is-active {
            .el-radio-button__inner {
                padding: 0 24px 0px 0px;
                height: 100%;
                line-height: 24px;
                font-weight: bolder !important;
                border-radius: 0px 0px 0px 0px !important;
                color: #f05259;
                -webkit-box-shadow: 0px 0 0 0 #f05259;
            }
            .search-btn {
                border-bottom: 2px solid red;
                text-shadow: 1px 0 0 #f05259;
                font-weight: bold;
                color: #f05259;
            }
        }
        /deep/ .el-radio-button__inner {
            padding: 0 24px 0px 0px;
            height: 100%;
            // line-height: 35px;
            border: none !important;
            background: none !important;
        }
    }
}
.footer {
    bottom: 6px;
    left: 184px;
    width: 100%;
    height: 70px;
    background-color: rgb(255, 255, 255);
    line-height: 70px;
    main {
        width: 380px;
        margin: auto;
    }
}
.right {
    height: calc(100% - 86px);
}
/deep/ .el-input__count {
    height: 41px;
}
.deleted /deep/ .el-input__count::before {
    content: '';
    display: inline-block;
    pointer-events: auto;
    position: relative;
    top: 4px;
    margin-right: 5px;
    width: 16px;
    height: 16px;
    // background: url(../../../assets/images/delet.png) no-repeat left 50%;
    background-size: cover;
}
.deleted /deep/ .el-input__count::before:active {
    background-color: #67c23a;
}
/deep/ .currency-apply-audit {
    padding: 0 !important;
}
/deep/ .el-timeline {
    margin-left: -30px !important;
    margin-top: 40px;
}
/deep/ .el-textarea__inner {
    color: #000000;
}
.icon-img {
    display: inline-block;
    font-size: 50px;
    color: #67c23a;
    padding: 0px 0px 20px;
}
</style>