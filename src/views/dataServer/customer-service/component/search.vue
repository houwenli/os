<template>
    <div>
        <el-form class="search-form" :model="dataOptions" ref="ruleForm" inline label-width="90px">
            <div>
                <el-form-item label="选择城市：" prop="cityList">
                    <ws-city class="city" collapse-tags v-model="dataOptions.cityList" level="2"
                        :defaultProps="{ checkStrictly: false, multiple: true }" showCountry @change="handleChangeCity($event)"></ws-city>
                </el-form-item>

                <el-form-item label="日期：" prop="time">
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
            </div>
            <el-form-item v-if="showBtn">
                <el-button type="primary" icon="el-icon-search" @click="submitForm('ruleForm')">查询</el-button>
                <el-button class="export-btn" icon="el-icon-download" type="primary" plain @click="exportFile('ruleForm')">导出</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { timeButtonGroupList } from "./search-options.js";
export default {
    props: {
        showBtn: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            refreshDate: null, // 最后刷新时间
            dataOptions: {
                cityList: [[0]],
                time: [],
            },
            pickerOptions: {
                disabledDate(time) {
                    let curDate = Date.now();
                    let three = 91 * 86400000;
                    let threeMonths = curDate - three;
                    let current =
                        new Date(new Date().toLocaleDateString()).getTime() -
                        (86400000 - 1000);
                    return time.getTime() > current || time.getTime() < threeMonths;
                },
            },
            timeGroup: {
                timeButtonGroup: "SEVEN",
                timeButtonGroupList,
            },
            moduleName: "/dataServer/customerService",
            cityData: []
        };
    },
    created() {
        this.getCurrentDate();
        this.initTime();
    },
    methods: {
        getCurrentDate() {
            this.refreshDate = this.$baseMethod.formatData(new Date());
        },
        // 初始化时间
        initTime() {
            const date = this.timeGroup.timeButtonGroupList[1].days
            this.dataOptions.time = [
                this.$baseMethod.getBeforeDay(date, "yyyy-MM-dd"),
                this.$baseMethod.getBeforeDay(-1, "yyyy-MM-dd"),
            ]
        },
        handleTimeGroupChange() {
            this.dataOptions.time = []
            if (this.timeGroup.timeButtonGroup !== "CUSTOM") {
                let days = this.timeGroup.timeButtonGroupList
                    .filter((item) => item.value == this.timeGroup.timeButtonGroup)[0].days
                this.dataOptions.time = [
                    this.$baseMethod.getBeforeDay(days, "yyyy-MM-dd"),
                    this.$baseMethod.getBeforeDay(-1, "yyyy-MM-dd")
                ];
                // this.submitForm()
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
                    this.$baseMethod.getBeforeDay(-1, "yyyy-MM-dd")
                ].toString();
                const time = this.dataOptions.time ? this.dataOptions.time.toString() : ""
                if (oldTime !== time) {
                    this.timeGroup.timeButtonGroup = "CUSTOM";
                }
            }
            // this.submitForm()
        },

        handleChangeCity(cityList) {
            this.$emit("handleCityChange", cityList)
        },
        submitForm(formName) {
            if (this.timeGroup.timeButtonGroup === "CUSTOM" && (!this.dataOptions.time || this.dataOptions.time.length == 0)) {
                this.$message.error('请选择时间！');
                return false;
            }
            if (!this.dataOptions.cityList || this.dataOptions.cityList.length === 0) {
                this.$message.error('请先选择城市')
                return false;
            }
            this.emitFormDate(this.getParams());
        },
        exportFile() {
            this.$emit('exportFile', this.getParams());
        },
        getParams() {
            let cities = _.cloneDeep(this.dataOptions.cityList);
            cities = cities.flat(Infinity);
            cities = Array.from(new Set(cities));
            let param = {
                cityList: cities,
                dateType: this.timeGroup.timeButtonGroup,
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
            }
            this.initTime()
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

<style lang="scss" scoped>
.search-form {
    background: #F5F7FA;
    border-radius: 8px;
    border: 1px solid #EBEEF5;
    display: flex;
    justify-content: space-between;
    padding: 20px 6px 0 14px;
    .ws-city {
        /deep/.el-cascader {
            width: 280px;
            .el-cascader__search-input {
                display: none;
            }
        }
    }
    /deep/.export-btn {
        background: #fff !important;
        color: #F05259 !important;
    }
}
.btn-box{
    width: 226px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: -20px;
}
</style>