<!--
 * @Author: DaiYu
 * @Date: 2022-03-28 09:30:06
 * @LastEditors: DaiYu
 * @LastEditTime: 2022-06-09 18:51:49
 * @FilePath: \main\src\views\workbench\baoganManage\components\refundDialog.vue
-->
<template>
    <el-dialog
        title="退款申请"
        :visible.sync="visible"
        width="64%"
        center
        destroy-on-close
        :close-on-click-modal="false"
        @close="close"
    >
        <div class="nav_count">
            <div class="inline-block">
                <label for class="label">退包城市：</label>
                <el-select v-model="selectCityInfo" value-key="cityCode" placeholder="请选择" clearable @change="cityChange">
                    <el-option v-for="item in info.detailVos" :key="item.cityCode" :label="item.cityName" :value="item"></el-option>
                </el-select>
            </div>
            <div class="inline-block">
                <label for class="label">退包订单：</label>
                <el-select
                    v-model="selectOrder"
                    class="order"
                    value-key="orderId"
                    placeholder="请选择"
                    clearable
                    @change="orderChange"
                >
                    <el-option v-for="item in selectOrderInfos" :key="item.orderId" :label="formatLabel(item)" :value="item"></el-option>
                </el-select>
            </div>
            <template v-if="selectOrder.orderId">
                <div class="inline-block">
                    <label for class="label">实付金额：</label>
                    <span class="text">{{formatAmount(selectOrder.money)}}元</span>
                </div>
                <div class="inline-block">
                    <label for class="label">包干天数：</label>
                    <span class="text">{{selectOrder.purchaseVipDay}}天</span>
                </div>
                <div class="inline-block">
                    <label for class="label">退款天数：</label>
                    <el-input v-model.trim="selectOrder.showRefundDay" @blur="verify(1)" placeholder="请输入退款天数" clearable></el-input>
                </div>
                <div class="inline-block">
                    <label for class="label">退款金额：</label>
                    <el-input v-model.trim="selectOrder.showRefundMoney" @blur="verify(2)" placeholder="请输入退款金额，为0不退金额" clearable></el-input>
                </div>
            </template>
            <div class="inline-block">
                <label for class="label">退款方式：</label>
                <el-radio-group v-model="refundWay">
                    <el-radio v-for="item in refundWayFilters" :key="item.id" :label="item.id">{{item.value}}</el-radio>
                </el-radio-group>
            </div>
            <div class="inline-block">
                <label for class="label">退款备注：</label>
                <el-input
                    v-model.trim="remark"
                    placeholder="备注原因或线下退款账号，最多128字"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 10}"
                    maxlength="128"
                    show-word-limit
                    clearable
                ></el-input>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="confirm">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { mul } from '@/utils/decimal'
import { mapState } from 'vuex';
export default {
    name: 'OperatingDialog',
    model: {
        prop: 'show',
        event: 'my-close',
    },
    props: {
        info: {
            type: Object,
            required: true,
        },
        show: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            refundWay: 1, // 退款方式
            amount: '', // 实付金额
            pass: true, // 审核状态
            selectCityInfo: null,
            selectOrderInfos: [],
            selectOrder: {
                showRefundMoney: '', // 退款金额
                showRefundDay: '',
            },
            remark: '',
            moduleName: '/workbench/baoganManage/driver/list',
        };
    },
    computed: {
        ...mapState({
            refundWayFilters: state => state.baogan.refundWayFilters,
        }),
        visible: {
            get() {
                return this.show;
            },
            set(val) {
                console.log(val);
                this.$emit('my-close', val);
            },
        },
    },
    methods: {
        verify(val) {
            let { showRefundMoney, refundMoney, refundDays, showRefundDay } = this.selectOrder;
            if (val == 1) {
                let reg = /^[1-9]\d*$/;
                // 不能大于可退款天数
                if (!reg.test(showRefundDay) || showRefundDay > Number(refundDays)) {
                    this.selectOrder = {
                        ...this.selectOrder,
                        showRefundDay: refundDays,
                    };
                }
            } else if (val == 2) {
                let max = this.$baseMethod.regFenToYuan(refundMoney || 0);
                let reg = /^([0-9]*)((\.)([0-9]){1,2})?$/;
                // 不能大于实际付款金额
                if (!reg.test(showRefundMoney) || showRefundMoney > Number(max)) {
                    this.selectOrder = {
                        ...this.selectOrder,
                        showRefundMoney: this.formatAmount(refundMoney || 0),
                    };
                }
            }
        },
        formatLabel(val) {
            return val.orderId + '(' + val.vipStartTime + '至' + val.vipEndTime + ')';
        },
        cityChange(val) {
            this.selectOrder = {};
            if (val) {
                this.selectOrderInfos = val.orderInfos || [];
            } else {
                this.selectOrderInfos = [];
            }
        },
        orderChange(val) {
            this.selectOrder = {
                ...val,
                showRefundMoney: this.formatAmount(val.refundMoney),
                showRefundDay: val.refundDays || 0,
            };
        },
        formatAmount(m) {
            return this.$baseMethod.regFenToYuan(m);
        },
        close() {
            this.$emit('my-close', false);
        },
        confirm() {
            let { showRefundDay, showRefundMoney, orderId } = this.selectOrder;
            // 退款申请
            if (!this.refundWay) {
                this.$message.error('请选择退款方式！');
                return;
            }
            if (!showRefundMoney) {
                this.$message.error('请填写退款金额！');
                return;
            }
            if (!showRefundDay) {
                this.$message.error('请填写退款天数！');
                return;
            }
            if (!this.remark) {
                this.$message.error('请填写退款备注！');
                return;
            }
            let data = {
                orderId,
                refundWay: this.refundWay,
                amount: mul(showRefundMoney, 100),
                refundDays: showRefundDay,
                remark: this.remark,
                cityCode: this.info.cityCode,
            };
            let url = this.powerList.refund;
            let op = 'refund';
            this.$axios(url, { data, op }).then(() => {
                this.$message.success('操作成功');
                this.$emit('updateList');
                this.visible = false;
            });
        },
    },
};
</script>

<style lang='scss' scoped>
.nav_count {
    .inline-block {
        display: flex;
        padding: 6px 0;
        .label {
            display: inline-block;
            min-width: 85px;
        }
        .el-input {
            width: 350px;
        }
    }
}
/deep/ .el-select {
    display: flex;
    .el-input {
        display: inline-block;
        width: auto;
    }
    .el-input,
    .el-input--suffix {
        width: 250px !important;
    }
}
.order {
    /deep/ .el-input,
    .el-input--suffix {
        width: 500px !important;
    }
}
.dialog-footer {
    text-align: center;
}
</style>
