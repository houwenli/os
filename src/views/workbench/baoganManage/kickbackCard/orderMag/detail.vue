<template>
  <div>
    <div class="accountMagDetail">
        <div class="base" v-loading="loading">
            <ws-descriptions title="基础信息">
                <ws-descriptions-item label="业务单号" :showTip="false">{{ baseInfo.orderId || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="状态" :showTip="false">{{ formatLable(baseInfo.payStatus, statusOptions) || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="套餐城市" :showTip="false">{{ baseInfo.regionName || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="套餐天数(天)" :showTip="false">
                    <!-- baseInfo.payStatus != 1  标识负数 -->
                    <span v-if="baseInfo.purchaseVipDay != null">{{ baseInfo.payStatus != 1 ? '-' : '' }}</span>
                    {{ baseInfo.purchaseVipDay != null ? baseInfo.purchaseVipDay: '-' }}
                </ws-descriptions-item>
                <ws-descriptions-item label="平台费收入(%)" :showTip="false">{{ baseInfo.platformRate || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="应付金额(元)" :showTip="false">
                    <span v-if="baseInfo.payAmount == null">-</span>
                    <span v-else>
                        <!-- baseInfo.payStatus != 1  标识负数 -->
                        {{ baseInfo.payStatus != 1 ? '-' : '' }}
                        {{ baseInfo.payAmount | regFenToYuan }}
                    </span>
                </ws-descriptions-item>
                <ws-descriptions-item label="实付金额(元)" :showTip="false">
                    <span v-if="baseInfo.payAmount == null">-</span>
                    <span v-else>
                        <!-- baseInfo.payStatus != 1  标识负数 -->
                        {{ baseInfo.payStatus != 1 ? '-' : '' }}
                        {{ baseInfo.actualAmount | regFenToYuan }}
                    </span>
                </ws-descriptions-item>
                <ws-descriptions-item label="支付方式" :showTip="false">{{ baseInfo.payTypeName || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="创建时间" :showTip="false">{{ baseInfo.createTime || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="业务单归属机构" :showTip="true">{{ baseInfo.orderOrgName || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="价格获取方式" :showTip="false">{{ baseInfo.recognizeTypeName || '-' }}</ws-descriptions-item>
            </ws-descriptions>
        </div>
        <div class="base" v-loading="loading">
            <ws-descriptions title="购买车主信息">
                <ws-descriptions-item label="司机ID" :showTip="false">{{ baseInfo.driverId || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="司机姓名" :showTip="false">{{ baseInfo.driverName || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="手机号码" :showTip="false">{{ baseInfo.driverPhone || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="归属机构" :showTip="true">{{ baseInfo.orgName || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="车牌号" :showTip="false">{{ baseInfo.carNum || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="机构编码" :showTip="false">{{ baseInfo.agencyNumber || '-' }}</ws-descriptions-item>
            </ws-descriptions>
        </div>
        <div class="base" v-loading="loading">
           <ws-descriptions title="支付信息" type="container">
                <div class="payInfo">
                    <table>
                        <tr>
                            <th>发起支付时间</th>
                            <th>支付方式</th>
                            <th>商户名称</th>
                            <th>商户号</th>
                            <th>商户订单号</th>
                            <th>交易订单号</th>
                            <th>支付金额(元)</th>
                            <th>完成支付时间</th>
                        </tr>
                        <tr>
                            <td>{{ baseInfo.createTime || '-' }}</td>
                            <td>{{ baseInfo.payTypeName || '-' }}</td>
                            <td>{{ baseInfo.merchantName || '-' }}</td>
                            <td>{{ baseInfo.merchantNum || '-'}}</td>
                            <td>{{ baseInfo.merchantOrderNum || '-'}}</td>
                            <td>{{ baseInfo.transNum || '-' }}</td>
                            <td>
                                <span v-if="baseInfo.actualAmount == null">-</span>
                                <span v-else>{{ baseInfo.actualAmount | regFenToYuan }}</span>
                            </td>
                            <td>{{ baseInfo.payTime || '-' }}</td>
                        </tr>
                    </table>
                </div>
            </ws-descriptions> 
        </div>
        <div class="base" v-loading="loading">
            <ws-descriptions title="申请退款信息">
                <ws-descriptions-item label="退款方式" :showTip="false">
                    <span v-if="baseInfo.refundWay == null">-</span>
                    <span v-else>{{ baseInfo.refundWay | baoganPayTypeFilters }}</span>
                </ws-descriptions-item>
                <ws-descriptions-item label="退款金额(元)" :showTip="false">
                    <span v-if="baseInfo.refundAmount == null">-</span>
                    <span v-else>{{ baseInfo.refundAmount | regFenToYuan }}</span>
                </ws-descriptions-item>
                <ws-descriptions-item label="退款天数(天)" :showTip="false">{{ baseInfo.refundDay || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="退款备注" :showTip="true">{{ baseInfo.refundRemark || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="申请操作人" :showTip="false">{{ baseInfo.refundCreateUser || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="申请时间" :showTip="false">{{ baseInfo.refundTime || '-' }}</ws-descriptions-item>
            </ws-descriptions>
        </div>
        <div class="base" v-loading="loading">
            <ws-descriptions title="审核退款信息">
                <ws-descriptions-item label="审核操作人" :showTip="false">{{ baseInfo.auditCreateUser || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="审核时间" :showTip="false">{{ baseInfo.auditTime || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="审核备注" :showTip="true">{{ baseInfo.auditRemark || '-' }}</ws-descriptions-item>
                <ws-descriptions-item label="审核状态" :showTip="false">
                    {{ formatLable(baseInfo.payStatus, auditStatus) || '-' }}
                </ws-descriptions-item>
            </ws-descriptions>
        </div>
        <div class="base" v-loading="loading">
            <ws-descriptions title="退款信息">
                <ws-descriptions-item label="退款时间" :showTip="false">{{ baseInfo.financeRefundTime || '-' }}</ws-descriptions-item>
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
                // 状态 1 支付成功；3 已退款 4 审核中
                { id: 1, value: '支付成功' },
                // { id: 2, value: '退款中' },
                { id: 3, value: '已退款' },
                { id: 4, value: '审核中' }
            ],
            auditStatus: [
                { id: 3, value: '已退款' },
                { id: 4, value: '审核中' }
            ],
            moduleName: '/workbench/baoganManage/orderMag',
            op: {
                detail: 'detail',
                detailDecrypt: 'detailDecrypt'
            },
            loading: false
        }
    },
    mounted() {
        this.getInfo()
    },
    methods: {
        back() {
            this.$router.push({ name: 'orderMag' })
        },
        getInfo() {
            this.loading = true
            let data = {
                data: {
                    orderId: this.$route.query.orderId,
                },
                op: { true: this.op.detailDecrypt, false: this.op.detail }[this.$route.query.isEncrypt + ''],
            };
            let URL = this.$getModuleUrl(this.moduleName, data.op);
            if (!URL) {
                this.loading = false
                this.$message.error('无权限访问');
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
    .payInfo {
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #ebeef5;
        table {
            width: 100%;
            th, td {
                height: 40px;
                line-height: 40px;
                padding: 0 5px;
                text-align: center;
            }
            th {
                color: #303133;
                background: #f5f7fa;
                border-right: 1px solid #ebeef5;
                border-bottom: 1px solid #ebeef5;
                &:last-of-type {
                    border-right: 0;
                } 
            }
            td {
               border-right: 1px solid #ebeef5; 
            }
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