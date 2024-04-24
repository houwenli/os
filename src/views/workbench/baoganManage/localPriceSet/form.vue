<template>
    <div class="flex-column">
        <div class="form-wrap flex-1">
            <div class="title">基本信息</div>
            <div class="coll_item">
                <div class="count">
                    <label for>地区：</label>
                    <ws-city v-model="cityCodeList" level="2" :defaultProps="{ checkStrictly: false, emitPath: false }" multiple :disabled="disabled || enterQuery.type == 'edit'"></ws-city>
                </div>
                <div class="count">
                    <label for>生效时间：</label>
                    <ws-date-range :startTime.sync="formData.effectiveTime" :endTime.sync="formData.effectiveEndTime" :disabled="disabled" :intervalTime="365"></ws-date-range>
                </div>
                <div class="count" v-if="disabled">
                    <label for>功能状态：</label>
                    <span>{{ formData.statusStr }}</span>
                </div>
                <div class="count" v-else>
                    <label for>是否上架：</label>
                    <el-radio-group v-model="formData.isDirectUp">
                        <el-radio style="width: 50px" :label="1">是</el-radio>
                        <el-radio style="width: 50px" :label="0">否</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="title">包干信息</div>
            <div class="base-content">
                <label for style="font-size: 14px; line-height: 40px; font-weight: 500">平台费包干价格：</label>
                <el-button v-if="defindVip.length != 9 && !disabled" type="primary" style="float: right; margin-bottom: 5px" @click="addition()">添加区间配置</el-button>
                <div class="content-table">
                    <div class="table">
                        <table border style="width: 100%; border-color: #dbdbdb">
                            <thead>
                                <tr class="thead-style">
                                    <td>包干套餐（天数）</td>
                                    <td>赠送天数</td>
                                    <td>标准价格（元）</td>
                                    <td>优惠折扣</td>
                                    <td>折扣价</td>
                                    <td>代驾价格（元）</td>
                                    <td>实际售价（元）</td>
                                    <td v-if="!disabled">操作</td>
                                </tr>
                            </thead>
                            <tbody style="font-size: 14px">
                                <tr v-for="(item, index) in defindVip" :key="index">
                                    <td>
                                        <el-input
                                            class="inpt_"
                                            style="width: 170px"
                                            @blur="CheckData(regular[0], index, 'vipDays')"
                                            v-model.trim="item.vipDays"
                                            :disabled="disabled"
                                            placeholder="(0，10000]整数"
                                        />
                                    </td>
                                    <td>
                                        <el-input
                                            class="inpt_"
                                            style="width: 170px"
                                            @blur="CheckData(regular[0], index, 'giveVipDays')"
                                            :disabled="disabled"
                                            v-model.trim="item.giveVipDays"
                                            placeholder="(0，10000]整数"
                                        />
                                    </td>
                                    <td>
                                        <el-input
                                            class="inpt_"
                                            style="width: 170px"
                                            @blur="CheckData(regular[1], index, 'actualPrice')"
                                            :disabled="disabled"
                                            v-model.trim="item.actualPrice"
                                            placeholder="(0，100000]整数"
                                        />
                                    </td>
                                    <td>
                                        <el-input
                                            class="inpt_"
                                            style="width: 170px"
                                            @blur="CheckData(regular[2], index, 'discountRatio')"
                                            :disabled="disabled"
                                            v-model.trim="item.discountRatio"
                                            placeholder="(0，1]允许二位小数"
                                        />
                                    </td>
                                    <td style="width: 150px">{{ item.vipPricePer }}</td>
                                    <td>
                                        <input
                                            class="inpt_"
                                            style="width: 160px"
                                            @blur="CheckData(regular[1], index, 'addPrice')"
                                            v-model.trim="item.addPrice"
                                            :disabled="disabled"
                                            placeholder="[0，100000]整数"
                                        />
                                    </td>
                                    <td style="width: 150px">{{ item.actualVipPrice }}</td>
                                    <td v-if="!disabled" style="width: 100px">
                                        <el-button type="text" @click="cickDelete(index)" style="color: #f05259; padding: 0 10px">删除</el-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div v-if="disabled" class="title">操作记录</div>
            <operating-table v-if="disabled" :module-name="moduleName" :addType=2 />
        </div>
        <div class="footer_btn">
            <el-button plain @click="back()">{{ !disabled ? '取消' : '返回' }}</el-button>
            <ws-throttle v-if="!disabled && powerList.add">
                <el-button type="primary" @click="save()">保存</el-button>
            </ws-throttle>
        </div>
    </div>
