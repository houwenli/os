<template>
    <div class="flex-column">
        <div class="form-wrap flex-1">
            <ws-descriptions title="基础信息">
                <ws-descriptions-item label="司机ID" :showTip="false">{{ getObj.driverId }}</ws-descriptions-item>
                <ws-descriptions-item label="司机姓名" :showTip="false">{{ getObj.driverName }}</ws-descriptions-item>
                <ws-descriptions-item label="手机号码" :showTip="false">{{ getObj.phone }}</ws-descriptions-item>
                <ws-descriptions-item label="归属机构" :showTip="true">{{ getObj.agencyName }}</ws-descriptions-item>
                <ws-descriptions-item label="包干状态" :showTip="true">{{ getObj.status | bgFilters }}</ws-descriptions-item>
                <ws-descriptions-item label="有效包干总天数" :showTip="false">{{ getObj.effictiveDays }}</ws-descriptions-item>
            </ws-descriptions>
            <ws-descriptions title="包干记录" type="container">
                <ws-table-el ref="table" class="table" v-bind="tableConfig">
                    <template>
                        <ws-table-column-el align="center" prop="areaCityName" label="包干区域"></ws-table-column-el>
                        <ws-table-column-el align="center" prop="totalDays" label="累计包干天数"></ws-table-column-el>
                        <ws-table-column-el align="center" prop="effictiveDays" label="有效包干天数"></ws-table-column-el>
                        <ws-table-column-el align="center" prop="vipEndTime" label="包干结束时间"></ws-table-column-el>
                        <ws-table-column-el align="center" label="操作" fixed="right">
                            <template slot-scope="scope">
                                <el-button
                                    type="text"
                                    v-if="powerList.setting && scope.row.effictiveDays"
                                    style="color:#0088ff;"
                                    @click="adjust(scope.row,1)"
                                >调账</el-button>
                                <el-button
                                    type="text"
                                    v-if="powerList.give"
                                    style="color:#0088ff;"
                                    @click="adjust(scope.row,2)"
                                >赠送</el-button>
                            </template>
                        </ws-table-column-el>
                    </template>
                </ws-table-el>
            </ws-descriptions>
        </div>
        <div class="footer_btn">
            <el-button plain @click="back()">返 回</el-button>
        </div>
        <el-dialog :visible.sync="centerDialogVisible" width="35%" center @close="close(2)">
            <div class="dialog_">
                <div class="line">
                    <label for class="label">包干区域：</label>
                    <span class="text">{{adjustData.areaCityName}}</span>
                </div>
                <div class="line">
                    <label for class="label">赠送天数：</label>
                    <el-input v-model.trim="dayNumber" @blur="verify" placeholder="(0，20000】正整数" clearable></el-input>
                </div>
                <div class="line">
                    <label for class="label">备注：</label>
                    <el-input
                        v-model.trim="remark"
                        placeholder="最多128字"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 10}"
                        maxlength="128"
                        show-word-limit
                        clearable
                    ></el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="close(2)">取 消</el-button>
                <ws-enter-event>
                    <el-button type="primary" @click="preserve(2)">保 存</el-button>
                </ws-enter-event>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="accountAdjustDialogVisible" width="35%" center @close="close(1)">
            <div class="dialog_">
                <div class="line">
                    <label for class="label">包干区域：</label>
                    <span class="text">{{adjustData.areaCityName}}</span>
                </div>
                <div class="line">
                    <label for class="label">包干结束时间：</label>
                    <span class="text">{{adjustData.vipEndTime}}</span>
                </div>
                <div class="line">
                    <label for class="label">调整结束时间：</label>
                    <el-date-picker v-model="newVipEndDate" :picker-options="pickerOptions" type="date" placeholder="请选择日期" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
                </div>
                <div class="line">
                    <label for class="label">备注：</label>
                    <el-input
                        v-model.trim="remark"
                        placeholder="最多200字"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 10}"
                        maxlength="200"
                        show-word-limit
                        clearable
                    ></el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="close(1)">取 消</el-button>
                <ws-enter-event>
                    <el-button type="primary" @click="preserve(1)">保 存</el-button>
                </ws-enter-event>
            </span>
        </el-dialog>
        <refund-dialog v-if="refundDialogVisible" v-model="refundDialogVisible" :info="adjustData" @updateList="search"></refund-dialog>
    </div>
</template>

