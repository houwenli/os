<!--
 * @Author: DaiYu
 * @Date: 2022-03-28 09:30:06
 * @LastEditors: DaiYu
 * @LastEditTime: 2022-06-09 18:51:24
 * @FilePath: \main\src\views\workbench\baoganManage\components\operatingDialog.vue
-->
<template>
    <el-dialog :title="title" :visible.sync="visible" width="34%" center destroy-on-close @close="close">
        <div class="nav_count">
            <template v-if="type != 3">
                <div class="inline-block">
                    <label for class="label">业务单号：</label>
                    <span class="text">{{info.orderId}}</span>
                </div>
                <div class="inline-block">
                    <label for class="label">司机姓名：</label>
                    <span class="text">{{info.driverName}}</span>
                </div>
            </template>
            <!-- 退款、审核 -->
            <template v-if="type == 1 || type == 2">
                <div class="inline-block">
                    <label for class="label">实付金额：</label>
                    <span class="text">{{formatAmount(info.money)}}元</span>
                </div>
                <div class="inline-block">
                    <label for class="label">剩余金额：</label>
                    <span class="text">{{formatAmount(info.remainingMoney)}}元</span>
                </div>
                <div class="inline-block">
                    <label for class="label">退款天数：</label>
                    <span class="text">{{info.remainingDay}}天</span>
                </div>
                <div class="inline-block">
                    <label for class="label">退款方式：</label>
                    <el-radio-group v-model="refundWay" v-if="type == 1">
                        <el-radio :disabled="payMode==2" v-for="item in refundWayFilters" :key="item.id" :label="item.id">{{item.value}}</el-radio>
                    </el-radio-group>
                    <span v-if="type == 2">{{info.refundTypeName || '-'}}</span>
                </div>
                <div class="inline-block">
                    <label for class="label">退款金额：</label>
                    <el-input v-if="type == 1" v-model.trim="amount" @blur="verify" placeholder="请输入退款金额，为0不退金额" clearable></el-input>
                    <span v-if="type == 2">{{formatAmount(info.refundMoney)}}元</span>
                </div>
                <div class="inline-block" v-if="type ==2">
                    <label for class="label">退款备注：</label>
                    <span style="width:400px">{{info.refundRemark || '-'}}</span>
                </div>
                <div class="inline-block" v-if="type == 2">
                    <label for class="label">退款审核：</label>
                    <el-radio-group v-model="pass">
                        <el-radio :label="true">通过</el-radio>
                        <el-radio :label="false">不通过</el-radio>
                    </el-radio-group>
                </div>
            </template>
            <!-- 批量审核 -->
            <template v-if="type == 3">
                <div class="inline-block">
                    <label for class="label">退款数量：</label>
                    <span class="text">{{info.refundNum}}个</span>
                </div>
                <div class="inline-block">
                    <label for class="label">实付总额：</label>
                    <span class="text">{{formatAmount(info.totalPayMoney)}}元</span>
                </div>
                <div class="inline-block">
                    *
                    <label for class="label">退款总额：</label>
                    <span class="text">{{formatAmount(info.totalRefundMoney)}}元</span>
                </div>
                <div class="inline-block">
                    <label for class="label">退款审核：</label>
                    <el-radio-group v-model="pass">
                        <el-radio :label="true">通过</el-radio>
                        <el-radio :label="false">不通过</el-radio>
                    </el-radio-group>
                </div>
            </template>
            <!-- 包干转移 -->
            <template v-if="type == 4">
                <div class="inline-block">
                    <label for class="label">剩余天数：</label>
                    <span class="text">{{info.remainingDay}}</span>
                </div>
                <div class="inline-block">
                    <label for class="label">剩余金额：</label>
                    <span class="text">{{formatAmount(info.remainingMoney)}}元</span>
                </div>
                <div class="inline-block">
                    <label for class="label">转移地区：</label>
                    <ws-city v-model="selectCityInfo.cityCode" @change="cityChange" level="2"></ws-city>
                </div>
                <!-- <template v-if="selectCityInfo.vipPrice && !errMsg"> -->
                    <div class="inline-block">
                        <label for class="label">包干价格：</label>
                        <span class="text">{{selectCityInfo.vipPrice || '-'}}</span>
                    </div>
                    <div class="inline-block">
                        <label for class="label">折算天数：</label>
                        <el-input-number
                            v-model.trim="transferDays"
                            placeholder="[1，20000]整数"
                            :min ="1"
                            :max="20000"
                            clearable
                        ></el-input-number>
                    </div>
                <!-- </template> -->
            </template>
            <div class="inline-block">
                <label for class="label">备注：</label>
                <el-input
                    v-model.trim="remark"
                    :placeholder="remarkPlaceholder"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 10}"
                    maxlength="128"
                    show-word-limit
                    clearable
                ></el-input>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
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
        payMode:{
            type: Number,String,
            required: 0,
        },
        title: {
            type: String,
            required: true,
        },
        info: {
            type: Object,
            required: true,
        },
        show: {
            type: Boolean,
            default: false,
        },
        type: {
            // 弹窗类型 1:退款申请,2:退款审核,3:批量审核,4:包干转移
            type: Number,
            required: true,
        },
        moduleName: {
            type: String,
            default: '/workbench/baoganManage/runningwater/list'
        }
    },
    data() {
        return {
            transferDays: '', // 折算天数
            refundWay: 1, // 退款方式
            amount: '', // 退款金额
            pass: true, // 审核状态
            selectCityInfo: {
                cityCode: []
            },
            remark: '',
            // moduleName: '/workbench/baoganManage/runningwater/list',
            errMsg: '',
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
                this.$emit('my-close', val);
            },
        },
        remarkPlaceholder() {
            let remarkMap = {
                1: '备注原因 或 线下退款账号, 最多128字',
                2: '审核备注，最多128字',
                3: '审核备注，最多128字',
                4: '备注原因，最多128字',
            };
            return remarkMap[this.type];
        },
    },
    mounted() {
        this.payMode==2 ? this.refundWay=1 : ''
        let { remainingMoney } = this.info;
        this.amount = this.$baseMethod.regFenToYuan(remainingMoney || 0);
    },
    methods: {
        verify() {
            let { money, remainingMoney } = this.info;
            let mone = this.$baseMethod.regFenToYuan(money || 0);
            let reg = /^([0-9]*)((\.)([0-9]){1,2})?$/;
            // 不能大于实际付款金额
            if (!reg.test(this.amount) || this.amount > Number(mone)) {
                this.amount = this.$baseMethod.regFenToYuan(remainingMoney || 0);
            }
        },
        // 通过cityCode获取包干信息
        cityChange(cityCode) {
            if(cityCode && !cityCode.length){
                return false
            }
            let data = {
                data: {
                    toCityCode: cityCode[1],
                    orderId: this.info.orderId
                },
                op: 'transferDetailByCity',
            };
            let URL = this.powerList.refundDetail;
            this.$axios(URL, data).then(res => {
                let val = JSON.parse(res.data).transferDetailCityLists;
                if(val && val.length){
                    this.selectCityInfo.vipPrice = val[0].vipPrice
                    this.selectCityInfo.afterRemainDays = val[0].afterRemainDays
                    this.transferDays = val[0].afterRemainDays;
                    this.errMsg = val[0].msg;
                    val.msg && this.$message.error(val.msg);
                }
            });
        },
        formatAmount(m) {
            return this.$baseMethod.regFenToYuan(m);
        },
        close() {
            this.$emit('my-close', false);
        },
        confirm() {
            let url = '';
            let op = '';
            let data = {};
            switch (this.type) {
                case 1: {
                    // 退款申请
                    if (!this.refundWay) {
                        this.$message.error('请选择退款方式！');
                        return;
                    }
                    if (!this.amount) {
                        this.$message.error('请填写退款金额！');
                        return;
                    }
                    if (!this.remark) {
                        this.$message.error('请填写退款备注！');
                        return;
                    }
                    data = {
                        orderId: this.info.orderId,
                        refundWay: this.refundWay,
                        amount: mul(this.amount, 100),
                        remark: this.remark,
                    };
                    url = this.powerList.refund;
                    op = 'refund';
                    break;
                }
                case 2:
                case 3: {
                    // 2退款审核 3批量审核
                    data = {
                        orderIds: this.type == 2 ? [this.info.orderId] : this.info.orderIds,
                        pass: this.pass,
                        auditRemark: this.remark,
                    };
                    url = this.powerList.audit;
                    op = 'audit';
                    break;
                }
                case 4: {
                    // 包干转移
                    if (this.errMsg) {
                        this.$message.error(this.errMsg);
                        return;
                    }
                    if (!this.selectCityInfo.cityCode.length) {
                        this.$message.error('请选择转移地区！');
                        return;
                    }
                    if (!this.transferDays) {
                        this.$message.error('请输入折算天数！');
                        return;
                    }
                    if (this.transferDays < 1) {
                        this.$message.error('折算天数不得小于1天！');
                        return;
                    }
                    let reg = /^[1-9]\d*$/;
                    if (!reg.test(this.transferDays)) {
                        this.$message.error('折算天数必须为正整数！');
                        return;
                    }
                    // 次调整为新的可用天数 故不校验
                    // if (this.transferDays > this.selectCityInfo.afterRemainDays) {
                    //     this.$message.error(`折算天数不得大于${this.selectCityInfo.afterRemainDays}天！`);
                    //     return;
                    // }
                    if (!this.remark) {
                        this.$message.error('请填写转移备注！');
                        return;
                    }
                    data = {
                        orderId: this.info.orderId,
                        toCityCode: this.selectCityInfo.cityCode.length?this.selectCityInfo.cityCode[1] : '',
                        transferDays: this.transferDays,
                        remark: this.remark,
                    };
                    url = this.powerList.addTransferOrder;
                    op = 'addTransferOrder';
                    break;
                }
            }
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
.dialog-footer {
    text-align: center;
}
</style>
