<template>
    <div>
        <div class="search_box" style="padding-top: 20px">
            <el-form :model="dataOptions" ref="ruleForm" inline label-width="100px">
                <el-form-item label="当前城市" prop="city">
                    <ws-city class="city" v-model="dataOptions.city" :data="cityData"
                        :defaultProps="{ checkStrictly: true }" @change="handleChangeCity"></ws-city>
                </el-form-item>

                <el-form-item label="日期" prop="time">
                    <el-radio-group v-model="timeGroup.timeButtonGroup" style="margin-right: 10px"
                        @change="handleTimeGroupChange">
                        <el-radio-button v-for="(item, index) in timeGroup.timeButtonGroupList" :key="index"
                            :label="item.value">
                            {{ item.label }}
                            <el-tooltip :content="item.tips" placement="top-start" class="info-tooltip">
                                <i class="el-icon-question"
                                    :style="{color: item.value == timeGroup.timeButtonGroup ? '#fff' : '#333'}"></i>
                            </el-tooltip>
                        </el-radio-button>
                    </el-radio-group>
                    <el-date-picker v-model="dataOptions.time" type="daterange" :picker-options="pickerOptions"
                        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"
                        @change="handleTimeChange">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="订单类型" prop="orderType">
                    <el-select v-model="dataOptions.orderType" placeholder="请选择" @change="handleOrderType">
                        <el-option v-for="item in orderType" :label="item.label" :value="item.value" :key="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item v-if="showRefreshData" label="最后更新时间">
                    <span>{{ refreshDate }}</span>
                </el-form-item>

                <el-form-item v-if="showBtn">
                    <el-button type="primary" @click="submitForm('ruleForm')">刷新</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { timeButtonGroupList, orderType } from "../baseData";
