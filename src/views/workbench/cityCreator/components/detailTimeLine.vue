<template>
    <div class="detailTimeLine-container">
        <div class="title">
            <p>异动轨迹</p>
        </div>
        <div class="detail">
            <el-timeline>
                <el-timeline-item v-for="(item, index) in timeData" :key="index" color="#f05259">
                    <div class="timestamp">
                        {{ item.time }}
                    </div>
                    <div class="nodeName">
                        {{ item.nodeName }}
                    </div>
                    <div class="card" v-for="(otem, oindex) in item.list" :key="oindex">
                        <div class="card-item">
                            <span class="tagAdd" v-if="otem.typeName == '新增'">新增</span>
                            <span class="tagAdd" v-if="otem.typeName == '设为主职'">设为主职</span>
                            <span class="tagDelete" v-if="otem.typeName == '删除'">删除</span>
                            <p>组织架构类型：{{ otem.departmentType }}</p>
                            <p>职位类型：{{ otem.positionType }}</p>
                            <p>机构：{{ otem.departmentName }}</p>
                            <p>职位：{{ otem.positionName }}</p>
                            <!-- <p v-show="otem.abandonReason">放弃原因：{{ otem.abandonReason }}</p> -->
                            <p v-show="otem.reasonType && item.nodeName=='离职成功'">离职类型：{{ otem.reasonType }}</p>
                            <p v-show="otem.abandonReason">{{item.nodeName=='离职成功'?"离职原因：":"放弃原因："}}{{ otem.abandonReason }}</p>
                            <!-- <p v-show="otem.remark">备注：{{ otem.remark }}</p> -->
                            <p class="dealname">经办人：{{ otem.dealName }}{{ otem.creatorDepartmentName?'('+otem.creatorDepartmentName+')':'' }}</p>
                        </div>
                    </div>
                </el-timeline-item>
            </el-timeline>
            <p style="padding-left: 166px; margin-top: -60px" v-if="backData.length > 0">
                <el-button type="text" v-show="showAll && backData.length > 5"
                    @click="showAll = !showAll">
                    查看全部轨迹
                    <i class="el-icon-arrow-down"></i>
                </el-button>
                <el-button type="text" v-show="!showAll &&backData.length > 5"
                    @click="showAll = !showAll">
                    收起
                    <i class="el-icon-arrow-up"></i>
                </el-button>
            </p>
            <div class="empty_text" v-show="!backData.length">
                <img src="@/assets/index/empty.png" alt />
                <p>暂无数据</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'detailTimeLine',
    data() {
        return {
            timeData: [],
            showAll: true,
            backData: [],
            moduleName: '/workbench/BRcityCreator',
        };
    },
    created() {
        this.getDetails();
    },
    watch: {
        showAll: function (val) {
            if (val && this.backData.length > 5) {
                this.timeData = this.backData.slice(0, 5);
            } else {
                this.timeData = this.backData;
            }
        },
    },
    methods: {
        getDetails() {
            let query={
                op:'selectMoveTrajectory',
                data:{
                    id:this.$route.query.id,
                    // id:14,
                    dataSource:2
                }
            }
            this.$axios(this.getModuleUrl(query.op), query).then(res => {
                let result = JSON.parse(res.data);
                this.backData=this.$baseMethod.deepClone(result)
                 if (this.backData.length > 5) {
                        this.timeData = this.backData.slice(0, 5);
                    } else {
                        this.timeData = this.backData;
                    }
            });
           
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
};
</script>

<style lang="scss" scoped>
.detailTimeLine-container{
    padding-bottom: 24px;
    .title {
    width: 100%;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-top: 32px;
    margin-bottom: 16px;

    p {
        /deep/ .el-button--text {
            float: right;
        }
    }
}

.el-timeline {
    margin-left: 120px;
    margin-bottom: 40px;

    .timestamp {
        position: absolute;
        left: -113px;
        top: 1px;
        width: 82px;
        line-height: 20px;
        text-align: right;
        color: #606266;
    }

    .card {
        padding: 6px 16px;
        line-height: 30px;
        width: 260px;
        background: #f5f7fa;
        border-radius: 8px;
        border: 1px solid #ebeef5;
        margin: 5px 32px 40px 0;
        display: inline-block;
        position: relative;

        .card-item {
            .tagAdd {
                position: absolute;
                right: 5px;
                top: 5px;
                padding: 0 4px;
                color: #2ac39b;
                background: #e1fef7;
                border-radius: 4px;
            }

            .tagDelete {
                position: absolute;
                right: 5px;
                top: 5px;
                padding: 0 4px;
                color: #f56c6c;
                background: #fef0f0;
                border-radius: 4px;
            }

            p {
                word-wrap: break-word;
                word-break: break-all;
                overflow: hidden;
            }
        }
    }

    .dealname {
        position: absolute;
        top: 100%;
        font-size: 14px;
        font-weight: 400;
        color: #606266;
    }
}

/deep/ .el-timeline-item__node--normal {
    width: 14px;
    height: 14px;
    left: 1px;
}

/deep/ .el-timeline-item__tail {
    left: 7px;
    border-left: 1px dashed #f05259;
}

/deep/ .el-timeline-item__wrapper {
    padding-left: 47px !important;
}

.nodeName {
    position: relative;
    top: -5px;
    line-height: 28px;
    font-size: 15px;
    font-weight: 600;
    color: #606266;
}

/deep/ .el-timeline-item:last-child {
    padding: 0;

    .el-timeline-item__tail {
        display: inline-block !important;
    }
}
}

</style>