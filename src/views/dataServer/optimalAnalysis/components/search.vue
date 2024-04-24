<template>
    <div>
        <div class="search_box" style="padding-top: 20px">
            <el-form :model="dataOptions" ref="ruleForm" inline label-width="100px">
                <el-form-item label="机构名称：" prop="agencyNumber" v-if="orgType!=40">
                    <organization
                        v-model="dataOptions.channelId"
                        :showSelect="true"
                        :selectOptions="selectOptions"
                        ref="orgSelect"
                        :orgType="orgType==0?'20':orgType"
                        placeholder="请输入机构名称搜索"
                        valueKey="agencyNumber"
                        @select="handleSelect"
                        :key="timer"></organization>
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
                                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd"
                                    @change="handleTimeChange">
                    </el-date-picker>
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
import {timeButtonGroupList} from "../baseData";
import organization from '../components/organization-options';

export default {
    components: {organization},
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
            orgType: 0,
            refreshDate: null, // 最后刷新时间
            dataOptions: {
                channelId: null,
                time: [],
            },
            minDate: '',
            maxDate: '',
            pickerOptions: {
                // disabledDate(time) {
                //     let curDate = Date.now();
                //     let three = 90 * 86400000;
                //     let threeMonths = curDate - three;
                //     let current =
                //         new Date(new Date().toLocaleDateString()).getTime() +
                //         (86400000 - 1000);
                //     return time.getTime() > current || time.getTime() < threeMonths;
                // },
                onPick: ({maxDate, minDate}) => {
                    this.minDate = minDate
                    this.maxDate = maxDate
                },
                disabledDate: (time) => { // 查询时间跨度为90天
                    if (this.minDate) {
                        let range = 90 * 24 * 3600 * 1000
                        return time.getTime() > Date.now() || time.getTime() > (this.minDate.getTime() + range) || time.getTime() < (this.minDate.getTime() - range)
                    }
                    return time.getTime() > Date.now()
                }
            },
            timeGroup: {
                timeButtonGroup: "TODAY",
                timeButtonGroupList,
            },
            moduleName: "/dataServer/dispatchDataAnalysis",
            timer: ''
        };
    },
    created() {
        this.orgType = this.$baseMethod.getStore('roleOption') && this.$baseMethod.getStore('roleOption').orgType || 0
        this.getCurrentDate();
        this.initTime(0);
    },
    computed: {
        selectOptions() {
            let arr = [
                {value: '20', label: '城市分公司'},
                {value: '30', label: '区县分公司'},
                {value: '40', label: '实体店'}
            ]
            if (this.orgType === 20) {
                arr = [
                    {value: '30', label: '区县分公司'},
                    {value: '40', label: '实体店'}
                ]
            }
            if (this.orgType === 30) {
                arr = [
                    {value: '40', label: '实体店'}
                ]
            }
            return arr
        },
    },
    mounted() {
        if (this.orgType == 40) {
            this.submitForm()
        }
    },

    watch: {},
    methods: {
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
        submitForm(formName) {
            if (this.orgType != 40 && !this.dataOptions.channelId) {
                this.$message.error('请选择机构名称！');
                return false;
            }
            if (this.timeGroup.timeButtonGroup === "CUSTOM" && (!this.dataOptions.time || this.dataOptions.time.length == 0)) {
                this.$message.error('请选择时间！');
                return false;
            }
            this.emitFormDate(this.getParams());
        },
        getParams() {
            let param = {
                channelId: this.dataOptions.channelId,
                // dateType: this.timeGroup.timeButtonGroup,
            };
            if (this.dataOptions.time.length) {
                let [timeStart, timeEnd] = this.dataOptions.time;
                param.timeStart = timeStart.substring(0, 10);
                param.timeEnd = timeEnd.substring(0, 10);
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
    },
};
</script>

<style>

</style>
