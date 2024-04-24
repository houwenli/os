<!--计价新增，编辑，详情-->
<template>
    <div class="common-form-style">
        <el-collapse class="form_box" v-model="activeNames">
            <el-collapse-item title="基础资料" name="1">
                <div class="base-content">
                    <div class="inline-block">
                        <label for class="label">
                            <span style="color: #f05259">*</span>
                            服务类型:
                        </label>
                        <el-select v-if="routerQuery.type == 'add'" v-model.trim="dataOptions.rideType" multiple placeholder="请选择" collapse-tags>
                            <el-option v-for="item in businessTypes" :key="item.id" :label="item.value" :value="item.id"></el-option>
                        </el-select>

                        <span class="text" v-else>{{ dataOptions.rideName }}</span>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="里程计价" name="2">
                <div class="content-table">
                    <label for class="label">
                        <span style="color: #f05259">*</span>
                        起步价配置(元):
                    </label>
                    <div class="table inline-table">
                        <table>
                            <thead>
                                <tr>
                                    <td>包含里程数(公里)</td>
                                    <td>包含时长(分)</td>
                                    <td>乘客计价（元）</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <span v-if="routerQuery.type == 'detail'">{{ dataOptions.params.initFee.initKm }}</span>
                                        <el-input
                                            v-else
                                            class="wid30"
                                            onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                                            oninput="if(value>1000){value=1000}else if(value==' '){value=1}"
                                            v-model="dataOptions.params.initFee.initKm"
                                            placeholder="整数"
                                            @input="initKmMeth"
                                        ></el-input>
                                    </td>
                                    <td>
                                        <span v-if="routerQuery.type == 'detail'">{{ dataOptions.params.initFee.initMin }}</span>
                                        <el-input
                                            v-else
                                            class="wid30"
                                            onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                                            oninput="if(value>1000){value=1000}else if(value==' '){value=1}"
                                            v-model="dataOptions.params.initFee.initMin"
                                            placeholder="整数"
                                            @input="initTimeMeth"
                                        ></el-input>
                                    </td>
                                    <td>
                                        <span v-if="routerQuery.type == 'detail'">{{ dataOptions.params.initFee.passengerCost }}</span>
                                        <el-input-number
                                            v-else
                                            v-model="dataOptions.params.initFee.passengerCost"
                                            :controls="false"
                                            :precision="2"
                                            :min="0"
                                            :max="1000"
                                            class="wid30"
                                            placeholder="整数或两位小数[0-1000]"
                                        ></el-input-number>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="content-table">
                    <label for class="label">
                        <span style="color: #f05259">*</span>
                        时长费(分)
                    </label>
                    <div class="table inline-table">
                        <div class="link-text">
                            <el-link v-if="routerQuery.type != 'detail'" @click="addData(1)" :underline="false">
                                <img src="@/assets/images/ic_xizeng.png" alt="" />
                                新增
                            </el-link>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <td>时长区间</td>
                                    <td>乘客计价（元）</td>
                                    <td v-if="routerQuery.type != 'detail'">操作</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(data, index) in dataOptions.params.minFee" :key="index">
                                    <td>
                                        <span v-if="routerQuery.type == 'detail'">{{ data.minStart }}-{{ data.minEnd }}</span>
                                        <template v-else>
                                            <el-input class="border1" v-model="data.minStart" placeholder="请输入内容" :disabled="true"></el-input>
                                            -
                                            <el-input
                                                class="border1"
                                                v-model="data.minEnd"
                                                onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                                                oninput="if(value>1000){value=1000}else if(value==' '){value=1}"
                                                placeholder="请输入内容"
                                                :disabled="dataOptions.params.minFee.length - 1 > index ? true : false || routerQuery.type == 'detail' ? true : false"
                                            ></el-input>
                                        </template>
                                    </td>
                                    <td>
                                        <span v-if="routerQuery.type == 'detail'">{{ data.passengerCost }}</span>
                                        <el-input-number
                                            v-else
                                            v-model="data.passengerCost"
                                            :controls="false"
                                            :precision="2"
                                            :min="0"
                                            :max="1000"
                                            class="wid30"
                                            placeholder="整数或两位小数[0-1000]"
                                            :disabled="dataOptions.params.kmFee.length - 1 > index ? true : false"
                                        ></el-input-number>
                                    </td>
                                    <td v-if="routerQuery.type != 'detail'">
                                        <template v-if="index == 0 || dataOptions.params.minFee.length - 1 > index">-</template>
                                        <template v-else>
                                            <el-button size="small" type="text" @click="delData(1, index)" style="color: #0088ff">删除</el-button>
                                        </template>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="content-table">
                    <label for class="label">
                        <span style="color: #f05259">*</span>
                        里程费(公里)
                    </label>
                    <div class="table inline-table">
                        <div class="link-text">
                            <el-link v-if="routerQuery.type != 'detail'" @click="addData(2)" :underline="false">
                                <img src="@/assets/images/ic_xizeng.png" alt="" />
                                新增
                            </el-link>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <td>里程区间</td>
                                    <td>乘客计价（元）</td>
                                    <td v-if="routerQuery.type != 'detail'">操作</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(data, index) in dataOptions.params.kmFee" :key="index">
                                    <td>
                                        <span v-if="routerQuery.type == 'detail'">{{ data.kmStart }}-{{ data.kmEnd }}</span>
                                        <template v-else>
                                            <el-input v-model="data.kmStart" class="border1" placeholder="请输入内容" :disabled="true"></el-input>
                                            -
                                            <el-input
                                                v-model="data.kmEnd"
                                                class="border1"
                                                onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                                                oninput="if(value>1000){value=1000}else if(value==' '){value=1}"
                                                placeholder="请输入内容"
                                                :disabled="dataOptions.params.kmFee.length - 1 > index ? true : false"
                                            ></el-input>
                                        </template>
                                    </td>
                                    <td>
                                        <span v-if="routerQuery.type == 'detail'">{{ data.passengerCost }}</span>
                                        <!-- <el-date-picker v-else v-model.trim="data.dutiesTime" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="date" placeholder="--请选择--"></el-date-picker> -->
                                        <el-input-number
                                            v-else
                                            v-model="data.passengerCost"
                                            :controls="false"
                                            :precision="2"
                                            :min="0"
                                            :max="1000"
                                            class="wid30"
                                            placeholder="整数或两位小数[0-1000]"
                                            :disabled="dataOptions.params.kmFee.length - 1 > index ? true : false"
                                        ></el-input-number>
                                    </td>
                                    <td v-if="routerQuery.type != 'detail'">
                                        <template v-if="index == 0 || dataOptions.params.kmFee.length - 1 > index">-</template>
                                        <template v-else>
                                            <el-button size="small" type="text" @click="delData(2, index)" style="color: #0088ff">删除</el-button>
                                        </template>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="记录信息" name="3" v-if="routerQuery.type == 'detail'">
                <div class="base-content">
                    <div class="inline-block">
                        <label for class="label">
                            <span style="color: #f05259">*</span>
                            最后修改人:
                        </label>
                        <span class="text" v-if="routerQuery.type == 'detail'">{{ dataOptions.updateUserName }}</span>
                    </div>
                    <div class="inline-block">
                        <label for class="label">
                            <span style="color: #f05259">*</span>
                            最后修改时间:
                        </label>
                        <span class="text" v-if="routerQuery.type == 'detail'">{{ dataOptions.updateTime }}</span>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>

        <div class="foot_btn">
            <el-button plain @click="back()">返 回</el-button>
            <ws-throttle>
                <el-button type="primary" v-if="routerQuery.type == 'edit'" @click="save()">修 改</el-button>
            </ws-throttle>
            <ws-throttle>
                <el-button type="primary" v-if="routerQuery.type == 'add'" @click="save()">保 存</el-button>
            </ws-throttle>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'intercityLineValuationForm',
    data() {
        return {
            op: {
                detail: 'selectDetails', //基础信息op
                save: 'save',
                update: 'update'
            },
            dataOptions: {
                rideType: [],
                params: {
                    initFee: {
                        initKm: null,
                        initMin: null,
                        passengerCost: null
                    },
                    minFee: [
                        {
                            minStart: 0,
                            minEnd: null,
                            passengerCost: null
                        }
                    ],
                    kmFee: [
                        {
                            kmStart: 0,
                            kmEnd: null,
                            passengerCost: null
                        }
                    ]
                }
            },
            activeNames: ['1', '2', '3'],
            moduleName: '/workbench/valuation'
        };
    },
    computed: {
        formContentStatus() {
            return {
                add: '新增',
                edit: '修改',
                detail: '详情'
            }[this.routerQuery.type];
        },
        ...mapGetters('intercityLine', ['businessTypes'])
    },
    created() {
        this.routerQuery = this.$route.query;
        this.routerQuery.type != 'add' && this.getData();
    },
    methods: {
        back() {
            this.$router.push({ name: 'intercityLineFence' });
        },
        initKmMeth(e) {
            this.dataOptions.params.kmFee[0].kmStart = e;
        },
        initTimeMeth(e) {
            this.dataOptions.params.minFee[0].minStart = e;
        },

        getData() {
            let data = {
                data: JSON.stringify({ id: this.$route.query.id }),
                op: this.op.detail
            };
            let URL = this.getModuleUrl(this.op.detail);
            this.$axios(URL, data).then(res => {
                this.dataOptions = JSON.parse(res.data);
            });
        },
        addData(type) {
            let lastval = this.dataOptions.params.minFee[this.dataOptions.params.minFee.length - 1];
            let lastvalml = this.dataOptions.params.kmFee[this.dataOptions.params.kmFee.length - 1];
            let newMin = lastval.minStart;
            let newMax = lastval.minEnd;

            let newmlMin = lastvalml.kmStart;
            let newmlMax = lastvalml.kmEnd;

            if (type == 1 && Number(newMax) <= Number(newMin)) {
                this.$message.error('时长费的时长区间应递增填写！');
                return;
            } else if (type == 2 && Number(newmlMax) <= Number(newmlMin)) {
                this.$message.error('里程费的里程区间应递增填写！');
                return;
            } else if (type == 1 && !lastval.passengerCost) {
                this.$message.error(`时长费乘客计价（元）配置不能为空！`);
                return;
            } else if (type == 2 && !lastvalml.passengerCost) {
                this.$message.error(`里程费乘客计价（元）配置不能为空！`);
                return;
            } else {
                switch (type) {
                    case 1:
                        this.dataOptions.params.minFee.push({
                            minStart: Number(newMax) + 1,
                            minEnd: null,
                            dutiesTime: null
                        });
                        break;
                    case 2:
                        this.dataOptions.params.kmFee.push({
                            kmStart: Number(newmlMax) + 1,
                            kmEnd: null,
                            passengerCost: null
                        });
                        break;
                    default:
                        break;
                }
            }
        },
        delData(type, index) {
            switch (type) {
                case 1:
                    this.dataOptions.params.minFee.splice(index, 1);
                    break;
                case 2:
                    this.dataOptions.params.kmFee.splice(index, 1);
                    break;
                default:
                    break;
            }
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },

        checkBsNullValue() {
            let data = {
                initKm: '包含里程数',
                initMin: '包含时长',
                passengerCost: '乘客计价'
            };
            let res = true;
            let nameList = ['initKm', 'initMin', 'passengerCost'];
            let that = this;
            nameList.every(item => {
                if (!that.dataOptions.params.initFee[item]) {
                    that.$message.error(`基本信息${data[item]}不能为空`);
                    res = false;
                    return false;
                } else {
                    return true;
                }
            });
            return res;
        },

        save() {
            if (!this.dataOptions.rideType) {
                this.$message.error(`请选择服务类型！`);
                return false;
            }
            if (!this.checkBsNullValue()) {
                return false;
            }

            if (!this.dataOptions.params.minFee[this.dataOptions.params.minFee.length - 1].minEnd) {
                this.$message.error(`时长费结束时间配置不能为空！`);
                return false;
            }
            if (!this.dataOptions.params.minFee[this.dataOptions.params.minFee.length - 1].passengerCost) {
                this.$message.error(`时长费乘客计价（元）配置不能为空！`);
                return false;
            }
            if (!this.dataOptions.params.kmFee[this.dataOptions.params.kmFee.length - 1].kmEnd) {
                this.$message.error(`里程费结束里程配置不能为空！`);
                return false;
            }
            if (!this.dataOptions.params.kmFee[this.dataOptions.params.kmFee.length - 1].passengerCost) {
                this.$message.error(`里程费乘客计价（元）配置不能为空！`);
                return false;
            }
            let opType = '';
            let successInfo = '';
            if (this.routerQuery.type == 'add') {
                opType = this.op.save;
                successInfo = '新增成功';
            } else {
                opType = this.op.update;
                successInfo = '修改成功';
            }

            let data = {
                data: JSON.stringify({
                    ...this.dataOptions
                }),
                op: opType
            };
            let URL = this.getModuleUrl(data.op);

            this.$axios(URL, data).then(res => {
                this.backData = JSON.parse(res.data);
                this.$message.success(successInfo);
                this.$router.refresh({ path: '/workbench/BRintercityLine' });
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.el-card {
    max-width: 1000px;
    position: relative;
    /deep/ .el-card__body {
        padding-top: 0;
        padding-left: 0;
    }
    .delete {
        position: absolute;
        right: 20px;
    }
    .textarea {
        width: 678px !important;
    }
}
.baseInfo {
    display: flex;
    margin-bottom: 10px;
    .word {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 20px;
        h2 {
            margin-bottom: 10px;
            font-size: 20px;
        }
    }
}
/deep/ .el-range-separator {
    width: 6%;
}
/deep/ .border1 {
    width: 30%;
    border: 1px solid #ddd;
    margin: 5px;
}

.wid30 {
    width: 70%;
    border: 1px solid #ddd;
    margin: 5px;
}
.set_btn {
    text-align: center;
    padding: 30px 0 10px;
}

.form_box {
    border-radius: 8px;
    min-height: calc(100% - 64px) !important;
    margin-bottom: 56px;
    padding: 24px 24px 16px 24px; 
    background: #fff;
}
/deep/.el-collapse-item__header{
    height: auto;
    line-height: 22px;
    font-size: 16px !important;
    font-family: PingFangSC-Medium, PingFang SC !important;
    font-weight: bold !important;
    color: #303133;
    margin-bottom: 16px;
}
</style>
