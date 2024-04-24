<template>
    <div>
        <div class="charterPrice_form">
            <el-row :gutter="24" style="margin: 10px 0">
                <el-col :span="8">
                    <span  class="label"><span v-if="!disabled1" style="color: #f05259">*&nbsp;</span>服务类型：</span>
                    <el-select v-if="this.query_.type == 'newly'" v-model="detailObj.rideType" clearable placeholder="--请选择--" :disabled="disabled1" @change="changeService">
                        <el-option v-for="item in rideTypeFilters" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    <span style="margin-left: 10px" v-else>{{ detailObj.rideName }}</span>
                </el-col>
                <el-col :span="8">
                    <span class="label">企业名称：</span>
                    <el-select v-if="this.query_.type == 'newly'" v-model.trim="detailObj.channelIdList" clearable multiple placeholder="--请选择--" :disabled="disabled1" collapse-tags>
                        <el-option v-for="item in companyNameFilters" :key="item.channelId" :label="item.channelName" :value="item.channelId"></el-option>
                    </el-select>
                    <span style="margin-left: 10px" v-else>{{ detailObj.channelName }}</span>
                </el-col>
            </el-row>
            <el-row :gutter="24" style="margin: 20px 0">
                <el-col :span="8">
                    <span class="label">包干司机收入：</span>
                    <el-input
                        style="width: 200px;"
                        v-if="query_.type !== 'detail' && query_.type !== 'edit'"
                        v-model.trim="detailObj.feeParam.vipDriverRatio"
                        @blur="checkDataValue('number1-100', 'vipDriverRatio')"
                        placeholder="[1.00-100.00]"
                        :disabled="disabled3"
                        clearable
                    >
                        <template slot="append">%</template>
                    </el-input>
                    <span v-else>{{ detailObj.feeParam.vipDriverRatio + '%' }}</span>
                </el-col>
                <el-col :span="8">
                    <span class="label">本地司机收入：</span>
                    <el-input
                        style="width: 200px;"
                        v-if="query_.type !== 'detail' && query_.type !== 'edit'"
                        v-model.trim="detailObj.feeParam.localDriverRatio"
                        @blur="checkDataValue('number1-100', 'localDriverRatio')"
                        placeholder="[1.00-100.00]"
                        :disabled="disabled3"
                        clearable
                    >
                        <template slot="append">%</template>
                    </el-input>
                    <span v-else>{{ detailObj.feeParam.localDriverRatio + '%' }}</span>
                </el-col>
                <el-col :span="8">
                    <span class="label">非包干司机收入：</span>
                    <el-input
                        style="width: 200px; "
                        v-if="query_.type !== 'detail' && query_.type !== 'edit'"
                        v-model.trim="detailObj.feeParam.driverRatio"
                        @blur="checkDataValue('number1-100', 'driverRatio')"
                        placeholder="[1.00-100.00]"
                        :disabled="disabled3"
                        clearable
                    >
                        <template slot="append">%</template>
                    </el-input>
                    <span v-else>{{ detailObj.feeParam.driverRatio + '%' }}</span>
                </el-col>
            </el-row>
            <el-collapse v-model="activeNames">
                <p class="charging-type">里程计价</p>
                <el-collapse-item name="1" class="startingTable">
                    <template slot="title">
                        <span style="color: #f05259; width: 10px">*</span>
                        起步价配置(元)
                    </template>
                    <div class="table-btns">
                        <el-button type="primary" @click="addData()" v-if="!disabled1">新增配置</el-button>
                    </div>
                    <div class="table1">
                        <table class="table" border style="width: 100%; margin-top: 30px; border-color: #dbdbdb">
                            <thead>
                                <tr>
                                    <td>套餐名称</td>
                                    <td>包含里程(公里)</td>
                                    <td>包含时长(分钟)</td>
                                    <td>乘客计价(元)</td>
                                    <td>包干司机计价(元)</td>
                                    <td>本地司机计价(元)</td>
                                    <td>非包干司机计价(元)</td>
                                    <td v-if="!disabled1">操作</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(data, index) in initialFeeList" :key="index">
                                    <td>
                                        <el-select
                                            class="comboName"
                                            v-if="true"
                                            :disabled="disabled1"
                                            v-model="data.level"
                                            @change="charterChange(data.level, index)"
                                            clearable
                                            placeholder="--请选择--"
                                            size="mini"
                                        >
                                            <el-option v-for="item in configList" :key="item.level" :label="item.name" :value="item.level"></el-option>
                                        </el-select>
                                        <span v-else>{{ data.name }}</span>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            v-model="data.perKmFee"
                                            @blur="checkData('initialFeeList', index, 'perKmFee')"
                                            :class="{ input: true, noInput: disabled1 }"
                                            :disabled="disabled1"
                                            placeholder="整数或两位小数[0-1000]"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            v-model="data.perMinFee"
                                            :disabled="disabled1"
                                            @blur="checkData('initialFeeList', index, 'perMinFee')"
                                            :class="{ input: true, noInput: disabled1 }"
                                            placeholder="整数[0-1000]"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            v-model="data.passengerFee"
                                            @blur="checkData('initialFeeList', index, 'passengerFee')"
                                            :class="{ input: true, noInput: disabled1 }"
                                            :disabled="disabled1"
                                            placeholder="整数或两位小数[1-10000]"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            v-model="data.vipDriverFee"
                                            @blur="checkData('initialFeeList', index, 'vipDriverFee')"
                                            :class="{ input: true, noInput: true }"
                                            disabled
                                            placeholder="整数或两位小数[1-10000]"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            v-model="data.localDriverFee"
                                            @blur="checkData('initialFeeList', index, 'localDriverFee')"
                                            :class="{ input: true, noInput: true }"
                                            disabled
                                            placeholder="整数或两位小数[1-10000]"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            v-model="data.driverFee"
                                            @blur="checkData('initialFeeList', index, 'driverFee')"
                                            :class="{ input: true, noInput: true }"
                                            disabled
                                            placeholder="整数或两位小数[1-10000]"
                                        />
                                    </td>
                                    <td class="delBtn">
                                        <el-button size="small" type="text" v-if="!disabled1 && index" @click="delData(index)" style="color: #0088ff">删除</el-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="2">
                    <template slot="title">
                        <span style="color: #f05259; width: 10px">*</span>
                        超时长费(元/分)
                    </template>
                    <div class="table">
                        <table class="table" border style="width: 100%; border-color: #dbdbdb">
                            <thead>
                                <tr>
                                    <td>乘客计价(元)</td>
                                    <td>包干司机计价(元)</td>
                                    <td>本地司机计价(元)</td>
                                    <td>非包干司机计价(元)</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(data, index) in perMinFee" :key="index">
                                    <td>
                                        <input
                                            type="text"
                                            v-model="data.passengerFee"
                                            @blur="checkData('perMinFee', index, 'passengerFee')"
                                            :class="{ input: true, noInput: disabled1 }"
                                            :disabled="disabled1"
                                            placeholder="整数或两位小数[1-10000]"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            v-model="data.vipDriverFee"
                                            @blur="checkData('perMinFee', index, 'vipDriverFee')"
                                            :class="{ input: true, noInput: true }"
                                            disabled
                                            placeholder="整数或两位小数[1-10000]"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            v-model="data.localDriverFee"
                                            @blur="checkData('perMinFee', index, 'localDriverFee')"
                                            :class="{ input: true, noInput: true }"
                                            disabled
                                            placeholder="整数或两位小数[1-10000]"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            v-model="data.driverFee"
                                            @blur="checkData('perMinFee', index, 'driverFee')"
                                            :class="{ input: true, noInput: true }"
                                            disabled
                                            placeholder="整数或两位小数[1-10000]"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="3">
                    <template slot="title">
                        <span style="color: #f05259; width: 10px">*</span>
                        超里程费(元/公里)
                    </template>
                    <div class="table">
                        <table class="table" border style="width: 100%; border-color: #dbdbdb">
                            <thead>
                                <tr>
                                    <td>乘客计价(元)</td>
                                    <td>包干司机计价(元)</td>
                                    <td>本地司机计价(元)</td>
                                    <td>非包干司机计价(元)</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(data, index) in perKmFee" :key="index">
                                    <td>
                                        <input
                                            type="text"
                                            v-model="data.passengerFee"
                                            @blur="checkData('perKmFee', index, 'passengerFee')"
                                            :class="{ input: true, noInput: disabled1 }"
                                            :disabled="disabled1"
                                            placeholder="整数或两位小数[1-10000]"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            v-model="data.vipDriverFee"
                                            @blur="checkData('perKmFee', index, 'vipDriverFee')"
                                            :class="{ input: true, noInput: true }"
                                            disabled
                                            placeholder="整数或两位小数[1-10000]"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            v-model="data.localDriverFee"
                                            @blur="checkData('perKmFee', index, 'localDriverFee')"
                                            :class="{ input: true, noInput: true }"
                                            disabled
                                            placeholder="整数或两位小数[1-10000]"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            v-model="data.driverFee"
                                            @blur="checkData('perKmFee', index, 'driverFee')"
                                            :class="{ input: true, noInput: true }"
                                            disabled
                                            placeholder="整数或两位小数[1-10000]"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </el-collapse-item>
            </el-collapse>
            <div class="foot_btn">
                <el-button plain @click="back()">返 回</el-button>
                <el-button type="primary" @click="saveData" v-if="!disabled1">提 交</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            activeNames: ['1', '2', '3'],
            dataOptions: [],
            query_: {},
            disabled1: false, //详情与修改新增页面的禁用
            disabled2: false, //是否新增页面的禁用
            disabled3: false, //是否包干/非包干司机禁用状态
            initialFeeList: [
                {
                    passengerFee: null,
                    driverFee: null,
                    vipDriverFee: null,
                    localDriverFee: null,
                    channelFee: null,
                    level: null,
                    name: '',
                    startFee: null,
                },
            ], //起步价配置,默认有一组新数据
            perMinFee: [
                {
                    passengerFee: null,
                    driverFee: null,
                    vipDriverFee: null,
                    channelFee: null,
                    localDriverFee: null,
                },
            ], //超时长费
            perKmFee: [
                {
                    passengerFee: null,
                    driverFee: null,
                    vipDriverFee: null,
                    channelFee: null,
                    localDriverFee: null,
                },
            ], //超里程费
            detailObj: {
                channelIdList: [],
                channelType: '',
                rideName: '',
                rideType: '',
                companyName: '',
                rideTypeList: this.rideTypeList,
                chargingType: '',
                administrationType: '',
                sceneType: '',
                feeType: '',
                feeParam: {
                    vipDriverRatio: null,
                    localDriverRatio: null,
                    driverRatio: null
                },
                codeList: '',
                dataList: [],
            }, // 详情数据
            configList: [], //包车套餐数据
            systemCountLock: false, //计算配置控制按钮
            moduleName: '/workbench/BRcharterPrice',
            companyNameFilters: []
        };
    },
    computed: {
        ...mapGetters('enterprisemanagement', ['rideTypeFilters']),
        formContentTitle() {
            return {
                edit: '编辑',
                detail: '详情',
                newly: '新增',
                copy: '复制新增',
            }[this.query_.type];
        },
    },
    watch: {
        'detailObj.feeParam': {
            handler(val) {
                // 当输入值过大并且还未失焦时,防止自动计价,导致值过大
                let regex = this.$regexList.get('number1-100');

                for (const valKey in val) {
                    if (!regex.test(val[valKey])) return false;

                    if (this.detailObj.feeParam.driverRatio) {
                        //包干和非包干都有值情况下
                        // 起步价自动计算
                        if (this.initialFeeList) {
                            for (let item of this.initialFeeList) {
                                item.driverFee = (+item.passengerFee * (+this.detailObj.feeParam.driverRatio / 100)).toFixed(2);
                                item.vipDriverFee = (+item.passengerFee * (+this.detailObj.feeParam.vipDriverRatio / 100)).toFixed(2);
                                item.localDriverFee = (+item.passengerFee * (+this.detailObj.feeParam.localDriverRatio / 100)).toFixed(2);
                            }
                        }
                        // 超时长费自动计算
                        if (this.perMinFee) {
                            // 包车单只有一组数据
                            this.perMinFee[0].driverFee = (+this.perMinFee[0].passengerFee * (+this.detailObj.feeParam.driverRatio / 100)).toFixed(2);
                            this.perMinFee[0].vipDriverFee = (+this.perMinFee[0].passengerFee * (+this.detailObj.feeParam.vipDriverRatio / 100)).toFixed(2);
                            this.perMinFee[0].localDriverFee = (+this.perMinFee[0].passengerFee * (+this.detailObj.feeParam.localDriverRatio / 100)).toFixed(2);
                        }
                        // // 超里程费自动计算
                        if (this.perKmFee) {
                            //同上
                            this.perKmFee[0].driverFee = (+this.perKmFee[0].passengerFee * (+this.detailObj.feeParam.driverRatio / 100)).toFixed(2);
                            this.perKmFee[0].vipDriverFee = (+this.perKmFee[0].passengerFee * (+this.detailObj.feeParam.vipDriverRatio / 100)).toFixed(2);
                            this.perKmFee[0].localDriverFee = (+this.perKmFee[0].passengerFee * (+this.detailObj.feeParam.localDriverRatio / 100)).toFixed(2);
                        }
                    }
                }
            },
            deep: true,
        },
    },
    created() {
        this.query_ = this.$route.query;
        if (this.query_.type !== 'newly') {
            this.getData();
        }
        this.getSelectConfig(); // 调用包车套餐下拉选项
        this.getCompanyNameFilters(); // 调用企业名称下拉选项
        this.disabled1 = this.query_.type == 'detail'; // 根据是否详情判断是否禁用
        this.disabled2 = this.query_.type == 'newly'; // 根据是否新增页面判断是否禁用
    },
    methods: {
        // 包车计价新增页面的企业名称下拉选项请求
        async getCompanyNameFilters() {
            try {
                let res = await this._axios({op: 'enterPriseList'}, this.moduleName)
                res.code == 1 && (this.companyNameFilters = res.data)
            } catch (_err) {
                throw _err
            }
        },

        // 获取详情
        getData() {
            let params = {
                data: {
                    id: this.query_.id,
                },
                op: 'selectDetils',
            };
            this.$axios(this.getModuleUrl(params.op), params)
                .then(res => {
                    let parms = JSON.parse(res.data);
                    // 赋值私有化
                    this.detailObj = parms;
                    //循环遍历拿出对应包车类型的数据--暂时不遍历,因为新增时dateType固定值
                    // let dataList = parms.dataList.filter((data) => {
                    //     return data.dateType == parms.rideType
                    // })
                    let dataList = parms.dataList;
                    this.initialFeeList = dataList[0].params.initialFeeList; //数组类型
                    // 注意每次清空
                    this.perMinFee = [];
                    this.perKmFee = [];
                    this.perMinFee.push(dataList[0].params.perMinFee); //数组类型
                    this.perKmFee.push(dataList[0].params.perKmFee); //数组类型
                    this.formatData(this.initialFeeList, 0);

                    this.formatData(this.perMinFee, 0);
                    this.formatData(this.perKmFee, 0);
                })
                .catch(err => {
                    err.msg === '查询不到详情' && this.$router.push({ name: 'chartervaluation' });
                });
        },
        // 对详情数据进行转换
        // 格式化数据:type 1=正向格式 元=>分,公里=>米;0=反向转化
        formatData(sendData, type = 1) {
            let regMoney = type == 1 ? 'regYuanToFen' : 'regFenToYuan';
            let regRange = type == 1 ? 'regKmToRice' : 'regRiceToKm';
            let regTime = type == 1 ? 'regMinuteToSecond' : 'regSecondToMinute';
            // 格式化数据
            for (let data of sendData) {
                data.passengerFee = +this.$baseMethod[regMoney](data.passengerFee);
                data.driverFee = +this.$baseMethod[regMoney](data.driverFee);
                data.vipDriverFee = +this.$baseMethod[regMoney](data.vipDriverFee);
                data.localDriverFee = +this.$baseMethod[regMoney](data.localDriverFee);
                data.channelFee = +this.$baseMethod[regMoney](data.channelFee);
                data.perKmFee = +this.$baseMethod[regRange](data.perKmFee);
                data.perMinFee = +this.$baseMethod[regTime](data.perMinFee);
                // data.transportDriverFee = +this.$baseMethod[regMoney](data.transportDriverFee)
            }
        },
        // 添加数据
        addData() {
            // 条数限制
            if (this.initialFeeList.length >= 10) {
                return this.$message.error('最多添加10条数据');
            }
            // 为空判断
            let dataList = this.initialFeeList[this.initialFeeList.length - 1];
            if (dataList) {
                for (let data of Object.entries(dataList)) {
                    if (data[1] == '' && data[1] !== 0) {
                        return this.$message.error('当前项预付比例配置不能为空！');
                    }
                }
            }
            this.initialFeeList.push({
                level: '',
                passengerFee: '',
                driverFee: '',
                vipDriverFee: '',
                perKmFee: '',
                perMinFee: '',
                localDriverFee: '',
            });
        },
        // 删除数据
        delData(index) {
            this.initialFeeList.splice(index, 1);
        },
        //查询包车套餐配置字典
        getSelectConfig() {
            let opt = {
                data: JSON.stringify({}),
                op: 'getCharteredConfig',
            };
            this.$axios('/charteredbusorder/charging/enterprise/select', opt).then(res => {
                if (res.code == 1) {
                    this.configList = JSON.parse(res.data);
                    for (let item of this.configList) {
                        item.perMinFee = this.$baseMethod['regSecondToMinute'](item.perMinFee);
                        item.perKmFee = this.$baseMethod['regRiceToKm'](item.perKmFee);
                    }
                }
            });
        },
        // 包车套餐名称改变
        charterChange(val, index) {
            let charterData = this.configList.filter(item => item.level == val);
            this.initialFeeList[index].perKmFee = charterData[0] && charterData[0].perKmFee;
            this.initialFeeList[index].perMinFee = charterData[0] && charterData[0].perMinFee;
            this.initialFeeList[index].name = charterData[0] && charterData[0].name;
        },
        // 失焦规则效验
        checkData(type = perKmFee, index, key) {
            let regex = /^((\+?)([0-9]\d{0,3})((\.)([0-9]){1,2})?|10000)$/; //0-10000 整数两位小数
            if (key == 'perMinFee') {
                regex = /^(1000|\d{1,3})$/; //0-1000 整数
            }
            if (key == 'perKmFee') {
                regex = /^(([0-9]\d{0,2})(\.\d{1,2})?|1000)$/; //1-1000 整数一位小数
            }
            let data = null;
            if (type == 'initialFeeList') {
                //起步价配置
                data = this.initialFeeList[index];
                data[key] = +data[key];
                if (!regex.test(data[key])) {
                    data[key] = '';
                    this.initialFeeList.splice(index, 1, data);
                    return;
                }
                // 计算配置效验
                if (key == 'passengerFee') {
                    if (!this.detailObj.feeParam.driverRatio || !this.detailObj.feeParam.vipDriverRatio || !this.detailObj.feeParam.localDriverRatio) {
                        this.$message.error('系统计算模式下，请输入配置比例');
                        data[key] = '';
                        return this.initialFeeList.splice(index, 1, data);
                    }
                }
                //系统计算配置
                if (key == 'passengerFee' && this.detailObj.feeParam.vipDriverRatio && this.detailObj.feeParam.localDriverRatio && this.detailObj.feeParam.driverRatio) {
                    data.driverFee = (+data.passengerFee * (+this.detailObj.feeParam.driverRatio / 100)).toFixed(2);
                    data.vipDriverFee = (+data.passengerFee * (+this.detailObj.feeParam.vipDriverRatio / 100)).toFixed(2);
                    data.localDriverFee = (+data.passengerFee * (+this.detailObj.feeParam.localDriverRatio / 100)).toFixed(2)
                }
            } else if (type == 'perMinFee') {
                // 超时长费
                data = this.perMinFee[index];
                data[key] = +data[key];
                if (!regex.test(data[key])) {
                    data[key] = '';
                    this.perMinFee.splice(index, 1, data);
                    return;
                }
                // 计算配置效验
                if (key == 'passengerFee') {
                    if (!this.detailObj.feeParam.driverRatio || !this.detailObj.feeParam.vipDriverRatio || !this.detailObj.feeParam.localDriverRatio) {
                        this.$message.error('系统计算模式下，请输入配置比例');
                        data[key] = '';
                        return this.perMinFee.splice(index, 1, data);
                    }
                }
                //系统计算配置
                if (key == 'passengerFee' && this.detailObj.feeParam.vipDriverRatio && this.detailObj.feeParam.driverRatio && this.detailObj.feeParam.localDriverRatio) {
                    data.driverFee = (+data.passengerFee * (+this.detailObj.feeParam.driverRatio / 100)).toFixed(2);
                    data.vipDriverFee = (+data.passengerFee * (+this.detailObj.feeParam.vipDriverRatio / 100)).toFixed(2);
                    data.localDriverFee = (+data.passengerFee * (+this.detailObj.feeParam.localDriverRatio / 100)).toFixed(2)
                }
            } else {
                // 超时长费
                data = this.perKmFee[index];
                data[key] = +data[key];
                if (!regex.test(data[key])) {
                    data[key] = '';
                    this.perKmFee.splice(index, 1, data);
                    return;
                }
                // 计算配置效验
                if (key == 'passengerFee') {
                    if (!this.detailObj.feeParam.driverRatio || !this.detailObj.feeParam.vipDriverRatio || !this.detailObj.feeParam.localDriverRatio) {
                        this.$message.error('系统计算模式下，请输入配置比例');
                        data[key] = '';
                        return this.perKmFee.splice(index, 1, data);
                    }
                }
                //系统计算配置
                if (key == 'passengerFee' && this.detailObj.feeParam.vipDriverRatio && this.detailObj.feeParam.localDriverRatio && this.detailObj.feeParam.driverRatio) {
                    data.driverFee = (+data.passengerFee * (+this.detailObj.feeParam.driverRatio / 100)).toFixed(2);
                    data.vipDriverFee = (+data.passengerFee * (+this.detailObj.feeParam.vipDriverRatio / 100)).toFixed(2);
                    data.localDriverFee = (+data.passengerFee * (+this.detailObj.feeParam.localDriverRatio / 100)).toFixed(2)
                }
            }
        },
        // 基本信息输入框规则效验
        checkDataValue(reg, key) {
            let regex = this.$regexList.get(reg);
            if (key == 'channelRatio') {
                regex = /^(1000|[1-9][0-9][0-9])((\.)([0-9]){1,2})?$/;
            }
            let data = this.detailObj.feeParam;
            if (!regex.test(data[key])) {
                data[key] = '';
            }
            return;
        },
        // 修改服务类型获取收入比例
        changeService(val) {
            let opt = {
                data: JSON.stringify({ rideType: val }),
                op: 'getDriverRatio',
            };
            this.$axios(this.getModuleUrl(opt.op), opt).then(res => {
                if (res.code == 1) {
                    let dataObj = JSON.parse(res.data);
                    this.detailObj.feeParam.driverRatio = dataObj.driverRatio;
                    this.detailObj.feeParam.vipDriverRatio = dataObj.vipDriverRatio;
                    this.detailObj.feeParam.localDriverRatio = dataObj.localDriverRatio;
                }
                if (this.detailObj.feeParam.driverRatio && this.detailObj.feeParam.vipDriverRatio && this.detailObj.feeParam.localDriverRatio) {
                    this.disabled3 = true;
                    this.systemCountLock = true;
                } else {
                    this.disabled3 = false;
                    this.systemCountLock = false;
                }
            });
        },
        // 返回上一页
        back() {
            this.$router.push({ name: 'BRcharterPrice' });
        },
        // 新增或修改 保存
        saveData() {
            // 获取并转换数据
            let initialFeeList = this.$baseMethod.deepClone(this.initialFeeList);
            let perMinFee = this.$baseMethod.deepClone(this.perMinFee);
            let perKmFee = this.$baseMethod.deepClone(this.perKmFee);
            this.formatData(initialFeeList, 1);
            this.formatData(perMinFee, 1);
            this.formatData(perKmFee, 1);
            // 拼接成请求参数
            this.detailObj.dataList &&
                this.detailObj.dataList.some((data, index) => {
                    if (index == 0) {
                        data.params.initialFeeList = initialFeeList;
                        data.params.perMinFee = perMinFee[0];
                        data.params.perKmFee = perKmFee[0];
                        return true;
                    }
                });
            // 基础信息部分-赋值运力商/司机收入
            // this.detailObj.feeParam.transportDriverRatio = this.transportDriverRatio   暂不用到
            // 新增接口数据处理
            if (this.query_.type == 'newly') {
                let params1 = {};
                params1.initialFeeList = initialFeeList;
                params1.perMinFee = perMinFee[0];
                params1.perKmFee = perKmFee[0];
                this.detailObj.dataList = []; //注意先清空一遍
                this.detailObj.dataList.push({ dateType: 10, switchStatus: 1, params: params1 });
            }
            let data = this.$baseMethod.deepClone(this.detailObj);
            if (this.query_.type == 'edit') {
                data.id = this.query_.id;
            }
            // 请求前数据规则效验
            if (!this.checkSaveData(data)) {
                return false;
            }
            //请求
            if (this.query_.type == 'edit') {
                var opt = {
                    data: JSON.stringify(data),
                    op: 'update',
                };
            } else {
                var opt = {
                    data: JSON.stringify(data),
                    op: 'save',
                };
            }
            var url = this.getModuleUrl(opt.op);
            this.$axios(url, opt)
                .then(res => {
                    this.$message.success('操作成功');
                    this.$router.refresh({ name: 'BRcharterPrice' });
                })
                .catch(err => {
                    // this.$message.error('操作失败!')
                    if (this.query_.type !== 'newly') {
                        this.getData();
                    }
                });
        },
        // 规则效验
        checkSaveData(data) {
            if (!data.rideType) {
                this.$message.error('请先选择服务类型!');
                return false;
            }
            if (!data.feeParam.vipDriverRatio || !data.feeParam.driverRatio || !data.feeParam.localDriverRatio) {
                this.$message.error('请先完善系统计算配置');
                return false;
            }
            return true;
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
};
</script>

<style lang="scss" scoped>
.el-col .label{
    display: inline-block;
    width: 120px;
    text-align: right
}
.charterPrice_form {
    background: #fff !important;
    padding: 20px !important;
    border-radius: 8px;
    margin-bottom: 56px;
}
.charging-type {
    font-size: 20px;
    margin: 20px 0;
    // margin-left: 28px;
}
/deep/ .el-input.is-disabled .el-input__inner {
    background-color: #f5f7fa !important;
    border-color: #e4e7ed !important;
    color: #303133 !important;
    cursor: not-allowed !important;
}
.basicTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #cccccc;
    font-size: 16px;
    width: 100%;
}