<script>
import refundDialog from '../components/refundDialog';
export default {
    components: {
        refundDialog,
    },
    data() {
        return {
            activeNames: ['1', '2'],
            centerDialogVisible: false,
            refundDialogVisible: false,
            accountAdjustDialogVisible: false,
            dayNumber: '',
            remark: '',
            newVipEndDate: '',//调整结束时间
            getObj: {},
            adjustData: {},
            tableConfig: {
                emptyModel: true,
                filterColumns: false,
                autoHeight: false,
                layout: 'flow',
                lazyQuery: {
                    moduleName: '/workbench/baoganManage/localDriver/list',
                    op: {
                        selectList: 'detailList',
                        selectCount: 'detailCount',
                    },
                    beforeQuery: this.beforeQuery,
                    afterQuery: this.afterQuery,
                },
            },
            pickerOptions: {
                disabledDate: this.disabledDate
            },
            moduleName: '/workbench/baoganManage/localDriver/list',
            op: {
                detail: 'detail',
                detailDecrypt: 'detailDecrypt',
            },
        };
    },
    mounted() {
        this.getData();
    },
    methods: {
        search() {
            this.$refs.table.search();
        },
        disabledDate(time) {
            return time.getTime() < new Date(new Date().setHours(0, 0, 0, 0)).getTime() || time.getTime() > new Date(this.adjustData.vipEndTime).getTime() - 60*60*24*1000;
        },
        getDateTime(time) {
            if (new Date(time).getTime() > new Date().getTime()) {
                return true;
            } else {
                return false;
            }
        },
        beforeQuery() {
            return {
                driverId: this.$route.query.id,
            };
        },
        afterQuery(data) {
            return data;
        },
        adjust(row,type) {
            // type：1 调账  2 赠送  3 退款
            this.adjustData = row;
            switch(type) {
                case 1:
                    this.accountAdjustDialogVisible = true
                    break;
                case 2:
                    this.centerDialogVisible = true;
                    break;
            }
        },
        close(type) {
            // type：1 调账  2 赠送  3 退款
            switch(type) {
                case 1:
                    this.remark = '';
                    this.newVipEndDate = '';
                    this.accountAdjustDialogVisible = false
                    break;
                case 2:
                    this.remark = '';
                    this.dayNumber = '';
                    this.centerDialogVisible = false;
                    break;
                case 3:
                    break;
            }
        },
        preserve(type) {
            let data = {}
            switch(type) {
                // type：1 调账  2 赠送  3 退款
                case 1:
                    if (this.newVipEndDate == '') {
                        this.$message.error('请填写调整结束时间');
                        return;
                    }
                    data = {
                        data: {
                            remark: this.remark,
                            driverId: this.$route.query.id,
                            areaCode: this.adjustData.areaCode,
                            cityCode: this.adjustData.cityCode,
                            freeDays: this.dayNumber,
                            newVipEndDate: this.newVipEndDate,
                            agencyNumber: this.getObj.agencyNumber,
                            vipEndTime: this.adjustData.vipEndTime,
                        },
                        op: 'setting',
                    };
                    break;
                case 2:
                    if (this.dayNumber == '') {
                        this.$message.error('请填写赠送天数');
                        return;
                    }
                    data = {
                        data: {
                            remark: this.remark,
                            driverId: this.$route.query.id,
                            areaCode: this.adjustData.areaCode,
                            cityCode: this.adjustData.cityCode,
                            freeDays: this.dayNumber,
                            agencyNumber: this.getObj.agencyNumber,
                            vipEndTime: this.adjustData.vipEndTime,
                        },
                        op: 'give',
                    };
                    break;
                case 3:
                    break;
            }
            if (this.remark == '') {
                this.$message.error('请填写备注');
                return;
            }
            let URL = this.getModuleUrl(data.op);
            this.$axios(URL, data).then(res => {
                this.$message.success('操作成功');
                this.search();
                this.getData();
                this.close(type);
            });
        },
        back() {
            this.$router.push({ path: this.moduleName });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        getData() {
            let data = {
                data: {
                    driverId: this.$route.query.id,
                },
                op: { false: this.op.detail, true: this.op.detailDecrypt }[this.$route.query.isEncrypt + ''],
            };
            let URL = this.getModuleUrl(data.op);
            if (!URL) {
                this.$message.error('无权限访问');
                return false;
            }
            this.$axios(URL, data).then(res => {
                this.getObj = JSON.parse(res.data);
            });
        },
        verify() {
            let reg = /^(1|[1-9]\d{0,3}|1\d{4}|20000)$/;
            if (!reg.test(this.dayNumber)) {
                this.dayNumber = 20000;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.form-wrap {
    padding: 32px 40px;
    background: #fff;
    border-radius: 8px;
    .title {
        display: inline-block;
        font-size: 16px;
        font-weight: 600;
        color: #303133;
    }
    /deep/ .inpt_.el-input.is-disabled .el-input__inner {
        background-color: #fff !important;
    }
    /deep/ .ws-descriptions__title {
        font-size: 16px;
    }
    .ws-table-warp {
        min-height: auto;
    }
    .table {
        padding: 0 !important;
        min-height: auto !important;
        /deep/ .option-box {
            margin: 0 !important;
        }
    }
}
.dialog_ {
    .line {
        padding: 8px 0;
        display: flex;
        .label {
            width: 100px;
            margin-right: 10px;
            display: inline-block;
            text-align: right;
        }
        .el-input {
            width: 300px;
        }
    }
}
/deep/ .el-textarea {
    width: 300px;
}
</style>
