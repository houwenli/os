<template>
  <div>
    <div class="accountMagDetail">
        <div class="base" v-loading="loading">
            <ws-descriptions title="基础信息">
                <ws-descriptions-item label="司机ID" :showTip="false">{{ baseInfo.driverId || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="司机姓名" :showTip="false">{{ baseInfo.driverName || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="手机号码" :showTip="false">{{ baseInfo.phone || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="归属机构" :showTip="true">{{ baseInfo.agencyName || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="套餐状态" :showTip="false">{{ formatLable(baseInfo.packageStatus, statusOptions) || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="剩余总金额(元)" :showTip="false">
                    <span v-if="baseInfo.currentAmount == null">-</span>
                    <span v-else>{{ baseInfo.currentAmount | regFenToYuan }}</span>
                </ws-descriptions-item>
            </ws-descriptions>
        </div>
        <div class="table">
            <ws-descriptions title="减佣卡账户" type="container">
                <ws-table-el align="left" ref="table" v-bind="tableConfig">
                    <template>
                        <ws-table-column-el prop="orderNum" label="业务单号"></ws-table-column-el>
                        <ws-table-column-el prop="packagePrice" label="套餐价格(元)">
                            <template slot-scope="scope">
                                <span>{{ scope.row.packagePrice | regFenToYuan }}</span>
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el prop="packageDay" label="套餐天数"></ws-table-column-el>
                        <ws-table-column-el prop="platformRate" label="平台费收入(%)"></ws-table-column-el>
                        <ws-table-column-el prop="balance" label="剩余金额(元)">
                            <template slot-scope="scope">
                                <span>{{ scope.row.balance | regFenToYuan }}</span>
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el prop="days" label="剩余天数"></ws-table-column-el>
                        <ws-table-column-el prop="startTime" label="开始时间"></ws-table-column-el>
                        <ws-table-column-el prop="endTime" label="结束时间"></ws-table-column-el>
                    </template>
                </ws-table-el>
            </ws-descriptions>
        </div>
    </div>
    <div class="footerBtn">
        <el-button plain @click="back">返 回</el-button>
    </div>
  </div>
</template>

<script>
import { formatLable } from '@/utils/util.js'
export default {
    data() {
        return {
            baseInfo: {},
            statusOptions: [
                { id: 1, value: '有效' },
                { id: 0, value: '无效' },
            ],
            tableConfig: {
                loading: true,
                filterColumns: false,
                pageSizeList: [5, 10, 20],
                autoHeight: false,
                lazyQuery: {
                    moduleName: '/workbench/baoganManage/accountMag',
                    op: {
                        selectList: 'childPageList',
                        selectCount: 'childCount'
                    },
                    beforeQuery: this.beforeQuery,
                    immediate: true
                }
            },
            moduleName: '/workbench/baoganManage/accountMag',
            op: {
                detail: 'accountDetail',
                detailDecrypt: 'accountDetailDecrypt'
            },
            loading: false
        }
    },
    mounted() {
        this.getInfo()
    },
    methods: {
        back() {
            this.$router.push({ path: this.moduleName })
        },
        beforeQuery() {
            return { driverId: this.$route.query.driverId }
        },
        getInfo() {
            this.loading = true
            let data = {
                data: {
                    driverId: this.$route.query.driverId,
                },
                op: { true: this.op.detailDecrypt, false: this.op.detail }[this.$route.query.isEncrypt + '']
            };
            let URL = this.$getModuleUrl(this.moduleName, data.op);
            if (!URL) {
                this.$message.error('无权限访问');
                this.loading = false
                return false;
            }
            this.$axios(URL, data).then(res => {
                this.loading = false
                this.baseInfo = JSON.parse(res.data);
            }).catch(() => {
                this.loading = false
            })
        },
        formatLable: formatLable
    }
}
</script>

<style lang="scss" scoped>
.accountMagDetail {
    height: 100%;
    background: #fff;
    padding: 20px 24px 45px;
    border-radius: 8px;
    overflow-y: auto;
    .table {
        .ws-table-warp {
            padding: 0 !important;
        }
    }
}
.footerBtn {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60px;
    background: #fff;
    border-top: 1px solid #f2f2f2;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-button {
        padding: 10px 65px;
    }
}
</style>