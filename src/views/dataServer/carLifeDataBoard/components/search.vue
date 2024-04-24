<template>
    <div class="content-data-box">
        <div class="search_box" style="margin: 0 !important;">
            <el-form :model="dataOptions" ref="ruleForm" inline label-width="80px">
                <el-form-item label="选择渠道" prop="city">
                    <el-select v-model="dataOptions.orderType" clearable filterable placeholder="请选择">
                        <el-option
                            v-for="item in orderTypeListFilters"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="城市" prop="localCode"
                              v-if="dataOptions.orderType=='CHARGE'||dataOptions.orderType=='OIL'">
                    <ws-city
                        v-model="dataOptions.localCode"
                        :defaultProps="{ checkStrictly: false, emitPath: false }"
                        level="2"
                        :multiple="true"
                        :showCountry="true"
                    ></ws-city>
                </el-form-item>
                <el-form-item label="选择日期" prop="time">
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
                                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd"
                                    @change="handleTimeChange">
                    </el-date-picker>
                </el-form-item>
                <el-form-item v-if="showBtn">
                    <el-button type="primary" icon="el-icon-search" @click="submitForm('ruleForm')">查询</el-button>
                    <!--                    <el-button @click="resetForm('ruleForm')">重置</el-button>-->
                </el-form-item>
                <el-form-item v-if="powerList.export">
                    <el-button class="export-btn" icon="el-icon-download" type="primary" @click="fileExport" plain>
                        导出
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import {timeButtonGroupList} from "../baseData";
import organization from '../components/organization-options';

export default {
    components: {organization},
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
                orderType: 'ALL',
                localCode: [0],
                startDate: '',
                endDate: '',
                time: [],
            },
            minDate: '',
            maxDate: '',
            pickerOptions: {
                onPick: ({maxDate, minDate}) => {
                    this.minDate = minDate
                    this.maxDate = maxDate
                },
                // disabledDate: (time) => { // 查询时间跨度为90天---为止今天
                //     if (this.minDate) {
                //         let range = 90 * 24 * 3600 * 1000
                //         return time.getTime() > Date.now() || time.getTime() > (this.minDate.getTime() + range) || time.getTime() < (this.minDate.getTime() - range)
                //     }
                //     return time.getTime() > Date.now()
                // },
                disabledDate(time) { // 查询时间跨度为90天---为止昨天
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
            moduleName: "/dataServer/carLifeDataBoard",
            op: {
                getChannelDict: 'getChannelDict',
                fileExport: 'export'
            },
            orderTypeListFilters: [{
                value: 'ALL',
                label: '全部'
            }, {
                value: 'CHARGE',
                label: '充电'
            }, {
                value: 'OIL',
                label: '加油'
            }, {
                value: 'WASH',
                label: '洗车'
            }, {
                value: 'ILLEGAL',
                label: '违章代缴'
            }, {
                value: 'LEGWORK',
                label: '跑腿订单'
            }],
            cityData: [],
            timer: ''
        };
    },
    created() {
        this.getCurrentDate();
        this.initTime(1);
    },
    mounted() {
        this.submitForm()
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
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op)
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
                    this.$baseMethod.getBeforeDay(0, "yyyy-MM-dd")
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
            this.submitForm()
        },
        submitForm(formName) {
            if (!this.dataOptions.orderType) {
                this.$message.error('请先选择渠道')
                return false;
            }
            if (this.dataOptions.orderType == 'CHARGE' || this.dataOptions.orderType == 'OIL') {
                if (!this.dataOptions.localCode || this.dataOptions.localCode.length === 0) {
                    this.$message.error('请先选择城市')
                    return false;
                }
            }
            if (this.timeGroup.timeButtonGroup === "CUSTOM" && (!this.dataOptions.time || this.dataOptions.time.length == 0)) {
                this.$message.error('请选择时间！');
                return false;
            }
            this.emitFormDate(this.getParams());
        },
        getParams() {
            let param = {}
            if (this.dataOptions.orderType == 'CHARGE' || this.dataOptions.orderType == 'OIL') {
                param = {
                    orderTypeList: [this.dataOptions.orderType],
                    localList: [{
                        localCode: this.dataOptions.localCode
                    }],
                };
            }else{
                param = {
                    orderTypeList: [this.dataOptions.orderType],
                    localList: [{
                        localCode: [0]
                    }],
                };
            }
            if (this.dataOptions.time.length) {
                let [startDate, endDate] = this.dataOptions.time;
                param.startDate = startDate.substring(0, 10);
                param.endDate = endDate.substring(0, 10);
            }
            return param
        },

        resetForm(formName) {
            this.timeGroup.timeButtonGroup = "TODAY";
            this.dataOptions.channelId = null;
            this.orgType = this.$baseMethod.getStore('roleOption') && this.$baseMethod.getStore('roleOption').orgType || 0
            this.timer = new Date().getTime()
            this.initTime(0)
            // this.$refs[formName].resetFields();
            this.emitFormDate(this.getParams());
        },

        // 向上传递数据
        emitFormDate(params = {}) {
            this.$emit("handleClickRefresh", params);
            this.getCurrentDate();
        },
        handleSelect(data) {
            this.emitFormDate(this.getParams());
        },
        //文件导出
        fileExport() {
            let params = this.getParams()
            let data = {
                data: params,
                op: this.op.fileExport
            }
            this.$axios(this.powerList[data.op], data).then((res) => {
                this.$message.success('导出中，请稍后到文件中心下载！')
            })
        }
    },
};
</script>

<style lang="scss" scoped>
section div.content-data-box {
    height: auto;
    padding: 20px 40px;
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 16px;
}

/deep/ .export-btn {
    background: #fff !important;
    color: #F05259 !important;
}
</style>