.cardInfo1 {
    display: flex;
    background-color: #f0f2f5;
    .inline-block {
        flex: 33.3%;
        margin: 10px;
        // .label {
        // margin-left: 50px !important;
        // }
    }
}
.cardInfo2 {
    display: flex;
    background-color: #f0f2f5;
    .inline-block {
        flex: 33.3%;
        margin: 10px;
    }
}
.startingTable {
    position: relative;
    .table-btns {
        position: absolute;
        top: 10px;
        right: 80px;
    }
}
thead {
    td {
        text-align: center;
        padding: 10px;
        background-color: #f0f2f5;
    }
}
.comboName {
    width: 100% !important;
    // /deep/ .el-input__inner,
    // .el-textarea__inner {
    //     border: none !important;
    //     // text-align: center;
    // }
    /deep/ .el-select .el-input.is-focus .el-input__inner .el-textarea__inner {
        border: none !important;
        text-align: center;
    }
    /deep/.el-input__suffix{
        right: 20px !important;
    }
}
.delBtn {
    text-align: center;
}
.input {
    width: 100%;
    height: 40px;
    display: block;
    text-align: center;
    padding: 0 15px;
    // color: #606266;
}
.noInput {
    width: 100%;
    height: 40px;
    display: block;
    text-align: center;
    padding: 0 15px;
    color: #606266;
    background-color: #f0f2f5;
}
/deep/ .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    color: #606266;
}
/deep/ .el-collapse-item__content {
    padding-bottom: 25px;
    font-size: 14px !important;
    color: #303133;
    line-height: 1.769230769230769;
}

.input::-webkit-input-placeholder {
    color: #c7c8ca;
}
.charging-btns {
    text-align: center;
    margin-top: 30px;
    .el-button {
        width: 160px;
    }
}
 /deep/ .el-input--mini {
    padding: 10px 16px;
}
</style>
