<template>
    <div class="bigbox">
        <div class="title">{{ dataInfo.name }}</div>
        <div class="header">
            <div>
                <div class="headerTitle">机构在职总人数</div>
                <org-table :tableData='tableData.OrgEmpData' tableType='orgType' :orgType='dataInfo.orgType'></org-table>
            </div>
            <!-- 一级机构数量 -->
            <div v-if='dataInfo.orgType==5 || dataInfo.orgType==4'>
                <div class="headerTitle">一级机构数量</div>
                <org-table :tableData='tableData.companyData' tableType='orgStatus' :orgType='dataInfo.orgType'></org-table>
            </div>
            <!-- 二级机构数量 -->
            <div v-if='dataInfo.orgType!=40 && dataInfo.orgType!=30'>
                <div class="headerTitle">二级机构数量</div>
                <org-table :tableData='tableData.centerData' tableType='orgStatus' :orgType='dataInfo.orgType'></org-table>
            </div>
            <!-- 实体店数量 -->
            <div v-if='dataInfo.orgType!=40'>
                <div class="headerTitle">实体店数量</div>
                <org-table :tableData='tableData.stationData' tableType='orgStatus' :orgType='dataInfo.orgType'></org-table>
            </div>
        </div>
        <org-dialog ref="orgdialog" v-on="$listeners" :showProcessPerson='showProcessPerson' @closepop='closepop' :dataInfo='dataInfo'></org-dialog>
        <div class="saveButon" v-if="dataInfo.orgType==20">
            <el-button class="buttons" type="primary" @click="saveContent()">组织调整</el-button>
        </div>
    </div>
</template>

<script>
import orgTable from './components/orgTable.vue';
import orgDialog from './components/orgDialog.vue';
export default {
    components: { orgTable, orgDialog },
    props: {
        departmentName: {
            // 部门名称
            type: String,
            default: '',
        },
        dataInfo: {
            // 部门类型
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            tableData: {
                OrgEmpData: {},
                companyData: {},
                centerData: {},
                stationData: {},
            },
            showProcessPerson: false,
            moduleName: '/systemManage/institutionalOrganization',
        };
    },
    watch: {
        dataInfo(val) {
            this.getdepartmentDetail(val.id);
        },
    },
    methods: {
        // 获取详情
        getdepartmentDetail(deptId) {
            let data = {
                op: 'selectOrgData',
                data: { deptId },
            };
            this.$axios(this.getModuleUrl(data.op), data).then(res => {
                if (res.code == 1) {
                    let data = JSON.parse(res.data);
                    this.tableData = { ...data };
                }
            });
        },
        // 点击组织调整
        saveContent() {
            this.showProcessPerson = true;
        },
        closepop() {
            this.showProcessPerson = false;
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
};
</script>

<style lang="scss" scoped>
.bigbox {
    padding: 25px;
    width: 100%;
    height: 100%;
    overflow: auto;
    .title {
        height: 28px;
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #303133;
        line-height: 28px;
        text-align: center;
    }
    .header {
        .headerTitle {
            margin-bottom: 15px;
            height: 25px;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #303133;
            line-height: 25px;
            margin-top: 20px;
        }
    }
    .middle {
        margin-top: 12px;
        .middleTitle {
            width: 100%;
            height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            .text {
                height: 25px;
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 600;
                color: #303133;
                line-height: 25px;
            }
            .addButton {
                border: 1px solid #f05259;
                border-radius: 4px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #f05259;
            }
        }
        .departmentBox {
            /deep/ .el-form-item__content {
                margin-left: 0px !important;
            }
        }
    }
    .footer {
        width: 100%;
        margin-top: 32px;
        .footerTittle {
            margin-bottom: 16px;
            height: 25px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 600;
            color: #303133;
            line-height: 25px;
            margin-top: 20px;
        }
    }
    .saveButon {
        // width: 100%;
        // height: 50px;
        // text-align: center;
        // // margin-top: 45px;
        // position: fixed;
        // background: red;
        z-index: 999;
        position: fixed;
        bottom: 0;
        left: 80px;
        width: 100%;
        height: 64px;
        background: #ffffff;
        box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.04);
        display: flex;
        justify-content: center;
        align-items: center;
        .buttons {
            width: 160px;
            height: 36px;
            display: block;
        }
    }

    /deep/ .el-form-item__label {
        width: 135px !important;
    }

    /deep/ .el-form-item__content {
        margin-left: 135px !important;
    }

    /deep/ .el-select {
        width: 100%;
    }
}
</style>