</template>

<script>
import { Decimal } from 'decimal.js';
import OperatingTable from '../components/operatingTable.vue';
export default {
    components: {
        OperatingTable,
    },
    data() {
        return {
            cityCodeList: [],
            formData: {
                cityCode: [],
                isDirectUp: 0,
                effectiveTime: '',
                effectiveEndTime: '',
            },
            defindVip: [
                {
                    vipDays: '',
                    actualPrice: '',
                    discountRatio: '',
                    vipPricePer: '',
                    addPrice: '0',
                    actualVipPrice: '',
                    kpiScore: null,
                },
            ],
            disabled: false,
            regular: [
                /^(?:1|[1-9][0-9]{0,3}|10000)$/, // (0，10000)整数
                /^(?:1|[1-9][0-9]{0,4}|100000)$/, // (0，100000)整数
                /^(1|0\.[1-9]|0\.\d{0,1}[1-9])$/, // (0,1)二位小数
            ],
            pickerOptions: {
                disabledDate(time) {
                    let curDay = new Date().toLocaleDateString();
                    return time.getTime() < new Date(curDay).getTime() || time.getTime() > new Date(curDay).getTime() + 24 * 3600 * 1000 * 31;
                },
            },
            moduleName: '/workbench/baoganManage/localPriceSet/list',
            enterQuery: null,
        };
    },
    computed: {
        formContentStatus() {
            return {
                add: '新增',
                edit: '修改',
                detail: '详情',
            }[this.enterQuery.type];
        },
    },
    created() {
        let { query } = this.$route;
        this.enterQuery = query;
        this.disabled = query.type == 'detail';
    },
    mounted() {
        if (this.enterQuery.type != 'add') {
            this.getData();
        }
    },
    methods: {
        mul(a, b) {
            // 乘
            return new Decimal(a).mul(new Decimal(b)).toNumber();
        },
        div(a, b) {
            // 除
            return new Decimal(a).div(new Decimal(b)).toNumber();
        },
        add(a, b) {
            // 加
            return new Decimal(a).add(new Decimal(b)).toNumber();
        },
        getData() {
            const data = {
                data: JSON.stringify({
                    id: this.enterQuery.id,
                }),
                op: 'detail',
            };
            const URL = this.powerList.detail;
            this.$axios(URL, data).then(res => {
                const dataParms = JSON.parse(res.data);
                for (const data of dataParms.defindVip) {
                    data.actualPrice = this.div(data.actualPrice, 100);
                    data.vipPricePer = this.div(data.vipPricePer, 100);
                    data.addPrice = this.div(data.addPrice || 0, 100);
                    data.actualVipPrice = this.div(data.actualVipPrice || 0, 100);
                }
                this.formData = dataParms;
                // 默认是否上架为否
                this.$set(this.formData,'isDirectUp',0)
                this.cityCodeList = dataParms.cityCode;
                this.defindVip = dataParms.defindVip;
            });
        },
        addition() {
            for (const data of this.defindVip) {
                if (!data.vipDays) {
                    this.$message.error('请先输入包干套餐');
                    return false;
                }
                if (!data.actualPrice) {
                    this.$message.error('请先输入标准价格');
                    return false;
                }
                if (!data.discountRatio) {
                    this.$message.error('请先输入优惠折扣');
                    return false;
                }
            }
            const opt = {
                vipDays: '',
                actualPrice: '',
                discountRatio: '',
                vipPricePer: '',
                addPrice: '0',
                actualVipPrice: '',
                kpiScore: null,
            };
            this.defindVip.push(opt);
        },
        cickDelete(index) {
            this.defindVip.splice(index, 1);
        },
        CheckData(reg, index, type) {
            if (!reg.test(this.defindVip[index][type])) {
                if (type == 'vipDays') {
                    this.defindVip[index][type] = '10000';
                } else if (type == 'actualPrice') {
                    this.defindVip[index][type] = '100000';
                } else if (type == 'discountRatio') {
                    this.defindVip[index][type] = '1';
                } else if (type == 'addPrice') {
                    this.defindVip[index][type] = '0';
                }
            }
            if (this.defindVip[index].actualPrice && this.defindVip[index].discountRatio) {
                this.defindVip[index].vipPricePer = this.mul(this.defindVip[index].actualPrice, this.defindVip[index].discountRatio);
            }
            if (this.defindVip[index].vipPricePer && (this.defindVip[index].addPrice == 0 || this.defindVip[index].addPrice != '')) {
                this.defindVip[index].actualVipPrice = this.add(this.defindVip[index].vipPricePer, this.defindVip[index].addPrice);
            }
        },
        save() {
            if (this.enterQuery.type == 'add') {
                if (!this.cityCodeList.length) {
                    this.$message.error('请选择地区');
                    return;
                }
            }
            let { effectiveTime, effectiveEndTime, isDirectUp } = this.formData;
            if (!effectiveTime || !effectiveEndTime) {
                this.$message.error('请选择生效时间');
                return;
            }
            // const startTime = new Date(effectiveTime).getTime();
            // const curTime = new Date().getTime(); // 当前时间
            // if (curTime > startTime) {
            //     this.$message.error('开始生效时间不能小于当前时间');
            //     return;
            // }
            if (!this.defindVip.length) {
                this.$message.error('包干价格配置不能为空');
                return;
            }
            for (const data of this.defindVip) {
                if (!data.vipDays || !data.actualPrice || !data.discountRatio) {
                    this.$message.error('请输入包干价格配置');
                    return;
                }
            }
            for (let i = 0; i < this.defindVip.length - 1; i++) {
                for (let j = i + 1; j < this.defindVip.length; j++) {
                    if (this.defindVip[i].vipDays == this.defindVip[j].vipDays) {
                        this.$message.error('包干天数不能重复');
                        return false;
                    }
                }
            }
            const dataDeepClone = this.$baseMethod.deepClone(this.defindVip);
            for (const data of dataDeepClone) {
                data.actualPrice = this.mul(data.actualPrice, 100);
                data.vipPricePer = this.mul(data.vipPricePer, 100);
                data.addPrice = this.mul(data.addPrice, 100);
                data.actualVipPrice = this.mul(data.actualVipPrice, 100);
            }
            let key = this.enterQuery.type == 'add' ? 'cityCodeList' : 'cityCode';
            let code = this.enterQuery.type == 'add' ? this.cityCodeList : this.formData.cityCode;
            const data = {
                data: JSON.stringify({
                    [key]: code,
                    city: null,
                    driverType: null,
                    effectiveTime,
                    effectiveEndTime,
                    defindVip: dataDeepClone,
                    isDirectUp,
                    id: this.formData.id,
                }),
                op: this.enterQuery.type == 'add' ? 'add' : 'update',
            };
            const URL = this.enterQuery.type == 'add' ? this.powerList.add : this.powerList.update;
            this.$axios(URL, data).then(res => {
                if (res.code == 1) {
                    this.$message.success(`${this.enterQuery.type == 'add' ? '新增' : '修改'}成功`);
                    this.back();
                }
            });
        },
        back() {
            this.$router.push({ path: this.moduleName });
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
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        padding: 32px 0 16px;
        &:first-of-type {
            padding: 0;
        }
    }
    /deep/ .inpt_.el-input.is-disabled .el-input__inner {
        background-color: #fff !important;
    }
    .ws-city {
        /deep/ .el-input__inner{
            width: 400px;
        }
    }
}

.coll_item {
    label {
        display: inline-block;
        width: 100px;
        text-align: right;
        color: #606266;
        font-weight: 400;
    }
    .count {
        display: inline-block;
        margin-top: 16px;
        margin-right: 100px;
        line-height: 36px;
    }
}
.inpt_ {
    text-align: center;
}
</style>