export default {
    props: {
        showRefreshData: {
            type: Boolean,
            default: false,
        },
        showBtn: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            refreshDate: null, // 最后刷新时间
            dataOptions: {
                city: [],
                orderType: "ALL",
                time: [],
            },
            pickerOptions: {
                disabledDate(time) {
                    let curDate = Date.now();
                    let three = 90 * 86400000;
                    let threeMonths = curDate - three;
                    let current =
                        new Date(new Date().toLocaleDateString()).getTime() +
                        (86400000 - 1000);
                    return time.getTime() > current || time.getTime() < threeMonths;
                },
            },
            timeGroup: {
                timeButtonGroup: "TODAY",
                timeButtonGroupList,
            },
            orderType,
            moduleName: "/dataServer/dispatchDataAnalysis",
            cityData: []
        };
    },
    created() {
        this.getCurrentDate();
        this.initTime(0);
    },
    mounted() {
        this.cityData = new Array(1)
        // console.log('mounted');
        if (this.$parent.$attrs.cityList.length) {
            const ret = this.$parent.$attrs.cityList
            this.cityData = [...ret];
            this.dataOptions.city = this.$parent.$attrs.firstCity
            this.submitForm()
        }
    },

    watch: {
        '$parent.$attrs.cityList'() {
            // console.log('watch');
            if (this.$parent.$attrs.cityList.length) {
                const ret = this.$parent.$attrs.cityList
                this.cityData = [...ret];
                this.dataOptions.city = this.$parent.$attrs.firstCity
                this.submitForm()
            }
        }
    },
    methods: {
        getUserCityList() {
            const op = 'selectPossessCityTree'
            let data = {
                data: {
                    systemCode: "OASYSTEM"
                },
                op,
            };
            let URL = this.$getModuleUrl(this.moduleName, op);
            this.$axios(URL, data).then((res) => {
                if (res.code == 1) {
                    const ret = JSON.parse(res.data);
                    this.cityData = [...ret];
                    if (ret.length) {
                        let city = ret[0]
                        this.dataOptions.city = [city.code, city.children[0].code]
                        this.submitForm()
                    }
                }
            });
        },
        getCurrentDate() {
            this.refreshDate = this.$baseMethod.formatData(new Date());
        },
        // 初始化时间
        initTime(type) {
            // 0 今日 1 昨日 2 近7天 2 近一个月 4 近3个月
            const date = this.timeGroup.timeButtonGroupList[type].days
            console.log(date);
            this.dataOptions.time = [
                this.$baseMethod.getBeforeDay(0, "yyyy-MM-dd"),
                this.$baseMethod.getBeforeDay(date, "yyyy-MM-dd"),
            ]
        },
        handleTimeGroupChange() {
            this.dataOptions.time = []
            if (this.timeGroup.timeButtonGroup !== "CUSTOM") {
                let days = this.timeGroup.timeButtonGroupList
                    .filter((item) => item.value == this.timeGroup.timeButtonGroup)[0].days
                this.dataOptions.time = [
                    this.$baseMethod.getBeforeDay(days, "yyyy-MM-dd"),
                    this.$baseMethod.getBeforeDay(0, "yyyy-MM-dd")
                ];
                this.submitForm()
                this.$forceUpdate()
            }
        },

        // 时间选择器改变
        handleTimeChange() {
            // 判断之前选中的快捷选项的时间 是否等于当前变更的时间,
            // 如果不一样则清空快捷选项的选中状态
            if (this.timeGroup.timeButtonGroup !== "CUSTOM") {
                let days = this.timeGroup.timeButtonGroupList
                    .filter((item) => item.value == this.timeGroup.timeButtonGroup)[0].days
                let oldTime = [
                    this.$baseMethod.getBeforeDay(days, "yyyy-MM-dd"),
                    this.$baseMethod.getBeforeDay(0, "yyyy-MM-dd")
                ].toString();
                const time = this.dataOptions.time ? this.dataOptions.time.toString() : ""
                if (oldTime !== time) {
                    this.timeGroup.timeButtonGroup = "CUSTOM";
                }
            }
            this.submitForm()
        },

        handleChangeCity(cityList) {
            this.$emit("handleCityChange", cityList)
            this.submitForm()
        },
        handleOrderType() {
            this.submitForm()
        },
        submitForm(formName) {
            if (this.timeGroup.timeButtonGroup === "CUSTOM" && (!this.dataOptions.time || this.dataOptions.time.length == 0)) {
                this.$message.error('请选择时间！');
                return false;
            }
            if (!this.dataOptions.city || this.dataOptions.city.length === 0) {
                this.$message.error('请先选择城市')
                return false;
            }
            this.emitFormDate(this.getParams());
        },
        getParams() {
            let param = {
                ...this.getLocalType(this.dataOptions.city),
                dateType: this.timeGroup.timeButtonGroup,
                orderType: this.dataOptions.orderType,
            };
            if (this.dataOptions.time.length) {
                let [startDate, endDate] = this.dataOptions.time;
                param.startDate = startDate.substring(0, 10);
                param.endDate = endDate.substring(0, 10);
            }
            return param
        },

        // 根据城市编码识别出城市type, 获取最后一个选择的城市
        getLocalType(code) {
            let localGroup = {
                localType: "",
                localCode: ""
            }
            // if (!code.length) {
            //   return localGroup
            // }
            const len = code.length;
            localGroup.localCode = code[len - 1];
            switch (len) {
                case 1:
                    localGroup.localType = code[0] === 0 ? "QG" : "SHENG";
                    localGroup.localCode = code[0] === 0 ? 2 : localGroup.localCode;
                    break;
                case 2:
                    localGroup.localType = "SHI";
                    break;
                case 3:
                    localGroup.localType = "XIAN";
                    break;
                default:
                    localGroup.localType = "QG";
                    localGroup.localCode = 2
                    break;
            }
            return localGroup
        },

        resetForm(formName) {
            this.timeGroup.timeButtonGroup = "TODAY";
            this.dataOptions = {
                city: [],
                orderType: "ALL"
            }
            this.initTime(0)
            // this.$refs[formName].resetFields();
            this.emitFormDate(this.getParams());
        },

        // 向上传递数据
        emitFormDate(params = {}) {
            this.$emit("handleClickRefresh", params);
            this.getCurrentDate();
        },
    },
};
</script>

<style>

</style>