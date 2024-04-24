<template>
    <div class="personal-info">
        <div class="title">
            <span>账号信息</span>
        </div>

        <el-form class="user-form" :model="formData" label-position="right">
            <el-form-item class="input-wrap" label="姓名：">
                <el-input v-model="formData.userName" readonly :disabled="true"></el-input>
            </el-form-item>
            <el-form-item class="input-wrap" label="登录账号：">
                <el-input v-model="formData.loginName" readonly :disabled="true"></el-input>
            </el-form-item>
        </el-form>
        <!-- <ws-update-password :visible.sync="modelVisible"></ws-update-password> -->
        <div class="title" v-if="getModulePower('/personalCenter/personInfo').employPositionDetail">职能信息</div>
        <ws-table-el ref="table" v-bind="tableConfig" :header-cell-style="tableHeaderStyle" v-if="getModulePower('/personalCenter/personInfo').employPositionDetail">
            <template>
                <ws-table-column-el width="auto" label="所属机构/部门" prop="deptName" />
                <ws-table-column-el width="auto" label="职务" prop="positionName" />
                <ws-table-column-el width="auto" label="职务类型" prop="partTime" />
                <ws-table-column-el width="auto" label="组织信息">
                    <template slot-scope="scope">
                        <el-button
                            v-if="
                                scope.row.agencyNumber &&
                                ((scope.row.orgType == 20 && getModulePower('/personalCenter/personInfo').companyDetail) ||
                                    (scope.row.orgType == 30 && getModulePower('/personalCenter/personInfo').companyCenterDetail) ||
                                    (scope.row.orgType == 40 && getModulePower('/personalCenter/personInfo').companyCenterStationDetail))
                            "
                            class="c0088ff"
                            @click="detailsFunc(scope.row, 'detail')"
                            type="text"
                        >
                            详情
                        </el-button>
                        <el-button
                            v-if="
                                scope.row.agencyNumber &&
                                ((scope.row.orgType == 20 && getModulePower('/personalCenter/personInfo').companyDetail) ||
                                    (scope.row.orgType == 30 && getModulePower('/personalCenter/personInfo').companyCenterDetail) ||
                                    (scope.row.orgType == 40 && getModulePower('/personalCenter/personInfo').companyCenterStationDetail))
                            "
                            class="c0088ff"
                            @click="detailsFunc(scope.row, 'edit')"
                            type="text"
                        >
                            编辑
                        </el-button>
                        <span v-else>-</span>
                        <el-button v-if="scope.row.openStatus == 1 && scope.row.orgType == 40" class="c0088ff" @click="applyStore(scope.row)" type="text">申请开店</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>

        <div class="title">拥有权限</div>
        <permissionTree />

        <div v-if="roleOption.orgType !== 0" class="title">账户信息</div>
        <ws-table-el v-if="roleOption.orgType !== 0" ref="table" v-bind="accountConfig" :header-cell-style="{ background: '#F5F7FA' }">
            <template>
                <ws-table-column-el prop="orgName" label="机构名称"></ws-table-column-el>
                <ws-table-column-el label="开户名">
                    <template slot-scope="scope">
                        <span v-if="scope.row.userName">{{ scope.row.userName }}</span>
                        <span v-else>-</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el label="银行卡号" width="200">
                    <template slot-scope="scope">
                        <span v-if="scope.row.bankcard">{{ scope.row.bankcard }}</span>
                        <span v-else>-</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el label="开户银行">
                    <template slot-scope="scope">
                        <span v-if="scope.row.bankName">{{ scope.row.bankName }}</span>
                        <span v-else>-</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el label="机构类型">
                    <template slot-scope="scope">
                        <span>{{ scope.row.orgType | orgTypeFilters }}</span>
                    </template>
                </ws-table-column-el>

                <ws-table-column-el label="账户总额">
                    <template slot-scope="scope">
                        <span>{{ changeYuan(scope.row.allMoney) }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el label="待结算金额">
                    <template slot-scope="scope">
                        <span>{{ changeYuan(scope.row.beSettledAmount) }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el label="可提现金额">
                    <template slot-scope="scope">
                        <span>{{ changeYuan(scope.row.totalMoney) }}</span>
                    </template>
                </ws-table-column-el>

                <ws-table-column-el label="操作" width="200px" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.orgType == '40' && getModulePower('/personalCenter/personInfo').confirmationWithdraw" type="text" class="c0088ff" @click="withDrawalFunc(scope.row)">
                            立即提现
                        </el-button>
                        <span v-else>-</span>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
import permissionTree from './permissionTree';
import { _axios } from '@/utils/commMethods';
import { mapState, mapActions } from 'vuex';

export default {
    name: 'personInfo',
    components: {
        permissionTree
    },
    data() {
        return {
            moduleName: '/personalCenter/personInfo',
            formData: {
                userName: '',
                loginName: ''
            },
            tableHeaderStyle: {
                height: '40px',
                background: '#F5F7FA',
                'font-size': '14px',
                'font-family': 'PingFangSC-Medium, PingFang SC',
                'font-weight': '500',
                color: '#606266'
            },
            modelVisible: false,
            tableConfig: {
                filterColumns: false,
                pagination: false,
                autoHeight: false,
                lazyQuery: {
                    moduleName: '/personalCenter/personInfo',
                    op: {
                        selectList: 'employPositionDetail'
                    }
                }
            },
            accountConfig: {
                filterColumns: false,
                pagination: false,
                lazyQuery: {
                    moduleName: '/personalCenter/personInfo',
                    op: {
                        selectList: 'selectOrgAccountList'
                    }
                }
            },
             // ENUM类
            ORG_INFO: {
                // orgType=20 【一级机构】 调用分公司详情
                // orgType=30 【二级机构】 调用服务中心详情
                // orgType=40 【实体店】 调用服务站详情
                // orgType=50 【出租车公司】 调用出租车公司详情
                // orgType=60 【独立法人公司】 独立法人公司详情
                20: {
                    name: 'branchCompany',
                    text: '一级机构'
                },
                30: {
                    name: 'serviceCentre',
                    text: '二级机构'
                },
                40: {
                    name: 'physicalStore',
                    text: '实体店'
                }
            },
            roleOption: {}
        };
    },
    computed: {
        ...mapState('personalCenter', ['orgTypeFilters'])
    },
    created() {
        this.getPersonalInfo();
        this.roleOption = this.$baseMethod.getStore('roleOption');
    },
    methods: {
        // ...mapActions({
        //     requestLogout: 'login/requestLogout'
        // }),
        async getPersonalInfo() {
            let vm = this;
            try {
                let res = await _axios({ op: 'selectPersonalInformation' }, vm.moduleName);
                res.code === 1 && (vm.formData = res.data);
            } catch (err) {
                throw err;
            }
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.requestUrl, op);
        },

        // 详情与编辑
        detailsFunc(row,type) {
            let vm = this;
            this.$router.push({ name:vm.ORG_INFO[row.orgType].name,query: {type, agencyNumber:row.agencyNumber, orgType: row.orgType,openStatus:row.openStatus}});
        },

        //单位转换
        changeYuan(num) {
            let str = (num / 100).toFixed(2) + '';
            let intSum = str.substring(0, str.indexOf('.')).replace(/\B(?=(?:\d{3})+$)/g, ',');
            let dot = str.substring(str.length, str.indexOf('.'));
            let ret = intSum + dot;
            return ret;
        },

        // 立即提现
        async withDrawalFunc(data) {
            if (data.bankcard) {
                let vm = this;
                try {
                    let res = await _axios({ op: 'canWithdrawal', relationId: data.relationId }, vm.moduleName);
                    res.code === 1 && vm.$router.push({ path: '/cashOut', query: data });
                } catch (err) {
                    throw err;
                }
            } else {
                this.$message.error('当前实体店无绑卡信息，请添加银行卡后进行提现操作！');
            }
        },
        // 申请开店
        applyStore(row) {
            if(row.auditStatus=='1'){
                   this.$message.error('申请开店正在审核，请审核结束后再进行操作！');
                   return;
            }
            this.$router.push({ path: '/applyStore', query: {orgType:row.orgType,agencyNumber:row.agencyNumber} })
        }

        // // 修改信息接收号码
        // modifyPhone() {
        //     this.$router.push({ name: "modifyPhone" });
        // },
    }
};
</script>

<style lang="scss" scoped>
.personal-info {
    .butBox {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 23px;
    }
    .title {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #303133;
        height: 28px;
        line-height: 28px;
        margin-bottom: 16px;
        display: flex;
    }
    /deep/ .ws-table-warp {
        padding: 0 !important;
        border: none;
        box-shadow: none;
        min-height: 10vh;
        margin-bottom: 20px;
    }
    /deep/ .ws-table-warp .option-box {
        margin: 0;
    }
    .el-input {
        width: 364px;
    }
    .job-info {
        box-shadow: none;
        min-height: 0;
        padding: 0 !important;
        margin-bottom: 20px;
    }
    .el-table {
        margin-bottom: 48px;
    }
}
.user-form {
    .input-wrap {
        display: inline-block;
        margin: 0 135px 32px 0;
    }
    .el-form-item__label {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #606266;
    }
    .el-form-item {
        display: inline-block;
    }
    /deep/ .el-form-item__content {
        display: flex;
    }
}
/deep/ label {
    font-weight: 400 !important;
}

.c0088ff {
    color: #0088ff;
}
</style>
